/**
 * Grammatical case definitions and options for Finnish nominal inflection.
 *
 * @packageDocumentation
 */

/**
 * Standard grammatical cases supported by the library.
 */
export type GrammaticalCase =
  | 'nominative' // base form
  | 'genitive' // -n
  | 'partitive' // -a / -ä / -ta / -tä
  | 'inessive' // -ssa / -ssä
  | 'elative' // -sta / -stä
  | 'illative' // -Vn / -seen / -iin
  | 'adessive' // -lla / -llä
  | 'ablative' // -lta / -ltä
  | 'allative' // -lle
  | 'essive' // -na / -nä
  | 'translative'; // -ksi

/**
 * Classification of local case preference for place names:
 * - 'in': internal local cases (-ssa/-ssä, -sta/-stä, -seen/-Vn)
 * - 'on': external local cases (-lla/-llä, -lta/-ltä, -lle)
 */
export type LocalCaseType = 'in' | 'on';

/**
 * Contextual and macro cases for place names.
 */
export type PlaceLocalCase =
  | 'local' // automatically resolves to inessive (-ssa/-ssä) or adessive (-lla/-llä)
  | 'localFrom' // automatically resolves to elative (-sta/-stä) or ablative (-lta/-ltä)
  | 'localTo'; // automatically resolves to illative (-on/-en/-iin etc.) or allative (-lle)

/**
 * All accepted case identifiers.
 */
export type CaseName = GrammaticalCase | PlaceLocalCase;

/**
 * Concrete morphological parameters for a person nameholder preference.
 */
export interface PersonPreferenceParams {
  /**
   * Explicitly control whether consonant gradation applies.
   * - `false`: Prevents consonant weakening (e.g. `Satu` -> `Satun`, `Sampo` -> `Sampon`).
   * - `true`: Forces consonant gradation (e.g. `Satu` -> `Sadun`, `Sampo` -> `Sammon`).
   */
  readonly gradation?: boolean;
  /**
   * Explicitly force or disable s-stem (-ksen/-kseen) declension for names ending in -s.
   * - `true`: Forces -ksen declension (e.g. `Lucas` -> `Lucaksen`).
   * - `false`: Forces vocalic -in declension (e.g. `Lucas` -> `Lucasin`).
   */
  readonly sStem?: boolean;
  /**
   * Controls stem vowel mutation for word-derived given names ending in -i.
   * - 'nominative': Retains stem vowel -i (e.g. `Tuuli` -> `Tuulin`, `Meri` -> `Merin`).
   * - 'inflected': Alternates stem vowel -i to -e (e.g. `Tuuli` -> `Tuulen`, `Meri` -> `Meren`).
   */
  readonly vocalicStemVariant?: 'nominative' | 'inflected';
  /**
   * Explicitly controls whether an abbreviation or all-caps name uses colon suffixation.
   * - `true`: Forces colon suffixation (e.g. `KELA` -> `KELA:lle`).
   * - `false`: Inflects directly as a word (e.g. `KELA` -> `Kelalle`).
   */
  readonly colon?: boolean;
  /**
   * Vowel harmony override for handles ending in digits or non-Latin characters.
   * - 'back': Forces back vowel harmony (e.g. `Agent007` as 'seiska' -> `Agent007:lla`).
   * - 'front': Forces front vowel harmony (e.g. `Agent007` as 'seitsemän' -> `Agent007:llä`).
   */
  readonly harmony?: 'front' | 'back';
}

/**
 * Concrete inflection parameters for a place name preference (future-ready).
 */
export interface PlacePreferenceParams {
  /**
   * Local case override ('in' for inessive/illative or 'on' for adessive/allative).
   */
  readonly localCase?: LocalCaseType;
}

/**
 * Union of all supported entity preference parameters.
 */
export type PreferenceParams = PersonPreferenceParams | PlacePreferenceParams;

/**
 * A discrete choice for an orthogonal ambiguity dimension.
 */
export interface DimensionChoice {
  /**
   * Stable identifier for this specific choice.
   */
  readonly id: string;
  /**
   * Human-readable label for UI selection.
   */
  readonly label: string;
  /**
   * Parameter overrides associated with this choice.
   */
  readonly params: Partial<PersonPreferenceParams>;
}

/**
 * An orthogonal dimension of morphological ambiguity for a name.
 */
export interface AmbiguityDimension {
  /**
   * Category key identifying the nature of ambiguity.
   */
  readonly key: 'gradation' | 's-stem' | 'vocalic-variant' | 'acronym-colon' | 'vowel-harmony';
  /**
   * Descriptive title suitable for form section headers.
   */
  readonly title: string;
  /**
   * Optional explanatory context regarding Kotus recommendations.
   */
  readonly description?: string;
  /**
   * Available choices along this dimension.
   */
  readonly choices: readonly DimensionChoice[];
  /**
   * Default choice identifier adhering to standard Kotus guidelines.
   */
  readonly defaultChoiceId: string;
}

/**
 * A discrete, pre-composed preference option suitable for direct single-choice UI lists.
 */
