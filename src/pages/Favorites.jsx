import ProductCard from "../components/ProductCard";

function Favorites({ favorites, onDetail, onToggleFavorite }) {
  return (
    
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">❤️ Danh sách yêu thích</h1>

      {favorites.length === 0 ? (
        <p>Chưa có sản phẩm nào được yêu thích.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {favorites.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isFavorite={true}
              onDetail={onDetail}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
    
  );
}

export default Favorites;
