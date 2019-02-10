import Keyboard from './Keyboard';

const audioContext: AudioContext = new AudioContext();
const keyboard: Keyboard = new Keyboard(audioContext);
keyboard.consolePads();


const load = document.querySelector('.load');

load.addEventListener('click', ()=> {
    
    keyboard.pads[104].setKeyCode(117)

    keyboard.consolePads();
})

window.addEventListener('keypress', (evt) => {
    keyboard.captureWindowEvent(evt);
})