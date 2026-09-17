# Fighting game

Static browser game. Publish this folder's CONTENTS at the root of a GitHub repository.

## Publish with GitHub Pages

1. Create an empty public repository, for example fighting-game.
2. Choose Add file > Upload files. Drag this folder's contents (index.html, JavaScript files, style.css, assets, and documentation) into the repository, preserving the assets subfolders. Use small batches (under 18 MiB total is a convenient target), committing each separately. Alternatively, clone the repository with GitHub Desktop, copy this folder's contents into the clone, commit, and push. Upload only these publishing files, never the entire working project or a ZIP. GitHub browser uploads accept at most 100 files per batch and 25 MiB per file; every file in this package is below that size. Do not upload a ZIP as the website.
3. Commit the upload to main. If the browser upload is inconvenient, use GitHub Desktop and copy these contents into its repository checkout.
4. Open Settings > Pages. Under Build and deployment choose Deploy from a branch, then main and /(root), and Save.
5. Wait for the deployment to finish. The address is https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/.

The entry file must be at the repository root, not inside another github-pages folder. No Node server, build action, database, or backend is needed on GitHub Pages. Paths are relative, so a repository subpath works. The click screen unlocks browser audio.

## Local preview

Serve this folder through a local HTTP server (for example python -m http.server 8000), then open http://localhost:8000/. This source-module edition should not be opened with file://. Your original Play.html in the working project remains the double-click edition.

## Included and excluded

Includes the runtime JS module graph, styles, loaded character/stage images and twelve audio samples used/preloaded by the current synth sound engine. Songs are synthesized in JavaScript.

Excludes FL9 Projects, FLP/MIDI files, source videos, old song WAV renders, quads-title.wav, alternate artwork not loaded by the game, art/audio base64 caches, old HTML snapshots, tools and tests. Some files named original or reference are required for runtime cutouts and face rendering and are deliberately retained. Recorded-music alternatives are not packaged; the current UI uses synth music.

## Asset notices

The entry screen requests Yu Gothic UI from the visitor's installed system fonts, with a sans-serif fallback. No font files are embedded or distributed. No new license for your code or artwork has been assigned.

## Updating

Keep composing/editing in the original working project. Re-run node tools/package-pages.mjs github-pages-next there to generate a new clean snapshot, then replace the repository contents from that snapshot. This packaging script never deletes the original project or overwrites an existing output folder.

Official guidance: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site and https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
