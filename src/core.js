class TT {
    constructor(options) {        
        this.$vm = this.parseVM(options) //视图模型
        this.$el = document.querySelector(options.el)   //root元素

        new Compile(this.$vm, this.$el) //解析 vm => el

        options.mounted.call(this.$vm)
    }

    parseVM(options) {
        var _default = {}

        var vm = Object.assign(
            _default,
            options.data,
            options.props,
            options.methods,
            options.computed
        )

        observe(vm)  

        return vm
    }
}