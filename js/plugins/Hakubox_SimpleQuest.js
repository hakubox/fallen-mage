/*:
 * @target MZ
 * @plugindesc [v3.1] 高级HUD任务系统 (Auto-Condition & Limits)
 * @author hakubox
 * @help
 * 
 * ============================================================================
 * Hakubox Simple Quest System (Hakubox_SimpleQuest.js)
 * ============================================================================
 * 这是一个基于“模板-实例”架构的任务系统。配置是模板，接任务是创建实例。
 * 
 * [v3.1更新]
 * 1. 动态刷新：现在会每30帧检测一次显示条件，条件满足时自动显示/隐藏。
 * 2. 领取限制：支持设置单个任务的最大领取次数（例如：一次性任务）。
 * 3. API增强：提供了查询任务状态和历史记录的脚本函数。
 *
 * 【核心变量占位符】
 * 在任务标题、描述中可以使用以下占位符：
 * {current} - 当前进度值
 * {max}     - 最大进度值
 * 
 * 例如标题配置为： "收集史莱姆粘液 ({current}/{max})"
 *
 * 【脚本指令 (Script Calls) - 用于条件分歧】
 * 
 * 1. 判断玩家当前是否正在做某任务 (ID: quest_01)
 *    SimpleQuest.isActive("quest_01")
 *    -> 返回 true/false
 * 
 * 2. 判断玩家是否曾经接触过某任务 (无论正在做、完成还是失败)
 *    SimpleQuest.hasHistory("quest_01")
 *    -> 返回 true/false
 *
 * 3. 获取玩家领取某任务的总次数
 *    SimpleQuest.countHistory("quest_01")
 *    -> 返回 数字 (0, 1, 2...)
 *
 * ============================================================================
 * @param ---HUD外观基础---
 *
 * @param hudX
 * @text X坐标
 * @type number
 * @default 10
 *
 * @param hudY
 * @text Y坐标
 * @type number
 * @default 10
 *
 * @param hudWidth
 * @text 列表最大宽度
 * @type number
 * @default 320
 *
 * @param maxRunningQuests
 * @text 全局最大同时领取数量
 * @desc 玩家身上同时存在的任务总数上限(-1为不限制)。
 * @type number
 * @min -1
 * @default -1
 *
 * @param itemPadding
 * @text 任务内容内边距
 * @type number
 * @default 8
 *
 * @param sectionSpacing
 * @text 分组垂直间距
 * @type number
 * @default 24
 *
 * @param ---背景与圆角---
 *
 * @param showListBackground
 * @text 是否显示整体背景
 * @type boolean
 * @default true
 * 
 * @param listBackgroundColor
 * @text 整体背景色(Hex/RGBA)
 * @type string
 * @default rgba(0, 0, 0, 0.5)
 *
 * @param headerBackgroundColor
 * @text 分组标题背景色
 * @type string
 * @default rgba(0, 0, 0, 0.6)
 *
 * @param borderRadius
 * @text 圆角度数
 * @type number
 * @default 8
 *
 * @param ==== 文字效果 ====
 * 
 * @param fontOutlineWidth
 * @text 文字描边宽度
 * @type number
 * @default 3
 * 
 * @param fontShadowDistance
 * @text 文字阴影距离
 * @desc 0为不显示阴影
 * @type number
 * @default 1
 * 
 * @param fontOutlineColor
 * @text 文字描边/阴影颜色
 * @desc 格式：#000000 或 rgba(0,0,0,0.8)。
 * @type string
 * @default #000000
 *
 * @param ==== 显示控制 ====
 *
 * @param visibleSwitchId
 * @text 显示开关ID
 * @desc 指定一个开关ID(1, 2...)。若设置不为0，则该开关开启时显示，关闭时隐藏。
 * @type switch
 * @default 0
 *
 * @param ==== 全局音效配置 ====
 * @desc 如果任务模板里没配音频，则使用这里的默认音频。
 *
 * @param seAccept
 * @text [默认] 接取音效
 * @type file
 * @dir audio/se/
 *
 * @param seSuccess
 * @text [默认] 成功音效
 * @type file
 * @dir audio/se/
 *
 * @param seFail
 * @text [默认] 失败音效
 * @type file
 * @dir audio/se/
 *
 * @param ==== 状态前缀文本 ====
 *
 * @param textRunning
 * @text [进行中] 前缀
 * @type string
 * @default 【进行中】
 *
 * @param colorRunning
 * @text [进行中] 颜色
 * @type number
 * @default 0
 *
 * @param textSuccess
 * @text [成功] 前缀
 * @type string
 * @default 【可提交】
 *
 * @param colorSuccess
 * @text [成功] 颜色
 * @type number
 * @default 3
 *
 * @param textFail
 * @text [失败] 前缀
 * @type string
 * @default 【已失败】
 *
 * @param colorFail
 * @text [失败] 颜色
 * @type number
 * @default 10
 *
 * @param ==== 数据配置 ====
 *
 * @param categoryList
 * @text 1. 分组类型配置
 * @type struct<Category>[]
 * @desc 定义任务分组（主线、支线等）。
 * @default ["{\"id\":\"main\",\"name\":\"◆ 主线剧情\",\"color\":\"6\",\"priority\":\"1\"}","{\"id\":\"sub\",\"name\":\"◆ 支线任务\",\"color\":\"0\",\"priority\":\"2\"}"]
 *
 * @param questTemplates
 * @text 2. 任务库
 * @type struct<QuestTemplate>[]
 * @desc 所有的任务母版数据。
 * @default []
 *
 * @command AddQuest
 * @text 接受任务
 * @desc 基于任务ID创建一个新任务实例。
 * @arg templateId
 * @text 任务ID
 * @type string
 *
 * @command AddProgress
 * @text 增加进度
 * @desc 增加指定任务的进度值。如果达到最大值会自动变为成功状态。
 * @arg templateId
 * @text 任务ID
 * @type string
 * @arg value
 * @text 增加量
 * @type number
 * @min 1
 * @default 1
 * 
 * @command SetProgress
 * @text 设置进度
 * @desc 直接设置指定任务的进度值。
 * @arg templateId
 * @text 任务ID
 * @type string
 * @arg value
 * @text 设置数值
 * @type number
 * @min 0
 * @default 0
 *
 * @command SetStatus
 * @text 设置任务状态
 * @desc 修改该任务ID下最新接取的那个任务的状态。
 * @arg templateId
 * @text 任务ID
 * @type string
 * @arg status
 * @text 新状态
 * @type select
 * @option 成功(待提交)
 * @value success
 * @option 失败
 * @value fail
 * @option 完成(归档消失)
 * @value complete
 *
 * @command UpdateDesc
 * @text 更新描述
 * @desc 修改该任务ID下最新接取的那个任务的描述文本。
 * @arg templateId
 * @text 任务ID
 * @type string
 * @arg desc
 * @text 新描述内容
 * @type multiline_string
 */

