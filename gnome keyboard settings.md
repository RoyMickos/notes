2024-01-19
Tags:

---
# Gnome keyboard settings

Gnome does not normally show EurKEY as a layout option. This is how you would enable it:

```sh
gsettings set org.gnome.desktop.input-sources show-all-sources true
gsettings set org.gnome.desktop.input-sources sources "[('xkb', 'eu')]"
```

This will clear the keyboard layouts list and directly select EurKEY. After these,
open settings and add other official layouts you'll need.

---
## References
1. 
