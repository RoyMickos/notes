2024-01-12
Tags:

---
# Windows virtual machine

Requires that virtio-win package is installed. this puts the driver iso in `/usr/share/virtio-win` on fedora.

❯ sudo strings /sys/firmware/acpi/tables/MSDM
[sudo] password for roy:
MSDMU
aLENOVOTP-N3E
PTEC
TKYVQ-GCN7W-Y3P3K-TP283-7T672

---
## References
1. [win 11 on kvm](https://sysguides.com/install-a-windows-11-virtual-machine-on-kvm/#6-16-mount-the-virtio-winiso-image)

