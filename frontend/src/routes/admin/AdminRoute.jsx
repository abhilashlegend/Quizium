import { Navigate } from "react-router-dom";
import { getUserRole } from "../../util/auth";

function AdminRoute({children}) {
    const role = getUserRole();

    if(role !== "admin"){
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default AdminRoute;