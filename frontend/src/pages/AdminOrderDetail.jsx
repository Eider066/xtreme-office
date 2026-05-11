import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../lib/apiFetch";
import AdminLayout from "../components/AdminLayout";

const statuses = ["pendiente", "procesando", "enviado", "entregado", "cancelado"];

const statusColors = {
  pendiente: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
  procesando: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  enviado: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
  entregado: "bg-green-500/20 text-green-300 border border-green-500/30",
  cancelado: "bg-red-500/20 text-red-300 border border-red-500/30",
};

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const backendURL =
    window.location.hostname === "localhost"
      ? "http://localhost:4000"
      : "https://tu-backend.com";

  const load = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/orders/${id}`);

      if (res.data && res.data.success) {
        setOrder(res.data.data.order);
        setItems(res.data.data.items);
        setStatus(res.data.data.order.status);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      setSaving(true);
      await apiFetch(`/orders/${id}/status`, {
        method: "PATCH",
        body: { status: newStatus },
      });

      setStatus(newStatus);
      setOrder({ ...order, status: newStatus });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  if (loading)
    return (
      <AdminLayout>
        <p className="text-gray-400">Cargando...</p>
      </AdminLayout>
    );

  if (!order)
    return (
      <AdminLayout>
        <p className="text-gray-400">Orden no encontrada.</p>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="space-y-10">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-black tracking-tight">
            Orden #{order.id}
          </h1>

          <span
            className={`px-4 py-1 rounded-lg text-xs font-black uppercase ${statusColors[status]}`}
          >
            {status}
          </span>
        </div>

        {/* BOTONES */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => updateStatus("procesando")}
            disabled={status !== "pendiente"}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition
              ${
                status === "pendiente"
                  ? "bg-blue-600 text-white"
                  : "bg-white/10 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            Procesar
          </button>

          <button
            onClick={() => updateStatus("enviado")}
            disabled={status !== "procesando"}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition
              ${
                status === "procesando"
                  ? "bg-purple-600 text-white"
                  : "bg-white/10 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            Enviar
          </button>

          <button
            onClick={() => updateStatus("entregado")}
            disabled={status !== "enviado"}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition
              ${
                status === "enviado"
                  ? "bg-green-600 text-white"
                  : "bg-white/10 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            Entregar
          </button>

          <button
            onClick={() => updateStatus("cancelado")}
            disabled={status === "entregado" || status === "cancelado"}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition
              ${
                status !== "entregado" && status !== "cancelado"
                  ? "bg-red-600 text-white"
                  : "bg-white/10 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            Cancelar
          </button>
        </div>

        {/* CLIENTE + PAGO */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* CLIENTE */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 text-sm space-y-2">
            <h2 className="text-xs uppercase font-black text-gray-300 tracking-widest mb-2">
              Cliente
            </h2>
            <p className="font-bold">{order.customer_name}</p>
            <p className="text-gray-400">{order.customer_email}</p>
            <p className="text-gray-400">{order.customer_phone}</p>
            <p className="text-gray-300 mt-2">{order.customer_address}</p>
            <p className="text-xs text-gray-500 mt-2">
              Método de entrega: {order.delivery_method}
            </p>
          </div>

          {/* PAGO */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 text-sm space-y-2">
            <h2 className="text-xs uppercase font-black text-gray-300 tracking-widest mb-2">
              Pago
            </h2>
            <p>
              Método: <strong>{order.paymentMethod}</strong>
            </p>
            <p>
              Referencia:{" "}
              <span className="font-mono text-xs">{order.paymentReference}</span>
            </p>
            <p className="mt-3 text-xs text-gray-500">
              Creada: {new Date(order.created_at).toLocaleString()}
            </p>

            <div className="mt-4 space-y-1">
              <p>
                Subtotal:{" "}
                <strong>${Number(order.subtotal).toFixed(2)}</strong>
              </p>
              <p>
                IVA: <strong>${Number(order.tax).toFixed(2)}</strong>
              </p>
              <p>
                Envío: <strong>${Number(order.shipping).toFixed(2)}</strong>
              </p>
              <p className="text-lg font-black mt-2">
                Total: ${Number(order.total).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* PRODUCTOS */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
          <h2 className="text-xs uppercase font-black text-gray-300 tracking-widest mb-3">
            Productos
          </h2>

          {items.map((it) => (
            <div
              key={it.id}
              className="flex items-center gap-4 border-b border-white/10 pb-3 last:border-b-0"
            >
              <img
                src={`${backendURL}/uploads/${it.image}`}
                alt={it.name}
                className="w-16 h-16 object-contain rounded-lg bg-white/10"
              />

              <div className="flex-1">
                <p className="font-bold text-sm">{it.name}</p>
                <p className="text-xs text-gray-400">
                  Cantidad: {it.quantity} · Precio: $
                  {Number(it.price).toFixed(2)}
                </p>
              </div>

              <div className="text-sm font-black">
                ${(Number(it.price) * it.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
