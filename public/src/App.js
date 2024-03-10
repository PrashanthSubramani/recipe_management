import React, {  } from 'react';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import Login from './pages/Login';
import Register from './pages/Register';
import "react-toastify/dist/ReactToastify.css";
import ForgetPassword from './pages/Forget-password';
import Dashboard from './pages/dashboard/dashboard';
import Create_recipe from './pages/create_recipe/create_recipe';
import ViewChart from './pages/chart/viewChart';
import './components/sidebar/index.css';
import SidebarLayout from './components/sidebar/sidebarLayout'


export default function App() {

  return (
      <BrowserRouter>
      <Routes>
          <Route element={<SidebarLayout/>}>
                  <Route index element={<Dashboard />} />
                  <Route path="/create_recipe" element={<Create_recipe />} />
                  <Route path="/view_chart" element={<ViewChart />} />
          </Route>  
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
  );
}
