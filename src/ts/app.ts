import '../scss/main.scss';
import 'font-awesome-webpack-2';

// my modules
import TreeComponent from './components/component';
import PlayGround from './components/playground';
import Highlight from './components/ace-highlight';

class TreeApplication {
    
}

window.onload = function(){
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

    let highlight = new Highlight('#aceedit',{
        laungage: 'html',
        source: '<!doctype html>\n' +
                '<body>\n' +
                '   <script src="//unpkg.com/mithril/mithril.js"></script>\n' +
                '       <script>\n' +
                '       var root = document.body\n' +
                '       // your code goes here!\n' +
                '       </script>\n' +
                '</body>'
    });

    let playground = new PlayGround('#playGround',{
        htmlsource: '<h1>Hello World!</h1>',
        csssource:  'h1 {\n' +
                    '   color: #f00;\n' +
                    '}',
        jssource:   'console.log("Hello World");'
    });
};
