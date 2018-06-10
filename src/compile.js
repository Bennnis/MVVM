class Compile {
    constructor(vm, node) {
        this.$vm = vm

        //将dom节点转换为fragment文档碎片，性能优化
        this.$fragmentEl = this.node2Fragment(node)

        //实现 M => V 的核心方法
        this.m2v(this.$fragmentEl)
    }

    /* 
    * 1. 遍历子节点处理不同类型的元素 ps: 文本节点编译 {{ varible }}，dom节点编译指令集
    * 3. 递归处理
    */
    m2v(el) {

        var childNodes = el.childNodes,
            self = this
        //正则匹配文本模板
        var reg = /\{\{(.*)\}\}/

        childNodes.forEach(function (node) {
            console.log(node)
            if (node.nodeType === 1) {
                console.log('dom element')
            } else if (node.nodeType === 3) {
                console.log('text element')
            }

            //判断是否存在子节点并进行递归处理
            if (node.childNodes && !!node.childNodes.length) self.m2v(node)
        })
    }

    node2Fragment(node) {
        var fragment = document.createDocumentFragment(),
            child

        //节点拷贝
        while (child = node.firstChild) {
            fragment.appendChild(child)
        }

        return fragment
    }
}