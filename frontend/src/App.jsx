import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Toaster } from "./components/ui/sonner";
import Layout from "./layout/layout";
import Chat from "./pages/Chat";
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
      <BrowserRouter>
        {/* <Suspense fallback={<LayoutLoader />}> */}
        <Routes>
          <Route>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/news" element={<Chat />} />
            </Route>
          </Route>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />

          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
        {/* </Suspense> */}

        <Toaster position="bottom-center" />
      </BrowserRouter>
    </>
  );
}

export default App;
