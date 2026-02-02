/*:
 * @target MZ
 * @plugindesc [V1.0] 动态立绘管理系统 - 队列化图层管理，支持完美交叉淡入淡出
 * @author Refactored by AI
 *
 * @help
 *
 * ============================================================================
 * 使用说明
 * ============================================================================
 * 1. 配置角色：
 *    在插件参数中配置【角色列表】。
 *    - 文件夹路径：例如 tachie/npc/ (结尾带斜杠)
 *    - 文件名：例如 npc14 (不带后缀)
 *
 * 2. 只有表情的差分 <eName>：
 *    例如 "芙莉莲<eSmile>"。插件会去 tachie/frieren/Smile.png 读取图片。
 *    表情层会自动分配在身体层之上的图层 ID，防止遮挡。
 *
 * 3. 临时调整坐标 <l x,y,scale>：
 *    例如 "店主<l 400,300,1.2>"。
 *
 * 
 * 
 * @command TempHideTachie
 * @text [暂离] 隐藏立绘并关开关
 * @desc 记录当前立绘，将其隐藏，并关闭控制开关。
 *
 * @arg time
 * @text 淡出时间
 * @desc 变透明需要的时间（帧）。填1为瞬间。
 * @default 15
 *
 * @command RestoreTachie
 * @text [归位] 恢复立绘并开开关
 * @desc 打开控制开关，并恢复之前“暂离”的立绘。
 *
 * @arg time
 * @text 淡入时间
 * @desc 变清晰需要的时间（帧）。填1为瞬间。
 * @default 15
 * 
 * @param SwitchId
 * @text 启用开关 ID
 * @type switch
 * @default 4
 * 
 * @param ---图层设置---
 * 
 * @param BasePictureId
 * @text 起始图片 ID
 * @desc 立绘系统占用的最小图片 ID。
 * @type number
 * @default 80
 * 
 * @param MaxLayers
 * @text 最大图层数量
 * @desc 系统保留的图层总数。默认20 (占用 ID 80~99)。
 * @type number
 * @default 20
 *
 * @param ---默认变换---
 *
 * @param DefaultX
 * @text 默认 X 坐标
 * @type number
 * @default -152
 * 
 * @param DefaultY
 * @text 默认 Y 坐标
 * @type number
 * @default 40
 *
 * @param DefaultScale
 * @text 默认缩放 (0.8=100%)
 * @type string
 * @default 0.8
 * 
 * @param ---动画参数---
 * 
 * @param FadeInDuration
 * @text 淡入时间 (帧)
 * @type number
 * @default 15
 *
 * @param FadeInOffsetX
 * @text 淡入位移距离（像素）
 * @desc 出现时的滑行距离。
 * @type number
 * @min -9999
 * @default 30
 * 
 * @param FadeOutDuration
 * @text 淡出时间 (帧)
 * @type number
 * @default 15
 *
 * @param FadeOutOffsetX
 * @text 淡出位移距离（像素）
 * @desc 消失时的滑行距离。
 * @type number
 * @min -9999
 * @default 30
 *
 * @param ---数据配置---
 * 
 * @param TachieList
 * @text 角色立绘配置列表
 * @type struct<TachieItem>[]
 * @default []
 * 
 */

/*~struct~TachieItem:
 * @param name
 * @text 角色名字
 * @desc 用于匹配 <e> 标签和对话框名字。
 * @type string
 * 
 * @param folder
 * @text 文件夹路径
 * @desc 结尾需带斜杠，如: tachie/stark/
 * @type string
 * 
 * @param image
 * @text 基础文件名
 * @desc 不带后缀，如: stark
 * @type string
 * 
 * @param defaultDecorations
 * @text 默认装饰 (逗号分隔)
 * @desc 如果对话没写<e>标签时默认显示的图片。如: Smile,Hat
 * @type string
 * 
 * @param x
 * @text 修正坐标 X
 * @type number
 * @min -9999
 * 
 * @param y
 * @text 修正坐标 Y
 * @type number
 * @min -9999
 * 
 * @param scale
 * @text 修正缩放
 * @type string
 * 
 * @param note
 * @text 备注
 * @type string
 */

