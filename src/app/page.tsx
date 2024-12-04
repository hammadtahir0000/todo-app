// app/page.tsx

'use client'; // Ensures the component is treated as a Client Component
import { signIn } from 'next-auth/react';
import Link from 'next/link'; // For navigation between pages

const Home = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-semibold mb-4">Welcome to the Todo App</h1>
        <div className="space-y-4">
          <button
            onClick={() => signIn('google')}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Sign in with Google
          </button>
          <button
            onClick={() => signIn('credentials')}
            className="w-full py-2 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
          >
            Sign in with Email
          </button>
          <p className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-500 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
