import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/apiFetch";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  // ⭐ URL dinámica (local o producción)
  const backendURL =
    window.location.hostname === "localhost"
      ? "http://localhost:4000"
      : "https://tu-backend.com"; // <-- cambiar cuando despliegues

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        toast.error("Producto no encontrado");
        navigate("/catalog");
      }
    };
    load();
  }, [id]);

  if (!product) return null;

  return (
    <div className="pt-28 pb-20 max-w-5xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        <div className="bg-gray-100 rounded-2xl p-6 flex items-center justify-center">
          <img
            src={`${backendURL}/uploads/${product.image}`}
            className="w-full h-full object-contain"
          />
        </div>

        <div>
          <h1 className="text-3xl font-black uppercase italic text-[#0D2137]">
            {product.name}
          </h1>

          <p className="text-gray-500 mt-2">SKU: {product.sku}</p>

          <div className="mt-6">
            <p className="text-[#fa9715] font-black text-3xl">
              ${product.price_usd}
            </p>
            <p className="text-gray-600 text-lg">
              Bs {product.price_bs}
            </p>
          </div>

          <p className="text-gray-600 mt-6 leading-relaxed">
            {product.description}
          </p>

          <div className="flex gap-4 mt-10">
            <a
              href={`/editar-producto/${product.id}`}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-blue-700"
            >
              Editar
            </a>

            <button
              onClick={async () => {
                if (!confirm("¿Eliminar producto?")) return;

                await apiFetch(`/products/${product.id}`, {
                  method: "DELETE"
                });

                toast.success("Producto eliminado");
                navigate("/catalog");
              }}
              className="px-6 py-3 bg-red-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;
