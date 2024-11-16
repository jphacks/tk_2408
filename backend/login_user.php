<?php

class UserLogin
{
    function get_pdo()
    {
        // データベース接続情報を適切に設定してください
        $pdo = new PDO('mysql:host=mysql309.phy.lolipop.lan;dbname=LAA1615378-jphacks;charset=utf8', 'LAA1615378', 'jphacks');
        return $pdo;
    }

    public function upload_thumbnail($thumbnailFile)
    {
        error_reporting(E_ALL);
        ini_set('display_errors', 1);
        
        // サムネイル画像の保存先
        $thumbnail_dir = "../icon/";
        $thumbnail_target_file = $thumbnail_dir . basename($thumbnailFile["name"]);
        $uploadOk = 1;

        // サムネイル画像ファイルタイプの確認
        $thumbnailFileType = strtolower(pathinfo($thumbnail_target_file, PATHINFO_EXTENSION));
        if (!in_array($thumbnailFileType, ['jpg', 'jpeg', 'png', 'gif'])) {
            echo json_encode(["error" => "申し訳ありませんが、JPG、JPEG、PNG、およびGIFファイルのみが許可されています。"]);
            return false;
        }

        // サムネイル画像のアップロードを試みる
        if (move_uploaded_file($thumbnailFile["tmp_name"], $thumbnail_target_file)) {
            return "https://devesion.main.jp/jphacks/icon/" . basename($thumbnailFile["name"]); // 完全なURLを返す
        } else {
            echo json_encode(["error" => "申し訳ありませんが、サムネイル画像のアップロード中にエラーが発生しました。"]);
            return false;
        }
    }

    function login($user_name, $mail, $pass, $display_language, $info, $thumbnailFile = null)
{
    try {
        $pdo = $this->get_pdo();
        
        // ユーザーが存在するか確認
        $sql = "SELECT * FROM Users WHERE mail = :mail AND pass = :pass;";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['mail' => $mail, 'pass' => $pass]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            // ユーザーが存在する場合、user_idとdisplay_languageを返す
            return [
                'login' => true, 
                'create' => false, 
                'user_id' => $user['user_id'], 
                'display_language' => $user['display_language'], 
                'icon_url' => $user['icon_url']
            ];
        } else {
            // ユーザーが存在しない場合、新規作成

            // サムネイル画像のアップロード処理またはデフォルトアイコンの設定
            $icon_url = "default_icon.png"; // デフォルトのアイコンURL
            if ($thumbnailFile && isset($thumbnailFile['tmp_name']) && !empty($thumbnailFile['tmp_name'])) {
                $uploaded_icon_url = $this->upload_thumbnail($thumbnailFile);
                if ($uploaded_icon_url) {
                    $icon_url = $uploaded_icon_url;
                }
            }

            $insert_sql = "
                INSERT INTO Users 
                (username, display_language, icon_url, info, gift_level, mail, pass) 
                VALUES 
                (:username, :display_language, :icon_url, :info, :gift_level, :mail, :pass);
            ";
            $insert_stmt = $pdo->prepare($insert_sql);

            // デフォルト値を設定またはフロントからの値を使用
            $values = [
                'username' => $user_name, // デフォルトのユーザー名
                'display_language' => $display_language, // フロントから受け取る
                'icon_url' => $icon_url, // サムネイルのURLまたはデフォルト
                'info' => $info, // フロントから受け取る
                'gift_level' => 1, // 初期値1
                'mail' => $mail,
                'pass' => $pass
            ];

            $insert_stmt->execute($values);
            
            // 新しく作成したユーザーのIDを取得
            $user_id = $pdo->lastInsertId();
            
            return [
                'login' => false, 
                'create' => true, 
                'user_id' => $user_id, 
                'display_language' => $display_language, 
                'icon_url' => $icon_url
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
