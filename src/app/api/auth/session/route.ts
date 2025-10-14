import {NextRequest, NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {initializeAdminApp} from '@/firebase/admin';

// Define session lifetime (e.g., 5 days)
const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds

/**
 * Creates a session cookie for the authenticated user.
 */
export async function POST(request: NextRequest) {
  // Initialize Firebase Admin SDK inside the function
  const {auth} = initializeAdminApp();
  try {
    const {idToken} = (await request.json()) as {idToken: string};
    if (!idToken) {
      return NextResponse.json({error: 'idToken is required'}, {status: 400});
    }

    // Create session cookie
    const sessionCookie = await auth.createSessionCookie(idToken, {expiresIn});

    // Set cookie in the browser
    cookies().set('__session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'lax',
    });

    return NextResponse.json({status: 'success'});
  } catch (error) {
    console.error('Session cookie creation failed:', error);
    return NextResponse.json({error: 'Failed to create session'}, {status: 401});
  }
}

/**
 * Clears the session cookie, effectively logging the user out.
 */
export async function DELETE() {
  try {
    cookies().delete('__session');
    return NextResponse.json({status: 'success'});
  } catch (error) {
    console.error('Session cookie deletion failed:', error);
    return NextResponse.json({error: 'Failed to delete session'}, {status: 500});
  }
}
