<?php

class LoginVtuber
{
    function get_pdo()
    {
        // データベース接続の詳細を設定
        $pdo = new PDO('mysql:host=mysql309.phy.lolipop.lan;dbname=LAA1615378-jphacks;charset=utf8', 'LAA1615378', 'jphacks');
        return $pdo;
    }

    public function login_vtuber($mail, $pass)
    {
        try {
            $pdo = $this->get_pdo();

            // メールとパスワードでチャンネルをチェック
            $sql = "SELECT * FROM Channel WHERE mail = :mail AND pass = :pass;";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(['mail' => $mail, 'pass' => $pass]);
            $channel = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($channel) {
                // チャンネルが存在する場合、channel_idを返す
                return [
                    'login' => true,
                    'channel_id' => $channel['channel_id']
                ];
            } else {

                return [
                    'login' => false,
                ];
            }
        } catch (PDOException $e) {
            return ['login' => false, 'create' => false, 'error' => $e->getMessage()];
        } catch (Error $e) {
            return ['login' => false, 'create' => false, 'error' => $e->getMessage()];
        }
    }
}

?>
