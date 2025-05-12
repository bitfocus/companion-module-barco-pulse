# companion-module-barco-pulse
See HELP.md and LICENSE

**V1.0.0**
* Unfinished Initial upload

**V1.1.1**
* Some rewrite
* Added more commands
* Added some presets

**V1.1.2**
* Some rewrite - more scalable, preparing for feedback
* Added lens movement, zoom, focus, more remote keys and more
* Added presets for new commands

**V1.1.4**
* Added the ability to block Standby and Eco modes

**V2.1.0**
* Add command to set Illumination value and get back the current value as Variable

**V2.2.0**
* Add Activation of Profiles

**V2.3.0**
* Added variable `illumination_value` that returns percentage of current laser power
* Generally fixed following variables:
  * `identification` for article number
  * `identifiction_family` for model name
  * `illumination_state` which returns power state of laser unit
  * `serial_number`
  * `firmware_version`
* Fixed breakage through Pulse Firmware `V2.6.1`:
  * `power_state`
  * `illumination_value`
  * `shutter_postion`
