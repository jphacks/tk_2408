<?php

class CreateVtuber
{
    function get_pdo()
    {
        // データベース接続の詳細を設定
        $pdo = new PDO('mysql:host=mysql309.phy.lolipop.lan;dbname=LAA1615378-jphacks;charset=utf8', 'LAA1615378', 'jphacks');
        return $pdo;
    }

    public function upload_banner($banner)
    {
        error_reporting(E_ALL);
        ini_set('display_errors', 1);
        
        // サムネイル画像の保存先
        $banner_dir = "../banner/";
        $banner_target_file = $banner_dir . basename($banner["name"]);
        $uploadOk = 1;

        // サムネイル画像ファイルタイプの確認
        $bannerFileType = strtolower(pathinfo($banner_target_file, PATHINFO_EXTENSION));
        if (!in_array($bannerFileType, ['jpg', 'jpeg', 'png', 'gif'])) {
            echo json_encode(["error" => "申し訳ありませんが、JPG、JPEG、PNG、およびGIFファイルのみが許可されています。"]);
            return false;
        }

        // サムネイル画像のアップロードを試みる
        if (move_uploaded_file($banner["tmp_name"], $banner_target_file)) {
            return "https://devesion.main.jp/jphacks/banner/" . basename($banner["name"]); // 完全なURLを返す
        } else {
            echo json_encode(["error" => "申し訳ありませんが、バナー画像のアップロード中にエラーが発生しました。"]);
            return false;
        }
    }

function create_vtuber($mail, $pass, $name, $banner, $description, $language)
{
    try {

        $pdo = $this->get_pdo();
        
        // メールとパスワードでユーザーをチェック
        $sql = "SELECT * FROM Channel WHERE mail = :mail AND pass = :pass;";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['mail' => $mail, 'pass' => $pass]);
        $channel = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($channel) {
            // ユーザーが存在する場合、channel_idを返す
            return [
                'login' => true,
                'create' => false,
                'channel_id' => $channel['channel_id'] // channel_idを返す
            ];
        } else {
            $banner_url = $this->upload_banner($banner);
            if (!$banner_url) {
                return ['success' => false, 'error' => 'バナー画像のアップロードに失敗しました。'];
            }
            // ユーザーが存在しない場合、新しいレコードを挿入
            $insert_sql = "INSERT INTO Channel (name, banner_url, description, subscriber_count, language, mail, pass) VALUES (:name, :banner_url, :description, :subscriber_count, :language, :mail, :pass);";
            $insert_stmt = $pdo->prepare($insert_sql);
            $insert_stmt->execute([
                'name' => $name,
                'banner_url' => $banner_url,
                'description' => $description,
                'subscriber_count' => 0,
                'language' => $language,
                'mail' => $mail,
                'pass' => $pass,
            ]);
                
                // 新規作成したチャンネルのIDを取得
                $channel_id = $pdo->lastInsertId();
                return [
                    'login' => false,
                    'create' => true,
                    'channel_id' => $channel_id // 新しく作成したchannel_idを返す
                ];
            }

        } catch (PDOException $e) {
            return ['login' => false, 'create' => false];
        } catch (Error $e) {
            return ['login' => false, 'create' => false];
        }
    }
}

?>
