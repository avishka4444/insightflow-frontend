import { Outlet } from "react-router-dom";
import AppBar from "../components/AppBar";

const MainLayout = () => {
  return (
    <div className="min-h-screen">
      <AppBar />
      <main className="pt-14">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
