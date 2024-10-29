export enum HuntingMethod {
  FULL_ODDS = 'Full Odds',
  ODD_EGG = 'Odd Egg',
  MASUDA_METHOD = 'Masuda Method',
  POKE_RADAR = 'Poké Radar',
  FRIEND_SAFARI = 'Friend Safari',
  CONSECUTIVE_FISHING = 'Consecutive Fishing',
  HIDDEN_POKEMON = 'Hidden Pokemon',
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

export function getToolTip(huntingMethod: HuntingMethod) {
  switch (huntingMethod) {
    case HuntingMethod.FULL_ODDS:
      return 'This is the default method of shiny hunting with the default odds of finding a shiny Pokémon.'
    case HuntingMethod.ODD_EGG:
      return 'The Odd Egg in Pokémon Crystal has a 14% chance of hatching as a shiny Pokémon as opposed to the default odds.'
    case HuntingMethod.MASUDA_METHOD:
      return 'Eggs produced by two Pokémon from different regions have a significantly increased chance of being shiny.'
    case HuntingMethod.POKE_RADAR:
      return 'The Poké Radar provides an increased chance of a shiny Pokémon with consecutive encounters of the same species.'
    case HuntingMethod.FRIEND_SAFARI:
      return 'Pokémon found in the Friend Safari have an increased chance of being shiny.'
    case HuntingMethod.CONSECUTIVE_FISHING:
      return 'When fishing in the same area, reeling in the same Pokémon consecutively increases the likelihood of it being shiny.'
    case HuntingMethod.HIDDEN_POKEMON:
      return 'In Omega Ruby and Alpha Sapphire, Pokémon will partially reveal themselves in certain tiles. These Pokémon will have an increased chance of being shiny depending on their Search Level in the Pokédex.'
    case HuntingMethod.SOS_BATTLE:
      return 'In an SOS battle, the chance of an ally Pokémon being shiny increases with each consecutive ally called in.'
    case HuntingMethod.ULTRA_WARP_RIDE:
      return 'In the Ultra Warp Ride in Ultra Sun and Ultra Moon, the chance of finding a shiny Pokémon increases with the distance travelled and the rarity of the ring.'
  }
}

export const CHAIN_HUNTING_METHODS = new Set([
  HuntingMethod.POKE_RADAR,
  HuntingMethod.CONSECUTIVE_FISHING,
  HuntingMethod.SOS_BATTLE,
  HuntingMethod.ULTRA_WARP_RIDE
])
