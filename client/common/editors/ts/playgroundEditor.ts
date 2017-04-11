import '../scss/editor.scss';
import '../../components/scss/playground.scss';
import Editor from './editor';

import PlayGround from '../../components/ts/markdown';

export default class PlayGroundEditor extends Editor {
    private playGroundEditor:HTMLElement;
    private playGround:PlayGround;

    constructor(elementSelector:string, componentElementSelector:string){
        super(elementSelector,componentElementSelector,'playground');

        this.playGroundEditor = document.createElement('div');
        this.playGroundEditor.style.display = 'inline-flex';
        this.playGroundEditor.style.width = '100%';
        this.playGroundEditor.style.border = 'solid #a8a8a8 1px';
        this.playGroundEditor.classList.add('playground');
        this.playGroundEditor.innerHTML = this.createPlayGroundArea();

        this.createEditorHead([]);
        this.createEditorBody([this.playGroundEditor]);
        this.createEditor();

        let navs:HTMLElement = <HTMLElement>document.querySelector(elementSelector + ' .playground-nav');
        navs.style.width = '100%';
    }

    createPlayGroundArea():string {
        // TODO:divided case by editBool
        let html = '';

        html    += '<div class="playground-edit">';
        // nav-parts
        html    +=     '<div class="playground-nav">';
        html    +=         '<a id="result-nav" href="#" class="playground-nav__link is-active">RESULT</a>';
        html    +=         '<a id="html-nav" href="#" class="playground-nav__link">HTML</a>';
        html    +=         '<a id="css-nav" href="#" class="playground-nav__link">CSS</a>';
        html    +=         '<a id="js-nav" href="#" class="playground-nav__link">JS</a>';
        html    +=     '</div>';
        // tab-parts
        html    +=     '<div class="playground-tabs">';
        html    +=         '<div id="result-tab" class="playground-tab is-active">';
        html    +=             '<iframe id="result" class="playground__content"></iframe>';
        html    +=         '</div>';
        html    +=         '<div id="html-tab" class="playground-tab">';
        html    +=             '<div id="html-editor" class="playground__content"></div>';
        html    +=         '</div>';
        html    +=         '<div id="css-tab" class="playground-tab">';
        html    +=             '<div id="css-editor" class="playground__content"></div>';
        html    +=         '</div>';
        html    +=         '<div id="js-tab" class="playground-tab">';
        html    +=             '<div id="js-editor" class="playground__content"></div>';
        html    +=         '</div>';
        html    +=     '</div>';
        html    += '</div>';

        return html;
    }
}

