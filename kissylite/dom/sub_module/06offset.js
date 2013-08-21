/**
 *dom-offset
 * @author tingbao.peng@gmail.com
 */
 KISSY.add('dom/offset',function(S){
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
        * @param {window} [relativeWin] The window to measure relative to. If relativeWin
        *     is not in the ancestor frame chain of the element, we measure relative to
        *     the top-most window.
        * @return {Object|undefined} if Get, the format of returned value is same with coordinates.
        */
        offset: function(selector,coordinates,relativeWin){
            var els = getEl(selector),
                el = els[0];
                var ret={};
            if(!el){
                return undefined;
            }
            //getter
            if(!coordinates){
               var rect = el.getBoundingClientRect();
               ret.top = rect.top;
               ret.left = rect.left;
               return ret;
            }else{
            //setter
                var top = coordinates.top;
                var left = coordinates.left;
                for(var i=0;i<els.length;i++){
                    els[i].style.left = left+'px';
                    els[i].style.top = top +'px';
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
        scrollIntoView: function (selector, container, alignWithTop, allowHorizontalScroll) {
            var el ;
            if(!(el= getEl(selector)[0])){
                return
            }
            if(!(container = getEl(container))){
                container = el.ownerDocument.defaultView;
            }
            if (S.isPlainObject(alignWithTop)) {
                allowHorizontalScroll = alignWithTop.allowHorizontalScroll;
                onlyScrollIfNeeded = alignWithTop.onlyScrollIfNeeded;
                alignWithTop = alignWithTop.alignWithTop;
            }
            allowHorizontalScroll = allowHorizontalScroll === undefined ? true : allowHorizontalScroll;
        },
        /**
        * Get the width of document
        * @param {window} [win=window] Window to be referred.
        * @method
        */
        docWidth: function(){
            
        },
        /**
        * Get the height of document
        * @param {window} [win=window] Window to be referred.
        * @method
        */
        docHeight:function(){
        
        },
        /**
        * Get the height of window
        * @param {window} [win=window] Window to be referred.
        * @method
        */
        viewportHeight: function(){
        
        },
        /**
        * Get the width of document
        * @param {window} [win=window] Window to be referred.
        * @method
        */
        viewportWidth: function(){
        
        },
        /**
        * Get the current vertical position of the scroll bar for the first element in the set of matched elements.
        * or
        * Set the current vertical position of the scroll bar for each of the set of matched elements.
        * @param {HTMLElement[]|String|HTMLElement|window} selector matched elements
        * @param {Number} value An integer indicating the new position to set the scroll bar to.
        * @method
        */
        scrollTop: function(selector,number){
            
        },
        /**
        * Get the current horizontal position of the scroll bar for the first element in the set of matched elements.
        * or
        * Set the current horizontal position of the scroll bar for each of the set of matched elements.
        * @param {HTMLElement[]|String|HTMLElement|window} selector matched elements
        * @param {Number} value An integer indicating the new position to set the scroll bar to.
        * @method
        */
        scrollLeft: function(selector,number){
        
        }
    };
    
    return OFFSET;
 })