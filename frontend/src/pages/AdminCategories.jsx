import React, { useEffect, useState } from "react";
import { apiFetch } from "../lib/apiFetch";
import { toast } from "sonner";
import AdminLayout from "../components/AdminLayout";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const load = async () => {
    const res = await apiFetch("/categories");
    setCategories(res.data.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const createCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const res = await apiFetch("/categories", {
      method: "POST",
      body: { name },
    });

    if (res.data?.success) {
      toast.success("Categoría creada");
      setName("");
      load();
    } else {
      toast.error(res.data?.error || "Error");
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  const saveEdit = async () => {
    if (!editingName.trim()) return;

    const res = await apiFetch(`/categories/${editingId}`, {
      method: "PUT",
      body: { name: editingName },
    });

    if (res.data?.success) {
      toast.success("Categoría actualizada");
      setEditingId(null);
      setEditingName("");
      load();
    } else {
      toast.error(res.data?.error || "Error");
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm("¿Eliminar categoría?")) return;

    const res = await apiFetch(`/categories/${id}`, {
      method: "DELETE",
    });

    if (res.data?.success) {
      toast.success("Categoría eliminada");
      load();
    } else {
      toast.error(res.data?.error || "Error");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-black tracking-tight">Categorías</h1>

        {/* Crear categoría */}
        <form
          onSubmit={createCategory}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 flex gap-4 items-end"
        >
          <div className="flex-1">
            <label className="text-xs font-black uppercase tracking-widest text-gray-300">
              Nueva categoría
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Corte, Medición, Oficina..."
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:border-[#fa9715]"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-[#fa9715] text-[#0D2137] font-black uppercase tracking-widest text-xs hover:bg-white transition"
          >
            Agregar
          </button>
        </form>

        {/* Lista de categorías */}
        <div className="bg-white/5 border border-white/10 rounded-2xl">
          {categories.length === 0 ? (
            <p className="p-4 text-sm text-gray-400">
              No hay categorías creadas.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-white/10 text-xs uppercase text-gray-300 tracking-widest">
                <tr>
                  <th className="p-3 text-left">Nombre</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-t border-white/10">
                    <td className="p-3">
                      {editingId === cat.id ? (
                        <input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white outline-none focus:border-[#fa9715]"
                        />
                      ) : (
                        <span className="font-black uppercase text-sm">
                          {cat.name}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      {editingId === cat.id ? (
                        <>
                          <button
                            onClick={saveEdit}
                            className="px-3 py-2 rounded-xl bg-green-500/20 text-green-300 border border-green-500/30 text-xs font-black"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditingName("");
                            }}
                            className="px-3 py-2 rounded-xl bg-white/10 text-gray-300 border border-white/20 text-xs font-black"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(cat)}
                            className="px-3 py-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-black"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => deleteCategory(cat.id)}
                            className="px-3 py-2 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-black"
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
