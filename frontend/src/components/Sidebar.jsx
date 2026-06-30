function Sidebar() {
  const items = [
    "Dashboard",
    "Rooms",
    "Tenants",
    "Billing",
    "Customer Requests",
    "Analytics & Reports",
  ];

  return (
    <aside
      style={{
        width: "250px",
        padding: "20px",
      }}
    >
      <h3>Manage</h3>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginTop: "20px",
        }}
      >
        {items.map((item) => (
          <button
            key={item}
            type="button"
            style={{
              width: "100%",
              padding: "12px 16px",
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;