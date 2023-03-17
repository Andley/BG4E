
## 圖析符號說明


形式 (form)、結構 (structure) 的符號  | 含意 
:---: | :----: 
<strong>粗體字</strong> | 動詞 
<em>斜體字</em> | 分詞 or 不定詞
  !! | 命令語氣動詞 
 [... ( ... « ... ‹ ... › ... » ... ) ...] | 片語、子句裡面的大中小括弧 
{ ... } | 內嵌子句
(...)⦇、⦈(...)  | 片語、子句的前半段、後半段 (hyperbaton)
⸉...⸊ | 調換字序 (word order) 之後的新位置
⸉⸊ | 調換字序 (word order) 之前的原本位置

功能 (function) 的符號  | 含意
:---: | :----: 
S/P/C/A| 主要子句、從屬子句的元素用大寫<br>S=主語; P=謂語; C=補語; A=狀語
s/p/c/a| 子句裡面內嵌子句的元素用小寫<br>s=主語; p=謂語; c=補語; a=狀語
= |  同位 (apposition)
+   | 補充 (complement) 、附帶說明 (epexegetical) 

意義 (meaning) 的符號  | 含意
:---: | :----: 
...xxx... | 從上下文推敲出來被省略掉的字詞
°¹、°²| 指向(修飾、連結)其他的字詞/片語
<mark>...°¹</mark>、<mark>...°²</mark>  | <mark>被</mark>指向 (修飾、連結) 的字詞/片語
⮥、⮧ |  指向上文、指向下文


段落 (paragraph) 的符號  | 含意
:---: | :----: 
═════════════| 大段落
————————| 中段落
⋯⋯⋯⋯⋯⋯⋯| 小段落
—— ... —— | 插入的段落

<div style='page-break-after: always;'></div>

#### 經文出處
- 都用英文縮寫，空一格，數字:數字 ⇒ 這樣 reference tagger 才會 work
- 編號 
	- 章節：
		- Chapter §57
			- §57.1
				- §57.1a
	- 例句：§57(1)


#### OpenText 2.0 未來長相

Christopher D. Land and Francis G. H Pang, “The Past, Present, and Future of the OpenText.Org Annotated Greek Corpus,” in _The Language and Literature of the New Testament: Essays in Honour of Stanley E. Porter’s 60th Birthday_, ed. Lois K. Fuller Dow, Craig Alan Evans, and Andrew W. Pitts, Biblical Interpretation Series Volume 150 (Leiden: Boston (Mass.) Brill, 2017), 92.

(1) 不改變 word-order，呈現希臘文 discontinuity (hyperbaton) 的特色
> In developing our XML format, we chose to *rigidly* maintain the canonical word order of the base texts being annotated.

- <rt>Mat 14:16</rt> <RUBY><ruby><ruby>Ὁ<rt>ὁ</rt></ruby><rt>-</rt></ruby><rt>T-NSM</rt></RUBY> <RUBY><ruby><ruby>δὲ<rt>δέ</rt></ruby><rt>And</rt></ruby><rt>CONJ</rt></RUBY> <RUBY><ruby><ruby>Ἰησοῦς<rt>Ἰησοῦς</rt></ruby><rt>Jesus</rt></ruby><rt>N-NSM-P</rt></RUBY> (<RUBY><ruby><ruby><strong>εἶπεν</strong><rt>ἔπω, ἐρῶ, εἶπον</rt></ruby><rt>said</rt></ruby><rt>V-AAI-3S</rt></RUBY>)P <RUBY><ruby><ruby>αὐτοῖς·<rt>αὐτός</rt></ruby><rt>to them</rt></ruby><rt>P-DPM</rt></RUBY>  
- Opentext 1.0 vs. 2.0 ![images/Pasted image 20230317084649.png](images/Pasted%20image%2020230317084649.png)

