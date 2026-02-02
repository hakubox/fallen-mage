/*:
 * @target MZ
 * @plugindesc (V3) 定制主菜单：指令窗口高度自适应、居中，支持无限自定义菜单项。
 * @author AI Assistant
 *
 * @param Menu Width
 * @text 菜单宽度
 * @desc 指令窗口的宽度。
 * @type number
 * @default 300
 *
 * @param Custom Commands
 * @text 自定义菜单列表
 * @desc在这里配置额外添加的菜单项。
 * @type struct<MenuCommand>[]
 * @default []
 *
 * @help
 * ============================================================================
 * 功能介绍
 * ============================================================================
 * 1. 极简风格：按 ESC 只显示中间的指令列表，无背景框、无金币、无状态。
 * 2. 自动高度：窗口高度会根据菜单项的数量自动缩放。
 * 3. 自动居中：窗口永远显示在屏幕正中心。
 * 4. 强大的自定义：可以添加无数个新菜单，支持开关控制显示、执行代码或公共事件。
 *
 * ============================================================================
 * 常见问题
 * ============================================================================
 * Q: 为什么菜单显示不出来？
 * A: 请检查“显隐条件类型”是否设置正确。如果不确定，先选“总是显示”。
 *
 * Q: 怎么写JS代码？
 * A: 比如打开存档界面是 SceneManager.push(Scene_Save);
 */

/*~struct~MenuCommand:
 * @param Name
 * @text 菜单名称
 * @desc 显示在菜单上的文字。
 * @type string
 * @default 新选项
 *
 * @param Visible Type
 * @text 显隐条件类型
 * @desc 该选项什么时候显示？
 * @type select
 * @option 总是显示
 * @value always
 * @option 开关控制 (ON时显示)
 * @value switch
 * @option JS脚本 (返回true显示)
 * @value script
 * @default always
 *
 * @param Visible Switch ID
 * @text -> 关联开关ID
 * @desc 当"显隐条件类型"选为"开关控制"时有效。
 * @type switch
 * @default 0
 *
 * @param Visible Script
 * @text -> JS条件表达式
 * @desc 当"显隐条件类型"选为"JS脚本"时有效。例: $gameParty.gold() > 100
 * @type note
 * @default "true"
 *
 * @param Action Type
 * @text 执行动作类型
 * @desc 点击后做什么？
 * @type select
 * @option 执行公共事件
 * @value common_event
 * @option 执行JS代码
 * @value script
 * @default common_event
 *
 * @param Common Event ID
 * @text -> 公共事件ID
 * @desc 动作类型为"公共事件"时执行。
 * @type common_event
 * @default 0
 *
 * @param Action Script
 * @text -> JS执行代码
 * @desc 动作类型为"JS代码"时执行。
 * @type note
 * @default "console.log('Hello');"
 */

