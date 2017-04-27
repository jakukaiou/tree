import TreeComponent from './component';

import '../scss/playground.scss';

import * as ace from 'brace';
import 'brace/mode/html';
import 'brace/mode/css';
import 'brace/mode/javascript';

import 'brace/theme/monokai';

/****    COMPONENT DESCRIPTION     ****/
//  [require args] (after # is default value)
//  htmlsource : init input html source    # ''
//  csssource  : init input css source     # ''
//  jssource   : init input js source      # ''
//  width      : playground display width  # 500
//  height     : playground display height # 400

enum TAB {
    RESULT,
    HTML,
    CSS,
    JS
}

export default class PlayGround extends TreeComponent {

    private static TAB = TAB;

    private htmlSource:string;
    private cssSource:string;
    private jsSource:string;

    private htmleditor:ace.Editor;
    private csseditor:ace.Editor;
    private jseditor:ace.Editor;

    private width:number;
    private height:number;

    private activeIndex:TAB;
    private navSwitches:Array<Element>;
    private tabContents:Array<Element>;

    constructor(elementSelector:string,argObj:Object) {
        super(elementSelector,argObj);

        this.htmlSource = argObj.hasOwnProperty('htmlsource')? argObj['htmlsource']:'';
        this.cssSource = argObj.hasOwnProperty('csssource')? argObj['csssource']:'';
        this.jsSource = argObj.hasOwnProperty('jssource')? argObj['jssource']:'';

        this.width = argObj.hasOwnProperty('width')? argObj['width']:500;
        this.height = argObj.hasOwnProperty('height')? argObj['height']:400;

        this.activeIndex = TAB.RESULT;
        this.navSwitches = new Array();
        this.tabContents = new Array();

        this.element.style.display = 'inline-flex';
        this.element.style.width = this.width + 'px';
        this.element.style.border = 'solid #a8a8a8 1px';

        this.element.innerHTML = this.createPlayGroundArea();

        this.elSelector = elementSelector;
        this.navSwitches[TAB.RESULT] = document.querySelector(this.elSelector + ' #result-nav');
        this.navSwitches[TAB.HTML] = document.querySelector(this.elSelector + ' #html-nav');
        this.navSwitches[TAB.CSS] = document.querySelector(this.elSelector + ' #css-nav');
        this.navSwitches[TAB.JS] = document.querySelector(this.elSelector + ' #js-nav');

        let navs:HTMLElement = <HTMLElement>document.querySelector(this.elSelector + ' .playground-nav');
        navs.style.width = this.width + 'px';

        this.tabContents[TAB.RESULT] = document.querySelector(this.elSelector + ' #result-tab');
        this.tabContents[TAB.HTML] = document.querySelector(this.elSelector + ' #html-tab');
        this.tabContents[TAB.CSS] = document.querySelector(this.elSelector + ' #css-tab');
        this.tabContents[TAB.JS] = document.querySelector(this.elSelector + ' #js-tab');

        for(let index:TAB = TAB.RESULT; index <= TAB.JS; index++) {
            this.sizeset(<HTMLElement>this.tabContents[index]);
            this.handleClick(this.navSwitches[index],index);
        }

        this.aceinit();
        this.render();
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

    private sizeset(element:HTMLElement) {
        element.style.width = this.width + 'px';
        element.style.height = this.height + 'px';
    }

    private aceinit():void {
        this.htmleditor = ace.edit(<HTMLElement>document.querySelector(this.elSelector + ' #html-editor'));
        this.htmleditor.$blockScrolling = Infinity;
        this.htmleditor.getSession().setMode('ace/mode/html');
        this.htmleditor.setValue(this.htmlSource,-1);
        this.htmleditor.setReadOnly(true);
        this.htmleditor.setTheme('ace/theme/monokai');

        this.csseditor = ace.edit(<HTMLElement>document.querySelector(this.elSelector + ' #css-editor'));
        this.csseditor.$blockScrolling = Infinity;
        this.csseditor.getSession().setMode('ace/mode/css');
        this.csseditor.setValue(this.cssSource,-1);
        this.csseditor.setReadOnly(true);
        this.csseditor.setTheme('ace/theme/monokai');

        this.jseditor = ace.edit(<HTMLElement>document.querySelector(this.elSelector + ' #js-editor'));
        this.jseditor.$blockScrolling = Infinity;
        this.jseditor.getSession().setMode('ace/mode/javascript');
        this.jseditor.setValue(this.jsSource,-1);
        this.jseditor.setReadOnly(true);
        this.jseditor.setTheme('ace/theme/monokai');
    }

    public update(html:string,css:string,js:string):void {
        this.htmleditor.setValue(html);
        this.csseditor.setValue(css);
        this.jseditor.setValue(js);
        
        this.render();
    }

    private render():void {
        let source:string = this.createSource();
        let result = (<HTMLIFrameElement>document.querySelector(this.elSelector + ' #result')).contentDocument;
        result.open();
        result.write(source);
        result.close();
    }

    private createSource():string {
        let base_tpl =
        '<!doctype html>\n' +
        '<html>\n\t' +
        '<head>\n\t\t' +
        '<meta charset=\"utf-8\">\n\t\t' +
        '<title>Test</title>\n\n\t\t\n\t' +
        '</head>\n\t' +
        '<body>\n\t\n\t' +
        '</body>\n' +
        '</html>';

        let htmlContents:string = this.htmleditor.getValue();
        let cssContents:string = this.csseditor.getValue();
        let jsContents:string = this.jseditor.getValue();

        let src:string = base_tpl.replace('</body>', htmlContents + '</body>');

        cssContents = '<style>' + cssContents + '</style>';
        src = src.replace('</head>', cssContents + '</head>');

        jsContents = '<script>' + jsContents + '</script>';
        src = src.replace('</body>', jsContents + '</body>');

        return src;
    }
}
