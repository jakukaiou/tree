//TODO:highlight.jsの導入を検討？
//githubのtasklistなどを追加する
//github-markdownで <kbd>shift</kbd> + <kbd>command</kbd> + <kbd>3</kbd> でkey表示できる

import 'github-markdown-css';

import * as marked from 'marked';

// my modules
import Util from '../../common/utilities/util';
import TreeD from '../../common/define/treeD';

import Editor from '../../common/editors/ts/editor';
import MarkdownEditor from '../../common/editors/ts/markdownEditor';
import HighlightEditor from '../../common/editors/ts/highlightEditor';
import PlayGroundEditor from '../../common/editors/ts/playgroundEditor';

import Component from '../../common/components/ts/component';
import Markdown from '../../common/components/ts/markdown';

import PlayGround from '../../common/components/ts/playground';
import Highlight from '../../common/components/ts/highlight';

//リアルタイムエディターの部分
class TreeCMSEditor {
    private element:HTMLElement;

    private addEditorButton:HTMLElement;
    private addEditorMenu:HTMLElement;

    private addMarkdown:HTMLElement;
    private addHighlight:HTMLElement;

    private editorArea:HTMLElement;
    private previewArea:HTMLElement;

    private editorTreeview:HTMLElement;
    private editorResizer:HTMLElement;

    private openBool:Boolean;
    private nextEditorID:number;

    private editors:{[key:number]:Editor};
    private previews:{[key:number]:Component};

    //エディタの編集内容を格納するコンテンツ
    private contents:Object;

    constructor(){
        this.element = <HTMLElement>document.querySelector('.tree-cms_editmenu');

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

        //マークダウンエディタの追加処理
        this.addMarkdown = <HTMLElement>document.querySelector('.selectEditor .markdown');
        this.addMarkdown.addEventListener('click',()=>{
            console.log('make markdown Editor');
            this.addEditor(TreeD.COMPONENT.MARKDOWN);
        });

        //ハイライトエディタの追加処理
        this.addHighlight = <HTMLElement>document.querySelector('.selectEditor .highlighter');
        this.addHighlight.addEventListener('click',()=>{
            console.log('make highlight Editor');
            this.addEditor(TreeD.COMPONENT.HIGHLIGHT);
        });

        this.addHighlight = <HTMLElement>document.querySelector('.selectEditor .playground');
        this.addHighlight.addEventListener('click',()=>{
            console.log('make playground Editor');
            this.addEditor(TreeD.COMPONENT.PLAYGROUND);
        });
    }

    private addEditor= (type)=>{
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

        switch(type){
            case TreeD.COMPONENT.MARKDOWN:
                this.editors[this.nextEditorID] = new MarkdownEditor('#'+editorIDstring, '#'+componentIDString);
                break;
            case TreeD.COMPONENT.HIGHLIGHT:
                this.editors[this.nextEditorID] = new HighlightEditor('#'+editorIDstring, '#'+componentIDString);
                break;
            case TreeD.COMPONENT.PLAYGROUND:
                this.editors[this.nextEditorID] = new PlayGroundEditor('#'+editorIDstring, '#'+componentIDString);
                break;
        }

        this.nextEditorID++;
    }

    //エディタのアクティブ/非アクティブを設定するsetter
    public set active (bool:Boolean){
        if(bool){
            this.element.style.display = 'flex';
        }else{
            this.element.style.display = 'none';
        }
    }

    //初期コンテンツを引数としてエディタを開く
    public open = (contents:Object)=>{
        this.contents = contents;
        this.active = true;
    }

    public close = ()=>{
        this.contents = null;
        this.active = false;
    }
}

//編集ブック選択メニューの部分
class TreeCMSBookBar {
    private bookList:HTMLElement;
    private bookAddButton:HTMLElement;

    private books:{[key:number]:TreeCMSBook};
    private nextBookID:number;

    private editor:TreeCMSEditor;
    private bookInfo:TreeCMSBookInfo;

    constructor(editor:TreeCMSEditor,bookInfo:TreeCMSBookInfo){
        this.books = {};

        this.editor = editor;
        this.bookInfo = bookInfo;

        this.bookInfo.active = false;
        this.editor.active = false;

        this.bookList = <HTMLElement>document.querySelector('.tree-cms_books');
        this.bookAddButton = <HTMLElement>document.querySelector('.tree-cms_bookPlus');
        this.nextBookID = 1;

        this.bookAddButton.addEventListener('click',()=>{
            this.bookAdd();
        });
    }

    private bookAdd = ()=>{
        let element = document.createElement('div');
        element.classList.add('tree-cms_book');
        element.id = 'book-'+this.nextBookID;
        this.bookList.appendChild(element);
        this.books[this.nextBookID] = new TreeCMSBook('#book-'+this.nextBookID,this.bookInfo,this.editor,[]);
        this.nextBookID++;
    }
}