/*~struct~Category:
 * @param id
 * @text 类型ID
 * @desc 唯一标识，如 main, sub
 * @type string
 *
 * @param name
 * @text 分组显示名称
 * @type string
 *
 * @param color
 * @text 标题颜色索引
 * @type number
 * @default 0
 *
 * @param priority
 * @text 排序优先级
 * @type number
 * @default 1
 * @desc 数字越小越靠前
 */

/*~struct~QuestTemplate:
 * @param id
 * @text 任务ID
 * @desc 调用指令时用的ID。
 * @type string
 * 
 * @param r
 * @text 备注
 * @desc 调用指令时用的ID。
 * @type string
 *
 * @param typeId
 * @text 所属类型ID
 * @desc 对应分组配置里的ID。
 * @type combo
 * @option main
 * @option sub
 * @default main
 *
 * @param maxRepeat
 * @text 最大领取次数
 * @desc 该任务限制领取的总次数（含失败）。-1为无限。
 * @type number
 * @min -1
 * @default -1
 *
 * @param condition
 * @text 显示条件(JS代码)
 * @type string
 * @desc 返回true显示，false隐藏。为空则始终显示。
 * @default 
 *
 * @param title
 * @text 任务标题
 * @type string
 * @desc 支持 {current} {max} 占位符。
 *
 * @param maxProgress
 * @text 最大进度值
 * @type number
 * @min 1
 * @default 1
 * @desc 例如搜集10个物品，这里填10。若只是对话任务，默认为1。
 * 
 * @param desc
 * @text 初始描述
 * @type multiline_string
 * @desc 支持多行和 {current} {max}。
 *
 * @param rewardText
 * @text 奖励说明
 * @desc 显示在标题右侧（或下一行右侧）的简短文本。
 * @type string
 *
 * @param seAccept
 * @text [音效] 接取时
 * @type file
 * @dir audio/se/
 * 
 * @param seSuccess
 * @text [音效] 成功时
 * @type file
 * @dir audio/se/
 * 
 * @param seFail
 * @text [音效] 失败时
 * @type file
 * @dir audio/se/
 *
 * @param onAccept
 * @text [脚本] 接受时执行
 * @type multiline_string
 * @desc 变量 quest 可访问当前实例。
 *
 * @param onSuccess
 * @text [脚本] 成功时执行
 * @type multiline_string
 *
 * @param onFail
 * @text [脚本] 失败时执行
 * @type multiline_string
 *
 * @param onComplete
 * @text [脚本] 完成时执行
 * @type multiline_string
 */

