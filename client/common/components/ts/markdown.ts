import * as marked from 'marked';
import TreeComponent from './component';

/****    COMPONENT DESCRIPTION     ****/
//  [require args] (after # is default value)
//  source   : markdown target source                      # ''

export default class Markdown extends TreeComponent {
    private source:string;

    constructor(elementSelector:string,argObj:Object) {
        super(elementSelector,argObj);

        this.source = argObj.hasOwnProperty('source')? argObj['source']:'';
        document.querySelector(elementSelector).innerHTML = marked(this.source);
        window['MathJax'].Hub.Queue(['Typeset',window['MathJax'].Hub, document.querySelector(elementSelector)]);
    }
}