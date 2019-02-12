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
    private swapFlag: boolean = false;
    private refPad: Pad;

    // Initiliaze drum and sampler pads
    constructor(audioContext: AudioContext){
        
        for(let i = 0; i < 3; i++){    
            const drumPad: Pad = new DrumPad(defaultDrumSamples[i].songURL,this, defaultDrumSamples[i].keyCode, audioContext);
            // const samplerPad: Pad = new SamplerPad(this, mockKeys[i].keyCode, audioContext)
            this.padSet[drumPad.getKeyCode()] = drumPad;
            // this.padSet[samplerPad.getKeyCode()] = samplerPad;
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
        if(this.swapFlag) {
            this.refPad.setKeyCode(evt.keyCode);       
            this.refPad = null;
            this.toggleSwapFlag();
            return; 
        }
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
    * @param {number} prevKeyCode - Previous keyCode of the pad
    * 
    **/
    setPad(pad: Pad, prevKeyCode: number):void{
        
        delete this.padSet[prevKeyCode];


        if (this.padSet[pad.getKeyCode()]){
            const occupyingPad: Pad = this.padSet[pad.getKeyCode()];
            
            occupyingPad.setKeyCode(prevKeyCode);
            
            
            this.padSet[pad.getKeyCode()] = pad;
            this.padSet[occupyingPad.getKeyCode()] = occupyingPad;

            
            
        }
        else{
            this.padSet[pad.getKeyCode()] = pad;
        }

    }

    setReferencePad(pad: Pad): void{
        this.refPad = pad;
        this.toggleSwapFlag();
    }

    toggleSwapFlag(): void{
        this.swapFlag ? this.swapFlag = false : this.swapFlag = true;
    }


}
