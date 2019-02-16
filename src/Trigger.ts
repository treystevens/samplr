import Sampler from './Sampler';
import { masterStreamNode, scriptNode } from './app';

export let mediasource: any

const wavesurfer: any = WaveSurfer.create({
    container: '#waveform',
    waveColor: 'orange',
    progressColor: 'purple'
});

export default abstract class Trigger{

    key: string
    audioBuffer: AudioBuffer
    audioContext: AudioContext
    audioSource: AudioBufferSourceNode
    defaultSampleURL: string
    sampler: Sampler
    triggerElement: HTMLElement
    gainElementInput: HTMLInputElement
    pitchElementInput: HTMLInputElement
    qElementInput: HTMLInputElement
    frequencyElementInput: HTMLInputElement
    gainSlider: HTMLInputElement
    pitchSlider: HTMLInputElement
    frequencySlider: HTMLInputElement
    qSlider: HTMLInputElement
    pitch: number
    gain: number
    active: boolean
    filterOption: string
    frequency: number
    q: number
    filterOptionList: Array<HTMLInputElement>
    userSelectedFilterOption: HTMLElement


    constructor(audioContext: AudioContext, sampler: Sampler, key: string){
        this.sampler = sampler;
        this.key = key;
        this.audioContext = audioContext;
        this.pitch = 0;
        this.gain = 0;
        this.q = 0;
        this.frequency = 20000;
        this.filterOption = 'lowpass';
        this.active = false;

        this.initAudioControlSelectors();
        this.initAudioControlListeners();    
    }

    setActive(active: boolean){
        this.active = active;
        
        if(this.active){

            this.pitchSlider.valueAsNumber = this.pitch;
            this.pitchElementInput.value = String(this.pitch);
            this.gainSlider.valueAsNumber = this.gain;
            this.gainElementInput.value = String(this.gain);

            this.frequencySlider.valueAsNumber = this.frequency;
            this.frequencyElementInput.value = String(this.frequency);
            this.qSlider.valueAsNumber = this.q;
            this.qElementInput.value = String(this.q);


            this.filterOptionList.forEach((option) => {

                if(option.value !== this.filterOption){
                    option.checked = false;
                }
                else{
                    option.checked = true;
                }   
            });
        }
    }

    initAudioControlSelectors(): void{
        // Gain Elements
        this.gainElementInput = document.querySelector('.sampler__gain-text');
        this.gainSlider = document.querySelector('.sampler__gain-slider');
        
        // Pitch Elements
        this.pitchElementInput = document.querySelector('.sampler__pitch-text');
        this.pitchSlider = document.querySelector('.sampler__pitch-slider');

        // Filter Elements
        // -- Frequency elements
        this.frequencyElementInput = document.querySelector('.sampler__frequency-text');
        this.frequencySlider = document.querySelector('.sampler__frequency-slider');

        // -- Q elements
        this.qElementInput = document.querySelector('.sampler__q-text');
        this.qSlider = document.querySelector('.sampler__q-slider');

        this.filterOptionList = Array.from(document.querySelectorAll('.sampler__filter-option'))
    }

    initAudioControlListeners(){
        // Gain Input Listeners
        this.gainSlider.addEventListener('input', (evt) => {
            if(this.active){
                this.gain = evt.target.value;
                this.gainElementInput.value = String(this.gain);
            }
        })
        this.gainElementInput.addEventListener('input', (evt) => {
            if(this.active){
             const value = Number(evt.target.value)
             
             this.gain = value;
             if(value > 6) this.gain = 6;
             if (value < -70) this.gain = -70;
              
             this.gainSlider.valueAsNumber = this.gain;
            } 
        })

        // Pitch Input Listeners
        this.pitchSlider.addEventListener('input', (evt) => {
            if(this.active){
                this.pitch = evt.target.value;
                this.pitchElementInput.value = String(this.pitch);
            }
        })
        this.pitchElementInput.addEventListener('input', (evt) => {
            const value = Number(evt.target.value)

            this.pitch = value;
            if(value > 12) this.pitch= 12;
            if (value < -12) this.pitch= -12;

            this.pitchSlider.valueAsNumber = this.pitch;
            
        })

        // Filter Input Listeners
        this.frequencySlider.addEventListener('input', (evt) => {
            if(this.active){
                this.frequency = evt.target.value;
                this.frequencyElementInput.value = String(this.frequency);
            }
        })
        this.frequencyElementInput.addEventListener('input', (evt) => {
            const value = Number(evt.target.value)

            this.frequency = value;
            if(value > 20000) this.frequency= 20000;
            if (value < 26) this.frequency= 26;

            this.frequencySlider.valueAsNumber = this.frequency;
            
        })
        this.qSlider.addEventListener('input', (evt) => {
            if(this.active){
                this.q = evt.target.value;
                this.qElementInput.value = String(this.q);
            }
        })
        this.qElementInput.addEventListener('input', (evt) => {
            const value = Number(evt.target.value)

            this.q = value;
            if(value > 16) this.q = 16;
            if (value < 0) this.q = 0;

            this.qSlider.valueAsNumber = this.q;
            
        })
        this.filterOptionList.forEach((option) => {
            if(option.value === 'lowpass') this.userSelectedFilterOption = option;

            option.addEventListener('input', (evt) => {
                if(this.active){
                    this.userSelectedFilterOption.checked = false;
                    this.filterOption = evt.target.value;
                    this.userSelectedFilterOption = option;
                }
            })
        })
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
        const gainLevel = Math.pow(10, this.gain / 20);
        const biquadFilter = this.audioContext.createBiquadFilter();
        
        this.audioSource = this.audioContext.createBufferSource();
        this.audioSource.buffer = this.audioBuffer;

        gainNode.gain.value = gainLevel;
        biquadFilter.type = this.filterOption;
        biquadFilter.frequency.value = this.frequency;
        biquadFilter.Q.value = this.q;

        // MDN: +100 and -100 detune the source up or down by one semitone, 
        // MDN: while +1200 and -1200 detune it up or down by one octave.
        // this.pitch is range [-12, 12];
        this.audioSource.detune.value = this.pitch * 100;
        this.audioSource.connect(gainNode);
        
        gainNode.connect(biquadFilter);
        biquadFilter.connect(this.audioContext.destination)

        // The code right below works for MediaRecorder
        biquadFilter.connect(masterStreamNode);
    }

    play(){
        this.establishAudioSource();
        // Show wave form when playing
        wavesurfer.load(this.defaultSampleURL);
        this.audioSource.start();
    }

    stopSound(){
            this.audioSource.stop();
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

    // Decodes an audio file when loaded
    decodeBuffer(evt: Event){

        const _this = this;

        const fileReader = new FileReader();

        fileReader.readAsArrayBuffer(evt.target.files[0]);
        fileReader.onload = function(){
            
            const audioBuffer = _this.audioContext.decodeAudioData(fileReader.result as any);
    
            audioBuffer.then((res: AudioBuffer) => {
                _this.setAudioBuffer(res);
                _this.establishAudioSource();
            })
            .catch((err: Error) => {
                console.log(err);
            })
        }
    }

    fetchDefaultSample(): void{

        fetch(this.defaultSampleURL)
        .then(response =>  response.arrayBuffer())
        .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
        .then((audioBuffer) => {
            this.setAudioBuffer(audioBuffer);
            this.establishAudioSource();
        })
        .catch((err: Error) => {
            console.log(err);
        })
    }

    triggerListener(elem: any){
        elem.addEventListener('click', () => {
            this.play();
        })
    }

    abstract buildHTML(): void
}