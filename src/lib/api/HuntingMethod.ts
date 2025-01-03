export enum HuntingMethod {
  FULL_ODDS = 'Full Odds',
  ODD_EGG = 'Odd Egg',
  MASUDA_METHOD = 'Masuda Method',
  POKE_RADAR = 'Poké Radar',
  FRIEND_SAFARI = 'Friend Safari',
  CONSECUTIVE_FISHING = 'Consecutive Fishing',
  HIDDEN_POKEMON = 'Hidden Pokémon',
  SOS_BATTLE = 'SOS Battle',
  ULTRA_WARP_RIDE = 'Ultra Warp Ride',
  CATCH_COMBO = 'Catch Combo',
  BRILLIANT_POKEMON = 'Brilliant Pokémon',
  MASS_OUTBREAK = 'Mass Outbreak'
}

export function getSupportedHuntingMethods(
  generation: number,
  versionGroup: string,
  version: string
): HuntingMethod[] {
  switch (generation) {
    case 2:
      if (version == 'crystal') {
        return [HuntingMethod.FULL_ODDS, HuntingMethod.ODD_EGG]
      }
      break
    case 4:
      if (versionGroup != 'heartgold-soulsilver') {
        return [HuntingMethod.FULL_ODDS, HuntingMethod.MASUDA_METHOD, HuntingMethod.POKE_RADAR]
      } else {
        return [HuntingMethod.FULL_ODDS, HuntingMethod.MASUDA_METHOD]
      }
    case 5:
      return [HuntingMethod.FULL_ODDS, HuntingMethod.MASUDA_METHOD]
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
      } else if (versionGroup == 'lets-go-pikachu-lets-go-eevee') {
        return [HuntingMethod.FULL_ODDS, HuntingMethod.CATCH_COMBO]
      } else {
        return [HuntingMethod.FULL_ODDS, HuntingMethod.MASUDA_METHOD, HuntingMethod.SOS_BATTLE]
      }
    case 8:
      if (versionGroup === 'sword-shield') {
        return [
          HuntingMethod.FULL_ODDS,
          HuntingMethod.MASUDA_METHOD,
          HuntingMethod.BRILLIANT_POKEMON
        ]
      } else if (version === 'legends-arceus') {
        return [HuntingMethod.FULL_ODDS, HuntingMethod.MASS_OUTBREAK]
      } else {
        return [HuntingMethod.FULL_ODDS, HuntingMethod.MASUDA_METHOD]
      }
    case 9:
      return [HuntingMethod.FULL_ODDS, HuntingMethod.MASUDA_METHOD, HuntingMethod.MASS_OUTBREAK]
  }

  return [HuntingMethod.FULL_ODDS]
}

export const CHAIN_HUNTING_METHODS = new Set([
  HuntingMethod.POKE_RADAR,
  HuntingMethod.CONSECUTIVE_FISHING,
  HuntingMethod.SOS_BATTLE,
  HuntingMethod.ULTRA_WARP_RIDE,
  HuntingMethod.CATCH_COMBO
])
