import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import UsersPage from "./pages/UsersPage";
import SettingsPage from "./pages/SettingsPage";

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  return (
    <BrowserRouter>
      {/* 路由配置 */}
       <Routes>
        {/* 独立的登录页，不使用DashboardLayout */}

        {/* path="/"==默认页面是登录页 */}
        <Route path="/" element={<LoginPage />} /> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* 使用DashboardLayout的相关页面 */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* 404重定向到登录 */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
