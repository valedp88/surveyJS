
export const populateAnswers = ( formEl, options, internals ) => {

    if( options.useLocalStorage ){
        const LS = localStorage.getObject( internals.localStorageName );
        if( LS ){

            const surveyContEl = formEl.closest('[data-surveyjs-container]');
            internals.localStorageArray = LS;
            LS.forEach(item => {
                var fieldFirst = surveyContEl.querySelector( '[name="' + item.field + '"]' ),
                    isRadioOrCheckbox = fieldFirst.matches('[type="radio"], [type="checkbox"]'),
                    fieldEl = ( isRadioOrCheckbox ? surveyContEl.querySelector( '[name="' + item.field + '"][value="' + item.value + '"]' ) : fieldFirst );
                
                if( isRadioOrCheckbox ){
                    fieldEl.checked = true;
                } else {
                    fieldEl.value = item.value;
                }
            });
            
        }
    } else { console.warn('LOCAL STORAGE IS NOT SUPPORTED!'); }

}
