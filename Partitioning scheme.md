## Requirements
I originally wanted to create a partitioning to ease frequent distro upgrades on Fedora. My main pain points were occassionally losing data on my home directory when not everyting had been backed up (some frontend masters course work etc). Another issue was virtual machines. They are big files and clumsy to copy to backup and recover from there. Therefore, I thought of having a straightforward setup where I would have a separate parition for `/home` , root, and `/var/lib/libvirt/images`. Later, I thought it would be more flexible to have a big `/data` partition, and use a symbolic link `/var/lib/libvirt/images => /data/images` so that the data partition can be used for other things besides just image storage, like anything that requires `nocow` (no copy-on-write). This could be using `ext4` while the rest would be `btrfs`.

Besides this, I wanted to have a single LUKS setup with a singe encryption key covering all volumes. Another curveball was that I chose to experiment this on my NUC box where I have two SDD disks. I wanted to have a single secret covering both. I tried to chat this with chatgpt but the answers were not logically consistent. Anyways, it lead me to consider linux logical volume manager (LVM) together with LUKS to cover the requirements.

Anaconda, the fedora installer, does not cover all the bases here. It looks like you need to manually create the volumes and partitions before invoking anaconda. Thus you will need to destroy your data before you start the installation.

## BTRFS vs LVM
The key driver for LVM is multiple disks. If you only have one disk, then the best option is to format the whole disk to use btrfs and create _sbvolumes_ for @home and @data, and mount them accordingly. This removes the need to allocate space for partitions and gives the option to create snapshots. So, single disk? => go with BTRFS.

## LUKS and LVM
The basic idea is to create a logical volume that comprises of both disks, and put this volume inside a LUKS container. The setup for the NUC is as follows:

| Name    | Description  | Capacity   |
| ------- | ------------ | ---------- |
| sda     | Kingston ATA | 111.79 GB  |
| nvme0n1 | Main disk    | 232. 89 GB |
### LVM setup
#### Partition primary disk
For the main disk, we need to first partition out the boot partitions, `/boot` and `/boot/efi` using the standard partition recommended by fedora.
```sh
sudo parted /dec/nvme0n1
mkpart primary fat32 1MiB 600MiB # /bboot/efi
set 1 esp on
mkpart primary ext4 601 MiB 1600MiB # /boog
mkpart primary ext4 1601MiB 100%
```
Exit parted and verify:
```sh
sudo parted /dev/nvme0n1 print
```

#### Create LUKS container
We name this LUKS container `cryptroot`.
```sh
sudo cryptsetup luksFormat --tyoe luks2 /dev/nvme0n1p3
# passwork endterred
sudo cryptsetup open /dev/nvme0n1p3 cryptroot
```
The container is now at `/dev/mapper/cryptroot`.

#### Create LVM inside LUKS
LVM combines physical volumens (PV) into a volume group (VG). In this vg we then create the logical volumes.

```sh
sudo pvcreate /dev/mapper/cryptroot

sudo vgcreate vg_nuc /dev/mapper/cryptroot
```

Now that we have the volume group, we need to add the the second disk to it
```sh
sudo pvcreate /dev/sda
sudo vgextend vg_nuc /dev/sda
```

