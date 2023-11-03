import React from "react"
import styled from "styled-components";
const Footernav = styled.div`
  position:absolute;
   bottom:0;
   width:100%;
   height:60px;   /* Height of the footer */
   ;
`;
const Footer = () =>
    <Footernav>
        <div class="p-3"></div>
        <div class=" bg-white">
            <div class="container">
                <div class="py-3 ">
                    <ul class="nav justify-content-center border-bottom pb-3 mb-3">
                        <li class="nav-item"><a href="#" class="nav-link px-2 text-muted">Home</a></li>
                        <li class="nav-item"><a href="#" class="nav-link px-2 text-muted">Features</a></li>
                        <li class="nav-item"><a href="#" class="nav-link px-2 text-muted">Pricing</a></li>
                        <li class="nav-item"><a href="#" class="nav-link px-2 text-muted">FAQs</a></li>
                        <li class="nav-item"><a href="#" class="nav-link px-2 text-muted">About</a></li>
                    </ul>
                    <p class="text-center text-muted">© 2021 Company, Inc</p>
                </div>
            </div>
        </div>
    </Footernav>


export default Footer