# Gray / White → neutral, background, readability

Indigo → primary/brand

Emerald → success, positive actions or balances

Rose → danger, errors, expenses

Here’s how I’d apply them in your app (links, text, buttons, backgrounds):

## 🔗 Links & Navigation

Default link text: text-gray-700 (neutral, clean)

Hover / Active / Visited: text-indigo-600 (brand color, consistent)

Active NavLink: text-indigo-600 font-semibold border-b-2 border-indigo-600

👉 This keeps navigation focused on your brand color (Indigo).

## 📝 Text

Headings: text-gray-900 (strongest contrast, clean)

Body text: text-gray-700

Muted/Secondary text: text-gray-500

Positive values (e.g., income, budget under control): text-emerald-600

Negative values (e.g., expenses, warnings, overspending): text-rose-600

## 🔘 Buttons

Primary action button (e.g., “Add Expense”, “Save”)

bg-indigo-600 text-white hover:bg-indigo-700

Secondary button (e.g., “Cancel”)

bg-gray-100 text-gray-700 hover:bg-gray-200

Success button (e.g., “Confirm”, “Deposit”)

bg-emerald-600 text-white hover:bg-emerald-700

Danger button (e.g., “Delete Expense”)

bg-rose-600 text-white hover:bg-rose-700

## 🎨 Backgrounds

App background: bg-white (clean & light)

Cards/Containers: bg-gray-50 shadow-sm rounded-lg

Highlights / Active states: bg-indigo-50 (subtle brand highlight)

Error/Warning panels: bg-rose-50 border border-rose-200 text-rose-700

Success panels: bg-emerald-50 border border-emerald-200 text-emerald-700
