<?php

class VideoUpload
{
    private $pdo;

    public function __construct()
    {
        $this->pdo = $this->get_pdo();
    }

    private function get_pdo()
    {
        // Replace with your database connection details
        return new PDO('mysql:host=mysql309.phy.lolipop.lan;dbname=LAA1615378-jphacks;charset=utf8', 'LAA1615378', 'jphacks');
    }

    public function upload_video($file, $title, $language, $tags)
    {
        // 保存先ディレクトリ
        $target_dir = "../movie/"; // 保存先を../movieに変更
        $target_file = $target_dir . basename($file["name"]);
        $uploadOk = 1;

        // ファイルタイプの確認
        $fileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
        if ($fileType != "mp4" && $fileType != "avi" && $fileType != "mov") {
            echo "申し訳ありませんが、MP4、AVI、およびMOVファイルのみが許可されています。";
            $uploadOk = 0;
        }

        // ファイルのアップロードを試みる
        if ($uploadOk == 1) {
            if (move_uploaded_file($file["tmp_name"], $target_file)) {
                // データベースに動画メタデータを挿入するためのSQL準備
                $sql = "INSERT INTO Videos (title, thumbnail_url, language, tags, movie_url) VALUES (:title, :thumbnail_url, :language, :tags, :movie_url)";
                $stmt = $this->pdo->prepare($sql);
                $stmt->execute([
                    'title' => $title,
                    'thumbnail_url' => 'default_thumbnail.png', // 必要に応じて変更
                    'language' => $language,
                    'tags' => $tags,
                    'movie_url' => $target_file // 動画のパスをデータベースに保存
                ]);
                echo "ファイル " . htmlspecialchars(basename($file["name"])) . " がアップロードされました。";
            } else {
                echo "申し訳ありませんが、ファイルのアップロード中にエラーが発生しました。";
            }
        }
    }
}

?>
