import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { Toaster } from "./components/ui/sonner";
import Layout from "./layout/layout";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import News from "./pages/News";
import Profile from "./pages/Profile";
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";
import Task from "./pages/Task";
import Report from "./pages/Report";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ProtectRoute from "./layout/protect-route";
import { Loader2 } from "lucide-react";
import { Suspense, useEffect } from "react";
import Landing from "./pages/Landing";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});
function App() {
  const {
    data: authUser,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const response = await api.get("/api/user/me");
        console.log(response.data);
        return response.data;
      } catch (error) {
        if (error.response?.status === 401) {
          return null;
        }
        throw new Error(
          error.response?.data?.message ||
            "Something went wrong while fetching user details"
        );
      }
    },
  });

  const {
    data: chatHistory,
    isLoading: isLoadingHistory,
    refetch,
  } = useQuery({
    queryKey: ["chatHistory"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/history`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch chat history");
      }
      const data = await response.json();
      return data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <>
      <Suspense fallback={<Loader2 className="animate-spine" size="md" />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<Layout />}>
            <Route
              path="/dashboard"
              element={authUser ? <Dashboard /> : <Navigate to="/signin" />}
            />
            <Route
              path="/report"
              element={authUser ? <Report /> : <Navigate to="/signin" />}
            />
            <Route
              path="/chat"
              element={authUser ? <Chat /> : <Navigate to="/signin" />}
            />
            <Route
              path="/news"
              element={authUser ? <News /> : <Navigate to="/signin" />}
            />
            <Route
              path="/tasks"
              element={authUser ? <Task /> : <Navigate to="/signin" />}
            />
            <Route
              path="/profile"
              element={authUser ? <Profile /> : <Navigate to="/signin" />}
            />
          </Route>

          <Route
            path="/signup"
            element={!authUser ? <SignUp /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/signin"
            element={!authUser ? <SignIn /> : <Navigate to="/dashboard" />}
          />

          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Suspense>

      <Toaster position="bottom-center" />
    </>
  );
}

export default App;
