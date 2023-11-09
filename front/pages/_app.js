import { CartContextProvider } from "@component/components/CartContext";
import { createGlobalStyle } from "styled-components";
import { SessionProvider } from "next-auth/react";
import "bootstrap/dist/css/bootstrap.css";
import { useEffect } from "react";
<<<<<<< HEAD
import { CategoryContext, CategoryProvider } from "@component/components/CategoryContext";
=======
import { CategoryContextProvider } from "@component/components/CategoryContext";
>>>>>>> eeafbc9f60a2cc7e5eaaee59ea844efffe06c101

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

<<<<<<< HEAD

export default function App({ Component, pageProps: { CategoryContext, session, ...pageProps } }) {

=======
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
>>>>>>> eeafbc9f60a2cc7e5eaaee59ea844efffe06c101
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);
  return (
    <>
      <GlobalStyles />
      <SessionProvider session={session}>
<<<<<<< HEAD
        <CategoryProvider category={CategoryContext}>
          <CartContextProvider>
            <Component {...pageProps} />
          </CartContextProvider>
        </CategoryProvider>


=======
        <CategoryContextProvider>
          <CartContextProvider>
            <Component {...pageProps} />
          </CartContextProvider>
        </CategoryContextProvider>
>>>>>>> eeafbc9f60a2cc7e5eaaee59ea844efffe06c101
      </SessionProvider>
    </>
  );
}
