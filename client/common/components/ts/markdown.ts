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
        this.render(this.source);

        marked.setOptions({
            renderer: new marked.Renderer(),
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false
        });
    }

    public render(source:string){
        this.source = source;
        this.element.innerHTML = marked(this.source);
        window['MathJax'].Hub.Queue(['Typeset',window['MathJax'].Hub, this.element]);
    }
}