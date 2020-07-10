import {DiceD10} from 'threejs-dice';

export default class OwnersForumDice extends DiceD10 {
    constructor(options) {
        super(options);
        this.faceTexts = [' ', '1', '2', '3', '4', '5', '6.', '7', '8',
            '9.', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'
        ];
        this.create();
    }
    getUpsideValue() {
        return super.getUpsideValue() + 1; // we changed faceTexts to start counting with 1
    }
}