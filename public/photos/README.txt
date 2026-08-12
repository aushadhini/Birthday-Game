# Drop memory photos here

The "Our Memories" gallery looks for these exact filenames:

  first-smile.jpg          -> Our first smile
  across-the-distance.jpg  -> Across the distance
  adventures.jpg           -> Adventures together
  your-laugh.jpg           -> Your laugh
  how-far-we-came.jpg      -> How far we came
  still-choosing-you.jpg   -> Still choosing you

Just save your photos with these names in this folder — no code changes needed.
Any name you skip shows the gradient placeholder card instead.

Best results: portrait crop, 4:5 ratio (e.g. 1080 x 1350), under ~500 KB each.
Using .png or .jpeg instead? Update the matching `src` in src/data/memories.js.

Quiz photos work the same way — reference them in src/data/quizQuestions.js as:
  /photos/your-file.jpg
