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
})