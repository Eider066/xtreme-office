import React from "react";

import { Link, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, LogOut, PlusCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Sesión cerrada");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#0D2137] text-white">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0B1A2A] border-r border-white/10 flex flex-col py-8 px-6">
        <Link to="/admin" className="text-2xl font-black italic tracking-tight mb-10">
          XTREME<span className="text-[#fa9715]">ADMIN</span>
        </Link>

        <nav className="flex flex-col gap-4 text-sm font-semibold tracking-widest uppercase">

          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition ${isActive ? "bg-[#fa9715] text-[#0D2137]" : "hover:bg-white/10"
              }`
            }
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/add-product"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition ${isActive ? "bg-[#fa9715] text-[#0D2137]" : "hover:bg-white/10"
              }`
            }
          >
            <PlusCircle size={18} />
            Agregar Productos
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition ${isActive ? "bg-[#fa9715] text-[#0D2137]" : "hover:bg-white/10"
              }`
            }
          >
            <Package size={18} />
            Inventario
          </NavLink>

          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition ${isActive ? "bg-[#fa9715] text-[#0D2137]" : "hover:bg-white/10"
              }`
            }
          >
            <Package size={18} />
            Categorías
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition ${isActive ? "bg-[#fa9715] text-[#0D2137]" : "hover:bg-white/10"
              }`
            }
          >
            <ShoppingCart size={18} />
            Órdenes
          </NavLink>


        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm font-semibold tracking-widest uppercase"
        >

          <LogOut size={18} />
          Cerrar sesión
        </button>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
