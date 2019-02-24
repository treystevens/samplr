/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/app.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/AudioTasks.ts":
/*!***************************!*\
  !*** ./src/AudioTasks.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var app_1 = __webpack_require__(/*! ./app */ "./src/app.ts");
var AudioTasks = (function () {
    function AudioTasks(audioContext) {
        var _this_1 = this;
        this.audioContext = audioContext;
        this.metronomeAudioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.recordBtn = document.querySelector('.audio-tasks__record');
        this.recordingIcon = document.querySelector('.audio-tasks__record-icon');
        this.metronomeBtn = document.querySelector('.audio-tasks__metronome');
        this.currentlyRecording = false;
        this.metronomeRunning = false;
        this.metronomeTimer = this.metronomeTimer.bind(this);
        this.recordBtn.addEventListener('click', function () { return _this_1.toggleRecording(); });
        this.metronomeBtn.addEventListener('click', function () { return _this_1.toggleMetronome(); });
        this.fetchMetronomeSamples();
    }
    AudioTasks.prototype.fetchMetronomeSamples = function () {
        var _this_1 = this;
        var metronome = fetch('https://res.cloudinary.com/dr4eajzak/video/upload/v1550624008/Metronome.wav');
        var metronomeUp = fetch('https://res.cloudinary.com/dr4eajzak/video/upload/v1550624008/MetronomeUp.wav');
        Promise.all([metronome, metronomeUp])
            .then(function (response) {
            var res1 = response[0].arrayBuffer();
            var res2 = response[1].arrayBuffer();
            return Promise.all([res1, res2]);
        })
            .then(function (arrayBuffers) {
            var _this = _this_1;
            _this_1.audioContext.decodeAudioData(arrayBuffers[0], function (buffer) {
                _this.metronomeAudioBuffer = buffer;
            }, function (err) {
                console.log(err);
            });
            _this_1.audioContext.decodeAudioData(arrayBuffers[1], function (buffer) {
                _this.metronomeUpAudioBuffer = buffer;
            }, function (err) {
                console.log(err);
            });
        })["catch"](function (err) {
            console.log(err);
        });
    };
    AudioTasks.prototype.toggleMetronome = function () {
        this.metronomeRunning ? this.metronomeRunning = false : this.metronomeRunning = true;
        if (this.metronomeRunning)
            this.metronomeTimer();
    };
    AudioTasks.prototype.toggleRecording = function () {
        var _this_1 = this;
        this.currentlyRecording ? this.currentlyRecording = false : this.currentlyRecording = true;
        if (this.currentlyRecording) {
            this.prerecord = true;
            this.toggleMetronome();
            this.recordBtn.textContent = 'Counting down...';
        }
        else {
            if (document.querySelector('.audio-tasks__recording-audio')) {
                document.querySelector('.audio-tasks__recording-audio').remove();
                document.querySelector('.audio-tasks__recording-link').remove();
            }
            this.metronomeRunning = false;
            this.recordBtn.textContent = 'Start Recording';
            this.recordingIcon.classList.remove('recording');
            this.mediaRecorder.addEventListener('dataavailable', function (evt) {
                _this_1.createRecordedAudio(evt);
            });
            this.mediaRecorder.stop();
        }
    };
    AudioTasks.prototype.beatsPerMillisecond = function () {
        var setBPM = document.querySelector('.audio-tasks__set-bpm');
        var bpm = Number(setBPM.value);
        if (isNaN(setBPM.value) || setBPM.value === '') {
            bpm = 120;
            setBPM.value = "" + bpm;
        }
        var msPerMinute = 60000;
        var bpms = msPerMinute / bpm;
        return bpms;
    };
    AudioTasks.prototype.startRecording = function () {
        var options = {
            audioBitsPerSecond: this.audioContext.sampleRate,
            mimeType: 'audio/webm\;codecs=opus'
        };
        app_1.masterStreamNode = this.audioContext.createMediaStreamDestination();
        this.mediaRecorder = new MediaRecorder(app_1.masterStreamNode.stream, options);
        this.mediaRecorder.start();
        this.recordingIcon.classList.add('recording');
        this.recordBtn.textContent = 'Stop Recording';
    };
    AudioTasks.prototype.metronomeTimer = function () {
        var bpms = this.beatsPerMillisecond();
        var metronome = setInterval(metronomeCount, bpms);
        var _this = this;
        var count = 1;
        this.metronomeBtn.textContent = 'Stop Metronome';
        function metronomeCount() {
            var metronomeDisplay = document.querySelector('.audio-tasks__metronome-display');
            if (count === 5 && _this.prerecord) {
                _this.prerecord = false;
                _this.startRecording();
            }
            if (count === 5) {
                count = 1;
            }
            ;
            if (!_this.metronomeRunning) {
                metronomeDisplay.textContent = '-';
                _this.metronomeBtn.textContent = 'Start Metronome';
                clearInterval(metronome);
                return;
            }
            _this.playMetronome(count);
            if (_this.prerecord)
                metronomeDisplay.textContent = "-" + count;
            else {
                metronomeDisplay.textContent = "" + count;
            }
            count++;
        }
    };
    AudioTasks.prototype.playMetronome = function (count) {
        this.audioSource = this.metronomeAudioContext.createBufferSource();
        if (count === 1)
            this.audioSource.buffer = this.metronomeUpAudioBuffer;
        else {
            this.audioSource.buffer = this.metronomeAudioBuffer;
        }
        this.audioSource.connect(this.metronomeAudioContext.destination);
        this.audioSource.start();
    };
    AudioTasks.prototype.createRecordedAudio = function (evt) {
        var url = (window.URL || window.webkitURL).createObjectURL(evt.data);
        var link = window.document.createElement('a');
        var click = document.createEvent("Event");
        var audio = document.createElement('audio');
        var audioTasks = document.querySelector('.audio-tasks');
        link.href = url;
        link.download = 'recording.ogg';
        click.initEvent("click", true, true);
        link.dispatchEvent(click);
        link.textContent = 'Download Recording (.OGG)';
        audio.classList.add('audio-tasks__recording-audio');
        link.classList.add('audio-tasks__recording-link');
        audio.controls = true;
        audio.src = url;
        audioTasks.appendChild(audio);
        audioTasks.appendChild(link);
    };
    return AudioTasks;
}());
exports["default"] = AudioTasks;


