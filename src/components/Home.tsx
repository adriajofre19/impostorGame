import React, { useState } from 'react';
import { words } from '../data/words';

export default function Home() {
	const [players, setPlayers] = useState<string[]>([]);
	const [newPlayer, setNewPlayer] = useState<string>("");
	const [assignments, setAssignments] = useState<string[] | null>(null);
	const [gameStarted, setGameStarted] = useState(false);
	const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
	const [revealed, setRevealed] = useState(false);

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const trimmed = newPlayer.trim();
		if (!trimmed) return;
		setPlayers(prev => [...prev, trimmed]);
		setNewPlayer("");
	}

	function removePlayer(index: number) {
		if (gameStarted) return;
		setPlayers(prev => prev.filter((_, i) => i !== index));
	}

	function startGame() {
		if (players.length === 0) return;
		const impostorIndex = Math.floor(Math.random() * players.length);
		const commonWord = words[Math.floor(Math.random() * words.length)];
		const assigned = players.map((_, i) => (i === impostorIndex ? 'IMPOSTOR' : commonWord));
		setAssignments(assigned);
		setGameStarted(true);
		setCurrentPlayerIndex(0);
		setRevealed(false);
	}

	function resetGame() {
		setAssignments(null);
		setGameStarted(false);
		setCurrentPlayerIndex(0);
		setRevealed(false);
	}

	function nextPlayer() {
		if (currentPlayerIndex < players.length - 1) {
			setCurrentPlayerIndex(currentPlayerIndex + 1);
			setRevealed(false);
		}
	}

	return (
		<div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center px-4 py-10">
			<div className="w-full max-w-2xl">
				<div className="mb-8 text-center">
					<h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-50 drop-shadow-md">
						Impostor Game
					</h1>
					<p className="mt-2 text-sm sm:text-base text-slate-400">
						Crea la sala, reparte los roles en secreto y descubre quién es el impostor.
					</p>
				</div>

				<div className="rounded-2xl bg-slate-900/80 border border-slate-700/80 shadow-2xl backdrop-blur-md px-4 sm:px-6 py-6 sm:py-8">
					<h2 className="text-xl sm:text-2xl font-semibold mb-6 flex items-center gap-3">
						<span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-sm">
							{players.length || 0}
						</span>
						<span>Jugadores</span>
					</h2>

					{!gameStarted ? (
						<div className="space-y-6">
							<ul className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
								{players.map((p, i) => (
									<li
										key={i}
										className="flex items-center justify-between gap-3 rounded-xl bg-slate-800/80 border border-slate-700 px-3 sm:px-4 py-3 transition hover:border-emerald-500/60 hover:bg-slate-800"
									>
										<div className="flex items-center gap-3 min-w-0">
											<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 text-slate-900 font-semibold text-sm shadow-md">
												{p.charAt(0).toUpperCase()}
											</div>
											<div className="flex flex-col min-w-0">
												<span className="font-medium truncate">{p}</span>
												<span className="text-xs text-slate-400">Jugador #{i + 1}</span>
											</div>
										</div>
										<button
											type="button"
											className="text-xs sm:text-sm text-red-200 bg-red-600/80 hover:bg-red-500 px-3 py-1.5 rounded-full border border-red-400/60 shadow-sm transition"
											onClick={() => removePlayer(i)}
										>
											Eliminar
										</button>
									</li>
								))}

								{players.length === 0 && (
									<li className="rounded-xl border border-dashed border-slate-700/80 bg-slate-900/40 px-4 py-5 text-center text-sm text-slate-400">
										Añade al menos un jugador para comenzar la partida.
									</li>
								)}
							</ul>

							<form
								onSubmit={handleSubmit}
								className="flex flex-col sm:flex-row gap-3"
							>
								<input
									className="flex-1 px-3 py-2.5 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500/60 transition"
									type="text"
									placeholder="Nombre del jugador (Ej: Ana, Marcos...)"
									value={newPlayer}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPlayer(e.target.value)}
								/>
								<button
									className="px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm sm:text-base shadow-lg shadow-emerald-500/30 transition disabled:opacity-60 disabled:cursor-not-allowed"
									type="submit"
								>
									Añadir jugador
								</button>
							</form>

							<div className="space-y-2">
								<button
									className="w-full px-4 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-semibold text-base sm:text-lg shadow-lg shadow-indigo-500/30 transition disabled:opacity-60 disabled:cursor-not-allowed"
									onClick={startGame}
									disabled={players.length === 0}
								>
									Comenzar juego
								</button>
								<p className="text-xs text-slate-400 text-center">
									Las palabras se repartirán automáticamente y solo cada jugador verá su rol.
								</p>
							</div>
						</div>
					) : (
						<div className="flex flex-col gap-6">
							<div className="flex flex-col gap-4 sm:gap-5 sm:flex-row sm:items-stretch">
								<div className="flex-1 rounded-2xl bg-slate-950/60 border border-slate-700/80 px-5 py-5 sm:px-6 sm:py-6 text-center shadow-inner">
									<p className="text-xs sm:text-sm text-slate-400 mb-2 uppercase tracking-[0.2em]">
										Turno de
									</p>
									<h3 className="text-2xl sm:text-3xl font-bold text-slate-50 truncate mb-1">
										{players[currentPlayerIndex]}
									</h3>
									<p className="text-xs text-slate-500">
										Jugador {currentPlayerIndex + 1} de {players.length}
									</p>
								</div>

								<div className="sm:w-[45%] flex flex-col gap-3 justify-between">
									<button
										className="w-full px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm sm:text-base shadow-lg shadow-emerald-500/40 transition"
										onClick={() => setRevealed(!revealed)}
									>
										{revealed ? 'Ocultar palabra' : 'Revelar palabra'}
									</button>
									<button
										className="w-full px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed transition"
										onClick={nextPlayer}
										disabled={currentPlayerIndex >= players.length - 1}
									>
										Siguiente jugador
									</button>
								</div>
							</div>

							{revealed && (
								<div
									className={`w-full px-6 py-6 sm:px-8 sm:py-7 rounded-2xl text-center text-2xl sm:text-3xl font-extrabold tracking-wide shadow-2xl border ${assignments![currentPlayerIndex] === 'IMPOSTOR'
										? 'bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 border-red-400/80 text-slate-50'
										: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 border-emerald-300/80 text-slate-950'
										}`}
								>
									{assignments![currentPlayerIndex]}
								</div>
							)}

							<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2">
								<button
									className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm sm:text-base font-medium transition"
									onClick={() => {
										setRevealed(false);
										setCurrentPlayerIndex(0);
									}}
								>
									Volver al primer jugador
								</button>
								<button
									className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-slate-50 text-sm sm:text-base font-semibold shadow-md shadow-red-600/40 transition"
									onClick={resetGame}
								>
									Terminar juego
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div >
	);
}