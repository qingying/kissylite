/**
 *dom-class
 * @author tingbao.peng@gmail.com
 */

KISSY.add('dom/class', function (S) {

    function getEl(selector) {
        if (selector && typeof(selector) == 'string') {
            return document.body.querySelectorAll(selector);
        }
        if (selector.nodeType && selector.nodeType == 1) {
            return [selector];
        }
        if(selector.length && selector.length>0 && selector[0].nodeType && selector[0].nodeType==1){
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
                for (var i = 0; i < els.length; i++) {
                    var bl = true;
                    for (var j = 0; j < clsArr.length; j++) {
                        if (els[i].nodeType && els[i].nodeType == 1 && !els[i].classList.contains(clsArr[i])) {
                            bl = false;
                        }
                    }
                    if (bl) {
                        return true;
                    }
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
});