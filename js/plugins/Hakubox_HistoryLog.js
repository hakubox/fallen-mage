/*:
 * @target MZ
 * @plugindesc [v4.0] Hakubox 历史记录插件 - 修复优化版
 * @author Hakubox
 *
 * @help
 * ============================================================================
 * Hakubox_HistoryLog.js
 * ============================================================================
 *
 * [v4.0 修复与优化]
 * 1. 修复：悬浮按钮现在位于窗口外部，且颜色调整为高可见度，解决了看不清和位置错误的问题。
 * 2. 修复：滚动条增加了圆角绘制，变窄了，且修复了无法滚动到底部的坐标计算 Bug。
 * 3. 修复：点击条目现在会正确播放确定音效，并执行回调函数。
 * 4. 优化：所有代码注释已汉化。
 * 5. 新增：增加了记录时间戳的显示（可选）。
 * 
 * --- 快捷键设置 ---
 * 在参数 "Shortcut Key" 中输入按键字符，例如 "Q"。
 *
 * ============================================================================
 *
 * @param --- 核心配置 ---
 *
 * @param Disable Switch ID
 * @text 禁用功能开关ID
 * @type switch
 * @default 0
 * @desc 当此开关打开(ON)时，停止记录日志，且快捷键无法呼出界面。
 *
 * @param SHORTCUT_SET
 * @text --- 快捷键设置 ---
 * 
 * @param Shortcut Key
 * @parent SHORTCUT_SET
 * @text 呼出/关闭快捷键
 * @type string
 * @default Q
 * @desc 键盘按键（英文大写），如 Q, W, A, S。留空则不启用。
 *
 * @param UI_SET
 * @text --- UI 外观设置 ---
 *
 * @param Item Padding
 * @parent UI_SET
 * @text 条目内边距
 * @type number
 * @default 12
 * @desc 内容距离条目边框的距离（像素）。
 * 
 * @param Name Font Size
 * @parent UI_SET
 * @text 名字字体大小
 * @type number
 * @default 24
 *
 * @param Name Color
 * @parent UI_SET
 * @text 名字字体颜色
 * @type string
 * @default 6
 * @desc 角色名字颜色。数字(0-31)为系统色，#RRGGBB为Hex颜色。
 *
 * @param Show Timestamp
 * @parent UI_SET
 * @text 是否显示时间
 * @type boolean
 * @default true
 * @desc 在条目右上角显示记录时的具体时间。
 *
 * @param Scroll Bar Color
 * @parent UI_SET
 * @text 滚动条颜色
 * @type string
 * @default #FFFFFF
 * @desc 滚动条滑块的颜色。
 * 
 * @param Template List
 * @text 历史记录模板列表
 * @type struct<LogTemplate>[]
 * @default ["{\"Id\":\"map_move\",\"Format\":\"移动到了：$1\",\"FontSize\":\"20\",\"Color\":\"16\",\"Align\":\"left\",\"ExtraData\":\"return { icon: 0 }\"}","{\"Id\":\"item_use\",\"Format\":\"$2 使用了 $1。\",\"FontSize\":\"20\",\"Color\":\"0\",\"Align\":\"left\",\"ExtraData\":\"\"}","{\"Id\":\"choice\",\"Format\":\"做出选择：$1\",\"FontSize\":\"22\",\"Color\":\"14\",\"Align\":\"center\",\"ExtraData\":\"\"}","{\"Id\":\"dialogue\",\"Format\":\"$2: $1\",\"FontSize\":\"22\",\"Color\":\"0\",\"Align\":\"left\",\"ExtraData\":\"\"}"]
 * @desc 定义所有可用的日志类型及其样式。
 *
 * @param Max Records
 * @text 最大记录条数
 * @type number
 * @default 100
 * @desc 超过此数量将删除最早的记录。
 *
 * @param Version Code
 * @text 版本号获取代码 (JS)
 * @type note
 * @default "$gameSystem.versionNo || '1.0.0';"
 * @desc (已缓存) 返回当前版本号的JS代码。
 *
 * @param Global Click Action
 * @text 点击记录回调 (JS)
 * @type note
 * @default "console.log('点击了记录:', templateId, '内容:', content);"
 * @desc (已缓存) 点击记录并确认时触发。可用变量: content, item, index, templateId。
 * 
 * @command addLog
 * @text 添加自定义记录
 * @desc 插入一条基于模板的记录。
 * @arg templateId
 * @text 模板ID
 * @type string
 * @arg arg1
 * @text 参数1 ($1)
 * @type string
 * @arg arg2
 * @text 参数2 ($2)
 * @type string
 * 
 * @command openHistory
 * @text 打开历史记录界面
 * 
 * @command clearLog
 * @text 清空记录
 *
 */

