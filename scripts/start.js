showPinDisplay();

let pin = '';
function showPinDisplay() {

  const pinContainer = document.createElement('div');
  pinContainer.setAttribute('id', 'pin-container');
  pinContainer.classList.add('toClose');

  const pinDisplayContainer = document.createElement('div');
  pinDisplayContainer.classList.add('pin-content');

  const pinDisplay = document.createElement('input');
  pinDisplay.setAttribute('type', 'password');
  pinDisplay.setAttribute('id', 'pin-display');
  pinDisplay.setAttribute('readonly', 'readonly');

  const padData = createNumpad();
  const numberPad = padData[0];
  const numberButtons = padData[1];

  numberButtons.forEach((number) => {
    number.addEventListener('click', () => {
      pin += number.innerText;
      pinDisplay.value = '*'.repeat(pin.length);
    });
  });

  const clearButton = document.createElement('div');
  clearButton.setAttribute('id', 'clear');
  clearButton.classList.add('clear-button');
  clearButton.innerText = 'Clear';

  const submitButton = document.createElement('div');
  submitButton.setAttribute('id', 'submit');
  submitButton.classList.add('enter-button');
  submitButton.innerText = 'Enter';

  pinDisplayContainer.appendChild(pinDisplay);
  pinDisplayContainer.appendChild(numberPad);
  pinDisplayContainer.appendChild(clearButton);
  pinDisplayContainer.appendChild(submitButton);

  pinContainer.appendChild(pinDisplayContainer);
  document.body.appendChild(pinContainer);

  clearButton.addEventListener('click', () => {
    pin = '';
    pinDisplay.value = '';
  });

  submitButton.addEventListener('click', () => {
    if (pin.length > 0) {
        checkLoginPin(function (result) {
        if (result === true) {
          
        } else {
          console.log("Wrong Pin");
        }
      });
    }
  });

}

function createNumpad() {
  const numberPad = document.createElement('div');
  numberPad.setAttribute('id', 'number-pad');
  const numberButtons = []; // Array to store number buttons

  for (let i = 1; i <= 9; i++) {
    const numberButton = document.createElement('div');
    numberButton.setAttribute('class', 'number');
    numberButton.innerText = i;
    numberPad.appendChild(numberButton);
    numberButtons.push(numberButton); // Add button to the array
  }

  const zeroNumber = document.createElement('div');
  zeroNumber.setAttribute('class', 'number');
  zeroNumber.setAttribute('id', 'zero-number');
  zeroNumber.innerText = 0;
  numberPad.appendChild(zeroNumber);
  numberButtons.push(zeroNumber); // Add button to the array

  return [numberPad, numberButtons];
}

function checkLoginPin(callback) {
    jQuery.ajax({
      type: "POST",
      url: 'utils.php',
      data: { functionName: 'checkLoginPin', loginPin: pin },
      success: function (response) {
        try {
          responseData = JSON.parse(response);
          if (responseData.status == 200) {
            callback(true);
            window.location.href = 'display.php'; // Redirect to display.php
          } else {
            callback(false);
          }
        } catch (error) {
          console.error("Couldn't parse response!");
          console.error(response);
        }
      },
      error: function (error) {
        console.error('Error occurred during PIN check:', error);
      }
    });
  }  