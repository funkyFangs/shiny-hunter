export class Pokemon {
  displayName: string
  image: string
  shinyImage: string
  icon: string
  variants: Variant[]

  constructor(displayName: string, image?: string, shinyImage?: string, icon?: string, variants?: Variant[]) {
    this.displayName = displayName
    this.image = image ? image : displayName + '.png'
    this.shinyImage = shinyImage ? shinyImage : displayName + '.shiny.png'
    this.icon = icon ? icon : displayName + '.gif'
    this.variants = variants ? variants : []
  }
}

export class Variant {
  displayName: string
  image: string
  shinyImage: string
  icon: string

  constructor(displayName: string, image?: string, shinyImage?: string, icon?: string) {
    this.displayName = displayName
    this.image = image ? image : displayName + '.png'
    this.shinyImage = shinyImage ? shinyImage : displayName + '.shiny.png'
    this.icon = icon ? icon : displayName + '.gif'
  }
}