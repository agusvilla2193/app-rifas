import { auth, signOut } from "@/app/lib/auth.config";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import TicketGrid from "@/components/TicketGrid";
import StatsCards from "@/components/StatsCards";
import SalesTable from "@/components/SalesTable";

const prisma = new PrismaClient();

export default async function DashboardPage() {
    const session = await auth();
    if (!session) redirect("/auth");

    // Traemos todos los tickets incluyendo la relación con el vendedor (User)
    const tickets = await prisma.ticket.findMany({
        orderBy: { number: "asc" },
        include: {
            seller: {
                select: {
                    name: true,
                },
            },
        },
    });

    // Cálculos para las estadísticas
    const soldTickets = tickets.filter(t => t.status === "SOLD");
    const soldTicketsCount = soldTickets.length;
    const TICKET_PRICE = 5000;

    return (
        <main className="min-h-screen p-6 md:p-12 bg-club-primary">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Hola, <span className="text-club-accent">{session.user?.name}</span> 👋
                    </h1>
                    <p className="text-gray-400">Gestioná las ventas de rifas del club</p>
                </div>

                <form action={async () => {
                    "use server";
                    await signOut();
                }}>
                    <button className="px-4 py-2 text-sm border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500/10 transition-all">
                        Cerrar Sesión
                    </button>
                </form>
            </div>

            {/* SECCIÓN DE ESTADÍSTICAS */}
            <StatsCards
                totalTickets={tickets.length}
                soldTickets={soldTicketsCount}
                ticketPrice={TICKET_PRICE}
            />

            {/* GRILLA DE TICKETS */}
            <div className="rugby-card border-club-accent/10 mb-12">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                    <div className="w-2 h-2 bg-club-accent rounded-full animate-pulse"></div>
                    Seleccioná un número para vender
                </h3>

                <TicketGrid initialTickets={tickets} />
            </div>

            {/* LISTA DETALLADA DE VENTAS */}
            <SalesTable soldTickets={soldTickets} />
        </main>
    );
}
