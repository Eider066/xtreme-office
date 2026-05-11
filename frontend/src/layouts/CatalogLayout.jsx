import React from "react";

export default function CatalogLayout({ sidebar, content }) {
  return (
    <div className="flex min-h-screen bg-[#0f0f0f] text-white">
      {/* SIDEBAR OSCURO */}
      <aside className="hidden lg:block w-64 bg-[#111111] border-r border-[#1f1f1f] p-8">
        {sidebar}
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-6 md:p-10 bg-[#0f0f0f] text-white">
        {content}
      </main>
    </div>
  );
}
