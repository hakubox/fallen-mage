//==========================================================================
// EliMZ_MobileControls.js
//==========================================================================

/*:
@target MZ
@base EliMZ_Book

@plugindesc ♦5.2.0♦ 为移动端/触屏游戏添加虚拟按键（摇杆、十字键、功能键）。
@author Hakuen Studio (汉化 & 文档增强: 你的名字/AI)
@url https://hakuenstudio.itch.io/eli-mobile-controls-for-rpg-maker

@help
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
• 评价插件！这对作者很重要 ^^
https://hakuenstudio.itch.io/eli-mobile-controls-for-rpg-maker/rate?source=game

使用条款:
https://www.hakuenstudio.com/terms-of-use-5-0-0
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
============================================================================
插件功能
============================================================================

● 在屏幕上添加响应式按钮（虚拟按键），专为移动端游戏设计。
● 支持对话时自动隐藏按钮。
● 提供特殊的“控制按钮”，可用于显示/隐藏所有其他按钮（如沉浸模式）。
● 两种移动控制方式：十字键（D-pad）和 摇杆（Joystick）。
● 可禁用原本的点触移动功能（防止误触）。
● 可禁用双指触碰呼出菜单的功能。
● 支持八方向移动（对角线）。
● 可以将按钮绑定到键盘按键或执行自定义脚本。
● 每个按钮支持按下前（Cold）和按下后（Hot）两种状态的图片。
● 支持按键震动反馈（仅限移动设备）。
● 可根据平台（PC、网页、手机）自动启用/禁用插件。
● 可设置按钮仅在特定场景（如地图、战斗）显示，或使用简易代码控制显示条件！

============================================================================
图片资源准备 (重要！)
============================================================================

1. 必须在项目中创建文件夹路径：img/screen_controls/
2. 将你的按键图片放在该文件夹内。
3. 命名规则：
   - 假设你有一张名为 "myButton.png" 的图片作为默认状态。
   - 你必须同时准备一张名为 "myButton_hot.png" 的图片作为按下状态。
   - 在插件参数中选择图片时，只需选择 "myButton"。

============================================================================
高级设置说明
============================================================================

● 尺寸单位 (Size):
  所有尺寸参数均为屏幕百分比。例如设置 20，代表占据屏幕宽/高 20% 的大小。
  这保证了在不同分辨率手机上的一致性。

● 条件 (Condition):
  在按钮设置中，"Allowed Condition" 允许你写一行 JavaScript 代码。
  只有当返回值为 true 时，按钮才会显示。
  例如：$gameSwitches.value(10)  // 只有当10号开关打开时显示

● 脚本调用 (Script Calls):
  如果你想在游戏中通过事件手动控制按钮的显示/隐藏：
  
  - 隐藏所有按钮:
    Eli.MobileControls.hideButtons()
    
  - 显示所有按钮:
    Eli.MobileControls.showButtons()

============================================================================

@param allowedPlatforms
@text 允许的平台
@type select[]
@option Desktop (桌面端)
 @value Desktop
@option Mobile (移动端)
 @value Mobile
@option Web Browser (网页端)
 @value Web Browser
@desc 选择在哪些平台上启用此插件。
@default []

@param disableScreenMove
@text 禁用屏幕触碰移动
@type boolean
@desc 设置为 true 将禁用点击屏幕任意位置移动角色的功能（推荐开启，防止与虚拟键冲突）。
@default true

@param disableDoubleTouchMenu
@text 禁用双指菜单
@type boolean
@desc 设置为 true 将禁用双指触碰或右键点击呼出菜单的功能。
@default true

@param hideOnMessage
@text 对话时隐藏
@type boolean
@desc 如果设为 true，当显示对话框时会自动隐藏虚拟按键。
@default false

@param fixButtonSize
@text 修正按钮尺寸
@type boolean
@desc 防止在某些设备旋转屏幕或调整窗口时按钮变形。建议开启。
@default false

@param fixButtonInterval
@text 修正刷新间隔
@type text
@desc 按钮尺寸修正的刷新间隔（帧数）。
@default 120
@parent fixButtonSize

@param controlButton
@text 控制按钮 (开关)
@type struct<controlButtonST>
@desc 一个特殊的按钮，点击它可以切换显示/隐藏屏幕上所有的其他虚拟按键。
@default {"enable":"false","img":"","width":"5","horizontalOrientation":"left","padX":"2","verticalOrientation":"top","padY":"2","vibration":"0","enableScreenMove":"true","enableDoubleTouchMenu":"true"}

@param buttons
@text 常规按钮列表
@type struct<buttonsST>[]
@desc 在这里配置代表键盘按键（如Z, X, Shift）的功能按钮。
@default []

@param dPadType
@text 移动控制类型
@type select
@option 十字键 (Single Pad)
 @value singlePad
@option 摇杆 (Joystick)
 @value joystick
@option 无 (None)
 @value none
@desc 选择控制角色移动的方式。
@default singlePad

@param singlePad
@text 十字键设置
@type struct<singlePadST>
@desc 使用单张图片处理玩家移动/方向（通常是十字键图片）。
@default {"scenes":"[]","img":"","baseWidth":"20","horizontalOrientation":"left","padX":"2","verticalOrientation":"bottom","padY":"2"}
@parent dPadType

@param joystickPad
@text 摇杆设置
@type struct<joystickST>
@desc 一个模拟摇杆，由底座和摇杆球组成。摇杆会跟随手指移动。
@default {"scenes":"[]","baseImg":"","baseWidth":"20","ballImg":"","ballWidth":"4","extraDistance":"0","horizontalOrientation":"left","padX":"2","verticalOrientation":"bottom","padY":"2"}
@parent dPadType

*/

/* ------------------------------- SINGLE PAD ------------------------------- */
{

    /*~struct~singlePadST:
    
    @param scenes
    @text 允许的场景
    @type combo[]
    @option Scene_Title @option Scene_Map @option Scene_Menu @option Scene_Item @option Scene_Skill @option Scene_Equip @option Scene_Status @option Scene_Options @option Scene_Save @option Scene_Load @option Scene_GameEnd @option Scene_Shop @option Scene_Name @option Scene_Debug @option Scene_Name @option Scene_Battle @option Scene_Gameover
    @desc设置允许显示此按钮的场景列表。
    区分大小写（地图通常是 Scene_Map）。
    @default []
    
    @param condition
    @text 显示条件 (JS)
    @type multiline_string
    @desc 除了场景外，自定义显示的各种条件。
    需返回 true/false。默认: return true
    @default return true
    
    @param img
    @text 图片文件
    @type file
    @dir img/screen_controls
    @desc 十字键使用的图片。
    @default 
    
    @param baseWidth
    @text 图片尺寸 (%)
    @type number
    @min 0
    @max 100
    @desc 设置图片尺寸占屏幕区域的百分比。
    默认是 20。
    @default 20
    @parent baseImg
    
    @param horizontalOrientation
    @text 水平对齐方式
    @type select
    @option 靠左 (left)
     @value left
    @option 靠右 (right)
     @value right
    @desc 图片的水平停靠位置。如果选Left，Padding X将从左边距开始计算。
    @default left
    
    @param padX
    @text 水平边距 (Padding X)
    @type number
    @desc 图片距离屏幕水平边缘的距离（百分比%）。
    @default 2
    @parent horizontalOrientation
    
    @param verticalOrientation
    @text 垂直对齐方式
    @type select
    @option 靠下 (bottom)
     @value bottom
    @option 靠上 (top)
     @value top
    @desc 图片的垂直停靠位置。如果选Bottom，Padding Y将从底部边距开始计算。
    @default bottom
    
    @param padY
    @text 垂直边距 (Padding Y)
    @type number
    @desc 图片距离屏幕垂直边缘的距离（百分比%）。
    @default 2
    @parent verticalOrientation
    
    */

}

