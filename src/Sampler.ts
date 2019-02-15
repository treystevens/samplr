
import Trigger from './Trigger';
import Pad from './Pad';
import Key from './Key';
import { hipHopDrumKit } from './samples/drumKitSamples';
import { electricPiano } from './samples/samplerSamples';


export default class Sampler{

    
    private swapFlag: boolean = false;
    private refTrigger: Trigger;

    private audioContext: AudioContext;
    private audioBuffer: AudioBuffer;

    private triggerSet: any = {};
    private padSet: any = {};
    private keySet: any = {};

    constructor(audioContext: AudioContext){

        this.audioContext = audioContext;
        this.initKeys();
        this.initPads();
        this.i = 0;


        window.addEventListener('keypress', (evt) => {
            this.captureWindowEvent(evt);        
        })
    }


    /**
    * Invoke Trigger's play method if it has an associated key
    *
    * @public
    * @param {evt} evt
    * 
    **/
    captureWindowEvent(evt: KeyboardEvent): void{

        if(this.swapFlag && !this.keySet[evt.charCode]) {
            this.refTrigger.setCharCode(evt.charCode);       
            this.refTrigger = null;
            this.toggleSwapFlag();
            return; 
        }
        if(this.padSet[evt.charCode]) this.padSet[evt.charCode].play();
        if(this.keySet[evt.charCode]) this.keySet[evt.charCode].play();
    }

    consoleTriggers(){
        console.log(this.padSet);
        // console.log(defaultDrumSamples)
    }


    /**
    * Sets or swaps a Trigger in padSet
    *
    * @public
    * @param {Trigger} trigger
    * @param {number} prevCharCode - Previous charCode of the Trigger
    * 
    **/
    setTrigger(trigger: Trigger, prevCharCode: number):void{
        
        delete this.padSet[prevCharCode];


        if (this.padSet[trigger.getCharCode()]){
            const occupyingTrigger: Trigger = this.padSet[trigger.getCharCode()];
            
            occupyingTrigger.setCharCode(prevCharCode);
            
            
            this.padSet[trigger.getCharCode()] = trigger;
            this.padSet[occupyingTrigger.getCharCode()] = occupyingTrigger;
            
        }
        else{
            this.padSet[trigger.getCharCode()] = trigger;
        }

    }

    setReferenceTrigger(trigger: Trigger): void{
        this.refTrigger = trigger;
        this.toggleSwapFlag();
    }

    toggleSwapFlag(): void{
        this.swapFlag ? this.swapFlag = false : this.swapFlag = true;
    }


    initPads(){
        for(let i = 0; i < 8; i++){    
            const pad: Pad = new Pad(this.audioContext, this, hipHopDrumKit[i].charCode, hipHopDrumKit[i].songURL,);
            this.padSet[pad.getCharCode()] = pad;
        }
    }

    initKeys(){
        for(let i = 0; i < 13; i++){    
            const key: Key = new Key(this.audioContext, this, electricPiano[i].charCode, electricPiano[i].songURL);

            this.keySet[key.getCharCode()] = key;
        }
    }

}


