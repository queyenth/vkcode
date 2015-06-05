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
var FONT_SIZE = 'font-size: 10px';
// Replace monospace with your favourite font
var FONT_FAMILY = "font-family: 'monaco for powerline'";
//
var TAB_TO_SPACE = "  ";

// List of all themes: https://github.com/queyenth/vkcode/tree/gh-pages/highlight.js/styles
//var THEME = 'agate';
//var THEME = 'androidstudio';
//var THEME = 'arta';
//var THEME = 'ascetic';
//var THEME = 'atelier-cave.dark';
//var THEME = 'atelier-cave.light';
//var THEME = 'atelier-dune.dark';
//var THEME = 'atelier-dune.light';
//var THEME = 'atelier-estuary.dark';
//var THEME = 'atelier-estuary.light';
//var THEME = 'atelier-forest.dark';
//var THEME = 'atelier-forest.light';
//var THEME = 'atelier-heath.dark';
//var THEME = 'atelier-heath.light';
//var THEME = 'atelier-lakeside.dark';
//var THEME = 'atelier-lakeside.light';
//var THEME = 'atelier-plateau.dark';
//var THEME = 'atelier-plateau.light';
//var THEME = 'atelier-savanna.dark';
//var THEME = 'atelier-savanna.light';
//var THEME = 'atelier-seaside.dark';
//var THEME = 'atelier-seaside.light';
//var THEME = 'atelier-sulphurpool.dark';
//var THEME = 'atelier-sulphurpool.light';
//var THEME = 'brown_paper';
//var THEME = 'brown_papersq.png';
//var THEME = 'codepen-embed';
//var THEME = 'color-brewer';
//var THEME = 'dark';
//var THEME = 'darkula';
//var THEME = 'default';
//var THEME = 'docco';
//var THEME = 'far';
//var THEME = 'foundation';
//var THEME = 'github';
//var THEME = 'github-gist';
//var THEME = 'googlecode';
//var THEME = 'hybrid';
//var THEME = 'idea';
//var THEME = 'ir_black';
//var THEME = 'kimbie.dark';
//var THEME = 'kimbie.light';
//var THEME = 'magula';
var THEME = 'mono-blue';
//var THEME = 'monokai';
//var THEME = 'monokai_sublime';
//var THEME = 'obsidian';
//var THEME = 'paraiso.dark';
//var THEME = 'paraiso.light';
//var THEME = 'pojoaque';
//var THEME = 'pojoaque.jpg';
//var THEME = 'railscasts';
//var THEME = 'rainbow';
//var THEME = 'school_book';
//var THEME = 'school_book.png';
//var THEME = 'solarized_dark';
//var THEME = 'solarized_light';
//var THEME = 'sunburst';
//var THEME = 'tomorrow';
//var THEME = 'tomorrow-night-blue';
//var THEME = 'tomorrow-night-bright';
//var THEME = 'tomorrow-night';
//var THEME = 'tomorrow-night-eighties';
//var THEME = 'vs';
//var THEME = 'xcode';
//var THEME = 'zenburn';

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

function createActualHTML(block) {
  $(block).html($(block).html().replace("&lt;code&gt;<br>", "<pre><code>").replace("&lt;/code&gt;", "</code></pre>"));
}

function replaceTabs() {
  createActualHTML($('.im_editable')[0]);
  var block = $('.im_editable pre code');
  block.html(block.html().replace(/^&nbsp;/g, ' '));
  // var lines = block.html().split(/<br>/g);
  // var firstLevel = lines[0].match(/<br> /g).length();
  while (blocl.html().match(/<br> /g) != null)
    block.html(block.replace(/<br>  /g, "<br>\t"))
  //alert("HI");
}

function parseMessage(block) {
  if ($(block).html().indexOf("&lt;/code&gt;") === -1) $(block).html($(block).html() + "<br>");
  createActualHTML(block);
  $(block).html($(block).html().replace(/\\t( )*/g, TAB_TO_SPACE));
  // TODO: replace all smiles, and remove all links, << >> etc
}

function highlightBlock(block) {
  if ($(block).html().indexOf("&lt;code&gt;<br>") > -1) {
    parseMessage(block);
    hljs.highlightBlock($(block).children('pre').children('code')[0]);
    hljs.lineNumbersBlock($(block).children('pre').children('code')[0]);
  }
}

function getImFromTr(trblock) {
  return $(trblock).find('.im_msg_text');
}

function IMMutationObserver() {
  var observer = new MutationObserver(
    function(mutations) {
      mutations.forEach(function(mutation) {
        for (var i = 0; i < mutation.addedNodes.length; i++) {
          var msg = getImFromTr(mutation.addedNodes[i]);
          msg.each(function(i, block) {
            highlightBlock(block);
          });
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

loadScript("https://code.jquery.com/jquery-2.1.4.min.js", function() {
  $(document).ready(function() {
    loadCss("https://queyenth.github.io/vkcode/highlight.js/styles/"+THEME+".css");
    initCssRules();
    loadScript("https://queyenth.github.io/vkcode/highlight.js/highlight.pack.js", function() {
      loadScript("https://queyenth.github.io/vkcode/highlight.js/highlightjs-line-numbers.min.js", function() {
        var checkIfChatPage = window.setInterval(function() {
          if ($(".im_tab_selected:visible").length) {
            var observer = IMMutationObserver();
            hljs.configure({useBR: true, tabReplace: '  '});
            highlightAllBlocksOnPage();
            window.setTimeout(function() {
              $("#im_dialogs").on("click", ".dialogs_row", function() {
                console.log("pressed chat!");
              });
            }, 500);
            $(".im_tab, .im_tab_selected").on("click", function() {
              console.log("pressed chat!");
              window.setTimeout(function() {
                highlightAllBlocksOnPage();
                observer.disconnect();
                observer = IMMutationObserver();
              }, 500);
            });
            $(".im_editable").on("keydown", function(event) {
              if (event.which == 13) {
                //event.preventDefault();
                replaceTabs();
              }
            });
          }
        }, 500);
      });
    });
  });
});
