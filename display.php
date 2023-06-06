<!DOCTYPE html>
<html>

<head>
    <title>Orders</title>
    <link rel="shortcut Icon" href="https://cdn.row-hosting.de/BBT/Website/bb-logo.png">

    <link rel="stylesheet" type="text/css" href="css/styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Bree+Serif&display=swap" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dompurify@2.3.2/dist/purify.min.js"></script>
    <script src="scripts/script.js" defer></script>
</head>

<body>
    <?php
    session_start();
    if(isset($_SESSION["CORRECT_LOGIN"]) && $_SESSION["CORRECT_LOGIN"]) { 
    ?>
    <button id="hidden-button"></button>
    <div id="pin-overlay"></div>
    <div class="container">
        
    </div>
    <?php
    } else {
        echo("<h1> Error 401 <h1> <p1> You're not allowed to enter this area!<p1>");
    }
    ?>
</body>

</html>