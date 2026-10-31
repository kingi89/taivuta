/**
 * Morphological handlers for sovereign states, plural toponyms, and complex geopolitical entities.
 *
 * Covers plural country stems (-maat, -vallat, plural island archipelagos),
 * state compound phrases (-tasavalta, -kunta), and multi-word geopolitical titles.
 *
 * @packageDocumentation
 */

import type { GrammaticalCase } from '../cases/types.ts';
import { harmonize } from '../morphology/vowels.ts';

/**
 * Inflects plural country nouns ending in -maat (e.g. Alankomaat, Pohjoismaat).
 *
 * @param place - Country name candidate.
 * @param targetCase - Target grammatical case.
 * @returns Inflected plural country name or null if not matching.
 */
export function inflectPluralMaat(place: string, targetCase: GrammaticalCase): string | null {
  if (!place.endsWith('maat')) {
    return null;
  }
  const base = place.slice(0, -4);
  if (targetCase === 'genitive') return `${base}maiden`;
  if (targetCase === 'partitive') return `${base}maita`;
  if (targetCase === 'illative') return `${base}maihin`;

  const endings: Record<string, string> = {
    inessive: 'maissa',
    elative: 'maista',
    adessive: 'mailla',
    ablative: 'mailta',
    allative: 'maille',
    essive: 'maina',
    translative: 'maiksi'
  };
  const end = endings[targetCase];
  return end ? `${base}${end}` : null;
}

/**
 * Inflects plural country nouns ending in -vallat (e.g. Yhdysvallat).
 *
 * @param place - Country name candidate.
 * @param targetCase - Target grammatical case.
 * @returns Inflected plural country name or null if not matching.
 */
export function inflectPluralVallat(place: string, targetCase: GrammaticalCase): string | null {
  if (!place.endsWith('vallat')) {
    return null;
  }
  const base = place.slice(0, -6);
  if (targetCase === 'genitive') return `${base}valtojen`;
  if (targetCase === 'partitive') return `${base}valtoja`;
  if (targetCase === 'illative') return `${base}valtoihin`;

  const endings: Record<string, string> = {
    inessive: 'valloissa',
    elative: 'valloista',
    adessive: 'valloilla',
    ablative: 'valloilta',
    allative: 'valloille',
    essive: 'valtoina',
    translative: 'valloiksi'
  };
  const end = endings[targetCase];
  return end ? `${base}${end}` : null;
}

/**
 * Inflects plural island chains ending in -iit, -iivit, -ellit, or -orit (e.g. Filippiinit, Malediivit).
 *
 * @param place - Island archipelago candidate.
 * @param targetCase - Target grammatical case.
 * @returns Inflected plural archipelago name or null if not matching.
 */
const ARCHIPELAGO_ENDINGS: Record<string, string> = {
  allative: 'lle',
  illative: 'lle',
  adessive: 'lla',
  ablative: 'lta',
  inessive: 'ssa',
  elative: 'sta'
};

export function inflectPluralIslandArchipelago(
  place: string,
  targetCase: GrammaticalCase
): string | null {
  const match = place.match(/^(.*?)((?:[A-ZÀ-ÖØ-ß][a-zà-öø-ÿ]*)?(?:iinit|iivit|ellit|orit))$/u);
  if (!match) {
    return null;
  }
  const prefix = match[1] ?? '';
  const word = match[2] ?? '';
  const cutT = word.slice(0, -1);
  const stem = `${cutT.slice(0, -1)}ei`;

  if (targetCase === 'genitive') return `${prefix}${cutT}en`;
  if (targetCase === 'partitive') return `${prefix}${stem}${harmonize('a', stem)}`;

  const ending = ARCHIPELAGO_ENDINGS[targetCase];
  if (!ending) return null;
  const harmonizedEnd = ending === 'lle' ? 'lle' : harmonize(ending, stem);
  return `${prefix}${stem}${harmonizedEnd}`;
}

function inflectEmirates(place: string, targetCase: GrammaticalCase): string | null {
  if (place !== 'Yhdistyneet arabiemiirikunnat' && place !== 'Arabiemiirikunnat') {
    return null;
  }
  const isCompound = place.startsWith('Yhdistyneet');
  const pfxMap: Record<string, string> = {
    inessive: 'Yhdistyneissä ',
    elative: 'Yhdistyneistä ',
    illative: 'Yhdistyneisiin ',
    genitive: 'Yhdistyneiden ',
    partitive: 'Yhdistyneitä '
  };
  const kunnatEndings: Record<string, string> = {
    inessive: 'arabiemiirikunnissa',
    elative: 'arabiemiirikunnista',
    illative: 'arabiemiirikuntiin',
    genitive: 'arabiemiirikuntien',
    partitive: 'arabiemiirikuntia'
  };
  const kEnd = kunnatEndings[targetCase];
  if (!kEnd) return null;
  const pfx = isCompound ? (pfxMap[targetCase] ?? '') : '';
  return `${pfx}${isCompound ? kEnd : 'A' + kEnd.slice(1)}`;
}

function inflectRepublic(place: string, targetCase: GrammaticalCase): string | null {
  if (!place.endsWith('tasavalta')) {
    return null;
  }
  const prefix = place.slice(0, -10).trim();
  const nounEndings: Record<string, string> = {
    inessive: 'tasavallassa',
    elative: 'tasavallasta',
    illative: 'tasavaltaan',
    genitive: 'tasavallan',
    partitive: 'tasavaltaa'
  };
  const tEnd = nounEndings[targetCase];
  if (!tEnd) return null;

  if (prefix.endsWith('nen')) {
    const adjBase = prefix.slice(0, -3);
    const adjEndings: Record<string, string> = {
      inessive: 'sessa',
      elative: 'sesta',
      illative: 'seen',
      genitive: 'sen',
      partitive: 'sta'
    };
    const adjEnd = adjEndings[targetCase] ?? '';
    return `${adjBase}${adjEnd} ${tEnd}`;
  }
  return `${prefix} ${tEnd}`;
}

/**
 * Inflects geopolitical state compounds ending in -tasavalta (e.g. Dominikaaninen tasavalta).
 *
 * @param place - Proper noun candidate.
 * @param targetCase - Target grammatical case.
 * @returns Inflected state phrase or null if not matching.
 */
export function inflectStateCompound(place: string, targetCase: GrammaticalCase): string | null {
  if (place === 'Yhdistynyt kuningaskunta') {
    const endings: Record<string, string> = {
      inessive: 'Yhdistyneessä kuningaskunnassa',
      elative: 'Yhdistyneestä kuningaskunnasta',
      illative: 'Yhdistyneeseen kuningaskuntaan',
      genitive: 'Yhdistyneen kuningaskunnan',
      partitive: 'Yhdistynyttä kuningaskuntaa'
    };
    return endings[targetCase] ?? null;
  }

  return inflectEmirates(place, targetCase) ?? inflectRepublic(place, targetCase);
}