- <rt>Heb 10:1</rt> ⸉<RUBY><ruby><ruby>γὰρ<rt>γάρ</rt></ruby><rt>for</rt></ruby><rt>CONJ</rt></RUBY>⸊⮥⬎⬏
	- (<<RUBY><ruby><ruby>Σκιὰν<rt>σκιά</rt></ruby><rt>A shadow</rt></ruby><rt>N-ASF</rt></RUBY>>c... ⸉⸊<RUBY><ruby><ruby><em>ἔχων</em><rt>ἔχω</rt></ruby><rt>having</rt></ruby><rt>V-PAP-NSM</rt></RUBY>)A... (<RUBY><ruby><ruby>ὁ<rt>ὁ</rt></ruby><rt>the</rt></ruby><rt>T-NSM</rt></RUBY> <RUBY><ruby><ruby>νόμος<rt>νόμος</rt></ruby><rt>law</rt></ruby><rt>N-NSM</rt></RUBY>)S ...A(...c‹<RUBY><ruby><ruby>τῶν<rt>ὁ</rt></ruby><rt>of the</rt></ruby><rt>T-GPN</rt></RUBY> <RUBY><ruby><ruby><em>μελλόντων</em><rt>μέλλω</rt></ruby><rt>coming</rt></ruby><rt>V-PAP-GPN</rt></RUBY> <RUBY><ruby><ruby>ἀγαθῶν,<rt>ἀγαθός</rt></ruby><rt>good things</rt></ruby><rt>A-GPN</rt></RUBY>› ») <RUBY><ruby><ruby>οὐκ<rt>οὐ</rt></ruby><rt>not</rt></ruby><rt>PRT-N</rt></RUBY> <RUBY><ruby><ruby>αὐτὴν<rt>αὐτός</rt></ruby><rt>themselves</rt></ruby><rt>P-ASF</rt></RUBY> <RUBY><ruby><ruby>τὴν<rt>ὁ</rt></ruby><rt>the</rt></ruby><rt>T-ASF</rt></RUBY> <RUBY><ruby><ruby>εἰκόνα<rt>εἰκών</rt></ruby><rt>form</rt></ruby><rt>N-ASF</rt></RUBY> <RUBY><ruby><ruby>τῶν<rt>ὁ</rt></ruby><rt>of the</rt></ruby><rt>T-GPN</rt></RUBY> <RUBY><ruby><ruby>πραγμάτων,<rt>πρᾶγμα</rt></ruby><rt>things</rt></ruby><rt>N-GPN</rt></RUBY> <RUBY><ruby><ruby>κατ᾽<rt>κατά</rt></ruby><rt>each</rt></ruby><rt>PREP</rt></RUBY> <RUBY><ruby><ruby>ἐνιαυτὸν<rt>ἐνιαυτός</rt></ruby><rt>year</rt></ruby><rt>N-ASM</rt></RUBY> <RUBY><ruby><ruby>ταῖς<rt>ὁ</rt></ruby><rt>with the</rt></ruby><rt>T-DPF</rt></RUBY> <RUBY><ruby><ruby>αὐταῖς<rt>αὐτός</rt></ruby><rt>same</rt></ruby><rt>P-DPF</rt></RUBY> <RUBY><ruby><ruby>θυσίαις<rt>θυσία</rt></ruby><rt>sacrifices</rt></ruby><rt>N-DPF</rt></RUBY> <RUBY><ruby><ruby>ἃς<rt>ὅς, ἥ</rt></ruby><rt>which</rt></ruby><rt>R-APF</rt></RUBY> (<RUBY><ruby><ruby><strong>προσφέρουσιν</strong><rt>προσφέρω</rt></ruby><rt>they offer</rt></ruby><rt>V-PAI-3P</rt></RUBY>)P <RUBY><ruby><ruby>εἰς<rt>εἰς</rt></ruby><rt>to</rt></ruby><rt>PREP</rt></RUBY> <RUBY><ruby><ruby>τὸ<rt>ὁ</rt></ruby><rt>the</rt></ruby><rt>T-ASN</rt></RUBY> <RUBY><ruby><ruby>διηνεκὲς<rt>διηνεκής</rt></ruby><rt>continuous</rt></ruby><rt>A-ASN</rt></RUBY> <RUBY><ruby><ruby>οὐδέποτε<rt>οὐδέποτε</rt></ruby><rt>never</rt></ruby><rt>ADV</rt></RUBY> (<RUBY><ruby><ruby><strong>δύναται</strong><rt>δύναμαι</rt></ruby><rt>is able</rt></ruby><rt>V-PNI-3S</rt></RUBY>)P <RUBY><ruby><ruby>τοὺς<rt>ὁ</rt></ruby><rt>those</rt></ruby><rt>T-APM</rt></RUBY> <RUBY><ruby><ruby><em>προσερχομένους</em><rt>προσέρχομαι</rt></ruby><rt>drawing near</rt></ruby><rt>V-PNP-APM</rt></RUBY> <RUBY><ruby><ruby><em>τελειῶσαι·</em><rt>τελειόω</rt></ruby><rt>to perfect</rt></ruby><rt>V-AAN</rt></RUBY> 
- Opentext 1.0 ![images/Pasted image 20230317084752.png](images/Pasted%20image%2020230317084752.png)
- Opentext 2.0 ![images/Pasted image 20220611064936.png](images/Pasted%20image%2020220611064936.png)




(2) 把冠詞、分詞內嵌子句分開來
- Opentext 1.0 vs 2.0 ![images/Pasted image 20220611063614.png](images/Pasted%20image%2020220611063614.png)

