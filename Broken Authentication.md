2022-04-17
Tags:

---
# Broken Authentication

## Heikot salasanat
- Oletussanasanojen käyttö. Oletukset on tiedossa myös hyökkääjällä.
- Credential stuffing: käytät samaa/samoja salasanoja useassa palvelussa, jotka on helppoja muistaa koska et käytä salasanaohjelmaa. Jos salasanasi vuotaa, olet hävinnyt kaikki palvelut.

1. Multi-factor authentication.
2. Single-sign-on
3. Passwordless authentication
4. Disallow broken passwords
5. Countermeasures for automated credential stuffing: CAPCHA etc

Suositus on käyttää ulkopuolista autentikaatiota, sillä sen toteuttaminen turvallisesti on vaikeaa.

## Salasanojen tallenus
- salasanoille on dedikoidut hash-funktiot
- md5-hashejä löytyy verkosta, samoin kuin palveluita jotka kääntävät hashit stringiksi josta ne on laskettu

---
## References
1. [SecList of leaked passwords](https://github.com/danielmiessler/SecLists/tree/master/Passwords/Leaked-Databases)
2. [Pwned passwords API](https://haveibeenpwned.com/Passwords)
3. [Hashcat password generator](https://hashcat.net/hashcat/)
4. [Metric for measuring the ease of breaking a given password](https://github.com/dropbox/zxcvbn)
5. [CyberChef coding tools](https://gchq.github.io/CyberChef/)
6. [A guide to threat modelint](https://martinfowler.com/articles/agile-threat-modelling.html)
7. [Book: Real-world cryptography](https://www.manning.com/books/real-world-cryptography)
8. [CrackStation](https://crackstation.net/)
