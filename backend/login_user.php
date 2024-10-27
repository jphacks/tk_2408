<?php

class UserLogin
{
    function get_pdo()
    {
        // データベース接続情報を適切に設定してください
        $pdo = new PDO('mysql:host=mysql309.phy.lolipop.lan;dbname=LAA1615378-jphacks;charset=utf8', 'LAA1615378', 'jphacks');
        return $pdo;
    }

    function login($mail, $pass)
    {
        try {
            $pdo = $this->get_pdo();
            
            // ユーザーが存在するか確認
            $sql = "SELECT * FROM Users WHERE mail = :mail AND pass = :pass;";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(['mail' => $mail, 'pass' => $pass]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                // ユーザーが存在する場合、user_idを返す
                return ['login' => true, 'create' => false, 'user_id' => $user['user_id']];
            } else {
                // ユーザーが存在しない場合、新規作成
                $insert_sql = "INSERT INTO Users (mail, pass) VALUES (:mail, :pass);";
                $insert_stmt = $pdo->prepare($insert_sql);
                $insert_stmt->execute(['mail' => $mail, 'pass' => $pass]);
                
                // 新しく作成したユーザーのIDを取得
                $user_id = $pdo->lastInsertId();
                
                return ['login' => false, 'create' => true, 'user_id' => $user_id];
            }

        } catch (PDOException $e) {
            return ['login' => false, 'create' => false, 'error' => $e->getMessage()];
        } catch (Error $e) {
            return ['login' => false, 'create' => false, 'error' => $e->getMessage()];
        }
    }
}

?>
