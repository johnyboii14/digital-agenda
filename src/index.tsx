import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import App from "./App";

import store, { persistor } from "./store";
import reportWebVitals from "./reportWebVitals";

import "./index.scss";

globalThis.React = React;

window.Buffer = window.Buffer || require("buffer").Buffer;

const container: HTMLElement = document.getElementById("root")!;
const root = createRoot(container);

export const AppWrapper = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);

root.render(AppWrapper());

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
