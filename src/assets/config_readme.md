## Edc-help-ng Configuration

##### config.json file properties:

+ **"docPath"**: Path for documentation root folder
    
+ **"documentationStylePath"**: Path for the custom css file, used specifically for customizing the documentation style.

+ **"themeStylePath"**: Path for the application theme css file, to modify overall application style properties (header backgrounds, font colors...).

+ **"images"**: Paths for favicon and other logo images.
    
+ **"useHttpdServer"**: Set this property as true if you're using edc-help-ng along with edc-httpd project (https://github.com/tech-advantage/edc-httpd-java). edc-httpd serves the documentation while exposing an enhanced search web-service.

+ **"collapseTocAsDefault"**: Set this property as true if you want display TOC list collapsed by default.

+ **"displayFirstDocInsteadOfToc"**: Set this property as true if you want display the first Document when you click on a chapter.

+ **"fullHeightRightSidebarOnMobile"**: Set this property as true if you want display the right sidebar with a full height background instead of floating links box

##### Header logo size recommendations ("images.logo_header")
For better display results, use a logo with a positive width/height ratio (ideally with a value between 2 and 2.5).
