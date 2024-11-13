import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import TawktoChat from "./TawktoChat";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <Outlet />
      <div className="flex-grow"></div>
      <Footer />
      <TawktoChat />
    </div>
  );
}