/***/ }),

/***/ "./src/Key.ts":
/*!********************!*\
  !*** ./src/Key.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Trigger_1 = __webpack_require__(/*! ./Trigger */ "./src/Trigger.ts");
var musicNote;
(function (musicNote) {
    musicNote["a"] = "C";
    musicNote["w"] = "C#";
    musicNote["s"] = "D";
    musicNote["e"] = "D#";
    musicNote["d"] = "E";
    musicNote["f"] = "F";
    musicNote["t"] = "F#";
    musicNote["g"] = "G";
    musicNote["y"] = "G#";
    musicNote["h"] = "A";
    musicNote["u"] = "A#";
    musicNote["j"] = "B";
    musicNote["k"] = "C";
})(musicNote || (musicNote = {}));
var Key = (function (_super) {
    __extends(Key, _super);
    function Key(audioContext, sampler, key, sampleURL) {
        var _this = _super.call(this, audioContext, sampler, key) || this;
        _this.sampleURL = sampleURL;
        _this.fetchSample();
        _this.buildHTML();
        return _this;
    }
    Key.prototype.buildHTML = function () {
        var keysContainer = document.querySelector('.keys-container');
        var key = document.createElement('div');
        var keyboardKey = document.createElement('span');
        var musicKey = document.createElement('span');
        var keyClass;
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
                keyClass = 'key__white';
                break;
        }
        if (!window.matchMedia('screen and (max-width: 820px)').matches) {
            keyboardKey.textContent = String(this.getKey().toUpperCase());
        }
        this.triggerElement = key;
        key.setAttribute('data-key', this.key);
        musicKey.textContent = musicNote[this.getKey()];
        key.classList.add(keyClass);
        key.classList.add('key');
        key.classList.add('trigger');
        keyboardKey.classList.add('key__keyboard-note');
        musicKey.classList.add('key__music-note');
        keysContainer.appendChild(key);
        key.appendChild(keyboardKey);
        key.appendChild(musicKey);
    };
    return Key;
}(Trigger_1["default"]));
exports["default"] = Key;


/***/ }),

/***/ "./src/Pad.ts":
/*!********************!*\
  !*** ./src/Pad.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Trigger_1 = __webpack_require__(/*! ./Trigger */ "./src/Trigger.ts");
var app_1 = __webpack_require__(/*! ./app */ "./src/app.ts");
var Pad = (function (_super) {
    __extends(Pad, _super);
    function Pad(audioContext, sampler, key, sampleURL) {
        var _this = _super.call(this, audioContext, sampler, key) || this;
        _this.sampleURL = sampleURL;
        _this.fetchSample();
        _this.buildHTML();
        return _this;
    }
    Pad.prototype.buildHTML = function () {
        var drumMachine = document.querySelector('.drum-machine');
        var totalPadContainer = document.createElement('div');
        var padContainer = document.createElement('div');
        var swapKey = document.createElement('span');
        var pad = document.createElement('div');
        var resetSVG = document.createElement('div');
        var loadElements = this.buildLoadElements();
        var padControls = document.createElement('div');
        var padOptionsContainer = document.createElement('div');
        swapKey.textContent = 'Swap Key';
        resetSVG.innerHTML = '<svg class="drum-pad__reset-svg" height="87" viewBox="0 0 106 87" width="106" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" transform="translate(-2 -4)"><path d="m90.7888544 3.57770876 14.1311676 28.26233434c.493978.987957.093529 2.1893031-.894428 2.6832816-.752359.3761797-1.659688.2413995-2.270214-.3372316l-12.75538-12.0890162-12.7553797 12.0890162c-.8017091.7598265-2.0675838.7258739-2.8274103-.0758353-.5786311-.610526-.7134113-1.5178552-.3372316-2.2702147l14.1311672-28.26233434c.4939785-.98795699 1.6953246-1.38840568 2.6832816-.89442719.3870548.19352741.7008998.50737239.8944272.89442719z" fill="#979797" transform="matrix(0 1 -1 0 110 -68)"/><path d="m23.0466669 56.9775043 14.1311672 28.2623344c.4939785.987957.0935298 2.1893031-.8944272 2.6832816-.7523595.3761797-1.6596887.2413995-2.2702147-.3372316l-12.7553797-12.0890163-12.7553797 12.0890163c-.80170914.7598264-2.06758385.7258738-2.8274103-.0758353-.57863106-.610526-.71341129-1.5178553-.33723157-2.2702147l14.13116717-28.2623344c.4939785-.987957 1.6953246-1.3884057 2.6832816-.8944272.3870548.1935274.7008998.5073724.8944272.8944272z" fill="#979797" transform="matrix(0 -1 1 0 -53.142 95.658)"/><path d="m16 54.7005768v-4.871361-11.825c0-17.7293977 19.6665668-17 30.3925781-17h20.9667969" stroke="#979797" stroke-width="5"/><path d="m41.8984375 74.3997956v-4.871361-11.825c0-17.7293978 19.6665668-17 30.3925781-17h20.9667969" stroke="#979797" stroke-width="5" transform="matrix(-1 0 0 -1 135.156 115.1)"/><g fill="#979797"><path d="m22 71h16v6h-16z"/><path d="m72 18h16v6h-16z"/></g></g></svg>';
        resetSVG.classList.add('drum-pad__reset');
        padOptionsContainer.classList.add('drum-pad__options-container');
        padContainer.classList.add('drum-pad__pad-container');
        this.resetListener(resetSVG);
        this.swapListener(swapKey);
        this.triggerElement = pad;
        pad.setAttribute('data-key', this.key);
        totalPadContainer.classList.add('drum-pad');
        pad.classList.add('drum-pad__pad');
        pad.classList.add('trigger');
        swapKey.classList.add('drum-pad__swap');
        if (!window.matchMedia('screen and (max-width: 820px)').matches) {
            this.setTriggerElementText();
            padContainer.appendChild(swapKey);
        }
        drumMachine.appendChild(totalPadContainer);
        totalPadContainer.appendChild(padContainer);
        totalPadContainer.appendChild(padControls);
        padContainer.appendChild(pad);
        padContainer.appendChild(padOptionsContainer);
        if (!app_1.iOS) {
            padOptionsContainer.appendChild(loadElements.loadBtnLabel);
            loadElements.loadBtnLabel.appendChild(loadElements.loadBtn);
            padOptionsContainer.appendChild(resetSVG);
        }
    };
    Pad.prototype.buildLoadElements = function () {
        var loadElements = {};
        var loadBtnLabel = document.createElement('label');
        var loadBtn = document.createElement('input');
        loadBtnLabel.textContent = 'Load';
        loadBtn.type = 'file';
        loadBtn.classList.add('drum-pad__load--hidden');
        loadBtnLabel.classList.add('drum-pad__load-label');
        this.loadListener(loadBtn);
        loadElements.loadBtn = loadBtn;
        loadElements.loadBtnLabel = loadBtnLabel;
        return loadElements;
    };
    Pad.prototype.loadListener = function (elem) {
        var _this = this;
        elem.addEventListener('change', function (evt) {
            _this.decodeBuffer(evt);
        });
    };
    Pad.prototype.resetListener = function (elem) {
        var _this = this;
        elem.addEventListener('click', function (evt) {
            _this.fetchSample();
        });
    };
    Pad.prototype.swapModalPopUp = function () {
        var _this = this;
        var main = document.querySelector('main');
        var modal = document.createElement('div');
        var modalContent = document.createElement('div');
        modal.classList.add('modal');
        modalContent.classList.add('modal-content');
        modalContent.textContent = 'Press another key with an associated pad to swap with';
        modal.addEventListener('click', function () {
            modal.remove();
            _this.sampler.removeReferenceTrigger();
        });
        modal.appendChild(modalContent);
        main.appendChild(modal);
    };
    Pad.prototype.swapListener = function (elem) {
        var _this = this;
        elem.addEventListener('click', function () {
            _this.swapModalPopUp();
            _this.sampler.setReferenceTrigger(_this);
        });
    };
    return Pad;
}(Trigger_1["default"]));
exports["default"] = Pad;


