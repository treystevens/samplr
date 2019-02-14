import Trigger from './Trigger';
import Pad from './Pad';
import Key from './Key';
import { hipHopDrumKit } from './samples/drumKitSamples';
import { electricPiano } from './samples/samplerSamples';

export default class Keyboard{
    
    triggerSet: any = {};
    private swapFlag: boolean = false;
    private refTrigger: Trigger;

    // Initiliaze drum and sampler Triggers
    constructor(audioContext: AudioContext){
        
        for(let i = 0; i < 13; i++){    
            const pad: Trigger = new Pad(audioContext, this, electricPiano[i].songURL, electricPiano[i].charCode);
            // const samplerTrigger: Trigger = new SamplerTrigger(this, elecPianoSamples[i].charCode, audioContext)
            this.triggerSet[pad.getCharCode()] = pad;
            // this.triggerSet[samplerTrigger.getCharCode()] = samplerTrigger;
        }
        

    }


     /**
    * Invoke Trigger's play method if it has an associated key
    *
    * @public
    * @param {evt} evt
    * 
    **/
    captureWindowEvent(evt: KeyboardEvent): void{

        if(this.swapFlag) {
            this.refTrigger.setCharCode(evt.charCode);       
            this.refTrigger = null;
            this.toggleSwapFlag();
            return; 
        }
        if(this.triggerSet[evt.charCode]) this.triggerSet[evt.charCode].play();
    }

    consoleTriggers(){
        console.log(this.triggerSet);
        // console.log(defaultDrumSamples)
    }


    /**
    * Sets or swaps a Trigger in triggerSet
    *
    * @public
    * @param {Trigger} trigger
    * @param {number} prevCharCode - Previous charCode of the Trigger
    * 
    **/
    setTrigger(trigger: Trigger, prevCharCode: number):void{
        
        delete this.triggerSet[prevCharCode];


        if (this.triggerSet[trigger.getCharCode()]){
            const occupyingTrigger: Trigger = this.triggerSet[trigger.getCharCode()];
            
            occupyingTrigger.setCharCode(prevCharCode);
            
            
            this.triggerSet[trigger.getCharCode()] = trigger;
            this.triggerSet[occupyingTrigger.getCharCode()] = occupyingTrigger;
            
        }
        else{
            this.triggerSet[trigger.getCharCode()] = trigger;
        }

    }

    setReferenceTrigger(trigger: Trigger): void{
        this.refTrigger = trigger;
        this.toggleSwapFlag();
    }

    toggleSwapFlag(): void{
        this.swapFlag ? this.swapFlag = false : this.swapFlag = true;
    }


}
