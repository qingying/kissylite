/**
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

    // ��ӳ�Ա��Ԫ����
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

        // �¼�Ҫ�����
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

            // runtime ����¼�ģ��
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

