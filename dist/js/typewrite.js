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
		startInterval;
	element.innerText = '';
	element.textContent = '';
	var jsonIndex = 0,
		hasRun = 0,
		initialInterval, typeDoneEvent = new CustomEvent("typeDone");
	var typeWriteRun = function() {
		var nowText = element.innerText || element.textContent;
		if (typeof texts[jsonIndex][counter] !== 'undefined') {
			element.textContent += texts[jsonIndex].charAt(counter);
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
						}

					});
				}
			}

			clearInterval(startInterval);
			//fire event
			element.dispatchEvent(typeDoneEvent);
		}
		if (counter <= texts[jsonIndex].length) {
			counter++;
		}
	};
	initialInterval = setInterval(typeWriteRun, speed);
}

typeWrite.prototype.stop = function() {

}

typeWrite.prototype.typewriteAddClass = function(className) {
	if (this.element.classList) {
		this.element.classList.add(className);
	} else {
		this.element.className += ' ' + className;
	}
}

typeWrite.prototype.reverse = function(callback = '') {
	var element = this.element;
	var speed = this.options.speed;
	var reverseEvent = new CustomEvent('reverse');
	var reverseDelay = this.options.reverseDelay;
	setTimeout(function() {
		var reverseInterval = setInterval(function() {
			if (element.innerText != '') {
				element.innerText = element.innerText.slice(0, -1);
			} else {
				clearInterval(reverseInterval);
				callback();
				element.dispatchEvent(reverseEvent);
			}
		}, speed);
	}, reverseDelay)
}