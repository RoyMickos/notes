2022-11-19
Tags:

---
# jsfunc

Rajapinta: ❯ curl --compressed https://rata.digitraffic.fi/api/v1/live-trains/station/HKI | jq
Vastaus:
```
  {
    "trainNumber": 60954,
    "departureDate": "2022-11-19",
    "operatorUICCode": 10,
    "operatorShortCode": "vr",
    "trainType": "SAA",
    "trainCategory": "Shunting",
    "commuterLineID": "",
    "runningCurrently": false,
    "cancelled": false,
    "version": 284249746725,
    "timetableType": "REGULAR",
    "timetableAcceptanceDate": "2022-09-23T06:15:52.000Z",
    "timeTableRows": [
      {
        "stationShortCode": "HKI",
        "stationUICCode": 1,
        "countryCode": "FI",
        "type": "DEPARTURE",
        "trainStopping": true,
        "commercialStop": true,
        "commercialTrack": "12",
        "cancelled": false,
        "scheduledTime": "2022-11-19T11:48:00.000Z",
        "causes": [],
        "trainNumber": 60954
      },
      {
        "stationShortCode": "PSL",
        "stationUICCode": 10,
        "countryCode": "FI",
        "type": "ARRIVAL",
        "trainStopping": false,
        "commercialTrack": "",
        "cancelled": false,
        "scheduledTime": "2022-11-19T11:53:00.000Z",
        "causes": [],
        "trainNumber": 60954
      },
      {
        "stationShortCode": "PSL",
        "stationUICCode": 10,
        "countryCode": "FI",
        "type": "DEPARTURE",
        "trainStopping": false,
        "commercialTrack": "",
        "cancelled": false,
        "scheduledTime": "2022-11-19T11:53:00.000Z",
        "causes": [],
        "trainNumber": 60954
      },
      {
        "stationShortCode": "ILR",
        "stationUICCode": 1030,
        "countryCode": "FI",
        "type": "ARRIVAL",
        "trainStopping": true,
        "commercialStop": true,
        "commercialTrack": "604",
        "cancelled": false,
        "scheduledTime": "2022-11-19T12:03:00.000Z",
        "causes": [],
        "trainNumber": 60954
      }
    ]
  }
```
Yksittäisen junan tieto
❯ curl --compressed https://rata.digitraffic.fi/api/v1/trains/2022-11-19/76060 | jq

19-11-2022
  - tehty perusjuttua artikkelin ympäriltä, huomenna päästään varsinaiseen pihviin uusin aivoin
20-11-2022
  - jatkettu ja päästy maybeen asti, funktio- ja luokkatoteutukset
3.12.2022
  - jatkettu Taskiin asti, mutta ei toimi odotetusti. haku saadaan tehtyä, mutta ilmeisesti ongelma on, että vastaus tulee gzippinä, eikä sitä mainosteta headereissa, joten axios ei sitä pura
  - tutkittava lisää, jos näin on niin muunnosfunktio kehiin ja mukaan ketjuun
---
## References
1. 
