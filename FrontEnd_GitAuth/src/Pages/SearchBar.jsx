/* eslint-disable react/prop-types */
const SearchBar = ({ onFilterChange }) => {
  return (
    <div style={{ marginBottom: "10px" }}>
      <span style={{ color: "#fff", marginRight: "10px" }}>Quick Filter:</span>
      <input
        type="text"
        placeholder="Filter..."
        onChange={onFilterChange}
        style={{
          padding: "5px",
          backgroundColor: "#333",
          color: "#fff",
          border: "1px solid #444",
          borderRadius: "4px",
        }}
      />
    </div>
  );
};

export default SearchBar;
