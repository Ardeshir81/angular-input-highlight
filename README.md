# angular-input-highlight
Highlight specified words in your input box

/  
  
  	written by Ardeshir81 <ardeshireo@gmail.com> https://github.com/Ardeshir81
  
  	TODO: add applying DEFAULT_CLASS in documentation
  	TODO: add 'if you ever faced a problem tell me' 'please' or something like that
  	TODO: add 'it does event listening and huge amount of javascript DOM manipulating and styling' 'use it on your own risk'
  	TODO: add 'being laggy on scroll' and 'not capturing anything beyound inline styling' in 'known issues' part
  	TODO: unbind on destroy
  	TODO: refactor styling functions so there are some constant styling that needs to be done once, some in the updateKeys(), and all of them in mutation observer
  
  	TODO: use something like this in documentation :
  			include angular, include'path/to/input-highlight.js' in your 'index.html' or 'whatever.html', inject module 'input-highlight-directive' to your module's dependencies,
  			and use input-highlight directive in your markup as explained below:
  
   this directive is applied on an input tag. it could take an object/an array/a string as argument.
   example:
            <input id="myInputTableSearch" placeholder="Search for names.." type="text"
 input-highlight="{'ali': 'redclass','reza': 'greenclass'}">
  
   based on the input, it applies .redclass to all 'ali's in the input text value and .greenclass to all 'reza's
  
   there had been hard work aligning the highlighted text to the original input value, therefore applying css
   properties like 'font-size', 'font-family', 'padding' and ... will make the inputHighlight to produce loosy
   results. therefore, it is suggested just to use 'color' or 'font-color' inside class definitions
  
   inputHighlight deifnes a default '.highlighted' class in case of array/string input argument.
   example:
            <input id="myInputTableSearch" placeholder="Search for names.." title="Type in a name" type="text"
 input-highlight="'maryam'">
            <input id="myInputTableSearch" placeholder="Search for names.." title="Type in a name" type="text"
 input-highlight="['amir','mahtab','mohsen']">
  
   based on the inputs a '.highlighted' class is applied to all 'maryam' words in first input and 'amir',
   'mahtab' and 'mohsen' in the second input
  
   do not forget to use these quotation marks around your strings : '''''' 'amir'
  
   regards, Ardeshir81
  /
