<?php

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/controllers/contactController.php';

// Instancia de conexión a base de datos.
$database = new Database();
$db = $database->connect();

// Crear instancia del controlador
$controller = new contactController($db);

// Obtener método y URI
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$requestUri = rtrim($requestUri, '/');
$requestUri = str_replace('/prueba_atl_software/backend/index.php', '', $requestUri);


// Enrutamiento básico
switch ($method) {
    case 'GET':
        if ($requestUri === '/contacts') {
            $controller->listContacts();
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Ruta no encontrada']);
        }
        break;

    case 'POST':
        if ($requestUri === '/contacts') {
            $data = json_decode(file_get_contents("php://input"), true);
            $controller->createContact($data);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Ruta no encontrada']);
        }
        break;

    case 'DELETE':
        if (preg_match('/\/contacts\/(\d+)/', $requestUri, $matches)) {
            $id = (int) $matches[1];
            $controller->deleteContact($id);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'ID de contacto inválido en la URL']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método HTTP no soportado.s']);
        break;
}
