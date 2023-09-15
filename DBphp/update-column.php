<?php
include('sql-config.php');

$LOG_GAMEDATA_PK = $_POST['pk'];
$column = $_POST['column'];
$value = $_POST['value'];


$conn = new mysqli($config["host"], $config["username"], $config["password"], $config["database"]);

if ($conn->connect_error) {
    die("MySQL 연결 실패: " . $conn->connect_error);
}

//조작 방지를 위해 콘솔 창 오픈 시 조작 여부 업데이트
if($column == '' && $value == '')
{
    $sql = "UPDATE LOG_GAMEDATA_TB SET GAMEDATA_FL = 'Y' WHERE LOG_GAMEDATA_PK = '{$LOG_GAMEDATA_PK}' ";
}
else
{
    //현재 PK 값 select 해서 OG 값 확인
    $sql = "SELECT * FROM LOG_GAMEDATA_TB WHERE LOG_GAMEDATA_PK = '{$LOG_GAMEDATA_PK}'";
    $result = $conn->query($sql);
    $checkData = $result->fetch_assoc();
    
    $addSet = '';
    
    if($checkData[$column.'_OG'] == '0000-00-00 00:00:00')
    {
        $addSet .= ", ".$column."_OG = '{$value}'";
    }
    
    if ($column == "GAMEDATA_POINT")
    {
        $sql = "UPDATE LOG_GAMEDATA_TB SET GAMEDATA_POINT = '{$value}', GAMEDATA_POINT_OG = NOW() WHERE LOG_GAMEDATA_PK = '{$LOG_GAMEDATA_PK}'";
    }
    else
    {
        $sql = "UPDATE LOG_GAMEDATA_TB SET {$column} = '{$value}', GAMEDATA_POINT_OG = NOW() WHERE LOG_GAMEDATA_PK = '{$LOG_GAMEDATA_PK}'";
    }
}

if ($conn->query($sql) === TRUE) {
    echo "레코드가 업데이트되었습니다.";
} else {
    echo "업데이트 실패: " . $conn->error;
}

// DB연결 종료
$conn->close();

?>
