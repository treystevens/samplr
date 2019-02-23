import Sampler from './Sampler';
import AudioTasks from './AudioTasks';


// !!! Safari Issue: AudioContext state is interrupted
const audioContext: AudioContext =  new (window.AudioContext || window.webkitAudioContext)();
const sampler: Sampler = new Sampler(audioContext);
new AudioTasks(audioContext);

const audioFile = document.querySelector('.audio-file')

export let masterStreamNode: any = audioContext.createMediaStreamDestination();

export const scriptNode = audioContext.createScriptProcessor(4096, 1, 1);


audioFile.addEventListener('input', (evt) => {
  sampler.decodeBuffer(evt)
})

if (window.matchMedia('screen and (max-width: 820px)').matches) {
  // document.querySelector('.load-samples').remove();
  document.querySelector('.audio-tasks').remove();


  const message = document.createElement('div');
  message.textContent = 'For a better experience, please use a desktop computer with a keyboard on Google Chrome or Firefox';
  message.classList.add('viewing-message');

  const closeMessage = document.createElement('span');
  closeMessage.textContent = 'x'
  closeMessage.classList.add('viewing-message-close');

  closeMessage.onclick = function(){
    message.remove();
  }

  document.body.appendChild(message);
  message.appendChild(closeMessage);
  
}

document.querySelector('.load-pads').addEventListener('click', (evt) => {
  const padSelection = document.querySelector('.load-drum-machine-options').value;
  sampler.loadPads(padSelection)
})

document.querySelector('.load-keys').addEventListener('click', (evt) => {
  const sampleBankSelection = document.querySelector('.load-sampler-options').value;
  sampler.loadKeys(sampleBankSelection)
})

console.log('dude')