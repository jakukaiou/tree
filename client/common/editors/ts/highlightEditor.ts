import Editor from './editor';
//languageの設定を追加・render関数を追加
import Highlight from '../../components/ts/ace-highlight';

export default class MarkdownEditor extends Editor {
    private highlightEditor:HTMLDivElement;
    private highlight:Highlight;

    constructor(elementSelector:string, componentElementSelector:string){
        super(elementSelector,componentElementSelector);
        this.highlightEditor = document.createElement('div');
        this.element.classList.add('highlightEditor');

        this.element.appendChild(this.highlightEditor);

        this.highlight = new Highlight(componentElementSelector,{});
        
        this.highlightEditor.addEventListener('keyup',()=>{
            //this.markdown.render(this.markdownEditor.value);
        });
    }
}