import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { CurrencyProvider } from "./context/CurrencyContext";

import AppLayout from "./ui/AppLayout";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Expenses from "./pages/Expenses";
import Settings from "./pages/Settings";
import LoginPage from "./features/authentication/LoginPage";
import { Toaster } from "react-hot-toast";
import CategoryDetails from "./features/categories/CategoryDetails";
import Wallet from "./pages/Wallet";
import Landing from "./pages/Landing";
import { DarkModeProvider } from "./context/DarkModeContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 60 * 1000,
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <DarkModeProvider>
      <QueryClientProvider client={queryClient}>
        <CurrencyProvider>
          <ReactQueryDevtools initialIsOpen={false} />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route element={<AppLayout />}>
                {/* <Route index element={<Navigate replace to="/dashboard" />} /> */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/wallet" element={<Wallet />}></Route>
                <Route path="/category" element={<Categories />}></Route>
                <Route
                  path="/category/:categoryName"
                  element={<CategoryDetails />}
                ></Route>

                <Route path="/expense" element={<Expenses />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              <Route path="/login" element={<LoginPage mode="login" />} />
              <Route path="/signup" element={<LoginPage mode="signup" />} />
            </Routes>
          </BrowserRouter>
          <Toaster
            position="top-right"
            gutter={12}
            containerStyle={{
              margin: "12px",
            }}
            toastOptions={{
              style: {
                background: "#f9fafb",
                color: "#111827",
                fontSize: "0.875rem",
                fontWeight: 500,
                borderRadius: "0.5rem",
                padding: "12px 16px",
                boxShadow:
                  "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
              },
              success: {
                iconTheme: {
                  primary: "#4f46e5",
                  secondary: "#fff",
                },
                style: {
                  borderLeft: "4px solid #4f46e5",
                },
              },
              error: {
                iconTheme: {
                  primary: "#dc2626",
                  secondary: "#fff",
                },
                style: {
                  borderLeft: "4px solid #dc2626",
                },
              },
            }}
          />
        </CurrencyProvider>
      </QueryClientProvider>
    </DarkModeProvider>
  );
}

export default App;
