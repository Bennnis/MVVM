function Dep() {}

Dep.prototype = {
    subs: [],
    addDep: function(sub) {
        this.subs.push(sub)
    },
    notify: function() {
        this.subs.forEach(function(sub) {
            sub.update()
        })
    } 
}