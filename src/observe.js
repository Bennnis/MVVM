var observe = (data) => {
    if (typeof data !== 'object') return 

    for (var key in data) {
        defineReactive(data, key, data[key])
    }
}

var defineReactive = (data, key, val) => {
    if (typeof val === 'object') observe(val)

    var dep = new Dep()

    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: false,
        get: function() {
            return val
        },
        set: function(newVal) {
            console.log('change:', val, ' => ', newVal)
            val = newVal
            dep.notify()
        }
    })
}