/*~struct~LogTemplate:
 * @param Id
 * @text 模板 ID (唯一)
 * @type string
 *
 * @param Format
 * @text 内容格式
 * @type string
 * @desc 使用 $1, $2, $3 代表参数 arg1, arg2...
 *
 * @param FontSize
 * @text 字体大小
 * @type number
 * @default 22
 *
 * @param Color
 * @text 字体颜色
 * @type string
 * @default 0
 * @desc 输入数字(0-31)代表系统色，或输入 #RRGGBB 代表Hex颜色。
 *
 * @param Align
 * @text 对齐方式
 * @type select
 * @option 左对齐
 * @value left
 * @option 居中
 * @value center
 * @option 右对齐
 * @value right
 * @default left
 *
 * @param BackImage
 * @text 背景图片
 * @type file
 * @dir img/pictures/
 * @desc (可选) 该条记录的背景图。
 *
 * @param ExtraData
 * @text 额外固定数据 (JS)
 * @type note
 */

var Hakubox = Hakubox || {};
Hakubox.HistoryLog = {};

(() => {
    const pluginName = "Hakubox_HistoryLog";
    const parameters = PluginManager.parameters(pluginName);

    // ======================================================================
    // 1. 配置与常量
    // ======================================================================

    const Config = {
        maxRecords: Number(parameters['Max Records'] || 100),
        disableSwitch: Number(parameters['Disable Switch ID'] || 0),
        shortcutKey: String(parameters['Shortcut Key'] || "").toUpperCase(),
        
        // UI 样式配置
        padding: Number(parameters['Item Padding'] || 12),
        nameFontSize: Number(parameters['Name Font Size'] || 24),
        nameColor: parameters['Name Color'] || "6", 
        scrollBarColor: parameters['Scroll Bar Color'] || "#FFFFFF",
        showTimestamp: parameters['Show Timestamp'] === "true",
        
        funcs: { version: null, click: null },
        templates: {}
    };

    /**
     * 优化：安全的 JS 动作编译 (用于点击回调，不强行 return)
     */
    function compileAction(code, argNames = []) {
        if (!code) return () => {};
        try {
            // 直接缓存 new Function，不重复解析字符串
            return new Function(...argNames, code);
        } catch (e) {
            console.error("Hakubox History: 点击回调代码编译失败", e);
            return () => {};
        }
    }
    /**
     * 优化：安全的 JS 值编译 (用于版本号，确保有 return)
     */
    function compileEval(code, argNames = []) {
        if (!code) return () => null;
        try {
            // 如果没写 return，帮他加上，确保能取到返回值
            const body = code.trim().startsWith('return') ? code : "return " + code;
            return new Function(...argNames, body);
        } catch (e) {
            console.error("Hakubox History: 表达式编译失败", e);
            return () => null;
        }
    }

    /**
     * 初始化配置数据
     */
    function initConfig() {
        // 解析模板 (保持不变)
        const rawList = JSON.parse(parameters['Template List'] || "[]");
        Config.templates = {};
        rawList.forEach(jsonStr => {
            try {
                const data = JSON.parse(jsonStr);
                Config.templates[data.Id] = {
                    id: data.Id,
                    format: data.Format || "",
                    fontSize: Number(data.FontSize || 22),
                    color: data.Color || "0",
                    align: data.Align || "left",
                    backImage: data.BackImage || ""
                };
            } catch(e) { console.warn("模板JSON解析失败:", jsonStr); }
        });
        // 修复：分别使用 compileEval 和 compileAction
        Config.funcs.version = compileEval((parameters['Version Code'] || '""').slice(1, -1) || "return '1.0';");
        
        // 修复：点击回调只执行，不强制 return，且缓存了 Function
        // 参数名顺序必须与调用时一致
        Config.funcs.click = compileAction((parameters['Global Click Action'] || '""').slice(1, -1) || "", ['content', 'item', 'index', 'templateId']);
        if (Config.shortcutKey) {
            const keyCode = Config.shortcutKey.charCodeAt(0);
            if (keyCode) Input.keyMapper[keyCode] = 'hakubox_history';
        }
    }
    initConfig();

    // ======================================================================
    // 2. 数据逻辑 (Game_System)
    // ======================================================================

    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._hakuboxHistory = [];
    };

    /**
     * 核心方法：向系统添加一条日志
     */
    Game_System.prototype.addHistoryLog = function(templateId, contentObj) {
        if (Config.disableSwitch > 0 && $gameSwitches.value(Config.disableSwitch)) return;
        
        // --- 逻辑修复: 地图名防止读档重复记录 ---
        if (templateId === 'map_move') {
            const last = this.getHistoryLogs()[this.getHistoryLogs().length - 1];
            if (last && last.templateId === 'map_move' && last.content.arg1 === contentObj.arg1) {
                return; // 忽略重复的地图名日志
            }
        }

        let vNo = "0.0";
        try { vNo = Config.funcs.version.call(window); } catch(e) {}

        // 生成时间字符串 (HH:MM)
        const date = new Date();
        const timeStr = date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0');

        const record = {
            templateId: templateId, 
            versionNo: vNo,
            content: contentObj,
            timestampStr: timeStr,
            timeKey: Date.now() // 用于排序或唯一标识
        };

        if (!this._hakuboxHistory) this._hakuboxHistory = [];
        this._hakuboxHistory.push(record);

        // 超过上限删除旧记录
        if (this._hakuboxHistory.length > Config.maxRecords) {
            this._hakuboxHistory.shift();
        }
    };

    Game_System.prototype.getHistoryLogs = function() {
        return this._hakuboxHistory || [];
    };

    // ======================================================================
    // 3. 游戏钩子 (Hooks) - 自动捕获
    // ======================================================================

    // 捕获：对话 (Dialogue)
    const _Game_Message_add = Game_Message.prototype.add;
    Game_Message.prototype.add = function(text) {
        if (text && (Config.disableSwitch === 0 || !$gameSwitches.value(Config.disableSwitch))) {
             $gameSystem.addHistoryLog('dialogue', {
                text: TranslateUtils.getText(text), 
                name: TranslateUtils.getText(this.speakerName()),
                faceName: this.faceName(),
                faceIndex: this.faceIndex()
            });
        }
        _Game_Message_add.call(this, text);
    };

    // 捕获：地图移动 (Map Move)
    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);
        if (Config.templates['map_move']) {
            const dName = $gameMap.displayName();
            if (dName) {
                $gameSystem.addHistoryLog('map_move', { arg1: TranslateUtils.getText(dName) });
            }
        }
    };

    // 捕获：选项 (Choice)
    const _Window_ChoiceList_callOkHandler = Window_ChoiceList.prototype.callOkHandler;
    Window_ChoiceList.prototype.callOkHandler = function() {
        const idx = this.index();
        // 确保选项存在 (防止取消键崩溃)
        if (this._list && this._list[idx]) {
            const txt = this._list[idx].name; 
            if (Config.templates['choice']) {
                $gameSystem.addHistoryLog('choice', { arg1: TranslateUtils.getText(txt) });
            }
        }
        _Window_ChoiceList_callOkHandler.call(this);
    };

    // 捕获：使用物品/技能 (Item/Skill)
    const _Game_Battler_useItem = Game_Battler.prototype.useItem;
    Game_Battler.prototype.useItem = function(item) {
        _Game_Battler_useItem.call(this, item);
        if (Config.templates['item_use'] && (DataManager.isItem(item) || DataManager.isSkill(item))) {
            const userName = this.name ? this.name() : (this.isActor() ? this.actor().name() : this.enemy().name());
            $gameSystem.addHistoryLog('item_use', { arg1: TranslateUtils.getText(item.name), arg2: TranslateUtils.getText(userName) });
        }
    };

    // ======================================================================
    // 4. 监听快捷键呼出
    // ======================================================================

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        if (Config.shortcutKey && Input.isTriggered('hakubox_history')) {
            if (Config.disableSwitch === 0 || !$gameSwitches.value(Config.disableSwitch)) {
                SoundManager.playOk();
                Hakubox.HistoryLog.open();
            }
        }
    };

    // ======================================================================
    // 5. UI - 历史记录窗口 (Window_HakuboxHistory)
    // ======================================================================

    class Window_HakuboxHistory extends Window_Selectable {
        initialize(rect) {
            super.initialize(rect);
            this.backOpacity = 240;
            this._scrollBarOpacity = 0;
            this._scrollBarTimer = 0;

            // 平滑滚动相关变量
            this._targetScrollY = -1;
            // 拖拽判断相关的变量
            this._touchStartY = 0;
            this._isDragging = false;

            this.refresh();
            // 初始化直接跳转到底部
            this.scrollTo(0, this.maxScrollY());
            this.select(Math.max(0, this.maxItems() - 1));
            this.activate(); // 确保窗口处于激活状态

            this.createCustomScrollBar();
        }

        ensureCursorVisible(smooth) {
            if (this._cursorAll) {
                this.startSmoothScrollTo(0);
            } else if (this.innerHeight > 0 && this.row() >= 0) {
                // 计算当前选中项的顶部和底部坐标
                const itemTop = this.row() * this.itemHeight();
                const itemBottom = itemTop + this.itemHeight();
                
                // 获取当前视口的滚动偏移量
                // 注意：这里要用 _targetScrollY 来判断（如果有目标值），否则用当前 _scrollY
                // 这样可以防止快速按键时计算抖动
                const currentScrollY = (this._targetScrollY >= 0) ? this._targetScrollY : this._scrollY;
                const scrollBottom = currentScrollY + this.innerHeight;

                // 判断是否超出上边界
                if (itemTop < currentScrollY) {
                    // 如果上面看不到了，就滚到让这一项在最上面显示
                    this.startSmoothScrollTo(itemTop);
                } 
                // 判断是否超出下边界
                else if (itemBottom > scrollBottom) {
                    // 如果下面看不到了，就滚到让这一项在最下面显示
                    // 目标位置 = 这一项的底部 - 视口高度
                    this.startSmoothScrollTo(itemBottom - this.innerHeight);
                }
            }
        }

        maxItems() {
            return $gameSystem.getHistoryLogs().length;
        }

        itemHeight() {
            return (this.lineHeight() * 4) + (Config.padding * 2);
        }

        update() {
            super.update();
            this.processWheel();
            this.updateCustomScrollBarOpacity();
            this.checkToggleClose();
            this.updateCustomScrollBarPosition();
            this.updateSmoothScroll(); 
        }

        // --- 修复问题1：彻底修复鼠标滚轮 ---
        processWheel() {
            if (this.isOpenAndActive()) {
                const threshold = 20; // 滚轮灵敏度阈值
                if (Math.abs(TouchInput.wheelY) >= threshold) {
                    // 终止平滑滚动，交还给手动控制
                    this._targetScrollY = -1;
                    // 计算滚动量：滚轮方向 * 滚动速度 (这里设为行高的一半，手感比较平滑)
                    const speed = this.itemHeight() / 2; 
                    this.scrollBy(0, TouchInput.wheelY > 0 ? speed : -speed);
                }
            }
        }

        // --- 修复问题2 & 3：处理拖拽防误触 & 确保点击执行 ---
        processTouch() {
            if (!this.isOpenAndActive()) return;
            // 1. 按下：初始化状态
            if (TouchInput.isTriggered()) {
                this._touchStartY = TouchInput.y;
                this._isDragging = false;
                this._targetScrollY = -1; // 手指按住时停止自动滚动
            }
            // 2. 移动：检测是否在拖拽
            if (TouchInput.isPressed()) {
                // 增加一点容错距离(8px)，防止点击时的微小抖动被判定为拖拽
                if (Math.abs(TouchInput.y - this._touchStartY) > 8) {
                    this._isDragging = true;
                }
                // 处于拖拽状态时，执行原生滚动逻辑
                if (this._isDragging) {
                    super.processTouch(); 
                }
            }
            // 3. 抬起：如果是点击而非拖拽，触发确认
            if (TouchInput.isClicked()) {
                if (!this._isDragging) {
                    const hitIndex = this.hitIndex();
                    if (hitIndex >= 0) {
                        if (hitIndex === this.index()) {
                            // 已经选中则触发 OK
                            this.processOk();
                        } else {
                            // 未选中则先选中
                            this.select(hitIndex);
                            this.processOk();
                        }
                    }
                }
            }
        }

        // 这里的 processOk 是实际执行点击逻辑的地方
        processOk() {
            if (this.maxItems() === 0) return;
            if (this.index() >= 0) {
                this.playOkSound();
                this.callOkHandler();
            } else {
                this.playBuzzerSound();
            }
        }

        callOkHandler() {
            const idx = this.index();
            const record = $gameSystem.getHistoryLogs()[idx];
            
            this.activate(); // 保持窗口激活状态防止死锁
            if (record && typeof Config.funcs.click === 'function') {
                // 参数说明：
                // 1. record.content: 自定义内容对象 {arg1, arg2...}
                // 2. record: 完整记录对象
                // 3. idx: 索引
                // 4. record.templateId: 模板ID
                try {
                    // 直接执行缓存好的 Function
                    Config.funcs.click.call(this, record.content, record, idx, record.templateId);
                } catch (e) {
                    console.error("执行历史记录点击回调时出错:", e);
                    SoundManager.playBuzzer();
                }
            }
        }

        // --- 平滑滚动逻辑 (保留) ---
        startSmoothScrollTo(y) {
            this._targetScrollY = Math.max(0, Math.min(y, this.maxScrollY()));
        }

        updateSmoothScroll() {
            // 只有当设定了 valid 的 targetScrollY 时才执行
            if (this._targetScrollY >= 0) {
                const currentY = this._scrollY;
                const targetY = this._targetScrollY;

                if (Math.abs(targetY - currentY) < 1) {
                    this.scrollTo(0, targetY);
                    this._targetScrollY = -1; 
                } else {
                    const speed = (targetY - currentY) * 0.2;
                    this.scrollBy(0, speed);
                }
            }
        }

        overallHeight() {
            return this.maxItems() * this.itemHeight();
        }

        createCustomScrollBar() {
            this._scrollBarSprite = new Sprite();
            // 注意：要添加到父级（窗口本身），而不是 addChild（那是内容层），
            // 但为了确保在最上层显示，通常addChild到窗口实例是可以的，只要Z轴正确。
            this.addChild(this._scrollBarSprite);
            
            // 初始化一个足够大的 Bitmap，避免反复 resize 导致内存抖动
            // 宽度6，高度先给视口高度即可
            this._scrollBarSprite.bitmap = new Bitmap(6, this.innerHeight || 100);
            this._scrollBarSprite.visible = false;
        }

        updateCustomScrollBarPosition() {
            const sprite = this._scrollBarSprite;
            const viewH = this.innerHeight;         // 视口高度
            const maxScroll = this.maxScrollY();    // 最大滚动距离
            
            // 1. 如果没有滚动空间，隐藏并返回
            if (maxScroll <= 0) {
                sprite.visible = false;
                return;
            }
            
            // 2. 处理透明度
            sprite.opacity = this._scrollBarOpacity;
            if (this._scrollBarOpacity <= 0) {
                sprite.visible = false;
                return;
            }
            sprite.visible = true;
            // 3. 计算滑块高度
            // 核心公式：滑块高度 = (视口高度 / 内容总高度) * 视口高度
            // 内容总高度 = 视口高度 + 最大滚动距离
            const contentTotalHeight = viewH + maxScroll;
            let thumbH = (viewH / contentTotalHeight) * viewH;
            
            // 限制最小高度为 40px，防止内容太多时滑块太小看不见
            if (thumbH < 40) thumbH = 40;
            // 限制最大高度不能超过视口
            if (thumbH > viewH) thumbH = viewH;
            // 4. 计算滑块 Y 坐标
            // 核心公式：当前滚动位置 / 最大滚动位置 * (视口高度 - 滑块高度)
            const scrollRatio = this._scrollY / maxScroll;
            // 确保比例在 0~1 之间
            const safeRatio = Math.max(0, Math.min(1, scrollRatio));
            
            const trackSpace = viewH - thumbH; // 滑块可移动的净空间
            const thumbY = trackSpace * safeRatio;
            // 5. 绘制滑块 (仅当尺寸变化时重绘，优化性能)
            const barWidth = 6;
            const bmp = sprite.bitmap;
            
            // 检查是否需要调整 Bitmap 尺寸 (如果滑块变长了，或者初始化不够大)
            if (bmp.height < thumbH) {
                 bmp.resize(barWidth, Math.ceil(thumbH));
            }
            // 记录上一次绘制的高度，避免每帧重绘canvas
            if (this._lastThumbH !== thumbH) {
                this._lastThumbH = thumbH;
                
                const ctx = bmp.context;
                // 清空旧内容
                ctx.clearRect(0, 0, barWidth, bmp.height);
                
                ctx.fillStyle = Config.scrollBarColor; // 使用配置的颜色
                ctx.beginPath();
                
                // --- 兼容性圆角绘制开始 ---
                const x = 0;
                const y = 0;
                const w = barWidth;
                const h = thumbH;
                const r = barWidth / 2; // 半径是宽度的一半，形成胶囊形状
                ctx.moveTo(x + r, y);
                ctx.lineTo(x + w - r, y);
                ctx.quadraticCurveTo(x + w, y, x + w, y + r);
                ctx.lineTo(x + w, y + h - r);
                ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
                ctx.lineTo(x + r, y + h);
                ctx.quadraticCurveTo(x, y + h, x, y + h - r);
                ctx.lineTo(x, y + r);
                ctx.quadraticCurveTo(x, y, x + r, y);
                // --- 兼容性圆角绘制结束 ---
                
                ctx.fill();
            }
            // 6. 设置 Sprite 坐标
            // X轴：放在窗口最右侧，向左偏移一点
            sprite.x = this.width - Config.padding - barWidth - 4; 
            // Y轴：加上 padding 是为了避开窗口边框，和内容区对齐
            sprite.y = thumbY + Config.padding; 
            
            // 关键：裁剪显示区域，确保只显示 thumbH 那么高的部分
            sprite.setFrame(0, 0, barWidth, thumbH);
        }

        updateCustomScrollBarOpacity() {
            if (this._lastScrollY !== this._scrollY) {
                this._scrollBarOpacity = 255;
                this._scrollBarTimer = 60;
                this._lastScrollY = this._scrollY;
            }
            if (this._scrollBarTimer > 0) {
                this._scrollBarTimer--;
            } else if (this._scrollBarOpacity > 0) {
                this._scrollBarOpacity -= 15;
            }
        }

        checkToggleClose() {
            if (Config.shortcutKey && Input.isTriggered('hakubox_history')) {
                SoundManager.playCancel();
                this.processCancel();
            } else if (TouchInput.isCancelled()) {
                SoundManager.playCancel();
                this.processCancel();
            }
        }

        drawTextExWrap(text, x, y, width) {
            const textState = this.createTextState(text, x, y, width);
            
            // 新增逻辑：如果是英文环境，启用单词换行模式
            const isEnglish = (typeof TranslateUtils !== 'undefined' && TranslateUtils.currentLanguage == "en-US");
            if (isEnglish) {
                this.processEnglishWrap(textState);
            } else {
                // 原有逻辑（逐字换行，适用于中文等）
                while (textState.index < textState.text.length) {
                    this.processCharacterWrap(textState);
                }
            }
            
            return textState.outputWidth;
        }
        // 新增：专门处理英文单词换行的逻辑
        processEnglishWrap(textState) {
            while (textState.index < textState.text.length) {
                const char = textState.text[textState.index];
                // 1. 如果是控制字符，直接处理 (如 \c[n], \n)
                if (char.charCodeAt(0) < 0x20) {
                    this.flushTextState(textState);
                    this.processControlCharacter(textState, textState.text[textState.index++]);
                    continue;
                }
                // 2. 识别单词：定位下一个空格或结束位置
                // 如果当前是空格，直接按普通字符处理
                if (char === ' ') {
                    this.processCharacterWrap(textState);
                    continue;
                }
                // 3. 预判整个单词的宽度
                let word = "";
                let i = textState.index;
                let wordWidth = 0;
                while (i < textState.text.length) {
                    const nextChar = textState.text[i];
                    // 遇到空格、控制字符或换行符，视为单词结束
                    if (nextChar === ' ' || nextChar.charCodeAt(0) < 0x20) break;
                    
                    word += nextChar;
                    const w = this.textWidth(nextChar);
                    wordWidth += w;
                    i++;
                }
                // 4. 判断是否需要换行
                // 如果 (当前位置 + 单词总宽 > 边界) 且 (不是行首)，则强制换行
                if (textState.x + wordWidth > textState.startX + textState.width && textState.x > textState.startX) {
                    textState.x = textState.startX;
                    textState.y += textState.height;
                }
                // 5. 逐个绘制单词中的字符（因为processControlCharacter等内部状态依赖逐字步进）
                // 这里我们知道单词肯定能放下了（或者刚换完行），所以直接调用普通绘制即可
                // word.length 次循环
                const endIndex = textState.index + word.length;
                while (textState.index < endIndex) {
                     // 调用原有的绘制逻辑，但因为已经预判过换行，processCharacterWrap 内部的换行判断通常不会触发，
                     // 除非单词本身长度就超过了整行宽度（那种情况只能强行拆分）
                     this.processCharacterWrap(textState);
                }
            }
        }
        processCharacterWrap(textState) {
            // 注意：这里需要稍微修改一下原有的 processCharacterWrap 
            // 使得它在被 processEnglishWrap 调用时，不会重复进行多余的换行逻辑干扰
            // 但为了保持兼容性，我们保留原有逻辑，仅依靠 textState.x 的预先调整来控制
            const c = textState.text[textState.index++];
            
            if (c.charCodeAt(0) < 0x20) {
                this.flushTextState(textState);
                this.processControlCharacter(textState, c);
                return;
            }
            
            const w = this.textWidth(c);
            
            // 自动换行判断
            // 英文模式下，外部已经处理过 textState.x 的重置，这里主要是兜底（比如超长单词）
            if (textState.x + w > textState.startX + textState.width && textState.x > textState.startX) {
                textState.x = textState.startX;
                textState.y += textState.height;
            }
            
            this.contents.drawText(c, textState.x, textState.y, w * 2, textState.height);
            textState.x += w;
        }

        drawItem(index) {
            const record = $gameSystem.getHistoryLogs()[index];
            if (!record) return;
            
            const rect = this.itemRect(index);
            const p = Config.padding;
            
            // 计算内部绘制区域（去掉了 padding）
            const innerRect = new Rectangle(
                rect.x + p,
                rect.y + p,
                rect.width - p * 2,
                rect.height - p * 2
            );

            // 1. 绘制条目背景（通用半透黑）
            this.contents.fillRect(innerRect.x, innerRect.y, innerRect.width, innerRect.height, "rgba(0, 0, 0, 0.3)");
            
            // 获取配置的模板
            const template = Config.templates[record.templateId];

            // 2. 绘制背景图片 (如果模板里有配)
            if (template && template.backImage) {
                const bm = ImageManager.loadPicture(template.backImage);
                if (bm.isReady()) {
                    this.contents.blt(bm, 0, 0, bm.width, bm.height, innerRect.x, innerRect.y, innerRect.width, innerRect.height);
                }
            }

            // 3. 绘制时间戳 (右上角，独立于内容)
            if (Config.showTimestamp && record.timestampStr) {
                this.contents.fontSize = 18;
                this.changeTextColor(ColorManager.systemColor());
                // 这里用 rect.width 而不是 innerRect，为了稍微靠边一点好看
                this.drawText(record.timestampStr, rect.x, innerRect.y + 2, rect.width - p - 4, 'right'); 
                this.resetFontSettings();
            }

            // ==========================================
            //  分支 A: 专门处理对话 (Dialogue)
            // ==========================================
            if (record.templateId === 'dialogue') {
                const c = record.content || {}; // 这里的 content 是 object {text, name, face...}
                
                let textX = innerRect.x;
                const faceSize = ImageManager.faceWidth;

                // A-1. 绘制头像
                if (c.faceName) {
                    this.drawFace(c.faceName, c.faceIndex, textX, innerRect.y, faceSize, faceSize);
                    textX += faceSize + 10; // 文字向右偏移
                }

                // A-2. 准备绘制文字的区域宽度
                const textW = (innerRect.x + innerRect.width) - textX - Config.padding * 2;
                let curY = innerRect.y;

                // A-3. 绘制名字 (如果有)
                if (c.name) {
                    // 使用配置的名字大小和颜色
                    this.contents.fontSize = Config.nameFontSize || $gameSystem.mainFontSize();
                    
                    if (Config.nameColor.startsWith("#")) this.changeTextColor(Config.nameColor);
                    else this.changeTextColor(ColorManager.textColor(Number(Config.nameColor)));
                    
                    this.drawText(c.name, textX + Config.padding, curY, textW);
                    this.resetTextColor();
                    
                    curY += this.lineHeight() * 0.8; //稍微换行
                }

                // A-4. 绘制对话内容
                this.contents.fontSize = Config.templates.dialogue.fontSize || $gameSystem.mainFontSize(); // 恢复默认字号
                
                if (Config.templates.dialogue.color.startsWith("#")) this.changeTextColor(Config.templates.dialogue.color);
                else this.changeTextColor(ColorManager.textColor(Number(Config.templates.dialogue.color)));
                this.drawTextExWrap(TranslateUtils.getText(c.text), textX + Config.padding, curY, textW);
                
                return; // *** 关键：处理完对话直接返回，不走下面的通用逻辑 ***
            }

            // ==========================================
            //  分支 B: 通用模板处理 (Map, Itme, Choice...)
            // ==========================================
            if (template) {
                // 读取模板配置
                this.contents.fontSize = template.fontSize || 22;
                
                if (template.color && template.color.startsWith("#")) {
                    this.changeTextColor(template.color);
                } else {
                    this.changeTextColor(ColorManager.textColor(Number(template.color || 0)));
                }
                
                // 处理文本格式：将 $1, $2 替换为参数
                let textToShow = TranslateUtils.getText(template.format || "");
                const c = record.content || {}; // 这里的 content 可能是 {arg1: "...", arg2: "..."}

                // 安全替换 $1-$9
                textToShow = textToShow.replace(/\$(\d+)/g, (match, number) => {
                    const key = 'arg' + number;
                    return TranslateUtils.getText(c[key] || "");
                });
                
                // 计算垂直居中 Y
                // 简单的单行居中算法
                const textHeight = this.lineHeight(); // 使用系统行高更稳妥
                const centerY = innerRect.y + (innerRect.height - textHeight) / 2;

                // 根据对齐方式绘制
                if (template.align === 'left') {
                    this.drawTextExWrap(textToShow, innerRect.x + Config.padding, centerY, innerRect.width - Config.padding * 2);
                } else {
                    // 居中或右对齐不支持控制符，使用标准绘制
                    this.drawText(textToShow, innerRect.x, centerY, innerRect.width, template.align);
                }
                
                this.resetTextColor();
                this.resetFontSettings();
            } else {
                // 如果找不到模板ID (容错)
                this.changeTextColor(ColorManager.deathColor());
                this.drawText("Error: No Template for " + record.templateId, innerRect.x, innerRect.y, innerRect.width, 'center');
                this.resetTextColor();
            }
        }
        
        isCurrentItemEnabled() {
            return true;
        }
    }

    // ======================================================================
    // 6. 场景 (Scene) & 悬浮按钮 (Floating Button)
    // ======================================================================

    class Scene_HakuboxHistory extends Scene_MenuBase {
        create() {
            super.create();
            this.createWindow();
            this.createScrollButton();
        }

        createWindow() {
            this._histWindow = new Window_HakuboxHistory(new Rectangle(0, 0, Graphics.boxWidth, Graphics.boxHeight));
            this._histWindow.setHandler('cancel', this.popScene.bind(this));
            this.addWindow(this._histWindow);
        }

        createScrollButton() {
            this._scrollBtn = new Sprite_HistoryScrollButton();
            const btnSize = 56;
            this._scrollBtn.x = (Graphics.width + Graphics.boxWidth) / 2 - 50; // 稍微往里靠一点，防止贴边
            this._scrollBtn.y = Graphics.boxHeight - btnSize - 20; // 底部留空隙
            this._scrollBtn.setClickHandler(this.onScrollBtnClick.bind(this));
            this.addChild(this._scrollBtn);
        }

        update() {
            super.update();
            this.updateScrollButtonState();

            
        }

        // 优化：动态检测是否需要显示下滚按钮
        updateScrollButtonState() {
            if (!this._histWindow || !this._scrollBtn) return;
            
            // 如果已经在最底部 (当前ScrollY 接近 maxScrollY)
            const win = this._histWindow;
            const threshold = 10;
            const atBottom = win._scrollY >= (win.maxScrollY() - threshold);
            const needsScroll = win.maxScrollY() > 0;

            // 如果不在底部且有内容可滚，则显示
            if (!atBottom && needsScroll) {
                this._scrollBtn.opacity += 25;
                this._scrollBtn.visible = true;
            } else {
                this._scrollBtn.opacity -= 25;
                if (this._scrollBtn.opacity <= 0) this._scrollBtn.visible = false;
            }
        }

        onScrollBtnClick() {
            if (this._histWindow) {
                const max = this._histWindow.maxItems();
                if (max > 0) {
                    this._histWindow.select(max - 1);
                    this._histWindow.startSmoothScrollTo(this._histWindow.maxScrollY());
                    SoundManager.playCursor(); 
                    this._histWindow.activate();
                }
            }
        }
    }

    // --- 自定义悬浮按钮类 (保持不变或微调样式) ---
    class Sprite_HistoryScrollButton extends Sprite_Clickable {
        initialize() {
            super.initialize();
            this._clickHandler = null;
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
            this.createBitmap();
        }

        createBitmap() {
            const size = 56;
            this.bitmap = new Bitmap(size, size);
            
            const ctx = this.bitmap.context;
            const center = size / 2;

            ctx.fillStyle = "rgba(255, 255, 255, 0.9)"; 
            ctx.shadowColor = "rgba(0,0,0,0.5)";
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(center, center, center - 4, 0, Math.PI*2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            ctx.fillStyle = "#333333";
            ctx.font = "bold 28px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("▼", center, center + 2); 
        }

        onClick() {
            if (this._clickHandler) {
                this._clickHandler();
            }
        }

        onPress() {
            this.scale.x = 0.9;
            this.scale.y = 0.9;
        }

        update() {
            super.update();
            if (!this.isPressed()) {
                const target = 1.0;
                this.scale.x += (target - this.scale.x) * 0.2;
                this.scale.y += (target - this.scale.y) * 0.2;
            }
        }

        setClickHandler(method) {
            this._clickHandler = method;
        }
    }

    // ======================================================================
    // 7. 插件指令注册与导出
    // ======================================================================
    
    PluginManager.registerCommand(pluginName, "addLog", args => {
        $gameSystem.addHistoryLog(args.templateId, { arg1: args.arg1, arg2: args.arg2 });
    });
    PluginManager.registerCommand(pluginName, "openHistory", () => Hakubox.HistoryLog.open());
    PluginManager.registerCommand(pluginName, "clearLog", () => $gameSystem._hakuboxHistory = []);

    Hakubox.HistoryLog = {
        getAll() {
            return $gameSystem._hakuboxHistory;
        },
        open() { SceneManager.push(Scene_HakuboxHistory); },
        addLog(tid, data) { $gameSystem.addHistoryLog(tid, data); },
        clear() { $gameSystem._hakuboxHistory = []; }
    };

})();