// components/layout/PublicLayout.jsx
import { Outlet } from "react-router-dom";
import {Navbar} from "./Navbar.jsx";
import Footer from "./Footer.jsx";
export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
}