/***/ }),

/***/ "./src/Sampler.ts":
/*!************************!*\
  !*** ./src/Sampler.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var Pad_1 = __webpack_require__(/*! ./Pad */ "./src/Pad.ts");
var Key_1 = __webpack_require__(/*! ./Key */ "./src/Key.ts");
var drumKitSamples_1 = __webpack_require__(/*! ./samples/drumKitSamples */ "./src/samples/drumKitSamples.ts");
var samplerSamples_1 = __webpack_require__(/*! ./samples/samplerSamples */ "./src/samples/samplerSamples.ts");
var app_1 = __webpack_require__(/*! ./app */ "./src/app.ts");
var Slider_1 = __webpack_require__(/*! ./Slider */ "./src/Slider.ts");
var validPadKeys;
(function (validPadKeys) {
    validPadKeys[validPadKeys["z"] = 1] = "z";
    validPadKeys[validPadKeys["x"] = 2] = "x";
    validPadKeys[validPadKeys["c"] = 3] = "c";
    validPadKeys[validPadKeys["v"] = 4] = "v";
    validPadKeys[validPadKeys["b"] = 5] = "b";
    validPadKeys[validPadKeys["n"] = 6] = "n";
    validPadKeys[validPadKeys["m"] = 7] = "m";
    validPadKeys[validPadKeys[","] = 8] = ",";
})(validPadKeys || (validPadKeys = {}));
var Sampler = (function () {
    function Sampler(audioContext) {
        var _this_1 = this;
        this.swapFlag = false;
        this.triggerSet = {};
        this.audioContext = audioContext;
        this.triggerBuffer = [];
        this.triggerBufferCount = 0;
        this.initKeys();
        this.initPads();
        this.activeKey = this.triggerSet['a'];
        this.slider = new Slider_1["default"]();
        this.initSlidersForTriggers();
        window.addEventListener('keydown', function (evt) {
            _this_1.captureWindowEvent(evt);
        });
        window.addEventListener('keyup', function (evt) {
            if (_this_1.triggerSet[evt.key]) {
                _this_1.triggerSet[evt.key].removeActiveState();
                return;
            }
            if (document.querySelector('.audio-tasks__stop').classList.contains('highlight')) {
                document.querySelector('.audio-tasks__stop').classList.remove('highlight');
            }
        });
        if (app_1.iOS) {
            window.addEventListener('touchstart', function (evt) {
                if (evt.target.classList.contains('trigger')) {
                    _this_1.tapSound(evt);
                }
            }, false);
        }
        else {
            window.addEventListener('click', function (evt) {
                if (evt.target.classList.contains('trigger')) {
                    _this_1.tapSound(evt);
                }
            }, false);
        }
    }
    Sampler.prototype.setActiveKey = function (t) {
        this.activeKey = t;
    };
    Sampler.prototype.captureWindowEvent = function (evt) {
        if (this.swapFlag && validPadKeys[evt.key] && isNaN(Number(evt.key))) {
            this.removeModal();
            this.refTrigger.setKey(evt.key);
            this.refTrigger = null;
            this.toggleSwapFlag();
            return;
        }
        if (this.swapFlag) {
            this.swapFlag = false;
            this.removeModal();
            return;
        }
        if (this.triggerSet[evt.key]) {
            var tappedTrigger = this.triggerSet[evt.key];
            tappedTrigger.addActiveState();
            this.activeKey.setActive(false);
            this.activeKey = tappedTrigger;
            this.slider.setActiveTrigger(tappedTrigger);
            tappedTrigger.setActive(true);
            tappedTrigger.play();
            this.loadTriggerBuffer(tappedTrigger);
            return;
        }
        if (evt.key === 'Shift') {
            document.querySelector('.audio-tasks__stop').classList.add('highlight');
            this.stopSounds();
        }
    };
    Sampler.prototype.tapSound = function (evt) {
        var key = evt.target.dataset.key;
        var tappedTrigger = this.triggerSet[key];
        this.activeKey.setActive(false);
        this.activeKey = tappedTrigger;
        this.slider.setActiveTrigger(tappedTrigger);
        tappedTrigger.setActive(true);
        tappedTrigger.play();
        this.loadTriggerBuffer(tappedTrigger);
    };
    Sampler.prototype.stopSounds = function () {
        for (var trigger in this.triggerSet) {
            this.triggerSet[trigger].stopSound();
        }
    };
    Sampler.prototype.loadTriggerBuffer = function (t) {
        if (this.triggerBufferCount > 15)
            this.triggerBufferCount = 0;
        this.triggerBuffer[this.triggerBufferCount] = t;
        this.triggerBufferCount++;
    };
    Sampler.prototype.initPads = function () {
        for (var i = 0; i < 8; i++) {
            var pad = new Pad_1["default"](this.audioContext, this, drumKitSamples_1.hiphopKit[i].key, drumKitSamples_1.hiphopKit[i].url);
            this.triggerSet[pad.getKey()] = pad;
        }
    };
    Sampler.prototype.initKeys = function () {
        for (var i = 0; i < 13; i++) {
            var key = new Key_1["default"](this.audioContext, this, samplerSamples_1.electricPiano[i].key, samplerSamples_1.electricPiano[i].url);
            this.triggerSet[key.getKey()] = key;
        }
    };
    Sampler.prototype.setTrigger = function (trigger, prevKey) {
        delete this.triggerSet[prevKey];
        if (this.triggerSet[trigger.getKey()]) {
            var swapKeyToTrigger = this.triggerSet[trigger.getKey()];
            swapKeyToTrigger.setKey(prevKey);
            this.triggerSet[trigger.getKey()] = trigger;
            this.triggerSet[swapKeyToTrigger.getKey()] = swapKeyToTrigger;
            var swapKeyFromTriggerElement = document.querySelector("[data-key=" + prevKey + "]");
            var swapKeyToTriggerElement = document.querySelector("[data-key=" + trigger.getKey() + "]");
            swapKeyFromTriggerElement.setAttribute('data-key', "" + prevKey);
            swapKeyToTriggerElement.setAttribute('data-key', "" + trigger.getKey());
        }
        else {
            this.triggerSet[trigger.getKey()] = trigger;
        }
    };
    Sampler.prototype.setReferenceTrigger = function (trigger) {
        this.refTrigger = trigger;
        this.toggleSwapFlag();
    };
    Sampler.prototype.removeReferenceTrigger = function () {
        this.refTrigger = null;
        this.toggleSwapFlag();
    };
    Sampler.prototype.toggleSwapFlag = function () {
        this.swapFlag ? this.swapFlag = false : this.swapFlag = true;
    };
    Sampler.prototype.decodeBuffer = function (evt) {
        var _this = this;
        var fileReader = new FileReader();
        fileReader.readAsArrayBuffer(evt.target.files[0]);
        fileReader.onload = function () {
            _this.audioContext.decodeAudioData(fileReader.result, function (buffer) {
                _this.audioBuffer = buffer;
                app_1.wavesurfer.loadBlob(evt.target.files[0]);
                for (var trigger in _this.triggerSet) {
                    if (!validPadKeys[trigger]) {
                        _this.triggerSet[trigger].setAudioBuffer(buffer);
                        _this.triggerSet[trigger].setUserLoadedAudioBlob(evt.target.files[0]);
                    }
                }
            }, function (err) {
                console.log(err);
            });
        };
    };
    Sampler.prototype.loadPads = function (drumKit) {
        var load;
        switch (drumKit) {
            case 'hip-hop':
                load = drumKitSamples_1.hiphopKit;
                break;
            case 'house':
                load = drumKitSamples_1.houseKit;
                break;
            case 'live':
                load = drumKitSamples_1.liveKit;
                break;
            case 'african':
                load = drumKitSamples_1.africanKit;
                break;
            case 'trap':
                load = drumKitSamples_1.trapKit;
                break;
            default:
                load = drumKitSamples_1.hiphopKit;
                break;
        }
        for (var i = 0; i < load.length; i++) {
            var padKey = load[i].key;
            this.triggerSet[padKey].setSampleURL(load[i].url);
            this.triggerSet[padKey].fetchSample();
        }
    };
    Sampler.prototype.loadKeys = function (sampleBank) {
        var load;
        switch (sampleBank) {
            case 'electric-piano':
                load = samplerSamples_1.electricPiano;
                break;
            case 'grand-piano':
                load = samplerSamples_1.grandPiano;
                break;
            case 'organ':
                load = samplerSamples_1.organ;
                break;
            case 'horns':
                load = samplerSamples_1.horns;
                break;
            case 'bass-guitar':
                load = samplerSamples_1.bass;
                break;
            case 'guitar':
                load = samplerSamples_1.guitar;
                break;
            case 'moog-bass':
                load = samplerSamples_1.moogBass;
                break;
            default:
                load = samplerSamples_1.electricPiano;
                break;
        }
        for (var i = 0; i < load.length; i++) {
            var keyKey = load[i].key;
            this.triggerSet[keyKey].setSampleURL(load[i].url);
            this.triggerSet[keyKey].fetchSample();
        }
    };
    Sampler.prototype.initSlidersForTriggers = function () {
        for (var i in this.triggerSet) {
            this.triggerSet[i].initSliders();
        }
    };
    Sampler.prototype.removeModal = function () {
        if (document.querySelector('.modal'))
            document.querySelector('.modal').remove();
    };
    return Sampler;
}());
exports["default"] = Sampler;


