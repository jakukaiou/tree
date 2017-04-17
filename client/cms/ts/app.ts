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

    private nextEditorID:number;

    private editors:{[key:number]:Editor};
    private previews:{[key:number]:Component};

    //エディタの編集内容を格納するコンテンツ
    private contents:Object;

    constructor(){
        this.element = <HTMLElement>document.querySelector('.tree-cms_editmenu');

        this.nextEditorID = 0;
        this.editors = {};

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
    private toolbar:TreeCMSToolBar;

    private editorTreeview:HTMLElement;
    private editorResizer:HTMLElement;
    private nextOpenBool:Boolean;

    //ブックバーの各種操作が可能かどうか
    //このクラス内ではこれで判断
    private lockBool:Boolean;

    //ブックバーをロックしたブック
    private lockBookID:number;
    private lockPageID:number;

    constructor(editor:TreeCMSEditor,bookInfo:TreeCMSBookInfo,toolbar:TreeCMSToolBar){
        this.books = {};

        this.editor = editor;
        this.bookInfo = bookInfo;
        this.toolbar = toolbar;

        this.bookInfo.active = false;
        this.editor.active = false;
        this.lockBool = false;
        this.lockBookID = 0;
        this.lockPageID = 0;

        this.bookList = <HTMLElement>document.querySelector('.tree-cms_books');
        this.bookAddButton = <HTMLElement>document.querySelector('.tree-cms_bookPlus');
        this.nextBookID = 1;

        this.bookAddButton.addEventListener('click',()=>{
            this.bookAdd();
        });

        this.editorTreeview = <HTMLElement>document.querySelector('.tree-cms_treeview');
        this.nextOpenBool = false;
        this.editorResizer = <HTMLElement>document.querySelector('.tree-cms_resizer');
        this.editorResizer.addEventListener('click',()=>{
            console.log('resizer');
            console.log(this.lockBool);
            if(this.nextOpenBool){
                this.sideOpen();
            }else{
                this.sideClose();
            }
        });
    }

    private bookAdd = ()=>{
        if(!this.lockBool){
            let element = document.createElement('div');
            element.classList.add('tree-cms_book');
            element.id = 'book-'+this.nextBookID;
            this.bookList.appendChild(element);
            this.books[this.nextBookID] = new TreeCMSBook(this.nextBookID,'#book-'+this.nextBookID,this,this.bookInfo,this.editor,this.toolbar,[]);
            this.nextBookID++;
        }
    }

    public sideOpen = ()=>{
        if(!this.lockBool){
            this.editorTreeview.style.width= '180px';
        }
        this.nextOpenBool = false;
    }

    public sideClose = ()=>{
        if(!this.lockBool){
            this.editorTreeview.style.width= '0px';
        }
        this.nextOpenBool = true;
    }

    //ブックバーをロックする
    public lock = (bookID:number,pageID?:number)=>{
        this.lockBookID = bookID;
        if(pageID){
            this.lockPageID = pageID;
        }
        this.lockBool = true;
    }

    //ブックバーをアンロックする
    public unlock = ()=>{
        this.lockBookID = 0;
        this.lockPageID = 0;
        this.lockBool = false;
    }

    //ブックバーが利用可能かどうか調べる
    public available = (bookID:number,pageID?:number)=>{
        if(this.lockBool){
            if(bookID){
                if(pageID){
                    if(this.lockBookID == bookID && this.lockPageID == pageID){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    if(this.lockBookID == bookID && this.lockPageID == 0){
                        return true;
                    }else{
                        return false;
                    }
                }
            }else{
                return true;
            }
        }else{
            return true;
        }
    }
}

class TreeCMSBook {
    private element:HTMLElement;
    private pageElement:HTMLElement;

    private bookID:number;

    private nextPageID:number;

    //ブックの情報を開く画面 ブック自体の情報を編集する時にアクティブにする
    private bookInfo:TreeCMSBookInfo;
    //ページのエディタ画面 ページ編集時にアクティブにする
    private bookEditor:TreeCMSEditor;
    //ブックのツールバー
    private bookToolbar:TreeCMSToolBar;
    //bookBarクラス
    private base:TreeCMSBookBar;

    //ブックのタイトルが入る
    public title:string;

    //ページの内容が入る
    public pages:Array<Object>;

    constructor(bookID:number,elementSelector:string,base:TreeCMSBookBar,bookInfo:TreeCMSBookInfo,bookEditor:TreeCMSEditor,bookToolbar:TreeCMSToolBar,bookPages:Array<Object>){
        this.bookInfo = bookInfo;
        this.bookEditor = bookEditor;
        this.bookToolbar = bookToolbar;
        this.base = base;

        this.bookID = bookID;

        this.pages = bookPages;
        this.nextPageID = this.pages.length + 1;

        this.title = 'newBook';

        this.element = <HTMLElement>document.querySelector(elementSelector);
        this.element.appendChild(this.createBookTitle('newBook'));
        this.element.appendChild(this.createBookPagesArea());
    }

    private createBookTitle = (bookName:string)=>{
        let element = document.createElement('div');
        let bookIconElement:HTMLElement = Util.createIcon('fa-book');

        let bookTitleElement:HTMLElement = document.createElement('label');
        let bookTitleDispElement:HTMLElement = document.createElement('label');
        let bookTitleInputElement:HTMLInputElement = document.createElement('input');
        let bookEditBool:Boolean = true;

        bookTitleDispElement.innerHTML = bookName;
        bookTitleInputElement.value = bookName;

        element.classList.add('tree-cms_bookName');
        element.appendChild(bookIconElement);

        bookTitleElement.classList.add('tree-cms_bookTitleContainer');
        bookTitleElement.appendChild(bookTitleDispElement);
        bookTitleElement.appendChild(bookTitleInputElement);

        element.appendChild(bookTitleElement);

        bookIconElement.addEventListener('click',()=>{
            if(this.base.available(this.bookID)){
                bookEditBool = !bookEditBool;

                if(bookEditBool){
                    this.base.lock(this.bookID);
                    bookTitleDispElement.style.display = 'none';
                    bookTitleInputElement.style.display = 'inline';
                }else{
                    this.base.unlock();
                    bookTitleDispElement.style.display = 'inline';
                    bookTitleInputElement.style.display = 'none';
                    this.title = bookTitleInputElement.value;
                    bookTitleDispElement.innerHTML = bookTitleInputElement.value;
                }
            }
        });

        bookTitleElement.addEventListener('dblclick',()=>{
            this.bookOpen();
        });

        this.base.lock(this.bookID);
        bookTitleDispElement.style.display = 'none';
        bookTitleInputElement.style.display = 'inline';

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
            if(this.base.available(this.bookID,this.nextPageID)){
                let newPageElement = this.createBookPage(this.nextPageID);
                this.nextPageID++;
                pageElement.appendChild(newPageElement);
            }
        });

        element.appendChild(pageElement);
        element.appendChild(addPageElement);

        return element;
    }

    //新規ページ作成
    private createBookPage = (pageID:number)=>{
        this.pages[pageID] = {
            title:'new page',
            contents:[]
        };

        let pageEditBool:Boolean = true;

        let newPageElement:HTMLElement = document.createElement('div');

        let pageIconElement:HTMLElement = Util.createIcon('fa-file');
        let pageTitleElement:HTMLElement = document.createElement('label');

        let pageTitleDispElement:HTMLElement = document.createElement('label');
        let pageTitleInputElement:HTMLInputElement = document.createElement('input');

        newPageElement.classList.add('tree-cms_page');
        newPageElement.appendChild(pageIconElement);

        pageTitleElement.classList.add('tree-cms_pageName');
        
        pageTitleDispElement.innerHTML = this.pages[pageID]['title'];
        pageTitleDispElement.style.display = 'inline';

        pageTitleInputElement.value = this.pages[pageID]['title'];
        pageTitleInputElement.style.display = 'none';

        pageIconElement.addEventListener('click',()=>{
            if(this.base.available(this.bookID,pageID)){
                pageEditBool = !pageEditBool;

                if(pageEditBool){
                    this.base.lock(this.bookID,pageID);
                    pageTitleDispElement.style.display = 'none';
                    pageTitleInputElement.style.display = 'inline';
                }else{
                    this.base.unlock();
                    pageTitleDispElement.style.display = 'inline';
                    this.pages[pageID]['title'] = pageTitleInputElement.value
                    pageTitleDispElement.innerHTML = this.pages[pageID]['title'];
                    pageTitleInputElement.style.display = 'none';
                }
            }
        });

        pageTitleElement.appendChild(pageTitleDispElement);
        pageTitleElement.appendChild(pageTitleInputElement);

        pageTitleElement.addEventListener('dblclick',()=>{
            this.pageOpen(pageID);
        });

        newPageElement.appendChild(pageTitleElement);

        this.base.lock(this.bookID,pageID);
        pageTitleDispElement.style.display = 'none';
        pageTitleInputElement.style.display = 'inline';

        return newPageElement;
    }

    //ブックの編集ページを開く
    private bookOpen = ()=>{
        this.bookEditor.close();
        this.bookInfo.open(this);
        this.bookToolbar.bookEditOpen(this);
    }

    //ページのエディタを開く
    private pageOpen = (pageID:number)=>{
        this.bookInfo.close();
        this.bookEditor.open(this.pages);
        this.bookToolbar.pageEditOpen(this,pageID);
        this.base.sideClose();
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

class TreeCMSToolBar {
    private element:HTMLElement;

    //編集中のオブジェクト名が入るエレメント
    private targetTitleElement:HTMLElement;

    constructor() {
        this.element = <HTMLElement>document.querySelector('.toolbarArea');

        this.targetTitleElement = <HTMLElement>document.querySelector('.editTarget');
    }

    //ブック情報編集のツールバーを開く
    public bookEditOpen = (book:TreeCMSBook)=>{
        console.log('toolbar book disp');
        let titleString:string = '<i class="fa fa-book" aria-hidden="true"></i><label>'+book.title+'</label>';
        this.targetTitleElement.innerHTML = titleString;
    }

    //ページ編集のツールバーを開く
    public pageEditOpen = (book:TreeCMSBook,pageID:number)=>{
        let titleString:string = '<i class="fa fa-book" aria-hidden="true"></i><label>'+book.title+'</label>'
                               + ' >'
                               + '<i class="fa fa-file" aria-hidden="true"></i><label>'+book.pages[pageID]['title']+'</label>';
        this.targetTitleElement.innerHTML = titleString;
    }
}

class TreeCMS {
    private bookbar:TreeCMSBookBar;

    private editor:TreeCMSEditor;
    private bookInfo:TreeCMSBookInfo;
    private toolbar:TreeCMSToolBar;

    constructor(){
        window.onload = ()=>{
            this.editor = new TreeCMSEditor();
            this.bookInfo = new TreeCMSBookInfo();
            this.toolbar = new TreeCMSToolBar();

            this.bookbar = new TreeCMSBookBar(this.editor,this.bookInfo,this.toolbar);
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