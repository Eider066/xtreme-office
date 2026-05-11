import React, { useEffect, useState } from "react";
import { apiFetch } from "../lib/apiFetch";
import { BarChart3, Package, ShoppingBag, Clock } from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [latestOrders, setLatestOrders] = useState([]);

  useEffect(() => {
    apiFetch("/dashboard/summary").then((res) => {
      if (res.ok) setData(res.data);
    });

    apiFetch("/dashboard/latest-orders").then((res) => {
      if (res.ok) setLatestOrders(res.data);
    });
  }, []);

  if (!data) return <p className="text-white p-10">Cargando...</p>;

  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl font-black mb-8 uppercase tracking-widest">
        Dashboard
      </h1>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Productos */}
        <div className="bg-[#0D2137] p-6 rounded-2xl border border-white/10 shadow-xl flex items-center gap-4">
          <Package size={40} className="text-[#fa9715]" />
          <div>
            <p className="text-sm uppercase tracking-widest text-white/60">Productos</p>
            <p className="text-3xl font-black">{data.products}</p>
          </div>
        </div>

        {/* Órdenes */}
        <div className="bg-[#0D2137] p-6 rounded-2xl border border-white/10 shadow-xl flex items-center gap-4">
          <ShoppingBag size={40} className="text-[#fa9715]" />
          <div>
            <p className="text-sm uppercase tracking-widest text-white/60">Órdenes</p>
            <p className="text-3xl font-black">{data.orders}</p>
          </div>
        </div>

        {/* Pendientes */}
        <div className="bg-[#0D2137] p-6 rounded-2xl border border-white/10 shadow-xl flex items-center gap-4">
          <Clock size={40} className="text-[#fa9715]" />
          <div>
            <p className="text-sm uppercase tracking-widest text-white/60">Pendientes</p>
            <p className="text-3xl font-black">{data.pending}</p>
          </div>
        </div>

        {/* Ventas */}
        <div className="bg-[#0D2137] p-6 rounded-2xl border border-white/10 shadow-xl flex items-center gap-4">
          <BarChart3 size={40} className="text-[#fa9715]" />
          <div>
            <p className="text-sm uppercase tracking-widest text-white/60">Ventas Totales</p>
            <p className="text-3xl font-black">${data.sales}</p>
          </div>
        </div>

      </div>

      {/* ÚLTIMAS ÓRDENES */}
      <div className="mt-12">
        <h2 className="text-xl font-black uppercase tracking-widest mb-4">
          Últimas Órdenes
        </h2>

        <div className="bg-[#0D2137] border border-white/10 rounded-2xl p-6 shadow-xl">
          <table className="w-full text-left text-white/80 text-sm">
            <thead>
              <tr className="text-white border-b border-white/10">
                <th className="pb-3">ID</th>
                <th className="pb-3">Cliente</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Estado</th>
                <th className="pb-3">Fecha</th>
              </tr>
            </thead>

            <tbody>
              {latestOrders.map((order) => (
                <tr key={order.id} className="border-b border-white/5">
                  <td className="py-3">{order.id}</td>
                  <td>{order.customer_name}</td>
                  <td>${order.total}</td>
                  <td className="uppercase text-[#fa9715]">{order.status}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {latestOrders.length === 0 && (
            <p className="text-white/50 text-center py-4">
              No hay órdenes recientes.
            </p>
          )}
        </div>
      </div>

    </div>
  );
}
