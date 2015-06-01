// ==UserScript==
// @name        VK Code
// @namespace   vkcode
// @description VK Code Highlighter
// @author      Queyenth
// @include     *vk.com/*
// @version     1
// @grant       none
// ==/UserScript==

// Replace 12 with any size you want
var FONT_SIZE = 'font-size: 12px';
// Replace monospace with your favourite font
var FONT_FAMILY = 'font-family: consolas';

// Available themes: default, solarized_dark, solarized_light, github,
// railscasts, monokai_sublime, mono-blue, tomorrow, color-brewer, zenburn
var THEME = 'mono-blue';
var TAB_TO_SPACE = 2;

// Creating a new stylesheet
var sheet = (function() {
  var style = document.createElement("style");
  // WebKit hack 
  style.appendChild(document.createTextNode(""));
  document.head.appendChild(style);
  
  return style.sheet;
})();

function loadScript(scriptSrc, callback) {
  var head = document.getElementsByTagName("head")[0];
  var js = document.createElement("script");
  js.type = "text/javascript";
  js.src = scriptSrc;
  
  js.onreadystatechange = callback;
  js.onload = callback;
  
  head.appendChild(js);
}

function loadCss(cssHref) {
  var head = document.getElementsByTagName("head")[0];
  var cssElement = document.createElement("link");
  cssElement.rel = "stylesheet";
  cssElement.href = cssHref;
  head.appendChild(cssElement);
}

function addCSSRule(sheet, selector, rules, index) {
  if ("insertRule" in sheet) {
    sheet.insertRule(selector + "{" + rules + "}", index);
  }
  else if ("addRule" in sheet) {
    sheet.addRule(selector, rules, index);
  }
}

function initCssRules() {
  addCSSRule(sheet, 'pre', FONT_FAMILY);
  addCSSRule(sheet, 'pre code', FONT_FAMILY);
  addCSSRule(sheet, 'pre', FONT_SIZE);
  addCSSRule(sheet, 'pre', 'margin: 0;');
  addCSSRule(sheet, '.hljs', 'padding: 1em !important;');
}

function highlightBlock(block) {
  if ($(block).html().indexOf("&lt;code&gt;<br>") > -1) {
    console.log(block);
    $(block).html($(block).html().replace("&lt;code&gt;<br>", "<pre><code>").replace("&lt;/code&gt;", "</code></pre>"));
    hljs.highlightBlock($(block).children('pre').children('code')[0]);
  }
}

function getImFromTr(trblock) {
  return $(trblock).children('.im_log_body').children('.wrapped').children('.im_msg_text')[0];
}

function IMMutationObserver() {
  var observer = new MutationObserver(
    function(mutations) {
      mutations.forEach(function(mutation) {
        for (var i = 0; i < mutation.addedNodes.length; i++) {
          highlightBlock(getImFromTr(mutation.addedNodes[i]));
        }
      });
    }
  );
  observer.observe($('.im_log_t tbody:visible')[0], {childList: true});
  return observer;
}

function highlightAllBlocksOnPage() {
  $('.im_msg_text').each(function(i, block) {
    highlightBlock(block);
  });
}

function highlight() {
  var observer = IMMutationObserver();
  hljs.configure({useBR: true, tabReplace: '  '});
  console.log($('.im_log_t tbody:visible')[0]);
  highlightAllBlocksOnPage();
  $(".im_tab, .im_tab_selected").on("click", function() {
    window.setTimeout(function() {
      highlightAllBlocksOnPage();
      observer.disconnect();
      observer = IMMutationObserver();
    }, 500);
    //window.setTimeout(observer.observe($('.im_log_t tbody:visible')[0], {childList: true}), 500);
  });
}

var jqueryloaded = function() {
  $(document).ready(function() {
    loadCss("https://highlightjs.org/static/styles/"+THEME+".css");
    initCssRules();
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.6/highlight.min.js", highlight);
  });
}

loadScript("https://code.jquery.com/jquery-2.1.4.min.js", jqueryloaded);
