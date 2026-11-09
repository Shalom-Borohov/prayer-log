import { TRACTATE_NAMES } from '../copy/learning'
import type { LearningEntry } from './types'

type TractateId = keyof typeof TRACTATE_NAMES

export interface PlaceRange {
  first: number
  last: number
}

const fromDafBet = (last: number): PlaceRange => ({ first: 2, last })

const GEMARA_PAGES = {
  berakhot: fromDafBet(64),
  shabbat: fromDafBet(157),
  eruvin: fromDafBet(105),
  pesachim: fromDafBet(121),
  shekalim: fromDafBet(22),
  yoma: fromDafBet(88),
  sukkah: fromDafBet(56),
  beitzah: fromDafBet(40),
  roshHashanah: fromDafBet(35),
  taanit: fromDafBet(31),
  megillah: fromDafBet(32),
  moedKatan: fromDafBet(29),
  chagigah: fromDafBet(27),
  yevamot: fromDafBet(122),
  ketubot: fromDafBet(112),
  nedarim: fromDafBet(91),
  nazir: fromDafBet(66),
  sotah: fromDafBet(49),
  gittin: fromDafBet(90),
  kiddushin: fromDafBet(82),
  bavaKamma: fromDafBet(119),
  bavaMetzia: fromDafBet(119),
  bavaBatra: fromDafBet(176),
  sanhedrin: fromDafBet(113),
  makkot: fromDafBet(24),
  shevuot: fromDafBet(49),
  avodahZarah: fromDafBet(76),
  horayot: fromDafBet(14),
  zevachim: fromDafBet(120),
  menachot: fromDafBet(110),
  chullin: fromDafBet(142),
  bekhorot: fromDafBet(61),
  arakhin: fromDafBet(34),
  temurah: fromDafBet(34),
  keritot: fromDafBet(28),
  meilah: fromDafBet(22),
  kinnim: { first: 23, last: 25 },
  tamid: { first: 26, last: 33 },
  middot: { first: 34, last: 37 },
  niddah: fromDafBet(73),
} as const satisfies Partial<Record<TractateId, PlaceRange>>

const MISHNA_CHAPTERS = {
  berakhot: 9,
  peah: 8,
  demai: 7,
  kilayim: 9,
  sheviit: 10,
  terumot: 11,
  maasrot: 5,
  maaserSheni: 5,
  challah: 4,
  orlah: 3,
  bikkurim: 4,
  shabbat: 24,
  eruvin: 10,
  pesachim: 10,
  shekalim: 8,
  yoma: 8,
  sukkah: 5,
  beitzah: 5,
  roshHashanah: 4,
  taanit: 4,
  megillah: 4,
  moedKatan: 3,
  chagigah: 3,
  yevamot: 16,
  ketubot: 13,
  nedarim: 11,
  nazir: 9,
  sotah: 9,
  gittin: 9,
  kiddushin: 4,
  bavaKamma: 10,
  bavaMetzia: 10,
  bavaBatra: 10,
  sanhedrin: 11,
  makkot: 3,
  shevuot: 8,
  eduyot: 8,
  avodahZarah: 5,
  avot: 6,
  horayot: 3,
  zevachim: 14,
  menachot: 13,
  chullin: 12,
  bekhorot: 9,
  arakhin: 9,
  temurah: 7,
  keritot: 6,
  meilah: 6,
  tamid: 7,
  middot: 5,
  kinnim: 3,
  kelim: 30,
  oholot: 18,
  negaim: 14,
  parah: 12,
  tahorot: 10,
  mikvaot: 10,
  niddah: 10,
  makhshirin: 6,
  zavim: 5,
  tevulYom: 4,
  yadayim: 4,
  oktzin: 3,
} as const satisfies Record<TractateId, number>

export type GemaraTractate = keyof typeof GEMARA_PAGES

export type MishnaTractate = keyof typeof MISHNA_CHAPTERS

export const isGemaraTractate = (value: unknown): value is GemaraTractate =>
  typeof value === 'string' && Object.hasOwn(GEMARA_PAGES, value)

export const isMishnaTractate = (value: unknown): value is MishnaTractate =>
  typeof value === 'string' && Object.hasOwn(MISHNA_CHAPTERS, value)

export const GEMARA_TRACTATES = Object.keys(GEMARA_PAGES).filter(isGemaraTractate)

export const MISHNA_TRACTATES = Object.keys(MISHNA_CHAPTERS).filter(isMishnaTractate)

export function placeRange(entry: LearningEntry): PlaceRange {
  return entry.kind === 'gemara' ? GEMARA_PAGES[entry.tractate] : { first: 1, last: MISHNA_CHAPTERS[entry.tractate] }
}
