import * as marked from 'marked';

// my modules
import TAAutoSize from '../../common/utilities/autosize';

import PlayGround from '../../common/components/ts/playground';
import Highlight from '../../common/components/ts/ace-highlight';

//リアルタイムエディターの部分
class TreeCMSEditor {
    private addEditorButton:HTMLElement;
    private addEditorMenu:HTMLElement;

    private editorArea:HTMLElement;
    private previewArea:HTMLElement;

    private editorTreeview:HTMLElement;
    private editorResizer:HTMLElement;

    private openBool:Boolean;

    constructor(){
        this.openBool = true;

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

        this.addEditorButton = <HTMLElement>document.querySelector('.addEditor');
        this.addEditorButton.addEventListener('click',()=>{
            let addElement = document.createElement('div');
            addElement.innerHTML = 'inner';
            this.editorArea.appendChild(addElement);
        });

        //let playground = new PlayGround('#component-1',{});

        //new TAAutoSize('#ta');
        //new TAAutoSize('#ta2');
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