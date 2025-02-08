import { Route, Routes } from "react-router-dom";
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
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ProtectRoute from "./layout/protect-route";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

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

  return (
    <>
      <Suspense fallback={<Loader2 className="animate-spine" size="md" />}>
        <Routes>
          <Route>
            <Route
              element={
                <ProtectRoute
                  isAuthenticated={!!authUser}
                  isLoading={isLoading}
                />
              }
            >
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/news" element={<News />} />
                <Route path="/tasks" element={<Task />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Route>
          </Route>

          <Route
            element={
              <ProtectRoute
                isAuthenticated={!authUser}
                isLoading={isLoading}
                redirectPath="/dashboard"
              />
            }
          >
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
          </Route>

          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Suspense>

      <Toaster position="bottom-center" />
    </>
  );
}

export default App;
