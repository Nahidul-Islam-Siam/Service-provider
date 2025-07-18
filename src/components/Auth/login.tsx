"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import SocialLogin from "@/components/Auth/socialLogin"; // No need to pass onLogin anymore
import { useLoginUserMutation } from "@/redux/service/auth/authApi";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks/hooks";
import {
  setAccessToken,
  setRefreshToken,
  setUser,
} from "@/redux/features/auth";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function Login() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      if (!auth) {
        throw new Error("Auth service is not available");
      }

      const result: import("firebase/auth").UserCredential =
        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
      const idToken = await result.user.getIdToken();
      const refreshToken = result.user.refreshToken;

      if (result) {
        dispatch(setAccessToken(idToken));
        dispatch(setRefreshToken(refreshToken));
      }

      const response = await loginUser({ idToken, refreshToken }).unwrap();
      const role = response?.data?.userInfo?.role;


      if (response?.success) {
        const user = {
          name: response?.data?.userInfo?.name,
          email: response?.data?.userInfo?.email,
          phone: response?.data?.userInfo?.phone,
          role: response?.data?.userInfo?.role,
          id: response?.data?.userInfo?.id,
        };

        dispatch(setUser({ user }));
      }

      if (idToken) {
        Cookies.set("accessToken", idToken, {
          expires: rememberMe ? 7 : undefined,
        });
        Cookies.set("refreshToken", refreshToken, {
          expires: rememberMe ? 7 : undefined,
        });
        Cookies.set("role", role, { expires: rememberMe ? 7 : undefined });

        toast.success("Login Successful");
        router.push("/");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(error.message || "Login error occurred.");
      } else {
        toast.error("Login error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen flex p-10">
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign in</h1>
            <p className="text-gray-600 text-sm">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-gray-400 border-gray-300"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="block text-sm text-gray-700 mb-1">
                  Password
                </label>
                <div className="text-right mt-1">
                  <a
                    href="/forgot-password"
                    className="text-xs text-gray-500 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-gray-400 border-gray-300 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center space-x-2 mt-4">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4"
              />
              <label className="text-sm text-gray-600">Remember me</label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#FA8800] text-white py-2 px-4 rounded-md font-medium text-sm hover:bg-gray-800 transition mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>New to the platform?</p>
            <p>
              <a href="/signup" className="text-[#FA8800] font-medium">
                Create an account
              </a>
            </p>
          </div>

          {/* Social Login: No need to pass `onLogin` prop */}
          <SocialLogin />
        </div>
      </div>

      {/* Image section retained */}
      <div className="hidden md:flex md:w-1/2 bg-gray-100 items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src="/images/signup.png"
            alt="Login illustration"
            fill
            className="w-full h-full object-fit"
            priority
          />
        </div>
      </div>
    </div>
  );
}
