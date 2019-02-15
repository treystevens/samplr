import Sampler from './Sampler';
import { masterStreamNode, scriptNode } from './app';

export let mediasource: any


export default abstract class Trigger{

    key: string
    audioBuffer: AudioBuffer
    gainInput: number
    filterKnob: AudioNode
    pitchInput: number
    audioContext: AudioContext
    audioSource: AudioBufferSourceNode
    defaultSampleURL: string
    sampler: Sampler
    triggerElement: HTMLElement
    gainElementInput: HTMLInputElement
    pitchElementInput: HTMLInputElement
    gainSlider: HTMLInputElement
    pitchSlider: HTMLInputElement


    constructor(audioContext: AudioContext, sampler: Sampler, key: string){
        this.sampler = sampler;
        this.key = key;
        this.audioContext = audioContext;
        this.gainInput = 1;
        this.pitchInput = 0;
        this.filterKnob = audioContext.createBiquadFilter();
    }

    getKey(): string{
        return this.key;
    }

    getAudioBuffer(): AudioBuffer{
        return this.audioBuffer;
    }

    setKey(key: string):void{

        const prevKey = this.key;
        this.key = key;
        this.sampler.setTrigger(this, prevKey);
        this.setTriggerElementText();
    }

    setAudioBuffer(audioBuffer: AudioBuffer): void{
        this.audioBuffer = audioBuffer;
    }



    establishAudioSource(){

        const gainNode = this.audioContext.createGain();
        const gainLevel = Math.pow(10, this.gainInput / 20);

        this.audioSource = this.audioContext.createBufferSource();
        this.audioSource.buffer = this.audioBuffer;

        // console.log(this.audioSource)
        // mediasource = this.audioContext.createMediaElementSource(this.audioSource);

        gainNode.gain.value = gainLevel;

        // +100 and -100 detune the source up or down by one semitone, 
        // while +1200 and -1200 detune it up or down by one octave.
        // pitchInput is range [-12, 12] (inclusive);
        // ORIGINAL ~~~~~ BELOW the 3 BELOW
        // this.audioSource.detune.value = this.pitchInput * 100;
        // this.audioSource.connect(gainNode);
        // gainNode.connect(this.audioContext.destination);



        this.audioSource.detune.value = this.pitchInput * 100;
        this.audioSource.connect(gainNode);
        // scriptNode.connect(gainNode);
        gainNode.connect(this.audioContext.destination);


        
        // The code right below works for MediaRecorder
        gainNode.connect(masterStreamNode);

        
        // masterStreamNode.connect(this.audioContext.destination);
    }

    play(){
        this.establishAudioSource();
        this.audioSource.start();
    }

    setTriggerElementText(){
        
        const asciiCode = this.key.charCodeAt(0)
        
        if(asciiCode >= 97 && asciiCode <= 122){
            this.triggerElement.textContent = String.fromCharCode(asciiCode - 32);
        }
        else{
            this.triggerElement.textContent = this.key;
        }
    }

    setGainElementInputText(){
        this.gainElementInput.value = String(this.gainInput);
    }

    setPitchElementInputText(){
        this.pitchElementInput.value = String(this.pitchInput);
    }

    setGainSlider(){
        this.gainSlider.value = this.gainElementInput.value;
    }

    setPitchSlider(){
        this.pitchSlider.value = this.pitchElementInput.value;
    }


    abstract buildHTML(): void
}