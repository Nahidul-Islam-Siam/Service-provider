"use client";

import React from "react";
import HeroText from "@/components/HeroSection/HeroText";
import HeroForm from "@/components/HeroSection/HeroForm";

export default function Hero() {
  return (
    <section className="min-h-screen bg-gradient-to-r from-[#FFC72C] to-white flex items-center">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <HeroText />
          <HeroForm />
        </div>
      </div>

      <style jsx global>{`
        .ant-input-affix-wrapper {
          flex-direction: row !important;
        }
      `}</style>
    </section>
  );
}
