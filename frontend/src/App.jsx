import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import SignUp from "./pages/signup";
import SignIn from "./pages/signin";
import { Toaster } from "./components/ui/sonner";
import Home from "./pages/Home";
import Layout from "./layout/layout";

function App() {
  return (
    <>
      <BrowserRouter>
        {/* <Suspense fallback={<LayoutLoader />}> */}
        <Routes>
          <Route>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
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
