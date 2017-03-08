<?
	header("Content-type:text/html;charset=utf-8");
	mysql_connect(SAE_MYSQL_HOST_M.":".SAE_MYSQL_PORT,SAE_MYSQL_USER,SAE_MYSQL_PASS);
	mysql_select_db(SAE_MYSQL_DB);
	mysql_query("set names utf8");
	
	$openid = $_GET["openid"];
	$user = $_GET["user"];
	$imgSrc = $_GET["imgSrc"];
	$score = $_GET["score"];
	
	$sql = "SELECT * FROM plane WHERE openid='{$openid}'";
	$result = mysql_query($sql);
	if(mysql_num_rows($result)>0){
		//存在该用户
		$row = mysql_fetch_assoc($result);
		if($row["score"]<$score){
			//更新数据库
			$sql = "UPDATE plane SET src='{$imgSrc}',name='{$user}',score='{$score}' WHERE openid='{$openid}'";
			$result = mysql_query($sql);
			if(mysql_affected_rows()>0){
				echo "更新成功";
			}else{
				echo "更新失败";
			}
		}else{
			echo "不更新";
		}
	}else{
		//新建用户插入数据库
		$sql = "INSERT INTO plane(id,src,name,score,openid) VALUES(NULL,'{$imgSrc}','{$user}','{$score}','{$openid}')";
		$result = mysql_query($sql);
		if(mysql_affected_rows()>0){
			echo "插入成功";
		}else{
			echo "插入失败";
		}
	}
?>