<?php

	require_once('php/goodreads-oauth_v1/GoodreadsAPI.php');

	session_start();
	if($_GET['authorize'] != 1){
		$connection = new GoodreadsAPI(iSAfjzMo6QHWifwOfCQvQ, XRCIVEsXshWdT2NwKGqHoQ6e8qzC1YclV45Zgp2GADg);
		$request_token = $connection->getRequestToken("http://tomas.gatial.sk/DH2321_4/authorized.html");

		$_SESSION['oauth_token']  = $request_token['oauth_token'];
		$_SESSION['oauth_token_secret'] = $request_token['oauth_token_secret'];

		$authorize_url = $connection->getLoginURL($request_token);

		//echo "<a href='$authorize_url'>Sign in to <img src='goodreads-oauth_v1/goodreads-badge.png' alt='goodreads' /></a>";
		
		$doc = new DOMDocument();
		$doc->loadHTMLFile("login.html");
		
		$el = $doc->getElementById('linkscript');
		$el->nodeValue = 'var loginLink = "'.$authorize_url.'"';
		
		echo $doc->saveHTML();
	}

	if($_GET['authorize'] == 1){
		echo "<a href='skylikes.html'>Go forward</a>";

		if($_SESSION['oauth_token'] !== $_REQUEST['oauth_token']){
		  die('token expired get a new one');
		}
	
		$obj = new GoodreadsApi(iSAfjzMo6QHWifwOfCQvQ, 
								XRCIVEsXshWdT2NwKGqHoQ6e8qzC1YclV45Zgp2GADg, 
								$_SESSION['oauth_token'], 
								$_SESSION['oauth_token_secret']);
	
		$access_token = $obj->getAccessToken($_REQUEST['oauth_verifier']);
		
		$_SESSION['access_token'] = $access_token;
		echo "access token\n";
		print_r($access_token);
		echo "sessoin variables\n";
		print_r($_SESSION['access_token']);

		setcookie("access_tokens", $access_token);

		/*	echo '<script type="text/javascript">
	           window.location = "skylikes.html"
	      </script>';*/
	}
?>