/***/ }),

/***/ "./src/Slider.ts":
/*!***********************!*\
  !*** ./src/Slider.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var Slider = (function () {
    function Slider() {
        var _this = this;
        this.active = false;
        this.startSlider = document.querySelector('.slider__handle--start');
        this.endSlider = document.querySelector('.slider__handle--end');
        var sliderDiv = document.querySelector('.slider');
        var bodyRect = document.body.getBoundingClientRect();
        var elemRect = sliderDiv.getBoundingClientRect();
        this.sliderDivRect = sliderDiv.getBoundingClientRect();
        this.halfSliderWidth = this.startSlider.offsetWidth / 2;
        this.offset = elemRect.left - bodyRect.left;
        this.startSlider.style.left = 0 - (this.halfSliderWidth) + "px";
        this.endSlider.style.left = this.sliderDivRect.width - (this.halfSliderWidth) + "px";
        sliderDiv.addEventListener("touchstart", function (evt) { return _this.dragStart(evt); }, false);
        sliderDiv.addEventListener("touchend", function () { return _this.dragEnd(); }, false);
        sliderDiv.addEventListener("touchmove", function (evt) { return _this.moveSlider(evt); }, false);
        sliderDiv.addEventListener("mousedown", function (evt) { return _this.dragStart(evt); }, false);
        sliderDiv.addEventListener("mouseup", function () { return _this.dragEnd(); }, false);
        sliderDiv.addEventListener("mousemove", function (evt) { return _this.moveSlider(evt); }, false);
    }
    Slider.prototype.dragStart = function (evt) {
        if (evt.target === this.startSlider || evt.target === this.endSlider) {
            this.active = true;
        }
    };
    Slider.prototype.dragEnd = function () {
        this.active = false;
    };
    Slider.prototype.moveSlider = function (evt) {
        if (this.active) {
            if (evt.target === this.startSlider) {
                var x = evt.clientX - this.offset - 22;
                if (x >= 0 - this.halfSliderWidth && x < parseInt(this.endSlider.style.left)) {
                    var left = evt.clientX - this.offset - 20 + 'px';
                    evt.target.style.left = left;
                    this.activeTrigger.setStartSliderPos(parseInt(left));
                }
            }
            if (evt.target === this.endSlider) {
                var x = evt.clientX - this.offset - 22;
                if (x > parseInt(this.startSlider.style.left) && x <= this.sliderDivRect.width - this.halfSliderWidth) {
                    var left = evt.clientX - this.offset - 20 + 'px';
                    evt.target.style.left = left;
                    this.activeTrigger.setEndSliderPos(parseInt(left));
                }
            }
        }
    };
    Slider.prototype.setStartSlider = function (leftPos) {
        this.startSlider.style.left = leftPos + "px";
    };
    Slider.prototype.setEndSlider = function (leftPos) {
        this.endSlider.style.left = leftPos + "px";
    };
    Slider.prototype.setActiveTrigger = function (t) {
        this.activeTrigger = t;
        this.active = false;
        this.setStartSlider(this.activeTrigger.getStartSliderPos());
        this.setEndSlider(this.activeTrigger.getEndSliderPos());
    };
    return Slider;
}());
exports["default"] = Slider;


/***/ }),

