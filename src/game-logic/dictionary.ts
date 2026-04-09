import rawDict from "../assets/dictionary.json";
import { getFirstSyllable, getLastSyllable, endsWithN } from "./japaneseUtils";

// The file is a flat { hiragana: romaji } object.
const dict = rawDict as Record<string, string>;

// ─── Core lookup structures (built once at module load) ───────────────────────
const romajiSet = new Set<string>();
const romajiToHiragana = new Map<string, string>();

// Katakana block: ゠ (U+30A0) – ヿ (U+30FF)
const containsKatakana = (str: string) => /[\u30A0-\u30FF]/.test(str);

for (const [hiragana, romaji] of Object.entries(dict)) {
	if (containsKatakana(hiragana)) continue; // ← drop katakana words
	const normalized = romaji.trim().toLowerCase();
	romajiSet.add(normalized);
	if (!romajiToHiragana.has(normalized)) {
		romajiToHiragana.set(normalized, hiragana);
	}
}

/** hiragana → romaji, for validating and reading hiragana-mode input */
export const hiraganaDict = new Map<string, string>(
	Object.entries(dict).map(([h, r]) => [h, r.trim().toLowerCase()]),
);

/** Returns true if the hiragana string is a known noun in the dictionary. */
export const isValidHiraganaWord = (word: string): boolean =>
	hiraganaDict.has(word);

export const isValidJapaneseWord = (word: string): boolean => {
	return romajiSet.has(word.trim().toLowerCase());
};

/**
 * Returns the hiragana reading for a romaji word, or undefined if not found.
 * Useful for showing furigana / hints in the UI.
 */
export const getHiragana = (romaji: string): string | undefined => {
	return romajiToHiragana.get(romaji.trim().toLowerCase());
};

/** Total number of words loaded — handy for a debug banner. */
export const dictionarySize = romajiSet.size;

/**
 * Words grouped by their first syllable.
 * Used by the puzzle generator to build valid node chains.
 */
export const wordsByFirstSyllable = new Map<string, string[]>();

/**
 * Words grouped by "firstSyllable:lastSyllable" bridge key.
 * Guarantees puzzle solvability and powers the hint system.
 * e.g. wordsByBridge.get("sa:ra") → ["sakura", "samura", ...]
 */
export const wordsByBridge = new Map<string, string[]>();

for (const romaji of romajiSet) {
	const first = getFirstSyllable(romaji);
	const last = getLastSyllable(romaji);
	if (!first) continue;

	// wordsByFirstSyllable
	const fBucket = wordsByFirstSyllable.get(first) ?? [];
	fBucket.push(romaji);
	wordsByFirstSyllable.set(first, fBucket);

	// wordsByBridge — skip words that end with n (game-over in shiritori)
	if (!last || endsWithN(romaji)) continue;
	const key = `${first}:${last}`;
	const bBucket = wordsByBridge.get(key) ?? [];
	bBucket.push(romaji);
	wordsByBridge.set(key, bBucket);
}
