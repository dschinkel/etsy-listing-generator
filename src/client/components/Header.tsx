import React from 'react';
import { ModeToggle } from './ModeToggle';

const Header = () => {
  return (
    <header className="w-full border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex h-20 items-center justify-between px-8">
        <div className="flex-1" />
        <h1 className="text-4xl font-extrabold tracking-tighter bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-x">
          Etsy Listing Generator
        </h1>
        <div className="flex-1 flex justify-end">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
