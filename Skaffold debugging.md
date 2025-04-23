2022-08-05
Tags:

---
# Skaffold debugging

Skaffoldin käynnistys epäonnistuu client-side throttling virheiden takia. Samalla natsin hearbeatit epäonnistuvat.

Vika lienee todennäköisimmin meidän koodin nats-setupissa (?). Joka tapauksessa tähän ajauduttiin, kun yritin saada feilaavia customer-syncerin integrointitestejä ajoon mutta skaffold ei suostu yhteistyöhön.

Selvitelty:
- nats healthcheck käyttää nestjs terminus-modulin tarjoamaa valmispalikkaa, joka vain connectaa clientin ja sittenE
  sulkee yhteyden
- jos poistan NATS healthcheckin, muut palvelut nousevat kiltisti ylös, mutta customer-syncer-servicet valittelevat
  etteivät saa muodostettua grpc-yhteyttä
- grpc muna-kana health check ratkottu Samin kanssa
- ihmetelty nats-virhettä. vaihdettu dockerin storage driver takaisin btrfs:ksi, koska overlay2 ei dockerin
  mukaan toimi btrfs:n kanssa. ei tosin estänyt dockeria ehdotttamasta ko. muutosta. samalla havaittu,
  ettei btrfs ole dockerin mukaan tuettu fedoralla.
- back to square one
- tutkittu cgrouppeja, mutta ei fedoralla näyttäisi olevan mitään erityistä tähän liittyen, minikube on
  system.slice:n alla, joka saa kaikki resurssit käyttöönsä, ja minikube itse asettaa resussinsa sen mukaan
  mitä sen configissa asetetaan
  => joten ongelma on koodissa.... ??
- timeout-parametri ei näemmä mene perille asti...
- jäljitetty siihen, että connectiin saattaa mennä 5s. säädetty readiness probea

jäätiin:
  - yritettiin saada prettier toimimaan niin, että se käyttäisi projektin lokaalia asennusta
  - logien perusteella toimi kerran, muttei toista kertaa

Skaffold-nats -ongelmat jatkuvat. jostain syystä yhteys pätkii, ja konsolilta ajettaessa tulee stack overflow,
klusterissa vain disconnect
Klusterissa ajo onnistuu pienellä säädöllä. Asennettu nats-työkalut, yhteys serveriin ilmeisesti ok, ongelmat stanissa?
kokeile saada logitusta aikaan myös shelliin, nyt ainoastaan cluster logittaa

jäätiin: https://github.com/nats-io/nats.deno/pull/259 - näyttäisi fiksaavan ongelman, kokeile vaihtaa tuoreimpaan NATS -versioon
https://github.com/nodejs/node/pull/41596

---
## References
1.
