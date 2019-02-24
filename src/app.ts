import Sampler from './Sampler';
import AudioTasks from './AudioTasks';

const UA: string = navigator.userAgent
export const iOS: boolean = !!(UA.match(/iPad|iPhone/i));
const audioContext: AudioContext =  new (window.AudioContext || window.webkitAudioContext)();
const sampler: Sampler = new Sampler(audioContext);
new AudioTasks(audioContext);
const audioFile = document.querySelector('.audio-file');
export let masterStreamNode: any = audioContext.createMediaStreamDestination();
export const scriptNode = audioContext.createScriptProcessor(4096, 1, 1);


// User loaded file into sampler
audioFile.addEventListener('input', (evt) => {
  sampler.decodeBuffer(evt)
})

// Show a fixed message for mobile devices (Current catch-all solution)
if (window.matchMedia('screen and (max-width: 820px)').matches) {
  document.querySelector('.audio-tasks').remove();
  document.querySelector('.slider').remove();

  const fixedMessageContainer = document.createElement('div');

  const message = document.createElement('p');
  message.textContent = 'To use all of the features and for a better experience, please consider using a computer with a keyboard.';
  fixedMessageContainer.classList.add('viewing-message');

  message.classList.add('viewing-message-info')

  const closeMessage = document.createElement('div');
  closeMessage.innerHTML = '<svg enable-background="new 0 0 212.982 212.982" viewBox="0 0 212.982 212.982" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="m131.804 106.491 75.936-75.936c6.99-6.99 6.99-18.323 0-25.312-6.99-6.99-18.322-6.99-25.312 0l-75.937 75.937-75.937-75.938c-6.99-6.99-18.322-6.99-25.312 0-6.989 6.99-6.989 18.323 0 25.312l75.937 75.936-75.937 75.937c-6.989 6.99-6.989 18.323 0 25.312 6.99 6.99 18.322 6.99 25.312 0l75.937-75.937 75.937 75.937c6.989 6.99 18.322 6.99 25.312 0s6.99-18.322 0-25.312z" fill-rule="evenodd"/></svg>'
  
  closeMessage.classList.add('viewing-message-close');

  closeMessage.onclick = function(){
    fixedMessageContainer.remove();
  }

  document.body.appendChild(fixedMessageContainer);
  fixedMessageContainer.appendChild(message);
  fixedMessageContainer.appendChild(closeMessage);
  
}

// Load key with selected sample bank
document.querySelector('.load-keys').addEventListener('click', (evt) => {
  const sampleBankSelection = document.querySelector('.load-sampler-options').value;
  sampler.loadKeys(sampleBankSelection)
})

// Load drum machine pad with selected kit
document.querySelector('.load-pads').addEventListener('click', (evt) => {
  const padSelection = document.querySelector('.load-drum-machine-options').value;
  sampler.loadPads(padSelection)
})

