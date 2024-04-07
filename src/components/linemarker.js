// RedTextMarker.js
import { GutterMarker } from "@codemirror/view";

export class RedTextMarker extends GutterMarker {
  toDOM() {
    const span = document.createElement("span");
    span.style.color = "red"; // Set the text color to red
    span.textContent = "•"; // Example marker symbol
    return span;
  }
}


