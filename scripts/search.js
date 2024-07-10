"use strict";
if (userActive) {
  const navPageNum = document.getElementById("nav-page-num");
  const inputQuery = document.getElementById("input-query");
  const btnSubmit = document.getElementById("btn-submit");

  const newsContainer = document.getElementById("news-container");
  const btnPrev = document.getElementById("btn-prev");
  const pageNum = document.getElementById("page-num");
  const btnNext = document.getElementById("btn-next");

  let totalResults = 0;
  let keywords = "";
  navPageNum.style.display = "none";

  btnSubmit.addEventListener("click", function () {
    pageNum.textContent = "1";
    newsContainer.innerHTML = "";
    // Kiểm tra xem người dùng đã nhập keywords chưa?
    if (inputQuery.value.trim() === 0) {
      // ẩn các nút chuyển trang nếu chưa nhập keywords
      navPageNum.style.display = "none";
      alert("Vui lòng nhập keywords để tìm kiếm !");
    } else {
      keywords = inputQuery.value;
      // Gọi hàm này để hiển thị list News lên trang ứng dụng
      getDataNewsByKeywords(keywords, 1);
    }
  });

  // hàm bất đồng bộ để lấy dữ liệu tin tức được tìm kiếm từ từ khóa nhập vào
  async function getDataNewsByKeywords(keywords, page) {
    try {
      const res = await fetch(
        `https://newsapi.org/v2/everything?q=${keywords}}&sortBy=revelancy&pageSize=${userActive.pageSize}&page=${page}&apiKey=d70f5b1073bb49ba9f343e9cc363f009`
      );
      const data = await res.json();

      // Check lỗi quá 100 lần request / ngày
      if (data.status === "error" && data.code === "rateLimited") {
        // ẩn các nút chuyển trang nếu có lỗi
        navPageNum.style.display = "none";
        throw new Error(data.message);
      }

      // Nếu không có bài viết nào thì thông báo

      if (data.totalResults == 0) {
        // ẩn các nút chuyển trang nếu có lỗi
        navPageNum.style.display = "none";
        throw new Error(
          "Không có bài nào phù hợp với từ khóa bạn tìm kiếm, thử lại bằng cách nhập từ khóa mới !"
        );
      }
      // bắt lỗi khi chạy từ tập tin không thông qua server ==> chạy trên server sẽ không có lỗi này
      if (data.code === "corsNotAllowed") {
        throw new Error(data.message);
      }
      // Hiển thị các nút chuyển trang nếu dữ liệu trả về thành công và không phát sinh lỗi
      navPageNum.style.display = "block";

      // Gọi hàm để hiển thị list News
      displayNewList(data);

      // Bắt lỗi
    } catch (err) {
      // Thông báo lỗi
      alert(err.message);
    }
  }

  // Hàm: Kiểm tra điều kiện ẩn và ẩn nút Previous
  function checkBtnPrev() {
    // Nếu page Number là 1 thì ẩn đi

    if (pageNum.textContent == 1) {
      btnPrev.style.display = "none";
    } else {
      btnPrev.style.display = "block";
    }
  }

  // Hàm: Kiểm tra điều kiện ẩn và ẩn nút Next
  function checkBtnNext() {
    // Nếu page Number bằng với -> làm tròn lên (tổng số tin tức tối đa API trả về / số tin tức hiển thị trên một trang ứng dụng)
    if (pageNum.textContent == Math.ceil(totalResults / userActive.pageSize)) {
      btnNext.style.display = "none";
    } else {
      btnNext.style.display = "block";
    }
  }

  // Bắt sự kiện click vào nút Previous
  btnPrev.addEventListener("click", function () {
    // gọi hàm này để lấy dữ liệu và hiển thị danh sách các News trước đó
    getDataNewsByKeywords(keywords, --pageNum.textContent);
  });

  // Bắt sự kiện click vào nút Next
  btnNext.addEventListener("click", function () {
    // gọi hàm này để lấy dữ liệu và hiển thị danh sách các News tiếp theo
    getDataNewsByKeywords(keywords, ++pageNum.textContent);
  });

  // Hàm hiển thị list News lên trang
  function displayNewList(data) {
    // Lấy giá trị cho biến totalResults
    totalResults = data.totalResults;
    // Kiểm tra xem có ẩn các nút Next, Previous hay chưa và ẩn đi
    checkBtnPrev();
    checkBtnNext();

    let html = "";
    // Tạo các code HTML các News để hiển thị
    // no_image_available.jpg để thay thế cho 1 số ảnh có giá trị đường dẫn
    data.articles.forEach(function (article) {
      html += `
      <div class="card flex-row flex-wrap">
            <div class="card mb-3" style="">
              <div class="row no-gutters">
                <div class="col-md-4">
                  <img
                    src=${
                      article.urlToImage
                        ? article.urlToImage
                        : "no_image_found.png"
                    }
                    class="card-img"
                    alt="img"
                  />
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title">
                    ${article.title}
                    </h5>
                    <p class="card-text">
                    ${article.description}
                    </p>
                    <a
                      href=${article.url}
                      class="btn btn-primary"
                      >View</a
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          `;
    });
    newsContainer.innerHTML = html;
  }
  // Nếu chưa đăng nhập thì thông báo người dùng đăng nhập để truy cập vào
} else {
  alert("Vui lòng đăng nhập / đăng ký để truy cập ứng dụng");
  window.location.assign("../index.html");
}
