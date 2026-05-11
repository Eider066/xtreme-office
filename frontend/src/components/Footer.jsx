import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0D2137] text-white pt-16 pb-10 border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* LOGO + DESCRIPCIÓN */}
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">
            XTREME<span className="text-[#fa9715]">OFFICE</span>
          </h2>
          <p className="text-gray-400 text-sm mt-4 leading-relaxed">
            Herramientas de precisión para arquitectos, diseñadores y profesionales que exigen rendimiento.
          </p>

          {/* Redes sociales */}
          <div className="flex gap-4 mt-6">
            <a href="https://facebook.com" target="_blank" className="hover:text-[#fa9715] transition-colors">
              <Facebook size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" className="hover:text-[#fa9715] transition-colors">
              <Instagram size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" className="hover:text-[#fa9715] transition-colors">
              <Twitter size={20} />
            </a>
          </div>
        </div>

        {/* ENLACES RÁPIDOS */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-[#fa9715] mb-4">
            Navegación
          </h3>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">Inicio</Link></li>
            <li><Link to="/catalog" className="hover:text-white transition-colors">Catálogo</Link></li>
            <li><Link to="/orders" className="hover:text-white transition-colors">Mis Pedidos</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contacto</Link></li>
          </ul>
        </div>

        {/* INFORMACIÓN */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-[#fa9715] mb-4">
            Información
          </h3>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li className="flex items-center gap-2"><Mail size={16}/> soporte@xtremeoffice.com</li>
            <li className="flex items-center gap-2"><Phone size={16}/> +54 11 5555 5555</li>
            <li className="flex items-center gap-2"><MapPin size={16}/> Buenos Aires, Argentina</li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-[#fa9715] mb-4">
            Newsletter
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Recibí ofertas exclusivas y lanzamientos antes que nadie.
          </p>

          <form className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="TU EMAIL"
              className="bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-xs font-bold tracking-widest text-white placeholder-gray-500 focus:border-[#fa9715] outline-none"
            />
            <button className="bg-[#fa9715] text-[#0D2137] px-4 py-3 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-white transition-all">
              Suscribirme
            </button>
          </form>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="text-center text-[10px] text-gray-500 uppercase font-black tracking-widest mt-16 opacity-60">
        © 2026 Xtreme Office — Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
