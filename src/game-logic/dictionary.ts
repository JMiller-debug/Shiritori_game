import rawDict from "../assets/dictionary.json";
import { getFirstSyllable, getLastSyllable, endsWithN } from "./japaneseUtils";

interface DictEntry {
	romaji: string;
	gloss?: string;
	kanji?: string;
}

export interface WordDefinition {
	gloss?: string;
	kanji?: string;
}

const dict = rawDict as unknown as Record<string, DictEntry>;

// ─── Core lookup structures ───────────────────────────────────────────────────
const romajiSet = new Set<string>();
const romajiToHiragana = new Map<string, string>();
const hiraganaToEntry = new Map<string, DictEntry>();

const containsKatakana = (str: string) => /[\u30A0-\u30FF]/.test(str);

for (const [hiragana, entry] of Object.entries(dict)) {
	if (containsKatakana(hiragana)) continue;
	const romaji = entry.romaji.trim().toLowerCase();
	romajiSet.add(romaji);
	if (!romajiToHiragana.has(romaji)) {
		romajiToHiragana.set(romaji, hiragana);
	}
	hiraganaToEntry.set(hiragana, entry);
}

/** hiragana → romaji, for validating hiragana-mode input */
export const hiraganaDict = new Map<string, string>(
	[...hiraganaToEntry.entries()].map(([h, e]) => [h, e.romaji]),
);

export const isValidHiraganaWord = (word: string): boolean =>
	hiraganaToEntry.has(word);

export const isValidJapaneseWord = (word: string): boolean =>
	romajiSet.has(word.trim().toLowerCase());

export const getHiragana = (romaji: string): string | undefined =>
	romajiToHiragana.get(romaji.trim().toLowerCase());

/**
 * Returns the English gloss and kanji form for a word.
 * Accepts either romaji or hiragana input.
 */
export const getDefinition = (input: string): WordDefinition | undefined => {
	// Try direct hiragana lookup first
	const byHiragana = hiraganaToEntry.get(input);
	if (byHiragana) return { gloss: byHiragana.gloss, kanji: byHiragana.kanji };

	// Fall back to romaji → hiragana → entry
	const hiragana = romajiToHiragana.get(input.trim().toLowerCase());
	if (hiragana) {
		const entry = hiraganaToEntry.get(hiragana);
		if (entry) return { gloss: entry.gloss, kanji: entry.kanji };
	}

	return undefined;
};

export const dictionarySize = romajiSet.size;

// ─── Puzzle structures ────────────────────────────────────────────────────────
export const wordsByFirstSyllable = new Map<string, string[]>();
export const wordsByBridge = new Map<string, string[]>();

for (const romaji of romajiSet) {
	const first = getFirstSyllable(romaji);
	const last = getLastSyllable(romaji);
	if (!first) continue;

	const fBucket = wordsByFirstSyllable.get(first) ?? [];
	fBucket.push(romaji);
	wordsByFirstSyllable.set(first, fBucket);

	if (!last || endsWithN(romaji)) continue;
	const key = `${first}:${last}`;
	const bBucket = wordsByBridge.get(key) ?? [];
	bBucket.push(romaji);
	wordsByBridge.set(key, bBucket);
}
