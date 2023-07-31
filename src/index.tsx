import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import NavProvider from "./context/NavLink";
import CatProvider from "./context/Categories";
import CatValueProvider from "./context/CategoryContents";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <NavProvider>
      <CatProvider>
        <CatValueProvider>
          <App />
        </CatValueProvider>
      </CatProvider>
    </NavProvider>
  </React.StrictMode>
);
