import { type FunctionComponent } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import AdminPage from './pages/Admin';
import LoginPage from './pages/Admin/LoginPage';
import AiringPage from './pages/AiringPage';

import './styles/main.scss';

const AgendaRoutes: FunctionComponent = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/signin" element={<LoginPage />} />
      <Route path="/airing" element={<AiringPage />} />
    </Routes>
  </BrowserRouter>
);

export default AgendaRoutes;
