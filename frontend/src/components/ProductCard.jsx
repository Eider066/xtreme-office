import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  // ⭐ URL dinámica (local o producción)
  const backendURL =
    window.location.hostname === "localhost"
      ? "http://localhost:4000"
      : "https://tu-backend.com"; // <-- cambiar cuando despliegues

  // Badge de stock (premium)
  const stockBadge = (
    <span
      className={`
        text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full
        ${
          product.stock === 0
            ? "bg-red-100 text-red-600"
            : product.stock < 5
            ? "bg-yellow-100 text-yellow-600"
            : "bg-green-100 text-green-600"
        }
      `}
    >
      {product.stock === 0
        ? "Agotado"
        : product.stock < 5
        ? `Pocas unidades (${product.stock})`
        : `Stock: ${product.stock}`}
    </span>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">

      <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden p-4 relative">
        <img
          src={`${backendURL}/uploads/${product.image}`}
          alt={product.name}
          className="w-full h-full object-contain"
        />

        {/* Badge en esquina superior izquierda */}
        <div className="absolute top-3 left-3">
          {stockBadge}
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-sm font-black text-[#0D2137] uppercase line-clamp-2">
          {product.name}
        </h2>

        <p className="text-xs text-gray-500 mt-1">SKU: {product.sku}</p>

        <div className="mt-3">
          <p className="text-blue-600 font-black text-lg">${product.price_usd}</p>
          <p className="text-gray-600 text-xs">Bs {product.price_bs}</p>
        </div>

        <button
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          className={`
            w-full mt-4 py-3 rounded-2xl
            font-black uppercase tracking-widest text-sm
            flex items-center justify-center gap-2
            transition-all duration-300
            active:scale-95
            ${
              product.stock === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-slate-900 text-white hover:bg-blue-600 hover:shadow-xl hover:-translate-y-[2px]"
            }
          `}
        >
          <ShoppingCart size={16} />
          {product.stock === 0 ? "Agotado" : "Agregar al carrito"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
