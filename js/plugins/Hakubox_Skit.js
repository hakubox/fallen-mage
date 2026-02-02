//=============================================================================
// ** RPG Maker MV - Hakubox_Skit.js
//=============================================================================

/*:
 * 
 * @plugindesc 场景动画插件 (v1.0.0)
 * @version 1.0.0
 * @author hakubox
 * @email hakubox@outlook.com
 * @target MV MZ
 *
 * @help
 * 一个可自定义的场景动画插件，
 * 提供在对话场景中的立绘动画动效、CG及音效播放。
 * 
 * PS：本插件较为复杂，相关功能说明也较长，
 * 但希望认真开发游戏的您认真看完插件相关说明后再进行使用。
 * 
 * 
 * ■ [ 配置说明 ] .............................................
 * 以下是第一次使用的基础配置说明。
 * 
 * 1. 首先将准备好的立绘放在img/pictures目录下，并确认立绘切到了
 *    适当的大小，而不是整个游戏屏幕的图片大小。
 * 
 * 2. 将[立绘宽度]、[立绘高度]两个参数修改为在游戏中显示合适的大小
 *    （例如800x400，而不一定是原图大小）。
 * 
 * 3. 修改[立绘Y坐标]参数，正常来说立绘Y坐标会和立绘高度差不多，
 *    因为默认人物Y坐标系数指人物的脚下，所以参数需要设置的和
 *    人物高度差不多，具体情况也需要自己调整。
 * 
 * 4. 配置[位置列表]，就是指立绘/CG会显示的位置/坐标，比如配置左右
 *    各一个坐标，对人形角色来说，只需要配置X坐标即可，Y坐标会用默认
 *    的最外层的[立绘Y坐标]，当然有需要的也可以配置上Y坐标，会覆盖
 *    外层的Y坐标。
 * 
 * 5. 配置[NPC素材]，如果在使用白箱立绘插件的情况下，将主角色立绘放在
 *    [角色素材]里，剩下所有的立绘素材都放在[NPC素材]里，如果不使用
 *    白箱立绘插件，那所有立绘素材都放在[角色素材]里即可。
 * 
 * 6. (可选)一些非人形的CG或素材配置到[自定义素材]中，配置方式与
 *    [NPC素材]一致。
 * 
 * 7. (可选)配置[自定义行为]，可以定义一些特殊的动画效果，比如镜像、
 *    变换、跳跃、点头、震动等，配置后可以以简单的方式调用这些
 *    自定义行为，例如: HakuSkit.exec("xx")
 * 
 * 
 * ■ [ 基础素材配置说明 ] .............................................
 * 以下是第一次使用的素材配置说明，可用于[NPC素材]及[自定义素材]配置。
 * 
 * 首先立绘展示支持多种效果的层叠展示，
 * 例如：单张静态图、多张静态图的叠加、静态/动态及精灵图的组合等。
 * 在了解这一点之后，之后会逐个介绍各种类型素材的配置方式。
 * 
 * 以NPC素材举例，新增一条数据后首先需要配置[NPC名称]，这个名称很重要，
 * 指当前素材的调用ID，之后如果需要操作当前素材，这个[NPC名称]就是
 * 唯一的操作途径了，而且需要注意这个名称是不能和其他名称重复的，包括
 * 之后配置的[自定义素材]内的名称。
 * 
 * 然后配置[NPC状态列表]，状态指NPC的不同表情/动作，比如说普通、微笑、
 * 惊讶、哭泣等，这些状态都属于当前的NPC，也就是说可以随时把当前展示的
 * NPC切换到其他状态，这里需要注意的是默认为"default"状态，这个状态
 * 名称请务必保留不要删除，同时素材的多个状态名称不允许重复。
 * 
 * 下一步是配置[图片列表]，这里指可以配置多张图片，图片从上到下会叠加
 * 显示，图片类型正常情况下配置静态图片即可。
 * 
 * 这样一个基础的NPC素材配置就结束了✓
 * 
 * 
 * ■ [ 动态素材配置说明 ] .............................................
 * 以下是配置动态素材的说明。
 * 
 * 在想要使用动态素材的情况下，图片类型要选择[精灵大图]或者[文件帧动画]
 * 
 * 然后接下来就要去配置[图片配置]项。
 * 
 * 如果是选的精灵图，则需要配置[水平图片分割数]以及[垂直图片分割数]
 * 再配置上帧延迟及是否循环播放的选项后，就大功告成了✓
 * 
 * 
 * 
 * ■ [ 可用插件指令 ] .............................................
 * 以下是当前插件提供的插件指令，只提供一个插件指令skit，变化由后续参数指定。
 * 详细参数可参考下方脚本列表的详细说明。
 * 
 * 
 * ———— 特殊类 ————
 * 
 * 〇 清空一个场景，添加name节点名称代表根据哪个节点结束。
 * skit clear
 * skit 节点名称 clear
 * 示例1：skit npc1 clear
 * 示例2：skit clear
 * 
 * 〇 结束之前的所有动作，添加force代表强制结束。
 * skit break force
 * 示例1：skit break
 * 示例2：skit break force
 * 
 * 〇 延迟一段时间。（帧数）
 * skit 节点名称 wait time
 * 示例：skit npc1 wait 30
 * 
 * 〇 切换表情/状态。
 * skit 节点名称 state 状态:状态名称
 * 示例：skit npc1 state 状态:开心
 * 
 * ———— 进入类 ————
 * 
 * 〇 直接增加一个角色，但并不显示。
 * skit 节点名称 add
 * 示例：skit npc1 add
 * 
 * 〇 让角色/CG直接进入场景。
 * skit 节点名称 in 位置:位置名称 x:X坐标 y:Y坐标 visible:是否显示
 * 示例：skit npc1 in 位置:位置A
 * 
 * 〇 让角色/CG滑动进入场景。
 * skit 节点名称 slideIn 时长:时长 位置:位置名称 x:X坐标 y:Y坐标
 * 示例：skit npc1 in 时长:30 位置:位置A
 * 
 * 〇 让角色/CG渐显。
 * skit 节点名称 fadeIn 时长:时长 位置:位置名称 x:X坐标 y:Y坐标
 * 示例：skit npc1 in 时长:30 位置:位置A
 * 
 * ———— 离开类 ————
 * 
 * 〇 让角色/CG直接离开场景。
 * skit 节点名称 out
 * 示例：skit npc1 out
 * 
 * 〇 让角色/CG渐隐。
 * skit 节点名称 fadeOut rx:X坐标 ry:Y坐标
 * 示例：skit npc1 fadeOut rx:50
 * 
 * 〇 让角色/CG滑动离开场景。
 * skit 节点名称 slideOut 方向:离开方向
 * 示例：skit npc1 slideOut 方向:left
 * 
 * ———— 效果类 ————
 * 
 * 〇 镜像/3D旋转。
 * skit 节点名称 mirror 循环:循环次数 方向:镜像/旋转方向 时长:旋转时长 即停
 * 示例：skit npc1 mirror 方向:x 时长:30
 * 
 * 〇 点头/下降动作。
 * skit 节点名称 nod 循环:循环次数 强度:动作强度 时长:动作时长 即停
 * 示例：skit npc1 nod 循环:2 强度:10 时长:30
 * 
 * 〇 移动动作。
 * skit 节点名称 nod 循环:循环次数 时长:动作时长 即停 x:X坐标 y:Y坐标
 * 示例：skit npc1 nod 时长:30 x:50 y:100
 * 
 * 〇 跳跃动作。
 * skit 节点名称 jump 循环:循环次数 时长:动作时长 即停 x:落点X坐标 y:落点Y坐标
 * 示例：skit npc1 jump 时长:10
 * 
 * 〇 抖动动作。
 * skit 节点名称 shake 循环:循环次数 时长:动作时长 强度:动作强度 频率:动作频率 即停 x:落点X坐标 y:落点Y坐标
 * 示例：skit npc1 shake 时长:10 强度:8 频率:10
 * 
 * 〇 自定义变换。
 * skit 节点名称 transform 循环:循环次数 时长:动作时长 即停 x:X坐标 y:Y坐标 scaleX:横向放大倍率 scaleY:纵向放大倍率 旋转:旋转角度
 * 示例：skit npc1 transform 时长:10 旋转:30
 * 
 * 
 * 
 * ■ [ 可用脚本列表 ] .............................................
 * 以下是当前插件提供的脚本代码。
 * 
 * ———— 特殊类 ————
 * 
 * 〇 结束之前的所有动作。
 * HakuSkit.break(isForce)
 *   - isForce {boolean} 是否强制结束
 * 
 * 〇 清空一个场景对话，可选传入一个节点名称作为判断标准。
 * HakuSkit.clear(name)
 *   - name {string} 节点名称
 * 
 * 〇 延迟一段时间。（帧数）
 * HakuSkit.wait(isForce)
 *   - time {number} 延迟时间（帧数）
 *   - name {string} 节点名称
 * 
 * 〇 切换表情/状态。
 * HakuSkit.state(config, name)
 *   - config.duration {number} 效果时长（帧数），如果要设置一般在8帧左右
 *   - config.state {string} 切换到的状态名称
 *   - name {string} 节点名称
 * 
 * ———— 进入类 ————
 * 
 * 〇 直接增加一个角色，但并不显示。
 * HakuSkit.add(name)
 *   - name {string} 节点名称
 * 
 * 〇 让角色/CG直接进入场景。
 * HakuSkit.in(config, name)
 *   - config.loc {string} 进入位置，在位置列表中配置的名称
 *   - config.x {number} 进入位置X坐标，会覆盖loc参数的X坐标
 *   - config.y {number} 进入位置Y坐标，会覆盖loc参数的Y坐标
 *   - config.visible {boolean} 是否显示
 *   - name {string} 节点名称
 * 
 * 〇 让角色/CG滑动进入场景。
 * HakuSkit.slideIn(config, name)
 *   - config.duration {number} 效果时长（帧数）
 *   - config.dir {'left'|'right'|'up'|'down'} 进入方向，可选上下左右
 *   - config.loc {string} 进入位置，在位置列表中配置的名称
 *   - config.x {number} 进入位置X坐标，会覆盖loc参数的X坐标
 *   - config.y {number} 进入位置Y坐标，会覆盖loc参数的Y坐标
 *   - name {string} 节点名称
 * 
 * 〇 让角色/CG渐显。
 * HakuSkit.fadeIn(config, name)
 *   - config.duration {number} 效果时长（帧数）
 *   - config.rx {number} 横向X偏移坐标（像素）
 *   - config.ry {number} 纵向Y偏移坐标（像素）
 *   - config.x {number} 进入位置X坐标，会覆盖loc参数的X坐标
 *   - config.y {number} 进入位置Y坐标，会覆盖loc参数的Y坐标
 *   - name {string} 节点名称
 * 
 * ———— 离开类 ————
 * 
 * 〇 让角色/CG直接离开场景。
 * HakuSkit.out(name)
 *   - name {string} 节点名称
 * 
 * 〇 让角色/CG渐隐。
 * HakuSkit.fadeOut(config, name)
 *   - config.duration {number} 效果时长（帧数）
 *   - config.rx {number} 横向X偏移坐标（像素）
 *   - config.ry {number} 纵向Y偏移坐标（像素）
 *   - name {string} 节点名称
 * 
 * 〇 让角色/CG滑动离开场景。
 * HakuSkit.slideOut(name)
 *   - name {string} 节点名称
 *   - config.dir {'left'|'right'|'up'|'down'} 离开方向，可选上下左右
 * 
 * ———— 其他类 ————
 * 
 * 〇 播放背景音乐。
 * HakuSkit.bgm(config, name)
 *   - config.weak {boolean} 是否会被中断，一般为无限循环下使用
 *   - config.loop {number|true} 循环次数，true则为无限循环
 *   - config.name {string} 背景音乐文件名
 *   - config.volume {number} 音量
 *   - [name] {string} 节点名称
 * 
 * 〇 播放音效。
 * HakuSkit.sound(config, [name])
 *   - config.weak {boolean} 是否会被中断，一般为无限循环下使用
 *   - config.loop {number|true} 循环次数，true则为无限循环
 *   - config.name {string} 背景音乐文件名
 *   - config.volume {number} 音量
 *   - [name] {string} 节点名称
 * 
 * 〇 屏幕震动。
 * HakuSkit.shakeScreen(config, [name])
 *   - config.weak {boolean} 是否会被中断，一般为无限循环下使用
 *   - config.loop {number|true} 循环次数，true则为无限循环
 *   - config.power {number} 震动强度
 *   - config.speed {number} 震动频率
 *   - config.duration {number} 震动时长（帧数）
 *   - [name] {string} 节点名称
 * 
 * ———— 效果类 ————
 * 
 * 〇 镜像/3D旋转。
 * HakuSkit.mirror(config, name)
 *   - config.weak {boolean} 是否会被中断，一般为无限循环下使用
 *   - config.loop {number|true} 循环次数，true则为无限循环
 *   - config.duration {number} 效果时长（帧数）
 *   - config.dir {'x'|'y'|'xy'} 旋转方向，可选x、y、xy
 *   - [name] {string} 节点名称
 * 
 * 〇 点头/下降动作。
 * HakuSkit.nod(config, name)
 *   - config.weak {boolean} 是否会被中断，一般为无限循环下使用
 *   - config.loop {number|true} 循环次数，true则为无限循环
 *   - config.duration {number} 效果时长（帧数）
 *   - config.power {number} 强度
 *   - [name] {string} 节点名称
 * 
 * 〇 移动动作。
 * HakuSkit.move(config, name)
 *   - config.weak {boolean} 是否会被中断，一般为无限循环下使用
 *   - config.loop {number|true} 循环次数，true则为无限循环
 *   - config.duration {number} 效果时长（帧数）
 *   - config.x {number} 偏移X坐标，会覆盖loc参数的X坐标
 *   - config.y {number} 偏移Y坐标，会覆盖loc参数的Y坐标
 *   - config.rx {number} X坐标，会覆盖loc参数的X坐标
 *   - config.ry {number} Y坐标，会覆盖loc参数的Y坐标
 *   - config.loc {number} Y坐标，在位置列表中配置的名称
 *   - [name] {string} 节点名称
 * 
 * 〇 跳跃动作。
 * HakuSkit.jump(config, name)
 *   - config.weak {boolean} 是否会被中断，一般为无限循环下使用
 *   - config.loop {number|true} 循环次数，true则为无限循环
 *   - [config.duration=10] {number} 效果时长（帧数），默认10帧
 *   - config.power {number} 强度（跳跃高度）
 *   - config.x {number} 落点偏移X坐标
 *   - config.y {number} 落点偏移Y坐标
 *   - config.rx {number} 落点X坐标
 *   - config.ry {number} 落点Y坐标
 *   - [name] {string} 节点名称
 * 
 * 〇 抖动动作。
 * HakuSkit.shake(config, name)
 *   - config.weak {boolean} 是否会被中断，一般为无限循环下使用
 *   - config.loop {number|true} 循环次数，true则为无限循环
 *   - [config.duration=30] {number} 效果时长（帧数），默认30帧
 *   - [config.power=8] {number} 强度，默认8
 *   - [config.frequency=10] {number} 频率，默认10
 *   - [name] {string} 节点名称
 * 
 * 〇 自定义变换。
 * HakuSkit.transform(config, name)
 *   - config.weak {boolean} 是否会被中断，一般为无限循环下使用
 *   - config.loop {number|true} 循环次数，true则为无限循环
 *   - [config.duration=30] {number} 效果时长（帧数），默认30帧
 *   - [config.scaleX=1] {number} 横向放大系数，默认1
 *   - [config.scaleY=1] {number} 纵向放大系数，默认1
 *   - [config.rotate=0] {number} 旋转角度，默认0
 *   - [config.x] {number} 横向移动到的X坐标
 *   - [config.y] {number} 纵向移动到的Y坐标
 *   - [name] {string} 节点名称
 * 
 * 
 * 
 * ■ [ 联系方式 ] ........................................................
 * 
 * 
 * 邮箱：hakubox＠outlook.com  （需要手动将＠替换为半角字符）
 * 
 * 
 * ■ [ License ] ........................................................
 * 
 * MIT license
 * 
 * 授予任何人使用、复制、修改和分发本插件的权利。
 * 软件是按“现状”提供的，不提供任何明示或暗示的担保，包括但不限于
 * 适销性、特定用途适用性和非侵权的担保。
 * 在任何情况下，版权所有者或许可方均不对因使用本软件或其他交易而引起
 * 或与之相关的任何索赔、损害或其他责任承担责任，无论是因合同、侵权或
 * 其他原因引起。
 * 
 * 
 * ■ [ 修订历史 ] ........................................................
 *  v0.0.1  2024/12/18  初版
 * 
 * 
 * 
 * @command play
 * @text 播放指令列表
 * @desc 播放指令列表
 *
 * @arg command
 * @text 执行命令
 * @desc 执行命令
 * @type multiline_string
 * 
 * 
 * @param normal
 * @text ——————— 常规配置 ———————
 * @default ————————————————————————
 *
 * @param showFloor
 * @parent normal
 * @text 显示主层级
 * @desc 地图界面的显示层级，注：最上层不一定会生效
 * @type select
 * @option 对话框下方
 * @value dialog_under_layer
 * @option 对话框上方
 * @value dialog_on_layer
 * @option 最上层
 * @value top_layer
 * @default dialog_under_layer
 *
 * @param showSubFloor
 * @parent normal
 * @text 其他场景显示层级
 * @desc 其他场景的显示层级，不填则为默认最高层级
 * @type struct<ElseSceneFloor>[]
 * @default []
 * 
 * @param tagDefaultImgPath
 * @parent normal
 * @text 标签默认图片路径
 * @desc 标签默认图片路径，默认为 "img/pictures/"
 * @type text
 * @default img/pictures/
 *
 * @param grayValue
 * @parent normal
 * @text 未说话角色灰度值
 * @desc 未说话角色灰度值，0~255，0代表不调整灰度
 * @type number
 * @default 100
 * @min 0
 * @max 255
 * 
 * @param frameDelay
 * @parent normal
 * @text 动画帧延迟
 * @desc 动画帧延迟，单位帧，建议设置为2
 * @type number
 * @default 2
 * 
 * @param useDefaultTachie
 * @parent normal
 * @text 使用默认立绘
 * @desc 是否使用默认立绘，如果使用则会覆盖立绘插件的大地图立绘配置，需要将Hakubox_ActorTachie插件放在上方
 * @type boolean
 * @on 使用
 * @off 不使用
 * @default false
 * 
 * @param defaultTachieName
 * @parent useDefaultTachie
 * @text 默认立绘节点名称
 * @desc 是否使用默认立绘，如果使用则会覆盖立绘插件的大地图立绘配置，需要将Hakubox_ActorTachie插件放在上方
 * @type text
 * @default tachie
 * 
 * 
 * @param scene
 * @desc 无需填写任何内容
 * @text ——————— 场景配置 ———————
 * @default ————————————————————————
 * 
 * @param locConfigList
 * @parent scene
 * @text ※位置列表
 * @desc 位置列表，必须配置项
 * @type struct<LocConfig>[]
 * @default []
 * 
 * @param tachieLocY
 * @parent scene
 * @text ※立绘Y坐标
 * @desc 默认立绘Y坐标，默认800的原因是人物Y坐标系数默认在人物脚下
 * @type number
 * @default 800
 * 
 * @param tachieWidth
 * @parent scene
 * @text 默认立绘宽度
 * @desc 默认立绘宽度
 * @type number
 * @default 300
 * 
 * @param tachieHeight
 * @parent scene
 * @text 默认立绘高度
 * @desc 默认立绘高度
 * @type number
 * @default 800
 * 
 * @param tachieAnchorX
 * @parent scene
 * @text 人物X坐标系数
 * @desc 人物X坐标系数（0~1），仅限角色素材及NPC素材，建议设置为"0.5"
 * @type text
 * @default 0.5
 * 
 * @param tachieAnchorY
 * @parent scene
 * @text 人物Y坐标系数
 * @desc 人物Y坐标系数（0~1），建议设置为1，1指NPC脚下，设置为1时要注意立绘Y坐标可能会在600~800左右
 * @type text
 * @default 1
 * 
 * 
 * @param material
 * @desc 无需填写任何内容
 * @text ——————— 素材配置 ———————
 * @default ————————————————————————
 *
 * @param npcList
 * @parent material
 * @text ※NPC素材
 * @desc NPC素材，必须配置项
 * @type struct<NPCMaterial>[]
 * @default []
 *
 * @param customImgList
 * @parent material
 * @text 自定义素材
 * @desc 自定义素材
 * @type struct<CustomMaterial>[]
 * @default []
 * 
 * @param actorList
 * @parent material
 * @text 角色素材
 * @desc 角色素材。注：如果不使用白箱立绘插件，那这项可以忽略，所有常规立绘都在NPC素材配置
 * @type struct<ActorMaterial>[]
 * @default []
 * 
 * 
 * @param customAction
 * @desc 无需填写任何内容
 * @text ————— 自定义行为配置 —————
 * @default ————————————————————————
 * 
 * @param customActionList
 * @parent customAction
 * @text 自定义行为
 * @desc 自定义行为，可选配置，配置后可以以简单的方式调用这些自定义行为
 * @type struct<CustomAction>[]
 * @default []
 * 
 */
