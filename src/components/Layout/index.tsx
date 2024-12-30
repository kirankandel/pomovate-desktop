import React, { PropsWithChildren } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />
        {/* Main Content */}
        {children}
      </div>
    </div>
  );
};

export default Layout;
