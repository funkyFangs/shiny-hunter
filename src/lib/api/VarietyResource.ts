import type { LinkResource } from '$lib/api/LinkResource'

export interface VarietyResource {
  is_default: boolean
  pokemon: LinkResource
}

export const VARIETY_BLACKLIST = new Set([''])

export function isVarietySupported(
  variety: string,
  generation: number,
  versionGroup: string
): boolean {
  // Negate the union of all unsupported cases
  return !(
    VARIETY_BLACKLIST.has(variety) ||
    // Platinum & onwards
    (variety === 'shaymin-sky' && generation === 4 && versionGroup !== 'platinum') ||
    (variety === 'giratina-origin' && generation === 4 && versionGroup !== 'platinum') ||
    // B2W2 & onwards
    (variety.endsWith('-therian') && generation === 5 && versionGroup !== 'black-2-white-2') ||
    (variety.match(/^kyurem-(black|white)$/) &&
      generation === 5 &&
      versionGroup !== 'black-2-white-2') ||
    (variety.endsWith('-resolute') && generation === 5 && versionGroup !== 'black-2-white-2') ||
    // ORAS & onwards
    (variety.endsWith('-primal') &&
      (generation < 6 || (generation === 6 && versionGroup !== 'omegaruby-alphasapphire'))) ||
    (variety.endsWith('-unbound') &&
      generation === 6 &&
      versionGroup !== 'omegaruby-alphasapphire') ||
    // SM & onwards
    variety.endsWith('-power-construct') ||
    (variety.match(/^zygarde-(10|complete$)/) && generation < 6) ||
    (variety.includes('-alola') && generation < 7) ||
    // USUM & onwards
    (variety.endsWith('-dusk') && generation === 7 && versionGroup !== 'ultra-sun-ultra-moon') ||
    (variety.match(/^necrozma-(dusk|dawn|ultra)$/) &&
      generation === 7 &&
      versionGroup !== 'ultra-sun-ultra-moon') ||
    // BDSP
    (variety.match(/-(galar|hisui)|^(palkia|dialga)-origin$/) && generation < 8) ||
    (variety.includes('-paldea') && generation < 9) ||
    variety.endsWith('-mega')
  )
}
