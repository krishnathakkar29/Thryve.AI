import React, { useState } from "react";
import signupImage from "../gif/ideas.gif"; // Update the path as necessary
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "", // Changed from fullName to name to match backend
    email: "",
    role: "",
    teamId: "", // Using only teamId, removed team
    password: "",
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate: signupMutation,
    isError,
    error: signupError,
    isPending,
  } = useMutation({
    mutationFn: async (credentials) => {
      console.log("credentials");
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/new`,
          credentials,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        return response.data;
      } catch (error) {
        console.log(error);
        throw new Error(
          error.response?.data?.message || "Something went wrong during sign in"
        );
      }
    },
    onSuccess: (data) => {
      toast.success(data.message || "Signed in successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to sign in");
    },
  });

  const {
    data: teamsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/team/getteams`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch teams");
      }
      const data = await response.json();

      return data.teams;
    },
  });

  const roles = ["Intern", "Employee", "Manager", "HR", "CEO"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signupMutation({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      role: formData.role,
      teamId: formData.teamId,
    });
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
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-900"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
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
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-[#EDE7DB] text-black border border-gray-300 shadow-[6px_6px_0_0_#0D4C92] focus:outline-none focus:ring-2 focus:ring-[#0D4C92]"
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Team */}
            <div>
              <label
                htmlFor="teamId"
                className="block text-sm font-medium text-gray-900"
              >
                Team
              </label>
              <select
                id="teamId"
                name="teamId"
                value={formData.teamId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-[#EDE7DB] text-black border border-gray-300 shadow-[6px_6px_0_0_#0D4C92] focus:outline-none focus:ring-2 focus:ring-[#0D4C92]"
              >
                <option value="">
                  {isLoading ? "Loading teams..." : "Select Team"}
                </option>
                {error ? (
                  <option value="" disabled>
                    Error loading teams
                  </option>
                ) : (
                  teamsData?.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))
                )}
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
                className="w-full px-4 py-2 rounded-lg bg-[#EDE7DB] text-black border border-gray-300 shadow-[6px_6px_0_0_#0D4C92] focus:outline-none focus:ring-2 focus:ring-[#0D4C92]"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-1/3 bg-[#0D4C92] text-white py-2 rounded-full text-base font-semibold hover:bg-[#083B71] focus:outline-none focus:ring-2 focus:ring-[#083B71] focus:ring-offset-2"
                disabled={isPending}
              >
                {isPending ? "Signing up..." : "Sign Up"}
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
