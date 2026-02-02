//=============================================================================
// ** RPG Maker MZ - Hakubox_HStatus.js
//=============================================================================

// #region 脚本注释
/*:
 * @plugindesc H状态界面插件 (v1.0.0)
 * @version 1.0.0
 * @author hakubox
 * @email hakubox@outlook.com
 * @base Hakubox_TachieCore
 * @orderAfter Hakubox_TachieCore
 * @target MV MZ
 * 
 * @help
 * 用于自定义H状态界面的插件。
 * 如果需要在界面中置入立绘，则插件顺序需要在立绘插件下方。
 * 
 * 注：如果需要创建多页的场景，只需要输入相同的场景代码即可。
 * 
 * 
 * ■ [ 插件功能 ] .........................................................
 * 1. 额外角色属性：
 *   - 角色经验。（一般设定为发生事件后，角色经验增加）
 *   - 角色等级。（非必要，一般设定为经验积累后，角色等级上升）
 *   - 角色个人说明。（一般设定为角色自我描述，随着等级升高而发生变化）
 *   - 角色称号。（可以完全替代一般称号系统）
 *   - 角色的不同事件的次数。
 *   - 角色的其他状态。
 *   - 其他自定义数值。
 * 
 * 
 * 
 * 
 * @command setTachieCode
 * @text 设定角色的展示页立绘
 * @desc 设定角色的展示页立绘
 *
 * @arg actorIndex
 * @text 配置角色
 * @desc 配置角色
 * @type actor
 * @default 1
 *
 * @arg tachieCode
 * @text 立绘代码
 * @desc 立绘代码
 * @type text
 * 
 * 
 * @command setHDesc
 * @text 设定角色的个人说明
 * @desc 设定角色的个人说明
 *
 * @arg actorIndex
 * @text 配置角色
 * @desc 配置角色
 * @type actor
 * @default 1
 *
 * @arg descIndex
 * @text 显示第几张个人说明
 * @desc 显示第几张个人说明
 * @type number
 * @default 0
 * 
 * 
 * @command setActorTitle
 * @text 设定角色的称号
 * @desc 设定角色的称号
 *
 * @arg actorIndex
 * @text 配置角色
 * @desc 配置角色
 * @type actor
 * @default 1
 *
 * @arg titleIndex
 * @text 第几个称号
 * @desc 第几个称号
 * @type number
 * @default 0
 *
 * @arg operation
 * @text 操作类型
 * @desc 操作类型
 * @type select
 * @option 添加称号 - add
 * @value add
 * @option 移除称号 - remove
 * @value remove
 * @default add
 * 
 * 
 * @command setDataPoint
 * @text 设定角色的经验
 * @desc 设定角色的经验
 *
 * @arg actorIndex
 * @text 配置角色
 * @desc 配置角色
 * @type actor
 * @default 1
 *
 * @arg pointNumber
 * @text 经验点数
 * @desc 经验点数
 * @type number
 * @default 1
 *
 * @arg operation
 * @text 操作类型
 * @desc 操作类型
 * @type select
 * @option 增加 - add
 * @value add
 * @option 减少 - minus
 * @value minus
 * @option 设为固定值 - set
 * @value set
 * @default add
 * 
 * 
 * @command setDataLevel
 * @text 设定角色的等级数
 * @desc 设定角色的等级数
 *
 * @arg actorIndex
 * @text 配置角色
 * @desc 配置角色
 * @type actor
 * @default 1
 *
 * @arg levelNumber
 * @text 等级数
 * @desc 等级数
 * @type number
 * @default 1
 *
 * @arg operation
 * @text 操作类型3
 * @desc 操作类型3
 * @type select
 * @option 增加 - add
 * @value add
 * @option 减少 - minus
 * @value minus
 * @option 设为固定值 - set
 * @value set
 * @default add
 * 
 * 
 * @command setEventTime
 * @text 设定角色的事件次数
 * @desc 设定角色的事件次数
 *
 * @arg actorIndex
 * @text 配置角色
 * @desc 配置角色
 * @type actor
 * @default 1
 *
 * @arg eventTypeIndex
 * @text 事件类型索引
 * @desc 事件类型索引（第几个事件类型，从0开始算第1位）
 * @type number
 * @default 0
 *
 * @arg timeNumber
 * @text 事件次数
 * @desc 事件次数
 * @type number
 * @default 1
 *
 * @arg operation
 * @text 操作类型
 * @desc 操作类型
 * @type select
 * @option 增加 - add
 * @value add
 * @option 减少 - minus
 * @value minus
 * @option 设为固定值 - set
 * @value set
 * @default add
 * 
 * 
 * @command setActorState
 * @text 设定角色的状态
 * @desc 设定角色的状态
 *
 * @arg actorIndex
 * @text 配置角色
 * @desc 配置角色
 * @type actor
 * @default 1
 *
 * @arg stateIndex
 * @text 状态索引
 * @desc 状态索引，从0开始
 * @type number
 * @default 0
 *
 * @arg stateContentIndex
 * @text 状态内容索引
 * @desc 状态内容索引，从0开始
 * @type number
 * @default 0
 * 
 * 
 * 
 * @param isDebug
 * @text 是否为调试模式
 * @desc 是否为调试模式
 * @type boolean
 * @on 开启
 * @off 关闭
 * @default false
 * 
 * 
 * @param general
 * @text ——————— 常规配置 ———————
 * @default ————————————————————————
 * 
 * @param visibleMenuSwitch
 * @parent general
 * @text 显示菜单绑定开关
 * @desc 用于控制是否显示打开展示页的菜单，从而绑定的开关。
 * @type switch
 * 
 * @param hotkeyOfOpenPage
 * @parent general
 * @text 打开展示页的快捷键
 * @desc 用于打开展示页的键盘按键，默认A
 * @default 65
 * @type select
 * @option Backspace - 8
 * @value 8
 * @option Tab - 9
 * @value 9
 * @option Enter - 13
 * @value 13
 * @option Shift - 16
 * @value 16
 * @option Ctrl - 17
 * @value 17
 * @option Alt - 18
 * @value 18
 * @option Pause - 19
 * @value 19
 * @option CapsLock - 20
 * @value 20
 * @option Esc - 27
 * @value 27
 * @option Space - 32
 * @value 32
 * @option PageUp - 33
 * @value 33
 * @option PageDown - 34
 * @value 34
 * @option End - 35
 * @value 35
 * @option Home - 36
 * @value 36
 * @option Left - 37
 * @value 37
 * @option Up - 38
 * @value 38
 * @option Right - 39
 * @value 39
 * @option Down - 40
 * @value 40
 * @option Insert - 45
 * @value 45
 * @option Delete - 46
 * @value 46
 * @option 0 - 48
 * @value 48
 * @option 1 - 49
 * @value 49
 * @option 2 - 50
 * @value 50
 * @option 3 - 51
 * @value 51
 * @option 4 - 52
 * @value 52
 * @option 5 - 53
 * @value 53
 * @option 6 - 54
 * @value 54
 * @option 7 - 55
 * @value 55
 * @option 8 - 56
 * @value 56
 * @option 9 - 57
 * @value 57
 * @option A - 65
 * @value 65
 * @option B - 66
 * @value 66
 * @option C - 67
 * @value 67
 * @option D - 68
 * @value 68
 * @option E - 69
 * @value 69
 * @option F - 70
 * @value 70
 * @option G - 71
 * @value 71
 * @option H - 72
 * @value 72
 * @option I - 73
 * @value 73
 * @option J - 74
 * @value 74
 * @option K - 75
 * @value 75
 * @option L - 76
 * @value 76
 * @option M - 77
 * @value 77
 * @option N - 78
 * @value 78
 * @option O - 79
 * @value 79
 * @option P - 80
 * @value 80
 * @option Q - 81
 * @value 81
 * @option R - 82
 * @value 82
 * @option S - 83
 * @value 83
 * @option T - 84
 * @value 84
 * @option U - 85
 * @value 85
 * @option V - 86
 * @value 86
 * @option W - 87
 * @value 87
 * @option X - 88
 * @value 88
 * @option Y - 89
 * @value 89
 * @option Z - 90
 * @value 90
 * @option Left Win - 91
 * @value 91
 * @option Right Win - 92
 * @value 92
 * @option Select - 93
 * @value 93
 * @option Num 0 - 96
 * @value 96
 * @option Num 1 - 97
 * @value 97
 * @option Num 2 - 98
 * @value 98
 * @option Num 3 - 99
 * @value 99
 * @option Num 4 - 100
 * @value 100
 * @option Num 5 - 101
 * @value 101
 * @option Num 6 - 102
 * @value 102
 * @option Num 7 - 103
 * @value 103
 * @option Num 8 - 104
 * @value 104
 * @option Num 9 - 105
 * @value 105
 * @option Multiply - 106
 * @value 106
 * @option Add - 107
 * @value 107
 * @option Subtract - 109
 * @value 109
 * @option Decimal - 110
 * @value 110
 * @option Divide - 111
 * @value 111
 * 
 * @param menuText
 * @parent general
 * @text 菜单文本
 * @desc 展示页菜单文本
 * @type string
 * @default 角色的记录
 * 
 * @param frameDelay
 * @parent general
 * @text 帧延迟
 * @desc 默认每两帧之见的延迟，默认为 6
 * @type number
 * @default 6
 * 
 * 
 * @param size
 * @text ——————— 尺寸配置 ———————
 * @default ————————————————————————
 * 
 * @param pageWidth
 * @parent size
 * @text 展示页画面宽度
 * @desc 调整展示页画面的宽度，默认（0或空）为游戏画面宽度
 * @type number
 * 
 * @param pageHeight
 * @parent size
 * @text 展示页画面高度
 * @desc 调整展示页画面的宽度，默认（0或空）为游戏画面高度
 * @type number
 * 
 * @param dialogWidth
 * @parent size
 * @text 展示页窗口宽度
 * @desc 调整展示页窗口宽度，默认（0或空）为游戏默认窗口宽度
 * @type number
 * 
 * @param dialogHeight
 * @parent size
 * @text 展示页窗口高度
 * @desc 调整展示页窗口宽度，默认（0或空）为游戏默认窗口高度
 * @type number
 * 
 * 
 * @param scene
 * @text ——————— 场景配置 ———————
 * @default ————————————————————————
 * 
 * @param defaultSceneCode
 * @parent scene
 * @text 默认场景代码
 * @desc 默认开启的场景代码，默认为"default"代码对应的场景
 * @type text
 * @default default
 * 
 * @param sceneConfig
 * @parent scene
 * @text ※ 场景配置表
 * @desc 场景配置列表，可以配置多个场景
 * @type struct<SceneCofig>[]
 * @default ["{\"code\":\"default\",\"enable\":\"true\",\"showOpacityBg\":\"false\",\"bgImage\":\"\",\"dialogBgImage\":\"\",\"dialogFgImage\":\"\",\"actorPoint\":\"\",\"actorLevel\":\"\",\"actorDesc\":\"\",\"actorTitleList\":\"[]\",\"eventTimes\":\"[]\"}"]
 * 
 */
