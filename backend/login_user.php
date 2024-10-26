<?php

class UserLogin
{
    function get_pdo()
    {
        // Replace this with your database connection details
        $pdo = new PDO('mysql:host=mysql309.phy.lolipop.lan;dbname=LAA1615378-jphacks;charset=utf8', 'LAA1615378', 'jphacks');
        return $pdo;
    }

    function login($mail, $pass)
    {
        try {
            $pdo = $this->get_pdo();
            
            // Check if the user exists
            $sql = "SELECT * FROM Users WHERE mail = :mail AND pass = :pass;";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(['mail' => $mail, 'pass' => $pass]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                // User exists
                return ['login' => true, 'create' => false];
            } else {
                // User does not exist, insert new record
                $insert_sql = "INSERT INTO Users (mail, pass) VALUES (:mail, :pass);";
                $insert_stmt = $pdo->prepare($insert_sql);
                $insert_stmt->execute(['mail' => $mail, 'pass' => $pass]);
                
                return ['login' => false, 'create' => true];
            }

        } catch (PDOException $e) {
            return ['login' => false, 'create' => false];
        } catch (Error $e) {
            return ['login' => false, 'create' => false];
        }
    }
}

?>
