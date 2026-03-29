import Link from 'next/link';
import { PrismaClient, Ticket } from '@prisma/client';
import { auth } from "@/app/lib/auth.config";

const prisma = new PrismaClient();

export default async function Home() {
  const session = await auth();

  // 1. Traemos los tickets de la base de datos
  const tickets = await prisma.ticket.findMany({
    orderBy: { number: 'asc' },
  });

  // 2. Calculamos estadísticas reales
  const total = tickets.length;
  const vendidos = tickets.filter((t: Ticket) => t.status === 'SOLD').length;
  const disponibles = total - vendidos;

  return (
    <main className="min-h-screen p-6 md:p-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-2">
            CLUB <span className="text-club-accent">SAN FERNANDO</span>
          </h1>
          <p className="text-gray-400 text-lg uppercase tracking-widest">Sistema de Gestión de Rifas</p>
        </div>

        {/* PASO 3: Botón Dinámico */}
        <Link href={session ? "/dashboard" : "/auth"}>
          <button className="px-8 py-3 bg-club-accent text-club-primary font-bold rounded-full hover:bg-white hover:scale-105 transition-all cursor-pointer">
            {session ? "IR AL PANEL" : "ACCESO VENDEDORES"}
          </button>
        </Link>
      </div>

      {/* Stats Cards Reales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <div className="rugby-card">
          <p className="text-gray-400 text-sm mb-1 uppercase tracking-widest">Total Números</p>
          <h2 className="text-4xl font-bold">{total}</h2>
        </div>
        <div className="rugby-card">
          <p className="text-gray-400 text-sm mb-1 uppercase tracking-widest">Disponibles</p>
          <h2 className="text-4xl font-bold text-club-accent">{disponibles}</h2>
        </div>
        <div className="rugby-card border-l-4 border-l-club-accent">
          <p className="text-gray-400 text-sm mb-1 uppercase tracking-widest">Vendidos</p>
          <h2 className="text-4xl font-bold">{vendidos}</h2>
        </div>
      </div>

      {/* Panel de Números Dinámico */}
      <div className="rugby-card">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <div className="w-2 h-2 bg-club-accent rounded-full animate-pulse"></div>
          Panel de Control Real
        </h3>

        <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-20 gap-2">
          {tickets.map((ticket: Ticket) => (
            <div
              key={ticket.id}
              className={`aspect-square flex items-center justify-center text-[10px] border rounded transition-all cursor-pointer
                ${ticket.status === 'SOLD'
                  ? 'bg-club-accent text-club-primary border-club-accent font-bold'
                  : 'bg-club-primary/50 border-white/5 text-gray-400 hover:border-club-accent hover:text-club-accent'
                }`}
              title={`Número ${ticket.number} - ${ticket.status}`}
            >
              {ticket.number}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
