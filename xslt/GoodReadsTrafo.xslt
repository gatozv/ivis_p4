<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:output	
		doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
		doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>
	
	<xsl:template match="/">
		<xsl:apply-templates select="GoodreadsResponse"/>
	</xsl:template>

	<xsl:template match="GoodreadsResponse">
		<xsl:apply-templates select="friends"/>
	</xsl:template>
	
	<xsl:template match="friends">
		[<xsl:apply-templates select="user"/>]
	</xsl:template>
	
	<xsl:template match="user">
		<xsl:text>{"id":"</xsl:text>
		<xsl:value-of select="./id/."/>
		<xsl:text>", "name":"</xsl:text>
		<xsl:value-of select="./name/."/>
		<xsl:text>"}</xsl:text>
		<xsl:if test="position() != last()">
			<xsl:text>, </xsl:text>
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>