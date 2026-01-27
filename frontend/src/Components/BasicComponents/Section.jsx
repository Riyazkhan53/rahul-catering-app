export default function Section({ title, children }) {
  return (
    <div className="space-y-3">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}