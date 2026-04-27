import { wordsByBridge } from "./dictionary";
import { syllableToHiragana } from "./syllableMap";

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/** Returns true if the romaji syllable maps to a single basic hiragana character. */
const isBasicSyllable = (s: string): boolean => {
	const h = syllableToHiragana[s.toLowerCase()];
	return h !== undefined && h.length === 1;
};

/**
 * Builds a valid sequence of `nodeCount` syllable-nodes where every adjacent
 * pair is guaranteed to have at least one dictionary word bridging them.
 * Nodes are restricted to basic hiragana (no digraphs like きゅ, しゃ, etc.).
 */
export function generatePuzzleNodes(nodeCount = 6): string[] {
	const byStart = new Map<string, string[]>();

	for (const key of wordsByBridge.keys()) {
		const [start, end] = key.split(":");
		// Both endpoints must be basic single-character hiragana
		if (!isBasicSyllable(start) || !isBasicSyllable(end)) continue;
		const arr = byStart.get(start) ?? [];
		arr.push(key);
		byStart.set(start, arr);
	}

	const allStarts = Array.from(byStart.keys());

	for (let attempt = 0; attempt < 200; attempt++) {
		const nodes: string[] = [pick(allStarts)];
		let failed = false;

		for (let step = 0; step < nodeCount - 1; step++) {
			const current = nodes[nodes.length - 1];
			const bridges = byStart.get(current);
			if (!bridges?.length) {
				failed = true;
				break;
			}

			const next = pick(bridges).split(":")[1];
			if (next === current) {
				failed = true;
				break;
			}
			nodes.push(next);
		}

		if (!failed && nodes.length === nodeCount) return nodes;
	}

	// Deterministic fallback (all basic hiragana)
	return ["sa", "ku", "ra", "go", "ri", "ra"];
}
