<?php

// this is basically for administrative purposes.
	// the commands and arguments currently integrated are :
	//
	//  --1-- adduser,username,userpassword
	//  --2-- removeuser,username
	
	require_once("bootstrap.php");
	
	$Session = Session__FindInDB(session_id());
	
	if ($Session == false) {
		$_SESSION[$bid]["REPLY"]["DB_Session"] = "false";
		array_push($_SESSION[$bid]["REPLY"]["ERRORS"], "messages can only be accessed by logged in users");
		$_SESSION[$bid]["REPLY"]["jobresult"] = "false";
		Quit();
	} else {
		$_SESSION[$bid]["REPLY"]["DB_Session"] = "true";
	}
	$job = $_POST["job"];
	
	if ($job == "messages" AND isset($_POST["msg_command"]) AND strlen($_POST["msg_command"])>2) {
		$possiblecommands = array("get","add");
		$cmd = $_POST["msg_command"];
		if (!in_array($cmd,$possiblecommands)) {
			array_push($_SESSION[$bid]["REPLY"]["ERRORS"], "unknown messages command");
			$_SESSION[$bid]["REPLY"]["jobresult"] = "false";
			Quit();
		}
		array_push($_SESSION[$bid]["REPLY"]["SUCCESSES"], "message command triggered");
		if ($cmd=="get") {
			$mode = $_POST["msg_getmode"];
			$since = $_POST["msg_since"];
			$messages = Messages_getNew($mode, $since, $since);
			array_push($_SESSION[$bid]["REPLY"]["MESSAGES"], $messages);
			array_push($_SESSION[$bid]["REPLY"]["SUCCESSES"], "messages collected");
			$_SESSION[$bid]["REPLY"]["jobresult"] = "true";
		} else if ($cmd=="add") {
			$content = $_POST["msg_content"];
			$userid = $_SESSION[$bid]["user_id"];	
			$add = Messages_add($userid, $content);
			if ($add == false) {
				array_push($_SESSION[$bid]["REPLY"]["ERRORS"], "message add failed");
				$_SESSION[$bid]["REPLY"]["jobresult"] = "false";
			} else {
				array_push($_SESSION[$bid]["REPLY"]["SUCCESSES"], "message added");
				$_SESSION[$bid]["REPLY"]["jobresult"] = "true";
			}
		}
	} else {
		array_push($_SESSION[$bid]["REPLY"]["ERRORS"], "bad messages command");
		$_SESSION[$bid]["REPLY"]["jobresult"] = "false";
	}
	Quit();
	
	
	
	// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	


	function Messages_getNew($mode = "id", $since = "2000-01-01 00:00:00", $sinceID = 0, $limit = 300) {
		GLOBAL $bid;
		if (!isset($SessionID) OR $SessionID == "") $SessionID = session_id();
		$_CFG = $_SESSION["CFG"];
		$_QU = $_SESSION["QUERIES"];
		if ($mode == "id") {
			$RepArray = array(
				"/@@_V_LASTMSGID/" => $sinceID, 
				"/@@_V_limit/" => $limit
			);
			$myQuery = DB_QueryReplace($_QU["get_messages_by_newer_than_id"], $RepArray);
		} else {
			$RepArray = array(
				"/@@_V_timestamp/" => $since, 
				"/@@_V_limit/" => $limit
			);
			$myQuery = DB_QueryReplace($_QU["get_messages_by_created_date"], $RepArray);
		}
		$Res = mysql_query($myQuery);	
		$RowCount = mysql_num_rows($Res);
		
		$messages = array();
		while ($row = mysql_fetch_array($Res, MYSQL_ASSOC)) {
			array_push($messages, $row);
		}
		
		return $messages;
	}
	
	function Messages_add($userid, $content) {
		GLOBAL $bid;
		if (!isset($SessionID) OR $SessionID == "") $SessionID = session_id();
		$_CFG = $_SESSION["CFG"];
		$_QU = $_SESSION["QUERIES"];
		$RepArray = array(
			"/@@_V_userid/" => $userid, 
			"/@@_V_content/" => $content
		);

		$myQuery = DB_QueryReplace($_QU["add_message"], $RepArray);
		$Res = mysql_query($myQuery);	
				
		return $Res;
	}

	
	
?>