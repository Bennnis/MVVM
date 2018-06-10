class TT {
    constructor (options) {
        this.$vm = options.data //视图模型
        this.$el = document.querySelector(options.el)   //root元素
        new Compile(this.$vm, this.$el) //解析 vm => el
    }
}