import Keyboard from './Keyboard';
import Pad from './Pad';

export default class DrumPad extends Pad{ 


    constructor(songURL: string, keyboard:Keyboard, keyCode: number, audioContext: AudioContext){
        super(keyboard, keyCode, audioContext);
        this.songURL = songURL;
        this.fetchDefaultSample();  
          
    }

    fetchDefaultSample(): void{

        fetch(this.songURL)
        .then(response =>  response.arrayBuffer())
        .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
        .then((audioBuffer) => {
            this.audioBuffer = audioBuffer
            this.establishAudioSource();
        })
        .catch((err: Error) => {
            console.log(err);
        })
    }
    

    // load(audioFile: Element){

    //     const fileReader = new FileReader();

    //     fileReader.readAsArrayBuffer(audioFile.files[0]);
    //     fileReader.onload = function(evt){
        
    //     audioBuffer = this.audioContext.decodeAudioData(fileReader.result);

        
    //     audioBuffer.then((res) => {

    //         this.audioBuffer = res;
    
            
    //     })
    //     .catch((err: Error) => {
    //         console.log(err);
    //     })
    // }




}