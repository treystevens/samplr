import Keyboard from './Keyboard';
import { masterStreamNode, scriptNode } from './app';

export let mediasource: any


export default abstract class Trigger{

    charCode: number
    audioBuffer: AudioBuffer
    gainInput: number
    filterKnob: AudioNode
    pitchInput: number
    audioContext: AudioContext
    audioSource: AudioBufferSourceNode
    defaultSampleURL: string
    keyboard: Keyboard
    padElement: HTMLElement
    gainElementInput: HTMLInputElement
    pitchElementInput: HTMLInputElement
    gainSlider: HTMLInputElement
    pitchSlider: HTMLInputElement


    constructor(keyboard: Keyboard, charCode: number, audioContext: AudioContext){
        this.keyboard = keyboard;
        this.charCode = charCode;
        this.audioContext = audioContext;
        this.gainInput = 1;
        this.pitchInput = 0;
        this.filterKnob = audioContext.createBiquadFilter();
    }

    getCharCode(): number{
        return this.charCode;
    }

    getAudioBuffer(): AudioBuffer{
        return this.audioBuffer;
    }

    setCharCode(charCode: number):void{

        const prevcharCode = this.charCode;
        this.charCode = charCode;
        this.keyboard.setPad(this, prevcharCode);
        this.setPadElementText();
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

    setPadElementText(){
        if(this.charCode >= 97 || this.charCode <= 122){
            this.padElement.textContent = String.fromCharCode(this.charCode - 32);
        }
        else{
            this.padElement.textContent = String.fromCharCode(this.charCode);
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

}