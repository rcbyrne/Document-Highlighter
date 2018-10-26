
# Document Annotator

Allows a user to enter their text and then make multiple annotations by highlighting a passage of text. Annotations are kept track of in a panel down the right-hand side, hovering over an annotation will isolate it in the document, clicking on an annotation will remove it.

## Installation

- `npm install`
- `npm start`

## Approach

The text is kept in model which keeps track of the combinations of annotations over segments of text. When a new annotation is added, it splits the model at the annotation start and annotation end - with all sections in between being marked with the new annotation. When displaying the model, sections with multiple annotations use a basic colour mixer to combine the colours so the user can visualise how the overlapping annotations run into each other.

## Code Terminology

I tried to be consistent with variable naming:

- Highlight: An annotation object
- Block: a section of the textModel
- RelativeOffset: Each block in the textModel keeps track of its offset from the start. Relative offset is the offset from the start of the block to the current location
- AbsoluteOffset: Absolute offset is the offset from the start of the text model
