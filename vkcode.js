// ==UserScript==
// @name        VK Code
// @namespace   vkcode
// @description VK Code Highlighter
// @include     https://vk.com/im*
// @include     http://vk.com/im*
// @version     1
// @grant       none
// ==/UserScript==
var loadScript = function(scriptSrc, callback) {
  var head = document.getElementsByTagName("head")[0];
  var js = document.createElement("script");
  js.type = "text/javascript";
  js.src = scriptSrc;
  
  js.onreadystatechange = callback;
  js.onload = callback;
  
  head.appendChild(js);
}

var loadCss = function(cssHref) {
  var head = document.getElementsByTagName("head")[0];
  var cssElement = document.createElement("link");
  cssElement.rel = "stylesheet";
  cssElement.href = cssHref;
  head.appendChild(cssElement);
}


var highlight = function() {
  hljs.configure({useBR: true, tabReplace: '  '});
  $('.im_msg_text').each(function(i, block) {
   $(block).html($(block).html().replace("&lt;code&gt;<br>", "<pre><code>").replace("&lt;/code&gt;", "</code></pre>"));
  });
  hljs.initHighlighting();
  $('pre').css('font-family', 'monospace');
  $('pre').css('font-size', 11);
  $('pre').css('margin', 0);
}

var jqueryloaded = function() {
  loadScript("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.6/highlight.min.js", highlight);
}

loadCss("https://highlightjs.org/static/styles/github.css");
loadScript("https://code.jquery.com/jquery-2.1.4.min.js", jqueryloaded);