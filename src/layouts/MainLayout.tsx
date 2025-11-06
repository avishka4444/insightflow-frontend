import { Outlet } from "react-router-dom";
import AppBar from "../components/AppBar";

const MainLayout = () => {
  return (
    <>
      <AppBar />
      <main className="mt-20">
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
