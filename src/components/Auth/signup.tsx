"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import SocialLogin from "@/components/Auth/socialLogin";
import { createUserWithEmailAndPassword, AuthError } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRegisterUserMutation } from "@/redux/service/auth/authApi";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks/hooks";
import { setAccessToken, setRefreshToken } from "@/redux/features/auth";
import Cookies from "js-cookie";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function SignUpPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerUser, { isLoading }] = useRegisterUserMutation();

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

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (!auth) throw new Error("Authentication service is not available");

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      const idToken = await user.getIdToken();
      const refreshToken = user.refreshToken;

      if (user) {
        dispatch(setAccessToken(idToken));
        dispatch(setRefreshToken(refreshToken));
        Cookies.set("accessToken", idToken, { expires: 7 });
        Cookies.set("refreshToken", refreshToken, { expires: 7 });
        Cookies.set("role", "USER"); // adjust as per your model (e.g., "USER", "ADMIN", etc.)
      }

      await registerUser({
        idToken,
        refreshToken,
        role: "USER",
        userName: `${formData.firstName} ${formData.lastName}`,
        phoneNumber: formData.phone,
      }).unwrap();
      toast.success("Account Created Successfully");

      router.push("/");
    } catch (backendError: unknown) {
      console.error("Registration failed:", backendError);

      if (auth && auth.currentUser) {
        try {
          await auth.currentUser.delete();
          console.log("Rollback: Deleted Firebase user");
        } catch (deleteError) {
          console.error("Failed to delete Firebase user:", deleteError);
        }
      }

      let errorMessage = "Registration incomplete. Please try again.";

      if (isFetchBaseQueryError(backendError)) {
        const errData = (backendError.data as { message?: string }) || {};
        errorMessage = errData.message || errorMessage;
      } else if (isSerializedError(backendError)) {
        errorMessage = backendError.message || errorMessage;
      } else if (isFirebaseError(backendError)) {
        switch (backendError.code) {
          case "auth/email-already-in-use":
            setErrors((prev) => ({
              ...prev,
              email: "Email already in use. Try signing in.",
            }));
            return;
          case "auth/weak-password":
            setErrors((prev) => ({
              ...prev,
              password: "Password must be at least 6 characters",
            }));
            return;
          case "auth/invalid-email":
            setErrors((prev) => ({
              ...prev,
              email: "Invalid email address",
            }));
            return;
        }
      }

      toast.error(errorMessage);
    }
  };

  const isFirebaseError = (error: unknown): error is AuthError => {
    return typeof error === "object" && error !== null && "code" in error;
  };

  const isFetchBaseQueryError = (
    error: unknown
  ): error is FetchBaseQueryError => {
    return typeof error === "object" && error !== null && "status" in error;
  };

  const isSerializedError = (error: unknown): error is SerializedError => {
    return typeof error === "object" && error !== null && "message" in error;
  };

  return (
    <div className="min-h-screen flex p-5 md:p-10 ">
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Create Your Account
            </h1>
            <p className="text-gray-600 text-sm">
              Join{" "}
              <span className="font-semibold text-[#2D3194]">
                Barred<span className="text-[#FA8800]">Link</span>
              </span>{" "}
              to start shipping to the Caribbean
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  First name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-gray-400 border-gray-300"
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Last name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-gray-400 border-gray-300"
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

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
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-gray-400 border-gray-300"
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-gray-400 border-gray-300"
              />
              {errors.address && (
                <p className="text-xs text-red-500 mt-1">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-gray-400 border-gray-300 pr-8"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
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

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-gray-400 border-gray-300 pr-8"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#FA8800] text-white py-2 px-4 rounded-md font-medium text-sm hover:bg-gray-800 transition mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Have any questions?</p>
            <SocialLogin />
            <p className="mt-4">
              Already have an account?{" "}
              <Link href="/login">
                <button className="text-[#FA8800] font-medium">Sign in</button>
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ✅ Image code unchanged */}
      <div className="hidden md:flex md:w-1/2 bg-gray-100 items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src="/images/signup.png"
            alt="Signup illustration"
            fill
            className="w-full h-full object-fit"
            priority
          />
        </div>
      </div>
    </div>
  );
}
