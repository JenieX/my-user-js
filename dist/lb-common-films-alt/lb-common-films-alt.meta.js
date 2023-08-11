// ==UserScript==
// @name           jx-letterboxd-common-films-alt
// @version        0.0.2
// @namespace      https://github.com/JenieX/user-js
// @description    Discover users on Letterboxd with similar movie tastes
// @author         JenieX
// @match          https://letterboxd.com/*/films/*
// @match          https://letterboxd.com/*/followers/*
// @match          https://letterboxd.com/*/following/*
// @match          https://letterboxd.com/film/*/fans/*
// @match          https://letterboxd.com/film/*/likes/*
// @match          https://letterboxd.com/film/*/members/*
// @grant          GM.registerMenuCommand
// @grant          GM.setValue
// @grant          GM.getValue
// @require        https://unpkg.com/@popperjs/core@2.11.8/dist/umd/popper.min.js
// @require        https://unpkg.com/tippy.js@6.3.7/dist/tippy-bundle.umd.js
// @run-at         document-start
// @noframes
// @compatible     edge Violentmonkey
// @compatible     chrome Violentmonkey
// @supportURL     https://github.com/JenieX/user-js/issues
// @homepageURL    https://github.com/JenieX/user-js/tree/main/src/user-js/lb-common-films-alt
// @updateURL      https://github.com/JenieX/user-js/raw/main/dist/lb-common-films-alt/lb-common-films-alt.meta.js
// @downloadURL    https://github.com/JenieX/user-js/raw/main/dist/lb-common-films-alt/lb-common-films-alt.user.js
// @icon           https://www.google.com/s2/favicons?sz=64&domain=letterboxd.com
// @license        MIT
// ==/UserScript==
