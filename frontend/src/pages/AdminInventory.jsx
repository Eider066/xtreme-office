import React, { useEffect, useState } from "react";
import { apiFetch } from "../lib/apiFetch";
import AdminLayout from "../components/AdminLayout";

export default function AdminInventory() {
  const [items, setItems] = useState([]);
  const [threshold, setThreshold] = useState(5);
  const [loading, setLoading] = useState(true);

  const load = async (t = threshold) => {
    try {
      setLoading(true);
      const res = await apiFetch(`/inventory/low-stock?threshold=${t}`);
      setItems(res.data.data || []);
      setThreshold(res.data.threshold || t);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black tracking-tight">Inventario</h1>

          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-300 text-xs uppercase tracking-widest">
              Stock bajo (≤)
            </span>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              onBlur={() => load(Number(threshold) || 1)}
              className="w-20 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-[#fa9715]"
            />
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          {loading ? (
            <p className="p-4 text-sm text-gray-400">Cargando inventario...</p>
          ) : items.length === 0 ? (
            <p className="p-4 text-sm text-gray-400">
              No hay productos con stock bajo.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-white/10 text-xs uppercase text-gray-300 tracking-widest">
                <tr>
                  <th className="p-3 text-left">Nombre</th>
                  <th className="p-3 text-left">SKU</th>
                  <th className="p-3 text-left">Categoría</th>
                  <th className="p-3 text-left">Stock</th>
                  <th className="p-3 text-left">Precio USD</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="border-t border-white/10">
                    <td className="p-3 font-black uppercase text-sm">
                      {p.name}
                    </td>
                    <td className="p-3 text-xs text-gray-400">{p.sku}</td>
                    <td className="p-3 text-xs text-gray-400">
                      {p.category || "-"}
                    </td>
                    <td className="p-3 font-black">{p.stock}</td>
                    <td className="p-3 font-black">${p.price_usd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
