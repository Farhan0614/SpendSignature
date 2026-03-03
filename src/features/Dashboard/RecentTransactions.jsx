import RecentTransactionsItem from "./RecentTransactionsItem";

function RecentTransactions({ transactions, title = "Recent Activity" }) {
  return (
    <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm dark:border dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-900/50">
      <h2 className="mb-4 text-lg font-bold text-slate-700 dark:text-slate-200">
        {title}
      </h2>

      <div className="flex flex-col gap-4 overflow-y-auto">
        {transactions.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
              No recent records
            </p>
          </div>
        ) : (
          transactions.map((trx, index) => {
            return (
              <RecentTransactionsItem trx={trx} key={trx.id} index={index} />
            );
          })
        )}
      </div>
    </div>
  );
}

export default RecentTransactions;
