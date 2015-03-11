function loadXMLDoc (filename) {
	if (window.ActiveXObject) {
		xhttp = new ActiveXObject("Msxml2.XMLHTTP");
	} else {
		xhttp = new XMLHttpRequest();
	}
	
	xhttp.open("GET", filename, false);
	try {xhttp.responseType = "msxml-document"} catch(err) {} // Helping IE11
		xhttp.send("");
		return xhttp.responseXML;
}

function parseXML(xmlFile, xslFile) {
	xml = loadXMLDoc(xmlFile);
	xsl = loadXMLDoc(xslFile);
	// code for IE
	if (window.ActiveXObject || xhttp.responseType == "msxml-document")
	{
		return "IE support not implemented yet... sorry, not sorry.";
	}
	// code for Chrome, Firefox, Opera, etc.
	else if (document.implementation && document.implementation.createDocument)
	{
		xsltProcessor = new XSLTProcessor();
		xsltProcessor.importStylesheet(xsl);
		resultDocument = xsltProcessor.transformToFragment(xml, document);
		var xmlAsString = new XMLSerializer().serializeToString( resultDocument );
		return xmlAsString;
	}
}