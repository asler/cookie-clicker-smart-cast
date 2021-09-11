var smartCast
if (typeof CCSE == 'undefined') {
  Game.LoadMod('https://klattmose.github.io/CookieClicker/CCSE.js')
}

class SmartCast {

  config = {
    minBuffCpsMultiplayer: 3,
    failChanceReduce: 0
  }

  constructor () {
    if (Game.T % 5 === 0) {
      //add some mana
    }
    this.load()
  }

  get isClot () {
    return Game.buffs.Clot
  }

  get buffsMultiplayer () {
    return Object.entries(Game.buffs).reduce((mult, [key, buff]) => mult * buff.multCpS, 1)
  }

  load () {
    CCSE.customLoad.push(() => {
      if (CCSE.save.SmartCast.MyMod) {
        this.config = CCSE.save.OtherMods.SmartCast
      }
    })
  }

  setSaver () {
    CCSE.customSave.push(() => this.save())
  }

  save () {
    CCSE.save.OtherMods.SmartCast = this.config
  }

  get isManaMax () {
    let { minigame } = Game.ObjectsById[7]
    return minigame.magic === minigame.magicM
  }

  cast () {
    if (this.isManaMax &&  this.buffsMultiplayer >= this.config.minBuffCpsMultiplayer) {
      let { minigame } = Game.ObjectsById[7]
      let spellParams = {
        failChanceAdd: -this.config.failChanceReduce
      }
      minigame.castSpell(minigame.spellsById[0], spellParams)
    }
  }

  eatGoldenCookie () {
    let cookie = document.querySelector('.shimmer')
    if (cookie) {
      cookie.dispatchEvent(new Event('click'))
    }
  }

  update(){
    if(Game.T % 5 === 0){
      this.eatGoldenCookie()
      this.cast()
    }
  }

}

if (!smartCast) {
  if (CCSE && CCSE.isLoaded) {

    smartCast = new SmartCast()

  } else {

    if (!CCSE) {
      var CCSE = {}
    }

    if (!CCSE.postLoadHooks) {
      CCSE.postLoadHooks = []
    }

    CCSE.postLoadHooks.push(() => {
      smartCast = new SmartCast()
    })
  }
}