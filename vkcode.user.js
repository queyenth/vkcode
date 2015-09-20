// ==UserScript==
// @name        VK Code
// @namespace   vkcode
// @description VK Code Highlighter
// @author      Queyenth
// @icon        https://raw.github.com/queyenth/vkcode/master/Icon.png
// @updateURL   https://raw.github.com/queyenth/vkcode/master/vkcode.user.js
// @include     *vk.com/*
// @version     1.0
// @grant       none
// ==/UserScript==

// Replace 12 with any size you want
var FONT_SIZE = 'font-size: 10px';
// Replace monospace with your favourite font
var FONT_FAMILY = "font-family: monospace";
// Width control css rules
var ADDITIONAL_CSS_RULES = 'width: 45em';
//
var TAB_TO_SPACE = "  ";

// List of all themes: https://github.com/queyenth/vkcode/tree/gh-pages/highlight.js/styles
var THEME = 'mono-blue';

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
  addCSSRule(sheet, 'pre', ADDITIONAL_CSS_RULES);
  addCSSRule(sheet, 'pre code', FONT_FAMILY);
  addCSSRule(sheet, 'pre', FONT_SIZE);
  addCSSRule(sheet, 'pre', 'margin: 0;');
  addCSSRule(sheet, '.hljs', 'padding: 1em !important;');
}

function replaceSmiles(block) {
  var smiles = {};
  smiles['D83DDE0A'] = ":-)"; smiles['D83DDE06'] = "xD"; smiles['D83DDE12'] = ":-("; smiles['D83DDE28'] = ":O";
  smiles['D83DDE03'] = ":-D"; smiles['D83DDE09'] = ";-)"; smiles['D83DDE1C'] = ";-P"; smiles['D83DDE0B'] = ":-p";
  smiles['D83DDE0D'] = "8-)"; smiles['D83DDE0E'] = "B-)"; smiles['D83DDE0F'] = ";-]"; smiles['D83DDE14'] = "3(";
  smiles['D83DDE22'] = ":'("; smiles['D83DDE2D'] = ":_("; smiles['D83DDE29'] = ":(("; smiles['D83DDE10'] = ":|";
  smiles['D83DDE0C'] = "3-)"; smiles['D83DDE07'] = "O:)"; smiles['D83DDE30'] = ";o"; smiles['2764'] = "<3";
  smiles['D83DDE32'] = "8o"; smiles['D83DDE33'] = "8|"; smiles['D83DDE37'] = ":X"; smiles['D83DDE1A'] = ":-*";
  smiles['D83DDE20'] = ">)"; smiles['D83DDE21'] = ">))"; smiles['D83DDE08'] = "}-)"; smiles['D83DDC4D'] = ":like:";
  smiles['D83DDC4E'] = ":dislike:"; smiles['261D'] = ":up:"; smiles['270C'] = ":v:"; smiles['D83DDC4C'] = ":ok:";
  $(block).find('.emoji_css').each(function(i, block) {
    block.outerHTML = smiles[$(block).attr('emoji')];
  });
}

function replaceSpecialChars(block) {
  $(block).find('a').each(function(i, block) {
    block.outerHTML = block.innerHTML;
  });
  $(block).html($(block).html().replace(/»/g, ">>").replace(/«/g, "<<"));
}

function createActualHTML(block) {
  $(block).html($(block).html().replace("&lt;vkcode&gt;<br>", "<pre><code>").replace("&lt;/vkcode&gt;", "</code></pre>"));
  replaceSpecialChars(block);
  replaceSmiles(block);
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
  if ($(block).html().indexOf("&lt;/vkcode&gt;") === -1) $(block).html($(block).html() + "<br>");
  createActualHTML(block);
  $(block).html($(block).html().replace(/\\t( )*/g, TAB_TO_SPACE));
  // TODO: replace all smiles, and remove all links, << >> etc
}

function highlightBlock(block) {
  if ($(block).html().indexOf("&lt;vkcode&gt;<br>") > -1) {
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
  var inChat = false;
  $(document).ready(function() {
    loadCss("https://queyenth.github.io/vkcode/highlight.js/styles/"+THEME+".css");
    initCssRules();
    loadScript("https://queyenth.github.io/vkcode/highlight.js/highlight.pack.js", function() {
      loadScript("https://queyenth.github.io/vkcode/highlight.js/highlightjs-line-numbers.min.js", function() {
        var checkIfChatPage = window.setInterval(function() {
          if ($(".im_tab_selected:visible").length && !inChat) {
            inChat = true;
            var observer = IMMutationObserver();
            hljs.configure({useBR: true, tabReplace: '  '});
            highlightAllBlocksOnPage();
            $(".im_tab, .im_tab_selected").on("click", function() {
              window.setTimeout(function() {
                highlightAllBlocksOnPage();
                observer.disconnect();
                //observer.observe($('.im_log_t tbody:visible')[0] {childList: true});
                observer = IMMutationObserver();
              }, 500);
            });
            $(".im_editable").on("keydown", function(event) {
              if (event.which == 13) {
                //event.preventDefault();
                //replaceTabs();
              }
            });
          }
          else {
            inChat = false;
          }
        }, 500);
      });
    });
  });
});
