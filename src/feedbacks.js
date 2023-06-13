const { combineRgb } = require('@companion-module/base')

module.exports = {
	initFeedbacks: function () {
		let self = this;
		let feedbacks = {};

		const foregroundColor = combineRgb(255, 255, 255) // White
		const backgroundColorRed = combineRgb(255, 0, 0) // Red
		const backgroundColorGreen = combineRgb(0, 255, 0) // Green
		const backgroundColorOrange = combineRgb(255, 102, 0) // Orange

		feedbacks.powerState = {
			type: 'boolean',
			name: 'Power State',
			description: 'Indicate if Projector is in X State',
			defaultStyle: {
				color: foregroundColor,
				bgcolor: backgroundColorRed,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Indicate in X State',
					id: 'option',
					default: 'on',
					choices: [
						{ id: 'standby', label: 'Standby' },
						{ id: 'ready', label: 'Ready' },
						{ id: 'on', label: 'On' },
						{ id: 'off', label: 'Off' },
						{ id: 'deconditioning', label: 'Deconditioning' }
					]
				}
			],
			callback: async function (feedback) {
				let opt = feedback.options;

				if (self.INFO && self.INFO.power_state !== undefined) {
					let power_state = self.INFO.power_state;
				
					if (power_state == opt.option) {
						return true;
					}
				}

				return false
			}
		}

		feedbacks.shutterState = {
			type: 'boolean',
			name: 'Shutter State',
			description: 'Indicate if Projector Shutter is in X State',
			defaultStyle: {
				color: foregroundColor,
				bgcolor: backgroundColorRed,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Indicate in X State',
					id: 'option',
					default: 'Open',
					choices: [
						{ id: 'Open', label: 'Open' },
						{ id: 'Closed', label: 'Closed' }
					]
				}
			],
			callback: async function (feedback) {
				let opt = feedback.options;

				if (self.INFO && self.INFO.shutter_position !== undefined) {
					let shutter_position = self.INFO.shutter_position;
				
					if (shutter_position == opt.option) {
						return true;
					}
				}

				return false
			}
		}
		
		self.setFeedbackDefinitions(feedbacks);
	}
}
