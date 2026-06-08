# Demo recording for `npx brignano`.
# Regenerate with:  vhs vhs/demo.tape   (requires: brew install vhs)
# Renders the gradient banner, the live card, menu navigation, and a contact QR.

Output demo.gif
Require node

Set Shell "zsh"
Set FontSize 14
Set Width 1000
Set Height 1000
Set Padding 20
Set Theme "Catppuccin Mocha"
Set TypingSpeed 55ms

# Launch the local build so the demo reflects this branch (not the published npm version).
Type "node dist/card.js"
Sleep 400ms
Enter

# Banner animation + card reveal + live GitHub stats.
Sleep 4s

# Walk down the menu to showcase the actions.
Down
Sleep 600ms
Down
Sleep 600ms
Down
Sleep 600ms
Down
Sleep 600ms
Down
Sleep 600ms
Down
Sleep 800ms

# Land on "Show a contact QR code" and select it.
Enter
Sleep 3s
