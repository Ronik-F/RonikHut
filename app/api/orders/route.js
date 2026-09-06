import { NextResponse } from 'next/server';
import { getOrders, getOrdersByUserId, createOrder } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = getUserFromRequest(request);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    let orders = [];

    if (user && user.role === 'owner') {
      orders = getOrders();
      if (status && status !== 'all') {
        orders = orders.filter(o => o.status === status);
      }
    } else if (user) {
      // Logged in customer: fetch their orders
      orders = getOrdersByUserId(user.id);
    } else {
      // Anonymous customer can fetch with specific orderId query if needed
      const orderId = searchParams.get('orderId');
      if (orderId) {
        const all = getOrders();
        orders = all.filter(o => o.id === orderId || o.orderNumber === orderId);
      } else {
        return NextResponse.json({ success: true, orders: [] });
      }
    }

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders: orders.slice(0, limit)
    });
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    const body = await request.json();

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: 'Order must contain at least one item' }, { status: 400 });
    }

    if (!body.customer || !body.customer.name || !body.customer.phone) {
      return NextResponse.json({ error: 'Customer name and phone number are required' }, { status: 400 });
    }

    const newOrder = createOrder({
      userId: user ? user.id : (body.userId || null),
      customer: {
        name: body.customer.name,
        email: body.customer.email || (user ? user.email : ''),
        phone: body.customer.phone,
        type: body.customer.type || 'dine-in', // 'dine-in' | 'takeaway' | 'delivery'
        tableNumber: body.customer.tableNumber || '',
        deliveryAddress: body.customer.deliveryAddress || ''
      },
      items: body.items,
      subtotal: parseFloat(body.subtotal || 0),
      tax: parseFloat(body.tax || 0),
      deliveryFee: parseFloat(body.deliveryFee || 0),
      discount: parseFloat(body.discount || 0),
      total: parseFloat(body.total || 0),
      paymentMethod: body.paymentMethod || 'card',
      specialInstructions: body.specialInstructions || '',
      estimatedPrepTime: body.estimatedPrepTime || '15-20 min'
    });

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
