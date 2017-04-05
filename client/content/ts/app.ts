//TODO 1ノートのデータ渡し実装とルーティング実装
//TODO TreeMainNodeModalに引数を持たせる
//TODO TreeMainNodeModalで現在ページを強調
//TODO 各ビューの最下部に次のページへのリンクをつける

/// <reference path="../../../node_modules/@types/lodash/index.d.ts"/>
/// <reference path="../../../node_modules/@types/mithril/index.d.ts"/>

import '../scss/index.scss';
import 'github-markdown-css';

import * as m from 'mithril';
import * as _ from 'lodash';

// my modules
import Markdown from '../../common/components/ts/markdown';
import PlayGround from '../../common/components/ts/playground';
import Highlight from '../../common/components/ts/ace-highlight';

// 親ノードと子ノードを表す列挙
enum SUB {
    PARENT,
    CHILD
}

//コンポーネントの種類を表す列挙
enum COMPONENT {
    MARKDOWN,
    HIGHLIGHT,
    PLAYGROUND
}

class ComponentBasic implements Mithril.Component<{},{}> {
    public oninit:(vnode:Mithril.VnodeDOM<{},{}>)=>void;
    public oncreate:(vnode:Mithril.VnodeDOM<{},{}>)=>void;
    public onbeforeupdate:(vnode:Mithril.VnodeDOM<{},{}>,old)=>boolean;
    public onupdate:(vnode:Mithril.VnodeDOM<{},{}>)=>void;
    public onbeforeremove:(vnode:Mithril.VnodeDOM<{},{}>)=>void;
    public onremove:(vnode:Mithril.VnodeDOM<{},{}>)=>void;

    public view:(vnode:Mithril.VnodeDOM<{},{}>)=> Mithril.Vnode<{},{}>[];

    constructor() {
        
    }
}

class TreeHeader extends ComponentBasic {
    constructor() {
        super();

        this.oncreate = (vnode)=> {
            //スクロールのリセット処理
            //window.scrollTo(0,0);
        }

        this.view = (vnode)=> {
        return  [m('nav.nav.tree-nav', [
                    m('.nav-left', [
                        m('a.nav-item.tree-title', [
                                m('div.tree-nav.logo'),
                                'Tree.io'
                            ])
                    ]),
                    m('a.nav-toggle', [
                        m('span'),
                        m('span'),
                        m('span')
                    ]),
                    m('.nav-right.nav-menu', [
                        m('a.nav-item.tree-contact', [
                            m('i.fa.fa-envelope[aria-hidden="true]')
                        ]),
                        m('a.nav-item.tree-help', [
                            m('i.fa.fa-question-circle-o[aria-hidden="true]')
                        ]),
                        m('a.nav-item.tree-help', [
                            m('i.fa.fa-twitter[aria-hidden="true"]')
                        ]),
                        m('span.nav-item', [
                            m('p.control.has-icon', [
                                m('input.input[placeholder="Search..."][type="email"]'),
                                m('span.icon', [
                                    m('i.fa.fa-search[aria-hidden="true"]')
                                ])
                            ])
                        ])
                    ])
                ])];
        };
    }
}

class TreeLink extends ComponentBasic {
    constructor() {
        super();

        this.view = (vnode)=> {
            return [m('div.tree-link')];
        };
    }
}

class TreeMainNodeModal extends ComponentBasic {
    constructor(nodeID:number,pageNumber:number,pageTitles:Array<string>) {
        super();

        let makePagelink = (value:string,key:number)=> {
            return m('li', [m('a',{href:'#!tree/'+nodeID+'/'+key}, value)]);
        };

        this.view = (vnode)=> {
            return [m('.modal', [
                        m('.modal-background'),
                        m('.modal-card', [
                            m('header.modal-card-head', [
                                m('p.modal-card-title', 'Mithril.js')
                            ]),
                            m('section.modal-card-body', [
                                m('.content', [
                                    m('ol', [
                                        [ _.map(pageTitles,makePagelink)],
                                        m('li', [
                                            m('a', 'このスタイルも検討する'),
                                            m('ul', [
                                                m('li', 'In fermentum leo eu lectus mollis, quis dictum mi aliquet.'),
                                                m('li', 'Morbi eu nulla lobortis, lobortis est in, fringilla felis.')
                                            ])
                                        ]),
                                    ])
                                ])
                            ]),
                            m('footer.modal-card-foot', [
                                
                            ]),
                            m('button.modal-close')
                        ])
                    ])];
        };
    }
}

