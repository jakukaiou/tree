export enum COMPONENT {
    MARKDOWN,
    HIGHLIGHT,
    PLAYGROUND
}

export enum LANGUAGE {
    HTML,
    CSS,
    JAVASCRIPT,
    PHP,
    PYTHON,
    GOLANG,
    TYPESCRIPT,
    DOCKERFILE,
    CPP,
    CSHARP
}

export default class Util {
    public static COMPONENT = COMPONENT;
    public static LANGUAGE = LANGUAGE;

    public static TAexpand(element:HTMLElement,size:number){
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