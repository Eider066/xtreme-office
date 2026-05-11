import React, { useEffect, useState } from "react";
import { apiFetch } from "../lib/apiFetch";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import AdminLayout from "../components/AdminLayout";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [addStockId, setAddStockId] = useState(null);
  const [amount, setAmount] = useState("");

  const backendURL =
    window.location.hostname === "localhost"
      ? "http://localhost:4000"
      : "https://tu-backend.com";

  const loadProducts = async () => {
    const res = await apiFetch("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (!confirm("¿Eliminar producto?")) return;

    const res = await apiFetch(`/products/${id}`, { method: "DELETE" });

    if (res.data?.message) {
      toast.success("Producto eliminado");
      loadProducts();
    }
  };

  const addStock = async () => {
    const res = await apiFetch(`/products/${addStockId}/add-stock`, {
      method: "PATCH",
      body: { amount },
    });

    if (res.data?.success) {
      toast.success("Stock actualizado");
      setAddStockId(null);
      setAmount("");
      loadProducts();
    } else {
      toast.error(res.data?.error || "Error");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black tracking-tight">Productos</h1>

          <Link
            to="/admin/add-product"
            className="px-4 py-3 rounded-xl bg-[#fa9715] text-[#0D2137] font-black uppercase tracking-widest text-xs hover:bg-white transition"
          >
            Agregar producto
          </Link>
        </div>

        {/* TABLA */}
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/10 text-xs uppercase text-gray-300 font-black tracking-widest">
              <tr>
                <th className="p-4">Imagen</th>
                <th className="p-4">Nombre</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Precio</th>
                <th className="p-4">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-white/10">
                  <td className="p-4">
                    <img
                      src={`${backendURL}/uploads/${p.image}`}
                      className="w-16 h-16 object-contain bg-white/10 rounded-xl"
                    />
                  </td>

                  <td className="p-4 font-black uppercase text-sm">{p.name}</td>
                  <td className="p-4 text-xs text-gray-400">{p.sku}</td>
                  <td className="p-4 font-black">{p.stock}</td>
                  <td className="p-4 font-black">${p.price_usd}</td>

                  <td className="p-4 flex gap-2">
                    <Link
                      to={`/editar-producto/${p.id}`}
                      className="px-3 py-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-black"
                    >
                      Editar
                    </Link>

                    <button
                      onClick={() => {
                        setAddStockId(p.id);
                        setAmount("");
                      }}
                      className="px-3 py-2 rounded-xl bg-green-500/20 text-green-300 border border-green-500/30 text-xs font-black"
                    >
                      + Stock
                    </button>

                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="px-3 py-2 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-black"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODAL AGREGAR STOCK */}
        {addStockId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white/10 border border-white/20 p-6 rounded-2xl w-80">

              <h2 className="text-sm font-black uppercase tracking-widest text-gray-200 mb-4">
                Agregar stock
              </h2>

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white rounded-xl p-3 mb-4 outline-none focus:border-[#fa9715]"
                placeholder="Cantidad a agregar"
              />

              <div className="flex gap-3">
                <button
                  onClick={addStock}
                  className="flex-1 px-4 py-3 rounded-xl bg-[#fa9715] text-[#0D2137] font-black uppercase tracking-widest text-xs hover:bg-white transition"
                >
                  Guardar
                </button>

                <button
                  onClick={() => setAddStockId(null)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-gray-300 border border-white/20 font-black uppercase tracking-widest text-xs"
                >
                  Cancelar
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
