import { Loader2 } from "lucide-react";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectRoute({
  isAuthenticated,
  isLoading,
  redirectPath = "/signin",
  children,
}) {
//   if (isLoading) {
//     return (
//       <div className="h-screen flex items-center justify-center">
//         <Loader2 size="lg" className="animate-spin" />
//       </div>
//     );
//   }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} />;
  }
  return children ? children : <Outlet />;
}

export default ProtectRoute;
