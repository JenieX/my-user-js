// ==UserScript==
// @name           jx-imdb-better-look
// @version        0.0.1
// @namespace      https://github.com/JenieX/user-js
// @description    Apply CSS style to make IMDb look better.
// @author         JenieX
// @match          https://www.imdb.com/title/*/
// @run-at         document-start
// @noframes
// @compatible     edge Violentmonkey
// @compatible     chrome Violentmonkey
// @supportURL     https://github.com/JenieX/user-js/issues
// @homepageURL    https://github.com/JenieX/user-js/tree/main/src/imdb-better-look
// @updateURL      https://github.com/JenieX/user-js/raw/main/dist/imdb-better-look/imdb-better-look.meta.js
// @downloadURL    https://github.com/JenieX/user-js/raw/main/dist/imdb-better-look/imdb-better-look.user.js
// @icon           https://www.google.com/s2/favicons?sz=64&domain=www.imdb.com
// @license        MIT
// ==/UserScript==

function addStyle(css, parent = document.documentElement) {
  const style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.textContent = css;
  parent.append(style);

  return style;
}

addStyle('#__next>section,#imdbHeader .ipc-page-content-container>:not(#suggestion-search-container):not(#home_img_holder),.ipc-page-grid--bias-left section:not([cel_widget_id=StaticFeature_Awards]):not([cel_widget_id=StaticFeature_VideosX]):not([cel_widget_id=StaticFeature_PhotosX]):not([cel_widget_id=StaticFeature_Cast]):not([cel_widget_id=StaticFeature_Storyline]):not([cel_widget_id=StaticFeature_DidYouKnowX]):not([cel_widget_id=StaticFeature_UserReviews]):not([cel_widget_id=StaticFeature_Details]):not([cel_widget_id=StaticFeature_Awards]):not([cel_widget_id=StaticFeature_Filmography]):not([cel_widget_id=StaticFeature_PersonalDetails]),[data-testid=hero-rating-bar__popularity],[data-testid=hero-rating-bar__user-rating],[data-testid=hero-subnav-bar-share-button],[data-testid=title-cast-styling-proupsell],div.ipc-title__actions,footer.imdb-footer{display:none}div[data-testid=Filmography]>section{display:block!important}div[data-testid=Filmography]>section div{border:unset}.ipc-accordion__item__header{background-color:#171717!important}.date-credits-accordion .accordion-item:after,.ipc-accordion__item__header-shadow,.ipc-accordion__item__header-shadow-cover{display:none}.ipc-page-grid--bias-left{display:block}@media screen and (min-width:1280px){.ipc-page-content-container--center{max-width:920px!important}}#ipc-wrap-background-id{background-color:#000}section *{color:#cacaca!important}section[data-testid=atf-wrapper-bg] .ipc-page-content-container>.ipc-page-background>div{display:none}section{background:unset!important;z-index:unset!important}.ipc-list-card--border-line,[data-testid=awards],section{background-color:#171717!important}.ipc-media--avatar-circle{border:2px solid #acacac}.ipc-list-card--border-speech{background-color:#171717;box-shadow:unset!important}.ipc-list-card--base.ipc-list-card--border-speech:after,.ipc-list-card--base.ipc-list-card--border-speech:before{display:none}button[data-testid=nm-ov-atl-sm]{background-color:#171717!important}button.ipc-overflowText-overlay{background:unset!important}button.ipc-overflowText-overlay svg{display:none}div[data-testid=review-featured-header]>div{background-color:#5b5b5b}div[data-testid=awards]{border-color:#5b5b5b}div[data-testid=awards]>div{background-color:#5b5b5b}');
// include
// /https:\/\/www\.imdb\.com\/title\/[^/]+\/(\?.+)?$/
// /https:\/\/www\.imdb\.com\/(title|name)\/[^/]+\/(\?.+)?$/
