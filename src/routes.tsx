import { type FunctionComponent } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import AdminPage from './pages/Admin';
import LoginPage from './pages/Admin/LoginPage';
import ProductPage from './pages/ProductPage';

import './styles/main.scss';

const AgendaRoutes: FunctionComponent = () => (
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/admin" element={<AdminPage />} />
			<Route path="/signin" element={<LoginPage />} />
			<Route path="/product" element={<ProductPage />} />
		</Routes>
	</BrowserRouter>
);

export default AgendaRoutes;
