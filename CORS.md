2022-03-06  2156
Tags: [[go]][[compdev]]

---
# CORS
CORS käyttää simple ja non-simple kyselyitä. Non-simple vaatii preflight (OPTIONS) -kutsun jo sillä, että siinä on `application/json` content-typenä, ja itse `Content-type` pitää määrittää sallituksi headeriksi.

---

## References
1. [MDN on Cors](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#what_requests_use_cors)
