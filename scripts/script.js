// Add an event listener to the hidden button
var hiddenButton = document.getElementById('hidden-button');
hiddenButton.addEventListener('click', showPinDisplay);

var overlay = document.getElementById("pin-overlay");
overlay.addEventListener("click", function () {
  closeElement();
});

// Fetch config.json file
var restaurantId;
fetch('config.json')
  .then(response => response.json())
  .then(data => {
    restaurantId = data.RESTAURANT.id;
  })
  .catch(error => {
    console.error('Error fetching config.json:', error);
  });

$(document).ready(function () {
  updateOrders();
  setInterval(function () {
    $.ajax({
      url: 'utils.php',
      type: 'POST',
      data: { functionName: 'getOrders',},
      success: function (data) {
        $('.container').html(data);
      },
      error: function () {
        console.log('Error occurred while fetching orders.');
      }
    });
  }, 60000); // Refresh every 60 seconds
});

function updateOrders() {  
  $.ajax({
  url: 'utils.php',
  type: 'POST',
  data: { functionName: 'getOrders',},
  success: function (data) {
    $('.container').html(data);
  },
  error: function () {
    console.log('Error occurred while fetching orders.');
  }
});
}

let pin = '';
function showPinDisplay() {
  overlay.style.display = 'block';

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
      checkPin(function (result) {
        if (result === true) {
          editOrder();
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

function checkPin(callback) {
  jQuery.ajax({
    type: "POST",
    url: 'utils.php',
    data: { functionName: 'checkPin', pin: pin },
    success: function (response) {
      try {
        responseData = JSON.parse(response);
        if (responseData.status == 200) {
          callback(true);
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

let enteredOrderID = '';
function editOrder() {
  closeElement();
  // Create the elements for the order editing display
  overlay.style.display = 'block';
  var orderEditContainer = document.createElement('div');
  orderEditContainer.classList.add("toClose");
  orderEditContainer.setAttribute("id", 'order-edit-container');

  var orderIdInput = document.createElement('input');
  orderIdInput.type = 'text';
  orderIdInput.placeholder = 'Enter Order ID';
  orderIdInput.classList.add('order-input');

  const padData = createNumpad();
  const numberPad = padData[0];
  const numberButtons = padData[1];

  numberButtons.forEach((number) => {
    number.addEventListener('click', () => {
      enteredOrderID += number.innerText;
      orderIdInput.value = enteredOrderID;
    });
  });

  const clearButton = document.createElement('div');
  clearButton.setAttribute('id', 'clear');
  clearButton.classList.add('clear-button');
  clearButton.innerText = 'Clear';

  clearButton.addEventListener('click', () => {
    enteredOrderID = '';
    orderIdInput.value = '';
  });

  var markDoneButton = document.createElement('div');
  markDoneButton.textContent = 'Mark as Done';
  markDoneButton.classList.add('enter-button');

  // Add event listener to the markDoneButton
  markDoneButton.addEventListener('click', function() {
    var orderId = orderIdInput.value;
    if (orderId.trim() !== '') {
      markAsFinished(orderId);
    } else {
      createNotification("Bitte gebe eine richtige Bestell-ID ein!", "red");
    }
  });

  // Append the elements to the orderContainer
  orderEditContainer.appendChild(orderIdInput);
  orderEditContainer.appendChild(numberPad);
  orderEditContainer.appendChild(clearButton);
  orderEditContainer.appendChild(markDoneButton);

  // Append the orderContainer to the body in the HTML
  document.body.appendChild(orderEditContainer);
}

function markAsFinished(orderId) {
  jQuery.ajax({
    type: "POST",
    url: 'utils.php',
    data: { functionName:'markAsFinished', orderId: orderId },
    success: function (response) {
      try {
        responseData = JSON.parse(response);
        if (responseData.status == 200) {
          createNotification("Bestellung wurde erfolgreich abgeschlossen!", "green");
          closeElement();
          updateOrders();
        } else {
          createNotification("Es ist ein Fehler aufgetreten!", "red");
        }
      } catch (error) {
        console.error("Couldn't parse response!");
        console.error(response);
      }
    },
    error: function (error) {
      console.error('Error occurred during markAsFinished:', error);
    }
  });
}

function closeElement() {
  const closeElements = document.getElementsByClassName("toClose");
  for (let i = 0; i < closeElements.length; i++) {
    closeElements[i].parentNode.removeChild(closeElements[i]);
  }
  pin = '';
  enteredOrderID = '';
  overlay.style.display = "none";
}

function createNotification(textContent, textColor) {
  var content = DOMPurify.sanitize(textContent);

  const notification = document.createElement('div');
  notification.textContent = content;
  notification.classList.add('notification');
  notification.classList.add('swipeup');

  if (textColor !== null) {
      notification.style.color = textColor; // Set the text color
  }

  document.body.appendChild(notification);

  // Remove notification after a delay
  setTimeout(() => {
      document.body.removeChild(notification);
  }, 2000);
}