function Watcher(vm, exp, cb) {
    this.$vm = vm
    this.$cb = cb

    console.log(typeof exp)
    if (typeof exp === 'funciton') {
        this.getter = exp
    } else {
        this.getter = this.parseGetter(vm, exp)
    }

    this.value = this.getValue()

    var dep = new Dep()
    dep.addDep(this)
}

Watcher.prototype = {
    getValue: function () {
        return this.getter.call(this.$vm)
    },

    parseGetter: function (vm, exp) {
        return function () {
            return CompileUtil._getVMVal(vm, exp)
        }
    },

    update: function () {
        var oldVal = this.value
        var newVal = this.getValue()
        
        oldVal !== newVal && this.$cb(newVal, oldVal)
    }
}