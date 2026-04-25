export function invalidateExpenseDerivedQueries(queryClient) {
  queryClient.invalidateQueries({ queryKey: ["expenses"] });
  queryClient.invalidateQueries({ queryKey: ["recentExpenses"] });
  queryClient.invalidateQueries({ queryKey: ["monthExpenses"] });
  queryClient.invalidateQueries({ queryKey: ["chartExpenses"] });
  queryClient.invalidateQueries({ queryKey: ["expenseAmounts"] });
  queryClient.invalidateQueries({ queryKey: ["balanceSummary"] });

  queryClient.invalidateQueries({
    queryKey: ["categoryExpenses"],
    exact: false,
  });

  queryClient.invalidateQueries({
    queryKey: ["categoryStats"],
    exact: false,
  });

  queryClient.invalidateQueries({
    queryKey: ["categories-with-monthly-totals"],
    exact: false,
  });
}

export function invalidateSubscriptionDerivedQueries(queryClient) {
  queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
  invalidateExpenseDerivedQueries(queryClient);
}
