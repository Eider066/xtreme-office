import React, { useState } from "react";
import { apiFetch } from "../lib/apiFetch";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import AdminLayout from "../components/AdminLayout";

export default function AddProduct() {
  const [form, setForm] = useState({
    sku: "",
    name: "",
    price_usd: "",
    cost_usd: "",
    provider: "",
    stock: "",
    category: "",
    description: "",
    exchange_rate: "",
    image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setForm({ ...form, image: files[0] });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      Object.keys(form).forEach((key) => {
        data.append(key, form[key]);
      });

      await apiFetch("/products", {
        method: "POST",
        body: data
      });

      toast.success("Producto agregado correctamente");

      setForm({
        sku: "",
        name: "",
        price_usd: "",
        cost_usd: "",
        provider: "",
        stock: "",
        category: "",
        description: "",
        exchange_rate: "",
        image: null
      });

    } catch (err) {
      console.error(err);
      toast.error("Error al agregar producto");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black mb-8 tracking-tight">
          Agregar Producto
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10"
        >

          {/* SKU */}
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-gray-300">
              SKU
            </label>
            <input
              name="sku"
              value={form.sku}
              onChange={handleChange}
              placeholder="Ej: XT-001-A"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:border-[#fa9715]"
              required
            />
          </div>

          {/* Nombre */}
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-gray-300">
              Nombre
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:border-[#fa9715]"
              required
            />
          </div>

          {/* Precio USD */}
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-gray-300">
              Precio USD
            </label>
            <input
              name="price_usd"
              type="number"
              step="0.01"
              value={form.price_usd}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:border-[#fa9715]"
              required
            />
          </div>

          {/* Tasa de cambio */}
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-gray-300">
              Tasa de Cambio (USD → Bs)
            </label>
            <input
              name="exchange_rate"
              type="number"
              step="0.01"
              value={form.exchange_rate}
              onChange={handleChange}
              placeholder="Ej: 40.50"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:border-[#fa9715]"
              required
            />
          </div>

          {/* Costo USD */}
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-gray-300">
              Costo USD
            </label>
            <input
              name="cost_usd"
              type="number"
              step="0.01"
              value={form.cost_usd}
              onChange={handleChange}
              placeholder="Precio al que lo compraste"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:border-[#fa9715]"
            />
          </div>

          {/* Proveedor */}
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-gray-300">
              Proveedor
            </label>
            <input
              name="provider"
              value={form.provider}
              onChange={handleChange}
              placeholder="Ej: Proveedor XYZ"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:border-[#fa9715]"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-gray-300">
              Stock
            </label>
            <input
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:border-[#fa9715]"
              required
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-gray-300">
              Categoría
            </label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Ej: Medición, Corte, Oficina..."
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:border-[#fa9715]"
            />
          </div>

          {/* Imagen */}
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-gray-300">
              Imagen
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-gray-300">
              Descripción
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:border-[#fa9715] h-28"
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-[#fa9715] text-[#0D2137] py-3 rounded-xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <PlusCircle size={18} />
            Agregar Producto
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
