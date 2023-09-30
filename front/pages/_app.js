import { CartContextProvider } from "@component/components/CartContext";
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
///url font chữ
  @import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;900&family=Roboto:wght@700&family=Rowdies:wght@700&display=swap');

  body{
    background-color:#eee;
    padding:0;
    margin: 0;
    font-family: 'Roboto Condensed', sans-serif;
  }
`;

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyles />
      
      <CartContextProvider>
        <Component {...pageProps} />
      </CartContextProvider>
    </>
  );
}
