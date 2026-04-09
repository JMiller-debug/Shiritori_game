import { useState, useRef } from "react";
import {
	isValidJapaneseWord,
	isValidHiraganaWord,
	getHiragana,
	hiraganaDict,
	wordsByBridge,
} from "./dictionary";
import {
	getFirstSyllable,
	getLastSyllable,
	getFirstMora,
	getLastMora,
} from "./japaneseUtils";
import { generatePuzzleNodes } from "./generatePuzzle";
import { toHiraganaNode } from "./syllableMap";

export type NodeStatus = "idle" | "valid" | "invalid_syllable" | "invalid_word";
export type InputMode = "romaji" | "hiragana";

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const emptyArr = (n: number) => Array(n).fill(undefined);

export function usePuzzleMode(nodeCount = 6) {
	const [nodes, setNodes] = useState<string[]>(() =>
		generatePuzzleNodes(nodeCount),
	);
	const [words, setWords] = useState<string[]>(() =>
		Array(nodeCount - 1).fill(""),
	);
	const [status, setStatus] = useState<NodeStatus[]>(() =>
		Array(nodeCount - 1).fill("idle"),
	);
	const [readings, setReadings] = useState<(string | undefined)[]>(() =>
		emptyArr(nodeCount - 1),
	);
	const [hints, setHints] = useState<(string | undefined)[]>(() =>
		emptyArr(nodeCount - 1),
	);
	const [inputMode, setInputMode] = useState<InputMode>("romaji");

	// ── Timer ──────────────────────────────────────────────────────────────────
	const [timeElapsed, setTimeElapsed] = useState(0);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const startTimer = () => {
		if (intervalRef.current) return;
		intervalRef.current = setInterval(() => setTimeElapsed((t) => t + 1), 1000);
	};
	const stopTimer = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	};
	const resetTimer = () => {
		stopTimer();
		setTimeElapsed(0);
	};

	// ── Input mode toggle ──────────────────────────────────────────────────────
	const toggleInputMode = () =>
		setInputMode((m) => (m === "romaji" ? "hiragana" : "romaji"));

	// ── Word input ─────────────────────────────────────────────────────────────
	const updateWord = (index: number, value: string) => {
		startTimer();
		setWords((prev) => {
			const n = [...prev];
			n[index] = value;
			return n;
		});
		setStatus((prev) => {
			const n = [...prev];
			n[index] = "idle";
			return n;
		});
		setReadings((prev) => {
			const n = [...prev];
			n[index] = undefined;
			return n;
		});
	};

	// ── Validation ─────────────────────────────────────────────────────────────
	const checkSolution = () => {
		const newStatus: NodeStatus[] = [];
		const newReadings: (string | undefined)[] = [];

		for (let i = 0; i < words.length; i++) {
			const word = words[i].trim();
			const start = nodes[i];
			const end = nodes[i + 1];

			// Try romaji match
			const romajiSyllablesOk =
				!!word &&
				getFirstSyllable(word) === start &&
				getLastSyllable(word) === end;

			const hiraganaValid =
				!!word &&
				getFirstMora(word) === toHiraganaNode(start) &&
				getLastMora(word) === toHiraganaNode(end);

			const syllablesOk = romajiSyllablesOk || hiraganaValid;

			if (!syllablesOk) {
				newStatus.push("invalid_syllable");
				newReadings.push(undefined);
				continue;
			}

			// Syllables match — now check the dictionary
			const romajiInDict = romajiSyllablesOk && isValidJapaneseWord(word);
			const hiraganaInDict = hiraganaValid && isValidHiraganaWord(word);

			if (romajiInDict || hiraganaInDict) {
				newStatus.push("valid");
				newReadings.push(
					romajiInDict ? getHiragana(word) : hiraganaDict.get(word),
				);
			} else {
				newStatus.push("invalid_word");
				newReadings.push(undefined);
			}
		}

		setStatus(newStatus);
		setReadings(newReadings);
		if (newStatus.every((s) => s === "valid")) stopTimer();
	};

	// ── Hints ──────────────────────────────────────────────────────────────────
	/** Reveals one valid answer for slot `index` (always stored as romaji). */
	const showHint = (index: number) => {
		const candidates =
			wordsByBridge.get(`${nodes[index]}:${nodes[index + 1]}`) ?? [];
		if (!candidates.length) return;
		setHints((prev) => {
			const n = [...prev];
			n[index] = pick(candidates);
			return n;
		});
	};

	// ── New puzzle ─────────────────────────────────────────────────────────────
	const newPuzzle = () => {
		resetTimer();
		const next = generatePuzzleNodes(nodeCount);
		setNodes(next);
		setWords(Array(nodeCount - 1).fill(""));
		setStatus(Array(nodeCount - 1).fill("idle"));
		setReadings(emptyArr(nodeCount - 1));
		setHints(emptyArr(nodeCount - 1));
	};

	const allSolved = status.length > 0 && status.every((s) => s === "valid");

	return {
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
	};
}
