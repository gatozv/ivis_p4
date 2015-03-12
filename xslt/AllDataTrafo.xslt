<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:output	
		doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
		doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" />
		
	<xsl:template match="/">
		<xsl:text>{
		</xsl:text>
		<xsl:apply-templates select="AllGoodreadsData" />
		<xsl:text>}</xsl:text>
	</xsl:template>

	<xsl:template match="AllGoodreadsData">
		<xsl:apply-templates mode="me" select="me/GoodreadsResponse/user" />
		<xsl:text>
			"friends": [</xsl:text>
		<xsl:apply-templates mode="friend" select="myFriends/GoodreadsResponse/friends/user" />
		<xsl:text>]</xsl:text>
	</xsl:template>

	<xsl:template match="user" mode="me">
		<xsl:variable name="userId" select="./@id"/>
		<xsl:text>"id": "</xsl:text>
		<xsl:value-of select="$userId" />
		<xsl:text>",
		"name": "</xsl:text>
		<xsl:value-of select="./name" />
		<xsl:text>",
		</xsl:text>
		<xsl:text>"books": [
		</xsl:text>
		<xsl:apply-templates select="../../../allBooks/books[@userId = $userId]/GoodreadsResponse/reviews/review" />
		<xsl:text>],</xsl:text>
	</xsl:template>

	<xsl:template match="user" mode="friend">
		<xsl:text>{</xsl:text>
		<xsl:variable name="userId" select="./id/."/>
		<xsl:text>"id": "</xsl:text>
		<xsl:value-of select="$userId" />
		<xsl:text>",
		"name": "</xsl:text>
		<xsl:value-of select="./name" />
		<xsl:text>",
		</xsl:text>
		<xsl:text>"books": [
		</xsl:text>
		<xsl:apply-templates select="../../../../allBooks/books[@userId = $userId]/GoodreadsResponse/reviews/review" />
		<xsl:text>]}</xsl:text>
		<xsl:if test="position() != last()">
			<xsl:text>, 
			</xsl:text>
		</xsl:if>
	</xsl:template>

	<xsl:template match="review">
		<xsl:text>{"title": "</xsl:text>
		<xsl:apply-templates select="./book/title" />
		<xsl:text>", "image_url": "</xsl:text>
		<xsl:value-of select="./book/image_url/." />
		<xsl:text>", "author": "</xsl:text>
		<xsl:value-of select="./book/authors/descendant::author[1]/name" />
		<xsl:text>"}</xsl:text>
		<xsl:if test="position() != last()">
			<xsl:text>, 
			</xsl:text>
		</xsl:if>
	</xsl:template>

	<xsl:template match="title">
		<xsl:call-template name="escapeQuote"/>
	</xsl:template>

	<xsl:template name="escapeQuote">
      <xsl:param name="pText" select="."/>

      <xsl:if test="string-length($pText) >0">
       <xsl:value-of select=
        "substring-before(concat($pText, '&quot;'), '&quot;')"/>

       <xsl:if test="contains($pText, '&quot;')">
        <xsl:text>\"</xsl:text>

        <xsl:call-template name="escapeQuote">
          <xsl:with-param name="pText" select=
          "substring-after($pText, '&quot;')"/>
        </xsl:call-template>
       </xsl:if>
      </xsl:if>
    </xsl:template>
</xsl:stylesheet>