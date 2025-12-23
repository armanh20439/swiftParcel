"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react"; // ১. signIn ইম্পোর্ট করুন

type FormValues = {
  name: string;
  email: string;
  password: string;
};

const RegisterForm = () => {
  const router = useRouter();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const [alertMsg, setAlertMsg] = React.useState("");

  React.useEffect(() => {
    if (alertMsg) {
      const timer = setTimeout(() => setAlertMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [alertMsg]);

  // ২. গুগল লগইন হ্যান্ডলার
  const handleGoogleSignUp = async () => {
    
    try {
      // এটি সরাসরি ইউজারকে গুগল লগইন পেজে নিয়ে যাবে
      // সফল লগইনের পর আমাদের route.ts এর signIn কলব্যাক ডাটাবেসে ডাটা সেভ করবে
      await signIn("google", { callbackUrl: "/dashboard",redirect: true, }); 
      
    } catch (error) {
      console.error("Google Signin Error:", error);
      setAlertMsg("গুগল সাইন-ইন করতে সমস্যা হয়েছে।");
    }
  };

  const onSubmit = async (data: FormValues) => {
    const { name, email, password } = data;

    try {
      const resUserExists = await fetch("api/userExists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExists.json();

      if (user) {
        setAlertMsg("User already exists! Please give a new email.");
        return;
      }

      const res = await fetch("api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        reset();
        setAlertMsg("Account created successfully!");
        router.push("/login");
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
          {alertMsg && (
            <div className="toast toast-middle toast-center z-50">
              <div className="alert alert-info">
                <span>{alertMsg}</span>
              </div>
            </div>
          )}

          <h1 className="text-2xl font-bold text-center mb-2">Create an account</h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Start selling or tracking parcels with Swift Parcel.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* ... (বাকি ইনপুট ফিল্ডগুলো আগের মতই থাকবে) ... */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Full name</label>
              <input
                {...register("name", { required: "Name is required" })}
                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-lime-400"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-lime-400"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                {...register("password", { required: "Password is required", minLength: 6 })}
                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-lime-400"
                placeholder="Choose a strong password"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-lime-500 text-white py-2 rounded-md font-semibold hover:bg-lime-600 transition disabled:opacity-60"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account? <a href="/login" className="text-lime-600 hover:underline">Sign in</a>
            </p>

            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-gray-300" />
              <p className="text-sm text-gray-400">Or</p>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* ৩. গুগল বাটন আপডেট করা হয়েছে */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 border py-2 rounded-md hover:bg-gray-100 transition"
              onClick={handleGoogleSignUp}
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