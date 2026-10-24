/**
 * Consonant gradation (astevaihtelu) for Finnish proper nouns.
 *
 * Consonant gradation is a phonological process where stop consonants (k, p, t)
 * alternate between a strong grade (typically in open syllables) and a weak grade
 * (in closed syllables formed by case endings like genitive -n, inessive -ssa, etc.).
 *
 * Kotus Guideline:
 * - Quantitative gradation (kk -> k, pp -> p, tt -> t) applies almost universally
 *   to both native names and assimilated place names (e.g. Matti -> Matin, Pekka -> Pekan).
 * - Qualitative gradation (e.g. t -> d, nk -> ng, k -> loss) applies regularly to
 *   place names and traditional nouns (Turku -> Turun, Hanko -> Hangossa, Lieto -> Liedossa),
 *   but modern Finnish given names generally resist single k/p gradation (Aki -> Akin,
 *   Riku -> Rikun, Niko -> Nikon, Mika -> Mikan).
 *
 * @packageDocumentation
 */

/**
 * Options controlling how consonant gradation is applied.
 */
export interface GradationOptions {
  /**
   * If true, only quantitative gradation (kk->k, pp->p, tt->t) is applied.
   * Qualitative gradation (t->d, nk->ng, etc.) will be skipped.
   */
  readonly doubleOnly?: boolean;
}

/**
 * Applies quantitative gradation to shorten geminate stops at the syllable boundary.
 *
 * Kotus Guideline:
 * Trisyllabic names ending in -tteri, -pperi, -kkeri (e.g. Valtteri, Petteri)
 * resist consonant gradation (Valtteri -> Valtterin, Petteri -> Petterin).
 *
 * @param stem - The noun stem ending in a vowel.
 * @returns The stem with geminate consonants weakened.
 */
function weakenGeminates(stem: string): string {
  if (/(?:tteri|pperi|kkeri)$/i.test(stem)) {
    return stem;
  }

  return stem
    .replace(/kk([aeiouyäö])/gi, 'k$1')
    .replace(/pp([aeiouyäö])/gi, 'p$1')
    .replace(/tt([aeiouyäö])/gi, 't$1')
    .replace(/gg([aeiouyäö])/gi, 'g$1')
    .replace(/bb([aeiouyäö])/gi, 'b$1');
}

/**
 * Applies qualitative gradation to nasal/liquid clusters and single stops.
 *
 * Kotus: Qualitative gradation occurs in place names and certain traditional stems
 * (e.g. Hanko -> Hangon, Sampo -> Sammon, Lieto -> Liedon, Turku -> Turun).
 * Note: Single stop weakening (t -> d, k -> loss) only applies to original single stops,
 * never to single stops resulting from geminate reduction (tt -> t, kk -> k).
 *
 * @param stem - The noun stem ending in a vowel.
 * @param original - The original word before geminate weakening.
 * @returns The stem with qualitative consonant clusters weakened.
 */
function weakenQualitative(stem: string, original: string): string {
  let result = stem;

  // Clusters with geminate stops (nkk, mpp, ltt, rtt, ntt) only weaken to single stop
  // (e.g. Antti -> Antin, Kerttu -> Kertun, Pankki -> Pankin). Qualitative gradation
  // applies only when the cluster was originally a single stop (Hanko -> Hangon, Parta -> Parran).
  if (!/nkk[aeiouyäö]/i.test(original)) {
    result = result.replace(/([aeiouyäö])nk([aeiouyäö])/gi, '$1ng$2');
  }
  if (!/mpp[aeiouyäö]/i.test(original)) {
    result = result.replace(/([aeiouyäö])mp([aeiouyäö])/gi, '$1mm$2');
  }
  if (!/ltt[aeiouyäö]/i.test(original)) {
    result = result.replace(/([aeiouyäö])lt([aeiouyäö])/gi, '$1ll$2');
  }
  if (!/rtt[aeiouyäö]/i.test(original)) {
    result = result.replace(/([aeiouyäö])rt([aeiouyäö])/gi, '$1rr$2');
  }
  if (!/ntt[aeiouyäö]/i.test(original)) {
    result = result.replace(/([aeiouyäö])nt([aeiouyäö])/gi, '$1nn$2');
  }

  // Single t -> d between vowels only if the original did not have a geminate tt
  if (!/tt[aeiouyäö]/i.test(original)) {
    result = result.replace(/([aeiouyäö])t([aeiouyäö])$/i, '$1d$2');
  }

  // Single k after vowel and liquid only if the original did not have a geminate kk
  if (!/kk[aeiouyäö]/i.test(original)) {
    result = result.replace(/([aeiouyäö][rl])k([aeiouyäö])$/i, '$1$2');
  }

  return result;
}

/**
 * Weakens the consonants of a stem according to Finnish consonant gradation rules.
 *
 * @param word - The word or stem in its strong grade (e.g. "Pekka", "Turku", "Matti").
 * @param options - Configuration options controlling whether qualitative gradation applies.
 * @returns The weakened stem.
 *
 * @example
 * ```ts
 * weakenConsonants("Pekka"); // "Peka"
 * weakenConsonants("Matti"); // "Mati"
 * weakenConsonants("Hanko"); // "Hango"
 * weakenConsonants("Aki", { doubleOnly: true }); // "Aki" (resists gradation)
 * ```
 */
export function weakenConsonants(word: string, options: GradationOptions = {}): string {
  if (!word || word.length < 2) {
    return word;
  }

  // Always apply quantitative gradation (geminate stops)
  let result = weakenGeminates(word);

  // Apply qualitative gradation unless caller requested doubleOnly
  if (!options.doubleOnly) {
    result = weakenQualitative(result, word);
  }

  return result;
}
