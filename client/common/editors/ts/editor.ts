export default class Editor {
    protected element:HTMLElement;
    protected previewElement:HTMLElement;

    constructor(elementSelector:string, componentElementSelector:string) {
        if(elementSelector) {
            this.element = <HTMLElement>document.querySelector(elementSelector);
            this.element.classList.add('tree-editor');
            if(this.element === null) {
                    console.log('[ERROR] el-target not found');
                    return;
             }
        }else {
            console.log('[ERROR] arg:el not set');
            return;
        }

        if(componentElementSelector) {
            this.previewElement = <HTMLElement>document.querySelector(componentElementSelector);
            this.previewElement.classList.add('tree-preview');
            if(this.element === null) {
                    console.log('[ERROR] el-preview-target not found');
                    return;
             }
        }else {
            console.log('[ERROR] arg:el not set');
            return;
        }
    }
}
