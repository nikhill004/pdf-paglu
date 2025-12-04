import React from 'react';

function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">📄</span>
            <h1 className="text-2xl font-bold text-primary">PDF Paglu</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-primary transition">Home</a>
            <a href="#" className="text-gray-600 hover:text-primary transition">About</a>
            <a href="#" className="text-gray-600 hover:text-primary transition">Contact</a>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
