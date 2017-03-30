export default class TAAutoSize {
    protected element:HTMLElement;
    protected elSelector:string;

    constructor(elementSelector:string){
        
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

        this.element.style.lineHeight = "20px";//init
        this.element.style.height = "20px";//init

        this.element.addEventListener("input",function(evt){
            if(this.scrollHeight > this.offsetHeight){   
                this.style.height = this.scrollHeight + "px";
            }else{
                var height,lineHeight;
                while (true){
                    height = Number(this.style.height.split("px")[0]);
                    lineHeight = Number(this.style.lineHeight.split("px")[0]);
                    this.style.height = height - lineHeight + "px"; 
                    if(this.scrollHeight > this.offsetHeight){
                        this.style.height = this.scrollHeight + "px";
                        break;
                    }
                }
            }
        });
    }
}