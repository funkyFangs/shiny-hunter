import { HuntingMethod } from '$lib/api/HuntingMethod'
import type { HuntTracker } from '$lib/api/HuntTracker'

export type Fraction = {
  numerator: number
  denominator: number
}

export type OddsFunction = (huntTracker: HuntTracker) => Fraction

export function fraction(numerator: number, denominator: number): Fraction {
  return {
    numerator,
    denominator
  }
}

export function getFullOdds(huntTracker: HuntTracker): Fraction {
  let numerator = 1
  if (huntTracker.shinyCharm) {
    numerator += 2
  }
  if (huntTracker.lure) {
    numerator += 1
  }
  const denominator = huntTracker.generation <= 5 ? 8192 : 4096
  return fraction(numerator, denominator)
}

export function getPokeRadarOdds(huntTracker: HuntTracker): Fraction {
  let numerator = Math.ceil(65535 / (8200 - Math.min(huntTracker.chain!.current, 40) * 200))
  if (huntTracker.generation >= 6) {
    numerator *= 2
  }
  if (huntTracker.shinyCharm) {
    numerator *= 2
  }

  return fraction(numerator, 65536)
}

export function getMasudaMethodOdds(huntTracker: HuntTracker): Fraction {
  switch (huntTracker.generation) {
    case 4:
      return fraction(5, 8192)
    case 5:
      return fraction(6, 8192)
    default:
      return fraction(6, 4096)
  }
}

export function getConsecutiveFishingOdds(huntTracker: HuntTracker): Fraction {
  const recompute =
    1 + (huntTracker.shinyCharm ? 2 : 0) + Math.min(huntTracker.chain!.current, 20) * 2
  const odds = 1 - Math.pow(4095 / 4096, recompute)
  return fraction(1, Math.round(1 / odds))
}

export function getFriendSafariOdds(huntTracker: HuntTracker): Fraction {
  return fraction(huntTracker.shinyCharm ? 7 : 5, 4096)
}

export function getHiddenPokemonOdds(): Fraction {
  return fraction(1, 4096)
}

export function getSosBattleOdds(huntTracker: HuntTracker): Fraction {
  const length = huntTracker.chain!.current
  const { shinyCharm } = huntTracker

  let denominator
  if (length <= 10) {
    denominator = shinyCharm ? 1366 : 4096
  } else if (length <= 20) {
    denominator = shinyCharm ? 585 : 820
  } else if (length <= 30) {
    denominator = shinyCharm ? 373 : 455
  } else {
    denominator = shinyCharm ? 273 : 315
  }

  return fraction(1, denominator)
}

export function getCatchComboOdds(huntTracker: HuntTracker): Fraction {
  let numerator: number = 1
  const currentChain = huntTracker.chain!.current

  if (currentChain > 30) {
    numerator += 11
  } else if (currentChain > 20) {
    numerator += 7
  } else if (currentChain > 10) {
    numerator += 3
  }

  if (huntTracker.shinyCharm) {
    numerator += 2
  }

  if (huntTracker.lure) {
    numerator += 1
  }

  return fraction(numerator, 4096)
}

export function getBrilliantPokemonOdds(huntTracker: HuntTracker): Fraction {
  const { count, shinyCharm } = huntTracker

  let numerator = 1
  if (shinyCharm) {
    numerator += 2
  }

  if (count >= 500) {
    numerator += 6
  } else if (count >= 300) {
    numerator += 5
  } else if (count >= 200) {
    numerator += 4
  } else if (count >= 100) {
    numerator += 3
  } else if (count >= 50) {
    numerator += 2
  } else if (count >= 1) {
    numerator += 1
  }

  return fraction(numerator, 4096)
}

export function getLegendsArceusMassOutbreakOdds(huntTracker: HuntTracker): Fraction {
  const { shinyCharm } = huntTracker

  let numerator = huntTracker.isMassive ? 13 : 26
  if (shinyCharm) {
    numerator += 3
  }

  switch (huntTracker.researchLevel) {
    case '10':
      numerator += 1
      break
    case 'Perfect':
      numerator += 3
  }

  return fraction(numerator, 4096)
}

export function getScarletVioletMassOutbreakOdds(huntTracker: HuntTracker): Fraction {
  const { count, shinyCharm, sparklingPowerLevel } = huntTracker

  let numerator = 1 + sparklingPowerLevel!
  if (shinyCharm) {
    numerator += 2
  }

  if (count >= 60) {
    numerator += 2
  } else if (count >= 30) {
    numerator += 1
  }

  return fraction(numerator, 4096)
}

export function getChainMethodDetails(huntTracker: HuntTracker): {
  currentChainsLabel: string
  chainsLabel: string
  oddsFunction: OddsFunction
} {
  switch (huntTracker.method) {
    case HuntingMethod.POKE_RADAR:
      return {
        currentChainsLabel: 'Encounters',
        chainsLabel: 'Chains',
        oddsFunction: getPokeRadarOdds
      }
    case HuntingMethod.SOS_BATTLE:
      return {
        currentChainsLabel: 'Allies',
        chainsLabel: 'Chains',
        oddsFunction: getSosBattleOdds
      }
    case HuntingMethod.CONSECUTIVE_FISHING:
      return {
        currentChainsLabel: 'Reels',
        chainsLabel: 'Chains',
        oddsFunction: getConsecutiveFishingOdds
      }
    case HuntingMethod.CATCH_COMBO:
      return {
        currentChainsLabel: 'Catches',
        chainsLabel: 'Chains',
        oddsFunction: getCatchComboOdds
      }
    default:
      return {
        currentChainsLabel: 'Encounters',
        chainsLabel: 'Chains',
        oddsFunction: getFullOdds
      }
  }
}

export function getStaticMethodDetails(huntTracker: HuntTracker): {
  label: string
  odds: Fraction
} {
  switch (huntTracker.method) {
    case HuntingMethod.ODD_EGG:
      return {
        label: 'Eggs',
        odds: fraction(14, 100)
      }
    case HuntingMethod.MASUDA_METHOD:
      return {
        label: 'Eggs',
        odds: getMasudaMethodOdds(huntTracker)
      }
    case HuntingMethod.FRIEND_SAFARI:
      return {
        label: 'Encounters',
        odds: getFriendSafariOdds(huntTracker)
      }
    case HuntingMethod.HIDDEN_POKEMON:
      return {
        label: 'Encounters',
        odds: getHiddenPokemonOdds()
      }
    default:
      return {
        label: 'Encounters',
        odds: getFullOdds(huntTracker)
      }
  }
}
