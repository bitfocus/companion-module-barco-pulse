var tcp = require('../../tcp');
var instance_skel = require('../../instance_skel');
var debug;
var log;

function instance(system, id, config) {
	var self = this;

	this.firmwareVersion = "0";

	// super-constructor
	instance_skel.apply(this, arguments);
	self.counter = 0;
	self.actions(); // export actions

	return self;
}

instance.prototype.updateConfig = function(config) {
	var self = this;
	self.state = 0;
	self.config = config;
	self.init_tcp();
};

instance.prototype.init = function() {
	var self = this;

	debug = self.debug;
	log = self.log;

	self.init_tcp();
	self.initPresets();
};

instance.prototype.init_tcp = function() {
	var self = this;
	var receivebuffer = '';
	self.state = 0;
	self.requests = {};
	self.info = {};

	if (self.socket !== undefined) {
		self.socket.destroy();
		delete self.socket;
	}

	if (self.config.host) {
		self.socket = new tcp(self.config.host, 9090);

		self.socket.on('status_change', function (status, message) {
			self.status(status, message);
		});

		self.socket.on('error', function (err) {
			debug("Network error", err);
			self.log('error',"Network error: " + err.message);

			if (self.infointerval !== undefined) {
				clearInterval(self.infointerval);
			}

		});

		self.socket.on('connect', function () {
			debug("Connected");


			self.infointerval = setInterval(function() {
/*
				self.request('environment.getcontrolblocks', { "type": "Sensor", "valuetype": "Speed" }, function(err, res) {
					debug('speed controlblocks:', err, "res", res);
				});

				self.request('environment.getcontrolblocks', { "type": "Sensor", "valuetype": "Temperature" }, function(err, res) {
					debug('temperature controlblocks:', err, "res", res);
				});

				self.request('environment.getcontrolblocks', { "type": "Sensor", "valuetype": "Humidity" }, function(err, res) {
					debug('humidity controlblocks:', err, "res", res);
				});

				self.request('environment.getcontrolblocks', { "type": "Sensor", "valuetype": "Pressure" }, function(err, res) {
					debug('pressure controlblocks:', err, "res", res);
				});

				self.request('environment.getcontrolblocks', { "type": "Sensor", "valuetype": "Power" }, function(err, res) {
					debug('power controlblocks:', err, "res", res);
				});

				self.request('environment.getcontrolblocks', { "type": "Sensor", "valuetype": "Altitude" }, function(err, res) {
					debug('altitude controlblocks:', err, "res", res);
				});

				self.request('environment.getcontrolblocks', { "type": "Sensor", "valuetype": "Waveform" }, function(err, res) {
					debug('waveform controlblocks:', err, "res", res);
				});

				self.request('environment.getcontrolblocks', { "type": "Sensor", "valuetype": "Current" }, function(err, res) {
					debug('current controlblocks:', err, "res", res);
				});

				self.request('environment.getcontrolblocks', { "type": "Sensor", "valuetype": "Voltage" }, function(err, res) {
					debug('voltage controlblocks:', err, "res", res);
				});
*/
			}, 3000);


			self.request('system.getidentifications', {}, function(err, res) {
				self.info['identification'] = res;
				self.log('info',"Connected to " + res.IdentificationFamily + " (" + res.Identification + "): sn " + res.SerialNumber + " fw " + res.version);
			});


			self.request('notification.list', {}, function(err, res) {
				console.log("notification.list():",err,"RES",res);
			});

		/*	self.request("introspect",  { "object": "environment", "recursive": true }, function(err, res) {
				console.log(JSON.stringify(res, null, 4));
			});*/
/*
			self.request("signal.subscribe", { "signal": "modelupdated" }, function() {} );
			var props = {
				"property": [
					"system.state",
					"image.brightness",
					"image.connector.l1sdia.detectedsignal",
					"image.processing.warp.file.enable",
					"network.hostname",
					"notification.count",
					"optics.lenspresent",
					"statistics.laserstrikes.value",
					"statistics.projectorruntime.value",
					"statistics.laserruntime.value",
					"screen.luminance",
					"statistics.systemtime.value",
					"statistics.uptime.value",
					"system.initialstate",
					"system.ready.timeout.duration",
					"system.ready.timeout.enable",
					"environment.alarmstate"
				]
			};

			self.request("property.set", { "property": "system.ready.timeout.enable", "value": false });

			self.request("property.get", props, function(err, res) {
					console.log("property.get(): ERR",err, "RES", res)
			});

			self.request('property.get', { "property": "environment.aggregated_diagnosisstatus.observableoutput"}, function(err, res) {
				console.log('getallcontrolblocks()', JSON.stringify(res, null, 4));
			})
			self.request("property.subscribe", props, function() {} );

			self.request("system.gotoready",  { }, function(err, res) {
				console.log("system.gotoready():",err,"RES",res);
			});

			self.request("image.source.list", { }, function(err, res) {
				console.log("image.source.list:",err,"RES",res);
			});
*/
			self.request("property.get", { "property": "illumination.state" }, function(err, res) {
				console.log("property.get():",err,"RES",res);
			});


		});

		// separate buffered stream into lines with responses
		self.socket.on('data', function (chunk) {

			var i = 0, line = '', offset = 0;

			receivebuffer += chunk.toString();

			var braces = 0;
			var cmd_buffer = '';
			var startoffset = 0;
			var in_string = false;
			var next_doesnt_count = false;

			for (var i = 0; i < receivebuffer.length; i++) {

				if (receivebuffer[i] == '{' && !in_string) {
					braces++;
					cmd_buffer += '{';
					startoffset = i;
				}

				else if (receivebuffer[i] == '}' && !in_string) {
					braces--;
					cmd_buffer += '}';

					if (braces === 0) {
						receivebuffer = receivebuffer.slice(i+1);
						startoffset = 0;
						braces = 0;
						i=-1;
						var ret = "" + cmd_buffer;
						cmd_buffer = '';
						self.socket.emit('receiveline', ret);
					}

				}

				else if (braces > 0) {

					if (!in_string && receivebuffer[i] == '"') {
						in_string = true;
					}

					else if (in_string && receivebuffer[i] == '\\' && receivebuffer[i+1] == '"') {
						cmd_buffer += receivebuffer[i];
						i++;
					}

					else if (in_string && receivebuffer[i] == '"') {
						in_string = false;
					}

					cmd_buffer += receivebuffer[i];

				}

				else {
					console.log('ex: i='+i+', chr='+receivebuffer[i]+' in_string='+in_string+', startoffset='+startoffset+', cmd_buffer="'+cmd_buffer+'" "'+receivebuffer+'"');
				}

			}

			receivebuffer = receivebuffer.substr(offset);

		});

		self.socket.on('receiveline', function (line) {
			var obj = {};

			try {
				obj = JSON.parse(line);
				if (self.requests['req' + obj.id] !== undefined) {
					self.requests['req' + obj.id].callback(obj.error || null, obj.result || null);
					delete self.requests['req' + obj.id];
				}
				else {
					// notification
					console.log("NOTIFICATION:", line);

				}
			} catch(e) {
				debug('ERROR PARSING JSON DATA', e);
				console.log("RAW:", line);
			}
		});

	}
	self.initPresets();
};

