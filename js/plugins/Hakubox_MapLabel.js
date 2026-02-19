/*:
 * @target MZ
 * @plugindesc [v2.2] 地图事件动态标签系统 (自动适配高度/方向锁定/自动隐藏)
 * @author hakubox
 *
 * @help
 * ============================================================================
 * 功能介绍：
 * ============================================================================
 * 在地图事件头顶显示动态标签。
 * v2.1 特性：自动读取事件行走图的真实像素宽高，自动适配大型BOSS或大门的高度。
 * v2.2 特性：支持锁定图标朝向；支持对话时自动隐藏标签；支持插件指令。
 * v2.3 新特性：
 *   1. 【显示条件】：支持绑定开关、变量、独立开关，只有满足条件才显示标签。
 *   2. 【多标签支持】：同一个事件可以写多个 <label> 备注，同时显示多个状态。
 *
 * ============================================================================
 * 基础用法（事件备注）：
 * ============================================================================
 * 在事件【备注】栏输入：
 *
 *   <label: 文本, [类型], [方向], [偏移], [条件]>
 *
 * 参数说明：
 * 1. 文本 ：显示的文字。
 * 2. 类型 ：对应插件参数中配置的 ID (如 event, npc)。不填则用默认。
 * 3. 方向 ：数字小键盘方向 (8=上, 2=下, 4=左, 6=右, 5=中心)。
 * 4. 偏移 ：微调坐标，格式为 x|y (例如 0|-20)。
 * 5. 条件 ：(新功能) 判断是否显示的逻辑，支持开关/变量简写。
 *
 * ============================================================================
 * [新功能] 条件判断示例 (第5个参数)：
 * ============================================================================
 * 你可以在第5个参数位置填写判断条件。支持以下简写：
 *
 * S + 数字   = 全局开关 (Switch)
 * V + 数字   = 全局变量 (Variable，大于0为真)
 * A, B, C, D = 独立开关 (Self Switch)
 * !          = 逻辑"非" (不做某事时)
 * &          = 逻辑"且" (两个都要满足)
 * |          = 逻辑"或" (满足一个即可)
 *
 * --- 常用写法示例（可直接复制）---
 *
 * 1. 【独立开关】
 *    当独立开关A打开时才显示：
 *    <label:任务完成, event, 8, 0, A>
 *
 * 2. 【逻辑“或”】
 *    独立开关A 或者 B 任意一个打开时显示：
 *    <label:状态异常, event, 8, 0, A|B>
 *
 * 3. 【逻辑“且”】
 *    独立开关A 和 B 都必须打开时才显示：
 *    <label:隐藏剧情, event, 8, 0, A&B>
 *
 * 4. 【逻辑“非”与组合】
 *    独立开关A打开，但 B 没打开时显示（即 A&!B）：
 *    <label:进行中, event, 8, 0, A&!B>
 *
 * 5. 【全局开关】
 *    当 10号开关 打开时显示：
 *    <label:商店开启, event, 8, 0, S10>
 *
 *    当 10号开关 关闭时显示（注意前面的感叹号）：
 *    <label:商店打烊, event, 8, 0, !S10>
 *
 * 6. 【全局变量】
 *    当 10号变量 大于0 (非0) 时显示：
 *    <label:好感度UP, event, 8, 0, V10>
 *
 * 7. 【自定义脚本】
 *    如果以上简写不够用，可以直接写 JS 代码。
 *    例如：当金币大于1000时显示：
 *    <label:我很富有, event, 8, 0, $gameParty.gold()>1000>
 *
 * ============================================================================
 * [新功能] 多标签叠加示例：
 * ============================================================================
 * 现在一个事件可以写多行 <label>，它们会同时判断、同时显示。
 * 你可以利用偏移量 (第4个参数) 让它们错开位置。
 *
 * 示例场景：
 * 一个NPC，头顶始终显示名字，当开关A开启时，额外在头顶更上方显示“(!)”任务图标。
 *
 * 在备注里写两行：
 * <label: 村长, npc, 8, 0|0>
 * <label: (!), quest, 8, 0|-40, A>
 * 
 * (注：第二行的 0|-40 表示向上偏移40像素，防止和名字重叠)
 *
 * ============================================================================
 * 插件指令 (Plugin Command)：
 * ============================================================================
 * 1. 显示/隐藏标签 (SetLabelVisible)
 *    强制隐藏某个事件的所有标签（例如演出时）。优先级高于条件判断。
 *
 * ============================================================================
 * 
 * @param Global Settings
 * @text === 全局设置 ===
 *
 * @param Switch ID
 * @text 启用开关 ID
 * @desc 开启此开关显示标签。0为始终显示。
 * @type switch
 * @default 0
 *
 * @param Auto Hide Interaction
 * @text 对话时自动隐藏
 * @desc 当玩家触发事件（如对话）时，是否自动隐藏该事件的标签？
 * @type boolean
 * @default true
 *
 * @param Custom Font Config
 * @text 自定义字体配置
 * @type struct<FontConfig>
 * @desc 配置标签使用的特殊字体。
 * @default {"fontName":"","fontUrl":""}
 *
 * @param View Distance
 * @text 可视距离 (像素)
 * @desc 超过此距离渐隐。0为无限。
 * @type number
 * @min 0
 * @default 300
 *
 * @param Fade Speed
 * @text 距离渐隐速度
 * @desc 0.01-1.0，越小越平滑。
 * @type number
 * @decimals 2
 * @default 0.10
 *
 * @param Label Space
 * @text 事件与标签的默认间距
 * @desc 基础间距（像素）
 * @type number
 * @default 10
 * @min 0
 * @max 200
 *
 * @param Default Config
 * @text === 默认样式配置 ===
 * @desc 未指定类型时使用的样式。
 * @type struct<LabelStyle>
 * @default {"fontSize":"20","textColor":"#ffffff","outlineColor":"rgba(0,0,0,0.6)","outlineWidth":"3","showShadow":"true","textAlign":"center","offsetX":"0","offsetY":"0","bgImage":"","bgScale":"1.0","paddingX":"10","paddingY":"5","smartAnchor":"true","decoImage":"","decoIndex":"0","decoBoundW":"0","decoBoundH":"0","decoOffsetY":"0","enableFloat":"false","floatRange":"6","floatSpeed":"0.05","enableBreath":"false","opacityMin":"150","opacityMax":"255","opacitySpeed":"0.05","enableScale":"false","scaleMin":"0.90","scaleMax":"1.10","scaleSpeed":"0.05"}
 *
 * @param Label Type List
 * @text === 标签类型列表 (Type) ===
 * @desc 配置多种预设样式（如 shop, npc），在备注中调用。
 * @type struct<LabelType>[]
 * @default []
 *
 * @command SetLabelVisible
 * @text 显示/隐藏标签
 * @desc 手动控制某个事件标签的可见性 (例如演出时强制隐藏)。
 *
 * @arg eventId
 * @text 事件ID
 * @desc 0代表本事件
 * @type number
 * @default 0
 *
 * @arg visible
 * @text 是否显示
 * @desc ON=显示(恢复自动控制), OFF=强制隐藏
 * @type boolean
 * @default true
 */