#### Create, format and mount logical volumes
Fedora recommends a minimum of 25GB for the root partitioning, with 75GB being sufficient for most use cases. Adding some headroom for NIX, 100GB is the size for root.
The data partition is also 100GB (just a random figure), with the rest of around 140 GB going for the home partition.
[Fedora docs](https://docs.fedoraproject.org/en-US/fedora/f36/install-guide/install/Installing_Using_Anaconda/#sect-installation-gui-manual-partitioning-recommended)

```sh
sudo lvcreate -L 100G -n lv_root vg_nuc
sudo lvcreate -L 100G -n lv_data vg_nuc
sudo lvcreate -L 144G -n lv_home vg_nuc

sudo mkfs.btrfs /dev/vg_nuc/lv_root
sudo mkfs.btrfs /dev/vg_nuc/lv_home
sudo mkfs.ext4 /dev/vg_nuc/lv_data

sudo vgchange -ay vg_nuc

sudo mount /dev/vg_nuc/lv_root /mnt
sudo mount /dev/mapper/vg_nuc-lv_root /mnt
sudo mkdir -p /mnt/home
sudo mount /dev/vg_nuc/lv_home /mnt/home
sudo mount /dev/mapper/vg_nuc-lv_home /mnt/home
sudo mkdir -p /mnt/data
sudo mount /dev/vg_nuc/lv_data /mnt/data
sudo mount /dev/mapper/vg_nuc-lv_data /mnt/data
```
The mounts are temporary, actual mounting is done in anaconda.
#### Start fedora installer (anaconda)
You must choose custom partitioning, and assign the mount points in there. You will map the lvm logical volumes directly to mount points. All of the above did not work, as fedora installer complained about "you must create a new file system on the root device". Did not find any good solutions for this.

In the end, resorted to using LVM on the custom installer. This managed to combine both disks into one, and I could add the data and home partitions separately. However, this offered encryption only on per-logical volume basis, not for the whose volume group.

(Copied from chat window)
Installing Fedora Workstation with Your Custom Partitioning & LUKS Setup
These are step-by-step guidelines to implement your partitioning scheme using Fedora Workstation’s installer (Anaconda).

1️⃣ Boot into the Fedora Live Installer
- Download the latest Fedora Workstation ISO from getfedora.org.
- Create a bootable USB using Fedora Media Writer or dd:
```bash
sudo dd if=/path/to/fedora.iso of=/dev/sdX bs=4M status=progress
```
- Boot from the USB and select Install Fedora Workstation.
2️⃣ Select "Custom" Partitioning in Anaconda
When you reach the Installation Destination step:
- Select your 384GB main SSD (/dev/sda) and 120GB secondary SSD (/dev/sdb).
- Choose "Custom" partitioning.
3️⃣ Set Up Partitions
	1. Create an Unencrypted /boot Partition
	- Mount Point: /boot
	- Filesystem: ext4
	- Size: 1GB
	- Device Type: Standard Partition (not LVM, not encrypted)
	This must remain unencrypted, as GRUB cannot unlock LUKS2 at boot.
	2. Create an Encrypted LUKS Container on /dev/sda2
	- Device Type: LUKS Encryption
	- Size: Use all remaining space (~383GB)
	- Encryption Password: Set a strong passphrase.
		Click Modify and choose LUKS2 (better security & performance).
		✅ Single LUKS container will hold both / and /home.
	3. Inside LUKS: Create Filesystems
		Once /dev/sda2 is encrypted, Fedora will show it as "LUKS Device".
		Click it, then create the following partitions inside.
		🔹 Root Partition (/)
		Mount Point: /
		Filesystem: btrfs (or ext4, if preferred)
		Size: 60GB
		Device Type: Standard Partition
		🔹 Home Partition (/home)
		Mount Point: /home
		Filesystem: btrfs (or ext4, if preferred)
		Size: 200GB
		Device Type: Standard Partition
	4. Set Up the VM Storage Partition (/dev/sdb1)
		Select /dev/sdb1 (your 120GB SSD).
		Mount Point: /var/lib/libvirt/images
		Filesystem: XFS
		Device Type: Standard Partition
		Size: 120GB
		Options: Enable noatime & discard later in /etc/fstab.
4️⃣ Complete Installation & First Boot
	Click Done and verify the partitions.
	Proceed with the installation.
	After reboot, enter your LUKS passphrase to unlock the encrypted disk.
5️⃣ Post-Installation Tweaks
	1. Enable TRIM for SSD Lifespan
```bash
sudo systemctl enable fstrim.timer
```
	2. Optimize /etc/fstab
Edit /etc/fstab for better performance:
```ini
UUID=xxxxx  /          btrfs  defaults,noatime  0 1
UUID=yyyyy  /home      btrfs  defaults,noatime  0 2
UUID=zzzzz  /var/lib/libvirt/images  xfs  defaults,noatime,discard  0 2
```
	noatime: Reduces disk writes.
	discard: Enables TRIM for SSDs.
  3. Verify Everything
Check if LUKS encryption is working:
```bash
lsblk -o NAME,MOUNTPOINT,FSTYPE,SIZE,TYPE
```
Confirm /var/lib/libvirt/images is using XFS:
```ash
df -Th | grep libvirt
```
🎯 Final Result
✅ Secure, single LUKS container for / and /home
✅ Optimized VM storage on a separate SSD (XFS, no CoW)
✅ No LVM, keeping it simple
✅ Automatic TRIM for SSD longevity