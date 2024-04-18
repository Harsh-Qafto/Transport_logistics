import React from "react";
import ReactDOM from "react-dom/client";
import { ContextProvider, ToastContainer } from "qaftoplaygroundnew";

import App from "./App";
import "./index.css";

// const el = document.getElementById("app");
const root = ReactDOM.createRoot(document.getElementById("app"));

// ReactDOM.render(<App />, el);
root.render(
    <ContextProvider>
        <App />
        <ToastContainer />
    </ContextProvider>
);
