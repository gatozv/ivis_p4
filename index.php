<?php
/**
 * @author Sachin Khosla
 * @description: This file requests the request token and
 * creates the authorization/login link
 * Stores the oauth_token in the session variables.
 *
 * modified by @YourNextRead to integrate with goodreads
 */


require_once('php/goodreads-oauth_v1/GoodreadsAPI.php');

session_start();
/*
echo "<br>";
print_r ($_SESSION);
echo "<br>";
*/
//$connection = new GoodreadsAPI(CONSUMER_KEY, CONSUMER_SECRET);
//$request_token = $connection->getRequestToken(CALLBACK_URL);
if($_GET['authorize'] != 1){
$connection = new GoodreadsAPI(iSAfjzMo6QHWifwOfCQvQ, XRCIVEsXshWdT2NwKGqHoQ6e8qzC1YclV45Zgp2GADg);
$request_token = $connection->getRequestToken("http://tomas.gatial.sk/DH2321_4/authorized.html");


$_SESSION['oauth_token']  = $request_token['oauth_token'];
$_SESSION['oauth_token_secret'] = $request_token['oauth_token_secret'];

$authorize_url = $connection->getLoginURL($request_token);
//echo "token: " . $request_token['oauth_token'] . "\n";
//echo " secret: " . $request_token['oauth_token_secret'];

echo "<a href='$authorize_url'>Sign in to <img src='goodreads-oauth_v1/goodreads-badge.png' alt='goodreads' /></a>";
}
if($_GET['authorize'] == 1){
	//print_r($_REQUEST);
	//echo "<br>";
	//$_SESSION['oauth_verifier'] = $_REQUEST['oauth_verifier'];
	echo "<a href='test.html'>Go forward</a>";

	if($_SESSION['oauth_token'] !== $_REQUEST['oauth_token'])
	{
	  //token expired get a new one. You can clear session over here and redirect user to the login link
	  die('token expired get a new one');
	}


	$obj = new GoodreadsApi(iSAfjzMo6QHWifwOfCQvQ, XRCIVEsXshWdT2NwKGqHoQ6e8qzC1YclV45Zgp2GADg, $_SESSION['oauth_token'], $_SESSION['oauth_token_secret']);

	$access_token = $obj->getAccessToken($_REQUEST['oauth_verifier']);
	$_SESSION['access_token'] = $access_token;

	//print_r($access_token);
/*
	unset ($_SESSION['oauth_token'], $_SESSION['oauth_token_secret'] ,$obj);

	$obj = new GoodreadsApi(iSAfjzMo6QHWifwOfCQvQ, XRCIVEsXshWdT2NwKGqHoQ6e8qzC1YclV45Zgp2GADg, $access_token['oauth_token'], $access_token['oauth_token_secret']);

	$content = $obj->doGet('http://www.goodreads.com/api/auth_user');
	print_r($content);
	echo "<br>";
	//you may have to 'view page source' if the relevant XML is not visible in your browser
	print_r($_REQUEST);
	unset ($obj);



echo "<br>";



	$obj = new GoodreadsApi(iSAfjzMo6QHWifwOfCQvQ, XRCIVEsXshWdT2NwKGqHoQ6e8qzC1YclV45Zgp2GADg, $access_token['oauth_token'], $access_token['oauth_token_secret']);

	$content = $obj->doGet('http://www.goodreads.com/api/auth_user');
	print_r($content);
	unset ($obj);

*/
		echo '<script type="text/javascript">
           window.location = "test.html"
      </script>';

}
?>