class SmartPurchase{

  luckyMul = 7

  constructor (props) {


    // check
  }

  getGreenBuilding(){

  }

  getBlueUpgrade(){

  }

  doUpgrade(){

  }

  getLuckyBackedGoodsCps(){

  }

  getLuckyBackedGoodsCpsAdded(addCps){

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