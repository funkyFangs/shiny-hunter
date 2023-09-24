class Pokemon {
  name: string
  image: string
  shinyImage: string
  icon: string

  constructor(name: string);
  constructor(name: string, image?: string, shinyImage?: string, icon?: string) {
    this.name = name
    this.image = image ? image : name + '.gif'
    this.shinyImage = shinyImage ? shinyImage : name + '.shiny.gif'
    this.icon = icon ? icon : name + '.gif'
  }
}