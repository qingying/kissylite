/**
 * dom-selector
 * @author tingbao.peng@gmail.com
 */
KISSY.add('dom/selector', function (S) {
    var docElem = document.documentElement;
    var matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector;
    function getSelector(selector, context, fun) {
        /*set body as the default context*/
        context = context || document.body;
        /*css selector*/
        if (selector && typeof(selector) == 'string') {
            selector = selector.replace(/^\s+|\s+$/g, '');
            var result = context[fun](selector);
            return result;
        } 
        return selector;
    }
    function test(el, filter) {
        if (!filter) {
            return el;
        }
        if (typeof(filter) == 'string') {
            return matches.call(el, filter);
        }
        if (typeof(filter) == 'function') {
            return filter(el);
        }
        return false;
    }
    var SELECTOR =  {
        /**
         * Accepts a string containing a CSS selector which is then used to match a set of elements.
         * @param {String|HTMLElement[]} selector
         * A string containing a selector expression.
         * or
         * array of HTMLElements.
         * @param {String|HTMLElement[]|HTMLDocument|HTMLElement|window} [context] context under which to find elements matching selector.
         * @return {HTMLElement} The first of found HTMLElements
         */
        get:function (selector, context) {
            return getSelector(selector, context, 'querySelector');
        },

        /**
         * Accepts a string containing a CSS selector which is then used to match a set of elements.
         * @param {String|HTMLElement[]} selector
         * A string containing a selector expression.
         * or
         * array of HTMLElements.
         * @param {String|HTMLElement[]|HTMLDocument|HTMLElement} [context] context under which to find elements matching selector.
         * @return {HTMLElement[]} The array of found HTMLElements
         */
        query:function (selector, context) {
            return getSelector(selector, context, 'querySelectorAll');
        },
        /**
         * Reduce the set of matched elements to those that match the selector or pass the function's test.
         * @param {String|HTMLElement[]} selector Matched elements
         * @param {String|Function} filter function
         * @param {String|HTMLElement[]|HTMLDocument} [context] Context under which to find matched elements
         * @return {HTMLElement[]}
         */
        filter:function (selector, filter, context) {
            var elems = getSelector(selector, context, 'querySelectorAll');
            if (elems) {
                var filterElems = [];
                for (var i = 0; i < elems.length; i++) {
                    if (test(elems[i],filter)) {
                        filterElems.push(elems[i]);
                    }
                }
                return filterElems;

            }
            return [];
        },
        /**
         * Returns true if the matched element(s) pass the filter test
         * @param {String|HTMLElement[]} selector Matched elements
         * @param {String|Function}filter function
         * @param {String|HTMLElement[]|HTMLDocument} [context] Context under which to find matched elements
         * @member KISSY.DOM
         * @return {Boolean}
         */
        test:function (selector, filter, context) {
            var elems = getSelector(selector, context, 'querySelectorAll');
            for (var i = 0; i < elems.length; i++) {
                if (!test(elems[i],filter)) {
                    return false;
                }
            }
            return true;
        }
    };

    return  SELECTOR;
});/**
 *dom-class
 * @author tingbao.peng@gmail.com
 */

KISSY.add('dom/class', function (S) {

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

    function getClsArr(clsStr) {
        var arr = clsStr.split(' ');
        var newArr = [];
        var v;
        for (var i = 0; i < arr.length; i++) {
            if (v = arr[i]) {
                newArr.push(v);
            }
        }
        return newArr;
    }

    function batch(method) {
        return function (selector, classNames) {
            var els = getEl(selector);
            var clsArr = getClsArr(classNames);
            if (els.length && els.length > 0 && clsArr.length > 0) {
                for (var i = 0; i < els.length; i++) {
                    for (var j = 0; j < clsArr.length; j++) {
                        if (els[i].nodeType && els[i].nodeType == 1) {
                            els[i].classList[method](clsArr[j]);
                        }
                    }
                }
            }
        }
    }

    var CLASS = {
        /**
         * Determine whether any of the matched elements are assigned the given classes.
         * @param {HTMLElement|String|HTMLElement[]} selector matched elements
         * @method
         * @param {String} className One or more class names to search for.
         * multiple class names is separated by space
         * @return {Boolean}
         */
        hasClass:function (selector, classNames) {
            var els = getEl(selector);
            var clsArr = getClsArr(classNames);

            if (els.length && els.length > 0) {
                var bl = true;
                for (var i = 0; i < els.length; i++) {
                    for (var j = 0; j < clsArr.length; j++) {
                        if (els[i].nodeType && els[i].nodeType == 1 && !els[i].classList.contains(clsArr[j])) {
                            bl = false;
                        }
                    }
                }
                if (bl) {
                    return true;
                }
            }

            return false;
        },
        /**
         * Adds the specified class(es) to each of the set of matched elements.
         * @method
         * @param {HTMLElement|String|HTMLElement[]} selector matched elements
         * @param {String} className One or more class names to be added to the class attribute of each matched element.
         * multiple class names is separated by space
         */
        addClass:batch('add'),
        /**
         * Remove a single class, multiple classes, or all classes from each element in the set of matched elements.
         * @param {HTMLElement|String|HTMLElement[]} selector matched elements
         * @method
         * @param {String} className One or more class names to be removed from the class attribute of each matched element.
         * multiple class names is separated by space
         */
        removeClass:batch('remove'),
        /**
         * Replace a class with another class for matched elements.
         * If no oldClassName is present, the newClassName is simply added.
         * @param {HTMLElement|String|HTMLElement[]} selector matched elements
         * @method
         * @param {String} oldClassName One or more class names to be removed from the class attribute of each matched element.
         * multiple class names is separated by space
         * @param {String} newClassName One or more class names to be added to the class attribute of each matched element.
         * multiple class names is separated by space
         */
        replaceClass:function (selector, oldClassName, newClassName) {
            CLASS.removeClass(selector, oldClassName);
            CLASS.addClass(selector, newClassName);
        },
        /**
         * Add or remove one or more classes from each element in the set of
         * matched elements, depending on either the class's presence or the
         * value of the switch argument.
         * @param {HTMLElement|String|HTMLElement[]} selector matched elements
         * @param {String} className One or more class names to be added to the class attribute of each matched element.
         * multiple class names is separated by space
         * @method
         */
        toggleClass:batch('toggle')

    };

    return CLASS;
});/**
 *dom-create
 * @author tingbao.peng@gmail.com
 */
