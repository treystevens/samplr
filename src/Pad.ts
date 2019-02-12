import Keyboard from './Keyboard';

export default abstract class Pad{

    keyCode: number
    audioBuffer: AudioBuffer
    gainKnob: AudioNode
    filterKnob: AudioNode
    pitchKnob: number
    audioContext: AudioContext
    audioSource: AudioBufferSourceNode
    songURL: string
    keyboard: Keyboard
    padElement: HTMLElement


    constructor(keyboard: Keyboard, keyCode: number, audioContext: AudioContext){
        this.keyboard = keyboard;
        this.keyCode = keyCode;
        this.audioContext = audioContext;
        this.gainKnob = audioContext.createGain();
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
        this.audioSource = this.audioContext.createBufferSource();
        this.audioSource.buffer = this.audioBuffer;
        this.audioSource.connect(this.audioContext.destination);
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

}