"use client";

interface StatsProps {
    totalTickets: number;
    soldTickets: number;
    ticketPrice: number;
}

export default function StatsCards({ totalTickets, soldTickets, ticketPrice }: StatsProps) {
    const totalRecaudado = soldTickets * ticketPrice;
    const pendientes = totalTickets - soldTickets;
    const porcentajeProgreso = (soldTickets / totalTickets) * 100;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* CARD: TOTAL RECAUDADO */}
            <div className="rugby-card border-club-accent/20 bg-club-primary/40 backdrop-blur-md p-6">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Total Recaudado</p>
                <h4 className="text-3xl font-bold text-club-accent">
                    ${totalRecaudado.toLocaleString("es-AR")}
                </h4>
                <p className="text-[10px] text-gray-500 mt-2">Basado en {soldTickets} ventas</p>
            </div>

            {/* CARD: PROGRESO DE VENTAS */}
            <div className="rugby-card border-club-accent/20 bg-club-primary/40 backdrop-blur-md p-6">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Progreso de Venta</p>
                <div className="flex items-end justify-between mb-2">
                    <h4 className="text-3xl font-bold text-white">{porcentajeProgreso.toFixed(1)}%</h4>
                    <p className="text-xs text-gray-400">{soldTickets} / {totalTickets}</p>
                </div>
                {/* BARRA DE PROGRESO */}
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-club-accent transition-all duration-1000 ease-out"
                        style={{ width: `${porcentajeProgreso}%` }}
                    />
                </div>
            </div>

            {/* CARD: DISPONIBLES */}
            <div className="rugby-card border-club-accent/20 bg-club-primary/40 backdrop-blur-md p-6">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Tickets Pendientes</p>
                <h4 className="text-3xl font-bold text-white">{pendientes}</h4>
                <p className="text-[10px] text-gray-500 mt-2">Números aún disponibles para la rifa</p>
            </div>
        </div>
    );
}
