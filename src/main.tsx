import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import LenisProvider from "./providers/LenisProvider";

createRoot(document.getElementById("root")!).render(
  <LenisProvider>
    <App />
  </LenisProvider>
);
