/**
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
})