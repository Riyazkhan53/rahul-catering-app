import AnimatedPage from "./AnimatedPage";
export default function DashboardHome() {
  return (
    <AnimatedPage>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <Stat title="Today's Orders" value="24" />
        <Stat title="Pending Orders" value="6" />
        <Stat title="Revenue" value="₹18,500" />
      </div>
    </AnimatedPage>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 text-center">
      <p className="text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-orange-500 mt-2">{value}</p>
    </div>
  );
}