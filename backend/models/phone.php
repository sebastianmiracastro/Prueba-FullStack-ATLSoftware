<?php 

class Phone{
    private $conn;
    private $table = 'phones';

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function addPhones($contactId, $phones) {
        $query = "INSERT INTO {$this->table} (contact_id, phone_number) VALUES (:contact_id, :phone_number)";
        $stmt = $this->conn->prepare($query);

        foreach ($phones as $phone) {
            $stmt->bindParam(':contact_id', $contactId);
            $stmt->bindParam(':phone_number', $phone);
            $stmt->execute();
        }

        return true;
    }

    public function getPhonesByContact($contactId) {
        $query = "SELECT phone_number FROM {$this->table} WHERE contact_id = :contact_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':contact_id', $contactId);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }
}