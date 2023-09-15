<?php
// DB 연결
include('sql-config.php');
$conn = new mysqli($config["host"], $config["username"], $config["password"], $config["database"]);

if ($conn->connect_error) {
  die("MySQL 연결 실패: " . $conn->connect_error);
}
// 점수 상위 5개만 나오는 쿼리 
$sql = "SELECT GAMEDATA_POINT FROM LOG_GAMEDATA_TB ORDER BY GAMEDATA_POINT DESC LIMIT 5";
$result = $conn->query($sql);

// top5 배열로
$top5 = array();
while ($row = $result->fetch_assoc()) {
  $top5[] = $row['GAMEDATA_POINT'];
}

// 만약 $top5 배열의 길이가 5보다 작다면 나머지 항목을 0으로 채움
for ($i = count($top5); $i < 5; $i++) {
  $top5[] = "0";
}

//DB 연결종료
$conn->close();
echo json_encode($top5); //top5 출력


?>
