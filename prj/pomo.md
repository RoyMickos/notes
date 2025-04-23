---
id: pomo
aliases:
  - pomo
tags: []
---

2022-03-13  1311
Tags:[[compdev]]

---
# pomo
Go-backendillä oleva, ports-and-adapters ts-frontendillä varustettu "evernote".

Back-ending käynnistys google app engine emulaattorilla:
```sh
dev_appserver.py --support_datastore_emulator=true .
```
2022-W11

- saatu verifioitua google id tokenin allekirjoitus, vielä pitäisi verifioida claimit ohjeen mukaan
- sen jälkeen pitäisi konfiguroida ja generoida refresh ja access tokenitory
- kävi ilmi, ettei tokenin verifointi toiminutkaan:
- käytä "github.com/lestrrat-go/jwx/jwk" kirjastoa hakemaan  jwk-avaimet (siellä on autorefresh-ominaisuus myös)
- katso esimerkeistä miten avain haetaan ja muutetaan julkiseksi RSA-avaimeksi
- sen jälkeen joudut muuttamaan sen  rsa.PublicKey -structiksi, jonka palautat dekoodausfuntiolle

- saatu onnistuneesti verifioitua id token
- generoitu RSA avaimet refresh ja access tokenia varten
- seuraavaksi pem-tiedoston luku ja purku rsa private avaimeksi: https://medium.com/@Raulgzm/export-import-pem-files-in-go-67614624adc7
- tämä saatiin tehtyä primitiivifunktiona, seuraavaksi mietittävä tokenin generointi
- luetaan private key ja luodaan sen pohjalta refreshToken ja accessToken oliot, joilla generointi/verifiointi
- yhdellä structilla pitäisi pärjätä molempien kohdalla

- tehty TokenCreator.go, mutta jäi testaamatta kun piti tunkata cmp:n konfiguraatiota, joka teki devaamisesta mahdotonta.

Hackfest 2022:
  - tapeltu go:n jwt-kirjaston kanssa ja huolella. koko lauantai meni tämän kimpussa
    - jwt:t allekirjoitetaan privaattiavaimella ja verifoidaan julkisella avaimella
    - access token ja refresh token käyttää samaa infraa
    - openssh:lla generoidut avaimet ei kelvanneet, piti kaivaa netistä generoidut

16.10.2022
  - harjoiteltu taas us-näppisleiskaa
  - tehty go-bäkkärille muistinvarainen tietokanta ja se laitettu autentikoinnin taakse
  - seuraavksi mietittävä mitä seuraavaksi
    - jatketaan Note-mallin hieromista, jotta saadaan parempi käsitys mallin toimivuudesta
    - seuraava askel on note-mallin hiominen ja tallennus muistinvaraisesti

29.10.2022
  - jatkettu lisäämällä refresh-rajapinta. seuraavaksi note-collectionin parsinta niin että
    root löydetään muttei näytetä
  - puurakenne ei palvele muistioita, parempi pitää flättinä
    - pitäisikö kuitenkin pitää related-tyyppinen linkki jotta homma pysyisi mielenkiintoisena?

16.1.2023
  - lisätty solidjs-ui, mikä kävi suurin piirtin näppärasti
    - seuraavaksi pitäisi säätää login kohdilleen: dispose poistaa kaiken vanhan, myös login-tilan, joten
      pitäisi refaktoroida niin, ettei login-tila häivy tilasiirtymien kohdalla.
    - login-tilan kunnollinen käsittely: kirjautumisnappulaa ei pidä näyttää jos on jo kirjautunut, ja
      uloskirjauksen toteutus
    - sen jälkeen uuden noten teko ja talletus, perustoiminnallisuuden hieronta

21.1.2023
  - solidin kanssa toimittu, ja heti positiivinen fiilis, helpompaa tunkata kuin rectilla kun pääsi jyvälle.
  - reactin kanssa joutui heti säätämään ylimääräistä kun halusi saada loginin toimimaan nätisti, eikä vieläkään
    ole jiirissä

28.1.2023
  - fp-ts ja codeium
  - codeium oikeasti poistaa toistuvaa naputusta
  - fp-ts saatu oikenemaan ja pystytty uudelleenkäyttöön, mutta rivimäärä kasvoi
  - huomattu, että sovelluksesta puuttuu virheenkäsittely. jos notejen haku failaa, ilmoitus tulee lähinnä
    konsoliin. Mietittävä mikä olisi sopiva tila, ja miten haun epäonnistuminen propagoituisi appissa. mahdollinen
    Either - tyypin käyttö ?

