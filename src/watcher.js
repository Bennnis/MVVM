function Watcher(vm, exp, cb) {
    this.$vm = vm
    this.$exp = exp
    this.$cb = cb

    this.value = this.getValue()

    var dep = new Dep()
    dep.addDep(this)
}

Watcher.prototype = {
    getValue: function () {
        return CompileUtil._getVMVal(this.$vm, this.$exp)
    },

    update: function () {
        var oldVal = this.value
        var newVal = this.getValue()
        
        oldVal !== newVal && this.$cb(newVal, oldVal)
    }
}