/***/ "./src/Trigger.ts":
/*!************************!*\
  !*** ./src/Trigger.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var app_1 = __webpack_require__(/*! ./app */ "./src/app.ts");
var Trigger = (function () {
    function Trigger(audioContext, sampler, key) {
        this.sampler = sampler;
        this.key = key;
        this.audioContext = audioContext;
        this.audioSourceRunning = false;
        this.pitch = 0;
        this.gain = 0;
        this.q = 0;
        this.frequency = 20000;
        this.filterOption = 'lowpass';
        this.active = false;
        this.userLoadedAudioBlob = null;
        this.initAudioControlSelectors();
        this.initAudioControlListeners();
    }
    Trigger.prototype.setActive = function (active) {
        var _this_1 = this;
        this.active = active;
        if (this.active) {
            this.pitchSlider.valueAsNumber = this.pitch;
            this.pitchElementInput.value = String(this.pitch);
            this.gainSlider.valueAsNumber = this.gain;
            this.gainElementInput.value = String(this.gain);
            this.frequencySlider.valueAsNumber = this.frequency;
            this.frequencyElementInput.value = String(this.frequency);
            this.qSlider.valueAsNumber = this.q;
            this.qElementInput.value = String(this.q);
            this.filterOptionList.forEach(function (option) {
                if (option.value !== _this_1.filterOption) {
                    option.checked = false;
                }
                else {
                    option.checked = true;
                }
            });
        }
    };
    Trigger.prototype.initAudioControlSelectors = function () {
        this.gainElementInput = document.querySelector('.sampler__gain-text');
        this.gainSlider = document.querySelector('.sampler__gain-slider');
        this.pitchElementInput = document.querySelector('.sampler__pitch-text');
        this.pitchSlider = document.querySelector('.sampler__pitch-slider');
        this.frequencyElementInput = document.querySelector('.sampler__frequency-text');
        this.frequencySlider = document.querySelector('.sampler__frequency-slider');
        this.qElementInput = document.querySelector('.sampler__q-text');
        this.qSlider = document.querySelector('.sampler__q-slider');
        this.filterOptionList = Array.from(document.querySelectorAll('.sampler__filter-option'));
    };
    Trigger.prototype.initAudioControlListeners = function () {
        var _this_1 = this;
        this.gainSlider.addEventListener('input', function (evt) {
            if (_this_1.active) {
                _this_1.gain = evt.target.value;
                _this_1.gainElementInput.value = String(_this_1.gain);
            }
        });
        this.gainElementInput.addEventListener('input', function (evt) {
            if (_this_1.active) {
                var value = Number(evt.target.value);
                _this_1.gain = value;
                if (isNaN(value))
                    _this_1.gain = 0;
                if (value > 6)
                    _this_1.gain = 6;
                if (value < -70)
                    _this_1.gain = -70;
                _this_1.gainSlider.valueAsNumber = _this_1.gain;
            }
        });
        this.pitchSlider.addEventListener('input', function (evt) {
            if (_this_1.active) {
                _this_1.pitch = evt.target.value;
                _this_1.pitchElementInput.value = String(_this_1.pitch);
            }
        });
        this.pitchElementInput.addEventListener('input', function (evt) {
            var value = Number(evt.target.value);
            _this_1.pitch = value;
            if (value > 12)
                _this_1.pitch = 12;
            if (value < -12)
                _this_1.pitch = -12;
            _this_1.pitchSlider.valueAsNumber = _this_1.pitch;
        });
        this.frequencySlider.addEventListener('input', function (evt) {
            if (_this_1.active) {
                _this_1.frequency = evt.target.value;
                _this_1.frequencyElementInput.value = String(_this_1.frequency);
            }
        });
        this.frequencyElementInput.addEventListener('input', function (evt) {
            var value = Number(evt.target.value);
            _this_1.frequency = value;
            if (value > 20000)
                _this_1.frequency = 20000;
            if (value < 26)
                _this_1.frequency = 26;
            _this_1.frequencySlider.valueAsNumber = _this_1.frequency;
        });
        this.qSlider.addEventListener('input', function (evt) {
            if (_this_1.active) {
                _this_1.q = evt.target.value;
                _this_1.qElementInput.value = String(_this_1.q);
            }
        });
        this.qElementInput.addEventListener('input', function (evt) {
            var value = Number(evt.target.value);
            _this_1.q = value;
            if (value > 16)
                _this_1.q = 16;
            if (value < 0)
                _this_1.q = 0;
            _this_1.qSlider.valueAsNumber = _this_1.q;
        });
        this.filterOptionList.forEach(function (option) {
            if (option.value === 'lowpass')
                _this_1.userSelectedFilterOption = option;
            option.addEventListener('input', function (evt) {
                if (_this_1.active) {
                    _this_1.userSelectedFilterOption.checked = false;
                    _this_1.filterOption = evt.target.value;
                    _this_1.userSelectedFilterOption = option;
                }
            });
        });
    };
    Trigger.prototype.getKey = function () {
        return this.key;
    };
    Trigger.prototype.getAudioBuffer = function () {
        return this.audioBuffer;
    };
    Trigger.prototype.setKey = function (key) {
        var prevKey = this.key;
        this.key = key;
        this.sampler.setTrigger(this, prevKey);
        this.setTriggerElementText();
    };
    Trigger.prototype.setAudioBuffer = function (audioBuffer) {
        this.audioBuffer = audioBuffer;
    };
    Trigger.prototype.establishAudioSource = function () {
        var gainNode = this.audioContext.createGain();
        var gainLevel = Math.pow(10, this.gain / 20);
        var biquadFilter = this.audioContext.createBiquadFilter();
        this.audioSource = this.audioContext.createBufferSource();
        this.audioSource.buffer = this.audioBuffer;
        gainNode.gain.value = gainLevel;
        biquadFilter.type = this.filterOption;
        biquadFilter.frequency.value = this.frequency;
        biquadFilter.Q.value = this.q;
        if (this.audioSource.detune !== undefined) {
            this.audioSource.detune.value = this.pitch * 100;
        }
        this.audioSource.connect(gainNode);
        gainNode.connect(biquadFilter);
        biquadFilter.connect(this.audioContext.destination);
        biquadFilter.connect(app_1.masterStreamNode);
    };
    Trigger.prototype.play = function () {
        this.establishAudioSource();
        if (this.userLoadedAudioBlob)
            app_1.wavesurfer.loadBlob(this.userLoadedAudioBlob);
        else {
            app_1.wavesurfer.load(this.sampleURL);
        }
        if (document.querySelector('.slider')) {
            var _a = this.audioPlayRange(), startTime = _a[0], duration = _a[1];
            this.audioSource.start(0, startTime, duration);
        }
        else {
            this.audioSource.start();
        }
        this.audioSourceRunning = true;
        var _this = this;
        this.audioSource.onended = function () {
            _this.audioSourceRunning = false;
        };
    };
    Trigger.prototype.audioPlayRange = function () {
        var startSlider = document.querySelector('.slider__handle--start');
        var halfSliderWidth = startSlider.offsetWidth / 2;
        var songDuration = this.audioSource.buffer.duration;
        var sliderWidth = document.querySelector('.slider').offsetWidth;
        var pixelsPerSecond = sliderWidth / songDuration;
        var startTime = (this.startSliderPos + halfSliderWidth) / pixelsPerSecond;
        var endTime = (this.endSliderPos + halfSliderWidth) / pixelsPerSecond;
        var duration = endTime - startTime;
        return [startTime, duration];
    };
    Trigger.prototype.stopSound = function () {
        if (this.audioSourceRunning)
            this.audioSource.stop();
    };
    Trigger.prototype.setTriggerElementText = function () {
        var asciiCode = this.key.charCodeAt(0);
        if (asciiCode >= 97 && asciiCode <= 122) {
            this.triggerElement.textContent = String.fromCharCode(asciiCode - 32);
        }
        else {
            this.triggerElement.textContent = this.key;
        }
    };
    Trigger.prototype.setUserLoadedAudioBlob = function (blob) {
        this.userLoadedAudioBlob = blob;
    };
    Trigger.prototype.decodeBuffer = function (evt) {
        var _this = this;
        var fileReader = new FileReader();
        this.setUserLoadedAudioBlob(evt.target.files[0]);
        fileReader.readAsArrayBuffer(evt.target.files[0]);
        fileReader.onload = function () {
            _this.audioContext.decodeAudioData(fileReader.result, function (buffer) {
                _this.setAudioBuffer(buffer);
                _this.establishAudioSource();
            }, function (err) {
                console.log(err);
            });
        };
    };
    Trigger.prototype.fetchSample = function () {
        var _this_1 = this;
        this.setUserLoadedAudioBlob(null);
        fetch(this.sampleURL)
            .then(function (response) { return response.arrayBuffer(); })
            .then(function (arrayBuffer) {
            var _this = _this_1;
            _this_1.audioContext.decodeAudioData(arrayBuffer, function (buffer) {
                _this.setAudioBuffer(buffer);
                _this.establishAudioSource();
            }, function (err) {
                return Promise.reject(err);
            });
        })["catch"](function (err) {
            console.log(err);
        });
    };
    Trigger.prototype.setSampleURL = function (url) {
        this.sampleURL = url;
    };
    Trigger.prototype.addActiveState = function () {
        this.triggerElement.classList.add('highlight');
    };
    Trigger.prototype.removeActiveState = function () {
        this.triggerElement.classList.remove('highlight');
    };
    Trigger.prototype.setStartSliderPos = function (leftPos) {
        this.startSliderPos = leftPos;
    };
    Trigger.prototype.setEndSliderPos = function (leftPos) {
        this.endSliderPos = leftPos;
    };
    Trigger.prototype.getStartSliderPos = function () {
        return this.startSliderPos;
    };
    Trigger.prototype.getEndSliderPos = function () {
        return this.endSliderPos;
    };
    Trigger.prototype.initSliders = function () {
        this.startSliderPos = parseInt(document.querySelector('.slider__handle--start').style.left);
        this.endSliderPos = parseInt(document.querySelector('.slider__handle--end').style.left);
    };
    return Trigger;
}());
exports["default"] = Trigger;


