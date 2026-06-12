Colour Matching Cartoon Game Prototype

Quick start

- Run `server.ps1` from the `c:\prototype` folder to start a local HTTP server.
- Open `http://localhost:8000/` in a browser.
- The page uses `prototype/data/characters.json` as a sample dataset (placeholder images).
- Replace image `url` fields in the JSON with Wikimedia Commons stable image URLs when available.

Notes

- The UI shows one character at a time with a randomly chosen greyed-out region (overlay). Use the Hue, Saturation and Contrast sliders to create a colour. The preview square shows the colour you are making.
- Press `Submit` to score (out of 10) against the canonical colour for the greyed region. After 5 characters the game ends.

I'll continue retrieving Wikimedia Commons links in parallel and update the dataset when found.
