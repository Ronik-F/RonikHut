import fs from 'fs';
import path from 'path';
import { INITIAL_MENU_ITEMS, INITIAL_CAFE_SETTINGS } from './initialData.js';
import { hashPassword } from './auth.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

// In-memory cache for ultra-fast response times
let dbCache = null;

function ensureDbInitialized() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    // Generate initial initial state with hashed password for default owner
    const defaultOwnerPasswordHash = hashPassword('CafeOwner123!');
    const defaultCustomerPasswordHash = hashPassword('Password123!');

    const initialUsers = [
      {
        id: 'usr-owner-1',
        name: 'Rony (Cafe Owner)',
        email: 'owner@ronycafehut.com',
        passwordHash: defaultOwnerPasswordHash,
        role: 'owner',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'usr-cust-1',
        name: 'Alex Johnson',
        email: 'customer@example.com',
        passwordHash: defaultCustomerPasswordHash,
        role: 'customer',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Sample initial orders for realistic dashboard metrics
    const initialOrders = [
      {
        id: 'RNY-8921',
        orderNumber: '8921',
        userId: 'usr-cust-1',
        customer: {
          name: 'Alex Johnson',
          email: 'customer@example.com',
          phone: '+1 (555) 234-5678',
          tableNumber: 'Table 4',
          type: 'dine-in'
        },
        items: [
          {
            id: 'c-4',
            name: 'Velvet Cappuccino',
            price: 4.95,
            quantity: 2,
            customization: { milk: 'Oat Milk (+0.75)' },
            itemTotal: 11.40
          },
          {
            id: 'k-1',
            name: 'French Butter Croissant',
            price: 4.25,
            quantity: 2,
            customization: { warming: 'Warmed Up' },
            itemTotal: 8.50
          }
        ],
        subtotal: 19.90,
        tax: 1.64,
        deliveryFee: 0,
        total: 21.54,
        status: 'completed',
        paymentMethod: 'card',
        specialInstructions: 'Extra chocolate dust on cappuccino please',
        estimatedPrepTime: '10 min',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'RNY-8922',
        orderNumber: '8922',
        userId: null,
        customer: {
          name: 'Sophia Martinez',
          email: 'sophia.m@gmail.com',
          phone: '+1 (555) 432-8765',
          deliveryAddress: '742 Evergreen Terrace, Apt 3B',
          type: 'delivery'
        },
        items: [
          {
            id: 'p-1',
            name: 'Burrata Margherita Pizza',
            price: 15.50,
            quantity: 1,
            customization: { crust: 'Regular Artisan Sourdough' },
            itemTotal: 15.50
          },
          {
            id: 'dr-1',
            name: 'Tropical Mango Passionfruit Smoothie',
            price: 6.75,
            quantity: 1,
            customization: {},
            itemTotal: 6.75
          },
          {
            id: 'd-1',
            name: 'Espresso Tiramisu Classico',
            price: 8.50,
            quantity: 1,
            customization: {},
            itemTotal: 8.50
          }
        ],
        subtotal: 30.75,
        tax: 2.54,
        deliveryFee: 3.50,
        total: 36.79,
        status: 'preparing',
        paymentMethod: 'apple-pay',
        specialInstructions: 'Ring buzzer 3B upon arrival',
        estimatedPrepTime: '20 min',
        createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
      },
      {
        id: 'RNY-8923',
        orderNumber: '8923',
        userId: null,
        customer: {
          name: 'David Chen',
          email: 'd.chen@outlook.com',
          phone: '+1 (555) 876-1290',
          type: 'takeaway'
        },
        items: [
          {
            id: 'c-13',
            name: 'Iced Brown Sugar Shaken Espresso',
            price: 6.45,
            quantity: 1,
            customization: { sweetness: 'Standard Sweetness' },
            itemTotal: 6.45
          },
          {
            id: 'b-1',
            name: 'Smashed Avocado Sourdough Toast',
            price: 12.50,
            quantity: 1,
            customization: { eggStyle: 'Poached Soft' },
            itemTotal: 12.50
          }
        ],
        subtotal: 18.95,
        tax: 1.56,
        deliveryFee: 0,
        total: 20.51,
        status: 'confirmed',
        paymentMethod: 'counter-cash',
        specialInstructions: 'Will pick up in 10 minutes',
        estimatedPrepTime: '12 min',
        createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      }
    ];

    const initialDb = {
      menu: INITIAL_MENU_ITEMS,
      settings: INITIAL_CAFE_SETTINGS,
      users: initialUsers,
      orders: initialOrders
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    dbCache = initialDb;
  } else if (!dbCache) {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    dbCache = JSON.parse(raw);
  }
}

function readDb() {
  ensureDbInitialized();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    dbCache = JSON.parse(raw);
  } catch (err) {
    if (!dbCache) {
      ensureDbInitialized();
    }
  }
  return dbCache;
}

function writeDb(data) {
  ensureDbInitialized();
  dbCache = data;
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  return data;
}

// ==========================================
// MENU CRUD
// ==========================================
export function getMenuItems() {
  const db = readDb();
  return db.menu || [];
}

export function getMenuItemById(id) {
  const items = getMenuItems();
  return items.find(item => item.id === id) || null;
}

