import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-muted/50 py-10 mt-auto">
      <div className="flex flex-col items-center justify-center gap-3">
        <p className="text-sm font-semibold tracking-wide text-foreground uppercase">
          Etsy Listing Generator
        </p>
        <p className="text-xs text-muted-foreground font-medium">
          &copy; {new Date().getFullYear()} &middot; Crafted for Sellers &middot; All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
