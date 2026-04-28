import { useState, useRef } from "react";
import { isValidEnglishWord, englishWordsByBridge } from "./englishDictionary";
import { generateEnglishPuzzleNodes } from "./generateEnglishPuzzle";

export type EnglishNodeStatus =
	| "idle"
	| "valid"
	| "invalid_letter"
	| "invalid_word";

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const emptyArr = (n: number): undefined[] => Array(n).fill(undefined);

export function useEnglishPuzzleMode(nodeCount: number) {
	const [nodes, setNodes] = useState<string[]>(() =>
		generateEnglishPuzzleNodes(nodeCount),
	);
	const [words, setWords] = useState<string[]>(() =>
		Array(nodeCount - 1).fill(""),
	);
	const [status, setStatus] = useState<EnglishNodeStatus[]>(() =>
		Array(nodeCount - 1).fill("idle"),
	);
	const [hints, setHints] = useState<(string | undefined)[]>(() =>
		emptyArr(nodeCount - 1),
	);

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
	};

	// ── Validation ─────────────────────────────────────────────────────────────
	const checkSolution = () => {
		const newStatus: EnglishNodeStatus[] = [];

		for (let i = 0; i < words.length; i++) {
			const word = words[i].trim().toLowerCase();
			const start = nodes[i];
			const end = nodes[i + 1];

			if (!word || word[0] !== start || word[word.length - 1] !== end) {
				newStatus.push("invalid_letter");
				continue;
			}

			newStatus.push(isValidEnglishWord(word) ? "valid" : "invalid_word");
		}

		setStatus(newStatus);
		if (newStatus.every((s) => s === "valid")) stopTimer();
	};

	// ── Hints ──────────────────────────────────────────────────────────────────
	const showHint = (index: number) => {
		const candidates =
			englishWordsByBridge.get(`${nodes[index]}:${nodes[index + 1]}`) ?? [];
		if (!candidates.length) return;
		const sorted = [...candidates].sort((a, b) => a.length - b.length);
		const pool = sorted.slice(0, Math.max(5, Math.ceil(sorted.length * 0.33)));
		setHints((prev) => {
			const n = [...prev];
			n[index] = pick(pool);
			return n;
		});
	};

	// ── New puzzle ─────────────────────────────────────────────────────────────
	const newPuzzle = () => {
		resetTimer();
		setNodes(generateEnglishPuzzleNodes(nodeCount));
		setWords(Array(nodeCount - 1).fill(""));
		setStatus(Array(nodeCount - 1).fill("idle"));
		setHints(emptyArr(nodeCount - 1));
	};

	const allSolved = status.length > 0 && status.every((s) => s === "valid");

	return {
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
	};
}
