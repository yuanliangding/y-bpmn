<template>
    <button @click="save_">
        保存
    </button>
    <div id="y-bpmn-container" :style="style_">
        <div id="y-bpmn-sketchpad" ref="y-bpmn-sketchpad" :style="style_" />
        <slot name="palette" v-if="bpmnContext.entries" />
    </div>

    <div class="properties-panel-parent" id="properties-panel"></div>
</template>

<script>
    import YModeler from './modeler/YModeler'
    // import YModeler from 'bpmn-js/lib/Modeler'

    import {onMounted, provide, reactive} from  'vue';

    import propertiesPanelModule from 'bpmn-js-properties-panel';
    import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
    import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';
    import magicPropertiesProviderModule from './properties-panel/magic/provider';
    import magicModdleDescriptor from './properties-panel/magic/descriptors/magic';
    // import EmbeddedComments from 'bpmn-js-embedded-comments';
    import translate from './translate/translator';
    import minimapModule from 'diagram-js-minimap';
    import transactionBoundariesModule from 'bpmn-js-transaction-boundaries';

    import customModule from './custom'
    import customRender from './render/index'
    import contextPad from './contextPad/index'

    // import 'bpmn-js/dist/assets/diagram-js.css'
    // import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
    // import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
    // import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
    // import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'

    export default {
        name: 'BPMNDesigner',
        setup(){
            let bpmnContext = reactive({})
            onMounted(
                () => {
                    provide("bpmnContext", bpmnContext)
                }
            )
            return {bpmnContext}
        },
        data() {
            return {
                saveXMLHandler:null,
            }
        },
        props: {
            width: {
                type: String,
                default: "100%"
            },
            height: {
                type: String,
                default: "1000px"
            },
            bpmnXML: {
                type: String,
                required: true
            }
        },
        computed: {
            style_: function () {
                return {width: this.width, height: this.height}
            }
        },
        methods: {
            save_: function () {
                this.saveXMLHandler()
            }
        },
        emits: ['save'],
        created(){

        },
        mounted() {
            let self = this;
            let viewer_ = new YModeler({
                container: self.$refs['y-bpmn-sketchpad'],
                propertiesPanel: {
                    parent: '#properties-panel'
                },
                additionalModules: [
                    propertiesPanelModule,
                    propertiesProviderModule,
                    {
                        translate: [ 'value', translate ]
                    },
                    magicPropertiesProviderModule,
                    // EmbeddedComments,
                    // customModule,
                    minimapModule,
                    transactionBoundariesModule,
                    customModule,
                    customRender,
                    contextPad
                ],
                moddleExtensions: {
                    camunda: camundaModdleDescriptor,
                    magic: magicModdleDescriptor
                }
                // keyboard: {
                //     bindTo: document
                // },
                // bpmnRenderer: {
                //     defaultFillColor: '#333',
                //     defaultStrokeColor: '#fff'
                // },
                // textRenderer: {
                //     defaultStyle: {
                //         fontFamily: '"Nothing You Could Do"',
                //         fontWeight: 'bold',
                //         fontSize: 12,
                //         lineHeight: 16
                //     },
                //     externalStyle: {
                //         fontSize: 12,
                //         lineHeight: 16
                //     }
                // }

            });

            let defaultPalette = viewer_.get("palette")
            // [{ "group": "tools", "className": "bpmn-icon-hand-tool", "title": "", "action": {} },...]
            let entries = defaultPalette.getEntries()

            let groupIndex = {}
            let groups = []
            for (let eKey in entries) {
                let eVal = entries[eKey]
                if (!groupIndex[eVal.group]) {
                    groupIndex[eVal.group] = {'group':eVal.group, 'list':[]}
                    groups.push(groupIndex[eVal.group])
                }

                let group = groupIndex[eVal.group]
                console.log("group", group)
                group['list'].push({...eVal, 'dataAction':eKey})
            }

            this.bpmnContext.entries = groups


            // 解决代码框架bug. zoom is not a function
            viewer_.get('canvas').property = {
                zoom: function (z) {
                    if (!z) {
                        z = "fit-viewport"
                    }
                    viewer_.get('canvas').zoom = z;
                }
            }

            viewer_.importXML(this.bpmnXML).then(function (result) {
                const {warnings} = result;
                if (warnings.length > 0) {
                    console.log(warnings);
                }

                // viewer_.get('canvas').zoom = 'fit-viewport';
                viewer_.get('canvas').zoom("fit-viewport");

                // adjustPalette()
                console.log(adjustPalette)

                let transactionBoundaries = viewer_.get('transactionBoundaries');
                transactionBoundaries.show();
            }).catch(function (err) {
                console.log(err)
            });


            viewer_.get('minimap').open();

            viewer_.on('selection.changed', (e) => {
                const element = e.newSelection[0]
                console.log("selection.changed", element)
            })
            viewer_.on('element.changed', (e) => {
                const { element } = e
                console.log("element.changed", element)
            })
            viewer_.on('commandStack.changed', (e) => {
                const { element } = e
                console.log("commandStack.changed", element)
            })
            viewer_.on('shape.added', (e) => {
                const { element } = e
                console.log("shape.added", element)
            })
            viewer_.on('shape.move.end', (e) => {
                const { element } = e
                console.log("shape.move.end", element)
            })
            viewer_.on('shape.removed', (e) => {
                const { element } = e
                console.log("shape.removed", element)
            })
            viewer_.on('connect.end', (e) => {
                const { element } = e
                console.log("connect.end", element)
            })
            viewer_.on('connect.move', (e) => {
                const { element } = e
                console.log("connect.move", element)
            })
            viewer_.on('comments.updated', (e) => {
                const { element } = e
                console.log("comments.updated", element)
            });
            viewer_.on('canvas.click', function(e) {
                const { element } = e
                console.log("canvas.click", element)

                viewer_.get('comments').collapseAll();
            });

            let eventBus = viewer_.get('eventBus')
            eventBus.on('element.click', (e) => {
                const { element } = e
                console.log("element.click", element)

                let elementRegistry = viewer_.get('elementRegistry')
                //下面没取到数据
                console.log(elementRegistry.get(e.id))

                console.log("businessObject", element.businessObject)

                // 节点高亮
                var modeling = viewer_.get('modeling');
                modeling.setColor(element, {
                    stroke: 'green',
                    fill: 'yellow'
                });

                // 增加 overlay
                // let overlays = viewer_.get('overlays');
                // let overlayId = overlays.add(element, {
                //     position: {
                //         bottom: 0,
                //         right: 0
                //     },
                //     html: '<div>Mixed up the labels?</div>'
                // });
                // console.log(overlayId)
                // setTimeout(function () {
                //     overlays.remove(overlayId)
                // }, 2000)
            })
            eventBus.on('element.changed', (e) => {
                const { element } = e
                console.log("element.changed", element)
            })
            eventBus.on('element.mouseup', (e) => {
                const { element } = e
                console.log("element.mouseup", element)
            })
            eventBus.on('element.mousedown', (e) => {
                const { element } = e
                console.log("element.mousedown", element)
            })
            eventBus.on('element.dblclick', (e) => {
                const { element } = e
                console.log("element.dblclick", element)
            })
            eventBus.on('element.out', (e) => {
                const { element } = e
                console.log("element.out", element)
            })
            eventBus.on('element.hover', (e) => {
                const { element } = e
                console.log("element.hover", element)
            })

            // 修改元素属性
            // let moddle = viewer_.get('moddle');
            // let newCondition = moddle.create('bpmn:FormalExpression', {
            //     body: '${ value > 100 }'
            // });
            // console.log(newCondition)
            // let modeling = viewer_.get('modeling');
            // modeling.updateProperties(sequenceFlowElement, {
            //     conditionExpression: newCondition
            // });

            // 更改中bpmn.js中的属性信息
            // const modeling = viewer_.get('modeling')
            // modeling.updateLabel(this.element, name)
            // modeling.setColor(this.element, {
            //     fill: null,
            //     stroke: color
            // })
            // modeling.updateProperties(this.element, {color: color})

            // 调整左侧工具栏排版
            let adjustPalette = function() {
                try {
                    const canvas = self.$refs['y-bpmn-sketchpad'];

                    const djsPalStyle = {
                        width: "130px",
                        padding: "5px",
                        background: "white",
                        left: "20px",
                        borderRadius: 0
                    };

                    const djsPalette = canvas.children[0].children[1].children[4];
                    for (var key in djsPalStyle) {
                        djsPalette.style[key] = djsPalStyle[key];
                    }

                    // 左边控制面板
                    let paletteLable = {
                        "hand-tool":{"label":"抓手工具","title":"我汉化了，哈哈"},            //Activate the hand tool
                        "lasso-tool":{"label":"框选工具","title":"我汉化了，哈哈"},           //Activate the lasso tool
                        "space-tool":{"label":"空间工具","title":"我汉化了，哈哈"},           //Activate the create/remove space tool
                        "global-connect-tool":{"label":"连接工具","title":"我汉化了，哈哈"},  //Activate the global connect tool
                        "create.start-event":{"label":"开始","title":"我汉化了，哈哈"},         //Create StartEvent
                        "create.intermediate-event":{"label":"中间","title":"我汉化了，哈哈"},  //Create Intermediate/Boundary Event
                        "create.end-event":{"label":"结束","title":"我汉化了，哈哈"},           //EndEvent
                        "create.exclusive-gateway":{"label":"网关","title":"我汉化了，哈哈"},   //Create Gateway
                        "create.task":{"label":"任务","title":"我汉化了，哈哈"},
                        "create.user-task":{"label":"用户任务","title":"我汉化了，哈哈"},
                        "create.user-sign-task":{"label":"会签任务","title":"我汉化了，哈哈"},
                        "create.subprocess-expanded":{"label":"子流程","title":"我汉化了，哈哈"},    //Create expanded SubProcess
                        "create.data-object":{"label":"数据对象","title":"我汉化了，哈哈"},           //Create DataObjectReference
                        "create.data-store":{"label":"数据存储","title":"我汉化了，哈哈"},            //Create DataStoreReference
                        "create.participant-expanded":{"label":"扩展流程","title":"我汉化了，哈哈"},  //Create Pool/Participant
                        "create.group":{"label":"分组","title":"我汉化了，哈哈"}
                    }
                    let controlStyle = {
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        width: "100%",
                        padding: "5px"
                    };

                    const palette = djsPalette.children[0];
                    const allGroups = palette.children;
                    // allGroups[0].style["display"] = "none";

                    for (let gKey in allGroups) {
                        const group = allGroups[gKey];
                        for (let cKey in group.children) {
                            const control = group.children[cKey];
                            if (typeof control === 'object') {
                                if (control.hasAttribute("data-action")) {
                                    let action = control.getAttribute("data-action")
                                    if (paletteLable[action]) {
                                        control.innerHTML = `<div style='font-size: 14px;font-weight:500;margin-left:15px;'>${
                                            paletteLable[action].label
                                        }</div>`;
                                        control.setAttribute("title", paletteLable[action].title)
                                    }
                                    for (let csKey in controlStyle) {
                                        control.style[csKey] = controlStyle[csKey];
                                    }
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            }

            // Color via Overlay 没有生效
            // var overlays = viewer.get('overlays');
            // var elementRegistry = viewer.get('elementRegistry');
            //
            // var shape = elementRegistry.get('UserTask_1');
            //
            // var $overlayHtml =
            //     $('<div class="highlight-overlay">')
            //         .css({
            //             width: shape.width,
            //             height: shape.height
            //         });
            //
            // overlays.add('UserTask_1', {
            //     position: {
            //         top: -5,
            //         left: -5
            //     },
            //     html: $overlayHtml
            // });

            // Color via Marker + CSS Styling 没有生效
            // var canvas = viewer.get('canvas');
            // canvas.addMarker('UserTask_1', 'highlight');
            // /*.highlight:not(.djs-connection) .djs-visual > :nth-child(1) {*/
            // /*    fill: green !important; !* color elements as green *!*/
            // /*}*/


            this.saveXMLHandler = function() {
                viewer_.saveXML({format: true}) //saveSVG
                    .then(xml => {
                        self.$emit('save', xml)
                    })
                    .catch(e => {
                        console.log(e)
                    })
            }
        }
    }

</script>

<style scoped>
    @import '~bpmn-js/dist/assets/diagram-js.css';
    @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
    @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
    @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
    @import '~bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';
    @import '~diagram-js-minimap/assets/diagram-js-minimap.css';
    @import '../../app.css';

    .properties-panel-parent {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        width: 400px;
        z-index: 10;
        border-left: 1px solid #ccc;
        overflow: auto;
    }

    .comments-overlay {
        background: #52B415;
        font-size: 12px;

        color: white;
        display: none;
    }

    .selected .comments-overlay,
    .comments-overlay.with-comments {
        display: block;
    }

    .comments-overlay .edit {
        margin: 2px 0 0 0;
        padding-top: 2px;
    }

    .comments-overlay .edit textarea {
        border: none;
        margin: 0;
    }

    .comments-overlay .icon-comment:hover {
        color: #EEE;
    }

    .comments-overlay .comment {
        border-top-color: white;
    }


    .comments-overlay .icon-comment {
        margin-right: 2px;
    }

    .comments-overlay .icon-delete {
        color: white;
    }

</style>
