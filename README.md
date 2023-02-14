## 交互方式

之前采用每张卡片完整显示，但是这样会导致一页显示的卡牌数量太少，滑动又太繁琐，所以之后改成了非完全堆叠，被叠在后面的卡牌只留一个名字。

玩家能采取的行动：

- 选择一张卡，对其使用基础技能（侦察、聆听等），外行为的效果可以受手持道具影响
- 选择一张卡，点击卡牌提供的额外行为，这些额外行为的效果或者可见性可以受手持道具影响

问题：第一种操作方式，技能的使用是由道具触发还是对象触发？例如：

想要达成的效果：使用木棍对野兽发动殴打技能，开始战斗。

那么触发战斗的逻辑是在木棍？还是殴打技能？还是野兽？

首先，一般来说，哪怕不用木棍，徒手殴打野兽也会触发战斗，所以排除木棍。问题继续，如果是殴打木箱，木箱随让可以被打碎，但是不会触发战斗。所以殴打技能也不合适，综上所述，触发逻辑在野兽身上比较合适，道具与技能仅作为被动触发的影响因素。

