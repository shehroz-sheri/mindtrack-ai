'use client';

import { signInWithGoogle, logOut } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';

export default function AuthButton() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="px-4 py-2 text-sm text-gray-600">
        Loading...
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-700">
          Hello, {user.displayName?.split(' ')[0] || 'User'}
        </span>
        <button
          onClick={logOut}
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={signInWithGoogle}
      className="bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
    >
      Sign In with Google
    </button>
  );
}