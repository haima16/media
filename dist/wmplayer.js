!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.wmplayer=e():t.wmplayer=e()}(this,(function(){return(()=>{"use strict";var t={33:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.EventBus=void 0;var r=function(){function t(){this.handleMap={}}return t.prototype.on=function(t,e){this.handleMap[t]?this.handleMap[t].push(e):this.handleMap[t]=[e]},t.prototype.off=function(t,e){e?this.handleMap[t]=this.handleMap[t].filter((function(t){return t!==e})):delete this.handleMap[t]},t.prototype.emit=function(t){this.handleMap[t]&&this.handleMap[t].forEach((function(t){return t()}))},t}();e.EventBus=r},862:function(t,e,r){var o,n=this&&this.__extends||(o=function(t,e){return(o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])})(t,e)},function(t,e){function r(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)}),i=this&&this.__assign||function(){return(i=Object.assign||function(t){for(var e,r=1,o=arguments.length;r<o;r++)for(var n in e=arguments[r])Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t}).apply(this,arguments)};Object.defineProperty(e,"__esModule",{value:!0}),e.createPlayer=void 0;var s=r(519),a=r(371),u=r(593),h=r(33),p={index:0,fftSize:256,playermode:a.PlayMode.order,volume:1,baseUrl:"",autoplay:!0};e.createPlayer=function(t,e){return void 0===e&&(e={}),new c(t,e)};var c=function(t){function e(e,r){void 0===r&&(r={});var o=t.call(this)||this;return o.urlList=[],o.delta=0,o.firstPlay=!0,o.errorUrl="",o.cache=[],o.options=i(i({},p),r),o.initParams(),o.initSource(e),o.initAnalyser(),o}return n(e,t),e.prototype.initParams=function(){this.ctx=new window.AudioContext,this.pause(),this.gain=this.ctx.createGain(),this.gain.connect(this.ctx.destination)},e.prototype.initSource=function(t){if("string"==typeof t)this.options.index=0,this.urlList.push(t);else{if(!Array.isArray(t))throw s.error("resource expected a string url or Array url");this.urlList=t,this.options.playermode===a.PlayMode.rand&&(this.options.index=u.getRandNum(t.length))}this.initRequest()},e.prototype.initRequest=function(){var t=this,e=this.urlList[this.options.index];if("string"!=typeof e)throw s.error("resource expected a string url");this.options.request?this.initDecode(this.options.request(this.options),e):this.request(e).then((function(r){t.initDecode(r,e)})).catch((function(r){console.error(r),t.oncatch&&t.oncatch(),t.emit("catch"),t.errorUrl?t.errorUrl!==e&&t.playNext():(t.errorUrl=e,t.playNext())}))},e.prototype.request=function(t){var e=this;return new Promise((function(r,o){t=u.pathResolve(e.options.baseUrl,t);var n=new XMLHttpRequest;n.open("GET",t,!0),n.responseType="arraybuffer",n.onreadystatechange=function(t){t.preventDefault();var e=n.status,i=n.readyState,s=n.statusText;4===i&&(e>=200&&e<300||304===e?r(n.response):o("status: "+e+", "+s))},n.onerror=o.bind(e,"error"),n.ontimeout=o.bind(e,"request timerout！"),n.send()}))},e.prototype.pushCache=function(t){this.options.cacheCount===this.cache.length&&this.cache.shift(),this.cache.push(t)},e.prototype.initDecode=function(t,e){var r=this;this.ctx.decodeAudioData(t).then((function(t){e&&r.pushCache({url:e,data:t}),r.initBufferSource(t),r.play(),!r.options.autoplay&&r.pause()})).catch((function(t){console.error(t),r.oncatch&&r.oncatch(),r.emit("catch")}))},e.prototype.bindLoad=function(){this.onload&&this.onload(),this.emit("load"),this.options.autoplay&&this.play()},e.prototype.bindEnded=function(){var t=this;this.source.onended=function(){t.onended&&t.onended(),t.emit("ended"),t.options.playermode===a.PlayMode.single?t.start(0):t.playNext()}},e.prototype.initAnalyser=function(){var t=this.options.fftSize;if("number"==typeof t){this.analyser=this.ctx.createAnalyser();var e=t;this.analyser.fftSize=e,this.analyser.connect(this.gain)}else if(!1!==t)throw s.error("fftSize expected a number")},e.prototype.initBufferSource=function(t){this.source=this.ctx.createBufferSource(),this.decodedData=t,this.source.buffer=this.decodedData,this.duration=this.source.buffer.duration,this.source.connect(this.analyser?this.analyser:this.gain),this.bindEnded()},e.prototype.start=function(t){if("number"!=typeof t)throw t=0,s.error("the offset is expected to be a number");if(this.duration<t||t<0)throw t=0,s.error("value is out of range, expected range from 0 to "+this.duration);this.source?(this.delta=this.ctx.currentTime-t,this.firstPlay||(this.source.onended=null,this.source.stop(),this.initBufferSource(this.decodedData)),this.source.start(this.ctx.currentTime,t),this.playingState="running",this.firstPlay=!1,this.bindLoad()):s.warn("using play method after onload")},e.prototype.setUrlList=function(t){if(!Array.isArray(t))throw s.error("list expected a string array");this.urlList=t,this.options.index=0,this.reset()},e.prototype.setOptions=function(t){var e=t||this.options,r=e.playermode,o=e.volume;null!=r&&this.setPlayMode(r),null!=o&&this.setVolume(o)},e.prototype.setVolume=function(t){if(void 0===t&&(t=1),"number"!=typeof t)throw s.error("val expected a number");if(t<0||t>1)throw s.error("expected range from 0 to 1");this.gain.gain.value=Math.pow(t,2),this.options.volume=t},e.prototype.setPlayMode=function(t){if("boolean"!=typeof t)throw s.error("playMode expected a boolean");this.options.playermode=t},e.prototype.playPrev=function(){var t=this.urlList.length;this.options.playermode===a.PlayMode.rand?this.options.index=u.getRandNum(t):!~--this.options.index&&(this.options.index+=t),this.reset()},e.prototype.playNext=function(){var t=this.urlList.length;this.options.index=this.options.playermode===a.PlayMode.rand?u.getRandNum(t):++this.options.index%t,this.reset()},e.prototype.play=function(t){this.firstPlay?this.start(0):"suspended"===this.ctx.state?(this.ctx.resume(),this.playingState="running"):"number"==typeof t?this.start(t):this.oncatch&&this.oncatch()},e.prototype.reset=function(){this.source&&(this.pause(),this.firstPlay||this.source.stop(),this.source.onended=null,this.firstPlay=!0);var t=this.urlList[this.options.index],e=this.cache.find((function(e){return e.url===t}));e?(this.initBufferSource(e.data),this.play(0)):this.initRequest()},e.prototype.pause=function(){"running"===this.ctx.state&&this.ctx.suspend(),this.playingState="suspended"},e.prototype.toggle=function(){"running"===this.playingState?this.pause():this.play()},e.prototype.getData=function(){if(!this.analyser)return null;var t=new Uint8Array(this.analyser.frequencyBinCount);return this.analyser.getByteFrequencyData(t),t},e.prototype.getCurrentTime=function(){return Math.min(this.ctx.currentTime-this.delta,this.duration)},e.prototype.getPlayingState=function(){return this.playingState},e}(h.EventBus)},519:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.warn=e.error=void 0,e.error=function(t){return new Error("[wmplayer error]: "+t)},e.warn=function(t){return console.error("[wmplayer warn]: "+t)}},371:(t,e)=>{var r;Object.defineProperty(e,"__esModule",{value:!0}),e.PlayMode=void 0,(r=e.PlayMode||(e.PlayMode={}))[r.order=1]="order",r[r.rand=2]="rand",r[r.single=3]="single"},593:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.getRandNum=e.pathResolve=void 0,e.pathResolve=function(t,e){return t+e.replace(/^[\.|\/]\/?/,"/")},e.getRandNum=function(t){return Math.random()*t|0}}},e={};function r(o){var n=e[o];if(void 0!==n)return n.exports;var i=e[o]={exports:{}};return t[o].call(i.exports,i,i.exports,r),i.exports}var o={};return(()=>{var t=o;Object.defineProperty(t,"__esModule",{value:!0}),t.create=void 0;var e=r(371),n=r(862);t.create=n.createPlayer;var i=r(371);Object.defineProperty(t,"PlayMode",{enumerable:!0,get:function(){return i.PlayMode}}),t.default={create:n.createPlayer,PlayMode:e.PlayMode}})(),o})()}));