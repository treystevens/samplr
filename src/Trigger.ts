import Sampler from './Sampler';
import { masterStreamNode, scriptNode, wavesurfer } from './app';
export let mediasource: any

export default abstract class Trigger{

    protected active: boolean
    protected audioBuffer: AudioBuffer
    protected audioContext: AudioContext
    protected audioSourceRunning: boolean
    protected audioSource: AudioBufferSourceNode
    protected endSliderPos: number
    protected filterOption: string
    protected filterOptionList: Array<HTMLInputElement>
    protected frequency: number
    protected frequencyElementInput: HTMLInputElement
    protected frequencySlider: HTMLInputElement
    protected gain: number
    protected gainElementInput: HTMLInputElement
    protected gainSlider: HTMLInputElement
    protected key: string
    protected pitch: number
    protected pitchElementInput: HTMLInputElement
    protected pitchSlider: HTMLInputElement
    protected q: number
    protected qElementInput: HTMLInputElement
    protected qSlider: HTMLInputElement
    protected sampler: Sampler
    protected sampleURL: string
    protected startSliderPos: number
    protected triggerElement: HTMLElement
    protected userSelectedFilterOption: HTMLInputElement
    protected userLoadedAudioBlob: Blob
    

    constructor(audioContext: AudioContext, sampler: Sampler, key: string){
        this.sampler = sampler;
        this.key = key;
        this.audioContext = audioContext;
        this.audioSourceRunning = false;
        this.pitch = 0;
        this.gain = 0;
        this.q = 0;
        this.frequency = 20000;
        this.filterOption = 'lowpass';
        this.active = false;
        this.userLoadedAudioBlob = null;


        this.initAudioControlSelectors();
        this.initAudioControlListeners();    
    }

    setActive(active: boolean): void{
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

        this.filterOptionList = Array.from(document.querySelectorAll('.sampler__filter-option'));

    }

