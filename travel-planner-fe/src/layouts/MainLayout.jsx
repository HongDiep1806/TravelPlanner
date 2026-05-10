import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  return (
    <div className="h-screen flex bg-[#f5f7fb]">
      {/* SIDEBAR */}
      <Sidebar />

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}