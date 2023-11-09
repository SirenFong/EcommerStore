import React from "react";
import styled from "styled-components";
const Footernav = styled.div`
  width: 100%;
  height: 60px; /* Height of the footer */
`;
const Footer = () => (
  <Footernav>
    <div class="p-3"></div>
    <div class=" bg-white">
      <div class="container">
        <div class="py-3 ">
          <ul class="nav justify-content-center border-bottom pb-3 mb-3">
            <li class="nav-item">
              <a href="#" class="nav-link px-2 text-muted">
                Trang chủ
              </a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link px-2 text-muted">
                Tin tức
              </a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link px-2 text-muted">
                Giá cả
              </a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link px-2 text-muted">
                FAQ
              </a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link px-2 text-muted">
                Về chúng tôi
              </a>
            </li>
          </ul>
          <p class="text-center text-muted">© 2023 ThanhThuongCompany, Inc</p>
        </div>
      </div>
    </div>
  </Footernav>
);

export default Footer;
