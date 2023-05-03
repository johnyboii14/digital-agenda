import { FunctionComponent } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home";

const DigitalAgendaRoutes: FunctionComponent = () => (
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Layout>
  </BrowserRouter>
);

export default DigitalAgendaRoutes;
