import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // console.log("google_id",process.env.GOOGLE_CLIENT_ID)
        // 🔥 FIX 1: credentials undefined check
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const { email, password } = credentials;

        try {
          await connectMongoDB();

          const user = await User.findOne({ email });

          if (!user) {
      return null;
    }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (!passwordsMatch) {
      return null;
    }

          // 🔥 FIX 2: Return plain JSON object (NOT mongoose doc)
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error("Authorize Error:", error);
          throw new Error("Failed to authorize user");
        }
      },
    }),GoogleProvider({
      clientId:process.env.GOOGLE_CLIENT_ID as string,
      clientSecret:process.env.GOOGLE_CLIENT_SECRET as string,
      
    })
  ],

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
