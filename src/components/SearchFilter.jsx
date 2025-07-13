function SearchFilter({ search, setSearch, filter, setFilter }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search input */}
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full sm:w-1/2"
      />

      {/* Filter select */}
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border p-2 rounded w-full sm:w-1/4"
      >
        <option value="all">Tất cả giá</option>
        <option value="<500">Dưới 500K</option>
        <option value="500-1000">500K - 1 triệu</option>
        <option value=">1000">Trên 1 triệu</option>
      </select>
    </div>
  );
}

export default SearchFilter;
