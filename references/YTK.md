2022-03-07  1517
Tags:

---
# YTK
vpn:n käynnistys:
```sh
pass -c prj/ytk/vpn
sudo openconnect -u ext-roy.mickos vpn.ytk.fi
```

### Osoitteita
* [Testikuibana](https://kibana-test.cloud.oma.ytk.fi/)
* [Tuotantokibana](https://kibana-prod.cloud.oma.ytk.fi/)
* [QA](https://oma-qa.ytk.fi/)
* [Grav](https://docs-test.cloud.oma.ytk.fi/)

### Ongelmanratkaisua
elastic access denied ongelma
```sh
  sudo chown -R 1000:1000 /var/lib/docker/volumes/minikube/_data/data/elasticsearch
```

possu temppuilee
```sh
sudo rm -rf /var/lib/docker/volumes/minikube/_data/data/postgres                                                    ✱
```

---
## References
1. 
