import { DiceD10 } from "threejs-dice";

export default class RandomDice extends DiceD10 {

  constructor(options) {
    super(options)
    
    this.stableCounter = 0 //check if still moving

    this.create()
  }

  // check = () => {
  //   if(this.isFinished()) {
  //     this.stableCounter ++
      
  //     if(this.stableCounter === 50) {

  //     }
  //   }
  // }

  // dispatchResult(callback) {

  // }


}