/*~struct~ElseSceneFloor:
 *
 * @param sceneName
 * @text 场景名称
 * @desc 场景名称
 * @type combo
 * @option Scene_Menu
 * @option Scene_Title
 * @option Scene_Equip
 * @option Scene_Status
 *
 * @param floor
 * @text 显示层级
 * @desc 显示层级
 * @type number
 * 
 * @param remark
 * @text 备注
 * @desc 备注
 * @type note
 * 
 */
/*~struct~CustomAction:
 *
 * @param name
 * @text 行为名称
 * @desc 行为名称，注意名称不能重复，也不要和系统内的行为名称重复
 * @type text
 * 
 * @param remark
 * @text 备注
 * @desc 备注
 * @type note
 * 
 * @param actionType
 * @text 行为类型
 * @desc 行为类型
 * @type select
 * @option 镜像/旋转 mirror
 * @value mirror
 * @option 自定义变换 transform
 * @value transform
 * @option 跳跃 jump
 * @value jump
 * @option 点头 nod
 * @value nod
 * @option 震动 shake
 * @value shake
 * 
 * @param actionConfig
 * @text 行为配置参数
 * @desc 行为配置参数
 * @type struct<CustomActionConfig>[]
 * @default []
 * 
 */
/*~struct~CustomActionConfig:
 *
 * @param paramName
 * @text 参数名称
 * @desc 参数名称
 * @type combo
 * @option duration
 * @option loop
 * @option power
 * @option loc
 * @option bounce
 * @option x
 * @option y
 * @option scale
 * @option rotate
 * 
 * @param paramValue
 * @text 参数值
 * @desc 参数值
 * @type text
 * 
 */
/*~struct~LocConfig:
 * 
 * @param configTag
 * @text 位置标签
 * @desc 位置标签，必填
 * @type text
 * 
 * @param remark
 * @text 备注
 * @desc 备注
 * @type note
 * 
 * @param tachieLocX
 * @text X坐标
 * @desc X坐标
 * @type number
 * @default 0
 * 
 * @param tachieLocY
 * @text Y坐标
 * @desc Y坐标，可以为空
 * @type number
 * 
 * @param isMirror
 * @text 是否镜像
 * @desc 是否镜像
 * @type boolean
 * @on 镜像
 * @off 非镜像
 * default false
 * 
 */
/*~struct~ActorMaterial:
 *
 * @param name
 * @text 角色名称
 * @desc 角色名称
 * @type text
 * 
 * @param actorId
 * @text 角色ID
 * @desc 角色ID
 * @type actor
 * 
 * @param remark
 * @text 备注
 * @desc 备注
 * @type text
 * 
 * @param tachieCode
 * @text 立绘代码
 * @desc 立绘代码
 * @type text
 *
 * @param width
 * @text 素材宽度
 * @desc 素材宽度，为空则为立绘默认宽度
 * @type number
 *
 * @param height
 * @text 素材高度
 * @desc 素材高度，为空则为立绘默认高度
 * @type number
 *
 * @param autoBreathEffect
 * @parent tachie
 * @text 默认开启呼吸效果
 * @desc 是否默认开启呼吸效果
 * @type boolean
 * @on 开启
 * @off 关闭
 * @default true
 * 
 */
/*~struct~CustomMaterial:
 *
 * @param name
 * @text 素材名称
 * @desc 素材名称，注意名称不能重复
 * @type text
 * 
 * @param remark
 * @text 备注
 * @desc 备注
 * @type note
 * 
 * @param width
 * @text 图片宽度
 * @desc 图片宽度，为空则为原始宽度
 * @type number
 * 
 * @param height
 * @text 图片高度
 * @desc 图片高度，为空则为原始高度
 * @type number
 * 
 * @param anchorX
 * @parent scene
 * @text 锚定X坐标点
 * @desc 锚定X坐标点（0~1），建议设置为"0.5"，自定义素材固定为"0.5"
 * @type text
 * default 0.5
 * 
 * @param anchorY
 * @parent scene
 * @text 锚定Y坐标点
 * @desc 锚定Y坐标点（0~1），建议设置为"0.5"，自定义素材固定为"0.5"
 * @type text
 * default 0.5
 * 
 * @param imgStateList
 * @text 素材状态列表
 * @desc 素材状态列表，用于在不同状态下展示不同的图片组
 * @type struct<ImgState>[]
 * @default []
 * 
 */
/*~struct~NPCMaterial:
 *
 * @param name
 * @text NPC名称
 * @desc NPC名称，注意名称不能重复
 * @type text
 * 
 * @param remark
 * @text 备注
 * @desc 备注
 * @type note
 *
 * @param width
 * @text 素材宽度
 * @desc 素材宽度，为空则为立绘默认宽度
 * @type number
 *
 * @param height
 * @text 素材高度
 * @desc 素材高度，为空则为立绘默认高度
 * @type number
 * 
 * @param npcStateList
 * @text NPC状态列表
 * @desc NPC状态列表，用于在不同状态下展示不同的图片组
 * @type struct<ImgState>[]
 * @default []
 * 
 */
/*~struct~ImgState:
 *
 * @param name
 * @text 状态名称
 * @desc 状态名称，注意状态名称不要重复，另外默认状态名称为 default
 * @type text
 * @default default
 * 
 * @param remark
 * @text 备注
 * @desc 备注
 * @type note
 *
 * @param imgList
 * @text 图片列表
 * @desc 图片列表
 * @type struct<BasicImage>[]
 * 
 */
/*~struct~BasicImage:
 *
 * @param img
 * @text 图片
 * @desc 图片，注意为文件帧动画时不选择图片，而是填写格式化文件名
 * @type file
 * @dir img/pictures/
 *
 * @param imgType
 * @text 图片类型
 * @desc 图片类型，可以为静态图、精灵大图或帧动画
 * @type select
 * @option 静态图片 static-image
 * @value static-image
 * @option 精灵大图 sprite-anime
 * @value sprite-anime
 * @option 文件帧动画 frame-anime
 * @value frame-anime
 * @default static-image
 *
 * @param condition
 * @text 生效条件
 * @desc 生效条件
 * @type text
 *
 * @param imgConfig
 * @text 图片配置
 * @desc 图片配置，可以为静态图、精灵大图或帧动画
 * @type struct<BasicImageConfig>
 * @default {}
 * 
 */
/*~struct~BasicImageConfig:
 * 
 * @param static
 * @desc 无需填写任何内容
 * @text ——————— 帧动画配置 ———————
 * @default ————————————————————————
 * 
 * @param opacity
 * @parent static
 * @text 透明度
 * @desc 透明度
 * @type number
 * @min 0
 * @max 255
 * @default 255
 * 
 * 
 * @param anime
 * @desc 无需填写任何内容
 * @text ——————— 帧动画配置 ———————
 * @default ————————————————————————
 * 
 * @param frameDelay
 * @parent anime
 * @text 帧延迟
 * @type number
 * @min 2
 * @default 5
 * 
 * @param loopDelay
 * @parent anime
 * @text 循环延迟
 * @type text
 * @default 0
 * 
 * @param isLoop
 * @parent anime
 * @text 是否循环播放
 * @type boolean
 * @on 循环
 * @off 不循环
 * @default true
 * 
 * 
 * @param sprite
 * @desc 无需填写任何内容
 * @text ——————— 精灵图配置 ———————
 * @default ————————————————————————
 * 
 * @param horizontalCount
 * @parent sprite
 * @text 水平图片分割数
 * @type number
 * @min 1
 * @default 1
 * 
 * @param verticalCount
 * @parent sprite
 * @text 垂直图片分割数
 * @type number
 * @min 1
 * @default 1
 * 
 */
