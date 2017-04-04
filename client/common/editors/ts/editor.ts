export default class Editor {
    protected element:HTMLElement;

    constructor(elementSelector:string) {
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
