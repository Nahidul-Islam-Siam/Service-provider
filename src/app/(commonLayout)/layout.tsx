import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton/ScrollToTopButton";
import { NextUiProvider } from "@/lib/providers/NextUIProvider";
import ReduxProvider from "@/redux/ReduxProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Barrel Link",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="">
      <NextUiProvider>
        <ReduxProvider>
          <>
            <div className="min-h-screen grid grid-rows-[auto_1fr_auto]   max-w-[100vw] overflow-hidden mx-auto">
              <div className="fixed w-full top-0 z-50">
                <Navbar />
              </div>
              <div className="min-h-[60vh] mt-[66px]">{children}</div>

              <Footer />
            </div>
            <ScrollToTopButton />
          </>
        </ReduxProvider>
      </NextUiProvider>
    </div>
  );
}
