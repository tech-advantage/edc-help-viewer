## Edc-help-ng Configuration

##### config.json file properties:

+ **"docPath"**: Path for documentation root folder
    
+ **"documentationStylePath"**: Path for the custom css file, used specifically for customizing the documentation style.

+ **"themeStylePath"**: Path for the application theme css file, to modify overall application style properties (header backgrounds, font colors...).

+ **"images"**: Paths for favicon and other logo images.

+ **"libsUrl"**: URL of libs (Own installation by default, but you can use the CDN)
  
  For Mathjax : [MathJax CDN](https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-MML-AM_CHTML)

**`contentSearch`**: Parameters for searches in document content
  + **`maxResultNumber`**: To set a limit of the number of results. Available only if *`enable`* is **true**.
  + **`matchWholeWord`**: To set if the results should match exactly with the search. Available only if *`enable`* is **true**.
  + **`matchCase`**: To set if the results should match with case sensitive. Available only if *`enable`* is **true**.
  + **`enable`**: Set this property as true and **`url`** empty if you're using edc-help-viewer along with edc-httpd project (https://github.com/tech-advantage/edc-httpd-java). edc-httpd serves the documentation while exposing an enhanced search web-service on the documentation content. Otherwise if you're using edc-electron-viewer the
  If *`enable`* is **false**, the search is done only on the titles.

+ **"collapseTocAsDefault"**: Set this property as true if you want display TOC list collapsed by default.

+ **"displayFirstDocInsteadOfToc"**: Set this property as true if you want display the first Document when you click on a chapter.

+ **"fullHeightRightSidebarOnMobile"**: Set this property as true if you want display the right sidebar with a full height background instead of floating links box

##### Header logo size recommendations ("images.logo_header")
For better display results, use a logo with a positive width/height ratio (ideally with a value between 2 and 2.5).
