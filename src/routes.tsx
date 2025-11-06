import { Route, Routes } from "react-router-dom";
import Home from "./screens/Home";
import About from "./screens/About";
import MainLayout from "./layouts/MainLayout";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  );
}