KISSY.add('dom/create', function (S) {

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

    var R_HTML = /<|&#?\w+;/;
    var RE_SIMPLE_TAG = /^<(\w+)\s*\/?>(?:<\/\1>)?$/;
    var RE_TAG = /<([\w:]+)/;
    var R_XHTML_TAG = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig;
    var creators = {};
    var creatorsMap = {
        option:'select',
        optgroup:'select',
        area:'map',
        thead:'table',
        td:'tr',
        th:'tr',
        tr:'tbody',
        tbody:'table',
        tfoot:'table',
        caption:'table',
        colgroup:'table',
        col:'colgroup',
        legend:'fieldset'
    }, p, creators;

    for (p in creatorsMap) {
        (function (tag) {
            creators[p] = function (html, ownerDoc) {
                return CREATE.create('<' + tag + '>' +
                    html + '<' + '/' + tag + '>',
                    null, ownerDoc);
            };
        })(creatorsMap[p]);
    }

    function defaultCreator(html, ownerDoc) {
        var doc = document;
        var frag = ownerDoc && ownerDoc != doc ?
            ownerDoc.createElement('div') :
            doc.createElement('div');
        // html Ϊ <style></style> ʱ���У�����������Ԫ�أ�
        frag.innerHTML = 'm<div>' + html + '<' + '/div>';
        return frag.lastChild;
    }

    // ��ӳ�Ա��Ԫ����?
    function attachProps(elem, props) {
        var ownerDoc = elem.ownerDocument;
        if (S.isPlainObject(props)) {
            if (elem.nodeType == 1) {
                setAttr(elem, props);
            }
            // document fragment
            else if (elem.nodeType == 11) {
                for (var i; i < elem.childNodes.length; i++) {
                    setAttr(elem.childNodes[i], props);
                }
            }
        }

        function setAttr(node, props) {
            for (var p in props) {
                node.setAttribute(p, props[p]);
            }
        }

        return elem;
    }

    // �� nodeList ת��Ϊ fragment
    function nodeListToFragment(nodes) {
        var ret = null,
            i,
            ownerDoc,
            len;
        if (nodes && (nodes.push || nodes.item) && nodes[0]) {
            ownerDoc = nodes[0].ownerDocument;
            ret = ownerDoc.createDocumentFragment();
            nodes = S.makeArray(nodes);
            for (i = 0, len = nodes.length; i < len; i++) {
                ret.appendChild(nodes[i]);
            }
        } else {
            S.log('Unable to convert ' + nodes + ' to fragment.');
        }
        return ret;
    }

    function cleanData(el, isClearSelf) {
        var els = el.querySelectorAll('*');
        var DOMEvent = S.require('event/dom');
        if (DOMEvent) {
            DOMEvent.detach(els);
            if (isClearSelf) {
                DOMEvent.detach(el);
            }
        }
    }

    // ��¡�����¼��� data
    function cloneWithDataAndEvent(src, dest) {
        var DOMEvent = S.require('event/dom');

        // �¼�Ҫ�����?
        if (DOMEvent) {
            // attach src 's event data and dom attached listener to dest
            DOMEvent.clone(src, dest);
        }
    }

    function processAll(fn, elem, clone) {
        var elemNodeType = elem.nodeType;
        if (elemNodeType == 11) {
            var eCs = elem.childNodes,
                cloneCs = clone.childNodes,
                fIndex = 0;
            while (eCs[fIndex]) {
                if (cloneCs[fIndex]) {
                    processAll(fn, eCs[fIndex], cloneCs[fIndex]);
                }
                fIndex++;
            }
        } else if (elemNodeType == 1) {
            var elemChildren = el.querySelectorAll('*'),
                cloneChildren = clone.querySelectorAll('*'),
                cIndex = 0;
            while (elemChildren[cIndex]) {
                if (cloneChildren[cIndex]) {
                    fn(elemChildren[cIndex], cloneChildren[cIndex]);
                }
                cIndex++;
            }
        }
    }

    var CREATE = {
        /**
         * Creates DOM elements on the fly from the provided string of raw HTML.
         * @param {String} tagName
         * @param {Object} [props] An map of attributes on the newly-created element.
         * @param {HTMLDocument} [ownerDoc] A document in which the new elements will be created
         * @return {HTMLElement}
         */
        create:function (html, props, ownerDoc) {
            var context = ownerDoc || document;
            var ret = null;
            var m, k, ta, holder, nodes;
            if (!html) {
                return ret;
            }
            if (html.nodeType) {
                return CREATE.clone(html);
            }
            if (typeof(html) != 'string') {
                return ret;
            }

            if (!R_HTML.test(html)) {
                ret = context.createTextNode(html);
            } else {
                if (m = RE_SIMPLE_TAG.exec(html)) {
                    ret = context.createElement(m[1]);
                } else {
                    // Fix 'XHTML'-style tags in all browsers
                    html = html.replace(R_XHTML_TAG, '<$1><' + '/$2>');
                    if ((m = RE_TAG.exec(html)) && (k = m[1])) {
                        tag = k.toLowerCase();
                    }
                    holder = (creators[tag] || defaultCreator)(html, context);
                    nodes = holder.childNodes;
                    if (nodes.length === 1) {
                        // return single node, breaking parentNode ref from 'fragment'
                        ret = nodes[0].parentNode.removeChild(nodes[0]);
                    } else if (nodes.length) {
                        // return multiple nodes as a fragment
                        ret = nodeListToFragment(nodes);
                    }
                }
            }
            return attachProps(ret, props);
        },
        /**
         * Get the HTML contents of the first element in the set of matched elements.
         * or
         * Set the HTML contents of each element in the set of matched elements.
         * @param {HTMLElement|String|HTMLElement[]} selector matched elements
         * @param {String} [htmlString]  A string of HTML to set as the content of each matched element.
         * @param {Boolean} [loadScripts=false] True to look for and process scripts
         */
        html:function (selector, htmlString, loadScripts) {
            // supports css selector/Node/NodeList
            var els = getEl(selector),
                el = els[0],
                success = false,
                valNode,
                i, elem;
            if (!el) {
                return null;
            }
            // getter
            if (htmlString === undefined) {
                // only gets value on the first of element nodes
                if (el.nodeType == 1) {
                    return el.innerHTML;
                } else {
                    return null;
                }
            }
            // setter
            else {
                htmlString += '';

                // faster
                // fix #103,some html element can not be set through innerHTML
                if (!htmlString.match(/<(?:script|style|link)/i)) {
                    try {
                        for (i = els.length - 1; i >= 0; i--) {
                            elem = els[i];
                            if (elem.nodeType == 1) {
                                cleanData(elem);
                                elem.innerHTML = htmlString;
                            }
                        }
                        success = true;
                    } catch (e) {
                        // a <= '<a>'
                        // a.innerHTML='<p>1</p>';
                    }

                }

                if (!success) {
                    el = els[0];
                    valNode = CREATE.create(htmlString, 0, el.ownerDocument, 0);
                    CREATE.empty(els);
                    el.appendChild(valNode);
                }
            }
        },
        /**
         * Get the outerHTML of the first element in the set of matched elements.
         * or
         * Set the outerHTML of each element in the set of matched elements.
         * @param {HTMLElement|String|HTMLElement[]} selector matched elements
         * @param {String} [htmlString]  A string of HTML to set as outerHTML of each matched element.
         * @param {Boolean} [loadScripts=false] True to look for and process scripts
         */
        outerHTML:function (selector, htmlString, loadScripts) {
            var els = getEl(selector),
                holder,
                i,
                valNode,
                ownerDoc,
                length = els.length,
                el = els[0];
            if (!el) {
                return null;
            }
            // getter
            if (htmlString === undefined) {
                return el.outerHTML
            } else {
                htmlString += '';
                if (!htmlString.match(/<(?:script|style|link)/i)) {
                    for (i = length - 1; i >= 0; i--) {
                        el = els[i];
                        if (el.nodeType == 1) {
                            cleanData(el, true);
                            el.outerHTML = htmlString;
                        }
                    }
                } else {
                    el = els[0];
                    valNode = CREATE.create(htmlString, 0, el.ownerDocument, 0);
                    el.parentNode.insertBefore(valNode, el);
                    el.parentNode.removeChild(el);

                }
            }
        },
        /**
         * Remove the set of matched elements from the DOM.
         * @param {HTMLElement|String|HTMLElement[]} selector matched elements
         * @param {Boolean} [keepData=false] whether keep bound events associated with the elements from removed.
         */
        remove:function (selector, keepData) {
            var el,
                els = getEl(selector),
                all,
                parent,
                DOMEvent = S.require('event/dom'),
                i;
            for (i = els.length - 1; i >= 0; i--) {
                el = els[i];
                if (!keepData && el.nodeType == 1) {
                    all = S.makeArray(el.querySelectorAll('*'));
                    all.push(el);
                    if (DOMEvent) {
                        DOMEvent.detach(all);
                    }
                }
                if (parent = el.parentNode) {
                    parent.removeChild(el);
                }
            }
        },
        /**
         * Create a deep copy of the first of matched elements.
         * @param {HTMLElement|String|HTMLElement[]} selector matched elements
         * @param {Boolean|Object} [deep=false] whether perform deep copy or copy config.
         * @param {Boolean} [deep.deep] whether perform deep copy
         * @param {Boolean} [deep.withDataAndEvent=false] A Boolean indicating
         * whether event handlers and data should be copied along with the elements.
         * @param {Boolean} [deep.deepWithDataAndEvent=false]
         * A Boolean indicating whether event handlers and data for all children of the cloned element should be copied.
         * if set true then deep argument must be set true as well.
         * refer: https://developer.mozilla.org/En/DOM/Node.cloneNode
         * @return {HTMLElement}
         */
        clone:function (selector, deep, withDataAndEvent, deepWithDataAndEvent) {
            if (typeof deep === 'object') {
                deepWithDataAndEvent = deep['deepWithDataAndEvent'];
                withDataAndEvent = deep['withDataAndEvent'];
                deep = deep['deep'];
            }

            var elems = getEl(selector),
                clone,
                elemNodeType;

            if (!elems) {
                return null;
            }
            elem = elem[0];
            elemNodeType = elem.nodeType;

            clone = elem.cloneNode(deep);

            // runtime ����¼�ģ��?
            if (withDataAndEvent) {
                cloneWithDataAndEvent(elem, clone);
                if (deep && deepWithDataAndEvent) {
                    processAll(cloneWithDataAndEvent, elem, clone);
                }
            }
            return clone;
        },
        /**
         * Remove(include data and event handlers) all child nodes of the set of matched elements from the DOM.
         * @param {HTMLElement|String|HTMLElement[]} selector matched elements
         */
        empty:function (selector) {
            var els = getEl(selector),
                el, i;
            for (i = els.length - 1; i >= 0; i--) {
                el = els[i];
                CREATE.remove(el.childNodes);
            }
        },
    };
    return CREATE;
});

