import Recorder from './Recorder';
import Sampler from './Sampler';


const audioContext: AudioContext =  new (window.AudioContext || window.webkitAudioContext)();
const sampler: Sampler = new Sampler(audioContext);

const audioFile = document.querySelector('.audio-file')
const recordBtn = document.querySelector('.options__record');
const metronomeBtn = document.querySelector('.options__metronome');

let myRecorder: Recorder
export let masterStreamNode: any = audioContext.createMediaStreamDestination();

export const scriptNode = audioContext.createScriptProcessor(4096, 1, 1);
let currentlyRecording = false;
let mediaRecorder: MediaRecorder
let metronomeRunning = false;

var options = {
    audioBitsPerSecond : audioContext.sampleRate,
    mimeType : 'audio/webm\;codecs=opus'
}

audioFile.addEventListener('input', (evt) => {
  sampler.decodeBuffer(evt)
})

recordBtn.addEventListener('click', () => {

    const recordingIcon = document.querySelector('.options__record-icon');
    const recordingElemText = document.querySelector('.options__record');
    currentlyRecording ? currentlyRecording = false : currentlyRecording = true;

    if(currentlyRecording){

        recordingElemText.textContent = 'Stop Recording';
        recordingIcon.classList.add('recording');  

        masterStreamNode = audioContext.createMediaStreamDestination();
      
        mediaRecorder = new MediaRecorder(masterStreamNode.stream, options)
        mediaRecorder.start();
    }
    else {
            if(document.querySelector('.options__recording-audio')){

                document.querySelector('.options__recording-audio').remove();
                document.querySelector('.options__recording-link').remove();
            }
            recordingElemText.textContent = 'Start Recording';
            recordingIcon.classList.remove('recording');


            mediaRecorder.addEventListener('dataavailable',function(evt: any){
            
            playFromBlob(evt.data)

            const url = (window.URL || window.webkitURL).createObjectURL(evt.data);
            const link = window.document.createElement('a');
            const click = document.createEvent("Event");
            const audio = document.createElement('audio');
            const audioContainer = document.createElement('div');
            const options = document.querySelector('.options');

            link.href = url;
            link.download = 'sample-recording.ogg';
            
            // deprecated
            click.initEvent("click", true, true);
            link.dispatchEvent(click);  
            
            link.textContent = 'Download Recording (OGG)'

            audio.classList.add('options__recording-audio');
            link.classList.add('options__recording-link');

            
            audio.controls = true;
            audio.src = url;


            options.appendChild(audio);
            options.appendChild(link);

            
          });
        mediaRecorder.stop();


        // myRecorder.exportWAV( doneEncoding );

        

    }
})


function metronomeTimer(){
  const bpm = Number(document.querySelector('.options__set-bpm').value);
  const msPerMinute = 60000;
  const bpms = msPerMinute / bpm;
  const metronome = setInterval(metronomeCount, bpms);
    
  document.querySelector('.options__metronome').textContent = 'Stop Metronome';

  function metronomeCount(){
    const metronomeDisplay = document.querySelector('.options__metronome-display');
    let displayValue = Number(metronomeDisplay.textContent);
 
    displayValue++;

    if(!metronomeRunning){
      metronomeDisplay.textContent = '0';
      clearInterval(metronome);
    } 
    else if(displayValue === 5) metronomeDisplay.textContent = '1';
    else{
     metronomeDisplay.textContent = `${displayValue}`;
    }
  }
}



metronomeBtn.addEventListener('click', () => {

  metronomeRunning ? metronomeRunning = false : metronomeRunning = true;
  
  if(metronomeRunning) metronomeTimer();
  else{    
    document.querySelector('.options__metronome').textContent = 'Start Metronome'
  }
})

function encodeBuffer(inputBuffer: AudioBuffer){
    var buffers = [];
            for ( var i = 0; i < inputBuffer.numberOfChannels; i++ ) {
              buffers[i] = inputBuffer.getChannelData(i);
            }
}      

function playFromBlob(blob: Blob) {
    
    console.log(blob);

    const source = audioContext.createBufferSource()
    const fileReader = new FileReader()
    let arrayBuffer
    fileReader.onload = function(evt: any) {
        
      arrayBuffer = evt.target.result
      
      audioContext.decodeAudioData(arrayBuffer) 
        .then(decodedData => {
          
          source.buffer = decodedData
    
          myRecorder = new Recorder(audioContext, 2, decodedData)
          myRecorder.exportWAV(doneEncoding)
        })
    }
  
    fileReader.readAsArrayBuffer(blob);
}

function gotBuffer(buffer: any){
    myRecorder.exportWAV( doneEncoding );
}

function doneEncoding(blob: any){
    Recorder.forceDownload( blob, "mycurrentlyRecording.wav");
}

if (window.matchMedia('screen and (max-width: 820px)').matches) {
  document.querySelector('.load-samples').remove();
  document.querySelector('.options').remove();
  
}