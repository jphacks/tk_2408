<?php
class Database {
    private $host = 'mysql309.phy.lolipop.lan'; // データベースホスト
    private $dbname = 'LAA1615378-jphacks';     // データベース名
    private $username = 'LAA1615378';           // ユーザー名
    private $password = 'jphacks';      // パスワード
    private $charset = 'utf8';                  // 文字セット
    private $pdo;

    // データベース接続を取得するメソッド
    public function getPdo() {
        // すでに接続されていれば、そのPDOインスタンスを返す
        if ($this->pdo === null) {
            try {
                $dsn = "mysql:host={$this->host};dbname={$this->dbname};charset={$this->charset}";
                $this->pdo = new PDO($dsn, $this->username, $this->password);
                // エラーモードを例外に設定
                $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                // 接続エラー時のメッセージ表示
                echo "Connection failed: " . $e->getMessage();
                exit;
            }
        }
        return $this->pdo;
    }
}
