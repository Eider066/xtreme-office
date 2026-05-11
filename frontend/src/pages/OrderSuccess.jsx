import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { apiFetch } from "../lib/apiFetch";

const OrderSuccess = () => {
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⭐ URL dinámica (local o producción)
  const backendURL =
    window.location.hostname === "localhost"
      ? "http://localhost:4000"
      : "https://tu-backend.com"; // <-- cambiar cuando despliegues

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch(`/orders/${id}`);
        if (res.data?.success) {
          setOrderData(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-24 pb-32 px-4 text-center">
        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">
          Cargando tu orden...
        </p>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="pt-24 pb-32 px-4 text-center">
        <p className="text-red-500 text-sm font-bold uppercase tracking-widest">
          No se encontró la orden #{id}
        </p>
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-3 rounded-2xl bg-black text-white font-black uppercase tracking-widest text-xs"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  const { order, items } = orderData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-24 pb-32 px-4 max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-green-500 mb-2">
          Orden confirmada
        </p>
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-4">
          Gracias por tu compra
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          Tu número de orden es{" "}
          <span className="font-black text-gray-900">#{order.id}</span>.  
          Te contactaremos para coordinar la entrega.
        </p>

        {/* Resumen principal */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
              Datos del cliente
            </h2>
            <p className="text-sm font-semibold text-gray-900">
              {order.customer_name}
            </p>
            <p className="text-sm text-gray-500">{order.customer_email}</p>
            <p className="text-sm text-gray-500">{order.customer_phone}</p>
            <p className="text-sm text-gray-500 mt-2">
              {order.customer_address}
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
              Detalles de pago
            </h2>
            <p className="text-sm text-gray-600">
              Método:{" "}
              <span className="font-semibold uppercase">
                {order.paymentMethod}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Referencia:{" "}
              <span className="font-mono text-xs">
                {order.paymentReference || "N/A"}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Total pagado:{" "}
              <span className="font-black text-gray-900">
                ${order.total}
              </span>
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="border-t border-gray-100 pt-6">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4">
            Resumen de productos
          </h2>

          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4"
              >
                <img
                  src={`${backendURL}/uploads/${item.image}`}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-contain bg-white"
                />
                <div className="flex-1">
                  <p className="text-sm font-black uppercase text-gray-900 line-clamp-1">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Cantidad: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-gray-900">
                    ${item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botones */}
        <div className="mt-10 flex flex-col md:flex-row gap-3 md:justify-between">
          <Link
            to="/catalog"
            className="w-full md:w-auto text-center px-6 py-3 rounded-2xl border border-gray-200 font-black uppercase tracking-widest text-xs text-gray-700 hover:bg-gray-50"
          >
            Seguir comprando
          </Link>
          <Link
            to="/admin/orders"
            className="w-full md:w-auto text-center px-6 py-3 rounded-2xl bg-black text-white font-black uppercase tracking-widest text-xs hover:bg-yellow-400 hover:text-black transition-all"
          >
            Ver órdenes
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSuccess;
