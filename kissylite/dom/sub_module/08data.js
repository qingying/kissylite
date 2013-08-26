/**
 *dom-data
 * @author tingbao.peng@gmail.com
 */
KISSY.add('dom/data', function (S) {
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

    function getObj(selector) {
        var objs;
        if (typeof(selector) === 'object' && !selector.length && !selector.nodeType) {
            objs = [selector];
        } else {
            objs = getEl(selector);
        }
        return objs;
    }

    var noData = {};
    noData['applet'] = 1;
    noData['object'] = 1;
    noData['embed'] = 1;

    var DATA = {
        /**
         * Determine whether an element has any data or specified data name associated with it.
         * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
         * @param {String} [name] A string naming the piece of data to set.
         * @return {Boolean}
         */
        hasData:function (selector, name) {
            var objs = getObj(selector);
            return objs[0].name === undefined;
        },
        /**
         * If name set and data unset Store arbitrary data associated with the specified element. Returns undefined.
         * or
         * If name set and data unset returns value at named data store for the element
         * or
         * If name unset and data unset returns the full data store for the element.
         * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
         * @param {String} [name] A string naming the piece of data to set.
         * @param [data] The new data value.
         * @return {Object|undefined}
         */
        data:function (selector, name, data) {
            var objs = getObj(selector);
            // supports hash
            if (S.isPlainObject(name)) {
                for (var k in name) {
                    DATA.data(elems, k, name[k]);
                }
                return undefined;
            }

            //getter
            if (data === undefined) {
                return objs[0].name;
            } else {
                if (objs[0].nodeType && noData[objs[0].nodeType]) {
                    return undefined;
                }
                objs[0].name = data;
            }
        },
        /**
         * Remove a previously-stored piece of data from matched elements.
         * or
         * Remove all data from matched elements if name unset.
         * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
         * @param {String} [name] A string naming the piece of data to delete.
         */
        removeData:function (selector, name) {
            var objs = getObj(selector);
            for(var i=0;i<objs.length;i++){
                objs[i].name=undefined;
            }
        }
    };
    return DATA;
});