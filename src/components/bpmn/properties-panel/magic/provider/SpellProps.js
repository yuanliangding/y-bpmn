import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

import {
  is
} from 'bpmn-js/lib/util/ModelUtil';


export default function(group, element, translate) {

  // Only return an entry, if the currently selected
  // element is a start event.

  if (is(element, 'bpmn:StartEvent')) {
    group.entries.push(
        entryFactory.textField(
            translate,
            {
              id : 'spell',
              description : 'Apply a black magic spell',
              label : 'Spell',
              modelProperty : 'spell'
            }
            )
    );
    group.entries.push(
        entryFactory.selectBox(
            translate,
            {
              id : 'spell-box',
              description : '部门人员列表',
              label : '人员',
              modelProperty : 'person',
              selectOptions: function () {
                  return [
                      { name: '张三', value: '1' },
                      { name: '李四', value: '2' },
                      { name: '王五', value: '3' }
                  ]
              }
            }
        )
    );
  }
}
