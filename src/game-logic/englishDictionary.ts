import rawWords from "../assets/english-dictionary.json";

const words = rawWords as string[];

// ─── Core lookup ──────────────────────────────────────────────────────────────
const wordSet = new Set<string>();

// Only words 4–10 letters go into the bridge map (keeps puzzle/hints sane)
export const englishWordsByBridge = new Map<string, string[]>();

for (const raw of words) {
	const w = raw.toLowerCase().trim();
	if (!w) continue;
	wordSet.add(w);

	if (w.length >= 4 && w.length <= 10) {
		const first = w[0];
		const last = w[w.length - 1];
		const key = `${first}:${last}`;
		const bucket = englishWordsByBridge.get(key) ?? [];
		bucket.push(w);
		englishWordsByBridge.set(key, bucket);
	}
}

export const isValidEnglishWord = (word: string): boolean =>
	wordSet.has(word.toLowerCase().trim());

export const englishDictionarySize = wordSet.size;
