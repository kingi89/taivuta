import type { GrammaticalCase, PersonPreferenceParams } from '../cases/types.ts';
import { inflectColonWord, needsColon } from '../morphology/colon.ts';
import { weakenConsonants } from '../morphology/gradation.ts';
import { harmonize } from '../morphology/vowels.ts';

/**
 * Five-case preview bundle generated for disambiguation option labels and examples.
 */
export interface InflectionExamples {
  readonly genitive: string;
  readonly allative: string;
  readonly illative: string;
  readonly adessive: string;
  readonly ablative: string;
}

interface HeadStems {
  readonly weak: string;
  readonly illative: string;
}

const EXAMPLE_CASES: readonly GrammaticalCase[] = [
  'genitive',
  'allative',
  'illative',
  'adessive',
  'ablative'
];

function buildColonExamples(name: string, harmony?: 'front' | 'back'): InflectionExamples {
  const opts = harmony ? { harmony } : undefined;
  const [genitive, allative, illative, adessive, ablative] = EXAMPLE_CASES.map((c) =>
    inflectColonWord(name, c, opts)
  );
  return {
    genitive: genitive ?? name,
    allative: allative ?? name,
    illative: illative ?? name,
    adessive: adessive ?? name,
    ablative: ablative ?? name
  };
}

function buildSStem(head: string, useSStem: boolean): HeadStems {
  if (!useSStem || head.length <= 3) {
    const stem = `${head}i`;
    return { weak: stem, illative: `${stem}in` };
  }
  const stem = /[aä]s$/i.test(head)
    ? `${head.slice(0, -2)}${head[head.length - 2] ?? 'a'}kse`
    : `${head.slice(0, -1)}kse`;
  return { weak: stem, illative: `${stem}en` };
}

function buildTarStem(head: string, useTarStem: boolean): HeadStems {
  if (!useTarStem || head.length < 5) {
    const stem = `${head}i`;
    return { weak: stem, illative: `${stem}in` };
  }
  const match = head.match(/t([aä])r$/i);
  const stem = `${head.slice(0, -3)}tt${match?.[1] ?? 'a'}re`;
  return { weak: stem, illative: `${stem}en` };
}

function resolveHeadStems(head: string, params: PersonPreferenceParams): HeadStems {
  if (params.sStem !== undefined && /[aeiouyäö]s$/i.test(head)) {
    return buildSStem(head, params.sStem);
  }
  if (params.tarStem !== undefined && /t[aä]r$/i.test(head)) {
    return buildTarStem(head, params.tarStem);
  }
  if (params.vocalicStemVariant === 'inflected') {
    const stem = `${head.slice(0, -1)}e`;
    return { weak: stem, illative: `${stem}en` };
  }
  const weak =
    params.gradation === false
      ? head
      : weakenConsonants(head, {
          doubleOnly: params.gradation !== true,
          singleKLoss: params.gradation === true
        });
  return { weak, illative: `${head}${head.slice(-1)}n` };
}

/**
 * Generates lightweight five-case disambiguation examples without pulling in
 * the full person inflection engine or nature-noun tables.
 *
 * @param name - Proper noun or handle being disambiguated.
 * @param params - Preference parameters for the candidate option.
 * @returns Five grammatical case preview strings.
 */
export function buildPreferenceExamples(
  name: string,
  params: PersonPreferenceParams
): InflectionExamples {
  const lastHyphen = name.lastIndexOf('-');
  const prefix = lastHyphen >= 0 ? name.slice(0, lastHyphen + 1) : '';
  const head = lastHyphen >= 0 ? name.slice(lastHyphen + 1) : name;

  if (params.colon ?? needsColon(head)) {
    return buildColonExamples(name, params.harmony);
  }

  const { weak, illative } = resolveHeadStems(head, params);
  return {
    genitive: `${prefix}${weak}n`,
    allative: `${prefix}${weak}lle`,
    illative: `${prefix}${illative}`,
    adessive: `${prefix}${weak}${harmonize('lla', head)}`,
    ablative: `${prefix}${weak}${harmonize('lta', head)}`
  };
}
