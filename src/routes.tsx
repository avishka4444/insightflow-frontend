import { Route, Routes } from "react-router-dom";
import Home from "./screens/Home";
import About from "./screens/About";
import MainLayout from "./layouts/MainLayout";
import Organizations from "./screens/Organizations";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="organizations" element={<Organizations />} />
      </Route>
    </Routes>
  );
}
