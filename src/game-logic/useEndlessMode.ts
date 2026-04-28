import { useState } from "react";
import { isValidJapaneseWord, isValidHiraganaWord } from "./dictionary";
import {
	getFirstSyllable,
	getLastSyllable,
	getFirstMora,
	getLastMora,
	endsWithN,
} from "./japaneseUtils";
import { syllableToHiragana } from "./syllableMap";

const isHiraganaStr = (s: string) => /[\u3040-\u309F]/.test(s);

/** Last mora of any word normalised to hiragana. */
const getLastMoraOf = (word: string): string => {
	if (isHiraganaStr(word)) return getLastMora(word);
	const syl = getLastSyllable(word);
	return syllableToHiragana[syl] ?? syl;
};

/** First mora of any word normalised to hiragana. */
const getFirstMoraOf = (word: string): string => {
	if (isHiraganaStr(word)) return getFirstMora(word);
	const syl = getFirstSyllable(word);
	return syllableToHiragana[syl] ?? syl;
};

export function useEndlessMode() {
	const [chain, setChain] = useState<string[]>([]);
	const [error, setError] = useState<string>("");
	const [isLoading, _setIsLoading] = useState<boolean>(false);
	const [isGameOver, setIsGameOver] = useState<boolean>(false);

	const submitWord = async (word: string) => {
		if (isGameOver) return;

		// Preserve case for hiragana; normalise romaji to lowercase
		const cleanWord = isHiraganaStr(word.trim())
			? word.trim()
			: word.trim().toLowerCase();
		setError("");

		if (!cleanWord) return;

		if (chain.includes(cleanWord)) {
			setError("Word already used!");
			return;
		}

		// Shiritori link — compare in hiragana space so romaji/hiragana chains mix fine
		if (chain.length > 0) {
			const required = getLastMoraOf(chain[chain.length - 1]);
			const actual = getFirstMoraOf(cleanWord);
			if (required !== actual) {
				setError(`Word must start with "${required}"`);
				return;
			}
		}

		const valid = isHiraganaStr(cleanWord)
			? isValidHiraganaWord(cleanWord)
			: isValidJapaneseWord(cleanWord);

		if (!valid) {
			setError("Not a valid word in the dictionary.");
			return;
		}

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
