'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.hexToRGB=hexToRGB;exports.getRootEl=getRootEl;exports.getBoundingClientRectFromElement=getBoundingClientRectFromElement;/*eslint-disable no-nested-ternary *//**
 * Convert hex to RGB
 *
 * @param {string} hex
 * @returns {Object}
 */function hexToRGB(hex){// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
var shorthandRegex=/^#?([a-f\d])([a-f\d])([a-f\d])$/i;var newHex=hex.replace(shorthandRegex,function(m,r,g,b){return r+r+g+g+b+b;});var result=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(newHex);return result?{r:parseInt(result[1],16),g:parseInt(result[2],16),b:parseInt(result[3],16)}:null;}/**
 * Get the current browser
 *
 * @returns {String}
 */function getBrowser(){if(typeof window==='undefined'){return'node';}var isOpera=Boolean(window.opera)||navigator.userAgent.indexOf(' OPR/')>=0;// Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
var isFirefox=typeof InstallTrigger!=='undefined';// Firefox 1.0+
var isSafari=Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor')>0;// At least Safari 3+: "[object HTMLElementConstructor]"
var isChrome=Boolean(window.chrome)&&!isOpera;// Chrome 1+
var isIE=Boolean(document.documentMode);// At least IE6
return isOpera?'opera':isFirefox?'firefox':isSafari?'safari':isChrome?'chrome':isIE?'ie':'';}var browser=exports.browser=getBrowser();/**
 * Get DOM document root element
 * @returns {Element}
 */function getRootEl(){return['ie','firefox'].indexOf(getBrowser())>-1?document.documentElement:document.body;}/**
 * Create an equivalent to getBoundingClientRect with correct values
 *
 * @private
 * @param {Object} element - The target element
 * @returns {Array}
 */function getBoundingClientRectFromElement(element){var x=0;var y=0;var elem=element;while(elem&&!isNaN(elem.offsetLeft)&&!isNaN(elem.offsetTop)){x+=elem.offsetLeft-elem.scrollLeft;y+=elem.offsetTop-elem.scrollTop;elem=elem.offsetParent;}elem=element;return{top:y,left:x,width:typeof elem.width==='function'?elem.width():elem.offsetWidth,height:typeof elem.height==='function'?elem.height():elem.offsetHeight};}