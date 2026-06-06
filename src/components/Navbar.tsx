function Navbar() {
  return (
    <nav
      style={{
        backgroundColor: "#1e293b",
        color: "white",
        padding: "16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2>PulseNode</h2>

      <div>
        <span>Dashboard</span>
      </div>
    </nav>
  );
}

export default Navbar;