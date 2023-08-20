import Nav from "@/components/Nav";
import { useSession, signIn, signOut } from "next-auth/react";
export default function Layout({ children }) {
  const { data: session } = useSession();

  //Kiểm tra session xem có đang đăng nhập hay là không?
  if (!session) {
    return (
      <div className="bg-blue-900 w-screen h-screen flex items-center">
        <div className="text-center w-full">
          <button
            onClick={() => signIn("google")}
            className="bg-white p-2 px-4 rounded-lg"
          >
            Đăng nhập với Google
          </button>
        </div>
      </div>
    );
  }

  //Nếu đã đăng nhập sẽ trả về thông tin đăng nhập
  return (
    <div className="bg-blue-900 min-h-screen flex">
      <Nav />
      {
        <div className="bg-white flex-grow mt-2 mr-2 mb-2 rounded-lg p-4">
          {children}
        </div>
      }
    </div>
  );
}
