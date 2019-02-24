
import { masterStreamNode } from './app';

export default class AudioTasks{

    audioContext: AudioContext
    audioSource:AudioBufferSourceNode
    currentlyRecording: boolean
    mediaRecorder: MediaRecorder
    metronomeAudioContext: AudioContext
    metronomeAudioBuffer: AudioBuffer
    metronomeUpAudioBuffer: AudioBuffer
    metronomeBtn: HTMLElement
    metronomeRunning: boolean
    prerecord: boolean
    recordBtn: HTMLElement
    recordingIcon: HTMLElement
    

    constructor(audioContext: AudioContext){
        this.audioContext = audioContext;
        this.metronomeAudioContext = new (window.AudioContext || window.webkitAudioContext)();

        this.recordBtn = document.querySelector('.audio-tasks__record');
        this.recordingIcon = document.querySelector('.audio-tasks__record-icon');
        this.metronomeBtn = document.querySelector('.audio-tasks__metronome'); 

        this.currentlyRecording = false;
        this.metronomeRunning = false;

        this.metronomeTimer = this.metronomeTimer.bind(this);

        this.recordBtn.addEventListener('click', () => this.toggleRecording());
        this.metronomeBtn.addEventListener('click', () => this.toggleMetronome());

        this.fetchMetronomeSamples();

        
        if(!window.MediaRecorder && !window.matchMedia('screen and (max-width: 820px)').matches){
            alert('Recording is not supported in this browser. Please consider using Google Chrome or Firefox if you would like to record and download what you make.');
            document.querySelector('.audio-tasks__record-container').remove();
        }
    }

    // Fetches Metronome sounds & stores them into their appropriate buffer
    private fetchMetronomeSamples(): void{

        const metronome: any = fetch('https://res.cloudinary.com/dr4eajzak/video/upload/v1550624008/Metronome.wav');
        const metronomeUp: any = fetch('https://res.cloudinary.com/dr4eajzak/video/upload/v1550624008/MetronomeUp.wav');


        Promise.all([metronome, metronomeUp])
        .then((response: any) => {
            const res1: ArrayBuffer = response[0].arrayBuffer();
            const res2: ArrayBuffer = response[1].arrayBuffer();

            return Promise.all([res1, res2]);
        })
        .then((arrayBuffers: Array<ArrayBuffer>) => {

            // !!! Safari only supports callback syntax of decodeAudioData    
            const _this = this;        
            this.audioContext.decodeAudioData(arrayBuffers[0], function(buffer){
                _this.metronomeAudioBuffer = buffer;
            }, 
              function(err: Error){
                console.log(err);
            })
            this.audioContext.decodeAudioData(arrayBuffers[1], function(buffer){
                _this.metronomeUpAudioBuffer = buffer;
            }, 
              function(err: Error){
                console.log(err);
            })            
        })
        .catch((err: Error) => {
            console.log(err);
        })      
    }

    private toggleMetronome(): void{
        this.metronomeRunning ? this.metronomeRunning = false : this.metronomeRunning = true;
        if(this.metronomeRunning) this.metronomeTimer();
    }

    private toggleRecording(): void{
        this.currentlyRecording ? this.currentlyRecording = false : this.currentlyRecording = true;
        
            if(this.currentlyRecording){
                this.prerecord = true;
                this.toggleMetronome();
                this.recordBtn.textContent = 'Counting down...';
            }
            else {
                // Remove previous recording session
                if(document.querySelector('.audio-tasks__recording-audio')){
    
                    document.querySelector('.audio-tasks__recording-audio').remove();
                    document.querySelector('.audio-tasks__recording-link').remove();
                }
                
                this.metronomeRunning = false;

                // Reset Record button to initial view state
                this.recordBtn.textContent = 'Start Recording';
                this.recordingIcon.classList.remove('recording');
    
                this.mediaRecorder.addEventListener('dataavailable', (evt: Blob) => {
                    this.createRecordedAudio(evt);
                });

                this.mediaRecorder.stop();   
        }
    }

    private beatsPerMillisecond(): number{
        const setBPM: HTMLInputElement = document.querySelector('.audio-tasks__set-bpm');
        let bpm: number = Number(setBPM.value);
 
        // Validate value of setBPM button 
        if(isNaN(bpm) || setBPM.value === '') {
            bpm = 120;
            setBPM.value = `${bpm}`;
        }

        const msPerMinute: number = 60000;
        const bpms: number = msPerMinute / bpm;
      
        return bpms;
    }
      
    private startRecording(): void{
         const options: any = {
            audioBitsPerSecond : this.audioContext.sampleRate,
            mimeType : 'audio/webm\;codecs=opus'
        }

         masterStreamNode = this.audioContext.createMediaStreamDestination();
         this.mediaRecorder = new MediaRecorder(masterStreamNode.stream, options)
         this.mediaRecorder.start();
         this.recordingIcon.classList.add('recording'); 
         this.recordBtn.textContent = 'Stop Recording'; 
    }
      
    private metronomeTimer(): void{
        const bpms: number = this.beatsPerMillisecond();
        const metronome: number = setInterval(metronomeCount, bpms);
        const _this = this;
        let count: number = 1;
        
        this.metronomeBtn.textContent = 'Stop Metronome';
        
        function metronomeCount(){

            const metronomeDisplay: HTMLElement = document.querySelector('.audio-tasks__metronome-display');
            
            // Reset metronome on prerecord count and after 4 beats
            if(count === 5 && _this.prerecord){
                _this.prerecord = false;
                _this.startRecording();
            }
            // Loop metronome count back to 1
            if(count === 5) {
                count = 1
            };

            // Stop Metronome
            if(!_this.metronomeRunning){
                metronomeDisplay.textContent = '-';
                _this.metronomeBtn.textContent = 'Start Metronome'
                clearInterval(metronome);
                return;
            } 

            _this.playMetronome(count);

            // Append negative value for prerecord count
            if(_this.prerecord) metronomeDisplay.textContent = `-${count}`;
            else { 
                metronomeDisplay.textContent = `${count}`;
            }
            count++;
        }
    }

    private playMetronome(count: number): void{

        this.audioSource = this.metronomeAudioContext.createBufferSource();

        // Play different metronome sound on the 1
        if(count === 1) this.audioSource.buffer = this.metronomeUpAudioBuffer
        else{
            this.audioSource.buffer = this.metronomeAudioBuffer;
        }
        this.audioSource.connect(this.metronomeAudioContext.destination);
        this.audioSource.start();
    }

    private createRecordedAudio(evt: any): void{
        const url: string = (window.URL || window.webkitURL).createObjectURL(evt.data);
        const link: HTMLAnchorElement = window.document.createElement('a');
        const click: Event = document.createEvent("Event");
        const audio: HTMLAudioElement = document.createElement('audio');
        const audioTasks: HTMLElement = document.querySelector('.audio-tasks');

        link.href = url;
        link.download = 'recording.ogg';
        
        // !!! Deprecated - Use Alternative
        click.initEvent("click", true, true);
        link.dispatchEvent(click);  
        
        link.textContent = 'Download Recording (.OGG)'

        audio.classList.add('audio-tasks__recording-audio');
        link.classList.add('audio-tasks__recording-link');

        audio.controls = true;
        audio.src = url;

        audioTasks.appendChild(audio);
        audioTasks.appendChild(link);
    }
}