(() => {

  /** 插件名称 */
  const PluginName = document.currentScript ? decodeURIComponent(document.currentScript.src.match(/^.*\/(.+)\.js$/)[1]) : "Hakubox_Skit";

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
  // #endregion

  const typeDefine = {
    showSubFloor: [],
    npcList: [
      {
        npcStateList: [
          {
            imgList: [
              { imgConfig: {} }
            ],
          }
        ]
      }
    ],
    customImgList: [
      {
        imgStateList: [
          {
            imgList: [
              { imgConfig: {} }
            ],
          }
        ]
      }
    ],
    actorList: [],
    locConfigList: [],
    customActionList: [
      { actionConfig: [] }
    ]
  };

  const params = PluginParamsParser.parse(PluginManager.parameters(PluginName), typeDefine);

  /** NPC列表 */
  const npcList = params.npcList;
  /** 角色列表 */
  const actorList = params.actorList;
  /** 自定义素材列表 */
  const customImgList = params.customImgList;
  /** 立绘配置列表 */
  const locConfigList = params.locConfigList;


  PIXI.filters.ColorMatrixFilter.prototype.adjustTone = function (r, g, b) {
    r = (r || 0).clamp(-255, 255) / 255;
    g = (g || 0).clamp(-255, 255) / 255;
    b = (b || 0).clamp(-255, 255) / 255;

    if (r !== 0 || g !== 0 || b !== 0) {
      var matrix = [
        1, 0, 0, r, 0,
        0, 1, 0, g, 0,
        0, 0, 1, b, 0,
        0, 0, 0, 1, 0
      ];

      this._loadMatrix(matrix, true);
    }
  };

  /**
   * @typedef {object} HakuTimeline
   * @property {string} id 时间轴ID
   * @property {string} elementName 节点名称
   * @property {number} frameIndex 帧索引，到达0时则结束
   * @property {boolean} isStart 是否已开始，一般情况下执行exec方法后才视作开始
   * @property {{ action: string, duration: number, config: any, loop: number | true, weak: true | undefined }[]} actions 动作列表
   * @property {{}[]} eventList 事件列表
   */

  // #region 基础模块

  /** 基础模块 */
  const skitModule = {
    /** 刷新事件 */
    onUpdate() {
      this.nextFrame();

      for (let i = 0; i < skitInfo.children.length; i++) {
        const _child = skitInfo.children[i];
        if (_child.type === 'actor') {
          _child.tachieCore.update();
        }
      }

      if (skitInfo.baseFrame.index > 0) return;

      for (let i = 0; i < skitInfo.children.length; i++) {
        const _child = skitInfo.children[i];
        if (!_child) continue;

        if (['npc', 'actor'].includes(_child.type)) {
          skitModule.updateContainer(_child);
        }

        for (let o = 0; o < _child.container.imgConfigList.length; o++) {
          const img = _child.container.imgConfigList[o];
          if (MaterialSetup[img.type].update) {
            MaterialSetup[img.type].update(img);
          }

          // 看需不需要更新图片
          skitModule.updateSprite(_child);
        }
      }

      for (let i = 0; i < skitInfo.timelines.length; i++) {
        const _timeline = skitInfo.timelines[i];
        skitModule.updateTimeline(_timeline);
      }
    },
    /** 设置当前的节点名称 */
    active(...elementNames) {
      skitInfo.activeElementNames = elementNames;

      HakuSkit.activeElementNames = elementNames;
    },
    /** 下一帧 */
    nextFrame() {
      skitInfo.baseFrame.index++;
      if (skitInfo.baseFrame.index >= skitInfo.baseFrame.maxCount) {
        skitInfo.baseFrame.index = 0;
      }
    },
    /**
     * 更新所有精灵（目前主要是为了切换变量）
     */
    updateSprite(element) {
      const _container = element.container;
      for (let i = _container.imgConfigList.length - 1; i >= 0; i--) {
        const img = _container.imgConfigList[i];

        // 需要更新 以及 不在更新过程中
        if (img.canUpdate && !img.changing) {
          const _fileInfo = SkitUtils.getFileInfo(img.originPath);
          if (_fileInfo.fullPath !== img.filePath) {

            let item;
            if (element.type === 'npc') {
              const _npcInfo = npcList.find(child => child.name === element.name);
              if (!_npcInfo) return;

              const _npcState = _npcInfo.npcStateList.find(child => child.name === element.state);
              item = _npcState.imgList[i];
            } else if (element.type === 'custom') {
              const _customInfo = customImgList.find(child => child.name === element.name);
              if (!_customInfo) return;

              const _customState = _customInfo.imgStateList.find(child => child.name === element.state);
              item = _customState.imgList[i];
            }
            if (!item) continue;

            const _re = MaterialSetup[item.imgType].setup(item.img, {
              width: _container.imgWidth,
              height: _container.imgHeight,
              ...item
            }, img);
            const _oldContainer = _container.children[i];
            _re.sprite.anchor.set(+_container.anchorX, +_container.anchorY);
            _re.sprite.filters = [new PIXI.filters.ColorMatrixFilter()];
            _container.imgConfigList.splice(i, 0, _re);
            this.initFrameAnime(_re, item);
            _container.addChildAt(_re.sprite, i);
            _oldContainer.destroy(true);
            img.changing = true;
          }
        }
      }
    },
    /**
     * 更新容器（目前主要是为了颜色变灰）
     * @param {{ container: PIXI.Container, name: string, type: string }} child 
     */
    updateContainer(child) {
      const _container = child.container;

      if (skitInfo.activeElementNames.includes(child.name) && _container._isGray === true) {
        _container._isGray = false;
        for (let i = 0; i < _container.children.length; i++) {
          const sprite = _container.children[i];
          let index = sprite.filters.findIndex(i => i instanceof PIXI.filters.ColorMatrixFilter);
          sprite.filters[index].adjustTone.call(sprite.filters[index], params.grayValue, params.grayValue, params.grayValue);
          sprite._refresh();
        }
      } else if (!skitInfo.activeElementNames.includes(child.name) && _container._isGray === false) {
        _container._isGray = true;
        for (let i = 0; i < _container.children.length; i++) {
          const sprite = _container.children[i];
          let index = sprite.filters.findIndex(i => i instanceof PIXI.filters.ColorMatrixFilter);
          sprite.filters[index].adjustTone.call(sprite.filters[index], -params.grayValue, -params.grayValue, -params.grayValue);
          sprite._refresh();
        }
      }
    },
    /**
     * 更新时间轴
     * @param {HakuTimeline} _timeline 
     */
    updateTimeline(_timeline) {
      // 如果index=0或者没有其他动作
      if (_timeline.frameIndex <= 0 || _timeline.actions.length === 0) return;

      // 如果动作执行到一半
      const _action = _timeline.actions[0];

      if (_timeline.elementName === 'main') {
        if (!_action.isStart) {
          Commands.exec(_action.action, _action, _timeline, _action.config);
          _action.isStart = true;
        } else if (_action.isStart) {
          _timeline.frameIndex -= 1;
          const _progress = (_action.duration - _timeline.frameIndex) / _action.duration;
          Commands.update(_action.action, _action, _timeline, _progress, _action.config);
        }
      } else {
        if (!_action.isStart && this.isTimelineIdle()) {
          Commands.exec(_action.action, _action, _timeline, _action.config);
          _action.isStart = true;
        } else if (_action.isStart) {
          _timeline.frameIndex -= 1;
          const _progress = (_action.duration - _timeline.frameIndex) / _action.duration;
          Commands.update(_action.action, _action, _timeline, _progress, _action.config);
        }
      }

      // 如果还有循环次数，则继续循环（注意死循环）
      if (_timeline.frameIndex == 0) {
        if (_action.loop === true) {
          _action.isStart = false;
          _timeline.frameIndex = _action.duration;
        } else if (!isNaN(_action.loop) && _action.loop > 1) {
          _action.isStart = false;
          _timeline.frameIndex = _action.duration;
          _action.loop--;
        } else {
          _timeline.actions.splice(0, 1);

          if (_timeline.actions.length) {
            _timeline.frameIndex = _timeline.actions[0].duration;
          }
        }
      }

    },
    /** 进行到下一帧 */
    imgNextFrame(item) {
      // 没有暂停
      if (!item.isPause) {
        // 初始化
        if (item.frameCounter == 0 && item.frameIndex == 0 && !item.frameLoopDelayIndex) {
          if (item.loopDelayParam) {
            item.loopDelay = Array.isArray(item.loopDelayParam) ?
              Math.floor(Math.random() * (item.loopDelayParam[1] - item.loopDelayParam[0])) + item.loopDelayParam[0] :
              item.loopDelayParam;
          }
          item.frameLoopDelayIndex = 0;
        }
        item.frameCounter++;

        // 插入循环延迟帧
        if (item.frameCounter >= item.frameDelay && item.frameLoopDelayIndex <= item.loopDelay) {
          item.frameLoopDelayIndex++;
        }

        // 帧数大于等于帧间隔
        if (item.frameLoopDelayIndex > item.loopDelay && item.frameCounter >= item.frameDelay) {
          item.frameCounter = 0;
          item.frameIndex++;
          // 超过帧数
          if (item.frameIndex >= item.frameCount) {
            if (item.loop) {
              item.frameIndex = 0;
              item.frameLoopDelayIndex = 0;
            } else {
              item.frameIndex--;
            }
          }
        }
      }
    },
    /** 是否为空闲状态 */
    isTimelineIdle(elementName = 'main') {
      const _timeline = skitInfo.timelines.find(child => child.elementName === elementName);
      return _timeline.frameIndex === 0 && _timeline.actions.length === 0;
    },
    /** 初始化Container */
    initFrameAnime(item, config) {
      item.isPause = false; // 是否暂停
      item.frameCounter = 0; // 计数器
      item.frameIndex = 0; // 当前帧
      item.frameDelay = config.imgConfig.frameDelay || 2; // 帧间隔
      item.loopDelayParam = config.imgConfig.loopDelay || 1; // 循环延迟
      item.loop = config.imgConfig.isLoop || true; // 是否循环
    },
    /**
     * 获取NPC的容器
     * @param {object} element 基础节点
     * @param {string} npcName NPC素材名称
     * @param {string} state NPC素材状态
     */
    createNPCContainer(element, npcName, state = 'default') {
      const _npcIndex = npcList.findIndex(child => child.name === npcName);
      if (_npcIndex < 0) return;

      const _npcInfo = npcList[_npcIndex];
      const _npcState = _npcInfo.npcStateList.find(child => child.name === state);
      if (!_npcState) throw new Error(`NPC ${npcName} has no state "${state}"`);
      if (!_npcState.imgList) throw new Error(`NPC ${npcName} state ${state} has no imgList`);

      const _container = new PIXI.Container();
      _container._skitName = 'container-npc-' + npcName;
      _container._isMirror = false;
      _container._isGray = false;
      _container.imgConfig = _npcInfo.imgConfig;
      _container.imgConfigList = [];
      _container.imgWidth = _npcInfo.width || params.tachieWidth;
      _container.imgHeight = _npcInfo.height || params.tachieHeight;
      _container.anchorX = _npcInfo.anchorX || params.tachieAnchorX || 0.5;
      _container.anchorY = _npcInfo.anchorY || params.tachieAnchorY || 1;

      let _maxCount = 0;
      let _loadIndex = 0;
      // img配置列表
      for (let i = 0; i < _npcState.imgList.length; i++) {
        _maxCount++;
        const item = _npcState.imgList[i];
        const _re = MaterialSetup[item.imgType].setup(item.img, {
          width: _container.imgWidth,
          height: _container.imgHeight,
          onLoad() {
            _loadIndex++;
            if (_loadIndex >= _maxCount && element.onComplete) {
              element.isInit = true;
              element._onCompleteEvents.forEach(fn => {
                fn && fn();
              });
              element._onCompleteEvents = [];
            }
          },
          ...item
        });
        _re.sprite.anchor.set(+_container.anchorX, +_container.anchorY);
        _re.sprite.filters = [new PIXI.filters.ColorMatrixFilter()];
        _container.imgConfigList.push(_re);
        this.initFrameAnime(_re, item);
        _container.addChild(_re.sprite);
      }

      return _container;
    },
    /**
     * 获取自定义素材的容器
     * @param {object} element 基础节点
     * @param {string} customName 自定义素材名称
     * @param {string} state 自定义素材状态
     */
    createCustomContainer(element, customName, state = 'default') {
      const _customIndex = customImgList.findIndex(child => child.name === customName);
      if (_customIndex < 0) return;

      const _customInfo = customImgList[_customIndex];
      const _customState = _customInfo.imgStateList.find(child => child.name === state);
      if (!_customState) throw new Error(`Custom ${customName} has no state "${state}"`);
      if (!_customState.imgList) throw new Error(`Custom ${customName} state ${state} has no imgList`);

      const _container = new PIXI.Container();
      _container._skitName = 'container-custom-' + customName;
      _container._isMirror = false;
      _container.imgConfig = _customInfo.imgConfig;
      _container.imgConfigList = [];
      _container.anchorX = _customInfo.anchorX || 0.5;
      _container.anchorY = _customInfo.anchorY || 0.5;

      let _maxCount = 0;
      let _loadIndex = 0;
      // img配置列表
      for (let i = 0; i < _customState.imgList.length; i++) {
        const item = _customState.imgList[i];

        const _condition = MaterialSetup[item.imgType].condition;

        if (!_condition || _condition && eval(_condition)) {
          _maxCount++;
          const _re = MaterialSetup[item.imgType].setup(item.img, {
            width: _customInfo.width,
            height: _customInfo.height,
            onLoad() {
              _loadIndex++;
              if (_loadIndex >= _maxCount && element.onComplete) {
                element.isInit = true;
                element._onCompleteEvents.forEach(fn => {
                  fn && fn();
                });
                element._onCompleteEvents = [];
              }
            },
            ...item
          });
          _re.sprite.anchor.set(+(_customInfo.anchorX || 0.5), +(_customInfo.anchorY || 0.5));
          _re.sprite.filters = [new PIXI.filters.ColorMatrixFilter()];
          _container.imgConfigList.push(_re);
          this.initFrameAnime(_re, item);
          _container.addChild(_re.sprite);
        }
      }

      return _container;
    },
    /** 根据索引获取角色素材节点 */
    getNPCElement(elementName, state) {
      const _element = {
        name: elementName,
        state: state || 'default',
        type: 'npc',
        isInit: false,
        _onCompleteEvents: [],
        onComplete(fn) {
          this._onCompleteEvents.push(fn);
          if (this.isInit) {
            fn && fn();
          }
        }
      };
      const _container = this.createNPCContainer(_element, elementName, state);
      if (!_container) return;
      _element.container = _container;
      return _element;
    },
    /** 根据索引获取自定义素材节点 */
    getCustomElement(elementName, state) {
      const _element = {
        name: elementName,
        state: state || 'default',
        type: 'custom',
        isInit: false,
        _onCompleteEvents: [],
        onComplete(fn) {
          this._onCompleteEvents.push(fn);
          if (this.isInit) {
            fn && fn();
          }
        }
      };
      const _container = this.createCustomContainer(_element, elementName, state);
      if (!_container) return;
      _element.container = _container;
      return _element;
    },
    /**
     * 获取角色素材的容器
     * @param {object} element 基础节点
     * @param {object} config 角色配置
     */
    createActorContainer(element, config) {
      let _container = new PIXI.Container();
      _container._skitName = 'container-custom-' + element.name;
      _container._isMirror = false;
      _container.imgConfig = {};
      _container.imgConfigList = [];

      element.tachieCore = new TachieCore(_container);

      if (!config.tachieCode) throw new Error(`角色 ${element.name} 未设定立绘代码`);
      element.tachieCore = new TachieCore(_container);
      TachieCore.loadTachieImg(config.tachieCode, () => {
        element.tachieCore.updateTachie({
          code: config.tachieCode,
          groupName: 'skit_tachie_' + element.name,
          x: 0,
          y: 0, // params.tachieLocY
          width: config.width || params.tachieWidth,
          height: config.height || params.tachieHeight,
          anchorX: params.tachieAnchorX,
          anchorY: params.tachieAnchorY,
        });
      });

      _container.alpha = 0;

      return _container;
    },
    /** 根据索引获取角色节点 */
    getActorElement(elementName) {
      const _actorIndex = actorList.findIndex(child => child.name === elementName);
      if (_actorIndex < 0) return;

      const _actorInfo = actorList[_actorIndex];

      const _element = {
        name: elementName,
        type: 'actor',
        actor: _actorInfo,
        isInit: true,
        onComplete() { }
      };

      const _container = this.createActorContainer(_element, _actorInfo);
      if (!_container) return;
      _element.container = _container;
      _element.container.anchorX = params.tachieAnchorX || 0.5;
      _element.container.anchorY = params.tachieAnchorY || 1;

      return _element;
    },
    /**
     * 获取角色素材的容器
     * @param {object} element 基础节点
     * @param {object} container 立绘节点
     */
    createTachieContainer(element, container) {
      let _container = container;
      _container._skitName = 'container-custom-' + element.name;
      _container._isMirror = false;
      _container.imgConfig = {};
      _container.imgConfigList = [];

      element.tachieCore = container.tachieCore;

      return _container;
    },
    /** 根据现有立绘获取角色节点 */
    getTachieElement(elementName) {
      const _element = {
        name: elementName,
        type: 'tachie',
        isInit: true,
        onComplete() { }
      };
      _element.container = this.createTachieContainer(_element, window._hakuTachieContainer)

      return _element;
    },
    /** 直接根据图片获得节点 */
    getImageElement(elementName) {
      const _img = ImageManager.loadPicture(elementName);
      const _sprite = new Sprite();
      _img.addLoadListener(() => {
        const img = new Bitmap(_img.width, _img.height);
        img.blt(_img, 0, 0, _img.width, _img.height, 0, 0, img.width, img.height)
        _sprite.bitmap = img;
        _sprite.anchor.set(0.5, 0.5);
        _sprite.filters = [new PIXI.filters.ColorMatrixFilter()];
      });
      const _container = new PIXI.Container();
      _container._skitName = 'container-image-' + elementName;
      _container._isMirror = false;
      _container._isGray = false;
      _container.imgConfig = {};
      _container.imgConfigList = [];
      _container.addChild(_sprite);

      return {
        name: elementName,
        state: 'default',
        type: 'image',
        container: _container
      };
    },
    /**
     * 获取ID的内容
     * @param {string} elementName 唯一名称
     * @param {string} state 状态
     * @param {boolean} isNew 是否为新创建
     */
    getElement(elementName, state = 'default', isNew) {
      // 现有元素
      if (!isNew) {
        const _childrenIndex = skitInfo.children.findIndex(child => child.name === elementName && state === child.state);
        if (_childrenIndex >= 0) return skitInfo.children[_childrenIndex];
      }
      // 角色素材
      const _actorElement = this.getActorElement(elementName);
      if (_actorElement) return _actorElement;
      // NPC素材
      const _npcElement = this.getNPCElement(elementName, state);
      if (_npcElement) return _npcElement;
      // 自定义素材
      const _customElement = this.getCustomElement(elementName, state);
      if (_customElement) return _customElement;
      // 图片素材
      return this.getImageElement(elementName);
    },
    /**
     * 修改节点状态，目前是修改整张图片
     * @param {string} elementName 唯一名称
     * @param {string} state 修改后的状态
     */
    changeElementState(elementName, state) {
      const _elementIndex = skitInfo.children.findIndex(child => child.name === elementName);
      if (_elementIndex < 0) throw new Error(`Element ${elementName} not found`);
      const _oldElement = skitInfo.children[_elementIndex];
      const newState = state || _oldElement.state
      const _newElement = this.getElement(elementName, newState);
      _newElement.container.x = _oldElement.container.x;
      _newElement.container.y = _oldElement.container.y;

      skitInfo.children.splice(_elementIndex, 0, _newElement);
      skitInfo.container.addChildAt(_newElement.container, _elementIndex);
      _newElement.onComplete(() => {
        skitInfo.children.splice(_elementIndex + 1, 1);
        skitInfo.container.removeChildAt(_elementIndex + 1);
      });

      _newElement.state = state;
    },
    /**
     * 清空内容
     */
    clear() {
      skitInfo.activeElementNames = [];

      setTimeout(() => {
        for (let i = 0; i < skitInfo.children.length; i++) {
          const _child = skitInfo.children[i];
          _child.container.destroy(true);
        }
        skitInfo.children = [];
        for (let i = skitInfo.timelines.length - 1; i >= 0; i--) {
          const _timeline = skitInfo.timelines[i];
          _timeline.frameIndex = 0;
          _timeline.actions = [];
          _timeline.eventList = [];
          if (_timeline.id !== 'main') {
            skitInfo.timelines.splice(i, 1);
          }
        }
        skitInfo.groupInfo = {};
        skitInfo.prevTachieVisible = false;
      }, 10);
    },
    /** 销毁所有图片 */
    destory() {
      for (let i = 0; i < skitInfo.children.length; i++) {
        const _child = skitInfo.children[i];
        _child.container.destroy(true);
      }
      skitInfo.children = [];
      skitInfo.timelines = [];
      skitInfo.container.destroy(true);
      skitInfo.groupInfo = {};
    },
    /**
     * 初始化界面
     * @param {{index: number, actorId:number, cgIndex:number}} fixedConfig 固定配置
     */
    initialize(scene, fixedConfig) {
      skitInfo.isInit = true;

      skitInfo.scene = scene;

      if (skitInfo.container && !skitInfo.container.parent) {
        if (skitInfo.container.children.length) {
          skitInfo.container.removeChildren();
        }
        skitInfo.container.destroy(true);
        skitInfo.container = undefined;
      }
      if (!skitInfo.container || !skitInfo.container.parent || skitInfo.container.parent !== scene) {
        skitInfo.container = new PIXI.Container();
        skitInfo.container.update = function () {
          this.children.forEach(function (child) {
            if (child.update) {
              child.update();
            }
          });
        };
      }

      if (scene instanceof Scene_Map) {
        const _index = scene.children.indexOf(scene._windowLayer) || 0;
        switch (params.showFloor) {
          case 'dialog_under_layer':
            scene._spriteset.addChildAt(skitInfo.container, _index || 99);
            break;
          case 'dialog_on_layer':
            scene.addChildAt(skitInfo.container, _index + 1);
            break;
          case 'top_layer':
            scene.addChild(skitInfo.container);
            break;
          default:
            scene._spriteset.addChildAt(skitInfo.container, _index || 99);
            break;
        }
      } else if (scene instanceof Scene_Battle) {
        const _sprite = scene._spriteset._battleField;
        _sprite.addChild(skitInfo.container);
      } else if (params.showSubFloor) {
        const _config = params.showSubFloor.find(i => i.name === scene.constructor.name);
        if (_config) {
          scene.addChildAt(skitInfo.container, _config.floor || 0);
        }
      }

      if (skitInfo.container.parent) {
        skitInfo.children = [];
        skitInfo.timelines = [
          { id: 'main', frameIndex: 0, elementName: 'main', actions: [], eventList: [] }
        ];
        skitModule.active('');
      } else {
        skitInfo.isInit = false;
      }
    },
    /**
     * 获取最大的动作时间（不计算往后的循环时长）
     * @param {HakuTimeline} timeline 时间轴
     */
    getMaxActionTime(timeline) {
      if (!timeline.actions.length) return 0;

      return timeline.actions[0].duration;
    },
    /**
     * 获取时间轴
     * @param {string} elementName 节点名称
     */
    getTimeline(elementName) {
      for (let i = 0; i < skitInfo.timelines.length; i++) {
        const timeline = skitInfo.timelines[i];
        if (timeline.elementName === elementName) {
          return timeline;
        }
      }

      throw new Error(`Timeline ${elementName} not found`);
    },
    /**
     * 增加时间轴
     * @param {string} elementName 
     */
    addTimeline(elementName) {
      const _timeline = {
        id: (Math.random() + '').substring(2, 10),
        frameIndex: 0,
        elementName: elementName,
        actions: [],
        eventList: [],
      };
      skitInfo.timelines.push(_timeline);
    },
    /**
     * 增加动作
     * @param {HakuTimeline} 时间轴
     * @param {string} action 动作名称
     * @param {any} config 动作配置
     */
    addAction(timeline, action, config = {}) {
      if (timeline.actions.length >= 1) {
        const _lastAction = timeline.actions[timeline.actions.length - 1];
        if (_lastAction.weak) {
          _lastAction.loop = false;
          timeline.frameIndex = 1;
        }
      }

      timeline.actions.push({
        action: action,
        duration: +config.duration,
        config: config,
        isStart: false,
        weak: config.weak,
        loop: config.loop === undefined ? false : config.loop,
      });
      if (timeline.actions.length == 1 && timeline.frameIndex === 0) {
        timeline.frameIndex = +config.duration;
      }
    },
    /**
     * 增加动作
     * @param {string} elementName 时间轴
     * @param {string} action 动作名称
     * @param {any} config 动作配置
     */
    addActionByElementName(elementName, action, config = {}) {
      const _group = skitInfo.groupInfo[skitInfo.currentGroupName];
      // 判断是否在分组中
      if (_group && _group.startGroup) {
        _group.actionList.push({
          action: action,
          duration: +config.duration,
          frameIndex: +config.duration,
          config: config,
          isStart: false,
          weak: true,
          loop: config.loop === undefined ? false : config.loop,
        });
      } else {
        if (!elementName) {
          elementName = skitInfo.activeElementNames[0] || 'main';
        }
        const _names = Array.isArray(elementName) ? elementName : [elementName];
        const _elements = skitInfo.children.filter(i => _names.includes(i.name));
        if (elementName && _elements.length) {
          if (config.active !== false) {
            const _elementActors = _elements.filter(i => SkitUtils.isActorType(i.type));
            if (_elementActors.length) {
              skitModule.active(..._elementActors.map(i => i.name));
            }
          }
        }

        for (let i = 0; i < _names.length; i++) {
          const elementName = _names[i];

          const _timeline = skitModule.getTimeline(elementName);
          _timeline.actions.push({
            action: action,
            duration: +config.duration,
            config: config,
            isStart: false,
            weak: config.weak,
            loop: config.loop === undefined ? false : config.loop,
          });

          if (_timeline.actions.length == 1 && _timeline.frameIndex === 0) {
            _timeline.frameIndex = +config.duration;
          }
        }
      }
    }
  };

  // #endregion


  // #region 构建图片方法

  /** 系统动画标签 */
  const MaterialSetup = {
    /** 静态图片 static-image */
    'static-image': {
      setup(path, config, imgConfig) {
        const _fileInfo = SkitUtils.getFileInfo(params.tagDefaultImgPath + path);
        const _imgGitmap = ImageManager.loadBitmap(_fileInfo.path, _fileInfo.name, 0, true, _fileInfo.fullPath);
        let _sprite = new Sprite();
        let re;
        if (config.fixedIndex !== undefined) {
          // 转换精灵图中单帧的图片
          const _widthCount = +config.horizontalCount;
          const _heightCount = +config.verticalCount;
          const _frameWidth = _bitmap.width / _widthCount;
          const _frameHeight = _bitmap.height / _heightCount;
          let _fixedFrameIndex = +config.fixedIndex;
          // 转换普通图片
          re = {
            path: path,
            type: 'static-image',
            frameCount: 1,
            sprite: _sprite,
            widthCount: _widthCount,
            heightCount: _heightCount,
            frameWidth: _frameWidth,
            frameHeight: _frameHeight,
            fixedFrameIndex: _fixedFrameIndex || undefined,
            frameCount: 1,
            canUpdate: _fileInfo.canUpdate,
            filePath: _fileInfo.fullPath,
            originPath: _fileInfo.originPath,
          };
          _imgGitmap.addLoadListener(() => {
            const _width = config.width || _imgGitmap.width;
            const _height = config.height || _imgGitmap.height;

            const minScale = Math.max(_width / _imgGitmap.width * _widthCount, _height / _imgGitmap.height * _heightCount);
            const _bitmap = new Bitmap(_width * minScale, _height * minScale);
            _bitmap.blt(_imgGitmap, 0, 0, _imgGitmap.width, _imgGitmap.height, 0, 0, _imgGitmap.width * minScale, _imgGitmap.height * minScale);
            _sprite.bitmap = _bitmap;
            re.frameWidth = _bitmap.width / _widthCount;
            re.frameHeight = _bitmap.height / _heightCount;
            if (re.fixedFrameIndex) {
              const _x = (re.fixedFrameIndex % re.widthCount) * re.frameWidth;
              const _y = Math.floor(re.fixedFrameIndex / re.widthCount) * re.frameHeight;
              re.sprite.setFrame(_x, _y, re.frameWidth, re.frameHeight);
            } else {
              re.sprite.setFrame(0, 0, re.frameWidth, re.frameHeight);
            }
            if (imgConfig) {
              imgConfig.changing = false;
              imgConfig.filePath = _fileInfo.fullPath;
            }
            if (config.onLoad) {
              config.onLoad();
            }
          });
        } else {
          // 转换普通图片
          re = {
            path: path,
            type: 'static-image',
            frameCount: 1,
            sprite: _sprite,
            canUpdate: _fileInfo.canUpdate,
            filePath: _fileInfo.fullPath,
            originPath: _fileInfo.originPath,
          };
          _imgGitmap.addLoadListener(() => {
            const _width = config.width || _imgGitmap.width;
            const _height = config.height || _imgGitmap.height;
            const _bitmap = new Bitmap(_width, _height);
            _bitmap.blt(_imgGitmap, 0, 0, _imgGitmap.width, _imgGitmap.height, 0, 0, _width, _height);
            _sprite.bitmap = _bitmap;
            if (imgConfig) {
              imgConfig.changing = false;
              imgConfig.filePath = _fileInfo.fullPath;
            }
            if (config.onLoad) {
              config.onLoad();
            }
          });
        }
        return re;
      },
      update(spriteItem) {

      }
    },
    /** 精灵动画 sprite-anime */
    'sprite-anime': {
      setup(path, config, imgConfig) {
        const _fileInfo = SkitUtils.getFileInfo(params.tagDefaultImgPath + path);
        const _imgGitmap = ImageManager.loadBitmap(_fileInfo.path, _fileInfo.name, 0, true, _fileInfo.fullPath);
        const _sprite = new Sprite();
        const _widthCount = config.imgConfig.horizontalCount;
        const _heightCount = config.imgConfig.verticalCount;
        let _loopDelay = 0;
        if (config.loopDelay) {
          if (config.loopDelay.indexOf('~') >= 0) {
            _loopDelay = config.loopDelay.split('~').map(i => +i);
          } else {
            _loopDelay = +config.loopDelay;
          }
        }
        const re = {
          path: path,
          type: 'sprite-anime',
          widthCount: _widthCount,
          heightCount: _heightCount,
          frameWidth: undefined,
          frameHeight: undefined,
          frameCount: _widthCount * _heightCount,
          sprite: _sprite,
          frameDelay: config.frameDelay,
          loopDelayParam: _loopDelay,
          loop: config.loop,
          canUpdate: _fileInfo.canUpdate,
          filePath: _fileInfo.fullPath,
          originPath: _fileInfo.originPath,
        };
        _imgGitmap.addLoadListener(() => {
          const minScale = Math.max(config.width / _imgGitmap.width * _widthCount, config.height / _imgGitmap.height * _heightCount);

          const _bitmap = new Bitmap(_imgGitmap.width * minScale, _imgGitmap.height * minScale);
          _bitmap.blt(_imgGitmap, 0, 0, _imgGitmap.width, _imgGitmap.height, 0, 0, _imgGitmap.width * minScale, _imgGitmap.height * minScale);
          _sprite.bitmap = _bitmap;

          re.frameWidth = _bitmap.width / _widthCount / minScale;
          re.frameHeight = _bitmap.height / _heightCount / minScale;
          _sprite.setFrame(0, 0, re.frameWidth, re.frameHeight);
          if (imgConfig) {
            imgConfig.changing = false;
            imgConfig.filePath = _fileInfo.fullPath;
          }
          if (config.onLoad) {
            config.onLoad();
          }
        });
        return re;
      },
      update(spriteItem) {
        skitModule.imgNextFrame(spriteItem);
        if (!spriteItem.fixedFrameIndex) {
          if (spriteItem.frameWidth && spriteItem.frameHeight) {
            const _x = (spriteItem.frameIndex % spriteItem.widthCount) * spriteItem.frameWidth;
            const _y = Math.floor(spriteItem.frameIndex / spriteItem.widthCount) * spriteItem.frameHeight;
            spriteItem.sprite.setFrame(_x, _y, spriteItem.frameWidth, spriteItem.frameHeight);
            // spriteItem.sprite._refresh();
          }
        }
      }
    },
    /** 文件为基础的帧动画 frame-anime */
    'frame-anime': {
      setup(code, config, imgConfig) {
        let frameArr = [];
        for (let o = 1; o <= +config[0]; o++) {
          frameArr.push(code.replace(config.regexTag, (o + '').padStart(config[0].length, '0')));
        }
        const _fileInfo = SkitUtils.getFileInfo(params.tagDefaultImgPath + frameArr[0]);
        const _imgGitmap = ImageManager.loadBitmap(_fileInfo.path, _fileInfo.name, 0, true, _fileInfo.fullPath);
        const _sprite = new Sprite();
        let _loopDelay = 0;
        if (config.loopDelay) {
          if (config.loopDelay.indexOf('~') >= 0) {
            _loopDelay = config.loopDelay.split('~').map(i => +i);
          } else {
            _loopDelay = +config.loopDelay;
          }
        }
        const re = {
          code: frameArr[0],
          type: 'frame-anime',
          frames: frameArr,
          frameCount: frameArr.length,
          sprite: _sprite,
          frameDelay: config.frameDelay,
          loopDelayParam: _loopDelay,
          loop: config.loop,
          canUpdate: _fileInfo.canUpdate,
          filePath: _fileInfo.fullPath,
          originPath: _fileInfo.originPath,
        };
        _imgGitmap.addLoadListener(() => {
          const _bitmap = new Bitmap(config.width || _imgGitmap.width, config.height || _imgGitmap.height);
          _bitmap.blt(_imgGitmap, 0, 0, _imgGitmap.width, _imgGitmap.height, 0, 0, config.width || _imgGitmap.width, config.height || _imgGitmap.height);
          _sprite.bitmap = _bitmap;
          if (imgConfig) {
            imgConfig.changing = false;
            imgConfig.filePath = _fileInfo.fullPath;
          }
          if (config.onLoad) {
            config.onLoad();
          }
        });
        return re;
      },
      update(spriteItem) {
        skitModule.imgNextFrame(spriteItem);
        const _fileInfo = SkitUtils.getFileInfo(params.tagDefaultImgPath + spriteItem.frames[spriteItem.frameIndex]);
        const _imgGitmap = ImageManager.loadBitmap(_fileInfo.path, _fileInfo.name, 0, true, _fileInfo.fullPath);
        if (spriteItem.width || spriteItem.height) {
          const _bitmap = new Bitmap(spriteItem.width || _imgGitmap.width, spriteItem.height || _imgGitmap.height);
          _imgGitmap.addLoadListener(() => {
            if (spriteItem.width || spriteItem.height) {
              _bitmap.blt(_imgGitmap, 0, 0, _imgGitmap.width, _imgGitmap.height, 0, 0, spriteItem.width || _imgGitmap.width, spriteItem.height || _imgGitmap.height);
            }
            if (config.onLoad) {
              config.onLoad();
            }
          });
          spriteItem.sprite.bitmap = _bitmap;
        } else {
          spriteItem.sprite.bitmap = _imgGitmap;
        }
      }
    },
  };

  // #endregion



  // #region 当前场景信息

  /** 当前对话场景信息 */
  const skitInfo = {
    /** 上次显示立绘的情况 */
    prevTachieVisible: false,
    /**
     * 当前节点名称，可以为多个
     * @type {string[]}
     */
    activeElementNames: [],
    /**
     * 时间轴列表
     * @type {HakuTimeline[]}
     */
    timelines: [
      { id: 'main', frameIndex: 0, elementName: 'main', actions: [], eventList: [] }
    ],
    /** 基础帧动画配置 */
    baseFrame: {
      index: 0,
      maxCount: params.frameDelay,
    },
    /** 当前场景 */
    scene: SceneManager._scene,
    /** 绘制区域 */
    container: undefined,
    /** 是否初始化 */
    isInit: false,
    /** 是否显示 */
    isShow: false,
    /** 角色/NPC/CG列表 */
    children: [],
    /** 当前分组名 */
    currentGroupName: '',
    /**
     * 分组信息
     * @type { Record<string, {startGroup: boolean, elementName: string, actionList: HakuAction[]}>}
     */
    groupInfo: {
      /** 开始分组 */
      startGroup: false,
      /** 节点名称 */
      elementName: '',
      /**
       * 动作列表
       * @type {HakuAction[]}
       */
      actionList: [],
    }
  };
  window.skitInfo = skitInfo;

  // #endregion



  // #region 命令列表

  /** 命令列表 */
  const Commands = {
    /** 设定当前焦点角色 */
    active: {
      exec(element, action, config) {
        if (typeof config.name === 'string') {
          skitModule.active(config.name);
        } else if (Array.isArray(config.name)) {
          skitModule.active.apply(skitModule, config.name);
        }
      },
      /**
       * 
       * @param {*} element 行动节点
       * @param {*} action 动作
       * @param {*} progress 百分比进度
       * @param {*} config 配置项
       */
      update(element, action, progress, config) {
      }
    },
    /** 切换状态 */
    state: {
      exec(element, action, config) {
        if (config.duration <= 1) {
          skitModule.changeElementState(element.name, config.state);
          action.isComplete = true;
        } else {
          const _elementIndex = skitInfo.children.findIndex(child => child && child.name === element.name);
          if (_elementIndex < 0) throw new Error(`Element ${element.name} not found`);

          const _oldElement = skitInfo.children[_elementIndex];
          const _newElement = skitModule.getElement(element.name, config.state || _oldElement.state, true);
          _newElement.isTemp = true;
          _newElement.container.x = _oldElement.container.x;
          _newElement.container.y = _oldElement.container.y;
          _newElement.container._isGray = _oldElement.container._isGray;
          _newElement.onComplete(() => {
            _newElement.container.canRemove = true;
            element.newElement = _newElement;
            skitInfo.container.addChildAt(element.newElement.container, _elementIndex);
          });
        }
      },
      /**
       * 
       * @param {*} element 行动节点
       * @param {*} action 动作
       * @param {*} progress 百分比进度
       * @param {*} config 配置项
       */
      update(element, action, progress, config) {
        if (!element || action.isComplete) return;
        element.container.alpha = 1 - progress;
        element.newElement.container.alpha = Math.min(progress * 2, 1);

        if (progress >= 1) {

          const _elementIndex = skitInfo.children.findIndex(child => child && child.name === element.name && !child.isTemp);
          if (_elementIndex >= 0) {
            skitInfo.children.splice(_elementIndex, 1, element.newElement);

            const _containerIndex = skitInfo.container.children.findIndex(child => child && child === element.container && !child.canRemove);
            if (_containerIndex >= 0) {
              skitInfo.container.removeChildAt(_containerIndex);
            }

            const _newElement = skitInfo.children.find(child => child && child.name === element.name);
            if (_newElement) {
              delete _newElement.isTemp;
            }
          }
        }
      }
    },
    /**
     * 镜像
     */
    mirror: {
      exec(element, action, config) {
        action.prevScaleX = element.container.scale.x || 0;
        action.prevScaleY = element.container.scale.y || 0;
      },
      update(element, action, progress, config) {
        const _startX = action.prevScaleX;
        const _startY = action.prevScaleY;

        let _endX = _startX == -1 ? 1 : -1;
        let _endY = _startY == -1 ? 1 : -1;

        switch (config.dir) {
          case 'x':
            element.container.scale.x = _startX + (_endX - _startX) * progress;
            break;
          case 'y':
            element.container.scale.y = _startY + (_endY - _startY) * progress;
            break;
          case 'xy':
            element.container.scale.x = _startX + (_endX - _startX) * progress;
            element.container.scale.y = _startY + (_endY - _startY) * progress;
            break;
        }

        if (progress >= 1) {
          element.container._isMirror = _endX == -1;
        }
      }
    },
    /**
     * 跳跃
     */
    jump: {
      exec(element, action, config) {
        action.prevX = element.container.x;
        action.prevY = element.container.y;
      },
      /**
       * 
       * @param {*} element 行动节点
       * @param {*} action 动作
       * @param {*} progress 百分比进度
       * @param {*} config 配置项
       */
      update(element, action, progress, config) {
        const _power = config.power || 60;

        const curve = -4 * _power * progress * (progress - 1); // 简单的抛物线方程

        element.container.y = action.prevY - curve;
      }
    },
    /**
     * 变换
     */
    transform: {
      exec(element, action, config) {
        const firstNode = element.container.children[0];
        if (config.scale !== undefined) {
          action.scaleX = firstNode.scale.x || 1;
          action.scaleY = firstNode.scale.y || 1;
        }
        if (config.rotate !== undefined) {
          action.rotate = firstNode.rotation || 0;
        }
        if (config.x !== undefined) {
          action.x = firstNode.x;
        }
        if (config.y !== undefined) {
          action.y = firstNode.y;
        }
      },
      /**
       * 
       * @param {*} element 行动节点
       * @param {*} action 动作
       * @param {*} progress 百分比进度
       * @param {*} config 配置项
       */
      update(element, action, progress, config) {

        let x;
        let y;
        let scaleX;
        let scaleY;
        let rotation;

        if (action.x !== undefined) {
          const _startX = action.x;
          const _endX = config.x;
          x = _startX + (_endX - _startX) * progress;
        }
        if (action.y !== undefined) {
          const _startY = action.y;
          const _endY = config.y;
          y = _startY + (_endY - _startY) * progress;
        }

        if (action.scaleX !== undefined) {
          const _startScaleX = action.scaleX;
          const _startScaleY = action.scaleY;
          const _endScaleX = config.scale;
          const _endScaleY = config.scale;

          scaleX = _startScaleX + (_endScaleX - _startScaleX) * progress;
          scaleY = _startScaleY + (_endScaleY - _startScaleY) * progress;
        }

        if (action.rotate !== undefined) {
          rotation = action.rotate + (config.rotate - action.rotate) * progress;
        }

        element.container.setTransform(
          x !== undefined ? x : element.container.x, y !== undefined ? y : element.container.y,
          scaleX, scaleY,
          rotation * (Math.PI / 180),
          0, 0,
          element.container.pivot.x, element.container.pivot.y
        );

      }
    },
    /**
     * 点头/下降
     */
    nod: {
      exec(element, action, config) {
        action.prevX = element.container.x;
        action.prevY = element.container.y;
      },
      /**
       * 
       * @param {*} element 行动节点
       * @param {*} action 动作
       * @param {*} progress 百分比进度
       * @param {*} config 配置项
       */
      update(element, action, progress, config) {
        const _power = config.power || 40;

        const curve = _power * progress * (progress - 1); // 简单的抛物线方程

        element.container.y = action.prevY - curve;
      }
    },
    /** 变换色调 */
    hue: {
      exec(element, action, config) {
        action.endR = 0;
        action.endG = 0;
        action.endB = 0;
      },
      /**
       * 
       * @param {*} element 行动节点
       * @param {*} action 动作
       * @param {*} progress 百分比进度
       * @param {*} config 配置项
       */
      update(element, action, progress, config) {
        let _endR = 0;
        let _endG = 0;
        let _endB = 0;

        if (config.r) {
          const _sr = config.r / config.duration * 2;
          if (config.bounce && progress > 0.5) {
            _endR = -_sr;
          } else {
            _endR = _sr;
          }
          if (action.endR + _endR < 0) _endR = action.endR;
          else if (action.endR + _endR > 255) _endR = 255 - action.endR;
          action.endR += _endR;
        }
        if (config.g) {
          const _sg = config.g / config.duration * 2;
          if (config.bounce && progress > 0.5) {
            _endG = -_sg;
          } else {
            _endG = _sg;
          }
          if (action.endG + _endG < 0) _endG = action.endG;
          else if (action.endG + _endG > 255) _endG = 255 - action.endG;
          action.endG += _endG;
        }
        if (config.b) {
          const _sb = config.b / config.duration * 2;
          if (config.bounce && progress > 0.5) {
            _endB = -_sb;
          } else {
            _endB = _sb;
          }
          if (action.endB + _endB < 0) _endB = action.endB;
          else if (action.endB + _endB > 255) _endB = 255 - action.endB;
          action.endB += _endB;
        }

        for (let i = 0; i < element.container.children.length; i++) {
          const child = element.container.children[i];
          if (child.constructor === Sprite) {
            let index = child.filters.findIndex(filter => filter instanceof PIXI.filters.ColorMatrixFilter);
            if (index >= 0) {
              child.filters[index].adjustTone.call(child.filters[index], _endR, _endG, _endB);
              child._refresh();
            }
          } else if (child.constructor === PIXI.Container) {
            for (let o = 0; o < child.children.length; o++) {
              const leafChild = child.children[o];
              let index = leafChild.filters.findIndex(filter => filter instanceof PIXI.filters.ColorMatrixFilter);
              if (index >= 0) {
                leafChild.filters[index].adjustTone.call(leafChild.filters[index], _endR, _endG, _endB);
                leafChild._refresh();
              }
            }
          }
        }
      }
    },
    /**
     * 震动
     */
    shake: {
      exec(element, action, config) {
        action.prevX = element.container.x;
        action.prevY = element.container.y;
      },
      update(element, action, progress, config) {
        const phase = progress < 0.5 ? 'strong' : 'fade';
        const _direction = config.dir || 'horizontal';
        const _frequency = config.frequency || 10;
        const _power = config.power || 8;

        // 计算当前的偏移量
        const sinFactor = Math.sin(progress * Math.PI * 2 * _frequency);
        let _offset;

        if (phase === 'strong') {
          // 猛烈摇动阶段
          const strongPower = _power * (1 - Math.pow(1 - progress, 2));
          _offset = sinFactor * strongPower;
        } else {
          // 减弱摇动阶段
          const fadePower = _power * (1 - (progress - 0.5) * 2);
          _offset = sinFactor * fadePower;
        }

        if (_direction === 'horizontal') {
          element.container.x = action.prevX + _offset;
        } else {
          element.container.y = action.prevY + _offset;
        }
      }
    },
    /** 震动屏幕 */
    shakeScreen: {
      exec(element, action, config) {
        $gameScreen.startShake(
          config.power,
          config.speed,
          config.duration
        );
      },
      update(element, action, progress, config) {
      }
    },
    /** 播放背景音乐 */
    bgm: {
      exec(element, action, config) {
        AudioManager.playBgm({
          name: config.name,
          volume: config.volume || ConfigManager.seVolume,
          pitch: 100,
          pan: 0,
        });
        AudioManager.fadeInBgm(10);
      },
      update(element, action, progress, config) {
        if (progress >= 1) {
          AudioManager.fadeOutBgm(10);
          AudioManager.stopBgm();
        }
      }
    },
    /** 播放声音 */
    sound: {
      exec(element, action, config) {
        AudioManager.playSe({
          name: config.name,
          volume: config.volume || ConfigManager.seVolume,
          pitch: 100,
          pan: 0,
        });
      },
      update(element, action, progress, config) {
        if (progress >= 1) {
          AudioManager.stopSe();
        }
      }
    },
    /**
     * 渐显
     */
    fadeIn: {
      exec(element, action, config) {
        if (config.rx) {
          action.prevX = element.x - config.rx;
          action.nextX = element.x;
        }
        if (config.ry) {
          action.prevY = element.y - config.ry;
          action.nextY = element.y;
        }
      },
      update(element, action, progress, config) {
        element.container.alpha = progress;

        if (config.rx) {
          element.container.x = action.prevX + (action.nextX - action.prevX) * progress;
        }
        if (config.ry) {
          element.container.y = action.prevY + (action.nextY - action.prevY) * progress;
        }

        if (progress >= 1) {
          element.container.alpha = 1;
          if (config.rx) element.container.x = action.nextX;
          if (config.ry) element.container.y = action.nextY;
        }
      }
    },
    /**
     * 渐隐
     * @param { {  } } config 
     */
    fadeOut: {
      exec(element, action, config) {
        if (config.rx) {
          action.prevX = element.container.x;
          action.nextX = element.container.x + config.rx;
        }
        if (config.ry) {
          action.prevY = element.container.y;
          action.nextY = element.container.y + config.ry;
        }
      },
      update(element, action, progress, config) {
        element.container.alpha = 1 - progress;

        if (config.rx) {
          element.container.x = action.prevX + (action.nextX - action.prevX) * progress;
        }
        if (config.ry) {
          element.container.y = action.prevY + (action.nextY - action.prevY) * progress;
        }

        if (progress >= 1) {
          element.container.alpha = 0;
          if (config.rx) element.container.x = action.nextX;
          if (config.ry) element.container.y = action.nextY;
        }
      }
    },
    /**
     * 淡入淡出，后续回到原位
     * @param { {  } } config 
     */
    fade: {
      exec(element, action, config) {
        if (config.x) {
          action.prevX = element.container.x;
          action.nextX = element.container.x + config.x;
        }
        if (config.y) {
          action.prevY = element.container.y;
          action.nextY = element.container.y + config.y;
        }
        element.canFadeIn = element.container.alpha < 0.5 ? true : false;
      },
      update(element, action, progress, config) {
        let _progress = progress / (1 - config.loopDelay / 100);
        let phase = _progress < 0.5 ? 'in' : 'out';

        if (phase === 'in') {
          if (element.canFadeIn) {
            element.container.alpha = _progress * 2;
          } else {
            element.container.alpha = 1 - _progress * 2;
          }
        } else if (phase === 'out') {
          if (element.canFadeIn) {
            element.container.alpha = 2 - _progress * 2;
          } else {
            element.container.alpha = 1 - _progress * 2;
          }
        }

        if (config.x) {
          element.container.x = action.prevY + (action.nextX - action.prevY) * _progress;
        }
        if (config.y) {
          element.container.y = action.prevY + (action.nextY - action.prevY) * _progress;
        }

        if (progress >= 1) {
          if (config.x) element.container.x = action.prevX;
          if (config.y) element.container.y = action.prevY;
        }
      }
    },
    /**
     * 从一侧进入
     * @param { { dir: 'top'|'left'|'right'|'bottom', loc: string } } config 
     */
    slideIn: {
      exec(element, action, config) {
        let _startLoc = 0;
        let _endLoc = 0;
        const _tachieConfig = locConfigList.find(child => child.configTag === config.loc);

        if (!config.dir) throw new Error('Direction is required');
        if (!config.loc) throw new Error('Location Config is required');

        if (config.dir === 'left') {
          _startLoc = -element.container.width * element.container.anchorX * element.container.scale.x;
          if (config.x) {
            _endLoc = config.x;
          } else if (_tachieConfig) {
            _endLoc = _tachieConfig.tachieLocX;
          }
        } else if (config.dir === 'right') {
          _startLoc = (Graphics.width + element.container.width * element.container.anchorX) * element.container.scale.x;
          if (config.x) {
            _endLoc = config.x;
          } else if (_tachieConfig) {
            _endLoc = _tachieConfig.tachieLocX;
          }
        } else if (config.dir === 'top') {
          _startLoc = -element.container.height * element.container.anchorY * element.container.scale.y;
          if (config.y) {
            _endLoc = config.y;
          } else if (_tachieConfig) {
            _endLoc = _tachieConfig.tachieLocY;
          }
        } else if (config.dir === 'bottom') {
          _startLoc = (Graphics.height + element.container.height * element.container.anchorY) * element.container.scale.y;
          if (config.y) {
            _endLoc = config.y;
          } else if (_tachieConfig) {
            _endLoc = _tachieConfig.tachieLocY;
          }
        }

        action.startLoc = _startLoc;
        action.endLoc = _endLoc;
      },
      update(element, action, progress, config) {
        let _startLoc = action.startLoc;
        let _endLoc = action.endLoc;

        if (config.dir === 'left') {
          element.container.x = _startLoc + (_endLoc - _startLoc) * progress;
        } else if (config.dir === 'right') {
          element.container.x = _startLoc + (_endLoc - _startLoc) * progress;
        } else if (config.dir === 'top') {
          element.container.y = _startLoc + (_endLoc - _startLoc) * progress;
        } else if (config.dir === 'bottom') {
          element.container.y = _startLoc + (_endLoc - _startLoc) * progress;
        }
      }
    },
    slideOut: {
      exec(element, action, config) {
        action.prevX = element.container.x;
        action.prevY = element.container.y;
      },
      update(element, action, progress, config) {
        let _startLoc = 0;
        let _endLoc = 0;

        if (config.dir === 'left') {
          _startLoc = action.prevX;
          _endLoc = -element.container.width * element.container.anchorX * element.container.scale.x;
          element.container.x = _startLoc + (_endLoc - _startLoc) * progress;
        } else if (config.dir === 'right') {
          _startLoc = action.prevX;
          _endLoc = (Graphics.width + element.container.width * element.container.anchorX) * element.container.scale.x;
          element.container.x = _startLoc + (_endLoc - _startLoc) * progress;
        } else if (config.dir === 'top') {
          _startLoc = action.prevY;
          _endLoc = -element.container.height * element.container.anchorY * element.container.scale.y;
          element.container.y = _startLoc + (_endLoc - _startLoc) * progress;
        } else if (config.dir === 'bottom') {
          _startLoc = action.prevY;
          _endLoc = (Graphics.height + element.container.height * element.container.anchorY) * element.container.scale.y;
          element.container.y = _startLoc + (_endLoc - _startLoc) * progress;
        }
      }
    },
    /** 缓存 */
    cache: {
      exec(element, action, config) {
        if (config.images && config.images.length) {
          action.imageIndex = 0;
          action.imageCount = config.images.length;
          for (let i = 0; i < config.images.length; i++) {
            const img = config.images[i];
            let _imgInstance;
            if (img.indexOf("img/") === 0) {
              _imgInstance = ImageManager.loadBitmap(img.substring(0, img.lastIndexOf("/") + 1), img.substring(img.lastIndexOf("/") + 1), 0, true);
            } else if (img.indexOf("pictures/") === 0) {
              _imgInstance = ImageManager.loadBitmap("img/", img, 0, true);
            } else {
              _imgInstance = ImageManager.loadBitmap("img/pictures/", img, 0, true);
            }
            if (_imgInstance.isReady()) {
              action.imageIndex++;
            } else {
              _imgInstance.addLoadListener(() => {
                action.imageIndex++;
              });
            }
          }
        }
      },
      update(element, action, progress, config, timeline) {
        if (action.imageIndex >= action.imageCount) {
          timeline.frameIndex = 0;
        }
      }
    },
    /** 修改开关 */
    switch: {
      exec(element, action, config) {
        if (!config.id) throw new Error('Switch ID is required');
        if (isNaN(config.value)) {
          $gameSwitches.setValue(config.id, +config.value);
        } else {
          $gameSwitches.setValue(config.id, config.value);
        }
      },
      update(element, action, progress, config) {
      }
    },
    /** 修改变量 */
    variable: {
      exec(element, action, config) {
        if (!config.id) throw new Error('Variable ID is required');
        if (isNaN(config.value)) {
          $gameVariables.setValue(config.id, +config.value);
        } else {
          $gameVariables.setValue(config.id, config.value);
        }
      },
      update(element, action, progress, config) {
      }
    },
    /** 添加日志/信息（左上角显示的内容） */
    log: {
      exec(element, action, config) {
        if (!SceneManager._scene._logWindow) {
          throw new Error('Log Window not found');
        }
        const _win = SceneManager._scene._logWindow;
        _win.addText(config.content);
        if (_win._lines.length >= _win.maxLines()) {
          _win._lines.pop();
        }
        _win.refresh();
      },
      update(element, action, progress, config) { }
    },
    /** 延时 */
    wait: {
      exec(element, action, config) { },
      update(element, action, progress, config) { }
    },
    /** 结束 */
    clear: {
      exec(element, action, config) {
        skitModule.clear();
      },
      update(element, action, progress, config) { }
    },
    /** 组合动作 */
    group: {
      exec(element, action, config) {
      },
      update(element, action, progress, config) {

        const _actions = action.actions;

        for (let i = _actions.length - 1; i >= 0; i--) {
          const _action = _actions[i];

          if (!_action.isStart) {
            Commands.exec(_action.action, _action, skitInfo.groupInfo[element.name].timeline, _action.config);
            _action.isStart = true;
          }
          if (_action.isStart) {
            _action.frameIndex -= 1;
            const _progress = (_action.duration - _action.frameIndex) / _action.duration;
            Commands.update(_action.action, _action, skitInfo.groupInfo[element.name].timeline, _progress, _action.config);
          }

          if (_action.frameIndex <= 0) {
            if (_action.loop === true) {
              _action.isStart = false;
              _action.frameIndex = _action.duration;
            } else if (!isNaN(_action.loop) && _action.loop > 1) {
              _action.isStart = false;
              _action.frameIndex = _action.duration;
              _action.loop--;
            } else {
              _actions.splice(i, 1);

              if (_actions.length) {
                _action.frameIndex = _action.duration;
              }
            }
          }
        }

        if (progress >= 1) return;
      }
    },
    /** 更新图层 */
    update(actionName, action, timeline, progress, config) {
      const _childrenIndex = skitInfo.children.findIndex(child => child && child.name === timeline.elementName);
      Commands[actionName].update(skitInfo.children[_childrenIndex], action, progress, config, timeline);
    },
    /** 执行 */
    exec(actionName, action, timeline, config) {
      if (Commands[actionName]) {
        if (timeline.elementName === 'main') {
          Commands[actionName].exec(undefined, action, config);
        } else {
          const _childrenIndex = skitInfo.children.findIndex(child => child && child.name === timeline.elementName);
          if (_childrenIndex < 0) throw new Error(`Element ${timeline.elementName} not found`);

          Commands[actionName].exec(skitInfo.children[_childrenIndex], action, config);
        }
      } else {
        throw new Error(`Command ${actionName} not found`);
      }
    }
  };

  // #endregion



  // #region 系统修改

  /** 等待函数 */
  const wait = (timeout = 60, condition) => {
    return new Promise(resolve => {
      const fn = () => {
        setTimeout(() => {
          if (condition()) {
            resolve();
          } else {
            fn();
          }
        }, timeout);
      }
  
      fn();
    });
  };

  /** 上次是否显示 */
  const initDefaultTachie = () => {
    if (skitInfo.isInit && params.useDefaultTachie && !skitInfo.prevTachieVisible) {
      wait(10, () => {
        return window._hakuTachieContainer && ActorTachieUtils.isShowTachie;
      }).then(() => {
        skitInfo.prevTachieVisible = true;
        const element = skitModule.getTachieElement(params.defaultTachieName);
  
        skitModule.addTimeline(params.defaultTachieName);
        element.state = 'default';
        skitInfo.children.push(element);
        skitInfo.container.addChild(element.container);
        skitModule.active(params.defaultTachieName);
      });
    }
  };

  const Scene_Base_start = Scene_Base.prototype.start;
  Scene_Base.prototype.start = function () {
    Scene_Base_start.call(this);

    skitModule.initialize(this);
    initDefaultTachie();
  }

  const Scene_Base_stop = Scene_Base.prototype.stop;
  Scene_Base.prototype.stop = function () {
    Scene_Base_stop.call(this);
    skitModule.clear();
  }

  const Scene_Base_update = Scene_Base.prototype.update;
  Scene_Base.prototype.update = function () {
    Scene_Base_update.call(this);

    if (skitInfo.isInit) {
      skitModule.onUpdate();
    }
  }


  if (Utils.RPGMAKER_NAME === "MV") {
    ImageManager.iconWidth = 32;
    ImageManager.iconHeight = 32;
    ImageManager.faceWidth = 144;
    ImageManager.faceHeight = 144;
    Window_Base.prototype.drawRect = function (x, y, width, height) {
      const outlineColor = this.contents.outlineColor;
      const mainColor = this.contents.textColor;
      this.contents.fillRect(x, y, width, height, outlineColor);
      this.contents.fillRect(x + 1, y + 1, width - 2, height - 2, mainColor);
    };
    Window_Base.prototype.itemPadding = function () {
      return 8;
    };
    Window_Selectable.prototype.itemRectWithPadding = function (index) {
      const rect = this.itemRect(index);
      const padding = this.itemPadding();
      rect.x += padding;
      rect.width -= padding * 2;
      return rect;
    };
    Window_Selectable.prototype.itemLineRect = function (index) {
      const rect = this.itemRectWithPadding(index);
      const padding = (rect.height - this.lineHeight()) / 2;
      rect.y += padding;
      rect.height -= padding * 2;
      return rect;
    };
    Window_Base.prototype.createTextState = function (text, x, y, width) {
      const textState = { index: 0, x: x, y: y, left: x };
      textState.text = this.convertEscapeCharacters(text);
      // @ts-ignore // MV Compatible
      textState.height = this.calcTextHeight(textState, false);
      return textState;
    };
    Window_Base.prototype.processAllText = function (textState) {
      while (textState.index < textState.text.length) {
        this.processCharacter(textState);
      }
      return textState;
    };
    Object.defineProperty(Window.prototype, "innerWidth", {
      get: function () {
        return Math.max(0, this._width - this._padding * 2);
      },
      configurable: true
    });
    Object.defineProperty(Window.prototype, "innerHeight", {
      get: function () {
        return Math.max(0, this._height - this._padding * 2);
      },
      configurable: true
    });
  }

  // #endregion



  // #region 对话场景窗口


  // #endregion



  // #region 工具类

  class HakuSkit {
    /** 结束场景 */
    static clear(elementNames) {
      skitModule.addActionByElementName(elementNames, 'clear', {});
    }
    /** 设置当前的节点名称（标准动作） */
    static active(...elementNames) {
      skitModule.addActionByElementName(elementNames, 'active', {
        ...config,
        duration: 1,
        name: elementNames
      });

      return this;
    }
    /**
     * 切换表情/状态，目前是切换整张图
     * @param {string?} elementName 节点名称
     * @param { { frequency: number, power: number, duration: number? } } config 
     */
    static state(config, elementName) {
      skitModule.addActionByElementName(elementName, 'state', {
        ...config,
        state: config.state,
        duration: config.duration || 1,
        active: false,
      });

      return this;
    }
    /** 结束之前的所有动作 */
    static break(config = { force: false }) {
      for (let i = 0; i < skitInfo.timelines.length; i++) {
        const timeline = skitInfo.timelines[i];

        for (let o = 0; o < timeline.actions.length; o++) {
          let _isInfiniteLoop = false;
          const action = timeline.actions[o];

          if (config.force) {
            if (o == 0) {
              action.loop = false;
              timeline.frameIndex = 1;
              action.duration = 1;
            } else {
              action.loop = false;
              action.duration = 1;
            }
          } else {
            if (o == 0) {
              if (action.loop === true && action.weak !== true) {
                _isInfiniteLoop = true;
              } else {
                action.loop = false;
                timeline.frameIndex = 1;
                action.duration = 1;
              }
            } else if (!_isInfiniteLoop) {
              action.loop = false;
              action.duration = 1;
            }
          }

          // if (_timeline.elementName === 'main') {
          //   _timeline.frameIndex -= 1;
          //   const _progress = (_action.duration - _timeline.frameIndex) / _action.duration;
          //   Commands.update(_action.action, _action, _timeline, _progress, _action.config);
          // } else if (!_action.isStart && this.isTimelineIdle()) {
          //   Commands.exec(_action.action, _action, _timeline, _action.config);
          //   _action.isStart = true;
          // } else if (_action.isStart) {
          //   _timeline.frameIndex -= 1;
          //   const _progress = (_action.duration - _timeline.frameIndex) / _action.duration;
          //   Commands.update(_action.action, _action, _timeline, _progress, _action.config);
          // }
        }
      }

      return this;
    }
    /**
     * 进入对话场景
     * @param {string} elementName 元素ID（可包含CG、角色立绘、NPC立绘、图片）
     * @param {object} config 配置
     * @param {number} config.x 立绘X坐标
     * @param {number} config.y 立绘Y坐标
     * @param {number} config.visible 是否隐藏
     * @param {number} config.state 进入后的初始状态
     */
    static in(config, elementName) {
      if (!config.loc && (!config.x || !config.y)) throw new Error('请指定显示位置');

      const element = skitModule.getElement(elementName, config.state || 'default');

      element.container.y = params.tachieLocY;

      skitModule.addTimeline(elementName);

      const _locConfig = locConfigList.find(child => child.configTag === config.loc);
      if (_locConfig) {
        if (_locConfig.tachieLocX) {
          element.container.x = _locConfig.tachieLocX;
        }
        if (_locConfig.tachieLocY) {
          element.container.y = _locConfig.tachieLocY;
        }
        if (_locConfig.isMirror) {
          element.container.scale.x = -1;
          element.container._isMirror = true;
        }
      }
      // 自定义位置
      if (config.x) {
        element.container.x = config.x;
      }
      if (config.y) {
        element.container.y = config.y;
      }
      element.x = element.container.x;
      element.y = element.container.x;
      // 是否隐藏
      if (config.visible !== undefined) {
        element.container.alpha = config.visible ? 1 : 0;
      }
      element.state = 'default';
      skitInfo.children.push(element);

      skitInfo.container.addChild(element.container);
      if (SkitUtils.isActorType(element.type)) {
        skitModule.active(elementName);
      }

      return this;
    }
    /**
     * 仅仅加入，不显示
     * @param {string} elementName 元素ID（可包含CG、角色立绘、NPC立绘、图片）
     */
    static add(elementName) {
      const element = skitModule.getElement(elementName);
      element.container.y = params.tachieLocY;
      skitModule.addTimeline(elementName);
      // 是否隐藏
      element.container.alpha = 0;
      skitInfo.children.push(element);

      skitInfo.container.addChild(element.container);
      if (SkitUtils.isActorType(element.type)) {
        skitModule.active(elementName);
      }

      return this;
    }
    /**
     * 镜像/旋转
     */
    static mirror(config, elementName) {
      skitModule.addActionByElementName(elementName, 'mirror', {
        ...config,
        dir: config.dir || 'x',
        duration: config.duration || 30,
        loop: config.loop || false,
      });

      return this;
    }
    /**
     * 自定义变换
     * @param {Object} config 配置参数
     * @param {Object} config.x 横坐标X
     * @param {Object} config.y 纵坐标Y
     * @param {Object} config.scale 缩放比例
     * @param {Object} config.rotate 旋转角度
     * @param {Object} config.duration 持续时间（帧数）
     * @param {Object} config.loop 循环次数
     * @param {string} elementName 
     */
    static transform(config, elementName) {
      skitModule.addActionByElementName(elementName, 'transform', {
        ...config,
        x: config.x,
        y: config.y,
        scale: config.scale,
        rotate: config.rotate,
        duration: config.duration || 1,
        loop: config.loop || false,
      });

      return this;
    }
    /** 变换色调 */
    static hue(config, elementName) {
      skitModule.addActionByElementName(elementName, 'hue', {
        ...config,
        r: config.r,
        g: config.g,
        b: config.b,
        bounce: config.bounce || false,
        duration: config.duration || 1,
        loop: config.loop || false,
      });

      return this;
    }
    /**
     * 渐显后渐隐
     * @param { string } elementName 节点名称
     * @param { object } config 配置参数
     * @param { number } [config.duration=10] 持续时间（帧数），默认10帧
     * @param { number } [config.rx=10] X坐标偏移值，默认10
     * @param { number } [config.ry=10] Y坐标偏移值，默认10
     * @param { number } [config.loopDelay=0] 延迟时间（百分比），默认0，可以填写0-100之间的数字，表示延迟的百分比
     */
    static fade(config, elementName) {
      const _timeline = skitModule.getTimeline(elementName);
      skitModule.addAction(_timeline, 'fade', {
        ...config,
        duration: config.duration || 30,
        x: config.rx,
        y: config.ry,
        loop: config.loop || false,
        loopDelay: config.loopDelay || 0,
      });

      return this;
    }
    /**
     * 渐隐
     * @param { string } elementName 节点名称
     * @param { object } config 配置参数
     * @param { number } [config.duration=10] 持续时间（帧数），默认10帧
     */
    static fadeOut(config, elementName) {
      const _timeline = skitModule.getTimeline(elementName);
      skitModule.addAction(_timeline, 'fadeOut', {
        ...config,
        duration: config.duration || 30,
        rx: config.rx,
        ry: config.ry,
      });

      return this;
    }
    /**
     * 渐显
     * @param { string } elementName 节点名称
     * @param { object } config 配置参数
     * @param { number } [config.duration=10] 持续时间（帧数），默认10帧
     */
    static fadeIn(config, elementName) {
      const _childrenIndex = skitInfo.children.findIndex(child => child.name === elementName);
      if (_childrenIndex < 0) {
        HakuSkit.in({ ...config, visible: false, state: config.state || 'default' }, elementName);
      }

      const element = skitModule.getElement(elementName, config.state || 'default');

      const _timeline = skitModule.getTimeline(elementName);
      skitModule.addAction(_timeline, 'fadeIn', {
        duration: config.duration || 10,
        rx: config.rx,
        ry: config.ry,
      });

      return this;
    }
    /**
     * 从一侧退出
     * @param {string} elementName 节点名称
     * @param { object } config 配置参数
     * @param { 'top'|'left'|'right'|'bottom' } config.loc 方向
     * @param { number } [config.duration=10] 持续时间（帧数），默认10帧
     */
    static slideOut(config, elementName) {
      const _timeline = skitModule.getTimeline(elementName);
      skitModule.addAction(_timeline, 'slideOut', {
        dir: config.dir,
        duration: config.duration || 30,
      });

      return this;
    }
    /**
     * 渐显
     * @param { string } elementName 节点名称
     * @param { object } config 配置参数
     * @param { 'top'|'left'|'right'|'bottom' } config.dir 方向
     * @param { string } config.loc 位置标签
     * @param { number } [config.duration=10] 持续时间（帧数），默认10帧
     */
    static slideIn(config, elementName) {
      const _childrenIndex = skitInfo.children.findIndex(child => child.name === elementName);
      if (_childrenIndex < 0) {
        HakuSkit.in({ ...config, visible: false }, elementName);
      }

      const element = skitModule.getElement(elementName);

      let _width = element.container.width;
      let _height = element.container.height;
      if (['actor', 'npc'].includes(element.type)) {
        if (!_width) {
          _width = params.tachieWidth;
        }
        if (!_height) {
          _height = params.tachieHeight;
        }
      }

      if (config.dir === 'left') {
        element.container.x = -_width * element.container.anchorX * element.container.scale.x;
      } else if (config.dir === 'right') {
        element.container.x = (Graphics.width + _width * element.container.anchorX) * element.container.scale.x;
      } else if (config.dir === 'top') {
        element.container.y = -_height * element.container.anchorY * element.container.scale.y;
      } else if (config.dir === 'bottom') {
        element.container.y = (Graphics.height + _height * element.container.anchorY) * element.container.scale.y;
      }
      element.container.alpha = 1;

      const _timeline = skitModule.getTimeline(elementName);
      skitModule.addAction(_timeline, 'slideIn', {
        dir: config.dir || 'left',
        loc: config.loc,
        duration: config.duration || 30,
      });

      return this;
    }
    /**
     * 延时
     * @param {number} time 延时时间（帧数）
     * @param {string | undefined} elementName 节点名称
     */
    static wait(time, elementName) {
      skitModule.addActionByElementName(elementName, 'wait', {
        duration: time,
        active: false
      });

      return this;
    }
    /**
     * 跳跃
     * @param { { x: number?, y: number?, duration: number?, loop: number | boolean } } config 
     * @param {number} elementName 延时时间（帧数）
     */
    static jump(config, elementName) {
      skitModule.addActionByElementName(elementName, 'jump', {
        ...config,
        power: config.power || 60,
        duration: config.duration || 15,
        x: config.x,
        y: config.y,
        rx: config.rx,
        ry: config.ry,
        loop: config.loop || false,
      });

      return this;
    }
    /**
     * 点头/下降
     * @param { { x: number?, y: number?, duration: number?, loop: number | boolean } } config 
     * @param {number} elementName 延时时间（帧数）
     */
    static nod(config, elementName) {
      skitModule.addActionByElementName(elementName, 'nod', {
        ...config,
        power: config.power || 40,
        duration: config.duration || 30,
        loop: config.loop || false,
      });

      return this;
    }
    /**
     * 移动
     * @param { { x: number?, y: number?, duration: number?, loop: number | boolean } } config 
     * @param {number} elementName 延时时间（帧数）
     */
    static move(config, elementName) {
      skitModule.addActionByElementName(elementName, 'move', {
        ...config,
        loc: config.loc,
        x: config.x,
        y: config.y,
        duration: config.duration || 30,
        loop: config.loop || false,
      });
      return this;
    }
    /**
     * 震动
     * @param {string?} elementName 节点名称
     * @param { { frequency: number, power: number, duration: number? } } config 
     */
    static shake(config, elementName) {
      skitModule.addActionByElementName(elementName, 'shake', {
        ...config,
        dir: config.dir || 'horizontal',
        frequency: config.frequency || 10,
        power: config.power || 8,
        duration: config.duration || 30,
        loop: config.loop || false,
      });

      return this;
    }
    /** 震动屏幕 */
    static shakeScreen(config, elementName = 'main') {
      skitModule.addActionByElementName(elementName, 'shakeScreen', {
        ...config,
        power: config.power || 5,
        speed: config.speed || 5,
        duration: config.duration || 10,
        loop: config.loop || false,
      });

      return this;
    }
    /** 播放背景音乐 */
    static bgm(config, elementName = 'main') {
      skitModule.addActionByElementName(elementName, 'bgm', {
        ...config,
        name: config.name,
        volume: config.volume || ConfigManager.seVolume,
      });

      return this;
    }
    /** 播放音效 */
    static sound(config, elementName = 'main') {
      skitModule.addActionByElementName(elementName, 'sound', {
        ...config,
        name: config.name,
        volume: config.volume || ConfigManager.seVolume,
      });

      return this;
    }
    /** 切换z坐标/层级 */
    static z(number, elementName) {

    }
    /** 执行自定义动作 */
    static exec(customActionName, config = {}, elementName = '') {
      if (elementName) skitModule.active(elementName);

      const _action = params.customActionList.find(child => child.name === customActionName);
      if (!_action) throw new Error(`未找到自定义动作：${customActionName}`);

      skitModule.addActionByElementName(elementName, _action.actionType, {
        ...Object.assign.apply({}, _action.actionConfig.map(i => ({ [i.paramName]: i.paramValue }))),
        ...config,
      });

      return this;
    }
    /** 缓存图片 */
    static cache(config, elementName) {
      skitModule.addActionByElementName(elementName, 'cache', {
        ...config,
        duration: 10000,
        name: config.images,
      });

      return this;
    }
    /** 打印信息（仅在战斗界面中） */
    static log(config, elementName) {
      skitModule.addActionByElementName(elementName, 'log', {
        ...config,
        duration: 0,
        content: config.content,
      });

      return this;
    }
    /** 修改开关 */
    static switch(config, elementName) {
      skitModule.addActionByElementName(elementName, 'switch', {
        ...config,
        id: config.id,
        value: config.value,
        duration: 0,
      });
    }
    /** 修改变量 */
    static variable(config, elementName) {
      skitModule.addActionByElementName(elementName, 'variable', {
        ...config,
        id: config.id,
        value: config.value,
        duration: 0,
      });
    }
    /** 分组 */
    static group(config, elementName) {

      const _name = elementName || skitInfo.activeElementNames[0];
      if (!skitInfo.groupInfo[_name]) skitInfo.groupInfo[_name] = {
        startGroup: false,
        elementName: '',
        actionList: [],
      };
      const _group = skitInfo.groupInfo[_name];
      skitInfo.currentGroupName = _name;

      _group.startGroup = true;
      if (!config) {
        _group.elementName = skitInfo.activeElementNames[0];
      } else {
        _group.elementName = typeof config === 'string' ? config : elementName;
      }
      _group.timeline = skitModule.getTimeline(_group.elementName);
      if (!_group.timeline) throw new Error(`未找到${_group.elementName}的时间轴。`);

      // _group.timeline.actions = [];

      if (config && elementName) {
        if (config.duration) _group.duration = config.duration;
      }

      return this;
    }
    /** 分组 */
    static groupEnd() {
      const _group = skitInfo.groupInfo[skitInfo.currentGroupName];
      skitInfo.currentGroupName = '';
      if (!_group.startGroup) throw new Error('分组未开始');

      const _actions = _group.actionList;

      // 获取时间轴
      const _timeline = _group.timeline;
      // 获取最大帧数
      const _maxFrameCount = Math.max(..._actions.map(i => {
        if (i.loop === true) return -1;
        const _loop = i.loop === false ? 1 : +i.loop;
        return i.duration * _loop + (i.loopDelay || 0) * (_loop - 1) + _loop - 1;
      }));

      if (_maxFrameCount < 0) throw new Error('分组没有设定执行时长。');

      if (_timeline.actions.length <= 1 && _timeline.frameIndex === 0) {
        _timeline.frameIndex = +_maxFrameCount;
      }

      _timeline.actions.push({
        action: 'group',
        actions: _group.actionList,
        duration: _group.duration || +_maxFrameCount,
        config: {},
        isStart: false,
        weak: true,
        loop: false,
      });

      _group.startGroup = false;
      _group.duration = 0;
      _group.elementName = '';
      _group.actionList = [];

      return this;
    }
  }
  window.HakuSkit = HakuSkit;

  // #endregion

  /** 指令/属性转换表 */
  const commandTransformMap = {
    name: ['名称'],
    loc: ['位置', '方位'],
    dir: ['方向'],
    state: ['状态'],
    duration: ['时长', '持续时间'],
    visible: ['显示', '是否可见'],
    scale: ['缩放'],
    rotate: ['旋转'],
    r: ['红', '红色'],
    b: ['蓝', '蓝色'],
    g: ['绿', '绿色'],
    bounce: ['回弹', '反弹'],
    loop: ['循环', '反复'],
    weak: ['弱化', '即停'],
    power: ['力度', '强度', '力度'],
    frequency: ['频率'],
    speed: ['速度'],
    vertical: ['纵向', '垂直'],
    horizontal: ['横向', '水平'],
    break: ['打断', '中断', '中止'],
    loopDelay: ['循环延迟', '循环间隔', '间隔'],
    wait: ['等待', '停顿'],
    group: ['开始分组', '{', '('],
    groupEnd: ['结束分组', '}', ')'],
    cache: ['缓存', '缓存图片'],
    images: ['图片', '图片列表'],
    switch: ['开关'],
    variable: ['变量'],
    log: ['日志', '记录'],
    content: ['内容', '信息'],
  };

  const commands = [
    'clear', 'active', 'state', 'break', 'in', 'out', 'add', 'mirror', 'transform',
    'hue', 'fade', 'fadeIn', 'fadeOut', 'slideOut', 'slideIn', 'wait', 'jump',
    'nod', 'move', 'shake', 'shakeScreen', 'bgm', 'sound', 'z', 'exec', 'group', 'groupEnd',
    'cache', 'switch', 'variable', 'log'
  ];

  const Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'skit') SkitUtils.analysisCommand(args);
  };


  /** 工具类 */
  class SkitUtils {
    /** 获取当前插件全局信息 */
    static getGlobalInfo() {
      return {
        actorList: params.actorList,
        npcList: params.npcList,
        customActionList: params.customActionList,
        skitInfo,
      };
    }
    static isActorType(type) {
      return ['actor', 'npc'].includes(type);
    }
    /**
     * 获取文件信息，文件名及路径
     * @param {string} path 文件完整路径
     * @return { { name: string, path: string, fullPath: string, canUpdate: boolean, originPath: string } }
     */
    static getFileInfo(path) {
      let _canUpdate = false;
      const _fullPath = path.replace(/\\/g, '/').replace(/<v:(\d+)>/g, (text, match) => {
        _canUpdate = true;
        return $gameVariables.value(+match);
      });
      const _fileName = _fullPath.substring(_fullPath.lastIndexOf("/") + 1);
      const _filePath = _fullPath.substring(0, _fullPath.lastIndexOf("/") + 1);

      return {
        name: _fileName,
        path: _filePath,
        fullPath: _fullPath,
        canUpdate: _canUpdate,
        originPath: path,
      };
    }
    /**
     * 解析文本命令
     * @param {string} commandText 命令
     */
    static analysisTextCommand(commandText) {
      if (!commandText || commandText.length <= 2) return;
      const _commands = commandText.split(' ');
      if (commandText.startsWith('skit ')) {
        SkitUtils.analysisCommand(_commands.slice(1));
      } else {
        SkitUtils.analysisCommand(_commands);
      }
    }
    /**
     * 解析命令
     * @param {string[]} args 参数
     */
    static analysisCommand(args) {

      /** 全部指令 */
      const _fullCommands = args;
      const _obj = HakuSkit;
      let _actionName = undefined;
      let _elementName = '';
      let _config = {};
      let _isGetFnName = false;

      for (let i = 0; i < _fullCommands.length; i++) {
        const item = _fullCommands[i];
        const fnName = SkitUtils.getTransformFunctionKey(item);

        // 普通
        if (i === 0) {
          if (fnName === 'break') {
            if (!_fullCommands[i + 1]) {
              _obj.break();
            } else if (_fullCommands[i + 1] == 'force') {
              _obj.break(true);
            }
            return;
          } else if (fnName === 'clear') {
            _obj.clear();
            return;
          } else if (fnName === 'group') {
            _obj.group();
            return;
          } else if (fnName === 'groupEnd') {
            _obj.groupEnd();
            return;
          } else if (fnName === 'cache') {
            _obj.cache({ images: _fullCommands[i + 1].split(',') }, 'main');
            return;
          } else {
            if (commands.includes(fnName)) {
              _actionName = fnName;
              _isGetFnName = true;
              continue;
            } else {
              _elementName = fnName;
            }
          }
        } else if (i === 1) {
          if (!_isGetFnName) {
            if (fnName === 'break') {
              _obj.break();
              return;
            } else if (fnName === 'clear') {
              _obj.clear(_elementName);
              return;
            } else if (fnName === 'group') {
              _obj.group(_elementName);
              return;
            } else if (fnName === 'groupEnd') {
              _obj.groupEnd();
              return;
            } else if (fnName === 'cache') {
              _obj.cache({ images: _fullCommands[i + 1].split(',') }, _elementName);
              return;
            } else if (fnName === 'log') {
              _obj.log({ content: _fullCommands[i + 1] }, _elementName);
              return;
            } else {
              _actionName = fnName;
              _isGetFnName = true;
              continue;
            }
          }
        }
        if (_isGetFnName) {
          const [key, value] = SkitUtils.getTransformKey(...item.split(':'));

          if (value === undefined) {
            _config[key] = true;
          } else {
            if (value === true) _config[key] = true;
            else if (value === false) _config[key] = false;
            else _config[key] = isNaN(value) ? value : +value;
          }
        }
      }

      _obj[_actionName](_config, _elementName);
    }
    /** 转换函数关键词 */
    static getTransformFunctionKey(fnName) {
      const _re = Object.entries(commandTransformMap).find(([key, value]) => {
        return key === fnName || value.includes(fnName);
      });

      if (_re) return _re[0];
      else return fnName;
    }
    /** 转换常规关键词 */
    static getTransformKey(propName, propValue) {
      // 特殊词
      if (['显示', '可见', '不隐藏'].includes(propName)) {
        return ['visible', true];
      } else if (['不显示', '隐藏'].includes(propName)) {
        return ['visible', false];
      } else if (['纵向', '竖向', '垂直'].includes(propName)) {
        return ['dir', 'vertical'];
      } else if (['横向', '水平'].includes(propName)) {
        return ['dir', 'horizontal'];
      } else if (['弱化', '即停'].includes(propName)) {
        return ['weak', true];
      } else if (['回弹', '反弹'].includes(propName)) {
        return ['bounce', true];
      }

      const _re = Object.entries(commandTransformMap).find(([key, value]) => {
        return key === propName || value.includes(propName);
      });

      if (_re) return [_re[0], propValue];
      else return [propName, propValue];
    }
  }
  window.SkitUtils = SkitUtils;

  // MZ指令
  if (Utils.RPGMAKER_NAME === "MZ") {
    PluginManager.registerCommand(PluginName, 'play', args => {
      const _commands = args.command.split('\n');
      for (let i = 0; i < _commands.length; i++) {
        const item = _commands[i];
        SkitUtils.analysisTextCommand(item);
      }
    });
  }

})();