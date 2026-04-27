import { useState } from "react";
import EndlessMode from "./components/EndlessMode";
import PuzzleMode from "./components/PuzzleMode";

type GameMode = "menu" | "endless" | "puzzle";

function App() {
	const [mode, setMode] = useState<GameMode>("menu");

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4">
			{mode === "menu" && (
				<div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6 text-center">
					<h1 className="text-4xl font-extrabold text-gray-900 mb-8">
						Shiritori
						<br />
						<span className="text-blue-600">Quest</span>
					</h1>

					<button
						onClick={() => setMode("endless")}
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-transform transform hover:scale-105"
					>
						Endless Mode
					</button>

					<button
						onClick={() => setMode("puzzle")}
						className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-lg transition-transform transform hover:scale-105"
					>
						Puzzle Mode
					</button>
				</div>
			)}

			{mode === "endless" && (
				<div className="w-full">
					<button
						onClick={() => setMode("menu")}
						className="mb-4 text-gray-600 hover:text-gray-900 font-semibold"
					>
						&larr; Back to Menu
					</button>
					<EndlessMode />
				</div>
			)}

			{mode === "puzzle" && (
				<div className="w-full">
					<button
						onClick={() => setMode("menu")}
						className="mb-4 text-gray-600 hover:text-gray-900 font-semibold"
					>
						&larr; Back to Menu
					</button>
					<PuzzleMode />
				</div>
			)}
		</div>
	);
}

export default App;
