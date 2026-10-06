# JonnyType

A no-backend Monkeytype-inspired typing site with a light UI and a hidden games area.

Files:
- index.html - typing site
- styles.css - shared styling
- script.js - typing tests, local accounts, stats, export
- games.html - clean games area
- games.js - games + shared local account scores

Run it by opening index.html in a browser or serving the folder with a local web server.

Important:
This is intentionally no-backend. Accounts and passwords are stored in localStorage, so they are NOT real secure accounts. Data is tied to the browser/device and can disappear if browser storage is cleared. Anyone who can inspect the browser storage can access it. Do not use a real password here.

The five-click easter egg is implemented on the typing screen. Five clicks within one second opens games.html.
