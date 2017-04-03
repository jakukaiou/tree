import * as marked from 'marked';

// my modules
import TAAutoSize from '../../common/utilities/autosize';

import PlayGround from '../../common/components/ts/playground';
import Highlight from '../../common/components/ts/ace-highlight';

class TreeCMSManager {
    constructor(){
        let playground = new PlayGround('#component-1',{});

        new TAAutoSize('#ta');
        new TAAutoSize('#ta2');
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