import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "@component/lib/mongodb";
import CredentialsProvider from "next-auth/providers/credentials";
import connectMongo from "@component/database/conn";
import { User } from "@component/models/User";
import { compare } from "bcrypt";

export const authOptions = {
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_FRONT_ID,
      clientSecret: process.env.GOOGLE_FRONT_SECRET,
      redirectUri: "http://localhost:4000/signin/api/auth/callback/google",
    }),
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials, req) {
        connectMongo().catch((error) => {
          error: "Connect Failed";
        });
        //check user
        const result = await User.findOne({ email: credentials.email });
        if (!result) {
          throw new Error("No User Found with Email");
        }
        //compare
        const checkPassword = await compare(
          credentials.password,
          result.password
        );

        //incorrect password
        if (!checkPassword || result.email !== credentials.email) {
          throw new Error("Email and password doesn't match ");
        }
        return result;
      },
    }),
  ],
  secret: "Hdjse/drqieTjcjaskd+VV32L/n+DjfjsdH0=",
  adapter: MongoDBAdapter(clientPromise),
  // sử lý đăng nhập cho admin
};

export default NextAuth(authOptions);
