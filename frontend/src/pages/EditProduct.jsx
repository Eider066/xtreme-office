import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/apiFetch";
import { toast } from "sonner";
import AdminLayout from "../components/AdminLayout";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const backendURL =
    window.location.hostname === "localhost"
      ? "http://localhost:4000"
      : "https://tu-backend.com";

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

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch(`/products/${id}`);
        setForm(res.data);

        if (res.data.image) {
          setPreview(`${backendURL}/uploads/${res.data.image}`);
        }
      } catch (err) {
        toast.error("Producto no encontrado");
        navigate("/catalog");
      }
    };

    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setForm({ ...form, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.keys(form).forEach((key) => {
        if (form[key] === "" || form[key] === null) return;
        if (key === "image" && typeof form.image === "string") return;
        data.append(key, form[key]);
      });

      await apiFetch(`/products/${id}`, {
        method: "PUT",
        body: data
      });

      toast.success("Producto actualizado");
      navigate(`/producto/${id}`);
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar producto");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-black mb-8 tracking-tight">
          Editar Producto
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10"
        >

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
              value={form.price_usd}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:border-[#fa9715]"
            />
          </div>

          {/* Tasa de cambio */}
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-gray-300">
              Tasa de cambio
            </label>
            <input
              name="exchange_rate"
              type="number"
              value={form.exchange_rate}
              onChange={handleChange}
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
            />
          </div>

          {preview && (
            <img
              src={preview}
              className="w-40 h-40 object-contain bg-white/10 rounded-xl border border-white/20"
            />
          )}

          <button className="w-full bg-[#fa9715] text-[#0D2137] py-3 rounded-xl font-black uppercase tracking-widest hover:bg-white transition">
            Guardar Cambios
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
