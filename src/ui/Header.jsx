import { useNavigate } from "react-router-dom";

function Header({ user }) {
  const navigate = useNavigate();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-100 px-6">
      <h1
        className="cursor-pointer text-lg font-bold text-indigo-600"
        onClick={() => navigate("/home")}
      >
        SpendWise
      </h1>

      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user.email}</span>

          <button
            onClick={() => console.log("TODO: Implement logout")}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-300"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="rounded-lg border border-indigo-500 px-4 py-2 text-sm font-semibold text-indigo-600 transition-all hover:bg-indigo-50"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-500"
          >
            Sign Up
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
