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

import 'brace/theme/monokai';

/****    COMPONENT DESCRIPTION     ****/
//  [require args] (after # is default value)
//  laungage : laungage you want to syntax-highlighting.    # 'html'
//  source   : highlight target source                      # ''

export default class Highlight extends TreeComponent {
    private laungage:string;
    private source:string;

    constructor(elementSelector:string,argObj:Object) {
        super(elementSelector,argObj);

        this.laungage = argObj.hasOwnProperty('laungage')? argObj['laungage']:'html';
        this.source = argObj.hasOwnProperty('source')? argObj['source']:'';

        let editor = ace.edit(<HTMLElement>document.querySelector(elementSelector));
        editor.$blockScrolling = Infinity;
        editor.setTheme('ace/theme/monokai');
        editor.getSession().setMode('ace/mode/'+ this.laungage);
        editor.setValue(this.source, -1);
        editor.setReadOnly(true);
    }
}
