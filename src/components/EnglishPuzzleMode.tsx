import { useEnglishPuzzleMode } from "../game-logic/useEnglishPuzzleMode";

const formatTime = (s: number) =>
	`${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

function LetterNode({ letter }: { letter: string }) {
	return (
		<div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-emerald-100 text-emerald-800 text-2xl font-bold rounded-full border-2 border-emerald-300 shadow-sm select-none uppercase">
			{letter}
		</div>
	);
}

interface EnglishPuzzleModeProps {
	wordCount: 3 | 5;
}

export default function EnglishPuzzleMode({
	wordCount,
}: EnglishPuzzleModeProps) {
	const {
		nodes,
		words,
		updateWord,
		checkSolution,
		status,
		hints,
		showHint,
		newPuzzle,
		allSolved,
		timeElapsed,
	} = useEnglishPuzzleMode(wordCount + 1);

	return (
		<div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-8">
			{/* Header */}
			<div className="text-center space-y-2">
				<div className="flex items-center justify-center gap-3">
					<h2 className="text-2xl font-bold text-gray-800">English Puzzle</h2>
					<span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
						{wordCount} words
					</span>
				</div>
				<p className="text-gray-500 text-sm">
					Each word must start and end with the shown letters.
				</p>
				<div
					className={`text-3xl font-mono font-bold tracking-widest ${allSolved ? "text-green-600" : "text-emerald-600"}`}
				>
					{formatTime(timeElapsed)}
				</div>
			</div>

			{/* Slots */}
			<div className="flex flex-col gap-6">
				{words.map((word, i) => {
					const hint = hints[i];
					return (
						<div key={i} className="flex items-start gap-4">
							<LetterNode letter={nodes[i]} />

							<div className="flex-1 flex flex-col gap-1">
								<input
									type="text"
									value={word}
									onChange={(e) => updateWord(i, e.target.value)}
									placeholder={`${nodes[i]}…${nodes[i + 1]}`}
									className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
										status[i] === "valid"
											? "border-green-500 bg-green-50"
											: status[i] === "invalid_letter" ||
												  status[i] === "invalid_word"
												? "border-red-500 bg-red-50"
												: "border-gray-200 focus:border-emerald-500"
									}`}
								/>

								{hint ? (
									<div className="flex items-center gap-2 pl-1">
										<p className="text-sm text-amber-600 font-medium">
											💡 {hint}
										</p>
										<button
											onClick={() => updateWord(i, hint)}
											className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-700 font-semibold px-2 py-0.5 rounded transition-colors"
										>
											Use
										</button>
									</div>
								) : (
									status[i] !== "valid" && (
										<button
											onClick={() => showHint(i)}
											className="self-start text-xs text-gray-400 hover:text-amber-500 pl-1 transition-colors"
										>
											Show hint
										</button>
									)
								)}

								{status[i] === "valid" && (
									<p className="text-sm text-green-700 font-medium pl-1">
										✓ {word.trim().toLowerCase()}
									</p>
								)}
								{status[i] === "invalid_letter" && (
									<p className="text-sm text-red-500 pl-1">
										Must start with &ldquo;{nodes[i]}&rdquo; and end with
										&ldquo;{nodes[i + 1]}&rdquo;
									</p>
								)}
								{status[i] === "invalid_word" && (
									<p className="text-sm text-red-500 pl-1">
										Not a valid English word
									</p>
								)}
							</div>

							{i === words.length - 1 && <LetterNode letter={nodes[i + 1]} />}
						</div>
					);
				})}
			</div>

			{allSolved && (
				<div className="text-center text-green-700 font-bold text-lg animate-bounce">
					🎉 Puzzle solved!
				</div>
			)}

			<div className="flex gap-3">
				<button
					onClick={checkSolution}
					disabled={allSolved}
					className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
				>
					Verify Solution
				</button>
				<button
					onClick={newPuzzle}
					className="bg-gray-200 text-gray-800 font-semibold px-5 py-3 rounded-lg hover:bg-gray-300 transition-colors"
				>
					New Puzzle
				</button>
			</div>
		</div>
	);
}
