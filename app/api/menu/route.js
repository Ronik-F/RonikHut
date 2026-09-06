import { NextResponse } from 'next/server';
import { getMenuItems, createMenuItem } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const tag = searchParams.get('tag');
    const sort = searchParams.get('sort');
    const featured = searchParams.get('featured');

    let items = getMenuItems();

    // Category filter
    if (category && category !== 'all') {
      items = items.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }

    // Search query filter
    if (search) {
      const q = search.toLowerCase().trim();
      items = items.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.ingredients && item.ingredients.some(ing => ing.toLowerCase().includes(q)))
      );
    }

    // Tag / Dietary filter
    if (tag) {
      if (tag === 'popular') items = items.filter(i => i.isPopular);
      if (tag === 'bestseller') items = items.filter(i => i.isBestseller);
      if (tag === 'new') items = items.filter(i => i.isNew);
      if (tag === 'vegetarian') items = items.filter(i => i.isVegetarian);
      if (tag === 'glutenFree') items = items.filter(i => i.isGlutenFree);
    }

    // Featured only
    if (featured === 'true') {
      items = items.filter(i => i.isPopular || i.isBestseller);
    }

    // Sorting
    if (sort === 'price-asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      items.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'popular') {
      items.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    }

    return NextResponse.json({ success: true, count: items.length, items });
  } catch (error) {
    console.error('Menu fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'owner') {
      return NextResponse.json({ error: 'Unauthorized: Owner access required' }, { status: 403 });
    }

    const body = await request.json();
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json({ error: 'Name, price, and category are required' }, { status: 400 });
    }

    const newItem = createMenuItem({
      name: body.name,
      description: body.description || '',
      price: parseFloat(body.price),
      category: body.category,
      categoryLabel: body.categoryLabel || body.category.toUpperCase(),
      image: body.image || 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=800&q=80',
      rating: parseFloat(body.rating) || 5.0,
      reviewCount: parseInt(body.reviewCount) || 1,
      calories: parseInt(body.calories) || 150,
      prepTime: body.prepTime || '5-8 min',
      isPopular: !!body.isPopular,
      isBestseller: !!body.isBestseller,
      isNew: body.isNew !== undefined ? !!body.isNew : true,
      isVegetarian: !!body.isVegetarian,
      isSpicy: !!body.isSpicy,
      isGlutenFree: !!body.isGlutenFree,
      inStock: body.inStock !== false,
      ingredients: Array.isArray(body.ingredients)
        ? body.ingredients
        : (body.ingredients ? body.ingredients.split(',').map(s => s.trim()) : []),
      customizationOptions: body.customizationOptions || {}
    });

    return NextResponse.json({ success: true, item: newItem }, { status: 201 });
  } catch (error) {
    console.error('Create menu item error:', error);
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}
