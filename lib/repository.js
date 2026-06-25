import { getDatabaseStatus, hasDbConfig, query, withConnection } from "@/lib/db";
import { getStore } from "@/lib/sample-data";

function toNumber(value) {
  return Number(value || 0);
}

function toIso(value) {
  if (!value) return new Date().toISOString();
  if (value instanceof Date) return value.toISOString();
  return value;
}

function normalizeMenuItem(item) {
  return {
    id: Number(item.id),
    name: item.name,
    category: item.category,
    price: toNumber(item.price),
    thumbnail: item.thumbnail,
    description: item.description || "",
    isActive: Boolean(item.isActive ?? item.is_active),
    createdAt: toIso(item.createdAt ?? item.created_at)
  };
}

function normalizeOrder(row, items = []) {
  return {
    id: Number(row.id),
    orderType: row.orderType ?? row.order_type,
    tableNumber: row.tableNumber ?? row.table_number ?? "",
    customerName: row.customerName ?? row.customer_name ?? "Customer",
    source: row.source,
    status: row.status,
    subtotal: toNumber(row.subtotal),
    createdBy: row.createdBy ?? row.created_by ?? null,
    createdAt: toIso(row.createdAt ?? row.created_at),
    items: items.map((item) => ({
      id: Number(item.id),
      menuItemId: Number(item.menuItemId ?? item.menu_item_id),
      menuName: item.menuName ?? item.menu_name,
      quantity: Number(item.quantity),
      price: toNumber(item.price)
    }))
  };
}

function normalizePayment(row) {
  return {
    id: Number(row.id),
    orderId: Number(row.orderId ?? row.order_id),
    method: row.method,
    total: toNumber(row.total),
    paidAmount: toNumber(row.paidAmount ?? row.paid_amount),
    changeAmount: toNumber(row.changeAmount ?? row.change_amount),
    cashierId: row.cashierId ?? row.cashier_id ?? null,
    paidAt: toIso(row.paidAt ?? row.paid_at)
  };
}

async function dbOrFallback(dbAction, fallbackAction) {
  if (!hasDbConfig()) return fallbackAction();

  try {
    return await dbAction();
  } catch (error) {
    console.error("Database tidak tersedia, memakai data demo:", error.message);
    return fallbackAction(error);
  }
}

function dateFilter(rows, from, to, key) {
  const fromTime = from ? new Date(`${from}T00:00:00`).getTime() : null;
  const toTime = to ? new Date(`${to}T23:59:59`).getTime() : null;

  return rows.filter((row) => {
    const time = new Date(row[key]).getTime();
    if (fromTime && time < fromTime) return false;
    if (toTime && time > toTime) return false;
    return true;
  });
}

function buildDateWhere(column, from, to) {
  const where = [];
  const params = [];

  if (from) {
    where.push(`${column} >= ?`);
    params.push(`${from} 00:00:00`);
  }

  if (to) {
    where.push(`${column} <= ?`);
    params.push(`${to} 23:59:59`);
  }

  return {
    clause: where.length ? `WHERE ${where.join(" AND ")}` : "",
    params
  };
}

export async function findUserByUsername(username) {
  const cleanUsername = String(username || "").trim();
  if (!cleanUsername) return null;

  return dbOrFallback(
    async () => {
      const rows = await query(
        "SELECT id, name, username, role, password_hash AS passwordHash FROM users WHERE username = ? LIMIT 1",
        [cleanUsername]
      );
      return rows[0] || null;
    },
    () => {
      const store = getStore();
      return store.users.find((user) => user.username === cleanUsername) || null;
    }
  );
}

