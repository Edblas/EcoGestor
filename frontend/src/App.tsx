import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ClientesPage } from "./pages/ClientesPage";
import { FornecedoresPage } from "./pages/FornecedoresPage";
import { MateriaisPage } from "./pages/MateriaisPage";
import { EstoquePage } from "./pages/EstoquePage";
import { EntradasPage } from "./pages/EntradasPage";
import { SaidasPage } from "./pages/SaidasPage";
import { FinanceiroPage } from "./pages/FinanceiroPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/clientes" element={
          <ProtectedRoute>
            <ClientesPage />
          </ProtectedRoute>
        } />
        <Route path="/fornecedores" element={
          <ProtectedRoute>
            <FornecedoresPage />
          </ProtectedRoute>
        } />
        <Route path="/materiais" element={
          <ProtectedRoute>
            <MateriaisPage />
          </ProtectedRoute>
        } />
        <Route path="/estoque" element={
          <ProtectedRoute>
            <EstoquePage />
          </ProtectedRoute>
        } />
        <Route path="/entradas" element={
          <ProtectedRoute>
            <EntradasPage />
          </ProtectedRoute>
        } />
        <Route path="/saidas" element={
          <ProtectedRoute>
            <SaidasPage />
          </ProtectedRoute>
        } />
        <Route path="/financeiro" element={
          <ProtectedRoute>
            <FinanceiroPage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
