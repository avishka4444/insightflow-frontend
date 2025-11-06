import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppRoutes from "./routes";

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
