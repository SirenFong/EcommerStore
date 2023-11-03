import { CartContextProvider } from "@component/components/CartContext";
import { createGlobalStyle } from "styled-components";
import { SessionProvider } from "next-auth/react";
import "bootstrap/dist/css/bootstrap.css";
import { useEffect } from "react";

const GlobalStyles = createGlobalStyle`
///url font chữ
  @import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;900&family=Roboto:wght@700&family=Rowdies:wght@700&display=swap');

  body{
    background-color:#eee;
    padding:0;
    margin: 0;
    font-family: 'Roboto Condensed', sans-serif;
  }
  hr{
    display: block;
    border:0;
    border-top:1px solid #ccc;
  }
`;


export default function App({ Component, pageProps: { session, ...pageProps } }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);
  return (
    <>
      <GlobalStyles />
      <SessionProvider session={session}>
        <CartContextProvider>
          <Component {...pageProps} />
        </CartContextProvider>
      </SessionProvider>
    </>
  );
}
