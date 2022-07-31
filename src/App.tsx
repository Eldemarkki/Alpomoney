import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { useState } from "react";
import { UserContext } from "./contexts/UserContext";
import { User } from "@alpomoney/shared";
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
import { createGlobalStyle } from "styled-components";
import { themeVariableNames } from "./theme/variables";

const GlobalStyles = createGlobalStyle({
  ":root": {
    [themeVariableNames.primaryVariableName]: "#0a0e1e",
    [themeVariableNames.backgroundColorVariableName]: "#faebd7",
    [themeVariableNames.sidebarTopColorVariableName]: "#010516",
    [themeVariableNames.sidebarActiveLinkColorVariableName]: "#fffaf4",
    [themeVariableNames.sidebarInactiveLinkColorVariableName]: "#faebd7ba",
    [themeVariableNames.sidebarHoveredLinkColorVariableName]: "#faebd7ff",
    [themeVariableNames.sizes.xxs]: "4px",
    [themeVariableNames.sizes.xs]: "8px",
    [themeVariableNames.sizes.md]: "16px",
    [themeVariableNames.sizes.lg]: "24px",
    [themeVariableNames.sizes.xl]: "32px",
    [themeVariableNames.borderRadiuses.xs]: "2px",
    [themeVariableNames.borderRadiuses.md]: "4px",
    [themeVariableNames.borderRadiuses.lg]: "8px",
    [themeVariableNames.borderRadiuses.xl]: "16px",
    [themeVariableNames.borderWidths.xs]: "1px",
    [themeVariableNames.borderWidths.md]: "2px",
    [themeVariableNames.borderWidths.lg]: "4px",
    [themeVariableNames.borderWidths.xl]: "8px"
  }
});

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
    <GlobalStyles />
    <UserContext.Provider value={{ user, setUser, loading, setLoading }}>
      <Provider store={store}>
        <AppRoutes />
      </Provider>
    </UserContext.Provider>
  </div>;
};
