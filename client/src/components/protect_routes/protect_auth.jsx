import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

export default function Protect_auth() {
    const { user, loading } = useSelector((state) => state.auth_slice);

    if (loading.getMe) {
        return <div>Loading...</div>;
    }

    return user ? <Navigate to="/" replace /> : <Outlet />;
}