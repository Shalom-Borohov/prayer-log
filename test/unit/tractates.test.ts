import { describe, expect, it } from 'vitest'
import {
  GEMARA_TRACTATES,
  isGemaraTractate,
  isMishnaTractate,
  MISHNA_TRACTATES,
  placeRange,
} from '../../src/domain/tractates'

const DAF_YOMI_CYCLE_DAYS = 2711

const MISHNA_YOMI_CHAPTERS = 525

const GEMARA_IDS_IN_1_7_0 = [
  'berakhot',
  'shabbat',
  'eruvin',
  'pesachim',
  'shekalim',
  'yoma',
  'sukkah',
  'beitzah',
  'roshHashanah',
  'taanit',
  'megillah',
  'moedKatan',
  'chagigah',
  'yevamot',
  'ketubot',
  'nedarim',
  'nazir',
  'sotah',
  'gittin',
  'kiddushin',
  'bavaKamma',
  'bavaMetzia',
  'bavaBatra',
  'sanhedrin',
  'makkot',
  'shevuot',
  'avodahZarah',
  'horayot',
  'zevachim',
  'menachot',
  'chullin',
  'bekhorot',
  'arakhin',
  'temurah',
  'keritot',
  'meilah',
  'kinnim',
  'tamid',
  'middot',
  'niddah',
]

const MISHNA_IDS_IN_1_7_0 = [
  'berakhot',
  'peah',
  'demai',
  'kilayim',
  'sheviit',
  'terumot',
  'maasrot',
  'maaserSheni',
  'challah',
  'orlah',
  'bikkurim',
  'shabbat',
  'eruvin',
  'pesachim',
  'shekalim',
  'yoma',
  'sukkah',
  'beitzah',
  'roshHashanah',
  'taanit',
  'megillah',
  'moedKatan',
  'chagigah',
  'yevamot',
  'ketubot',
  'nedarim',
  'nazir',
  'sotah',
  'gittin',
  'kiddushin',
  'bavaKamma',
  'bavaMetzia',
  'bavaBatra',
  'sanhedrin',
  'makkot',
  'shevuot',
  'eduyot',
  'avodahZarah',
  'avot',
  'horayot',
  'zevachim',
  'menachot',
  'chullin',
  'bekhorot',
  'arakhin',
  'temurah',
  'keritot',
  'meilah',
  'tamid',
  'middot',
  'kinnim',
  'kelim',
  'oholot',
  'negaim',
  'parah',
  'tahorot',
  'mikvaot',
  'niddah',
  'makhshirin',
  'zavim',
  'tevulYom',
  'yadayim',
  'oktzin',
]

const pageCount = ({ first, last }: { first: number; last: number }) => last - first + 1

describe('tractates', () => {
  it('lists the גמרא in Daf Yomi order', () => {
    expect(GEMARA_TRACTATES).toEqual(GEMARA_IDS_IN_1_7_0)
  })

  it('lists the 63 מסכתות of the משנה in order', () => {
    expect(MISHNA_TRACTATES).toEqual(MISHNA_IDS_IN_1_7_0)
  })

  it('covers exactly one Daf Yomi cycle of pages', () => {
    const pages = GEMARA_TRACTATES.map((tractate) => pageCount(placeRange({ kind: 'gemara', tractate, daf: 2 })))

    expect(pages.reduce((sum, count) => sum + count, 0)).toBe(DAF_YOMI_CYCLE_DAYS)
  })

  it('covers every פרק of the Mishna Yomi cycle', () => {
    const chapters = MISHNA_TRACTATES.map((tractate) => pageCount(placeRange({ kind: 'mishna', tractate, chapter: 1 })))

    expect(chapters.reduce((sum, count) => sum + count, 0)).toBe(MISHNA_YOMI_CHAPTERS)
  })

  it.each([
    ['berakhot', 2, 64],
    ['bavaBatra', 2, 176],
    ['meilah', 2, 22],
    ['kinnim', 23, 25],
    ['tamid', 26, 33],
    ['middot', 34, 37],
    ['niddah', 2, 73],
  ] as const)('runs %s from דף %i to %i', (tractate, first, last) => {
    expect(placeRange({ kind: 'gemara', tractate, daf: first })).toEqual({ first, last })
  })

  it.each([
    ['berakhot', 9],
    ['bikkurim', 4],
    ['shabbat', 24],
    ['avot', 6],
    ['kelim', 30],
  ] as const)('gives %s %i פרקים', (tractate, chapters) => {
    expect(placeRange({ kind: 'mishna', tractate, chapter: 1 })).toEqual({ first: 1, last: chapters })
  })

  it.each(['constructor', 'toString', 'hasOwnProperty'])('does not take the object key %s for a מסכת', (key) => {
    expect(isGemaraTractate(key)).toBe(false)
    expect(isMishnaTractate(key)).toBe(false)
  })
})
