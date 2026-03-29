export default function Loading() {
    return (
        <div className="min-h-screen bg-club-primary flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-club-accent border-t-transparent rounded-full animate-spin"></div>
                <p className="text-club-accent font-mono tracking-widest animate-pulse">CARGANDO SISTEMA...</p>
            </div>
        </div>
    );
}
