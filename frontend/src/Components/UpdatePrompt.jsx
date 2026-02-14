import { useRegisterSW } from 'virtual:pwa-register/react';

const APP_VERSION = '1.0.6';

function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      console.log(`[PWA] SW registered: ${swUrl}`);
      // Check for updates every 60 seconds
      if (registration) {
        setInterval(() => {
          registration.update();
        }, 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error('[PWA] SW registration error:', error);
    },
  });

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  const handleDismiss = () => {
    setNeedRefresh(false);
  };

  if (!needRefresh) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center animate-fade-in">
        <div className="text-5xl mb-4">🔄</div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Update Available!
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-1">
          A new version of Rahul Catering is ready.
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
          Version {APP_VERSION}
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={handleUpdate}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-full transition-all hover:scale-105 shadow-lg"
          >
            Update Now
          </button>
          <button
            onClick={handleDismiss}
            className="w-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm py-2 transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdatePrompt;
