/**
 * Morphology subsystem of the taivuta library.
 *
 * Provides phonological rules, consonant gradation, and stem analysis
 * for Finnish proper nouns.
 *
 * @packageDocumentation
 */

export { getVowelHarmony, harmonize, type VowelHarmony } from './vowels.ts';
export { weakenConsonants, type GradationOptions } from './gradation.ts';
export { analyzeStem, type AnalyzedStem } from './stem.ts';
export {
  matchNatureNounSurname,
  inflectNatureNounSurname,
  type NatureNounStem
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
