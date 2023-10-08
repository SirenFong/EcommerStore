import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@component/lib/mongodb";


export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_FRONT_ID,
      clientSecret: process.env.GOOGLE_FRONT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  // sử lý đăng nhập cho admin
};

export default NextAuth(authOptions);