/***/ }),

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var Sampler_1 = __webpack_require__(/*! ./Sampler */ "./src/Sampler.ts");
var AudioTasks_1 = __webpack_require__(/*! ./AudioTasks */ "./src/AudioTasks.ts");
var UA = navigator.userAgent;
exports.iOS = !!(UA.match(/iPad|iPhone/i));
var audioContext = new (window.AudioContext || window.webkitAudioContext)();
var sampler = new Sampler_1["default"](audioContext);
new AudioTasks_1["default"](audioContext);
var audioFile = document.querySelector('.audio-file');
exports.masterStreamNode = audioContext.createMediaStreamDestination();
exports.scriptNode = audioContext.createScriptProcessor(4096, 1, 1);
exports.wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: 'orange',
    progressColor: 'purple',
    height: 80,
    audioContext: audioContext
});
audioFile.addEventListener('change', function (evt) {
    sampler.decodeBuffer(evt);
});
if (window.matchMedia('screen and (max-width: 820px)').matches) {
    document.querySelector('.audio-tasks').remove();
    document.querySelector('.slider').remove();
    var fixedMessageContainer_1 = document.createElement('div');
    var message = document.createElement('p');
    message.textContent = 'To use all of the features of this website and for a better experience, use a computer with a keyboard.';
    fixedMessageContainer_1.classList.add('viewing-message');
    message.classList.add('viewing-message-info');
    var closeMessage = document.createElement('div');
    closeMessage.innerHTML = '<svg enable-background="new 0 0 212.982 212.982" viewBox="0 0 212.982 212.982" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="m131.804 106.491 75.936-75.936c6.99-6.99 6.99-18.323 0-25.312-6.99-6.99-18.322-6.99-25.312 0l-75.937 75.937-75.937-75.938c-6.99-6.99-18.322-6.99-25.312 0-6.989 6.99-6.989 18.323 0 25.312l75.937 75.936-75.937 75.937c-6.989 6.99-6.989 18.323 0 25.312 6.99 6.99 18.322 6.99 25.312 0l75.937-75.937 75.937 75.937c6.989 6.99 18.322 6.99 25.312 0s6.99-18.322 0-25.312z" fill-rule="evenodd"/></svg>';
    closeMessage.classList.add('viewing-message-close');
    closeMessage.onclick = function () {
        fixedMessageContainer_1.remove();
    };
    document.body.appendChild(fixedMessageContainer_1);
    fixedMessageContainer_1.appendChild(message);
    fixedMessageContainer_1.appendChild(closeMessage);
}
document.querySelector('.load-keys').addEventListener('click', function (evt) {
    var sampleBankSelection = document.querySelector('.load-sampler-options').value;
    sampler.loadKeys(sampleBankSelection);
});
document.querySelector('.load-pads').addEventListener('click', function (evt) {
    var padSelection = document.querySelector('.load-drum-machine-options').value;
    sampler.loadPads(padSelection);
});


