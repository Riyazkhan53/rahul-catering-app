import AnimatedPage from "./AnimatedPage";
export default function Setup() {
  return (
    <UnderDev title="Setup" />
  );
}

function UnderDev({ title }) {
  return (
    <AnimatedPage>
    <div className="bg-white shadow-xl rounded-2xl p-10 text-center">
      <div className="text-7xl mb-4">🚧</div>
      <h2 className="text-2xl font-semibold">{title} Under Development</h2>
      <p className="text-gray-500 mt-2">Cooking something awesome 👨‍🍳</p>
    </div>
    </AnimatedPage>
  );
}