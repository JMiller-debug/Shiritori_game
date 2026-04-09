export const getFirstSyllable = (word: string): string => {
	const match = word.match(/^([bcdfghjklmnpqrstvwxyz]{1,2})?[aeiou]|^n/i);
	return match ? match[0].toLowerCase() : "";
};

export const getLastSyllable = (word: string): string => {
	const match = word.match(/([bcdfghjklmnpqrstvwxyz]{1,2})?[aeiou]$|n$/i);
	if (!match) return "";
	let syllable = match[0].toLowerCase();
	// Geminate consonants (っ): "kki" → "ki"
	if (syllable.length === 3 && syllable[0] === syllable[1])
		syllable = syllable.slice(1);
	return syllable;
};

export const endsWithN = (word: string): boolean =>
	word.toLowerCase().endsWith("n") || word.endsWith("ん");

// ─── Hiragana mora helpers ────────────────────────────────────────────────────
// Small hiragana that form digraphs with the preceding character (e.g. きゃ, しゅ)
const SMALL = new Set(["ぁ", "ぃ", "ぅ", "ぇ", "ぉ", "ゃ", "ゅ", "ょ", "ゎ"]);

/** Returns the first mora of a hiragana string (1 or 2 chars). */
export const getFirstMora = (str: string): string => {
	if (!str) return "";
	return str.length > 1 && SMALL.has(str[1]) ? str[0] + str[1] : str[0];
};

/** Returns the last mora of a hiragana string (1 or 2 chars). */
export const getLastMora = (str: string): string => {
	if (!str) return "";
	const last = str[str.length - 1];
	// Small char preceded by its base (e.g. ょ in りょ)
	if (SMALL.has(last) && str.length > 1) return str[str.length - 2] + last;
	return last;
};
