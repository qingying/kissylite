/**
 *dom-create
 * @author tingbao.peng@gmail.com
 */
KISSY.add('dom/create', function (S) {


    var CREATE = {
        /**
         * Creates DOM elements on the fly from the provided string of raw HTML.
         * @param {String} tagName
         * @param {Object} [props] An map of attributes on the newly-created element.
         * @param {HTMLDocument} [ownerDoc] A document in which the new elements will be created
         * @return {HTMLElement}
         */
        create: function(tagName,props,ownerDoc){
            var doc = ownerDoc || document;
            var newEl = doc.createElement(tagName);
            for(var i in props){
                newEl[i] = props[i];
            }
            return newEl;
        }
    };
    return CREATE;
});