/***/ }),

/***/ "./src/samples/drumKitSamples.ts":
/*!***************************************!*\
  !*** ./src/samples/drumKitSamples.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.hiphopKit = [
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1549691476/Snare_178.wav',
        key: 'z'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550706370/samples/hiphop/Clap5.wav',
        key: 'x'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550706370/samples/hiphop/Open_HiH_1.wav',
        key: 'c'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550706370/samples/hiphop/Snare_148.wav',
        key: 'v'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550706370/samples/hiphop/MultiClick5.wav',
        key: 'b'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1549697588/Hat_67.wav',
        key: 'n'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550706370/samples/hiphop/Dilla_Kk_6.wav',
        key: 'm'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550706370/samples/hiphop/KICK_ORDEAL.wav',
        key: ','
    }
];
exports.trapKit = [
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550706114/samples/trap/Snare_9.wav',
        key: 'z'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550705245/samples/trap/Rim_10.wav',
        key: 'x'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550705709/samples/trap/808_5.wav',
        key: 'c'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550706114/samples/trap/Snare_47.wav',
        key: 'v'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550705246/samples/trap/Hat_Open_13.wav',
        key: 'b'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550705245/samples/trap/Percs8.wav',
        key: 'n'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550705247/samples/trap/Kick_18.wav',
        key: 'm'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550705245/samples/trap/Kick_39.wav',
        key: ','
    }
];
exports.houseKit = [
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550706543/samples/house/SH_Snare_126.wav',
        key: 'z'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550706543/samples/house/SH_Hi_Hat_4.wav',
        key: 'x'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550706543/samples/house/SH_Hi_Hat_11.wav',
        key: 'c'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550706543/samples/house/SH_Snare_112.wav',
        key: 'v'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550706543/samples/house/SH_Hi_Hat_70.wav',
        key: 'b'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550706543/samples/house/Sh_Clap_019.wav',
        key: 'n'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550706543/samples/house/SH_Bass_Drum_25.wav',
        key: 'm'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550706543/samples/house/DHS_House_Bass_Drum_28.wav',
        key: ','
    }
];
exports.liveKit = [
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550706414/samples/live/Snare_LetLoose.wav',
        key: 'z'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550706411/samples/live/CrossStick_LetLoose.wav',
        key: 'x'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550706414/samples/live/HiHatOpen_LetLoose.wav',
        key: 'c'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550706411/samples/live/HiHatClosed_LetLoose.wav',
        key: 'v'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550706414/samples/live/CrashL_LetLoose.wav',
        key: 'b'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550706411/samples/live/HiHatPedal_LetLoose.wav',
        key: 'n'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550706412/samples/live/Kick_LetLoose.wav',
        key: 'm'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550706414/samples/live/Tom_LetLoose.wav',
        key: ','
    }
];
exports.africanKit = [
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550706297/samples/african/african_g2.wav',
        key: 'z'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550706297/samples/african/african_b2.wav',
        key: 'x'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550706297/samples/african/african_a2.wav',
        key: 'c'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550706297/samples/african/african_f_2.wav',
        key: 'v'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550706297/samples/african/african_c3.wav',
        key: 'b'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550706297/samples/african/african_e2.wav',
        key: 'n'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550706297/samples/african/african_g_2.wav',
        key: 'm'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550706297/samples/african/african_f2.wav',
        key: ','
    }
];


/***/ }),

