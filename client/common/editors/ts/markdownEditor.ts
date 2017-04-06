import '../scss/markdownEditor.scss';
import Editor from './editor';
import Util from '../../utilities/util';
import Markdown from '../../components/ts/markdown';

export default class MarkdownEditor extends Editor {
    private markdownElement:HTMLDivElement;
    private markdownEditor:HTMLTextAreaElement;
    private markdown:Markdown;

    constructor(elementSelector:string, componentElementSelector:string){
        super(elementSelector,componentElementSelector);
        let markDownHead = document.createElement('div');
        markDownHead.classList.add('editorHead');

        let markdownTitle = document.createElement('div');
        markdownTitle.classList.add('editorTitle');
        markdownTitle.innerHTML = 'markdown';
        markDownHead.appendChild(markdownTitle);

        let markdownDelete = document.createElement('a');
        markdownDelete.classList.add('delete');
        markDownHead.appendChild(markdownDelete);

        this.markdownElement = document.createElement('div');

        this.markdownEditor = document.createElement('textarea');
        Util.TAexpand(this.markdownEditor,20);

        this.markdownElement.appendChild(markDownHead);
        this.markdownElement.appendChild(this.markdownEditor);

        this.element.classList.add('markdownEditor');
        this.element.appendChild(this.markdownElement);

        this.markdown = new Markdown(componentElementSelector,{});
        
        this.markdownEditor.addEventListener('keyup',()=>{
            this.markdown.render(this.markdownEditor.value);
        });
    }
}