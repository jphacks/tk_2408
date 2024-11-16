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
require_once './create_vtuber.php';
require_once './login_vtuber.php';
require_once './get_movie_select.php';
require_once './add_comment.php';
require_once './get_comment.php';
require_once './get_user.php';
// 初期データ
$data = "noooo action";

// 取得系処理

// get_test_dataの引数がある時の処理
if (isset($_POST['get_movie_list']) == true) {
    $class = new GetMovieList();
    $data = $class->get_movie_list();
}else if (isset($_POST['login']) == true) {
    $class = new UserLogin();
    $data = $class->login($_POST['user_name'],$_POST['mail'],$_POST['pass'],isset($_POST['display_language']) ? $_POST['display_language'] : 'japanese', // フロントから受け取った言語設定
    isset($_POST['info']) ? $_POST['info'] : 'No information provided', $_FILES['thumbnail']);
}else if (isset($_POST['post_movie']) == true) {
    $videoUpload = new VideoUpload();
    $data = $videoUpload->post_movie($_POST['channel_id'],$_POST['title'],$_POST['language'],$_POST['tags'],$_FILES['thumbnail'],$_FILES['movie']);
}else if (isset($_POST['create_vtuber']) == true) {
    $class = new CreateVtuber();
    $data = $class->create_vtuber($_POST['vmail'],$_POST['vpass'],$_POST['vname'],$_FILES['vbanner'],$_POST['vdescription'],$_POST['vlanguage']);
}else if(isset($_POST['login_vtuber']) == true){
    $class = new LoginVtuber();
    $data = $class->login_vtuber($_POST['mail'],$_POST['pass']);
}else if(isset($_POST['get_movie_select']) == true){
    $class = new GetMovieSelect();
    $data = $class->get_movie_select($_POST['movie_id']);
}else if(isset($_POST['add_comment']) == true){
    $class = new AddComment();
    $data = $class->add_comment($_POST['user_id'],$_POST['movie_id'],$_POST['comment']);
}else if(isset($_POST['get_comment']) == true){
    $class = new GetComment();
    $data = $class->get_comment($_POST['movie_id']);
}else if(isset($_POST['get_user']) == true){
    $class = new GetUser();
    $data = $class->get_user($_POST['user_id']);
}

// arrayの中身をJSON形式に変換して出力
$json_array = json_encode($data);
print $json_array;

?>
