<?php

class Validator
{
    public static function validateRequiredFields($data, $requiredFields)
    {
        $missingFields = [];

        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || trim($data[$field]) === '') {
                $missingFields[] = $field;
            }
        }

        return $missingFields;
    }

    public static function validateEmail($email)
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    public static function validatePhoneArray($phones)
    {
        if (!is_array($phones)) return false;

        foreach ($phones as $phone) {
            if (trim($phone) === '') return false;
        }

        return true;
    }
}
