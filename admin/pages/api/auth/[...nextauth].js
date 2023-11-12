import { Admin } from "@/models/Admin";
import { mongooseConnect } from "@/lib/mongoose";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth, { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "@/lib/mongodb";

async function isAdminEmail(email) {
  mongooseConnect();
  return !!(await Admin.findOne({ email }));
}

export const authOptions = {
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  // sử lý đăng nhập cho admin
  callbacks: {
    session: async ({ session, token, user }) => {
      if (await isAdminEmail(session?.user?.email)) {
        return session;
      } else {
        return false;
      }
    },
  },
};
//Xác thực người dùng qua Google bằng nextauth
//Code được hỗ trợ bởi NextAuth
export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!(await isAdminEmail(session?.user?.email))) {
    res.status(401);
    res.end();
    throw "not an admin";
  }
}
