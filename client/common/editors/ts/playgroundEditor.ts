import '../scss/editor.scss';
import '../../components/scss/playground.scss';
import Editor from './editor';
import TreeD from '../../define/treeD';
import * as ace from 'brace';

import PlayGround from '../../components/ts/playground';

enum TAB {
    RESULT,
    HTML,
    CSS,
    JS
}

export default class PlayGroundEditor extends Editor {
    private playGroundEditor:HTMLElement;
    private playGround:PlayGround;
    private navSwitches:Array<Element>;
    private tabContents:Array<Element>;
    private activeIndex:TAB;

    private htmleditor:ace.Editor;
    private csseditor:ace.Editor;
    private jseditor:ace.Editor;

    constructor(elementSelector:string, componentElementSelector:string,data:Object){
        super(elementSelector,componentElementSelector,TreeD.COMPONENT.PLAYGROUND,data);
        this.playGround = new PlayGround(componentElementSelector,{});

        this.element.style.width='100%';

        this.playGroundEditor = document.createElement('div');
        this.playGroundEditor.style.display = 'inline-flex';
        this.playGroundEditor.style.width = '100%';
        this.playGroundEditor.style.border = 'solid #a8a8a8 1px';
        this.playGroundEditor.classList.add('playground');
        this.playGroundEditor.innerHTML = this.createPlayGroundArea();

        this.navSwitches = new Array();
        this.tabContents = new Array();
        this.activeIndex = TAB.HTML;

        this.createEditorHead([]);
        this.createEditorBody([this.playGroundEditor]);
        this.createEditor();

        let navs:HTMLElement = <HTMLElement>document.querySelector(elementSelector + ' .playground-nav');
        navs.style.width = '100%';

        this.navSwitches[TAB.HTML] = document.querySelector(elementSelector + ' #html-nav');
        this.navSwitches[TAB.CSS] = document.querySelector(elementSelector + ' #css-nav');
        this.navSwitches[TAB.JS] = document.querySelector(elementSelector + ' #js-nav');

        this.tabContents[TAB.HTML] = document.querySelector(elementSelector + ' #html-tab');
        this.tabContents[TAB.CSS] = document.querySelector(elementSelector + ' #css-tab');
        this.tabContents[TAB.JS] = document.querySelector(elementSelector + ' #js-tab');

        for(let index:TAB = TAB.HTML; index <= TAB.JS; index++) {
            this.sizeset(<HTMLElement>this.tabContents[index]);
            this.handleClick(this.navSwitches[index],index);
        }

        this.htmleditor = ace.edit(<HTMLElement>document.querySelector(elementSelector + ' #html-editor'));
        this.htmleditor.$blockScrolling = Infinity;
        this.htmleditor.getSession().setMode('ace/mode/html');
        this.htmleditor.setTheme('ace/theme/monokai');
        this.htmleditor.on('change',()=>{
            this.playGround.update(this.htmleditor.getValue(),this.csseditor.getValue(),this.jseditor.getValue());
        });

        this.csseditor = ace.edit(<HTMLElement>document.querySelector(elementSelector + ' #css-editor'));
        this.csseditor.$blockScrolling = Infinity;
        this.csseditor.getSession().setMode('ace/mode/css');
        this.csseditor.setTheme('ace/theme/monokai');
        this.csseditor.on('change',()=>{
            this.playGround.update(this.htmleditor.getValue(),this.csseditor.getValue(),this.jseditor.getValue());
        });

        this.jseditor = ace.edit(<HTMLElement>document.querySelector(elementSelector + ' #js-editor'));
        this.jseditor.$blockScrolling = Infinity;
        this.jseditor.getSession().setMode('ace/mode/javascript');
        this.jseditor.setTheme('ace/theme/monokai');
        this.jseditor.on('change',()=>{
            this.playGround.update(this.htmleditor.getValue(),this.csseditor.getValue(),this.jseditor.getValue());
        });

        this.previewElement.classList.add('playground');

        this.load(data['htmlsource'],data['csssource'],data['jssource']);
    }

    private createPlayGroundArea():string {
        // TODO:divided case by editBool
        let html = '';

        html    += '<div class="playground-edit" style="width:100%;">';
        // nav-parts
        html    +=     '<div class="playground-nav">';
        html    +=         '<a id="html-nav" href="#" class="playground-nav__link is-active">HTML</a>';
        html    +=         '<a id="css-nav" href="#" class="playground-nav__link">CSS</a>';
        html    +=         '<a id="js-nav" href="#" class="playground-nav__link">JS</a>';
        html    +=     '</div>';
        // tab-parts
        html    +=     '<div class="playground-tabs">';
        html    +=         '<div id="html-tab" class="playground-tab is-active">';
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

    private sizeset(element:HTMLElement) {
        element.style.width = '100%';
        element.style.height = '200px';
    }

    private handleClick(link:Element,index:TAB) {
        if(link) {
            let gotoTabProcess:(e:Event)=>void = (e:Event)=> {
                e.preventDefault();
                this.goToTab(index);
            };

            link.addEventListener('click',gotoTabProcess.bind(this));
        }
    }

    private goToTab(index:TAB) {
        this.tabContents[this.activeIndex].classList.remove('is-active');
        this.navSwitches[this.activeIndex].classList.remove('is-active');
        this.tabContents[index].classList.add('is-active');
        this.navSwitches[index].classList.add('is-active');
        this.activeIndex = index;
    }

    private load = (htmlsource:string,csssource:string,jssource:string)=>{
        let initHtml:string = '';
        let initCss:string = '';
        let initJs:string = '';

        if(htmlsource){
            initHtml = htmlsource;
        }

        if(csssource){
            initCss = csssource;
        }

        if(jssource){
            initJs = jssource;
        }

        this.htmleditor.setValue(initHtml);
        this.csseditor.setValue(initCss);
        this.jseditor.setValue(initJs);

        this.playGround.update(initHtml,initCss,initJs);
    }

    public exportData(){
        let data = {
            htmlsource:this.htmleditor.getValue(),
            csssource:this.csseditor.getValue(),
            jssource:this.jseditor.getValue()
        }

        let obj = {
            type:TreeD.COMPONENT.PLAYGROUND,
            data:data
        }

        return obj;
    }
}

