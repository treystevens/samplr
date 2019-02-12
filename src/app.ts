import Keyboard from './Keyboard';

const audioContext: AudioContext = new AudioContext();
const keyboard: Keyboard = new Keyboard(audioContext);
const audioFile = document.querySelector('.audio-file')


// Load audio file into Sampler
audioFile.addEventListener('input', (evt) =>{
    
})

window.addEventListener('keypress', (evt) => {
    keyboard.captureWindowEvent(evt);
})
