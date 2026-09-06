import { NextResponse } from 'next/server';
import { getMenuItemById, updateMenuItem, deleteMenuItem } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const item = getMenuItemById(id);
    if (!item) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, item });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch menu item' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'owner') {
      return NextResponse.json({ error: 'Unauthorized: Owner access required' }, { status: 403 });
    }

    const { id } = params;
    const body = await request.json();

    const formattedData = {
      ...body,
      price: body.price !== undefined ? parseFloat(body.price) : undefined,
      rating: body.rating !== undefined ? parseFloat(body.rating) : undefined,
      calories: body.calories !== undefined ? parseInt(body.calories) : undefined,
      ingredients: Array.isArray(body.ingredients)
        ? body.ingredients
        : (typeof body.ingredients === 'string' ? body.ingredients.split(',').map(s => s.trim()) : undefined)
    };

    // Clean undefined fields
    Object.keys(formattedData).forEach(key => formattedData[key] === undefined && delete formattedData[key]);

    const updated = updateMenuItem(id, formattedData);
    if (!updated) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error('Update menu item error:', error);
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'owner') {
      return NextResponse.json({ error: 'Unauthorized: Owner access required' }, { status: 403 });
    }

    const { id } = params;
    const deleted = deleteMenuItem(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
  }
}
