import Recorder from './Recorder';
import Sampler from './Sampler';
import AudioTasks from './AudioTasks';


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
  document.querySelector('.load-samples').remove();
  document.querySelector('.options').remove();
  
}