/*
instance.prototype.monitor_log_poll = function() {
	var self = this;
};
*/

instance.prototype.request = function(method, params, cb) {
	var self = this;
	self.counter++;
	self.requests['req' + self.counter] = {
		method: method,
		params: params,
		callback: cb
	};
	var line = '{"method":"'+method+'","id":"'+self.counter+'","params":'+JSON.stringify(params)+',"jsonrpc":"2.0"}';
	self.socket.write(line);
	console.log(line);
	debug('SNED['+self.counter+']:', line);
};

// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;

	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'Projector IP',
			width: 6,
			default: '192.168.1.100',
			regex: self.REGEX_IP
		}
	]
};

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;

	if (self.socket !== undefined) {
		self.socket.destroy();
	}

	self.requests = {};
};

instance.prototype.actions = function(system) {
	var self = this;

	self.setActions({
		'power': {
			label: 'Power',
			options: [{
				type: 'dropdown',
				label: 'Power',
				id: 'power',
				default: 'on',
				choices: [
					{id: 'off', label: 'Projector off'},
					{id: 'on', label: 'Projector on'}
				]
			}]
		},
		'illumination': {
			label: 'Illumination',
			options: [{
				type: 'dropdown',
				label: 'illumination',
				id: 'illumination',
				default: 'on',
				choices: [
					{id: 'off', label: 'Extinguish'},
					{id: 'on', label: 'Illuminate'}
				]
			}]
		},
		'OSD': {
			label: 'OSD on',
			options: [{
				type: 'dropdown',
				label: 'Show OSD?',
				id: 'osd',
				default: 'off',
				choices: [
					{id: 'off', label: 'OSD Off'},
					{id: 'on', label: 'OSD On'}
				]
			}]
		},
		'input': {
			label: 'Select input',
			options: [{
				type: 'dropdown',
				label: 'input',
				id: 'input',
				default: 'HDMI',
				choices: [
					{id: 'L1 HDMI', label: 'HDMI'},
					{id: 'L1 Displayport', label: 'Displayport'}
				]
			}]
		},
		'shift': {
			label: 'Shift lens',
			options: [{
				type: 'dropdown',
				label: 'Direction',
				id: 'direction',
				default: 'RC_SHIFT_UP',
				choices: [
					{id: 'RC_SHIFT_UP', label: 'up'},
					{id: 'RC_SHIFT_DOWN', label: 'down'},
					{id: 'RC_SHIFT_LEFT', label: 'left'},
					{id: 'RC_SHIFT_RIGHT', label: 'right'}]
			},{
				type: 'dropdown',
				label: 'press/release',
				id: 'pressRelease',
				choices: [
					{id: 'press', label: 'press'},
					{id: 'release', label: 'release'}]
			}]
		},
		'shutter': {
			label: 'Shutter projector',
			options: [{
				type: 'dropdown',
				label: 'shutter open/close',
				id: 'shutter',
				default: 'Open',
				choices: [
					{id: 'Open', label: 'Shutter open'},
					{id: 'Closed', label: 'Shutter close'}]
			}]
		},
		'testpattern': {
			label: 'Testpattern on/off',
			options: [{
				type: 'dropdown',
				label: 'on/off',
				id: 'testpattern',
				default: 'on',
				choices: [
					{id: 'on', label: 'Testpattern on'},
					{id: 'off', label: 'Testpattern off'}]
			}]
		},
		'stealth': {
			label: 'Stealth mode (LEDs)',
			options: [{
				type: 'dropdown',
				label: 'Controlable leds on/off',
				id: 'stealth',
				default: 'on',
				choices: [
					{id: 'on', label: 'Stealth on'},
					{id: 'off', label: 'Stealth off'}]
			}]
		},
		'remoteKey': {
			label: 'Send remote button',
			options: [{
				type: 'dropdown',
				label: 'Button from remote controller',
				id: 'key',
				choices: [
					{id: 'RC_MENU', label: 'Menu'},
					{id: 'RC_BACK', label: 'Back'},
					{id: 'RC_UP', label: 'Up'},
					{id: 'RC_LEFT', label: 'Left'},
					{id: 'RC_OK', label: 'Ok'},
					{id: 'RC_RIGHT', label: 'Right'},
					{id: 'RC_DOWN', label: 'Down'}
				]
			}]
		}
	});
}

