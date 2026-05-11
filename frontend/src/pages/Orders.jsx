import React, { useEffect, useState } from "react";
import { apiFetch } from "../lib/apiFetch";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch("/orders/my-orders");

        console.log("ORDERS RESPONSE:", res);

        const list =
          Array.isArray(res.data?.data)
            ? res.data.data
            : Array.isArray(res.data)
            ? res.data
            : [];

        setOrders(list);
      } catch (err) {
        console.error(err);
        setOrders([]);
      }
    };

    load();
  }, []);

  return (
    <div className="pt-24 px-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-black mb-8">Mis pedidos</h1>

      {orders.length === 0 && (
        <p className="text-gray-400 text-sm">No tienes pedidos aún.</p>
      )}

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-6 bg-white rounded-2xl border shadow-sm"
          >
            <div className="flex justify-between mb-4">
              <span className="font-bold">Orden #{order.id}</span>
              <span className="text-blue-600 font-bold">{order.status}</span>
            </div>

            <p className="text-sm text-gray-500 mb-2">
              Fecha: {new Date(order.created_at).toLocaleDateString()}
            </p>

            <p className="font-bold text-lg mb-4">
              Total: ${order.total_usd}
            </p>

            <div className="space-y-2">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.product_name}</span>
                  <span>x{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
