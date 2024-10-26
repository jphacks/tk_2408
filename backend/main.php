<?php

// CORSエラーの解消
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type"); // これを追加
header('Content-Type: application/json; charset=UTF-8');


// DAOの読み込み
require_once './getMovieList.php';
require_once './login_user.php';
require_once './postMovie.php';

// 初期データ
$data = "noooo action";

// 取得系処理

// get_test_dataの引数がある時の処理
if (isset($_POST['get_movie_list']) == true) {
    $class = new GetMovieList();
    $data = $class->get_movie_list();
}else if (isset($_POST['login']) == true) {
    $class = new UserLogin();
    $data = $class->login($_POST['mail'],$_POST['pass']);
}else if (isset($_POST['post_movie']) == true) {
    $videoUpload = new VideoUpload();
    $videoUpload->upload_video($_FILES['video'], $_POST['title'], $_POST['language'], $_POST['tags']);
}

// arrayの中身をJSON形式に変換して出力
$json_array = json_encode($data);
print $json_array;

?>
