import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadTheme } from "../features/themeSlice";
import { Loader2Icon } from "lucide-react";
import AuthScreen from "../components/AuthScreen";
import {
  hydrateWorkspaces,
  setLoading,
  setWorkspaceError,
} from "../features/workspaceSlice";
import { logout } from "../features/authSlice";
import { apiRequest } from "../lib/api";

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { loading } = useSelector((state) => state.workspace);
    const { user, token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    // Initial load of theme
    useEffect(() => {
        dispatch(loadTheme());
    }, [dispatch]);

    useEffect(() => {
        const loadWorkspaces = async () => {
            if (!token) {
                return;
            }
            dispatch(setLoading(true));
            try {
                const workspaces = await apiRequest("/workspaces");
                dispatch(hydrateWorkspaces(workspaces));
            } catch (error) {
                dispatch(setWorkspaceError(error.message));
                if (error.message.toLowerCase().includes("token")) {
                    dispatch(logout());
                }
            } finally {
                dispatch(setLoading(false));
            }
        };

        loadWorkspaces();
    }, [dispatch, token]);

    if (!user) {
        return <AuthScreen />;
    }

    if (loading) return (
        <div className='flex items-center justify-center h-screen bg-white dark:bg-zinc-950'>
            <Loader2Icon className="size-7 text-blue-500 animate-spin" />
        </div>
    );

    return (
        <div className="flex bg-white dark:bg-zinc-950 text-gray-900 dark:text-slate-100">
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col h-screen">
                <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <div className="flex-1 h-full p-6 xl:p-10 xl:px-16 overflow-y-scroll">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
