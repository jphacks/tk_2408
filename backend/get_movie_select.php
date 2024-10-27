<?php

class GetMovieSelect
{
    function get_pdo()
    {
        $pdo = new PDO('mysql:host=mysql309.phy.lolipop.lan;dbname=LAA1615378-jphacks;charset=utf8', 'LAA1615378', 'jphacks');
        return $pdo;
    }

    function get_movie_select($movie_id)
    {
        try {
            $pdo = $this->get_pdo();

            // Movieテーブルから指定されたmovie_idに一致する行を取得するSQL
            $sql = "SELECT * FROM Movie WHERE movie_id = :movie_id;";
            $ps = $pdo->prepare($sql);

            // パラメータをバインド
            $ps->bindParam(':movie_id', $movie_id, PDO::PARAM_INT);

            // クエリを実行
            $ps->execute();

            // 結果を取得し、配列に変換
            $movie_details = $ps->fetch(PDO::FETCH_ASSOC);

            // 結果が見つからない場合の処理
            if (!$movie_details) {
                return ['error' => 'Movie not found'];
            }

            // 結果を返す
            return $movie_details;

        } catch (PDOException $e) {
            return ['error' => $e->getMessage()];
        } catch (Error $e) {
            return ['error' => $e->getMessage()];
        }
    }
}

?>
