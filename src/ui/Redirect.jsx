function Redirect({ pageName }) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-xl font-semibold text-gray-700">
        You are not logged in
      </h2>
      <p className="text-gray-500">Please log in to access your {pageName}.</p>
    </div>
  );
}

export default Redirect;
