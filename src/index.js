
/**! surveyJS v2.0.0 | Valerio Di Punzio (@SimplySayHi) | https://www.valeriodipunzio.com/plugins/surveyJS/ | https://github.com/SimplySayHi/surveyJS | MIT license */

import { mergeObjects }         from './modules/helpers';
import { messages }             from './modules/messages';
import { options }              from './modules/options';

// CONSTRUCTOR FUNCTION & PUBLIC METHODS
import { constructorFn }        from './modules/constructor';
import { retrieveSurvey as init } from './modules/retrieveSurvey';
import { destroy }              from './modules/destroy';

const version = '2.0.0';

class Survey {

    constructor( formEl, optionsObj ){
        return constructorFn.call(this, formEl, optionsObj);
    }

    destroy(){
        destroy.call(this);
    }

    init(){
        return init.call(this);
    }
    
    static addLanguage( langString, langObject ){
        const langValue = langString.toLowerCase();
        this.prototype.messages[langValue] = mergeObjects({}, this.prototype.messages[langValue], langObject);
    }

    static setOptions( optionsObj ){
        this.prototype.options = mergeObjects({}, this.prototype.options, optionsObj);
    }

}

Survey.prototype.isInitialized = false;
Survey.prototype.messages = messages;
Survey.prototype.options = options;
Survey.prototype.version = version;

if( !window.Survey ){ window.Survey = Survey; }
if( !window.SurveyJS ) { window.SurveyJS = Survey; }