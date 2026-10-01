# mpr-host-portal

For preview testing, append `?apiBase=https://<mpr-platform-preview>` to the GitHub Pages URL. The
default API origin is `https://mprmahjong.com`.

To click through a branch before it merges without touching the platform: `node dev/stub-server.mjs`,
then open `http://localhost:4173/dev-login` (access code `123456`, a made-up roster; a Submit is printed
to the terminal and rated nowhere).
