--Yêu cầu hệ thống
Node.js >= 16

npm >= 8 hoặc yarn

--Cách cài đặt và chạy dự án
1. Tải mã nguồn
git clone https://github.com/your-username/eduai.git
cd eduai
2. Cài đặt thư viện
npm install
# hoặc dùng yarn
# yarn install
--Chạy ứng dụng ở chế độ dev
npm run dev
# hoặc
# yarn dev
Mở trình duyệt và truy cập: http://localhost:5173

--Build production
npm run build
Output sẽ được sinh ra trong thư mục dist/.

Để preview build production:

npm run preview
Cấu trúc thư mục
src/
│
├── assets/              # Ảnh minh họa sản phẩm
├── components/          # Component giao diện như Chatbot, Modal, ProductCard,...
├── data/products.js     # Danh sách khóa học
├── pages/               # Các trang chính (Home, Favorites, History)
├── services/            # API giả (gợi ý từ AI)
└── App.jsx              # Thành phần chính
--Tính năng nổi bật
Tìm kiếm & lọc sản phẩm
Xem chi tiết & thêm vào yêu thích
Ghi lại lịch sử xem
Gợi ý sản phẩm từ AI qua Chatbot
Mock API suggestions + hệ thống tính điểm relevance
Responsive, UI hiện đại

Tác giả
Lê Ưng Minh Trực – minhtrucle.010903@gmail.com