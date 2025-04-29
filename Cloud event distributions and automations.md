#cloud-omnibus 
Contenders are:
- AWS EventBridge
- Azure Event Grid

Both of these are pub-sub services for lightweight events. These ingest events from their respective cloud platforms. They allow for automation workflows based on events happening in the cloud. An example would be automatic copying of logs and backups from the production account to a separate logging/backup account.
The azure version also supports MQTT protocol for IoT application scenarios.
Both allow for applications and SaaS providers to send events to the service and be handled there like other event sources.