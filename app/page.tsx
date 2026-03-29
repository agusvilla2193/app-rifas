import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-6 md:p-20">
      {/* Header Estilo Portfolio */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-2">
            CLUB <span className="text-club-accent">SAN FERNANDO</span>
          </h1>
          <p className="text-gray-400 text-lg uppercase tracking-widest">Sistema de Gestión de Rifas</p>
        </div>

        <Link href="/auth">
          <button className="px-8 py-3 bg-club-accent text-club-primary font-bold rounded-full hover:bg-white hover:scale-105 transition-all cursor-pointer">
            ACCESO VENDEDORES
          </button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <div className="rugby-card">
          <p className="text-gray-400 text-sm mb-1">TOTAL NÚMEROS</p>
          <h2 className="text-4xl font-bold">1000</h2>
        </div>
        <div className="rugby-card">
          <p className="text-gray-400 text-sm mb-1">DISPONIBLES</p>
          <h2 className="text-4xl font-bold text-club-accent">1000</h2>
        </div>
        <div className="rugby-card border-l-4 border-l-club-accent">
          <p className="text-gray-400 text-sm mb-1">RECAUDACIÓN</p>
          <h2 className="text-4xl font-bold">$0</h2>
        </div>
      </div>

      {/* Ticket Visualizer */}
      <div className="rugby-card overflow-hidden">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <div className="w-2 h-2 bg-club-accent rounded-full animate-pulse"></div>
          Panel de Control de Números
        </h3>

        <div className="ticket-grid">
          {Array.from({ length: 120 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square flex items-center justify-center text-[10px] border border-white/5 rounded bg-club-primary/50 hover:bg-club-accent hover:text-club-primary transition-colors cursor-pointer"
            >
              {i + 1}
            </div>
          ))}
          <div className="col-span-full text-center py-4 text-gray-500 text-sm italic">
            Mostrando primeros 120 de 1000 números...
          </div>
        </div>
      </div>
    </main>
  );
}
