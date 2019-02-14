import Keyboard from './Keyboard';
import Trigger from './Trigger';

export default class Pad extends Trigger{ 

    constructor(audioContext: AudioContext, keyboard:Keyboard, defaultSampleURL: string, charCode: number){
        super(keyboard, charCode, audioContext);
        this.defaultSampleURL = defaultSampleURL;
        this.fetchDefaultSample();  
        this.buildPadHTML();    
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
    
    buildPadHTML(){
        const drumMachine = document.querySelector('.drum-machine');

        const article = document.createElement('article');
        const PadContainer = document.createElement('div');
        // const swapIcon = document.createElement('svg');
        const swapIcon = document.createElement('span');
        swapIcon.textContent = 'Swap Key'

        const Pad = document.createElement('div');
        const loadBtnLabel = document.createElement('label');
        const loadBtn = document.createElement('input');
        const resetSampleBtn = document.createElement('button');

        const padControls = document.createElement('div');
        const gainSpanText = document.createElement('span');
        const gainSlider = document.createElement('input');
        const gainInputText = document.createElement('input');
        const pitchText = document.createElement('span');
        const pitchSlider = document.createElement('input');
        const pitchInputText = document.createElement('input');


        loadBtnLabel.setAttribute('for', 'load-pad');
        loadBtnLabel.textContent = 'Load';
        loadBtn.type = 'file';
        loadBtn.id = 'load-pad';
        loadBtn.style.visibility = 'hidden';


        gainSlider.type = 'range';

        gainSlider.setAttribute('max', '6');
        gainSlider.setAttribute('min', '-70');
        gainSlider.setAttribute('value', '0');
        gainInputText.value = '0';

        pitchSlider.type = 'range';
        pitchSlider.setAttribute('max', '12');
        pitchSlider.setAttribute('min', '-12');
        pitchSlider.setAttribute('value', '0');
        pitchSlider.setAttribute('step', '1');
        pitchInputText.value = '0';

        
        resetSampleBtn.textContent = 'Reset Sample';
        gainSpanText.textContent = 'Gain';
        pitchText.textContent = 'Pitch';

        Pad.textContent = String.fromCharCode(this.charCode);

        this.padElement = Pad;
        this.gainElementInput = gainInputText;
        this.gainSlider = gainSlider

        this.pitchElementInput = pitchInputText;
        this.pitchSlider = pitchSlider
        

        this.padListener(Pad);

        this.loadListener(loadBtn);
        this.resetListener(resetSampleBtn);
        this.swapListener(swapIcon);
        this.gainSliderListener(gainSlider)
        this.pitchSliderListener(pitchSlider)
        this.gainInputFieldListener(gainInputText);
        this.pitchInputFieldListener(pitchInputText);
        this.setPadElementText();


        article.classList.add('drum-pad');
        Pad.classList.add('drum-pad__pad');


        drumMachine.appendChild(article);
        article.appendChild(swapIcon);
        article.appendChild(PadContainer);
        article.appendChild(padControls);
        PadContainer.appendChild(Pad);
        PadContainer.appendChild(loadBtnLabel);
        PadContainer.appendChild(loadBtn);
        PadContainer.appendChild(resetSampleBtn);
        padControls.appendChild(gainSpanText);
        padControls.appendChild(gainInputText);
        padControls.appendChild(gainSlider);
        padControls.appendChild(pitchText);
        padControls.appendChild(pitchInputText);
        padControls.appendChild(pitchSlider);


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

    gainSliderListener(elem: HTMLInputElement){
        elem.addEventListener('input', (evt) => {
            const volume = Number(evt.target.value);
            this.gainInput = volume;
            this.gainSlider = elem;         
            this.setGainElementInputText(); 
        })
    }

    gainInputFieldListener(elem: HTMLInputElement){
        elem.addEventListener('input', (evt) => {
            const value = parseInt(evt.target.value)
            
            
            if(value > 6) this.gainElementInput.value = '6';
            if (value < -70) this.gainElementInput.value = '-70';

            
            this.setGainSlider();
            

            
        })
    }

    pitchInputFieldListener(elem: HTMLInputElement){
        elem.addEventListener('input', (evt) => {
            const value = Number(evt.target.value)
            if(value > 12) this.pitchElementInput.value = '12';
            if (value < -12) this.pitchElementInput.value = '-12';
            this.setPitchSlider();
        })
    }

    pitchSliderListener(elem: HTMLInputElement){
        elem.addEventListener('input', (evt) => {
            this.pitchInput = Number(evt.target.value);
            this.setPitchElementInputText();
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
            this.keyboard.setReferencePad(this);
        })
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
}