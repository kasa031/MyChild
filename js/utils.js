// Browser compatibility checks and polyfills
(function() {
    'use strict';
    
    // Check for localStorage support
    if (!window.localStorage) {
        console.warn('localStorage not supported, using in-memory storage');
        const storage = {};
        window.localStorage = {
            getItem: (key) => storage[key] || null,
            setItem: (key, value) => { storage[key] = value; },
            removeItem: (key) => { delete storage[key]; },
            clear: () => { storage = {}; }
        };
    }
    
    // IntersectionObserver polyfill check
    if (!window.IntersectionObserver) {
        console.warn('IntersectionObserver not supported, using fallback');
        window.IntersectionObserver = function(callback, options) {
            return {
                observe: function() {},
                disconnect: function() {},
                unobserve: function() {}
            };
        };
    }
    
    // Array.includes polyfill for older browsers
    if (!Array.prototype.includes) {
        Array.prototype.includes = function(searchElement, fromIndex) {
            if (this == null) throw new TypeError('"this" is null or not defined');
            const o = Object(this);
            const len = parseInt(o.length) || 0;
            if (len === 0) return false;
            const n = parseInt(fromIndex) || 0;
            let k = n >= 0 ? n : Math.max(len + n, 0);
            function sameValueZero(x, y) {
                return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
            }
            for (; k < len; k++) {
                if (sameValueZero(o[k], searchElement)) return true;
            }
            return false;
        };
    }
    
    // String.includes polyfill for older browsers
    if (!String.prototype.includes) {
        String.prototype.includes = function(search, start) {
            if (typeof start !== 'number') start = 0;
            if (start + search.length > this.length) return false;
            return this.indexOf(search, start) !== -1;
        };
    }
    
    // Object.assign polyfill for older browsers
    if (typeof Object.assign !== 'function') {
        Object.assign = function(target) {
            if (target == null) throw new TypeError('Cannot convert undefined or null to object');
            const to = Object(target);
            for (let index = 1; index < arguments.length; index++) {
                const nextSource = arguments[index];
                if (nextSource != null) {
                    for (const nextKey in nextSource) {
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        };
    }
})();

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Swipe detection utility
class SwipeDetector {
    constructor(element, options = {}) {
        this.element = element;
        this.threshold = options.threshold || 50; // Minimum distance for swipe
        this.restraint = options.restraint || 100; // Maximum perpendicular distance
        this.allowedTime = options.allowedTime || 300; // Maximum time for swipe
        
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchStartTime = 0;
        
        this.onSwipeLeft = options.onSwipeLeft || null;
        this.onSwipeRight = options.onSwipeRight || null;
        this.onSwipeUp = options.onSwipeUp || null;
        this.onSwipeDown = options.onSwipeDown || null;
        
        this.init();
    }
    
    init() {
        this.element.addEventListener('touchstart', (e) => {
            const touch = e.changedTouches[0];
            this.touchStartX = touch.pageX;
            this.touchStartY = touch.pageY;
            this.touchStartTime = new Date().getTime();
        }, { passive: true });
        
        this.element.addEventListener('touchend', (e) => {
            const touch = e.changedTouches[0];
            const touchEndX = touch.pageX;
            const touchEndY = touch.pageY;
            const touchEndTime = new Date().getTime();
            
            const distX = touchEndX - this.touchStartX;
            const distY = touchEndY - this.touchStartY;
            const elapsedTime = touchEndTime - this.touchStartTime;
            
            if (elapsedTime <= this.allowedTime) {
                if (Math.abs(distX) >= this.threshold && Math.abs(distY) <= this.restraint) {
                    // Horizontal swipe
                    if (distX > 0 && this.onSwipeRight) {
                        this.onSwipeRight();
                    } else if (distX < 0 && this.onSwipeLeft) {
                        this.onSwipeLeft();
                    }
                } else if (Math.abs(distY) >= this.threshold && Math.abs(distX) <= this.restraint) {
                    // Vertical swipe
                    if (distY > 0 && this.onSwipeDown) {
                        this.onSwipeDown();
                    } else if (distY < 0 && this.onSwipeUp) {
                        this.onSwipeUp();
                    }
                }
            }
        }, { passive: true });
    }
}

