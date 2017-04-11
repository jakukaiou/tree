import TreeComponent from './component';

import '../scss/ace.scss'

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

/****    COMPONENT DESCRIPTION     ****/
//  [require args] (after # is default value)
//  laungage : laungage you want to syntax-highlighting.    # 'html'
//  source   : highlight target source                      # ''

export default class Highlight extends TreeComponent {
    public editor:ace.Editor;

    private laungage:string;
    private source:string;

    constructor(elementSelector:string,argObj:Object) {
        super(elementSelector,argObj);

        this.laungage = argObj.hasOwnProperty('laungage')? argObj['laungage']:'html';
        this.source = argObj.hasOwnProperty('source')? argObj['source']:'';

        this.editor = ace.edit(<HTMLElement>document.querySelector(elementSelector));
        this.editor.$blockScrolling = Infinity;
        this.editor.setTheme('ace/theme/monokai');
        this.editor.getSession().setMode('ace/mode/'+ this.laungage);
        this.editor.setValue(this.source, -1);
        this.editor.setReadOnly(true);
    }

    public setLanguage = (language:string)=>{
        this.laungage = language
        this.editor.getSession().setMode('ace/mode/'+ this.laungage);
    }
}
