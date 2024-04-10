module.exports = {
	initActions: function () {
		let self = this;
		let actions = {};

		actions.power = {
			name: 'Power',
			options: [
				{
					type: 'dropdown',
					label: 'Power',
					id: 'p1',
					default: 'system.poweron',
					choices: self.LIST_power
				},
				{
					type: 'checkbox',
					label: 'Block Standby Mode',
					id: 'p2',
					default: true,
				},
				{
					type: 'checkbox',
					label: 'Block Eco Mode',
					id: 'p3',
					default: true,
				}
			],
			callback: async function (action) {
				let opt = action.options;
				let pj_command = opt.p1;
				let pj_args = {};

				if (opt.p1 == 'system.poweroff') {
					if(opt.p2 == true) {
						self.sendCommand('property.get', {"property": "system.state"}, (err, res) => {	
							self.log('debug', 'Current Power State: ' + res);

							if (res == 'ready') {
								self.log('debug', 'Standby mode blocked. Aborting.');
								pj_command = null;
								return;
							};
						});
						
					}
					else if (opt.p3 == true) {
						self.sendCommand('property.get', {"property": "system.state"}, (err, res) => {
							self.log('debug', 'Current Power State: ' + res);
		
							if (res == 'standby') {
								self.log('debug', 'Eco mode blocked. Aborting.');
								pj_command = null;
								return;
							};
						});
					}
					else {
						pj_command = opt.p1;
					}
				}

				if (pj_command != null) {
					self.sendCommand(pj_command, pj_args, function() {});
				}

			}
		}

		actions.illumination = {
			name: 'Illumination',
			options: [
				{
					type: 'dropdown',
					label: 'illumination',
					id: 'p1',
					default: 'illumination.ignite',
					choices: self.LIST_illumination
				}
			],
			callback: async function (action) {
				let opt = action.options;
				let pj_command = opt.p1;
				let pj_args = {};
				self.sendCommand(pj_command, pj_args, function() {});
			}
		}

		actions.osd = {
			name: 'OSD on',
			options: [
				{
					type: 'dropdown',
					label: 'Show OSD?',
					id: 'p1',
					default: 'true',
					choices: self.LIST_OnOff
				}
			],
			callback: async function (action) {
				let opt = action.options;
				let pj_command = 'property.set';
				let pj_args = { "property": "ui.osd", "value": opt.p1};
				self.sendCommand(pj_command, pj_args, function() {});
			}
		}

		actions.input = {
			name: 'Select input',
			options: [
				{
					type: 'dropdown',
					label: 'input',
					id: 'p1',
					default: 'L1 HDMI',
					choices: self.LIST_input
				}
			],
			callback: async function (action) {
				let opt = action.options;
				let pj_command = 'property.set';
				let pj_args = { "property": "image.window.main.source", "value": opt.p1 };
				self.sendCommand(pj_command, pj_args, function() {});
			}
		}

		actions.shutter = {
			name: 'Shutter projector',
			options: [
				{
					type: 'dropdown',
					label: 'shutter open/close',
					id: 'p1',
					default: 'Open',
					choices: self.LIST_shutter
				}
			],
			callback: async function (action) {
				let opt = action.options;
				let pj_command = 'property.set';
				let pj_args = { "property": "optics.shutter.target", "value": opt.p1 };
				self.sendCommand(pj_command, pj_args, function() {});
			}
		}

		actions.shutter_toggle = {
			name: 'Shutter projector (Toggle)',
			options: [],
			callback: async function (action) {
				let pj_command = 'optics.shutter.toggle';
				let pj_args = {};
				self.sendCommand(pj_command, pj_args, function() {});
			}
		}

		actions.testpattern = {
			name: 'Test Pattern on/off',
			options: [{
				type: 'dropdown',
				label: 'on/off',
				id: 'p1',
				default: 'true',
				choices: self.LIST_OnOff
			}],
			callback: async function (action) {
				let opt = action.options;
				let pj_command = 'property.set';
				let pj_args = { "property": "image.testpattern.show", "value": opt.p1 };
				self.sendCommand(pj_command, pj_args, function() {});
			}
		}

		actions.stealth = {
			name: 'Stealth Mode (LEDs)',
			options: [
				{
					type: 'dropdown',
					label: 'Controllable LEDs on/off',
					id: 'p1',
					default: 'true',
					choices: self.LIST_OnOff
				}
			],
			callback: async function (action) {
				let opt = action.options;
				let pj_command = 'property.set';
				let pj_args = { "property": "ui.stealthmode", "value": opt.p1 };
				self.sendCommand(pj_command, pj_args, function() {});
			}
		}

		actions.stealth_toggle = {
			name: 'Stealth Mode (Toggle)',
			options: [],
			callback: async function (action) {
				let pj_command = 'ui.togglestealthmode';
				let pj_args = {};
				self.sendCommand(pj_command, pj_args, function() {});
			}
		}

		actions.lens_zoom = {
			name: 'Zoom lens',
			options: [
				{
					type: 'dropdown',
					label: 'Direction',
					id: 'p1',
					default: 'optics.zoom.stepforward',
					choices: self.LIST_lens_zoom
				},
				{
					type: 'number',
					id: 'p2',
					label: 'Steps (1-100)',
					min: 0,
					max: 100,
					default: 1,
					required: true,
					range: false,
					regex: self.REGEX_NUMBER
				}
			],
			callback: async function (action) {
				let opt = action.options;
				let pj_command = opt.p1;
				let pj_args = { "steps": opt.p2 };
				self.sendCommand(pj_command, pj_args, function() {});
			}
		}

		actions.lens_focus = {
			name: 'Focus lens',
			options: [
				{
					type: 'dropdown',
					label: 'Direction',
					id: 'p1',
					default: 'optics.focus.stepforward',
					choices: self.LIST_lens_focus
				},
				{
					type: 'number',
					id: 'p2',
					label: 'Steps (1-100)',
					min: 0,
					max: 100,
					default: 1,
					required: true,
					range: false,
					regex: self.REGEX_NUMBER
				}
			],
			callback: async function (action) {
				let opt = action.options;
				let pj_command = opt.p1;
				let pj_args = { "steps": opt.p2 };
				self.sendCommand(pj_command, pj_args, function() {});
			}
		}

		actions.lens_shift = {
			name: 'Shift lens',
			options: [
				{
					type: 'dropdown',
					label: 'Direction',
					id: 'p1',
					default: 'optics.lensshift.vertical.stepforward',
					choices: self.LIST_lens_shift
				},
				{
					type: 'number',
					id: 'p2',
					label: 'Steps (1-100)',
					min: 0,
					max: 100,
					default: 1,
					required: true,
					range: false,
					regex: self.REGEX_NUMBER
				}
			],
			callback: async function (action) {
				let opt = action.options;
				let pj_command = opt.p1;
				let pj_args = { "steps": opt.p2 };
				self.sendCommand(pj_command, pj_args, function() {});
				
			}
		}

/* please add */
		actions.laser_power = {
			name: 'Laser power',
			options: [
				{
					type: 'number',
					id: 'p1',
					label: 'Laser Power [Steps (15-100)]',
					min: 15,
					max: 100,
					default: 100,
					required: true,
					range: false,
					regex: self.REGEX_NUMBER
				}
			],
			callback: async function (action) {
				let opt = action.options;
				let pj_command = 'property.set';
				let pj_args = { "property": "illumination.sources.laser.power", "value": opt.p1};
				self.sendCommand(pj_command, pj_args, function() {});
				
			}
		}


		actions.lens_calibrate = {
			name: 'Calibrate lens',
			options: [
				{
					type: 'dropdown',
					label: 'Type',
					id: 'p1',
					default: 'optics.zoom.calibrate',
					choices: self.LIST_lens_calibrate
				}
			],
			callback: async function (action) {
				let opt = action.options;
				let pj_command = opt.p1;
				let pj_args = {};
				self.sendCommand(pj_command, pj_args, function() {});
			}
		}

		actions.rc_shift = {
			name: 'Remote Shift lens',
			options: [
				{
					type: 'dropdown',
					label: 'Direction',
					id: 'p1',
					default: 'RC_SHIFT_UP',
					choices: self.LIST_rc_shift
				},
				{
					type: 'dropdown',
					label: 'Press/Release',
					id: 'p2',
					choices: self.LIST_release,
					default: 'keydispatcher.sendpressevent'
				}
			],
			callback: async function (action) {
				let opt = action.options;
				let pj_command = opt.p2;
				let pj_args = { "key": opt.p1 };
				self.sendCommand(pj_command, pj_args, function() {});
			}
		}
	
		actions.optics_zoom_target = {
			name: 'Zoom target',
			options: [
				{
					type: 'number',
					id: 'p1',
					label: 'Zoom target value (0-65535)',
					min: 0,
					max: 65535,
					default: 0,
					required: true,
					regex: self.REGEX_NUMBER
				}
			],
			callback: async function (action) {
				let opt = action.options;
				let pj_command = 'property.set';
				let pj_args = { "property": "optics.zoom.target", "value": opt.p1 };
				self.sendCommand(pj_command, pj_args, function() {});
			}
		}

		actions.optics_focus_target = {
			name: 'Focus target',
			options: [
				{
					type: 'number',
					id: 'p1',
					label: 'Focus target value (0-65535)',
					min: 0,
					max: 65535,
					default: 0,
					required: true,
					regex: self.REGEX_NUMBER
				}
			],
			callback: async function (action) {
				let opt = action.options;
				let pj_command = 'property.set';
				let pj_args = { "property": "optics.focus.target", "value": opt.p1 };
				self.sendCommand(pj_command, pj_args, function() {});
			}
		}

		actions.optics_lensshift_vertical_target = {
			name: 'Vertical lens shift target',
			options: [
				{
					type: 'number',
					id: 'p1',
					label: 'Vertical lens shift target value (0-65535)',
					min: 0,
					max: 65535,
					default: 0,
					required: true,
					regex: self.REGEX_NUMBER
				}
			],
			callback: async function (action) {
				let opt = action.options;
				let pj_command = 'property.set';
				let pj_args = { "property": "optics.lensshift.vertical.target", "value": opt.p1 };
				self.sendCommand(pj_command, pj_args, function() {});
			}
		}

		actions.optics_lensshift_horizontal_target = {
			name: 'Horizontal lens shift target',
			options: [
				{
					type: 'number',
					id: 'p1',
					label: 'Horizontal lens shift target value (0-65535)',
					min: 0,
					max: 65535,
					default: 0,
					required: true,
					regex: self.REGEX_NUMBER
				}
			],
			callback: async function (action) {
				let opt = action.options;
				let pj_command = 'property.set';
				let pj_args = { "property": "optics.lensshift.horizontal.target", "value": opt.p1 };
				self.sendCommand(pj_command, pj_args, function() {});
			}
		}

		actions.remoteKey = {
			name: 'Send remote button',
			options: [
				{
					type: 'dropdown',
					label: 'Button from remote controller',
					id: 'key',
					choices: self.LIST_rc_key,
					default: 'RC_OK'
				}
			],
			callback: async function (action) {
				let opt = action.options;
				let pj_command = 'keydispatcher.sendclickevent';
				let pj_args = { "key": opt.key };
				self.sendCommand(pj_command, pj_args, function() {});
			}
		}

		actions.factory = {
			name: 'Reset to factory defaults',
			options: [],
			callback: async function (action) {
				let pj_command = 'system.resetall';
				let pj_args = {};
				self.sendCommand(pj_command, pj_args, function() {});
			}
		}

		actions.activateProfile = {
			name: 'Activate Profile',
			options: [
				{
					type: 'textinput',
					label: 'Profile Name',
					id: 'profile',
					default: '',
					useVariables: true,
				}
			],
			callback: async function (action) {
				let opt = action.options;
				let pj_command = 'profile.activateprofile';
				let pj_args = await self.parseVariablesInString(opt.profile);
				self.sendCommand(pj_command, pj_args, function() {});
			}
		}

		self.setActionDefinitions(actions);
	}
}