class TreeCMSBook {
    private element:HTMLElement;
    private pageElement:HTMLElement;

    private pages:Array<Object>;
    private nextPageID:number;

    //ブックの情報を開く画面 ブック自体の情報を編集する時にアクティブにする
    private bookInfo:TreeCMSBookInfo;
    //ページのエディタ画面 ページ編集時にアクティブにする
    private bookEditor:TreeCMSEditor;

    constructor(elementSelector:string,bookInfo:TreeCMSBookInfo,bookEditor:TreeCMSEditor,bookPages:Array<Object>){
        this.element = <HTMLElement>document.querySelector(elementSelector);
        this.element.appendChild(this.createBookTitle('newBook'));
        this.element.appendChild(this.createBookPagesArea());

        this.bookInfo = bookInfo;
        this.bookEditor = bookEditor;

        this.pages = bookPages;
        this.nextPageID = this.pages.length;
    }

    private createBookTitle = (bookName:string)=>{
        let element = document.createElement('div');
        let bookIconElement:HTMLElement = Util.createIcon('fa-book');

        let bookTitleElement:HTMLElement = document.createElement('label');
        let bookTitleDispElement:HTMLElement = document.createElement('label');
        let bookTitleInputElement:HTMLInputElement = document.createElement('input');
        let bookEditBool:Boolean = false;

        bookTitleDispElement.innerHTML = bookName;
        bookTitleInputElement.value = bookName;
        bookTitleInputElement.style.display = 'none';

        element.classList.add('tree-cms_bookName');
        element.appendChild(bookIconElement);
        element.appendChild(bookTitleDispElement);
        element.appendChild(bookTitleInputElement);

        bookIconElement.addEventListener('click',()=>{
            bookEditBool = !bookEditBool;

            if(bookEditBool){
                bookTitleDispElement.style.display = 'none';
                bookTitleInputElement.style.display = 'inline';
            }else{
                bookTitleDispElement.style.display = 'inline';
                bookTitleInputElement.style.display = 'none';
                bookTitleDispElement.innerHTML = bookTitleInputElement.value;
            }
        });

        element.addEventListener('dblclick',()=>{
            console.log('book Edit start');
            this.bookInfo.open(this);
            this.bookEditor.active = false;
        })

        return element;
    }

    private createBookPagesArea = ()=>{
        let element = document.createElement('div');
        let pageElement = document.createElement('div');
        let addPageElement = document.createElement('div');

        element.classList.add('tree-cms_pageMenu');
        element.classList.add('is-active');
        pageElement.classList.add('tree-cms_pages');
        addPageElement.classList.add('tree-cms_pagePlus');
        addPageElement.appendChild(Util.createIcon('fa-plus'));
        addPageElement.appendChild(Util.createIcon('fa-file'));

        addPageElement.addEventListener('click',()=>{
            let newPageElement = this.createBookPage(this.nextPageID);
            this.nextPageID++;
            pageElement.appendChild(newPageElement);
        });

        element.appendChild(pageElement);
        element.appendChild(addPageElement);

        return element;
    }

    //新規ページ作成
    private createBookPage = (pageID:number)=>{
        this.pages[pageID] = {};

        let pageEditBool:Boolean = false;

        let newPageElement:HTMLElement = document.createElement('div');

        let pageIconElement:HTMLElement = Util.createIcon('fa-file');
        let pageTitleElement:HTMLElement = document.createElement('label');

        let pageTitleDispElement:HTMLElement = document.createElement('label');
        let pageTitleInputElement:HTMLInputElement = document.createElement('input');

        newPageElement.classList.add('tree-cms_page');
        newPageElement.appendChild(pageIconElement);

        pageTitleElement.classList.add('tree-cms_pageName');
        
        pageTitleDispElement.innerHTML = 'new page';
        pageTitleDispElement.style.display = 'inline';

        pageTitleInputElement.value = 'new page';
        pageTitleInputElement.style.display = 'none';

        pageIconElement.addEventListener('click',()=>{
            pageEditBool = !pageEditBool;

            if(pageEditBool){
                pageTitleDispElement.style.display = 'none';
                pageTitleInputElement.style.display = 'inline';
            }else{
                pageTitleDispElement.style.display = 'inline';
                pageTitleDispElement.innerHTML = pageTitleInputElement.value;
                pageTitleInputElement.style.display = 'none';
            }
        });

        pageTitleElement.appendChild(pageTitleDispElement);
        pageTitleElement.appendChild(pageTitleInputElement);

        newPageElement.appendChild(pageTitleElement);

        newPageElement.addEventListener('dblclick',()=>{
            this.bookEditor.open(this.pages[pageID]);
        });

        return newPageElement;
    }