export async function getMenuItems({ activeOnly = false } = {}) {
  return dbOrFallback(
    async () => {
      const rows = await query(
        `SELECT id, name, category, price, thumbnail, description, is_active AS isActive, created_at AS createdAt
         FROM menu_items
         ${activeOnly ? "WHERE is_active = 1" : ""}
         ORDER BY category, name`
      );
      return rows.map(normalizeMenuItem);
    },
    () => {
      const store = getStore();
      return store.menuItems
        .filter((item) => (activeOnly ? item.isActive : true))
        .map(normalizeMenuItem)
        .sort((a, b) => `${a.category}${a.name}`.localeCompare(`${b.category}${b.name}`));
    }
  );
}

export async function getMenuItem(id) {
  const menuItems = await getMenuItems({ activeOnly: false });
  return menuItems.find((item) => item.id === Number(id)) || null;
}

function validateMenuPayload(payload) {
  const name = String(payload.name || "").trim();
  const category = String(payload.category || "Makanan").trim();
  const price = Number(payload.price);

  if (!name) throw new Error("Nama menu wajib diisi.");
  if (!Number.isFinite(price) || price <= 0) throw new Error("Harga menu harus lebih dari 0.");

  return {
    name,
    category,
    price,
    thumbnail: String(payload.thumbnail || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFQztr0w0a1Vh1Qwia3bkJVp2FR_D1wq-0zA&s").trim(),
    description: String(payload.description || "").trim(),
    isActive: payload.isActive ?? true
  };
}

export async function createMenuItem(payload) {
  const item = validateMenuPayload(payload);

  return dbOrFallback(
    async () => {
      const result = await query(
        `INSERT INTO menu_items (name, category, price, thumbnail, description, is_active)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [item.name, item.category, item.price, item.thumbnail, item.description, item.isActive ? 1 : 0]
      );
      return getMenuItem(Number(result.insertId));
    },
    () => {
      const store = getStore();
      const nextItem = {
        id: store.counters.menu++,
        ...item,
        createdAt: new Date().toISOString()
      };
      store.menuItems.push(nextItem);
      return normalizeMenuItem(nextItem);
    }
  );
}

export async function updateMenuItem(id, payload) {
  const item = validateMenuPayload(payload);

  return dbOrFallback(
    async () => {
      await query(
        `UPDATE menu_items
         SET name = ?, category = ?, price = ?, thumbnail = ?, description = ?, is_active = ?
         WHERE id = ?`,
        [item.name, item.category, item.price, item.thumbnail, item.description, item.isActive ? 1 : 0, Number(id)]
      );
      return getMenuItem(id);
    },
    () => {
      const store = getStore();
      const index = store.menuItems.findIndex((menuItem) => menuItem.id === Number(id));
      if (index === -1) return null;
      store.menuItems[index] = { ...store.menuItems[index], ...item };
      return normalizeMenuItem(store.menuItems[index]);
    }
  );
}

export async function deleteMenuItem(id) {
  return dbOrFallback(
    async () => {
      await query("DELETE FROM menu_items WHERE id = ?", [Number(id)]);
      return { ok: true };
    },
    () => {
      const store = getStore();
      const before = store.menuItems.length;
      store.menuItems = store.menuItems.filter((item) => item.id !== Number(id));
      return { ok: store.menuItems.length < before };
    }
  );
}

async function priceOrderItems(items) {
  const menuItems = await getMenuItems({ activeOnly: true });
  const pricedItems = [];

  for (const cartItem of items || []) {
    const menuItem = menuItems.find((item) => item.id === Number(cartItem.menuItemId ?? cartItem.id));
    const quantity = Number(cartItem.quantity || 0);

    if (!menuItem || quantity < 1) continue;

    pricedItems.push({
      menuItemId: menuItem.id,
      menuName: menuItem.name,
      quantity,
      price: menuItem.price
    });
  }

  if (!pricedItems.length) throw new Error("Pesanan harus memiliki minimal satu item.");
  return pricedItems;
}

export async function getOrders({ from, to } = {}) {
  return dbOrFallback(
    async () => {
      const filter = buildDateWhere("created_at", from, to);
      const orderRows = await query(
        `SELECT id, order_type AS orderType, table_number AS tableNumber, customer_name AS customerName,
                source, status, subtotal, created_by AS createdBy, created_at AS createdAt
         FROM orders
         ${filter.clause}
         ORDER BY created_at DESC
         LIMIT 200`,
        filter.params
      );
      const ids = orderRows.map((order) => Number(order.id));
      const itemRows = ids.length
        ? await query(
            `SELECT id, order_id AS orderId, menu_item_id AS menuItemId, menu_name AS menuName, quantity, price
             FROM order_items
             WHERE order_id IN (${ids.map(() => "?").join(",")})
             ORDER BY id`,
            ids
          )
        : [];

      return orderRows.map((order) =>
        normalizeOrder(
          order,
          itemRows.filter((item) => Number(item.orderId) === Number(order.id))
        )
      );
    },
    () => {
      const store = getStore();
      return dateFilter(store.orders, from, to, "createdAt")
        .map((order) => normalizeOrder(order, order.items))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  );
}

export async function getOrderById(id) {
  const orders = await getOrders();
  return orders.find((order) => order.id === Number(id)) || null;
}

export async function createOrder(payload, session = null) {
  const items = await priceOrderItems(payload.items);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = {
    orderType: payload.orderType === "take_away" ? "take_away" : "dine_in",
    tableNumber: String(payload.tableNumber || "").trim(),
    customerName: String(payload.customerName || "Customer").trim(),
    source: payload.source === "cashier" ? "cashier" : "qr",
    status: payload.status || "open",
    subtotal,
    createdBy: session?.id || null,
    createdAt: new Date().toISOString(),
    items
  };

  return dbOrFallback(
    async () =>
      withConnection(async (connection) => {
        await connection.beginTransaction();

        try {
          const result = await connection.query(
            `INSERT INTO orders (order_type, table_number, customer_name, source, status, subtotal, created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              order.orderType,
              order.tableNumber,
              order.customerName,
              order.source,
              order.status,
              order.subtotal,
              order.createdBy
            ]
          );
          const orderId = Number(result.insertId);
          const orderItems = [];

          for (const item of items) {
            const itemResult = await connection.query(
              `INSERT INTO order_items (order_id, menu_item_id, menu_name, quantity, price)
               VALUES (?, ?, ?, ?, ?)`,
              [orderId, item.menuItemId, item.menuName, item.quantity, item.price]
            );
            orderItems.push({ id: Number(itemResult.insertId), ...item });
          }

          await connection.commit();
          return normalizeOrder({ id: orderId, ...order }, orderItems);
        } catch (error) {
          await connection.rollback();
          throw error;
        }
      }),
    () => {
      const store = getStore();
      const orderItems = items.map((item) => ({
        id: store.counters.orderItem++,
        ...item
      }));
      const nextOrder = {
        id: store.counters.order++,
        ...order,
        items: orderItems
      };
      store.orders.unshift(nextOrder);
      return normalizeOrder(nextOrder, orderItems);
    }
  );
}

