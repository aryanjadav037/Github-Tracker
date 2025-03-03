const SkeletonLoader = () => {
  return (
    <div data-testid="skeleton-loader" style={{ padding: 20, width: "100%" }}>
      <div style={{ height: 20, width: "100%", backgroundColor: "#333", marginBottom: 10, borderRadius: 4, animation: "pulse 1.5s infinite" }} />
      <div style={{ height: 20, width: "100%", backgroundColor: "#333", marginBottom: 10, borderRadius: 4, animation: "pulse 1.5s infinite" }} />
      <div style={{ height: 20, width: "100%", backgroundColor: "#333", marginBottom: 10, borderRadius: 4, animation: "pulse 1.5s infinite" }} />
    </div>
  );
  };
  
  export default SkeletonLoader;