/*:
 * @target MZ
 * @plugindesc [MZ] 高级自定义HUD - 支持变量模板、动态渐隐与自由布局。
 * @author hakubox
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * 这是一个专为 RPG Maker MZ 设计的高级 HUD 插件。
 * 它允许你在屏幕上自由绘制文字、变量值、图标，并支持动态条件判断。
 * 
 * --- 核心功能 ---
 * 1. 模板语法：
 *    在文本内容中，你可以使用以下占位符：
 *    - {V1}      : 显示变量ID为1的值。
 *    - {V1:pad3} : 显示变量1的值，补齐3位（例如 005）。
 *    - {S2?'开':'关'} : 如果开关2开启显示'开'，否则显示'关'。
 *    - {HP1}     : 显示队伍第1个角色的HP。
 *    - {MHP1}    : 显示队伍第1个角色的最大HP。
 *    - \\I[64]   : 绘制图标（标准控制字符）。
 *    - \\C[2]    : 改变颜色（标准控制字符）。
 * 
 * 2. 智能渐隐：
 *    - 当玩家走到 HUD 覆盖的区域时，HUD 会自动变透明。
 *    - 当鼠标悬停在 HUD 上时，也会变透明。
 *    - 当有事件正在执行（剧情中）时，HUD 会根据配置隐藏。
 *
 * --- 参数说明 ---
 * 配置主要集中在 "HUD Elements List" 中。
 * 每一个元素都可以独立设置 X, Y, 字体大小, 颜色等。
 *
 * ============================================================================
 * Terms of Use
 * ============================================================================
 * Free for use in commercial and non-commercial projects.
 * Credit is appreciated but not required.
 *
 * @param --- General Config ---
 * @text --- 基础设置 ---
 *
 * @param Show Switch ID
 * @text 显示控制开关
 * @desc 只有当这个开关打开时，HUD才会显示。设为0则一直显示（除非剧情隐藏）。
 * @type switch
 * @default 0
 *
 * @param Refresh Rate
 * @text 刷新频率
 * @desc 多少帧检查一次数据变化并重绘。建议 10-20。
 * @type number
 * @min 1
 * @default 15
 * 
 * @param HUD X
 * @text 窗口 X 坐标
 * @desc 整个HUD窗口的全局X坐标。
 * @type number
 * @default 0
 *
 * @param HUD Y
 * @text 窗口 Y 坐标
 * @desc 整个HUD窗口的全局Y坐标。
 * @type number
 * @default 0
 *
 * @param HUD Width
 * @text 窗口宽度
 * @type number
 * @default 300
 *
 * @param HUD Height
 * @text 窗口高度
 * @type number
 * @default 200
 *
 * @param Window Opacity
 * @text 窗口背景不透明度
 * @desc 0为全透明（只显示字），255为标准黑底。
 * @type number
 * @min 0
 * @max 255
 * @default 0
 *
 * @param --- Auto Fade ---
 * @text --- 智能渐隐 ---
 *
 * @param Fade on Event
 * @text 剧情时隐藏
 * @desc 当有事件解释器在运行时（对话中），是否渐隐消失。
 * @type boolean
 * @default true
 *
 * @param Fade on Hover
 * @text 遮挡时渐隐
 * @desc 当玩家角色或鼠标位于HUD下方时，是否半透明。
 * @type boolean
 * @default true
 *
 * @param Fade Opacity
 * @text 渐隐后透明度
 * @desc 渐隐状态下的不透明度 (0-255)。
 * @type number
 * @default 64
 *
 * @param Fade Speed
 * @text 渐隐速度
 * @desc 每帧改变的不透明度数值。
 * @type number
 * @default 16
 *
 * @param --- Elements ---
 * @text --- 元素列表 ---
 *
 * @param Elements List
 * @text HUD元素配置
 * @desc 在这里配置你需要显示的所有内容（文字、变量、图标组合）。
 * @type struct<HUDElement>[]
 * @default []
 *
 */

