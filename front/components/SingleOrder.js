import axios from "axios";
import styled from "styled-components";


const StyledOrder = styled.div`
  margin: 10px 0;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
  display: flex;
  gap: 20px;
  align-items: center;
  time {
    font-size: 1rem;
    color: #555;
  }
`;
const ProductRow = styled.div`
  span {
    color: #aaa;
  }
`;

const Address = styled.div`
  font-size: 0.8rem;
  line-height: 1rem;
  margin-top: 5px;
  color: #888;
`;
const ButtonCancer = styled.div`
 border:0;
  padding: 5px 15px;
  border-radius: 5px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  font-family: 'Poppins', sans-serif;
  font-weight:500;
  font-size: 15px;
  background-color:#ff9999;
  color:
  svg{
    height: 16px;
    margin-right: 5px;
  }
`;
const TitleCancel = styled.div`
 border:0;
  padding: 5px 15px;
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  font-family: 'Poppins', sans-serif;
  font-weight:500;
  font-size: 15px;
  
  color:#ff9999;
 
`;
export default function SingleOrder({ _id, line_items, status, createdAt, ...rest }) {
  function cancer(_id) {

    const data = {
      _id: _id,
      status: 0,

    }

    axios.put("/api/orders", data);


  }
  return (
    <StyledOrder>

      <div>
        <time>{new Date(createdAt).toLocaleString("sv-SE")}</time>
        <Address>
          Tên khách hàng: {rest.name}
          <br />
          Địa chỉ Email: {rest.email}
          <br />
          Số điện thoại: {rest.phone}
          <br />
          Địa chỉ: {rest.address}
          <br />
          PostalCode: {rest.postalcode}
        </Address>
      </div>
      {line_items.map((item) => (
        <div key={item.price_data.product_data.name} className="center flex">
          <div>
            <ProductRow >
              <span>{item.quantity} x </span>
              {item.price_data.product_data.name}
            </ProductRow>
          </div>
        </div>

      ))}

      <div>
        {status === 0 && <TitleCancel>Đơn hàng đã hủy </TitleCancel>
          || status === 1 && ("Đang chờ xác nhận")
          || status === 2 && ("Đã xác nhận")
          || status === 3 && ("Đang giao hàng")
          || status === 4 && ("Đã nhận hàng")}
      </div>
      <div>
        {status === 1 ?
          <ButtonCancer onClick={() => cancer(_id)}> hủy đơn hàng</ButtonCancer> : ""
            || status === 0 ? <div> </div> :
            <div> không thể hủy đơn hàng</div>
              || status === 4 ? <ButtonCancer > hoàn trả hàng lỗi</ButtonCancer> : ""}
      </div>

    </StyledOrder >
  );
}
