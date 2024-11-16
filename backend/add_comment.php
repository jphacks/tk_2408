<?php

class AddComment
{
    function get_pdo()
    {
        // データベース接続情報を適切に設定してください
        $pdo = new PDO('mysql:host=mysql309.phy.lolipop.lan;dbname=LAA1615378-jphacks;charset=utf8', 'LAA1615378', 'jphacks');
        return $pdo;
    }

    function translate_comment($comment, $target_language) {
        $api_key = ''; // OpenAIのAPIキーを設定
        $url = 'https://api.openai.com/v1/chat/completions';
    
        // プロンプトの設定
        $prompt = "次の文章を{$target_language}に翻訳してください: {$comment} 回答の生成として、翻訳した文章のみを回答として生成してください。";
    
        // リクエストデータの作成
        $data = [
            'model' => 'gpt-4o-mini', // 使用するモデルを指定
            'messages' => [
                ['role' => 'user', 'content' => $prompt],
            ],
            'max_tokens' => 300,
        ];
    
        // cURLセッションの初期化
        $ch = curl_init($url);
    
        // cURLオプションの設定
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $api_key,
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    
        // リクエストの実行とレスポンスの取得
        $response = curl_exec($ch);
    
        // エラーチェック
        if (curl_errno($ch)) {
            throw new Exception('cURLエラー: ' . curl_error($ch));
        }
    
        // HTTPステータスコードのチェック
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        if ($http_code !== 200) {
            throw new Exception('APIリクエストエラー: HTTPステータスコード ' . $http_code);
        }
    
        // cURLセッションの終了
        curl_close($ch);
    
        // レスポンスのデコード
        $result = json_decode($response, true);
    
        // 翻訳結果の抽出
        return trim($result['choices'][0]['message']['content']);
    }

    function add_comment($user_id, $movie_id, $comment)
    {
        try {
            $pdo = $this->get_pdo();
            
            // 現在のタイムスタンプを取得
            $timestamp = date('Y-m-d H:i:s');

            $comment_ja = $this->translate_comment($comment,"日本語");
            $comment_en = $this->translate_comment($comment,"英語");

            // コメントを挿入
            $sql = "INSERT INTO Comment (user_id, movie_id, comment, comment_ja, comment_en, timestamp) 
                    VALUES (:user_id, :movie_id, :comment, :comment_ja, :comment_en, :timestamp);";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'user_id' => $user_id,
                'movie_id' => $movie_id,
                'comment' => $comment,
                'comment_ja' => $comment_ja,
                'comment_en' => $comment_en,
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
