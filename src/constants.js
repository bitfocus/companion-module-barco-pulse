module.exports = {
	LIST_OnOff: [
		{id: 'true',	label: 'On'},
		{id: 'false',	label: 'Off'}
	],
	
	LIST_power: [
		{ id: 'system.poweron',		label: 'Projector ON' },
		{ id: 'system.poweroff',	label: 'Projector OFF' },
	],
	
	LIST_illumination: [
		{ id: 'illumination.extinguish',	label: 'Extinguish' },
		{ id: 'illumination.ignite',			label: 'Illuminate' },
	],
	
	LIST_input: [
		{ id: 'L1 HDMI',				label: 'HDMI' },
		{ id: 'L1 Displayport',	label: 'Displayport' },
		{id:"L1 SDI A",label:"L1 SDI A"},
		{id:"L1 SDI B",label:"L1 SDI B"},
		{id:"L1 SDI C",label:"L1 SDI C"},
		{id:"L1 SDI D",label:"L1 SDI D"},
		{id:"L1 HDBaseT 1",label:"L1 HDBaseT 1"},
		{id:"L1 HDBaseT 2",label:"L1 HDBaseT 2"}
	],
	
	LIST_shutter: [
		{id: 'Open', 		label: 'Shutter open'},
		{id: 'Closed',	label: 'Shutter close'}
	],
	
	LIST_lens_zoom: [
		{id: 'optics.zoom.stepforward', 	label: 'Forward'},
		{id: 'optics.zoom.stepreverse', 	label: 'Back'},
	],
	
	LIST_lens_focus: [
		{id: 'optics.focus.stepforward',	label: 'Forward'},
		{id: 'optics.focus.stepreverse',	label: 'Back'},
	],
	
	LIST_lens_shift: [
		{id: 'optics.lensshift.vertical.stepforward', 	label: 'Up'},
		{id: 'optics.lensshift.vertical.stepreverse', 	label: 'Down'},
		{id: 'optics.lensshift.horizontal.stepforward',	label: 'Left'},
		{id: 'optics.lensshift.horizontal.stepreverse',	label: 'Right'},
	],
	
	LIST_lens_calibrate: [
		{id: 'optics.zoom.calibrate', 									label: 'Calibrate Zoom'},
		{id: 'optics.focus.calibrate', 									label: 'Calibrate Focus'},
		{id: 'optics.lensshift.vertical.calibrate',			label: 'Calibrate Vertical'},
		{id: 'optics.lensshift.horizontal.calibrate',		label: 'Calibrate Horizontal'},
		{id: 'optics.shifttocenter',										label: 'Go To Center'},
	],
	
	LIST_rc_shift: [
		{id: 'RC_SHIFT_UP',			label: 'up'},
		{id: 'RC_SHIFT_DOWN',		label: 'down'},
		{id: 'RC_SHIFT_LEFT',		label: 'left'},
		{id: 'RC_SHIFT_RIGHT',	label: 'right'}
	],
	
	LIST_release: [
		{id: 'keydispatcher.sendpressevent',		label: 'Press'},
		{id: 'keydispatcher.sendreleaseevent',	label: 'Release'}
	],
	
	LIST_rc_key: [
		{id: 'RC_SHUTTER_OPEN',		label: 'Shutter Open'},
		{id: 'RC_SHUTTER_CLOSE',	label: 'Shutter Close'},
		{id: 'RC_POWER_ON',				label: 'Power ON'},
		{id: 'RC_POWER_OFF',			label: 'Power OFF'},
		{id: 'RC_OSD',						label: 'OSD'},
		{id: 'RC_LCD',						label: 'LCD'},
		{id: 'RC_PATTERN',				label: 'Pattern'},
		{id: 'RC_RGB',						label: 'RGB'},
		{id: 'RC_ZOOM_PLUS',			label: 'Zoom +'},
		{id: 'RC_ZOOM_MINUS',			label: 'Zoom -'},
		{id: 'RC_SHIFT_UP',				label: 'Lens Up'},
		{id: 'RC_SHIFT_DOWN',			label: 'Lens Down'},
		{id: 'RC_SHIFT_LEFT',			label: 'Lens Left'},
		{id: 'RC_SHIFT_RIGHT',		label: 'Lens Right'},
		{id: 'RC_FOCUS_PLUS',			label: 'Focus +'},
		{id: 'RC_FOCUS_MINUS',		label: 'Focus -'},
		{id: 'RC_MENU',						label: 'Menu'},
		{id: 'RC_DEFAULT',				label: 'Default'},
		{id: 'RC_BACK',						label: 'Back'},
		{id: 'RC_UP',							label: 'Up'},
		{id: 'RC_LEFT',						label: 'Left'},
		{id: 'RC_OK',							label: 'Ok'},
		{id: 'RC_RIGHT',					label: 'Right'},
		{id: 'RC_DOWN',						label: 'Down'},
		{id: 'RC_ADDRESS',				label: 'Address'},
		{id: 'RC_INPUT',					label: 'Input'},
		{id: 'RC_MACRO',					label: 'Macro'},
		{id: 'RC_1',							label: '1'},
		{id: 'RC_2',							label: '2'},
		{id: 'RC_3',							label: '3'},
		{id: 'RC_4',							label: '4'},
		{id: 'RC_5',							label: '5'},
		{id: 'RC_6',							label: '6'},
		{id: 'RC_7',							label: '7'},
		{id: 'RC_8',							label: '8'},
		{id: 'RC_9',							label: '9'},
		{id: 'RC_0',							label: '0'},
		{id: 'RC_ASTERISK',				label: 'Asterisk'},
		{id: 'RC_NUMBER',					label: 'Number'},
		{id: 'KP_LEFT',						label: 'KP Left'},
		{id: 'KP_UP',							label: 'KP Up'},
		{id: 'KP_OK',							label: 'KP Ok'},
		{id: 'KP_RIGHT',					label: 'KP Right'},
		{id: 'KP_DOWN',						label: 'KP Down'},
		{id: 'KP_MENU',						label: 'KP Menu'},
		{id: 'KP_POWER',					label: 'KP Power'},
		{id: 'KP_BACK',						label: 'KP Back'},
		{id: 'KP_OSD',						label: 'KP OSD'},
		{id: 'KP_LENS',						label: 'KP Lens'},
		{id: 'KP_PATTERN',				label: 'KP Pattern'},
		{id: 'KP_SHUTTER',				label: 'KP Shutter'},
		{id: 'KP_INPUT',					label: 'KP Input'},
		{id: 'KP_STANDBY',				label: 'KP Standby'},
	],
}