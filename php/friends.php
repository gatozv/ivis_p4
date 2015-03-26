<?php 
require_once('goodreads-oauth_v1/GoodreadsAPI.php');


session_start();

$obj = new GoodreadsApi(iSAfjzMo6QHWifwOfCQvQ, XRCIVEsXshWdT2NwKGqHoQ6e8qzC1YclV45Zgp2GADg, $_COOKIE['oauth_token'], $_COOKIE['oauth_token_secret']);


	$link = 'https://www.goodreads.com/friend/user/'.$_GET['id'].'?format=xml';

	if ($_GET['page']!=null) {
		$link = $link.'&page='.$_GET['page'];
	}

	$content = $obj->doGet($link);
	print_r($content);
	unset ($obj);
	//40484598
?>