(() => {
    const pluginName = "SimpleMenuWithGallery";
    
    // --- 参数解析工具 ---
    const parameters = PluginManager.parameters(pluginName);
    const menuWidth = Number(parameters['Menu Width'] || 300);
    
    // 解析 JSON 列表
    let customCommandsList = [];
    if (parameters['Custom Commands']) {
        try {
            customCommandsList = JSON.parse(parameters['Custom Commands']).map(str => {
                const obj = JSON.parse(str);
                // 二次转换数字类型，防止报错
                obj['Visible Switch ID'] = Number(obj['Visible Switch ID']);
                obj['Common Event ID'] = Number(obj['Common Event ID']);
                return obj;
            });
        } catch (e) {
            console.error("SimpleMenuWithGallery: 参数解析错误", e);
            customCommandsList = [];
        }
    }

    // --- 辅助函数：判断菜单是否显示 ---
    function isCommandVisible(cmdConfig) {
        const type = cmdConfig['Visible Type'];
        if (type === 'switch') {
            return $gameSwitches.value(cmdConfig['Visible Switch ID']);
        } else if (type === 'script') {
            try {
                // 去掉引号解析 script
                const scriptContent = JSON.parse(cmdConfig['Visible Script']); 
                return !!eval(scriptContent);
            } catch (e) {
                // 兼容直接填写的非JSON字符串
                return !!eval(cmdConfig['Visible Script']);
            }
        }
        return true; // always
    }

    //-----------------------------------------------------------------------------
    // Window_MenuCommand
    //-----------------------------------------------------------------------------
    const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        _Window_MenuCommand_addOriginalCommands.call(this);
        
        // 遍历参数列表添加指令
        customCommandsList.forEach((cmd, index) => {
            if (isCommandVisible(cmd)) {
                // 使用 'custom_cmd_索引' 作为唯一的 symbol
                this.addCommand(cmd['Name'], 'custom_cmd_' + index, true);
            }
        });
    };

    //-----------------------------------------------------------------------------
    // Scene_Menu
    //-----------------------------------------------------------------------------

    // 1. 禁用状态和金币窗口
    Scene_Menu.prototype.createStatusWindow = function() { this._statusWindow = null; };
    Scene_Menu.prototype.createGoldWindow = function() { this._goldWindow = null; };

    // 2. 修复 refresh 报错 (V2 的修复逻辑)
    Scene_Menu.prototype.start = function() {
        Scene_MenuBase.prototype.start.call(this);
        if (this._statusWindow) {
            this._statusWindow.refresh();
        }
    };

    // 3. 重写 createCommandWindow 实现：自动高度 + 动态绑定
    Scene_Menu.prototype.createCommandWindow = function() {
        // 先用一个临时矩形创建窗口
        const tempRect = new Rectangle(0, 0, menuWidth, this.mainAreaHeight());
        this._commandWindow = new Window_MenuCommand(tempRect);
        
        // --- 核心修改：重新计算高度并居中 ---
        // 获取实际生成的指令数量
        const itemCount = this._commandWindow.maxItems(); 
        // 计算完美适应内容的高度
        const perfectHeight = this._commandWindow.fittingHeight(itemCount);
        // 限制高度不超过屏幕，防止溢出
        const finalHeight = Math.min(perfectHeight, this.mainAreaHeight());
        
        // 应用新尺寸
        this._commandWindow.height = finalHeight;
        // 计算新的Y坐标 (垂直居中)
        this._commandWindow.y = (Graphics.boxHeight - finalHeight) / 2;
        this._commandWindow.x = (Graphics.boxWidth - menuWidth) / 2;
        // ---------------------------------

        // 绑定原版 Handler
        this._commandWindow.setHandler('item',    this.commandItem.bind(this));
        
        // 为技能/装备/状态绑定“安全处理”，防止崩溃
        this._commandWindow.setHandler('skill',   this.commandPersonalSafe.bind(this));
        this._commandWindow.setHandler('equip',   this.commandPersonalSafe.bind(this));
        this._commandWindow.setHandler('status',  this.commandPersonalSafe.bind(this));
        
        this._commandWindow.setHandler('formation', this.commandFormation.bind(this));
        this._commandWindow.setHandler('options', this.commandOptions.bind(this));
        this._commandWindow.setHandler('save',    this.commandSave.bind(this));
        this._commandWindow.setHandler('gameEnd', this.commandGameEnd.bind(this));
        this._commandWindow.setHandler('cancel',  this.popScene.bind(this));

        // --- 绑定自定义指令 Handler ---
        customCommandsList.forEach((cmd, index) => {
            const sym = 'custom_cmd_' + index;
            // 使用闭包捕获当前的 cmd 配置
            this._commandWindow.setHandler(sym, () => {
                this.onCustomCommand(cmd);
            });
        });

        this.addWindow(this._commandWindow);
    };

    // 4. 处理自定义命令的具体逻辑
    Scene_Menu.prototype.onCustomCommand = function(cmdConfig) {
        const type = cmdConfig['Action Type'];
        
        if (type === 'common_event') {
            const commonEventId = cmdConfig['Common Event ID'];
            if (commonEventId > 0) {
                this.popScene(); // 必须关闭菜单才能运行公共事件
                $gameTemp.reserveCommonEvent(commonEventId);
            } else {
                this._commandWindow.activate();
                console.warn("未设置公共事件ID");
            }
        } else if (type === 'script') {
            // 执行 JS 代码
            try {
                let scriptStr = cmdConfig['Action Script'];
                // 兼容两种输入：纯字符串 或 JSON字符串(Note类型特性)
                if (scriptStr.startsWith('"') && scriptStr.endsWith('"')) {
                    scriptStr = JSON.parse(scriptStr);
                }
                eval(scriptStr);
                
                // 执行脚本后，通常不需要像公共事件那样强制关闭菜单
                // 但如果脚本是场景跳转(SceneManager.push)，则不需要处理
                // 如果只是普通逻辑，可能需要重新激活窗口
                // 这里做一个简单的判断：如果脚本执行完还在这个场景，就激活窗口
                if (SceneManager._scene === this) {
                    this._commandWindow.activate();
                }
            } catch (e) {
                console.error("自定义菜单执行JS错误:", e);
                this._commandWindow.activate();
            }
        }
    };

    // 5. 原版按钮的安全跳转
    Scene_Menu.prototype.commandPersonalSafe = function() {
        $gameParty.setMenuActor($gameParty.members()[0]);
        const symbol = this._commandWindow.currentSymbol();
        switch (symbol) {
            case 'skill': SceneManager.push(Scene_Skill); break;
            case 'equip': SceneManager.push(Scene_Equip); break;
            case 'status': SceneManager.push(Scene_Status); break;
        }
    };

})();
