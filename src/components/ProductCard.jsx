function ProductCard({ product, onDetail, isFavorite, onToggleFavorite }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 hover:shadow-lg transition relative">
      <img src={product.image} alt={product.name} className="rounded-md h-40 object-cover" />

      <button
        onClick={() => onToggleFavorite(product)}
        className="absolute top-3 right-3 text-xl"
        title="Yêu thích"
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>

      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p className="text-gray-500">{product.shortDesc}</p>
      <p className="text-blue-600 font-bold">
        {product.price.toLocaleString()}đ
      </p>

      <button
        onClick={() => onDetail(product)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Xem chi tiết
      </button>
    </div>
  );
}

export default ProductCard;
