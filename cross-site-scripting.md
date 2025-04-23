2022-04-03
Tags:

---
# cross-site-scripting (XSS)

Websivu tai komponentti siinä voidaan rendata tavalla joka sallii koodin injektion. Aina kun syöte laitetaan sivulle tarkistamatta, syntyy tietoturvareikä. XSS-haavoittuvuuksia on kahta tyyppiä:
1. Reflected - urliin voidaan syötää query parametreja, jotka redautuessaan sivulle suorittavat koodia: example.com?username=<script>alert(1)</script>
2. Stored - Formista syötetty data on vaarallista, kun se rendataan sivulle. Esim. jos laittaa osoitekentän arvoksi `alert(1)`:n
Ongelma on myös siinä, että sivulla oleva koodi näkee kaiken saman domainin sivulla olevat resurssit, kuten cookiet.
---
## References
1. [Payloads All the Things - list of xss tricks](https://github.com/swisskyrepo/PayloadsAllTheThings)
2. [OWASP XSS cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
