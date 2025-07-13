import { useState, useEffect } from "react";

function ProductModal({ product, onClose }) {
  if (!product) return null;

  const [ratings, setRatings] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newStars, setNewStars] = useState(5);

  const localStorageKey = `ratings-${product.id}`;

  // Load đánh giá từ localStorage khi mở modal
  useEffect(() => {
    const saved = localStorage.getItem(localStorageKey);
    if (saved) {
      setRatings(JSON.parse(saved));
    } else {
      setRatings([]);
    }
  }, [product]);

  // Gửi đánh giá
  const handleAddRating = () => {
    if (!newComment.trim()) return;

    const newRating = {
      user: "Ẩn danh",
      comment: newComment,
      stars: newStars,
    };

    const updated = [...ratings, newRating];
    setRatings(updated);
    localStorage.setItem(localStorageKey, JSON.stringify(updated));

    setNewComment("");
    setNewStars(5);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[90%] max-w-2xl p-6 relative shadow-xl animate-fadeIn animate-slideUp">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
        >
          ✕
        </button>

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover rounded-md mb-4"
        />
        <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
        <p className="text-gray-700 mb-2">{product.longDesc}</p>
        <p className="text-blue-600 text-lg font-semibold mb-4">
          Giá: {product.price.toLocaleString()}đ
        </p>

        {/* Hiển thị đánh giá */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Đánh giá sản phẩm:</h3>
          {ratings.length > 0 ? (
            <ul className="space-y-2 mt-2">
              {ratings.map((r, idx) => (
                <li key={idx} className="bg-gray-100 p-2 rounded">
                  <p className="font-medium">
                    {r.user} - {r.stars}⭐
                  </p>
                  <p>{r.comment}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic mt-2">Chưa có đánh giá nào</p>
          )}
        </div>

        {/* Thêm đánh giá */}
        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-semibold mb-2">Thêm đánh giá của bạn:</h3>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Nhận xét của bạn..."
            className="w-full border rounded p-2 mb-2"
            rows={2}
          />
          <div className="flex items-center gap-2 mb-3">
            <label>Số sao:</label>
            <select
              value={newStars}
              onChange={(e) => setNewStars(parseInt(e.target.value))}
              className="border px-2 py-1 rounded"
            >
              {[5, 4, 3, 2, 1].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddRating}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
            >
              Gửi đánh giá
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
