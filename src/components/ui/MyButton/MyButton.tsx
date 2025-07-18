import Link from "next/link";

const NavButton = () => {
  return (
    <div className="flex flex-row gap-2 sm:gap-4 md:gap-6">
      {/* Sign In Button */}
      <button className="text-[#FA8800] hover:bg-[#FA8800] transition-all duration-300 ease-in-out hover:text-white border border-[#FA8800] cursor-pointer rounded-md px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm md:text-base">
        <Link href="/signIn">Sign In</Link>
      </button>

      {/* Sign Up Button */}
      <button className="bg-[#FA8800] text-white transition-all duration-300 ease-in-out hover:bg-white border border-[#FA8800] hover:text-[#FA8800] rounded-md px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm md:text-base">
        <Link href="/signUp">Sign Up</Link>
      </button>
    </div>
  );
};

export default NavButton;