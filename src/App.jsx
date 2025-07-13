// App.jsx
import { useState, useEffect, useMemo, useCallback } from "react";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import ProductModal from "./components/ProductModal";
import History from "./pages/History";
import Chatbot from "./components/Chatbot";
import products from "./data/products";
import { debounce } from "lodash";

// Định nghĩa stopwords một lần, bên ngoài component
const STOP_WORDS = new Set([
  "tôi", "muốn", "cần", "với", "có", "của", "là", "thì",
  "một", "để", "và", "trong", "như", "ai", "gì", "nào",
  "được", "không", "cho", "về", "từ", "hay", "nhưng", "mà"
]);

// Hàm normalize text để xử lý tiếng Việt tốt hơn
const normalizeText = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u00C0-\u1EF9]/g, ' ') // Giữ lại ký tự Việt
    .replace(/\s+/g, ' ')
    .trim();
};

// Hàm tính điểm relevance
const calculateRelevance = (product, keywords) => {
  const content = normalizeText(`${product.name} ${product.shortDesc} ${product.longDesc}`);
  let score = 0;
  let exactMatches = 0;
  keywords.forEach(keyword => {
    if (normalizeText(product.name).includes(keyword)) {
      score += 10;
      exactMatches++;
    } else if (normalizeText(product.shortDesc).includes(keyword)) {
      score += 5;
      exactMatches++;
    } else if (normalizeText(product.longDesc).includes(keyword)) {
      score += 2;
      exactMatches++;
    }
  });
  if (exactMatches > 1) {
    score += exactMatches * 2;
  }
  return score;
};

function App() {
  const [page, setPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [viewHistory, setViewHistory] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatSuggestedProducts, setChatSuggestedProducts] = useState([]);

  const clearHistory = () => {
    setViewHistory([]);
  };

  const addToHistory = (product) => {
    setViewHistory((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) return prev;
      return [product, ...prev];
    });
  };

  const handleDetail = (product) => {
    setSelectedProduct(product);
    addToHistory(product);
  };

  const toggleFavorite = (product) => {
    const exists = favorites.find((p) => p.id === product.id);
    if (exists) {
      setFavorites(favorites.filter((p) => p.id !== product.id));
    } else {
      setFavorites([...favorites, product]);
    }
  };

  const handleChatMessage = (message) => {
    if (!message || typeof message !== 'string') {
      setChatSuggestedProducts([]);
      setPage("home");
      return;
    }

    const normalizedMessage = normalizeText(message);
    const keywords = normalizedMessage
      .split(' ')
      .filter(word => word.length > 1 && !STOP_WORDS.has(word))
      .slice(0, 10);

    if (keywords.length === 0) {
      setChatSuggestedProducts([]);
      setPage("home");
      return;
    }

    const matchedProducts = products
      .map(product => ({
        ...product,
        relevance: calculateRelevance(product, keywords)
      }))
      .filter(product => product.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 20)
      .map(({ relevance, ...product }) => product);

    setChatSuggestedProducts(matchedProducts);
    setPage("home");
  };

  const debouncedHandler = useMemo(
    () => debounce(handleChatMessage, 300),
    [products]
  );

  const optimizedChatHandler = useCallback((message) => {
    debouncedHandler(message);
  }, [debouncedHandler]);

  useEffect(() => {
    if (page === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [page]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 font-sans">
      <nav className="bg-white shadow-lg px-6 py-4 flex justify-between items-center sticky top-0 z-50 border-b">
        <h1 className="text-3xl font-bold text-purple-700 tracking-wide">EDU</h1>
        <div className="space-x-4 text-gray-700 font-medium">
          <button
            onClick={() => {
              if (page === "home") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                setPage("home");
              }
            }}
            className={`hover:text-purple-600 transition ${page === "home" ? "font-bold underline" : ""}`}
          >
            Trang chủ
          </button>
          <button
            onClick={() => setPage("favorites")}
            className={`hover:text-purple-600 transition ${page === "favorites" ? "font-bold underline" : ""}`}
          >
            Yêu thích ({favorites.length})
          </button>
          <button
            onClick={() => setPage("history")}
            className={`hover:text-purple-600 transition ${page === "history" ? "font-bold underline" : ""}`}
          >
            Lịch sử xem ({viewHistory.length})
          </button>
        </div>
      </nav>

      <main className="w-full px-6 py-6">
        {page === "home" && (
          <Home
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            onDetail={handleDetail}
            suggestedFromChat={chatSuggestedProducts}
          />
        )}
        {page === "favorites" && (
          <Favorites
            favorites={favorites}
            onDetail={handleDetail}
            onToggleFavorite={toggleFavorite}
          />
        )}
        {page === "history" && (
          <History
            history={viewHistory}
            onDetail={handleDetail}
            onToggleFavorite={toggleFavorite}
            favorites={favorites}
            clearHistory={clearHistory}
          />
        )}
      </main>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {showChatbot && <Chatbot onMessageSend={optimizedChatHandler} />}

      <button
        onClick={() => setShowChatbot(!showChatbot)}
        className="fixed bottom-6 right-6 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition z-50"
        title={showChatbot ? "Đóng Chatbot" : "Mở Chatbot"}
      >
        {showChatbot ? "✖️" : "💬"}
      </button>
    </div>
  );
}

export default App;