/*~struct~SceneCofig:
 * 
 * @param enable
 * @text 是否启用
 * @desc 是否启用该场景，默认为启用
 * @type boolean
 * @default true
 *
 * @param sceneName
 * @text 场景名称
 * @decs 场景名称，用于调用某个特定场景场景，例如: s1，注：多页场景使用相同名称即可
 * @type text
 * @default default
 * 
 * @param currentActorId
 * @text 当前页对应角色
 * @desc 当前页对应角色
 * @type actor
 * @default 1
 * 
 * @param remark
 * @text 备注
 * @desc 备注，仅为开发人员自己识别用
 * @type note
 * 
 * @param showOpacityBg
 * @text 使用大地图背景
 * @desc 使用大地图背景，否则显示黑色背景
 * @type boolean
 * @on 大地图背景
 * @off 黑色背景
 * @default true
 * 
 * @param sceneTachieConfig
 * @text 场景立绘
 * @desc 配置场景中的立绘，必须配置后才能在场景中显示立绘
 * @type struct<SceneTachieConfig>
 * @default {}
 * 
 * @param bgImage
 * @text 画面背景图
 * @desc 指定展示页画面的背景图像。
 * @type file
 * @dir img
 * 
 * @param dialogBgImage
 * @text 展示页背景图
 * @desc 指定展示页的背景图像。
 * @type file
 * @dir img
 * 
 * @param dialogFgImage
 * @text 展示页前景图
 * @desc 指定展示页的前景图像，也可以考虑为特效。
 * @type file
 * @dir img
 * 
 * @param sceneBGM
 * @text 场景背景音乐
 * @desc 默认场景的背景音乐
 * @type file
 * @dir audio/bgm
 * 
 * @param actorPoint
 * @text 角色经验 - UI配置
 * @desc 角色的经验，当前配置项为展示界面配置
 * @type struct<ActorPointConfig>
 * 
 * @param actorLevel
 * @text 角色等级 - UI配置
 * @desc 角色的等级，当前配置项为展示界面配置
 * @type struct<ActorPointConfig>
 * 
 * @param actorDesc
 * @text 个人说明 - UI配置
 * @desc 角色的个人说明，当前配置项为展示界面配置
 * @type struct<ActorDesc>
 * 
 * @param actorTitleList
 * @text 称号列表 - UI配置
 * @desc 设定角色的称号列表，当前配置项为展示界面配置
 * @type struct<ActorTitle>[]
 * @default []
 * 
 * @param actorStateList
 * @text 状态列表 - UI配置
 * @desc 设定角色的状态列表，当前配置项为展示界面配置
 * @type struct<ActorState>[]
 * @default []
 * 
 * @param eventTimes
 * @text 事件次数 - UI配置
 * @desc 设定角色的事件次数，当前配置项为展示界面配置
 * @type struct<EventTimesConfig>[]
 * @default []
 * 
 * @param extraImgList
 * @text 额外图片 - UI配置
 * @desc 配置在场景中的额外的可交互图片列表，通常是用来做按钮之类的
 * @type struct<PaintImgConfig>[]
 * @default []
 * 
 */
/*~struct~SceneTachieConfig:
 *
 * @param tachieName
 * @text 场景立绘名称
 * @desc 场景立绘名称，用于显示当前场景某个特定的立绘，例如: <s1_tachie>
 * 
 * @param x
 * @text X坐标
 * @desc 设定文字的X坐标
 * @type number
 * 
 * @param y
 * @text Y坐标
 * @desc 设定文字的Y坐标
 * @type number
 * 
 * @param width
 * @text 图片宽度
 * @desc 设定人物的图片宽度，必填
 * @type number
 * 
 * @param height
 * @text 图片高度
 * @desc 设定人物的图片高度，必填
 * @type number
 * 
 * @param opacity
 * @parent general
 * @text 图片透明度
 * @desc 设定图片透明度（0~255，255为完全不透明）
 * @type number
 * @min 0
 * @max 255
 * @default 255
 * 
 */
/*~struct~PaintImgConfig:
 *
 * @param name
 * @text 名称/编码
 * @desc 必填，用于获取或查询的名称/编码
 * @type text
 * 
 * @param remark
 * @text 备注
 * @desc 备注，仅为开发人员自己识别用
 * @type note
 * 
 * @param x
 * @text X坐标
 * @desc 交互区域左上角X坐标，为相对CG图片坐标
 * @type number
 * 
 * @param y
 * @text Y坐标
 * @desc 交互区域左上角Y坐标，为相对CG图片坐标
 * @type number
 * 
 * @param width
 * @text 图片宽度
 * @desc 图片宽度
 * @type number
 * 
 * @param height
 * @text 图片高度
 * @desc 图片高度
 * @type number
 *
 * @param hideCondition
 * @text 隐藏条件（代码）
 * @desc 选项的隐藏条件，当条件返回true时，该选项将不会显示，可选
 * @type note
 *
 * @param disabledCondition
 * @text 禁用条件（代码）
 * @desc 选项的禁用条件，当条件返回true时，该选项将会禁用，可选
 * @type note
 *
 * @param executeCode
 * @text 点击执行代码
 * @desc 点击后执行的代码
 * @type note
 * 
 * @param commonEventId
 * @text 公共事件
 * @desc 点击时将触发某一个公共事件，可选
 * @type common_event
 * 
 * @param opacity
 * @parent general
 * @text 图片透明度
 * @desc 设定图片透明度（0~255，255为完全不透明）
 * @type number
 * @min 0
 * @max 255
 * @default 255
 * 
 * @param normalImg
 * @text 正常状态的图片
 * @desc 正常状态下绘制的图片
 * @type file
 * @dir img
 * 
 * @param disabledImg
 * @text 禁用时的图片
 * @desc 绘制禁用时的图片，可选，禁用时无法点击触发公共事件及声音
 * @type file
 * @dir img
 * 
 * @param hoverImg
 * @text 光标划过时的图片
 * @desc 光标划过时的图片，可选
 * @type file
 * @dir img
 * 
 * @param activeImg
 * @text 点击时的图片
 * @desc 点击时的图片，可选
 * @type file
 * @dir img
 * 
 * @param content
 * @text 绘制内容代码
 * @desc 将会绘制为图片中的内容，会编译为代码执行
 * @type note
 * 
 * @param font
 * @text 字体
 * @desc 设定字体
 * @type struct<AttaFont>
 * 
 */
