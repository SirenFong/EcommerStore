import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "@component/lib/mongodb";

export const authOptions = {
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_FRONT_ID,
      clientSecret: process.env.GOOGLE_FRONT_SECRET,
      redirectUri: "http://localhost:4000/signin/api/auth/callback/google",
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  // sử lý đăng nhập cho admin
};

export default NextAuth(authOptions);
