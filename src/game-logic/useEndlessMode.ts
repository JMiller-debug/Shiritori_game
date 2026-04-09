import { useState } from "react";
import { isValidJapaneseWord } from "./dictionary";
import { getFirstSyllable, getLastSyllable, endsWithN } from "./japaneseUtils";

export function useEndlessMode() {
	const [chain, setChain] = useState<string[]>([]);
	const [error, setError] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isGameOver, setIsGameOver] = useState<boolean>(false);

	const submitWord = async (word: string) => {
		if (isGameOver) return;

		const cleanWord = word.trim().toLowerCase();
		setError("");

		if (!cleanWord) return;

		if (chain.includes(cleanWord)) {
			setError("Word already used!");
			return;
		}

		// Japanese Shiritori logic
		if (chain.length > 0) {
			const lastWord = chain[chain.length - 1];
			const requiredSyllable = getLastSyllable(lastWord);
			const startingSyllable = getFirstSyllable(cleanWord);

			if (requiredSyllable !== startingSyllable) {
				setError(`Word must start with the syllable "${requiredSyllable}"`);
				return;
			}
		}

		const valid = isValidJapaneseWord(cleanWord);

		if (!valid) {
			setError("Not a valid word in the dictionary.");
			return;
		}

		// Check the 'N' (ん) rule
		if (endsWithN(cleanWord)) {
			setChain((prev) => [...prev, cleanWord]);
			setError('Word ends with "n" (ん). Game Over!');
			setIsGameOver(true);
			return;
		}

		setChain((prev) => [...prev, cleanWord]);
	};

	const resetGame = () => {
		setChain([]);
		setError("");
		setIsGameOver(false);
	};

	return { chain, submitWord, error, isLoading, isGameOver, resetGame };
}
