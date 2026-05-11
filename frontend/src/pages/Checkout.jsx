import React, { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, Bolt } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { apiFetch } from "../lib/apiFetch";
import { paymentConfig } from "../config/paymentConfig";

// Input reutilizable
const Input = ({ label, value, onChange, placeholder, type = "text" }) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500 px-1">
            {label}
        </label>
        <input
            type={type}
            className="w-full px-5 py-4 bg-gray-100 rounded-xl focus:ring-2 focus:ring-black transition-all text-black placeholder:text-gray-400 font-medium outline-none"
            value={value ?? ""}
            onChange={onChange}
            placeholder={placeholder}
        />
    </div>
);

const Checkout = () => {
    const { cart, updateQuantity, removeFromCart, subtotal, clearCart } = useCart();
    const navigate = useNavigate();

    const shippingCost = 0;
    const tax = subtotal * 0.16;
    const total = subtotal + shippingCost + tax;

    const [shipping, setShipping] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono_contacto: "",
        direccion: "",
        ciudad: "",
        postal: "",
        delivery_method: "local", // "local" o "envio"
    });

    const [method, setMethod] = useState("pagoMovil");
    const [payment, setPayment] = useState({
        telefono: "",
        banco: "",
        referencia: "",
        zelleRef: "",
        binanceId: "",
    });

    const validate = () => {
        if (!shipping.nombre.trim() || shipping.nombre.length < 2)
            return toast.error("Ingresa un nombre válido");

        if (!shipping.apellido.trim() || shipping.apellido.length < 2)
            return toast.error("Ingresa un apellido válido");

        if (!shipping.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email))
            return toast.error("Ingresa un correo electrónico válido");

        const cleanPhone = shipping.telefono_contacto.replace(/\D/g, "");
        if (cleanPhone.length < 10)
            return toast.error("Ingresa un teléfono de contacto válido");

        if (shipping.delivery_method === "envio") {
            if (!shipping.direccion.trim() || shipping.direccion.length < 5)
                return toast.error("Ingresa una dirección válida");
            if (!shipping.ciudad.trim())
                return toast.error("Ingresa una ciudad válida");
            if (!shipping.postal.trim())
                return toast.error("Ingresa un código postal válido");
        }

        if (method === "pagoMovil") {
            if (!payment.telefono || !payment.banco || !payment.referencia)
                return toast.error("Completa los datos de Pago Móvil");
        }

        if (method === "zelle" && !payment.zelleRef)
            return toast.error("Ingresa la referencia de Zelle");

        if (method === "binance" && !payment.binanceId)
            return toast.error("Ingresa el ID de Binance");

        return true;
    };

    const handleDeployOrder = async () => {
        if (!validate()) return;

        for (const item of cart) {
            if (item.stock === 0) {
                return toast.error(`${item.name} está agotado`);
            }
            if (item.qty > item.stock) {
                return toast.error(`No hay suficiente stock de ${item.name}`);
            }
        }

        try {
            const res = await apiFetch("/orders", {
                method: "POST",
                body: {
                    items: cart,
                    subtotal: Number(subtotal.toFixed(2)),
                    shipping: Number(shippingCost.toFixed(2)),
                    tax: Number(tax.toFixed(2)),
                    total: Number(total.toFixed(2)),
                    paymentMethod: method,
                    paymentReference:
                        payment.referencia || payment.zelleRef || payment.binanceId,

                    customer_name: `${shipping.nombre} ${shipping.apellido}`,
                    customer_email: shipping.email,
                    customer_phone: shipping.telefono_contacto,
                    customer_address:
                        shipping.delivery_method === "local"
                            ? "Retiro en local"
                            : `${shipping.direccion}, ${shipping.ciudad}, CP: ${shipping.postal}`,

                    delivery_method: shipping.delivery_method,
                },
            });

            if (!res.data || !res.data.success) {
                toast.error(res.data?.error || "Error procesando la orden");
                return;
            }

            toast.success("¡Orden procesada con éxito!");
            clearCart();
            navigate(`/order-success/${res.data.orderId}`);
        } catch (error) {
            console.error(error);
            toast.error("Error del servidor al conectar con la base de datos");
        }
    };
    const backendURL =
        window.location.hostname === "localhost"
            ? "http://localhost:4000"
            : "https://tu-backend.com"; // <-- cambiar cuando despliegues


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto"
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* IZQUIERDA: CARRITO + FORMULARIOS */}
                <div className="lg:col-span-7 space-y-10">
                    <h1 className="text-4xl font-extrabold uppercase italic tracking-tighter">
                        Revisa tu carrito
                    </h1>

                    {cart.length === 0 ? (
                        <div className="p-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed">
                            <p className="text-gray-400 font-bold uppercase tracking-widest">
                                Carrito vacío
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-6 p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <img
                                        src={`${backendURL}/uploads/${item.image}`}
                                        alt={item.name}
                                        className="w-24 h-24 object-contain rounded-lg bg-gray-100"
                                    />

                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-lg font-bold uppercase">
                                                {item.name}
                                            </h3>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-500 p-1"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        <span className="text-xl font-black block mt-1">
                                            ${(item.price_usd * item.qty).toFixed(2)}
                                        </span>

                                        <div className="flex items-center gap-3 mt-3">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.qty - 1)}
                                                className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200"
                                                disabled={item.qty <= 1}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="font-black w-8 text-center">
                                                {item.qty}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.qty + 1)}
                                                className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* DATOS DEL CLIENTE */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-black uppercase flex items-center gap-2 border-b-2 border-black pb-2">
                            📦 Datos del cliente
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Nombre"
                                value={shipping.nombre}
                                onChange={(e) =>
                                    setShipping({ ...shipping, nombre: e.target.value })
                                }
                                placeholder="Juan"
                            />
                            <Input
                                label="Apellido"
                                value={shipping.apellido}
                                onChange={(e) =>
                                    setShipping({ ...shipping, apellido: e.target.value })
                                }
                                placeholder="Pérez"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Correo Electrónico"
                                type="email"
                                value={shipping.email}
                                onChange={(e) =>
                                    setShipping({ ...shipping, email: e.target.value })
                                }
                                placeholder="juan@ejemplo.com"
                            />
                            <Input
                                label="Teléfono de Contacto"
                                value={shipping.telefono_contacto}
                                onChange={(e) =>
                                    setShipping({
                                        ...shipping,
                                        telefono_contacto: e.target.value,
                                    })
                                }
                                placeholder="04241234567"
                            />
                        </div>

                        {/* MÉTODO DE ENTREGA */}
                        <h2 className="text-2xl font-black uppercase border-b-2 border-black pb-2">
                            🚚 Método de Entrega
                        </h2>

                        <div className="flex gap-4">
                            <button
                                onClick={() =>
                                    setShipping({ ...shipping, delivery_method: "local" })
                                }
                                className={`flex-1 py-4 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${shipping.delivery_method === "local"
                                        ? "bg-black text-white shadow-xl scale-105"
                                        : "bg-gray-100 text-gray-400"
                                    }`}
                            >
                                Retiro en Local
                            </button>

                            <button
                                onClick={() =>
                                    setShipping({ ...shipping, delivery_method: "envio" })
                                }
                                className={`flex-1 py-4 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${shipping.delivery_method === "envio"
                                        ? "bg-black text-white shadow-xl scale-105"
                                        : "bg-gray-100 text-gray-400"
                                    }`}
                            >
                                Envío a Domicilio
                            </button>
                        </div>

                        {shipping.delivery_method === "envio" && (
                            <>
                                <Input
                                    label="Dirección Exacta"
                                    value={shipping.direccion}
                                    onChange={(e) =>
                                        setShipping({ ...shipping, direccion: e.target.value })
                                    }
                                    placeholder="Calle, Edificio, Apto..."
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Ciudad"
                                        value={shipping.ciudad}
                                        onChange={(e) =>
                                            setShipping({ ...shipping, ciudad: e.target.value })
                                        }
                                        placeholder="Caracas"
                                    />
                                    <Input
                                        label="Código Postal"
                                        value={shipping.postal}
                                        onChange={(e) =>
                                            setShipping({ ...shipping, postal: e.target.value })
                                        }
                                        placeholder="1010"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* MÉTODO DE PAGO */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-black uppercase border-b-2 border-black pb-2">
                            💳 Método de Pago
                        </h2>

                        <div className="flex flex-wrap gap-2">
                            {["pagoMovil", "zelle", "binance"].map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setMethod(m)}
                                    className={`flex-1 min-w-[100px] py-4 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${method === m
                                            ? "bg-black text-white shadow-xl scale-105"
                                            : "bg-gray-100 text-gray-400"
                                        }`}
                                >
                                    {m === "pagoMovil" ? "Pago Móvil" : m}
                                </button>
                            ))}
                        </div>

                        <div className="p-6 bg-gray-50 rounded-2xl space-y-6">
                            {method === "pagoMovil" && (
                                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-400">
                                    <h3 className="text-lg font-black uppercase text-[#0D2137] mb-2">
                                        Datos de Pago Móvil
                                    </h3>
                                    <p className="text-sm font-bold">
                                        Teléfono destino: {paymentConfig.pagoMovil.telefono}
                                    </p>
                                    <p className="text-sm font-bold">
                                        Banco: {paymentConfig.pagoMovil.banco}
                                    </p>
                                    <p className="text-sm font-bold">
                                        Cédula/RIF: {paymentConfig.pagoMovil.rif}
                                    </p>
                                </div>
                            )}

                            {method === "zelle" && (
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-400">
                                    <h3 className="text-lg font-black uppercase text-[#0D2137] mb-2">
                                        Datos de Zelle
                                    </h3>
                                    <p className="text-sm font-bold">
                                        Email: {paymentConfig.zelle.email}
                                    </p>
                                    <p className="text-sm font-bold">
                                        Nombre: {paymentConfig.zelle.nombre}
                                    </p>
                                </div>
                            )}

                            {method === "binance" && (
                                <div className="bg-green-50 p-4 rounded-xl border border-green-400">
                                    <h3 className="text-lg font-black uppercase text-[#0D2137] mb-2">
                                        Datos de Binance
                                    </h3>
                                    <p className="text-sm font-bold">
                                        Wallet: {paymentConfig.binance.wallet}
                                    </p>
                                    <p className="text-sm font-bold">
                                        Red: {paymentConfig.binance.red}
                                    </p>
                                </div>
                            )}

                            {method === "pagoMovil" && (
                                <div className="grid gap-4">
                                    <Input
                                        label="Teléfono Origen (Pago Móvil)"
                                        value={payment.telefono}
                                        onChange={(e) =>
                                            setPayment({ ...payment, telefono: e.target.value })
                                        }
                                        placeholder="0412-1234567"
                                    />
                                    <Input
                                        label="Banco Emisor"
                                        value={payment.banco}
                                        onChange={(e) =>
                                            setPayment({ ...payment, banco: e.target.value })
                                        }
                                        placeholder="Banco de Venezuela"
                                    />
                                    <Input
                                        label="Número de Referencia"
                                        value={payment.referencia}
                                        onChange={(e) =>
                                            setPayment({ ...payment, referencia: e.target.value })
                                        }
                                        placeholder="Ej: 1234"
                                    />
                                </div>
                            )}

                            {method === "zelle" && (
                                <Input
                                    label="Referencia Zelle"
                                    value={payment.zelleRef}
                                    onChange={(e) =>
                                        setPayment({ ...payment, zelleRef: e.target.value })
                                    }
                                    placeholder="Código de confirmación"
                                />
                            )}

                            {method === "binance" && (
                                <Input
                                    label="Binance Order ID"
                                    value={payment.binanceId}
                                    onChange={(e) =>
                                        setPayment({ ...payment, binanceId: e.target.value })
                                    }
                                    placeholder="ID de la transacción"
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* ASIDE: RESUMEN */}
                <aside className="lg:col-span-5 bg-black text-white p-8 rounded-3xl shadow-2xl lg:sticky lg:top-8">
                    <h2 className="text-2xl font-black uppercase mb-8 flex items-center gap-2">
                        <Bolt className="text-yellow-400" /> Resumen de Orden
                    </h2>

                    <div className="space-y-4 border-b border-white/10 pb-6 text-sm">
                        <p className="flex justify-between font-medium">
                            <span className="text-gray-400">Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </p>

                        <p className="flex justify-between font-medium">
                            <span className="text-gray-400">IVA (16%)</span>
                            <span>${tax.toFixed(2)}</span>
                        </p>

                        <p className="flex justify-between font-medium">
                            <span className="text-gray-400">Envío</span>
                            <span className="text-green-400">GRATIS</span>
                        </p>
                    </div>

                    <div className="mt-8">
                        <div className="flex justify-between items-end">
                            <span className="text-xs uppercase font-black text-gray-500 mb-1">
                                Total Final
                            </span>
                            <span className="text-5xl font-black tracking-tighter">
                                ${total.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleDeployOrder}
                        disabled={cart.length === 0}
                        className="w-full mt-10 py-6 bg-yellow-400 text-black rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale"
                    >
                        Confirmar Pedido
                    </button>

                    <p className="text-[10px] text-center text-gray-500 mt-6 uppercase font-bold tracking-widest">
                        Transacción protegida por cifrado SSL
                    </p>
                </aside>
            </div>
        </motion.div>
    );
};

export default Checkout;