/*~struct~FontConfig:
 * @param fontName
 * @text 字体族名称
 * @default 
 *
 * @param fontUrl
 * @text 字体文件路径
 * @default 
 */

/*~struct~LabelStyle:
 *
 * @param ---Basic---
 * 
 * @param fontSize
 * @text 字体大小
 * @type number
 * @default 20
 *
 * @param textColor
 * @text 字体颜色 (Hex)
 * @default #ffffff
 *
 * @param outlineColor
 * @text 描边颜色 (CSS)
 * @default rgba(0, 0, 0, 0.6)
 *
 * @param outlineWidth
 * @text 描边粗细
 * @type number
 * @default 3
 *
 * @param showShadow
 * @text 是否显示文字阴影
 * @type boolean
 * @default true
 *
 * @param textAlign
 * @text 文字对齐方式
 * @type select
 * @option Center
 * @value center
 * @option Left
 * @value left
 * @option Right
 * @value right
 * @default center
 * 
 * @param offsetX
 * @text 样式整体偏移 X
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 *
 * @param offsetY
 * @text 样式整体偏移 Y
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 *
 * 
 * @param ---Background---
 * 
 * @param useWindowSkin
 * @text 是否添加标准背景
 * @desc 启用后使用系统默认窗口皮肤作为背景(忽略下方背景图片)。
 * @type boolean
 * @default false
 * 
 * @param windowPadding
 * @text 标准背景内边距
 * @parent useWindowSkin
 * @desc 格式: 上,右,下,左 (例如: 10,20,10,20) 或 单一数字 (例如: 10)。
 * @default 10
 *
 * @param bgImage
 * @text [图片模式] 背景图片
 * @type file
 * @dir img/pictures/
 *
 * @param bgScale
 * @text [图片模式] 背景缩放比例
 * @type number
 * @decimals 2
 * @default 1.0
 *
 * @param paddingX
 * @text [图片模式] 背景横向边距
 * @type number
 * @default 10
 *
 * @param paddingY
 * @text [图片模式] 背景纵向边距
 * @type number
 * @default 5
 *
 *
 * @param ---Decoration---
 *
 * @param smartAnchor
 * @text [智能] 自动调整图标位置
 * @type boolean
 * @default true
 *
 * @param decoImage
 * @text 装饰: 行走图文件名
 * @type file
 * @dir img/characters/
 *
 * @param decoIndex
 * @text 装饰: 角色索引 (0-7)
 * @type number
 * @default 0
 * 
 * @param decoDirection
 * @text [手动] 行走图朝向
 * @desc 指定图标读取行走图的哪一行(朝向)。如果不选则会自动播放行走动画(默认第1行)。
 * @type select
 * @option 默认 (动态/第1行)
 * @value -1
 * @option 下 (第1行)
 * @value 0
 * @option 左 (第2行)
 * @value 1
 * @option 右 (第3行)
 * @value 2
 * @option 上 (第4行)
 * @value 3
 * @default -1
 *
 * @param decoBoundW
 * @text 装饰: 有效宽度
 * @type number
 * @min 0
 * @default 0
 * 
 * @param decoBoundH
 * @text 装饰: 有效高度
 * @type number
 * @min 0
 * @default 0
 *
 * @param decoCustomPos
 * @text [手动] 图标位置
 * @type select
 * @option Left
 * @value left
 * @option Right
 * @value right
 * @option Top
 * @value top
 * @option Bottom
 * @value bottom
 * @default left
 *
 * @param decoOffsetY
 * @text 装饰: Y轴微调
 * @type number
 * @default 0
 * @min -999
 * @max 999
 * 
 * @param ---Float Anim---
 *
 * @param enableFloat
 * @text 启用: 上下弹跳
 * @type boolean
 * @default false
 *
 * @param floatRange
 * @text 弹跳幅度
 * @parent enableFloat
 * @type number
 * @default 6
 *
 * @param floatSpeed
 * @text 弹跳速度
 * @parent enableFloat
 * @type number
 * @decimals 3
 * @default 0.05
 * 
 * @param ---Breath Anim---
 *
 * @param enableBreath
 * @text 启用: 呼吸效果
 * @type boolean
 * @default false
 * 
 * @param opacityMin
 * @text 最小透明度
 * @parent enableBreath
 * @type number
 * @max 255
 * @default 150
 * 
 * @param opacityMax
 * @text 最大透明度
 * @parent enableBreath
 * @type number
 * @max 255
 * @default 255
 *
 * @param opacitySpeed
 * @text 呼吸速度
 * @parent enableBreath
 * @type number
 * @decimals 3
 * @default 0.05
 * 
 * @param ---Scale Anim---
 * 
 * @param enableScale
 * @text 启用: 缩放效果
 * @type boolean
 * @default false
 * 
 * @param scaleMin
 * @text 最小比例
 * @parent enableScale
 * @type number
 * @decimals 2
 * @default 0.90
 * 
 * @param scaleMax
 * @text 最大比例
 * @parent enableScale
 * @type number
 * @decimals 2
 * @default 1.10
 * 
 * @param scaleSpeed
 * @text 缩放变换速度
 * @parent enableScale
 * @type number
 * @decimals 3
 * @default 0.05
 */

