import Keyboard from './Keyboard';
import Trigger from './Trigger';


export default class Key extends Trigger{ 


    constructor(keyboard: Keyboard, charCode: number, audioContext: AudioContext){
        super(keyboard, charCode, audioContext);          
    }

}