/*~struct~ActorDesc:
 * 
 * @param visible
 * @text 是否显示
 * @desc 设定文字是否显示
 * @on 显示
 * @off 不显示
 * @type boolean
 * @default true
 * 
 * @param x
 * @text X坐标
 * @desc 设定文字的X坐标
 * @type number
 * 
 * @param y
 * @text Y坐标
 * @desc 设定文字的Y坐标
 * @type number
 * 
 * @param width
 * @text 图片宽度
 * @desc 设定自我介绍的图片宽度，默认为图片原始宽度
 * @type number
 * 
 * @param height
 * @text 图片高度
 * @desc 设定自我介绍的图片高度，默认为图片原始高度
 * @type number
 * 
 * @param opacity
 * @parent general
 * @text 图片透明度
 * @desc 设定图片透明度（0~255，255为完全不透明）
 * @type number
 * @min 0
 * @max 255
 * @default 255
 * 
 * @param imgList
 * @text 图片列表
 * @desc 设定图片列表
 * @type file[]
 * @dir img
 * 
 */
/*~struct~ActorState:
 *
 * @param visible
 * @text 是否显示
 * @desc 设定状态是否显示
 * @on 显示
 * @off 不显示
 * @type boolean
 * @default true
 * 
 * @param remark
 * @text 备注
 * @desc 备注，仅为开发人员自己识别用
 * @type note
 * 
 * @param x
 * @text X坐标
 * @desc 设定文字的X坐标
 * @type number
 * 
 * @param y
 * @text Y坐标
 * @desc 设定文字的Y坐标
 * @type number
 * 
 * @param width
 * @text 称号图宽度
 * @desc 设定图片宽度，默认为图片原始宽度
 * @type number
 * 
 * @param height
 * @text 称号图高度
 * @desc 设定图片高度，默认为图片原始高度
 * @type number
 * 
 * @param opacity
 * @parent general
 * @text 图片透明度
 * @desc 设定图片透明度（0~255，255为完全不透明）
 * @type number
 * @min 0
 * @max 255
 * @default 255
 * 
 * @param imgList
 * @text 图片列表
 * @desc 设定图片列表
 * @type file[]
 * @dir img/
 * @default []
 * 
 */
/*~struct~ActorTitle:
 * 
 * @param visible
 * @text 是否显示
 * @desc 设定称号是否显示
 * @on 显示
 * @off 不显示
 * @type boolean
 * @default true
 * 
 * @param x
 * @text X坐标
 * @desc 设定文字的X坐标
 * @type number
 * 
 * @param y
 * @text Y坐标
 * @desc 设定文字的Y坐标
 * @type number
 * 
 * @param width
 * @text 称号图宽度
 * @desc 设定图片宽度，默认为图片原始宽度
 * @type number
 * 
 * @param height
 * @text 称号图高度
 * @desc 设定图片高度，默认为图片原始高度
 * @type number
 * 
 * @param opacity
 * @parent general
 * @text 图片透明度
 * @desc 设定图片透明度（0~255，255为完全不透明）
 * @type number
 * @min 0
 * @max 255
 * @default 255
 * 
 * @param titleImg
 * @text 称号图片列表
 * @desc 设定角色在状态栏的的称号图
 * @type file
 * @dir img/
 * 
 * @param hiddenTitleImg
 * @text 称号隐藏时的图片
 * @desc 设定角色在状态栏的隐藏时的称号图  注：隐藏称号并不是指稀有称号，而是？？？？←这种隐藏称号
 * @type file
 * @dir img/
 * 
 */
/*~struct~AttaFont:
 * 
 * @param fontSize
 * @text 字体大小
 * @desc 设定字体大小
 * @type number
 * @default 14
 * 
 * @param fontColor
 * @text 字体颜色
 * @desc 设定字体颜色（十六进制颜色或颜色名）
 * @type string
 * @default #FFFFFF
 * 
 * @param fontFamily
 * @text 设定字体
 * @desc 设定字体名称（用于显示数字）
 * @type string
 * 
 * @param outlineColor
 * @text 设置轮廓颜色
 * @desc 设置文字的轮廓颜色（十六进制颜色或颜色名）
 * @type string
 * @default #000000
 * 
 * @param outlineWidth
 * @text 设置轮廓颜色
 * @desc 设置文字的轮廓宽度
 * @type number
 * @default 3
 * 
 */
/*~struct~EventTimesConfig:
 * 
 * @param visible
 * @text 是否显示
 * @desc 设定文字是否显示
 * @on 显示
 * @off 不显示
 * @type boolean
 * @default true
 * 
 * @param typeDesc
 * @text 备注
 * @desc 备注，仅供开发者参考
 * @type note
 * 
 * @param x
 * @text X坐标
 * @desc 设定文字的X坐标
 * @type number
 * 
 * @param y
 * @text Y坐标
 * @desc 设定文字的Y坐标
 * @type number
 * 
 * @param width
 * @text 文字最大宽度
 * @desc 设定文字最大宽度（会影响字体大小，请留足空间，最少50左右）
 * @type number
 * 
 * @param height
 * @text 文字最大高度
 * @desc 设定文字最大高度（会影响字体大小，请留足空间，最少25左右）
 * @type number
 * 
 * @param font
 * @text 字体
 * @desc 设定次数显示的字体
 * @type struct<AttaFont>
 * 
 * @param align
 * @text 文本对齐方式
 * @text 文本对齐方式
 * @type select
 * @option 左对齐
 * @value left
 * @option 居中
 * @value center
 * @option 右对齐
 * @value right
 * @default left
 */
/*~struct~ActorPointConfig:
 * 
 * @param visible
 * @text 是否显示
 * @desc 设定文字是否显示
 * @on 显示
 * @off 不显示
 * @type boolean
 * @default true
 * 
 * @param x
 * @text X坐标
 * @desc 设定文字的X坐标
 * @type number
 * 
 * @param y
 * @text Y坐标
 * @desc 设定文字的Y坐标
 * @type number
 * 
 * @param width
 * @text 文字最大宽度
 * @desc 设定文字最大宽度（会影响字体大小，请留足空间，最少50左右）
 * @type number
 * 
 * @param height
 * @text 文字最大高度
 * @desc 设定文字最大高度（会影响字体大小，请留足空间，最少25左右）
 * @type number
 * 
 * @param font
 * @text 字体
 * @desc 设定字体
 * @type struct<AttaFont>
 * 
 * @param align
 * @text 文本对齐方式
 * @text 文本对齐方式
 * @type select
 * @option 左对齐
 * @value left
 * @option 居中
 * @value center
 * @option 右对齐
 * @value right
 * @default left
 */
