$(document).ready(() => {

    setTimeout(() => {

        $('.step1').addClass('show');

    }, 500);

    // sprawdzanie pierwszego kroku
    $('.step1 input').on('keyup', function(){
        validateFirstStep();
    });

    $('.step5 input').on('keyup', function(){
        validateFifthStep();
    });


    $(document).on('keyup keypress',function(e) {

        if(e.which == 13){

            $('.step1').hasClass('show') ? validateFirstStep() ? nextStep('.step1', '.step2') : showError('.step1') : false;

            $('.step4').hasClass('show') && !e.shiftKey ? validateFourthStep() ? nextStep('.step4', '.step5') : showError('.step4') : false;

            $('.step5').hasClass('show') ? validateFifthStep() && validateEmailAddress($('.step5 input').val()) ? nextStep('.step5', '.step6') : showError('.step5') : false;

            $('.step6').hasClass('show') && e.ctrlKey ? validateSixthStep() ? submitForm() : showError('.step6') : false;

        }

    });

    $('.step4 textarea').on('keyup keypress',function(e){

        const keyCode = e.keyCode || e.which;

        if(keyCode == 13 && !e.shiftKey){

            e.preventDefault();

            $('.step4').hasClass('show') && validateFourthStep() ? nextStep('.step4', '.step5') : showError('.step4');
            
            return false;

        } else {

            $(this).css('height', "46px");
            $(this).css('height', this.scrollHeight+2+"px");

        }

        validateFourthStep();

    });


    // po zaznaczeniu radio - nastepny krok
    $('.step2 .input-radio label').on('click', () => !nextStep('.step2', '.step3'));

    $('.step6 .input-radio input').on('change', () => validateSixthStep() ? showFooter('.step6') && hideError('.step6') : showError('.step6') && hideFooter('.step6'));

    $('.input-checkbox input').on('change', function(){

        if($('.step3').hasClass('show')) validateThirdStep() ? showFooter('.step3') : hideFooter('.step3');

    });
    
    //przypisanie eventu przycisku stopki
    $('.step-footer button').on('click', function(){

        if($('.step1').hasClass('show') && validateFirstStep()) nextStep('.step1', '.step2');

        if($('.step3').hasClass('show') && validateThirdStep()) nextStep('.step3', '.step4');

        if($('.step4').hasClass('show') && validateFourthStep()) nextStep('.step4', '.step5');

        $('.step5').hasClass('show') && validateFifthStep() && validateEmailAddress() ? nextStep('.step5','.step6') : false;

        if($('.step6').hasClass('show') && validateSixthStep()) submitForm();


    });

});

const validateFirstStep = () => {

    if($('.step1 input').val().trim() != ''){

        // usuniecie errora przy wprowadzeniu pierwszej litery
        hideError('.step1');

        // uzupelnienie imienia w pozostalych krokach
        $('.typed-name').text($('.step1 input').val());

        // pojawienie sie stopki przy wprowadzeniu pierwszej litery
        showFooter('.step1');

        return true;

    } else {

        // usuniecie stopki jesli nie ma nic wpisane
        hideFooter('.step1');

        // usuniecie imienia jesli nie ma nic wpisane
        $('.typed-name').text('____');

        return false;

    }
    
}

const validateSecondStep = () => $('.step2 input[type=radio]').filter(':checked').length

const validateThirdStep = () => {

    // sprawdzanie czy jest ktorys checkbox zaznaczony
    let allowed = false;
    
    $('.input-checkbox input').each(function(){

        if($(this).prop('checked') == true) allowed = true;

    });

    return allowed;

}

const validateFourthStep = () => {

    if($('.step4 textarea').val().trim() != ''){

        // usuniecie errora przy wprowadzeniu pierwszej litery
        hideError('.step4');

        // pojawienie sie stopki przy wprowadzeniu pierwszej litery
        showFooter('.step4');

        return true;

    } else {

        // usuniecie stopki jesli nie ma nic wpisane
        hideFooter('.step4');

        return false;

    }
    
}

const validateFifthStep = () => {

    if($('.step5 input').val().trim() != ''){

        // usuniecie errora przy wprowadzeniu pierwszej litery
        hideError('.step5');

        // pojawienie sie stopki przy wprowadzeniu pierwszej litery
        showFooter('.step5');

        return true;

    } else {

        // usuniecie stopki jesli nie ma nic wpisane
        hideFooter('.step5');

        return false;

    }
    
}

const validateEmailAddress = (email) => {

    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const valid = re.test(String($('.step5 input').val()).toLowerCase());

    if(!valid) {
        hideFooter('.step5');
        showError('.step5');
    }

    return valid;
    

}

const validateSixthStep = () => $('#input_rule_1')[0].checked;

const showError = (step) => !$(step).find('.step-error').hasClass('show') ? $(step).find('.step-error').addClass('show') : false;

const hideError = (step) => $(step).find('.step-error').hasClass('show') ? $(step).find('.step-error').removeClass('show') : false;

const showFooter = (step) => !$(step).find('.step-footer').hasClass('show') ? $(step).find('.step-footer').addClass('show') : false;

const hideFooter = (step) => $(step).find('.step-footer').hasClass('show') ? $(step).find('.step-footer').removeClass('show') : false;

const nextStep = (hide, show) => {

    $(hide).addClass('hide').removeClass('show');

    $(show).removeClass('hide').addClass('show');

    return false;

}

const validateAll = () => {

    if(!validateFirstStep()) return nextStep('.step6', '.step1');

    if(!validateFirstStep()) return nextStep('.step6', '.step2');

    if(!validateThirdStep())  return nextStep('.step6', '.step3');

    if(!validateFourthStep()) return nextStep('.step6', '.step4');

    if(!validateFifthStep()) return nextStep('.step6', '.step5');

    return true;

}

const submitForm = () => validateAll() ? sendEmail() : false;

const sendEmail = () => {

    $.ajax({
        
        url: window.location.pathname,
        method: 'POST',
        data: {
            form: $('#hello form').serializeArray()
        }

    }).then((resp) => {

        if(resp.success && !resp.error) window.location.href = '/thank-you';
        else window.location.href = '/error';
 
    }).catch(err => {

        window.location.href = '/error';

    }); 

}