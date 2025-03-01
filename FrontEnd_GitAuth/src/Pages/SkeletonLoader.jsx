const SkeletonLoader = () => {
    return (
      <div style={{ padding: "20px", width: "100%" }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            height: "20px",
            width: "100%",
            backgroundColor: "#333",
            marginBottom: "10px",
            borderRadius: "4px",
            animation: "pulse 1.5s infinite"
          }}></div>
        ))}
        <style>
          {`
            @keyframes pulse {
              0% { opacity: 1; }
              50% { opacity: 0.5; }
              100% { opacity: 1; }
            }
          `}
        </style>
      </div>
    );
  };
  
  export default SkeletonLoader;
  