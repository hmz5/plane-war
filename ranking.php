<?php

	header("Content-type:text/html;charset=utf-8");
	mysql_connect(SAE_MYSQL_HOST_M.":".SAE_MYSQL_PORT,SAE_MYSQL_USER,SAE_MYSQL_PASS);
	mysql_select_db(SAE_MYSQL_DB);
	mysql_query("set names utf8");
	
	$sql = "SELECT * FROM plane ORDER BY score DESC LIMIT 0,10";
	$result = mysql_query($sql);
	
    if(mysql_num_rows($result)>0){
        $arr = array();
        while($row = mysql_fetch_assoc($result)){//以关联数组返回
            $arr[] = $row;
        	
        }
        echo json_encode($arr);
    }else{
        echo "b";
    }
?>