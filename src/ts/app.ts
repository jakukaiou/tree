import '../scss/main.scss';
import 'font-awesome-webpack-2';

class Greeter {
    constructor(public greeting: string) { }
    greet() {
        console.log(this.greeting);
    }
};

const greeter = new Greeter('Hello, my friend! Checkout your first ts app!');
greeter.greet();

window.onload = function(){
    let scrollPos = document.getElementById('tree-content-header').getBoundingClientRect().top;

    window.addEventListener('scroll' , ()=>{
        if (window.pageYOffset > scrollPos) {
            document.getElementById('tree-content-header').classList.add('is-fixed');
        }else {
            document.getElementById('tree-content-header').classList.remove('is-fixed');
        }
    }, false);

    document.querySelector('.tree-content-header #open').addEventListener('click',()=>{
        document.querySelector('.tree-node.main .modal').classList.add('is-active');
    });

    document.querySelector('.tree-node.main .modal .modal-background').addEventListener('click',()=>{
        document.querySelector('.tree-node.main .modal').classList.remove('is-active');
    });

    document.querySelector('.tree-node.main .modal .modal-close').addEventListener('click',()=>{
        document.querySelector('.tree-node.main .modal').classList.remove('is-active');
    });
};