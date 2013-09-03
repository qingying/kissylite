/**
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
})