// src/pages/Home.jsx
import { useState, useRef } from "react";
import products from "../data/products";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import SearchFilter from "../components/SearchFilter";
import { fetchSuggestions } from "../services/suggestionService";
import { useEffect } from "react";


function Home({ favorites, toggleFavorite, onDetail, suggestedFromChat = [] }) {
 const [selectedProduct, setSelectedProduct] = useState(null);
const [search, setSearch] = useState("");
const [filter, setFilter] = useState("all");
const [suggestedProducts, setSuggestedProducts] = useState([]);
const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
const [suggestionError, setSuggestionError] = useState("");

useEffect(() => {
  if (suggestedFromChat.length > 0) {
    setSearch("");
    setFilter("all");
  }
}, [suggestedFromChat]);


  const suggestionRef = useRef(null);

  const handleSuggest = async () => {
    setIsLoadingSuggestions(true);
    setSuggestionError("");
    try {
      const suggestions = await fetchSuggestions("user123");
      setSuggestedProducts(suggestions);
      setTimeout(() => {
        suggestionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setSuggestionError("Không thể lấy gợi ý lúc này ");
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all"
        ? true
        : filter === "<500"
        ? p.price < 500000
        : filter === "500-1000"
        ? p.price >= 500000 && p.price <= 1000000
        : p.price > 1000000;

    return matchSearch && matchFilter;
  });

  const displayProducts = suggestedFromChat.length > 0 ? suggestedFromChat : filteredProducts;

 return (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">
      {suggestedFromChat.length > 0 ? "Kết quả từ Chatbot AI" : "Danh sách sản phẩm"}
    </h1>

    {/* Ẩn bộ lọc khi đang có kết quả từ chatbot */}
    {suggestedFromChat.length === 0 && (
      <>
        <SearchFilter
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
        />

        <button
          onClick={handleSuggest}
          className="mb-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
           Gợi ý sản phẩm phù hợp
        </button>
      </>
    )}

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {displayProducts.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          onDetail={onDetail}
          isFavorite={favorites.some((f) => f.id === p.id)}
          onToggleFavorite={toggleFavorite}
        />
      ))}
    </div>

    {isLoadingSuggestions && (
      <p className="text-gray-500 mt-4">⏳ Đang tải gợi ý...</p>
    )}

    {suggestionError && (
      <p className="text-red-500 mt-4">{suggestionError}</p>
    )}

    {suggestedProducts.length > 0 && (
      <div ref={suggestionRef} className="mt-8">
        <h2 className="text-xl font-semibold mb-2"> Sản phẩm gợi ý cho bạn</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {suggestedProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onDetail={onDetail}
              isFavorite={favorites.some((f) => f.id === p.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </div>
    )}

    <ProductModal
      product={selectedProduct}
      onClose={() => setSelectedProduct(null)}
    />
  </div>
);
} 

export default Home;
