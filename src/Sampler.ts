
import Trigger from './Trigger';
import Pad from './Pad';
import Key from './Key';
import { hiphopKit, trapKit, houseKit, liveKit, africanKit } from './samples/drumKitSamples';
import { electricPiano, grandPiano, guitar, bass, moogBass, organ, horns } from './samples/samplerSamples';
import { iOS, wavesurfer } from './app';
import Slider from './Slider'

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

    private activeKey: Trigger;
    private audioBuffer: AudioBuffer;
    private audioContext: AudioContext;
    private refTrigger: Trigger;
    private slider: Slider
    private swapFlag: boolean = false;
    private triggerBuffer: Array<Trigger>
    private triggerBufferCount: number
    private triggerSet: any = {};

    constructor(audioContext: AudioContext){

        this.audioContext = audioContext;
        this.triggerBuffer = [];
        this.triggerBufferCount = 0;
        this.initKeys();
        this.initPads();
        this.activeKey = this.triggerSet['a'];
        this.slider = new Slider();
        this.initSlidersForTriggers();

        
        window.addEventListener('keydown', (evt) => {
            this.captureWindowEvent(evt);        
        });

        window.addEventListener('keyup', (evt) => {
            if(this.triggerSet[evt.key]) {
                this.triggerSet[evt.key].removeActiveState();
                return;
            }
            if(document.querySelector('.audio-tasks__stop').classList.contains('highlight')){
                document.querySelector('.audio-tasks__stop').classList.remove('highlight');
            }
        })
        

        if(iOS) {
            window.addEventListener('touchstart', (evt: any) => {
                if(evt.target.classList.contains('trigger')){
                    this.tapSound(evt);
                }
            }, false);
        }
        else {
            window.addEventListener('click', (evt: any) => {
                if(evt.target.classList.contains('trigger')){
                    this.tapSound(evt);
                }
            }, false)
        }
    }
    
    setActiveKey(t: Trigger){
        this.activeKey = t;
    }

    /**
    * Invoke Trigger's play method if it has an associated key
    *
    * Check if user would like to swap pad keys. Must be a pad
    * 
    * @public
    * @param {evt} evt
    * 
    **/
    captureWindowEvent(evt: KeyboardEvent): void{
        
        if(this.swapFlag && validPadKeys[(evt.key as any)] && isNaN(Number(evt.key))){
            this.removeModal();
            this.refTrigger.setKey(evt.key);       
            this.refTrigger = null;
            this.toggleSwapFlag();
            return; 
        }
        if(this.swapFlag){
            this.swapFlag = false;
            this.removeModal();
            return;
        }
        if(this.triggerSet[evt.key]) {
            const tappedTrigger = this.triggerSet[evt.key]
            tappedTrigger.addActiveState();
            this.activeKey.setActive(false);
            this.activeKey = tappedTrigger;
            this.slider.setActiveTrigger(tappedTrigger);
            tappedTrigger.setActive(true);
            tappedTrigger.play();
            this.loadTriggerBuffer(tappedTrigger)
            return;
        }

        // Stop sound when played
        if(evt.key === 'Shift'){
            document.querySelector('.audio-tasks__stop').classList.add('highlight');
            this.stopSounds();
        }
    }

    tapSound(evt: any){

            const key = evt.target.dataset.key;
            const tappedTrigger = this.triggerSet[key];
            this.activeKey.setActive(false);
            this.activeKey = tappedTrigger;
            this.slider.setActiveTrigger(tappedTrigger);
            tappedTrigger.setActive(true);
            tappedTrigger.play();
            this.loadTriggerBuffer(tappedTrigger)
    }


    stopSounds(){
        for(let trigger in this.triggerSet){
            this.triggerSet[trigger].stopSound();
        }
    }

    loadTriggerBuffer(t: Trigger){
        if(this.triggerBufferCount > 15) this.triggerBufferCount = 0;

        this.triggerBuffer[this.triggerBufferCount] = t;
        this.triggerBufferCount++
    }

    initPads(){
        for(let i = 0; i < 8; i++){    
            const pad: Pad = new Pad(this.audioContext, this, hiphopKit[i].key, hiphopKit[i].url,);
            this.triggerSet[pad.getKey()] = pad;
        }
    }

    initKeys(){
        for(let i = 0; i < 13; i++){    
            const key: Key = new Key(this.audioContext, this, electricPiano[i].key, electricPiano[i].url);

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
        
        delete this.triggerSet[prevKey]

        if (this.triggerSet[trigger.getKey()]){

            // Get the Trigger that has the key we want to swap to and swap its key to prevKey
            const swapKeyToTrigger: Trigger = this.triggerSet[trigger.getKey()];
            swapKeyToTrigger.setKey(prevKey);
                
            // Set triggerSet to point correctly to swapped keys
            this.triggerSet[trigger.getKey()] = trigger;
            this.triggerSet[swapKeyToTrigger.getKey()] = swapKeyToTrigger;

            // Swap data attributes on Trigger elements
            const swapKeyFromTriggerElement = document.querySelector(`[data-key=${prevKey}]`)
            const swapKeyToTriggerElement = document.querySelector(`[data-key=${trigger.getKey()}]`)
            
            swapKeyFromTriggerElement.setAttribute('data-key', `${prevKey}`)
            swapKeyToTriggerElement.setAttribute('data-key', `${trigger.getKey()}`)
        }
        else{
            this.triggerSet[trigger.getKey()] = trigger;
        }
    }

    setReferenceTrigger(trigger: Trigger): void{
        this.refTrigger = trigger;
        this.toggleSwapFlag();
    }

    removeReferenceTrigger(): void{
        this.refTrigger = null;
        this.toggleSwapFlag();
    }

    toggleSwapFlag(): void{
        this.swapFlag ? this.swapFlag = false : this.swapFlag = true;
    }

    decodeBuffer(evt: any){

        const _this = this;
        const fileReader = new FileReader();

        fileReader.readAsArrayBuffer(evt.target.files[0]);
        fileReader.onload = function(){
            
            // !!! Safari only supports callback syntax of decodeAudioData
            _this.audioContext.decodeAudioData((fileReader.result as any), function(buffer: AudioBuffer){
                _this.audioBuffer = buffer;
                wavesurfer.loadBlob(evt.target.files[0])

                for(let trigger in _this.triggerSet){
                    if(!validPadKeys[(trigger as any)]){
                        _this.triggerSet[trigger].setAudioBuffer(buffer);
                        _this.triggerSet[trigger].setUserLoadedAudioBlob(evt.target.files[0]);
                    }
                }           
            }, 
              function(err: Error){
                console.log(err);
            })
        }
    }

    loadPads(drumKit: string){

        let load;

        switch (drumKit) {
            case 'hip-hop':
                load = hiphopKit;
                break;
            case 'house':
                load = houseKit;
                break;
            case 'live':
                load = liveKit;
                break;
            case 'african':
                load = africanKit;
                break;
            case 'trap':
                load = trapKit;
                break;
            default:
                load = hiphopKit
                break;
        }

        for(let i = 0; i < load.length; i++){
            const padKey = load[i].key
            this.triggerSet[padKey].setSampleURL(load[i].url)
            this.triggerSet[padKey].fetchSample();
        }
    }

    loadKeys(sampleBank: string){
        let load;

        switch (sampleBank) {
            case 'electric-piano':
                load = electricPiano;
                break;
            case 'grand-piano':
                load = grandPiano;
                break;
            case 'organ':
                load = organ;
                break;
            case 'horns':
                load = horns;
                break;
            case 'bass-guitar':
                load = bass;
                break;
            case 'guitar':
                load = guitar;
                break;
            case 'moog-bass':
                load = moogBass;
                break;
            default:
                load = electricPiano;
                break;
        }

        for(let i = 0; i < load.length; i++){
            const keyKey = load[i].key
            this.triggerSet[keyKey].setSampleURL(load[i].url)
            this.triggerSet[keyKey].fetchSample();
        }
    }

    initSlidersForTriggers(){
        for(let i in this.triggerSet){
            this.triggerSet[i].initSliders();
        }
    }

    removeModal(): void{
        if(document.querySelector('.modal')) document.querySelector('.modal').remove();
    }

}