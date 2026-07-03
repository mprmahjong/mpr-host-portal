# mpr-host-portal

The GitHub Pages frontend used by Lukas to submit verified event results.

The M3 repoint branch replaces Google Sheets and Apps Script calls with the MPR platform's database
APIs. Lukas authorizes through the MPR admin login; the platform returns a short-lived portal token
to this GitHub Pages origin. No platform signing secret or long-lived API key belongs in this public
repository.

After a successful submission, **Undo this submission** calls the protected platform rollback API.
The platform restores the prior ratings only when no later result depends on that session; otherwise
it returns a conflict and leaves every rating unchanged.

For preview testing, append `?apiBase=https://<mpr-platform-preview>` to the GitHub Pages URL. The
default API origin is `https://mprmahjong.com`.
