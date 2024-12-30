export enum HuntingMethod {
  FULL_ODDS = 'Full Odds',
  ODD_EGG = 'Odd Egg',
  MASUDA_METHOD = 'Masuda Method',
  POKE_RADAR = 'Poké Radar',
  FRIEND_SAFARI = 'Friend Safari',
  CONSECUTIVE_FISHING = 'Consecutive Fishing',
  HIDDEN_POKEMON = 'Hidden Pokémon',
  SOS_BATTLE = 'SOS Battle',
  ULTRA_WARP_RIDE = 'Ultra Warp Ride'
}

export function getSupportedHuntingMethods(
  generation: number,
  versionGroup: string,
  version: string
): HuntingMethod[] {
  switch (generation) {
    case 2:
      // The Odd Egg is only available in Crystal
      if (version == 'crystal') {
        return [HuntingMethod.FULL_ODDS, HuntingMethod.ODD_EGG]
      } else {
        return [HuntingMethod.FULL_ODDS]
      }
    case 3:
      return [HuntingMethod.FULL_ODDS]
    case 4:
      // Poke Radar is not available in HeartGold & SoulSilver
      if (versionGroup != 'heartgold-soulsilver') {
        return [HuntingMethod.FULL_ODDS, HuntingMethod.MASUDA_METHOD, HuntingMethod.POKE_RADAR]
      }
      break
    case 6:
      if (versionGroup == 'x-y') {
        return [
          HuntingMethod.FULL_ODDS,
          HuntingMethod.MASUDA_METHOD,
          HuntingMethod.POKE_RADAR,
          HuntingMethod.FRIEND_SAFARI,
          HuntingMethod.CONSECUTIVE_FISHING
        ]
      } else {
        return [
          HuntingMethod.FULL_ODDS,
          HuntingMethod.MASUDA_METHOD,
          HuntingMethod.CONSECUTIVE_FISHING,
          HuntingMethod.HIDDEN_POKEMON
        ]
      }
    case 7:
      if (versionGroup == 'ultra-sun-ultra-moon') {
        return [
          HuntingMethod.FULL_ODDS,
          HuntingMethod.MASUDA_METHOD,
          HuntingMethod.SOS_BATTLE,
          HuntingMethod.ULTRA_WARP_RIDE
        ]
      } else {
        return [HuntingMethod.FULL_ODDS, HuntingMethod.MASUDA_METHOD, HuntingMethod.SOS_BATTLE]
      }
  }

  return [HuntingMethod.FULL_ODDS, HuntingMethod.MASUDA_METHOD]
}

export const CHAIN_HUNTING_METHODS = new Set([
  HuntingMethod.POKE_RADAR,
  HuntingMethod.CONSECUTIVE_FISHING,
  HuntingMethod.SOS_BATTLE,
  HuntingMethod.ULTRA_WARP_RIDE
])
