"use strict";

const inputFirstname = document.getElementById("input-firstname");
const inputLastname = document.getElementById("input-lastname");
const inputUsername = document.getElementById("input-username");
const inputPassword = document.getElementById("input-password");
const inputPasswordConfirm = document.getElementById("input-password-confirm");
const btnSubmit = document.getElementById("btn-submit");

// Bắt sự kiện ấn vào nút Register
btnSubmit.addEventListener("click", function () {
  // Lấy dữ liệu nhập vào từ người dùng
  const user = new User(
    inputFirstname.value,
    inputLastname.value,
    inputUsername.value,
    inputPassword.value
  );

  // Check validate
  const isValidate = validate(user);

  if (isValidate) {
    // Thêm user vào mảng userArr
    userArr.push(user);
    // Lưu dữ liệu lại (update dữ liệu) xuống localStorage
    saveToStorage("userArr", userArr);

    alert("Đăng ký thành công !");

    // Điều hướng sang trang login

    window.location.href = "../pages/login.html";
  }
});

// Hàm validate thông tin đăng ký của người dùng vào form

function validate(user) {
  let isValidate = true;

  // 1. Không có trường nào bị bỏ trống.
  if (user.firstname.trim().length === 0) {
    alert("Vui lòng nhập First Name !");
    isValidate = false;
  }
  if (user.lastname.trim().length === 0) {
    alert("Vui lòng nhập Last Name !");
    isValidate = false;
  }
  if (user.username.trim().length === 0) {
    alert("Vui lòng nhập First Name !");
    isValidate = false;
  }

  // không dùng .trim().length === 0
  // vì password cần có hơn 8 ký tự và khoảng trắng cũng là 1 ký tự.
  if (user.password === "") {
    alert("Vui lòng nhập Password !");
    isValidate = false;
  }
  if (inputPasswordConfirm.value === "") {
    alert("Vui lòng nhập Confirm Password  !");
    isValidate = false;
  }

  // 2. Username không được trùng với các User name của các người trước đó.
  // if (
  //   // Nếu tồn tại 1 username nào đó trùng với username người dùng nhập thì
  //   !userArr.every((item) => (item.username !== user.username ? true : false))
  // ) {
  //   alert("User đã tồn tại !");
  //   isValidate = false;
  // }
  for (let i = 0; i < userArr.length; i++) {
    if (userArr[i].username === user.username) {
      alert("User Name đã tồn tại !");
      isValidate = false;
      break;
    }
  }

  // 3. Password và Confirm Password phải giống nhau
  if (user.password !== inputPasswordConfirm.value) {
    alert("Password và Confirm Password phải giống nhau !");
    isValidate = false;
  }

  // 4. Password phải có nhiều hơn 8 ký tự --> tức > 8 ký tự
  if (user.password.length <= 8) {
    alert("Password phải có nhiều hơn 8 ký tự !");
    isValidate = false;
  }
  return isValidate;
}
