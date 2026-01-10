import AnimatedPage from "./AnimatedPage";

const MOCK_ORDERS = {
    "2026-01-06": true,
    "2026-01-08": true,
};

export default function Orders() {
    const today = new Date();
    const days = Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(today.getDate() + i);
        return d;
    });

    return (
        <AnimatedPage>
            <div className="card p-6 text-app shadow w-full max-w-4xl">
                <h2 className="text-2xl font-bold mb-4">📅 Orders Calendar</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {days.map(date => {
                        const key = date.toISOString().split("T")[0];
                        const hasOrder = MOCK_ORDERS[key];

                        return (
                            <div
                                key={key}
                                className={`card p-4 cursor-pointer transition border
    ${hasOrder ? "border-orange-400" : "opacity-70"}
  `}
                            >
                                <p className="text-sm font-medium opacity-80">
                                    {date.toDateString()}
                                </p>

                                {hasOrder ? (
                                    <span className="block mt-2 text-sm font-semibold text-orange-500">
                                        🔔 Orders Available
                                    </span>
                                ) : (
                                    <span className="block mt-2 text-sm opacity-60">
                                        No orders
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </AnimatedPage>
    );
}