export async function updateOrder(id, payload) {
  const status = String(payload.status || "open").trim();

  return dbOrFallback(
    async () => {
      await query("UPDATE orders SET status = ? WHERE id = ?", [status, Number(id)]);
      return getOrderById(id);
    },
    () => {
      const store = getStore();
      const order = store.orders.find((item) => item.id === Number(id));
      if (!order) return null;
      order.status = status;
      return normalizeOrder(order, order.items);
    }
  );
}

export async function deleteOrder(id) {
  return dbOrFallback(
    async () => {
      await query("DELETE FROM orders WHERE id = ?", [Number(id)]);
      return { ok: true };
    },
    () => {
      const store = getStore();
      const before = store.orders.length;
      store.orders = store.orders.filter((order) => order.id !== Number(id));
      store.payments = store.payments.filter((payment) => payment.orderId !== Number(id));
      return { ok: store.orders.length < before };
    }
  );
}

export async function getPayments({ from, to } = {}) {
  return dbOrFallback(
    async () => {
      const filter = buildDateWhere("paid_at", from, to);
      const rows = await query(
        `SELECT id, order_id AS orderId, method, total, paid_amount AS paidAmount,
                change_amount AS changeAmount, cashier_id AS cashierId, paid_at AS paidAt
         FROM payments
         ${filter.clause}
         ORDER BY paid_at DESC
         LIMIT 200`,
        filter.params
      );
      return rows.map(normalizePayment);
    },
    () => {
      const store = getStore();
      return dateFilter(store.payments, from, to, "paidAt")
        .map(normalizePayment)
        .sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt));
    }
  );
}