/**
 * dom-attr
 * @author tingbao.peng@gmail.com
 */
KISSY.add('dom/attr', function (S) {
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

    var propFix = {
        'hidefocus':'hideFocus',
        'tabindex':'tabIndex',
        'readonly':'readOnly',
        'for':'htmlFor',
        'class':'className',
        'maxlength':'maxLength',
        'cellspacing':'cellSpacing',
        'cellpadding':'cellPadding',
        'rowspan':'rowSpan',
        'colspan':'colSpan',
        'usemap':'useMap',
        'frameborder':'frameBorder',
        'contenteditable':'contentEditable'
    };
    var attrFn = {
        val:1,
        css:1,
        html:1,
        text:1,
        data:1,
        width:1,
        height:1,
        offset:1,
        scrollTop:1,
        scrollLeft:1
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
        prop:function (selector, name, value) {
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
        hasProp:function (selector, name) {
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
        removeProp:function (selector, name) {
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
        attr:function (selector, name, val) {

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
        removeAttr:function (selector, name) {
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
        val:function (selector, value) {
            var ret, elem, els, i, val;
            var els = getEl(selector);
            //getter
            if (value === undefined) {

                elem = els[0];

                if (elem) {
                    ret = elem.value;
                    if (typeof ret === 'string') {
                        ret.replace(/\r/g, '');
                    } else if (ret === null) {
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
                    val = S.map(val, function (value) {
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
        text:function (selector, val) {
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
                        if (el.childNodes) {
                            for (var m = 0; m < el.childNodes.length; m++) {
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

});/**
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
/**
 *dom-offset
 * @author tingbao.peng@gmail.com
 */
KISSY.add('dom/offset', function (S) {
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

    function scroll(type) {
        return function (selector, number) {
            if (!isNaN(selector)) {
                number = selector + '';
                selector = window;
            }
            if (!selector) {
                selector = window;
            }
            if (selector == window) {
                if (!number) {
                    var ret = type == 'left' ? window.scrollX : window.scrollY;
                    return ret;
                } else {
                    var scrollNum = type == 'left' ? [number, window.scrollY] : [window.scrollX, number];
                    window.scrollTo(scrollNum[0], scrollNum[1]);
                }
            } else {
                var el = getEl(selector)[0];
                if (!el) {
                    return;
                }
                if (!number) {
                    var num = type == 'left' ? el.scrollLeft : el.scrollTop;
                    return num;
                } else {
                    if (type == 'left') {
                        el.scrollLeft = number;
                    } else {
                        el.scrollTop = number;
                    }
                }


            }
        }

    }

    var OFFSET = {
        /**
         * Get the current coordinates of the first element in the set of matched elements, relative to the document.
         * or
         * Set the current coordinates of every element in the set of matched elements, relative to the document.
         * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
         * @param {Object} [coordinates ] An object containing the properties top and left,
         * which are integers indicating the new top and left coordinates for the elements.
         * @param {Number} [coordinates.left ] the new top and left coordinates for the elements.
         * @param {Number} [coordinates.top ] the new top and top coordinates for the elements.
         * @return {Object|undefined} if Get, the format of returned value is same with coordinates.
         */
        offset:function (selector, coordinates) {
            var els = getEl(selector),
                el = els[0];
            var ret = {};
            if (!el) {
                return undefined;
            }
            //getter
            if (!coordinates) {
                var rect = el.getBoundingClientRect();
                ret.top = rect.top;
                ret.left = rect.left;
                return ret;
            } else {
                //setter
                var top = coordinates.top;
                var left = coordinates.left;
                for (var i = 0; i < els.length; i++) {
                    var style = document.defaultView.getComputedStyle(els[i]);
                    if (style.position == 'static') {
                        var rect = els[i].getBoundingClientRect();
                        els[i].style.position = 'relative';
                        els[i].style.left = left - rect.left + 'px';
                        els[i].style.top = top - rect.top + 'px';
                    } else {
                        els[i].style.left = left + 'px';
                        els[i].style.top = top + 'px';
                    }

                }
            }

        },
        /**
         * scrolls the first of matched elements into container view
         * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
         * @param {String|HTMLElement|HTMLDocument} [container=window] Container element
         * @param {Boolean|Object} [alignWithTop=true]If true, the scrolled element is aligned with the top of the scroll area.
         * If false, it is aligned with the bottom.
         * @param {Boolean} [alignWithTop.allowHorizontalScroll=true] Whether trigger horizontal scroll.
         * @param {Boolean} [alignWithTop.onlyScrollIfNeeded=false] scrollIntoView when element is out of view
         * and set top to false or true automatically if top is undefined
         * @param {Boolean} [allowHorizontalScroll=true] Whether trigger horizontal scroll.
         * refer: http://www.w3.org/TR/2009/WD-html5-20090423/editing.html#scrollIntoView
         *        http://www.sencha.com/deploy/dev/docs/source/Element.scroll-more.html#scrollIntoView
         *        http://yiminghe.javaeye.com/blog/390732
         */
        scrollIntoView:function (selector, container, alignWithTop, allowHorizontalScroll) {
            var el, onlyScrollIfNeeded;
            if (!(el = getEl(selector)[0])) {
                return
            }
            if (!container || !(container = getEl(container)[0])) {
                container = el.ownerDocument.defaultView;
            }
            if (S.isPlainObject(alignWithTop)) {
                allowHorizontalScroll = alignWithTop.allowHorizontalScroll;
                onlyScrollIfNeeded = alignWithTop.onlyScrollIfNeeded;
                alignWithTop = alignWithTop.alignWithTop;
            }
            allowHorizontalScroll = allowHorizontalScroll === undefined ? true : allowHorizontalScroll;

            var containerScroll,
                ww,
                wh;
            var elCss = window.getComputedStyle(el);
            var ew = elCss.width;
            var eh = elCss.height;
            var elOffset = {
                left:el.getBoundingClientRect().left,
                top:el.getBoundingClientRect().top
            };
            var diffTop, diffBottom, containerOffset;
            if (container == window) {
                ww = window.innerWidth;
                wh = window.innerHieght;
                containerScroll = {
                    left:window.scrollX,
                    top:window.scrollY
                };
                diffTop = {
                    left:elOffset.left - containerScroll.left,
                    top:elOffset.top - containerScroll.top
                }
                diffBottom = {
                    left:elOffset.left + ew - (containerScroll.left + ww),
                    top:elOffset.top + eh - (containerScroll.top + wh)
                }
            } else {
                ww = container.getBoundingClientRect().width;
                wh = container.getBoundingClientRect().height;
                containerScroll = {
                    left:container.getBoundingClientRect().left,
                    top:container.getBoundingClientRect().top
                }
                containerOffset = container.getBoundingClientRect();
                containerCss = window.getComputedStyle(container);
                diffTop = {
                    left:elOffset.left - (containerOffset.left +
                        (parseFloat(containerCss.borderLeftWidth) || 0)),
                    top:elOffset.top - (containerOffset.top +
                        (parseFloat(containerCss.borderTopWidth) || 0))
                };
                diffBottom = {
                    left:elOffset.left + ew -
                        (containerOffset.left + ww +
                            (parseFloat(containerCss.borderLeftWidth) || 0)),
                    top:elOffset.top + eh -
                        (containerOffset.top + wh +
                            (parseFloat(containerCss.borderTopWidth) || 0))
                };
            }
            if (onlyScrollIfNeeded) {
                if (diffTop.top < 0 || diffBottom.top > 0) {
                    // must  to top
                    if (alignWithTop === true) {
                        OFFSET.scrollTop(container, containerScroll.top + diffTop.top);
                    } else if (alignWithTop === false) {
                        OFFSET.scrollTop(container, containerScroll.top + diffBottom.top);
                    } else {
                        // show in view
                        if (diffTop.top < 0) {
                            OFFSET.scrollTop(container, containerScroll.top + diffTop.top);
                        } else {
                            OFFSET.scrollTop(container, containerScroll.top + diffBottom.top);
                        }
                    }
                }
            }
            else {
                alignWithTop = alignWithTop === undefined ? true : !!alignWithTop;
                if (alignWithTop) {
                    OFFSET.scrollTop(container, containerScroll.top + diffTop.top);
                } else {
                    OFFSET.scrollTop(container, containerScroll.top + diffBottom.top);
                }
            }

            if (allowHorizontalScroll) {
                if (onlyScrollIfNeeded) {
                    if (diffTop.left < 0 || diffBottom.left > 0) {
                        // must  to top
                        if (alignWithTop === true) {
                            OFFSET.scrollLeft(container, containerScroll.left + diffTop.left);
                        } else if (alignWithTop === false) {
                            OFFSET.scrollLeft(container, containerScroll.left + diffBottom.left);
                        } else {
                            // show in view
                            if (diffTop.left < 0) {
                                OFFSET.scrollLeft(container, containerScroll.left + diffTop.left);
                            } else {
                                OFFSET.scrollLeft(container, containerScroll.left + diffBottom.left);
                            }
                        }
                    }
                } else {
                    alignWithTop = alignWithTop === undefined ? true : !!alignWithTop;
                    if (alignWithTop) {
                        OFFSET.scrollLeft(container, containerScroll.left + diffTop.left);
                    } else {
                        OFFSET.scrollLeft(container, containerScroll.left + diffBottom.left);
                    }
                }
            }
        },
        /**
         * Get the width of document
         * @method
         */
        docWidth:function () {
            return document.body.clientWidth;
        },
        /**
         * Get the height of document
         * @method
         */
        docHeight:function () {
            return document.body.clientHeight;
        },
        /**
         * Get the height of window
         * @method
         */
        viewportHeight:function () {
            return window.innerHeight;
        },
        /**
         * Get the width of document
         * @param {window} [win=window] Window to be referred.
         * @method
         */
        viewportWidth:function () {
            return window.innerWidth;
        },
        /**
         * Get the current vertical position of the scroll bar for the first element in the set of matched elements.
         * or
         * Set the current vertical position of the scroll bar for each of the set of matched elements.
         * @param {HTMLElement[]|String|HTMLElement|window} selector matched elements
         * @param {Number} value An integer indicating the new position to set the scroll bar to.
         * @method
         */
        scrollTop:scroll('top'),
        /**
         * Get the current horizontal position of the scroll bar for the first element in the set of matched elements.
         * or
         * Set the current horizontal position of the scroll bar for each of the set of matched elements.
         * @param {HTMLElement[]|String|HTMLElement|window} selector matched elements
         * @param {Number} value An integer indicating the new position to set the scroll bar to.
         * @method
         */
        scrollLeft:scroll('left')
    };

    return OFFSET;
})/**
 *dom-offset
 * @author tingbao.peng@gmail.com
 */
KISSY.add('dom/insertion', function (S) {
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

    function getNode(el, type) {
        var ret = false;
        var node = el[type];
        while (node) {
            if (node.nodeType != 1) {
                node = node[type];
            } else {
                ret = node;
                break;
            }
        }
        return ret;
    }

    var R_SCRIPT_TYPE = /\/(java|ecma)script/i;

    function isJs(el) {
        return !el.type || R_SCRIPT_TYPE.test(el.type);
    }

    function filterScripts(nodes, scripts) {
        var ret = [], i, el, nodeName;
        for (i = 0; nodes[i]; i++) {
            el = nodes[i];
            nodeName = el.getTagName;
            if (el.nodeType == 11) {
                ret.push.apply(ret, filterScripts(S.makeArray(el.childNodes), scripts));
            } else if (nodeName === 'script' && isJs(el)) {
                if (el.parentNode) {
                    el.parentNode.removeChild(el)
                }
                if (scripts) {
                    scripts.push(el);
                }
            } else {
                if (el.nodeType == 1) {
                    var tmp = [],
                        s,
                        j,
                        ss = el.getElementsByTagName('script');
                    for (j = 0; j < ss.length; j++) {
                        s = ss[j];
                        if (isJs(s)) {
                            tmp.push(s);
                        }
                    }
                    [].splice.apply(nodes, [i + 1, 0].concat(tmp));
                }
                ret.push(el);
            }
        }
        return ret;
    }

    // execute script
    function evalScript(el) {
        if (el.src) {
            S.getScript(el.src);
        } else {
            var code = S.trim(el.text || el.textContent || el.innerHTML || '');
            if (code) {
                S.globalEval(code);
            }
        }
    }

    function insertion(newNodes, refNodes, fun) {
        newNodes = getEl(newNodes);
        refNodes = getEl(refNodes);

        if (refNodes.length && refNodes.length == 0) {
            return;
        }
        var scripts = [];
        filterScripts(newNodes, scripts);
        var i, j;
        var fragment = document.createDocumentFragment();
        for (j = 0; j < newNodes.length; j++) {
            fragment.appendChild(newNodes[j]);
        }

        for (i = 0; i < refNodes.length; i++) {
            var newNode = fragment.cloneNode(true);
            fun(newNode, refNodes[i]);
            if (scripts && scripts.length) {
                S.each(scripts, evalScript);
            }
        }
    }

    var INSERTION = {
        /**
         * Insert every element in the set of newNodes before every element in the set of refNodes.
         * @param {HTMLElement|HTMLElement[]} newNodes Nodes to be inserted
         * @param {HTMLElement|HTMLElement[]|String} refNodes Nodes to be referred
         */
        before:function (newNodes, refNodes) {
            insertion(newNodes, refNodes, function (newNode, refNode) {
                refNode.parentNode.insertBefore(newNode, refNode);
            });
        },
        /**
         * Insert every element in the set of newNodes after every element in the set of refNodes.
         * @param {HTMLElement|HTMLElement[]} newNodes Nodes to be inserted
         * @param {HTMLElement|HTMLElement[]|String} refNodes Nodes to be referred
         */
        after:function (newNodes, refNodes) {
            insertion(newNodes, refNodes, function (newNode, refNode) {
                if (!refNode.parentNode) {
                    return;
                }
                var sibling = getNode(refNode, 'nextSibling');

                if (sibling) {
                    refNode.parentNode.insertBefore(newNode, sibling);
                } else {
                    refNode.parentNode.appendChild(newNode);
                }
            });
        },
        /**
         * Insert every element in the set of newNodes to the end of every element in the set of parents.
         * @param {HTMLElement|HTMLElement[]} newNodes Nodes to be inserted
         * @param {HTMLElement|HTMLElement[]|String} parents Nodes to be referred as parentNode
         */
        append:function (newNodes, parents) {
            insertion(newNodes, parents, function (newNode, parent) {
                parent.appendChild(newNode);
            });
        },
        /**
         * Insert every element in the set of newNodes to the beginning of every element in the set of parents.
         * @param {HTMLElement|HTMLElement[]} newNodes Nodes to be inserted
         * @param {HTMLElement|HTMLElement[]|String} parents Nodes to be referred as parentNode
         */
        prepend:function (newNodes, parents) {
            insertion(newNodes, parents, function (newNode, parent) {
                var first = getNode(parent, 'firstChild');
                if (first) {
                    parent.insertBefore(newNode, first);
                } else {
                    parent.appendChild(newNode);
                }

            });
        },
        /**
         * Wrap a node around all elements in the set of matched elements
         * @param {HTMLElement|HTMLElement[]|String} wrappedNodes set of matched elements
         * @param {HTMLElement|String} wrapperNode html node or selector to get the node wrapper
         */
        wrapAll:function (wrappedNodes, wrapperNode) {
            var wrap = getEl(wrapperNode)[0].cloneNode(true);
            var inners = getEl(wrappedNodes);
            if (inners[0].parentNode) {
                inners[0].parentNode.insertBefore(wrap, inners[0]);
                var fragment = document.createDocumentFragment();
                for (var j = 0; j < inners.length; j++) {
                    fragment.appendChild(inners[j]);
                }
                wrap.appendChild(fragment);
            }
        },
        /**
         * Wrap a node around all elements in the set of matched elements
         * @param {HTMLElement|HTMLElement[]|String} wrappedNodes set of matched elements
         * @param {HTMLElement|String} wrapperNode html node or selector to get the node wrapper
         */
        wrap:function (wrappedNodes, wrapperNode) {
            var wrap = getEl(wrapperNode)[0].cloneNode(true);
            var inners = getEl(wrappedNodes);
            S.each(inners, function (w) {
                INSERTION.wrapAll(w, wrap);
            });

        },
        /**
         * Wrap a node around the childNodes of each element in the set of matched elements.
         * @param {HTMLElement|HTMLElement[]|String} wrappedNodes set of matched elements
         * @param {HTMLElement|String} wrapperNode html node or selector to get the node wrapper
         */
        wrapInner:function (wrapperNode, wrappedNodes) {
            var wrap = getEl(wrapperNode);
            var inner = getEl(wrappedNodes)[0];
            S.each(wrap, function (w) {
                var w_c = w.childNodes;
                if (w_c.length) {
                    var fragment = document.createDocumentFragment();
                    for (var j = 0; j < w_c.length; j++) {
                        fragment.appendChild(w_c[j]);
                    }
                    INSERTION.append(fragment, inner);
                }
                INSERTION.append(inner.cloneNode(true), w);
            })
        },
        /**
         * Remove the parents of the set of matched elements from the DOM,
         * leaving the matched elements in their place.
         * @param {HTMLElement|HTMLElement[]|String} wrappedNodes set of matched elements
         */
        unwrap:function (wrappedNodes) {
            var inner = getEl(wrappedNodes);
            S.each(inner, function (i) {
                var innerParent = getNode(i, 'parentNode');
                var anchor = getNode(innerParent, 'parentNode');
                INSERTION.append(i, anchor);
                anchor.removeChild(innerParent);
            })
        },
        /**
         * Replace each element in the set of matched elements with the provided newNodes.
         * @param {HTMLElement|HTMLElement[]|String} selector set of matched elements
         * @param {HTMLElement|HTMLElement[]|String} newNodes new nodes to replace the matched elements
         */
        replaceWith:function (selector, newNodes) {
            var oldNodes = getEl(selector);
            var newNodes = getEl(newNodes);
            S.each(newNodes, function (n) {
                n.parentNode.removeChild(n);
            });
            INSERTION.before(newNodes, oldNodes);
            S.each(oldNodes, function (o) {
                o.parentNode.removeChild(o);
            });
        }
    };
    return INSERTION;
})/**
 *dom-traversal
 * @author tingbao.peng@gmail.com
 */
KISSY.add('dom/traversal', function (S) {
    var docElem = document.documentElement;
    var matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector;

    function getEl(selector, context) {
        if(!selector){
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

    function getNode(el, type) {
        var ret = false;
        var node = el[type];
        while (node) {
            if (node.nodeType != 1) {
                node = node[type];
            } else {
                ret = node;
                break;
            }
        }
        return ret;
    }


    function test(el, filter) {
        if (el.nodeType != 1) {
            return false;
        }
        if (!filter) {
            return el;
        }
        if (typeof(filter) == 'string') {
            return matches.call(el, filter);
        }
        if (typeof(filter) == 'function') {
            return filter(el);
        }
        return false;
    }

    function getRelativeEl(selector, filter, type) {
        var el = getEl(selector)[0];
        if (!el) {
            return null;
        }
        if (filter == 0) {
            return el;
        }
        if (!filter) {
            filter = 1;
        }
        var ReNode = getNode(el, type);
        var index = 0
        while (ReNode && ReNode.nodeType != 11) {
            index++;
            if (typeof(filter) == 'number' && filter == index) {
                return ReNode;
            } else {
                if (test(ReNode, filter)) {
                    return ReNode;
                }
            }
            ReNode = ReNode[type];
        }
        return null;
    }

    function getRelativeChildren(el, filter, allowText, notContainChild) {
        var el = getEl(el)[0];
        if (!el) {
            return [];
        }
        var ret = [];
        var children = el.childNodes;
        for (var i = 0; i < children.length; i++) {
            if (!allowText && children[i].nodeType != 1) {
                continue;
            }
            if (notContainChild && notContainChild == children[i]) {
                continue;
            }
            if (test(children[i], filter)) {
                ret.push(children[i]);
            }
        }
        return ret;
    }

    var TRAVERSAL = {
        /**
         * Get the parent of the first element in the current set of
         * d elements, optionally filtered by a selector.
         * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
         * @param {String|Function|String[]|Function[]} [filter] Selector string or filter function or array
         * @return {HTMLElement|HTMLElement[]}
         *  if filter is array, return all ancestors which match filter.
         *  else return closest parent which matches filter.
         */
        parent:function (selector, filter) {
            return getRelativeEl(selector, filter, 'parentNode');
        },
        /**
         * Get the first child of the first element in the set of matched elements.
         * If a filter is provided, it retrieves the next child only if it matches that filter.
         * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
         * @param {String|Function} [filter] Selector string or filter function
         * @return {HTMLElement}
         */
        first:function (selector, filter) {
            var el = getEl(selector)[0];
            var firstChild;
            if (!el) {
                return null;
            }
            firstChild = el.firstChild;
            if (firstChild.nodeType != 1) {
                firstChild = getNode(firstChild, 'nextSibling');
            }
            if (!firstChild) {
                return null
            }
            if (test(firstChild, filter)) {
                return firstChild;
            }
            return getRelativeEl(firstChild, filter, 'nextSibling');
        },
        /**
         * Get the last child of the first element in the set of matched elements.
         * If a filter is provided, it retrieves the previous child only if it matches that filter.
         * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
         * @param {String|Function} [filter] Selector string or filter function
         * @return {HTMLElement}
         */
        last:function (selector, filter) {
            var el = getEl(selector)[0];
            var lastChild;
            if (!el) {
                return null;
            }
            lastChild = el.lastChild;
            if (lastChild.nodeType != 1) {
                lastChild = getNode(lastChild, 'previousSibling');
            }
            if (!lastChild) {
                return null
            }
            if (test(lastChild, filter)) {
                return lastChild;
            }
            return getRelativeEl(lastChild, filter, 'nextSibling');
        },
        /**
         * Get the immediately following sibling of the first element in the set of matched elements.
         * If a filter is provided, it retrieves the next child only if it matches that filter.
         * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
         * @param {String|Function} [filter] Selector string or filter function
         * @return {HTMLElement}
         */
        next:function (selector, filter) {
            return getRelativeEl(selector, filter, 'nextSibling');
        },
        /**
         * Get the immediately preceding  sibling of the first element in the set of matched elements.
         * If a filter is provided, it retrieves the previous child only if it matches that filter.
         * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
         * @param {String|Function} [filter] Selector string or filter function
         * @return {HTMLElement}
         */
        prev:function (selector, filter) {
            return getRelativeEl(selector, filter, 'previousSibling');
        },
        /**
         * Get the siblings of the first element in the set of matched elements, optionally filtered by a filter.
         * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
         * @param {String|Function} [filter] Selector string or filter function
         * @return {HTMLElement[]}
         */
        siblings:function (selector, filter) {
            var el = getEl(selector)[0];
            if (!el) {
                return [];
            }
            var parent = el.parentNode;
            return getRelativeChildren(parent, filter, false, el)
        },
        /**
         * Get the children of the first element in the set of matched elements, optionally filtered by a filter.
         * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
         * @param {String|Function} [filter] Selector string or filter function
         * @return {HTMLElement[]}
         */
        children:function (selector, filter) {
            return getRelativeChildren(selector, filter, false);
        },
        /**
         * Get the childNodes of the first element in the set of matched elements (includes text and comment nodes),
         * optionally filtered by a filter.
         * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
         * @param {String|Function} [filter] Selector string or filter function
         * @return {HTMLElement[]}
         */
        contents:function (selector, filter) {
            return getRelativeChildren(selector, filter, true);
        },
        /**
         * Check to see if a DOM node is within another DOM node.
         * @param {HTMLElement|String} container The DOM element that may contain the other element.
         * @param {HTMLElement|String} contained The DOM element that may be contained by the other element.
         * @return {Boolean}
         */
        contains:function (container, contained) {
            var parent = getEl(container)[0];
            var son = getEl(contained)[0];
            if (parent && son) {
                return !!(parent.compareDocumentPosition(son) & 16);
            }
            return false;
        },
        /**
         * search for a given element from among the matched elements.
         * @param {HTMLElement|String} selector elements or selector string to find matched elements.
         * @param {HTMLElement|String} refer elements or selector string to find matched elements.
         */
        index:function (selector, refer) {
            var el = getEl(selector)[0];
            var refer = getEl(refer);
            if (refer.length == 0) {
                refer=[];
                var children = el.parentNode.childNodes;
                for(var i=0;i<children.length;i++){
                    if(children[i].nodeType==1){
                        refer.push(children[i]);
                    }
                }
            }
            for (var i = 0; i < refer.length; i++) {
                if (refer[i].nodeType == 1 && refer[i] === el) {
                    return i;
                }
            }
            return -1;
        },
        /**
         * Check to see if a DOM node is equal with another DOM node.
         * @param {HTMLElement|String} n1
         * @param {HTMLElement|String} n2
         * @return {Boolean}
         * @member KISSY.DOM
         */
        equals:function (n1, n2) {
            n1 = getEl(n1);
            n2 = getEl(n2);
            if (n1.length != n2.length) {
                return false;
            }
            for (var i = 0;i<n1.length; i++) {
                if (n1[i] != n2[i]) {
                    return false;
                }
            }
            return true;
        }

    }
    return TRAVERSAL;
})/**
 * dom-selector
 * @author tingbao.peng@gmail.com
 */
KISSY.add('dom/base', function (S,SELECTOR,CLASS,CREATE,ATTR,STYLE,OFFSET,INSERTION,TRAVERSAL) {
    var DOM = {};
    S.mix(DOM,SELECTOR);
    S.mix(DOM, CLASS);
    S.mix(DOM, CREATE);
    S.mix(DOM,ATTR);
    S.mix(DOM, STYLE);
    S.mix(DOM,OFFSET);
    S.mix(DOM, INSERTION);
    S.mix(DOM,TRAVERSAL);

    S.mix(S,{
        DOM:DOM
    })
},{
    requires:['dom/selector','dom/class','dom/create','dom/attr','dom/style','dom/offset','dom/insertion','dom/traversal']
});