//github-markdownで <kbd>shift</kbd> + <kbd>command</kbd> + <kbd>3</kbd> でkey表示できる

import 'github-markdown-css';

import * as marked from 'marked';

// my modules
import Util from '../../common/utilities/util';

import Editor from '../../common/editors/ts/editor';
import MarkdownEditor from '../../common/editors/ts/markdownEditor';

import Component from '../../common/components/ts/component';
import Markdown from '../../common/components/ts/markdown';

import PlayGround from '../../common/components/ts/playground';
import Highlight from '../../common/components/ts/ace-highlight';

//リアルタイムエディターの部分
class TreeCMSEditor {
    private addEditorButton:HTMLElement;
    private addEditorMenu:HTMLElement;
    private addMarkdown:HTMLElement;

    private editorArea:HTMLElement;
    private previewArea:HTMLElement;

    private editorTreeview:HTMLElement;
    private editorResizer:HTMLElement;

    private openBool:Boolean;
    private nextEditorID:number;

    private editors:{[key:number]:Editor};
    private previews:{[key:number]:Component};

    constructor(){
        this.nextEditorID = 0;
        this.openBool = true;
        this.editors = {};

        this.editorTreeview = <HTMLElement>document.querySelector('.tree-cms_treeview');
        this.editorResizer = <HTMLElement>document.querySelector('.tree-cms_resizer');
        this.editorResizer.addEventListener('click',()=>{
            this.openBool = !this.openBool;
            if(this.openBool){
                this.editorTreeview.style.width= '180px';
            }else{
                this.editorTreeview.style.width= '0px';
            }
        });

        this.editorArea = <HTMLElement>document.querySelector('.tree-editors');
        this.previewArea = <HTMLElement>document.querySelector('.tree-previewArea');

        this.addEditorMenu = <HTMLElement>document.querySelector('.selectEditor');
        this.addEditorMenu.style.display = 'none';

        this.addEditorButton = <HTMLElement>document.querySelector('.addEditor');
        this.addEditorButton.addEventListener('click',()=>{
            this.addEditorButton.style.display = 'none';
            this.addEditorMenu.style.display = 'flex';
        });

        this.addMarkdown = <HTMLElement>document.querySelector('.selectEditor .markdown');
        this.addMarkdown.addEventListener('click',()=>{
            this.addEditorButton.style.display = 'block';
            this.addEditorMenu.style.display = 'none';
            let addEditor:Element = document.createElement('div');     //追加するエディター
            let addComponent:Element = document.createElement('div');  //追加するコンポーネント

            let editorIDstring:string = 'component-editor'+this.nextEditorID.toString();
            addEditor.id = editorIDstring;
            this.editorArea.appendChild(addEditor);

            let componentIDString:string = 'component-preview'+this.nextEditorID.toString();
            addComponent.id = componentIDString;
            this.previewArea.appendChild(addComponent);

            this.editors[this.nextEditorID] = new MarkdownEditor('#'+editorIDstring, '#'+componentIDString);

            this.nextEditorID++;
        });
    }
}

class TreeCMS {
    constructor(){
        window.onload = function(){
            new TreeCMSEditor();
        }
    }
}

new TreeCMS();