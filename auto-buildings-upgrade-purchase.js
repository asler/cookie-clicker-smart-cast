class SmartPurchase {

  luckyMul = 7
  halfHour = 30 * 60
  isBuying = false

  get cps () {
    return Game.unbuffedCps
  }

  get data () {
    let o1 = Object.entries(CookieMonsterData.Objects1),
      o10 = Object.entries(CookieMonsterData.Objects10),
      u = Object.entries(CookieMonsterData.Upgrades)
    o1.forEach(([key, val]) => val.buyCount = 1)
    o10.forEach(([key, val]) => val.buyCount = 10)

    let all = [...o1, ...o10, ...u]
    let greenBlue = all.filter(([key, val]) => val.colour === 'Green' || val.colour === 'Blue')
    greenBlue.sort((a, b) => a[1].pp < b[1].pp ? -1 : 1)
    return greenBlue
  }

  constructor (props) {
    Game.registerHook('logic', () => {this.doUpgrade()})
  }

  doUpgrade () {
    if (Game.T % 5 !== 0) {
      return true
    }

    let [name, first] = this.data[0]
    let { buyBulk } = Game
    let price = first.price || Game.Upgrades[name]?.basePrice

    let isWizardTower = Game.Objects['Wizard tower'].amount >12

    if (!this.isBuying && first && (this.getLuckyBackedGoodsCookiePerCastAdded(first.bonus) < (Game.cookies - price) * .15 || !isWizardTower)) {
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
    return (this.cps + addCps) * this.halfHour * this.luckyMul
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