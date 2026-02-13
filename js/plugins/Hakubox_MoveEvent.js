/*:
 * @target MZ
 * @plugindesc [v1.0] 事件坐标偏移与优先级控制 (支持备注与插件指令)
 * @author hakubox
 *
 * @help
 * Hakubox_MoveEvent.js
 *
 * 这个插件允许你通过备注标签或插件指令来偏移事件的显示坐标。
 * 偏移只是视觉上的，事件的实际判定格子不会改变。
 *
 * ============================================================================
 * 1. 备注标签 (Note Tags)
 * ============================================================================
 * 在事件页面的备注栏中输入以下格式，可以在事件初始化时固定偏移：
 *
 *   <move:X,Y>
 *
 * 示例：
 *   <move:10,>      // 向右偏移 10 像素，Y轴不变
 *   <move:,10>      // 向下偏移 10 像素，X轴不变
 *   <move:-10,-20>  // 向左 10 像素，向上 20 像素
 *
 * 注意：备注标签会在事件页面激活时立即生效（无动画）。
 *
 * ============================================================================
 * 2. 插件指令 (Plugin Commands)
 * ============================================================================
 *
 * 【设置事件偏移】
 *  可以让事件在指定时间内平滑移动到新的偏移位置，或者进行相对移动。
 *  - 模式：可以是“增加(相对)”或“设置(绝对)”。
 *  - 持续时间：移动花费的帧数（0为瞬间完成）。
 *
 * 【设置事件优先级】
 *  修改事件的层级（在人物下方、与人物相同、在人物上方）。
 *
 * ============================================================================
 * 关于存档
 * ============================================================================
 * 所有的偏移状态和优先级修改都会自动保存在存档文件中。
 * 读档后会保持之前的状态。
 *
 * @command setOffset
 * @text 设置事件偏移
 * @desc 移动事件的显示坐标（视觉偏移）。
 *
 * @arg eventId
 * @text 事件ID
 * @desc 要操作的事件ID。0代表本事件。
 * @type number
 * @min 0
 * @default 0
 *
 * @arg mode
 * @text 操作模式
 * @desc 相对移动(在当前基础上增减) 或 绝对坐标(设定为固定值)。
 * @type select
 * @option 相对移动 (Add)
 * @value add
 * @option 绝对坐标 (Set)
 * @value set
 * @default add
 *
 * @arg x
 * @text X轴偏移量
 * @desc 像素单位。正数向右，负数向左。
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 *
 * @arg y
 * @text Y轴偏移量
 * @desc 像素单位。正数向下，负数向上。
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 *
 * @arg duration
 * @text 持续时间 (帧)
 * @desc 移动过程花费的时间。60帧 = 1秒。0为瞬间到达。
 * @type number
 * @min 0
 * @default 0
 *
 * @command setPriority
 * @text 设置事件优先级
 * @desc 修改事件的层级（下方/相同/上方）。
 *
 * @arg eventId
 * @text 事件ID
 * @desc 要操作的事件ID。0代表本事件。
 * @type number
 * @min 0
 * @default 0
 *
 * @arg priority
 * @text 优先级
 * @desc 选择新的优先级。
 * @type select
 * @option 在人物下方 (0)
 * @value 0
 * @option 与人物相同 (1)
 * @value 1
 * @option 在人物上方 (2)
 * @value 2
 * @default 1
 */

