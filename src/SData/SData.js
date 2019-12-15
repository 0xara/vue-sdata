
function isNan(val) {
    return val !== val;
}

class SData {
    constructor({ name, id } = {}) {
        const data = window[name] || {};

        this.originalData = data;

        this._setData(data);

        try {
            delete window[name];
        } catch(e) {
            window[name] = undefined;
        }

        const jsEl = document.getElementById(id);

        if(jsEl) jsEl.parentElement.removeChild(jsEl);
    }

    setData(data, syncOriginal = false) {
        if(syncOriginal) this.originalData = data;

        this._setData(data);
    }

    set(key, val, syncOriginal = false) {
        this[key] = val;
        this.keys.push(key);
        if(syncOriginal) this.originalData[key] = val;
    }

    get(key, def = null) {
        const value = this[key];

        if(!value) {
            if(isNan(value)
                || value === null
                || typeof value === 'undefined') { return def; }
        }

        return value;
    }

    del(key, syncOriginal = false) {
        if(!this.has(key)) return;
        this.keys.splice(this.keys.indexOf(key),1);
        delete this[key];
        if(syncOriginal) {
            Object.prototype.hasOwnProperty.call(this.originalData, key)
                                            && delete this.originalData[key];
        }
    }

    has(key) {
        return this.keys.indexOf(key) !== -1;
    }

    getOriginalData() {
        return this.originalData;
    }

    getAll() {
        const all = {};
        this.keys.forEach((key) => {
            all[key] = this[key];
        })
        return all;
    }

    _setData(data) {
        this.keys = this.keys || [];
        Object.keys(data).forEach((field) => {
            this[field] = data[field];
            this.keys.push(field);
        });
    }
}


export default SData;
