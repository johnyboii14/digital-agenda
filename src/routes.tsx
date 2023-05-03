import { FunctionComponent } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import AdminPage from "./pages/Admin";

const AgendaRoutes: FunctionComponent = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  </BrowserRouter>
);

export default AgendaRoutes;
