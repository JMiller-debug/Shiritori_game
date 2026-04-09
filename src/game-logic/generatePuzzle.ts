import { wordsByBridge } from "./dictionary";

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/**
 * Builds a valid sequence of `nodeCount` syllable-nodes where every adjacent
 * pair is guaranteed to have at least one dictionary word bridging them.
 *
 * Uses the wordsByBridge map so each step is an O(1) lookup — no post-hoc
 * filtering or retry loops needed per step.
 */
export function generatePuzzleNodes(nodeCount = 6): string[] {
	// Pre-group bridge keys by their starting syllable for fast traversal
	const byStart = new Map<string, string[]>(); // start -> ["start:end", ...]
	for (const key of wordsByBridge.keys()) {
		const start = key.split(":")[0];
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
			// Avoid back-to-back identical nodes (makes a slot trivially easy)
			if (next === current) {
				failed = true;
				break;
			}
			nodes.push(next);
		}

		if (!failed && nodes.length === nodeCount) return nodes;
	}

	// Deterministic fallback
	return ["sa", "ku", "ra", "go", "ri", "ra"];
}
