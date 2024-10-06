import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// eslint-disable-next-line
import { Analytics } from "@vercel/analytics/react";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