/*~struct~HUDElement:
 * @param Label
 * @text 备注名称
 * @desc 仅用于编辑器内标记，方便你分辨这是哪一行。
 * @default New Element
 *
 * @param Visible Condition
 * @text 可见条件(JS)
 * @desc 填入一段JS代码，返回true则显示，false隐藏。留空则一直显示。
 * @type text
 * @default true
 *
 * @param X
 * @text 相对 X 坐标
 * @type number
 * @min -9999
 * @default 0
 *
 * @param Y
 * @text 相对 Y 坐标
 * @type number
 * @min -9999
 * @default 0
 *
 * @param Font Size
 * @text 字体大小
 * @type number
 * @default 22
 *
 * @param Text Color
 * @text 文本颜色
 * @desc 16进制颜色代码(例如 #FF0000) 或 系统色号(0-31)。留空默认白色。
 * @default #FFFFFF
 * 
 * @param Outline Color
 * @text 描边颜色
 * @desc 16进制颜色代码。
 * @default rgba(0,0,0,0.6)
 *
 * @param Content
 * @text 显示内容模板
 * @desc 支持 {V1}变量, {S1?'A':'B'}开关, \I[n]图标。
 * @type multiline_string
 * @default 变量1的值: {V1}
 *
 */

(() => {
    const pluginName = "Hakubox_StateInfo";
    const parameters = PluginManager.parameters(pluginName);

    // --- Helper: Parse Parameters safely ---
    function parseStruct(str) {
        if (!str) return [];
        try {
            return JSON.parse(str).map(e => {
                const parsed = JSON.parse(e);
                // Clean up stringified logic
                // if (parsed['Visible Condition']) {
                //     parsed['Visible Condition'] = JSON.parse(parsed['Visible Condition']);
                // }
                return parsed;
            });
        } catch (e) {
            console.error("SimpleCustomHUD: Error parsing elements.", e);
            return [];
        }
    }

    const config = {
        showSwitchId: Number(parameters['Show Switch ID'] || 0),
        refreshRate: Number(parameters['Refresh Rate'] || 15),
        x: Number(parameters['HUD X'] || 0),
        y: Number(parameters['HUD Y'] || 0),
        width: Number(parameters['HUD Width'] || 300),
        height: Number(parameters['HUD Height'] || 200),
        winOpacity: Number(parameters['Window Opacity'] || 0),
        fadeOnEvent: parameters['Fade on Event'] === 'true',
        fadeOnHover: parameters['Fade on Hover'] === 'true',
        fadeOpacity: Number(parameters['Fade Opacity'] || 64),
        fadeSpeed: Number(parameters['Fade Speed'] || 16),
        elements: parseStruct(parameters['Elements List'])
    };

    // ============================================================================
    // Logic: Template Parser
    // ============================================================================
    class TextParser {
        static process(text) {
            if (!text) return "";

            // 1. Process Variable: {V123}
            text = text.replace(/\{V(\d+)\}/gi, (_, id) => {
                return $gameVariables.value(Number(id));
            });

            // 1.1 Process Variable with padding: {V1:pad3} -> 001
            text = text.replace(/\{V(\d+):pad(\d+)\}/gi, (_, id, pad) => {
                return String($gameVariables.value(Number(id))).padStart(Number(pad), '0');
            });

            // 2. Process Switch Ternary: {S10?On:Off}
            text = text.replace(/\{S(\d+)\?(.*?):(.*?)\}/gi, (_, id, trueVal, falseVal) => {
                // Remove potential quotes users might type inside
                const val = $gameSwitches.value(Number(id));
                const t = trueVal.replace(/^['"]|['"]$/g, '');
                const f = falseVal.replace(/^['"]|['"]$/g, '');
                return val ? t : f;
            });

            // 3. Process Actor HP: {HP1}, {MHP1} for actorId 1
            text = text.replace(/\{(M?)HP(\d+)\}/gi, (_, isMax, actorId) => {
                const actor = $gameParty.members()[Number(actorId) - 1]; // Index 0 is leader
                if (!actor) return "---";
                return isMax ? actor.mhp : actor.hp;
            });

            return text;
        }

        static evalCondition(conditionStr) {
            if (!conditionStr || conditionStr.trim() === "") return true;
            try {
                // Using a function constructor for safer localized eval
                return new Function("return " + conditionStr)();
            } catch (e) {
                return true;
            }
        }
    }

    // ============================================================================
    // Window Class: Window_CustomHUD
    // ============================================================================
    class Window_CustomHUD extends Window_Base {
        constructor(rect) {
            super(rect);
            this.opacity = config.winOpacity;
            this._elements = config.elements; // Local copy
            this._timer = 0;
            this._targetOpacity = 255;
            this.contentsOpacity = 255; // Independent content opacity

            // Remove standard window background if opacity is 0 for cleaner look
            if (this.opacity === 0) {
                this.frameVisible = false;
            }

            // 预加载所有可能用到的图片，防止第一次显示闪烁
            this.preloadImages();

            this.refresh();
        }

        preloadImages() {
            // 这里只是简单的请求一次加载，确保图片进入缓存
            // MZ的ImageManager会自动处理缓存
            const list = ["bg_0", "bg_1", "bg_2", "bg_3", "day_1", "day_2", "day_3", "day_4", "day_5", "day_en-US", "day_ja-JP", "day_zh-CN", "fg_en-US", "fg_ja-JP", "fg_zh-CN", "night_en-US", "night_ja-JP", "night_zh-CN"];
            list.forEach(name => ImageManager.loadPicture('status/' + name));
        }

        update() {
            super.update();
            this.updateVisibility();
            this.updateFade();
            this.updateContent();
        }

        updateVisibility() {
            // Master Switch
            if (config.showSwitchId > 0) {
                this.visible = $gameSwitches.value(config.showSwitchId);
            } else {
                this.visible = true;
            }
        }

        updateFade() {
            if (!this.visible) return;

            let shouldFade = false;

            // 1. Event Running Check
            if (config.fadeOnEvent && $gameMap.isEventRunning()) {
                shouldFade = true;
            }

            // 2. Player Occlusion Check
            if (config.fadeOnHover && !shouldFade) {
                const pX = $gamePlayer.screenX();
                const pY = $gamePlayer.screenY();
                if (pX >= this.x && pX <= this.x + this.width &&
                    pY >= this.y && pY <= this.y + this.height + 48) {
                    shouldFade = true;
                }
            }

            // 3. Mouse Hover Check
            if (config.fadeOnHover && !shouldFade) {
                const tX = TouchInput.x;
                const tY = TouchInput.y;
                if (tX >= this.x && tX <= this.x + this.width &&
                    tY >= this.y && tY <= this.y + this.height) {
                    shouldFade = true;
                }
            }

            this._targetOpacity = shouldFade ? config.fadeOpacity : 255;

            // Smooth transition
            if (this.contentsOpacity > this._targetOpacity) {
                this.contentsOpacity = Math.max(this.contentsOpacity - config.fadeSpeed, this._targetOpacity);
            } else if (this.contentsOpacity < this._targetOpacity) {
                this.contentsOpacity = Math.min(this.contentsOpacity + config.fadeSpeed, this._targetOpacity);
            }

            if (this.opacity > 0) {
                this.opacity = (this.contentsOpacity / 255) * config.winOpacity;
            }
        }

        updateContent() {
            this._timer++;
            // 稍微提高一下刷新监测频率，或者每帧都监测变量变化
            if (this._timer < config.refreshRate) return;
            this._timer = 0;

            // 为了确保存档读取后图片能显示，最好调用refresh
            this.refresh();
        }

        // --- 核心修改：新增硬编码绘图逻辑 ---
        drawCustomHStatus() {
            // 1. 获取数据
            const dayCount = $gameVariables.value(5); // 变量5: 天数
            const isNight = $gameSwitches.value(6);   // 开关6: 昼夜 (假设开=夜，关=昼，根据实际情况调整)
            const lustLevel = $gameVariables.value(8); // 变量8: 淫乱度

            // 获取语言，如果 TranslateUtils 不存在则给个默认值
            let lang = "zh-CN";
            if (typeof TranslateUtils !== 'undefined' && TranslateUtils.currentLanguage) {
                lang = TranslateUtils.currentLanguage;
            } else {
                // 如果没有语言插件，尝试检测系统语言或默认
                if ($dataSystem.locale) lang = $dataSystem.locale;
            }

            // 防御性编程：根据你提供的文件名，语言代码必须完全匹配 (zh-CN, en-US, ja-JP)
            // 如果你的游戏里语言代码是 'cn' 或 'en'，这里可能需要转换一下
            // 假设你的 TranslateUtils 返回的就是 'zh-CN' 这种格式。

            // 2. 确定文件名

            // A. 背景图 (bg_0.png ~ bg_3.png)
            // 限制 lustLevel 在 0-3 之间，防止报错
            const safeLust = Math.max(0, Math.min(3, lustLevel));
            const bgName = `bg_${safeLust}`;

            // B. 天数数字 (day_1.png ~ day_5.png)
            const safeDay = Math.max(1, Math.min(5, dayCount));
            const dayNumName = `day_${safeDay}`; // 用于显示 "1", "2"...

            // C. 昼夜图标 (day_zh-CN.png 或 night_zh-CN.png)
            const timePrefix = isNight ? "night" : "day";
            const timeIconName = `${timePrefix}_${lang}`;

            // D. 前景文字 (fg_zh-CN.png) - 也就是 "日数: ... 淫乱度: ..." 这些固定文本
            const fgName = `fg_${lang}`;

            // 3. 执行绘制
            // 注意：drawImage 自带缓存检查，如果图片没加载好不会报错但也不会显示
            // 建议所有图片放在 img/pictures/ 文件夹下

            // 绘制顺序：背景 -> 前景文字 -> 昼夜图标 -> 天数数字
            // 这里的 (0, 0) 是相对于 HUD 窗口的坐标。

            this.drawPicture(bgName, 0, 0);       // 背景（那个带着心的紫发框）
            this.drawPicture(fgName, 0, 0);       // 文字层（Day:, Lust:）
            this.drawPicture(timeIconName, 0, 0); // 太阳或月亮图标
            this.drawPicture(dayNumName, 0, 0);   // 天数数字
        }

        drawPicture(filename, x, y) {
            const bitmap = ImageManager.loadPicture('status/' + filename);
            if (bitmap.isReady()) {
                // 将图片完整绘制到窗口内容层
                this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, x, y);
            } else {
                // 如果第一次没加载好，加个简单的回调重绘
                bitmap.addLoadListener(() => {
                    // 只在窗口还没销毁时重绘
                    if (this.contents) {
                        this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, x, y);
                    }
                });
            }
        }
        // ----------------------------------------

        refresh() {
            this.contents.clear();

            // 1. 先执行你的硬编码定制显示
            this.drawCustomHStatus();

            // 2. 再执行原有的配置项显示 (如果你的Elements List里还有东西的话，会叠加在上面)
            // 如果你只想要硬编码的图，可以在插件参数里把 Elements List 清空
            for (const elem of this._elements) {
                if (!TextParser.evalCondition(elem['Visible Condition'])) continue;

                const processedText = TextParser.process(elem['Content']);
                const x = Number(elem['X']);
                const y = Number(elem['Y']);
                const fontSize = Number(elem['Font Size']);
                let textColor = elem['Text Color'];
                const outlineColor = elem['Outline Color'];

                this.contents.fontSize = fontSize;

                if (textColor) {
                    if (!isNaN(parseInt(textColor)) && textColor.indexOf('#') === -1) {
                        this.changeTextColor(ColorManager.textColor(Number(textColor)));
                    } else {
                        this.changeTextColor(textColor);
                    }
                } else {
                    this.resetTextColor();
                }

                if (outlineColor) {
                    this.contents.outlineColor = outlineColor;
                }

                this.drawTextEx(processedText, x, y, this.contentsWidth());
                this.resetFontSettings();
            }
        }
    }

    // ============================================================================
    // Integration into Scene_Map
    // ============================================================================

    const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function () {
        _Scene_Map_createAllWindows.call(this);
        this.createCustomHUD();
    };

    Scene_Map.prototype.createCustomHUD = function () {
        const rect = new Rectangle(config.x, config.y, config.width, config.height);
        this._customHudWindow = new Window_CustomHUD(rect);
        this.addChild(this._customHudWindow);
    };

})();