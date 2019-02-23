import Trigger from './Trigger';
import Sampler from './Sampler';

enum musicNote{
    a = 'C',
    w = 'C#',
    s = 'D',
    e = 'D#',
    d = 'E',
    f = 'F',
    t = 'F#',
    g = 'G',
    y = 'G#',
    h = 'A',
    u = 'A#',
    j = 'B',
    k = 'C',

}

export default class Key extends Trigger{ 

    constructor(audioContext: AudioContext, sampler: Sampler, key: string, sampleURL?: string,){
        super(audioContext, sampler, key);
        this.sampleURL = sampleURL;
        this.fetchSample();
        this.buildHTML();    
    }
  
    buildHTML(){
       
        const keysContainer = document.querySelector('.keys-container');
        const key = document.createElement('div');  
        const keyboardKey = document.createElement('span');
        const musicKey = document.createElement('span');      
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

        if (!window.matchMedia('screen and (max-width: 820px)').matches) {
            keyboardKey.textContent = String(this.getKey().toUpperCase());
        }

        this.triggerElement = key;

        this.triggerListener(key);
        
        musicKey.textContent = musicNote[this.getKey()];

        key.classList.add(keyClass);
        key.classList.add('key')
        keyboardKey.classList.add('key__keyboard-note')
        musicKey.classList.add('key__music-note')

        keysContainer.appendChild(key);
        key.appendChild(keyboardKey);
        key.appendChild(musicKey);
    }
}