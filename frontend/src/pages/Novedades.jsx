import React from "react";
import { motion } from "framer-motion";
import { Lightbulb, ArrowRight, Star, Sparkles } from "lucide-react";

const tips = [
  {
    id: 1,
    icon: <Star size={24} className="text-yellow-400" />,
    title: "Cómo elegir la mochila ideal para oficina",
    text: "Buscá materiales resistentes, compartimentos acolchados y correas ergonómicas.",
  },
  {
    id: 2,
    icon: <Sparkles size={24} className="text-blue-400" />,
    title: "Organizá tu escritorio para mejorar tu productividad",
    text: "Menos objetos, más enfoque. Usá organizadores y mantené solo lo esencial.",
  },
  {
    id: 3,
    icon: <Star size={24} className="text-pink-400" />,
    title: "Cómo cuidar tus bolsos y mochilas",
    text: "Evitá la humedad, limpiá con paño suave y guardalos en lugares ventilados.",
  },
  {
    id: 4,
    icon: <Sparkles size={24} className="text-green-400" />,
    title: "Tips para viajar con equipamiento técnico",
    text: "Usá fundas protectoras, distribuí el peso y asegurá los cierres.",
  },
];

export default function Novedades() {
  return (
    <div className="pt-24 pb-24 px-6 max-w-6xl mx-auto">
      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <div className="flex justify-center mb-4">
          <Lightbulb size={40} className="text-yellow-400" />
        </div>
        <h1 className="text-5xl font-black tracking-tight mb-3">
          Novedades & Tips
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Inspirate con consejos prácticos y novedades para potenciar tu día a día en la oficina.
        </p>
      </motion.div>

      {/* DESTACADO DEL MES */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-10 mb-16 shadow-lg"
      >
        <h2 className="text-2xl font-black mb-3">Destacado del mes</h2>
        <p className="text-sm opacity-90 mb-6">
          “Organizá tu espacio, simplificá tu rutina y descubrí cómo pequeños cambios pueden mejorar tu productividad.”
        </p>
        <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition">
          Leer más
        </button>
      </motion.div>

      {/* GRID DE TIPS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {tips.map((tip, i) => (
          <motion.div
            key={tip.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              {tip.icon}
              <h3 className="text-lg font-black">{tip.title}</h3>
            </div>
            <p className="text-gray-500 text-sm mb-4">{tip.text}</p>
            <button className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:underline">
              Leer más <ArrowRight size={16} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* BLOQUE INSPIRACIÓN */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-20 bg-[#0f0f0f] text-white rounded-3xl p-10 text-center shadow-xl"
      >
        <h2 className="text-2xl font-black mb-3">Inspiración XTREME</h2>
        <p className="text-gray-300 max-w-xl mx-auto">
          “La productividad no depende del tiempo que tenés, sino de cómo lo usás.”
        </p>
      </motion.div>
    </div>
  );
}
