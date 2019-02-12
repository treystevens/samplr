import Keyboard from './Keyboard';

export default abstract class Pad{

    keyCode: number
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


    constructor(keyboard: Keyboard, keyCode: number, audioContext: AudioContext){
        this.keyboard = keyboard;
        this.keyCode = keyCode;
        this.audioContext = audioContext;
        this.gainInput = 1;
        this.pitchInput = 0;
        this.filterKnob = audioContext.createBiquadFilter();
    }

    getKeyCode(): number{
        return this.keyCode;
    }

    getAudioBuffer(): AudioBuffer{
        return this.audioBuffer;
    }

    setKeyCode(keyCode: number):void{

        const prevKeyCode = this.keyCode;
        this.keyCode = keyCode;
        this.keyboard.setPad(this, prevKeyCode);
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

        gainNode.gain.value = gainLevel;

        // +100 and -100 detune the source up or down by one semitone, 
        // while +1200 and -1200 detune it up or down by one octave.
        // pitchInput is range [-12, 12] (inclusive);
        this.audioSource.detune.value = this.pitchInput * 100;
        this.audioSource.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
    }

    play(){
        this.establishAudioSource();
        this.audioSource.start();
    }

    setPadElementText(){
        if(this.keyCode >= 97 || this.keyCode <= 122){
            this.padElement.textContent = String.fromCharCode(this.keyCode - 32);
        }
        else{
            this.padElement.textContent = String.fromCharCode(this.keyCode);
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