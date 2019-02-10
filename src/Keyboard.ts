import Pad from './Pad';
import DrumPad from './DrumPad';
import SamplerPad from './SamplerPad';
import { defaultDrumSamples } from './defaultPadSamples';


const mockKeys = [{
    keyCode: 97
}, {
    keyCode: 115
},{
    keyCode: 119
}
]

export default class Keyboard{

    padSet: any = {};

    // Initiliaze drum and sampler pads
    constructor(audioContext: AudioContext){
        
        for(let i = 0; i < 3; i++){    
            const drumPad: Pad = new DrumPad(defaultDrumSamples[i].songURL,this, defaultDrumSamples[i].keyCode, audioContext);
            const samplerPad: Pad = new SamplerPad(this, mockKeys[i].keyCode, audioContext)
            this.padSet[drumPad.getKeyCode()] = drumPad;
            this.padSet[samplerPad.getKeyCode()] = samplerPad;
        }
    }


     /**
    * Invoke Pad's play method if it has an associated key
    *
    * @public
    * @param {evt} evt
    * 
    **/
    captureWindowEvent(evt: KeyboardEvent): void{
        if(this.padSet[evt.keyCode]) this.padSet[evt.keyCode].play();
    }

    consolePads(){
        console.log(this.padSet);
    }


    /**
    * Sets or swaps a Pad in padSet
    *
    * @public
    * @param {Pad} pad
    * @param {number} keyCode - Previous keyCode of the pad
    * 
    **/
    setPad(pad: Pad, keyCode: number):void{

        delete this.padSet[keyCode];

        if (this.padSet[pad.getKeyCode()]){
            const occupyingPad = this.padSet[pad.getKeyCode()]
            occupyingPad.setKeyCode(keyCode);

            this.padSet[pad.getKeyCode()] = pad;
        }
        else{
            this.padSet[pad.getKeyCode()] = pad;
        }
    }


}