class TreeMainNodeHeader extends ComponentBasic {

    private prevNum:number;
    private nextNum:number;

    constructor(nodeTitle:string,nodeID:number,pageTitles:Array<string>,pageNumber:number) {
        super();
        this.prevNum = pageNumber-1;
        this.nextNum = pageNumber+1;

        this.oncreate = (vnode)=> {
            //メインヘッダーのスクロール追従
            let scrollPos = document.getElementById('tree-content-header').getBoundingClientRect().top;

            window.addEventListener('scroll' , ()=> {
                if (window.pageYOffset > scrollPos) {
                    document.getElementById('tree-content-header').classList.add('is-fixed');
                }else {
                    if(document.getElementById('tree-content-header')){
                        document.getElementById('tree-content-header').classList.remove('is-fixed');
                    }
                }
            }, false);

            document.querySelector('.tree-content-header #open').addEventListener('click',()=> {
                document.querySelector('.tree-node.main .modal').classList.add('is-active');
            });

            document.querySelector('.tree-node.main .modal .modal-background').addEventListener('click',()=> {
                document.querySelector('.tree-node.main .modal').classList.remove('is-active');
            });

            document.querySelector('.tree-node.main .modal .modal-close').addEventListener('click',()=> {
                document.querySelector('.tree-node.main .modal').classList.remove('is-active');
            });
        }

        this.view = (vnode)=> {
            return [m('div.tree-content-header_holder', [
                        m('header.tree-content-header[id="tree-content-header"]', [
                            m('a.tree-content-header_toggle[id="open"]', [
                                m('i.fa.fa-book[aria-hidden="true"]')
                            ]),
                            m('span.tree-content-header_title', [nodeTitle,m('small', pageTitles[pageNumber])]),
                            m('div.tree-content-header_pager', [
                                this.prevNum === -1 ?
                                m('a.tree-content-header_prev.is-disable[id="open"]', [
                                    m('i.fa.fa-angle-left[aria-hidden="true]')
                                ]) :
                                m('a.tree-content-header_prev[id="open"]',{href:'#!tree/'+nodeID+'/'+this.prevNum}, [
                                    m('i.fa.fa-angle-left[aria-hidden="true]')
                                ])
                                ,
                                m('a.tree-content-header_next[id="open]',{href:'#!tree/'+nodeID+'/'+this.nextNum}, [
                                    m('i.fa.fa-angle-right[aria-hidden="true]')
                                ])
                            ])
                        ])
                    ]),
                    m(new TreeMainNodeModal(nodeID,pageNumber,pageTitles))
                    ];
        };
    }
}

class TreeComponentVnode extends ComponentBasic {

    // TODO:色々なコンポーネントに対応させる
    constructor(data:Object,key:number) {
        super();
        this.oncreate = (vnode)=> {
            switch(data['type']) {
                case COMPONENT.MARKDOWN: {
                    let markdown = new Markdown('#component-'+key,data['data']);
                    break;
                }
                case COMPONENT.HIGHLIGHT: {
                    let highlight = new Highlight('#component-'+key,data['data']);
                    break;
                }
                case COMPONENT.PLAYGROUND: {
                    let playground = new PlayGround('#component-'+key,data['data']);
                    break;
                }
            }
        };

        this.view = (vnode)=> {
            switch(data['type']) {
                case COMPONENT.MARKDOWN: {
                    return [m('div.tree-module.markdown[id=component-' + key + ']')];
                }
                case COMPONENT.HIGHLIGHT: {
                    return [m('div.tree-module.highlight[id=component-' + key + ']')];
                }
                case COMPONENT.PLAYGROUND: {
                    return [m('div.tree-module.playground[id=component-' + key + ']')];
                }
            }
        };
    }
}

class TreeMainNodeContent extends ComponentBasic {
    private contentArray:Array<any>;

    constructor(contentArray:Array<any>,pageTitle:string) {
        super();

        let makeContentVnode = (content:any,key:number)=> {
            return m(new TreeComponentVnode(content,key));
        };

        this.contentArray = contentArray;

        this.view = (vnode)=> {
            return [m('div.markdown-body.tree-content',[
                        m(new TreeMainNodeContentTitle(pageTitle)),
                        [ _.map(this.contentArray,makeContentVnode)]
                    ])];
        };
    }
}

