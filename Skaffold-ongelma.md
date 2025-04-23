2022-08-02
Tags:

---
# Skaffold-ongelma

I0802 14:08:48.683491  265114 request.go:668] Waited for 1.190101634s due to client-side throttling, not priority and fairness, request: GET:https://192.168.49.2:8443/api/v1/namespaces/default/events?fieldSelector=involvedObject.name%!D(MISSING)account-service-7756456b74-kwmrg%!C(MISSING)involvedObject.namespace%!D(MISSING)default%!C(MISSING)involvedObject.kind%!D(MISSING)Pod%!C(MISSING)involvedObject.uid%!D(MISSING)480c8c68-935c-4c88-ae49-e87789512e05

Kolmannella yrittämällä suostui käynnistymään, mutta puolet palveluista punaisella.
run toimii luotettavammin? ilmeisesti toimii paremmin kun on "lämmennyt"
oireita: stan-healthcheck valittelee, jostain syystä timeout 1000ms, kun koodissa se on 3000ms

---
## References
1. 
