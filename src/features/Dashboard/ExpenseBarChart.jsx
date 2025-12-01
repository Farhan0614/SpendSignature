function ExpenseProgressBar({ income = 2000, expense = 1200 }) {
  const percentage = Math.min((expense / income) * 100, 100) || 0; // cap at 100%

  return (
    <div className="w-full rounded-2xl bg-white p-5 shadow-md">
      <h3 className="mb-2 text-lg font-semibold text-gray-700">
        Monthly Spending Progress
      </h3>

      <div className="mb-2 flex justify-between text-sm text-gray-500">
        <span>Spent</span>
        <span>{percentage.toFixed(1)}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full transition-all duration-500 ${
            percentage < 75 ? "bg-green-500" : "bg-red-500"
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <p className="mt-2 text-sm text-gray-600">
        ${expense} spent of ${income} income
      </p>
    </div>
  );
}

export default ExpenseProgressBar;
