export default class TAAutoSize {
    protected element:HTMLElement;

    constructor(element:HTMLElement){

        this.element = element;
        this.element.style.lineHeight = "20px";//init
        this.element.style.height = "40px";//init

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