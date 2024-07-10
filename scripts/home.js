"use strict";
const loginModal = document.getElementById("login-modal");
const mainContent = document.getElementById("main-content");
const welcomeMessage = document.getElementById("welcome-message");
const btnLogout = document.getElementById("btn-logout");

displayHome();

// Hàm hiển thị nội dung trên trang Home một cách hợp lí tùy vào trường hợp người có đang đăng nhập hay không
function displayHome() {
  // Nếu có người đang đăng nhập thì ẩn "loginModal" và hiển thị "mainContent"
  if (userActive) {
    loginModal.style.display = "none";
    mainContent.style.display = "block";
    // thêm thông báo welcomeMessage
    welcomeMessage.textContent = `Welcome ${userActive.firstname}`;
  }

  // Nếu không có ai đang đăng nhập thì ẩn "mainContent" và hiển thị "loginModal"
  else {
    loginModal.style.display = "block";
    mainContent.style.display = "none";
  }
}

// Bắt sự kiện ấn vào nút Logout
btnLogout.addEventListener("click", function () {
  const isLogout = confirm("bạn chắc chắn muốn Logout chứ?");
  if (isLogout) {
    // gán giá trị userActive về null để biểu thị là không có ai đang đăng nhập
    userActive = null;
    // Lưu (cập nhật) dữ liệu xuống localStorage
    saveToStorage("userActive", userActive);
    // Hiển thị trang Home ở dạng chưa có user đăng nhập
    displayHome();
  }
});
