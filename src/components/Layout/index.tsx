import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50">
      <nav className="backdrop-blur-lg bg-white/30 border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">
            Pomovate
          </h1>
        </div>
      </nav>
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;