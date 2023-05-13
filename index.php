<?php
$config = file_get_contents('config.json');
$data = json_decode($config, true);

$restaurantId = $data['RESTAURANT']['id'];
$API_KEY = $data['API'][6]['key'];
$ch = curl_init("localhost:3000/orders/unfinished?restaurant_id=" . $restaurantId);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
curl_setopt($ch, CURLOPT_HTTPHEADER, array('api-key: ' . $API_KEY));

$response = curl_exec($ch);

curl_close($ch);

$items = json_decode($response, true);

// Group items by ID
$groupedItems = [];
foreach ($items as $item) {
    $id = $item['orderId'];
    if (!isset($groupedItems[$id])) {
        $groupedItems[$id] = [];
    }
    $groupedItems[$id][] = $item;
}
ksort($groupedItems);
?>

<!DOCTYPE html>
<html>
<head>
    <title>Orders</title>
    <link rel="stylesheet" type="text/css" href="styles.css">
</head>
<body>
    <div class="container">
        <?php foreach ($groupedItems as $id => $itemsWithSameId): ?>
            <div class="order">
                <div class="order-header">Bestell-ID: <?php echo $id; ?></div>

                <div class="order-body">
                    <?php foreach ($itemsWithSameId as $item): ?>
                        <div class="item">
                            <div class="item-name"><?php echo $item['name']; ?></div>
                            <div class="item-description"><?php echo $item['description']; ?></div>
                            <div class="item-price"><?php echo number_format($item['price'], 2); ?> €</div>
                            <div class="item-amount">Anzahl: <?php echo $item['amount']; ?></div>
                        </div>
                    <?php endforeach; ?>
                </div>

                <div class="order-bottom">
                    <span class="total-label">Gesamtbetrag:</span>
                    <span class="total-amount"><?php echo number_format($itemsWithSameId[0]['total'], 2); ?> €</span>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</body>
</html>
