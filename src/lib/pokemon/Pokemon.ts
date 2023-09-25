class Pokemon {
  displayName: string
  image: string
  shinyImage: string
  icon: string

  constructor(displayName: string);
  constructor(displayName: string, image?: string, shinyImage?: string, icon?: string) {
    this.displayName = displayName
    this.image = image ? image : displayName + '.gif'
    this.shinyImage = shinyImage ? shinyImage : displayName + '.shiny.gif'
    this.icon = icon ? icon : displayName + '.gif'
  }
}