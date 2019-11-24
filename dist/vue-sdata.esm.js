import { tryParseJson } from 'js-helpers/dist/json/tryParseJson';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function isNan(val) {
    return val !== val;
}

var SData = function () {
    function SData(_ref) {
        var name = _ref.name;

        _classCallCheck(this, SData);

        var data = window[name] || {};

        this.originalData = data;

        this._setData(data);

        try {
            delete window[name];
        } catch (e) {
            window[name] = undefined;
        }

        var jsEl = document.getElementById('js');

        if (jsEl) jsEl.parentElement.removeChild(jsEl);
    }

    _createClass(SData, [{
        key: 'setData',
        value: function setData(data) {
            var syncOriginal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (syncOriginal) this.originalData = data;

            this._setData(data);
        }
    }, {
        key: 'set',
        value: function set(key, val) {
            var syncOriginal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            this[key] = val;
            this.keys.push(key);
            if (syncOriginal) this.originalData[key] = val;
        }
    }, {
        key: 'get',
        value: function get(key) {
            var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var value = this[key];

            if (!value) {
                if (isNan(value) || value === null || typeof value === 'undefined') {
                    return def;
                }
            }

            return value;
        }
    }, {
        key: 'del',
        value: function del(key) {
            var syncOriginal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (!this.has(key)) return;
            this.keys.splice(this.keys.indexOf(key), 1);
            delete this[key];
            if (syncOriginal) {
                Object.prototype.hasOwnProperty.call(this.originalData, key) && delete this.originalData[key];
            }
        }
    }, {
        key: 'has',
        value: function has(key) {
            return this.keys.indexOf(key) !== -1;
        }
    }, {
        key: 'getOriginalData',
        value: function getOriginalData() {
            return this.originalData;
        }
    }, {
        key: 'getAll',
        value: function getAll() {
            var _this = this;

            var all = {};
            this.keys.forEach(function (key) {
                all[key] = _this[key];
            });
            return all;
        }
    }, {
        key: '_setData',
        value: function _setData(data) {
            var _this2 = this;

            this.keys = this.keys || [];
            Object.keys(data).forEach(function (field) {
                _this2[field] = data[field];
                _this2.keys.push(field);
            });
        }
    }]);

    return SData;
}();

function install(Vue, options) {

    var SData$1 = new SData(options);

    Vue.mixin({
        methods: {
            getSData: function getSData(pName) {
                var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
                var data = arguments[2];
                var isTryParse = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

                if (typeof data === 'undefined') return this.getJSData(pName, def, isTryParse);

                var value = data[pName] == null ? def : data[pName];

                return isTryParse ? tryParseJson(value) : value;
            },
            getJSData: function getJSData(pName) {
                var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
                var isTryParse = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

                if (!SData$1.has(pName)) return def;

                return isTryParse ? tryParseJson(SData$1.get(pName, def)) : SData$1.get(pName, def);
            }
        }
    });
}

// Create module definition for Vue.use()
var plugin = {
    install: install

    // To auto-install when vue is found
    /* global window global */
};var GlobalVue = null;
if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
}
if (GlobalVue) {
    GlobalVue.use(plugin);
}

// Inject install function into component - allows component
// to be registered via Vue.use() as well as Vue.component()
SData.install = install;

// It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;

export default SData;
