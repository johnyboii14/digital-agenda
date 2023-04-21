import { FunctionComponent } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";

const AgendaRoutes: FunctionComponent = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
    </Routes>
  </BrowserRouter>
);

export default AgendaRoutes;