export async function createPayment(payload, session = null) {
  const order = await getOrderById(payload.orderId);
  if (!order) throw new Error("Order tidak ditemukan.");

  const method = payload.method === "cashless" ? "cashless" : "cash";
  const paidAmount = method === "cashless" ? order.subtotal : Number(payload.paidAmount || 0);

  if (paidAmount < order.subtotal) {
    throw new Error("Nominal pembayaran kurang dari total.");
  }

  const payment = {
    orderId: order.id,
    method,
    total: order.subtotal,
    paidAmount,
    changeAmount: paidAmount - order.subtotal,
    cashierId: session?.id || null,
    paidAt: new Date().toISOString()
  };

  return dbOrFallback(
    async () =>
      withConnection(async (connection) => {
        await connection.beginTransaction();

        try {
          const result = await connection.query(
            `INSERT INTO payments (order_id, method, total, paid_amount, change_amount, cashier_id)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              payment.orderId,
              payment.method,
              payment.total,
              payment.paidAmount,
              payment.changeAmount,
              payment.cashierId
            ]
          );
          await connection.query("UPDATE orders SET status = 'paid' WHERE id = ?", [payment.orderId]);
          await connection.commit();
          return normalizePayment({ id: Number(result.insertId), ...payment });
        } catch (error) {
          await connection.rollback();
          throw error;
        }
      }),
    () => {
      const store = getStore();
      const nextPayment = {
        id: store.counters.payment++,
        ...payment
      };
      const targetOrder = store.orders.find((item) => item.id === payment.orderId);
      if (targetOrder) targetOrder.status = "paid";
      store.payments.unshift(nextPayment);
      return normalizePayment(nextPayment);
    }
  );
}

function compactDate(value) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short"
  }).format(new Date(value));
}

function groupOrders(orders, payments) {
  const byDate = new Map();

  for (const order of orders) {
    const dateKey = order.createdAt.slice(0, 10);
    const current = byDate.get(dateKey) || {
      date: dateKey,
      label: compactDate(order.createdAt),
      orders: 0,
      revenue: 0
    };
    current.orders += 1;
    byDate.set(dateKey, current);
  }

  for (const payment of payments) {
    const dateKey = payment.paidAt.slice(0, 10);
    const current = byDate.get(dateKey) || {
      date: dateKey,
      label: compactDate(payment.paidAt),
      orders: 0,
      revenue: 0
    };
    current.revenue += payment.total;
    byDate.set(dateKey, current);
  }

  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

export async function getDashboardData({ from, to } = {}) {
  const [orders, payments, db] = await Promise.all([
    getOrders({ from, to }),
    getPayments({ from, to }),
    getDatabaseStatus()
  ]);
  const series = groupOrders(orders, payments);

  return {
    db,
    totals: {
      orders: orders.length,
      revenue: payments.reduce((sum, payment) => sum + payment.total, 0),
      averageOrder: orders.length
        ? Math.round(orders.reduce((sum, order) => sum + order.subtotal, 0) / orders.length)
        : 0,
      openOrders: orders.filter((order) => order.status !== "paid").length
    },
    series,
    recentOrders: orders.slice(0, 8),
    payments: payments.slice(0, 8)
  };
}
