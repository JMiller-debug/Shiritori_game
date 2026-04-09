import React, { useState, useRef, useEffect } from "react";
import { useEndlessMode } from "../game-logic/useEndlessMode";
import { getLastSyllable } from "../game-logic/japaneseUtils";

export default function EndlessMode() {
	const { chain, submitWord, error, isLoading, isGameOver, resetGame } =
		useEndlessMode();
	const [inputValue, setInputValue] = useState<string>("");
	const endOfListRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		endOfListRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [chain]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await submitWord(inputValue);
		if (!error && !isGameOver) setInputValue("");
	};

	const getPlaceholderText = () => {
		if (isGameOver) return "Game Over!";
		if (chain.length > 0) {
			const lastSyllable = getLastSyllable(chain[chain.length - 1]);
			return `Starts with "${lastSyllable}"...`;
		}
		return "Enter a romaji word (e.g. sakura)...";
	};

	return (
		<div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold text-gray-800">Endless Shiritori</h2>
				<span
					className={`text-sm font-semibold px-3 py-1 rounded-full ${isGameOver ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}
				>
					Score: {chain.length}
				</span>
			</div>

			<div className="h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col gap-2">
				{chain.length === 0 ? (
					<p className="text-gray-400 italic text-center mt-auto mb-auto">
						Type a romaji word to start!
					</p>
				) : (
					chain.map((word, idx) => (
						<div
							key={idx}
							className={`${idx === chain.length - 1 && isGameOver ? "bg-red-500" : "bg-blue-500"} text-white px-4 py-2 rounded-lg self-start`}
						>
							{word}
						</div>
					))
				)}
				<div ref={endOfListRef} />
			</div>

			<form onSubmit={handleSubmit} className="space-y-3">
				<input
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder={getPlaceholderText()}
					className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					disabled={isLoading || isGameOver}
				/>
				{error && <p className="text-red-500 text-sm font-medium">{error}</p>}
				<div className="flex gap-2">
					<button
						type="submit"
						disabled={isLoading || !inputValue || isGameOver}
						className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
					>
						{isLoading ? "Checking..." : "Play Word"}
					</button>
					<button
						type="button"
						onClick={resetGame}
						className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
					>
						Reset
					</button>
				</div>
			</form>
		</div>
	);
}
