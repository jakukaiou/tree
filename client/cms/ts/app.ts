import TAAutoSize from '../../common/utilities/autosize';

class TreeCMSManager {
    constructor(){
        new TAAutoSize('#ta');
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