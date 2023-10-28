import { base } from '$app/paths';

export class Game {
  displayName: string;
  generation: number;
  imageFolder: string;
  iconFolder: string;
  pokemonFile: string;
  methodsFile: string;
  imageExtension: string;
  iconExtension: string;
  supportsShinyCharm: boolean;

  constructor(name: string,
              generation: number,
              imageFolder: string,
              iconFolder: string,
              pokemonFile: string,
              methodsFile: string,
              imageExtension: string,
              iconExtension: string,
              supportsShinyCharm?: boolean) {
    this.displayName = name
    this.generation = generation
    this.imageFolder = `${base}/images/${imageFolder}`
    this.iconFolder = `${base}/icons/${iconFolder}`
    this.pokemonFile = `${base}/pokemon/${pokemonFile}.pokemon.json`
    this.methodsFile = `${base}/methods/${methodsFile}.json`
    this.imageExtension = imageExtension;
    this.iconExtension = iconExtension;
    this.supportsShinyCharm = supportsShinyCharm || generation >= 5;
  }
}