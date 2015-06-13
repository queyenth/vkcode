# VKcode
VK Code Highlighter

## Install
1. Chrome
  * Install [tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo/related?hl=ru)
  * Go to [vkcode script](https://raw.githubusercontent.com/queyenth/vkcode/master/vkcode.user.js)
  * Press install
  * Profit
2. Firefox
  * Install [greasemonkey](https://addons.mozilla.org/en-us/firefox/addon/greasemonkey/)
  * Go to [vkcode script](https://raw.githubusercontent.com/queyenth/vkcode/master/vkcode.user.js)
  * Press install
  * Profit

## How to use
Just wrap your code inside vkcode tag and use \t to set tabs (will be automated later)  
Example:
```
<vkcode>
if (somethingWrong) {
\t doNothing();
} else {
\t doSomethingImportant();
}
</vkcode>
```
![](https://raw.github.com/queyenth/vkcode/master/screenshot.png)

## Customize
Open preferences of vkcode script and change FONT_FAMILY, FONT_SIZE, THEME to what you like.
