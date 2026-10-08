# JonnyType

Light-mode Monkeytype-inspired typing site with a hidden arcade.

## Run
Use a local server because the games page loads `games/manifest.json`.

```bash
cd jonnytype
python -m http.server 8000
```
Open http://localhost:8000

## Add games
Create `games/my-game/index.html`, then add an entry to `games/manifest.json`. The games page automatically creates the card and Play button.

## Arcade
Click the typing area 5 times within one second to open the games page.

## Firebase
`firebase-config.js` is ready for a Firebase Web App config. With blank values, the site uses local browser storage for testing. With Firebase configured, Email/Password Authentication and Firestore can store account/test data across devices. Configure Firestore Security Rules before public deployment.
