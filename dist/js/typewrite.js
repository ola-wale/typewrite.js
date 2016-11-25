function typeWrite(el, options = {}) {
		el = document.querySelector(el);
		this.element = el;
		this.text = el.textContent;
		this.options = options;
		this.options = {
						'speed': options.speed ? options.speed : 100,
						'separator': options.separator ? options.separator : ' ',
						'texts': options.texts ? this.options.texts : [this.text],
						'loop': options.loop ? this.options.loop : false,
						'reverseDelay': options.reverseDelay ? this.options.reverseDelay : 100,
						'cursor': options.cursor ? this.options.cursor : '|',
						'waitOnChar': options.waitOnChar ? this.options.waitOnChar : '',
						'paused': false,
						'hasChecked': false,
						'waitOnCharDuration': options.waitOnCharDuration ? this.options.waitOnCharDuration : 0,
						'randWaitOnChar': options.randWaitOnChar ? this.options.randWaitOnChar : false,
						'stopped': false,
						'started': false,
				}
				//inject required css
		var css = document.createElement("style");
		css.type = "text/css";
		var typeWriteId = Math.floor((Math.random() * 9999) + 1)
		css.innerHTML = ".typewriter-" + typeWriteId + ":after{content:'" + this.options.cursor + "';display: inline-block;animation-name:typewrite;animation-duration:.5s;animation-timing-function:ease;animation-iteration-count:infinite}@keyframes typewrite{0%{opacity:0}100%{opacity:1}}";
		document.body.appendChild(css);
		this.typewriteAddClass('typewriter-' + typeWriteId);
		return this.text;
}
typeWrite.prototype.start = function() {
		var speed = this.options.speed,
				counter = 0,
				chainCounter = 1,
				element = this.element,
				currentText = this.text,
				options = this.options,
				texts = this.options.texts,
				thisAlt = this,
				loop = this.options.loop,
				waitOnChar = this.options.waitOnChar,
				waitOnCharDuration = this.options.waitOnCharDuration,
				stopped = thisAlt.options.stopped,
				started = thisAlt.options.started,
				startInterval;
		if (thisAlt.options.started) {
				return;
		}
		element.innerText = '';
		element.textContent = '';
		thisAlt.options.stopped = false;
		thisAlt.options.started = true;
		var jsonIndex = 0,
				hasRun = 0,
				initialInterval, typeDoneEvent = new CustomEvent("typeDone"),
				waitDelay;
		var typeWriteRun = function() {
				if (texts[jsonIndex].charAt(counter - 1) == waitOnChar && waitOnChar != '' && thisAlt.options.hasChecked == 0) {
						thisAlt.pause(waitOnCharDuration);
						thisAlt.options.hasChecked = 1;
				}
				if (thisAlt.options.stopped) {
						clearInterval(startInterval);
						clearInterval(initialInterval);
						thisAlt.options.stopped = true;
						thisAlt.options.started = false;
						var stopEvent = new CustomEvent('typeStop');
						thisAlt.element.dispatchEvent(stopEvent);
						return;
				}
				if (thisAlt.isPaused()) {
						return;
				}
				var nowText = element.innerText || element.textContent;
				if (typeof texts[jsonIndex][counter] !== 'undefined') {
						element.textContent += texts[jsonIndex].charAt(counter);
						thisAlt.options.hasChecked = 0;
				} else {
						clearInterval(initialInterval);
						//clear the interval
						var jsonIndex2 = jsonIndex;
						if (loop) {
								thisAlt.reverse(function() {
										counter = 0;
										if (typeof texts[jsonIndex2++] !== 'undefined' && jsonIndex < texts.length - 1) {
												jsonIndex++;
										} else {
												jsonIndex = 0;
										}
										clearInterval(initialInterval);
										startInterval = setInterval(typeWriteRun, speed);
								});
						} else {
								if (jsonIndex < texts.length - 1) {
										thisAlt.reverse(function() {
												counter = 0;
												if (typeof texts[jsonIndex2++] !== 'undefined') {
														jsonIndex++;
														startInterval = setInterval(typeWriteRun, speed);
												} else {
														thisAlt.options.stopped = true;
														thisAlt.options.started = false;
												}
										});
								}
						}

						clearInterval(startInterval);
						//fire event
						element.dispatchEvent(typeDoneEvent);
						if (!thisAlt.options.loop) {
								thisAlt.options.stopped = true;
								thisAlt.options.started = false;
						}
				}
				if (counter <= texts[jsonIndex].length) {
						counter++;
				}
		}; //end function
		initialInterval = setInterval(typeWriteRun, speed);
}

typeWrite.prototype.typewriteAddClass = function(className) {
		if (this.element.classList) {
				this.element.classList.add(className);
		} else {
				this.element.className += ' ' + className;
		}
}

typeWrite.prototype.changeOption = function(option, value) {
		var options = this.options;
		for (var i in options) {
				if (i === option) {
						options[i] = value;
				}
		}
		this.options = options;
}

typeWrite.prototype.stop = function(cb) {
		this.options.stopped = true;
		if (cb) {
				setTimeout(function() {
						cb();
				}, 300);
		}
}

typeWrite.prototype.isStopped = function() {
		return this.options.stopped;
}

typeWrite.prototype.pause = function(duration, cb = '') {
		if (!this.options.started) {
				return;
		}
		//if the randomize waitOnChar option is enabled, randomize the duration between 0 and waitOnCharDuration.
		if (this.options.randWaitOnChar) {
				duration = Math.round(Math.random() * duration) + 1;
		}
		this.options.paused = true;
		var thisPause = this;
		setTimeout(function() {
				thisPause.resume();
		}, duration);
		if (cb) {
				setTimeout(function() {
						cb();
				}, 300);
		}
}
typeWrite.prototype.resume = function(cb) {
		if (!this.options.paused) {
				return;
		}
		this.options.paused = false;
		var resumeEvent = new CustomEvent('typeResume');
		this.element.dispatchEvent(resumeEvent);
		if (cb) {
				setTimeout(function() {
						cb();
				}, 300);
		}
}
typeWrite.prototype.isPaused = function() {
		return this.options.paused;
}
typeWrite.prototype.reverse = function(callback = '') {
		var element = this.element;
		var speed = this.options.speed;
		var reverseEvent = new CustomEvent('reverse');
		var reverseDelay = this.options.reverseDelay;
		var $this = this;
		setTimeout(function() {
				var reverseInterval = setInterval(function() {
						if (element.innerText != '') {
								element.innerText = element.innerText.slice(0, -1);
						} else {
								clearInterval(reverseInterval);
								if (callback) {
										callback();
								}
								element.dispatchEvent(reverseEvent);
						}
				}, speed);
				if (!$this.options.loop) {
						$this.options.stopped = true;
						$this.options.started = false;
				}
		}, reverseDelay)
}
