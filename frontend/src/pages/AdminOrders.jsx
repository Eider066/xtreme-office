import React, { useEffect, useState } from "react";
import { apiFetch } from "../lib/apiFetch";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, limit: 20 });
  const [loading, setLoading] = useState(true);

  const load = async (page = 1) => {
    try {
      setLoading(true);

      const res = await apiFetch(`/orders/list?page=${page}&limit=20`);

      if (res.data && res.data.success) {
        setOrders(res.data.data);
        setPagination(res.data.pagination);
      } else {
        setOrders([]);
      }

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-black mb-8 tracking-tight">Órdenes</h1>

      {loading ? (
        <p className="text-gray-400 text-sm">Cargando órdenes...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-400 text-sm">No hay órdenes registradas.</p>
      ) : (
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/10 text-[11px] uppercase tracking-widest text-gray-300">
              <tr>
                <th className="text-left px-4 py-3">ID</th>
                <th className="text-left px-4 py-3">Cliente</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Total</th>
                <th className="text-left px-4 py-3">Estado</th>
                <th className="text-left px-4 py-3">Fecha</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-white/10">
                  <td className="px-4 py-3 font-mono text-xs">#{o.id}</td>
                  <td className="px-4 py-3">{o.customer_name}</td>
                  <td className="px-4 py-3 text-gray-400">{o.customer_email}</td>

                  <td className="px-4 py-3 font-bold">
                    ${Number(o.total).toFixed(2)}
                  </td>

                  <td className="px-4 py-3 text-xs uppercase font-black">
                    {o.status}
                  </td>

                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(o.created_at).toLocaleString()}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/admin/orders/${o.id}`}
                      className="text-xs font-black uppercase tracking-widest text-[#fa9715]"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination.total > pagination.limit && (
        <div className="mt-4 flex justify-end gap-2 text-xs">
          <button
            disabled={pagination.page <= 1}
            onClick={() => load(pagination.page - 1)}
            className="px-3 py-1 rounded-lg border border-white/20 text-gray-300 disabled:opacity-40"
          >
            Anterior
          </button>

          <span className="px-2 py-1 text-gray-400">
            Página {pagination.page}
          </span>

          <button
            disabled={pagination.page * pagination.limit >= pagination.total}
            onClick={() => load(pagination.page + 1)}
            className="px-3 py-1 rounded-lg border border-white/20 text-gray-300 disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
