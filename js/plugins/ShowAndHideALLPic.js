/*:
 * @target MZ
 * @plugindesc [V2.1] 独立立绘与动态高亮系统 - 修复动作与层级控制版
 * @author Hakubox
 *
 * @help
 * ============================================================================
 * 功能介绍
 * ============================================================================
 * 1. 独立绘图：完全脱离RM自带图片ID系统，立绘互不冲突。
 * 2. 自动高亮：根据对话框名字自动高亮说话者，其他人变暗（遮罩）。
 * 3. 连贯性修复：智能预读下一条指令，防止立绘在连续对话中闪烁。
 * 4. 动态立绘：支持 <l x,y,scale> 和 <eName> 标签。
 * 5. 动作指令：移植了 Hakubox 的动作算法（跳跃、震动、点头、Q弹）。
 * 6. 层级控制：可设置立绘是在对话框下方（默认）还是盖在对话框上面。
 *
 * ============================================================================
 * 角色配置 (TachieList)
 * ============================================================================
 * 在参数中配置角色。
 * - 只有表情的差分：图片名不填，直接在对话框里写 <eSmile>，系统会自动寻找
 *   "文件夹路径 + Smile.png"。
 * 
 * ============================================================================
 * 文本标签使用
 * ============================================================================
 * 在"显示文本"的名字框或内容中：
 * <l 400,600,1.0>  : 临时设置坐标 x=400, y=600, 缩放=1.0
 * <eSmile>         : 临时显示表情差分 (会去角色配置的文件夹下找 Smile.png)
 *
 * ============================================================================
 * 插件指令
 * ============================================================================
 * 1. 强制隐藏立绘 (HideAllTachie): 手动清空屏幕。
 * 2. 播放动作 (PlayAction): 让指定立绘跳跃、震动等。
 *
 * 
 * @param ---基础设置---
 * 
 * @param SwitchId
 * @text 启用开关 ID
 * @desc 打开此开关时，立绘系统生效；关闭则全部不显示。
 * @type switch
 *
 * @param LayerPosition
 * @text 显示层级位置
 * @desc 决定立绘显示在对话框的上面还是下面。
 * @type select
 * @option 对话框下方 (标准)
 * @value BELOW
 * @option 所有窗口上方 (立绘遮挡UI)
 * @value ABOVE
 * @default BELOW
 * 
 * @param MaskDuration
 * @text 遮罩过渡时间
 * @desc 说话人切换时，明暗变化的过渡帧数。
 * @type number
 * @default 6
 * 
 * @param MaskOpacity
 * @text 遮罩不透明度
 * @desc 非说话人变暗的程度 (0-255)，越大越黑。
 * @type number
 * @default 128
 *
 * @param IgnoreNames
 * @text 忽略名单
 * @desc 这些名字说话时，不会触发"其他人变暗"逻辑 (逗号分隔)。如: 旁白,System
 * @type string
 * @default 旁白
 * 
 * @param ---默认位置---
 *
 * @param DefaultX
 * @text 默认 X 坐标
 * @type number
 * @default 640
 * @min -10000
 * 
 * @param DefaultY
 * @text 默认 Y 坐标
 * @type number
 * @default 720
 * @min -10000
 *
 * @param DefaultScale
 * @text 默认缩放
 * @desc 1.0 表示原图大小
 * @type string
 * @default 1.0
 * 
 * @param ---动画参数---
 * 
 * @param FadeDuration
 * @text 进场/退场时间
 * @desc 立绘淡入淡出的帧数。
 * @type number
 * @default 20
 *
 * @param SlideOffset
 * @text 滑动距离
 * @desc 进场/退场时的X轴滑动像素。
 * @type number
 * @default 30
 *
 * @param ---角色列表---
 * 
 * @param TachieList
 * @text 角色配置列表
 * @type struct<TachieItem>[]
 * @default []
 *
 * @command HideAllTachie
 * @text [所有] 强制隐藏/显示
 * @desc 强制隐藏或恢复所有立绘。
 * 
 * @arg type
 * @text 操作类型
 * @type select
 * @option 立即隐藏 (也不再自动显示)
 * @value HIDE
 * @option 恢复正常 (允许自动显示)
 * @value SHOW
 * @default HIDE
 * 
 * @command PlayAction
 * @text [动作] 播放立绘动作
 * @desc 让某个角色的立绘播放动作。
 *
 * @arg name
 * @text 角色名字
 * @desc 必须与配置中的名字一致。
 * @type string
 *
 * @arg actionType
 * @text 动作类型
 * @type select
 * @option 跳跃 (Jump)
 * @value jump
 * @option 左右震动 (Shake)
 * @value shake
 * @option 点头 (Nod)
 * @value nod
 * @option 惊讶/弹跳 (Bounce)
 * @value bounce
 * @default jump
 * 
 * @arg power
 * @text 强度/高度
 * @desc 跳跃高度、震动幅度或点头幅度。
 * @type number
 * @default 40
 * 
 * @arg duration
 * @text 持续时间 (帧)
 * @desc 动作完成的总时间。
 * @type number
 * @default 20
 *
 * @arg frequency
 * @text 频率 (仅震动有效)
 * @desc 震动的快慢，数值越大越快。
 * @type number
 * @default 10
 * 
 */

