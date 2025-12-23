import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        try {
          await connectMongoDB();
          const user = await User.findOne({ email: credentials.email });

          if (!user) return null;

          // যদি গুগল দিয়ে অ্যাকাউন্ট খোলা থাকে কিন্তু পাসওয়ার্ড না থাকে
          if (!user.password) {
            throw new Error("Please log in with Google.");
          }

          const passwordsMatch = await bcrypt.compare(credentials.password, user.password);
          if (!passwordsMatch) return null;

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role || "user",
          };
        } catch (error) {
          console.error("Authorize Error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    // ১. গুগল সাইন-ইন এর সময় ডাটাবেসে ডাটা সেভ করা
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectMongoDB();
          const userExists = await User.findOne({ email: user.email });

          if (!userExists) {
            // নতুন ইউজার হলে ডাটাবেসে সেভ হবে
            const newUser = await User.create({
              name: user.name,
              email: user.email,
              role: "user", // ডিফল্ট রোল
            });
            // টোকেনে পাঠানোর জন্য আইডি সেট করা
            user.id = newUser._id.toString();
            (user as any).role = newUser.role;
          } else {
            // পুরাতন ইউজার হলে তার আইডি অবজেক্টে সেট করা
            user.id = userExists._id.toString();
            (user as any).role = userExists.role;
          }
          return true;
        } catch (error) {
          console.log("Error checking/saving user:", error);
          return false; // এখান থেকে false দিলে Access Denied দেখাবে
        }
      }
      return true;
    },

    // ২. টোকেনে আইডি ও রোল সেভ করা
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },

    // ৩. সেশনে আইডি ও রোল এভেলেবল করা
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
    error: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };