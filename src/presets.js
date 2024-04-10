const { combineRgb } = require('@companion-module/base')

module.exports = {
	initPresets: function () {
		let self = this;
		let presets = [];

		const foregroundColor = combineRgb(255, 255, 255) // White
		const backgroundColorRed = combineRgb(255, 0, 0) // Red
		
		// Shutter Open / Close
		for (let i in self.LIST_shutter) {
			presets.push({
				type: 'button',
				category: 'Lens Control',
				name: self.LIST_shutter[i].label,
				style: {
					text: self.LIST_shutter[i].label,
					size: '14',
					color: combineRgb(0,0,0),
					bgcolor: combineRgb(235,235,235)
				},
				steps: [
					{
						down: [
							{
								actionId: 'shutter',
								options: {
									p1: self.LIST_shutter[i].id
								}
							}
						],
						up: []
					}
				],
				feedbacks: []
			})
		}
	
		// Shutter Toggle
		presets.push({
			type: 'button',
			category: 'Lens Control',
			name: 'Shutter Toggle',
			style: {
				text: 'Shutter Toggle',
				size: '14',
				color: combineRgb(0,0,0),
				bgcolor: combineRgb(235,235,235)
			},
			steps: [
				{
					down: [
						{
							actionId: 'shutter_toggle',
						}
					],
					up: []
				}
			],
			feedbacks: []
		})
	
		// Lens Zoom
		for (let i in self.LIST_lens_zoom) {
			presets.push({
				type: 'button',
				category: 'Lens Control',
				name: 'Lens Zoom ' + self.LIST_lens_zoom[i].label,
				style: {
					text: 'Zoom ' + self.LIST_lens_zoom[i].label,
					size: '14',
					color: combineRgb(0,0,0),
					bgcolor: combineRgb(235,235,235)
				},
				steps: [
					{
						down: [
							{
								actionId: 'lens_zoom',
								options: {
									p1: self.LIST_lens_zoom[i].id,
									p2: 1
								}
							}
						],
						up: []
					}
				],
				feedbacks: []
			})
		}
	
		// Lens Focus
		for (let i in self.LIST_lens_focus) {
			presets.push({
				type: 'button',
				category: 'Lens Control',
				name: 'Lens Focus ' + self.LIST_lens_focus[i].label,
				style: {
					text: 'Focus ' + self.LIST_lens_focus[i].label,
					size: '14',
					color: combineRgb(0,0,0),
					bgcolor: combineRgb(235,235,235)
				},
				steps: [
					{
						down: [
							{
								actionId: 'lens_focus',
								options: {
									p1: self.LIST_lens_focus[i].id,
									p2: 1
								}
							}
						],
						up: []
					}
				],
				feedbacks: []
			})
		}
	
		// Lens Shift
		for (let i in self.LIST_lens_shift) {
			presets.push({
				type: 'button',
				category: 'Lens Control',
				name: 'Lens Shift ' + self.LIST_lens_shift[i].label,
				style: {
					text: 'Shift ' + self.LIST_lens_shift[i].label,
					size: '14',
					color: combineRgb(0,0,0),
					bgcolor: combineRgb(235,235,235)
				},
				steps: [
					{
						down: [
							{
								actionId: 'lens_shift',
								options: {
									p1: self.LIST_lens_shift[i].id,
									p2: 1
								}
							}
						],
						up: []
					}
				],
				feedbacks: []
			})
		}
	
		// Lens Calibrate
		for (let i in self.LIST_lens_calibrate) {
			presets.push({
				type: 'button',
				category: 'Lens Control',
				name: self.LIST_lens_calibrate[i].label,
				style: {
					text: self.LIST_lens_calibrate[i].label,
					size: '14',
					color: combineRgb(0,0,0),
					bgcolor: combineRgb(235,235,235)
				},
				steps: [
					{
						down: [
							{
								actionId: 'lens_calibrate',
								options: {
									p1: self.LIST_lens_calibrate[i].id,
								}
							}
						],
						up: []
					}
				],
				feedbacks: []
			})
		}
	
		// Remote Lens Shift
		for (let i in self.LIST_rc_shift) {
			presets.push({
				type: 'button',
				category: 'Remote Lens',
				name: 'Remote Lense Shift ' + self.LIST_rc_shift[i].label,
				style: {
					text: 'Remote Shift ' + self.LIST_rc_shift[i].label,
					size: '14',
					color: combineRgb(0,0,0),
					bgcolor: combineRgb(235,235,235)
				},
				steps: [
					{
						down: [
							{
								actionId: 'rc_shift',
								options: {
									p1: self.LIST_rc_shift[i].id,
									p2: 'Press'
								}
							}
						],
						up: []
					},
					{
						down: [
							{
								actionId: 'rc_shift',
								options: {
									p1: self.LIST_rc_shift[i].id,
									p2: 'Release'
								}
							}
						],
						up: []
					}
				],
				feedbacks: []
			})
		}
	
		// Remote Key Press
		for (let i in self.LIST_rc_key) {
			presets.push({
				type: 'button',
				category: 'Remote',
				name: 'Remote ' + self.LIST_rc_key[i].label,
				style: {
					text: 'Remote ' + self.LIST_rc_key[i].label,
					size: '14',
					color: combineRgb(0,0,0),
					bgcolor: combineRgb(235,235,235)
				},
				steps: [
					{
						down: [
							{
								actionId: 'remoteKey',
								options: {
									p1: self.LIST_rc_key[i].id,
								}
							}
						],
						up: []
					}
				],
				feedbacks: []
			})
		}
	
		// Power ON / OFF
		for (let i in self.LIST_power) {
			presets.push({
				type: 'button',
				category: 'System',
				name: self.LIST_power[i].label,
				style: {
					text: self.LIST_power[i].label,
					size: '14',
					color: combineRgb(0,0,0),
					bgcolor: combineRgb(235,235,235)
				},
				steps: [
					{
						down: [
							{
								actionId: 'power',
								options: {
									p1: self.LIST_power[i].id
								}
							}
						],
						up: []
					}
				],
				feedbacks: []
			})
		}
	
		// Shutter Open / Close
		for (let i in self.LIST_shutter) {
			presets.push({
				type: 'button',
				category: 'System',
				name: self.LIST_shutter[i].label,
				style: {
					text: self.LIST_shutter[i].label,
					size: '14',
					color: combineRgb(0,0,0),
					bgcolor: combineRgb(235,235,235)
				},
				steps: [
					{
						down: [
							{
								actionId: 'shutter',
								options: {
									p1: self.LIST_shutter[i].id
								}
							}
						],
						up: []
					}
				],
				feedbacks: []
			})
		}
	
		// Shutter Toggle
		presets.push({
			type: 'button',
			category: 'System',
			name: 'Shutter Toggle',
			style: {
				text: 'Shutter Toggle',
				size: '14',
				color: combineRgb(0,0,0),
				bgcolor: combineRgb(235,235,235)
			},
			steps: [
				{
					down: [
						{
							actionId: 'shutter_toggle',
						}
					],
					up: []
				}
			],
			feedbacks: []
		})
	
		// Illumination
		for (let i in self.LIST_illumination) {
			presets.push({
				type: 'button',
				category: 'System',
				name: self.LIST_illumination[i].label,
				style: {
					text: self.LIST_illumination[i].label,
					size: '14',
					color: combineRgb(0,0,0),
					bgcolor: combineRgb(235,235,235)
				},
				steps: [
					{
						down: [
							{
								actionId: 'illumination',
								options: {
									p1: self.LIST_illumination[i].id
								}
							}
						],
						up: []
					}
				],
				feedbacks: []
			})
		}
	
		// OSD ON / OFF
		for (let i in self.LIST_OnOff) {
			presets.push({
				type: 'button',
				category: 'System',
				name: 'OSD ' + self.LIST_OnOff[i].label,
				style: {
					text: 'OSD ' + self.LIST_OnOff[i].label,
					size: '14',
					color: combineRgb(0,0,0),
					bgcolor: combineRgb(235,235,235)
				},
				steps: [
					{
						down: [
							{
								actionId: 'osd',
								options: {
									p1: self.LIST_OnOff[i].id
								}
							}
						],
						up: []
					}
				],
				feedbacks: []
			})
		}
	
		// Testpattern ON / OFF
		for (let i in self.LIST_OnOff) {
			presets.push({
				type: 'button',
				category: 'System',
				name: 'Testpattern ' + self.LIST_OnOff[i].label,
				style: {
					text: 'TP ' + self.LIST_OnOff[i].label,
					size: '14',
					color: combineRgb(0,0,0),
					bgcolor: combineRgb(235,235,235)
				},
				steps: [
					{
						down: [
							{
								actionId: 'testpattern',
								options: {
									p1: self.LIST_OnOff[i].id
								}
							}
						],
						up: []
					}
				],
				feedbacks: []
			})
		}
	
		// Stealth Mode ON / OFF
		for (let i in self.LIST_OnOff) {
			presets.push({
				type: 'button',
				category: 'System',
				name: 'Stealth ' + self.LIST_OnOff[i].label,
				style: {
					text: 'Stealth ' + self.LIST_OnOff[i].label,
					size: '14',
					color: combineRgb(0,0,0),
					bgcolor: combineRgb(235,235,235)
				},
				steps: [
					{
						down: [
							{
								actionId: 'stealth',
								options: {
									p1: self.LIST_OnOff[i].id
								}
							}
						],
						up: []
					}
				],
				feedbacks: []
			})
		}
	
		// Stealth Toggle
		presets.push({
			type: 'button',
			category: 'System',
			name: 'Stealth Mode Toggle',
			style: {
				text: 'Stealth Toggle',
				size: '14',
				color: combineRgb(0,0,0),
				bgcolor: combineRgb(235,235,235)
			},
			steps: [
				{
					down: [
						{
							actionId: 'stealth_toggle',
						}
					],
					up: []
				}
			],
			feedbacks: []
		})
		
		// Factory Reset
		presets.push({
			type: 'button',
			category: 'System',
			name: 'Factory Reset',
			style: {
				text: 'Factory Reset',
				size: '14',
				color: combineRgb(0,0,0),
				bgcolor: combineRgb(235,235,235)
			},
			steps: [
				{
					down: [
						{
							actionId: 'factory',
						}
					],
					up: []
				}
			],
			feedbacks: []
		})

		// Activate Profile
		presets.push({
			type: 'button',
			category: 'System',
			name: 'Activate Profile',
			style: {
				text: 'Activate Profile',
				size: '14',
				color: combineRgb(0,0,0),
				bgcolor: combineRgb(235,235,235)
			},
			steps: [
				{
					down: [
						{
							actionId: 'activateProfile',
							options: {
								profile: ''
							}
						}
					],
					up: []
				}
			],
			feedbacks: []
		})

		self.setPresetDefinitions(presets);
	}
}
