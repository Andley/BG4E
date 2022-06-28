ό —— Omicron with Tonos (U+03CC) ⇐ modern greek
ό —— OMICRON WITH OXIA' (U+1F79) ⇐ ancient greek


# Greek unicode characters
newData = re.sub('[άά]', 'ά', newData)
newData = re.sub('[ίί]', 'ί', newData)
newData = re.sub('[έέ]', 'έ', newData)
newData = re.sub('[ώώ]', 'ώ', newData)
newData = re.sub('[ήή]', 'ή', newData)
newData = re.sub('[ύύ]', 'ύ', newData)
newData = re.sub('[όό]', 'ό', newData)
newData = re.sub('̓͂Α', 'Ἆ', newData)
newData = re.sub('̓͂Η', 'Ἦ', newData)
newData = re.sub('̓͂Ω', 'Ὦ', newData)
newData = re.sub('ί̈', 'ΐ', newData)
newData = re.sub('[ΐΐ]', 'ΐ', newData)
newData = re.sub('[ΰΰ]', 'ΰ', newData)
newData = re.sub('[᾿ʼ]', '᾽', newData)
newData = re.sub('ῇ', 'ῇ', newData)
newData = re.sub('ῇ', 'ῇ', newData)


---

source: [Greek Unicode duplicated vowels - The Digital Classicist Wiki](https://wiki.digitalclassicist.org/Greek_Unicode_duplicated_vowels)

For some reason, perhaps because of an oversight, or perhaps because the editors thought that there was some essential difference between _tonos_ and _oxia_ (acute)--which there is not--sixteen characters in the Greek basic set were duplicated in Greek extended:

| Unicode | Basic codepoint | extended codepoint |
|---------|-----------------|--------------------|
| ά       | \u03AC            | \u1F71               |
| έ       | \u03AD            | \u1F73               |
| ή       | \u03AE            | \u1F75               |
| ί       | \u03AF            | \u1F77               |
| ό       | \u03CC            | \u1F79               |
| ύ       | \u03CD            | \u1F7B               |
| ώ       | \u03CE            | \u1F7D               |
| Ά       | \u0386             | \u1FBB               |
| Έ       | \u0388             | \u1FC9               |
| Ή       | \u0389             | \u1FCB               |
| Ί       | \u038A            | \u1FDB               |
| Ό       | \u038C            | \u1FF9               |
| Ύ       | \u038E            | \u1FEB              |
| Ώ       | \u038F            | \u1FFB               |
| ΐ       | \u0390             | \u1FD3               |
| ΰ       | \u03B0            | \u1FE3               |


There is no semantic difference between, for example, ά and ά (both alpha-oxia), so in most cases you don't need to worry about this. Your [Greek Keyboards (Unicode)](https://wiki.digitalclassicist.org/Greek_Keyboards_(Unicode) "Greek Keyboards (Unicode)") will make a decision and input one or the other. A search engine should be able to find both from either input (just as they should be able to strip diacritics altogether from a search term, if desired).

The Unicode database dictates a rule for normalization that converts the higher code point to its corresponding lower code point.

Most [Greek Fonts (Unicode)](https://wiki.digitalclassicist.org/Greek_Fonts_(Unicode) "Greek Fonts (Unicode)") will display both versions identically. A notable exception is Adobe Garamond Premiere Pro and Adobe Minion Pro, which observes the false distinction introduced in the 1980s by setting the oxia in the Greek and Coptic block at almost a vertical angle, and in the Greek Extended block at a slanted, ca. 45-degree angle. This can cause a problem with software that (correctly) normalizes the higher points to the lower ones, producing an inconsistent appearance in accentuation.

## Recommendations

Tools and input methods should use the Greek and Coptic versions (GREEK [CAPITAL|SMALL] LETTER [ALPHA|EPSILON|ETA|IOTA|OMICRON|UPSILON|OMEGA] WITH TONOS) for these character combinations. Fonts and search tools should continue to support both for the sake of legacy data.

<mark>The latest versions of Unicode (as of 2016) have now formally deprecated and removed the vowel+oxia combinations from the Greek extended range, leaving only the vowel+tonos from the basic Greek and Coptic range.</mark>