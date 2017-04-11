export default class Editor {
    //エディターのっ展開先エレメント
    protected element:HTMLElement;

    //エディターのプレビューエレメント
    protected previewElement:HTMLElement;

    //エディターのベースエレメント
    protected editor:HTMLElement;

    //エディターのヘッダー部分
    protected editorHead:HTMLElement;

    //エディターのボディ部分
    protected editorBody:HTMLElement;

    //エディターのタイトル部分
    protected editorTitle:HTMLElement;

    //エディターのデリートパーツ
    protected editorDelete:HTMLElement;

    constructor(elementSelector:string, componentElementSelector:string,editorTitle:string) {
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
            this.previewElement.classList.add('tree-module');
            if(this.element === null) {
                    console.log('[ERROR] el-preview-target not found');
                    return;
             }
        }else {
            console.log('[ERROR] arg:el not set');
            return;
        }

        this.editor = document.createElement('div');
        this.editor.classList.add(editorTitle+'Editor');
        this.editor.classList.add('tree-editor');

        this.editorHead = document.createElement('div');
        this.editorHead.classList.add('editorHead');

        this.editorTitle = document.createElement('div');
        this.editorTitle.classList.add('editorTitle');
        this.editorTitle.innerHTML = editorTitle;

        this.editorDelete = document.createElement('a');
        this.editorDelete.classList.add('delete');

        this.editorBody = document.createElement('div');
    }


    protected createEditorHead(elements:Array<HTMLElement>){
        this.editorHead.appendChild(this.editorTitle);

        //ここでエディタ固有のエレメント追加処理を行う
        elements.forEach((value,index)=>{
            this.editorHead.appendChild(value);
        });

        this.editorHead.appendChild(this.editorDelete);
    }

    protected createEditorBody(elements:Array<HTMLElement>){
        //ここでエディタ固有のエレメント追加処理を行う
        elements.forEach((value,index)=>{
            this.editorBody.appendChild(value);
        });
    }

    protected createEditor(){
        this.editor.appendChild(this.editorHead);
        this.editor.appendChild(this.editorBody);

        this.element.appendChild(this.editor);
    }
}