(() => {
    const PLUGIN_NAME = "Hakubox_SimpleQuest";
    const PARAMS = PluginManager.parameters(PLUGIN_NAME);

    // ======================================================================
    // 0. 工具函数与配置解析
    // ======================================================================

    function parseStructList(jsonStr) {
        if (!jsonStr) return [];
        try {
            const list = JSON.parse(jsonStr);
            const result = [];
            for (let i = 0; i < list.length; i++) {
                result.push(JSON.parse(list[i]));
            }
            return result;
        } catch (e) {
            console.error(PLUGIN_NAME + ": JSON Parse Error", e);
            return [];
        }
    }

    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function playSe(filename) {
        if (filename) {
            AudioManager.playSe({ name: filename, volume: 90, pitch: 100, pan: 0 });
        }
    }

    const CONFIG = {
        x: Number(PARAMS['hudX'] || 10),
        y: Number(PARAMS['hudY'] || 10),
        width: Number(PARAMS['hudWidth'] || 320),
        maxRunningQuests: Number(PARAMS['maxRunningQuests'] || 5),
        itemPadding: Number(PARAMS['itemPadding'] || 8),
        sectionSpacing: Number(PARAMS['sectionSpacing'] || 24),
        
        showBg: PARAMS['showListBackground'] === 'true',
        bgColor: PARAMS['listBackgroundColor'] || 'rgba(0,0,0,0.5)',
        headerBgColor: PARAMS['headerBackgroundColor'] || 'rgba(0,0,0,0.6)',
        borderRadius: Number(PARAMS['borderRadius'] || 8),
        
        outlineWidth: Number(PARAMS['fontOutlineWidth'] || 3),
        shadowDist: Number(PARAMS['fontShadowDistance'] || 1),
        outlineColor: PARAMS['fontOutlineColor'] || '#000000',
        visibleSwitchId: Number(PARAMS['visibleSwitchId'] || 0),

        globalSe: {
            accept: PARAMS['seAccept'],
            success: PARAMS['seSuccess'],
            fail: PARAMS['seFail']
        },

        statusText: {
            0: { text: PARAMS['textRunning'], color: Number(PARAMS['colorRunning']) },
            1: { text: PARAMS['textSuccess'], color: Number(PARAMS['colorSuccess']) },
            2: { text: PARAMS['textFail'], color: Number(PARAMS['colorFail']) },
        },
        categories: parseStructList(PARAMS['categoryList']).sort((a, b) => Number(a.priority) - Number(b.priority)),
        templates: {}
    };

    // 构建任务 Map
    const tempArr = parseStructList(PARAMS['questTemplates']);
    for (let i = 0; i < tempArr.length; i++) {
        const t = tempArr[i];
        let _desc = t.desc || '';
        
        let _condFunc = null;
        if (t.condition && t.condition.trim() !== "") {
            try {
                _condFunc = new Function("return (" + t.condition + ");");
            } catch (e) {
                console.error("SimpleQuest: Condition Parse Error for " + t.id, e);
            }
        }

        CONFIG.templates[t.id] = {
            id: t.id,
            typeId: t.typeId,
            title: t.title,
            maxProgress: Number(t.maxProgress || 1),
            maxRepeat: parseInt(t.maxRepeat || -1), // 新增：最大重复次数
            conditionFunc: _condFunc,
            desc: _desc || "",
            rewardText: t.rewardText,
            
            seAccept: t.seAccept || CONFIG.globalSe.accept,
            seSuccess: t.seSuccess || CONFIG.globalSe.success,
            seFail: t.seFail || CONFIG.globalSe.fail,

            onAccept: t.onAccept || "",
            onSuccess: t.onSuccess || "",
            onFail: t.onFail || "",
            onComplete: t.onComplete || ""
        };
    }

    const Q_STATUS = {
        RUNNING: 0,
        SUCCESS: 1, 
        FAIL: 2,
        COMPLETE: 3
    };

    // ======================================================================
    // 1. 全局管理器 (Window Context) & Utilities
    // ======================================================================

    window.SimpleQuest = {
        
        // --- 核心操作 ---

        addQuest(templateId) {
            const template = CONFIG.templates[templateId];
            if (!template) {
                console.warn(PLUGIN_NAME + ": Template not found: " + templateId);
                return null;
            }

            // 1. 检查单一任务的领取次数限制
            if (template.maxRepeat !== -1) {
                const historyCount = this.countHistory(templateId);
                // 注意：这里用 >= 是因为 countHistory 包含当前正在进行的
                // 如果是“只允许做1次”，此时historyCount如果已经是1(比如正在做)，就不让做了？
                // 逻辑应该是：允许接取的前提是 (历史总数 < 上限)。
                // 因为接取时，countHistory 还没有+1 (实例还没加进去)。
                if (historyCount >= template.maxRepeat) {
                    console.log(PLUGIN_NAME + ": Quest template limit reached for " + templateId);
                    return null;
                }
            }

            // 2. 检查全局正在进行的任务数量限制
            if (CONFIG.maxRunningQuests !== -1) {
                const runningCount = $gameSystem.countRunningQuests();
                if (runningCount >= CONFIG.maxRunningQuests) {
                    console.log(PLUGIN_NAME + ": Global Active Quest limit reached.");
                    return null;
                }
            }

            const uuid = generateUUID();

            const instance = {
                uuid: uuid,
                templateId: templateId,
                typeId: template.typeId,
                title: template.title,
                desc: template.desc,
                status: Q_STATUS.RUNNING,
                progress: 0, 
                maxProgress: template.maxProgress, 
                timestamp: Date.now()
            };

            $gameSystem.addQuestInstance(instance);
            playSe(template.seAccept);
            this._evalCode(template.onAccept, instance);
            return uuid;
        },

        setStatusByUuid(uuid, status) {
            const instance = $gameSystem.getQuestByUuid(uuid);
            if (!instance) return;
            if (instance.status === status) return;

            instance.status = status;

            if ((status === Q_STATUS.SUCCESS || status === Q_STATUS.COMPLETE) && instance.progress < instance.maxProgress) {
                instance.progress = instance.maxProgress;
            }

            const template = CONFIG.templates[instance.templateId];
            
            if (status === Q_STATUS.SUCCESS) playSe(template.seSuccess);
            else if (status === Q_STATUS.FAIL) playSe(template.seFail);

            $gameSystem.requestHudRefresh();

            if (template) {
                if (status === Q_STATUS.SUCCESS) this._evalCode(template.onSuccess, instance);
                else if (status === Q_STATUS.FAIL) this._evalCode(template.onFail, instance);
                else if (status === Q_STATUS.COMPLETE) this._evalCode(template.onComplete, instance);
            }
        },

        setLatestStatus(templateId, status) {
            const instance = $gameSystem.getLatestInstance(templateId);
            if (instance) {
                this.setStatusByUuid(instance.uuid, status);
            } else {
                console.warn("No active instance found for template: " + templateId);
            }
        },

        setLatestProgress(templateId, value) {
            const instance = $gameSystem.getLatestInstance(templateId);
            if (!instance) return;

            if (instance.status === Q_STATUS.FAIL || instance.status === Q_STATUS.COMPLETE) return;

            let newVal = value;
            if (newVal < 0) newVal = 0;
            if (newVal > instance.maxProgress) newVal = instance.maxProgress;

            instance.progress = newVal;

            if (instance.progress >= instance.maxProgress && instance.status === Q_STATUS.RUNNING) {
                this.setStatusByUuid(instance.uuid, Q_STATUS.SUCCESS);
            } else {
                $gameSystem.requestHudRefresh(); 
            }
        },

        addLatestProgress(templateId, amount) {
            const instance = $gameSystem.getLatestInstance(templateId);
            if (instance) {
                this.setLatestProgress(templateId, instance.progress + amount);
            }
        },

        updateLatestDesc(templateId, newDesc) {
            const instance = $gameSystem.getLatestInstance(templateId);
            if (instance) {
                instance.desc = newDesc;
                $gameSystem.requestHudRefresh();
            }
        },

        removeLatest(templateId) {
            const instance = $gameSystem.getLatestInstance(templateId);
            if (instance) {
                $gameSystem.removeQuestInstance(instance.uuid);
            }
        },

        refresh() {
            $gameSystem.requestHudRefresh();
        },

        // --- 查询 API (Utility Functions) ---

        /**
         * 判断任务是否处在“活跃”状态 (进行中 或 成功待提交)
         * @param {string} templateId 
         * @returns {boolean}
         */
        isActive(templateId) {
            const instance = $gameSystem.getLatestInstance(templateId);
            // getLatestInstance 会忽略 COMPLETE 的，但我们需要明确 RUNNING 或 SUCCESS
            if (instance && (instance.status === Q_STATUS.RUNNING || instance.status === Q_STATUS.SUCCESS)) {
                return true;
            }
            return false;
        },

        /**
         * 判断玩家是否曾经有关于这个任务的记录 (无论现在是什么状态)
         * @param {string} templateId 
         * @returns {boolean}
         */
        hasHistory(templateId) {
            return this.countHistory(templateId) > 0;
        },

        /**
         * 获取该任务被领取的总次数 (包含正在进行、完成、失败的所有历史)
         * @param {string} templateId 
         * @returns {number}
         */
        countHistory(templateId) {
            let count = 0;
            const allQuests = $gameSystem.getAllQuests(); // 访问原始数组
            if (!allQuests) return 0;
            
            for (let i = 0; i < allQuests.length; i++) {
                if (allQuests[i].templateId === templateId) {
                    count++;
                }
            }
            return count;
        },

        // --- 内部 helper ---

        _evalCode(code, questInstance) {
            if (!code || code.trim() === "") return;
            const quest = questInstance; 
            try {
                eval(code);
            } catch (e) {
                console.error("SimpleQuest Script Error:", e);
            }
        }
    };

    // ======================================================================
    // 2. 存档数据扩展 (Game_System)
    // ======================================================================

    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function () {
        _Game_System_initialize.call(this);
        this._questInstances = []; 
        this._questHudVisible = true;
        this._questHudDirty = true;
    };

    Game_System.prototype.addQuestInstance = function (instance) {
        this._questInstances.push(instance);
        this.requestHudRefresh();
    };

    Game_System.prototype.removeQuestInstance = function (uuid) {
        for (let i = 0; i < this._questInstances.length; i++) {
            if (this._questInstances[i].uuid === uuid) {
                this._questInstances.splice(i, 1);
                this.requestHudRefresh();
                return;
            }
        }
    };

    Game_System.prototype.countRunningQuests = function () {
        let count = 0;
        for (let i = 0; i < this._questInstances.length; i++) {
            const q = this._questInstances[i];
            if (q.status === Q_STATUS.RUNNING || q.status === Q_STATUS.SUCCESS) {
                count++;
            }
        }
        return count;
    };

    Game_System.prototype.getAllQuests = function () {
        return this._questInstances;
    };

    Game_System.prototype.getQuestByUuid = function (uuid) {
        for (let i = 0; i < this._questInstances.length; i++) {
            if (this._questInstances[i].uuid === uuid) return this._questInstances[i];
        }
        return null;
    };

    Game_System.prototype.getLatestInstance = function (templateId) {
        for (let i = this._questInstances.length - 1; i >= 0; i--) {
            if (this._questInstances[i].templateId === templateId) {
                if (this._questInstances[i].status !== Q_STATUS.COMPLETE) {
                    return this._questInstances[i];
                }
            }
        }
        return null;
    };

    // 该方法仅获取“应该在HUD中显示”的数据，不负责过滤Condition
    // Condition过滤转移到 HUD update 中动态处理
    Game_System.prototype.getHudData = function () {
        const groups = {};
        for (let i = 0; i < CONFIG.categories.length; i++) {
            groups[CONFIG.categories[i].id] = {
                meta: CONFIG.categories[i],
                items: []
            };
        }

        for (let i = 0; i < this._questInstances.length; i++) {
            const q = this._questInstances[i];
            
            // 已归档不显示
            if (q.status === Q_STATUS.COMPLETE) continue;

            if (groups[q.typeId]) {
                groups[q.typeId].items.push(q);
            } else {
                if (!groups['_other']) groups['_other'] = { meta: { name: "其他", color: 0 }, items: [] };
                groups['_other'].items.push(q);
            }
        }

        return groups;
    };

    Game_System.prototype.requestHudRefresh = function () {
        this._questHudDirty = true;
    };

    // ======================================================================
    // 3. 核心显示组件 (Sprite_QuestHUD)
    // ======================================================================
    class Sprite_QuestHUD extends Sprite {
        constructor() {
            super();
            this.createBitmap();
            this._checkTimer = 0;
            this._lastVisibleState = ""; 
            this._targetOpacity = 255; // 目标不透明度
        }

        createBitmap() {
            this.bitmap = new Bitmap(Graphics.width, Graphics.height);
        }

        update() {
            super.update();
            
            // 1. 处理基础可见性 (事件中隐藏 / 战斗中隐藏 / 开关控制)
            this.updateVisibility();

            // 如果已经隐藏，就不跑后面的逻辑了
            if (!this.visible) return;

            // 2. 处理鼠标/玩家接触后的透明度渐变
            this.updateOpacityInteraction();

            // 3. 动态条件检测 (每30帧一次)
            this._checkTimer++;
            if (this._checkTimer >= 15) {
                this._checkTimer = 0;
                this.checkVisibilityCondition();
            }

            if ($gameSystem._questHudDirty) {
                this.refresh();
                $gameSystem._questHudDirty = false;
            }
        }

        updateVisibility() {
            // 新增：开关控制 (优先级最高，如果开关关闭，直接隐藏)
            if (CONFIG.visibleSwitchId && !$gameSwitches.value(CONFIG.visibleSwitchId)) {
                this.visible = false;
                return;
            }

            // 基本逻辑：系统允许 && 非事件流 && 非战斗
            this.visible = $gameSystem._questHudVisible && !$gameMap.isEventRunning() && !$gameParty.inBattle();
        }

        // 新增：检测玩家或鼠标是否并在区域内
        updateOpacityInteraction() {
            // HUD 区域判定
            // 注意：因为我们是根据内容绘制的，背景高度是动态的。
            // 这里为了简单，我们假设高度覆盖到屏幕下半部分或者根据上次绘制的高度。
            // 为了准确，我们在 refresh() 里记录一下真实的 height。
            const hudX = CONFIG.x;
            const hudY = CONFIG.y;
            const hudW = CONFIG.width;
            const hudH = this._contentHeight || 600; // 如果没画过，默认一个值

            // 1. 检测玩家位置 (将瓦片坐标转为屏幕坐标)
            const pX = $gamePlayer.screenX();
            const pY = $gamePlayer.screenY();
            // 简单的矩形碰撞
            const playerIn = pX > hudX && pX < hudX + hudW && pY > hudY && pY < hudY + hudH;

            // 2. 检测鼠标位置
            const mX = TouchInput.x;
            const mY = TouchInput.y;
            const mouseIn = mX > hudX && mX < hudX + hudW && mY > hudY && mY < hudY + hudH;

            // 3. [新增] 检测地图名称显示窗口
            let mapNameActive = false;
            if (SceneManager._scene instanceof Scene_Map && SceneManager._scene._mapNameWindow) {
                const mapW = SceneManager._scene._mapNameWindow;
                // 只有当窗口打开度大于0，且内容不透明度大于0时，才视为正在显示
                if (mapW.openness > 0 && mapW.contentsOpacity > 0) {
                    mapNameActive = true;
                }
            }

            // 逻辑: 如果有干扰，目标透明度降低，否则恢复到 255
            if (playerIn || mouseIn || mapNameActive) {
                this._targetOpacity = 80; 
            } else {
                this._targetOpacity = 255;
            }

            // 渐变处理 (简单的插值)
            if (this.opacity > this._targetOpacity) {
                this.opacity -= 20;
                if (this.opacity < this._targetOpacity) this.opacity = this._targetOpacity;
            } else if (this.opacity < this._targetOpacity) {
                this.opacity += 20;
                if (this.opacity > this._targetOpacity) this.opacity = this._targetOpacity;
            }
        }

        checkVisibilityCondition() {
            const quests = $gameSystem._questInstances;
            let currentVisibleState = "";

            for (const q of quests) {
                if (q.status === 3) continue; // COMPLETE
                
                const tpl = CONFIG.templates[q.templateId];
                let isVisible = true;

                if (tpl && tpl.conditionFunc) {
                    try {
                        isVisible = tpl.conditionFunc.call(window);
                    } catch (e) {
                        isVisible = true; 
                    }
                }
                
                currentVisibleState += q.uuid + ":" + (isVisible ? "1" : "0") + "|";
            }

            if (this._lastVisibleState !== currentVisibleState) {
                this._lastVisibleState = currentVisibleState;
                $gameSystem.requestHudRefresh(); 
            }
        }

        refresh() {
            this.bitmap.clear();

            // 新增：应用全局描边/阴影颜色配置
            this.bitmap.outlineColor = CONFIG.outlineColor;
            
            if (CONFIG.shadowDist > 0) {
                this.bitmap.context.shadowColor = CONFIG.outlineColor; // 使用配置的颜色作为阴影色
                this.bitmap.context.shadowBlur = 4;
                this.bitmap.context.shadowOffsetX = CONFIG.shadowDist;
                this.bitmap.context.shadowOffsetY = CONFIG.shadowDist;
            }

            const dataGroups = $gameSystem.getHudData();
            const sortedKeys = CONFIG.categories.map(c => c.id);
            if (dataGroups['_other']) sortedKeys.push('_other');

            const layoutInfo = [];
            let nonEmptyGroups = 0;
            
            // --- 第一阶段：计算布局和总高度 ---
            let currentTempY = CONFIG.y + CONFIG.itemPadding;

            for (let i = 0; i < sortedKeys.length; i++) {
                const key = sortedKeys[i];
                const group = dataGroups[key];
                if (!group || group.items.length === 0) continue;

                const visibleItems = group.items.filter(q => {
                    const tpl = CONFIG.templates[q.templateId];
                    if (tpl && tpl.conditionFunc) {
                        try { return tpl.conditionFunc.call(window); } 
                        catch (e) { return true; }
                    }
                    return true;
                });

                if (visibleItems.length === 0) continue;

                const groupStartY = currentTempY;
                
                let groupHeight = 32; 
                for (const item of visibleItems) {
                     const h = this.drawTaskItem(item, 0, 0, CONFIG.width - CONFIG.itemPadding * 2, true);
                     groupHeight += h + CONFIG.itemPadding;
                }

                layoutInfo.push({
                    groupMeta: group.meta,
                    items: visibleItems,
                    y: groupStartY,
                    h: groupHeight
                });
                
                nonEmptyGroups++;
                currentTempY += groupHeight + CONFIG.sectionSpacing;
            }
            
            // 记录真实内容高度，供鼠标检测使用
            this._contentHeight = currentTempY - CONFIG.y;

            if (nonEmptyGroups === 0) {
                this._contentHeight = 0;
                return;
            }

            const totalContentHeight = currentTempY - CONFIG.sectionSpacing + CONFIG.itemPadding;

            // --- 第二阶段：绘制背景 (含修改1：渐变背景) ---
            if (CONFIG.showBg) {
                this.drawRoundedRect(
                    CONFIG.x, 
                    CONFIG.y, 
                    CONFIG.width, 
                    totalContentHeight - CONFIG.y, 
                    CONFIG.borderRadius, 
                    CONFIG.bgColor
                );
            }

            // --- 第三阶段：绘制内容 ---
            const dx = CONFIG.x + CONFIG.itemPadding;
            const dw = CONFIG.width - CONFIG.itemPadding * 2;

            for (const layout of layoutInfo) {
                let dy = layout.y;

                this.drawGroupTitle(layout.groupMeta, CONFIG.x, dy, CONFIG.width);
                dy += 32;

                for (const item of layout.items) {
                    const itemH = this.drawTaskItem(item, dx, dy, dw, false);
                    dy += itemH + CONFIG.itemPadding;
                }
            }
        }

        // 修改1: 背景渐变实现
        drawRoundedRect(x, y, w, h, r, color) {
            const ctx = this.bitmap.context;
            ctx.save();
            ctx.beginPath();
            
            // 绘制圆角路径
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + w - r, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + r);
            ctx.lineTo(x + w, y + h - r);
            ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            ctx.lineTo(x + r, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath();
            // --- 修改开始：创建渐变填充 ---
            // 创建从左(x)到右(x+w)的线性渐变
            const gradient = ctx.createLinearGradient(x, y, x + w, y);
            
            // 起始点：使用设定颜色
            gradient.addColorStop(0, color);
            
            // 稍微靠右的位置保持一定可见度，防止文字看不清
            gradient.addColorStop(0.3, color); 
            // 终点：完全透明
            // 注意：这里简单处理为透明。如果color是rgba格式，最好提取rgb值，
            // 但为了兼容性，设为完全透明的任意颜色即可，Canvas会自动处理过渡。
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = gradient;
            // --- 修改结束 ---
            ctx.shadowColor = "transparent";
            ctx.fill();
            ctx.restore();
        }

        drawGroupTitle(meta, x, y, fullWidth) {
            if (CONFIG.headerBgColor) {
                const hx = x + 4;
                const hw = fullWidth - 8;
                this.drawRoundedRect(hx, y, hw, 28, 4, CONFIG.headerBgColor);
            }

            this.bitmap.fontBold = true;
            this.bitmap.fontSize = 16;
            this.bitmap.outlineWidth = CONFIG.outlineWidth;
            this.bitmap.textColor = ColorManager.textColor(Number(meta.color));
            
            if (CONFIG.shadowDist > 0) {
                this.bitmap.context.shadowColor = "rgba(0,0,0,0.8)";
            }
            
            this.bitmap.drawText(meta.name, x + 12, y + 2, fullWidth - 24, 24, "left");
            this.bitmap.fontBold = false;
        }

        processText(text, instance) {
            if (!text) return "";
            return text.replace(/{current}/g, instance.progress)
                       .replace(/{max}/g, instance.maxProgress)
                       .replace(/{remain}/g, instance.maxProgress - instance.progress)
                       .replace(/{percent}/g, Math.floor(instance.progress / instance.maxProgress * 100));
        }

        // 修改2 & 3: 标题换行修复 & 失败删除线
        drawTaskItem(instance, x, y, width, dryRun = false) {
            let cy = y;
            const statusConf = CONFIG.statusText[instance.status] || { text: "", color: 0 };
            const isFailed = (instance.status === 2); // 状态2为失败
            
            const displayTitle = this.processText(instance.title, instance);
            const rewardText = CONFIG.templates[instance.templateId].rewardText;

            // 1. 绘制状态前缀
            this.bitmap.fontSize = 15;
            this.bitmap.outlineWidth = CONFIG.outlineWidth;
            this.bitmap.outlineColor = CONFIG.outlineColor; // 使用配置颜色

            const statusText = statusConf.text;
            const statusWidth = this.bitmap.measureTextWidth(statusText);
            
            if (!dryRun) {
                this.bitmap.textColor = ColorManager.textColor(statusConf.color);
                this.bitmap.drawText(statusText, x, cy, width, 24, "left");
            }

            // 2. 准备绘制标题 (换行修复逻辑)
            const titleFirstLineX = x + statusWidth; 
            const titleMaxW = width - statusWidth; 
            
            this.bitmap.textColor = isFailed ? ColorManager.textColor(8) : ColorManager.normalColor();

            // 构建行数组：第一行跟在前缀后，后续行顶格
            const fullTitleLines = [];
            let remainingText = displayTitle;
            
            // 计算第一行
            let firstLineText = "";
            let i = 0;
            while (i < remainingText.length) {
                if (this.bitmap.measureTextWidth(firstLineText + remainingText[i]) <= titleMaxW) {
                    firstLineText += remainingText[i];
                    i++;
                } else {
                    break;
                }
            }
            fullTitleLines.push(firstLineText);
            remainingText = remainingText.substring(i);

            // 如果还有剩余，按完整宽度切分
            if (remainingText.length > 0) {
                const otherLines = this.wrapText(remainingText, width);
                fullTitleLines.push(...otherLines);
            }

            // 3. 绘制标题循环
            for (let i = 0; i < fullTitleLines.length; i++) {
                const lineStr = fullTitleLines[i];
                const drawX = (i === 0) ? titleFirstLineX : x; 
                const drawW = (i === 0) ? titleMaxW : width;

                if (!dryRun) {
                    this.bitmap.drawText(lineStr, drawX, cy, drawW, 24, "left");

                    // --- 失败状态画删除线 ---
                    if (isFailed) {
                        const lineWidth = this.bitmap.measureTextWidth(lineStr);
                        const ctx = this.bitmap.context;
                        ctx.save();
                        ctx.strokeStyle = this.bitmap.textColor; // 线条颜色同文字
                        ctx.lineWidth = 2;
                        // 清除阴影防止线条太粗
                        ctx.shadowColor = "transparent"; 
                        ctx.beginPath();
                        const lineY = cy + 12; 
                        ctx.moveTo(drawX, lineY);
                        ctx.lineTo(drawX + lineWidth, lineY);
                        ctx.stroke();
                        ctx.restore();
                    }
                }
                
                // 绘制奖励文本 (只在最后一行)
                if (i === fullTitleLines.length - 1 && rewardText) {
                    if (!dryRun) {
                        this.bitmap.fontSize = 14;
                        this.bitmap.textColor = ColorManager.systemColor(); 
                        this.bitmap.drawText(rewardText, x, cy + 2, width, 24, "right");
                        this.bitmap.fontSize = 16; 
                    }
                }
                cy += 24; 
            }

            // 4. 绘制描述
            if (instance.desc) {
                this.bitmap.fontSize = 13;
                this.bitmap.textColor = "rgba(220, 220, 220, 0.9)";
                
                const processDesc = this.processText(instance.desc, instance);
                const descLines = processDesc.split('\n');
                
                for (let l = 0; l < descLines.length; l++) {
                    const rawLine = descLines[l];
                    const wrappedDescLines = this.wrapText(rawLine, width - 10);
                    
                    for (let wl = 0; wl < wrappedDescLines.length; wl++) {
                        if (!dryRun) {
                            this.bitmap.drawText(wrappedDescLines[wl], x + 10, cy, width - 10, 20, "left");
                        }
                        cy += 20;
                    }
                }
            }

            return cy - y; 
        }

        wrapText(text, maxWidth) {
            if (!text) return [];
            const words = text.split(""); 
            let lines = [];
            let currentLine = words[0];

            for (let i = 1; i < words.length; i++) {
                const word = words[i];
                const width = this.bitmap.measureTextWidth(currentLine + word);
                if (width < maxWidth) {
                    currentLine += word;
                } else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }
            lines.push(currentLine);
            return lines;
        }
    }

    // ======================================================================
    // 4. 挂载与场景恢复 (Integration)
    // ======================================================================

    const _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
    Spriteset_Map.prototype.createLowerLayer = function () {
        _Spriteset_Map_createLowerLayer.call(this);
        this.createQuestHud();
    };

    Spriteset_Map.prototype.createQuestHud = function () {
        if (this._questHud) return;
        this._questHud = new Sprite_QuestHUD();
        this.addChild(this._questHud);
        $gameSystem.requestHudRefresh();
    };

    // ======================================================================
    // 5. 插件指令注册
    // ======================================================================

    PluginManager.registerCommand(PLUGIN_NAME, "AddQuest", args => {
        window.SimpleQuest.addQuest(args.templateId);
    });

    PluginManager.registerCommand(PLUGIN_NAME, "SetStatus", args => {
        let s = 0;
        if (args.status === 'success') s = 1;
        else if (args.status === 'fail') s = 2;
        else if (args.status === 'complete') s = 3;

        window.SimpleQuest.setLatestStatus(args.templateId, s);
    });

    PluginManager.registerCommand(PLUGIN_NAME, "AddProgress", args => {
        const val = Number(args.value || 1);
        window.SimpleQuest.addLatestProgress(args.templateId, val);
    });

    PluginManager.registerCommand(PLUGIN_NAME, "SetProgress", args => {
        const val = Number(args.value || 0);
        window.SimpleQuest.setLatestProgress(args.templateId, val);
    });

    PluginManager.registerCommand(PLUGIN_NAME, "UpdateDesc", args => {
        window.SimpleQuest.updateLatestDesc(args.templateId, args.desc);
    });

})();