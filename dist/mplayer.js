!function(r,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?exports.mplayer=n():r.MPlayer=n()}(this,(function(){return function(r){var n={};function t(e){if(n[e])return n[e].exports;var i=n[e]={i:e,l:!1,exports:{}};return r[e].call(i.exports,i,i.exports,t),i.l=!0,i.exports}return t.m=r,t.c=n,t.d=function(r,n,e){t.o(r,n)||Object.defineProperty(r,n,{enumerable:!0,get:e})},t.r=function(r){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(r,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(r,"__esModule",{value:!0})},t.t=function(r,n){if(1&n&&(r=t(r)),8&n)return r;if(4&n&&"object"==typeof r&&r&&r.__esModule)return r;var e=Object.create(null);if(t.r(e),Object.defineProperty(e,"default",{enumerable:!0,value:r}),2&n&&"string"!=typeof r)for(var i in r)t.d(e,i,function(n){return r[n]}.bind(null,i));return e},t.n=function(r){var n=r&&r.__esModule?function(){return r.default}:function(){return r};return t.d(n,"a",n),n},t.o=function(r,n){return Object.prototype.hasOwnProperty.call(r,n)},t.p="",t(t.s=0)}([function(module,exports,__webpack_require__){"use strict";eval("\r\nvar __assign = (this && this.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar defaultOptions = {\r\n    index: 0,\r\n    fftSize: 256,\r\n    playMode: 'loop',\r\n    volume: 1,\r\n    baseUrl: '',\r\n};\r\nfunction pathResolve(baseUrl, subUrl) {\r\n    return baseUrl + subUrl.replace(/^[\\.|\\/]\\/?/, '/');\r\n}\r\nfunction getRandNum(max) {\r\n    return Math.random() * max | 0;\r\n}\r\nvar MPlayer = /** @class */ (function () {\r\n    //#endregion\r\n    function MPlayer(resource, options) {\r\n        if (options === void 0) { options = {}; }\r\n        this.urlList = [];\r\n        this.delta = 0;\r\n        this.firstPlay = true;\r\n        this.cache = [];\r\n        this.options = __assign(__assign({}, defaultOptions), options);\r\n        this.initParams();\r\n        this.initSource(resource);\r\n        this.initAnalyser();\r\n    }\r\n    MPlayer.prototype.initParams = function () {\r\n        this.handle = {};\r\n        Object.defineProperty(this, '$options', {\r\n            get: function () {\r\n                return this.options;\r\n            }\r\n        });\r\n        this.ctx = new window.AudioContext();\r\n        this.pause();\r\n        this.gain = this.ctx.createGain();\r\n        this.gain.connect(this.ctx.destination);\r\n    };\r\n    MPlayer.prototype.initSource = function (resource) {\r\n        if (typeof resource === 'string') {\r\n            this.options.index = 0;\r\n            this.urlList.push(resource);\r\n        }\r\n        else if (Array.isArray(resource)) {\r\n            this.urlList = resource;\r\n            if (this.options.playMode === 'rand') {\r\n                this.options.index = getRandNum(resource.length);\r\n            }\r\n        }\r\n        else {\r\n            throw new Error('expected resource is string url or Array url');\r\n        }\r\n        this.initRequest();\r\n    };\r\n    MPlayer.prototype.initRequest = function () {\r\n        var _this = this;\r\n        var resource = this.urlList[this.options.index];\r\n        if (typeof resource !== 'string') {\r\n            throw new Error('expected resource is string url');\r\n        }\r\n        if (this.options.request) {\r\n            this.initDecode(this.options.request(this.options), resource);\r\n            return;\r\n        }\r\n        this.request(resource).then(function (data) {\r\n            _this.initDecode(data, resource);\r\n        }).catch(function (err) {\r\n            console.error(err);\r\n            _this.playNext();\r\n        });\r\n    };\r\n    MPlayer.prototype.request = function (url) {\r\n        var _this = this;\r\n        return new Promise(function (resolve, reject) {\r\n            url = pathResolve(_this.options.baseUrl, url);\r\n            var xhr = new XMLHttpRequest();\r\n            xhr.open('GET', url, true);\r\n            xhr.responseType = 'arraybuffer';\r\n            xhr.onreadystatechange = function (e) {\r\n                e.preventDefault();\r\n                var status = xhr.status, readyState = xhr.readyState, statusText = xhr.statusText;\r\n                if (readyState === 4) {\r\n                    if (status >= 200 && status < 300 || status === 304) {\r\n                        resolve(xhr.response);\r\n                    }\r\n                    else {\r\n                        reject(\"status: \" + status + \", \" + statusText);\r\n                    }\r\n                }\r\n            };\r\n            xhr.onerror = reject.bind(_this, 'error');\r\n            xhr.ontimeout = reject.bind(_this, 'request timerout！');\r\n            xhr.send();\r\n        });\r\n    };\r\n    MPlayer.prototype.pushCache = function (item) {\r\n        if (this.options.cacheCount === this.cache.length) {\r\n            this.cache.shift();\r\n        }\r\n        this.cache.push(item);\r\n    };\r\n    MPlayer.prototype.initDecode = function (data, url) {\r\n        var _this = this;\r\n        this.ctx.decodeAudioData(data).then(function (decodedData) {\r\n            if (url) {\r\n                _this.pushCache({ url: url, data: decodedData });\r\n            }\r\n            _this.initBufferSource(decodedData);\r\n            _this.play();\r\n            _this.bindLoad();\r\n        }).catch(function (err) {\r\n            console.error(err);\r\n        });\r\n    };\r\n    MPlayer.prototype.bindLoad = function () {\r\n        this.onload && this.onload();\r\n        this.emit('load');\r\n    };\r\n    MPlayer.prototype.bindEnded = function () {\r\n        var _this = this;\r\n        this.source.onended = function () {\r\n            _this.onended && _this.onended();\r\n            _this.emit('ended');\r\n            if (_this.options.playMode === 'single') {\r\n                _this.start(0);\r\n            }\r\n            else {\r\n                _this.playNext();\r\n            }\r\n        };\r\n    };\r\n    MPlayer.prototype.initAnalyser = function () {\r\n        var fftSize = this.options.fftSize;\r\n        if (typeof fftSize === 'number') {\r\n            this.analyser = this.ctx.createAnalyser();\r\n            var size = fftSize;\r\n            this.analyser.fftSize = size;\r\n            this.analyser.connect(this.gain);\r\n        }\r\n        else if (fftSize !== false) {\r\n            console.warn('fftSize expected number');\r\n        }\r\n    };\r\n    MPlayer.prototype.initBufferSource = function (decodedData) {\r\n        this.source = this.ctx.createBufferSource();\r\n        this.decodedData = decodedData;\r\n        this.source.buffer = this.decodedData;\r\n        this.duration = this.source.buffer.duration;\r\n        this.source.connect(this.analyser ? this.analyser : this.gain);\r\n        this.bindEnded();\r\n    };\r\n    MPlayer.prototype.on = function (type, fn) {\r\n        this.handle[type] ? this.handle[type].push(fn) : this.handle[type] = [fn];\r\n    };\r\n    MPlayer.prototype.off = function (type, fn) {\r\n        fn ? this.handle[type] = this.handle[type].filter(function (e) { return e !== fn; }) : delete this.handle[type];\r\n    };\r\n    MPlayer.prototype.emit = function (type) {\r\n        this.handle[type] && this.handle[type].forEach(function (e) { return e(); });\r\n    };\r\n    MPlayer.prototype.playPrev = function () {\r\n        var len = this.urlList.length;\r\n        this.options.playMode === 'rand'\r\n            ? this.options.index = getRandNum(len)\r\n            : !~--this.options.index && (this.options.index += len);\r\n        this.reset();\r\n    };\r\n    MPlayer.prototype.playNext = function () {\r\n        var len = this.urlList.length;\r\n        this.options.index = this.options.playMode === 'rand'\r\n            ? getRandNum(len)\r\n            : ++this.options.index % len;\r\n        this.reset();\r\n    };\r\n    MPlayer.prototype.setUrlList = function (list) {\r\n        if (!Array.isArray(list)) {\r\n            console.warn('list expected string[]');\r\n            return;\r\n        }\r\n        this.urlList = list;\r\n        this.options.index = 0;\r\n        this.reset();\r\n    };\r\n    MPlayer.prototype.setOptions = function (options) {\r\n        var _a = options ? options : this.options, playMode = _a.playMode, volume = _a.volume;\r\n        if (playMode != null) {\r\n            this.setPlayMode(playMode);\r\n        }\r\n        if (volume != null) {\r\n            this.setVolume(volume);\r\n        }\r\n    };\r\n    MPlayer.prototype.play = function () {\r\n        if (this.firstPlay) {\r\n            this.start(0);\r\n        }\r\n        if (this.ctx.state === 'suspended') {\r\n            this.ctx.resume();\r\n        }\r\n        this.playingState = 'running';\r\n    };\r\n    MPlayer.prototype.reset = function () {\r\n        if (this.source) {\r\n            this.pause();\r\n            if (!this.firstPlay) {\r\n                this.source.stop();\r\n            }\r\n            this.source.onended = null;\r\n            this.firstPlay = true;\r\n        }\r\n        var url = this.urlList[this.options.index];\r\n        var item = this.cache.find(function (v) { return v.url === url; });\r\n        if (item) {\r\n            this.initBufferSource(item.data);\r\n            this.play();\r\n        }\r\n        else {\r\n            this.initRequest();\r\n        }\r\n    };\r\n    MPlayer.prototype.start = function (offset) {\r\n        if (typeof offset !== 'number') {\r\n            offset = 0;\r\n            console.warn('expected parameter is number type');\r\n        }\r\n        if (this.duration < offset || offset < 0) {\r\n            offset = 0;\r\n            console.warn(\"value is out of range, expected range from 0 to \" + this.duration);\r\n        }\r\n        if (!this.source) {\r\n            console.warn('using play method in onload');\r\n            return;\r\n        }\r\n        this.delta = this.ctx.currentTime - offset;\r\n        if (!this.firstPlay) {\r\n            this.source.onended = null;\r\n            this.source.stop();\r\n            this.initBufferSource(this.decodedData);\r\n        }\r\n        this.source.start(this.ctx.currentTime, offset);\r\n        this.playingState = 'running';\r\n        this.firstPlay = false;\r\n    };\r\n    MPlayer.prototype.getData = function () {\r\n        if (!this.analyser) {\r\n            return null;\r\n        }\r\n        var data = new Uint8Array(this.analyser.frequencyBinCount);\r\n        this.analyser.getByteFrequencyData(data);\r\n        return data;\r\n    };\r\n    MPlayer.prototype.getCurrentTime = function () {\r\n        return Math.min(this.ctx.currentTime - this.delta, this.duration);\r\n    };\r\n    MPlayer.prototype.pause = function () {\r\n        if (this.ctx.state === 'running') {\r\n            this.ctx.suspend();\r\n        }\r\n        this.playingState = 'suspended';\r\n    };\r\n    MPlayer.prototype.toggle = function () {\r\n        this.playingState === 'running' ? this.pause() : this.play();\r\n    };\r\n    MPlayer.prototype.setPlayMode = function (playMode) {\r\n        if (typeof playMode !== 'boolean') {\r\n            console.warn(\"playMode expected boolean\");\r\n        }\r\n        this.options.playMode = playMode;\r\n    };\r\n    MPlayer.prototype.setVolume = function (val) {\r\n        if (val === void 0) { val = 1; }\r\n        if (typeof val !== 'number') {\r\n            val = 1;\r\n            console.warn('val expect number');\r\n        }\r\n        if (val < 0 || val > 1) {\r\n            val = 1;\r\n            console.warn('value is out of range and expected range from 0 to 1');\r\n        }\r\n        this.gain.gain.value = Math.pow(val, 2);\r\n        this.options.volume = val;\r\n    };\r\n    return MPlayer;\r\n}());\r\nexports.default = MPlayer;\r\n\n\n//# sourceURL=webpack://MPlayer/./src/index.ts?")}]).default}));