// import { masterStreamNode } from './app';

export default class Recorder {


    audioContext: AudioContext;
    bufferLen: number;
    node: any
    WORKER_PATH = './scripts/mattWorker.js';
    worker: Worker;
    recording: boolean
    currCallback: any
    recorder: any
    mimeType: string
    numChannels: number
    
    

    callbacks: any = {
        getBuffer: [],
        exportWAV: []
    };

    constructor(source: AudioContext, node: any, dataBuffer: any) {
        

        this.bufferLen = 4096
        this.recording = true;
        this.audioContext = source;
        this.numChannels = 2;
        // this.recorder = this.audioContext.createScriptProcessor(this.bufferLen, 2, 2)
        this.mimeType = 'audio/wav'

        // this.node = this.audioContext.createScriptProcessor(this.bufferLen, 2, 2)
        // this.node = node;

        // this.node = (this.audioContext.createScriptProcessor ||
        // this.audioContext.createJavaScriptNode).call(this.audioContext,
        //     this.bufferLen, this.numChannels, this.numChannels);        

        this.worker = new Worker(this.WORKER_PATH)

        this.worker.postMessage({
            command: 'init',
            config: {
                sampleRate: this.audioContext.sampleRate,
                numChannels: this.numChannels
            }
        });

        this.worker.postMessage({
                command: 'record',
                buffer: dataBuffer
            });
 
        // this.node.onaudioprocess = (evt: any) => {
        //     if (!this.recording) return;

        //     // console.log(evt)

        //     var buffer = [];
        //     for (var channel = 0; channel < this.numChannels; channel++) {
        //         // console.log(evt.inputBuffer.getChannelData(channel))
        //         buffer.push(evt.outputBuffer.getChannelData(channel));
        //     }
        //     this.worker.postMessage({
        //         command: 'record',
        //         buffer: buffer
        //     });
        // };

        // this.node.connect(masterStreamNode)
        // masterStreamNode.connect(this.audioContext.destination)
        // this.node.connect(this.audioContext.destination);   

        // console.log('Recoding is ' + this.recording)

        this.worker.onmessage = (e) => {

            console.log(e)

            let cb = this.callbacks.exportWAV.pop();
            if (typeof cb == 'function') {
                cb(e.data);
            }
        };
    }


    // record() {
    //     console.log('Starting Recording')
    //     this.recording = true;

    //     // sourceSource.connect()

    //     masterStreamNode.connect(this.node)
    //     this.node.connect(this.audioContext.destination);    
    //     this.node.onaudioprocess = (evt: any) => {
    //         if (!this.recording) return;

    //         console.log(evt)

    //         var buffer = [];
    //         for (var channel = 0; channel < this.numChannels; channel++) {
    //             // console.log(evt.inputBuffer.getChannelData(channel))
    //             buffer.push(evt.outputBuffer.getChannelData(channel));
    //         }
    //         this.worker.postMessage({
    //             command: 'record',
    //             buffer: buffer
    //         });
    //     };

    //     console.log('Recoding is ' + this.recording)
        
    // }

    record() {
        this.recording = true;        
    }

    stop() {
        console.log('Stopping recording')
        // this.recording = false;
        // this.node.disconnect(this.audioContext.destination);
        console.log('Recoding is ' + this.recording)
    }

    clear() {
        this.worker.postMessage({command: 'clear'});
    }

    getBuffer(cb: any) {
        // console.log('hello')
        cb = cb
        if (!cb) throw new Error('Callback not set');

        this.callbacks.getBuffer.push(cb);

        this.worker.postMessage({command: 'getBuffers'});
    }

    exportWAV(cb: any) {
        cb = cb ;
        if (!cb) throw new Error('Callback not set');

        this.callbacks.exportWAV.push(cb);

        this.worker.postMessage({
            command: 'exportWAV',
            type: this.mimeType
        });
    }

    static
    forceDownload(blob: any, filename: any) {
        let url = (window.URL || window.webkitURL).createObjectURL(blob);
        let link = window.document.createElement('a');
            link.href = url;
            link.download = 'recording.wav';
            let click = document.createEvent("Event");
            click.initEvent("click", true, true);
            link.dispatchEvent(click);  
            
            link.textContent = 'Download song'


            var audio = document.createElement('audio');
            audio.controls = true;
            audio.src = url;

            // var link = document.createElement('a');
            // link.href = url;
            // link.download = 'output.ogg';
            // link.innerHTML = link.download;
            var ul = document.createElement('ul');
            var li = document.createElement('li');

            const drumMachine = document.querySelector('.drum-machine');
            // drumMachine.appendChild(link)

            ul.appendChild(li)
            li.appendChild(link);
            li.appendChild(audio);
            drumMachine.appendChild(ul);

        console.log('Done with creating download link')
    }
}