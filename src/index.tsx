import React from "react";
import ReactDOM from "react-dom";
import { Provider as StoreProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { App } from "./App";
import { persistor, store } from "./app/store";
import "./index.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);

// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
