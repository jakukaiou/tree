import '../scss/editor.scss';
import Editor from './editor';
import TreeD from '../../define/treeD';
import Util from '../../utilities/util';
import Markdown from '../../components/ts/markdown';

export default class MarkdownEditor extends Editor {
    private markdownEditor:HTMLTextAreaElement;
    private markdown:Markdown;
    private col:number;

    constructor(elementSelector:string, componentElementSelector:string,data:Object){
        super(elementSelector,componentElementSelector,TreeD.COMPONENT.MARKDOWN,data);
        this.markdown = new Markdown(componentElementSelector,{});

        this.markdownEditor = document.createElement('textarea');
        this.load(data['source']);
        Util.TAexpand(this.markdownEditor,20,this.col);
        this.markdownEditor.addEventListener('keyup',()=>{
            this.markdown.render(this.markdownEditor.value);
        });

        this.createEditorHead([]);
        this.createEditorBody([this.markdownEditor]);
        this.createEditor();
    }

    private load = (source:string)=>{
        let initSource = '';
        if(source){
            initSource = source;
        }
        this.markdownEditor.value = initSource;
        this.col = this.markdownEditor.value.split('\n').length;

        this.markdown.render(initSource);
    }

    public exportData = ()=>{
        let data = {
            source:this.markdownEditor.value
        }

        return data;
    }
}