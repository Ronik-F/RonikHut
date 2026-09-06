import { NextResponse } from 'next/server';
import { getUserByEmail, updateUser, createUser, getUsers } from '@/lib/db';
import { hashPassword, verifyPassword, getUserFromRequest } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { currentPassword, newPassword, email, name } = body;

    const user = getUserFromRequest(request);

    // If already logged in as owner, change password
    if (user && user.role === 'owner') {
      const existingOwner = getUserByEmail(user.email);
      if (!existingOwner) {
        return NextResponse.json({ error: 'Owner account not found' }, { status: 404 });
      }

      if (currentPassword) {
        const isMatch = verifyPassword(currentPassword, existingOwner.passwordHash);
        if (!isMatch) {
          return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
        }
      }

      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
      }

      updateUser(existingOwner.id, {
        passwordHash: hashPassword(newPassword),
        name: name || existingOwner.name
      });

      return NextResponse.json({ success: true, message: 'Owner credentials updated successfully' });
    }

    // If not logged in, check if any owner account exists
    const allUsers = getUsers();
    const existingOwner = allUsers.find(u => u.role === 'owner');

    if (!existingOwner) {
      // First-time owner setup
      if (!email || !newPassword || newPassword.length < 6) {
        return NextResponse.json({ error: 'Valid email and password (min 6 chars) required' }, { status: 400 });
      }

      const created = createUser({
        name: name || 'Cafe Owner',
        email,
        passwordHash: hashPassword(newPassword),
        role: 'owner'
      });

      return NextResponse.json({ success: true, message: 'Owner account created successfully', user: { id: created.id, email: created.email } });
    }

    return NextResponse.json({ error: 'Owner account already configured. Please log in as owner to change settings.' }, { status: 403 });
  } catch (error) {
    console.error('Owner setup error:', error);
    return NextResponse.json({ error: 'Failed to update owner credentials' }, { status: 500 });
  }
}
