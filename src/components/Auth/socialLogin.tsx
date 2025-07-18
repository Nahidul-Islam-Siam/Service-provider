"use client"

import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider, fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setAccessToken, setRefreshToken, setUser } from "@/redux/features/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Google from '@/components/icons/google';
import Fb from '@/components/icons/fb';
import Ms from '@/components/icons/ms';
import { useRegisterUserMutation } from "@/redux/service/auth/authApi";

const SocialLogin: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [registerUser] = useRegisterUserMutation();

  const handleSocialLogin = async (provider: string) => {
    try {
      let providerInstance;

      if (provider === "Google") {
        providerInstance = new GoogleAuthProvider();
      } else if (provider === "Facebook") {
        providerInstance = new FacebookAuthProvider();
      } else if (provider === "Microsoft") {
        providerInstance = new OAuthProvider("microsoft.com");
      }

      if (!auth) {
        throw new Error("Firebase auth instance is not initialized.");
      }
      if (!providerInstance) {
        throw new Error("Invalid provider selected.");
      }
      const result = await signInWithPopup(auth, providerInstance);
      const user = result.user;
      const idToken = await user.getIdToken();
      const refreshToken = user.refreshToken;

      const userData = {
        name: user.displayName ?? "N/A",
        email: user.email ?? "",
        id: user.uid,
        phone: user.phoneNumber ?? "",
        role: "", // adjust as per your model
      };

      try {
        await registerUser({
          idToken, 
          refreshToken,
          role: "",
          userName: user.displayName ?? undefined,
          phoneNumber: user.phoneNumber ?? undefined,
          }).unwrap();
          // toast.success("User registered successfully.");
      }catch(err: unknown) {
        type ErrorWithStatus = { status?: number; data?: { message?: string }; message?: string };
        if (
          typeof err === "object" &&
          err !== null &&
          "status" in err &&
          (err as ErrorWithStatus).status === 409
        ) {
          console.log("User already registered, skipping registration.");
        } else if (typeof err === "object" && err !== null) {
          const errorObj = err as ErrorWithStatus;
          console.warn("Registration failed:", errorObj?.data?.message || errorObj?.message);
        } else {
          console.warn("Registration failed:", err);
        }
      }

      dispatch(setAccessToken(idToken));
      dispatch(setRefreshToken(refreshToken));
      dispatch(setUser({ user: userData }));

      Cookies.set("accessToken", idToken, { expires: 7 });
      Cookies.set("refreshToken", refreshToken, { expires: 7 });

      toast.success(`${provider} Login Successful`);
      router.push("/"); // Redirect to homepage after login
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "auth/account-exists-with-different-credential" &&
        "customData" in error &&
        (error as { customData?: { email?: string } }).customData?.email
      ) {
        const email = (error as { customData: { email: string } }).customData.email;

        try {
          if (!auth) {
            toast.error("Authentication service is not available.");
            return;
          }
          const methods = await fetchSignInMethodsForEmail(auth, email);
          const providerMessage = methods.includes("google.com")
            ? "Google"
            : methods.includes("facebook.com")
            ? "Facebook"
            : methods.includes("microsoft.com")
            ? "Microsoft"
            : "another method";

          toast.error(
            `This email is already registered with ${providerMessage}.`
          );
        } catch {
          toast.error(
            "Account exists with a different provider. Please use the original login method."
          );
        }
      } else {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Social login failed. Please try again.";
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="flex justify-center mt-4 flex-wrap gap-3">
      {/* Google Button */}
      <button
        onClick={() => handleSocialLogin("Google")}
        className="flex items-center space-x-2 rounded-lg py-2 px-4 w-full max-w-xs justify-center transition duration-300 border-1 border-[#0D0D0D]"
      >
        <Google />
        <span>Google</span>
      </button>

      {/* Facebook Button */}
      <button
        onClick={() => handleSocialLogin("Facebook")}
        className="flex items-center space-x-2 rounded-lg py-2 px-4 w-full max-w-xs justify-center transition duration-300 border-1 border-[#0D0D0D]"
      >
        <Fb />
        <span>Facebook</span>
      </button>

      {/* Microsoft Button */}
      <button
        onClick={() => handleSocialLogin("Microsoft")}
        className="flex items-center space-x-2 rounded-lg py-2 px-4 w-full max-w-xs justify-center transition duration-300 border-1 border-[#0D0D0D]"
      >
        <Ms />
        <span>Microsoft</span>
      </button>
    </div>
  );
};

export default SocialLogin;
