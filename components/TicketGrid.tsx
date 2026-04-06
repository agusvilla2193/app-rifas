"use client";

import { useState, useMemo } from "react";
import { Ticket } from "@prisma/client";
import { sellTicket, updateTicket } from "@/app/lib/actions";
import { toast } from "sonner";

interface Props {
    initialTickets: Ticket[];
}

type FilterStatus = "ALL" | "AVAILABLE" | "SOLD";

export default function TicketGrid({ initialTickets }: Props) {
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
    const [isPending, setIsPending] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<FilterStatus>("ALL");

    const filteredTickets = useMemo(() => {
        return initialTickets.filter((ticket) => {
            const matchesSearch = ticket.number.toString().includes(searchTerm);
            const matchesStatus =
                statusFilter === "ALL" || ticket.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [initialTickets, searchTerm, statusFilter]);

    const handleSellSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsPending(true);
        const formData = new FormData(e.currentTarget);

        try {
            const result = await sellTicket(formData);
            if (result.success && result.whatsappUrl) {
                toast.success("¡Venta registrada con éxito!");
                setTimeout(() => {
                    window.open(result.whatsappUrl, "_blank");
                    setSelectedTicket(null);
                }, 1000);
            } else {
                toast.error(result.error || "No se pudo procesar la venta.");
            }
        } catch {
            toast.error("Ocurrió un error inesperado.");
        } finally {
            setIsPending(false);
        }
    };

    const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsPending(true);
        const formData = new FormData(e.currentTarget);
        // Capturamos el botón que disparó el submit para saber la acción
        const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
        if (submitter) formData.set("action", submitter.value);

        try {
            const result = await updateTicket(formData);
            if (result.success) {
                toast.success("Ticket actualizado correctamente.");
                setEditingTicket(null);
            } else {
                toast.error(result.error || "Error al actualizar.");
            }
        } catch {
            toast.error("Ocurrió un error inesperado.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <>
            {/* FILTROS */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex-1">
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1 mb-2 block">
                        Buscar número
                    </label>
                    <input
                        type="number"
                        placeholder="Ej: 145"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-club-primary border border-white/10 rounded-lg px-4 py-2 focus:border-club-accent outline-none transition-all text-sm text-white"
                    />
                </div>
                <div className="md:w-48">
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1 mb-2 block">
                        Estado
                    </label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                        className="w-full bg-club-primary border border-white/10 rounded-lg px-4 py-2 focus:border-club-accent outline-none transition-all text-sm text-gray-300"
                    >
                        <option value="ALL">Todos</option>
                        <option value="AVAILABLE">Disponibles</option>
                        <option value="SOLD">Vendidos</option>
                    </select>
                </div>
            </div>

            {/* GRILLA */}
            <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-20 gap-2">
                {filteredTickets.map((ticket) => (
                    <div
                        key={ticket.id}
                        onClick={() => {
                            if (ticket.status === "AVAILABLE") {
                                setSelectedTicket(ticket);
                            } else {
                                setEditingTicket(ticket);
                            }
                        }}
                        className={`aspect-square flex items-center justify-center text-[10px] border rounded transition-all cursor-pointer hover:scale-110 
              ${ticket.status === "SOLD"
                                ? "bg-club-accent text-club-primary border-club-accent hover:opacity-80"
                                : "bg-club-primary/50 border-white/5 text-gray-400 hover:border-club-accent hover:text-club-accent"
                            }`}
                    >
                        {ticket.number}
                    </div>
                ))}
            </div>

            {/* MODAL DE VENTA */}
            {selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="rugby-card w-full max-w-md border-club-accent/30 shadow-2xl animate-in fade-in zoom-in duration-300">
                        <h3 className="text-2xl font-bold mb-6 text-club-accent">Vender Número #{selectedTicket.number}</h3>
                        <form className="space-y-4" onSubmit={handleSellSubmit}>
                            <input type="hidden" name="ticketId" value={selectedTicket.id} />
                            <input type="hidden" name="number" value={selectedTicket.number} />
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Nombre del Comprador</label>
                                <input required name="name" type="text" className="w-full bg-club-primary border border-white/10 rounded-lg px-4 py-3 focus:border-club-accent outline-none transition-all" placeholder="Ej: Juan Perez" />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">WhatsApp</label>
                                <input required name="phone" type="tel" className="w-full bg-club-primary border border-white/10 rounded-lg px-4 py-3 focus:border-club-accent outline-none transition-all" placeholder="54911..." />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" disabled={isPending} onClick={() => setSelectedTicket(null)} className="flex-1 py-3 border border-white/10 rounded-lg hover:bg-white/5 transition-all">CANCELAR</button>
                                <button type="submit" disabled={isPending} className="flex-1 py-3 bg-club-accent text-club-primary font-bold rounded-lg hover:scale-105 transition-all">
                                    {isPending ? "PROCESANDO..." : "CONFIRMAR VENTA"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL DE EDICIÓN (ADMIN) */}
            {editingTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
                    <div className="rugby-card w-full max-w-md border-yellow-500/30 shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-yellow-500">Editar Ticket #{editingTicket.number}</h3>
                            <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded">ADMIN</span>
                        </div>
                        <form className="space-y-4" onSubmit={handleEditSubmit}>
                            <input type="hidden" name="ticketId" value={editingTicket.id} />
                            <div>
                                <label className="block text-xs uppercase text-gray-400 mb-2">Nombre del Comprador</label>
                                <input required name="name" defaultValue={editingTicket.buyerName || ""} className="w-full bg-club-primary border border-white/10 rounded-lg px-4 py-3 focus:border-yellow-500 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs uppercase text-gray-400 mb-2">WhatsApp</label>
                                <input required name="phone" defaultValue={editingTicket.buyerPhone || ""} className="w-full bg-club-primary border border-white/10 rounded-lg px-4 py-3 focus:border-yellow-500 outline-none transition-all" />
                            </div>
                            <div className="flex flex-col gap-3 pt-4">
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setEditingTicket(null)} className="flex-1 py-3 border border-white/10 rounded-lg hover:bg-white/5 transition-all">CERRAR</button>
                                    <button type="submit" name="action" value="UPDATE" disabled={isPending} className="flex-1 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-all">
                                        {isPending ? "GUARDANDO..." : "GUARDAR"}
                                    </button>
                                </div>
                                <button type="submit" name="action" value="RELEASE" disabled={isPending} className="w-full py-3 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500/10 transition-all text-xs font-bold uppercase tracking-widest">
                                    Liberar Número (Anular Venta)
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
