import React, { useState } from "react";
// Assuming the image is in the public directory
// If using Vite, you can import images from the public directory like this
import signinImage from '/src/gif/ac140a627af854f14c7f653efd7d53ae.gif';
// Alternative: If your image is in the src directory, use:
// import signinImage from '../gif/ac140a627af854f14c7f653efd7d53ae.gif';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sign in attempted with:", { email, password });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      <div className="hidden lg:flex items-center justify-center p-8">
        <img
          src={signinImage}
          alt="Collaboration animation"
          className="max-w-[600px] h-auto"
        />
      </div>
      <div className="flex items-center justify-center p-8 bg-[#0D4C92]">
        <div className="w-full max-w-md bg-white rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold">Sign in</h1>
          </div>
       <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
            <label
            htmlFor="email"
            className="block text-base font-medium text-gray-900"
            >
            Email id
            </label>
            <input
            id="email"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-[#EDE7DB]  text-white border-none shadow-[6px_6px_0_0_#0D4C92] focus:outline-none focus:ring-2 focus:ring-[#0D4C92] text-base autofill:bg-slate-900 autofill:text-white"
            />
        </div>
        <div className="space-y-2">
            <label
            htmlFor="password"
            className="block text-base font-medium text-gray-900"
            >
            Password
            </label>
            <input
            id="password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-[#EDE7DB] border-none shadow-[6px_6px_0_0_#0D4C92] focus:outline-none focus:ring-2 focus:ring-[#0D4C92] text-base"
            />
        </div>
            <div className="flex justify-center">
            <button
                type="submit"
                className="w-1/3 bg-[#0D4C92] text-white py-3 px-4 rounded-full text-base font-semibold hover:bg-[#0D4C92]/90 focus:outline-none focus:ring-2 focus:ring-[#0D4C92] focus:ring-offset-2 shadow-sm transition-colors duration-200"
            >
                Sign in
            </button>
            </div>

            <div className="text-center text-base">
              {"Don't have an account? "}
              <a
                href="/sign-up"
                className="text-[#0D4C92] hover:underline font-semibold"
              >
                Sign Up
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;