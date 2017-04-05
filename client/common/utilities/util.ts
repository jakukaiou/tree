export default class Util {
    static TAexpand(element:HTMLElement,size:number){
        element.style.lineHeight = size.toString() + "px";//init
        element.style.height = size.toString() + "px";

        element.addEventListener("input",function(evt){
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