instance.prototype.action = function(action) {
	var self = this;
	var id = action.action;
	var options = action.options;

	var pj_command;
	var pj_args = {};

	switch(id) {

		case 'power':
			if (options.power == 'on') {
				pj_command = 'system.poweron';
			} else if (options.power == 'off') {
				pj_command = 'system.poweroff';
			}
			break;

		case 'illumination':
			if (options.illumination == 'on') {
				pj_command = 'illumination.ignite';
			} else if (options.illumination == 'off') {
				pj_command = 'illumination.extinguish';
			}
			break;

		case 'FACTORY':
			pj_command = 'system.resetall';
			break;

		case 'input':
			pj_command = 'property.set';
			pj_args = { "property": "image.window.main.source", "value": options.input };
			break;

		case 'OSD':
			pj_command = 'property.set';
			if (options.osd == "on") {
				 pj_args = { "property": "ui.osd", "value": true };
			} else {
				 pj_args = { "property": "ui.osd", "value": false };
			}
			break;

		case 'shutter':
			pj_command = 'property.set';
			pj_args = { "property": "optics.shutter.target", "value": options.shutter };
			break;

		case 'testpattern':
			pj_command = 'property.set';
			if (options.testpattern == "on") {
				 pj_args = { "property": "image.testpattern.show", "value": true };
			} else {
				 pj_args = { "property": "image.testpattern.show", "value": false };
			}
			break;

		case 'shift':
			if(options.pressRelease == "press") {
				pj_command = 'keydispatcher.sendpressevent';
				pj_args = { "key": options.direction };
			} else if (options.pressRelease == "release") {
				pj_command = 'keydispatcher.sendreleaseevent';
				pj_args = { "key": options.direction };
			}
			break;

		case 'stealth':
			pj_command = 'property.set';
			if( options.stealth == "on") {
				pj_args = { "property": "ui.stealthmode", "value": true };
			} else {
				pj_args = { "property": "ui.stealthmode", "value": false };
			}
			break;

		case 'remoteKey':
				pj_command = 'keydispatcher.sendclickevent';
				pj_args = { "key": options.key };
			break;

	}
	if (pj_command !== undefined) {
		self.request(pj_command, pj_args, function() {});
	}

};

