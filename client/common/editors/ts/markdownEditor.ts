import '../scss/markdownEditor.scss';
import Editor from './editor';
import Util from '../../utilities/util';
import Markdown from '../../components/ts/markdown';

export default class MarkdownEditor extends Editor {
    private markdownEditor:HTMLTextAreaElement;
    private markdown:Markdown;

    constructor(elementSelector:string, componentElementSelector:string){
        super(elementSelector,componentElementSelector);
        this.markdownEditor = document.createElement('textarea');
        Util.TAexpand(this.markdownEditor,20);
        this.element.classList.add('markdownEditor');

        this.element.appendChild(this.markdownEditor);

        this.markdown = new Markdown(componentElementSelector,{});
        
        this.markdownEditor.addEventListener('keyup',()=>{
            this.markdown.render(this.markdownEditor.value);
        });
    }
}