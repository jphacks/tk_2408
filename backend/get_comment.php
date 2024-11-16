<?php

class GetComment
{
    function get_pdo()
    {
        $pdo = new PDO('mysql:host=mysql309.phy.lolipop.lan;dbname=LAA1615378-jphacks;charset=utf8', 'LAA1615378', 'jphacks');
        return $pdo;
    }

    function get_comment($movie_id)
    {
        try {
            $pdo = $this->get_pdo();

            // 指定されたmovie_idのコメントを取得し、関連するユーザー情報を結合するSQL
            $sql = "
                SELECT 
                    c.comment_id,
                    IFNULL(c.user_id, '') AS user_id,
                    IFNULL(c.movie_id, '') AS movie_id,
                    IFNULL(c.comment, '') AS comment,
                    IFNULL(c.timestamp, '') AS timestamp,
                    IFNULL(u.google_id, '') AS google_id,
                    IFNULL(u.username, '') AS username,
                    IFNULL(u.display_language, '') AS display_language,
                    IFNULL(u.icon_url, '') AS icon_url,
                    IFNULL(u.info, '') AS info,
                    IFNULL(u.gift_level, '') AS gift_level
                FROM 
                    Comment c
                LEFT JOIN 
                    Users u
                ON 
                    c.user_id = u.user_id
                WHERE 
                    c.movie_id = :movie_id;
            ";

            $ps = $pdo->prepare($sql);
            $ps->bindValue(':movie_id', $movie_id, PDO::PARAM_INT);
            $ps->execute();

            // 結果を取得し、配列に変換
            $comments_with_users = $ps->fetchAll(PDO::FETCH_ASSOC);

            // 結果を返す
            return $comments_with_users;

        } catch (PDOException $e) {
            return ['error' => $e->getMessage()];
        } catch (Error $e) {
            return ['error' => $e->getMessage()];
        }
    }
}

?>
