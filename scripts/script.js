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

  $(document).ready(function() {
    setInterval(function() {
        $.ajax({
            url: 'get_orders.php',
            type: 'GET',
            success: function(data) {
                $('.container').html(data);
            },
            error: function() {
                console.log('Error occurred while fetching orders.');
            }
        });
    }, 5000); // Refresh every 5 seconds
});