import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, Zap, ArrowRight, Sparkles } from "lucide-react";
import { apiFetch } from "../lib/apiFetch";
import { toast } from "sonner";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await apiFetch("/products");
        setProducts(res.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push({ ...product, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));

    toast.success(`"${product.name}" agregado al carrito`, {
      position: "top-right",
    });
  };

  return (
    <div className="bg-[#f0f2f5] min-h-screen pt-28 pb-12 px-4 md:px-10">
      <div className="max-w-[1400px] mx-auto">

        {/* HERO PRINCIPAL */}
        <motion.div
          whileHover={{ y: -5 }}
          className="md:col-span-4 lg:col-span-4 h-[450px] relative rounded-3xl overflow-hidden shadow-sm group cursor-pointer mb-10"
        >
          <img
            src="/products/image_246dfc1b.png"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

          <div className="absolute bottom-0 p-8">
            <span className="bg-[#fa9715] text-[#0D2137] px-3 py-1 rounded-md text-[10px] font-black uppercase mb-4 inline-block">
              Destacado del mes
            </span>

            <h1 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">
              Nueva era de productividad arquitectónica
            </h1>

            <Link
              to="/catalog"
              className="flex items-center gap-2 text-white/80 hover:text-[#fa9715] text-xs font-bold uppercase tracking-widest transition-colors"
            >
              Ver colección completa <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>

        {/* PRODUCTOS MÁS ROTADOS */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-6 shadow-sm mb-10"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black uppercase text-xs text-slate-400 tracking-widest flex items-center gap-2">
              <Sparkles size={14} className="text-yellow-500" /> Productos más rotados
            </h3>
            <span className="text-[10px] font-bold text-slate-300 italic">
              Basado en actividad reciente
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.slice(0, 4).map((p, idx) => (
              <motion.div
                key={p.id}
                whileHover={{ y: -4 }}
                className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm"
              >
                <p className="text-xs font-black text-slate-700 truncate mb-1">
                  {p.name}
                </p>
                <p className="text-xs font-black text-slate-900">${p.price_usd}</p>
                <p className="text-[9px] text-green-500 font-bold mt-1">
                  +{idx + 15}% rotación
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* PRODUCTOS PARA AGREGAR AL CARRITO */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-6 shadow-sm mb-10"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black uppercase text-xs text-slate-400 tracking-widest">
              Listos para agregar al carrito
            </h3>
            <span className="text-[10px] font-bold text-slate-300 italic">
              Recomendados para ti
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.slice(0, 4).map((p) => (
              <motion.div
                key={p.id}
                whileHover={{ y: -4 }}
                className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col"
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/${p.image}`}
                  alt={p.name}
                  className="w-full h-32 object-contain rounded-lg mb-3 bg-white p-2"
                  loading="lazy"
                />

                <p className="text-xs font-black text-slate-700 truncate mb-1">
                  {p.name}
                </p>

                <p className="text-xs font-black text-slate-900 mb-3">
                  ${p.price_usd}
                </p>

                <button
                  onClick={() => addToCart(p)}
                  className="mt-auto bg-[#fa9715] text-[#0D2137] px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all active:scale-95 shadow-md"
                >
                  Agregar al carrito
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* GRID PRINCIPAL TIPO MSN */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">

          {/* WIDGET TOP VENTAS */}
          <div className="md:col-span-2 lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black uppercase text-xs text-slate-400 tracking-widest flex items-center gap-2">
                  <TrendingUp size={14} className="text-green-500" /> Top Ventas
                </h3>
                <span className="text-[10px] font-bold text-slate-300 italic">
                  Actualizado ahora
                </span>
              </div>

              <div className="space-y-4">
                {products.slice(0, 4).map((p, idx) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center border-b border-gray-50 pb-3"
                  >
                    <span className="text-xs font-bold text-slate-700 truncate max-w-[120px]">
                      {p.name}
                    </span>
                    <div className="text-right">
                      <p className="text-xs font-black text-slate-900">${p.price_usd}</p>
                      <p className="text-[9px] text-green-500 font-bold">
                        +{idx + 12}% stock
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full bg-gray-50 text-slate-400 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-[#0D2137] hover:text-white transition-all mt-4">
              Ver reporte de inventario
            </button>
          </div>

          {/* BLOQUE SECUNDARIO 1 */}
          <motion.div
            whileHover={{ y: -5 }}
            className="md:col-span-2 lg:col-span-2 h-[300px] relative rounded-3xl overflow-hidden shadow-sm group"
          >
            <img
              src="/products/2.jpg"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
            <div className="absolute bottom-0 p-6">
              <h2 className="text-lg font-black text-white uppercase italic leading-tight">
                Accesorios de alto rendimiento
              </h2>
            </div>
          </motion.div>

          {/* BLOQUE SECUNDARIO 2 */}
          <motion.div
            whileHover={{ y: -5 }}
            className="md:col-span-2 lg:col-span-2 h-[300px] relative rounded-3xl overflow-hidden shadow-sm group"
          >
            <img
              src="/products/4.jpg"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
            <div className="absolute bottom-0 p-6">
              <h2 className="text-lg font-black text-white uppercase italic leading-tight">
                Herramientas de precisión
              </h2>
            </div>
          </motion.div>

          {/* WIDGET EXPRESS */}
          <div className="md:col-span-2 lg:col-span-2 bg-[#0D2137] rounded-3xl p-6 text-white flex flex-col justify-center items-center shadow-lg relative overflow-hidden">
            <Zap className="absolute -right-4 -top-4 text-white/5" size={120} />
            <div className="text-center relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#fa9715] mb-2">
                Envío Express
              </p>
              <h4 className="text-4xl font-black italic mb-1">30 min</h4>
              <p className="text-xs font-bold text-white/60">
                Tiempo promedio de entrega
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
