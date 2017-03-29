class TreeCMSManager {
    constructor(){
        
    }
}

class TreeCMS {
    constructor(){
        window.onload = function(){
            console.log("cms javascript");
            new TreeCMSManager();
        }
    }
}

new TreeCMS();