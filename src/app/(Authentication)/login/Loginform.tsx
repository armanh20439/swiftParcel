"use client";

import React from "react";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation"; 
import Link from "next/link";

const Loginform = () => {
  type FormValues = {
    email: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const router = useRouter();
  const searchParams = useSearchParams(); // url find by next/navigation
  const [loginError, setLoginError] = React.useState("");


  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  // Email/Password Submit 
  const onSubmit = async (data: FormValues) => {
    console.log("Login data:", data.email);
    
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: callbackUrl, 
      });

      if (res?.error) {
        setLoginError("Invalid email or password");
        // router.replace(callbackUrl); 
        return;
      }

      // if login complete redirect page where user wants
      router.replace(callbackUrl);
    } catch (error) {
      console.log(error);
      setLoginError("Something went wrong!");
    }
  };

  //  Google Login 
  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: callbackUrl }); 
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email", { required: "Email is required" })}
            placeholder="Enter your email"
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password", { required: "Password is required" })}
            placeholder="Enter your password"
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
          <a
            href="#"
            className="text-sm text-lime-600 hover:underline float-right mt-1"
          >
            Forgot password?
          </a>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-lime-500 text-white py-2 rounded-md hover:bg-lime-600 transition"
        >
          Login
        </button>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <Link href="/register" className="text-lime-600 hover:underline">
            Register
          </Link>
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3 my-3">
          <div className="flex-1 h-px bg-gray-300"></div>
          <p className="text-sm text-gray-400">Or</p>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin} 
          type="button"
          className="w-full flex items-center justify-center gap-2 border py-2 rounded-md hover:bg-gray-100 transition"
        >
          <FcGoogle size={20} /> Login with Google
        </button>
      </form>
      
      {/* Error Message Display */}
      {loginError && <p className="text-red-500 text-center mt-2">{loginError}</p>}
    </div>
  );
};

export default Loginform;