/*~struct~TachieItem:
 * 
 * @param note
 * @text 备注
 * @desc 仅用于编辑器内标记，不影响游戏逻辑。
 * @type string
 * 
 * @param name
 * @text 角色名字
 * @desc 用于匹配 <e> 标签和对话框名字。
 * @type string
 * 
 * @param folder
 * @text 文件夹路径
 * @desc 结尾需带斜杠，如: img/pictures/tachie/
 * @type string
 * @default img/pictures/
 * 
 * @param image
 * @text 基础文件名
 * @desc 身体/基础立绘文件名(不带后缀)。如果没有基础立绘只可能有表情差分，可留空。
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
 */

(function () {
    const pluginName = "ShowAndHideALLPic";
    const parameters = PluginManager.parameters(pluginName);

    // --- 参数解析 ---
    const switchId = Number(parameters['SwitchId'] || 0);
    const layerPosition = parameters['LayerPosition'] || 'BELOW'; // BELOW or ABOVE

    const maskDuration = Number(parameters['MaskDuration'] || 6);
    const maxMaskOpacity = Number(parameters['MaskOpacity'] || 128);
    const ignoreNames = (parameters['IgnoreNames'] || "").split(',').map(s => s.trim());
    
    const globalDefaultX = Number(parameters['DefaultX'] || 640);
    const globalDefaultY = Number(parameters['DefaultY'] || 720);
    const globalDefaultScale = Number(parameters['DefaultScale'] || 1.0);
    
    const fadeDur = Number(parameters['FadeDuration'] || 20);
    const slideOffset = Number(parameters['SlideOffset'] || 30);

    // 解析角色列表
    const tachieListRaw = parameters['TachieList'] ? JSON.parse(parameters['TachieList']) : [];
    const tachieConfigMap = {};
    tachieListRaw.forEach(itemJson => {
        const item = JSON.parse(itemJson);
        tachieConfigMap[item.name] = {
            fileName: item.image || "",
            folder: item.folder || "img/pictures/",
            x: item.x !== "" ? Number(item.x) : null,
            y: item.y !== "" ? Number(item.y) : null,
            scale: item.scale !== "" ? Number(item.scale) : null
        };
    });

    // ==============================================================================
    // 1. 数据层: Game_System 扩展
    // ==============================================================================

    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this.initTachieSystem();
    };

    Game_System.prototype.initTachieSystem = function() {
        // 数据结构: { "ActorName": { x, y, scale, fileName, opacity, maskOpacity, ... } }
        this._tachieData = {}; 
        this._tachieVisible = true; // 全局显示开关
        this._currentSpeaker = null; // 当前正在说话的人
    };

    Game_System.prototype.getTachieData = function(name) {
        if (!this._tachieData) this.initTachieSystem();
        return this._tachieData[name];
    };

    // ==============================================================================
    // 修复后的 Game_System.showTachie (支持任意数量图层)
    // ==============================================================================
    Game_System.prototype.showTachie = function(name, layersArray, x, y, scale) {
        if (!this._tachieData) this.initTachieSystem();

        // 确保 layersArray 是一个数组，哪怕只有一个图片
        const newLayers = Array.isArray(layersArray) ? layersArray : [layersArray];

        if (!this._tachieData[name]) {
            this._tachieData[name] = {
                name: name,
                x: x, 
                y: y,
                scale: scale,
                layers: newLayers,    // 这里改为存储图层数组
                opacity: 0,          
                tint: 0xFFFFFF,       // 新增：色调值 (0xFFFFFF = 原色)
                targetX: x,          
                realX: x + slideOffset, 
                targetOpacity: 255,   
                visiblity: true,      
                action: null          
            };
        } else {
            const d = this._tachieData[name];
            // 智能合并图层逻辑：
            // 如果传入的新图层数组不仅包含null，则更新对应索引的图层
            if (newLayers && newLayers.length > 0) {
                // 如果原来的数据没有layers字段（旧存档兼容），初始化它
                if (!d.layers) d.layers = [];
                
                // 逐个更新，保持数组长度足够
                for (let i = 0; i < newLayers.length; i++) {
                    const path = newLayers[i];
                     // 只有当路径不为 null 时才覆盖（允许保留上一句的表情/身体）
                     // 如果传 "" 空字符串，表示卸载该层图片
                    if (path !== null && path !== undefined) {
                        d.layers[i] = path;
                    }
                }
            }
            
            d.targetX = x; 
            d.y = y;
            d.scale = scale;
            d.targetOpacity = 255;
            d.visiblity = true;
            
            if (d.opacity <= 0) {
                 d.realX = x + slideOffset;
                 d.opacity = 0;
            }
        }
    };



    Game_System.prototype.hideTachie = function(name) {
        if (!this._tachieData || !this._tachieData[name]) return;
        const d = this._tachieData[name];
        d.visiblity = false;
        d.targetOpacity = 0;
    };

    Game_System.prototype.hideAllTachies = function() {
        if (!this._tachieData) return;
        Object.keys(this._tachieData).forEach(name => {
            this.hideTachie(name);
        });
        this._currentSpeaker = null; 
    };

    Game_System.prototype.setTachieAction = function(name, type, power, duration, frequency) {
        const d = this.getTachieData(name);
        if (d) {
            d.action = {
                type: type,
                power: power,
                duration: duration,
                frequency: frequency || 10,
                time: 0 
            };
        }
    };


    // ==============================================================================
    // 2. 显示层: Sprite_Tachie (Class 重构版 - 支持多图层与Tint变暗)
    // ==============================================================================
    
    class Sprite_Tachie extends Sprite {
        /**
         * @param {string} characterName 角色名称
         */
        constructor(characterName) {
            super();
            this._characterName = characterName;
            
            this.anchor.x = 0.5;
            this.anchor.y = 1.0; 
            // 基础坐标记录
            this._baseX = 0;
            this._baseY = 0;
            // --- 核心结构 ---
            this._layerSprites = []; 
            this._layerFiles = [];
            // --- [关键修复]：防止切菜单回不再闪现 ---
            // 创建时检查一下：如果数据里标记为“隐藏目标(0)”，则直接按透明度0初始化
            const data = this.getData();
            if (data && data.targetOpacity === 0) {
                this.opacity = 0;
                // 强制同步数据里的当前透明度，防止update插值时产生反弹
                data.opacity = 0; 
            }
        }

        update() {
            super.update();
            // 只有当 switch 打开且系统允许显示时才进行更新计算
            // (虽然 visible 在外部控制，但内部计算可以做个防守，不过为了动作连贯性，通常保持一直计算)
            this.updateLayers();             
            this.updatePositionAndOpacity();
            this.updateTone();               
            this.updateAction();
        }

        getData() {
            if (!$gameSystem || !$gameSystem._tachieData) return null;
            return $gameSystem._tachieData[this._characterName];
        }

        /**
         * 加载图片的辅助函数
         */
        loadTachieImage(fullPath) {
            if (!fullPath) return null;
            const lastSlash = fullPath.lastIndexOf('/');
            const folder = lastSlash >= 0 ? fullPath.substring(0, lastSlash + 1) : "img/pictures/";
            const file = lastSlash >= 0 ? fullPath.substring(lastSlash + 1) : fullPath;
            const fileNoExt = file.replace(/\.png$/i, "");
            
            if (!fileNoExt) return null;
            return ImageManager.loadBitmap(folder, fileNoExt);
        }

        /**
         * 动态管理图层数量和内容
         */
        updateLayers() {
            const data = this.getData();
            // 如果没有数据，隐藏所有现存图层并返回
            if (!data || !data.layers) {
                this._layerSprites.forEach(s => s.visible = false);
                return;
            }

            const layersData = data.layers;

            // 1. 扩容：确保 Sprite 数量足够
            while (this._layerSprites.length < layersData.length) {
                const s = new Sprite();
                s.anchor.x = 0.5;
                s.anchor.y = 1.0;
                this.addChild(s); // 添加到当前容器
                
                // 确保新加入的 Sprite Z轴顺序正确 (其实 addChild 默认就是在上面，这里不需要额外 sort，除非有特殊需求)
                this._layerSprites.push(s);
                this._layerFiles.push(null);
            }

            // 2. 更新：同步每个图层的内容
            for (let i = 0; i < layersData.length; i++) {
                const fileName = layersData[i];
                const sprite = this._layerSprites[i];
                
                // 仅当文件名变化时重新加载
                if (this._layerFiles[i] !== fileName) {
                    this._layerFiles[i] = fileName;
                    if (fileName) {
                        sprite.bitmap = this.loadTachieImage(fileName);
                        sprite.visible = true;
                    } else {
                        sprite.bitmap = null;
                        sprite.visible = false;
                    }
                }
            }

            // 3. 清理：如果实际数据层变少了，隐藏多余的 Sprite
            for (let i = layersData.length; i < this._layerSprites.length; i++) {
                if (this._layerSprites[i].visible) {
                    this._layerSprites[i].visible = false;
                    this._layerFiles[i] = null;
                }
            }
        }

        /**
         * 处理明暗变化 (使用 Tint 而非遮罩)
         * 修复：确保非说话角色正确变暗
         */
        updateTone() {
            // 1. 基础检查：如无数据或无图层，直接跳过
            const data = this.getData();
            if (!data || !this._layerSprites || this._layerSprites.length === 0) return;
            // 2. 加载状态检查 (用户需求)：如果主图层还没加载完，先不处理颜色，避免闪烁
            //    这里检测第0层(通常是身体)，如果身体都没好，就别变色了
            if (this._layerSprites[0] && this._layerSprites[0].bitmap && !this._layerSprites[0].bitmap.isReady()) {
                return;
            }
            // 3. 计算目标颜色
            //    逻辑：默认为白色(0xFFFFFF)。
            //    如果系统有当前说话人，且不是自己，且自己不在忽略名单里(可选)，则变暗。
            const currentSpeaker = $gameSystem._currentSpeaker;
            let targetTint = 0xFFFFFF; // 默认原色
            if (currentSpeaker && currentSpeaker !== this._characterName) {
                const params = PluginManager.parameters("ShowAndHideALLPic"); 
                const ignoreList = (params['IgnoreNames'] || "").split(',').map(s => s.trim());
                
                // 只有当当前说话人有效（且不是自己）时，自己才变暗
                // 注意：这里不需要判断 speaker 是否在 ignoreList，
                // 因为照你的逻辑：菲伦(ignore)说话 -> A(非ignore) 应该变灰。
                // 只要 A != 菲伦，且 A 也没在说话，A 就该黑。
                
                const maskOp = Number(params['MaskOpacity'] || 128);
                // 计算灰度值：255(白) -> 0(黑)
                let val = Math.max(0, 255 - maskOp);
                targetTint = (val << 16) | (val << 8) | val;
            }
            // 4. 遍历所有图层应用颜色 (修复因 Container 不传递 Tint 导致的无效问题)
            //    增加优化：如果颜色已经一致，就不再进行复杂的数学运算
            const step = 25; // 渐变速度
            
            this._layerSprites.forEach(sprite => {
                if (!sprite.visible) return; // 隐藏图层不处理
                // 优化：如果当前颜色等于目标颜色，直接跳过
                if (sprite.tint === targetTint) return;
                const currentRGB = this.hexToRgb(sprite.tint);
                const targetRGB = this.hexToRgb(targetTint);
                const r = this.moveTowards(currentRGB.r, targetRGB.r, step);
                const g = this.moveTowards(currentRGB.g, targetRGB.g, step);
                const b = this.moveTowards(currentRGB.b, targetRGB.b, step);
                sprite.tint = (r << 16) | (g << 8) | b;
            });
        }


        /**
         * 辅助：Hex 转 RGB 对象
         */
        hexToRgb(hex) {
            return {
                r: (hex >> 16) & 0xFF,
                g: (hex >> 8) & 0xFF,
                b: hex & 0xFF
            };
        }

        /**
         * 辅助：数值逼近
         */
        moveTowards(current, target, step) {
            if (Math.abs(current - target) < step) return target;
            return current < target ? current + step : current - step;
        }

        /**
         * 处理位置移动与整体淡入淡出
         */
        updatePositionAndOpacity() {
            const data = this.getData();
            if (!data) { 
                this.opacity = 0; 
                return; 
            }
            
            // 获取参数
            const params = PluginManager.parameters("ShowAndHideALLPic");
            const fadeDur = Number(params['FadeDuration'] || 20);
            const slideOffset = Number(params['SlideOffset'] || 30);

            // 透明度逻辑
            if (this.opacity < data.targetOpacity) {
                this.opacity = Math.min(this.opacity + 255 / fadeDur, data.targetOpacity);
            } else if (this.opacity > data.targetOpacity) {
                this.opacity = Math.max(this.opacity - 255 / fadeDur, data.targetOpacity);
            }
            data.opacity = this.opacity;

            // X轴位移逻辑
            let targetX = data.targetX;
            if (data.targetOpacity === 0) {
                // 退场时往旁边滑
                targetX = data.targetX + slideOffset;
            }
            
            // 计算滑动速度
            const speed = Math.abs(targetX - data.realX) / (fadeDur / 2); 
            
            if (Math.abs(data.realX - targetX) > 0.5) {
                if (data.realX < targetX) data.realX = Math.min(data.realX + speed, targetX);
                else if (data.realX > targetX) data.realX = Math.max(data.realX - speed, targetX);
            } else {
                 data.realX = targetX;
            }

            this._baseX = data.realX;
            this._baseY = data.y;
            
            // 如果当前没有特殊动作，则把计算出的坐标应用给 Sprite
            if (!data.action) {
                this.x = this._baseX;
                this.y = this._baseY;
            }
            
            this.scale.x = data.scale;
            this.scale.y = data.scale;
        }

        /**
         * 处理震动、跳跃等动作
         */
        updateAction() {
            const data = this.getData();
            if (!data || !data.action) return;
            
            const act = data.action;
            act.time++;
            
            const p = Math.min(act.time / act.duration, 1.0);
            let offsetX = 0;
            let offsetY = 0;

            if (act.type === 'jump') { 
                // 抛物线公式
                offsetY = 4 * act.power * p * (p - 1); 
            } else if (act.type === 'shake') {
                const freq = act.frequency || 10;
                const sinFactor = Math.sin(p * Math.PI * 2 * freq);
                offsetX = sinFactor * act.power * (1 - p); 
            } else if (act.type === 'nod') { 
                // 点头 (向下)
                offsetY = -(4 * act.power * p * (p - 1)); 
            } else if (act.type === 'bounce') {
                // Q弹
                if (p < 0.6) { 
                    const p1 = p / 0.6; 
                    offsetY = 4 * act.power * p1 * (p1 - 1); 
                } else { 
                    const p2 = (p - 0.6) / 0.4; 
                    offsetY = 4 * (act.power * 0.2) * p2 * (p2 - 1); 
                }
            }

            this.x = this._baseX + offsetX;
            this.y = this._baseY + offsetY;

            if (act.time >= act.duration) {
                data.action = null; 
                this.x = this._baseX;
                this.y = this._baseY;
            }
        }
    }


    // ==============================================================================
    // 3. 容器层: Spriteset_Base & Scene 控制
    // ==============================================================================

    const _Spriteset_Base_createPictures = Spriteset_Base.prototype.createPictures;
    Spriteset_Base.prototype.createPictures = function() {
        _Spriteset_Base_createPictures.call(this);
        this.createTachieContainer();
    };

    Spriteset_Base.prototype.createTachieContainer = function() {
        this._tachieContainer = new Sprite();
        // 初始化 Sprite 容器
        this._tachieSprites = {};

        // 如果层级模式是 BELOW (默认)，直接添加进 spriteset (在图片层之上，但在对话框等Window层之下)
        if (layerPosition === 'BELOW') {
             this.addChild(this._tachieContainer);
        }
        // 如果是 ABOVE，我们在 Scene 层级进行处理，这里只创建不添加，或者添加后移走
    };

    // 在每一帧更新立绘内容
    const _Spriteset_Base_update = Spriteset_Base.prototype.update;
    Spriteset_Base.prototype.update = function() {
        _Spriteset_Base_update.call(this);
        this.updateTachies();
    };

    Spriteset_Base.prototype.updateTachies = function() {
        if (!this._tachieContainer || !$gameSystem) return;
        
        const visible = $gameSwitches.value(switchId) && $gameSystem._tachieVisible;
        this._tachieContainer.visible = visible;
        if (!visible) return;

        const tachieData = $gameSystem._tachieData || {};
        
        Object.keys(tachieData).forEach(name => {
            if (!this._tachieSprites[name]) {
                const sprite = new Sprite_Tachie(name);
                this._tachieContainer.addChild(sprite);
                this._tachieSprites[name] = sprite;
            }
        });

        // 简单的 Z-sort (Y轴大的在前面)
        this._tachieContainer.children.sort((a, b) => a.y - b.y);
    };

    // --- 核心：处理图层覆盖 (ABOVE 模式) ---
    // 我们需要在 WindowLayer 创建之后，把立绘容器放上去
    
    // Scene_Map
    const _Scene_Map_createWindowLayer = Scene_Map.prototype.createWindowLayer;
    Scene_Map.prototype.createWindowLayer = function() {
        _Scene_Map_createWindowLayer.call(this);
        this.adjustTachieLayer();
    };

    Scene_Map.prototype.adjustTachieLayer = function() {
        if (layerPosition === 'ABOVE') {
            if (this._spriteset && this._spriteset._tachieContainer) {
                // 把容器从 spriteset 拿出来，放到 Scene 的最上层 (WindowLayer 之后)
                this.addChild(this._spriteset._tachieContainer);
            }
        }
    };

    // Scene_Battle (同理)
    const _Scene_Battle_createWindowLayer = Scene_Battle.prototype.createWindowLayer;
    Scene_Battle.prototype.createWindowLayer = function() {
        _Scene_Battle_createWindowLayer.call(this);
        this.adjustTachieLayer();
    };

    Scene_Battle.prototype.adjustTachieLayer = function() {
        if (layerPosition === 'ABOVE') {
            if (this._spriteset && this._spriteset._tachieContainer) {
                this.addChild(this._spriteset._tachieContainer);
            }
        }
    };


    // ==============================================================================
    // 4. 逻辑控制层
    // ==============================================================================

    function getConfigByName(name) {
        if (!name) return null;
        const cleanName = name.replace(/<[^>]+>/g, "").trim();
        return tachieConfigMap[cleanName] || null;
    }
    
    // ==============================================================================
    // 3. 逻辑控制层 (修正版 setSpeakerName：自动互斥与构建数组)
    // ==============================================================================
    const _Game_Message_setSpeakerName = Game_Message.prototype.setSpeakerName;
    Game_Message.prototype.setSpeakerName = function(speakerName) {
        // 1. 先进行基础的正则处理，把标签提取出来，并不此时就修改 speakerName
        //    之所以不直接用父类方法，是因为要在父类方法调用前就把标签剥离干净
        //    否则父类(Window_NameBox)可能会拿到带标签的脏数据
        
        const pluginName = "ShowAndHideALLPic";
        const params = PluginManager.parameters(pluginName);
        const switchId = Number(params['SwitchId'] || 0);
        const ignoreNames = (params['IgnoreNames'] || "").split(',').map(s => s.trim());

        // 临时变量用于提取
        let tempProcessedName = speakerName || "";
        let tempX = null, tempY = null, tempScale = null;
        let expression = "";

        // --- 开始提取 <l> 标签 ---
        const regLoc = /<l\s*(-?\d+)\s*,\s*(-?\d+)(?:\s*,\s*(\d+(?:\.\d+)?))?>/i;
        if (regLoc.test(tempProcessedName)) {
            tempProcessedName = tempProcessedName.replace(regLoc, (_, x, y, s) => {
                tempX = Number(x); 
                tempY = Number(y); 
                tempScale = s ? Number(s) : null;
                return ""; // 替换为空，即删除标签
            });
        }

        // --- 开始提取 <e> 标签 ---
        // 注意正则写得稍微宽容一点，防止有奇怪的空格
        const regExp = /<(e.+?)>/i; 
        if (regExp.test(tempProcessedName)) {
            tempProcessedName = tempProcessedName.replace(regExp, (_, e) => {
                expression = e.trim(); 
                return ""; // 替换为空，即删除标签
            });
        }
        
        // --- 清理剩余残留和首尾空格 ---
        // 这一步得到的 cleanName 才是真正显示在名字框里的纯净名字
        const cleanName = tempProcessedName.trim();

        // 2. 调用父类方法，把干净的名字传进去！(这是修复显示问题的关键)
        _Game_Message_setSpeakerName.call(this, cleanName);

        // 如果开关没开或系统隐藏，就不做立绘逻辑，但名字已经被净化了
        if ((switchId && !$gameSwitches.value(switchId)) || !$gameSystem._tachieVisible) return;
        if (!cleanName) return;

        // 3. 后续立绘逻辑使用 cleanName 继续处理
        const finalName = cleanName; // 此时它已经是没有标签的了

        // 更新当前说话人（用于变暗逻辑）
        if (finalName) {
            $gameSystem._currentSpeaker = finalName;
        }

        // 隐藏逻辑
        const isIgnoredSpeaker = ignoreNames.includes(finalName);

        if (!isIgnoredSpeaker) {
            const currentData = $gameSystem._tachieData || {};
            Object.keys(currentData).forEach(existingName => {
                if (existingName !== finalName && !ignoreNames.includes(existingName)) {
                    $gameSystem.hideTachie(existingName);
                }
            });
        }

        // 显示逻辑
        // 注意：getConfigByName 内部也需要确保能匹配到 cleanName
        const config = getConfigByName(finalName);
        if (config || expression) {
            const globalDefaultX = Number(params['DefaultX'] || 640);
            const globalDefaultY = Number(params['DefaultY'] || 720);
            const globalDefaultScale = Number(params['DefaultScale'] || 1.0);

            const finalX = tempX !== null ? tempX : (config && config.x !== null ? config.x : globalDefaultX);
            const finalY = tempY !== null ? tempY : (config && config.y !== null ? config.y : globalDefaultY);
            const finalScale = tempScale !== null ? tempScale : (config && config.scale !== null ? config.scale : globalDefaultScale);

            let folder = config ? "img/pictures/" + config.folder : "img/pictures/";
            let layer0 = (config && config.fileName) ? folder + config.fileName : null;
            let layer1 = expression ? folder + expression : null;

            if (layer0 || layer1) {
                // 如果 layer1 (表情) 存在，确保 layer0 (身体) 也被传递或者保留
                // 这里的逻辑假设是每次都重绘，如果需要更复杂的图层合并，showTachie 里已经处理了
                $gameSystem.showTachie(finalName, [layer0, layer1], finalX, finalY, finalScale);
            }
        }
    };


    // --- 连贯性修复 ---

    Game_Screen.prototype.getLeefInterpreter = function() {
        // 1. 获取根解释器（地图 或 战斗）
        let interpreter = $gameParty.inBattle() ? $gameTroop._interpreter : $gameMap._interpreter;
        // 2. 循环向下查找，直到找到最底层的“叶子”解释器
        // 只要存在子解释器，就说明当前正在运行子事件（如公共事件）
        while (interpreter._childInterpreter) {
            interpreter = interpreter._childInterpreter;
        }

        if (!interpreter || !interpreter.isRunning()) {
            return false;
        }

        return interpreter;
    };

    Game_Screen.prototype.isNextCommandContinuous = function() {
        const interpreter = this.getLeefInterpreter();
        if (!interpreter || !interpreter.isRunning()) return false;

        const list = interpreter._list;
        let index = interpreter._index + 1; 

        const safeCodes = [
            0, 118, 108, 408, 117, 121, 122, 123, 230, 231, 232, 234, 235,
            241, 245, 249, 250, 251, 205, 212, 213, 401, 402, 403, 404, 405, 357, 657, 505
        ];

        while (index < list.length) {
            const cmd = list[index];
            const code = cmd.code;

            if (code === 101) return true; // Show Text
            if ([102, 103, 104].includes(code)) return true; // Choice/Input

            if (safeCodes.includes(code)) {
                index++;
                continue;
            }
            return false;
        }
        return false;
    };

    Game_Screen.prototype.getInterpreter = function() {
        if ($gameParty.inBattle()) {
            return $gameTroop._interpreter;
        } else {
            return $gameMap._interpreter;
        }
    };

    // ==============================================================================
    // [新增] 场景切换与清理逻辑
    // ==============================================================================
    
    // 辅助函数：清理 targetOpacity 为 0 的废弃数据
    Game_System.prototype.cleanUpHiddenTachies = function() {
        if (!this._tachieData) return;
        Object.keys(this._tachieData).forEach(name => {
            // 如果目标是隐藏，直接删除数据，释放内存，防止鬼影
            if (this._tachieData[name].targetOpacity === 0) {
                delete this._tachieData[name];
            }
        });
    };

    // 1. 离开场景时清理 (解决切菜单/战斗回来后的残留)
    const _Scene_Base_terminate = Scene_Base.prototype.terminate;
    Scene_Base.prototype.terminate = function() {
        if ($gameSystem) $gameSystem.cleanUpHiddenTachies();
        _Scene_Base_terminate.call(this);
    };

    // ==============================================================================
    // 3. 对话/事件结束时的处理
    // ==============================================================================
    const _Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;
    Window_Message.prototype.terminateMessage = function() {
        _Window_Message_terminateMessage.call(this);
        if (switchId && !$gameSwitches.value(switchId)) return;
        // 如果下一条指令是连续的（比如还有对话），就不隐藏
        if ($gameScreen.isNextCommandContinuous()) {
            return;
        } else {
            // 正常流程：只执行隐藏，让 update 循环去处理淡出动画
            $gameSystem.hideAllTachies();
            // 【注意】：如果你一定要在事件结束立刻清除数据（牺牲淡出动画，换取内存绝对干净），
            // $gameSystem.cleanUpHiddenTachies();
        }
    };

    // 2. 核心：在事件解释器结束时清理
    const _Game_Interpreter_terminate = Game_Interpreter.prototype.terminate;
    Game_Interpreter.prototype.terminate = function() {
        _Game_Interpreter_terminate.call(this);
        if (switchId && !$gameSwitches.value(switchId)) return;
        // 1. 检查是否是地图的主解释器 (正在跑点击事件/自动事件/公共事件的那条线)
        const isMapMain = (this === $gameMap._interpreter);
        
        // 2. 检查是否是战斗的主解释器
        const isBattleMain = ($gameTroop && this === $gameTroop._interpreter);
        // 仅当是 "主事件流" 彻底结束时，才执行清场
        // 并行事件(Parallel)拥有自己独立的 interpreter 实例，不会触发这里，避免了并行事件如天气系统不停清除立绘的问题
        if (isMapMain || isBattleMain) {
            $gameSystem.hideAllTachies();
        }
    };

    // ==============================================================================
    // 5. 插件指令
    // ==============================================================================

    PluginManager.registerCommand(pluginName, 'HideAllTachie', args => {
        const type = args.type;
        if (type === 'HIDE') {
            $gameSystem._tachieVisible = false;
            $gameSystem.hideAllTachies();
        } else {
            $gameSystem._tachieVisible = true;
        }
    });

    PluginManager.registerCommand(pluginName, 'PlayAction', args => {
        const name = args.name;
        const type = args.actionType;
        const power = Number(args.power || 40);
        const dur = Number(args.duration || 20);
        const freq = Number(args.frequency || 10);
        
        $gameSystem.setTachieAction(name, type, power, dur, freq);
    });

})();
