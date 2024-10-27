<?php

class VideoUpload
{
    public function upload_video($file)
    {
        error_reporting(E_ALL);
        ini_set('display_errors', 1);
        
        $target_dir = "../movie/";
        $target_file = $target_dir . basename($file["name"]);
        $uploadOk = 1;

        // ファイルタイプの確認
        $fileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
        if ($fileType != "mp4" && $fileType != "avi" && $fileType != "mov") {
            echo json_encode(["error" => "申し訳ありませんが、MP4、AVI、およびMOVファイルのみが許可されています。"]);
            return false;
        }

        // ファイルのアップロードを試みる
        if (move_uploaded_file($file["tmp_name"], $target_file)) {
            return "https://devesion.main.jp/jphacks/movie/" . basename($file["name"]); // 完全なURLを返す
        } else {
            echo json_encode(["error" => "申し訳ありませんが、ファイルのアップロード中にエラーが発生しました。"]);
            return false;
        }
    }

    public function upload_thumbnail($thumbnailFile)
    {
        error_reporting(E_ALL);
        ini_set('display_errors', 1);
        
        // サムネイル画像の保存先
        $thumbnail_dir = "../thumbnail/";
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
            return "https://devesion.main.jp/jphacks/thumbnail/" . basename($thumbnailFile["name"]); // 完全なURLを返す
        } else {
            echo json_encode(["error" => "申し訳ありませんが、サムネイル画像のアップロード中にエラーが発生しました。"]);
            return false;
        }
    }


    public function post_movie($channel_id, $title, $language, $tags, $thumbnail, $movie)
    {
        // $videoを使ってアップロードし、そのURLを取得
        $movie_url = $this->upload_video($movie);
        if (!$movie_url) {
            return ['success' => false, 'error' => '動画のアップロードに失敗しました。'];
        }

        // $thumbnailを使ってアップロードし、そのURLを取得
        $thumbnail_url = $this->upload_thumbnail($thumbnail);
        if (!$thumbnail_url) {
            return ['success' => false, 'error' => 'サムネイル画像のアップロードに失敗しました。'];
        }

        try {
            $pdo = $this->get_pdo();

            $insert_sql = "INSERT INTO Movie (channel_id, title, thumbnail_url, language, tags, movie_url) VALUES (:channel_id, :title, :thumbnail, :language, :tags, :movie_url);";
            $stmt = $pdo->prepare($insert_sql);
            $stmt->execute([
                'channel_id' => $channel_id,
                'title' => $title,
                'thumbnail' => $thumbnail_url,
                'language' => $language,
                'tags' => $tags,
                'movie_url' => $movie_url
            ]);

            return ['success' => true, 'movie_url' => $movie_url];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => "データベースエラー: " . $e->getMessage()];
        } catch (Error $e) {
            return ['success' => false, 'error' => "一般エラー: " . $e->getMessage()];
        }
    }

    private function get_pdo()
    {
        // データベース接続の詳細を入力してください
        $pdo = new PDO('mysql:host=mysql309.phy.lolipop.lan;dbname=LAA1615378-jphacks;charset=utf8', 'LAA1615378', 'jphacks');
        return $pdo;
    }
}
?>
