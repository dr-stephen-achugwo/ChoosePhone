import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TwoFactor from './pages/TwoFactor';
import { AuthProvider } from './pages/AuthContext';
import HomePages from './pages/HomePages';
import PhonePages from './pages/PhonePages';
import TabletPages from './pages/TabletPages';
import LaptopPages from './pages/LaptopPages';
import SmartwatchPages from './pages/SmartwatchPages';
import HeadphonePages from './pages/HeadphonePages';
import Refrigerator from './pages/Refrigerator';
import AirconditionerPages from './pages/AirconditionerPages';
import TelevisionPages from './pages/TelevisionPages';
import WashingmachinePages from './pages/WashingmachinePages';
import CameraPages from './pages/CameraPages';
import Login from './pages/Login';
import Registration from './pages/Registration';
import LogoutButton from './pages/Logout';

function App() {
  return (
    <>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePages />} />
        <Route path="/PhonePages" element={<PhonePages />} />
        <Route path="/TabletPages" element={<TabletPages />} />
        <Route path="/LaptopPages" element={<LaptopPages />} />
        <Route path="/SmartwatchPages" element={<SmartwatchPages />} />
        <Route path="/HeadphonePages" element={<HeadphonePages />} />
        <Route path="/RefrigeratorPages" element={<Refrigerator />} />
        <Route path="/AirconditionerPages" element={<AirconditionerPages />} />
        <Route path="/TelevisionPages" element={<TelevisionPages />} />
        <Route path="/WashingmachinePages" element={<WashingmachinePages />} />
        <Route path="/CameraPages" element={<CameraPages />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<LogoutButton />} />
        <Route path="/2fa" element={<TwoFactor />} />
        <Route path="/registration" element={<Registration />} />
      </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
