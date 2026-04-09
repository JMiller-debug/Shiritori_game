import React from "react";
import { usePuzzleMode } from "../game-logic/usePuzzleMode";
import { toHiraganaNode } from "../game-logic/syllableMap";
import { getHiragana } from "../game-logic/dictionary";

const formatTime = (s: number) =>
	`${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

function SyllableNode({ romaji }: { romaji: string }) {
	return (
		<div className="relative group flex-shrink-0">
			<div className="w-16 h-16 flex items-center justify-center bg-indigo-100 text-indigo-800 text-xl font-bold rounded-full border-2 border-indigo-300 shadow-sm cursor-default select-none">
				{toHiraganaNode(romaji)}
			</div>
			<div className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
				{romaji}
				<span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
			</div>
		</div>
	);
}

export default function PuzzleMode() {
	const {
		nodes,
		words,
		updateWord,
		checkSolution,
		status,
		readings,
		hints,
		showHint,
		inputMode,
		toggleInputMode,
		newPuzzle,
		allSolved,
		timeElapsed,
	} = usePuzzleMode(6);

	return (
		<div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-8">
			{/* Header */}
			<div className="text-center space-y-3">
				<h2 className="text-2xl font-bold text-gray-800">Puzzle Mode</h2>
				<p className="text-gray-500">
					Connect the nodes. Each word must start and end with the shown
					syllables.
				</p>

				{/* Input mode toggle */}
				<div className="inline-flex items-center gap-3 select-none">
					<span
						className={`text-sm font-medium ${inputMode === "romaji" ? "text-indigo-700" : "text-gray-400"}`}
					>
						Romaji
					</span>
					<button
						onClick={toggleInputMode}
						className={`relative w-12 h-6 rounded-full transition-colors ${
							inputMode === "hiragana" ? "bg-indigo-600" : "bg-gray-300"
						}`}
						aria-label="Toggle input mode"
					>
						<span
							className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
								inputMode === "hiragana" ? "translate-x-7" : "translate-x-1"
							}`}
						/>
					</button>
					<span
						className={`text-sm font-medium ${inputMode === "hiragana" ? "text-indigo-700" : "text-gray-400"}`}
					>
						ひらがな
					</span>
				</div>

				{/* Timer */}
				<div
					className={`text-3xl font-mono font-bold tracking-widest ${allSolved ? "text-green-600" : "text-indigo-600"}`}
				>
					{formatTime(timeElapsed)}
				</div>
			</div>

			{/* Slots */}
			<div className="flex flex-col gap-6">
				{words.map((word, i) => {
					const hintRomaji = hints[i];
					// Display hint in the active input mode
					const hintDisplay = hintRomaji
						? inputMode === "hiragana"
							? (getHiragana(hintRomaji) ?? hintRomaji)
							: hintRomaji
						: undefined;

					// Placeholder in the active input mode
					const placeholder =
						inputMode === "hiragana"
							? `${toHiraganaNode(nodes[i])}…${toHiraganaNode(nodes[i + 1])}`
							: `${nodes[i]}…${nodes[i + 1]}`;

					return (
						<div key={i} className="flex items-start gap-4">
							<SyllableNode romaji={nodes[i]} />

							<div className="flex-1 flex flex-col gap-1">
								<input
									type="text"
									value={word}
									onChange={(e) => updateWord(i, e.target.value)}
									placeholder={placeholder}
									className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
										status[i] === "valid"
											? "border-green-500 bg-green-50"
											: status[i] === "invalid_syllable" ||
												  status[i] === "invalid_word"
												? "border-red-500 bg-red-50"
												: "border-gray-200 focus:border-indigo-500"
									}`}
								/>

								{/* Hint */}
								{hintDisplay ? (
									<p className="text-sm text-amber-600 font-medium pl-1">
										💡 {hintDisplay}
									</p>
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

								{/* Reading — shown when valid; flips based on mode */}
								{status[i] === "valid" && readings[i] && (
									<p className="text-sm text-green-700 font-medium pl-1">
										{readings[i]} ✓
									</p>
								)}

								{status[i] === "invalid_syllable" && (
									<p className="text-sm text-red-500 pl-1">
										Must start with &ldquo;
										{inputMode === "hiragana"
											? toHiraganaNode(nodes[i])
											: nodes[i]}
										&rdquo; and end with &ldquo;
										{inputMode === "hiragana"
											? toHiraganaNode(nodes[i + 1])
											: nodes[i + 1]}
										&rdquo;
									</p>
								)}
								{status[i] === "invalid_word" && (
									<p className="text-sm text-red-500 pl-1">
										Word not found in dictionary
									</p>
								)}
							</div>

							{i === words.length - 1 && <SyllableNode romaji={nodes[i + 1]} />}
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
					className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
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
