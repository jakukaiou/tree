import Editor from './editor';

export default class MarkdownEditor extends Editor {
    private markdownEditor:HTMLElement;

    constructor(elementSelector:string){
        super(elementSelector);
        this.markdownEditor = document.createElement('textarea');
        this.element.appendChild(this.markdownEditor);
    }
}