class TreeMainNodeContentTitle extends ComponentBasic {
    constructor(pageTitle:string) {
        super();

        this.view = (vnode)=> {
            return [    
                        m('div.google-ad-rectangle'),
                        m('h1.tree-content-title-main',[
                            m('div.tree-title-string',pageTitle)
                        ]
                    )];
        };
    }
}

class TreeMainNode extends ComponentBasic {
    constructor(nodeID:number, nodePage:number) {
        super();

        let nodePageTitles = _.map(nodePages[nodeID],(pageInfo)=>{
            return pageInfo['title'];
        });

        this.view = (vnode)=> {
            return [m('div.section.tree-node.main',[
                        m('div.tree-contents',[
                            m(new TreeMainNodeHeader(nodeData[nodeID]['title'],nodeID,nodePageTitles,nodePage)),
                            m(new TreeMainNodeContent(nodePages[nodeID][nodePage]['contents'],nodePages[nodeID][nodePage]['title']))
                        ]),
                    ])];
        };
    }
}

class TreeSubNode extends ComponentBasic {
    private relation:SUB;
    private title:string;

    constructor(relation:SUB,tags:Array<number>) {
        super();

        this.relation = relation;
        if(this.relation === SUB.PARENT) {
            this.title = 'prev-node';
        }else {
            this.title = 'next-node';
        }

        let makeTagVnode = (tagId:number)=> {
            return m('a.tag.tree-nodetag',{href:'#!tree/'+tagId+'/0'},nodeData[tagId]['title']);
        };

        this.relation = relation;
        this.view = (vnode)=> {
            return [m('section.section.tree-node.sub', [
                        m('.tree-contents', [
                            m('.tree-contents-header', [
                                m('i.fa.fa-tags[aria-hidden="true"]'),
                                this.title
                            ]),
                            m('.content.tree-content', [ _.map(tags,makeTagVnode)])
                        ])
                    ])];
        };
    }
}

class TreeMainContent extends ComponentBasic {
    private bookID:number;
    private count = 0;

    constructor(bookID:number,page:number){
        super();

        this.oninit = (vnode)=> {
            this.bookID = vnode.attrs['id'];
        }

        this.view = (vnode)=> {
            return [
                m(new TreeSubNode(SUB.PARENT,nodeData[bookID]['prev'])),
                m(new TreeLink()),
                m(new TreeMainNode(bookID,page)),
                m(new TreeLink()),
                m(new TreeSubNode(SUB.CHILD,nodeData[bookID]['next'])),
            ];
        }
    }
}

class TreeRoot extends ComponentBasic {
    private bookID:number;

    constructor() {
        super();

        this.oninit = (vnode)=> {
            this.bookID = vnode.attrs['id'];
        }

        this.view = (vnode)=> {
            return [
                m(new TreeHeader()),
                m(new TreeLink()),
                bookData.loadBool? m(new TreeMainContent(vnode.attrs['id'],+vnode.attrs['page'])):m('div','loading...'),
                m(new TreeLink()),
            ]
        };
    }
}

class BookData {
    public loadBool:Boolean = false;

    private bookID:number = null;
    private pageID:number = null;
    public title:String = null;
    public prev:Array<Object> = [];
    public next:Array<Object> = [];
    public pageContent:Array<Object> = [];
    public pageCount:number = null;

    public fetch = (bookID:number,pageID:number)=> {

        //ブックデータの取得
        if(this.bookID === bookID && this.pageID === pageID){
            this.loadBool = true;
            console.log('same book');
        }else if(this.bookID === bookID && this.pageID !== pageID){
            this.loadBool = false;
            Promise.all([
                this.getPageData(bookID,pageID)
            ]).then(function(){
                console.log("loaded page");
                console.log(this);
                this.loadBool = true;
            }.bind(this))
        }else{
            this.loadBool = false;
            Promise.all([
                this.getBookData(bookID),
                this.getPageData(bookID,pageID)
            ]).then(function(){
                console.log("loaded page and book");
                console.log(this);
                this.loadBool = true;
            }.bind(this))
        }
    };

    private getBookData = (bookID:number)=>{

        return m.request({
                method: "GET",
                url: "/api/book",
                data: {bookID:bookID},
            })
            .then(function(result) {
                console.log('BookData get!');
                this.bookID = bookID;
                this.title = result[0].title;
                this.prev  = result[0].prev;
                this.next  = result[0].next;
                this.pageCount = result[0].pageCount;
            }
            .bind(this));
    }

