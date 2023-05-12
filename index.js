const { InstanceBase, InstanceStatus, runEntrypoint } = require('@companion-module/base')
const UpgradeScripts = require('./src/upgrades')

const config = require('./src/config')
const actions = require('./src/actions')
const feedbacks = require('./src/feedbacks')
const variables = require('./src/variables')
const presets = require('./src/presets')

const utils = require('./src/utils')
const constants = require('./src/constants');

class pulseInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		// Assign the methods from the listed files to this class
		Object.assign(this, {
			...config,
			...actions,
			...feedbacks,
			...variables,
			...presets,
			...utils,
			...constants
		})

		this.firmwareVersion = '0';
		this.counter = 0;
		this.state = 0;

		this.socket = undefined;

		this.INFO = {};

		this.INTERVAL = undefined;
	}

	async destroy() {
		let self = this;

		if (self.socket !== undefined) {
			self.socket.destroy();
		}

		if (self.INTERVAL !== undefined) {
			clearInterval(self.INTERVAL);
			self.INTERVAL = undefined;
		}
	
		self.requests = {};
	}

	async init(config) {
		this.configUpdated(config)
	}

	async configUpdated(config) {
		this.config = config
	
		this.updateStatus(InstanceStatus.Connecting);
		
		this.initActions()
		this.initFeedbacks()
		this.initVariables()
		this.initPresets()

		this.checkVariables();
		this.checkFeedbacks();

		this.initTCP();
	}
}

runEntrypoint(pulseInstance, UpgradeScripts);