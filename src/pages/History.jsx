import ProductCard from "../components/ProductCard";

function History({ history, onDetail, onToggleFavorite, favorites, clearHistory }) {
  return (
    <div className="p-6">
  <div className="flex justify-between items-center mb-4">
    <h1 className="text-2xl font-bold">🕓 Lịch sử xem</h1>
    {history.length > 0 && (
      <button
        onClick={() => {
          if (window.confirm("Bạn có chắc muốn xoá toàn bộ lịch sử không?")) {
            clearHistory();
          }
        }}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
      >
        🗑️ Xóa lịch sử
      </button>
    )}
  </div>

    
      {history.length === 0 ? (
        <p>Chưa có sản phẩm nào được xem.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {history.map((p) => (
  <ProductCard
    key={p.id}
    product={p}
    onDetail={onDetail}
    isFavorite={favorites.some((f) => f.id === p.id)}
    onToggleFavorite={onToggleFavorite}
  />
))}

        </div>
      )}
    </div>
  );
}

export default History;
