/**
 *dom-style
 * @author tingbao.peng@gmail.com
 */

KISSY.add('dom/style', function (S) {

    function getEl(selector) {
        if (selector && typeof(selector) == 'string') {
            return document.body.querySelectorAll(selector);
        }
        if (selector.nodeType && selector.nodeType == 1) {
            return [selector];
        }
        if (selector.length && selector.length > 0 && selector[0].nodeType && selector[0].nodeType == 1) {
            return selector;
        }
        return [];
    }

    function style(elem, name, val){
        var style,
            ret,
            hook;
        if (elem.nodeType === 3 || elem.nodeType === 8 || !(style = elem[STYLE])) {
            return undefined;
        }
        name = camelCase(name);
        hook = CUSTOM_STYLES[name];
        name = cssProps[name] || name;
        // setter
        if (val !== undefined) {
            // normalize unset
            if (val === null || val === EMPTY) {
                val = EMPTY;
            }
            // number values may need a unit
            else if (!isNaN(Number(val)) && !cssNumber[name]) {
                val += DEFAULT_UNIT;
            }
            if (hook && hook.set) {
                val = hook.set(elem, val);
            }
            if (val !== undefined) {
                // ie 无效值报错
                try {
                    // EMPTY will unset style!
                    style[name] = val;
                } catch (e) {
                    S.log('css set error :' + e);
                }
                // #80 fix,font-family
                if (val === EMPTY && style.removeAttribute) {
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
            // If a hook was provided get the non-computed value from there
            if (hook && 'get' in hook && (ret = hook.get(elem, false)) !== undefined) {

            } else {
                // Otherwise just get the value from the style object
                ret = style[ name ];
            }
            return ret === undefined ? '' : ret;
        }
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
};

return STYLE;
})
