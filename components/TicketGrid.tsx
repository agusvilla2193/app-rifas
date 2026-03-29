"use client";

import { useState } from "react";
import { Ticket } from "@prisma/client";
import { sellTicket } from "@/app/lib/actions";

interface Props {
    initialTickets: Ticket[];
}

export default function TicketGrid({ initialTickets }: Props) {
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isPending, setIsPending] = useState(false);

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsPending(true);

        const formData = new FormData(e.currentTarget);

        try {
            const result = await sellTicket(formData);

            if (result.success && result.whatsappUrl) {
                // Abrimos WhatsApp en una pestaña nueva
                window.open(result.whatsappUrl, "_blank");
                setSelectedTicket(null);
            }
        } catch (error) {
            console.error("Error al vender:", error);
            alert("Hubo un error al procesar la venta.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <>
            <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-20 gap-2">
                {initialTickets.map((ticket) => (
                    <div
                        key={ticket.id}
                        onClick={() => ticket.status === 'AVAILABLE' && setSelectedTicket(ticket)}
                        className={`aspect-square flex items-center justify-center text-[10px] border rounded transition-all 
              ${ticket.status === 'SOLD'
                                ? 'bg-club-accent text-club-primary border-club-accent opacity-50 cursor-not-allowed'
                                : 'bg-club-primary/50 border-white/5 text-gray-400 hover:border-club-accent hover:text-club-accent cursor-pointer hover:scale-110'
                            }`}
                    >
                        {ticket.number}
                    </div>
                ))}
            </div>

            {/* MODAL (Estilo Glassmorphism) */}
            {selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="rugby-card w-full max-w-md border-club-accent/30 shadow-2xl animate-in fade-in zoom-in duration-300">
                        <h3 className="text-2xl font-bold mb-6 text-club-accent">
                            Vender Número #{selectedTicket.number}
                        </h3>

                        <form className="space-y-4" onSubmit={handleFormSubmit}>
                            {/* Inputs ocultos para la Server Action */}
                            <input type="hidden" name="ticketId" value={selectedTicket.id} />
                            <input type="hidden" name="number" value={selectedTicket.number} />

                            <div>
                                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Nombre del Comprador</label>
                                <input
                                    required
                                    name="name"
                                    type="text"
                                    className="w-full bg-club-primary border border-white/10 rounded-lg px-4 py-3 focus:border-club-accent outline-none transition-all"
                                    placeholder="Ej: Juan Perez"
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">WhatsApp</label>
                                <input
                                    required
                                    name="phone"
                                    type="tel"
                                    className="w-full bg-club-primary border border-white/10 rounded-lg px-4 py-3 focus:border-club-accent outline-none transition-all"
                                    placeholder="5491112345678"
                                />
                                <p className="text-[10px] text-gray-500 mt-1 ml-1">Incluir código de país y área (sin + ni espacios).</p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    disabled={isPending}
                                    onClick={() => setSelectedTicket(null)}
                                    className="flex-1 py-3 border border-white/10 rounded-lg hover:bg-white/5 transition-all disabled:opacity-50"
                                >
                                    CANCELAR
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="flex-1 py-3 bg-club-accent text-club-primary font-bold rounded-lg hover:scale-105 active:scale-95 transition-all shadow-lg shadow-club-accent/20 disabled:opacity-50"
                                >
                                    {isPending ? "PROCESANDO..." : "CONFIRMAR VENTA"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
