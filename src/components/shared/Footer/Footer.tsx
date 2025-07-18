"use client";
import logo from "@/assets/logo/footer-logo.png";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookF } from "react-icons/fa6";
import { FaInstagram, FaTwitter } from "react-icons/fa";
import { Button, Input } from "antd";
import Share from "@/components/icons/Share";
import { useSelector } from "react-redux";

const secondRow = [
  {
    title: "Pack a Barrel",
    link: "/pack-barrel",
  },
  {
    title: "Current Shipments",
    link: "/my-shipments",
  },
  {
    title: "Track Shipment",
    link: "/shipment-tracking",
  },
  {
    title: "About Us",
    link: "/about-me",
  },
];

const thirdRow = [
  {
    title: "Help Center",
    link: "/help-center",
  },
  {
    title: "Contact Us",
    link: "/contact-us",
  },
  {
    title: "Privacy Policy",
    link: "/privacy-policy",
  },
  {
    title: "Legal Notice",
    link: "/legal-notice",
  },
];

const Footer = () => {
  interface RootState {
    auth: {
      accessToken: string | null;
    };
  }
  const accessToken = useSelector((state: RootState) => state.auth.accessToken); // Check if accessToken exists

  return (
    <div className="bg-[#2F394D] py-20 monts-font">
      <div className="flex flex-col">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="flex flex-col gap-6">
              <div className="w-full max-w-[180px] sm:max-w-[200px] md:max-w-[240px]">
                <Image
                  src={logo}
                  alt="footer-logo"
                  width={240}
                  height={80}
                  className="w-full h-auto object-contain"
                />
              </div>
              <p className="text-[rgba(255,255,255,0.70)] text-base font-medium">
                The easiest way to ship barrels and packages to the Caribbean.
              </p>
              <div className="flex items-center gap-4">
                <div className="bg-[#434c5e] p-2 rounded-full text-white">
                  <FaFacebookF className="cursor-pointer" size={18} />
                </div>
                <div className="bg-[#434c5e] p-2 rounded-full text-white">
                  <FaTwitter className="cursor-pointer" size={20} />
                </div>
                <div className="bg-[#434c5e] p-2 rounded-full text-white">
                  <FaInstagram className="cursor-pointer" size={20} />
                </div>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <div className="w-full text-base text-white flex flex-col items-start p-2">
                <h1 className="font-semibold text-2xl mb-6">Company</h1>
                <div>
                  {secondRow.map((item, i) => {
                    if (
                      (item.title === "Pack a Barrel" ||
                        item.title === "Current Shipments" ||
                        item.title === "Track Shipment") &&
                      !accessToken
                    ) {
                      return null; // Don't render these links if there's no accessToken
                    }
                    return (
                      <Link href={item.link} key={i}>
                        <div className="cursor-pointer text-[rgba(255,255,255,0.70)] hover:text-[#FA8800] pb-5 rounded break-words">
                          {item.title}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Support Links */}
            <div>
              <div className="w-full text-base text-white flex flex-col items-start p-2">
                <h1 className="font-semibold text-2xl mb-6">Support</h1>
                <div>
                  {thirdRow.map((item, i) => (
                    <Link href={item.link} key={i}>
                      <div className="cursor-pointer text-[rgba(255,255,255,0.70)] hover:text-[#FA8800] pb-5 rounded break-words">
                        {item.title}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Subscribe Section */}
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-6">Subscribe</h3>
              <p className="mb-6 text-[rgba(255,255,255,0.70)]">
                Get the latest news and updates
              </p>
              <div className="flex gap-2 items-center flex-wrap">
                <Input
                  className="custom-email-input py-3"
                  style={{
                    flex: 1,
                    backgroundColor: "#3C4759",
                    color: "#fff",
                    minWidth: "200px",
                    maxWidth: "100%",
                  }}
                  placeholder="Your email"
                  variant="borderless"
                />
                <Button
                  type="primary"
                  icon={<Share />}
                  style={{
                    width: 50,
                    backgroundColor: "#FA8C16",
                    border: "none",
                    minWidth: 44,
                    flexShrink: 0,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <h1 className="border-t-[1px] border-t-[rgba(255,255,255,0.10)] container px-4 sm:px-6 lg:px-8 text-center md:mt-6 pt-4 text-[#FFFFFF80]">
          © 2025 BarrelLink. All rights reserved.
        </h1>
      </div>
    </div>
  );
};

export default Footer;
