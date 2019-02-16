
import Trigger from './Trigger';
import Pad from './Pad';
import Key from './Key';
import { hipHopDrumKit } from './samples/drumKitSamples';
import { electricPiano } from './samples/samplerSamples';
import { wavesurfer } from './Trigger';

enum validPadKeys{
    z = 1, 
    x,
    c,
    v,
    b,
    n,
    m, 
    ','
}

export default class Sampler{

    
    private swapFlag: boolean = false;
    private refTrigger: Trigger;
    private audioContext: AudioContext;
    private audioBuffer: AudioBuffer;
    private triggerSet: any = {};
    private activeKey: Trigger;

    constructor(audioContext: AudioContext){

        this.audioContext = audioContext;
        this.initKeys();
        this.initPads();
        this.activeKey = this.triggerSet['a'];
        
        window.addEventListener('keydown', (evt) => {
            this.captureWindowEvent(evt);        
        });
    }

    
    /**
    * Invoke Trigger's play method if it has an associated key
    *
    * @public
    * @param {evt} evt
    * 
    **/
    captureWindowEvent(evt: KeyboardEvent): void{
        
        if(this.swapFlag && validPadKeys[evt.key]) {
            this.refTrigger.setKey(evt.key);       
            this.refTrigger = null;
            this.toggleSwapFlag();
            return; 
        }
        this.swapFlag = false;
        
        if(this.triggerSet[evt.key]) {
            this.activeKey.setActive(false);
            this.activeKey = this.triggerSet[evt.key];
            this.triggerSet[evt.key].setActive(true)
            this.triggerSet[evt.key].play();
            return;
        }

        // Stop sound when played
        if(evt.key === 'Backspace'){
            this.activeKey.stopSound();
        }
    }

    initPads(){
        for(let i = 0; i < 8; i++){    
            const pad: Pad = new Pad(this.audioContext, this, hipHopDrumKit[i].key, hipHopDrumKit[i].songURL,);
            this.triggerSet[pad.getKey()] = pad;
        }
    }

    initKeys(){
        for(let i = 0; i < 13; i++){    
            const key: Key = new Key(this.audioContext, this, electricPiano[i].key, electricPiano[i].songURL);

            this.triggerSet[key.getKey()] = key;
        }
    }

    /**
    * Sets or swaps a Trigger in triggerSet
    *
    * @public
    * @param {Trigger} trigger
    * @param {number} prevKey - Previous key of the Trigger
    * 
    **/
    setTrigger(trigger: Trigger, prevKey: string):void{
        
        delete this.triggerSet[prevKey];

        if (this.triggerSet[trigger.getKey()]){

            const occupyingTrigger: Trigger = this.triggerSet[trigger.getKey()];
            occupyingTrigger.setKey(prevKey);
            
            this.triggerSet[trigger.getKey()] = trigger;
            this.triggerSet[occupyingTrigger.getKey()] = occupyingTrigger;
        }
        else{
            this.triggerSet[trigger.getKey()] = trigger;
        }
    }

    setReferenceTrigger(trigger: Trigger): void{
        this.refTrigger = trigger;
        this.toggleSwapFlag();
    }

    toggleSwapFlag(): void{
        this.swapFlag ? this.swapFlag = false : this.swapFlag = true;
    }

    decodeBuffer(evt: Event){

        const _this = this;

        const fileReader = new FileReader();

        fileReader.readAsArrayBuffer(evt.target.files[0]);
        fileReader.onload = function(){
            
            const audioBuffer = _this.audioContext.decodeAudioData(fileReader.result as any);
    
            audioBuffer.then((res: AudioBuffer) => {
                for(let trigger in _this.triggerSet){
                    if(!validPadKeys[trigger]){
                        _this.triggerSet[trigger].setAudioBuffer(res);
                        _this.triggerSet[trigger].setUserLoadedAudioBlob(evt.target.files[0]);
                    }
                }                
            })
            .catch((err: Error) => {
                console.log(err);
            })
        }
    }
}


