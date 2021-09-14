class SmartPurchase {
  config = {
    luckyMul: 7,
    minPP: 1,
    minPP10: 100,
    wizardTowerMaxLevel: 2
  }

  halfHour = 30 * 60
  isBuying = false

  ignoreUpgrades = ['Golden switch [off]', 'Golden switch [on]', 'One mind']

  get cps () {
    return Game.unbuffedCps
  }

  get objectsList () {
    let o1 = Object.entries(CookieMonsterData.Objects1),
      o10 = Object.entries(CookieMonsterData.Objects10),
      o100 = Object.entries(CookieMonsterData.Objects100),
      u = Object.entries(CookieMonsterData.Upgrades)
    o1.forEach(([key, val]) => val.buyCount = 1)
    o10.forEach(([key, val]) => val.buyCount = 10)
    o100.forEach(([key, val]) => val.buyCount = 100)

    let all = [...o1, ...o10, ...o100, ...u]

    all = all.filter(([key, val]) => key !== 'Wizard tower' || val.bought < this.config.wizardTowerMaxLevel)
    all = all.filter(([key, val]) => this.ignoreUpgrades.indexOf(key) === -1)

    let greenBlue = all.filter(([key, val]) => ['Blue', 'Green', 'Yellow', 'Orange'].indexOf(val.colour) >= 0)
    greenBlue.sort((a, b) => a[1].pp < b[1].pp ? -1 : 1)
    return greenBlue
  }

  constructor (props) {
    Game.heralds = 100
    Game.registerHook('logic', () => {this.doUpgrade()})
  }

  doUpgrade () {
    let objectsList = this.objectsList
    if (!objectsList.length) {
      return
    }
    let x1 = objectsList.filter(o => o.buyCount === 1)
    let x10 = objectsList.filter(o => o.buyCount === 10)

    let object = x10.length && x10[0][1].pp < this.config.minPP10 ? x10[0] : objectsList[0]

    let [name, first] = object
    let { buyBulk } = Game
    let price = first.price || Game.Upgrades[name]?.basePrice

    let serendipity = Game.Upgrades['Serendipity']
    let luckyDay = Game.Upgrades['Lucky day']

    if (!serendipity.bought && Game.T % (30 * 60) === 0) {
      !luckyDay.bought && luckyDay.buy()
      !serendipity.bought && serendipity.buy()
    }

    let isX1minPP = first.pp < this.config.minPP
    let isX10minPP = x10.length && x10[0] === object

    if (!this.isBuying && first && (this.getLuckyBackedGoodsCookiePerCastAdded(first.bonus) < (Game.cookies - price) * .15 || !serendipity.bought || isX1minPP || isX10minPP)) {
      console.log(`buy '${name}' count:${first.buyCount || 1}`)
      if (Game.Objects[name]) {
        Game.buyBulk = first.buyCount
        this.isBuying = true
        setTimeout(() => {
          Game.Objects[name].buy()
          Game.buyBulk = buyBulk
          this.isBuying = false
        }, 1000)

      } else if (Game.Upgrades[name]) {
        Game.Upgrades[name].buy()
      }

    }
  }

  getLuckyBackedGoodsCookiePerCastAdded (addCps) {
    return (this.cps + addCps / this.buffsMultiplayer) * this.halfHour * this.config.luckyMul
  }

  get buffsMultiplayer () {
    return Object.entries(Game.buffs).reduce((mult, [key, buff]) => mult * buff.multCpS, 1)
  }

}

var smartPurchase
if (typeof CCSE == 'undefined') {
  Game.LoadMod('https://klattmose.github.io/CookieClicker/CCSE.js')
}

if (!smartPurchase) {
  if (CCSE && CCSE.isLoaded) {

    smartPurchase = new SmartPurchase()

  } else {

    if (!CCSE) {
      var CCSE = {}
    }

    if (!CCSE.postLoadHooks) {
      CCSE.postLoadHooks = []
    }

    CCSE.postLoadHooks.push(() => {
      smartPurchase = new SmartPurchase()
    })
  }
}