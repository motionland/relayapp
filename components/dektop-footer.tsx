"use client";

import { Home, Package, Truck, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/my-metro",
    icon: <Home className="h-5 w-5 mb-1" />,
    label: "Home",
  },
  {
    href: "/pickup",
    icon: <Package className="h-5 w-5 mb-1" />,
    label: "Pickup",
  },
  {
    href: "/receiving",
    icon: <Truck className="h-5 w-5 mb-1" />,
    label: "Receiving",
  },
  {
    href: "/speedmode",
    icon: <Zap className="h-5 w-5 mb-1" />,
    label: "Speed Mode",
  },
];

const DekstopFooter = () => {
  const pathname = usePathname();

  return (
    <div className="w-full flex justify-end gap-2 py-4 pr-[94px]">
      {navItems.map((item) => {
        const isSpeedMode = item.href === "/speedmode";
        const isActive = pathname === item.href;

        const baseClass =
          "flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200";

        const className = `${baseClass} ${
          isSpeedMode
            ? "bg-yellow-500 text-white hover:bg-yellow-600"
            : isActive
            ? "bg-slate-100 text-slate-800"
            : "bg-black text-white hover:bg-slate-100 hover:text-slate-900"
        }`;

        return (
          <Link key={item.href} href={item.href} className={className}>
            {item.icon}
            {item.label}
          </Link>
        );
      })}
    </div>
  );
};

export default DekstopFooter;