export function createMenuItem(itemData) {
  const db = readDb();
  const id = itemData.id || `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const newItem = {
    ...itemData,
    id,
    rating: itemData.rating || 5.0,
    reviewCount: itemData.reviewCount || 1,
    inStock: itemData.inStock !== false,
    createdAt: new Date().toISOString()
  };

  db.menu.unshift(newItem);
  writeDb(db);
  return newItem;
}

export function updateMenuItem(id, updateData) {
  const db = readDb();
  const index = db.menu.findIndex(item => item.id === id);
  if (index === -1) return null;

  db.menu[index] = {
    ...db.menu[index],
    ...updateData,
    updatedAt: new Date().toISOString()
  };

  writeDb(db);
  return db.menu[index];
}

export function deleteMenuItem(id) {
  const db = readDb();
  const index = db.menu.findIndex(item => item.id === id);
  if (index === -1) return false;

  db.menu.splice(index, 1);
  writeDb(db);
  return true;
}

// ==========================================
// ORDERS
// ==========================================
export function getOrders() {
  const db = readDb();
  return db.orders || [];
}

export function getOrderById(id) {
  const orders = getOrders();
  return orders.find(o => o.id === id || o.orderNumber === id) || null;
}

export function getOrdersByUserId(userId) {
  const orders = getOrders();
  return orders.filter(o => o.userId === userId);
}

export function createOrder(orderData) {
  const db = readDb();
  const orderNum = Math.floor(1000 + Math.random() * 9000).toString();
  const id = `RNY-${orderNum}`;

  const newOrder = {
    id,
    orderNumber: orderNum,
    userId: orderData.userId || null,
    customer: orderData.customer,
    items: orderData.items,
    subtotal: Number(orderData.subtotal.toFixed(2)),
    tax: Number(orderData.tax.toFixed(2)),
    deliveryFee: Number((orderData.deliveryFee || 0).toFixed(2)),
    discount: Number((orderData.discount || 0).toFixed(2)),
    total: Number(orderData.total.toFixed(2)),
    status: 'pending', // pending -> confirmed -> preparing -> ready -> completed / cancelled
    paymentMethod: orderData.paymentMethod || 'card',
    specialInstructions: orderData.specialInstructions || '',
    estimatedPrepTime: orderData.estimatedPrepTime || '15-20 min',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder);
  writeDb(db);
  return newOrder;
}

export function updateOrderStatus(id, status, notes = '') {
  const db = readDb();
  const index = db.orders.findIndex(o => o.id === id || o.orderNumber === id);
  if (index === -1) return null;

  db.orders[index].status = status;
  db.orders[index].updatedAt = new Date().toISOString();
  if (notes) {
    db.orders[index].statusNote = notes;
  }

  writeDb(db);
  return db.orders[index];
}

// ==========================================
// USERS & AUTH
// ==========================================
export function getUsers() {
  const db = readDb();
  return db.users || [];
}

export function getUserByEmail(email) {
  if (!email) return null;
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function getUserById(id) {
  const users = getUsers();
  return users.find(u => u.id === id) || null;
}

export function createUser(userData) {
  const db = readDb();
  const id = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const newUser = {
    id,
    name: userData.name,
    email: userData.email.toLowerCase(),
    passwordHash: userData.passwordHash,
    role: userData.role || 'customer',
    phone: userData.phone || '',
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDb(db);
  return newUser;
}

export function updateUser(id, updateData) {
  const db = readDb();
  const index = db.users.findIndex(u => u.id === id);
  if (index === -1) return null;

  db.users[index] = {
    ...db.users[index],
    ...updateData,
    updatedAt: new Date().toISOString()
  };

  writeDb(db);
  return db.users[index];
}

// ==========================================
// CAFE SETTINGS
// ==========================================
export function getSettings() {
  const db = readDb();
  return db.settings || INITIAL_CAFE_SETTINGS;
}

export function updateSettings(newSettings) {
  const db = readDb();
  db.settings = {
    ...db.settings,
    ...newSettings,
    updatedAt: new Date().toISOString()
  };
  writeDb(db);
  return db.settings;
}

// ==========================================
// ANALYTICS
// ==========================================
export function getAnalytics() {
  const db = readDb();
  const orders = db.orders || [];
  const menu = db.menu || [];

  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'completed');
  const activeOrders = orders.filter(o => ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status));
  
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((acc, cur) => acc + (cur.total || 0), 0);

  // Today's orders
  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(o => o.createdAt.startsWith(today));
  const todayRevenue = todayOrders
    .filter(o => o.status !== 'cancelled')
    .reduce((acc, cur) => acc + (cur.total || 0), 0);

  // Item sales counts
  const itemCounts = {};
  orders.forEach(order => {
    if (order.status !== 'cancelled') {
      order.items?.forEach(item => {
        itemCounts[item.id] = (itemCounts[item.id] || 0) + (item.quantity || 1);
      });
    }
  });

  const popularItems = Object.entries(itemCounts)
    .map(([id, count]) => {
      const menuItem = menu.find(m => m.id === id) || { name: 'Item ' + id, price: 0, image: '' };
      return {
        id,
        name: menuItem.name,
        price: menuItem.price,
        image: menuItem.image,
        category: menuItem.category,
        totalSold: count,
        totalRevenue: count * menuItem.price
      };
    })
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 6);

  return {
    totalRevenue: Number(totalRevenue.toFixed(2)),
    todayRevenue: Number(todayRevenue.toFixed(2)),
    totalOrders,
    todayOrdersCount: todayOrders.length,
    activeOrdersCount: activeOrders.length,
    completedOrdersCount: completedOrders.length,
    totalMenuItems: menu.length,
    popularItems,
    recentOrders: orders.slice(0, 8)
  };
}
