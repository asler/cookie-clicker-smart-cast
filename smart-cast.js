var smartCast
if (typeof CCSE == 'undefined') {
  Game.LoadMod('https://klattmose.github.io/CookieClicker/CCSE.js')
}

class SmartCast {

  config = {
    minBuffCpsMultiplayer: 3,
    failChanceReduce: .15,
    doubleCastMultiplayer: 10
  }

  constructor () {
    Game.registerHook('logic', () => this.update())
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
      if (CCSE.config.OtherMods.SmartCast) {
        this.config = CCSE.config.OtherMods.SmartCast
      }
    })
  }

  setSaver () {
    CCSE.customSave.push(() => this.save())
  }

  save () {
    CCSE.config.OtherMods.SmartCast = this.config
  }

  get isManaMax () {
    let { minigame } = Game.ObjectsById[7]
    return minigame.magic === minigame.magicM
  }

  cast () {
    //M.magicPS=Math.max(0.002,Math.pow(M.magic/Math.max(M.magicM,100),0.5))*0.002;
    let spellParams = {
      failChanceAdd: -this.config.failChanceReduce
    }
    let { minigame } = Game.ObjectsById[7]

    if (this.isManaMax && this.buffsMultiplayer >= this.config.minBuffCpsMultiplayer) {
      minigame.castSpell(minigame.spellsById[0], spellParams)
    }

    // if (this.buffsMultiplayer >= this.config.doubleCastMultiplayer) {
    //   minigame.castSpell(minigame.spellsById[0], spellParams)
    // }
  }

  eatGoldenCookie () {
    if (Game.shimmers.length) {
      [...Game.shimmers].map((s) => s.pop())
    }
  }

  update () {
    if (Game.T % 5 === 0) {
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