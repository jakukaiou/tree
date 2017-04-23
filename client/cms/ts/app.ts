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

enum EDITMODE {
    NONE,
    BOOK,
    PAGE
}

let dragSource:HTMLElement;


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

    //エディターで開くブック
    private targetBook:TreeCMSBook;

    //エディターで開くページID
    private targetPageID:number;

    //ページのタイトル
    private targetPageTitle:string;

    constructor(){
        this.element = <HTMLElement>document.querySelector('.tree-cms_editmenu');

        this.nextEditorID = 0;
        this.editors = {};

        this.editorArea = <HTMLElement>this.element.querySelector('.tree-editors');
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
            let data:Object = {
                type:TreeD.COMPONENT.MARKDOWN,
                data:{
                    source:''
                }
            }
            this.addEditor(TreeD.COMPONENT.MARKDOWN,data);
        });

        //ハイライトエディタの追加処理
        this.addHighlight = <HTMLElement>document.querySelector('.selectEditor .highlighter');
        this.addHighlight.addEventListener('click',()=>{
            let data:Object = {
                type:TreeD.COMPONENT.HIGHLIGHT,
                data:{
                    language:'html',
                    source:''
                }
            }
            this.addEditor(TreeD.COMPONENT.HIGHLIGHT,data);
        });

        this.addHighlight = <HTMLElement>document.querySelector('.selectEditor .playground');
        this.addHighlight.addEventListener('click',()=>{
            let data:Object = {
                type:TreeD.COMPONENT.PLAYGROUND,
                data:{
                    htmlsource:'',
                    csssource:'',
                    jssource:'',
                }
            }
            this.addEditor(TreeD.COMPONENT.PLAYGROUND,data);
        });
    }

    private addEditor= (type,data:Object)=>{
        this.addEditorButton.style.display = 'block';
        this.addEditorMenu.style.display = 'none';
        let addEditor:Element = document.createElement('div');     //追加するエディター
        let addComponent:Element = document.createElement('div');  //追加するコンポーネント
        let id:number = this.nextEditorID;

        let editorIDstring:string = 'component-editor'+this.nextEditorID.toString();
        addEditor.id = editorIDstring;
        this.editorArea.appendChild(addEditor);

        let componentIDString:string = 'component-preview'+this.nextEditorID.toString();
        addComponent.id = componentIDString;
        this.previewArea.appendChild(addComponent);

        let editor:Editor;

        switch(type){
            case TreeD.COMPONENT.MARKDOWN:
                editor = new MarkdownEditor('#'+editorIDstring, '#'+componentIDString, data);
                break;
            case TreeD.COMPONENT.HIGHLIGHT:
                editor = new HighlightEditor('#'+editorIDstring, '#'+componentIDString, data);
                break;
            case TreeD.COMPONENT.PLAYGROUND:
                editor = new PlayGroundEditor('#'+editorIDstring, '#'+componentIDString, data);
                break;
        }

        editor.editorDelete.addEventListener('click',()=>{
            delete this.editors[id];
            this.editorArea.removeChild(addEditor);
            this.previewArea.removeChild(addComponent);
        });

        this.editors[this.nextEditorID] = editor;

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

    //エディタを開く
    public open = (book:TreeCMSBook,pageID:number)=>{
        this.targetBook = book;
        this.targetPageID = pageID;
        this.reset();
        this.loadData(this.targetBook.pages[this.targetPageID]['title'],this.targetBook.pages[this.targetPageID]['contents']);
        this.active = true;
    }

    //初期値からエディタを生成
    private loadData = (title:string,contents:Object)=>{
        this.targetPageTitle = title;
        let contentsLength = Object.keys(contents).length;
        Object.keys(contents).map((key)=>{
            this.addEditor(contents[key]['type'],contents[key]['data']);
        });
    }

    //エディタの表示内容をオブジェクトとして出力
    public exportData = ()=>{
        let exportObj = {};
        exportObj['title'] = this.targetPageTitle;
        let contentArray:Array<Object> = [];
        Object.keys(this.editors).map((key)=>{
            contentArray.push(this.editors[key].exportData());
        });

        exportObj['contents'] = contentArray;

        return exportObj;
    }

    public reset = ()=>{
        //展開中エディタの削除処理
        Object.keys(this.editors).map((id)=>{
            let editorIDstring:string = '#component-editor'+id.toString();
            this.editorArea.removeChild(document.querySelector(editorIDstring));

            let previewIDstring:string = '#component-preview'+id.toString();
            this.previewArea.removeChild(document.querySelector(previewIDstring));
        });

        this.nextEditorID = 0;
        this.editors = {};
        this.previews = {};
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

    constructor(bookInfoArray:Array<Object>,bookContentArray:Array<Array<Object>>,editor:TreeCMSEditor,bookInfo:TreeCMSBookInfo,toolbar:TreeCMSToolBar){
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

        /* start ロード時ブック作成処理 */
        bookInfoArray.map((value,id)=>{
            this.bookAdd(bookInfoArray[id],bookContentArray[id],true);
        });
        /*  end  ロード時ブック作成処理 */

        this.bookAddButton.addEventListener('click',()=>{
            this.bookAdd({},[]);
        });

        this.editorTreeview = <HTMLElement>document.querySelector('.tree-cms_treeview');
        this.nextOpenBool = false;
        this.editorResizer = <HTMLElement>document.querySelector('.tree-cms_resizer');
        this.editorResizer.addEventListener('click',()=>{
            if(this.nextOpenBool){
                this.sideOpen();
            }else{
                this.sideClose();
            }
        });
    }

    private bookAdd = (bookInfoData:Object,bookContentData:Array<Object>,auto?:Boolean)=>{
        let autoBool = false;
        if(auto){
            autoBool = true;
        }

        if(!this.lockBool || autoBool){
            let element = document.createElement('div');
            element.classList.add('tree-cms_book');
            element.id = 'book-'+this.nextBookID;
            this.bookList.appendChild(element);
            //tmp
            this.books[this.nextBookID] = new TreeCMSBook(this.nextBookID,'#book-'+this.nextBookID,this,this.bookInfo,this.editor,this.toolbar,bookInfoData,bookContentData,autoBool);
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

    //渡されたブックのprevBookの名前リストを返す
    public prevBookInfo = (book:TreeCMSBook)=>{
        let prevBookIDs = book.prevBooks;
        let prevBookArray:Array<Object> = [];

        prevBookIDs.map((bookID)=>{
            prevBookArray.push(this.books[bookID].info);
        });

        return prevBookArray;
    }

    //渡されたブックのnextBookの名前リストを返す
    public nextBookInfo = (book:TreeCMSBook)=>{
        let nextBookIDs = book.nextBooks;
        let nextBookArray:Array<Object> = [];

        nextBookIDs.map((bookID)=>{
            nextBookArray.push(this.books[bookID].info);
        });

        return nextBookArray;
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
    public bookEditor:TreeCMSEditor;
    //ブックのツールバー
    private bookToolbar:TreeCMSToolBar;
    //bookBarクラス
    private base:TreeCMSBookBar;

    //ブックのタイトルが入る
    public title:string;

    //prevBookのID配列が入る
    public prevBooks:Array<number>;

    //nextBookのID配列が入る
    public nextBooks:Array<number>;

    //ページの内容が入る
    public pages:Array<Object>;

    constructor(bookID:number,elementSelector:string,base:TreeCMSBookBar,bookInfo:TreeCMSBookInfo,bookEditor:TreeCMSEditor,bookToolbar:TreeCMSToolBar,bookInfoData:Object,bookContentsData:Array<Object>,auto:Boolean){
        this.bookInfo = bookInfo;
        this.bookEditor = bookEditor;
        this.bookToolbar = bookToolbar;
        this.base = base;

        this.bookID = bookID;

        this.pages = bookContentsData;

        this.nextPageID = this.pages.length;

        if(bookInfoData['title']){
            this.title = bookInfoData['title'];
        }else{
            this.title = 'newBook';
        }

        if(bookInfoData['prev']){
            this.prevBooks = bookInfoData['prev'];
        }else{
            this.prevBooks = [];
        }

        if(bookInfoData['next']){
            this.nextBooks = bookInfoData['next'];
        }else{
            this.nextBooks = [];
        }

        this.element = <HTMLElement>document.querySelector(elementSelector);
        this.element.appendChild(this.createBookTitle(this.title,auto));
        this.element.appendChild(this.createBookPagesArea(bookContentsData));
    }

    private createBookTitle = (bookName:string,auto:Boolean)=>{
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

        if(auto){
            bookEditBool = false;
            bookTitleDispElement.style.display = 'inline';
            bookTitleInputElement.style.display = 'none';
        }else{
            bookEditBool = true;
            this.base.lock(this.bookID);
            bookTitleDispElement.style.display = 'none';
            bookTitleInputElement.style.display = 'inline';
        }

        element.setAttribute('draggable','true');
        element.setAttribute('bookID',this.bookID.toString());

        element.addEventListener('dragstart',(e)=>{
            e.dataTransfer.setData('bookid',this.bookID.toString());
            e.dataTransfer.setData('booktitle',this.title);
        });

        return element;
    }

    private createBookPagesArea = (contentsData:Array<Object>)=>{
        let element = document.createElement('div');
        let pageElement = document.createElement('div');
        let addPageElement = document.createElement('div');

        element.classList.add('tree-cms_pageMenu');
        element.classList.add('is-active');
        pageElement.classList.add('tree-cms_pages');
        addPageElement.classList.add('tree-cms_pagePlus');
        addPageElement.appendChild(Util.createIcon('fa-plus'));
        addPageElement.appendChild(Util.createIcon('fa-file'));

        contentsData.map((value,id)=>{
            let newPageElement = this.createBookPage(id,value,true);
            pageElement.appendChild(newPageElement);
        });

        addPageElement.addEventListener('click',()=>{
            if(this.base.available(this.bookID,this.nextPageID)){
                let data = {
                    title:'new page',
                    contents:[]
                };
                let newPageElement = this.createBookPage(this.nextPageID,data);
                this.nextPageID++;
                pageElement.appendChild(newPageElement);
            }
        });

        element.appendChild(pageElement);
        element.appendChild(addPageElement);

        return element;
    }

    //新規ページ作成
    private createBookPage = (pageID:number,data:Object,auto?:Boolean)=>{
        this.pages[pageID] = data;

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
        pageTitleInputElement.value = this.pages[pageID]['title'];

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

        if(auto){
            pageTitleDispElement.style.display = 'inline';
            pageTitleInputElement.style.display = 'none';  
        }else{
            this.base.lock(this.bookID,pageID);
            pageTitleDispElement.style.display = 'none';
            pageTitleInputElement.style.display = 'inline';
        }

        return newPageElement;
    }

    //ブックの編集ページを開く
    private bookOpen = ()=>{
        this.bookEditor.reset();
        this.bookInfo.open(this,this.base);
        this.bookToolbar.bookEditOpen(this);
    }

    //ページのエディタを開く
    private pageOpen = (pageID:number)=>{
        this.bookInfo.close();
        this.bookEditor.open(this,pageID);
        this.bookToolbar.pageEditOpen(this,pageID);
        this.base.sideClose();
    }

    //ブックのページを置き換える
    public pageUpdate = (pageID,pageData:Object)=>{
        this.pages[pageID] = pageData;
    }

    public get info (){
        return {
            id:this.bookID,
            title:this.title,
            prev:this.prevBooks,
            next:this.nextBooks
        }
    }
}

class TreeCMSBookInfo {
    private element:HTMLElement;
    private prevBookElement:HTMLElement;
    private nextBookElement:HTMLElement;
    private editBook:TreeCMSBook;

    private prevBookInfo:Array<Object>;
    private nextBookInfo:Array<Object>;

    private dragFlag:Boolean;

    constructor(){
        this.element = <HTMLElement>document.querySelector('.tree-cms_bookInfoArea');
        this.prevBookElement = <HTMLElement>document.querySelector('.tree-cms_prevBooks');
        this.nextBookElement = <HTMLElement>document.querySelector('.tree-cms_nextBooks');

        this.dragFlag = false;

        this.prevBookElement.addEventListener('dragenter',(e)=>{
            console.log('(dragenter)');
        });

        this.prevBookElement.addEventListener('dragleave',(e)=>{
            console.log('(dragleave)');
        });

        this.prevBookElement.addEventListener('dragover',(e)=>{
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });

        this.prevBookElement.addEventListener('drop',(e)=>{
            console.log('drop');
            console.log(e.dataTransfer.getData('bookid'));
            console.log(e.dataTransfer.getData('booktitle'));
        });
    }

    public set active (bool:Boolean){
        if(bool){
            this.element.style.display = 'flex';
        }else{
            this.element.style.display = 'none';
        }
    }

    public open = (book:TreeCMSBook,bookBar:TreeCMSBookBar)=>{
        this.editBook = book;
        this.active = true;

        this.prevBookInfo = bookBar.prevBookInfo(book);
        this.nextBookInfo = bookBar.nextBookInfo(book);

        this.dispLinkBooks();
    }

    public close = ()=>{
        this.editBook = null;
        this.active = false;
    }

    public dispLinkBooks = ()=>{
        this.prevBookElement.innerHTML = '';
        this.prevBookInfo.map((bookInfo)=>{
            let bookElement = this.createBookDisp(bookInfo);
            this.prevBookElement.appendChild(bookElement);
        });

        this.nextBookElement.innerHTML = '';
        this.nextBookInfo.map((bookInfo)=>{
            let bookElement = this.createBookDisp(bookInfo);
            this.nextBookElement.appendChild(bookElement);
        });            
    }

    public createBookDisp = (bookInfo)=>{
        let bookElement = document.createElement('div');
        let bookTitleElement = document.createElement('label');
        bookTitleElement.innerHTML = bookInfo['title'];

        bookElement.classList.add('tree-cms_prevBook');
        bookElement.classList.add('tree-cms_linkedBook');
        bookElement.setAttribute('draggable','true');
        bookElement.appendChild(Util.createIcon('fa-book'));
        bookElement.appendChild(bookTitleElement);

        bookElement.addEventListener('dragstart',(e)=>{
            dragSource = <HTMLElement>e.target;
            e.dataTransfer.setData('bookid',(<number>bookInfo['id']).toString());
            e.dataTransfer.setData('booktitle',bookInfo['title']);
        });

        bookElement.setAttribute('bookid',bookInfo['id']);

        return bookElement;
    }
}

class TreeCMSToolBar {
    private editmode:EDITMODE;

    private element:HTMLElement;

    //編集中のオブジェクト名が入るエレメント
    private targetTitleElement:HTMLElement;

    //保存ボタン
    private saveButtonElement:HTMLElement;

    //消去ボタン
    private deleteButtonElement:HTMLElement;

    //開いているブックを入れる
    private book:TreeCMSBook;

    //開いているページのIDを入れる
    private pageID:number;

    constructor() {
        this.element = <HTMLElement>document.querySelector('.toolbarArea');
        this.editmode = EDITMODE.NONE;

        this.targetTitleElement = <HTMLElement>document.querySelector('.editTarget');

        this.saveButtonElement = <HTMLElement>document.querySelector('.toolbarButtonContainer .toolbar-save');
        this.saveButtonElement.addEventListener('click',()=>{
            switch(this.editmode){
                case EDITMODE.NONE:
                    
                    break;
                case EDITMODE.BOOK:

                    break;
                case EDITMODE.PAGE:
                    this.book.pageUpdate(this.pageID,this.book.bookEditor.exportData());
                    break;
            }
        });

        this.deleteButtonElement = <HTMLElement>document.querySelector('.toolbarButtonContainer .toolbar-delete');
        this.deleteButtonElement.addEventListener('click',()=>{
            switch(this.editmode){
                case EDITMODE.NONE:
                    
                    break;
                case EDITMODE.BOOK:

                    break;
                case EDITMODE.PAGE:

                    break;
            }
        });

        this.targetTitleElement.style.display = 'none';
        this.saveButtonElement.style.display = 'none';
        this.deleteButtonElement.style.display = 'none';
    }

    //ブック情報編集のツールバーを開く
    public bookEditOpen = (book:TreeCMSBook)=>{
        this.book = book;

        let titleString:string = '<i class="fa fa-book" aria-hidden="true"></i><label>'+book.title+'</label>';
        this.targetTitleElement.innerHTML = titleString;

        this.editmode = EDITMODE.BOOK;

        this.targetTitleElement.style.display = 'inline';
        this.saveButtonElement.style.display = 'inline';
        this.deleteButtonElement.style.display = 'inline';
    }

    //ページ編集のツールバーを開く
    public pageEditOpen = (book:TreeCMSBook,pageID:number)=>{
        this.book = book;
        this.pageID = pageID;

        let titleString:string = '<i class="fa fa-book" aria-hidden="true"></i><label>'+book.title+'</label>'
                               + ' >'
                               + '<i class="fa fa-file" aria-hidden="true"></i><label>'+book.pages[pageID]['title']+'</label>';
        this.targetTitleElement.innerHTML = titleString;

        this.editmode = EDITMODE.PAGE;

        this.targetTitleElement.style.display = 'inline';
        this.saveButtonElement.style.display = 'inline';
        this.deleteButtonElement.style.display = 'inline';
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

            this.bookbar = new TreeCMSBookBar(bookData,bookPages,this.editor,this.bookInfo,this.toolbar);
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
    next: [3,4]
};

bookData[3] = {
    id: 3,
    title: 'テストブック3',
    prev: [2],
    next: []
};

bookData[4] = {
    id: 4,
    title: 'テストブック4',
    prev: [2],
    next: []
};

bookPages[1] = [
    {
        title:'テストページ',
        contents:[
            {
                type:TreeD.COMPONENT.MARKDOWN,
                data:{
                    source: '# title h1\n' +
                            '## title h2\n' +
                            '### title h3\n' +
                            '#### title h4\n' +
                            '##### title h5\n' +
                            '> これは`引用`です。\n' +
                            '> 引用の2行目です。\n\n' +
                            '* 1番目\n' +
                            '* 2番目\n' +
                            '* 3番目\n\n' +
                            'Undoは<kbd>Command</kbd> + <kbd>Z</kbd>\n\n' +
                            '[Google先生](https://www.google.co.jp/)\n' +
                            '~~取り消し~~\n' +
                            '**strong**\n' +
                            '*italic*\n' +
                            '***strong italic***\n\n' +
                            '| これは | 表 | です |\n' +
                            '|:--:|:--:|:--:|\n' +
                            '| 表の | 中身 | です |\n\n' +
                            '**Eulers formula**: $$$ e^{i\\theta} = \cos \\theta + i\sin \\theta. $$$'
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
                    jssource:   'document.querySelector("h1").style.backgroundColor = "#ffff00";'
                }
            }
        ]
    },
    {
        title:'テストページ2',
        contents:[
            {
                type:TreeD.COMPONENT.MARKDOWN,
                data:{
                    source: '`強調文字`からの**italic**からの~~取り消し~~'
                }
            },
            {
                type:TreeD.COMPONENT.PLAYGROUND,
                data:{
                    htmlsource: '<h1>Hello World!</h1>',
                    csssource:  'h1 {\n' +
                                '   color: #ffffff;\n' +
                                '}',
                    jssource:   'document.querySelector("h1").style.backgroundColor = "#00ff00";'
                }
            }
        ]
    }
];

bookPages[2] = [
    {
        title:'テストページ3',
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
                data:{
                    source: 'この文章は末尾の文章です。'
                }
            },
        ]
    }
];

bookPages[3] = [
    {
        title:'テストページ4',
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
                data:{
                    source: 'この文章は末尾の文章です。'
                }
            },
        ]
    }
];

bookPages[4] = [
    {
        title:'テストページ5',
        contents:[
            {
                type:TreeD.COMPONENT.MARKDOWN,
                data:{
                    source: 'mark down document'
                }
            }
        ]
    }
];