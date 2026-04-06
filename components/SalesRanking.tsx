// components/SalesRanking.tsx
interface SalesRankingProps {
    ranking: {
        name: string | null;
        _count: { tickets: number };
    }[];
}

export default function SalesRanking({ ranking }: SalesRankingProps) {
    return (
        <div className="rugby-card border-white/5 mb-12 bg-gradient-to-br from-club-primary to-[#0a121d]">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2 text-white italic uppercase tracking-tighter">
                <span className="text-club-accent text-2xl">🏆</span>
                Ranking de Vendedores
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {ranking.map((user, index) => {
                    // Estilos para el podio
                    const medals = ["🥇", "🥈", "🥉"];

                    return (
                        <div
                            key={user.name}
                            className={`relative p-4 rounded-xl border ${index === 0 ? "border-club-accent/40 bg-club-accent/5" : "border-white/5 bg-white/[0.02]"
                                } flex items-center justify-between transition-transform hover:scale-105`}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-2xl">
                                    {index < 3 ? medals[index] : index + 1}
                                </span>
                                <div>
                                    <p className="text-sm font-bold text-white uppercase tracking-tight">
                                        {user.name || "Sin nombre"}
                                    </p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                                        Ventas logradas
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`text-2xl font-black ${index === 0 ? "text-club-accent" : "text-white"}`}>
                                    {user._count.tickets}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {ranking.length === 0 && (
                <p className="text-center text-gray-500 py-4 italic">Todavía no hay ventas registradas.</p>
            )}
        </div>
    );
}
