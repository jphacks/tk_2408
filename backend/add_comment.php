<?php

class AddComment
{
    function get_pdo()
    {
        // データベース接続情報を適切に設定してください
        $pdo = new PDO('mysql:host=mysql309.phy.lolipop.lan;dbname=LAA1615378-jphacks;charset=utf8', 'LAA1615378', 'jphacks');
        return $pdo;
    }

    function add_comment($user_id, $movie_id, $comment)
    {
        try {
            $pdo = $this->get_pdo();
            
            // 現在のタイムスタンプを取得
            $timestamp = date('Y-m-d H:i:s');

            // コメントを挿入
            $sql = "INSERT INTO Comment (user_id, movie_id, comment, timestamp) 
                    VALUES (:user_id, :movie_id, :comment, :timestamp);";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'user_id' => $user_id,
                'movie_id' => $movie_id,
                'comment' => $comment,
                'timestamp' => $timestamp
            ]);

            // 成功した場合、成功メッセージを返す
            return ['success' => true, 'message' => $comment];

        } catch (PDOException $e) {
            // エラーが発生した場合、エラーメッセージを返す
            return ['success' => false, 'error' => $e->getMessage()];
        } catch (Error $e) {
            // 予期せぬエラーが発生した場合
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
}
