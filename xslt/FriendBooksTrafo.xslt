<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:output	
		doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
		doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>
	
	<xsl:template match="/">
		<xsl:apply-templates select="GoodreadsResponse"/>
	</xsl:template>

	<xsl:template match="GoodreadsResponse">
		[<xsl:apply-templates select="reviews"/>]
	</xsl:template>
<!--	
	<xsl:template match="compare">
		<xsl:apply-templates select="not_in_common"/>
		<xsl:apply-templates select="your_library_percent"/>
		<xsl:apply-templates select="their_library_percent"/>
		<xsl:apply-templates select="their_total_books_count"/>
		<xsl:apply-templates select="common_count"/>
		<xsl:apply-templates select="reviews"/>
	</xsl:template>-->
	
	<xsl:template match="reviews">
		<xsl:apply-templates select="review"/>
	</xsl:template>
	
	<xsl:template match="review">
		<xsl:apply-templates select="book"/>
		<xsl:if test="position() != last()">
			<xsl:text>, </xsl:text>
		</xsl:if>
	</xsl:template>
	
	<xsl:template match="book">
		<xsl:text>{"link":"</xsl:text>
		<xsl:value-of select="./link/."/>
		<xsl:text>",</xsl:text>
		<xsl:text>"id":"</xsl:text>
		<xsl:value-of select="./id/."/>
		<xsl:text>"} </xsl:text>
	</xsl:template>
		
<!--	
	<xsl:template match="not_in_common">
		<xsl:text>{"not_in_common":"</xsl:text>
		<xsl:value-of select="./."/>
		<xsl:text>"}, </xsl:text>
	</xsl:template>
	
	<xsl:template match="your_library_percent">
		<xsl:text>{"your_library_percent":"</xsl:text>
		<xsl:value-of select="./."/>
		<xsl:text>"}, </xsl:text>
	</xsl:template>
	
	<xsl:template match="their_library_percent">
		<xsl:text>{"their_library_percent":"</xsl:text>
		<xsl:value-of select="./."/>
		<xsl:text>"}, </xsl:text>
	</xsl:template>
	
	<xsl:template match="their_total_books_count">
		<xsl:text>{"their_total_books_count":"</xsl:text>
		<xsl:value-of select="./."/>
		<xsl:text>"}, </xsl:text>
	</xsl:template>
	
	<xsl:template match="common_count">
		<xsl:text>{"common_count":"</xsl:text>
		<xsl:value-of select="./."/>
		<xsl:text>"}</xsl:text>
	</xsl:template>-->
</xsl:stylesheet>