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
    k = 'C'
}

export default class Key extends Trigger{ 

    constructor(audioContext: AudioContext, sampler: Sampler, key: string, sampleURL?: string,){
        super(audioContext, sampler, key);
        this.sampleURL = sampleURL;
        this.fetchSample();
        this.buildHTML();    
    }
  
    buildHTML(){
        const keysContainer: HTMLElement = document.querySelector('.keys-container');
        const key: HTMLElement = document.createElement('div');  
        const keyboardKey: HTMLElement = document.createElement('span');
        const musicKey: HTMLElement = document.createElement('span');      
        let keyClass: string;
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

        // Show Keyboard key associated with key if not mobile (catch-all)
        if (!window.matchMedia('screen and (max-width: 820px)').matches) {
            keyboardKey.textContent = String(this.getKey().toUpperCase());
        }

        this.triggerElement = key;
        key.setAttribute('data-key', this.key);
        musicKey.textContent = musicNote[(this.getKey() as any)];

        key.classList.add(keyClass);
        key.classList.add('key')
        key.classList.add('trigger')
        keyboardKey.classList.add('key__keyboard-note')
        musicKey.classList.add('key__music-note')

        keysContainer.appendChild(key);
        key.appendChild(keyboardKey);
        key.appendChild(musicKey);
    }
}