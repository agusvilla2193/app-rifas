"use client";

import { useState } from "react";
import { Ticket } from "@prisma/client";

export default function PublicTicketGrid({ initialTickets }: { initialTickets: Ticket[] }) {
    const [selected, setSelected] = useState<Ticket | null>(null);

    // Configuramos el mensaje de WhatsApp
    const WHATSAPP_NUMBER = "5491130981888"; // <--- PONÉ TU NÚMERO ACÁ

    const handleReserve = (number: number) => {
        const message = encodeURIComponent(
            `¡Hola! Vi la web de la rifa del Club San Fernando y me gustaría reservar el número: ${number}. ¿Está disponible?`
        );
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
    };

    return (
        <>
            <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-20 gap-2">
                {initialTickets.map((t) => (
                    <div
                        key={t.id}
                        onClick={() => t.status === "AVAILABLE" && setSelected(t)}
                        className={`aspect-square flex items-center justify-center text-[10px] border rounded transition-all 
              ${t.status === "SOLD"
                                ? "bg-white/5 border-white/5 text-gray-700 cursor-not-allowed opacity-30"
                                : "bg-club-primary border-white/10 text-gray-400 hover:border-club-accent hover:text-club-accent cursor-pointer hover:scale-110 shadow-sm"
                            }`}
                        title={t.status === "SOLD" ? "Vendido" : `Número ${t.number} disponible`}
                    >
                        {t.number}
                    </div>
                ))}
            </div>

            {/* MODAL DE RESERVA */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="rugby-card max-w-sm w-full border-club-accent/40 text-center shadow-2xl">
                        <div className="w-16 h-16 bg-club-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl font-black text-club-accent">#</span>
                        </div>
                        <h3 className="text-4xl font-black mb-2 italic text-white">{selected.number}</h3>
                        <p className="text-gray-400 mb-8 px-4">
                            Hacé clic abajo para enviarnos un WhatsApp y reservar tu número.
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => handleReserve(selected.number)}
                                className="bg-[#25D366] text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-500/20"
                            >
                                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.888 11.888-11.888 3.176 0 6.161 1.237 8.404 3.48s3.48 5.228 3.48 8.404c0 6.556-5.332 11.888-11.888 11.888-2.022 0-4.005-.515-5.76-1.492l-6.223 1.717zm6.383-4.623c1.657.981 3.287 1.47 5.011 1.47 5.484 0 9.948-4.464 9.948-9.948 0-5.484-4.464-9.948-9.948-9.948-5.484 0-9.948 4.464-9.948 9.948 0 1.902.536 3.757 1.55 5.385l-1.01 3.687 3.797-1.046z" /></svg>
                                SOLICITAR POR WHATSAPP
                            </button>
                            <button
                                onClick={() => setSelected(null)}
                                className="text-gray-500 text-xs uppercase tracking-widest py-2 hover:text-white transition-colors"
                            >
                                Cerrar y elegir otro
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
