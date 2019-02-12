import Keyboard from './Keyboard';
import Pad from './Pad';

export default class DrumPad extends Pad{ 

    

    constructor(songURL: string, keyboard:Keyboard, keyCode: number, audioContext: AudioContext){
        super(keyboard, keyCode, audioContext);
        this.songURL = songURL;
        this.fetchDefaultSample();  
        this.buildPadHTML();
          
    }

    fetchDefaultSample(): void{

        fetch(this.songURL)
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
    


    buildPadHTML(){
        const drumMachine = document.querySelector('.drum-machine')

        const article = document.createElement('article');
        const drumPadContainer = document.createElement('div');
        // const swapIcon = document.createElement('svg');
        const swapIcon = document.createElement('span');
        swapIcon.textContent = 'Swap Key'

        const drumPad = document.createElement('div');
        const loadBtnLabel = document.createElement('label');
        const loadBtn = document.createElement('input');
        const resetBtn = document.createElement('button');

        const padControls = document.createElement('div');
        const gainText = document.createElement('span');
        const gainInput = document.createElement('input');
        const pitchText = document.createElement('span');
        const pitchInput = document.createElement('input');


        loadBtnLabel.setAttribute('for', 'load-pad');
        loadBtnLabel.textContent = 'Load';
        loadBtn.type = 'file';
        loadBtn.id = 'load-pad';
        loadBtn.style.visibility = 'hidden';
        
        resetBtn.textContent = 'Reset';
        gainText.textContent = 'Gain';
        pitchText.textContent = 'Pitch';

        drumPad.textContent = String.fromCharCode(this.keyCode);

        this.padElement = drumPad;

        this.padListener(drumPad);

        this.loadListener(loadBtn);
        this.resetListener(resetBtn);
        this.swapListener(swapIcon);
        this.setPadElementText();


        article.classList.add('drum-pad');
        drumPad.classList.add('drum-pad__pad');


        drumMachine.appendChild(article);
        article.appendChild(swapIcon);
        article.appendChild(drumPadContainer);
        article.appendChild(padControls);
        drumPadContainer.appendChild(drumPad);
        drumPadContainer.appendChild(loadBtnLabel);
        drumPadContainer.appendChild(loadBtn);
        drumPadContainer.appendChild(resetBtn);
        padControls.appendChild(gainText);
        padControls.appendChild(gainInput);
        padControls.appendChild(pitchText);
        padControls.appendChild(pitchInput);


        // Mock Layout
        // <article data-pad="9" class="drum-pad">
        //     <span>Swap Key</span>
        //     <div>
        //         <div class="drum-pad__pad">
        //             H
        //         </div>
        //         <span class="drum-pad__load">Load</span>
        //         <span class="drum-pad__reset">Reset</span>
        //     </div>
        //     <div class="drum-pad__controls">
        //         <span>Gain</span>
        //         <button class="drum-pad__gain">{Gain volume knob}</button>
                
        //         <span>Pitch</span>
        //         <button class="drum-pad__pitch">{Pitch volume knob}</button>
        //     </div>
        // </article>


    }


    padListener(elem: any){
        elem.addEventListener('click', () => {
            this.play();
        })
    }

    gainListener(elem: Element){
        elem.addEventListener('mousemove', (evt) => {
            // this.gainInput = evt.target
        })
    }

    pitchListener(elem: Element){
        elem.addEventListener('mousemove', (evt) => {
            // this.pitchInput = evt.target
            // this.keyboard.captureWindowEvent(evt);
        })
    }

    

    loadListener(elem: Element){
        elem.addEventListener('input', (evt) => {
            this.decodeBuffer(evt);
        })
    }

    resetListener(elem: Element){
        elem.addEventListener('click', (evt) => {
            this.fetchDefaultSample();
        })
    }

    swapListener(elem: Element){
        elem.addEventListener('click', (evt) => {
            console.log(evt);
            this.keyboard.setReferencePad(this);
            // this.setKeyCode(evt.target.value)
        })
    }

    // Decodes an audio file when loaded
    decodeBuffer(evt: Event){

        const _this = this;

        console.log(evt);

        const fileReader = new FileReader();

        fileReader.readAsArrayBuffer(evt.target.files[0]);
        fileReader.onload = function(evt){
            
    
            let audioBuffer = _this.audioContext.decodeAudioData(fileReader.result as any);
    
            audioBuffer.then((res: AudioBuffer) => {
                _this.setAudioBuffer(res);
                _this.establishAudioSource();
            })
            .catch((err: Error) => {
                console.log(err);
            })
        }
    }
}