/* ------------------------------ JOYSTICK PAD ------------------------------ */
{

    /*~struct~joystickST:
    
    @param scenes
    @text 允许的场景
    @type combo[]
    @option Scene_Title @option Scene_Map @option Scene_Menu @option Scene_Item @option Scene_Skill @option Scene_Equip @option Scene_Status @option Scene_Options @option Scene_Save @option Scene_Load @option Scene_GameEnd @option Scene_Shop @option Scene_Name @option Scene_Debug @option Scene_Name @option Scene_Battle @option Scene_Gameover
    @desc 设置允许显示此按钮的场景列表。
    区分大小写。
    @default []
    
    @param condition
    @text 显示条件 (JS)
    @type multiline_string
    @desc 除了场景外，自定义显示的各种条件。
    需返回 true/false。默认: return true
    @default return true
    
    @param baseImg
    @text 底座背景图片
    @type file
    @dir img/screen_controls
    @desc 摇杆底座/背景使用的图片。
    @default 
    
    @param baseWidth
    @text 底座尺寸 (%)
    @type number
    @min 0
    @max 100
    @desc 设置底座图片占屏幕区域的百分比。
    默认是 20。
    @default 20
    @parent baseImg
    
    @param ballImg
    @text 摇杆球图片
    @type file
    @dir img/screen_controls
    @desc 中间可移动的摇杆球图片。
    @default
    
    @param ballWidth
    @text 摇杆球尺寸 (%)
    @type number
    @min 0
    @max 100
    @desc 设置摇杆球占屏幕区域的百分比。
    默认是 4。
    @default 4
    @parent ballImg
    
    @param extraDistance
    @text 额外拖动范围
    @type text
    @desc 摇杆球拖出底座图片范围外多远仍视为有效。
    @default 0
    @parent ballImg
    
    @param horizontalOrientation
    @text 水平对齐方式
    @type select
    @option 靠左 (left)
     @value left
    @option 靠右 (right)
     @value right
    @desc 图片的水平停靠位置。如果选Left，Padding X将从左边距开始计算。
    @default left
    
    @param padX
    @text 水平边距 (Padding X)
    @type number
    @desc 图片距离屏幕水平边缘的距离（百分比%）。
    @default 2
    @parent horizontalOrientation
    
    @param verticalOrientation
    @text 垂直对齐方式
    @type select
    @option 靠下 (bottom)
     @value bottom
    @option 靠上 (top)
     @value top
    @desc 图片的垂直停靠位置。如果选Bottom，Padding Y将从底部边距开始计算。
    @default bottom
    
    @param padY
    @text 垂直边距 (Padding Y)
    @type number
    @desc 图片距离屏幕垂直边缘的距离（百分比%）。
    @default 2
    @parent verticalOrientation
    
    */

}

/* ----------------------------- REGULAR BUTTONS ---------------------------- */
{

    /*~struct~buttonsST:
    
    @param key
    @text 映射键盘按键
    @type select
    @option 执行脚本 (Script)
     @value script
    @option a @option b @option c @option d @option e @option f @option g @option h @option i @option j @option k @option l @option m @option n @option o @option p @option q @option r @option s @option t @option u @option v @option w @option x @option y @option z @option 0 @option 1 @option 2 @option 3 @option 4 @option 5 @option 6 @option 7 @option 8 @option 9 @option backspace @option tab @option enter @option shift @option ctrl @option alt @option pausebreak @option capslock @option esc @option space @option pageup @option pagedown @option end @option home @option leftarrow @option uparrow @option rightarrow @option downarrow @option insert @option delete @option leftwindowkey @option rightwindowkey @option selectkey @option numpad0 @option numpad1 @option numpad2 @option numpad3 @option numpad4 @option numpad5 @option numpad6 @option numpad7 @option numpad8 @option numpad9 @option multiply" @option add @option subtract @option decimalpoint @option divide @option f1 @option f2 @option f3 @option f4 @option f5 @option f6 @option f7 @option f8 @option f9 @option f10 @option f11 @option f12 @option numlock @option scrolllock @option semicolon @option equalsign @option comma @option dash @option period @option forwardslash @option graveaccent @option openbracket @option backslash @option closebracket @option singlequote
    @desc 选择此按钮对应的键盘按键。
    如果想执行自定义JS代码，请选择 "执行脚本 (Script)"。
    @default z
    
    @param scriptIn
    @text 按下运行脚本
    @type note
    @desc 当按钮被按下(Press)时运行的脚本。
    @default 
    
    @param scriptOut
    @text 松开运行脚本
    @type note
    @desc 当按钮被松开(Release)时运行的脚本。
    @default
    
    @param scenes
    @text 允许的场景
    @type combo[]
    @option Scene_Title @option Scene_Map @option Scene_Menu @option Scene_Item @option Scene_Skill @option Scene_Equip @option Scene_Status @option Scene_Options @option Scene_Save @option Scene_Load @option Scene_GameEnd @option Scene_Shop @option Scene_Name @option Scene_Debug @option Scene_Name @option Scene_Battle @option Scene_Gameover
    @desc 设置允许显示此按钮的场景列表。
    区分大小写。
    @default []
    
    @param condition
    @text 显示条件 (JS)
    @type multiline_string
    @desc 除了场景外，自定义显示的各种条件。
    需返回 true/false。默认: return true
    @default return true
    
    @param img
    @text 图片文件
    @type file
    @dir img/screen_controls
    @desc 按钮使用的图片。
    @default 
    
    @param width
    @text 尺寸 (%)
    @type number
    @min 0
    @max 100
    @desc 设置图片尺寸占屏幕区域的百分比。
    @default 5
    
    @param horizontalOrientation
    @text 水平对齐方式
    @type select
    @option 靠左 (left)
     @value left
    @option 靠右 (right)
     @value right
    @desc 图片的水平停靠位置。如果选Left，Padding X将从左边距开始计算。
    @default left
    
    @param padX
    @text 水平边距 (Padding X)
    @type number
    @desc 图片距离屏幕水平边缘的距离（百分比%）。
    @default 2
    @parent horizontalOrientation
    
    @param verticalOrientation
    @text 垂直对齐方式
    @type select
    @option 靠下 (bottom)
     @value bottom
    @option 靠上 (top)
     @value top
    @desc 图片的垂直停靠位置。如果选Bottom，Padding Y将从底部边距开始计算。
    @default bottom
    
    @param padY
    @text 垂直边距 (Padding Y)
    @type number
    @desc 图片距离屏幕垂直边缘的距离（百分比%）。
    @default 2
    @parent verticalOrientation
    
    @param vibration
    @text 震动 (毫秒)
    @type text
    @desc 按下时的手机震动时长（毫秒）。0 为无震动。
    @default 0
    
    */

}

/* ----------------------------- CONTROL BUTTON ----------------------------- */
{

    /*~struct~controlButtonST:
    
    @param enable
    @text 启用控制按钮
    @type boolean
    @desc 设为 true 启用此功能键（用于切换显示隐藏其他键）。
    @default true
    
    @param img
    @text 图片文件
    @type file
    @dir img/screen_controls
    @desc 按钮使用的图片。
    @default 
    
    @param width
    @text 尺寸 (%)
    @type number
    @min 0
    @max 100
    @desc 设置图片尺寸占屏幕区域的百分比。
    @default 5
    
    @param horizontalOrientation
    @text 水平对齐方式
    @type select
    @option 靠左 (left)
     @value left
    @option 靠右 (right)
     @value right
    @desc 停靠方向。
    @default left
    
    @param padX
    @text 水平边距 (Padding X)
    @type number
    @desc 距离边距百分比。
    @default 2
    @parent horizontalOrientation
    
    @param verticalOrientation
    @text 垂直对齐方式
    @type select
    @option 靠下 (bottom)
     @value bottom
    @option 靠上 (top)
     @value top
    @desc 停靠方向。
    @default top
    
    @param padY
    @text 垂直边距 (Padding Y)
    @type number
    @desc 距离边距百分比。
    @default 2
    @parent verticalOrientation
    
    @param vibration
    @text 震动 (毫秒)
    @type number
    @desc 按下时的震动时长。0 为无震动。
    @default 0
    
    @param enableScreenMove
    @text 隐藏时启用点触移动
    @type boolean
    @desc 设为 true，则当虚拟按键隐藏时，恢复默认的“点击屏幕移动”功能。
    @default true
    
    @param enableDoubleTouchMenu
    @text 隐藏时启用双指菜单
    @type boolean
    @desc 设为 true，则当虚拟按键隐藏时，恢复默认的“双指点击打开菜单”功能。
    @default true
    
    */

}

