import Keyboard from './Keyboard';
import Pad from './Pad';


export default class SamplerPad extends Pad{ 


    constructor(keyboard: Keyboard, keyCode: number, audioContext: AudioContext){
        super(keyboard, keyCode, audioContext);          
    }

}