
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

        this.recordBtn = document.querySelector('.options__record');
        this.recordingIcon = document.querySelector('.options__record-icon');
        this.metronomeBtn = document.querySelector('.options__metronome'); 

        this.currentlyRecording = false;
        this.metronomeRunning = false;

        this.metronomeTimer = this.metronomeTimer.bind(this);

        this.recordBtn.addEventListener('click', () => this.toggleRecording());
        this.metronomeBtn.addEventListener('click', () => this.toggleMetronome());

        this.fetchDefaultSample()
    }

    // Fetches Metronome sounds & stores them into their appropriate buffer
    private fetchDefaultSample(): void{

        const metronome = fetch('https://res.cloudinary.com/dr4eajzak/video/upload/v1550624008/Metronome.wav');
        const metronomeUp = fetch('https://res.cloudinary.com/dr4eajzak/video/upload/v1550624008/MetronomeUp.wav');


        Promise.all([metronome, metronomeUp])
        .then((response: any) => {
            const res1 = response[0].arrayBuffer();
            const res2 = response[1].arrayBuffer();

            return Promise.all([res1, res2]);
        })
        .then((arrayBuffers: Array<ArrayBuffer>) => {

            const buffer1 = this.audioContext.decodeAudioData(arrayBuffers[0]);
            const buffer2 = this.audioContext.decodeAudioData(arrayBuffers[1]);
            
            return Promise.all([buffer1, buffer2]);
        })
        .then((audioBuffers: Array<AudioBuffer>) => {
            this.metronomeAudioBuffer = audioBuffers[0];
            this.metronomeUpAudioBuffer = audioBuffers[1];
        })
        .catch((err) => {
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
                if(document.querySelector('.options__recording-audio')){
    
                    document.querySelector('.options__recording-audio').remove();
                    document.querySelector('.options__recording-link').remove();
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
        const setBPM = document.querySelector('.options__set-bpm');
        let bpm = Number(setBPM.value);
 
        // Validate value of setBPM button 
        if(isNaN(setBPM.value) || setBPM.value === '') {
            bpm = 120;
            setBPM.value = `${bpm}`;
        }

        const msPerMinute = 60000;
        const bpms = msPerMinute / bpm;
      
        return bpms;
    }
      
    private startRecording(): void{
         const options = {
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
        const bpms = this.beatsPerMillisecond();
        const metronome = setInterval(metronomeCount, bpms);
        const self = this;
        let count = 1;
        
        this.metronomeBtn.textContent = 'Stop Metronome';
        
        function metronomeCount(){

            const metronomeDisplay = document.querySelector('.options__metronome-display');
            
            // Reset metronome on prerecord count and after 4 beats
            if(count === 5 && self.prerecord){
                self.prerecord = false;
                self.startRecording();
            }
            // Loop metronome count back to 1
            if(count === 5) {
                count = 1
            };

            // Stop Metronome
            if(!self.metronomeRunning){
                metronomeDisplay.textContent = '-';
                self.metronomeBtn.textContent = 'Start Metronome'
                clearInterval(metronome);
                return;
            } 

            self.playMetronome(count);

            // Append negative value for prerecord count
            if(self.prerecord) metronomeDisplay.textContent = `-${count}`;
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
        const url = (window.URL || window.webkitURL).createObjectURL(evt.data);
        const link = window.document.createElement('a');
        const click = document.createEvent("Event");
        const audio = document.createElement('audio');
        const options = document.querySelector('.options');

        link.href = url;
        link.download = 'sample-recording.ogg';
        
        // !!! Deprecated - Use Alternative
        click.initEvent("click", true, true);
        link.dispatchEvent(click);  
        
        link.textContent = 'Download Recording (OGG)'

        audio.classList.add('options__recording-audio');
        link.classList.add('options__recording-link');

        audio.controls = true;
        audio.src = url;

        options.appendChild(audio);
        options.appendChild(link);
    }
}