    initAudioControlListeners(): void{
        // Gain Input Listeners
        this.gainSlider.addEventListener('input', (evt: any) => {
            if(this.active){
                this.gain = evt.target.value;
                this.gainElementInput.value = String(this.gain);
            }
        })
        this.gainElementInput.addEventListener('input', (evt: any) => {
            if(this.active){
             const value: number = Number(evt.target.value)
             
             this.gain = value;
             if(isNaN(value)) this.gain = 0;
             if(value > 6) this.gain = 6;
             if (value < -70) this.gain = -70;
              
             this.gainSlider.valueAsNumber = this.gain;
            } 
        })

        // Pitch Input Listeners
        this.pitchSlider.addEventListener('input', (evt: any) => {
            if(this.active){
                this.pitch = evt.target.value;
                this.pitchElementInput.value = String(this.pitch);
            }
        })
        this.pitchElementInput.addEventListener('input', (evt: any) => {
            const value: number = Number(evt.target.value)

            this.pitch = value;
            if(value > 12) this.pitch= 12;
            if (value < -12) this.pitch= -12;

            this.pitchSlider.valueAsNumber = this.pitch;
            
        })

        // Filter Input Listeners
        this.frequencySlider.addEventListener('input', (evt: any) => {
            if(this.active){
                this.frequency = evt.target.value;
                this.frequencyElementInput.value = String(this.frequency);
            }
        })
        this.frequencyElementInput.addEventListener('input', (evt: any) => {
            const value: number = Number(evt.target.value)

            this.frequency = value;
            if(value > 20000) this.frequency= 20000;
            if (value < 26) this.frequency= 26;

            this.frequencySlider.valueAsNumber = this.frequency;
            
        })
        this.qSlider.addEventListener('input', (evt: any) => {
            if(this.active){
                this.q = evt.target.value;
                this.qElementInput.value = String(this.q);
            }
        })
        this.qElementInput.addEventListener('input', (evt: any) => {
            const value: number = Number(evt.target.value)

            this.q = value;
            if(value > 16) this.q = 16;
            if (value < 0) this.q = 0;

            this.qSlider.valueAsNumber = this.q;
            
        })
        this.filterOptionList.forEach((option) => {
            if(option.value === 'lowpass') this.userSelectedFilterOption = option;

            option.addEventListener('change', (evt: any) => {
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

    setKey(key: string): void{

        const prevKey: string = this.key;
        this.key = key;
        this.sampler.setTrigger(this, prevKey);
        this.setTriggerElementText();
    }

    setAudioBuffer(audioBuffer: AudioBuffer): void{
        this.audioBuffer = audioBuffer;
    }

    establishAudioSource(): void{

        const gainNode: GainNode = this.audioContext.createGain();
        const gainLevel: number = Math.pow(10, this.gain / 20);
        const biquadFilter: BiquadFilterNode = this.audioContext.createBiquadFilter();
        
        this.audioSource = this.audioContext.createBufferSource();
        this.audioSource.buffer = this.audioBuffer;

        gainNode.gain.value = gainLevel;
        (biquadFilter.type as string) = this.filterOption;
        biquadFilter.frequency.value = this.frequency;
        biquadFilter.Q.value = this.q;

        // MDN: +100 and -100 detune the source up or down by one semitone, 
        // MDN: while +1200 and -1200 detune it up or down by one octave.
        // this.pitch is range [-12, 12];
        // !!! - Safari does not support detune property
        if (this.audioSource.detune !== undefined ) {
            this.audioSource.detune.value = this.pitch * 100;
        }

        this.audioSource.connect(gainNode);
        gainNode.connect(biquadFilter);
        biquadFilter.connect(this.audioContext.destination)
        biquadFilter.connect(masterStreamNode);
    }

    play(): void{
        this.establishAudioSource();

        // Show wave form when playing
        if(this.userLoadedAudioBlob) wavesurfer.loadBlob(this.userLoadedAudioBlob);
        else{
            wavesurfer.load(this.sampleURL);
        }
        
        // Only get play range if the view has sliders
        if(document.querySelector('.slider')){
            const [startTime, duration]: Array<number> = this.audioPlayRange();
            this.audioSource.start(0, startTime, duration);
        }
        else{
            this.audioSource.start();
        }

        this.audioSourceRunning = true;
        const _this: Trigger = this

        this.audioSource.onended = function() {
            _this.audioSourceRunning = false;  
        }
    }

    // Converting start and end slider pixels into seconds to get the play range of the audio sample
    audioPlayRange(){
        const startSlider: HTMLElement = document.querySelector('.slider__handle--start');
        // Sliders have a half width offset, so we want to add this offset back to its position
        const halfSliderWidth: number = startSlider.offsetWidth / 2;
        const songDuration: number = this.audioSource.buffer.duration;
        const sliderWidth: number = (document.querySelector('.slider') as HTMLElement).offsetWidth;
        const pixelsPerSecond: number = sliderWidth / songDuration;
        const startTime: number = (this.startSliderPos + halfSliderWidth) / pixelsPerSecond;
        const endTime: number = (this.endSliderPos + halfSliderWidth) / pixelsPerSecond;
        const duration: number = endTime - startTime;

        return [startTime, duration]
    }

    stopSound(): void{
        if(this.audioSourceRunning) this.audioSource.stop();
    }

    setTriggerElementText(): void{
        
        const asciiCode: number = this.key.charCodeAt(0)
        
        if(asciiCode >= 97 && asciiCode <= 122){
            this.triggerElement.textContent = String.fromCharCode(asciiCode - 32);
        }
        else{
            this.triggerElement.textContent = this.key;
        }
    }

    setUserLoadedAudioBlob(blob: Blob): void{
        this.userLoadedAudioBlob = blob;
    }

    // Decodes an audio file when loaded
    decodeBuffer(evt: any): void{
    
        const _this: Trigger = this;
        const fileReader: FileReader = new FileReader();
        this.setUserLoadedAudioBlob(evt.target.files[0]);
        fileReader.readAsArrayBuffer(evt.target.files[0]);
        fileReader.onload = function(){
            
            // !!! Safari only supports callback syntax of decodeAudioData
            _this.audioContext.decodeAudioData((fileReader.result as any), function(buffer: AudioBuffer){
                _this.setAudioBuffer(buffer);
                _this.establishAudioSource();
            }, 
              function(err: Error){
                console.log(err);
            })
        }
    }

    fetchSample(): void{
        this.setUserLoadedAudioBlob(null);
        
        fetch(this.sampleURL)
        .then(response =>  response.arrayBuffer())
        .then((arrayBuffer) => {
            
            // !!! Safari only supports callback syntax of decodeAudioData
            const _this = this;
            this.audioContext.decodeAudioData(arrayBuffer, function(buffer){
            
                _this.setAudioBuffer(buffer);
                _this.establishAudioSource();
            }, 
              function(err: Error){
                return Promise.reject(err);
            })

        })
        .catch((err: Error) => {
            console.log(err);
        })
    }

    setSampleURL(url: string): void{
        this.sampleURL = url;
    }

  
    addActiveState(): void{
        if(this.triggerElement.classList.contains('key__white')) this.triggerElement.classList.add('key__white--active');
        if(this.triggerElement.classList.contains('key__black')) this.triggerElement.classList.add('key__black--active');
        if(this.triggerElement.classList.contains('drum-pad__pad')) this.triggerElement.classList.add('active-state');
    }

    removeActiveState(): void{
        if(this.triggerElement.classList.contains('key__white--active')) this.triggerElement.classList.remove('key__white--active');
        if(this.triggerElement.classList.contains('key__black--active')) this.triggerElement.classList.remove('key__black--active');
        if(this.triggerElement.classList.contains('active-state')) this.triggerElement.classList.remove('active-state');
    }

    setStartSliderPos(leftPos: number): void{
        this.startSliderPos = leftPos;
    }

    setEndSliderPos(leftPos: number): void{
        this.endSliderPos = leftPos;
    }

    getStartSliderPos(): number{
        return this.startSliderPos;
    }

    getEndSliderPos(): number{
        return this.endSliderPos;
    }


    initSliders(){
        this.startSliderPos = parseInt((document.querySelector('.slider__handle--start') as HTMLElement).style.left)
        this.endSliderPos = parseInt((document.querySelector('.slider__handle--end') as HTMLElement).style.left)
    }
    abstract buildHTML(): void
}