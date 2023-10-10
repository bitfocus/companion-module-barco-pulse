module.exports = {
	initVariables: function () {
		let self = this;
		let variables = [];

		variables.push({ variableId: 'power_state', name: 'Power State' });
		//variables.push({ variableId: 'illumination_state', name: 'Illumination State' });
		variables.push({ variableId: 'illumination_value', name: 'Illumination Value' });
		variables.push({ variableId: 'shutter_position', name: 'Shutter State' });

		variables.push({ variableId: 'identification_family', name: 'Identification Family' });
		variables.push({ variableId: 'identification', name: 'Identification' });
		variables.push({ variableId: 'serial_number', name: 'Serial Number' });
		variables.push({ variableId: 'firmware_version', name: 'Firmware Version' });

		self.setVariableDefinitions(variables);
	},

	checkVariables: function () {
		let self = this;

		let variableObj = {};

		try {
			if ('power_state' in self.INFO) {
				variableObj['power_state'] = self.INFO['power_state'];
			}

			if('illumination_value' in self.INFO) {
				variableObj['illumination_value'] = self.INFO['illumination_value'];
			}

			if ('illumination_state' in self.INFO) {
				//variableObj['illumination_state'] = self.INFO['illumination_state'];
			}
			
			if ('shutter_position' in self.INFO) {
				variableObj['shutter_position'] = self.INFO['shutter_position'];
			}

			if ('identification' in self.INFO) {
				variableObj['identification_family'] = self.INFO['identification']['IdentificationFamily'];
				variableObj['identification'] = self.INFO['identification']['Identification'];
				variableObj['serial_number'] = self.INFO['identification']['SerialNumber'];
				variableObj['firmware_version'] = self.INFO['identification']['version'];
			}

			self.setVariableValues(variableObj);
		}
		catch(error) {	
			self.log('error', 'Error Processing Variables: ' + String(error));
		}
	}
}