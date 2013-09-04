/**
 * dom-selector
 * @author tingbao.peng@gmail.com
 */
KISSY.add('dom/base', function (S,SELECTOR,CLASS,CREATE,ATTR,STYLE,OFFSET,INSERTION,TRAVERSAL) {
    var DOM = {};
    S.mix(DOM,SELECTOR);
    S.mix(DOM, CLASS);
    S.mix(DOM, CREATE);
    S.mix(DOM,ATTR);
    S.mix(DOM, STYLE);
    S.mix(DOM,OFFSET);
    S.mix(DOM, INSERTION);
    S.mix(DOM,TRAVERSAL);

    return DOM;
},{
    requires:['dom/selector','dom/class','dom/create','dom/attr','dom/style','dom/offset','dom/insertion','dom/traversal']
});