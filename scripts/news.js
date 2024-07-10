"use strict";

// Để vào điều kiện IF để khi người dùng chưa đăng nhập thì không thể dùng ...
if (userActive) {
  const newsContainer = document.getElementById("news-container");
  const btnPrev = document.getElementById("btn-prev");
  const pageNum = document.getElementById("page-num");
  const btnNext = document.getElementById("btn-next");

  // Biến này để tính số News tối đa trả về từ API
  let totalResults = 0;

  getDataNews("us", 1);

  // Hàm: lấy dữ liệu Data News từ API và hiển thị list News ra ứng dụng
  async function getDataNews(country, page) {
    try {
      // Kết nối với API và lấy dữ liệu
      const res = await fetch(
        `https://newsapi.org/v2/top-headlines?country=${country}&category=${userActive.category}&pageSize=${userActive.pageSize}&page=${page}&apiKey=d70f5b1073bb49ba9f343e9cc363f009`
      );
      const data = await res.json();
      console.log(data);

      // Check lỗi quá 100 lần request / ngày (Lỗi này khi ta kết nối đến API quá nhiều)
      if (data.status === "error" && data.code === "rateLimited") {
        throw new Error(data.message);
      }

      // Bắt lỗi khi chạy từ tập tin không thông qua server => chạy trên server sẽ không có lỗi này

      if (data.status === "error" && data.code === "corsNotAllowed") {
        throw new Error(data.message);
      }

      // Gọi hàm để hiển thị list News
      displayNewList(data);

      // Bắt lỗi
    } catch (err) {
      // Thông báo lỗi
      alert("Error:" + err.message);
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
      // ví dụ: có tối đa 70 tin tức, 70/6 11.3 => 12, trang thứ 12 có 4 tin
      btnNext.style.display = "none";
    } else {
      btnNext.style.display = "block";
    }
  }

  // Bắt sự kiện click vào nút Previous

  btnPrev.addEventListener("click", function () {
    // gọi hàm này để lấy dữ liệu và hiển thị danh sách các News trước đó
    getDataNews("us", --pageNum.textContent);
  });

  // Bắt sự kiện click vào nút Next
  btnNext.addEventListener("click", function () {
    // gọi hàm này để lấy dữ liệu và hiển thị danh sách các News tiếp theo
    getDataNews("us", ++pageNum.textContent);
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
