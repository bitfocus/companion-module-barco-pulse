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
	self.socket.write(line)
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
	self.system.emit('instance_actions', self.id, {
		'POWOFF': { label: 'Power on' },
		'POWON': { label: 'Turn on' },
		'ILLOFF': { label: 'Illumination off' },
		'ILLON': { label: 'Illumination on' },
		'FACTORY': { label: 'Factory reset all' }
	});
}

instance.prototype.action = function(action) {
	var self = this;
	var cmd = action.action;

	var pj_command;
	var pj_args = {};

	// Power state
	if (cmd == 'POWON') { pj_command = 'system.poweron'; }
	else if (cmd == 'POWOFF') { pj_command = 'system.poweroff'; }

	// Illumination state
	else if (cmd == 'ILLON') { pj_command = 'illumination.ignite'; }
	else if (cmd == 'ILLOFF') { pj_command = 'illumination.extinguish'; }

	else if (cmd == 'FACTORY') { pj_command = 'system.resetall'; }

	if (pj_command !== undefined) {
		self.request(pj_command, pj_args, function() {});
	}

};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
