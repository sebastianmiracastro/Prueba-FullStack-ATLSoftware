<?php

require_once __DIR__ . '/../models/Contact.php';
require_once __DIR__ . '/../models/Phone.php';
require_once __DIR__ . '/../utils/Validator.php';

class contactController
{
    private $db;
    private $contactModel;
    private $phoneModel;

    public function __construct($db)
    {
        $this->db = $db;
        $this->contactModel = new Contact($db);
        $this->phoneModel = new Phone($db);
    }

    // GET /contacts
    public function listContacts()
    {
        $contacts = $this->contactModel->getAll();

        // Agregar teléfonos a cada contacto
        foreach ($contacts as &$contact) {
            $contact['phones'] = $this->phoneModel->getPhonesByContact($contact['id']);
        }

        header('Content-Type: application/json');
        echo json_encode($contacts);
    }

    // POST /contacts
    public function createContact($data)
    {
        // Validar campos requeridos
        $missing = Validator::validateRequiredFields($data, ['first_name', 'last_name', 'email']);
        if (!empty($missing)) {
            http_response_code(400);
            echo json_encode(['error' => 'Faltan campos requeridos: ' . implode(', ', $missing)]);
            return;
        }

        // Validar email
        if (!Validator::validateEmail($data['email'])) {
            http_response_code(400);
            echo json_encode(['error' => 'El email no tiene un formato válido.']);
            return;
        }

        // Crear contacto
        $created = $this->contactModel->create($data['first_name'], $data['last_name'], $data['email']);

        if ($created) {
            $contactId = $this->db->lastInsertId();

            // Agregar teléfonos si existen
            if (!empty($data['phones'])) {
                if (Validator::validatePhoneArray($data['phones'])) {
                    $this->phoneModel->addPhones($contactId, $data['phones']);
                } else {
                    http_response_code(400);
                    echo json_encode(['error' => 'Formato inválido en la lista de teléfonos.']);
                    return;
                }
            }

            http_response_code(201);
            echo json_encode(['message' => 'Contacto creado exitosamente.']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error al crear el contacto.']);
        }
    }

    // DELETE /contacts/{id}
    public function deleteContact($id)
    {
        if (!$this->contactModel->exists($id)) {
            http_response_code(404);
            echo json_encode(['error' => 'Contacto no encontrado.']);
            return;
        }

        $deleted = $this->contactModel->delete($id);

        if ($deleted) {
            http_response_code(200);
            echo json_encode(['message' => 'Contacto eliminado correctamente.']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error al eliminar el contacto.']);
        }
    }
}
