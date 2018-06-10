class Compile {
    constructor(vm, node) {
        this.$vm = vm

        //将dom节点转换为fragment文档碎片，性能优化
        this.$fragmentEl = this.node2Fragment(node)

        //实现 M => V 的核心方法
        this.m2v(this.$fragmentEl)

        node.appendChild(this.$fragmentEl)
    }

    /* 
    * 1. 遍历子节点处理不同类型的元素 ps: 文本节点编译 {{ varible }}，dom节点编译指令集
    * 2. 递归处理
    */
    m2v(el) {

        var childNodes = el.childNodes,
            self = this

        childNodes.forEach(function (node) {
            if (node.nodeType === 1) {
                // console.log('dom element')
            } else if (node.nodeType === 3) {
                self.compileText(node)
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

    compileText(textNode) {
        var text = textNode.textContent
        //正则匹配文本模板
        var reg = /\{\{(.*)\}\}/

        if (!reg.test(text)) return
        
        Updater.textUpdater(textNode, text.replace(RegExp.$1, this._getVMVal(RegExp.$1.trim())).replace(/\{|\}/g, ''))
    } 

    compileElement() {
        
    }

    _getVMVal(exp) {
        var val = this.$vm

        var exps = exp.split('.')
        if (exps && exps.length > 1) {
            exps.some(function(childExp) {            
                val = val[childExp]
                if (typeof val !== 'object') return true
            })
        } else {
            val = val[exp]
        }

        return val
    }
}

var Updater = {
    textUpdater (node, value) {
        node.textContent = value
    }
}