(() => {
    const pluginName = "Hakubox_MoveEvent";

    // ==============================================================================
    // 插件指令注册
    // ==============================================================================

    PluginManager.registerCommand(pluginName, "setOffset", function(args) {
        const eventId = Number(args.eventId);
        const mode = args.mode; // 'add' or 'set'
        const x = Number(args.x) || 0;
        const y = Number(args.y) || 0;
        const duration = Number(args.duration) || 0;

        const character = this.character(eventId);
        if (character && character instanceof Game_Event) {
            character.startVisualOffsetMove(mode, x, y, duration);
        }
    });

    PluginManager.registerCommand(pluginName, "setPriority", function(args) {
        const eventId = Number(args.eventId);
        const priority = Number(args.priority);

        const character = this.character(eventId);
        if (character && character instanceof Game_Event) {
            character.setPriorityType(priority);
        }
    });

    // ==============================================================================
    // Game_Event 扩展：数据存储与更新逻辑
    // ==============================================================================

    const _Game_Event_initMembers = Game_Event.prototype.initMembers;
    Game_Event.prototype.initMembers = function() {
        _Game_Event_initMembers.call(this);
        // 初始化偏移数据
        this._visualOffsetX = 0;
        this._visualOffsetY = 0;
        
        // 移动补间动画数据
        this._targetVOX = 0;
        this._targetVOY = 0;
        this._startVOX = 0;
        this._startVOY = 0;
        this._voDuration = 0;
        this._voTime = 0;
    };

    // 解析备注标签：每次刷新事件页（setupPage）时调用
    const _Game_Event_setupPage = Game_Event.prototype.setupPage;
    Game_Event.prototype.setupPage = function() {
        _Game_Event_setupPage.call(this);
        this.setupVisualOffsetMeta();
    };

    Game_Event.prototype.setupVisualOffsetMeta = function() {
        if (!this.page()) return;

        // 获取备注 <move:x,y>
        const note = this.event().note || "";
        // 正则匹配：允许 <move:10,> <move:,10> <move:10,10> 以及空格
        const regex = /<move:\s*([+-]?\d*)\s*,\s*([+-]?\d*)\s*>/i;
        const match = note.match(regex);

        if (match) {
            // 如果备注存在，我们把当前偏移强制设置为备注的值（视为初始化）
            // 如果只有逗号没有数字，则视为0或保持不变？这里逻辑设为：若空则为0
            const metaX = match[1] ? parseInt(match[1]) : 0;
            const metaY = match[2] ? parseInt(match[2]) : 0;

            // 瞬间设置到该位置，停止任何正在进行的补间动画
            this._visualOffsetX = metaX;
            this._visualOffsetY = metaY;
            this._voDuration = 0; 
        }
    };

    // 启动平滑移动 (被插件指令调用)
    Game_Event.prototype.startVisualOffsetMove = function(mode, x, y, duration) {
        this._startVOX = this._visualOffsetX;
        this._startVOY = this._visualOffsetY;
        
        if (mode === 'add') {
            this._targetVOX = this._visualOffsetX + x;
            this._targetVOY = this._visualOffsetY + y;
        } else {
            this._targetVOX = x;
            this._targetVOY = y;
        }

        this._voDuration = duration;
        this._voTime = 0;

        // 如果时间为0，直接到达
        if (duration <= 0) {
            this._visualOffsetX = this._targetVOX;
            this._visualOffsetY = this._targetVOY;
        }
    };

    // 帧更新：处理平滑移动
    const _Game_Event_update = Game_Event.prototype.update;
    Game_Event.prototype.update = function() {
        _Game_Event_update.call(this);
        this.updateVisualOffset();
    };

    Game_Event.prototype.updateVisualOffset = function() {
        if (this._voDuration > 0 && this._voTime < this._voDuration) {
            this._voTime++;
            // 简单的线性插值，也可以改为缓动
            const t = this._voTime / this._voDuration;
            this._visualOffsetX = this._startVOX + (this._targetVOX - this._startVOX) * t;
            this._visualOffsetY = this._startVOY + (this._targetVOY - this._startVOY) * t;

            if (this._voTime >= this._voDuration) {
                this._visualOffsetX = this._targetVOX;
                this._visualOffsetY = this._targetVOY;
                this._voDuration = 0;
            }
        }
    };

    // 暴露给Sprite使用的接口
    Game_Event.prototype.visualOffsetX = function() {
        return this._visualOffsetX || 0;
    };

    Game_Event.prototype.visualOffsetY = function() {
        return this._visualOffsetY || 0;
    };

    // ==============================================================================
    // Sprite_Character 扩展：将数据应用到画面
    // ==============================================================================

    const _Sprite_Character_updatePosition = Sprite_Character.prototype.updatePosition;
    Sprite_Character.prototype.updatePosition = function() {
        // 调用原版逻辑（计算标准的 x, y, z）
        _Sprite_Character_updatePosition.call(this);
        
        // 如果是事件，叠加偏移量
        if (this._character instanceof Game_Event) {
            this.x += this._character.visualOffsetX();
            this.y += this._character.visualOffsetY();
        }
    };

})();