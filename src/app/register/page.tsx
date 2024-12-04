// app/register/page.tsx

'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react'; // To use signIn after successful registration
import { useRouter } from 'next/navigation'; // To redirect after successful registration
import Link from 'next/link';

const Register = () => {
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [name, setName] = useState('');
     const [error, setError] = useState('');
     const router = useRouter();

     const handleRegister = async (e: React.FormEvent) => {
          e.preventDefault();

          // Check for empty fields
          if (!email || !password || !name) {
               setError('All fields are required');
               return;
          }

          // Send the data to the backend API to create the user
          const res = await fetch('/api/auth/register', {
               method: 'POST',
               headers: {
                    'Content-Type': 'application/json',
               },
               body: JSON.stringify({ email, password, name }),
          });

          const data = await res.json();

          if (res.status !== 200) {
               setError(data.error || 'An error occurred');
          } else {
               // Automatically sign in the user after successful registration
               await signIn('credentials', { email, password, redirect: false });
               router.push('/dashboard');
          }
     };

     return (
          <div className="flex items-center justify-center h-screen bg-gray-100">
               <div className="p-6 bg-white rounded-lg shadow-lg w-96">
                    <h1 className="text-2xl font-semibold mb-4">Register</h1>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <form onSubmit={handleRegister} className="space-y-4">
                         <input
                              type="text"
                              placeholder="Full Name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md"
                         />
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
                              Register
                         </button>
                    </form>
                    <p className="mt-4 text-center text-sm">
                         Already have an account?{' '}
                         <Link href="/" className="text-blue-500 hover:underline">
                              Sign in here
                         </Link>
                    </p>
               </div>
          </div>
     );
};

export default Register;
