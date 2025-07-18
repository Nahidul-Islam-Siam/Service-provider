"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {confirmPasswordReset } from "firebase/auth";
import { auth } from "@/lib/firebase";
// import { useResetPasswordMutation } from "@/redux/service/auth/authApi";
import { toast } from "sonner";

interface FormData {
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function SetNewPassWord() {
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  const router = useRouter();

  // const [email, setEmail] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [resetPassword] = useResetPasswordMutation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateCode = async () => {
      try {
        if (!oobCode) throw new Error("Invalid or missing reset code.");
        if (!auth) throw new Error("Authentication is not initialized.");
        // const userEmail = await verifyPasswordResetCode(auth, oobCode);
        // setEmail(userEmail);
      } catch {
        setErrors({ confirmPassword: "Invalid or expired reset link." });
      } finally {
        setLoading(false);
      }
    };

    validateCode();
  }, [oobCode]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !oobCode) return;

    if (!auth) {
      setErrors({ confirmPassword: "Authentication is not initialized." });
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, formData.password);
      // await resetPassword({ email, password: formData.password }).unwrap();
      toast.success("Password has been reset successfully!");
      router.push("/login");
    } catch (error: unknown) {
      let errorMessage = "Something went wrong";
      if (error instanceof Error) {
        errorMessage = error.message;
        toast.error(errorMessage);
      }
      setErrors({ confirmPassword: errorMessage });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Verifying reset link...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex p-10">
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">
              Set New Password
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 shadow-md p-6">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Password
              </label>
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

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-gray-400 border-gray-300 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
            >
              Set New Password
            </button>
          </form>

          {/* <div className="mt-6 text-center text-xs text-gray-500">
            <p>New to the platform?</p>
            <p>
              <a href="#" className="text-[#FA8800] font-medium">
                Create an account
              </a>
            </p>
          </div> */}
        </div>
      </div>

      <div className="hidden md:flex md:w-1/2 bg-gray-100 items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src="/images/signup.png"
            alt="Set New Password Illustration"
            fill
            className="w-full h-full object-fit"
            priority
          />
        </div>
      </div>
    </div>
  );
}
