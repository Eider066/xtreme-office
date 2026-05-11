import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { apiFetch } from "../lib/apiFetch";
import { cn } from "../lib/utils";

// --- SUB-COMPONENTES ---

const CategoryBtn = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={cn(
      "text-left px-4 py-3 rounded-xl text-xs font-bold transition-all",
      active
        ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
        : "text-slate-500 hover:bg-gray-100 hover:text-slate-900"
    )}
  >
    {label}
  </button>
);

const SkeletonCard = () => (
  <div className="space-y-4 animate-pulse bg-white p-4 border border-gray-100 rounded-2xl">
    <div className="bg-gray-100 aspect-square w-full rounded-xl" />
    <div className="space-y-2">
      <div className="h-3 bg-gray-100 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
    </div>
  </div>
);

// --- COMPONENTE PRINCIPAL ---

const Catalog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Relevancia");
  const [products, setProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          apiFetch("/products"),
          apiFetch("/categories")
        ]);
        setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
        setDbCategories(catRes.data.data || []);
      } catch (err) {
        console.error("Error loading catalog:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- LÓGICA DE FILTRADO Y ORDENAMIENTO ---
  const filteredProducts = products
    .filter((p) => (activeCategory === "All" ? true : p.category_id === activeCategory))
    .sort((a, b) => {
      if (sortBy === "Precio: Menor a Mayor") return a.price_usd - b.price_usd;
      if (sortBy === "Precio: Mayor a Menor") return b.price_usd - a.price_usd;
      if (sortBy === "Novedades") return new Date(b.created_at) - new Date(a.created_at);
      return 0; // Relevancia
    });

  return (
    <div className="bg-[#fcfcfc] min-h-screen pt-24 pb-24 px-4 md:px-10">
      
      {/* HEADER */}
      <header className="max-w-[1600px] mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic text-slate-900">
              The <span className="text-blue-600">Collection</span>
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
              Equipamiento técnico seleccionado
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {[
                { id: "grid", Icon: LayoutGrid },
                { id: "list", Icon: List }
              ].map(({ id, Icon }) => (
                <button
                  key={id}
                  onClick={() => setViewMode(id)}
                  className={cn(
                    "p-2 rounded-md transition-all",
                    viewMode === id ? "bg-white shadow-sm text-blue-600" : "text-gray-400"
                  )}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* SIDEBAR */}
        <aside className="lg:col-span-2 space-y-8">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
              <SlidersHorizontal size={14} /> Categorías
            </h3>
            <div className="flex flex-col gap-1">
              <CategoryBtn 
                label="All" 
                active={activeCategory === "All"} 
                onClick={() => setActiveCategory("All")} 
              />
              {dbCategories.map((cat) => (
                <CategoryBtn
                  key={cat.id}
                  label={cat.name}
                  active={activeCategory === cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                />
              ))}
            </div>
          </div>

          <div className="bg-blue-600 rounded-3xl p-6 text-white overflow-hidden relative group">
            <h4 className="font-black italic uppercase text-lg leading-tight mb-2 relative z-10">
              Envío <br /> Express
            </h4>
            <p className="text-[10px] opacity-80 font-bold mb-4 relative z-10">
              GRATIS EN TU PRIMER PEDIDO
            </p>
            <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition-transform">
              <SlidersHorizontal size={80} />
            </div>
          </div>
        </aside>

        {/* PRODUCTOS */}
        <section className="lg:col-span-10">
          
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {filteredProducts.length} Artículos encontrados
            </span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer text-slate-900 border-b border-transparent hover:border-blue-600 transition-all"
            >
              <option value="Relevancia">Ordenar por: Relevancia</option>
              <option value="Precio: Menor a Mayor">Precio: Menor a Mayor</option>
              <option value="Precio: Mayor a Menor">Precio: Mayor a Menor</option>
              <option value="Novedades">Novedades</option>
            </select>
          </div>

          <motion.div
            layout
            className={cn(
              "grid gap-6",
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            )}
          >
            {loading ? (
              [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    layout
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      className={cn(
                        "bg-white p-3 rounded-[2rem] border border-transparent hover:border-gray-100 hover:shadow-xl transition-all duration-300 h-full",
                        viewMode === "list" && "flex items-center gap-8"
                      )}
                    >
                      <div className={cn(viewMode === "list" ? "w-64 shrink-0" : "w-full")}>
                        <ProductCard product={product} />
                      </div>

                      {viewMode === "list" && (
                        <div className="flex-1 pr-8">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-black uppercase italic text-slate-900 leading-none">
                                {product.name}
                              </h3>
                              <p className="text-slate-400 text-sm mt-3 line-clamp-3 leading-relaxed">
                                {product.description}
                              </p>
                            </div>
                            <span className="text-2xl font-black text-blue-600">
                              ${product.price_usd}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </motion.div>

          {!loading && filteredProducts.length === 0 && (
            <div className="py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
              <LayoutGrid size={48} className="mx-auto mb-4 text-gray-200" />
              <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">
                No hay productos en esta sección
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Catalog;