    //ブックの編集ページを開く
    private bookOpen = ()=>{
        this.bookEditor.close();
        this.bookInfo.open(this);
    }

    //ページのエディタを開く
    private pageOpen = (pageID:number)=>{
        this.bookInfo.close();
        this.bookEditor.open(this.pages)
    }
}

class TreeCMSBookInfo {
    private element:HTMLElement;
    private editBook:TreeCMSBook;

    //セーブしているかどうか(未セーブの場合はアラートを出すなどする)
    private saveFlag:Boolean;

    constructor(){
        this.element = <HTMLElement>document.querySelector('.tree-cms_bookInfoArea');
        this.saveFlag = true;
    }

    public set active (bool:Boolean){
        if(bool){
            this.element.style.display = 'flex';
        }else{
            this.element.style.display = 'none';
        }
    }

    public open = (book:TreeCMSBook)=>{
        this.editBook = book;
        this.active = true;
    }

    public close = ()=>{
        this.editBook = null;
        this.active = false;
    }
}

class TreeCMS {
    private bookbar:TreeCMSBookBar;

    private editor:TreeCMSEditor;
    private bookInfo:TreeCMSBookInfo;

    constructor(){
        window.onload = ()=>{
            this.editor = new TreeCMSEditor();
            this.bookInfo = new TreeCMSBookInfo();

            this.bookbar = new TreeCMSBookBar(this.editor,this.bookInfo);
        }
    }
}

new TreeCMS();

let bookData:Array<Object> = [];  //ブック一覧
let bookPages:Array<Array<Object>> = []; //ブックのページデータ

bookData[1] = {
    id: 1,
    title: 'テストブック',
    prev: [],
    next: [2]
};

bookData[2] = {
    id: 2,
    title: 'テストブック2',
    prev: [1],
    next: []
};

bookPages[1] = [
    {
        title:'Mithril.jsとは？',
        contents:[
            {
                type:TreeD.COMPONENT.MARKDOWN,
                data:{
                    source: 'Mithril.jsは、VirtualDOMの技術を利用した、クライアントサイドのJavascriptフレームワークです。' +
                            'SPAをはじめとしたWebアプリケーションの作成を強力にサポートします。' +
                            'Mithrilはその他のVirtual DOMフレームワークと比較して、APIの数が少なく動作が高速という点が勝っています。' +
                            '\n> 余計な機能がないのでファイルサイズも軽量で、他の様々なライブラリやコンポーネントとの統合も容易です。' +
                            '\n> 素晴らしいですね。' +
                            '\n\nUndoは<kbd>Command</kbd> + <kbd>Z</kbd>'
                }
            },
            {
                type:TreeD.COMPONENT.HIGHLIGHT,
                data:{
                    laungage: 'html',
                    source: '<!doctype html>\n' +
                            '<body>\n' +
                            '   <script src="//unpkg.com/mithril/mithril.js"></script>\n' +
                            '       <script>\n' +
                            '       var root = document.body\n' +
                            '       // your code goes here!\n' +
                            '       </script>\n' +
                            '</body>'
                }
            },
            {
                type:TreeD.COMPONENT.MARKDOWN,
                data:{
                    source: 'この文章は、コンポーネントの間に配置されています。'
                }
            },
            {
                type:TreeD.COMPONENT.PLAYGROUND,
                data:{
                    htmlsource: '<h1>Hello World!</h1>',
                    csssource:  'h1 {\n' +
                                '   color: #f00;\n' +
                                '}',
                    jssource:   'document.querySelector("h1").style.backgroundColor = "#ffff00"'
                }
            },
            {
                type:TreeD.COMPONENT.MARKDOWN,
                data:{
                    source: '$$$a^2_1+b^2_1=5$$$'
                }
            }
        ]
    },
    {
        title:'他VirtualDomライブラリとの差異',
        contents:[
            {
                type:TreeD.COMPONENT.MARKDOWN,
                data:{
                    source: 'テスト'
                }
            },
            {
                type:TreeD.COMPONENT.MARKDOWN,
                data:{
                    source: 'てすと'
                }
            }
        ]
    }
];

//nodeData1の持つページ群
bookPages[2] = [
    {
        title:'npm',
        contents:[
            {
                type:TreeD.COMPONENT.MARKDOWN,
                data:{
                    source: 'この文章はテスト用の例文です。'
                }
            },
            {
                type:TreeD.COMPONENT.HIGHLIGHT,
                data:{
                    laungage: 'html',
                    source: '<!doctype html>\n' +
                            '<body>\n' +
                            '   <script src="node.js"></script>\n' +
                            '       <script>\n' +
                            '       var root = document.body\n' +
                            '       </script>\n' +
                            '</body>'
                }
            },
            {
                type:TreeD.COMPONENT.MARKDOWN,
                data:'この文章は末尾の文章です。'
            },
        ]
    }
];