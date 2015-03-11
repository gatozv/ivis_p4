<?php 

require_once('goodreads-oauth_v1/GoodreadsAPI.php');


session_start();

$obj = new GoodreadsApi(iSAfjzMo6QHWifwOfCQvQ, XRCIVEsXshWdT2NwKGqHoQ6e8qzC1YclV45Zgp2GADg, $access_token['oauth_token'], $access_token['oauth_token_secret']);

	$link = 'https://www.goodreads.com/review/list.xml?v=2&id='.$_GET['id'].'&format=xml&per_page=200';

	if ($_GET['page']!=null) {
		$link = $link.'&page='.$_GET['page'];
	}

	$content = $obj->doGet($link);
	print_r($content);
	unset ($obj);
?>

