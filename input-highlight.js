/**
 *
 *    written by Ardeshir81 <ardeshireo@gmail.com> https://github.com/Ardeshir81
 *
 *    TODO: add applying DEFAULT_CLASS in documentation
 *    TODO: add 'if you ever faced a problem tell me' 'please' or something like that
 *    TODO: add 'it does event listening and huge amount of javascript DOM manipulating and styling' 'use it on your own risk'
 *    TODO: add 'being laggy on scroll' and 'not capturing anything beyound inline styling' in 'known issues' part
 *    TODO: unbind on destroy TODO: add direction to style copyiong
 *    TODO: refactor styling functions so there are some constant styling that needs to be done once, some in the updateKeys(), and all of them in mutation observer
 *
 *    TODO: use something like this in documentation :
 *            include angular, include'path/to/input-highlight.js' in your 'index.html' or 'whatever.html', inject module 'input-highlight-directive' to your module's dependencies,
 *            and use input-highlight directive in your markup as explained below:
 *
 * this directive is applied on an input tag. it could take an object/an array/a string as argument.
 * example:
 *          <input id="myInputTableSearch" placeholder="Search for names.." type="text"
 input-highlight="{'ali': 'redclass','reza': 'greenclass'}">
 *
 * based on the input, it applies .redclass to all 'ali's in the input text value and .greenclass to all 'reza's
 *
 * there had been hard work aligning the highlighted text to the original input value, therefore applying css
 * properties like 'font-size', 'font-family', 'padding' and ... will make the inputHighlight to produce loosy
 * results. therefore, it is suggested just to use 'color' or 'font-color' inside class definitions
 *
 * inputHighlight deifnes a default '.highlighted' class in case of array/string input argument.
 * example:
 *          <input id="myInputTableSearch" placeholder="Search for names.." title="Type in a name" type="text"
 input-highlight="'maryam'">
 *          <input id="myInputTableSearch" placeholder="Search for names.." title="Type in a name" type="text"
 input-highlight="['amir','mahtab','mohsen']">
 *
 * based on the inputs a '.highlighted' class is applied to all 'maryam' words in first input and 'amir',
 * 'mahtab' and 'mohsen' in the second input
 *
 * do not forget to use these quotation marks around your strings : '''''' 'amir'
 *
 * regards, Ardeshir81
 */

angular.module('input-highlight-directive', []);

angular.module('input-highlight-directive').directive('inputHighlight', function () {

    let DEFAULT_CLASS = "highlighted";

    let checkString = function (input) {
        return (input !== "" && input !== null && input !== undefined);
    };

    //styling functions
    let doStyling1 = function (elem, div) {
        //positioning the div as input
        div.style.top = elem.offsetTop + 'px';
        div.style.left = elem.offsetLeft + 'px';
        //div.style.left = parseInt(div.style.left) + (div.scrollLeft - elem.scrollLeft ) + 'px';
        div.style.textIndent = '-' + elem.scrollLeft + 'px';
    };
    let doStyling2 = function (elem, div) {
        let inputStyle = getComputedStyle(elem);
        //setting padding
        div.style.paddingTop = inputStyle['padding-top'];
        div.style.paddingLeft = inputStyle['padding-left'];
        div.style.paddingRight = inputStyle['padding-right'];
        div.style.paddingBottom = inputStyle['padding-bottom'];
        if (checkString(inputStyle['padding'])) {
            div.style.padding = inputStyle['padding'];
        }

        //setting border
        div.style.borderTopColor = 'rgba(0,0,0,0)';
        div.style.borderTopStyle = inputStyle['border-top-style'];
        div.style.borderTopWidth = inputStyle['border-top-width'];
        div.style.borderLeftColor = 'rgba(0,0,0,0)';
        div.style.borderLeftStyle = inputStyle['border-left-style'];
        div.style.borderLeftWidth = inputStyle['border-left-width'];

        //other stylings
        div.style.pointerEvents = "none";
        div.style.fontSize = inputStyle["font-size"];
        div.style.width = inputStyle['width'];
        div.style.height = inputStyle['height'];
        div.style.fontFamily = inputStyle["font-family"];
        div.style.lineHeight = inputStyle["line-height"];
        div.style.direction = inputStyle['direction'];
        div.style.float = inputStyle['float'];
        if (inputStyle["zIndex"]) {
            div.style.zIndex = inputStyle["zIndex"];
        }
        else {
            div.style.zIndex = "10";
        }
    };

    return {
        restrict: 'A',
        scope: {
            inputHighlight: '=',
            escapeCharacter: '='
        },
        link: function (scope, elem, attr) {
            //initializing variables
            let result = document.createElement("span"); //this is where the fake text will be put in
            result.style.display = "block";
            let keywords = {};
            result.style.overflow = "hidden";
            let div = document.createElement("div"); //this is a wrapper around where the fake text will be put in, so it will handle overflowing

            //TODO: maybe move these into a seperate function
            div.style.position = "absolute";
            div.style.display = "inline-block";
            div.style.whiteSpace = "nowrap";
            div.style.overflow = "hidden";
            div.setAttribute("id", "highlighted");
            div.appendChild(result);
            elem.after(div);

            //styling 1
            doStyling1(elem[0], div);

            //binding and watching changes of attributes
            scope.$watchCollection(attr.inputHighlight, function (newValue) { //there could be a 2nd argument oldValue
                if (angular.isArray(newValue)) {
                    angular.forEach(newValue, function (keyword) {
                        keywords[keyword] = DEFAULT_CLASS;
                    });
                } else if (angular.isString(newValue)) {
                    keywords[newValue] = DEFAULT_CLASS;
                } else {
                    keywords = newValue;
                }
                updateKeys();
            });

            let bindedEvents = elem.bind('blur change focus focusin focusout keydown keypress keyup select drag dragend dragleave input drop', updateKeys);

            //main method of angular input highlight directive that updates the dom
            function updateKeys(e) {

                //phase 1 of 3 : initializing
                let escape = attr.escapeCharacter;
                let txt = elem[0].value;
                angular.forEach(keywords, function (value, key) {
                    if (key.length > 1) {
                        txt = txt.replace(new RegExp(key, "g"), "<span class='" + value + "'>" + key + "</span>");
                    }
                    else {
                        if (!escape) {
                            txt = txt.replace(new RegExp('[' + key + ']', "g"), "<span class='" + value + "'>" + key + "</span>");
                        }
                        else {
                            //txt = txt.replace(new RegExp('[^' + escape + '][' + key + ']', "g"), "<span class='" + value + "'>" + key + "</span>");
                            txt = txt.replace(new RegExp(key + '(?!' + escape + ')', "g"), "<span class='" + value + "'>" + key + "</span>");
                        }
                    }

                });
                result.innerHTML = txt;

                //phase 2 of 3: stylizing
                doStyling1(elem[0], div);
                doStyling2(elem[0], div);
                if (e) {
                    if (e.type === "blur") {
                        div.style.textIndent = 0;
                    }
                }

                //watching input inline style changes
                //TODO: cant watch stylesheet style changes, or anything else beyond inline style
                let observer = new MutationObserver(function (mus) {
                    doStyling1(elem[0], div);
                    doStyling2(elem[0], div);
                });
                let mutWatchObject = {
                    childList: true,
                    attributes: true,
                    characterData: true,
                    subtree: true,
                    oldAttributes: true,
                    oldCharacterData: true,
                    attributeFilter: ['style']
                };
                observer.observe(elem[0], mutWatchObject);
            }

            //phase 3 of 3:finalizing
            scope.$on('$destroy', function () {
                bindedEvents.unbind();
            })
        }
    };
});
