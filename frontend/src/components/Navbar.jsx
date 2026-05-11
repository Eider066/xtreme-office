import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, ChevronDown } from "lucide-react";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

// 1. Definimos las rutas de Admin en una constante para no repetir código
const ADMIN_LINKS = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/add-product", label: "Agregar Producto" },
  { to: "/admin/products", label: "Productos" }, // Este es tu inventario
  { to: "/admin/categories", label: "Categorías" },
  { to: "/admin/orders", label: "Órdenes" },
];


const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/catalog", label: "Catálogo" },
  { to: "/novedades", label: "Novedades" },
  { to: "/orders", label: "Mis Pedidos" },
];

export default function Navbar({ onCartOpen }) {
  const [isOpen, setIsOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const { cart } = useCart();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsOpen(false);
    setAdminOpen(false);
    toast.success("Sesión cerrada");
    navigate("/login");
  };

  // Clase reutilizable para los links
  const linkStyle = "text-white hover:text-[#fa9715] font-semibold uppercase tracking-widest text-sm transition-colors";
  const adminLinkStyle = "text-white hover:text-[#fa9715] font-medium uppercase tracking-widest text-xs py-2 transition-colors";

  return (
    <>
      <header className="fixed top-0 w-full z-[60] bg-[#0D2137]/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center px-6 h-20 w-full max-w-7xl mx-auto">
          
          {/* LOGO */}
          <div className="flex items-center gap-6">
            <button onClick={() => setIsOpen(true)} className="text-white hover:text-[#fa9715] md:hidden">
              <Menu size={28} />
            </button>
            <Link to="/" className="group text-2xl font-semibold tracking-tighter text-white italic uppercase">
              XTREME<span className="text-[#fa9715] group-hover:text-white transition-colors">OFFICE</span>
            </Link>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex gap-8 items-center">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkStyle}>{link.label}</NavLink>
            ))}

            {/* ADMIN DROPDOWN DESKTOP */}
            <div className="relative">
              <button 
                onClick={() => setAdminOpen(!adminOpen)}
                className={`flex items-center gap-1 ${linkStyle}`}
              >
                Admin <ChevronDown size={16} className={`transition-transform ${adminOpen ? 'rotate-180' : ''}`} />
              </button>

              {adminOpen && (
                <div className="absolute right-0 mt-2 bg-[#0D2137] border border-white/10 rounded-xl shadow-xl p-4 flex flex-col w-48 z-[200]">
                  {!token ? (
                    <NavLink to="/login" className={adminLinkStyle} onClick={() => setAdminOpen(false)}>Iniciar Sesión</NavLink>
                  ) : (
                    <>
                      {ADMIN_LINKS.map(link => (
                        <NavLink key={link.to} to={link.to} className={adminLinkStyle} onClick={() => setAdminOpen(false)}>{link.label}</NavLink>
                      ))}
                      <button onClick={handleLogout} className={`${adminLinkStyle} text-left border-t border-white/5 mt-2 pt-2`}>Cerrar Sesión</button>
                    </>
                  )}
                </div>
              )}
            </div>

            <button onClick={onCartOpen} className="p-3 bg-white/5 rounded-2xl text-white hover:bg-[#fa9715] hover:text-[#0D2137] transition-all relative">
              <ShoppingCart size={22} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#fa9715] text-[#0D2137] text-[10px] font-bold rounded-lg px-1.5 py-0.5 min-w-[20px] border-2 border-[#0D2137]">
                  {cart.length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {isOpen && (
        <>
          <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]" />
          <nav className="fixed top-0 left-0 w-80 h-full bg-[#0D2137] text-white p-8 z-[110] flex flex-col gap-6 shadow-2xl overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-semibold italic text-[#fa9715] uppercase">Navegación</span>
              <button onClick={() => setIsOpen(false)} className="p-2 bg-white/5 rounded-full"><X size={28} /></button>
            </div>

            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} onClick={() => setIsOpen(false)} className={linkStyle}>{link.label}</NavLink>
            ))}

            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="text-[#fa9715] font-semibold uppercase tracking-widest text-xs mb-4">Admin Panel</p>
              {!token ? (
                <NavLink to="/login" onClick={() => setIsOpen(false)} className="block py-2 text-sm uppercase font-medium">Iniciar Sesión</NavLink>
              ) : (
                <div className="flex flex-col gap-2">
                  {ADMIN_LINKS.map(link => (
                    <NavLink key={link.to} to={link.to} onClick={() => setIsOpen(false)} className="block py-2 text-sm uppercase font-medium">{link.label}</NavLink>
                  ))}
                  <button onClick={handleLogout} className="block py-2 text-sm uppercase font-medium text-left text-red-400">Cerrar Sesión</button>
                </div>
              )}
            </div>

            <button onClick={() => { onCartOpen(); setIsOpen(false); }} className="flex items-center justify-center gap-2 p-4 bg-[#fa9715] text-[#0D2137] rounded-xl font-bold mt-auto">
              <ShoppingCart size={20} /> CARRITO ({cart.length})
            </button>
          </nav>
        </>
      )}
    </>
  );
}
