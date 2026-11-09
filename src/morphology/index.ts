/**
 * Morphology subsystem of the taivuta library.
 *
 * Provides phonological rules, consonant gradation, and stem analysis
 * for Finnish proper nouns.
 *
 * @packageDocumentation
 */

export { getVowelHarmony, harmonize, isBackSpokenLetter, type VowelHarmony } from './vowels.ts';
export { weakenConsonants, type GradationOptions } from './gradation.ts';
export { analyzeStem, type AnalyzedStem } from './stem.ts';
export {
  matchNatureNoun,
  matchNatureNounSurname,
  inflectNatureNounSurname,
  NATURE_NOUN_RULES,
  type NatureNounStem,
  type NatureNounRule
} from './nature-nouns.ts';
export {
  createStemParadigm,
  type StemParadigm,
  type CreateParadigmOptions
} from './paradigm.ts';
export {
  assembleCase,
  type AssembleCaseOptions
} from './assembler.ts';
export {
  decomposeCompound,
  type CompoundParts
} from './compounds.ts';
export {
  needsColon,
  inflectColonWord
} from './colon.ts';