export interface PreferenceOption<P = PersonPreferenceParams> {
  /**
   * Stable identifier for this preference (e.g. 'gradation', 'no-gradation', 's-stem', 'vocalic').
   */
  readonly id: string;
  /**
   * Human-readable label suitable for UI display (e.g. "Sadun, Sadulle", "Satun, Satulle").
   */
  readonly label: string;
  /**
   * Optional linguistic explanation or Kotus citation.
   */
  readonly description?: string;
  /**
   * Grammatical case samples demonstrating this preference in context.
   */
  readonly examples: {
    readonly genitive: string;
    readonly allative: string;
    readonly illative: string;
  };
  /**
   * Concrete morphological parameters applied when this option is selected.
   */
  readonly params: P;
  /**
   * Whether this option represents the Kotus default or statistical majority.
   */
  readonly isDefault?: boolean;
}

/**
 * Disambiguation detection result returned when inspecting a name for multiple valid declensions.
 */
export interface NameDisambiguation<P = PersonPreferenceParams> {
  /**
   * The analyzed proper noun or username.
   */
  readonly name: string;
  /**
   * Whether this name has multiple valid morphological declensions.
   */
  readonly isAmbiguous: boolean;
  /**
   * Orthogonal dimensions of ambiguity (useful for multi-step or multi-toggle forms).
   */
  readonly dimensions: readonly AmbiguityDimension[];
  /**
   * Pre-composed combination options ready for simple single-choice radio button lists.
   */
  readonly options: readonly PreferenceOption<P>[];
  /**
   * Default option identifier matching Kotus guidelines.
   */
  readonly defaultOptionId?: string;
}

/**
 * Supported individual preference representations for person names.
 */
export type PersonPreferenceInput =
  | string
  | PersonPreferenceParams
  | PreferenceOption<PersonPreferenceParams>;

/**
 * Single or multi-choice preference configuration for person names.
 */
export type PersonPreference =
  | PersonPreferenceInput
  | readonly PersonPreferenceInput[];

/**
 * Supported individual preference representations for generic entities.
 */
export type GeneralPreferenceInput =
  | string
  | PersonPreferenceParams
  | PlacePreferenceParams
  | PreferenceOption;

/**
 * Single or multi-choice preference configuration for generic entities.
 */
export type GeneralPreference =
  | GeneralPreferenceInput
  | readonly GeneralPreferenceInput[];

/**
 * Configuration options for person name inflection.
 */
export interface InflectPersonOptions {
  /**
   * The morphological role of the name.
   * - 'givenName': Inflected as a first/given name (resists single k/p/t gradation).
   * - 'surname': Inflected as a family name (e.g. -nen -> -sen).
   * - 'auto': Automatically determined by position and structure (default).
   */
  readonly role?: 'givenName' | 'surname' | 'auto';
  /**
   * Explicitly force or disable s-stem (-ksen/-kseen) declension for names ending in -s.
   * - `true`: Forces -ksen declension (e.g. `Lucas` -> `Lucaksen`).
   * - `false`: Forces vocalic -in declension (e.g. `Niklas` -> `Niklasin`).
   * - `undefined`: Automatically determined by Finnish vs foreign name heuristics.
   */
  readonly sStem?: boolean;
  /**
   * Explicitly control whether consonant gradation applies.
   * - `false`: Prevents consonant weakening (e.g. `Satu` -> `Satun`, `Matti` -> `Mattin`).
   * - `true` / `undefined`: Applies standard Finnish consonant gradation rules.
   */
  readonly gradation?: boolean;
  /**
   * Controls stem vowel mutation for word-derived given names ending in -i.
   */
  readonly vocalicStemVariant?: 'nominative' | 'inflected';
  /**
   * Explicitly controls whether an abbreviation or all-caps name uses colon suffixation.
   */
  readonly colon?: boolean;
  /**
   * Vowel harmony override for handles ending in digits or non-Latin characters.
   */
  readonly harmony?: 'front' | 'back';
  /**
   * Nameholder inflection preference option, option ID, array of preferences, or parameter bundle.
   * e.g. 'no-gradation', ['no-gradation', 'acronym'], or `{ gradation: false, colon: true }`.
   */
  readonly preference?: PersonPreference;
}

/**
 * Options controlling unified nominal inflection.
 */
export interface InflectOptions {
  /**
   * The semantic entity type of the proper noun:
   * - 'person': Person name (given name, surname, compound).
   * - 'place': Toponym / geographic place name.
   * - 'auto': Detects based on place dictionary, toponymic suffixes, or default nominal rules.
   */
  readonly role?: 'person' | 'place' | 'auto';
  /**
   * Explicit local case override for places ('in' or 'on').
   */
  readonly localCase?: LocalCaseType;
  /**
   * Explicitly control whether consonant gradation applies.
   */
  readonly gradation?: boolean;
  /**
   * Force or disable s-stem declension for person names.
   */
  readonly sStem?: boolean;
  /**
   * Controls stem vowel mutation for word-derived given names ending in -i.
   */
  readonly vocalicStemVariant?: 'nominative' | 'inflected';
  /**
   * Explicitly controls whether an abbreviation or all-caps name uses colon suffixation.
   */
  readonly colon?: boolean;
  /**
   * Vowel harmony override for handles ending in digits or non-Latin characters.
   */
  readonly harmony?: 'front' | 'back';
  /**
   * Nameholder inflection preference option, option ID, array of preferences, or parameter bundle.
   */
  readonly preference?: GeneralPreference;
}

