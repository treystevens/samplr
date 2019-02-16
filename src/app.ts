import Recorder from './Recorder';
import Sampler from './Sampler';


const audioContext: AudioContext = new AudioContext();
const sampler: Sampler = new Sampler(audioContext);

const audioFile = document.querySelector('.audio-file')
const recordBtn = document.querySelector('.record');

let myRecorder: Recorder
export let masterStreamNode: any = audioContext.createMediaStreamDestination();

export const scriptNode = audioContext.createScriptProcessor(4096, 1, 1);
let currentlyRecording = false;
let mediaRecorder: MediaRecorder

var options = {
    audioBitsPerSecond : audioContext.sampleRate,
    mimeType : 'audio/webm\;codecs=opus'
}

audioFile.addEventListener('input', (evt) => {
  sampler.decodeBuffer(evt)
})

recordBtn.addEventListener('click', () => {

    currentlyRecording ? currentlyRecording = false : currentlyRecording = true;

    if(currentlyRecording){
        masterStreamNode = audioContext.createMediaStreamDestination();
      
        mediaRecorder = new MediaRecorder(masterStreamNode.stream, options)
        mediaRecorder.start();
    }
    else{

        mediaRecorder.addEventListener('dataavailable',function(evt){
            
            playFromBlob(evt.data)

            let url = (window.URL || window.webkitURL).createObjectURL(evt.data);
            let link = window.document.createElement('a');
            link.href = url;
            link.download = 'output.ogg';
            let click = document.createEvent("Event");
            click.initEvent("click", true, true);
            link.dispatchEvent(click);  
            
            link.textContent = 'OGG File'

            const audio = document.createElement('audio');
            audio.controls = true;
            audio.src = url;


            const ul = document.createElement('ul');
            const li = document.createElement('li');

            const drumMachine = document.querySelector('.drum-machine');


            ul.appendChild(li)
            li.appendChild(link);
            li.appendChild(audio);
            drumMachine.appendChild(ul);

            
          });
        mediaRecorder.stop();


        // myRecorder.exportWAV( doneEncoding );

        

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