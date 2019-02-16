import Sampler from './Sampler';
import Trigger from './Trigger';

export default class Pad extends Trigger{ 

    constructor(audioContext: AudioContext, sampler: Sampler, key: string, defaultSampleURL: string,){
        super(audioContext, sampler, key);
        this.defaultSampleURL = defaultSampleURL;
        this.fetchDefaultSample();  
        this.buildHTML();    
    }

    buildHTML(): void{
        const drumMachine = document.querySelector('.drum-machine');

        const article = document.createElement('article');
        const PadContainer = document.createElement('div');
        // const swapIcon = document.createElement('svg');
        const swapIcon = document.createElement('span');
        swapIcon.textContent = 'Swap Key'

        const Pad = document.createElement('div');
        
        const resetSampleBtn = document.createElement('button');

        const loadElements = this.buildLoadElements();

        const padControls = document.createElement('div');
        
    
        resetSampleBtn.textContent = 'Reset Sample';
        this.resetListener(resetSampleBtn);
        

        this.triggerElement = Pad;
        this.setTriggerElementText();
        
        this.triggerListener(Pad);

        
        this.swapListener(swapIcon);
        
    
        article.classList.add('drum-pad');
        Pad.classList.add('drum-pad__pad');


        drumMachine.appendChild(article);

        article.appendChild(swapIcon);
        article.appendChild(PadContainer);
        article.appendChild(padControls);

        PadContainer.appendChild(Pad);
        PadContainer.appendChild(loadElements.loadBtnLabel);
        PadContainer.appendChild(loadElements.loadBtn);
        PadContainer.appendChild(resetSampleBtn);
    }

    buildLoadElements(): any{
        const loadElements: any = {};
        const loadBtnLabel = document.createElement('label');
        const loadBtn = document.createElement('input');


        loadBtnLabel.setAttribute('for', 'load-pad');
        loadBtnLabel.textContent = 'Load';
        loadBtn.type = 'file';
        loadBtn.id = 'load-pad';
        loadBtn.style.visibility = 'hidden';

        this.loadListener(loadBtn);

        loadElements.loadBtn = loadBtn;
        loadElements.loadBtnLabel = loadBtnLabel;

        return loadElements;
    }

    loadListener(elem: Element): void{
        elem.addEventListener('input', (evt) => {
            this.decodeBuffer(evt);
        })
    }

    resetListener(elem: Element): void{
        elem.addEventListener('click', (evt) => {
            this.fetchDefaultSample();
        })
    }

    swapListener(elem: Element): void{
        elem.addEventListener('click', (evt) => {
            this.sampler.setReferenceTrigger(this);
        })
    }
}