24.2.2023
  - suunnittelua: fp-ts on oiennut mukavasti, nyt pitäisit säätää ui-näkymiä. opiskeltu tailwindia.
    - millaiset näkymät?
      - aloitetaan yksinkertaisesti: lista, jossa kaikki kortit, josta voi avata yksittäisen kortin ja sitten lisääminen.
        - laitetaanko working-tilalle oma tilakoneensa? kuullostaisi järkevältä, ennemmin kuin laittaisi erillisen mekanismin.
        - working -tilassa ajetaan omaa tilakonetta, jonka voisi tehdä samaan tyyliin kuin päätason tilakoneen.
          - tilat: list, view, edit, add

27.2.2023
  - tehty working-statelle oma tilakoneensa, ja poistettu joitakin virheitä
  - varsinainen tailwind - virittely jäänyt lähinnä dokujen lukemiseen

5.3.2023
  - tehty noottien näyttönäkymä ja listaus, sekä siirtymät. aloitettu editointinäkymää
  - tehty notejen validointirakennetta, ja mielestäni ihan ok onnistui, ei tosin piuhoitettu ui:hin kiinni vielä

16.4.2023
  - paranneltu formin tilanhallintaa, muttei ihan vielä "siellä". UI:ta täytyy vielä parantaa ja rutkasti.
  - jännä miten reaktiivisuus toimii solidissa: asioiden logittaminen konsoliin ei toimi, vaan pitää subscribata eventteihin
    jotta saa asiat toimahtelemaan

23.4.2023
  - leikitty tailwindillä, jotta saatiin textarea kasvamaan sopivaksi
  - sen jälkeen ihmetelty embedattavaa editoria, `editor.js` näyttäisi lupaavimmalta. se tekee koko sivusta editorin, sinne
    pitää titteli konffata erikseen, mutta se palauttaa jsonia jota voi prosessoida paremmin. toinen vaihtoehto olisi medium editor.
    markdown scene näyttää editor.js:llä heikolta, tutkittava vielä medium editoria, sielläkin on serialize muttei skemakuvausta
    Kysytty chatgpt:n arviota, sen mukaan editor.js olisi parempi tähän


30.4.2023
  - ensimmäinen editorjs viritys tehty.
    - koska css reset, ei eroa headerin ja paragraphin välillä, pitää tehdä omat pluginit, jotta saa tailwind-luokat kiinni ??

1.5.2023
  - tehty ensimmäinen custom plugin. viela mietittävä kannttaako näin jatkaa, vaiko vain käyttää spesiaali-css:ää kiertämään ongelmat
  - EditorJS plugareitten toteutus tehty primitiivi DOM-apien päälle, niin sitä voi käyttää myös reactin puolella.
  - seuraavaksi jatketaan plugarin tekoa ja piuhoitetaan validointi käyttämään domain-mallia
  - tutkittava, saadaanko tehtyä jotenkin idikaatio editorilla
  - miten markdown tähän istuu ja miten voidaan pastata rompetta

4.6.1012
  - kiillotusta: lisätään editointiin cancel
  - seuraavaksi tallennus viedään providerille, ja viimeistellään logiikkaa
    - kun tallennetaan, pidetäänkö yllä paikallista kopiota muistiinpanoista? Jos pidetään, niin silloin päivitetään paikallinen tila.
      tämä voisi olla notemanagerin luontevat tehtävä
    - tallennuksen jälkeen palataan listanäkymään jos onnistui
  - lisätään lista editoriin
  - sitten jatketaan tekemällä jatko palvelimelle, ja tutkitaan tallennusta tietokantaan.

31.12.2023
- tukossa sertifiointien takia, nyt takaisin
- tutkittu eri indentiteentinhallntajuttuja, alkuperäinen ratkaisu ok
- aloitetaan back-endin valmistelu deplua varten
  - cloud run + firestore, molemmat ovat free tierillä
  - muutettava sertien syöttö tapahtumaan envin kautta, ja tutkittava miten ne envit
    kannattaa tallentaa (secrets manager?)
  - frontin syöttö staattisena back-endiltä ja konffi (käytetäänkö frontin servaamisen omaa devserveriä vai ei)
  - tutkittava, kannattaisiko gorilla heittää mäkeen ja korvata peruskirjastolla
  - terraform perusjutut: mihin tila ja lukko googlella. ainoastaan kannan ja run infran
    perustaminen

