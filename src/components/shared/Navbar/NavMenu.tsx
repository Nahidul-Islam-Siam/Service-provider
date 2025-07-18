"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavMenuProps {
  className?: string;
  mobile?: boolean;
}

const NavMenu = ({ className, mobile = false }: NavMenuProps) => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || (href !== '/' && pathname.startsWith(href));
  };

  const linkClass = (href: string) => cn(
    "transition duration-200 hover:text-[#FA8800]",
    mobile ? "py-2 px-4 text-lg" : "text-base",
    isActive(href) && "text-[#FA8800] font-semibold"
  );

  return (
    <div className={cn("flex items-center", mobile ? "flex-col gap-1" : "gap-6", className)}>
      <Link href="/" className={linkClass("/")}>
        Home
      </Link>
      
      <Link href="/pack-barrel" className={linkClass("/shipping-providers")}>
        Track Shipments
      </Link>
      
      <Link href="/my-shipments" className={linkClass("/my-shipment")}>
        Current Shipment
      </Link>
      
      <Link href="/help-center" className={linkClass("/help")}>
        Help
      </Link>
    </div>
  );
};

export default NavMenu;