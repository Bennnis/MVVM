class Compile {
    constructor(vm, node) {
        this.dirMap = [
            'v-text',
            'v-model'
        ]

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
                self.compileElement(node)
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

        CompileUtil.text(textNode, this.$vm, RegExp.$1)
    }

    //解析指令
    compileElement(node) {
        var self = this

        var arr = []
        arr.slice.call(node.attributes).forEach(function (dir) {
            if (self.isDirective(dir.name)) {
                var dirName = dir.name
                var dirValue = dir.nodeValue

                var updaterFn = CompileUtil[dirName.split('-')[1]]
                updaterFn(node, self.$vm, dirValue)
            }
        })
    }

    isDirective(dir) {
        return this.dirMap.indexOf(dir) !== -1
    }

    isModelDirective(dir) {
        return dir.trim() === 'v-model'
    }
}

var CompileUtil = {
    text(node, vm, exp) {
        CompileUtil.bind(node, vm, exp, 'text')
    },

    model(node, vm, exp) {
        CompileUtil.bind(node, vm, exp, 'model')

        var self = CompileUtil,
            val = CompileUtil._getVMVal(vm, exp);

        node.addEventListener('input', function (e) {
            var newValue = e.target.value;
            if (val === newValue) {
                return;
            }

            console.log(vm, exp, newValue, 'set')
            self._setVMVal(vm, exp, newValue);
        });
    },

    bind(node, vm, exp, dir) {
        var updaterFn = Updater[dir + 'Updater']

        updaterFn && updaterFn(node, this._getVMVal(vm, exp))

        new Watcher(vm, exp, function (newVal, oldVal) {
            updaterFn(node, newVal, oldVal)
        })
    },

    _getVMVal(vm, exp) {
        var val = vm

        var exps = exp.split(/\.|\[|\]/)

        if (exps.length > 1) {
            exps.forEach(function (expChild) {
                expChild = expChild.trim()
                if (expChild !== '') {
                    val = val[expChild]
                }
            })
        } else {
            val = val[exp.trim()]
        }

        return val
    },

    _setVMVal(vm, exp, value) {
        var val = vm
        var exps = exp.split(/\.|\[|\]/)

        var len = exps.length
        if (len > 1) {
            exps.forEach(function (expChild, idx) {
                expChild = expChild.trim()
                if (idx < len - 1) {
                    if (expChild !== '') {
                        val = val[expChild]
                    }
                } else {
                    val[expChild] = value
                }
            })
        } else {
            val[exp.trim()] = value
        }
    }
}

var Updater = {
    textUpdater(node, value) {
        node.textContent = value
    },

    modelUpdater(node, value) {
        node.value = value === undefined ? '' : value
    }
}