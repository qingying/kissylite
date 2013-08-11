/**
 * @ignore
 * selector
 * @author tingbao.peng@gmail.com
 */
 KISSY.add('dom/selector',function(S){
	function getSelector(selector,context,fun){
		/*set body as the default context*/
		if(!context){
			context = document.body;
		}
		/*css selector*/
		if(typeof(selector)=='string'){
			selector = selector.replace(/^\s+|\s+$/g,'');
			return context[fun](selector);
		}
		/*node*/
		if(selector.nodeType==1){
			return selector;
		}
		/**/
		return selector;
	}
	var dom = {
		/**
        * Accepts a string containing a CSS selector which is then used to match a set of elements.
        * @param {String|HTMLElement[]} selector
        * A string containing a selector expression.
        * or
        * array of HTMLElements.
        * @param {String|HTMLElement[]|HTMLDocument|HTMLElement|window} [context] context under which to find elements matching selector.
        * @return {HTMLElement} The first of found HTMLElements
        */
		get: function(selector,context){
			getSelector(selector,context,'querySelector');
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
		query: function(selector,context){
			getSelector(selector,context,'querySelectorAll');
		},
		/**
        * Reduce the set of matched elements to those that match the selector or pass the function's test.
        * @param {String|HTMLElement[]} selector Matched elements
        * @param {String|Function} filter Selector string or filter function
        * @param {String|HTMLElement[]|HTMLDocument} [context] Context under which to find matched elements
        * @return {HTMLElement[]}
        */
		filter: function(selector,fun,context){
			var elems = getSelector(selector,context,'querySelectorAll');
			if(elems){
				var filterElems = [];
				for(var i=0;i<elems.length;i++){
					if(fun(elems[i])){
						filterElems.push(elems[i]);
					}
				}
				return filterElems;
				
			}
			returnn [];
		},
		/**
         * Returns true if the matched element(s) pass the filter test
         * @param {String|HTMLElement[]} selector Matched elements
         * @param {String|Function} filter Selector string or filter function
         * @param {String|HTMLElement[]|HTMLDocument} [context] Context under which to find matched elements
         * @member KISSY.DOM
         * @return {Boolean}
         */
        test: function (selector, filter, context) {
		
		}
	}
 });