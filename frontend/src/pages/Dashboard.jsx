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

            {/* Top bar */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h1>👨‍🍳  Hi, {greeting}, Chef!!</h1>

                <button
                    onClick={handleLogout}
                    style={{
                        padding: "8px 16px",
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

            {/* Center content */}
            <div style={{ textAlign: "center", marginTop: "60px" }}>
                <div style={{ fontSize: "80px", marginBottom: "20px" }}>
                    🚧
                </div>

                <h3>Dashboard under development</h3>
                <p>Look out for further updates here in future buddy!</p>
            </div>
        </div>
    );
}

export default Dashboard;