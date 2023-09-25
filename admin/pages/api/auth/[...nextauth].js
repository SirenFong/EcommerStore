import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from '@/lib/mongodb'



const adminEmails = ['thanhtranthai2412@gmail.com']

export const authOptions = {

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  // sử lý đăng nhập cho admin
  callbacks: {
    session: ({ session, token, user }) => {
      if (adminEmails.includes(session?.user?.email)) {
        return session
      } else {
        return false
      }
      // console.log({ session, token, user })

    }
  }
}




//Xác thực người dùng qua Google bằng nextauth
//Code được hỗ trợ bởi NextAuth
export default NextAuth(authOptions)

////xác thực cho admin
export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!adminEmails.includes(session?.user?.email)) {
    res.status(401)
    res.end()
    throw 'not an admin'
  }

}
