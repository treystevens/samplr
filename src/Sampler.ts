
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

    // private triggerSet: any = {};
    private padSet: any = {};
    private keySet: any = {};

    constructor(audioContext: AudioContext){

        this.audioContext = audioContext;
        this.initKeys();
        this.initPads();

        window.addEventListener('keydown', (evt) => {
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

        if(this.swapFlag && !this.keySet[evt.key]) {
            this.refTrigger.setKey(evt.key);       
            this.refTrigger = null;
            this.toggleSwapFlag();
            return; 
        }
        if(this.padSet[evt.key]) this.padSet[evt.key].play();
        if(this.keySet[evt.key]) this.keySet[evt.key].play();
    }


    /**
    * Sets or swaps a Trigger in padSet
    *
    * @public
    * @param {Trigger} trigger
    * @param {number} prevKey - Previous key of the Trigger
    * 
    **/
    setTrigger(trigger: Trigger, prevKey: string):void{
        
        delete this.padSet[prevKey];


        if (this.padSet[trigger.getKey()]){
            const occupyingTrigger: Trigger = this.padSet[trigger.getKey()];
            
            occupyingTrigger.setKey(prevKey);
            
            
            this.padSet[trigger.getKey()] = trigger;
            this.padSet[occupyingTrigger.getKey()] = occupyingTrigger;
            
        }
        else{
            this.padSet[trigger.getKey()] = trigger;
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
            const pad: Pad = new Pad(this.audioContext, this, hipHopDrumKit[i].key, hipHopDrumKit[i].songURL,);
            this.padSet[pad.getKey()] = pad;
        }
    }

    initKeys(){
        for(let i = 0; i < 13; i++){    
            const key: Key = new Key(this.audioContext, this, electricPiano[i].key, electricPiano[i].songURL);

            this.keySet[key.getKey()] = key;
        }
    }

}


