"use client";

import { Ticket } from "@prisma/client";

interface TicketWithSeller extends Ticket {
    seller?: { name: string | null } | null;
}

interface Props {
    soldTickets: TicketWithSeller[];
}

export default function SalesTable({ soldTickets }: Props) {
    if (soldTickets.length === 0) {
        return (
            <div className="rugby-card border-dashed border-white/10 py-10 text-center">
                <p className="text-gray-500 italic">Aún no hay ventas registradas.</p>
            </div>
        );
    }

    return (
        <div className="rugby-card border-club-accent/10 overflow-hidden">
            <h3 className="text-xl font-bold mb-6 text-white uppercase tracking-wider">
                Registro de Ventas
            </h3>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-white/10 text-gray-400 uppercase text-[10px] tracking-widest">
                            <th className="px-4 py-3 font-medium">N°</th>
                            <th className="px-4 py-3 font-medium">Comprador</th>
                            <th className="px-4 py-3 font-medium">WhatsApp</th>
                            <th className="px-4 py-3 font-medium">Vendedor</th>
                            <th className="px-4 py-3 font-medium text-right">Fecha</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {soldTickets.map((ticket) => (
                            <tr key={ticket.id} className="hover:bg-white/[0.02] transition-colors">
                                <td className="px-4 py-4 font-bold text-club-accent">
                                    #{ticket.number}
                                </td>
                                <td className="px-4 py-4 text-white font-medium">
                                    {ticket.buyerName || "---"}
                                </td>
                                <td className="px-4 py-4 text-gray-400">
                                    {ticket.buyerPhone || "---"}
                                </td>
                                <td className="px-4 py-4">
                                    <span className="bg-white/5 px-2 py-1 rounded text-[11px] text-gray-300">
                                        {ticket.seller?.name || "Sistema"}
                                    </span>
                                </td>
                                <td className="px-4 py-4 text-right text-gray-500 text-[11px]">
                                    {ticket.soldAt ? new Date(ticket.soldAt).toLocaleDateString() : "---"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
