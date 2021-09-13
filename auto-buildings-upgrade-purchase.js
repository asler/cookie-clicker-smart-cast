class SmartPurchase {

  luckyMul = 7
  halfHour = 30 * 60
  isBuying = false
  wizardTowerMaxLevel = 7

  get cps () {
    return Game.unbuffedCps
  }

  get data () {
    let o1 = Object.entries(CookieMonsterData.Objects1),
      o10 = Object.entries(CookieMonsterData.Objects10),
      o100 = Object.entries(CookieMonsterData.Objects100),
      u = Object.entries(CookieMonsterData.Upgrades)
    o1.forEach(([key, val]) => val.buyCount = 1)
    o10.forEach(([key, val]) => val.buyCount = 10)
    o100.forEach(([key, val]) => val.buyCount = 100)

    let all = [...o1, ...o10, ...o100, ...u]

    all = all.filter(([key, val]) => key !== 'Wizard tower' || val.bought < this.wizardTowerMaxLevel)

    let greenBlue = all.filter(([key, val]) => ['Blue', 'Green', 'Yellow'].indexOf(val.colour) >= 0)
    greenBlue.sort((a, b) => a[1].pp < b[1].pp ? -1 : 1)
    return greenBlue
  }

  constructor (props) {
    Game.heralds = 100
    Game.registerHook('logic', () => {this.doUpgrade()})
  }

  doUpgrade () {
    if (Game.T % 5 !== 0) {
      return true
    }

    if (!this.data.length) {
      return
    }

    let [name, first] = this.data[0]
    let { buyBulk } = Game
    let price = first.price || Game.Upgrades[name]?.basePrice

    let serendipity = Game.Upgrades['Serendipity']
    let luckyDay = Game.Upgrades['Lucky day']

    if (!serendipity.bought && Game.T % (30 * 60) === 0) {
      !luckyDay.bought && luckyDay.buy()
      !serendipity.bought && serendipity.buy()
    }

    if (!this.isBuying && first && (this.getLuckyBackedGoodsCookiePerCastAdded(first.bonus) < (Game.cookies - price) * .15 || !serendipity.bought)) {
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