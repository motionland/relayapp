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
    label: "Speed",
  },
];

const MobileFooter = () => {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around h-16">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center w-1/5 h-full transition-colors duration-200 ${
              pathname === item.href
                ? "text-blue-600 font-medium"
                : "text-gray-400 hover:text-blue-600"
            }`}
          >
            {item.icon}
            <span className="text-xs capitalize mt-0.5">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileFooter;
