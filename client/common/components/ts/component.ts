export default class TreeComponent {
    protected element:HTMLElement;
    protected elSelector:string;

    constructor(elementSelector:string,argObj:Object) {
        if(elementSelector) {
            this.element = <HTMLElement>document.querySelector(elementSelector);
            if(this.element == null) {
                    console.log('[ERROR] el-target not found');
                    return;
             }
        }else {
            console.log('[ERROR] arg:el not set');
            return;
        }
    }
}
