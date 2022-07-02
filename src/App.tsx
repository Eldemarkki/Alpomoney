import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import React, { useState } from "react";
import { UserContext } from "./contexts/UserContext";
import { User } from "./types";
import { DashboardPage } from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useUser } from "./hooks/useUser";
import StoragesPage from "./pages/StoragesPage";
import { Provider } from "react-redux";
import { store } from "./app/store";
import TransactionsPage from "./pages/TransactionsPage";
import SinksPage from "./pages/SinksPage";
import RecurringTransactionsPage from "./pages/RecurringTransactionsPage";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

const AppRoutes = () => {
  useUser(true);

  return <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="/storages" element={<StoragesPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/sinks" element={<SinksPage />} />
        <Route path="/recurring-transactions" element={<RecurringTransactionsPage />} />
        <Route path="*" element={<h1>Not found</h1>} />
      </Route>
    </Routes>
  </BrowserRouter>;
};

export const App = () => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  return <div>
    <UserContext.Provider value={{ user, setUser, loading, setLoading }}>
      <Provider store={store}>
        <AppRoutes />
      </Provider>
    </UserContext.Provider>
  </div>;
};
