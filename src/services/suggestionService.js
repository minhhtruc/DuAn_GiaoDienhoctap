// API giả: trả về danh sách sản phẩm gợi ý (hardcode)
const mockSuggestions = [
  {
    id: 100,
    name: "Gợi ý: Khóa học Machine Learning",
    price: 1499000,
    image: "/images/machine.png",
    shortDesc: "Học cách xây dựng mô hình AI thực tế.",
    longDesc: "Khóa học cung cấp kiến thức về supervised learning, unsupervised, model evaluation và thực hành scikit-learn."
  },
  {
    id: 101,
    name: "Gợi ý: Khóa học IELTS 8.0",
    price: 1099000,
    image: "/images/ieltss.png",
    shortDesc: "Đạt 8.0+ với chiến lược luyện đề & speaking.",
    longDesc: "Hướng dẫn phương pháp luyện tập, giải đề, viết essay và kỹ năng nói hiệu quả theo tiêu chuẩn kỳ thi IELTS."
  },
  {
    id: 102,
    name: "Gợi ý: UI/UX Design từ cơ bản",
    price: 890000,
    image: "/images/ux_ui.jpg",
    shortDesc: "Thiết kế trải nghiệm người dùng với Figma.",
    longDesc: "Khóa học giúp bạn nắm vững tư duy thiết kế, prototype, wireframe và nguyên tắc UX thực tế."
  },
  {
    id: 103,
    name: "Gợi ý: Lập trình Web Fullstack MERN",
    price: 1899000,
    image: "/images/MERN.jpg",
    shortDesc: "React, Node, MongoDB, Express full dự án.",
    longDesc: "Khóa học giúp bạn xây dựng ứng dụng web hiện đại với React frontend và backend Node/Express."
  },
  {
    id: 104,
    name: "Gợi ý: Tiếng Anh giao tiếp với người Mỹ",
    price: 799000,
    image: "/images/tienganhgt.jpg",
    shortDesc: "Luyện phát âm và phản xạ giao tiếp thật.",
    longDesc: "Khóa học có giáo viên bản ngữ hỗ trợ luyện speaking, thực hành hội thoại thực tế."
  },
  {
    id: 105,
    name: "Gợi ý: Data Analysis với Python",
    price: 1299000,
    image: "/images/data.jpg",
    shortDesc: "Xử lý dữ liệu thực tế với Pandas & Matplotlib.",
    longDesc: "Học cách thu thập, xử lý, trực quan hóa và phân tích dữ liệu bằng Python, pandas, matplotlib."
  }
];

export const fetchSuggestions = async (userId) => {
  // Giả lập gọi API + delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(mockSuggestions);
      // reject("Lỗi API") // để test error
    }, 1000);
  });
};
