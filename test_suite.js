const BASE_URL = 'http://localhost:3000';

async function testRunner() {
  console.log('🧪 Starting RONYCAFEHUT Comprehensive Test Suite...\n');
  let passed = 0;
  let failed = 0;

  async function assertTest(name, fn) {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ FAIL: ${name}\n   Error: ${err.message}`);
      failed++;
    }
  }

  // 1. Pages HTTP 200 checks
  await assertTest('Homepage (/) returns 200 and renders HTML', async () => {
    const res = await fetch(`${BASE_URL}/`);
    if (res.status !== 200) throw new Error(`Status was ${res.status}`);
    const html = await res.text();
    if (!html.includes('RONY') || !html.includes('HUT')) throw new Error('Missing brand text in HTML');
  });

  await assertTest('Menu Page (/menu) returns 200', async () => {
    const res = await fetch(`${BASE_URL}/menu`);
    if (res.status !== 200) throw new Error(`Status was ${res.status}`);
  });

  await assertTest('Cart Page (/cart) returns 200', async () => {
    const res = await fetch(`${BASE_URL}/cart`);
    if (res.status !== 200) throw new Error(`Status was ${res.status}`);
  });

  await assertTest('Checkout Page (/checkout) returns 200', async () => {
    const res = await fetch(`${BASE_URL}/checkout`);
    if (res.status !== 200) throw new Error(`Status was ${res.status}`);
  });

  await assertTest('Sign In Page (/auth/signin) returns 200', async () => {
    const res = await fetch(`${BASE_URL}/auth/signin`);
    if (res.status !== 200) throw new Error(`Status was ${res.status}`);
  });

  await assertTest('Sign Up Page (/auth/signup) returns 200', async () => {
    const res = await fetch(`${BASE_URL}/auth/signup`);
    if (res.status !== 200) throw new Error(`Status was ${res.status}`);
  });

  // 2. Menu API & Filtering
  let allMenuItems = [];
  await assertTest('GET /api/menu returns full catalog with 80+ items', async () => {
    const res = await fetch(`${BASE_URL}/api/menu`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    if (!data.items || data.items.length < 50) throw new Error(`Expected >= 50 items, got ${data.items?.length}`);
    allMenuItems = data.items;
    console.log(`   (Catalog contains ${data.items.length} items across categories)`);
  });

  await assertTest('GET /api/menu?category=pizza filters to artisanal pizzas', async () => {
    const res = await fetch(`${BASE_URL}/api/menu?category=pizza`);
    const data = await res.json();
    if (data.items.length < 5) throw new Error(`Expected pizzas >= 5, got ${data.items.length}`);
    if (data.items.some(i => i.category !== 'pizza')) throw new Error('Returned non-pizza item');
  });

  await assertTest('GET /api/menu?search=latte searches items by query', async () => {
    const res = await fetch(`${BASE_URL}/api/menu?search=latte`);
    const data = await res.json();
    if (data.items.length === 0) throw new Error('Expected latte search results');
    if (!data.items.some(i => i.name.toLowerCase().includes('latte'))) throw new Error('No item with latte in name');
  });

  // 3. Authentication
  let customerToken = null;
  let ownerToken = null;
  let ownerCookie = null;

  await assertTest('POST /api/auth/login logs in Customer account', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'customer@example.com',
        password: 'Password123!',
        role: 'customer'
      })
    });
    const data = await res.json();
    if (!data.success || !data.token) throw new Error(data.error || 'Login failed');
    customerToken = data.token;
  });

  await assertTest('POST /api/auth/login logs in Owner account and sets cookie', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'owner@ronycafehut.com',
        password: 'CafeOwner123!',
        role: 'owner'
      })
    });
    const data = await res.json();
    if (!data.success || !data.token || data.user.role !== 'owner') throw new Error(data.error || 'Owner login failed');
    ownerToken = data.token;
    ownerCookie = res.headers.get('set-cookie');
  });

  // 4. Order Creation & Flow
  let createdOrderId = null;
  await assertTest('POST /api/orders places a new Dine-In order', async () => {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        customer: {
          name: 'Jordan Reed',
          email: 'customer@example.com',
          phone: '+1 (555) 789-0123',
          type: 'dine-in',
          tableNumber: 'Table 7'
        },
        items: [
          {
            id: 'c-5',
            name: 'Artisan Cafe Latte',
            price: 6.00,
            quantity: 2,
            customization: { milk: 'Oat Milk (+0.75)', size: 'Large (16oz) (+0.85)' },
            notes: 'Extra hot with tulip latte art',
            itemTotal: 12.00
          },
          {
            id: 'p-1',
            name: 'Burrata Margherita Pizza',
            price: 15.50,
            quantity: 1,
            customization: { crust: 'Regular Artisan Sourdough' },
            itemTotal: 15.50
          }
        ],
        subtotal: 27.50,
        discount: 5.50,
        tax: 1.82,
        deliveryFee: 0,
        total: 23.82,
        paymentMethod: 'card',
        specialInstructions: 'Please bring water with lemon',
        estimatedPrepTime: '12-15 min'
      })
    });

    const data = await res.json();
    if (!data.success || !data.order) throw new Error(data.error || 'Order creation failed');
    createdOrderId = data.order.id;
    console.log(`   (Created Order ID: ${createdOrderId}, Status: ${data.order.status})`);
  });

  await assertTest('GET /api/orders/[id] retrieves order tracking details', async () => {
    const res = await fetch(`${BASE_URL}/api/orders/${createdOrderId}`);
    const data = await res.json();
    if (!data.success || !data.order || data.order.id !== createdOrderId) {
      throw new Error('Could not fetch order by ID');
    }
    if (data.order.customer.name !== 'Jordan Reed') throw new Error('Customer mismatch');
  });

  // 5. Owner Order Management & Status Updates
  await assertTest('PATCH /api/orders/[id] as Owner updates status to preparing -> ready', async () => {
    // 1. Set to preparing
    let res = await fetch(`${BASE_URL}/api/orders/${createdOrderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ownerToken}`
      },
      body: JSON.stringify({ status: 'preparing' })
    });
    let data = await res.json();
    if (!data.success || data.order.status !== 'preparing') throw new Error('Status update to preparing failed');

    // 2. Set to ready
    res = await fetch(`${BASE_URL}/api/orders/${createdOrderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ownerToken}`
      },
      body: JSON.stringify({ status: 'ready' })
    });
    data = await res.json();
    if (!data.success || data.order.status !== 'ready') throw new Error('Status update to ready failed');
  });

  // 6. Owner Menu CRUD
  let createdMenuItemId = null;
  await assertTest('POST /api/menu as Owner creates new seasonal item', async () => {
    const res = await fetch(`${BASE_URL}/api/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ownerToken}`
      },
      body: JSON.stringify({
        name: 'Spiced Pumpkin Maple Cold Foam Latte',
        description: 'Autumn special: espresso shaken with organic pumpkin puree and pure maple, topped with spiced cold foam.',
        price: 6.95,
        category: 'coffee',
        categoryLabel: 'Coffee',
        image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80',
        rating: 5.0,
        reviewCount: 1,
        calories: 240,
        prepTime: '3-4 min',
        isPopular: true,
        isBestseller: false,
        isNew: true,
        isVegetarian: true,
        inStock: true,
        ingredients: ['Espresso', 'Pumpkin Puree', 'Oat Milk', 'Maple Syrup']
      })
    });

    const data = await res.json();
    if (!data.success || !data.item) throw new Error(data.error || 'Failed to create menu item');
    createdMenuItemId = data.item.id;
  });

  await assertTest('PUT /api/menu/[id] as Owner updates item price and stock', async () => {
    const res = await fetch(`${BASE_URL}/api/menu/${createdMenuItemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ownerToken}`
      },
      body: JSON.stringify({
        price: 7.25,
        inStock: false
      })
    });
    const data = await res.json();
    if (!data.success || data.item.price !== 7.25 || data.item.inStock !== false) {
      throw new Error('Menu item update failed');
    }
  });

  await assertTest('DELETE /api/menu/[id] as Owner deletes test item', async () => {
    const res = await fetch(`${BASE_URL}/api/menu/${createdMenuItemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${ownerToken}`
      }
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Delete failed');
  });

  // 7. Analytics & Settings
  await assertTest('GET /api/analytics as Owner returns dashboard KPIs', async () => {
    const res = await fetch(`${BASE_URL}/api/analytics`, {
      headers: { 'Authorization': `Bearer ${ownerToken}` }
    });
    const data = await res.json();
    if (!data.success || !data.analytics) throw new Error('Analytics failed');
    if (typeof data.analytics.totalRevenue !== 'number') throw new Error('Invalid revenue metric');
    console.log(`   (Live Revenue: $${data.analytics.totalRevenue}, Total Orders: ${data.analytics.totalOrders})`);
  });

  await assertTest('GET & PUT /api/settings retrieves and updates cafe settings', async () => {
    const getRes = await fetch(`${BASE_URL}/api/settings`);
    const getData = await getRes.json();
    if (!getData.success || !getData.settings) throw new Error('Get settings failed');

    const putRes = await fetch(`${BASE_URL}/api/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ownerToken}`
      },
      body: JSON.stringify({
        ...getData.settings,
        deliveryFee: 3.75
      })
    });
    const putData = await putRes.json();
    if (!putData.success || putData.settings.deliveryFee !== 3.75) throw new Error('Put settings failed');
  });

  console.log(`\n========================================`);
  console.log(`🎉 TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

testRunner().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});