instance.prototype.initPresets = function (updates) {
	var self = this;
	var presets = [];

	presets.push({
		category: 'Lens',
		bank: {
			style: 'text',
			text: 'Shutter close',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(235,235,235)
		},
		actions: [
			{
				action: 'shutter',
				options: {
					shutter: 'Closed'
				}
			}
		]
	})
	presets.push({
		category: 'Lens',
		bank: {
			style: 'text',
			text: 'Shutter open',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(235,235,235)
		},
		actions: [
			{
				action: 'shutter',
				options: {
					shutter: 'Open'
				}
			}
		]
	})
	presets.push({
		category: 'Lens',
		bank: {
			style: 'text',
			text: 'Shift UP',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(235,235,235)
		},
		actions: [
			{
				action: 'shift',
				options: {
					direction: 'RC_SHIFT_UP',
					pressRelease: 'press'
				}
			}
		],
		release_actions: [
			{
				action: 'shift',
				options: {
					direction: 'RC_SHIFT_UP',
					pressRelease: 'release'
				}
			}
		]
	})
	presets.push({
		category: 'Lens',
		bank: {
			style: 'text',
			text: 'Shift RIGHT',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(235,235,235)
		},
		actions: [
			{
				action: 'shift',
				options: {
					direction: 'RC_SHIFT_RIGHT',
					pressRelease: 'press'
				}
			}
		],
		release_actions: [
			{
				action: 'shift',
				options: {
					direction: 'RC_SHIFT_RIGHT',
					pressRelease: 'release'
				}
			}
		]
	})
	presets.push({
		category: 'Lens',
		bank: {
			style: 'text',
			text: 'Shift DOWN',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(235,235,235)
		},
		actions: [
			{
				action: 'shift',
				options: {
					direction: 'RC_SHIFT_DOWN',
					pressRelease: 'press'
				}
			}
		],
		release_actions: [
			{
				action: 'shift',
				options: {
					direction: 'RC_SHIFT_DOWN',
					pressRelease: 'release'
				}
			}
		]
	})
	presets.push({
		category: 'Lens',
		bank: {
			style: 'text',
			text: 'Shift LEFT',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(235,235,235)
		},
		actions: [
			{
				action: 'shift',
				options: {
					direction: 'RC_SHIFT_LEFT',
					pressRelease: 'press'
				}
			}
		],
		release_actions: [
			{
				action: 'shift',
				options: {
					direction: 'RC_SHIFT_LEFT',
					pressRelease: 'release'
				}
			}
		]
	})
	presets.push({
		category: 'Remote',
		bank: {
			style: 'text',
			text: 'Menu',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(235,235,235)
		},
		actions: [
			{
				action: 'remoteKey',
				options: {
					key: 'RC_MENU'
				}
			}
		]
	})
	presets.push({
		category: 'Remote',
		bank: {
			style: 'text',
			text: 'Up',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(235,235,235)
		},
		actions: [
			{
				action: 'remoteKey',
				options: {
					key: 'RC_UP'
				}
			}
		]
	})
	presets.push({
		category: 'Remote',
		bank: {
			style: 'text',
			text: 'Left',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(235,235,235)
		},
		actions: [
			{
				action: 'remoteKey',
				options: {
					key: 'RC_LEFT'
				}
			}
		]
	})
	presets.push({
		category: 'Remote',
		bank: {
			style: 'text',
			text: 'Down',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(235,235,235)
		},
		actions: [
			{
				action: 'remoteKey',
				options: {
					key: 'RC_DOWN'
				}
			}
		]
	})
	presets.push({
		category: 'Remote',
		bank: {
			style: 'text',
			text: 'Right',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(235,235,235)
		},
		actions: [
			{
				action: 'remoteKey',
				options: {
					key: 'RC_RIGHT'
				}
			}
		]
	})
	presets.push({
		category: 'Remote',
		bank: {
			style: 'text',
			text: 'Ok',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(235,235,235)
		},
		actions: [
			{
				action: 'remoteKey',
				options: {
					key: 'RC_OK'
				}
			}
		]
	})
	presets.push({
		category: 'Remote',
		bank: {
			style: 'text',
			text: 'Back',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(235,235,235)
		},
		actions: [
			{
				action: 'remoteKey',
				options: {
					key: 'RC_BACK'
				}
			}
		]
	})

	self.setPresetDefinitions(presets);
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
