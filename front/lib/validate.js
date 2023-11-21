export default function login_validate(values) {
  const errors = {};

  //email
  if (!values.email) {
    errors.email = "Email không được để trống";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Địa chỉ Email chưa đúng định dạng";
  }

  //password
  if (!values.password) {
    errors.password = "Mật khẩu không được để trống";
  } else if (values.password.length < 5 || values.password.length > 20) {
    errors.password = "Mật khẩu phải đủ 5 ký từ và ít hơn 20 ký tự";
  }
  return errors;
}

export function register_validate(values) {
  const errors = {};
  if (!values.name) {
    errors.name = "Tên người dùng không được để trống";
  }

  if (!values.email) {
    errors.email = "Email không được để trống";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Địa chỉ Email chưa đúng định dạng";
  }

  if (!values.password) {
    errors.password = "Mật khẩu không được để trống";
  } else if (values.password.length < 5 || values.password.length > 20) {
    errors.password = "Mật khẩu phải đủ 5 ký từ và ít hơn 20 ký tự";
  }

  //validate confirm password
  if (!values.cfpassword) {
    errors.cfpassword = "Xác nhận mật khẩu không được để trống";
  } else if (values.password !== values.cfpassword) {
    errors.cfpassword = "Xác nhận mật khẩu không trùng mật khẩu";
  } else if (values.cfpassword.includes("")) {
    errors.cfpassword = "Xác nhận mật khẩu không hợp lệ";
  }

  return errors;
}
