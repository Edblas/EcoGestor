import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Truck, Package, ArrowDownToLine, Warehouse, FileText } from "lucide-react";

const menuItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/clientes", icon: Users, label: "Clientes" },
  { to: "/fornecedores", icon: Truck, label: "Fornecedores" },
  { to: "/materiais", icon: Package, label: "Materiais" },
  { to: "/entradas", icon: ArrowDownToLine, label: "Entradas" },
  { to: "/estoque", icon: Warehouse, label: "Estoque" },
  { to: "/relatorios", icon: FileText, label: "Relatórios" },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="px-6 py-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-green-700">EcoGestor</h1>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-green-50 text-green-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
