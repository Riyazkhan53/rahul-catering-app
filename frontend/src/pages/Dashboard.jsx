function Dashboard({ onLogout }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
  };

  function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

const greeting = getGreeting();

  return (
    <div style={{ padding: "20px" }}>
        <h1>
        👨‍🍳 {greeting}, Chef!!
      </h1>

      {/* <h2>Welcome to Rahul Catering & Events</h2> */}

      <h3>Dashboard in development</h3>
      <p>Look out for further updates here in future buddy!</p>

      <button
        onClick={handleLogout}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#ff9800",
          color: "#fff",
          border: "none",
          borderRadius: "20px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;