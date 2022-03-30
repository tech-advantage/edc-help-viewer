# edc-help-viewer
edc is a powerful tool for agile-like documentation management.

Learn more about edc at [https://www.easydoccontents.com](https://www.easydoccontents.com).

This project provides a viewer to navigate edc documentations.

## edc Version

Current release is compatible with edc v3+

## Building the project

Distribution files can be found in the [release assets section](https://github.com/tech-advantage/edc-help-viewer/releases/)

Please note that it comes with a **"/help/"** base href, so url after deployment should be **"yourBaseUrl/help/"**

If you need to make your own build :

Make sure you have [nodeJS](https://nodejs.org/en/) (version 10.9 or greater) available on your system.

Install project dependencies:

```bash
$ npm install
```

Build the project with the `--base-href` parameter: this will specify the path where the viewer will be deployed:

```bash
$ npm run build -- --prod --base-href /help/
```


Output files will be generated in the **"./dist"** folder, at the project root.

You can then deploy the application : again, please verify the help viewer url matches the provided `base href` parameter.
If the base href is **"/help/"**, the application will expect to be running at the url: 

**"yourBaseUrl/help/"**

## Running the project locally

To run the project locally

Install dependencies:

```bash
$ npm install
```

Then run the project:

```bash
$ npm run start
```

The dev server should be listening at **http://localhost:4200/help/**

## Edc-help-viewer Configuration

The **config.json** file present in the **assets** folder defines the application's settings.

The application loads the configuration at startup, so you can still modify the file after the build.

One important information is the documentation path property `docPath`, for reaching the deployed documentation.

As an example, with the default value (**"/doc"**), the viewer will try to load the documentation from the url:  **"yourBaseUrl/doc/"**.

#### Available settings properties:

+ **`docPath`**: Path for documentation root folder
    
+ **`documentationStylePath`**: Path for the custom css file, used specifically for customizing the documentation style.

+ **`themeStylePath`**: Path for the application theme css file, to modify overall application style properties (header backgrounds, font colors...).

+ **`images`**: Paths for favicon and other logo images. More information below.
    
+ **`libsUrl`**: URL of libs (Own installation by default, but you can use the CDN)
  
  For Mathjax : [MathJax CDN](https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-MML-AM_CHTML)

+ **`search`**: Parameters for searches in search area
+ **`limit`**: To set a limit of the number of results
+ **`exact-match`**: To set if the results should match exactly with the search

+ **`useHttpdServer`**: Set this property as true if you're using edc-help-ng along with edc-httpd project (https://github.com/tech-advantage/edc-httpd-java). edc-httpd serves the documentation while exposing an enhanced search web-service.

+ **`collapseTocAsDefault`**: Set this property as true if you want to display TOC list collapsed by default.

+ **`displayFirstDocInsteadOfToc`**: Set this property as true if you want to display the first Document when you click on a chapter.

+ **`fullHeightRightSidebarOnMobile`**: Set this property as true if you want display the right sidebar with a full height background instead of floating links box

## Logos and style customization

#### Images

To replace the default images you just need to change their path in the config.json file's `images` attribute:

**`favicon`** The page favicon image.

**`logo_header`** Logo for the header - for better display results, we recommend using a logo with a positive width/height ratio.

**`logo_info`** Image for the information page, when the content could not be found.

#### Custom style

You can personalize the global style by changing the theme file path `themeStylePath` and load your own file.

More specific style customizations can be done by modifying the **style/custom.css** file.
