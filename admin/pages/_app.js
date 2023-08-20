import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";


//Code được hỗ trợ bởi NextAuth
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