    private getPageData = (bookID:number,pageID:number)=>{

        return m.request({
                method: "GET",
                url: "/api/page",
                data: {bookID:bookID,pageID:pageID},
            })
            .then(function(result) {
                console.log('PageData get!');
                this.pageID = pageID;
                this.pageContents = result;
            }
            .bind(this));
    }
}

class TreeApplication {

    constructor() {
        window.onload = function(){
            let root = document.body;
            m.route(root,'tree/3/0',{
                'tree/:id/:page':{
                    onmatch:
                    (args: any, requestedPath: string) => {
                        //console.log('onmatch');
                        bookData.fetch(args['id'],args['page']);
                        return new TreeRoot()
                    }
                },
                'test':new TreeLink()
            });
        };
    }
}

let bookData = new BookData();
new TreeApplication();


//仮のデータ構造
let nodeData:Array<Object> = [];  //nextは実装しなくてよい？ (他NodeのPrevを検索すればよい)
let nodePages:Array<Array<Object>> = []; //これは実際にはかなり違うデータ構造

nodeData[1] = {
    id: 1,
    title: 'Javascriptの基本',
    prev: [],
    next: [3],
};

nodeData[2] = {
    id: 2,
    title: 'Virtual DOM',
    prev: [],
    next: [3],
};

nodeData[3] = {
    id: 3,
    title: 'Mithril.js',
    prev: [1,2],
    next: [4],
};

nodeData[4] = {
    id: 4,
    title: 'Polythene',
    prev: [3],
    next: [],
};

//nodeData1の持つページ群
nodePages[1] = [
    {
        title:'npm',
        contents:[
            {
                type:COMPONENT.MARKDOWN,
                data:{
                    source: 'この文章はテスト用の例文です。'
                }
            },
            {
                type:COMPONENT.HIGHLIGHT,
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
                type:COMPONENT.MARKDOWN,
                data:'この文章は末尾の文章です。'
            },
        ]
    }
];

//nodeData2の持つページ群
nodePages[2] = [
    {
        title:'仮想のDOM',
        contents:[
            {
                type:COMPONENT.MARKDOWN,
                data:{
                    source: 'VirtualDOMは'
                }
            },
            {
                type:COMPONENT.HIGHLIGHT,
                data:{
                    laungage: 'html',
                    source: '<!doctype html>\n' +
                            '<body>\n' +
                            '       すこぶる' +
                            '</body>'
                }
            },
            {
                type:COMPONENT.MARKDOWN,
                data:{
                    source: 'すごいです。'
                }
            },
        ]
    }
];

//nodeData3の持つページ群
nodePages[3] = [
    {
        title:'Mithril.jsとは？',
        contents:[
            {
                type:COMPONENT.MARKDOWN,
                data:{
                    source: 'Mithril.jsは、VirtualDOMの技術を利用した、クライアントサイドのJavascriptフレームワークです。' +
                            'SPAをはじめとしたWebアプリケーションの作成を強力にサポートします。' +
                            'Mithrilはその他のVirtual DOMフレームワークと比較して、APIの数が少なく動作が高速という点が勝っています。' +
                            '\n> 余計な機能がないのでファイルサイズも軽量で、他の様々なライブラリやコンポーネントとの統合も容易です。'
                }
            },
            {
                type:COMPONENT.HIGHLIGHT,
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
                type:COMPONENT.MARKDOWN,
                data:{
                    source: 'この文章は、コンポーネントの間に配置されています。'
                }
            },
            {
                type:COMPONENT.PLAYGROUND,
                data:{
                    htmlsource: '<h1>Hello World!</h1>',
                    csssource:  'h1 {\n' +
                                '   color: #f00;\n' +
                                '}',
                    jssource:   'document.querySelector("h1").style.backgroundColor = "#ffff00"'
                }
            },
            {
                type:COMPONENT.MARKDOWN,
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
                type:COMPONENT.MARKDOWN,
                data:{
                    source: 'テスト'
                }
            },
            {
                type:COMPONENT.MARKDOWN,
                data:{
                    source: 'てすと'
                }
            }
        ]
    }
];

//nodeData4の持つページ群
nodePages[4] = [
    {
        title:'Test.js',
        contents:[
            {
                type:COMPONENT.MARKDOWN,
                data:'テスト'
            },
            {
                type:COMPONENT.MARKDOWN,
                data:'てすと'
            }
        ]
    }
];