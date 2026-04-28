import { useState } from "react";
import EndlessMode from "./components/EndlessMode";
import PuzzleMode from "./components/PuzzleMode";
import EnglishPuzzleMode from "./components/EnglishPuzzleMode";

type GameMode = "menu" | "endless" | "puzzle-select" | "puzzle";
type PuzzleLanguage = "japanese" | "english";

function App() {
	const [mode, setMode] = useState<GameMode>("menu");
	const [puzzleWordCount, setPuzzleWordCount] = useState<3 | 5>(3);
	const [puzzleLanguage, setPuzzleLanguage] =
		useState<PuzzleLanguage>("japanese");

	const startPuzzle = (count: 3 | 5) => {
		setPuzzleWordCount(count);
		setMode("puzzle");
	};

	const isJapanese = puzzleLanguage === "japanese";

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
						onClick={() => setMode("puzzle-select")}
						className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-lg transition-transform transform hover:scale-105"
					>
						Puzzle Mode
					</button>
				</div>
			)}

			{mode === "puzzle-select" && (
				<div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6 text-center">
					<button
						onClick={() => setMode("menu")}
						className="self-start text-gray-600 hover:text-gray-900 font-semibold"
					>
						&larr; Back
					</button>

					<h2 className="text-2xl font-bold text-gray-800">Puzzle Mode</h2>

					{/* Language selector */}
					<div className="flex gap-3">
						<button
							onClick={() => setPuzzleLanguage("japanese")}
							className={`flex-1 py-3 px-4 rounded-xl font-bold border-2 transition-all ${
								isJapanese
									? "bg-indigo-600 text-white border-indigo-600 shadow-md"
									: "bg-white text-gray-500 border-gray-200 hover:border-indigo-300"
							}`}
						>
							🇯🇵 Japanese
						</button>
						<button
							onClick={() => setPuzzleLanguage("english")}
							className={`flex-1 py-3 px-4 rounded-xl font-bold border-2 transition-all ${
								!isJapanese
									? "bg-emerald-600 text-white border-emerald-600 shadow-md"
									: "bg-white text-gray-500 border-gray-200 hover:border-emerald-300"
							}`}
						>
							🇬🇧 English
						</button>
					</div>

					<p className="text-gray-400 text-sm -mt-2">
						{isJapanese
							? "Connect hiragana syllable nodes with Japanese words."
							: "Connect letter nodes with English words."}
					</p>

					<p className="text-gray-500 font-medium">How many words?</p>

					<div className="flex gap-4 justify-center">
						{([3, 5] as const).map((count) => (
							<button
								key={count}
								onClick={() => startPuzzle(count)}
								className={`flex-1 flex flex-col items-center gap-2 border-2 font-bold py-6 px-4 rounded-xl transition-all ${
									isJapanese
										? "bg-indigo-50 hover:bg-indigo-100 border-indigo-200 hover:border-indigo-500 text-indigo-800"
										: "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 hover:border-emerald-500 text-emerald-800"
								}`}
							>
								<span
									className={`text-4xl font-extrabold ${isJapanese ? "text-indigo-600" : "text-emerald-600"}`}
								>
									{count}
								</span>
								<span className="text-sm font-semibold">
									{count === 3 ? "Quick" : "Challenge"}
								</span>
								<span className="text-xs text-gray-400 font-normal">
									{count + 1} nodes
								</span>
							</button>
						))}
					</div>
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
						onClick={() => setMode("puzzle-select")}
						className="mb-4 text-gray-600 hover:text-gray-900 font-semibold"
					>
						&larr; Back
					</button>
					{isJapanese ? (
						<PuzzleMode wordCount={puzzleWordCount} />
					) : (
						<EnglishPuzzleMode wordCount={puzzleWordCount} />
					)}
				</div>
			)}
		</div>
	);
}

export default App;
