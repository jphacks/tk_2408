<?php

class GetUser
{
    function get_pdo()
    {
        // PDO接続設定
        $pdo = new PDO('mysql:host=mysql309.phy.lolipop.lan;dbname=LAA1615378-jphacks;charset=utf8', 'LAA1615378', 'jphacks');
        return $pdo;
    }

    function get_user($user_id)
    {
        try {
            $pdo = $this->get_pdo();

            // 指定されたuser_idのユーザー情報を取得するSQL
            $sql = "
                SELECT 
                    user_id,
                    google_id,
                    username,
                    display_language,
                    icon_url,
                    info,
                    gift_level,
                    mail
                FROM 
                    Users
                WHERE 
                    user_id = :user_id;
            ";

            $ps = $pdo->prepare($sql);
            $ps->bindValue(':user_id', $user_id, PDO::PARAM_INT);
            $ps->execute();

            // 結果を取得し、配列に変換
            $user_info = $ps->fetch(PDO::FETCH_ASSOC);

            // ユーザーが存在しない場合は適切なエラーを返す
            if (!$user_info) {
                return ['error' => 'User not found'];
            }

            // 結果を返す
            return $user_info;

        } catch (PDOException $e) {
            return ['error' => $e->getMessage()];
        } catch (Error $e) {
            return ['error' => $e->getMessage()];
        }
    }
}
?>
