import '../scss/editor.scss';
import Editor from './editor';
import TreeD from '../../define/treeD';
import Highlight from '../../components/ts/highlight';

import * as ace from 'brace';

import 'brace/mode/html';
import 'brace/mode/css';
import 'brace/mode/javascript';
import 'brace/mode/php';
import 'brace/mode/python';
import 'brace/mode/golang';
import 'brace/mode/typescript';
import 'brace/mode/dockerfile';
import 'brace/mode/c_cpp';
import 'brace/mode/csharp';
import 'brace/mode/json';
import 'brace/mode/sql';

import 'brace/theme/monokai';

/*
<select style="height: 16px; font-size: 12px;">
        <option>Select dropdown</option>
        <option>With options</option>
    </select>
*/

export default class MarkdownEditor extends Editor {
    private highlightEditor:HTMLElement;
    private highlight:Highlight;
    private langSelector:HTMLSelectElement;
    private aceEditor:ace.Editor;

    constructor(elementSelector:string, componentElementSelector:string,data:Object){
        super(elementSelector,componentElementSelector,TreeD.COMPONENT.HIGHLIGHT,data);
        this.highlight = new Highlight(componentElementSelector,{});

        this.previewElement.classList.add('aceEdit');

        this.langSelector = document.createElement('select');

        this.highlightEditor = document.createElement('div');
        this.highlightEditor.style.height = '240px';
        this.aceEditor = ace.edit(this.highlightEditor);
        this.aceEditor.$blockScrolling = Infinity;
        this.aceEditor.setTheme('ace/theme/monokai');
        this.aceEditor.getSession().setMode('ace/mode/html');

        this.load(data['language'],data['source']);

        this.aceEditor.on('change',()=>{
            this.highlight.editor.setValue(this.aceEditor.getValue());
        });

        //ここは汎用的に修正する
        let htmlOption = this.createLangOption('html');
        let cssOption = this.createLangOption('css');
        let jsOption = this.createLangOption('javascript');
        let phpOption = this.createLangOption('sql');
        let tsOption = this.createLangOption('c_cpp');
        let golangOption = this.createLangOption('json');

        this.langSelector.appendChild(htmlOption);
        this.langSelector.appendChild(cssOption);
        this.langSelector.appendChild(jsOption);
        this.langSelector.appendChild(phpOption);
        this.langSelector.appendChild(tsOption);
        this.langSelector.appendChild(golangOption);

        this.langSelector.addEventListener('change',()=>{
            this.aceEditor.getSession().setMode('ace/mode/'+ this.langSelector.value);
            this.highlight.setLanguage(this.langSelector.value);
        });

        this.createEditorHead([this.langSelector]);
        this.createEditorBody([this.highlightEditor]);
        this.createEditor();
    }

    private createLangOption = (language:string)=>{
        let option = <HTMLElement>document.createElement('option');
        option.innerHTML = language;
        return option;
    };

    private load = (language:string,source:string)=>{
        let lang:string = 'html';
        let initSource:string = '';

        if(language){
            lang = language;
        }
        this.aceEditor.getSession().setMode('ace/mode/'+ lang);

        if(source){
            initSource = source;
        }
        this.aceEditor.setValue(initSource);

        this.highlight.editor.setValue(initSource);
        this.highlight.setLanguage(lang);
    }

    public exportData = ()=>{
        let data = {
            language:this.langSelector.value,
            source:this.aceEditor.getValue()
        }

        return data;
    }
}
