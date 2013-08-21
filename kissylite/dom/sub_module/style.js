/**
 *dom-style
 * @author tingbao.peng@gmail.com
 */

KISSY.add('dom/style', function (S) {

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

    function UA(name){
        return navigator.useAgent.indexof(name)!=-1;
    }

    function getEl(selector, context) {
        var doc = context || document.body;
        if (selector && typeof(selector) == 'string') {
            return doc.querySelectorAll(selector);
        }
        if (selector.nodeType && selector.nodeType == 1) {
            return [selector];
        }
        if (selector.length && selector.length > 0 && selector[0].nodeType && selector[0].nodeType == 1) {
            return selector;
        }
        return [];
    }

    function camelCase(name) {
        return name.replace(/-([a-z])/ig, function () {
            return arguments[1].toUpperCase();
        });
    }

    function style(elem, name, val) {
        var style,
            ret;

        if (elem.nodeType === 3 || elem.nodeType === 8 || !(style = elem.style) {
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

            if (val !== undefined) {
                style[name] = val;
                // #80 fix,font-family
                if (val === '' && style.removeAttribute) {
                    style.removeAttribute(name);
                }
            }
            if (!style.cssText) {
                // weird for chrome, safari is ok?
                // https://github.com/kissyteam/kissy/issues/231
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

        // 还没有加入到 document，就取行内
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
    };
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

    function getNumber(str){
        return parseFloat(str);
    }
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
         * @param {HTMLElement[]|String|HTMLElement} selector 选择器或节点或节点数组
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
                    ret = DOM._getComputedStyle(elem, name);
                }
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
                // 可能元素还处于隐藏状态，比如 css 里设置了 display: none
                if (STYLE.css(elem, 'display') === 'none') {
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

            // 仅添加一次，不重复添加
            if (elem) {
                return;
            }

            elem = doc.createElement('style');
            elem.id = id;

            // 先添加到 DOM 树中，再给 cssText 赋值，否则 css hack 会失效
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
                if (UA['gecko']) {
                    style['MozUserSelect'] = 'none';
                } else if (UA['webkit']) {
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
        innerWidth: function(selector){
               var el = getEl(selector)[0];
               if(!el){
                   return 0;
               }
              var style = _getComputedStyle(el);
              var width = getNumber(style.getPerportyValue('width'));
              var paddingLeft = getNumber(style.getPerportyValue('padding-left'));
              var paddingRight = getNumber(style.getPerportyValue('padding-right'));
             return width+paddingLeft+paddingRight;
        },
        /**
        * Get the current computed height for the first element in the set of matched elements, including padding but not border.
        * @method
        * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
        * @return {Number}
        */
        innerHeight: function(selector){
            var el = getEl(selector)[0];
               if(!el){
                   return 0;
               }
              var style = _getComputedStyle(el);
              var width = getNumber(style.getPerportyValue('height'));
              var paddingLeft = getNumber(style.getPerportyValue('padding-top'));
              var paddingRight = getNumber(style.getPerportyValue('padding-bottom'));
             return width+paddingLeft+paddingRight;
        },
        /**
        *  Get the current computed width for the first element in the set of matched elements, including padding and border, and optionally margin.
        * @method
        * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
        * @param {Boolean} [includeMargin] A Boolean indicating whether to include the element's margin in the calculation.
        * @return {Number}
        */
        outerWidth: function(selector){
            var el = getEl(selector)[0];
              if(!el){
                  return 0;
              }
             var style = _getComputedStyle(el);
             var width = getNumber(style.getPerportyValue('width'));
             var paddingLeft = getNumber(style.getPerportyValue('padding-left'));
             var borderLeft = getNumber(style.getPerportyValue('border-left'));
             var marginLeft = getNumber(style.getPerportyValue('margin-left'));
             var paddingRight = getNumber(style.getPerportyValue('padding-right'));
             var borderRight = getNumber(style.getPerportyValue('border-right'));
             var marginRight = getNumber(style.getPerportyValue('margin-right'));
            return width+paddingLeft+borderLeft+marginLeft+paddingRight+borderRight+marginRight;
        },
        /**
        * Get the current computed height for the first element in the set of matched elements, including padding, border, and optionally margin.
        * @method
        * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
        * @param {Boolean} [includeMargin] A Boolean indicating whether to include the element's margin in the calculation.
        * @return {Number}
        */
        outerHeight:function(){
            var el = getEl(selector)[0];
              if(!el){
                  return 0;
              }
             var style = _getComputedStyle(el);
             var height = getNumber(style.getPerportyValue('height'));
             var paddingTop = getNumber(style.getPerportyValue('padding-top'));
             var borderTop = getNumber(style.getPerportyValue('border-top'));
             var marginTop = getNumber(style.getPerportyValue('margin-top'));
             var paddingBottom = getNumber(style.getPerportyValue('padding-bottom'));
             var borderBottom = getNumber(style.getPerportyValue('border-bottom'));
             var marginBottom = getNumber(style.getPerportyValue('margin-bottom'));
            return width+paddingTop+borderTop+marginTop+paddingBottom+borderBottom+marginBottom;
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
        width: function(selector,value){
            var els = getEl(selector);
            var ret = STYLE.css(selector,'width',value);
            return ret;
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
        height: function(selector,height){
            var els = getEl(selector);
            var ret = STYLE.css(selector,'height',value);
            return ret;
        }

    };

    return STYLE;
})
