/*:
 * @target MZ
 * @plugindesc [v2.1] 高级HUD任务系统
 * @author hakubox
 * @help
 * 
 * ============================================================================
 * Hakubox Simple Quest System (Hakubox_SimpleQuest.js)
 * ============================================================================
 * 这是一个基于“模板-实例”架构的任务系统。配置是模板，接任务是创建实例。
 * 
 * [v2.1更新]
 * 新增任务进度支持。现在任务可以设置 0/10 这种搜集进度了。
 *
 * 【核心变更】
 * 1. 允许重复接取相同的任务模板（例如：每日循环任务）。
 * 2. 任务状态分为：0:进行中, 1:成功(未提交), 2:失败, 3:完成(归档/消失)。
 * 3. 自动完成机制：当进度达到最大值时，状态自动变为 1(成功)。
 *
 * 【脚本指令 (Script Calls)】
 * 
 * --- 基础操作 ---
 * 
 * // 1. 接受任务 (返回生成的实例UUID)
 * const uuid = SimpleQuest.addQuest("quest_01"); 
 *
 * // 2. 增加任务进度 (最常用)
 * // 给最新接取的 "quest_01" 增加 1 点进度
 * SimpleQuest.addLatestProgress("quest_01", 1);
 * 
 * // 3. 直接设置进度
 * // 设置最新 "quest_01" 进度为 5
 * SimpleQuest.setLatestProgress("quest_01", 5);
 *
 * // 4. 改变任务状态
 * // status: 0:进行中, 1:成功, 2:失败, 3:完成
 * // 注意：如果没有达到最大进度强行设置 Success，进度会自动填满。
 * SimpleQuest.setLatestStatus("quest_01", 1);
 *
 * // 5. 更新描述
 * SimpleQuest.updateLatestDesc("quest_01", "新的阶段描述...");
 * 
 * // 6. 删除/放弃任务
 * SimpleQuest.removeLatest("quest_01");
 *
 * ============================================================================
 * @param ---HUD外观设置---
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
 * @param itemPadding
 * @text 任务间距
 * @type number
 * @default 12
 *
 * @param sectionSpacing
 * @text 分组间距
 * @type number
 * @default 24
 *
 * @param showBackground
 * @text 是否显示背景框
 * @type boolean
 * @default false
 *
 * @param backOpacity
 * @text 背景透明度
 * @type number
 * @min 0
 * @max 255
 * @default 128
 *
 * @param ---状态文本配置---
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
 * @param colorProgress
 * @text [进度] 文字颜色
 * @type number
 * @default 14
 * @desc 显示 "{1/5}" 这种进度信息时的文字颜色索引。
 *
 * @param ---数据配置---
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
 * @type note
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
 * @param typeId
 * @text 所属类型ID
 * @desc 对应分组配置里的ID。
 * @type combo
 * @option main
 * @option sub
 * @default main
 *
 * @param title
 * @text 任务标题
 * @type string
 *
 * @param maxProgress
 * @text 最大进度值
 * @type number
 * @min 1
 * @default 1
 * @desc 例如搜集10个物品，这里填10。若只是对话任务，默认为1。
 * 
 * @param progressFmt
 * @text 进度显示模板
 * @type string
 * @desc 不填则不显示。支持格式：【{current}/{max}只】。
 *
 * @param desc
 * @text 初始描述
 * @type note
 * @desc 支持多行和控制字符。
 *
 * @param rewardText
 * @text 奖励说明
 * @desc 显示在标题右侧的简短文本。
 * @type string
 *
 * @param onAccept
 * @text [脚本] 接受时执行
 * @type note
 * @desc 变量 quest 可访问当前实例。
 *
 * @param onSuccess
 * @text [脚本] 成功时执行
 * @type note
 *
 * @param onFail
 * @text [脚本] 失败时执行
 * @type note
 *
 * @param onComplete
 * @text [脚本] 完成时执行
 * @type note
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

    // 生成唯一UUID
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    const CONFIG = {
        x: Number(PARAMS['hudX'] || 10),
        y: Number(PARAMS['hudY'] || 10),
        width: Number(PARAMS['hudWidth'] || 320),
        itemPadding: Number(PARAMS['itemPadding'] || 12),
        sectionSpacing: Number(PARAMS['sectionSpacing'] || 24),
        showBg: PARAMS['showBackground'] === 'true',
        backOpacity: Number(PARAMS['backOpacity'] || 128),
        colorProgress: Number(PARAMS['colorProgress'] || 14), 
        statusText: {
            0: { text: PARAMS['textRunning'], color: Number(PARAMS['colorRunning']) },
            1: { text: PARAMS['textSuccess'], color: Number(PARAMS['colorSuccess']) },
            2: { text: PARAMS['textFail'], color: Number(PARAMS['colorFail']) },
        },
        categories: parseStructList(PARAMS['categoryList']).sort((a,b) => Number(a.priority) - Number(b.priority)),
        templates: {} // Map结构
    };

    // 构建任务 Map
    const tempArr = parseStructList(PARAMS['questTemplates']);
    for (let i = 0; i < tempArr.length; i++) {
        const t = tempArr[i];
        CONFIG.templates[t.id] = {
            id: t.id,
            typeId: t.typeId,
            title: t.title,
            maxProgress: Number(t.maxProgress || 1), // 默认1
            progressFmt: t.progressFmt || "",        // 默认空
            desc: JSON.parse(t.desc || "\"\""),
            rewardText: t.rewardText,
            onAccept: JSON.parse(t.onAccept || "\"\""),
            onSuccess: JSON.parse(t.onSuccess || "\"\""),
            onFail: JSON.parse(t.onFail || "\"\""),
            onComplete: JSON.parse(t.onComplete || "\"\"")
        };
    }

    // 类定义：任务状态枚举
    const Q_STATUS = {
        RUNNING: 0,
        SUCCESS: 1, // 已达标但未交
        FAIL: 2,
        COMPLETE: 3 // 已交/归档
    };

    // ======================================================================
    // 1. 全局管理器 (Window Context)
    // ======================================================================

    window.SimpleQuest = {
        // --- 核心接口 ---

        // 添加任务 (基于任务模板创建实例)
        addQuest: function(templateId) {
            if (!CONFIG.templates[templateId]) {
                console.warn(PLUGIN_NAME + ": Template not found: " + templateId);
                return null;
            }
            const uuid = generateUUID();
            const template = CONFIG.templates[templateId];

            const instance = {
                uuid: uuid,
                templateId: templateId,
                typeId: template.typeId,
                title: template.title, 
                desc: template.desc,   
                status: Q_STATUS.RUNNING,
                progress: 0, // 当前进度
                maxProgress: template.maxProgress, // 最大进度
                timestamp: Date.now()
            };

            $gameSystem.addQuestInstance(instance);
            this._evalCode(template.onAccept, instance);
            return uuid;
        },

        // 设置指定实例的状态
        setStatusByUuid: function(uuid, status) {
            const instance = $gameSystem.getQuestByUuid(uuid);
            if (!instance) return;
            if (instance.status === status) return;

            instance.status = status;

            // 特殊逻辑：如果是直接设为成功/完成，且进度不满，自动补满
            if ((status === Q_STATUS.SUCCESS || status === Q_STATUS.COMPLETE) && instance.progress < instance.maxProgress) {
                instance.progress = instance.maxProgress;
            }

            $gameSystem.requestHudRefresh();

            const template = CONFIG.templates[instance.templateId];
            if (template) {
                if (status === Q_STATUS.SUCCESS) this._evalCode(template.onSuccess, instance);
                else if (status === Q_STATUS.FAIL) this._evalCode(template.onFail, instance);
                else if (status === Q_STATUS.COMPLETE) this._evalCode(template.onComplete, instance);
            }
        },

        // 设置某任务模板类型下 最新 一个任务的状态
        setLatestStatus: function(templateId, status) {
            const instance = $gameSystem.getLatestInstance(templateId);
            if (instance) {
                this.setStatusByUuid(instance.uuid, status);
            } else {
                console.warn("No active instance found for template: " + templateId);
            }
        },

        // --- 进度控制接口 ---

        // 设置最新任务进度
        setLatestProgress: function(templateId, value) {
            const instance = $gameSystem.getLatestInstance(templateId);
            if (!instance) return;
            
            // 失败或归档的任务不再允许改进度
            if (instance.status === Q_STATUS.FAIL || instance.status === Q_STATUS.COMPLETE) return;

            // 限制范围
            let newVal = value;
            if (newVal < 0) newVal = 0;
            if (newVal > instance.maxProgress) newVal = instance.maxProgress;

            // 设置值
            instance.progress = newVal;

            // 检查是否自动完成
            if (instance.progress >= instance.maxProgress && instance.status === Q_STATUS.RUNNING) {
                this.setStatusByUuid(instance.uuid, Q_STATUS.SUCCESS);
            } else {
                $gameSystem.requestHudRefresh(); // 仅刷新UI
            }
        },

        // 增加最新任务进度
        addLatestProgress: function(templateId, amount) {
            const instance = $gameSystem.getLatestInstance(templateId);
            if (instance) {
                this.setLatestProgress(templateId, instance.progress + amount);
            }
        },

        // 更新描述
        updateLatestDesc: function(templateId, newDesc) {
            const instance = $gameSystem.getLatestInstance(templateId);
            if (instance) {
                instance.desc = newDesc;
                $gameSystem.requestHudRefresh();
            }
        },

        removeLatest: function(templateId) {
            const instance = $gameSystem.getLatestInstance(templateId);
            if (instance) {
                $gameSystem.removeQuestInstance(instance.uuid);
            }
        },

        refresh: function() {
            $gameSystem.requestHudRefresh();
        },

        // 内部执行脚本
        _evalCode: function(code, questInstance) {
            if (!code || code.trim() === "") return;
            const quest = questInstance; // 注入变量名
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
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._questInstances = []; // 存储所有任务实例的数组
        this._questHudVisible = true;
        this._questHudDirty = true;
    };

    Game_System.prototype.addQuestInstance = function(instance) {
        this._questInstances.push(instance);
        this.requestHudRefresh();
    };

    Game_System.prototype.removeQuestInstance = function(uuid) {
        for (let i = 0; i < this._questInstances.length; i++) {
            if (this._questInstances[i].uuid === uuid) {
                this._questInstances.splice(i, 1);
                this.requestHudRefresh();
                return;
            }
        }
    };

    Game_System.prototype.getQuestByUuid = function(uuid) {
        for (let i = 0; i < this._questInstances.length; i++) {
            if (this._questInstances[i].uuid === uuid) return this._questInstances[i];
        }
        return null;
    };

    Game_System.prototype.getLatestInstance = function(templateId) {
        for (let i = this._questInstances.length - 1; i >= 0; i--) {
            if (this._questInstances[i].templateId === templateId) {
                if (this._questInstances[i].status !== Q_STATUS.COMPLETE) {
                    return this._questInstances[i];
                }
            }
        }
        return null;
    };

    Game_System.prototype.getHudData = function() {
        const groups = {};
        for (let i = 0; i < CONFIG.categories.length; i++) {
            groups[CONFIG.categories[i].id] = {
                meta: CONFIG.categories[i],
                items: []
            };
        }

        for (let i = 0; i < this._questInstances.length; i++) {
            const q = this._questInstances[i];
            if (q.status === Q_STATUS.COMPLETE) continue;

            if (groups[q.typeId]) {
                groups[q.typeId].items.push(q);
            } else {
                if (!groups['_other']) groups['_other'] = { meta: { name: "其他", color: 0, fontSize: 24 }, items: [] };
                groups['_other'].items.push(q);
            }
        }

        return groups;
    };

    Game_System.prototype.requestHudRefresh = function() {
        this._questHudDirty = true;
    };

    // ======================================================================
    // 3. 核心显示组件 (Sprite_QuestHUD)
    // ======================================================================

    class Sprite_QuestHUD extends Sprite {
        constructor() {
            super();
            this.createBitmap();
        }

        createBitmap() {
            this.bitmap = new Bitmap(Graphics.width, Graphics.height);
        }

        update() {
            super.update();
            this.updateVisibility();
            if ($gameSystem._questHudDirty) {
                this.refresh();
                $gameSystem._questHudDirty = false;
            }
        }

        updateVisibility() {
            this.visible = $gameSystem._questHudVisible && $gameParty.inBattle() === false;
        }

        refresh() {
            this.bitmap.clear();

            const dataGroups = $gameSystem.getHudData(); 
            const sortedKeys = CONFIG.categories.map(c => c.id);
            if (dataGroups['_other']) sortedKeys.push('_other');

            let dy = CONFIG.y;
            const dx = CONFIG.x;
            const dw = CONFIG.width;

            for (let i = 0; i < sortedKeys.length; i++) {
                const key = sortedKeys[i];
                const group = dataGroups[key];
                
                if (!group || group.items.length === 0) continue;

                this.drawGroupTitle(group.meta, dx, dy);
                dy += 28 + 4; 

                for (let k = 0; k < group.items.length; k++) {
                    const item = group.items[k];
                    dy = this.drawTaskItem(item, dx, dy, dw);
                    dy += CONFIG.itemPadding;
                }

                if (i < sortedKeys.length - 1) {
                   this.drawSeparator(dx, dy, dw);
                   dy += CONFIG.sectionSpacing;
                }
            }
        }

        drawGroupTitle(meta, x, y) {
            const ctx = this.bitmap.context;
            const titleW = CONFIG.width;
            if (CONFIG.showBg) {
                ctx.fillStyle = `rgba(0, 0, 0, ${CONFIG.backOpacity / 255})`;
                ctx.fillRect(x, y, titleW, 28);
            }

            this.bitmap.fontBold = true;
            this.bitmap.fontSize = 22;
            this.bitmap.textColor = ColorManager.textColor(Number(meta.color));
            this.bitmap.drawText(meta.name, x + 4, y + 2, titleW, 24, "left");
            this.bitmap.fontBold = false;
        }

        drawTaskItem(instance, x, y, width) {
            let cy = y;
            const statusConf = CONFIG.statusText[instance.status] || { text: "", color: 0 };
            const tpl = CONFIG.templates[instance.templateId]; // 获取静态任务模板
            
            // 1. 计算进度文字
            let progressStr = "";
            if (tpl && tpl.progressFmt) {
                // 简单的字符串替换
                progressStr = tpl.progressFmt
                    .replace("{current}", '' + (instance.progress || 0))
                    .replace("{max}", '' + (instance.maxProgress || 1));
            }

            // 绘制顺序：[进度] [状态前缀] [标题]  [---奖励]
            
            this.bitmap.fontSize = 20;

            let currentX = x;

            // A. 绘制进度 (如果存在)
            if (instance.status == Q_STATUS.RUNNING && progressStr) {
                this.bitmap.textColor = ColorManager.textColor(CONFIG.colorProgress);
                const pW = this.bitmap.measureTextWidth(progressStr);
                this.bitmap.drawText(progressStr, currentX, cy, pW + 10, 24, "left");
                currentX += pW + 4; // 稍微留点空隙
            }
            
            // B. 绘制状态前缀
            if (instance.status == Q_STATUS.RUNNING && !progressStr || instance.status != Q_STATUS.RUNNING) {
              this.bitmap.textColor = ColorManager.textColor(statusConf.color);
              const prefixW = this.bitmap.measureTextWidth(statusConf.text);
              this.bitmap.drawText(statusConf.text, currentX, cy, width, 24, "left");
              currentX += prefixW;
            }

            // C. 绘制标题主体
            this.bitmap.textColor = ColorManager.normalColor(); // White
            // 计算剩余宽度给标题
            const titleMaxW = width - (currentX - x) - 60; 
            this.bitmap.drawText(" " + instance.title, currentX, cy, titleMaxW, 24, "left");

            // D. 绘制奖励说明(右对齐)
            if (tpl && tpl.rewardText) {
                this.bitmap.fontSize = 16;
                this.bitmap.textColor = ColorManager.systemColor(); // Blueish
                this.bitmap.drawText(tpl.rewardText, x, cy + 2, width, 24, "right");
            }

            cy += 24;

            // 2. 绘制描述 (多行文本)
            if (instance.desc) {
                this.bitmap.fontSize = 16;
                this.bitmap.textColor = "rgba(255, 255, 255, 0.8)";
                
                const lines = instance.desc.split('\n');
                for (let l = 0; l < lines.length; l++) {
                    const lineStr = lines[l];
                    // 缩进一点
                    cy = this.drawWrappedText(lineStr, x + 10, cy, width - 10, 20);
                }
            }
            
            return cy;
        }

        drawWrappedText(text, x, y, maxWidth, lineHeight) {
            let line = "";
            let currentY = y;
            const words = text.split(""); 
            
            for (let n = 0; n < words.length; n++) {
                const testLine = line + words[n];
                const testWidth = this.bitmap.measureTextWidth(testLine);
                if (testWidth > maxWidth && n > 0) {
                    this.bitmap.drawText(line, x, currentY, maxWidth, lineHeight, "left");
                    line = words[n];
                    currentY += lineHeight;
                } else {
                    line = testLine;
                }
            }
            this.bitmap.drawText(line, x, currentY, maxWidth, lineHeight, "left");
            return currentY + lineHeight;
        }

        drawSeparator(x, y, w) {
            const ctx = this.bitmap.context;
            ctx.save();
            ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, y + 10);
            ctx.lineTo(x + w, y + 10);
            ctx.stroke();
            ctx.restore();
        }
    }

    // ======================================================================
    // 4. 挂载与场景恢复 (Integration)
    // ======================================================================

    const _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
    Spriteset_Map.prototype.createLowerLayer = function() {
        _Spriteset_Map_createLowerLayer.call(this);
        this.createQuestHud();
    };

    Spriteset_Map.prototype.createQuestHud = function() {
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

    // 新增：增加进度
    PluginManager.registerCommand(PLUGIN_NAME, "AddProgress", args => {
        const val = Number(args.value || 1);
        window.SimpleQuest.addLatestProgress(args.templateId, val);
    });

    // 新增：设置进度
    PluginManager.registerCommand(PLUGIN_NAME, "SetProgress", args => {
        const val = Number(args.value || 0);
        window.SimpleQuest.setLatestProgress(args.templateId, val);
    });

    PluginManager.registerCommand(PLUGIN_NAME, "UpdateDesc", args => {
        window.SimpleQuest.updateLatestDesc(args.templateId, args.desc);
    });

})();