<?php
function generateOrders() {
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

    return $groupedItems;
}

$groupedItems = generateOrders();

foreach ($groupedItems as $id => $itemsWithSameId) {
    echo '<div class="order">';
    echo '<div class="order-header">';
    echo '<div class="order-id">Bestell-ID: ' . $id . '</div>';
    echo '<div class="table-number">Tischnummer: ' . $itemsWithSameId[0]['tableNo'] . '</div>';
    echo '</div>';
    echo '<div class="order-body">';
    foreach ($itemsWithSameId as $item) {
        echo '<div class="item">';
        echo '<div class="item-name">' . $item['name'] . '</div>';
        echo '<div class="item-description">' . $item['description'] . '</div>';
        echo '<div class="item-price">' . number_format($item['price'], 2) . ' €</div>';
        echo '<div class="item-amount">Anzahl: ' . $item['amount'] . '</div>';
        echo '</div>';
    }
    echo '</div>';
    echo '<div class="order-bottom">';
    echo '<span class="total-label">Gesamtbetrag:</span>';
    echo '<span class="total-amount">' . number_format($itemsWithSameId[0]['total'], 2) . ' €</span>';
    echo '</div>';
    echo '</div>';
}
?>
