import Trigger from './Trigger';
import Sampler from './Sampler';

export default class Key extends Trigger{ 

    constructor(audioContext: AudioContext, sampler: Sampler, key: string, defaultSampleURL?: string,){
        super(audioContext, sampler, key);
        this.defaultSampleURL = defaultSampleURL;
        this.fetchDefaultSample();  
        this.buildHTML();    
    }
  
    buildHTML(){
       
        const keysContainer = document.querySelector('.keys-container');
        const key = document.createElement('div');        
        let keyClass;
        switch (this.key) {
            case 'w':
                keyClass = 'key__black';
                break;
            case 'e':
                keyClass = 'key__black';
                break;
            case 't':
                keyClass = 'key__black';
                break;
            case 'y':
                keyClass = 'key__black';
                break;
            case 'u':
                keyClass = 'key__black';
                break;
            default:
                keyClass = 'key__white'
                break;
        }

        this.triggerElement = key;
        this.setTriggerElementText();
        this.triggerListener(key);

        key.classList.add(keyClass);

        keysContainer.appendChild(key);
    }
}