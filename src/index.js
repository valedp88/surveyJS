
import { ajaxCall, customEvents, deepFreeze, dispatchCustomEvent, mergeObjects, webStorage } from './modules/helpers';
import { options }          from './modules/options';
import { internals }        from './modules/internals';
import { submit, validationEnd } from './modules/listenerCallbacks';
import { buildSurvey }      from './modules/buildSurvey/buildSurvey';
import { populateAnswers }  from './modules/buildSurvey/populateAnswers';
import { destroy }          from './modules/destroy';

import Form from 'formjs-plugin';

const version = '3.0.0';

class Survey extends Form {

    constructor( formEl, optionsObj = {} ){
        if( !optionsObj.url || typeof optionsObj.url !== 'string' ){
            throw new Error('"options.url" is missing or not a string!');
        }

        const options = mergeObjects( {}, Survey.prototype.options, optionsObj );

        if( !webStorage().isAvailable ){
            options.useWebStorage = false;
        }

        // CREATE FORM INSTANCE FOR SURVEY
        super( formEl, options );
        const self = this;
        self.internals = internals;

        self.formEl.querySelector('[data-surveyjs-body]').insertAdjacentHTML( 'beforebegin', self.options.templates.loading );

        // CREATE SURVEY
        const retrieveSurvey = ajaxCall(self.options.url, self.options.initAjaxOptions)
            .then(response => {
                if( response.status.toLowerCase() !== 'success' ){
                    return Promise.reject(response);
                }
                return new Promise(resolve => {
                    if( response.data.questions && response.data.questions.length > 0 ){
                        buildSurvey(response.data, self.formEl, self.options, self.internals);
                        if( self.options.useWebStorage ){
                            populateAnswers(self.formEl, self.internals);
                        }
                        Object.defineProperty(self, 'data', {
                            value: deepFreeze(response.data)
                        });
                        self.formEl.addEventListener('fjs.field:validation', validationEnd);
                        self.formEl.addEventListener('fjs.form:submit', submit);
                        super.init().then(() => {
                            self.isInitialized = true;
                            self.formEl.closest('[data-surveyjs-wrapper]').classList.add('surveyjs-init-success');
                            resolve(response);
                        });
                    } else {
                        resolve(response);
                    }
                });
            })
            .finally(() => {
                const loadingBoxEl = self.formEl.querySelector('[data-surveyjs-loading]');
                if( loadingBoxEl ){
                    loadingBoxEl.parentNode.removeChild(loadingBoxEl);
                }
            });
        
        dispatchCustomEvent( self.formEl, customEvents.init, retrieveSurvey );
    }

    destroy(){
        destroy(this.formEl);
        super.destroy();
    }

    static setOptions( optionsObj ){
        Survey.prototype.options = mergeObjects({}, Survey.prototype.options, optionsObj);
    }

}

Survey.prototype.isInitialized = false;
Survey.prototype.options = options;
Survey.prototype.version = version;

export default Survey;
