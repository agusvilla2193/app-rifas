import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import { auth } from "@/app/lib/auth.config";
import PublicTicketGrid from "@/components/PublicTicketGrid";

const prisma = new PrismaClient();

export const revalidate = 60;
export default async function Home() {
  const session = await auth();

  const tickets = await prisma.ticket.findMany({
    orderBy: { number: 'asc' },
  });

  const total = tickets.length;
  const vendidos = tickets.filter((t) => t.status === 'SOLD').length;
  const progreso = Math.round((vendidos / total) * 100);

  return (
    <main className="min-h-screen bg-club-primary text-white overflow-x-hidden">

      {/* SECCIÓN 1: HERO / SORTEO */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-6 border-b border-white/5">
        {/* Acceso rápido a vendedores */}
        <div className="absolute top-8 right-8">
          <Link href={session ? "/dashboard" : "/auth"} className="text-[10px] tracking-[0.2em] text-gray-500 hover:text-club-accent transition-all border border-white/10 px-3 py-1 rounded-full uppercase">
            {session ? "Dashboard" : "Vendedores"}
          </Link>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-block px-3 py-1 rounded-full border border-club-accent/30 bg-club-accent/5 text-club-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-6">
            Rifa Oficial 2026
          </div>

          <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-8">
            Club San <span className="text-club-accent">Fernando</span>
          </h1>

          <div className="max-w-xl mx-auto rugby-card border-white/10 backdrop-blur-xl p-8 mb-10 shadow-2xl">
            <p className="text-gray-400 uppercase tracking-widest text-xs mb-4">Gran Premio</p>
            <h2 className="text-2xl md:text-4xl font-bold mb-6">UN VIAJE PARA 2 PERSONAS A MAR DEL PLATA 🏖️</h2>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Sorteo</p>
                <p className="font-bold text-xl">25 DE MAYO</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Valor Rifa</p>
                <p className="font-bold text-xl text-club-accent">$5.000</p>
              </div>
            </div>
          </div>

          <a href="#comprar" className="inline-block bg-white text-club-primary font-black px-12 py-5 rounded-full hover:bg-club-accent hover:scale-105 transition-all shadow-xl shadow-white/5">
            VER NÚMEROS DISPONIBLES
          </a>
        </div>
      </section>

      {/* SECCIÓN 2: GRILLA PÚBLICA */}
      <section id="comprar" className="max-w-7xl mx-auto py-24 px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div className="max-w-md">
            <h2 className="text-4xl font-black italic uppercase mb-2">Elegí tu número</h2>
            <p className="text-gray-400">Seleccioná el número que más te guste y reservalo al instante por WhatsApp.</p>
          </div>

          <div className="w-full md:w-64">
            <div className="flex justify-between text-xs mb-2 uppercase tracking-widest">
              <span className="text-gray-500">Recaudación</span>
              <span className="text-club-accent font-bold">{progreso}% completado</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-club-accent transition-all duration-1000"
                style={{ width: `${progreso}%` }}
              />
            </div>
          </div>
        </div>

        <PublicTicketGrid initialTickets={tickets} />
      </section>

      <footer className="py-20 text-center border-t border-white/5">
        <p className="text-gray-600 text-[10px] tracking-[0.2em] uppercase">
          Desarrollado para la sección Rugby del Club San Fernando
        </p>
      </footer>
    </main>
  );
}
