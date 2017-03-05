import '../scss/main.scss';

class Greeter {
    constructor(public greeting: string) { }
    greet() {
        console.log(this.greeting);
    }
};

const greeter = new Greeter('Hello, my friend! Checkout your first ts app!!!');
greeter.greet();
