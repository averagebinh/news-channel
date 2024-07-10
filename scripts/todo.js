"use strict";
// Nếu đang đăng nhập
if (userActive) {
  const todoList = document.getElementById("todo-list");
  const btnAdd = document.getElementById("btn-add");
  const inputTask = document.getElementById("input-task");
  displayTodoList();

  // Hàm hiển thị thông tin TodoList()
  function displayTodoList() {
    let html = "";

    // Từ mảng todoArr lọc ra các todo (task) là của user đang đăng nhập để hiển thị
    todoArr
      .filter((todo) => todo.owner === userActive.username) // sau dòng này ta sẽ có 1 mảng chứa các nhiệm vụ của tài khoản đang đăng nhập
      .forEach(function (todo) {
        html += `
        <li class=${todo.isDone ? "checked" : ""} >${
          todo.task
        }<span class="close">x</span></li>
        `;
      });
    todoList.innerHTML = html;

    // Bắt các sự kiện
    eventToggleTasks();
    eventDeleteTasks();
  }
  btnAdd.addEventListener("click", function () {
    // Kiểm tra xem người dùng đã thực sự nhập tên nhiệm vụ cần Add chưa?
    if (inputTask.value.trim() === 0) {
      alert("Vui lòng nhập nhiệm vụ !");
    } else {
      const todo = new Task(inputTask.value, userActive.username, false);
      // Thêm task mới vào todoArr
      todoArr.push(todo);
      // Lưu dữ liệu xuống localStorage
      saveToStorage("todoArr", todoArr);
      // Hiển thị lại list các nhiệm vụ
      displayTodoList();
      // Reset dữ liệu ở form nhập
      inputTask.value = "";
    }
  });

  // Hàm bắt sự kiện vào Toggle Tasks
  function eventToggleTasks() {
    // Lấy tất cả các phần tử li chứa thông tin của các task và bắt sự kiện Click trên từng phần li này
    document.querySelectorAll("#todo-list li").forEach(function (liEl) {
      liEl.addEventListener("click", function (e) {
        // Tránh nút delete ra ==> để khong bị chồng sự kiện khi ấn nút delete
        if (e.target !== liEl.children[0]) {
          // children[0] là thẻ span cho cái delete
          // toggle class checked
          liEl.classList.toggle("checked");
          // Tìm task vừa click vào (toggle)
          const todo = todoArr.find(
            (todoItem) =>
              todoItem.owner === userActive.username &&
              todoItem.task === liEl.textContent.slice(0, -1) // Lấy nội dung text chứa task, loại bỏ dấu x
          );
          // sau đó thay đổi thuộc tính isDone của nó
          todo.isDone = liEl.classList.contains("checked") ? true : false;
          // Lưu (cập nhật lại xuống localStorage)
          saveToStorage("todoArr", todoArr);
        }
      });
    });
  }
  // Hàm bắt sự kiện xóa các tasks
  function eventDeleteTasks() {
    // Lấy tất cả các phần tử nút delete bắt sự kiện Click trên từng phần tử ấy
    document.querySelectorAll("#todo-list .close").forEach(function (closeEl) {
      closeEl.addEventListener("click", function () {
        // Hỏi xác nhận xóa
        const isDelete = confirm("Bạn xác nhận chắc chắn muốn xóa chứ ?");
        if (isDelete) {
          // Tìm vị trí của task được ấn xóa trong mảng todoArr
          const index = todoArr.findIndex(
            (item) =>
              item.owner === userActive.username && // xác định tên user và tên task
              item.task === closeEl.parentElement.textContent.slice(0, -1)
          );
          // Xóa task đó ra khỏi mảng todoArr
          todoArr.splice(index, 1);
          // Lưu (cập nhật lại) dữ liệu xuống localStorage
          saveToStorage("todoArr", todoArr);

          // Hiển thị lại list Todo
          displayTodoList();
        }
      });
    });
  }
} else {
  alert("Vui lòng đăng nhập / đăng ký để truy cập ứng dụng");
  window.location.assign("../index.html");
}