window.$HStatus = undefined;
(() => {

  /** 插件名称 */
  const PluginName = document.currentScript ? decodeURIComponent(document.currentScript.src.match(/^.*\/(.+)\.js$/)[1]) : "Hakubox_HStatus";
  
  // #region 插件参数解释器
  class PluginParamsParser {
    constructor(predictEnable = true) {
      this._predictEnable = predictEnable;
    }
    static parse(params, typeData, predictEnable = true) {
      return new PluginParamsParser(predictEnable).parse(params, typeData);
    }
    parse(params, typeData, loopCount = 0) {
      if (++loopCount > 255)
        throw new Error("endless loop error");
      const result = {};
      for (const name in typeData) {
        if (params[name] === "" || params[name] === undefined) {
          result[name] = null;
        }
        else {
          result[name] = this.convertParam(params[name], typeData[name], loopCount);
        }
      }
      if (!this._predictEnable)
        return result;
      if (typeof params === "object" && !(params instanceof Array)) {
        for (const name in params) {
          if (result[name])
            continue;
          const param = params[name];
          const type = this.predict(param);
          result[name] = this.convertParam(param, type, loopCount);
        }
      }
      return result;
    }
    convertParam(param, type, loopCount) {
      if (typeof type === "string") {
        let str = param;
        if (str[0] == '"' && str[str.length - 1] == '"') {
          str = str.substring(1, str.length - 1).replace(/\\n/g, '\n').replace(/\\"/g, '"')
        }
        return this.cast(str, type);
      }
      else if (typeof type === "object" && type instanceof Array) {
        const aryParam = JSON.parse(param);
        if (type[0] === "string") {
          return aryParam.map((strParam) => this.cast(strParam, type[0]));
        } else if (type[0] === "number") {
          return aryParam.map((strParam) => this.cast(strParam, type[0]));
        } else {
          if (!aryParam.length) return [];
          else {
            if (typeof aryParam === "string") {
              return JSON.parse(aryParam);
            } else {
              return aryParam.map((strParam) => this.parse(JSON.parse(strParam), type[0]), loopCount);
            }
          }
        }
      }
      else if (typeof type === "object") {
        return this.parse(JSON.parse(param), type, loopCount);
      }
      else {
        throw new Error(`${type} is not string or object`);
      }
    }
    cast(param, type) {
      switch (type) {
        case "any":
          if (!this._predictEnable)
            throw new Error("Predict mode is disable");
          return this.cast(param, this.predict(param));
        case "string":
          return param;
        case "number":
          if (param.match(/^\-?\d+\.\d+$/))
            return parseFloat(param);
          return parseInt(param);
        case "boolean":
          return param === "true";
        default:
          throw new Error(`Unknow type: ${type}`);
      }
    }
    predict(param) {
      if (param.match(/^\-?\d+$/) || param.match(/^\-?\d+\.\d+$/)) {
        return "number";
      }
      else if (param === "true" || param === "false") {
        return "boolean";
      }
      else {
        return "string";
      }
    }
  }
  const typeDefine = {
    sceneConfig: [
      {
        sceneTachieConfig: {},
        actorPoint: { font: {} },
        actorLevel: { font: {} },
        actorDesc: { imgList: ['string'] },
        eventTimes: [{ font: {} }],
        extraImgList: [],
        actorStateList: [
          { imgList: ['string'] }
        ],
        actorTitleList: [
          {}
        ]
      }
    ],
  };
  // #endregion

  // #region 插件参数

  const params = PluginParamsParser.parse(PluginManager.parameters(PluginName), typeDefine);

  /** 状态信息 */
  const hStatusInfo = {
    /** 当前场景图 @type {Record<string, any[]>} */
    sceneMap: (() => {
      const _pages = {};
      for (let i = 0; i < params.sceneConfig.length; i++) {
        const item = params.sceneConfig[i];
        if (!_pages[item.sceneName]) _pages[item.sceneName] = [];
        _pages[item.sceneName].push(item);
      }
      return _pages;
    })(),
    /** 当前场景名称 */
    currentSceneName: params.defaultSceneCode,
    /** 当前场景页数 */
    currentScenePageIndex: 0,
    /** 当前场景页数 */
    get currentSceneMaxPage() {
      return this.sceneMap[this.currentSceneName].length;
    },
    /** 当前场景 @type {Record<string, any>} */
    get currentScene() {
      return this.sceneMap[this.currentSceneName][this.currentScenePageIndex];
    },
    /** 当前场景 @type {Record<string, any>[]} */
    get currentScenePages() {
      return this.sceneMap[this.currentSceneName];
    },
    /** 画面宽度 */
    get pageWidth() {
      return params.pageWidth || Graphics.width;
    },
    /** 画面高度 */
    get pageHeight() {
      return params.pageHeight || Graphics.height;
    },
    /** 展示页区域宽度 */
    get dialogWidth() {
      return Math.min(hStatusInfo.pageWidth, params.dialogWidth || Graphics.boxWidth);
    },
    /** 展示页区域高度 */
    get dialogHeight() {
      return Math.min(hStatusInfo.pageHeight, params.dialogHeight || Graphics.boxHeight);
    },
    /** 是否为调试模式 @type {boolean} */
    get isDebug() { return params.isDebug && $gameTemp && $gameTemp.isPlaytest(); },
    /** 场景列表 */
    sceneConfig: params.sceneConfig,
    /** 菜单名称 */
    menuText: params.menuText,
    /** 是否显示透明背景，否则显示黑色 */
    showOpacityBg: params.showOpacityBg,
  }

  /** 初始化H状态的全局信息 */
  const initHStatusGlobalInfo = () => {
    if (window.$HStatus) return;

    window.$HStatus = {
      /** 角色配置 */
      actors: [],
    };
  };
  
  
  if (!hStatusInfo.sceneConfig || !hStatusInfo.sceneConfig.length) {
    throw new Error('Hakubox_HStatus 插件中尚未配置任何场景信息，至少配置一个场景');
  }

  initHStatusGlobalInfo();

  
  // #region 设定快捷键
  if (params.hotkeyOfOpenPage) {
    if (Input.keyMapper[params.hotkeyOfOpenPage]) {
      throw new Error(`Hakubox_HStatus 插件中设置的快捷键 ${params.hotkeyOfOpenPage} 已被其他插件占用，请更换快捷键`);
    }
    Input.keyMapper[params.hotkeyOfOpenPage] = 'h-status-page';
  }
  // #endregion

  
  // #region 显示UI





  // #region H状态窗口
  /** H状态窗口 */
  class Window_HStatusPage extends Window_Base {
    constructor(rect, scene, cancelButton) {
      super(rect);
      this.initialize.call(this, rect);
      this._tempCG = undefined;
      this.opacity = 0;
      this.padding = 0;
      this._scene = scene;
      this._cancelButton = cancelButton;
      this.isBusy = false;

      this.btnStatusList = [];
      this.initBtnStatus();
    }

    _refreshAllParts() {
      if (!this.__disabledBackground) {
        super._refreshAllParts();
      }
    }
    
    standardPadding() {
      return 0;
    }

    initialize(rect) {
      if (this.__disabledBackground === undefined) this.__disabledBackground = false;

      if (Utils.RPGMAKER_NAME === "MZ") {
        super.initialize.call(this, rect);
      } else {
        this._windowRect = rect;
        super.initialize(rect.x, rect.y, rect.width, rect.height);
      }

      if (!this.tachieCore) {
        this.tachieCore = new TachieCore(this);
      }

      this._commandList = [];
      this.deactivate();
    }

    initBtnStatus() {
      const _scene = hStatusInfo.currentScene;
      if (!_scene.extraImgList) return;
      this.btnStatusList = _scene.extraImgList.map(i => {
        return {
          status: 'normal'
        };
      });
    }

    updatePadding() {
      this.padding = 0;
    };

    windowWidth() {
      // @ts-ignore // MV Compatible
      return this._windowRect.width;
    }
    windowHeight() {
      // @ts-ignore // MV Compatible
      return this._windowRect.height;
    }

    refresh() {
      if (this.contents) {
        this.contents.clear();

        this.loadPictures(() => {
          this.drawUI();
        });
      }
    }

    isOpenAndActive() {
      return this.isOpen() && this.visible && this.active;
    };

    onNextActor() {
      this.nextActor();
    }

    update() {
      // this.processCursorMove();
      if (!this.isBusy) {
        this.processHandling();
        this.processTouch();
      }
      super.update();

      // 绘制测试CG
      this.tachieCore.update();
    }

    /** 获取光标坐标 */
    getMouseLoc() {
      const paddingX = (Graphics.width - hStatusInfo.dialogWidth) / 2;
      const paddingY = (Graphics.height - hStatusInfo.dialogHeight) / 2;
      const _x = TouchInput.x - paddingX;
      const _y = TouchInput.y - paddingY;
      return { x: _x, y: _y, paddingX: paddingX, paddingY: paddingY };
    }

    /** 点击事件(及光标移动事件) */
    processTouch() {
      const _scene = hStatusInfo.currentScene;
      const mouseLoc = this.getMouseLoc();
      this.updateBtnState(_scene, mouseLoc.x, mouseLoc.y);
      
      if (TouchInput.isTriggered()) {
        const touchAreaNum = this.checkDisabledClickArea(mouseLoc.x, mouseLoc.y, mouseLoc.paddingX, mouseLoc.paddingY);
        if (touchAreaNum.length == 2) {
          if (touchAreaNum[0] == 4) {
            this.executeBtn(touchAreaNum[1]);
            // this.drawBtn(touchAreaNum[1]);
          }
        } else if (touchAreaNum == 3) {
          this.nextPage();
        }

        return touchAreaNum[0];
      }
    }

    /** 更新按钮状态 */
    updateBtnState(_scene, _x, _y) {
      let canRefresh = false;

      if (_scene.imgList && _scene.imgList.length > 0) {
        for (let i = 0; i < _scene.imgList.length; i++) {
          if (this.btnStatusList[i] && this.btnStatusList[i].status != 'disabled') {
            const _btn = _scene.imgList[i];
            const _inArea = _x > _btn.x && _x < _btn.x + _btn.width && _y > _btn.y && _y < _btn.y + _btn.height;

            if (TouchInput.isPressed() && _inArea) {
              if (this.btnStatusList[i] && this.btnStatusList[i].status != 'disabled') {
                if (this.btnStatusList[i].status != 'active') {
                  canRefresh = true;
                }
                this.btnStatusList[i].status = 'active';
                break;
              }
            } else {
              if (_inArea) {
                if (this.btnStatusList[i].status != 'hover') {
                  canRefresh = true;
                }
                this.btnStatusList[i].status = 'hover';
                break;
              } else {
                if (this.btnStatusList[i].status != 'normal') {
                  canRefresh = true;
                }
                this.btnStatusList[i].status = 'normal';
                break;
              }
            }
          }
        }
      }
      if (canRefresh) {
        this.loadPictures(() => {
          this.drawUI();
        });
      }
    }

    /** 鼠标划过按钮 */
    hoverBtn() {

    }

    /** 执行按钮 */
    executeBtn(index) {
      const _scene = hStatusInfo.currentScene;
      if (_scene.imgList[index].executeCode) {
        eval(_scene.imgList[index].executeCode);
        this.selectPage();
      }
      if (_scene.imgList[index].commonEventId) {
        this._scene.startCommonEvent(_scene.imgList[index].commonEventId);
      }
    }

    /** 刷新页面 */
    selectPage() {
      SoundManager.playCursor();
      this.refresh();
    }

    /** 下一页 */
    nextPage() {
      /** 获取当前页数 */
      const _pageIndex = hStatusInfo.currentScenePageIndex;
      /** 获取最大页数 */
      const _scenePageCount = hStatusInfo.sceneMap[hStatusInfo.currentSceneName].length;

      if (_pageIndex < _scenePageCount - 1) {
        hStatusInfo.currentScenePageIndex = _pageIndex + 1;
      } else {
        hStatusInfo.currentScenePageIndex = 0;
      }

      this.selectPage();
    }

    /** 上一页 */
    prevPage() {
      /** 获取当前页数 */
      const _pageIndex = $HStatus.currentScenePageIndex;
      /** 获取最大页数 */
      const _scenePageCount = hStatusInfo.sceneMap[hStatusInfo.currentSceneName].length;

      if (_pageIndex > 0) {
        hStatusInfo.currentScenePageIndex = _pageIndex - 1;
      } else {
        hStatusInfo.currentScenePageIndex = _scenePageCount - 1;
        this.selectPage();
      }
    }

    processCancel() {
      hStatusInfo.currentScenePageIndex = 0;

      SoundManager.playCancel();
      Input.update();
      TouchInput.update();
      this.deactivate();
      this.close();
      this._scene.stop();
      SceneManager.pop();
      AudioManager.fadeOutBgm(2);
    };

    processHandling() {
      if (this.isOpenAndActive()) {
        if (TouchInput.isCancelled() || Input.isRepeated("cancel")) {
          this.processCancel();
        }
        if (Input.isRepeated("down") || Input.isRepeated("right") || Input.isTriggered("pagedown")) {
          this.nextPage();
        }
        if (Input.isRepeated("up") || Input.isRepeated("left") || Input.isTriggered("pageup")) {
          this.prevPage();
        }
      }
    }

    addTimer(timer) {
      this._timerList.push(timer);
    }

    /**
     * 禁止光标点击交互区域
     * @return 1: 右上角区域。 2：CG区域。 3：正常触发区域。
     */
    checkDisabledClickArea(x, y, paddingX, paddingY) {
      if (Utils.RPGMAKER_NAME === "MZ") {
        // 右上角的返回框范围，增加了10像素保护范围
        const _cancelX = hStatusInfo.dialogWidth + paddingX - this._cancelButton.width - 4;
        if (x > _cancelX - 10 && y < this._cancelButton.height + 10) {
          return 1;
        }
      }
      
      const _scene = hStatusInfo.currentScene;

      // CG部分的范围，后续用于增加可交互事件
      
      const _tachieConfig = _scene.sceneTachieConfig;
      if (_tachieConfig) {
        const _cg = _tachieConfig.tachieName;
        if (!_cg) return 3;
        const _width = _tachieConfig.width;
        const _height = _tachieConfig.height;
        if (x > _tachieConfig.x && x < _tachieConfig.x + _width && y > _tachieConfig.y && y < _tachieConfig.y + _height) {
          return 2;
        }
      }

      // 额外图片组（按钮
      if (_scene.imgList) {
        for (let i = 0; i < _scene.imgList.length; i++) {
          const btn = _scene.imgList[i];
          if (x > btn.x && x < btn.x + btn.width && y > btn.y && y < btn.y + btn.height) {
            return [4, i];
          }
        }
      }

      return 3;
    }

    /** 重绘某个指定的按钮 */
    drawBtn(index) {
      const scene = hStatusInfo.currentScene;
      const btn = scene.imgList[index];
      let btnImgSrc = btn.img;
      if (this.btnStatusList[index].status == 'disabled') {
        btnImgSrc = btn.disabledImg;
      } else if (this.btnStatusList[index].status == 'hover') {
        btnImgSrc = btn.hoverImg;
      } else if (this.btnStatusList[index].status == 'active') {
        btnImgSrc = btn.activeImg;
      }
      const btnImg = ImageManager.reservePicture(btnImgSrc, 0);
      this.contents.blt(btnImg, 0, 0, btnImg.width, btnImg.height, btn.x || 0, btn.y || 0, btn.width, btn.height);
    }

    /**
     * 画调试框
     * @param {Bitmap} bitmap 画布
     * @param {string} text 文字
     * @param {number} x 左上角x坐标
     * @param {number} y 左上角y坐标
     * @param {number} width 宽度
     * @param {number} height 高度
     */
    drawDebugRect(text, x, y, width, height) {
      if (!hStatusInfo.isDebug) return;
      this.contents.fontSize = 12;
      this.contents.fillRect(x, y, width, height, 'rgba(255, 100, 100, 0.3)')
      this.contents.drawText(text, x + 5, y + 5, width, 20);
    }

    /** 加载图片 */
    loadPictures(callback) {
      // 所有预备图片
      const _cacheImgs = [];
      for (let i = 0; i < hStatusInfo.currentScenePages.length; i++) {
        const scene = hStatusInfo.currentScenePages[i];
        if (scene.bgImage) _cacheImgs.push(scene.bgImage);
        if (scene.dialogFgImage) _cacheImgs.push(scene.dialogFgImage);
        if (scene.dialogBgImage) _cacheImgs.push(scene.dialogBgImage);
        
        if (scene.actorDesc) _cacheImgs.push(...scene.actorDesc.imgList);
        if (scene.actorTitleList) {
          scene.actorTitleList.forEach(i => {
            if (i.titleImg) _cacheImgs.push(i.titleImg);
            if (i.hiddenTitleImg) _cacheImgs.push(i.hiddenTitleImg);
          });
        }
        if (scene.actorStateList) {
          scene.actorStateList.forEach(item => {
            item.imgList.forEach(i => {
              if (i) _cacheImgs.push(i);
            });
          });
        }
      }

      let _imgCompleteCount = 0;
      let _maxCount = _cacheImgs.length;

      for (let i = 0; i < _cacheImgs.length; i++) {
        const _fileNameIndex = _cacheImgs[i].lastIndexOf('/');
        const _folder = 'img/' + _cacheImgs[i].substring(0, _fileNameIndex + 1);
        const _fileName = _cacheImgs[i].substring(_fileNameIndex + 1);
        
        const _img = ImageManager.loadBitmap(_folder, _fileName);
        if (_img.isReady() === true) {
          _imgCompleteCount++;
          if (_imgCompleteCount >= _maxCount) {
            callback();
          }
        } else {
          _img.addLoadListener(() => {
            _imgCompleteCount++;
            if (_imgCompleteCount >= _maxCount) {
              callback();
            }
          });
        }
      }
    }

    /**
     * 加载图片
     * @param {string} path 图片路径
     */
    getPicture(path) {
      const _fileNameIndex = path.lastIndexOf('/');
      const _folder = 'img/' + path.substring(0, _fileNameIndex + 1);
      const _fileName = path.substring(_fileNameIndex + 1);
      return ImageManager.loadBitmap(_folder, _fileName);
    }

    /** 绘制基础UI，指交互以外UI */
    drawUI() {
      const scene = hStatusInfo.currentScene;
      if (!scene) {
        throw new Error('Not found scene data');
      }
      
      this.contents.clear();

      const bitmap = this.contents;
      const actorId = scene.currentActorId;

      // 绘制背景
      if (scene.dialogBgImage) {
        const bgBitmap = this.getPicture(scene.dialogBgImage);
        this.contents.blt(bgBitmap, 0, 0, bgBitmap.width, bgBitmap.height, 0, 0, this.width, this.height);
      }

      HStatusUtils.initActorData(actorId);
      let actorData = $HStatus.actors[actorId];

      // -- 绘制所有相关文本 -- 

      // 绘制事件次数（数字）
      const _timesConfig = scene.eventTimes;
      if (actorData.eventTimes === undefined) actorData.eventTimes = [];
      for (let i = 0; i < _timesConfig.length; i++) {
        if (actorData.eventTimes[i] === undefined) {
          actorData.eventTimes[i] = 0;
        }
        const item = _timesConfig[i];
        this.drawDebugRect('x:' + item.x + ',y:' + item.y, item.x, item.y, item.width, item.height);
        if (item.font.fontFamily) bitmap.fontFace = item.font.fontFamily; // 设置字体
        bitmap.fontSize = item.font.fontSize || 30; // 设置字体大小
        bitmap.textColor = item.font.fontColor || '#FFFFFF'; // 设置字体颜色
        bitmap.outlineColor = item.font.outlineColor || 'black'; // 设置描边颜色
        bitmap.outlineWidth = item.font.outlineWidth || 4; // 设置描边宽度
        const txt = actorData.eventTimes[i].toString();
        bitmap.drawText(txt, item.x, item.y, item.width || 100, item.height || 100, item.align || 'center');
      }

      // 额外经验（数字）
      const _pointConfig = scene.actorPoint;
      if (_pointConfig.visible && actorData.actorPoint !== undefined) {
        this.drawDebugRect('x:' + _pointConfig.x + ',y:' + _pointConfig.y, _pointConfig.x, _pointConfig.y, _pointConfig.width, _pointConfig.height);
        if (_pointConfig.font.fontFamily) bitmap.fontFace = _pointConfig.font.fontFamily; // 设置字体
        bitmap.fontSize = _pointConfig.font.fontSize || 30; // 设置字体大小
        bitmap.textColor = _pointConfig.font.fontColor || '#FFFFFF'; // 设置字体颜色
        bitmap.outlineColor = _pointConfig.font.outlineColor || 'black'; // 设置描边颜色
        bitmap.outlineWidth = _pointConfig.font.outlineWidth || 4; // 设置描边宽度
        bitmap.drawText('' + actorData.actorPoint, _pointConfig.x, _pointConfig.y, _pointConfig.width || 100, _pointConfig.height || 100, _pointConfig.align || 'center');
      }

      // 额外等级（数字）
      const _levelConfig = scene.actorLevel;
      if (_levelConfig.visible && actorData.actorLevel !== undefined) {
        this.drawDebugRect('x:' + _levelConfig.x + ',y:' + _levelConfig.y, _levelConfig.x, _levelConfig.y, _levelConfig.width, _levelConfig.height);
        if (_levelConfig.font.fontFamily) bitmap.fontFace = _levelConfig.font.fontFamily; // 设置字体
        bitmap.fontSize = _levelConfig.font.fontSize || 30; // 设置字体大小
        bitmap.textColor = _levelConfig.font.fontColor || '#FFFFFF'; // 设置字体颜色
        bitmap.outlineColor = _levelConfig.font.outlineColor || 'black'; // 设置描边颜色
        bitmap.outlineWidth = _levelConfig.font.outlineWidth || 4; // 设置描边宽度
        bitmap.drawText('' + actorData.actorLevel, _levelConfig.x, _levelConfig.y, _levelConfig.width || 100, _levelConfig.height || 100, _pointConfig.align || 'center');
      }

      // 绘制角色个人说明（图片）
      const _descConfig = scene.actorDesc;
      if (_descConfig.visible && _descConfig.imgList.length && actorData.actorDescIndex !== undefined) {
        const _imgFilePath = _descConfig.imgList[actorData.actorDescIndex];
        const descBitmap = this.getPicture(_imgFilePath);
        this.contents.blt(descBitmap, 0, 0, descBitmap.width, descBitmap.height, _descConfig.x || 0, _descConfig.y || 0);
      }

      // 绘制角色称号（图片）
      const _titlesConfig = scene.actorTitleList;
      const _titleIndexes = actorData.hTitles;
      if (actorData.hTitles) {
        for (let index = 0; index < _titlesConfig.length; index++) {
          const title = _titlesConfig[index];
          if (title.visible && _titleIndexes.indexOf(index) >= 0) {
            if (title.titleImg) {
              const fgBitmap = this.getPicture(title.titleImg);
              this.contents.blt(fgBitmap, 0, 0, fgBitmap.width, fgBitmap.height, title.x || 0, title.y || 0)
            }
          } else if (title.hiddenTitleImg) {
            const fgBitmap = this.getPicture(title.hiddenTitleImg);
            this.contents.blt(fgBitmap, 0, 0, fgBitmap.width, fgBitmap.height, title.x || 0, title.y || 0)
          }
        }
      }

      // 绘制角色状态表（图片）
      const _statesConfig = scene.actorStateList;
      const _stateIndexes = actorData.hStates;
      if (_stateIndexes) {
        for (let index = 0; index < _statesConfig.length; index++) {
          if (_stateIndexes[index] === undefined) _stateIndexes[index] = 0;
          const state = _statesConfig[index];
          const _stateIndex = _stateIndexes[index] || 0;
          if (state.visible && _stateIndexes[index] !== undefined) {
            const fgBitmap = this.getPicture(state.imgList[_stateIndex]);
            this.contents.blt(fgBitmap, 0, 0, fgBitmap.width, fgBitmap.height, state.x || 0, state.y || 0);
          }
        }
      }

      // 绘制额外图片组
      if (scene.imgList) {
        for (let i = 0; i < scene.imgList.length; i++) {
          const btn = scene.imgList[i];
          if (btn.hideCondition && eval(btn.hideCondition)) {
            continue;
          }
          let btnImgSrc = btn.normalImg;
          if (this.btnStatusList[i].status == 'disabled') {
            btnImgSrc = btn.disabledImg;
          } else if (this.btnStatusList[i].status == 'hover') {
            btnImgSrc = btn.hoverImg;
          } else if (this.btnStatusList[i].status == 'active') {
            btnImgSrc = btn.activeImg;
          }
          const btnBitmap = this.getPicture(btnImgSrc);
          this.contents.blt(btnBitmap, btn.x, btn.y, btn.width, btn.height, 0, 0);
        }
      }

      // 绘制前景
      if (scene.dialogFgImage) {
        const bgBitmap = this.getPicture(scene.dialogFgImage);
        this.contents.blt(bgBitmap, 0, 0, bgBitmap.width, bgBitmap.height, 0, 0, this.width, this.height);
      }

      // 绘制立绘
      const _tachieConfig = scene.sceneTachieConfig;
      const _code = actorData.tachieCode || _tachieConfig && scene.sceneTachieConfig.tachieName;
      
      if (_code) {
        TachieCore.loadTachieImg(_code, () => {
          const _x = (_tachieConfig.x || 0) + _tachieConfig.width / 2;
          const _y = (_tachieConfig.y || 0) + _tachieConfig.height;
          this.tachieCore.updateTachie({
            code: _code,
            removeGroupName: 'tachie_h_scene',
            groupName: 'tachie_h_scene',
            x: _x,
            y: _y,
            width: _tachieConfig.width,
            height: _tachieConfig.height,
          });
        });

        this.drawDebugRect('x:' + _tachieConfig.x + ',y:' + _tachieConfig.y, _tachieConfig.x, _tachieConfig.y, _tachieConfig.width, _tachieConfig.height);
      } else {
        TachieCore.removeGroup('tachie_h_scene');
      }

    }
  }
  // #endregion


  // #region 场景类

  let SuperScene_Message;
  if (Utils.RPGMAKER_NAME === "MZ") {
    SuperScene_Message = Scene_Message;
  } else {
    function Scene_Message_MV() {
      this.initialize(...arguments);
    }
    Scene_Base.prototype.calcWindowHeight = function (numLines, selectable) {
      if (selectable) {
        return Window_Selectable.prototype.fittingHeight(numLines);
      }
      else {
        return Window_Base.prototype.fittingHeight(numLines);
      }
    };
    Scene_Message_MV.prototype = Object.create(Scene_Base.prototype);
    Scene_Message_MV.prototype.constructor = Scene_Message_MV;
    Scene_Message_MV.prototype.initialize = function () {
      Scene_Base.prototype.initialize.call(this);
    };
    Scene_Message_MV.prototype.isMessageWindowClosing = function () {
      return this._messageWindow.isClosing();
    };
    Scene_Message_MV.prototype.createAllWindows = function () {
      this.createMessageWindow();
    };
    Scene_Message_MV.prototype.createMessageWindow = function () {
      const rect = this.messageWindowRect();
      this._messageWindow = new Window_Message(rect);
      this.addWindow(this._messageWindow);
    };
    Scene_Message_MV.prototype.messageWindowRect = function () {
      const ww = Graphics.boxWidth;
      const wh = this.calcWindowHeight(4, false) + 8;
      const wx = (Graphics.boxWidth - ww) / 2;
      const wy = 0;
      return new Rectangle(wx, wy, ww, wh);
    };
    SuperScene_Message = Scene_Message_MV;
  }

  /** H状态场景 */
  class Scene_HStatus extends SuperScene_Message {
    prepare(commandList) {
      this._commandList = commandList;
      this.scene = hStatusInfo.currentScene;

      // HakuEventBus.on('executeCommonEvent', (eventId) => {
      //   this.startCommonEvent(eventId);
      // });
    }

    messageWindowRect() {
      if (this.getTalkDialogConfig && this.getTalkDialogConfig()) {
        const talkDialogConfig = this.getTalkDialogConfig();
        const _width = talkDialogConfig.width || hStatusInfo.dialogWidth;
        const _height = talkDialogConfig.height || this.calcWindowHeight(4, false) + 8;
        const _x = talkDialogConfig.x || (hStatusInfo.dialogWidth - _width) / 2;
        const _y = talkDialogConfig.y || 0;
        return new Rectangle(_x, _y, _width, _height);
      } else {
        const _width = hStatusInfo.dialogWidth;
        const _height = this.calcWindowHeight(4, false) + 8;
        const _x = (hStatusInfo.dialogWidth - _width) / 2;
        const _y = 0;
        return new Rectangle(_x, _y, _width, _height);
      }
    };

    // #region 事件触发器相关

    hasCommonEvent() {
      return !!this._commonEvent;
    }
    updateCommonEvent() {
      if (!this.hasCommonEvent()) {
          return;
      }
      this._commonEvent.update();
      $gameScreen.update();
      if (param.activateTimer) {
          $gameTimer.update(true);
      }
      this.checkGameover();
      this.updateTouchPicturesIfNeed();
    }
    event(eventId) {
      return this._events[eventId];
    }
    setupEvents() {
      this._events = [];
      this._commonEvents = [];
      for (const event of $dataMap.events.filter(event => !!event)) {
        this._events[event.id] = new Game_Event(this._mapId, event.id);
      }
      for (const commonEvent of this.parallelCommonEvents()) {
        this._commonEvents.push(new Game_CommonEvent(commonEvent.id));
      }
      this.refreshTileEvents();
    }
    update() {
      this.updateCommonEvent();
      super.update();

      this.updateInterpreter();
      for (const commonEvent of this._commonEvents) {
        commonEvent.update();
      }
    }
    updateInterpreter() {
      for (; ;) {
        this._interpreter.update();
        if (this._interpreter.isRunning()) {
          return;
        }
        if (this._interpreter.eventId() > 0) {
          this.unlockEvent(this._interpreter.eventId());
          this._interpreter.clear();
        }
        if (!this.setupStartingEvent()) {
          return;
        }
      }
    }
    setupStartingEvent() {
      if (this._interpreter.setupReservedCommonEvent()) {
        return true;
      }
      if (this.setupAutorunCommonEvent()) {
        return true;
      }
      return false;
    }
    setupAutorunCommonEvent() {
      for (const commonEvent of this.autorunCommonEvents()) {
        if ($gameSwitches.value(commonEvent.switchId)) {
          this._interpreter.setup(commonEvent.list);
          return true;
        }
      }
      return false;
    }
    autorunCommonEvents() {
      return $dataCommonEvents.filter(
        commonEvent => commonEvent && commonEvent.trigger === 1
      );
    }
    executeCommonEvent(eventId) {
      let event = $dataCommonEvents[eventId];
      this._interpreter.isRunning(true);
      if (event && !this._interpreter.isRunning()) {
        this._interpreter.setup(event.list);
        this._interpreter.executeCommand();
      }
    }

    //#endregion

    createWindowLayer() {
      if (Utils.RPGMAKER_NAME === "MZ") {
        this._windowLayer = new WindowLayer();
        this._windowLayer.x = 0;
        this._windowLayer.y = 0;
        this.addChild(this._windowLayer);
      } else {
        var width = hStatusInfo.pageWidth;
        var height = hStatusInfo.pageHeight;
        var x = 0;
        var y = 0;
        this._windowLayer = new WindowLayer();
        this._windowLayer.move(x, y, width, height);
        this.addChild(this._windowLayer);
      }
    }
    create() {
      super.create();
      this.createBackground();
      this.createWindowLayer();
      this.createButtons();
      this.createAllWindow();

      this._commonEvents = [];

      if (!this._interpreter) {
        this._interpreter = new Game_Interpreter();
      }
    }
    createButtons() {
      if (ConfigManager.touchUI) {
        if (this.needsCancelButton()) {
          this.createCancelButton();
        }
      }
    }
    startCommonEvent(commonEventId) {
      if (!commonEventId || commonEventId === 0) return;
      const commonEventData = $dataCommonEvents[commonEventId];
      this._interpreter.setup(commonEventData.list);
    }
    needsCancelButton() {
      return true;
    }
    createCancelButton() {
      this._cancelButton = new Sprite_Button("cancel");

      this._cancelButton.x = hStatusInfo.dialogWidth + ((Graphics.width - hStatusInfo.dialogWidth) / 2) - this._cancelButton.width - 4;
      this._cancelButton.y = this.buttonY() + 6;
      this.addWindow(this._cancelButton);
    }
    setBackgroundOpacity(opacity) {
      this._backgroundSprite.opacity = opacity;
    }
    /** 创建背景 */
    createBackground() {
      if (!this.scene) {
        this.scene = hStatusInfo.currentScene;
      }
      this._backgroundSprite = new Sprite();
      if (this.scene.bgImage) {
        const bgBitmap = ImageManager.loadBitmap("img/pictures/", this.scene.bgImage);
        const sprite = new Sprite(bgBitmap);
        sprite.x = 0;
        sprite.y = 0;
        sprite.opacity = 255;
        this._backgroundSprite.addChild(sprite);
      }
      if (!this.scene.bgImage) {
        this._backgroundFilter = new PIXI.filters.BlurFilter();
        this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
        this._backgroundSprite.filters = [this._backgroundFilter];
        this.addChild(this._backgroundSprite);
        this.setBackgroundOpacity(192);
      } else {
        if (showOpacityBg) {
          this._blurSprite = new Sprite();
          this._blurSprite.tint = 0xBBBBBB;
          this._backgroundFilter = new PIXI.filters.BlurFilter();
          this._blurSprite.filters = [this._backgroundFilter];
          this._blurSprite.bitmap = SceneManager.backgroundBitmap();
          this.addChild(this._blurSprite);
        }
        this.addChild(this._backgroundSprite);
      }
    }
    createAllWindow() {
      this.createWindow();
      super.createAllWindows();

      this._windowLayer.children.find(i => {
        if (i.constructor.name === "Window_Message") {
          i.customPosition = true;
        }
      });
    }
    start() {
      super.start();

      this._window.activate();
      this._window.refresh();
    }

    createWindow() {
      this._window = new Window_HStatusPage(this.questWindowRect(), this, this._cancelButton);
      this.addChildAt(this._window, 1);

      const scene = hStatusInfo.currentScene;
      if (scene.sceneBGM) {
        AudioManager.playBgm({
          name: scene.sceneBGM,
          pan: 0,
          pitch: 100,
          volume: 90,
        });
        AudioManager.fadeInBgm(2);
      }
    }
    // MV compatible
    isBottomButtonMode() {
      if (Utils.RPGMAKER_NAME === "MZ")
        return super.isBottomButtonMode();
      return false;
    }
    buttonAreaHeight() {
      if (Utils.RPGMAKER_NAME === "MZ")
        return super.buttonAreaHeight();
      return 0;
    }
    questWindowRect() {
      const x = (hStatusInfo.pageWidth - hStatusInfo.dialogWidth) / 2;
      const y = (hStatusInfo.pageHeight - hStatusInfo.dialogHeight) / 2;
      const w = hStatusInfo.dialogWidth;
      const h = hStatusInfo.dialogHeight;
      return new Rectangle(x, y, w, h);
    }
  }
  window.Scene_HStatus = Scene_HStatus;

  // #endregion


  // #endregion

  
  // #region 创建菜单相关

  // 创建菜单相关
  const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
  Window_MenuCommand.prototype.addOriginalCommands = function () {
    _Window_MenuCommand_addOriginalCommands.call(this);
    if (!params.visibleMenuSwitch || $gameSwitches.value(params.visibleMenuSwitch)) {
      this.addCommand(hStatusInfo.menuText, "h-status-page", () => true);
    }
  };
  
  const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
  Scene_Menu.prototype.createCommandWindow = function () {
    _Scene_Menu_createCommandWindow.call(this);

    this._commandWindow.setHandler('h-status-page', () => {
      SceneManager.push(Scene_HStatus);
      SceneManager.prepareNextScene([]);
    });
  };

  // #endregion

  
  // #region 存储数据相关
  
  const _DataManager_createGameObjects = DataManager.createGameObjects;
  DataManager.createGameObjects = function () {
    _DataManager_createGameObjects.call(this);
    $HStatus = $HStatus;
  };
  const _DataManager_makeSaveContents = DataManager.makeSaveContents;
  DataManager.makeSaveContents = function () {
    const contents = _DataManager_makeSaveContents.call(this);
    contents.$HStatus = $HStatus;
    return contents;
  };
  const _DataManager_extractSaveContents = DataManager.extractSaveContents;
  DataManager.extractSaveContents = function (contents) {
    _DataManager_extractSaveContents.call(this, contents);
    if (!contents.$HStatus) return;
    $HStatus = contents.$HStatus;
  };

  // #endregion


  // #region 工具类

  /** 工具类 */
  class HStatusUtils {
    /** 初始化用户数据 */
    static initActorData(actorId) {
      if (!$HStatus.actors[actorId]) {
        $HStatus.actors[actorId] = {
          /** 立绘代码 */
          tachieCode: '',
          /** 部位次数 */
          eventTimes: [],
          /** 角色的经验 */
          actorPoint: 0,
          /** 角色的等级 */
          actorLevel: 0,
          /** 角色的个人说明图片索引 */
          actorDescIndex: 0,
          /** 角色的称号列表 */
          hTitles: [],
          /** 角色的状态列表 */
          hStates: [],
        };
      }
    }
    /**
     * 设定角色的H个人说明
     * @param {number} actorIndex 角色ID
     * @param {number} descIndex 说明索引
     */
    static setHDesc(actorIndex = 1, descIndex = 0) {
      HStatusUtils.initActorData(actorIndex);
      $HStatus.actors[actorIndex].actorDescIndex = descIndex;
    }
    /**
     * 设定角色的称号
     * @param {number} actorIndex 角色ID
     * @param {number} titleIndex 称号索引
     * @param {'add'|'remove'} operation 添加/删除
     */
    static setActorTitle(actorIndex = 1, titleIndex = 0, operation = 'add') {
      HStatusUtils.initActorData(actorIndex);
      const _hTitles = $HStatus.actors[actorIndex].hTitles || [];
      const _index = _hTitles.indexOf(titleIndex);
      switch (operation) {
        case 'add':
          if (_index < 0) {
            $HStatus.actors[actorIndex].hTitles.push(titleIndex);
          }
          break;
        case 'remove':
          if (_index >= 0) {
            $HStatus.actors[actorIndex].hTitles.splice(_index, 1);
          }
          break;
      }
    }
    /**
     * 设定角色的状态
     * @param {*} actorIndex 角色ID
     * @param {*} stateIndex 称号索引
     * @param {*} stateContentIndex 状态索引
     */
    static setActorState(actorIndex = 1, stateIndex = 0, stateContentIndex = 0) {
      HStatusUtils.initActorData(actorIndex);
      $HStatus.actors[actorIndex].hStates[stateIndex] = stateContentIndex;
    }
    /**
     * 设定角色的H事件次数
     * @param {*} actorIndex 角色ID
     * @param {*} eventTypeIndex 事件类型索引
     * @param {*} timeNumber 事件次数
     * @param {'add'|'minus'|'set'} operation 增加/减少/设置
     */
    static setEventTime(actorIndex = 1, eventTypeIndex = 0, timeNumber = 1, operation = 'add') {
      HStatusUtils.initActorData(actorIndex);
      if (!$HStatus.actors[actorIndex].eventTimes[eventTypeIndex]) {
        $HStatus.actors[actorIndex].eventTimes[eventTypeIndex] = 0;
      }
      switch (operation) {
        case 'add':
          $HStatus.actors[actorIndex].eventTimes[eventTypeIndex] += timeNumber;
          break;
        case 'minus':
          $HStatus.actors[actorIndex].eventTimes[eventTypeIndex] -= timeNumber;
          break;
        case 'set':
          $HStatus.actors[actorIndex].eventTimes[eventTypeIndex] = timeNumber;
          break;
      }
    }
    /**
     * 设定角色的等级
     * @param {*} actorIndex 角色ID
     * @param {*} levelNumber 等级数
     * @param {'add'|'minus'|'set'} operation 增加/减少/设置
     */
    static setDataLevel(actorIndex = 1, levelNumber = 1, operation = 'add') {
      HStatusUtils.initActorData(actorIndex);
      switch (operation) {
        case 'add':
          $gameAttaData.actors[actorIndex].actorLevel += levelNumber;
          break;
        case 'minus':
          $gameAttaData.actors[actorIndex].actorLevel -= levelNumber;
          break;
        case 'set':
          $gameAttaData.actors[actorIndex].actorLevel = levelNumber;
          break;
      }
    }
    /**
     * 设定角色的经验
     * @param {*} actorIndex 角色ID
     * @param {*} pointNumber 等级数
     * @param {'add'|'minus'|'set'} operation 增加/减少/设置
     */
    static setDataPoint(actorIndex = 1, pointNumber = 1, operation = 'add') {
      HStatusUtils.initActorData(actorIndex);
      switch (operation) {
        case 'add':
          $gameAttaData.actors[actorIndex].actorPoint += pointNumber;
          break;
        case 'minus':
          $gameAttaData.actors[actorIndex].actorPoint -= pointNumber;
          break;
        case 'set':
          $gameAttaData.actors[actorIndex].actorPoint = pointNumber;
          break;
      }
    }
    /**
     * 切换当前场景
     * @param {*} sceneName 场景名
     */
    static changeScene(sceneName) {
      hStatusInfo.currentSceneName = sceneName;
    }
  };
  window.HStatusUtils = HStatusUtils;

  // #endregion

  if (Utils.RPGMAKER_NAME === "MZ") {
    PluginManager.registerCommand(PluginName, 'setTachieCode', (args) => {
      const actorIndex = Number(args.actorIndex);
      const tachieCode = Number(args.tachieCode);
      HStatusUtils.setTachieCode(actorIndex, tachieCode);
    });
    PluginManager.registerCommand(PluginName, 'setHDesc', (args) => {
      const actorIndex = Number(args.actorIndex);
      const descIndex = Number(args.descIndex);
      HStatusUtils.setHDesc(actorIndex, descIndex);
    });
    PluginManager.registerCommand(PluginName, 'setActorTitle', (args) => {
      const actorIndex = Number(args.actorIndex);
      const titleIndex = Number(args.titleIndex);
      const operation = args.operation;
      HStatusUtils.setActorTitle(actorIndex, titleIndex, operation);
    });
    PluginManager.registerCommand(PluginName, 'setEventTime', (args) => {
      const actorIndex = Number(args.actorIndex);
      const eventTypeIndex = Number(args.eventTypeIndex);
      const timeNumber = Number(args.timeNumber);
      const operation = args.operation;
      HStatusUtils.setEventTime(actorIndex, eventTypeIndex, timeNumber, operation);
    });
    PluginManager.registerCommand(PluginName, 'setDataLevel', (args) => {
      const actorIndex = Number(args.actorIndex);
      const levelNumber = Number(args.levelNumber);
      const operation = args.operation;
      HStatusUtils.setDataLevel(actorIndex, levelNumber, operation);
    });
    PluginManager.registerCommand(PluginName, 'setDataPoint', (args) => {
      const actorIndex = Number(args.actorIndex);
      const pointNumber = Number(args.pointNumber);
      const operation = args.operation;
      HStatusUtils.setDataPoint(actorIndex, pointNumber, operation);
    });
    PluginManager.registerCommand(PluginName, 'setActorState', (args) => {
      const actorIndex = Number(args.actorIndex);
      const stateIndex = Number(args.stateIndex);
      const stateContentIndex = Number(args.stateContentIndex);
      HStatusUtils.setActorState(actorIndex, stateIndex, stateContentIndex);
    });
  }
  
})();