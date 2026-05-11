import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, Bolt } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const CartDrawer = ({ open, onClose }) => {
  const { cart, updateQuantity, removeFromCart, total } = useCart();
  const navigate = useNavigate();

  // ⭐ URL dinámica (local o producción)
  const backendURL =
    window.location.hostname === "localhost"
      ? "http://localhost:4000"
      : "https://tu-backend.com"; // <-- cambiar cuando despliegues

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed right-0 top-0 h-full w-[420px] bg-white z-[100] shadow-2xl p-8 flex flex-col overflow-y-auto"
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                Tu Carrito
              </h2>
              <button onClick={onClose}>
                <X size={26} className="text-gray-600 hover:text-black" />
              </button>
            </div>

            {cart.length === 0 && (
              <div className="p-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed">
                <p className="text-gray-400 font-bold uppercase tracking-widest">
                  Carrito vacío
                </p>
              </div>
            )}

            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  <img
                    src={`${backendURL}/uploads/${item.image}`}
                    alt={item.name}
                    className="w-24 h-24 object-contain rounded-lg bg-gray-100"
                  />

                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-black uppercase">{item.name}</h3>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <span className="text-xl font-black block mt-1">
                      ${(item.price_usd * item.qty).toFixed(2)}
                    </span>

                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.qty - 1)}
                        className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200"
                        disabled={item.qty <= 1}
                      >
                        <Minus size={14} />
                      </button>

                      <span className="font-black w-8 text-center">{item.qty}</span>

                      <button
                        onClick={() => updateQuantity(item.id, item.qty + 1)}
                        className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div className="mt-10 bg-black text-white p-6 rounded-3xl shadow-xl">
                <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                  <Bolt className="text-yellow-400" /> Resumen
                </h2>

                <div className="space-y-3 text-sm border-b border-white/10 pb-4">
                  <p className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </p>

                  <p className="flex justify-between">
                    <span className="text-gray-400">Envío</span>
                    <span className="text-green-400">GRATIS</span>
                  </p>
                </div>

                <div className="mt-6 flex justify-between items-end">
                  <span className="text-xs uppercase font-black text-gray-500">
                    Total Final
                  </span>
                  <span className="text-4xl font-black tracking-tighter">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    navigate("/checkout");
                  }}
                  className="w-full mt-8 py-4 bg-yellow-400 text-black rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all hover:scale-[1.02] active:scale-95"
                >
                  Ir al Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