21.1.2024
- perustettu ilmaistili googlelle
- tehty projekti sigma-icon ja laitettu sille identity platform, ja google identity provider
- jatkot:
  - selvitettävä golang rajapinta firebase
  - vaidetaan frontin kirjautuminen käyttämään identity platformia
  - enabloi cloud run ja aseta regionaksi europe/north
  - tehdään back-endin terraform-tutkimusta, infran (cloud run) deplu sillä - softapohjainen deplu
  - lisätään token headeriin ja tutkitaan back-endin validointia sille
  - lisätään firebase tietokanta
  - markdown jutut fronttiin
- aloitettu tunkkaus käyttämään firebase sdk:ta. eka popup tuotti seuraavaa:
  - popupit on defaulttina blokattu. hanskaa virhe. palauta asetus site settingseistä kun tunkkaat
  - tunkkaus päätyi redirect uri mismatch virheeseen
  - tehty muutos, mutta konfiguraatiomuutos voi viedä tunteja

28.1.2024
- tunkattu firebase authia, ratkaistu ongelma redirectUrlin kanssa (piti lisätä firebase app:n auth
  polku nodejs-osioon, wtf)
- tehty eka vedos firebasen auth middlewaresta serverin puolelle
  - jotta koodimuutoksilta vältyttäisiin, jouduttiin lataamaan service accountin priva-avain ja piilottamaan
    se repon ulkopuolelle. tehty .env filu go-appin juureen, jota tarkoitus käyttää start.sh:n tilalla
    tulevaisuudessa
  - seuraavaksi: tehdään clientin puolelle idTokenin lisäys auth-headeriin
  - tutkitaan mitä tietoa token sisältää jotta context voidaan alustaa sopivasti, ilmeisesti ainoastaa uid
    voidaan kaivaa ja alustaa. selvitettävä myös mistä rajapinnasta voi uid:n saada

4.2.2023
- Firebase id token verifivation serverillä ok
- Seuraavat askeleet:
  - tarkistetaan uuden noten tallennuksen polku ja viedään serverille asti. tehdään interface tietokantaopsia varten ellei ole jo, ja ehkä tutkaillaan unit testejä serverin puolella
  - tutkitaan varovasti firebasen liittämistä serverin puolella
  - ennenkuin oikeasti tallennetaan mitään pitäisi tunkata ui kuntoon ja miettiä mikä on tallennusformaatti, jos se ei ole markdown. sitten muutokset markdownin ja nykyisen ui:n välillä
  - tag-ominaisuus tarviaan vielä

9.2.2024
- jäätiin: user välitys contextin kautta, tokencreatorin poisto

11.2.2024
- viimeistelty userin välitys ja lisätty email noten tietomalliin
- vr:n uusi wifi sippasi kesken matkan, eikä vanhaa ole tarjolla, joten homma seis, pitänee
  tehdä versio ilman tunnistautumista devikäyttöä varten


25.2.2024
- edell update hävisi jonnekkin....
- tehty valmiiksi iniline html muunnokset, seuraavaksi vielä lisättävä headerit ja listat, jotta
  päästään tekemään eka kunnon versio
- mietittävä, miten tagit joidetaan: voiko lisätä leipätekstiin josta ne parsitaan vaiko eikö (oma kohtansa formissa)
- tehdään testimuunnos muutamalle evenoten tavaralle ja tutkitaan mitä tarvitaan vielä
  - editorjs tukee copy-pastea suoraan, tutki, voiko sitä spesialisoida
- vielä pitää ratkaista miten markdown rendataan näytölle ilman editointia, olisko editorjs:llä readonly?

3.3.2024
- saatu valmiiksi blokkien muutokset pelkällä headerilla. vaihdetting pois TWHeaderista, jonka voisi oikeastaan
  poistaa. EditorJS laittaa luokille valmiiksi well-known luokkanimet, tutkitaan miten tailwindillä saa ne muotoiltua
  tailwindhän poistaa muotoilut kaikilta tyyleiltä. samalla säädetään muotoilua muutenkin tehokkaammaksi
- lisätään, listat, quote
- hampaat irvessä laitetaan pomo toistaiseksi backburnerille, tehdään ensin pois nextjs kurssi ja aws certi
- kun frontti alkaa valmistua, aloitetellaan gcp:n terraform -kurssia
- mietitään pitäisikö backendistä tehdä lambda-versio dynamodb:lle

21.6.2024
- päädytty vaihtamaan dev-kurssin myötä aws alustalle, käyttäen lambdoja. Go edelleen pohjilla, mutta nyt pitäisi tutkia miten autentikointi tehdään. aws tili luotu

---
## References
1. 
