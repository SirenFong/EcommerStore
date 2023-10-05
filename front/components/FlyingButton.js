import styled from "styled-components";
import { ButtonStyle } from "./Button";
import { primary } from "@component/lib/color";
import FlyingButtonOriginal from "react-flying-item";
import { useContext, useState } from "react";
import { CartContext } from "./CartContext";

const FlyingButtonWrapper = styled.div`
  button{
    ${ButtonStyle};
    ${props => props.main ? `
      background-color: ${primary};
      color:white;
    ` : `
      background-color: transparent;
      border: 1px solid ${primary};
      color:${primary};
    `}
    ${props => props.white && `
      background-color: white;
      border: 1px solid white;
      font-weight:500;
    `}
  }
  
`;

export default function FlyingButton(props) {
  const { addProduct } = useContext(CartContext);
  const { hovers, setHovers } = useState(0);
  return (
    <FlyingButtonWrapper
      main={props.main}
      onClick={() => addProduct(props._id)}>
      <FlyingButtonOriginal{...props}
        flyingItemStyling={{
          width: 'auto',
          height: 'auto',
          maxWidth: '60px',
          maxHeight: '60px',
          borderRadius: 0,
        }}
        targetTop={'5%'}
        targetLeft={'95%'} />
    </FlyingButtonWrapper>
  )
}