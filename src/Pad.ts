import Sampler from './Sampler';
import Trigger from './Trigger';

export default class Pad extends Trigger{ 

    constructor(audioContext: AudioContext, sampler: Sampler, key: string, sampleURL: string,){
        super(audioContext, sampler, key);
        this.sampleURL = sampleURL;
        this.fetchSample()
        this.buildHTML();    
    }

    buildHTML(): void{
        const drumMachine = document.querySelector('.drum-machine');

        const totalPadContainer = document.createElement('div');
        const padContainer = document.createElement('div');
        const swapKey = document.createElement('span');
        swapKey.textContent = 'Swap Key'

        const pad = document.createElement('div');
        
        const resetSampleBtn = document.createElement('span');
        const resetSVG = document.createElement('div');

        resetSVG.innerHTML = '<svg class="drum-pad__reset-svg" height="87" viewBox="0 0 106 87" width="106" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" transform="translate(-2 -4)"><path d="m90.7888544 3.57770876 14.1311676 28.26233434c.493978.987957.093529 2.1893031-.894428 2.6832816-.752359.3761797-1.659688.2413995-2.270214-.3372316l-12.75538-12.0890162-12.7553797 12.0890162c-.8017091.7598265-2.0675838.7258739-2.8274103-.0758353-.5786311-.610526-.7134113-1.5178552-.3372316-2.2702147l14.1311672-28.26233434c.4939785-.98795699 1.6953246-1.38840568 2.6832816-.89442719.3870548.19352741.7008998.50737239.8944272.89442719z" fill="#979797" transform="matrix(0 1 -1 0 110 -68)"/><path d="m23.0466669 56.9775043 14.1311672 28.2623344c.4939785.987957.0935298 2.1893031-.8944272 2.6832816-.7523595.3761797-1.6596887.2413995-2.2702147-.3372316l-12.7553797-12.0890163-12.7553797 12.0890163c-.80170914.7598264-2.06758385.7258738-2.8274103-.0758353-.57863106-.610526-.71341129-1.5178553-.33723157-2.2702147l14.13116717-28.2623344c.4939785-.987957 1.6953246-1.3884057 2.6832816-.8944272.3870548.1935274.7008998.5073724.8944272.8944272z" fill="#979797" transform="matrix(0 -1 1 0 -53.142 95.658)"/><path d="m16 54.7005768v-4.871361-11.825c0-17.7293977 19.6665668-17 30.3925781-17h20.9667969" stroke="#979797" stroke-width="5"/><path d="m41.8984375 74.3997956v-4.871361-11.825c0-17.7293978 19.6665668-17 30.3925781-17h20.9667969" stroke="#979797" stroke-width="5" transform="matrix(-1 0 0 -1 135.156 115.1)"/><g fill="#979797"><path d="m22 71h16v6h-16z"/><path d="m72 18h16v6h-16z"/></g></g></svg>'

        const loadElements = this.buildLoadElements();

        const padControls = document.createElement('div');
        const padOptionsContainer = document.createElement('div');
        
        // resetSampleBtn.classList.add('drum-pad__reset')
        resetSVG.classList.add('drum-pad__reset')
        padOptionsContainer.classList.add('drum-pad__options-container')
        padContainer.classList.add('drum-pad__pad-container')

        resetSampleBtn.textContent = 'Reset';
        this.resetListener(resetSampleBtn);
        
        this.triggerElement = pad;

        if (!window.matchMedia('screen and (max-width: 768px)').matches) {
            this.setTriggerElementText();  
            padContainer.appendChild(swapKey); 
        }
        
        this.triggerListener(pad);
        this.swapListener(swapKey);
        
        totalPadContainer.classList.add('drum-pad');
        pad.classList.add('drum-pad__pad');
        swapKey.classList.add('drum-pad__swap')

        drumMachine.appendChild(totalPadContainer);
        totalPadContainer.appendChild(padContainer);
        totalPadContainer.appendChild(padControls);
        padContainer.appendChild(pad);
        padContainer.appendChild(padOptionsContainer);
        padOptionsContainer.appendChild(loadElements.loadBtnLabel);
        loadElements.loadBtnLabel.appendChild(loadElements.loadBtn);
        padOptionsContainer.appendChild(resetSVG);
    }

    buildLoadElements(): any{
        const loadElements: any = {};
        const loadBtnLabel = document.createElement('label');
        const loadBtn = document.createElement('input');

        loadBtnLabel.textContent = 'Load';
        loadBtn.type = 'file';
        loadBtn.classList.add('drum-pad__load--hidden');

        loadBtnLabel.classList.add('drum-pad__load-label')
        this.loadListener(loadBtn);

        loadElements.loadBtn = loadBtn;
        loadElements.loadBtnLabel = loadBtnLabel;

        return loadElements;
    }

    loadListener(elem: Element): void{
        elem.addEventListener('input', (evt) => {
            this.decodeBuffer(evt);
            // we want to se the userloadedAudio blob so that the wavesurfer picks up the new image
        })
    }

    resetListener(elem: Element): void{
        elem.addEventListener('click', (evt) => {
            this.fetchSample();
            // We want to reset the userLoadedAudioBlob to null so that the default sample is used instead for the wave image
        })
    }
    
    swapModalPopUp(): void{
        
        const main = document.querySelector('main');
        const modal = document.createElement('div');
        const modalContent = document.createElement('div');

        modal.classList.add('modal');
        modalContent.classList.add('modal-content');

        modalContent.textContent = 'Press another key with an associated pad to swap with'

        modal.addEventListener('click', () => {
            modal.remove();
            this.sampler.removeReferenceTrigger();
        })

        modal.appendChild(modalContent);
        main.appendChild(modal);
        
    }

    swapListener(elem: Element): void{
        elem.addEventListener('click', () => {
            this.swapModalPopUp();
            this.sampler.setReferenceTrigger(this);
        })
    }
}