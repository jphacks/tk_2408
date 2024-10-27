<?php

class GetMovieList
{
    function get_pdo()
    {
        // // ロリポップのデータベース接続情報に置き換えてください
        // $db = new Database();

        // // PDOインスタンスを取得
        // $pdo = $db->getPdo();

        // return $pdo;

        $pdo = new PDO('mysql:host=mysql309.phy.lolipop.lan;dbname=LAA1615378-jphacks;charset=utf8', 'LAA1615378', 'jphacks');
        return $pdo;
    }

    function get_movie_list()
    {
        try {
            $pdo = $this->get_pdo();

            // Moviesテーブルからすべてのmovieリンクを取得するSQL
            $sql = "SELECT * FROM Movie;";
            $ps = $pdo->prepare($sql);
            $ps->execute();

            // 結果を取得し、配列に変換
            $movie_links = $ps->fetchAll(PDO::FETCH_ASSOC);

            // 結果を返す
            return $movie_links;

        } catch (PDOException $e) {
            return ['error' => $e->getMessage()];
        } catch (Error $e) {
            return ['error' => $e->getMessage()];
        }
    }
}

?>
