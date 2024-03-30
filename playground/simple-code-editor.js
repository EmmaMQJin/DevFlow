var myCodeMirror = CodeMirror(document.getElementById('myCodeMirror'), {
    value: 'function myScript(){return 100;}\n',
    mode:  "javascript",
    lineNumbers: true
});

// Change the line number color for line 3
var lineNumber = 2; // CodeMirror line numbers are zero-indexed
var marker = document.createElement("div");
marker.style.color = "#ff0000"; // Red color for the line number
marker.innerHTML = lineNumber + 1; // Adjust for zero-index by adding 1

myCodeMirror.setGutterMarker(lineNumber, "CodeMirror-linenumbers", marker);
