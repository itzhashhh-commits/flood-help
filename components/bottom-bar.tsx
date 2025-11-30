"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

export default function BottomBar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Map" },
    { href: "/list", label: "Help people" },
  ];

  return (
    <div className="absolute bottom-4 left-1/2 transform z-50 -translate-x-1/2">
      <div className="h-[50px] bg-card border items-center p-1  rounded-full flex">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "relative text-sm rounded-full px-5 flex items-center w-full h-full transition-colors",
                active
                  ? "font-semibold text-foreground bg-muted "
                  : "text-muted-foreground",
              ].join(" ")}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