/*~struct~LabelType:
 * @param id
 * @text 类型ID
 * @type string
 * @default type1
 *
 * @param style
 * @text 详细配置
 * @type struct<LabelStyle>
 * @default {"useWindowSkin":"false","windowPadding":"10","fontSize":"20","textColor":"#ffffff","outlineColor":"rgba(0,0,0,0.6)","outlineWidth":"3","showShadow":"true","textAlign":"center","offsetX":"0","offsetY":"0","bgImage":"","bgScale":"1.0","paddingX":"10","paddingY":"5","smartAnchor":"true","decoImage":"","decoIndex":"0","decoBoundW":"0","decoBoundH":"0","decoOffsetY":"0","enableFloat":"false","floatRange":"6","floatSpeed":"0.05","enableBreath":"false","opacityMin":"150","opacityMax":"255","opacitySpeed":"0.05","enableScale":"false","scaleMin":"0.90","scaleMax":"1.10","scaleSpeed":"0.05"}
 */

(() => {
    const pluginName = "Hakubox_MapLabel";
    const parameters = PluginManager.parameters(pluginName);

    // --- 工具: 解析JSON ---
    const parseStruct = (str) => {
        try { return JSON.parse(str || "{}"); } catch (e) { return {}; }
    };

    const globalSwitchId = Number(parameters['Switch ID'] || 0);
    const viewDistance = Number(parameters['View Distance'] || 300);
    const fadeSpeed = Number(parameters['Fade Speed'] || 0.1);
    const labelSpace = Number(parameters['Label Space'] || 10);
    const autoHideInteraction = String(parameters['Auto Hide Interaction']) === 'true'; // V2.2 新增
    
    // --- 字体配置 ---
    const fontConfig = parseStruct(parameters['Custom Font Config']);
    const customFontName = fontConfig.fontName || "";
    const customFontUrl = fontConfig.fontUrl || "";
    if (customFontName && customFontUrl) {
        if (typeof FontManager.load === "function") {
            FontManager.load(customFontName, customFontUrl);
        }
    }

    // --- 样式配置 ---
    const defaultConfig = parseStruct(parameters['Default Config']);
    const typeRawList = parseStruct(parameters['Label Type List']);
    const typeConfigMap = {};
    if (Array.isArray(typeRawList)) {
        typeRawList.forEach(raw => {
            const data = parseStruct(raw);
            const style = parseStruct(data.style);
            typeConfigMap[data.id] = style;
        });
    }

    const getFinalStyle = (typeId) => {
        const target = typeConfigMap[typeId] || {};
        const merged = { ...defaultConfig };
        for (const key in target) {
            if (target[key] !== "" && target[key] !== undefined) {
                merged[key] = target[key];
            }
        }
        return merged;
    };

    // --- [新增/修改] 条件编译器：将字符串预编译为函数 ---
    const createLabelConditionFunc = (condStr, gameEvent) => {
        // 如果没有条件，返回 null，表示始终显示
        if (!condStr || condStr.trim() === "") return null;
        try {
            // 1. 语法转换：将简写转换为 JS 代码
            // 注意：先替换操作符，再替换变量，避免干扰
            
            // 替换 & -> &&, | -> ||
            let script = condStr.replace(/(?<!&)&(?!&)/g, ' && ').replace(/(?<!\|)\|(?!\|)/g, ' || ');
            // 替换 V10 -> !!$gameVariables.value(10) (强制转布尔)
            script = script.replace(/\bV(\d+)\b/gi, (_, id) => {
                return `$gameVariables.value(${id})`;
            });
            // 替换 S10 -> $gameSwitches.value(10)
            script = script.replace(/\bS(\d+)\b/gi, (_, id) => {
                return `$gameSwitches.value(${id})`;
            });
            // 替换 A-D -> 独立开关判断
            script = script.replace(/\b([A-D])\b/g, (_, key) => {
                // 使用 this._mapId 和 this._eventId
                return `$gameSelfSwitches.value([${gameEvent._mapId}, ${gameEvent._eventId}, "${key.toUpperCase()}"])`;
            });
            // 2. 构造函数
            // 生成的函数体类似于: return $gameSwitches.value(1) && !$gameSelfSwitches...
            return new Function("return " + script);
        } catch (e) {
            console.warn(`[MapLabel] Compile Error: "${condStr}"`, e);
            // 编译失败时，返回一个恒为 false 的函数，避免游戏报错
            return function() { return false; };
        }
    };

    // Game_Event.prototype.refresh = function() {
    // --- Game_Event 备注解析 (v2.1) ---
    const _Game_Event_setupPage = Game_Event.prototype.setupPage;
    Game_Event.prototype.setupPage = function () {
        _Game_Event_setupPage.call(this);
        this.setupLabelData(this);
    };

    // 清理缓存（确保切换页面时不留垃圾）
    const _Game_Event_clearPageSettings = Game_Event.prototype.clearPageSettings;
    Game_Event.prototype.clearPageSettings = function() {
        _Game_Event_clearPageSettings.call(this);
        this._labelDataList = [];
        this._labelCondCache = {}; // 新增：用来存放编译好的函数缓存
    };
    
    // --- [修改] Game_Event 读取多个标签 ---
    Game_Event.prototype.setupLabelData = function (gameEvent) {
        this._labelDataList = []; 
        if (!this.page()) return;

        if (!this._labelCondCache) this._labelCondCache = {};

        const note = this.event().note || "";
        const regex = /<label:\s*(.+?)>/gi;
        let match;
        while ((match = regex.exec(note)) !== null) {
            const content = match[1];
            const parts = content.split(/,|，/).map(s => s.trim());
            
            const text = parts[0] || "";
            const type = parts[1] || "";
            let dir = parts[2] ? Number(parts[2]) : 8; 
            if (isNaN(dir)) dir = 8;
            let offX = 0; 
            let offY = 0;
            const offStr = parts[3] || "";
            
            if (offStr) {
                const xyParts = offStr.split("|");
                if (xyParts.length === 2) {
                    offX = xyParts[0] !== "" ? Number(xyParts[0]) : 0;
                    offY = xyParts[1] !== "" ? Number(xyParts[1]) : 0;
                } else if (xyParts.length === 1) {
                    if (offStr.indexOf("|") === 0) { 
                        offY = Number(offStr.replace("|", "")) || 0;
                    } else if (offStr.indexOf("|") === offStr.length - 1) { 
                        offX = Number(offStr.replace("|", "")) || 0;
                    } else { 
                        offX = Number(offStr) || 0;
                    }
                }
            }
            // 获取条件字符串，并立即编译成函数缓存起来
            const conditionStr = parts[4] || "";
            // const conditionFunc = createLabelConditionFunc(conditionStr, gameEvent);
            this._labelDataList.push({
                text: text,
                type: type,
                dir: dir,
                manualOx: offX,
                manualOy: offY,
                condStr: conditionStr,
                // _condFunc: conditionFunc // 存储编译好的函数
            });
        }
    };

    Game_Event.prototype.evalLabelCondition = function(condStr) {
        if (!condStr) return true; // 无条件则通过
        // 1. 初始化缓存容器（读档兼容）
        if (!this._labelCondCache) this._labelCondCache = {};
        // 2. 检查缓存中是否有编译好的函数
        if (!this._labelCondCache[condStr]) {
            // 没有则编译（读档后第一次走到这里会自动修复）
            this._labelCondCache[condStr] = createLabelConditionFunc(condStr, this);
        }
        // 3. 执行缓存的函数
        const func = this._labelCondCache[condStr];
        if (typeof func === 'function') {
            return func.call(this);
        }
        return true;
    };

    // 新增获取列表的方法
    Game_Event.prototype.getLabelDataList = function () {
        return this._labelDataList || [];
    };

    // 兼容旧接口（如果其他地方用了），返回第一个
    Game_Event.prototype.getLabelData = function () {
        return (this._labelDataList && this._labelDataList.length > 0) ? this._labelDataList[0] : null;
    };

    Game_Event.prototype.getLabelData = function () {
        return this._labelData;
    };

    // --- 核心显示类 Sprite_EventLabel ---
    class Sprite_EventLabel extends Sprite {
        constructor(character) {
            super();
            this._character = character;
            this._style = null;
            this._text = "";
            this._animTick = Math.random() * 100;
            this._decoTick = 0;
            this._decoPattern = 0;
            this._decoRow = 0;
            
            this._totalHeight = 0;
            this._totalWidth = 0;
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
            this.z = 8; 
            this._container = new Sprite();
            this._container.anchor.x = 0.5;
            this._container.anchor.y = 0.5;
            this.addChild(this._container);
            
            this._windowSkinSprite = null;
            this._bgSprite = new Sprite();
            this._bgSprite.anchor.x = 0.5;
            this._bgSprite.anchor.y = 0.5;
            this._container.addChild(this._bgSprite);
            this._decoSprite = new Sprite();
            this._decoSprite.anchor.x = 0.5;
            this._decoSprite.anchor.y = 0.5;
            this._container.addChild(this._decoSprite);
            this._textSprite = new Sprite();
            this._textSprite.anchor.x = 0.5;
            this._textSprite.anchor.y = 0.5;
            this._container.addChild(this._textSprite);
            this._lastData = null;
        }

        drawAll() {
            const style = this._style;
            if (customFontName && !FontManager.isReady()) {
                setTimeout(() => { if (this.visible) this.drawAll(); }, 100);
                return;
            }

            const fontSize = Number(style.fontSize);
            const fontFace = customFontName || $gameSystem.mainFontFace();

            const tempBitmap = new Bitmap(1, 1);
            tempBitmap.fontFace = fontFace;
            tempBitmap.fontSize = fontSize;
            const textWidth = tempBitmap.measureTextWidth(TranslateUtils.getText(this._text)) + 4; 
            const textHeight = fontSize + 4; 

            const decoName = style.decoImage;
            let frameW = 0; let frameH = 0;
            let hasDeco = false;

            if (decoName) {
                const bitmap = ImageManager.loadCharacter(decoName);
                if (!bitmap.isReady()) {
                    bitmap.addLoadListener(this.drawAll.bind(this));
                    return;
                }
                const isBig = ImageManager.isBigCharacter(decoName);
                frameW = bitmap.width / (isBig ? 3 : 12);
                frameH = bitmap.height / (isBig ? 4 : 8);
                hasDeco = true;
            }

            const boundW = Number(style.decoBoundW) || frameW;
            const boundH = Number(style.decoBoundH) || frameH;

            // --- [V2.2 Modified: 手动方向锁定] ---
            let decoPos = style.decoCustomPos || 'left';
            const manualRow = style.decoDirection !== undefined ? Number(style.decoDirection) : -1;
            this._decoRow = 0; 

            // 只有当用户默认(-1)时，才启用智能方向判断
            if (manualRow === -1) {
                if (String(style.smartAnchor) === 'true') {
                    if (this._paramDir === 4) { decoPos = 'right'; this._decoRow = 1; }
                    else if (this._paramDir === 6) { decoPos = 'left'; this._decoRow = 2; }
                    else if (this._paramDir === 2) { decoPos = 'top'; this._decoRow = 3; }
                    else if (this._paramDir === 8) { decoPos = 'bottom'; this._decoRow = 0; }
                }
            } else {
                this._decoRow = manualRow;
            }
            // ------------------------------------

            let contentW = textWidth;
            let contentH = textHeight;

            if (hasDeco) {
                const gap = 4;
                if (decoPos === 'left' || decoPos === 'right') {
                    contentW += boundW + gap;
                    contentH = Math.max(textHeight, boundH);
                } else {
                    contentH += boundH + gap;
                    contentW = Math.max(textWidth, boundW);
                }
            }
            
            this._totalHeight = contentH;
            this._totalWidth = contentW;

            const useWinSkin = String(style.useWindowSkin) === 'true';
            let contentOffsetX = 0;
            let contentOffsetY = 0;

            if (useWinSkin) {
                this._bgSprite.visible = false;
                this._bgSprite.bitmap = null;

                const padStr = String(style.windowPadding || "12");
                let pt=0, pr=0, pb=0, pl=0;
                
                if (padStr.includes(",")) {
                    const pars = padStr.split(",").map(Number);
                    pt = pars[0] || 0;
                    pr = (pars.length > 1) ? pars[1] : pt;
                    pb = (pars.length > 2) ? pars[2] : pt;
                    pl = (pars.length > 3) ? pars[3] : pr;
                } else {
                    const val = Number(padStr) || 12;
                    pt = pr = pb = pl = val;
                }

                const winW = contentW + pl + pr;
                const winH = contentH + pt + pb;

                if (!this._windowSkinSprite) {
                    const rect = new Rectangle(0, 0, winW, winH);
                    this._windowSkinSprite = new Window_Base(rect);
                    this._windowSkinSprite.padding = 0; 
                    this._container.addChildAt(this._windowSkinSprite, 0);
                }
                
                this._windowSkinSprite.visible = true;
                this._windowSkinSprite.move(0, 0, winW, winH);
                this._windowSkinSprite.x = -winW / 2;
                this._windowSkinSprite.y = -winH / 2;

                contentOffsetX = (pl - pr) / 2;
                contentOffsetY = (pt - pb) / 2;

                this._totalHeight = winH;
                this._totalWidth = winW;

            } else {
                if (this._windowSkinSprite) this._windowSkinSprite.visible = false;
                this._bgSprite.visible = true;

                const pX = Number(style.paddingX);
                const pY = Number(style.paddingY);
                const bScale = Number(style.bgScale || 1);
                
                const bgW = (contentW + pX * 2) * bScale;
                const bgH = (contentH + pY * 2) * bScale;

                this._totalHeight = bgH;
                this._totalWidth = bgW;

                const bgName = style.bgImage;
                if (bgName) {
                    const bgBmp = ImageManager.loadPicture(bgName);
                    if (!bgBmp.isReady()) {
                        bgBmp.addLoadListener(this.drawAll.bind(this));
                        return;
                    }
                    this._bgSprite.bitmap = new Bitmap(bgW, bgH);
                    this._bgSprite.bitmap.blt(bgBmp, 0, 0, bgBmp.width, bgBmp.height, 0, 0, bgW, bgH);
                } else {
                    this._bgSprite.bitmap = null;
                }
                
                contentOffsetX = 0;
                contentOffsetY = 0;
            }

            const tBmp = new Bitmap(textWidth + 8, fontSize + 4);
            tBmp.fontFace = fontFace;
            tBmp.fontSize = fontSize;
            tBmp.textColor = style.textColor;
            tBmp.outlineColor = style.outlineColor;
            tBmp.outlineWidth = Number(style.outlineWidth);

            if (String(style.showShadow) === 'true') {
                tBmp.context.shadowColor = "rgba(0,0,0,0.5)";
                tBmp.context.shadowBlur = 4;
                tBmp.context.shadowOffsetX = 2;
                tBmp.context.shadowOffsetY = 2;
            }

            tBmp.drawText(TranslateUtils.getText(this._text), 0, 0, tBmp.width, tBmp.height, style.textAlign || 'center');
            tBmp.context.shadowColor = "transparent";
            this._textSprite.bitmap = tBmp;

            if (hasDeco) {
                this._decoSprite.bitmap = ImageManager.loadCharacter(decoName);
                this._decoFrameWidth = frameW;
                this._decoFrameHeight = frameH;
                this._decoStats = { isBig: ImageManager.isBigCharacter(decoName), index: Number(style.decoIndex) };
            } else {
                this._decoSprite.bitmap = null;
            }

            let tx = 0, ty = 0;
            let dx = 0, dy = 0;
            const dOY = Number(style.decoOffsetY || 0);
            
            if (!hasDeco) {
                tx = 0; ty = -1; 
            } else {
                const validTextH = fontSize + 4;
                if (decoPos === 'left') {
                    const startX = -contentW / 2;
                    dx = startX + boundW / 2;
                    tx = startX + boundW + 4 + textWidth / 2; 
                    dy = dOY; ty = -1;
                } else if (decoPos === 'right') {
                    const startX = -contentW / 2;
                    tx = startX + textWidth / 2;
                    dx = startX + textWidth + 4 + boundW / 2;
                    dy = dOY; ty = -1;
                } else if (decoPos === 'top') {
                    const startY = -contentH / 2;
                    dy = startY + boundH / 2 + dOY;
                    ty = startY + boundH + 4 + validTextH / 2;
                    dx = 0; tx = 0;
                } else if (decoPos === 'bottom') {
                    const startY = -contentH / 2;
                    ty = startY + validTextH / 2;
                    dy = startY + validTextH + 4 + boundH / 2 + dOY;
                    dx = 0; tx = 0;
                }
            }

            this._textSprite.x = tx + contentOffsetX;
            this._textSprite.y = ty + contentOffsetY;
            this._decoSprite.x = dx + contentOffsetX;
            this._decoSprite.y = dy + contentOffsetY;
        }

        update() {
            Sprite.prototype.update.call(this);
            if (!this._character) return;
            
            // 0. 强制隐藏
            if (this._character._labelForceHidden) {
                this.visible = false;
                return;
            }
            // 1. 全局开关
            if (globalSwitchId > 0 && !$gameSwitches.value(globalSwitchId)) {
                this.visible = false;
                return;
            }
            const data = this._assignedData; 
            
            // 2. 基础数据检查
            if (!data || this._character.isTransparent() || this._character._erased) {
                this.visible = false;
                return;
            }

            // 1. 检查是否有条件字符串
            if (data.condStr) {
                // 2. 检查当前 Sprite 是否持有编译好的函数？
                if (!this._cachedCondFunc) {
                    // 现场恢复！仅执行一次，之后每帧直接复用
                    this._cachedCondFunc = createLabelConditionFunc(data.condStr, this._character);
                }
                // 3. 直接执行函数 (这是最快的调用方式)
                if (this._cachedCondFunc && !this._cachedCondFunc.call(this._character)) {
                    this.visible = false;
                    return;
                }
            }
            
            // 2.5 交互隐藏
            if (autoHideInteraction) {
                if ($gameMap.isEventRunning()) {
                    this.visible = false;
                    return;
                }
            }
            // 3. 屏幕外优化 (以下逻辑保持原样)
            const charX = this._character.screenX();
            const charY = this._character.screenY();
            const margin = 300; 
            if (charX < -margin || charX > Graphics.width + margin ||
                charY < -margin || charY > Graphics.height + margin) {
                this.visible = false;
                return;
            }
            
            this.visible = true;
            if (JSON.stringify(data) !== JSON.stringify(this._lastData)) {
                this._lastData = data;
                this.refresh(data);
            }
            this.updateVisibilityDistance(charX, charY);
            if (this.visible && this.opacity > 0) {
                this.updatePosition(charX, charY, data);
                this.updateEffects();
                this.updateDecoWalk();
            }
        }

        refresh(data) {
            this._text = data.text;
            this._paramDir = data.dir;
            this._style = getFinalStyle(data.type);

            this._textSprite.bitmap = null;
            this.drawAll();
        }

        getCharacterFrameSize() {
            const char = this._character;
            if (char.tileId() > 0) {
                return { w: $gameMap.tileWidth(), h: $gameMap.tileHeight() };
            }
            const name = char.characterName();
            if (!name) {
                return { w: 48, h: 48 };
            }

            const bitmap = ImageManager.loadCharacter(name);
            if (!bitmap.isReady()) {
                return { w: 48, h: 48 };
            }

            const isBig = ImageManager.isBigCharacter(name);
            const frameW = bitmap.width / (isBig ? 3 : 12);
            const frameH = bitmap.height / (isBig ? 4 : 8);

            return { w: frameW, h: frameH };
        }

        updatePosition(cx, cy, data) {
            const charSize = this.getCharacterFrameSize();
            const charW = charSize.w;
            const charH = charSize.h;
            
            const halfLabelH = (this._totalHeight || 20) / 2;
            const halfLabelW = (this._totalWidth || 20) / 2;
            
            const dir = data.dir;

            let styleOx = 0; 
            let styleOy = 0;
            if (this._style) {
                styleOx = Number(this._style.offsetX || 0);
                styleOy = Number(this._style.offsetY || 0);
            }
            const manualOx = data.manualOx || 0;
            const manualOy = data.manualOy || 0;

            let tx = cx;
            let ty = cy;

            switch (dir) {
                case 8: // 上
                    ty = cy - charH - labelSpace - halfLabelH;
                    break;
                case 2: // 下
                    ty = cy + labelSpace + halfLabelH;
                    break;
                case 4: // 左 (位于身体左侧中心)
                    tx = cx - (charW / 2) - labelSpace - halfLabelW;
                    ty = cy - (charH / 2); 
                    break;
                case 6: // 右 (位于身体右侧中心)
                    tx = cx + (charW / 2) + labelSpace + halfLabelW;
                    ty = cy - (charH / 2);
                    break;
                case 7: // 左上 (头部左侧)
                    tx = cx - (charW / 2) - labelSpace - halfLabelW;
                    ty = cy - charH - labelSpace - halfLabelH;
                    break;
                case 9: // 右上 (头部右侧)
                    tx = cx + (charW / 2) + labelSpace + halfLabelW;
                    ty = cy - charH - labelSpace - halfLabelH;
                    break;
                case 1: // 左下 (脚底左侧)
                    tx = cx - (charW / 2) - labelSpace - halfLabelW;
                    ty = cy + labelSpace + halfLabelH;
                    break;
                case 3: // 右下 (脚底右侧)
                    tx = cx + (charW / 2) + labelSpace + halfLabelW;
                    ty = cy + labelSpace + halfLabelH;
                    break;
                case 5: // 中心 (身体中心)
                    ty = cy - (charH / 2);
                    break;
                default: 
                    ty = cy - charH - labelSpace - halfLabelH;
                    break;
            }

            this.x = tx + styleOx + manualOx;
            this.y = ty + styleOy + manualOy;
        }

        updateVisibilityDistance(charX, charY) {
            if (viewDistance > 0) {
                const playerX = $gamePlayer.screenX();
                const playerY = $gamePlayer.screenY();
                const dist = Math.hypot(charX - playerX, charY - playerY);

                let targetOpacity = 255;
                if (dist > viewDistance) {
                    targetOpacity = 0;
                }

                if (this.opacity !== targetOpacity) {
                    const step = 255 * fadeSpeed;
                    if (this.opacity < targetOpacity) {
                        this.opacity = Math.min(this.opacity + step, targetOpacity);
                    } else {
                        this.opacity = Math.max(this.opacity - step, targetOpacity);
                    }
                }
            } else {
                this.opacity = 255;
            }
        }

        updateEffects() {
            this._animTick++;
            const style = this._style;
            if (!style) return;

            if (String(style.enableFloat) === 'true') {
                const range = Number(style.floatRange);
                const speed = Number(style.floatSpeed);
                this._container.y = Math.sin(this._animTick * speed) * range;
            } else {
                this._container.y = 0;
            }

            if (String(style.enableBreath) === 'true') {
                const minOp = Number(style.opacityMin);
                const maxOp = Number(style.opacityMax);
                const spd = Number(style.opacitySpeed);
                this._container.alpha = (minOp + (maxOp - minOp) * ((Math.sin(this._animTick * spd) + 1) / 2)) / 255;
            } else {
                this._container.alpha = 1.0;
            }

            if (String(style.enableScale) === 'true') {
                const minS = Number(style.scaleMin);
                const maxS = Number(style.scaleMax);
                const spd = Number(style.scaleSpeed);
                const curScale = minS + (maxS - minS) * ((Math.sin(this._animTick * spd) + 1) / 2);
                this._container.scale.set(curScale, curScale);
            } else {
                this._container.scale.set(1.0, 1.0);
            }
        }

        // --- [V2.2 Modified: 强制指定行号] ---
        updateDecoWalk() {
            if (!this._decoSprite.bitmap) return;
            const style = this._style;

            // 获取手动指定的行
            const manualRow = style && style.decoDirection !== undefined ? Number(style.decoDirection) : -1;
            
            // 确定最终使用的行号
            let finalRow = this._decoRow; 
            if (manualRow !== -1) {
                finalRow = manualRow;
            }

            this._decoTick++;
            if (this._decoTick > 15) {
                this._decoTick = 0;
                this._decoPattern = (this._decoPattern + 1) % 4;
            }

            const patternMap = [0, 1, 2, 1];
            const pIndex = patternMap[this._decoPattern];
            const stats = this._decoStats;
            const w = this._decoFrameWidth;
            const h = this._decoFrameHeight;

            let sx = 0;
            let sy = 0;

            if (stats.isBig) {
                sx = pIndex * w;
                sy = finalRow * h;
            } else {
                const blockX = (stats.index % 4) * 3 * w;
                const blockY = Math.floor(stats.index / 4) * 4 * h;
                sx = blockX + pIndex * w;
                sy = blockY + (finalRow * h);
            }

            this._decoSprite.setFrame(sx, sy, w, h);
        }
        // ------------------------------------

        setTargetData(data) {
            // 如果数据引用变了，说明 Event 页可能变了，或者刚刚初始化
            if (this._assignedData !== data) {
                this._assignedData = data;
                
                // [优化关键] 清除旧的函数缓存
                this._cachedCondFunc = null; 
                
                // 如果有条件字符串，尝试立即编译（针对新创建/切地图的情况）
                // 读档时这里不会执行，因为 setupPage 没跑，setTargetData 也没跑
                // 但没关系，update 里有保底机制
                if (data && data.condStr) {
                    this._cachedCondFunc = createLabelConditionFunc(data.condStr, this._character);
                }
            }
        };
    }


    const _Sprite_Character_update = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function () {
        _Sprite_Character_update.call(this);
        this.updateLabel();
    };

    // --- [修改] Sprite_Character 管理多个 Label ---
    Sprite_Character.prototype.updateLabel = function () {
        if (!(this._character instanceof Game_Event) || !this.parent) return;
        
        // 确保数组存在
        if (!this._labelSprites) this._labelSprites = [];
        const dataList = this._character.getLabelDataList();
        
        // 1. 数量同步：如果数据变多了，通过 new 补齐；变少了，remove 掉多余的
        if (this._labelSprites.length < dataList.length) {
            for (let i = this._labelSprites.length; i < dataList.length; i++) {
                const sprite = new Sprite_EventLabel(this._character);
                this.parent.addChild(sprite);
                this._labelSprites.push(sprite);
            }
        } else if (this._labelSprites.length > dataList.length) {
            for (let i = this._labelSprites.length - 1; i >= dataList.length; i--) {
                const sprite = this._labelSprites[i];
                if (sprite.parent) sprite.parent.removeChild(sprite);
                this._labelSprites.splice(i, 1);
            }
        }
        // 2. 逐个更新数据
        for (let i = 0; i < this._labelSprites.length; i++) {
            const sprite = this._labelSprites[i];
            const data = dataList[i];
            // 调用 Sprite_EventLabel 的新方法来注入数据
            sprite.setTargetData(data);
        }
    };
    // 清理逻辑也要改，遍历清理
    const _Sprite_Character_onRemove_Override = Sprite_Character.prototype.onRemove;
    Sprite_Character.prototype.onRemove = function() {
        if (_Sprite_Character_onRemove_Override) _Sprite_Character_onRemove_Override.call(this);
        if (this._labelSprites) {
            this._labelSprites.forEach(sprite => {
                if (sprite.parent) sprite.parent.removeChild(sprite);
            });
            this._labelSprites = [];
        }
    };
    

    PluginManager.registerCommand(pluginName, "SetLabelVisible", function(args) {
        const eId = Number(args.eventId) === 0 ? this.eventId() : Number(args.eventId);
        const visible = String(args.visible) === 'true';
        const event = $gameMap.event(eId);
        if (event) {
            // 设置一个强制隐藏标识
            // 如果 visible = true, 我们设为 undefined/false，让自动逻辑接管
            // 如果 visible = false, 我们设为 true (强制隐藏)
            event._labelForceHidden = !visible;
        }
    });

})();