"use strict"

var Eli = Eli || {}
var Imported = Imported || {}
Imported.Eli_MobileControls = true

/* ========================================================================== */
/*                                   PLUGIN                                   */
/* ========================================================================== */
{

    const CONTROLS_PATH = "img/screen_controls/"

    /* ------------------------------- BUTTON BASE ------------------------------ */
    class BaseButton {

        constructor() {
            this.initMembers()
        }

        initMembers() {
            this.area = new Rectangle(0, 0, 0, 0)
            this.isOffScreen = false
            this.active = false
            this.touchId = null
            this.divs = [document.createElement("div")]
            this.imgs = [document.createElement("img")]
        }

        createArea() {
            const mainRect = this.divs[0].getBoundingClientRect()
            this.area = new Rectangle(mainRect.x, mainRect.y, mainRect.width, mainRect.height)
        }

        initialize(parameters) {
            this.setParameters(parameters)
        }

        setParameters(parameters) {
            this.parameters = parameters
        }

        getScreenUnitsByOrientation() {
            if (Plugin.isLandscape()) {
                return ["vw", "vh"]
            } else {
                return ["vh", "vw"]
            }
        }

        deactivate() {
            this.touchId = null
            this.active = false
        }

        setListeners() {
            if (Utils.isMobileDevice()) {
                this.setMobileListeners()
            } else {
                this.setMouseListeners()
            }
        }

        setMouseListeners() {
            document.addEventListener('mousemove', this.handleMove.bind(this), { passive: false })
            document.addEventListener('mouseup', this.handleUp.bind(this))
        }

        setMobileListeners() {
            document.addEventListener('touchmove', this.handleMove.bind(this), { passive: false })
            document.addEventListener('touchend', this.handleUp.bind(this))
        }

        handleDown(event) {
            event.stopPropagation()
            event.preventDefault()
            if (event.changedTouches) {
                this.touchId = event.changedTouches[0].identifier
            }
            this.active = true
            this.setHotImg()
        }

        trackChangedTouches(event) {
            let hasChangedTouches = false

            for (let i = 0; i < event.changedTouches.length; i++) {
                if (this.touchId == event.changedTouches[i].identifier) {
                    hasChangedTouches = true
                    event.clientX = event.changedTouches[i].clientX
                    event.clientY = event.changedTouches[i].clientY
                }
            }

            return hasChangedTouches
        }

        handleMove(event) {
            if (!this.active || event.changedTouches && !this.trackChangedTouches(event)) return
            this.operateHandleMove(event)
        }

        operateHandleMove(event) { }

        isAnotherTouchId(event) {
            return event.changedTouches && this.touchId !== event.changedTouches[0].identifier
        }

        handleUp(event) {
            if (this.active || !this.isAnotherTouchId(event)) {
                this.operateHandleUp(event)
            }
        }

        operateHandleUp(event) {
            this.setColdImg()
            this.deactivate()
        }

        setColdImg() {
            this.imgs[0].src = this.imgs[0].dataset.imgCold
        }

        setHotImg() {
            this.imgs[0].src = this.imgs[0].dataset.imgHot
        }

        isHidden() {
            return this.divs[0].style.visibility === "hidden"
        }

        isVisible() {
            return this.divs[0].style.visibility === "visible"
        }

        getOffsetXOffScreen() {
            const rect = this.divs[0].getBoundingClientRect()
            const orientation = this.parameters.horizontalOrientation
            const width = rect.width
            if (orientation === "left") {
                return -(width + this.divs[0].offsetLeft)
            } else {
                return width + (window.innerWidth - this.divs[0].offsetLeft)
            }
        }

        hide() {
            if (!this.isOffScreen) {
                // 原代码：const offsetX = this.getOffsetXOffScreen()
                // 原代码：this.divs[0].style.transform = `translate(${offsetX}px, 0px)`
                
                // 新代码：原地渐隐 (0.1s 约为 6帧)
                this.divs[0].style.transition = 'opacity 0.1s linear'
                this.divs[0].style.opacity = '0'
                this.divs[0].style.pointerEvents = 'none' // 隐藏时禁止点击
                
                this.isOffScreen = true
            }
        }

        show() {
            // 原代码：this.divs[0].style.transform = `translate(0px, 0px)`
            
            // 新代码：原地渐显
            this.divs[0].style.transition = 'opacity 0.1s linear'
            this.divs[0].style.opacity = '1'
            this.divs[0].style.pointerEvents = 'auto' // 恢复点击
            
            this.isOffScreen = false
        }

    }

    /* ----------------------------- REGULAR BUTTON ----------------------------- */
    class RegularButton extends BaseButton {

        constructor() {
            super()
            this.parameters = {
                horizontalOrientation: "",
                img: "",
                key: "",
                padX: 0,
                padY: 0,
                scenes: [""],
                scriptIn: () => { },
                scriptOut: () => { },
                verticalOrientation: "",
                vibration: 0,
                width: 0,
            }
        }

        initialize(parameters) {
            super.initialize(parameters)
            this.createHtmlElements()
            this.setStyleToElements()
            this.appendElements()
            this.deactivate()
            this.setListeners()
            this.setKeyboardKey()
        }

        initMembers() {
            super.initMembers()
            this.keyboardKey = ""
        }

        setKeyboardKey() {
            if (!this.isScriptInput()) {
                const keyName = this.parameters.key.toLowerCase()
                const key = Input.keyMapper[Eli.KeyCodes.keyboard[keyName]]
                this.keyboardKey = key
            }
        }

        createDiv() {
            const div = document.createElement("div")

            div.draggable = false
            div.style.visibility = "hidden"
            div.id = "buttonDiv"
            this.divs[0] = div
        }

        createImage() {
            const coldFrame = `${CONTROLS_PATH}${this.parameters.img}.png`
            const hotFrame = `${CONTROLS_PATH}${this.parameters.img}_hot.png`
            const img = document.createElement("img")

            img.id = "buttonImg"
            img.src = coldFrame
            img.draggable = false
            img.dataset.imgCold = coldFrame
            img.dataset.imgHot = hotFrame
            this.imgs[0] = img
        }

        createHtmlElements() {
            this.createDiv()
            this.createImage()
        }

        onLoad(ev) {
            const imgWidth = this.parameters.width
            const divStyle = this.divs[0].style
            const imgStyle = this.imgs[0].style
            const horPos = this.parameters.horizontalOrientation
            const verPos = this.parameters.verticalOrientation
            const [horUnit, verUnit] = this.getScreenUnitsByOrientation()

            divStyle.position = "fixed"
            divStyle.boxSizing = "border-box"
            divStyle[horPos] = `${this.parameters.padX}${horUnit}`
            divStyle[verPos] = `${this.parameters.padY}${verUnit}`

            imgStyle.maxWidth = "100%"
            imgStyle.width = `${imgWidth}${horUnit}`
            imgStyle.height = `auto`

            divStyle.width = this.imgs[0].width
            this.createArea()
        }

        createArea() {
            const mainRect = this.divs[0].getBoundingClientRect()
            this.area = new Rectangle(mainRect.x, mainRect.y, mainRect.width, mainRect.height)
        }

        setStyleToElements() {
            this.imgs[0].addEventListener("load", this.onLoad.bind(this), { once: true })
        }

        appendElements() {
            this.divs[0].append(this.imgs[0])
        }

        setMouseListeners() {
            this.divs[0].addEventListener('mousedown', this.handleDown.bind(this))
            super.setMouseListeners()
        }

        setMobileListeners() {
            this.divs[0].addEventListener('touchstart', this.handleDown.bind(this))
            super.setMobileListeners()
        }

        removeFromScene() {
            this.resetInput()
            this.setColdImg()
            this.deactivate()
            this.divs[0].style.visibility = "hidden"
        }

        addOnScene() {
            this.divs[0].style.visibility = "visible"
            this.onLoad()
        }

        handleDown(event) {
            super.handleDown(event)
            this.setInput(false)
        }

        operateHandleMove(event) {
            super.operateHandleMove(event)
            const x = event.clientX
            const y = event.clientY
            if (!this.area.contains(x, y)) {
                this.handleUp(event)
            }
        }

        operateHandleUp(event) {
            super.operateHandleUp(event)
            this.resetInput()
        }

        setInput() {
            if (navigator.vibrate) {
                navigator.vibrate(this.parameters.vibration)
            }

            if (this.isScriptInput()) {
                this.parameters.scriptIn()
            } else {
                const key = this.keyboardKey
                Input._currentState[key] = true
            }
        }

        isScriptInput() {
            return this.parameters.key === "script"
        }

        resetInput() {
            if (this.isScriptInput()) {
                this.parameters.scriptOut()
            } else {
                const key = this.keyboardKey
                Input._currentState[key] = false
            }
        }

        canAddToScene(sceneName) {
            return this.parameters.scenes.includes(sceneName) && this.parameters.enableCondition()
        }

    }

    /* ----------------------------- CONTROL BUTTON ----------------------------- */
    class ControlButton extends RegularButton {

        constructor() {
            super()
            this.parameters = {
                enable: false,
                horizontalOrientation: "",
                img: "",
                padX: 0,
                padY: 0,
                verticalOrientation: "",
                vibrate: 0,
                width: 0,
            }
        }

        initMembers() {
            super.initMembers()
            this.isHidingButtons = false
        }

        setKeyboardKey() { }

        setInput(isSilent = true) {
            if (!isSilent) {
                SoundManager.playOk();
            }
            
            if (this.isHidingButtons) {
                // 当前是“隐藏模式”，点击变成“显示”
                Plugin.showButtons() // 调用 Plugin 简化的显示方法
                this.isHidingButtons = false
            } else {
                // 当前是“显示模式”，点击变成“隐藏”
                Plugin.hideButtons() // 调用 Plugin 简化的隐藏方法
                this.isHidingButtons = true
            }
        }

        resetInput() { }

        canAddToScene(sceneName) {
            return true
        }
    }

    /* ------------------------------- SINGLE DPAD ------------------------------ */
    class DpadController extends BaseButton {

        constructor() {
            super()
            this.parameters = {
                baseWidth: 0,
                horizontalOrientation: "",
                img: "",
                padX: 0,
                padY: 0,
                scenes: [""],
                verticalOrientation: "",
            }
        }

        initialize(parameters) {
            super.initialize(parameters)
            this.createHtmlElements()
            this.setStyleToElements()
            this.appendElements()
            this.deactivate()
            this.setListeners()
        }

        initMembers() {
            super.initMembers()
            this.directionAreas = new Array(10).fill(new Rectangle(0, 0, 0, 0))
        }

        createDiv() {
            const div = document.createElement("div")
            div.id = "dpadDiv"
            div.draggable = false
            div.style.visibility = "hidden"
            this.divs[0] = div
        }

        createImage() {
            const coldFrame = `${CONTROLS_PATH}${this.parameters.img}.png`
            const hotFrame = `${CONTROLS_PATH}${this.parameters.img}_hot.png`
            const img = document.createElement("img")
            img.id = "dpadImg"
            img.src = coldFrame
            img.draggable = false
            img.dataset.imgCold = coldFrame
            img.dataset.imgHot = hotFrame
            this.imgs[0] = img
        }

        createHtmlElements() {
            this.createDiv()
            this.createImage()
        }

        onLoad(ev) {
            const imgWidth = this.parameters.baseWidth
            const divStyle = this.divs[0].style
            const imgStyle = this.imgs[0].style
            const horPos = this.parameters.horizontalOrientation
            const verPos = this.parameters.verticalOrientation
            const [horUnit, verUnit] = this.getScreenUnitsByOrientation()

            divStyle.position = "absolute"
            divStyle.boxSizing = "border-box"
            divStyle[horPos] = `${this.parameters.padX}${horUnit}`
            divStyle[verPos] = `${this.parameters.padY}${verUnit}`

            imgStyle.maxWidth = "100%"
            imgStyle.width = `${imgWidth}${horUnit}`
            imgStyle.height = `auto`

            divStyle.width = this.imgs[0].width
            this.createArea()
            this.createDirectionArea()
        }

        createDirectionArea() {
            const mainRect = this.divs[0].getBoundingClientRect()
            const width = mainRect.width / 3
            const height = mainRect.height / 3
            const rect0 = new Rectangle(0, 0, 0, 0)

            const upLeft = new Rectangle(mainRect.x, mainRect.y, width, height)
            const up = new Rectangle(upLeft.right, mainRect.y, width, height)
            const upRight = new Rectangle(up.right, mainRect.y, width, height)

            const left = new Rectangle(mainRect.x, upLeft.bottom, width, height)
            const center = new Rectangle(left.right, upLeft.bottom, width, height)
            const right = new Rectangle(center.right, upLeft.bottom, width, height)

            const downLeft = new Rectangle(mainRect.x, left.bottom, width, height)
            const down = new Rectangle(downLeft.right, left.bottom, width, height)
            const downRight = new Rectangle(down.right, left.bottom, width, height)

            this.directionAreas = [
                rect0, downLeft, down, downRight, left, center, right, upLeft, up, upRight
            ]
        }

        setStyleToElements() {
            this.imgs[0].addEventListener("load", this.onLoad.bind(this), { once: true })
        }

        appendElements() {
            this.divs[0].append(this.imgs[0])
        }

        setMouseListeners() {
            this.divs[0].addEventListener('mousedown', this.handleDown.bind(this))
            super.setMouseListeners()
        }

        setMobileListeners() {
            this.divs[0].addEventListener('touchstart', this.handleDown.bind(this))
            super.setMobileListeners()
        }

        removeFromScene() {
            this.setColdImg()
            this.resetInput()
            this.deactivate()
            this.divs[0].style.visibility = "hidden"
        }

        addOnScene() {
            this.divs[0].style.visibility = "visible"
            this.onLoad()
        }

        getClientCoordinates(event) {
            if (event.changedTouches) {
                return { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY }
            } else {
                return { x: event.clientX, y: event.clientY }
            }
        }

        getTouchId(event) {
            return event.changedTouches[0].identifier
        }

        getDirection(coordinates) {
            const { x, y } = coordinates
            return this.directionAreas.findIndex(rect => rect.contains(x, y))
        }

        handleDown(event) {
            super.handleDown(event)
            const coordinates = this.getClientCoordinates(event)
            const direction = this.getDirection(coordinates)
            this.setInput(direction)
        }

        operateHandleMove(event) {
            super.operateHandleMove(event)
            const x = event.clientX
            const y = event.clientY
            const diretion = this.getDirection({ x, y })
            this.setInput(diretion)
        }

        operateHandleUp(event) {
            super.operateHandleUp(event)
            this.resetInput()
        }

        setInput(direction) {
            const isRight = [6, 3, 9].includes(direction)
            const isDown = [2, 1, 3].includes(direction)
            const isLeft = [4, 7, 1].includes(direction)
            const isUp = [8, 7, 9].includes(direction)
            const isDownRight = direction === 3
            const isDownLeft = direction === 1
            const isUpLeft = direction === 7
            const isUpRight = direction === 9

            Input._currentState['right'] = isRight || isDownRight || isUpRight
            Input._currentState['down'] = isDown || isDownRight || isDownLeft
            Input._currentState['left'] = isLeft || isDownLeft || isUpLeft
            Input._currentState['up'] = isUp || isUpLeft || isUpRight
        }

        resetInput() {
            Input._currentState['up'] = false
            Input._currentState['down'] = false
            Input._currentState['left'] = false
            Input._currentState['right'] = false
        }

        canAddToScene(sceneName) {
            return this.parameters.scenes.includes(sceneName) && this.parameters.enableCondition()
        }

    }

    /* -------------------------------- JOYSTICK -------------------------------- */
    class JoystickController extends BaseButton {

        constructor() {
            super()
            this.parameters = {
                ballImg: "",
                ballWidth: 0,
                baseImg: "",
                baseWidth: 0,
                extraDistance: 0,
                horizontalOrientation: "",
                padX: 0,
                padY: 0,
                scenes: [""],
                verticalOrientation: "",
            }
        }

        initialize(parameters) {
            super.initialize(parameters)
            this.createHtmlElements()
            this.appendElements()
            this.setStyleToElements()
            this.deactivate()
            this.setListeners()
        }

        initMembers() {
            super.initMembers()
            this.divs[1] = document.createElement("div")
            this.imgs[1] = document.createElement("img")
            this.maxDistance = 0
            this.dragStart = null
        }

        createBaseDiv() {
            const div = document.createElement("div")
            div.id = "joystickBaseDiv"
            div.draggable = false
            div.style.visibility = "hidden"
            this.divs[0] = div
        }

        createBaseImg() {
            const coldFrame = `${CONTROLS_PATH}${this.parameters.baseImg}.png`
            const hotFrame = `${CONTROLS_PATH}${this.parameters.baseImg}_hot.png`
            const img = document.createElement("img")
            img.id = "joystickBaseImg"
            img.src = coldFrame
            img.draggable = false
            img.dataset.imgCold = coldFrame
            img.dataset.imgHot = hotFrame
            this.imgs[0] = img
        }

        createStickDiv() {
            const div = document.createElement("div")
            div.id = "joystickBallDiv"
            div.draggable = false
            this.divs[1] = div
            this.divs[1].style.visibility = "hidden"
        }

        createStickImg() {
            const coldFrame = `${CONTROLS_PATH}${this.parameters.ballImg}.png`
            const hotFrame = `${CONTROLS_PATH}${this.parameters.ballImg}_hot.png`
            const img = document.createElement("img")
            img.id = "joystickBallImg"
            img.src = coldFrame
            img.draggable = false
            img.dataset.imgCold = coldFrame
            img.dataset.imgHot = hotFrame
            this.imgs[1] = img
        }

        createHtmlElements() {
            this.createBaseDiv()
            this.createBaseImg()
            this.createStickDiv()
            this.createStickImg()
        }

        onLoad(ev) {
            const imgWidth = this.parameters.baseWidth
            const divStyle = this.divs[0].style
            const imgStyle = this.imgs[0].style
            const horPos = this.parameters.horizontalOrientation
            const verPos = this.parameters.verticalOrientation
            const [horUnit, verUnit] = this.getScreenUnitsByOrientation()

            divStyle.position = "fixed"
            divStyle.boxSizing = "border-box"
            divStyle[horPos] = `${this.parameters.padX}${horUnit}`
            divStyle[verPos] = `${this.parameters.padY}${verUnit}`
            imgStyle.maxWidth = "100%"
            imgStyle.width = `${imgWidth}${horUnit}`
            imgStyle.height = `auto`

            divStyle.width = this.imgs[0].width
            this.imgs[1].addEventListener("load", this.onStickImgLoad.bind(this), { once: true })
        }

        onStickImgLoad(ev) {
            const imgWidth = this.parameters.ballWidth
            const divStyle = this.divs[1].style
            const imgStyle = this.imgs[1].style
            const xPos = () => this.imgs[0].width / 2 - this.imgs[1].width / 2
            const yPos = () => this.imgs[0].height / 2 - this.imgs[1].height / 2
            const [horUnit, verUnit] = this.getScreenUnitsByOrientation()

            divStyle.position = "absolute"
            imgStyle.maxWidth = "100%"
            imgStyle.width = `${imgWidth}${horUnit}`
            imgStyle.height = `auto`
            divStyle.width = this.imgs[1].width
            divStyle.top = `${yPos()}px`
            divStyle.left = `${xPos()}px`
            this.maxDistance = Math.abs(this.divs[0].clientWidth / 2 - this.divs[1].clientWidth / 2) + this.parameters.extraDistance
            this.createArea()
        }

        setStyleToElements() {
            this.imgs[0].addEventListener("load", this.onLoad.bind(this), { once: true })
        }

        appendElements() {
            this.divs[0].append(this.imgs[0], this.divs[1])
            this.divs[1].append(this.imgs[1])
        }

        deactivate() {
            super.deactivate()
            this.dragStart = null
        }

        setMouseListeners() {
            this.divs[1].addEventListener('mousedown', this.handleDown.bind(this))
            super.setMouseListeners()
        }

        setMobileListeners() {
            this.divs[1].addEventListener('touchstart', this.handleDown.bind(this))
            super.setMobileListeners()
        }

        handleDown(event) {
            this.divs[1].style.transition = '0s'
            super.handleDown(event)
            this.setDragStart(event)
        }

        operateHandleMove(event) {
            super.operateHandleMove(event)
            const [xDiff, yDiff] = this.getCoordinateDifference(event)
            const [angle, distance] = this.getAngleAndDistance(xDiff, yDiff)

            this.moveStick(angle, distance)

            if (this.isOnDeadZone(distance)) {
                this.resetMoveInput()
            } else {
                this.setInput(angle)
            }
        }

        operateHandleUp(event) {
            super.operateHandleUp(event)
            this.resetStickPosition()
            this.resetMoveInput()
        }

        isHidden() {
            return super.isHidden() &&
                this.divs[1].style.visibility === "hidden"
        }

        isVisible() {
            return super.isVisible() &&
                this.divs[1].style.visibility === "visible"
        }

        removeFromScene() {
            this.divs[1].style.transition = '0s'
            this.divs[1].style.visibility = "hidden"
            this.divs[0].style.visibility = "hidden"
        }

        addOnScene() {
            this.divs[1].style.visibility = "visible"
            this.divs[0].style.visibility = "visible"
            this.onLoad()
            this.onStickImgLoad()
        }

        setDragStart(event) {
            if (event.changedTouches) {
                this.dragStart = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY }
            } else {
                this.dragStart = { x: event.clientX, y: event.clientY }
            }
        }

        setColdImg() {
            super.setColdImg()
            this.imgs[1].src = this.imgs[1].dataset.imgCold
        }

        setHotImg() {
            super.setHotImg()
            this.imgs[1].src = this.imgs[1].dataset.imgHot
        }

        getCoordinateDifference(event) {
            const xDiff = event.clientX - this.dragStart.x
            const yDiff = event.clientY - this.dragStart.y

            return [xDiff, yDiff]
        }

        isOnDeadZone(distance) {
            const deadZone = this.imgs[1].width / 2
            return distance < deadZone
        }

        moveStick(angle, distance) {
            const [xPosition, yPosition] = this.getStickOffset(angle, distance)
            this.divs[1].style.transform = `translate(${xPosition}px, ${yPosition}px)`
        }

        getStickOffset(angle, distance) {
            const xPosition = distance * Math.cos(angle)
            const yPosition = distance * Math.sin(angle)

            return [xPosition, yPosition]
        }

        getAngleAndDistance(xDiff, yDiff) {
            const angle = Math.atan2(yDiff, xDiff)
            const distance = Math.min(this.maxDistance, Math.hypot(xDiff, yDiff))

            return [angle, distance]
        }

        resetStickPosition() {
            this.divs[1].style.transition = '.2s'
            this.divs[1].style.transform = `translate(0px, 0px)`
        }

        isBetween(number, min, max) {
            return number > min && number < max
        }

        isBetweenOrEqual(number, min, max) {
            return number >= min && number <= max
        }

        setInput(angle) {
            angle *= (180 / Math.PI)

            const isRight = this.isBetweenOrEqual(angle, -45, 45)
            const isDown = this.isBetweenOrEqual(angle, 45, 135)
            const isLeft = this.isBetweenOrEqual(angle, 135, 180) || this.isBetweenOrEqual(angle, -180, -135)
            const isUp = this.isBetweenOrEqual(angle, -135, -45)
            const isDownRight = this.isBetweenOrEqual(angle, 22.5, 67.5)
            const isDownLeft = this.isBetweenOrEqual(angle, 112.5, 157.5)
            const isUpLeft = this.isBetweenOrEqual(angle, -157.5, -112.5)
            const isUpRight = this.isBetweenOrEqual(angle, -67.5, -22.5)

            Input._currentState['right'] = isRight || isDownRight || isUpRight
            Input._currentState['down'] = isDown || isDownRight || isDownLeft
            Input._currentState['left'] = isLeft || isDownLeft || isUpLeft
            Input._currentState['up'] = isUp || isUpLeft || isUpRight
        }

        resetMoveInput() {
            Input._currentState['up'] = false
            Input._currentState['down'] = false
            Input._currentState['left'] = false
            Input._currentState['right'] = false
        }

        canAddToScene(sceneName) {
            return this.parameters.scenes.includes(sceneName) && this.parameters.enableCondition()
        }

    }

    /* ------------------------------ PLUGIN OBJECT ----------------------------- */
    class Parameters {
        constructor(parameters) {
            this.allowedPlatforms = JSON.parse(parameters.allowedPlatforms)
            this.disableDoubleTouchMenu = parameters.disableDoubleTouchMenu === "true"
            this.disableScreenMove = parameters.disableScreenMove === "true"
            this.hideOnMessage = parameters.hideOnMessage === "true"
            this.fixButtonSize = (parameters.fixButtonSize || "false") === "true"
            this.fixButtonInterval = Math.max(Number(parameters.fixButtonInterval || "120"), 1)
            this.dPadType = parameters.dPadType
            this.controlButton = this.parseControlButtonParameters(parameters.controlButton)
            this.joystickPad = this.parseJoystickParameters(parameters.joystickPad)
            this.singlePad = this.parseSinglePadParameters(parameters.singlePad)
            this.buttons = this.parseRegularButtonParameters(parameters.buttons)
        }

        parseControlButtonParameters(rawParam) {
            const param = JSON.parse(rawParam)

            return {
                enable: param.enable === "true",
                horizontalOrientation: param.horizontalOrientation,
                img: param.img,
                padX: Number(param.padX),
                padY: Number(param.padY),
                verticalOrientation: param.verticalOrientation,
                vibration: Number(param.vibration),
                width: Number(param.width),
                enableScreenMove: param.enableScreenMove === "true",
                enableDoubleTouchMenu: param.enableDoubleTouchMenu === "true",
            }
        }

        parseSinglePadParameters(rawParam) {
            const param = JSON.parse(rawParam)

            return {
                baseWidth: Number(param.baseWidth),
                horizontalOrientation: param.horizontalOrientation,
                img: param.img,
                padX: Number(param.padX),
                padY: Number(param.padY),
                scenes: JSON.parse(param.scenes),
                verticalOrientation: param.verticalOrientation,
                enableCondition: param.condition ? new Function(`${param.condition}`) : new Function("return true")
            }
        }

        parseJoystickParameters(rawParam) {
            const param = JSON.parse(rawParam)

            return {
                ballImg: param.ballImg,
                ballWidth: Number(param.ballWidth),
                baseImg: param.baseImg,
                baseWidth: Number(param.baseWidth),
                extraDistance: Number(param.extraDistance),
                horizontalOrientation: param.horizontalOrientation,
                padX: Number(param.padX),
                padY: Number(param.padY),
                scenes: JSON.parse(param.scenes),
                verticalOrientation: param.verticalOrientation,
                enableCondition: param.condition ? new Function(`${param.condition}`) : new Function("return true")
            }
        }

        parseRegularButtonParameters(rawParam) {
            const buttonParams = JSON.parse(rawParam)
            const buttons = []

            for (const param of buttonParams) {
                const button = JSON.parse(param)
                buttons.push({
                    horizontalOrientation: button.horizontalOrientation,
                    img: button.img,
                    key: button.key,
                    padX: Number(button.padX),
                    padY: Number(button.padY),
                    scenes: JSON.parse(button.scenes),
                    scriptIn: button.scriptIn.length > 4 ? new Function(JSON.parse(button.scriptIn)) : new Function(),
                    scriptOut: button.scriptOut.length > 4 ? new Function(JSON.parse(button.scriptOut)) : new Function(),
                    verticalOrientation: button.verticalOrientation,
                    vibration: Number(button.vibration),
                    width: Number(button.width),
                    enableCondition: button.condition ? new Function(`${button.condition}`) : new Function("return true")
                })
            }

            return buttons
        }
    }

    Eli.MobileControls = {

        url: "https://hakuenstudio.itch.io/eli-mobile-controls-for-rpg-maker",
        alias: {},
        Parameters: Parameters,
        BaseButton: BaseButton,
        RegularButton: RegularButton,
        ControlButton: ControlButton,
        JoystickController: JoystickController,
        DpadController: DpadController,
        parameters: new Parameters(PluginManager.parameters("EliMZ_MobileControls")),
        elements: [],
        divContainer: document.createElement('div'),
        joystick: new JoystickController(),
        dpad: new DpadController(),
        controlButton: new ControlButton(),
        buttonList: [],
        timeForRefresh: 0,
        isHidingButtons: false,
        
        _lastMessageBusy: false,
        _lastChoiceActive: false,
        _wasAutoHidden: false, // 记录是否是由剧情导致的自动隐藏
        _tempShowForChoice: false,

        initialize() { },

        initPluginCommands() { },

        createHtmlElements() {
            this.createDiv()
            this.createDpad()

            for (const parameters of this.param().buttons) {
                this.createRegularButtons(parameters)
            }

            if (this.param().controlButton.enable) {
                this.createControlButtons()
            }

            this.disableContextMenu()
        },

        createDiv() {
            const div = document.createElement('div')
            div.id = 'ScreenButton'
            div.style.position = "absolute"
            div.style.overflow = "hidden"
            div.style.zIndex = "11"
            div.style.top = 0 + 'px'
            div.style.left = 0 + 'px'
            div.style.right = 0 + 'px'
            div.style.bottom = 0 + 'px'
            div.style.margin = "auto"
            document.body.append(div)
            this.divContainer = div
        },

        createDpad() {
            if (this.param().dPadType === "singlePad") {
                this.createSingleDpad()

            } else if (this.param().dPadType === "joystick") {
                this.createJoystick()
            }
        },

        createSingleDpad() {
            this.dpad.initialize(this.param().singlePad)
            this.addToDiv(this.dpad.divs[0])
            this.elements.push(this.dpad.divs[0])
            this.buttonList.push(this.dpad)
        },

        createJoystick() {
            this.joystick.initialize(this.param().joystickPad)
            this.buttonList.push(this.joystick)
            this.elements.push(this.joystick.divs[0])
            this.addToDiv(this.joystick.divs[0])
        },

        createRegularButtons(parameters) {
            const button = new RegularButton()
            button.initialize(parameters)

            this.addToDiv(button.divs[0])
            this.elements.push(button.divs[0])
            this.buttonList.push(button)
        },

        createControlButtons() {
            this.controlButton.initialize(this.param().controlButton)
            this.addToDiv(this.controlButton.divs[0])
        },

        disableContextMenu() {
            const oncontextmenu = (ev) => {
                ev.preventDefault()
                return false
            }
            this.divContainer.addEventListener("contextmenu", oncontextmenu)
            this.elements.forEach(element => {
                element.addEventListener("contextmenu", oncontextmenu)
            })
        },

        isMenuDisabledByDoubleTouch() {
            return this.param().disableDoubleTouchMenu && !this.controlButton.isHidingButtons
        },

        isControlButtonDisablingMenuByDoubleTouch() {
            return (this.controlButton.isHidingButtons && !this.param().controlButton.enableDoubleTouchMenu) ||
                this.controlButton.area.contains(TouchInput._x, TouchInput._y)
        },

        isMovementDisabledByScreenTouch() {
            return this.param().disableScreenMove && !this.controlButton.isHidingButtons
        },

        isControlButtonDisablingMovementByScreenTouch() {
            return (this.controlButton.isHidingButtons && !this.param().controlButton.enableScreenMove) ||
                this.controlButton.area.contains(TouchInput._x, TouchInput._y)
        },

        getDiv() {
            return this.divContainer
        },

        addToDiv(element) {
            this.getDiv().append(element)
        },

        removeButtonsFromScene() {
            const scene = SceneManager._scene.constructor.name

            for (const button of this.buttonList) {

                if (button.canAddToScene(scene)) {
                    button.removeFromScene()
                }
            }
        },

        addButtonsOnScene() {
            const scene = SceneManager._scene.constructor.name

            for (const button of this.buttonList) {

                if (button.canAddToScene(scene)) {
                    button.addOnScene()
                }
            }
        },

        canRefreshButtonsForScene() {
            return !this.controlButton.isHidingButtons &&
                SceneManager._scene
        },

        refreshButtonsForScene() {
            const scene = SceneManager._scene.constructor.name

            if (this.param().controlButton.enable) {
                this.controlButton.divs[0].style.visibility = "visible"
            }

            for (const button of this.buttonList) {

                if (button.canAddToScene(scene)) {
                    button.addOnScene()
                } else {
                    button.removeFromScene()
                }
            }
            this.timeForRefresh = 0
        },

        refreshKeyboardKeys() {
            for (const button of Plugin.buttonList) {
                if (button.setKeyboardKey && !button.keyboardKey) {
                    button.setKeyboardKey()
                }
            }
        },

        hideButtons() {
            const scene = SceneManager._scene.constructor.name
            for (const button of this.buttonList) {
                // 绝对不隐藏控制键 (Control Button)
                if (button instanceof ControlButton) continue;
                if (button.canAddToScene(scene)) {
                    button.hide();
                }
            }
        },

        showButtons() {
            const scene = SceneManager._scene.constructor.name
            for (const button of this.buttonList) {
                // 控制键跳过
                if (button instanceof ControlButton) continue;
                if (button.canAddToScene(scene)) {
                    button.show();
                }
            }
        },

        getControlButton() {
            return this.controlButton
        },

        isLandscape() {
            if (typeof screen.orientation === "undefined") {
                return window.innerHeight < window.innerWidth //detect landscape old style
            } else {
                return screen.orientation.type.includes("landscape")
            }
        },

        anyButtonAreaContains(x, y) {
            const allAreas = this.buttonList.map(item => item.area)

            return allAreas.some(item => item.contains(x, y))
        },

        isMovingWithButtons() {
            return this.joystick.active || this.dpad.active
        },

        param() {
            return this.parameters
        },

        isAllowedOnDesktop() {
            return Utils.isNwjs() && this.parameters.allowedPlatforms.includes("Desktop")
        },

        isAllowedOnMobile() {
            return Utils.isMobileDevice() && this.parameters.allowedPlatforms.includes("Mobile")
        },

        isAllowedOnWebBrowser() {
            return !Utils.isNwjs() && !Utils.isMobileDevice() && this.parameters.allowedPlatforms.includes("Web Browser")
        },

        isMobileControlsAllowed() {
            return Utils.isOptionValid("test") || this.isAllowedOnDesktop() || this.isAllowedOnMobile() || this.isAllowedOnWebBrowser()
        }

    }

    const Plugin = Eli.MobileControls
    const Alias = Eli.MobileControls.alias

    Plugin.initialize()

    if (Plugin.isMobileControlsAllowed()) {

        /* -------------------------------- GRAPHICS -------------------------------- */
        {

            Alias.Graphics_switchStretchMode = Graphics._switchStretchMode
            Graphics._switchStretchMode = function () {
                Alias.Graphics_switchStretchMode.call(this)
                if (Plugin.canRefreshButtonsForScene()) {
                    setTimeout(Plugin.refreshButtonsForScene.bind(Plugin), 50)
                }
            }

            Alias.Graphics_switchFullScreen = Graphics._switchFullScreen
            Graphics._switchFullScreen = function () {
                Alias.Graphics_switchFullScreen.call(this)
                if (Plugin.canRefreshButtonsForScene()) {
                    setTimeout(Plugin.refreshButtonsForScene.bind(Plugin), 50)
                }
            }

            Alias.Graphics_createErrorPrinter = Graphics._createErrorPrinter
            Graphics._createErrorPrinter = function () {
                Alias.Graphics_createErrorPrinter.call(this)
                this._errorPrinter.style.pointerEvents = "none"
            }

            Alias.Graphics_updateErrorPrinter = Graphics._updateErrorPrinter
            Graphics._updateErrorPrinter = function () {
                Alias.Graphics_updateErrorPrinter.call(this)
                this._errorPrinter.style.pointerEvents = "none"
            }

        }

        /* ------------------------------ DATA MANAGER ------------------------------ */
        {

            Alias.DataManager_createGameObjects = DataManager.createGameObjects
            DataManager.createGameObjects = function () {
                Alias.DataManager_createGameObjects.call(this)
                Plugin.refreshKeyboardKeys()
            }

        }

        /* -------------------------------- GAME TEMP ------------------------------- */
        {

            Alias.Game_Temp_setDestination = Game_Temp.prototype.setDestination
            Game_Temp.prototype.setDestination = function (x, y) {
                if (Plugin.isMovingWithButtons()) {
                    x = null
                    y = null
                } else if (Plugin.isControlButtonDisablingMovementByScreenTouch()) {
                    x = null
                    y = null
                } else if (Plugin.isMovementDisabledByScreenTouch()) {
                    x = null
                    y = null
                } else if (Plugin.anyButtonAreaContains(TouchInput._x, TouchInput._y)) {
                    x = null
                    y = null
                }

                Alias.Game_Temp_setDestination.call(this, x, y)
            }

        }

        /* ------------------------------- SCENE BOOT ------------------------------- */
        {

            Alias.Scene_Boot_create = Scene_Boot.prototype.create
            Scene_Boot.prototype.create = function () {
                Alias.Scene_Boot_create.call(this)
                Plugin.createHtmlElements()
            }

        }

        /* ------------------------------- SCENE BASE ------------------------------- */
        {

            Alias.Scene_Base_start = Scene_Base.prototype.start
            Scene_Base.prototype.start = function () {
                Alias.Scene_Base_start.call(this)
                if (Plugin.canRefreshButtonsForScene()) {
                    Plugin.refreshButtonsForScene()
                }
            }

            if (Plugin.param().fixButtonSize && !Utils.isNwjs()) {

                Alias.Scene_Base_update = Scene_Base.prototype.update
                Scene_Base.prototype.update = function () {
                    Alias.Scene_Base_update.call(this)
                    this.keepRefreshingMobileButtonsForScene()
                }

                Scene_Base.prototype.keepRefreshingMobileButtonsForScene = function () {
                    Plugin.timeForRefresh++

                    if (Plugin.canRefreshButtonsForScene() && Plugin.timeForRefresh >= Plugin.param().fixButtonInterval) {
                        Plugin.refreshButtonsForScene()
                        Plugin.timeForRefresh = 0
                    }
                }
            }

        }

        /* --------------------------- WINDOW CHOICE LIST --------------------------- */
        {
            // 1. 选项窗口出现/激活时 -> 强制显示按钮
            Alias.Window_ChoiceList_start = Window_ChoiceList.prototype.start;
            Window_ChoiceList.prototype.start = function() {
                Alias.Window_ChoiceList_start.call(this);
                
                if (Plugin.param().hideOnMessage) {
                    const controlBtn = Plugin.getControlButton();
                    // 如果按钮是隐藏的，赶紧显示出来方便玩家选
                    if (controlBtn.isHidingButtons) {
                        controlBtn.setInput();
                        // 标记：这是因为选选项才临时显示的，并不是玩家手动开的
                        // 这样等会儿选完了我们可以根据这个标记决定要不要藏回去
                        Plugin._tempShowForChoice = true;
                    }
                }
            };
            // 2. 选项被点击确认后 -> 检查是否需要隐藏
            Alias.Window_ChoiceList_callOkHandler = Window_ChoiceList.prototype.callOkHandler;
            Window_ChoiceList.prototype.callOkHandler = function() {
                Alias.Window_ChoiceList_callOkHandler.call(this);
                Plugin.checkHideAfterChoice();
            };
            // 3. 选项被取消后 -> 检查是否需要隐藏
            Alias.Window_ChoiceList_callCancelHandler = Window_ChoiceList.prototype.callCancelHandler;
            Window_ChoiceList.prototype.callCancelHandler = function() {
                Alias.Window_ChoiceList_callCancelHandler.call(this);
                Plugin.checkHideAfterChoice();
            };
            // 辅助函数：选项结束后的判断逻辑
            Plugin.checkHideAfterChoice = function() {
                if (!this.param().hideOnMessage) return;
                const controlBtn = this.getControlButton();
                // 如果刚才是因为选选项才临时显示的
                if (this._tempShowForChoice) {
                    // 检查现在是不是还在跑剧情（通常选项选完肯定还在跑后续剧情/公共事件）
                    if ($gameMap.isEventRunning() || $gameMessage.isBusy()) {
                         // 如果还是显示状态，赶紧藏回去
                         if (!controlBtn.isHidingButtons) {
                             controlBtn.setInput();
                         }
                    }
                    // 重置临时标记
                    this._tempShowForChoice = false;
                }
            };
        }

        /* -------------------------------- SCENE MAP ------------------------------- */
        {
            Alias.Scene_Map_isMenuCalled = Scene_Map.prototype.isMenuCalled
            Scene_Map.prototype.isMenuCalled = function () {
                if (this.isMenuDisabledByMobileControls()) {
                    return false
                }
                return Alias.Scene_Map_isMenuCalled.call(this)
            }
            // 修改重点：在这里区分输入源，只拦截触摸输入，放行鼠标和键盘
            Scene_Map.prototype.isMenuDisabledByMobileControls = function () {
                // 1. 获取插件参数：是否应该禁用菜单
                // (注意：这里我们暂时不看 TouchInput.isCancelled，因为一旦调用它就会消耗状态)
                const settingDisabled = Plugin.isMenuDisabledByDoubleTouch() || Plugin.isControlButtonDisablingMenuByDoubleTouch();
                if (!settingDisabled) {
                    return false;
                }
                // 3. 核心修改：检查最近一次输入的设备类型
                // RPG Maker MZ 的 TouchInput 会记录最后触发的事件日期
                // 如果是鼠标操作，Utils.isMobileDevice() 通常会帮我们区分，但在 PC 模拟触屏时可能不准。
                // 最准确的方法是检查 TouchInput._date (时间戳) 和 TouchInput._pressedTime
                
                // 但更简单的逻辑是：
                // 如果是“鼠标右键”，RPG Maker 核心逻辑里 TouchInput.isCancelled() 是 true。
                // 如果是“键盘 X”，Input.isTriggered('menu') 是 true，但这不走 TouchInput。
                
                // 我们直接判断：如果当前操作是“鼠标右键”，则强制放行。
                // _onRightButtonDown 是 RMMZ 底层监听器，但不容易直接访问。
                
                // 【终极方案】 利用 TouchInput 的各种状态判定
                if (TouchInput.isCancelled()) {
                    // 只有在确定是“触摸屏”操作时，才拦截。
                    // PC端鼠标右键的时候，TouchInput._screenPressed 通常是 false (因为右键不视为点击屏幕)
                    // 而双指点击的时候，TouchInput._screenPressed 是 true
                    
                    // 如果是用鼠标右键，通常不会造成 _screenPressed 为真
                    // 或者更直接的：检查这是否是鼠标事件
                    if (!Utils.isMobileDevice()) {
                        // 如果是在电脑上（非移动设备），我们假设右键就是右键，不拦截
                        // 除非你是在电脑上用模拟器且想模拟双指
                        return false; 
                    }
                    
                    // 如果是移动设备，确实是 TouchInput.isCancelled()，那肯定就是双指了 -> 拦截
                    return true;
                }
                
                return false;
            }
            // =========================================================================
            // 修改重点：状态监听器，只在状态改变瞬间模拟“点击开关”
            // =========================================================================
            Alias.Scene_Map_update = Scene_Map.prototype.update;
            Scene_Map.prototype.update = function() {
                Alias.Scene_Map_update.call(this);
                this.updateMobileControlsState();
            };
            Scene_Map.prototype.updateMobileControlsState = function() {
                if (!Plugin.param().hideOnMessage) return;
                const controlBtn = Plugin.getControlButton();
                // 只要事件在跑 或者 文本框在忙，就算“忙碌”
                // 注意：这里我们故意不管 isChoice，交给 Window_ChoiceList 优先处理
                const isBusy = $gameMap.isEventRunning() || $gameMessage.isBusy();
                // 1. 剧情开始：如果以前不忙，现在忙了 -> 隐藏
                if (isBusy && !Plugin._lastMessageBusy) {
                    // 记录一下：进剧情前按钮是开着的，所以我才帮它关
                    if (!controlBtn.isHidingButtons) {
                        controlBtn.setInput(); // 模拟点击隐藏
                        Plugin._wasAutoHidden = true;
                    } else {
                        Plugin._wasAutoHidden = false; // 本来就是关的，我不背锅
                    }
                }
                // 2. 剧情结束：如果以前忙，现在不忙了 -> 恢复
                if (!isBusy && Plugin._lastMessageBusy) {
                    // 如果之前是我帮它关的，且现在还是关的 -> 恢复显示
                    if (Plugin._wasAutoHidden && controlBtn.isHidingButtons) {
                        controlBtn.setInput(); // 模拟点击显示
                    }
                    Plugin._wasAutoHidden = false;
                }
                Plugin._lastMessageBusy = isBusy;
            };
        }

        /* ----------------------------- WINDOW MESSAGE ----------------------------- */
        {
            // 我们已经把逻辑移到了 Scene_Map Update 中，这里必须禁用
            // 否则会造成冲突（例如对话刚开始想隐藏，这里却判定为结束要显示）
            
            Alias.Window_Message_onFirstMessage = Window_Message.prototype.onFirstMessage
            Window_Message.prototype.onFirstMessage = function () {
                Alias.Window_Message_onFirstMessage.call(this)
                // Plugin.hideButtons() // 禁用此行
            }
            Alias.Window_Message_onLastMessage = Window_Message.prototype.onLastMessage
            Window_Message.prototype.onLastMessage = function () {
                Alias.Window_Message_onLastMessage.call(this)
                // Plugin.showButtons() // 禁用此行
            }
        }
    }
}