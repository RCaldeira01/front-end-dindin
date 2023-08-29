import { Outlet, Route, Routes, Navigate } from "react-router-dom";

import Cadastrar from "./pages/Cadastrar";
import Home from "./pages/Home";
import Login from "./pages/Login";

function ProtectRoutes({ redictTo }) {
  const token = localStorage.getItem('token');
  return token ? <Outlet /> : <Navigate to={redictTo} />;
}

function NoProtectRoutes() {
  const token = localStorage.getItem('token');
  return token ? <Navigate to='/home' /> : <Outlet />;
}

export default function Rotas() {
  return (
    <Routes>
      <Route element={<ProtectRoutes redictTo={"/"} />} >
        <Route path="/home" element={<Home />} />
      </Route>

      <Route element={<NoProtectRoutes />} >
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastrar />} />
      </Route>
    </Routes>
  );
}
