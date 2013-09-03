/**
 *dom-style
 * @author tingbao.peng@gmail.com
 */

KISSY.add('dom/style', function (S) {
    function getEl(selector, context) {
        if (!selector) {
            return [];
        }
        context = context || document.body;
        //css selector
        if (selector && typeof(selector) == 'string') {
            selector = selector.replace(/^\s+|\s+$/g, '');
            return context.querySelectorAll(selector);
        }
        //node
        if (selector.nodeType && selector.nodeType == 1) {
            return [selector];
        }
        //nodelist
        if (selector.length && selector[0] && selector[0].nodeType && selector[0].nodeType == 1) {
            return selector;
        }
        return [];
    }

    var cssProps = {
        'float':'cssFloat'
    };

    var cssNumber = {
        'fillOpacity':1,
        'fontWeight':1,
        'lineHeight':1,
        'opacity':1,
        'orphans':1,
        'widows':1,
        'zIndex':1,
        'zoom':1
    };
    var RE_NUM = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source;
    var RE_NUM_NO_PX = new RegExp("^(" + RE_NUM + ")(?!px)[a-z%]+$", "i");
    var RE_MARGIN = /^margin/;

    function UA(name) {
        return navigator.userAgent.indexOf(name) != -1;
    }

    function camelCase(name) {
        return name.replace(/-([a-z])/ig, function () {
            return arguments[1].toUpperCase();
        });
    }

    function style(elem, name, val) {
        var style,
            ret;
        style = elem.style
        if (elem.nodeType === 3 || elem.nodeType === 8 || !style) {
            return undefined;
        }

        name = camelCase(name);


        name = cssProps[name] || name;
        // setter
        if (val !== undefined) {
            // normalize unset
            if (val === null || val === '') {
                val = '';
            }
            // number values may need a unit
            else if (!isNaN(Number(val)) && !cssNumber[name]) {
                val += 'px';
            }
            style[name] = val;
            if (!style.cssText) {
                UA.webkit && (style = elem.outerHTML);
                elem.removeAttribute('style');
            }
            return undefined;
        }
        //getter
        else {
            ret = style[ name ];
            return ret === undefined ? '' : ret;
        }
    }

    function contains(a, b) {
        return !!(a.compareDocumentPosition(b) & 16);
    }

    function _getComputedStyle(elem, name) {
        var val = '',
            computedStyle,
            width,
            minWidth,
            maxWidth,
            style,
            d = elem.ownerDocument;

        name = name.replace(/([A-Z])/g, '-$1').toLowerCase();

        // https://github.com/kissyteam/kissy/issues/61
        if (computedStyle = d.defaultView.getComputedStyle(elem, null)) {
            val = computedStyle.getPropertyValue(name) || computedStyle[name];
        }

        //element not add on the document tree,get the inline style
        if (val === '' && !contains(d, elem)) {
            name = cssProps[name] || name;
            val = elem.style[name];
        }

        // Safari 5.1 returns percentage for margin
        if (RE_NUM_NO_PX.test(val) && RE_MARGIN.test(name)) {
            style = elem.style;
            width = style.width;
            minWidth = style.minWidth;
            maxWidth = style.maxWidth;

            style.minWidth = style.maxWidth = style.width = val;
            val = computedStyle.width;

            style.width = width;
            style.minWidth = minWidth;
            style.maxWidth = maxWidth;
        }

        return val;
    }

    var defaultDisplay = {};

    function getDefaultDisplay(tagName) {
        var body,
            oldDisplay = defaultDisplay[ tagName ],
            elem;
        var doc = document;
        if (!defaultDisplay[ tagName ]) {
            body = doc.body || doc.documentElement;
            elem = doc.createElement(tagName);
            body.appendChild(elem);
            oldDisplay = _getComputedStyle(elem, 'display');
            body.removeChild(elem);
            // Store the correct default display
            defaultDisplay[ tagName ] = oldDisplay;
        }
        return oldDisplay;
    }

    function getNumber(str) {
        return parseFloat(str);
    }

    var custom_style = function (el, name) {
        var style = document.defaultView.getComputedStyle(el);
        var value;
        if (name == 'width' || name == 'height') {
            value = getNumber(el[camelCase('offset-' + name)]);
            if (name == 'width') {
                value = value - getNumber(style.paddingLeft) - getNumber(style.borderLeft) - getNumber(style.paddingRight) - getNumber(style.borderRight);
            } else {
                value = value - getNumber(style.paddingTop) - getNumber(style.borderTop) - getNumber(style.paddingBottom) - getNumber(style.borderBottom);
            }
            return value + 'px';
        }
        if (name == 'left' || name == 'top') {
            var position = style.position;
            if (position == 'static') {
                return 'auto';
            } else if (position == 'relative') {
                return '0px';
            } else if (position == 'fixed') {
                var offset = el.getBoundingClientRect();
                value = offset[name];
            } else {
                value = 0
            }
            return value + 'px';
        }
        return value;
    };
    var STYLE = {
        /**
         *  Get inline style property from the first element of matched elements
         *  or
         *  Set one or more CSS properties for the set of matched elements.
         *  @param {HTMLElement[]|String|HTMLElement} selector Matched elements
         *  @param {String|Object} name A CSS property. or A map of property-value pairs to set.
         *  @param [val] A value to set for the property.
         */
        style:function (selector, name, val) {
            var els = getEl(selector),
                k,
                ret,
                elem = els[0], i;
            // supports hash
            if (S.isPlainObject(name)) {
                for (k in name) {
                    for (i = els.length - 1; i >= 0; i--) {
                        style(els[i], k, name[k]);
                    }
                }
                return;
            }
            if (val === undefined) {
                ret = '';
                if (elem) {
                    ret = style(elem, name, val);
                }
                return ret;
            } else {
                for (i = els.length - 1; i >= 0; i--) {
                    style(els[i], name, val);
                }
            }
            return undefined;
        },
        /**
         * Get the computed value of a style property for the first element in the set of matched elements.
         * or
         * Set one or more CSS properties for the set of matched elements.
         * @param {HTMLElement[]|String|HTMLElement} selector
         * @param {String|Object} name A CSS property. or A map of property-value pairs to set.
         * @param [val] A value to set for the property.
         * @return {undefined|String}
         */
        css:function (selector, name, val) {
            var els = getEl(selector),
                elem = els[0],
                k,
                ret,
                i;
            // supports hash
            if (S.isPlainObject(name)) {
                for (k in name) {
                    for (i = els.length - 1; i >= 0; i--) {
                        style(els[i], k, name[k]);
                    }
                }
                return undefined;
            }

            name = camelCase(name);
            // getter
            if (val === undefined) {
                // supports css selector/Node/NodeList
                ret = '';
                if (elem) {
                    ret = _getComputedStyle(elem, name);
                }
                if (ret == 'auto') {
                    ret = custom_style(elem, name);
                }
                ;
                return (typeof ret == 'undefined') ? '' : ret;
            }
            // setter
            else {
                for (i = els.length - 1; i >= 0; i--) {
                    style(els[i], name, val);
                }
            }
            return undefined;
        },
        /**
         * Display the matched elements.
         * @param {HTMLElement[]|String|HTMLElement} selector Matched elements.
         */
        show:function (selector) {
            var els = getEl(selector),
                tagName,
                old,
                elem, i;
            for (i = els.length - 1; i >= 0; i--) {
                elem = els[i];
                if (elem.style.display == 'none') {
                    elem.style.display = '';
                } else if (STYLE.css(elem, 'display') === 'none') {
                    tagName = elem.tagName.toLowerCase();
                    old = getDefaultDisplay(tagName);
                    elem.style.display = old;
                }
            }
        },
        /**
         * Hide the matched elements.
         * @param {HTMLElement[]|String|HTMLElement} selector Matched elements.
         */
        hide:function (selector) {
            var els = getEl(selector),
                elem, i;
            for (i = els.length - 1; i >= 0; i--) {
                elem = els[i];
                var style = elem.style,
                    old = style.display;
                if (old !== 'none') {
                    if (old) {
                        defaultDisplay[elem.tagName] = old;
                    }
                    style.display = 'none';
                }
            }
        },
        /**
         * Display or hide the matched elements.
         * @param {HTMLElement[]|String|HTMLElement} selector Matched elements.
         */
        toggle:function (selector) {
            var els = getEl(selector),
                elem, i;
            for (i = els.length - 1; i >= 0; i--) {
                elem = els[i];
                if (STYLE.css(elem, 'display') === 'none') {
                    STYLE.show(elem);
                } else {
                    STYLE.hide(elem);
                }
            }
        },
        /**
         * Creates a stylesheet from a text blob of rules.
         * These rules will be wrapped in a STYLE tag and appended to the HEAD of the document.
         * if cssText does not contain css hacks, u can just use DOM.create('<style>xx</style>')
         * @param {window} [refWin=window] Window which will accept this stylesheet
         * @param {String} [cssText] The text containing the css rules
         * @param {String} [id] An id to add to the stylesheet for later removal
         */
        addStyleSheet:function (refWin, cssText, id) {
            refWin = refWin || window;

            if (typeof refWin == 'string') {
                id = cssText;
                cssText = refWin;
                refWin = window;
            }
            var win;
            if (refWin != window) {
                refWin = getEl(refWin)[0];
                win = refWin.nodeType == 9 ? refWin.defaultView : window;
            } else {
                win = window;
            }

            var doc = win.document,
                elem;

            if (id && (id = id.replace('#', ''))) {
                elem = getEl('#' + id, doc)[0];
            }

            if (elem) {
                return;
            }

            elem = doc.createElement('style');
            elem.id = id;

            getEl('head', doc)[0].appendChild(elem);
            elem.appendChild(doc.createTextNode(cssText));
        },
        /**
         * Make matched elements unselectable
         * @param {HTMLElement[]|String|HTMLElement} selector  Matched elements.
         */
        unselectable:function (selector) {
            var _els = getEl(selector),
                elem,
                j,
                i = 0,
                style;
            for (j = _els.length - 1; j >= 0; j--) {
                elem = _els[j];
                style = elem.style;
                style['UserSelect'] = 'none';
                if (UA('Gecko/')) {
                    style['MozUserSelect'] = 'none';
                } else if (UA('AppleWebKit/')) {
                    style['WebkitUserSelect'] = 'none';
                }
            }
        },
        /**
         * Get the current computed width for the first element in the set of matched elements, including padding but not border.
         * @method
         * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
         * @return {Number}
         */
        innerWidth:function (selector) {
            var el = getEl(selector)[0];
            if (!el) {
                return 0;
            }
            var style = document.defaultView.getComputedStyle(el);
            var width = getNumber(STYLE.css(el, 'width'));
            var paddingLeft = getNumber(style.paddingLeft);
            var paddingRight = getNumber(style.paddingRight);
            return width + paddingLeft + paddingRight;
        },
        /**
         * Get the current computed height for the first element in the set of matched elements, including padding but not border.
         * @method
         * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
         * @return {Number}
         */
        innerHeight:function (selector) {
            var el = getEl(selector)[0];
            if (!el) {
                return 0;
            }
            var style = document.defaultView.getComputedStyle(el);
            var width = getNumber(STYLE.css(el, 'height'));
            var paddingLeft = getNumber(style.paddingTop);
            var paddingRight = getNumber(style.paddingBottom);
            return width + paddingLeft + paddingRight;
        },
        /**
         *  Get the current computed width for the first element in the set of matched elements, including padding and border, and optionally margin.
         * @method
         * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
         * @param {Boolean} [includeMargin] A Boolean indicating whether to include the element's margin in the calculation.
         * @return {Number}
         */
        outerWidth:function (selector) {
            var el = getEl(selector)[0];
            if (!el) {
                return 0;
            }
            var style = document.defaultView.getComputedStyle(el);
            var width = getNumber(STYLE.css(el, 'width'));
            var paddingLeft = getNumber(style.paddingLeft);
            var paddingRight = getNumber(style.paddingRight);
            var borderLeft = getNumber(style.borderLeft);
            var borderRight = getNumber(style.borderRight);
            var marginLeft = getNumber(style.marginLeft);
            var marginRight = getNumber(style.marginRight);
            return width + paddingLeft + borderLeft + marginLeft + paddingRight + borderRight + marginRight;
        },
        /**
         * Get the current computed height for the first element in the set of matched elements, including padding, border, and optionally margin.
         * @method
         * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
         * @param {Boolean} [includeMargin] A Boolean indicating whether to include the element's margin in the calculation.
         * @return {Number}
         */
        outerHeight:function (selector) {
            var el = getEl(selector)[0];
            if (!el) {
                return 0;
            }
            var style = document.defaultView.getComputedStyle(el);
            var height = getNumber(STYLE.css(el, 'height'));
            var paddingTop = getNumber(style.paddingTop);
            var borderTop = getNumber(style.borderTop);
            var marginTop = getNumber(style.marginTop);
            var paddingBottom = getNumber(style.paddingBottom);
            var borderBottom = getNumber(style.borderBottom);
            var marginBottom = getNumber(style.marginBottom);
            return height + paddingTop + borderTop + marginTop + paddingBottom + borderBottom + marginBottom;
        },
        /**
         * Get the current computed width for the first element in the set of matched elements.
         * or
         * Set the CSS width of each element in the set of matched elements.
         * @method
         * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
         * @param {String|Number} [value]
         * An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
         * @return {Number|undefined}
         */
        width:function (selector, value) {
            var ret = STYLE.css(selector, 'width', value);
            return getNumber(ret);
        },
        /**
         * Get the current computed height for the first element in the set of matched elements.
         * or
         * Set the CSS height of each element in the set of matched elements.
         * @method
         * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
         * @param {String|Number} [value]
         * An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
         * @return {Number|undefined}
         */
        height:function (selector, height, value) {
            var ret = STYLE.css(selector, 'height', value);
            return getNumber(ret);
        }
    };

    return STYLE;
})