(function () {
    // ==============================================================================
    // 1. 初始化参数
    // ==============================================================================
    const pluginName = 'ShowAndHideALLPic'; // 请确保这里和你的插件文件名一致
    const parameters = PluginManager.parameters(pluginName);

    // 基础开关
    const switchId = Number(parameters['SwitchId'] || 5);

    // 图层池配置
    const basePicId = Number(parameters['BasePictureId'] || 80);
    const maxLayers = Number(parameters['MaxLayers'] || 20);
    const endPicId = basePicId + maxLayers; // 循环边界（不包含）

    // 默认变换
    const defaultX = Number(parameters['DefaultX'] || -152);
    const defaultY = Number(parameters['DefaultY'] || 40);
    const defaultScale = Number(parameters['DefaultScale'] || 1.0);

    // 动画参数
    const fadeInDur = Number(parameters['FadeInDuration'] || 20);
    const fadeInOffset = Number(parameters['FadeInOffsetX'] || 30);
    const fadeOutDur = Number(parameters['FadeOutDuration'] || 20);
    const fadeOutOffset = Number(parameters['FadeOutOffsetX'] || 30);

    // 数据解析
    const tachieListRaw = parameters['TachieList'] ? JSON.parse(parameters['TachieList']) : [];
    const tachieConfigMap = {};

    tachieListRaw.forEach(itemJson => {
        const item = JSON.parse(itemJson);
        tachieConfigMap[item.name] = {
            fileName: item.image,
            folder: item.folder || "",
            x: item.x !== "" ? Number(item.x) : null,
            y: item.y !== "" ? Number(item.y) : null,
            scale: item.scale !== "" ? Number(item.scale) : null
        };
    });

    // ==============================================================================
    // 2. Game_Screen 状态管理扩展
    // ==============================================================================

    /**
     * 初始化立绘状态管理器
     * 结构: { "角色名": { bodyId: number, expId: number, bodyName: string, expName: string } }
     */
    const _Game_Screen_clear = Game_Screen.prototype.clear;
    Game_Screen.prototype.clear = function () {
        _Game_Screen_clear.call(this);
        this._tachieState = {};
    };

    /**
     * 寻找一个空闲的 Image ID
     * 策略：从 basePicId 或 指定的 minStartId 开始遍历
     * 【修改】增加了 minStartId 参数，确保表情层一定在身体层后面
     */
    Game_Screen.prototype.getFreeTachieId = function (reservedIds, minStartId) {
        // 确定开始搜索的起点。
        // 如果传了 minStartId (比如身体的ID 82)，我们就从 83 (82+1) 开始找。
        // 否则默认从 basePicId (80) 开始找。
        let startSearch = basePicId;
        if (minStartId && minStartId > 0) {
            startSearch = Math.max(basePicId, minStartId + 1);
        }
        for (let i = startSearch; i < endPicId; i++) {
            const picture = this.picture(i);
            // 如果图片不存在，或透明度为0（即空闲），且该ID没被本次操作预定
            if ((!picture || picture.opacity() === 0) && !reservedIds.includes(i)) {
                return i;
            }
        }
        // 如果池子满了，为了防止崩溃，返回最后一个ID覆盖使用
        console.warn("SimpleTachie: Max layers reached! overwriting last layer.");
        return endPicId - 1;
    };

    /**
     * 【核心修改】显示立绘逻辑
     * 支持表情/装饰数组，自动处理默认装饰
     */
    Game_Screen.prototype.showTachie = function (name, expressionString, locOverride) {
        if (!this._tachieState) this._tachieState = {};
        
        // --- 1. 重新获取配置（增加了 defaults 解析） ---
        const params = PluginManager.parameters('ShowAndHideALLPic');
        const listRaw = params['TachieList'] ? JSON.parse(params['TachieList']) : [];
        let config = null;
        for(const itemJson of listRaw) {
            const item = JSON.parse(itemJson);
            if(item.name === name) {
                config = {
                    fileName: item.image,
                    folder: item.folder || "",
                    x: item.x !== "" ? Number(item.x) : null,
                    y: item.y !== "" ? Number(item.y) : null,
                    scale: item.scale !== "" ? Number(item.scale) : null,
                    // 【新增】解析默认装饰，按逗号分隔
                    defaults: item.defaultDecorations ? item.defaultDecorations.split(',') : []
                };
                break;
            }
        }
        const defaultX = Number(params['DefaultX'] || -152);
        const defaultY = Number(params['DefaultY'] || 40);
        const defaultScale = Number(params['DefaultScale'] || 1.0);

        if (!config && !expressionString) return; 

        // 基础参数计算
        let finalX = defaultX;
        let finalY = defaultY;
        let finalScale = defaultScale;
        let folderPath = "";
        let baseImageName = "";
        // 【新增】
        let defaultDecorations = [];

        if (config) {
            finalX = config.x !== null ? config.x : defaultX;
            finalY = config.y !== null ? config.y : defaultY;
            finalScale = config.scale !== null ? config.scale : defaultScale;
            folderPath = config.folder;
            baseImageName = config.fileName;
            // 【新增】
            defaultDecorations = config.defaults;
        }

        if (locOverride) {
            if (locOverride.x !== null) finalX = locOverride.x;
            if (locOverride.y !== null) finalY = locOverride.y;
            if (locOverride.scale !== null) finalScale = locOverride.scale;
        }
        const scalePercent = finalScale * 100;
        
        // --- 2. 清理其他角色 ---
        Object.keys(this._tachieState).forEach(activeName => {
            if (activeName !== name) {
                this.fadeTachieGroupOut(activeName);
                delete this._tachieState[activeName]; 
            }
        });

        // --- 3. 初始化当前角色状态 (结构变化：extras代替expId) ---
        if (!this._tachieState[name]) {
            // 【修改】extras 数组用来存多个装饰层
            this._tachieState[name] = { bodyId: 0, bodyName: "", extras: [] };
        }
        const state = this._tachieState[name];
        
        // 构建预留ID列表
        const currentReserved = []; 
        if (state.bodyId) currentReserved.push(state.bodyId);
        state.extras.forEach(e => currentReserved.push(e.id));
        
        let isBodyContinuous = false;

        // 2. 处理身体
        if (baseImageName) {
            const fullBodyPath = folderPath + baseImageName;

            if (state.bodyId > 0 && state.bodyName === fullBodyPath) {
                // 身体没变：只更新位置，不淡入淡出
                this.updateTachieLayer(state.bodyId, finalX, finalY, scalePercent);
                if (!currentReserved.includes(state.bodyId)) currentReserved.push(state.bodyId);
                
                // 标记：身体是连续的，所以这是一个“原地换表情”的操作
                isBodyContinuous = true;
            } else {
                // 身体变了/新立绘：正常执行滑入
                if (state.bodyId > 0) this.fadeLayerOut(state.bodyId); // 旧身体滑出

                const newId = this.getFreeTachieId(currentReserved);
                this.showTachieLayerIn(newId, fullBodyPath, finalX, finalY, scalePercent); // 新身体滑入
                
                state.bodyId = newId;
                state.bodyName = fullBodyPath;
                currentReserved.push(newId);
                
                // 标记：身体是新的，表情应该跟随身体一起滑入
                isBodyContinuous = false;
            }
        }

                // ========================================================
        // 3. 处理装饰/表情层 (Extras) - 【完全重写】
        // ========================================================
        
        // A. 确定目标装饰列表
        let targetFileNames = [];
        if (expressionString) {
            // 情况1：对话框里写了 <eSmile,Hat>，以对话框为准 (覆盖默认配置)
            targetFileNames = expressionString.split(',').map(s => s.trim()).filter(s => s.length > 0);
        } else {
            // 情况2：没写标签，加载默认配置的装饰
            targetFileNames = defaultDecorations.map(s => s.trim()).filter(s => s.length > 0);
        }

        // B. 转换成完整路径以便对比
        const targetFullPaths = targetFileNames.map(fname => folderPath + fname);

        // C. 清理不再需要的旧装饰
        // 倒序遍历以便安全删除
        for (let i = state.extras.length - 1; i >= 0; i--) {
            const extra = state.extras[i];
            // 如果旧装饰不在新列表中 -> 淡出移除
            if (!targetFullPaths.includes(extra.name)) {
                if (isBodyContinuous) this.fadeLayerOutInPlace(extra.id); // 原地消失
                else this.fadeLayerOut(extra.id); // 跟随滑出
                
                // 从状态中移除
                state.extras.splice(i, 1);
            }
        }

        // D. 添加或更新需要的装饰
        targetFullPaths.forEach(targetPath => {
            // 检查当前状态是否已经有这个图
            const existingExtra = state.extras.find(e => e.name === targetPath);
            console.log('加载路径', targetPath);

            if (existingExtra) {
                // 1. 已存在 -> 更新位置即可 (防止位置不同步)
                this.updateTachieLayer(existingExtra.id, finalX, finalY, scalePercent);
                // 把它标记为占用，防止被别人抢了ID
                if (!currentReserved.includes(existingExtra.id)) currentReserved.push(existingExtra.id);
            } else {
                // 2. 不存在 -> 分配新ID层并显示
                const newExtraId = this.getFreeTachieId(currentReserved, state.bodyId);
                
                if (isBodyContinuous) {
                    // 身体不动，表情/帽子原地浮现
                    this.showTachieLayerInPlace(newExtraId, targetPath, finalX, finalY, scalePercent);
                } else {
                    // 身体在动，表情/帽子跟随身体滑入
                    this.showTachieLayerIn(newExtraId, targetPath, finalX, finalY, scalePercent);
                }

                // 记录状态
                state.extras.push({ id: newExtraId, name: targetPath });
                currentReserved.push(newExtraId);
            }
        });
    };

    /**
     * 【新增函数】原地显示图片（无滑行，快速淡入）
     * 用于连续对话时切换表情，避免表情“飞进来”
     */
    Game_Screen.prototype.showTachieLayerInPlace = function(picId, name, x, y, scale) {
        let pic = this.picture(picId);
        if (!pic) {
            this.showPicture(picId, name, 0, x, y, scale, scale, 0, 0);
            pic = this.picture(picId);
        }
        
        // 1. 设置其坐标直接就是目标坐标 x, y (没有偏移)
        // 2. 透明度设为0
        pic.show(name, 0, x, y, scale, scale, 0, 0); 
        
        // 3. 快速淡入到 255 (时间设为 10帧，比入场的 15/20帧 更快，显得利落)
        //    坐标保持 x, y 不变
        pic.move(0, x, y, scale, scale, 255, 0, 10); 
    };

    /**
     * 【新增函数】原地隐藏图片（无滑行，快速淡出）
     * 用于旧表情消失，防止旧表情“飞出去”
     */
    Game_Screen.prototype.fadeLayerOutInPlace = function(picId) {
        const pic = this.picture(picId);
        if (pic && pic.opacity() > 0) {
            // 目标位置 = 当前位置 (不加 offset)
            const targetX = pic.x(); 
            const targetY = pic.y();
            
            // 快速变透明 (10帧)
            pic.move(0, targetX, targetY, pic.scaleX(), pic.scaleY(), 0, 0, 10, 2);
        }
    };



    /**
     * 工具：淡入显示某一层
     */
    Game_Screen.prototype.showTachieLayerIn = function (picId, name, x, y, scale) {
        let pic = this.picture(picId);
        if (!pic) {
            // 确保 picture 对象存在 (hack: usually user should not access null pic)
            this.showPicture(picId, name, 0, x, y, scale, scale, 0, 0);
            pic = this.picture(picId);
        }

        // 设定初始状态：偏移+透明0
        const startX = x + fadeInOffset;
        pic.show(name, 0, startX, y, scale, scale, 0, 0); // 0=TopLeft origin? 原代码用0。通常立绘用1(Center)更好，暂保持0

        // 动画移入：目标位置+透明255
        pic.move(0, x, y, scale, scale, 255, 0, fadeInDur);
    };

    /**
     * 工具：更新某一层（位移/缩放），不改变透明度
     */
    Game_Screen.prototype.updateTachieLayer = function (picId, x, y, scale) {
        const pic = this.picture(picId);
        if (pic && pic.opacity() > 0) {
            // 继续保持当前透明度（通常是255），移动到新位置
            // 为了平滑，如果已经在该位置则不动，这里直接move覆盖，MZ会自动平滑
            pic.move(0, x, y, scale, scale, 255, 0, 20); // 这里的duration可以短一点或者和fade一致
        }
    };

    /**
     * 工具：让某一层淡出
     */
    Game_Screen.prototype.fadeLayerOut = function (picId) {
        const pic = this.picture(picId);
        if (pic && pic.opacity() > 0) {
            const targetX = pic.x() + fadeOutOffset;
            const targetY = pic.y();
            // 移动到 透明度0
            pic.move(0, targetX, targetY, pic.scaleX(), pic.scaleY(), 0, 0, fadeOutDur, 2);
        }
    };

    /**
     * 工具：让某角色的所有关联层淡出
     * 更新：适配 extras 数组
     */
    Game_Screen.prototype.fadeTachieGroupOut = function (name) {
        if (!this._tachieState || !this._tachieState[name]) return;
        const state = this._tachieState[name];
        
        // 淡出身体
        if (state.bodyId > 0) this.fadeLayerOut(state.bodyId);
        
        // 淡出所有装饰
        if (state.extras) {
            state.extras.forEach(extra => {
                this.fadeLayerOut(extra.id);
            });
        }
    };

    /**
     * 隐藏当前所有立绘（用于对话结束）
     */
    Game_Screen.prototype.hideTachie = function () {
        if (!this._tachieState) return;
        // 让所有记录在案的角色淡出
        Object.keys(this._tachieState).forEach(key => {
            this.fadeTachieGroupOut(key);
        });
        // 清空状态记录
        this._tachieState = {};
    };

    // ==============================================================================
    // 3. Game_Message 拦截 (已加入忽略名单逻辑)
    // ==============================================================================
    const _Game_Message_setSpeakerName = Game_Message.prototype.setSpeakerName;
    Game_Message.prototype.setSpeakerName = function (speakerName) {
        // 重新获取参数确保作用域安全
        const pParams = PluginManager.parameters('ShowAndHideALLPic');
        const swId = Number(pParams['SwitchId'] || 4);
        const tachieListRaw = pParams['TachieList'] ? JSON.parse(pParams['TachieList']) : [];
        
        // 简单的配置查找器（对应之前的 tachieConfigMap）
        const findConfig = (n) => {
            for(const json of tachieListRaw) {
                const item = JSON.parse(json);
                if(item.name === n) return true;
            }
            return false;
        };

        if ($gameSwitches.value(swId)) {
            let processedName = speakerName;
            let expressionData = null;
            let locationData = null;

            if (processedName) {
                // 1. 解析 <l> 坐标标签
                const regLoc = /<l\s*(-?\d+)\s*,\s*(-?\d+)(?:\s*,\s*(\d+(?:\.\d+)?))?>/i;
                if (regLoc.test(processedName)) {
                    processedName = processedName.replace(regLoc, (_, x, y, s) => {
                        locationData = { x: parseInt(x), y: parseInt(y), scale: s ? parseFloat(s) : null };
                        return '';
                    });
                }

                // 2. 解析 <e> 表情标签
                const regExp = /<(e.+)>/i;
                if (regExp.test(processedName)) {
                    processedName = processedName.replace(regExp, (_, p1) => {
                        expressionData = p1; 
                        return '';
                    }); 
                }

                // ---【新增核心逻辑：判断是否忽略】---
                let shouldIgnore = false;

                // 条件A: 名字完全匹配 "菲伦"
                if (processedName === '菲伦') {
                    shouldIgnore = true;
                }
                
                // 条件B: 名字被全角或半角括号包裹，例如 "（修塔尔克）" 或 "(旁白)"
                // 正则含义：以 ( 或 （ 开头，中间任意字符，以 ) 或 ） 结尾
                const bracketReg = /^\s*[（\(].+[）\)]\s*$/;
                if (bracketReg.test(processedName)) {
                    shouldIgnore = true;
                }

                // --- 执行显示逻辑 ---
                if (!shouldIgnore) {
                    // 只有当不在忽略名单里，才去尝试显示或更新立绘
                    // 这里的 findConfig 是为了防止随便输入一个名字导致其他人对应的立绘消失
                    // 但如果有 expressionData (比如只有表情差分)，也允许执行
                    if (findConfig(processedName) || expressionData) {
                        $gameScreen.showTachie(processedName, expressionData, locationData);
                    }
                }
                // 如果 shouldIgnore 为 true，代码直接跳过这里，
                // showTachie 不会被调用 -> "淡出其他人"的逻辑也不会由于新名字的出现而触发
                // 结果：屏幕上的立绘保持原样。
            }
        }
        
        // 清理名字中的标签，用于显示在文本框上
        let displayName = speakerName;
        if (displayName) {
                displayName = displayName.replace(/<l\s*(-?\d+)\s*,\s*(-?\d+)(?:\s*,\s*(\d+(?:\.\d+)?))?>/i, "")
                                        .replace(/<(e.+)>/i, "");
        }
        _Game_Message_setSpeakerName.call(this, displayName);
    };


    /**
     * 【修改函数】重写消息结束时的逻辑
     * 只有当对话真正彻底结束时，才隐藏立绘
     */
    const _Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;
    Window_Message.prototype.terminateMessage = function () {
        _Window_Message_terminateMessage.call(this);
        
        // 获取插件里的开关ID，你之前代码里默认是4或5，这里用变量读取比较安全
        // 假设你在上方定义了 switchId，如果没有，请手动改成数字，例如: if ($gameSwitches.value(4))
        const pParams = PluginManager.parameters('ShowAndHideALLPic');
        const swId = Number(pParams['SwitchId'] || 4);
        if ($gameSwitches.value(swId)) {
            // --- 核心修复逻辑开始 ---
            
            // 调用刚才写的新函数，检测是否还有后续对话
            if ($gameScreen.isNextCommandContinuous()) {
                // 如果还有对话，直接 return，【不执行】hideTachie
                // 这样立绘就会保留在屏幕上，保持状态
                return;
            }
            
            // 只有确信没有后续对话了，才清除立绘
            $gameScreen.hideTachie();
            
            // --- 核心修复逻辑结束 ---
        }
    };

        /**
     * 【关键修改】高级预测函数 - 穿透旁白版
     * 逻辑：往后寻找下一个“有名字的说话者”。
     * - 如果找到的人是当前正在显示的角色 -> 保持显示 (true)
     * - 如果找到的人是别人 / 找不到人了 -> 隐藏当前 (false)
     */
    Game_Screen.prototype.isNextCommandContinuous = function() {
        // 1. 获取解释器
        let interpreter = null;
        if ($gameParty.inBattle()) {
            interpreter = $gameTroop._interpreter;
        } else {
            interpreter = $gameMap._interpreter;
        }

        // 处理子解释器
        while (interpreter && interpreter._childInterpreter) {
            interpreter = interpreter._childInterpreter;
        }

        if (!interpreter || !interpreter.isRunning()) {
            return false;
        }

        const list = interpreter._list;
        let index = interpreter._index + 1; // 从下一条开始找

        // 获取当前屏幕上正在显示的立绘名字（假设同时主要显示一个人，取 keys 里的任意一个或全部比对）
        const currentActiveNames = this._tachieState ? Object.keys(this._tachieState) : [];
        
        // 如果屏幕上压根没人，那也不需要保持什么连续性了，直接返回 false 让系统去清理即可
        if (currentActiveNames.length === 0) return false;

        // 白名单：允许跳过的非对话指令
        const whiteList = [
            0, 118, 108, 408, 117, 
            121, 122, 123, 230, 212, 213, 205, 
            216, 217, 250, 251, 241, 245, 249, 242, 246, 243, 244, 
            221, 222, 223, 224, 225, 236, 
            231, 232, 233, 234, 235, 
            401, 402, 403, 404, 105, 405
        ];

        // 循环向后查找
        while (index < list.length) {
            const command = list[index];
            const code = command.code;

            // --- 情况 A: 遇到“显示文本” (101) ---
            if (code === 101) {
                const nextNameRaw = command.parameters[4]; // MZ 第4参数是名字
                
                // 清理名字（去掉标签、去空格、去括号）
                let cleanName = nextNameRaw || "";
                cleanName = cleanName.replace(/<l[^>]*>/i, "").replace(/<e[^>]*>/i, "").replace(/^[（\(].+[）\)]$/, "").trim();

                if (cleanName === "") {
                    // === 关键逻辑：旁白 ===
                    // 旁白不算“说话者”，它无法决定立绘是否该退场。
                    // 比如：A说话 -> 旁白 -> A说话。 在旁白期间 A 应该留着。
                    // 所以遇到旁白，我们不能 return，必须**继续往后找**。
                    // print log 调试用
                    // console.log("Skipping Narrator at index:", index);
                    index++;
                    continue; 
                } else {
                    // === 关键逻辑：有人说话 ===
                    // 既然找到了下一个说话的人，立绘的命运就在此刻决定。
                    
                    // 检查这个人是否已经在屏幕上
                    // 如果在，说明是连续对话（中间可能隔了旁白），保持！
                    if (currentActiveNames.includes(cleanName) || cleanName == '菲伦') {
                        // console.log("Found same speaker continuous:", cleanName);
                        return true; 
                    } else {
                        // 如果找到了人，但不是当前的人（是 B 说话），
                        // 说明 A 的戏份在此时此刻（A说完这句时）真的结束了。
                        // 应该让 A 在进旁白之前就退场。
                        // console.log("Found different speaker:", cleanName, " hiding current.");
                        return false; 
                    }
                }
            }

            // --- 情况 B: 遇到其他对话指令 (102选项, 103数值...) ---
            // 这些指令通常也意味着对话交互，通常会保持立绘
            if ([102, 103, 104].includes(code)) {
                return true;
            }

            // --- 情况 C: 遇到白名单指令 ---
            if (whiteList.includes(code)) {
                index++;
                continue;
            }

            // --- 情况 D: 遇到阻断指令 (比如场景切换、战斗开始等) ---
            // 既然不是对话也不是白名单，说明流程断了，立绘该退场了。
            // console.log("Blocked by code:", code);
            return false;
        }
        
        // 找遍了最后也没找到下一个说话人 -> 退场
        return false;
    };


    /**
     * 【关键修改】高级预测函数
     * 作用：向后预读指令，跳过“不重要的演出事件”，寻找是否存在连续的对话
     */
    // Game_Screen.prototype.isNextCommandContinuous = function() {
    //     // 1. 获取解释器
    //     let interpreter = null;
    //     if ($gameParty.inBattle()) {
    //         interpreter = $gameTroop._interpreter;
    //     } else {
    //         interpreter = $gameMap._interpreter;
    //     }

    //     // 处理子解释器（比如公共事件）
    //     while (interpreter && interpreter._childInterpreter) {
    //         interpreter = interpreter._childInterpreter;
    //     }

    //     if (!interpreter || !interpreter.isRunning()) {
    //         return false;
    //     }

    //     const list = interpreter._list;
    //     // 【核心修正点】：
    //     // 通常 interpreter._index 指向当前正在执行的指令（即当前的 ShowText）。
    //     // 我们需要从它的 *下一条* 开始找。
    //     let i = interpreter._index + 1;

    //     // --- 调试日志 (按 F12 可以在控制台看到) ---
    //     // 方便排查是哪个指令打断了连续性
    //     // console.log("Checking Next Command from index:", i); 

    //     // --- B. 白名单 (跳过) ---
    //     // 补全了一些可能遗漏的常用指令
    //     const whiteList = [
    //         0,    // 空行
    //         118,  // 标签
    //         108, 408, // 注释 (408是注释的第二行及后续)
    //         117,  // 公共事件
    //         121, 122, 123, // 开关/变量
    //         230,  // 等待
    //         212, 213, // 动画/气泡
    //         205,  // 移动路线
    //         216, 217, // 跟随/集合
    //         250, 251, 241, 245, 249, 242, 246, 243, 244, // 音频
    //         221, 222, 223, 224, 225, 236, // 屏幕
    //         231, 232, 233, 234, 235, // 图片
    //         // 【重要补充】：文本和滚动的特殊部分
    //         401, // 文本数据 (显示文本指令后的实际文字内容)
    //         402, // 选项数据 (When [**])
    //         403, // When Cancel
    //         404, // 选项结束
    //         105, // 显示滚动文字
    //         405  // 滚动文字内容
    //     ];

    //     while (i < list.length) {
    //         const command = list[i];
    //         const code = command.code;

    //         // --- A. 对话类指令 (成功续连) ---
    //         if ([101, 102, 103, 104].includes(code)) {
    //             // 如果是“显示文本” (101)，需要判断名字是否一致
    //             if (code === 101) {
    //                 // 获取下一个说话人的名字
    //                 const nextSpeakerName = command.parameters[4];
                    
    //                 // 获取当前插件正在追踪的“当前说话者”
    //                 // 注意：_tachieState 里可能有多个，但通常最后操作的是主要的。
    //                 // 我们可以通过 Game_Message 获取刚才那个名字，或者传入当前检测的名字
    //                 // 但这里有一个简单的逻辑：
    //                 // 1. 如果下一个名字是空的 -> 可能是旁白 -> 应该保持（不隐藏立绘），或者根据需求隐藏。通常旁白不应该让立绘突然消失。
    //                 // 2. 如果下一个名字跟当前显示的立绘名字不一样 -> 应该 return false (断开)，让 hideTachie 执行。
    //                 //    但是！hideTachie 会隐藏所有立绘。如果下一个指令也是 showTachie，它会马上又显示出来。
    //                 //    所以，为了平滑，如果名字不同，我们其实应该允许 hideTachie 执行（淡出），
    //                 //    或者如果你的 showTachie 自带了“淡出其他人”的逻辑，这里保持 true 也无所谓。
                    
    //                 // **** 修正策略 ****
    //                 // 你的 showTachie 函数开头有 "Object.keys(this._tachieState).forEach..." 来清理其他人。
    //                 // 这意味着：只要下一句还有立绘指令，我们就不应该执行 terminateMessage 里的 hideTachie。
    //                 // 真正的危险是：下一句是 [不同的人]，但这个人[没有立绘配置]。
                    
    //                 // 获取当前屏幕上所有的立绘名字
    //                 const activeNames = this._tachieState ? Object.keys(this._tachieState) : [];
                    
    //                 // 清理名字中的标签（比如 <eSmile>）以便对比
    //                 let cleanNextName = nextSpeakerName || "";
    //                 cleanNextName = cleanNextName.replace(/<l[^>]*>/i, "").replace(/<e[^>]*>/i, "").replace(/^[（\(].+[）\)]$/, "");

    //                 // 核心判断：
    //                 // 如果屏幕上目前没人 (activeNames为空)，说明之前可能只是普通对话，无所谓。
    //                 // 如果屏幕上有人：
    //                 // 1. 下一个说话人就在屏幕上 (是同一个人) -> return true (保持)
    //                 // 2. 下一个说话人是空 (旁白) -> return true (保持，通常立绘听旁白时不动)
    //                 // 3. 下一个说话人是新面孔 -> 
    //                 //    这里比较微妙。如果 return false，当前立绘淡出。
    //                 //    如果 return true，当前立绘保持，直到下一句的 showTachie 触发把旧的顶掉。
    //                 //    **建议 return true **。
    //                 //    因为你的 showTachie 里已经有了 `fadeTachieGroupOut(activeName)` 逻辑。
    //                 //    如果这里 return false，会导致立绘先淡出，下一句指令执行时新立绘再淡入（或者旧立绘被 fadeOut 执行了一半又被拉回来），造成闪烁。
                    
    //                 // 所以，结论是：只要下面还是对话，就保持 Continuous。
    //                 // 让 showTachie 内部的互斥逻辑去处理“换人”。
                    
    //                 if (activeNames.length > 0) {
    //                     // 假设单人立绘，只取第一个
    //                     const currentName = activeNames[0];
    //                     console.log(`当前立绘 [${currentName}], 下一个立绘 [${cleanNextName}]`);
    //                     // 简单的包含关系判断
    //                     if (cleanNextName || !activeNames.includes(cleanNextName)) {
    //                         console.log("Next speaker is different:", cleanNextName);
    //                         return false; // 断开，执行淡出
    //                     }
    //                 }
    //             }
                
    //             // 综上，为了立绘切换最平滑（也就是利用你 showTachie 里的 fadeTachieGroupOut 交叉淡入淡出），
    //             // 这里的建议是：**不要断开**。
    //             // 只有当下一条指令是战斗、移动、或者完全无关的事情时，才断开。
    //             // 换人也是一种“Continuous”的演出状态。
                
    //             console.log("Found Next Dialouge:", code);
    //             return true; 
    //         }

    //         if (whiteList.includes(code)) {
    //             console.log("Skipping whitelist code:", code);
    //             i++;
    //             continue;
    //         }

    //         // --- C. 遇到阻断 ---
    //         console.log("Blocked by code:", code);
    //         return false;
    //     }
        
    //     return false;
    // };

    /**
     * 【新增】保存当前状态并隐藏 (对应指令 TempHideTachie)
     */
    Game_Screen.prototype.saveAndHideTachie = function(duration) {
        if (!this._tachieState || Object.keys(this._tachieState).length === 0) {
            this._tachieBackup = null;
            return;
        }

        // 1. 深度拷贝当前状态进行备份
        this._tachieBackup = JSON.parse(JSON.stringify(this._tachieState));

        // 2. 执行隐藏逻辑 (复用之前的逻辑)
        Object.keys(this._tachieState).forEach(name => {
            const state = this._tachieState[name];
            
            // 身体淡出
            if (state.bodyId > 0) {
                const pic = this.picture(state.bodyId);
                if (pic) {
                    // 如果 duration 很小，几乎就是瞬间
                    pic.move(pic.origin(), pic.x(), pic.y(), pic.scaleX(), pic.scaleY(), 0, 0, duration, 2);
                }
            }
            // 表情淡出
            if (state.expId > 0) {
                const pic = this.picture(state.expId);
                if (pic) {
                    pic.move(pic.origin(), pic.x(), pic.y(), pic.scaleX(), pic.scaleY(), 0, 0, duration, 2);
                }
            }
            // 清除当前状态，防止update里干扰
            delete this._tachieState[name];
        });
    };

    /**
     * 【新增】恢复已保存的状态 (对应指令 RestoreTachie)
     */
    Game_Screen.prototype.restoreSavedTachie = function(duration) {
        // 如果没有备份，或者备份是空的，啥也不做
        if (!this._tachieBackup) return;

        // 重新初始化状态容器
        if (!this._tachieState) this._tachieState = {};

        // 获取全局缩放设置 (用于恢复图片参数)
        const pParams = PluginManager.parameters('ShowAndHideALLPic');
        const defaultScale = Number(pParams['DefaultScale'] || 1.0);
        const scalePercent = defaultScale * 100;

        Object.keys(this._tachieBackup).forEach(name => {
            const savedState = this._tachieBackup[name];
            
            // 恢复数据记录
            this._tachieState[name] = savedState;

            // --- 恢复身体 ---
            if (savedState.bodyId > 0 && savedState.bodyName) {
                let pic = this.picture(savedState.bodyId);
                
                // 如果图片对象还在(只是透明了)，直接复用坐标；如果没了，用默认坐标
                // 这里为了保险，重新 show 一次
                const x = pic ? pic.x() : -152; // 默认X
                const y = pic ? pic.y() : 40;   // 默认Y
                
                // 图片文件名处理 (去掉 img/pictures/ 和 .png)
                const cleanBodyName = savedState.bodyName.replace(/^img\/pictures\//, "").replace(/\.png$/, "");
                
                //先以 0 透明度显示出来
                this.showPicture(savedState.bodyId, cleanBodyName, 0, x, y, scalePercent, scalePercent, 0, 0);
                
                // 再淡入到 255
                const pBody = this.picture(savedState.bodyId);
                if(pBody) pBody.move(0, x, y, scalePercent, scalePercent, 255, 0, duration, 2);
            }

            // --- 恢复表情 ---
            if (savedState.expId > 0 && savedState.expName) {
                let pic = this.picture(savedState.expId);
                const x = pic ? pic.x() : -152;
                const y = pic ? pic.y() : 40;
                const cleanExpName = savedState.expName.replace(/^img\/pictures\//, "").replace(/\.png$/, "");

                this.showPicture(savedState.expId, cleanExpName, 0, x, y, scalePercent, scalePercent, 0, 0);
                
                const pExp = this.picture(savedState.expId);
                if(pExp) pExp.move(0, x, y, scalePercent, scalePercent, 255, 0, duration, 2);
            }
        });

        // 恢复完成后，清空备份，避免重复恢复导致逻辑混乱
        this._tachieBackup = null;
    };




    // 指令1：立绘暂离 (隐藏并关闭开关)
    // 参数：time (淡出时间，单位帧，填 0 或 1 表示瞬间消失)
    PluginManager.registerCommand(pluginName, 'TempHideTachie', args => {
        const duration = args.time ? Number(args.time) : 15;
        
        // 1. 获取配置的开关ID
        const pParams = PluginManager.parameters(pluginName);
        const swId = Number(pParams['SwitchId'] || 4);
        // 2. 存贮当前状态并隐藏
        $gameScreen.saveAndHideTachie(duration);
        // 3. 自动关闭开关
        $gameSwitches.setValue(swId, false);
    });
    // 指令2：立绘归位 (恢复并打开开关)
    // 参数：time (淡入时间)
    PluginManager.registerCommand(pluginName, 'RestoreTachie', args => {
        const duration = args.time ? Number(args.time) : 15;
        // 1. 获取配置的开关ID
        const pParams = PluginManager.parameters(pluginName);
        const swId = Number(pParams['SwitchId'] || 4);
        
        // 2. 自动打开开关
        $gameSwitches.setValue(swId, true);
        // 3. 恢复之前的立绘
        $gameScreen.restoreSavedTachie(duration);
    });

})();

(function () {
    Game_Screen.prototype.showAll = function () {
        for (let i = 0; i < 40; i++) {
            let element = this._pictures[i]
            if (element)
                element._opacity = 255
        }
    };


    Game_Screen.prototype.hideAll = function () {
        for (let i = 0; i < 40; i++) {
            let element = this._pictures[i]
            if (element)
                element._opacity = 0
        }
    }

    // const _Game_Switches_setValue = Game_Switches.prototype.setValue
    // Game_Switches.prototype.setValue = function (switchId, value) {
    //     _Game_Switches_setValue.call(this, switchId, value)
    //     if (switchId == 4) {
    //         this._data[switchId + 1] = value
    //     }
    // };
})()
