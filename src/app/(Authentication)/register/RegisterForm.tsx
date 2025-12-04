"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";

type FormValues = {
  name: string;
  email: string;
  password: string;
};

const RegisterForm = () => {
    const router= useRouter();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const [alertMsg, setAlertMsg] = React.useState("");

  // Auto hide alert after 3 seconds
  React.useEffect(() => {
    if (alertMsg) {
      const timer = setTimeout(() => setAlertMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [alertMsg]);

  const onSubmit = async (data: FormValues) => {
    const { name, email, password } = data;

    try {
      // Check if user exists
      const resUserExists = await fetch("api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExists.json();

      if (user) {
        setAlertMsg("User already exists! Please give a new email.");
        return;
      }

      // Register user
      const res = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (res.ok) {
        reset();
        router.push("/login")
        setAlertMsg("Account created successfully!");
      } else {
        setAlertMsg("Failed to register user!");
      }
    } catch (error) {
      console.log(error);
      setAlertMsg("Something went wrong!");
    }
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">

          {/* DaisyUI Alert */}
          {alertMsg && (
            <div className="toast toast-middle toast-center">
  <div className="alert alert-info">
    <span>{alertMsg}</span>
  </div>
  
</div>
          )}

          {/* Header */}
          <h1 className="text-2xl font-bold text-center mb-2">Create an account</h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Start selling or tracking parcels with Swift Parcel.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full name
              </label>
              <input
                id="name"
                {...register("name", {
                  required: "Name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" },
                })}
                placeholder="Your full name"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Enter a valid email" },
                })}
                placeholder="name@company.com"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
                placeholder="Choose a strong password"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-lime-500 text-white py-2 rounded-md font-semibold hover:bg-lime-600 transition disabled:opacity-60"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <a href="/login" className="text-lime-600 hover:underline">
                Sign in
              </a>
            </p>

            {/* Divider */}
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-gray-300" />
              <p className="text-sm text-gray-400">Or</p>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* Google Signup */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 border py-2 rounded-md hover:bg-gray-100 transition"
              onClick={() => console.log("Google signup clicked")}
            >
              <FcGoogle size={20} /> Continue with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
