import { useSession } from "next-auth/react";

export default function HomeHeader() {
  const { data: session } = useSession();
  return (
    <div className="text-blue-900 flex justify-between">
      <h2 className="mt-0">
        Xin chào, <b>{session?.user?.name}</b> hôm nay bạn thế nào?
      </h2>
      <div className="hidden sm:block">
        <div>
          <div className="bg-gray-300 flex gap-1 text-black rounded-lg overflow-hidden">
            <img src={session?.user?.image} alt="" className="w-6 h-6" />
            <span className="px-2">{session?.user?.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
