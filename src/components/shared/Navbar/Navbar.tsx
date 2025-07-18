"use client";

import React, { useState, useEffect } from "react";
import { useGetMeQuery } from "@/redux/features/user";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/features/auth";
import { useRouter, usePathname } from "next/navigation";
import type { RootState } from "@/redux/store";


import ForPc from "@/components/shared/Navbar/ForPc"; 
import ForMobile from "./ForMobile";

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { data } = useGetMeQuery();
  const dispatch = useDispatch();
  const router = useRouter(); 
  const pathname = usePathname();

  const isLoggedIn = data?.success ?? false;




const role = useSelector((state: RootState) => state.auth.user?.role);




  

  

  

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    if (isClient) {
      router.push("/login");
    }
  };

  if (!isClient) return null;

  return (
    <div
      className={`shadow-md top-0 left-0 right-0 bg-white sticky transition-all duration-500 ease-in-out ${
        isSticky ? "fixed z-50" : "z-auto"
      }`}
    >
      <ForPc
        isLoggedIn={isLoggedIn}
        role={role ?? ""}
        pathname={pathname}
        onLogout={handleLogout}
        userName={data?.data?.name}
      />
      <ForMobile isLoggedIn={isLoggedIn} role={role ?? ""} pathname={pathname}  onLogout={handleLogout} />
    </div>
  );
};

export default Navbar;
