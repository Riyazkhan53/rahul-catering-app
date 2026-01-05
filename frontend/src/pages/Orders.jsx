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
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">📅 Orders Calendar</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {days.map(date => {
            const key = date.toISOString().split("T")[0];
            const hasOrder = MOCK_ORDERS[key];

            return (
              <div
                key={key}
                className={`p-4 rounded-lg border cursor-pointer transition
                  ${
                    hasOrder
                      ? "bg-orange-100 border-orange-400"
                      : "bg-gray-50"
                  }`}
              >
                <p className="font-medium">
                  {date.toDateString()}
                </p>

                {hasOrder ? (
                  <span className="text-orange-600 text-sm font-semibold">
                    🔔 Orders Available
                  </span>
                ) : (
                  <span className="text-gray-400 text-sm">
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