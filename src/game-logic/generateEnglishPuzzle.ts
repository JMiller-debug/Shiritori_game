import { englishWordsByBridge } from "./englishDictionary";

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/**
 * Builds a valid chain of `nodeCount` letter-nodes where every adjacent pair
 * is guaranteed to have at least one dictionary word bridging them.
 * Repeated letters in the chain are avoided.
 */
export function generateEnglishPuzzleNodes(nodeCount: number): string[] {
	// letter → list of bridge keys that start with that letter (no self-loops)
	const byStart = new Map<string, string[]>();

	for (const key of englishWordsByBridge.keys()) {
		const [start, end] = key.split(":");
		if (start === end) continue;
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
			if (nodes.includes(next)) {
				failed = true;
				break;
			}
			nodes.push(next);
		}

		if (!failed && nodes.length === nodeCount) return nodes;
	}

	// Deterministic fallback
	return ["s", "t", "a", "r", "e", "d"].slice(0, nodeCount);
}
