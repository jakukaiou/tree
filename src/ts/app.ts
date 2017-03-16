//TODO 1ノートのデータ渡し実装とルーティング実装
/// <reference path="../../node_modules/@types/lodash/index.d.ts" />
/// <reference path="../../node_modules/@types/marked/index.d.ts"/>

import '../scss/main.scss';
import 'font-awesome-webpack-2';
import * as m from 'mithril';
import * as _ from 'lodash';
import * as marked from 'marked';

// my modules
import TreeComponent from './components/component';
import PlayGround from './components/playground';
import Highlight from './components/ace-highlight';

// 親ノードと子ノードを表す列挙
enum SUB {
    PARENT,
    CHILD
}

//コンポーネントの種類を表す列挙
enum COMPONENT {
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
            window.scrollTo(0,0);
        }

        this.view = (vnode)=> {
        return  [m('nav.nav.tree-nav', [
                    m('.nav-left', [
                        m('a.nav-item.tree-title', 'Tree.io')
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
    constructor() {
        super();

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
                                        m('li', [m('a', 'Mithril.jsとは？')]),
                                        m('li', [
                                            m('a', 'Mithril.jsのビューモデル'),
                                            m('ul', [
                                                m('li', 'In fermentum leo eu lectus mollis, quis dictum mi aliquet.'),
                                                m('li', 'Morbi eu nulla lobortis, lobortis est in, fringilla felis.')
                                            ])
                                        ]),
                                        m('li', 'Integer in volutpat libero.'),
                                        m('li', 'Donec a diam tellus.')
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

    constructor(nodeTitle:string,pageTitles:Array<string>,pageNumber:number) {
        super();

        this.oncreate = (vnode)=> {
            //メインヘッダーのスクロール追従
            let scrollPos = document.getElementById('tree-content-header').getBoundingClientRect().top;

            window.addEventListener('scroll' , ()=> {
                if (window.pageYOffset > scrollPos) {
                    document.getElementById('tree-content-header').classList.add('is-fixed');
                }else {
                    document.getElementById('tree-content-header').classList.remove('is-fixed');
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
                                m('a.tree-content-header_prev[id="open"]', [
                                    m('i.fa.fa-angle-left[aria-hidden="true]')
                                ]),
                                m('a.tree-content-header_next[id="open]', [
                                    m('i.fa.fa-angle-right[aria-hidden="true]')
                                ])
                            ])
                        ])
                    ]),
                    m(new TreeMainNodeModal())
                    ];
        };
    }
}

class TreeComponentVnode extends ComponentBasic {

    // TODO:色々なコンポーネントに対応させる
    constructor(data:Object) {
        super();
        this.oncreate = (vnode)=> {
            switch(data['type']) {
                case COMPONENT.HIGHLIGHT: {
                    let highlight = new Highlight('#'+data['id'],data['data']);
                    break;
                }
                case COMPONENT.PLAYGROUND: {
                    let playground = new PlayGround('#'+data['id'],data['data']);
                    break;
                }
            }
        };

        this.view = (vnode)=> {
            switch(data['type']) {
                case COMPONENT.HIGHLIGHT: {
                    return [m('div.tree-ace-module.highlight[id="' + data['id'] + '"]')];
                }
                case COMPONENT.PLAYGROUND: {
                    return [m('div.tree-ace-module.playground[id="' + data['id'] + '"]')];
                }
            }
        };
    }
}

class TreeMainNodeContent extends ComponentBasic {
    private contentArray:Array<any>;

    constructor(contentArray:Array<any>,pageTitle:string) {
        super();

        let makeContentVnode = (content:any)=> {
            if(typeof(content) === 'string') {
                return m('div',m.trust(marked(content)));
            }else if(typeof(content) === 'object') {
                return m(new TreeComponentVnode(content));
            }
        };

        this.contentArray = contentArray;

        this.view = (vnode)=> {
            return [m('div.content.tree-content',[
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
                            m(new TreeMainNodeHeader(nodeData[nodeID]['title'],nodePageTitles,nodePage)),
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
            return m('a.tag.is-black',{href:'#!tree/'+tagId+'/0'},nodeData[tagId]['title']);
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

class TreeRoot extends ComponentBasic {
    constructor() {
        super();

        this.view = (vnode)=> {
            console.log(vnode.attrs);

            return [m(new TreeHeader()),
                    m(new TreeLink()),
                    m(new TreeSubNode(SUB.PARENT,nodeData[vnode.attrs['id']]['prev'])),
                    m(new TreeLink()),
                    m(new TreeMainNode(vnode.attrs['id'],vnode.attrs['page'])),
                    m(new TreeLink()),
                    m(new TreeSubNode(SUB.CHILD,nodeData[vnode.attrs['id']]['next'])),
                    m(new TreeLink())
            ];
        };
    }
}

class TreeApplication {

    constructor() {
        window.onload = function(){
            let root = document.body;
            //m.mount(root, new TreeRoot());
            m.route(root,'tree/3/0',{
                'tree/:id/:page':new TreeRoot(),
                'test':new TreeLink()
            });
        };
    }
}

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
            'この文章はテスト用の例文です。',
            {
                id:'aceedit',
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
            'この文章は末尾の文章です。',
        ]
    }
];

//nodeData2の持つページ群
nodePages[2] = [
    {
        title:'仮想のDOM',
        contents:[
            'Virtual DOMは',
            {
                id:'aceedit',
                type:COMPONENT.HIGHLIGHT,
                data:{
                    laungage: 'html',
                    source: '<!doctype html>\n' +
                            '<body>\n' +
                            '       すこぶる' +
                            '</body>'
                }
            },
            'すごいです。',
        ]
    }
];

//nodeData3の持つページ群
nodePages[3] = [
    {
        title:'Mithril.jsとは？',
        contents:[
            'Mithril.jsは、VirtualDOMの技術を利用した、クライアントサイドのJavascriptフレームワークです。' +
            'SPAをはじめとしたWebアプリケーションの作成を強力にサポートします。' +
            'Mithrilはその他のVirtual DOMフレームワークと比較して、APIの数が少なく動作が高速という点が勝っています。' +
            '余計な機能がないのでファイルサイズも軽量で、他の様々なライブラリやコンポーネントとの統合も容易です。',
            {
                id:'aceedit',
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
            'この文章は、コンポーネントのあいだに配置されています。',
            {
                id:'playground',
                type:COMPONENT.PLAYGROUND,
                data:{
                    htmlsource: '<h1>Hello World!</h1>',
                    csssource:  'h1 {\n' +
                                '   color: #f00;\n' +
                                '}',
                    jssource:   'console.log("Hello World");'
                }
            },
        ]
    },
    {
        title:'他VirtualDomライブラリとの差異',
        contents:[
            'テスト',
            'てすと'
        ]
    }
];

//nodeData4の持つページ群
nodePages[4] = [
    {
        title:'Test.js',
        contents:[
            'テスト',
            'てすと'
        ]
    }
];