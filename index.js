var tcp =           require('../../tcp');
var instance_skel = require('../../instance_skel');
var debug;
var log;

function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	self.actions(); // export actions
	//self.init_presets();


	return self;
}

instance.prototype.init = function() {
	var self = this;

	debug = self.debug;
	log = self.log;

	self.status(self.STATUS_UNKNOWN);

	//self.init_presets();
	self.init_tcp();
}

instance.prototype.updateConfig = function(config) {
	var self = this;
	self.config = config;

	if (self.tcp !== undefined) {
		self.tcp.destroy();
		delete self.tcp;
	}

	self.init_tcp();
}

instance.prototype.init_tcp = function() {
	var self = this;

	var host = self.config.host;
	var port = self.config.port; // fixed port?

	if (self.config.host !== undefined) {
		self.tcp = new tcp(host, port);

		self.tcp.on('status_change', function (status, message) {
			self.status(status, message);
		});

		self.tcp.on('error', function (err) {
			debug("Network error", err);
			self.log('error',"Network error: " + err.message);
		});

		self.tcp.on('connect', function () {
			debug("Connected");
		});
	}
}

// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;

	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 6,
			regex: self.REGEX_IP
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Target Port',
			default: '9090',
			width: 5,
			regex: self.REGEX_PORT
		}
	]
}

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;

	if (self.tcp !== undefined) {
		self.tcp.destroy();
	}

	debug("destroy", self.id);
}

instance.prototype.init_presets = function () {
	var self = this;
	var presets = [];

	self.setPresetDefinitions(presets);
}

instance.prototype.actions = function(system) {
	var self = this;

	self.setActions({
		'input': {
			label: 'Select input',
			options: [{
				type: 'dropdown',
				label: 'input',
				id: 'input',
				default: 'HDMI',
				choices: [
					{id: 'HDMI', label: 'HDMI'},
					{id: 'Displayport 1', label: 'Displayport 1'}
				]
			}]
		},
		'power': {
			label: 'Power on/off',
			options: [{
				type: 'dropdown',
				label: 'on/off',
				id: 'state',
				default: 'on',
				choices: [
					{id: 'on', label: 'Power on'},
					{id: 'off', label: 'Power off'}
				]
			}]
		},
		'shutter': {
			label: 'Shutter open/close',
			options: [{
				type: 'dropdown',
				label: 'open/close',
				id: 'state',
				default: 'open',
				choices: [
					{id: 'open', label: 'Open'},
					{id: 'close', label: 'Close'}
				]
			}]
		},
		'shutter2': {
			label: 'Shutter open/close other function',
			options: [{
				type: 'dropdown',
				label: 'open/close',
				id: 'state',
				default: 'open',
				choices: [
					{id: 'open', label: 'Open'},
					{id: 'close', label: 'Close'}
				]
			}]
		},
		'shutterEnable': {
			label: 'Shutter Enable'
		}
	});
}

instance.prototype.action = function(action) {
	var self = this;
	var options = action.options;

	var cmd;

	var jsonArray = {};

	switch(action.action) {
		case 'input':
			jsonArray.jsonrcp = "2.0";
			jsonArray.method = "property.set";
			jsonArray.params = { "property": "image.windows.main.source", "value": options.input};
			cmd = JSON.stringify(jsonArray);
			console.log(cmd);
			break;

		case 'power':
			if (options.state == "off") {
				jsonArray.method = "system.poweroff";
			} else {
				jsonArray.method = "system.poweron";
			}
			jsonArray.params = {"property": "system.state"};
			if (options.state == "off") {
				jsonArray.id = "4";
			} else {
				jsonArray.id = "3";
			}
			jsonArray.jsonrcp = "2.0";
			cmd = JSON.stringify(jsonArray);
			console.log(cmd);
			break;

		case 'getSources':
			jsonArray.jsonrcp = "2.0";
			jsonArray.method = "image.source.list";
			jsonArray.id = 1;
			cmd = JSON.stringify(jsonArray);
			break;

		case 'shutter':
			jsonArray.jsonrcp = "2.0";
			jsonArray.method = "property.set";
			if (options.state == 'open') {
				jsonArray.params = {"property": "optics.shutter.postion", "value": "open"};
			} else if (options.state == 'close') {
				jsonArray.params = {"property": "optics.shutter.postion", "value": "close"};
			}
			cmd = JSON.stringify(jsonArray);
			console.log(cmd);
			break;

		case 'shutter2':
			jsonArray.jsonrcp = "2.0";
			jsonArray.method = "property.set";
			if (options.state == 'open') {
				jsonArray.params = {"property": "optics.shutter.target", "value": "open"};
			} else if (options.state == 'close') {
				jsonArray.params = {"property": "optics.shutter.target", "value": "close"};
			}
			cmd = JSON.stringify(jsonArray);
			console.log(cmd);
			break;

		case 'shutterEnable':
			var jsonArray = {};
			jsonArray.jsonrcp = "2.0";
			jsonArray.method = "property.set";
			jsonArray.params = {"property": "optics.shutter.enabled", "enabled": true};
			cmd = JSON.stringify(jsonArray);
			break;
	}

	//send the command
	if (cmd !== undefined) {
		if (self.tcp !== undefined) {
			self.tcp.send(cmd);
		} else {
			debug('Socket not connected.');
		}
	}
}

instance_skel.extendedBy(instance);
exports = module.exports = instance;
