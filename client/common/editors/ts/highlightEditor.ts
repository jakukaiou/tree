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

    constructor(elementSelector:string, componentElementSelector:string){
        super(elementSelector,componentElementSelector,TreeD.COMPONENT.HIGHLIGHT);
        this.previewElement.classList.add('aceEdit');

        let langSelector = document.createElement('select');

        this.highlightEditor = document.createElement('div');
        this.highlightEditor.style.height = '240px';
        let aceEditor = ace.edit(this.highlightEditor);
        aceEditor.$blockScrolling = Infinity;
        aceEditor.setTheme('ace/theme/monokai');
        aceEditor.getSession().setMode('ace/mode/html');

        aceEditor.on('change',()=>{
            this.highlight.editor.setValue(aceEditor.getValue());
        });

        //ここは汎用的に修正する
        let htmlOption = this.createLangOption('html');
        let cssOption = this.createLangOption('css');
        let jsOption = this.createLangOption('javascript');
        let phpOption = this.createLangOption('sql');
        let tsOption = this.createLangOption('c_cpp');
        let golangOption = this.createLangOption('json');

        langSelector.appendChild(htmlOption);
        langSelector.appendChild(cssOption);
        langSelector.appendChild(jsOption);
        langSelector.appendChild(phpOption);
        langSelector.appendChild(tsOption);
        langSelector.appendChild(golangOption);

        langSelector.addEventListener('change',()=>{
            aceEditor.getSession().setMode('ace/mode/'+ langSelector.value);
            this.highlight.setLanguage(langSelector.value);
        });

        this.createEditorHead([langSelector]);
        this.createEditorBody([this.highlightEditor]);
        this.createEditor();

        this.highlight = new Highlight(componentElementSelector,{});
    }

    private createLangOption = (language:string)=>{
        let option = <HTMLElement>document.createElement('option');
        option.innerHTML = language;
        return option;
    };
}
