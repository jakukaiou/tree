import '../scss/editor.scss';
import Editor from './editor';
import TreeD from '../../define/treeD';
import Util from '../../utilities/util';
import Markdown from '../../components/ts/markdown';

export default class MarkdownEditor extends Editor {
    private markdownEditor:HTMLTextAreaElement;
    private markdown:Markdown;

    constructor(elementSelector:string, componentElementSelector:string){
        super(elementSelector,componentElementSelector,TreeD.COMPONENT.MARKDOWN);


        this.markdownEditor = document.createElement('textarea');
        Util.TAexpand(this.markdownEditor,20);
        this.markdownEditor.addEventListener('keyup',()=>{
            this.markdown.render(this.markdownEditor.value);
        });

        this.createEditorHead([]);
        this.createEditorBody([this.markdownEditor]);
        this.createEditor();

        this.markdown = new Markdown(componentElementSelector,{});
    }
}