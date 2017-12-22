document.addEventListener('DOMContentLoaded', function() {
  //Basic Info Variables:
  const basicInfoFieldset = document.getElementsByTagName('fieldset')[0];
  const nameField = document.getElementById('name');
  const emailField = document.getElementById('mail');
  const jobRoleMenu = document.getElementById('title');
  const otherOption = jobRoleMenu.lastElementChild;
  const otherJobRoleField = document.getElementById('other-title');

  //t-Shirt Menu Variables:
  const tShirtDesignMenu = document.getElementById('design');
  const tShirtColorDiv = document.getElementById('colors-js-puns');
  const tShirtColorMenu = document.getElementById('color');
  const tShirtColors = tShirtColorMenu.children;
  const $jsPunsColors = $('#color option:contains("JS Puns")');
  const $loveJsColors = $('#color option:contains("I")');

  //Activity Registration Variables:
  const $activityRegistrationFieldset = $('.activities');
  const $activityLegend = $('.activities legend')[0];
  const $activityCheckboxes = $('.activities input[type="checkbox"]');
  const $mainConferenceLabel = $('input[name="all"]').parent();

  //Payment Option Variables:
  const paymentOptionMenu = document.querySelector('#payment');
  const paymentOptions = paymentOptionMenu.children;
  const creditCardDiv = document.querySelector('#credit-card');
  const $creditCardNumber = $('#cc-num')[0];
  const $zipCode = $('#zip')[0];
  const $cvv = $('#cvv')[0];
  const $payPalDiv = $('div.container form fieldset div p')[0];
  const $bitCoinDiv = $('div.container form fieldset div p')[1];

  //Submit Button Variable:
  const $submitButton = $('button[type="submit"]');

  //Hides any number of individual elements passed as arguments.
  function hideElements(...elements) {
    for(let i = 0; i < elements.length; i++)
      elements[i].style.display = 'none';
  }

  //Hides the elements of the collection passed as the argument.
  function hideCollectionElements(collection) {
    for(let i = 0; i < collection.length; i++)
      hideElements(collection[i]);
  }

  //Shows any number of elements passed as arguments.
  function showElements(...elements) {
    for(let i = 0; i < elements.length; i++)
    elements[i].style.display = '';
  }

  //Shows the elements of the collection passed as the argument.
  function showCollectionElements(collection) {
    for(let i = 0; i < collection.length; i++)
      showElements(collection[i]);
  }

  //On page load, sets the name field to autofocus, hides the t-shirt color menu and the 'other' job
  //role field, and displays the proper payment option.
  window.onload = function() {
    nameField.focus();
    hideElements(tShirtColorDiv, otherJobRoleField);
    displayPaymentOption(creditCardDiv, $payPalDiv, $bitCoinDiv);
  }

  //Job Role Menu Event listener: Hides the job role text field and then displays it if 'other' is selected.
  jobRoleMenu.addEventListener('change', function() {
    hideElements(otherJobRoleField);
    if(jobRoleMenu.value === 'other')
      showElements(otherJobRoleField);
  });

  //t-Shirt Menu Event Listener: Calls colorMatch().
  tShirtDesignMenu.addEventListener('input', function() {
    colorMatch();
  });

  //Displays the appropriate tshirt color options once a design is selected.
  function colorMatch() {
    if(tShirtDesignMenu.value === 'js puns') {
      $jsPunsColors[0].selected = true;
      showElements(tShirtColorDiv);
      showCollectionElements($jsPunsColors);
      hideCollectionElements($loveJsColors);
    } else if (tShirtDesignMenu.value === 'heart js'){
      $loveJsColors[0].selected = true;
      showElements(tShirtColorDiv);
      showCollectionElements($loveJsColors);
      hideCollectionElements($jsPunsColors);
    } else
      hideElements(tShirtColorDiv);
  }

  /*
  Activity Registration Event Listener: Resets activity legend color and removes error paragraph.
  Calculates and displays total price of events selected. Checks for conflicts and disables conflicting
  events based on date and start time.
  */
  $activityRegistrationFieldset.on('change', 'label input', function() {
      $('p.invalid-checkbox').remove();
      $activityLegend.style.color = '';
      $activityLegend.style.textShadow = '';
      const target = $(this)[0];
      const eventDetails = $(this).parent().text();
      const eventDay = getEventDay(eventDetails);
      const totalPrice = calculateTotal();
      const eventStartTime = getStartTime(eventDetails);
      showTotalPrice(totalPrice);
      if(target.checked)
        disableCheckboxes(eventDay, eventStartTime);
      if(!target.checked)
        enableCheckboxes(eventDay, eventStartTime);
  });

  //Calculates the total event price using a regex to store the price numbes into a variable and
  //ingore the date numbers. Then adds each event price to the total price variable and returns it.
  function calculateTotal() {
    let totalPrice = 0;
    const pattern = /(\d+(?!a)(?!p)(?!2))/;
    for(let i = 0; i < $activityCheckboxes.length; i++) {
      const eventPrice = $activityCheckboxes[i].parentNode.textContent.match(pattern)[0];
      if($activityCheckboxes[i].checked)
        totalPrice += parseInt(eventPrice);
    }
    return totalPrice;
  }

  //Returns event day based on regex.
  function getEventDay(eventDetails) {
    const pattern = '/Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday/';
    if(eventDetails.match(pattern) !== null)
      return eventDetails.match(pattern)[0];
  }

  //Returns start time based on regex.
  function getStartTime(eventDetails) {
    if(eventDetails.match(/[49]/) !== null)
      return eventDetails.match(/[49]/)[0];
  }

  //Enables checkboxes and resets their color if they match the event day and time passed as arguments.
  function enableCheckboxes(eventDay, startTime) {
    for(let i = 0; i < $activityCheckboxes.length; i++) {
      if($activityCheckboxes[i].parentNode.textContent.includes(startTime) &&
         $activityCheckboxes[i].parentNode.textContent.includes(eventDay)) {
            $activityCheckboxes[i].disabled = false;
            $activityCheckboxes[i].parentNode.style.color = '';
      }
    }
  }

  //Disables checkboxes and sets their color to grey if they match the event day and time passed as arguments.
  function disableCheckboxes(eventDay, startTime) {
    for(let i = 0; i < $activityCheckboxes.length; i++) {
      if($activityCheckboxes[i].parentNode.textContent.includes(startTime) &&
         $activityCheckboxes[i].parentNode.textContent.includes(eventDay) &&
         !$activityCheckboxes[i].checked) {
            $activityCheckboxes[i].disabled = true;
            $activityCheckboxes[i].parentNode.style.color = 'grey';
        }
    }
  }

  //Clears previous event-price total. Creates a new event price paragraph and
  //appens it to the activity registration field.
  function showTotalPrice(totalPrice) {
    if($('.total-event-price'))
      $('.total-event-price').remove();
    const p = document.createElement('p');
    p.className = 'total-event-price';
    p.textContent = 'Total: $' + parseInt(totalPrice);
    $activityRegistrationFieldset.append(p);
  }

  //Payment option menu event listener: Calls displayPaymentOption with the appropriate
  //arguments based on which payment option is selected.
  paymentOptionMenu.addEventListener('change', function() {
    if(paymentOptionMenu.value === "select_method" ||
       paymentOptionMenu.value === "credit card")
        displayPaymentOption(creditCardDiv, $payPalDiv, $bitCoinDiv);
    else if (paymentOptionMenu.value === "paypal")
        displayPaymentOption($payPalDiv, creditCardDiv, $bitCoinDiv);
    else
        displayPaymentOption($bitCoinDiv, $payPalDiv, creditCardDiv);
  });

  //Displays payment option based on method selected, and hides the other options.
  function displayPaymentOption(optionToDisplay, optiontoHideOne, optionToHideTwo) {
    optionToDisplay.style.display = '';
    hideElements(optiontoHideOne, optionToHideTwo);
  }

  //Creates and returns an error element based on the element and error message passed as arguments.
  function createErrorElement(element, errorMessage, className) {
    const errorElement = document.createElement(element);
    errorElement.className = className;
    errorElement.textContent = errorMessage;
    errorElement.style.color = '#cc0000';
    errorElement.style.fontWeight = 'bold';
    errorElement.style.textShadow =
      '-.5px -.5px 0 #000',
  		'.5px -.5px 0 #000',
  		'-.5px .5px 0 #000',
  		'.5px .5px 0 #000';
    return errorElement;
  }

  //Transforms existing element into an apparent error element.
  function errorizeElement(element, placeholderText){
    element.placeholder = placeholderText;
    element.style.border = '2px solid #cc0000';
    element.previousElementSibling.style.color = '#cc0000';
    element.previousElementSibling.style.fontWeight = 'bold';
    element.previousElementSibling.style.textShadow =
      '-.5px -.5px 0 #000',
  		'.5px -.5px 0 #000',
  		'-.5px .5px 0 #000',
  		'.5px .5px 0 #000';
  }

  /*
  Email field event listener: Resets field and removes error message. Upon each new input,
  checks user input against pattern and displays an error message as long as input is not
  in an email format. If user input matches the pattern, no error message is set.
  */
  emailField.addEventListener('input', function() {
    resetInputField(emailField);
    $('p.invalid-input').remove();
      emailField.pattern = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9._-]+[.][a-zA-Z]{2,5}$";
      if(emailField.value !== '' ||
         emailField.value !== null) {
        if(emailField.validity.patternMismatch) {
          emailField.setCustomValidity(' ');
          const p = createErrorElement('p', 'Please enter a valid email (e.g. anna@gmail.com)', 'invalid-input');
          p.style.margin = '-5px 20px 0 0';
          p.style.float = 'right';
          $(p).insertBefore(emailField.previousElementSibling);
          emailField.placeholder = 'anna@gmail.com';
          emailField.style.border = '2px solid #cc0000';
          emailField.previousElementSibling.style.color = '#cc0000';
          emailField.previousElementSibling.style.fontWeight = 'bold';
        } else {
            emailField.setCustomValidity('');
        }
    }
  });

  /*
  Submit button event listener: Removes any errors that exist. Creates an empty array literal to hold new errors
  and initializes a totalErrors variable to keep track of the number of errors. Checks for blank fields, improperly
  formatted fields and if at least one activites checkbox is checked and stores the results in error varibles.
  Pushes errors onto ErrorMessage array.
  */
  $submitButton.on('click', function() {
    $('.errors').remove();
    const errorMessages = [];
    let totalErrors = 0;
    const nameError = checkForBlankFields(nameField,
                                          'A name is required (e.g. Anna Banana)',
                                          'A name is required (e.g. Anna Banana)');
    const emailError = validateInputField(emailField,
                                          "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9._-]+[.][a-zA-Z]{2,5}$",
                                          'A valid email address is required (e.g. anna@gmail.com)',
                                          'A valid email address is required (e.g. anna@gmail.com)',
                                          'A valid email address is required (e.g. anna@gmail.com)',
                                          'A valid email address is required (e.g. anna@gmail.com)');
    const checkboxError = validateActivites();
    errorMessages.push(nameError, emailError, checkboxError);
    /*
    If credit card payment option is selected or no option is selected, validates credit card input fields.
    If an input field is blank or improperly formatted, stores appropriate error into error variable and
    pushes error onto the end of the errorMessage array.
    */
    if(paymentOptions[1].selected ||
       paymentOptions[0].selected) {
        const cardCardError = validateInputField($creditCardNumber,
                                                 '[0-9]{13,16}',
                                                 'A valid credit card number is required (e.g. 12345678912345)',
                                                 'Credit card number must contain only numbers and must be between 13 and 16 digits ' +
                                                 '(e.g. 12345678912345)',
                                                 'A valid credit card number is required',
                                                 'A valid credit card number is required');
        const zipCodeError = validateInputField($zipCode,
                                                '[0-9]{5}',
                                                'A valid zip code must be entered (e.g. 90210)',
                                                'Zip code must contain only numbers and must be 5 digits (e.g. 90210)',
                                                '90210',
                                                '90210');
        const cvvError = validateInputField($cvv,
                                            '[0-9]{3}',
                                            'A valid cvv must be entered (e.g. 123)',
                                            'cvv must contain only numbers and must be 3 digits (e.g. 123)',
                                            '123',
                                            '123');
        errorMessages.push(cardCardError, zipCodeError, cvvError);
   }
   /*
   Evaluates for any errors, and if present, an unordered list of error messages is created
   appended to an errorParagraph, and the errorParagraph is inserted before the basic info
   section of the form. Scrolls to the top of the page as long as there are errors so user
   can immediately see list of current errors.
   */
    const isError = evaluateErrors(errorMessages);
    if(isError) {
      const ul = document.createElement('ul');
      for(let i = 0; i < errorMessages.length; i++) {
        if(errorMessages[i]) {
          totalErrors++;
          const li = createErrorElement('li', errorMessages[i], '');
          ul.appendChild(li);
        }
      }
      const errorParagraph = createErrorElement('p', '*Please correct the following ' + totalErrors + ' error(s):', 'errors');
      errorParagraph.appendChild(ul);
      $(errorParagraph).insertBefore(basicInfoFieldset);
    }
    $(function() {
      $('html').scrollTop(0);
    });
  });

  //Loops through the errorArray passed as its argument and returns true if an error is present.
  function evaluateErrors(errorArray){
    for(let i = 0; i < errorArray.length; i++) {
      if(errorArray[i] !== '')
        return true;
    }
  }

  //Checks an input field for content and format. If blank, returns an error message. If input does not
  //match pattern passed as argument, a separate error message is returned. Error fields are also made red,
  //bold, and given borders.
  function validateInputField(inputField, pattern, blankErrorMessage, formatErrorMessage, blankExampleText, formatExampleText) {
    resetInputField(inputField);
    inputField.pattern = pattern;
    if(inputField.value === null ||
       inputField.value === '') {
         inputField.setCustomValidity(' ');
         errorizeElement(inputField, blankExampleText);
         return blankErrorMessage;
    } else if(inputField.validity.patternMismatch) {
      inputField.setCustomValidity(' ');
      errorizeElement(inputField, formatExampleText);
      return formatErrorMessage;
    } else {
        inputField.setCustomValidity('');
        return '';
    }
  }

  //Checks if the input field passed as an argument is blank. If blank, formats the input as error.
  function checkForBlankFields(input, errorMessage, exampleText) {
    resetInputField(input);
    if(input.value === null ||
       input.value === '') {
         input.setCustomValidity(' ');
         errorizeElement(input, exampleText);
         return errorMessage;
    } else {
        input.setCustomValidity('');
        return '';
    }
  }

  //Resets input field so it no longer appears as a field in error.
  function resetInputField(input) {
    input.style.border = '';
    input.className = '';
    input.previousElementSibling.style.color = '';
    input.previousElementSibling.style.fontWeight = '';
    input.previousElementSibling.style.textShadow = '';
  }

  //Removes error message, and if no checkboxes are checked, creates and inserts an error message,
  //and formats activity legend as error. Also returns an error message if no boxes are checked.
  function validateActivites() {
    $('p.invalid-checkbox').remove();
    $activityLegend.style.color = '';
    $activityLegend.style.textShadow = '';
    let isChecked = checkForChecks();
    if(!isChecked) {
      $activityCheckboxes[0].setCustomValidity(' ');
      const p = createErrorElement('p', 'At least one activity must be selected', 'invalid-checkbox');
      p.style.marginTop = '-15px';
      $(p).insertBefore($mainConferenceLabel);
      $activityLegend.style.color = '#cc0000';
      $activityLegend.style.textShadow =
        '-.5px -.5px 0 #000',
    		'.5px -.5px 0 #000',
    		'-.5px .5px 0 #000',
    		'.5px .5px 0 #000';
      return 'At least one activity must be selected';
    } else {
        $activityCheckboxes[0].setCustomValidity('');
        return '';
    }
  }

  //Checks to see if at least one activity checkbox is checked and returns true or false.
  function checkForChecks () {
    for(let i = 0; i < $activityCheckboxes.length; i++) {
        if($activityCheckboxes[i].checked)
          return true;
    }
  }
});
