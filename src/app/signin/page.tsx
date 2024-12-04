// app/signin/page.tsx

'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react'; // For next-auth signIn
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SignIn = () => {
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [error, setError] = useState('');
     const router = useRouter();

     const handleSignIn = async (e: React.FormEvent) => {
          e.preventDefault();

          // Check for empty fields
          if (!email || !password) {
               setError('Both email and password are required');
               return;
          }

          const res = await signIn('credentials', {
               redirect: false,
               email,
               password,
          });

          if (res?.error) {
               setError('Invalid credentials');
          } else {
               router.push('/dashboard'); // Redirect after successful login
          }
     };

     return (
          <div className="flex items-center justify-center h-screen bg-gray-100">
               <div className="p-6 bg-white rounded-lg shadow-lg w-96">
                    <h1 className="text-2xl font-semibold mb-4">Sign In</h1>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <form onSubmit={handleSignIn} className="space-y-4">
                         <input
                              type="email"
                              placeholder="Email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md"
                         />
                         <input
                              type="password"
                              placeholder="Password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md"
                         />
                         <button
                              type="submit"
                              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                         >
                              Sign In
                         </button>
                    </form>
                    <p className="mt-4 text-center text-sm">
                         Don't have an account?{' '}
                         <Link href="/register" className="text-blue-500 hover:underline">
                              Register here
                         </Link>
                    </p>
               </div>
          </div>
     );
};

export default SignIn;
