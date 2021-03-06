/**
 * @author <a href="http://www.affka.ru">Vladimir Kozhin</a>
 * @license MIT
 */

'use strict';

const Jii = require('../../../BaseJii');
const Client = require('../Client');
const TransportInterface = require('../transport/TransportInterface');
const PluginInterface = require('./PluginInterface');

class AutoReconnect extends PluginInterface {

    preInit() {
        /**
         * @type {number}
         */
        this._tryReconnectNumber = 0;

        /**
         * Maximal retry interval in milliseconds
         * @type {number}
         */
        this.maxRetryInterval = 20000;

        /**
         * Minimal retry interval in milliseconds
         * @type {number}
         */
        this.minRetryInterval = 2000;

        /**
         * @type {boolean}
         */
        this.enable = true;

        super.preInit(...arguments);
    }

    init() {
        this.comet.on(Client.EVENT_OPEN, this._onOpen.bind(this));
        this.comet.transport.on(TransportInterface.EVENT_CLOSE, this._onClose.bind(this));
    }

    _onOpen() {
        this._tryReconnectNumber = 0;
    }

    _onClose() {
        if (this.enable && !this.comet.isForceClosed()) {
            setTimeout(() => {
                this._tryReconnectNumber++;
                this.comet.open();
            }, this._tryReconnectNumber > 10 ? this.maxRetryInterval : this.minRetryInterval);
        }
    }

}
module.exports = AutoReconnect;