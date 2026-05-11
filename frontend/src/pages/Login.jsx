import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/apiFetch";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFirstAdmin, setIsFirstAdmin] = useState(false);
  const navigate = useNavigate();

  // 🔍 Detectar si existe algún admin
  useEffect(() => {
    apiFetch("/admins/exists").then((res) => {
      if (res.ok) {
        setIsFirstAdmin(!res.data.exists); // true si NO hay admins
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ⭐ REGISTRO DEL PRIMER SUPERADMIN
      if (isFirstAdmin) {
        const res = await apiFetch("/admins/register-first", {
          method: "POST",
          body: { email, password }
        });

        if (!res.ok) {
          toast.error(res.data.error || "Error al registrar superadmin");
          return;
        }

        toast.success("Superadmin creado. Ahora inicia sesión.");
        setIsFirstAdmin(false);
        return;
      }

      // ⭐ LOGIN NORMAL
      const res = await apiFetch("/admins/login", {
        method: "POST",
        body: { email, password }
      });

      if (!res.ok) {
        toast.error("Credenciales incorrectas");
        return;
      }

      // Guardar token
      localStorage.setItem("token", res.data.token);

      toast.success("Bienvenido al panel admin");

      // Redirigir al panel admin
      navigate("/admin/products");
    } catch (err) {
      toast.error("Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D2137] px-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-black text-center mb-6 text-[#0D2137] uppercase">
          {isFirstAdmin ? "Registrar Superadmin" : "Admin Login"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase">
              Correo
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-1 text-sm focus:border-[#fa9715] outline-none"
              placeholder="admin@xtreme.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 uppercase">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-1 text-sm focus:border-[#fa9715] outline-none"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#fa9715] text-[#0D2137] py-3 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-[#ffb347] transition-all active:scale-95"
          >
            {isFirstAdmin ? "Crear Superadmin" : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
