function Loader({ className = "" }) {
  return (
    <div
      className={`flex h-full min-h-[50vh] w-full flex-1 items-center justify-center ${className}`}
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent dark:border-indigo-500"></div>
    </div>
  );
}

export default Loader;
