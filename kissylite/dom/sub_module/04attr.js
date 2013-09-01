/**
 * dom-attr
 * @author tingbao.peng@gmail.com
 */
 KISSY.add('dom/attr', function (S) {
    function getEl(selector, context) {
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
        if (selector.length && selector.length > 0 && selector[0].nodeType && selector[0].nodeType == 1) {
            return selector;
        }
        return [];
    }
 
    var propFix = {
            'hidefocus': 'hideFocus',
            'tabindex': 'tabIndex',
            'readonly': 'readOnly',
            'for': 'htmlFor',
            'class': 'className',
            'maxlength': 'maxLength',
            'cellspacing': 'cellSpacing',
            'cellpadding': 'cellPadding',
            'rowspan': 'rowSpan',
            'colspan': 'colSpan', 
            'usemap': 'useMap',
            'frameborder': 'frameBorder',
            'contenteditable': 'contentEditable'
        };
    var attrFn = {
            val: 1,
            css: 1,
            html: 1,
            text: 1,
            data: 1,
            width: 1,
            height: 1,
            offset: 1,
            scrollTop: 1,
            scrollLeft: 1
        };
    var R_RETURN = /\r/g;
    var ATTR = {
        /**
         * Get the value of a property for the first element in the set of matched elements.
         * or
         * Set one or more properties for the set of matched elements.
         * @param {HTMLElement[]|String|HTMLElement} selector matched elements
         * @param {String|Object} name
         * The name of the property to set.
         * or
         * A map of property-value pairs to set.
         * @param [value] A value to set for the property.
         * @return {String|undefined|Boolean}
         */
        prop: function (selector, name, value) {
            var elems = getEl(selector),
                i,
                elem;
            // supports hash
            if (S.isPlainObject(name)) {
                S.each(name, function (v, k) {
                    ATTR.prop(elems, k, v);
                });
                return undefined;
            }
            name = propFix[ name ] || name;
            //setter
            if (value !== undefined) {
                for (i = elems.length - 1; i >= 0; i--) {
                    elem = elems[i];
                    elem[ name ] = value;
                }
            } else {
            //getter
                if (elems.length) {
                    return elems[0][name];
                }
            }
            return undefined;
        },
        /**
        * Whether one of the matched elements has specified property name
        * @param {HTMLElement[]|String|HTMLElement} selector Ԫ��
        * @param {String} name The name of property to test
        * @return {Boolean}
        */
        hasProp: function (selector, name) {
            var elems = getEl(selector);
            var i,
                len = elems.length,
                el;
            name = propFix[ name ] || name;
            for (i = 0; i < len; i++) {
                el = elems[i];
                if (el[name] !== undefined) {
                    return true;
                }
            }
            return false;
        },
        /**
         * Remove a property for the set of matched elements.
         * @param {HTMLElement[]|String|HTMLElement} selector matched elements
         * @param {String} name The name of the property to remove.
         */
        removeProp: function (selector, name) {
            name = propFix[ name ] || name;
            var elems = getEl(selector),
                i,
                el;
            for (i = elems.length - 1; i >= 0; i--) {
                el = elems[i];
                try {
                    el[ name ] = undefined;
                    delete el[ name ];
                } catch (e) {
                    // S.log('delete el property error : ');
                    // S.log(e);
                }
            }
        },
        /**
        * Get the value of an attribute for the first element in the set of matched elements.
        * or
        * Set one or more attributes for the set of matched elements.
        * @param {HTMLElement[]|HTMLElement|String} selector matched elements
        * @param {String|Object} name The name of the attribute to set. or A map of attribute-value pairs to set.
        * @param [val] A value to set for the attribute.
        * @return {String|undefined}
        */
        attr: function (selector, name, val) {

            var els = getEl(selector),
                attrNormalizer,
                i,
                el = els[0],
                ret;

            // supports hash
            if (S.isPlainObject(name)) {
                for (var k in name) {
                    ATTR.attr(els, k, name[k]);
                }
                return undefined;
            }

            // attr functions
            if (attrFn[name]) {
                //return DOM[name](selector, val);
            }

            name = name.toLowerCase();

          
            //getter
            if (val === undefined) {
                if (el && el.nodeType === 1) {
                    ret = el.getAttribute(name);
                    return ret === null ? undefined : ret;
                }
            } else {
            //setter
                for (i = els.length - 1; i >= 0; i--) {
                    el = els[i];
                    if (el && el.nodeType === 1) {
                        el.setAttribute(name, '' + val);
                    }
                }
            }
            return undefined;
        },
        /**
        * Remove an attribute from each element in the set of matched elements.
        * @param {HTMLElement[]|String} selector matched elements
        * @param {String} name An attribute to remove
        */
        removeAttr: function (selector, name) {
            name = name.toLowerCase();
            var els = getEl(selector),
                propName,
                el, i;
            for (i = els.length - 1; i >= 0; i--) {
                el = els[i];
                if (el.nodeType == 1) {
                    el.removeAttribute(name);
                }
            }
        },
        
        /**
        * Whether one of the matched elements has specified attribute
        * @method
        * @param {HTMLElement[]|String} selector matched elements
        * @param {String} name The attribute to be tested
        * @return {Boolean}
        */
        hasAttr:function (selector, name) {
            var elems = getEl(selector), i,
                len = elems.length;
            for (i = 0; i < len; i++) {
                if (elems[i].hasAttribute(name)) {
                    return true;
                }
            }
            return false;
        },
        /**
        * Get the current value of the first element in the set of matched elements.
        * or
        * Set the value of each element in the set of matched elements.
        * @param {HTMLElement[]|String} selector matched elements
        * @param {String|String[]} [value] A string of text or an array of strings corresponding to the value of each matched element to set as selected/checked.
        * @return {undefined|String|String[]|Number}
        */
        val: function (selector, value) {
                var ret, elem, els, i, val;
                var els = getEl(selector);
                //getter
                if (value === undefined) {
    
                    elem = els[0];
    
                    if (elem) {
                        ret = elem.value;
                        if(typeof ret === 'string'){
                            ret.replace(/\r/g, '');
                        }else if(ret===null){
                            ret = '';
                        }
                        return ret;
                    }
    
                    return ret;
                }
                //setter
                for (i = els.length - 1; i >= 0; i--) {
                    elem = els[i];
                    if (elem.nodeType !== 1) {
                        return undefined;
                    }
    
                    val = value;
    
                    // Treat null/undefined as ''; convert numbers to string
                    if (val == null) {
                        val = '';
                    } else if (typeof val === 'number') {
                        val += '';
                    } else if (S.isArray(val)) {
                        val = S.map(val, function (value){
                            return value == null ? '' : value + '';
                        });
                    }
                        elem.value = val;
                }
                return undefined;
            },
        /**
         * Get the combined text contents of each element in the set of matched elements, including their descendants.
         * or
         * Set the content of each element in the set of matched elements to the specified text.
         * @param {HTMLElement[]|HTMLElement|String} selector matched elements
         * @param {String} [val] A string of text to set as the content of each matched element.
         * @return {String|undefined}
         */
        text: function (selector, val) {
            var el, els, i, nodeType;
            els = getEl(selector);
            // getter
            if (val === undefined) {
                el = els[0];
                return el.textContent;
            } else {
                //setter
                for (i = els.length - 1; i >= 0; i--) {
                    el = els[i];
                    nodeType = el.nodeType;
                    if (nodeType == 1) {
                        if(el.childNodes){
                            for(var m=0;m<el.childNodes.length;m++){
                                el.removeChild(el.childNodes[m]);
                            }
                        }
                        
                        el.appendChild(el.ownerDocument.createTextNode(val));
                    }
                    else if (nodeType == 3 || nodeType == 4) {
                        el.nodeValue = val;
                    }
                }
            }
            return undefined;
        }
    };
    
    
    return ATTR;
 
 });