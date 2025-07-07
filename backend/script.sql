CREATE DATABASE prueba_atl_software;
USE prueba_atl_software;

CREATE TABLE contacts(
	id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE phones(
	id INT PRIMARY KEY AUTO_INCREMENT,
    contact_id INT NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);