<?php
// Allowed origins (CORS)
$allowedOrigins = array(
    'http://localhost:5173',
    'http://192.168.1.161:5173'
);

$origin = $_SERVER['HTTP_ORIGIN'];

// Check the origin and set the CORS header
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Include the database settings file
include 'db.php';

// Get the JSON data from the POST request and parse it
$jsonData = file_get_contents("php://input");
$data = json_decode($jsonData);

if ($data) {
    // Extract data fields
    $idCircle = $data->idCircle;
    $listsMonsters = $data->listsMonsters;
    $table = $data->table;

    // Initialize arrays to store the parameters and types
    $params = array();
    $types = '';

    // Add idCircle and listsMonsters to the parameters and types
    $params[] = $idCircle;
    $params[] = $listsMonsters;
    $types .= 'is';

    // Check if map is present and add it to the parameters and types
    if (property_exists($data, 'map')) {
        $map = $data->map;
        $params[] = $map;
        $types .= 's';
    }

    // Check if timePoint is present and add it to the parameters and types
    if (property_exists($data, 'timePoint')) {
        $timePoint = $data->timePoint;
        $params[] = $timePoint;
        $types .= 'i';
    }

    // Check if type is present and add it to the parameters and types
    if (property_exists($data, 'type')) {
        $type = $data->type;
        $params[] = $type;
        $types .= 's';
    }

    // Check if typeOfEdit is present and add it to the parameters and types
    if (property_exists($data, 'typeOfEdit')) {
        $typeOfEdit = json_encode($data->typeOfEdit); // Convert it to JSON
        $params[] = $typeOfEdit;
        $types .= 's';
    }

    // Build the SQL query
    $query = "INSERT INTO $table (idCircle, listsMonsters";

    // Add map, timePoint, type, and typeOfEdit to the query if they are present
    if (property_exists($data, 'map')) {
        $query .= ", map";
    }
    if (property_exists($data, 'timePoint')) {
        $query .= ", timePoint";
    }
    if (property_exists($data, 'type')) {
        $query .= ", type";
    }
    if (property_exists($data, 'typeOfEdit')) {
        $query .= ", typeOfEdit";
    }

    $query .= ") VALUES (";

    // Create placeholders for the values
    for ($i = 0; $i < count($params); $i++) {
        $query .= "?";
        if ($i < count($params) - 1) {
            $query .= ",";
        }
    }

    $query .= ")";
    
    $stmt = $conn->prepare($query);

    if ($stmt) {
        // Bind the parameters and their types dynamically
        $stmt->bind_param($types, ...$params);
        
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(array('message' => 'Data successfully inserted into the ' . $table . ' table'));
        } else {
            echo json_encode(array('error' => 'Error executing the query: ' . $stmt->error));
        }

        $stmt->close();
    } else {
        echo json_encode(array('error' => 'Error preparing the query: ' . $conn->error));
    }
} else {
    echo json_encode(array('error' => 'Invalid JSON data received'));
}

$conn->close();