/***/ "./src/samples/samplerSamples.ts":
/*!***************************************!*\
  !*** ./src/samples/samplerSamples.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.electricPiano = [
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550170579/samples/elec_piano/elecP_C.wav',
        key: 'a'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550170582/samples/elec_piano/elecP_CSHARP.wav',
        key: 'w'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550170584/samples/elec_piano/elecP_D.wav',
        key: 's'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550170582/samples/elec_piano/elecP_DSHARP.wav',
        key: 'e'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550170583/samples/elec_piano/elecP_E.wav',
        key: 'd'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550170587/samples/elec_piano/elecP_F.wav',
        key: 'f'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550170586/samples/elec_piano/elecP_FSHARP.wav',
        key: 't'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550170588/samples/elec_piano/elecP_G.wav',
        key: 'g'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550170588/samples/elec_piano/elecP_GSHARP.wav',
        key: 'y'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550170578/samples/elec_piano/elecP_A.wav',
        key: 'h'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550170583/samples/elec_piano/elecP_ASHARP.wav',
        key: 'u'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550170577/samples/elec_piano/elecP_B.wav',
        key: 'j'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550170589/samples/elec_piano/elecP_C4.wav',
        key: 'k'
    },
];
exports.bass = [
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707472/samples/bass/bass_c2.wav',
        key: 'a'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707472/samples/bass/bass_c_2.wav',
        key: 'w'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707474/samples/bass/bass_d2.wav',
        key: 's'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707473/samples/bass/bass_d_2.wav',
        key: 'e'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707475/samples/bass/bass_e2.wav',
        key: 'd'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707478/samples/bass/bass_f2.wav',
        key: 'f'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707477/samples/bass/bass_f_2.wav',
        key: 't'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707477/samples/bass/bass_g2.wav',
        key: 'g'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707475/samples/bass/bass_g_2.wav',
        key: 'y'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707470/samples/bass/bass_a2.wav',
        key: 'h'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707469/samples/bass/bass_a_2.wav',
        key: 'u'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707471/samples/bass/bass_b2.wav',
        key: 'j'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707477/samples/bass/bass_c3.wav',
        key: 'k'
    },
];
exports.grandPiano = [
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707627/samples/grand/grand-piano_c3.wav',
        key: 'a'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707631/samples/grand/grand-piano_c_3.wav',
        key: 'w'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707630/samples/grand/grand-piano_d3.wav',
        key: 's'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707629/samples/grand/grand-piano_d_3.wav',
        key: 'e'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707630/samples/grand/grand-piano_e3.wav',
        key: 'd'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707633/samples/grand/grand-piano_f3.wav',
        key: 'f'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707631/samples/grand/grand-piano_f_3.wav',
        key: 't'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707633/samples/grand/grand-piano_g3.wav',
        key: 'g'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707632/samples/grand/grand-piano_g_3.wav',
        key: 'y'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707626/samples/grand/grand-piano_a3.wav',
        key: 'h'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707625/samples/grand/grand-piano_a_3.wav',
        key: 'u'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707626/samples/grand/grand-piano_b3.wav',
        key: 'j'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707632/samples/grand/grand-piano_c4.wav',
        key: 'k'
    },
];
exports.guitar = [
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707825/samples/guitar/guitar_c3.wav',
        key: 'a'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707825/samples/guitar/guitar_c_3.wav',
        key: 'w'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707826/samples/guitar/guitar_d3.wav',
        key: 's'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707826/samples/guitar/guitar_d_3.wav',
        key: 'e'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707828/samples/guitar/guitar_e3.wav',
        key: 'd'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707829/samples/guitar/guitar_f3.wav',
        key: 'f'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707829/samples/guitar/guitar_f_3.wav',
        key: 't'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707829/samples/guitar/guitar_g3.wav',
        key: 'g'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707829/samples/guitar/guitar_g_3.wav',
        key: 'y'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707827/samples/guitar/guitar_a3.wav',
        key: 'h'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707826/samples/guitar/guitar_a_3.wav',
        key: 'u'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707824/samples/guitar/guitar_b3.wav',
        key: 'j'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707829/samples/guitar/guitar_c4.wav',
        key: 'k'
    },
];
exports.horns = [
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707843/samples/horn/horn_c2.wav',
        key: 'a'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707844/samples/horn/horn_c_2.wav',
        key: 'w'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707844/samples/horn/horn_d2.wav',
        key: 's'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707844/samples/horn/horn_d_2.wav',
        key: 'e'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707845/samples/horn/horn_e2.wav',
        key: 'd'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707845/samples/horn/horn_f2.wav',
        key: 'f'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707846/samples/horn/horn_f_2.wav',
        key: 't'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707845/samples/horn/horn_g2.wav',
        key: 'g'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707845/samples/horn/horn_g_2.wav',
        key: 'y'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707844/samples/horn/horn_a2.wav',
        key: 'h'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707844/samples/horn/horn_a_2.wav',
        key: 'u'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707843/samples/horn/horn_b2.wav',
        key: 'j'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707843/samples/horn/horn_c3.wav',
        key: 'k'
    },
];
exports.organ = [
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707887/samples/organ/organ_c3.wav',
        key: 'a'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707884/samples/organ/organ_c_3.wav',
        key: 'w'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707887/samples/organ/organ_d3.wav',
        key: 's'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707886/samples/organ/organ_d_3.wav',
        key: 'e'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707892/samples/organ/organ_e3.wav',
        key: 'd'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707891/samples/organ/organ_f3.wav',
        key: 'f'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707892/samples/organ/organ_f_3.wav',
        key: 't'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707892/samples/organ/organ_g3.wav',
        key: 'g'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707891/samples/organ/organ_g_3.wav',
        key: 'y'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707882/samples/organ/organ_a3.wav',
        key: 'h'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707887/samples/organ/organ_a_3.wav',
        key: 'u'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707887/samples/organ/organ_b3.wav',
        key: 'j'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707882/samples/organ/organ_c4.wav',
        key: 'k'
    },
];
exports.moogBass = [
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707939/samples/moog/moog_c2.wav',
        key: 'a'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707940/samples/moog/moog_c_2.wav',
        key: 'w'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707942/samples/moog/moog_d2.wav',
        key: 's'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707940/samples/moog/moog_d_2.wav',
        key: 'e'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707941/samples/moog/moog_e2.wav',
        key: 'd'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707941/samples/moog/moog_f2.wav',
        key: 'f'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707942/samples/moog/moog_f_2.wav',
        key: 't'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707942/samples/moog/moog_g2.wav',
        key: 'g'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707942/samples/moog/moog_g_2.wav',
        key: 'y'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707938/samples/moog/moog_a2.wav',
        key: 'h'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707939/samples/moog/moog_a_2.wav',
        key: 'u'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707940/samples/moog/moog_b2.wav',
        key: 'j'
    },
    {
        url: 'https://res.cloudinary.com/dr4eajzak/video/upload/v1550707939/samples/moog/moog_c3.wav',
        key: 'k'
    },
];


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map