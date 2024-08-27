import React from 'react';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="bg-blue-600 text-white p-4 text-center text-2xl">
        Task Manager
      </header>
      <main className="mt-4 max-w-4xl mx-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
