const { InstanceStatus, TCPHelper } = require('@companion-module/base')

module.exports = {
	initTCP: function() {
		let self = this;
		let receivebuffer = '';
		self.state = 0;
		self.requests = {};
		self.INFO = {};
	
		if (self.socket !== undefined) {
			self.socket.destroy();
			delete self.socket;
		}
	
		if (self.config.host) {
			self.socket = new TCPHelper(self.config.host, self.config.port);
	
			self.socket.on('error', function (err) {
				self.log('error',"Network error: " + err.message);
	
				if (self.INTERVAL !== undefined) {
					clearInterval(self.INTERVAL);
					self.INTERVAL = undefined;
				}
			});
	
			self.socket.on('connect', function () {
				self.log('debug',"Connected");
				self.updateStatus(InstanceStatus.Ok, 'Connected');
				self.sendCommand('system.getidentifications', {}, function(err, res) {
					self.INFO['identification'] = res;
					self.log('info',"Connected to " + res.IdentificationFamily + " (" + res.Identification + "): sn " + res.SerialNumber + " fw " + res.version);
					self.checkVariables();
				});
	
	
				self.sendCommand('notification.list', {}, function(err, res) {
					console.log("notification.list():",err,"RES",res);
				});

				self.startInterval();
			});
	
			// separate buffered stream into lines with responses
			self.socket.on('data', function (chunk) {
				let i = 0, line = '', offset = 0;
	
				receivebuffer += chunk.toString();
	
				let braces = 0;
				let cmd_buffer = '';
				let startoffset = 0;
				let in_string = false;
				let next_doesnt_count = false;
	
				for (let i = 0; i < receivebuffer.length; i++) {
	
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
							let ret = "" + cmd_buffer;
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
						//console.log('ex: i='+i+', chr='+receivebuffer[i]+' in_string='+in_string+', startoffset='+startoffset+', cmd_buffer="'+cmd_buffer+'" "'+receivebuffer+'"');
					}
	
				}
	
				receivebuffer = receivebuffer.substr(offset);
			});
	
			self.socket.on('receiveline', function (line) {
				let obj = {};
	
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
				}
				catch(error) {
					self.log('debug', 'ERROR PARSING JSON DATA: ' + error.toString());
				}
			});
	
		}
	},

	sendCommand: function(method, params, cb) {
		let self = this;

		self.counter++;

		self.requests['req' + self.counter] = {
			method: method,
			params: params,
			callback: cb
		};

		let line = '{"method":"'+method+'","id":"'+self.counter+'","params":'+JSON.stringify(params)+',"jsonrpc":"2.0"}';

		if (self.socket !== undefined && self.socket.isConnected) {
			self.socket.send(line);

			self.log('debug', 'SEND['+self.counter+']: ' + line);
		}
		else {
			self.log('error', 'Socket not connected');
		}
	},

	startInterval: function() {
		let self = this;

		self.log('debug', 'Starting update interval: ' + self.config.interval + 'ms');

		if (self.INTERVAL !== undefined) {
			clearInterval(self.INTERVAL);
			self.INTERVAL = undefined;
		}

		if (self.config.polling == true) {
			self.INTERVAL = setInterval(function() {
				self.getInformation();
			}, self.config.interval);
		}
	},

	getInformation: function() {
		let self = this;

		self.sendCommand('property.get', {"property": "system.state"}, (err, res) => {	
			self.INFO['power_state'] = res;
			self.checkVariables();
			self.checkFeedbacks();
		});

		self.sendCommand('property.get', {"property": "optics.shutter.position"}, (err, res) => {	
			self.INFO['shutter_position'] = res;
			self.checkVariables();
			self.checkFeedbacks();
		});

		self.sendCommand("property.get", { "property": "illumination.state" }, function(err, res) {
			console.log("property.get():",err,"RES",res);
			self.checkVariables();
			self.checkFeedbacks();
		});
	}
}