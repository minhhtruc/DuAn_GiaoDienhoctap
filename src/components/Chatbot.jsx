import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import products from "../data/products";

// Constants bên ngoài component
const INITIAL_MESSAGE = { 
  sender: "bot", 
  text: "Xin chào! Bạn muốn tìm khóa học nào?",
  timestamp: Date.now()
};

const STOP_WORDS = new Set([
  "tôi", "muốn", "cần", "với", "có", "của", "là", "thì",
  "một", "để", "và", "trong", "như", "ai", "gì", "nào",
  "được", "không", "cho", "về", "từ", "hay", "nhưng", "mà"
]);

const DEFAULT_RESPONSES = {
  empty: "Hãy cho tôi biết bạn muốn học gì nhé! 😊",
  notFound: "Rất tiếc, tôi chưa có gợi ý phù hợp 😢. Bạn có thể thử từ khóa khác không?",
  multiple: "Tôi tìm thấy {count} khóa học phù hợp:",
  single: "Tôi gợi ý bạn thử khóa: \"{name}\" ({price})"
};

function Chatbot() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Tối ưu search logic
  const searchProducts = useCallback((query) => {
    if (!query || typeof query !== 'string') return [];
    
    const normalizedQuery = query.toLowerCase().trim();
    if (normalizedQuery.length < 2) return [];

    // Extract keywords
    const keywords = normalizedQuery
      .split(/\s+/)
      .filter(word => word.length > 1 && !STOP_WORDS.has(word))
      .slice(0, 5); // Giới hạn keywords

    if (keywords.length === 0) return [];

    // Score-based matching
    const scored = products.map(product => {
      const searchText = `${product.name} ${product.shortDesc || ''} ${product.longDesc || ''}`.toLowerCase();
      let score = 0;
      let matchCount = 0;

      keywords.forEach(keyword => {
        if (product.name.toLowerCase().includes(keyword)) {
          score += 10; // Tên sản phẩm match cao nhất
          matchCount++;
        } else if (searchText.includes(keyword)) {
          score += 3; // Match trong description
          matchCount++;
        }
      });

      // Bonus cho nhiều keyword match
      if (matchCount > 1) {
        score += matchCount * 2;
      }

      return { ...product, score, matchCount };
    });

    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3) // Giới hạn 3 kết quả tốt nhất
      .map(({ score, matchCount, ...product }) => product);
  }, []);

  // Tạo response message
  const generateResponse = useCallback((matchedProducts) => {
    if (matchedProducts.length === 0) {
      return DEFAULT_RESPONSES.notFound;
    }

    if (matchedProducts.length === 1) {
      const product = matchedProducts[0];
      return DEFAULT_RESPONSES.single
        .replace('{name}', product.name)
        .replace('{price}', product.price.toLocaleString() + 'đ');
    }

    // Multiple products
    const productList = matchedProducts
      .map((p, index) => `${index + 1}. ${p.name} (${p.price.toLocaleString()}đ)`)
      .join('\n');
    
    return DEFAULT_RESPONSES.multiple.replace('{count}', matchedProducts.length) + '\n' + productList;
  }, []);

  // Simulate typing effect
  const simulateTyping = useCallback(async (responseText) => {
    setIsTyping(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    const botMessage = { 
      sender: "bot", 
      text: responseText,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  }, []);

  // Handle send message
  const handleSend = useCallback(async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // Add user message
    const userMessage = { 
      sender: "user", 
      text: trimmedInput,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Search and generate response
    const matchedProducts = searchProducts(trimmedInput);
    const response = generateResponse(matchedProducts);
    
    // Simulate bot typing
    await simulateTyping(response);
  }, [input, searchProducts, generateResponse, simulateTyping]);

  // Handle Enter key
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // Memoize messages rendering
  const renderedMessages = useMemo(() => {
    return messages.map((msg, idx) => (
      <div
        key={`${msg.timestamp}-${idx}`}
        className={`text-sm p-2 rounded-lg max-w-[85%] ${
          msg.sender === "user"
            ? "bg-purple-100 text-purple-800 ml-auto"
            : "bg-gray-100 text-gray-800 mr-auto"
        }`}
        style={{
          wordBreak: 'break-word',
          whiteSpace: 'pre-line' // Hỗ trợ xuống dòng
        }}
      >
        {msg.text}
      </div>
    ));
  }, [messages]);

  return (
    <div className="fixed bottom-20 right-6 w-80 bg-white border rounded-lg shadow-lg z-50 flex flex-col max-h-96">
      {/* Header */}
      <div className="p-3 border-b bg-purple-50 rounded-t-lg">
        <h2 className="text-lg font-bold text-purple-800">🤖 AI Tư vấn sản phẩm</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-48 max-h-64">
        {renderedMessages}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="bg-gray-100 text-gray-800 p-2 rounded-lg mr-auto max-w-[85%]">
            <div className="flex items-center space-x-1">
              <span className="text-sm">Đang soạn tin nhắn</span>
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-gray-50 rounded-b-lg">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Bạn muốn học gì?"
            disabled={isTyping}
            maxLength={200}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            {isTyping ? "..." : "Gửi"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;