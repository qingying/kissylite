/**
 *dom-traversal
 * @author tingbao.peng@gmail.com
 */
KISSY.add('dom/traversal', function (S) {
    var docElem = document.documentElement;
    var matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector;

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

    var TRAVERSAL = {
        /**
         * Get the parent of the first element in the current set of matched elements, optionally filtered by a selector.
         * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
         * @param {String|Function|String[]|Function[]} [filter] Selector string or filter function or array
         * @return {HTMLElement|HTMLElement[]}
         *  if filter is array, return all ancestors which match filter.
         *  else return closest parent which matches filter.
         */
        parent:function (selector, filter) {
             var el = getEl(selector)[0];
             if(!el){
                 return [];
             }
             if(!filter){
                 filter=1;
             }
        },
    }
    return TRAVERSAL;
})