'use strict';

var Component = require('../base/Component');

class WebUser extends Component {

    preInit() {
        this.role = null;
        this.id = null;

        super.preInit(...arguments);
    }
}

module.exports = WebUser;