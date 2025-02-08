import React, { useState } from "react";
import signupImage from "../gif/ideas.gif"; // Update the path as necessary

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
    team: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <div className="min-h-screen flex lg:grid lg:grid-cols-2 bg-white ">
      {/* Left Section with Image */}
      <div className="hidden lg:flex items-center justify-center bg-white p-2">
        <img
          src={signupImage}
          alt="Team collaboration"
          className="max-w-[600px] h-auto"
        />
      </div>

      {/* Right Section with Form */}
      <div className="flex items-center justify-center bg-[#0D4C92] ">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg px-6 py-3">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-[#0D4C92]">Sign Up</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-900"
              >
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="w-full px-4 py-2 rounded-lg bg-[#EDE7DB] text-black border border-gray-300 shadow-[6px_6px_0_0_#0D4C92] focus:outline-none focus:ring-2 focus:ring-[#0D4C92]"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900"
              >
                Email ID
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg bg-[#EDE7DB] text-black border border-gray-300 shadow-[6px_6px_0_0_#0D4C92] focus:outline-none focus:ring-2 focus:ring-[#0D4C92]"
              />
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-900"
              >
                Role
              </label>
            <input
            id="role"
            name="role"
            type="text"
            value={formData.role}
            onChange={handleChange}
            required
            placeholder="Enter your role"
            className="w-full px-4 py-2 rounded-lg bg-[#EDE7DB] text-black border border-gray-300 shadow-[6px_6px_0_0_#0D4C92] focus:outline-none focus:ring-2 focus:ring-[#0D4C92]"
            />

            </div>

            {/* Team */}
            <div>
              <label
                htmlFor="team"
                className="block text-sm font-medium text-gray-900"
              >
                Team
              </label>
              <select
                id="team"
                name="team"
                value={formData.team}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-[#EDE7DB] text-black border border-gray-300 shadow-[6px_6px_0_0_#0D4C92] focus:outline-none focus:ring-2 focus:ring-[#0D4C92]"
              >
                <option value="" disabled>
                  Select Team
                </option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-2 rounded-lg bg-[#EDE7DB]  text-black border border-gray-300 shadow-[6px_6px_0_0_#0D4C92] focus:outline-none focus:ring-2 focus:ring-[#0D4C92]"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-1/3 bg-[#0D4C92] text-white py-2 rounded-full text-base font-semibold hover:bg-[#083B71] focus:outline-none focus:ring-2 focus:ring-[#083B71] focus:ring-offset-2"
              >
                Sign Up
              </button>
            </div>

            {/* Already have an account */}
            <div className="text-center text-sm">
              {"Already have an account? "}
              <a
                href="/sign-in"
                className="text-[#0D4C92] hover:underline font-semibold"
              >
                Sign In
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
