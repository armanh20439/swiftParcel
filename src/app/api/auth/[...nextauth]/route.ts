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

          // If user exists but registered via Google 
          if (!user.password) {
            throw new Error("This account is linked with Google. Please login with Google.");
          }

          const passwordsMatch = await bcrypt.compare(credentials.password, user.password);
          if (!passwordsMatch) return null;

          // Return user data for JWT
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
    // 1. Handle Google Sign-In and Database Sync
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectMongoDB();
          let userInDB = await User.findOne({ email: user.email });

          if (!userInDB) {
            // Register new Google user in DB
            const newUser = await User.create({
              name: user.name,
              email: user.email,
              role: "user", // Default role
              // password remains empty/undefined as required: false in model
            });
            user.id = newUser._id.toString();
            (user as any).role = newUser.role;
          } else {
            // Map existing user data to session
            user.id = userInDB._id.toString();
            (user as any).role = userInDB.role;
          }
          return true;
        } catch (error) {
          console.error("Error during Google Sign In:", error);
          return false; // Triggers AccessDenied
        }
      }
      return true;
    },

    // 2. Persist Data into JWT Token
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      
      // Update token if session is updated manually (e.g., after becoming a rider)
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }
      
      return token;
    },

    // 3. Make Token Data Available in Client Session
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