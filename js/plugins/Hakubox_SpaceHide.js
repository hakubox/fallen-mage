/*:
 * @target MZ
 * @plugindesc [v2.0] 对话中按空格键隐藏对话框，并显示自定义提示窗口。
 * @author AI Assistant
 *
 * @param ---原有设置---
 * 
 * @param enableSwitchId
 * @text 功能启用开关ID
 * @desc 开启此开关后才允许使用空格键隐藏功能。设为0则始终开启。
 * @type switch
 * @default 0
 *
 * @param onHideCode
 * @text 隐藏时执行JS
 * @desc 对话框隐藏瞬间执行的代码。
 * @type note
 * @default ""
 *
 * @param onShowCode
 * @text 恢复时执行JS
 * @desc 对话框恢复显示瞬间执行的代码。
 * @type note
 * @default ""
 * 
 * @param ---提示窗口设置---
 * 
 * @param showHint
 * @text 提示窗口是否启用
 * @desc 开启此开关后，隐藏对话时才会显示提示小窗口。设为0则始终显示提示。
 * @type boolean
 * @default true
 * 
 * @param hintText
 * @text 提示文本
 * @desc 提示窗口中显示的文字。
 * @type string
 * @default 按空格键恢复对话
 * 
 * @param hintX
 * @text 窗口X坐标
 * @desc 提示窗口的X坐标。
 * @type number
 * @default 10
 * 
 * @param hintY
 * @text 窗口Y坐标
 * @desc 提示窗口的Y坐标。
 * @type number
 * @default 10
 * 
 * @param hintPadding
 * @text 窗口内边距
 * @desc 窗口边框到文字的距离(Padding)。越小窗口越窄。
 * @type number
 * @default 12
 * 
 * @param hintFontSize
 * @text 字体大小
 * @desc 提示文字的大小。
 * @type number
 * @default 20
 * 
 * @param hintColor
 * @text 字体颜色
 * @desc 支持16进制颜色码 (例如 #FFFF00 是黄色)。
 * @type string
 * @default #ffffff
 * 
 * @param hintBold
 * @text 是否加粗
 * @desc 文字是否加粗显示。
 * @type boolean
 * @default false
 * 
 * @param hintDuration
 * @text 显示时长
 * @desc 窗口显示时长（帧数）
 * @type number
 * @default 180
 * @min 30
 *
 * @help
 * ============================================================================
 * 功能说明
 * ============================================================================
 * 1. 按下【空格键】(Space) 隐藏/显示对话框。
 * 2. 隐藏期间，除空格键外的所有按键(包括回车、鼠标点击)都会被拦截，剧情不推进。
 * 3. 隐藏时可以在屏幕指定位置显示一个“提示窗口”，防止玩家误以为卡死。
 *
 * ============================================================================
 * 提示窗口配置建议
 * ============================================================================
 * 如果觉得窗口太大，可以减小“窗口内边距”和“字体大小”。
 * 如果不想显示窗口背景，只想显示纯文字，可以通过插件指令或脚本将窗口
 * 透明度设为0（需要修改插件代码，本版本默认为标准窗口样式）。
 * 
 * 颜色代码参考：
 * 白色: #ffffff
 * 黄色: #ffff00
 * 红色: #ff0000
 * 黑色: #000000
 */

(() => {
  const pluginName = "Hakubox_SpaceHide";
  const parameters = PluginManager.parameters(pluginName);

  // 参数获取
  const enableSwitchId = Number(parameters['enableSwitchId'] || 0);
  const onHideCode = JSON.parse(parameters['onHideCode'] || '""');
  const onShowCode = JSON.parse(parameters['onShowCode'] || '""');

  // 提示窗口参数
  const showHint = parameters['showHint'] == 'true';
  const hintText = String(parameters['hintText'] || "按空格键恢复");
  const hintX = Number(parameters['hintX'] || 10);
  const hintY = Number(parameters['hintY'] || 10);
  const hintPadding = Number(parameters['hintPadding'] || 12);
  const hintFontSize = Number(parameters['hintFontSize'] || 20);
  const hintColor = String(parameters['hintColor'] || "#ffffff");
  const hintBold = parameters['hintBold'] === 'true';
  const hintDuration = Number(parameters['hintDuration'] || 180);

  // ------------------------------------------------------------------------
  // 按键映射：将 Space (32) 分离出 'ok'，定义为 'msgHide'
  // ------------------------------------------------------------------------
  Input.keyMapper[32] = 'msgHide';

  // ------------------------------------------------------------------------
  // 新增类：Window_MsgHideHint (提示窗口) 
  // ------------------------------------------------------------------------
  class Window_MsgHideHint extends Window_Base {
    initialize(rect) {
      super.initialize(rect);
      this.opacity = 255;
      this.contentsOpacity = 255;
      this.visible = false;
      this._timer = 0; // 初始化计时器
      this.refresh();
    }

    static calculateRect() {
      const tempBitmap = new Bitmap(1, 1);
      tempBitmap.fontSize = hintFontSize;
      const textWidth = tempBitmap.measureTextWidth(hintText);
      const w = textWidth + hintPadding * 2 + 20;
      const h = hintFontSize + hintPadding * 2 + 14;
      tempBitmap.destroy();
      return new Rectangle(hintX, hintY, w, h);
    }

    refresh() {
      if (!this.contents) return;
      this.contents.clear();
      this.contents.fontSize = hintFontSize;
      this.contents.fontBold = hintBold;
      this.changeTextColor(hintColor);

      const width = this.innerWidth;
      const height = this.innerHeight;
      const y = Math.max(0, (height - hintFontSize) / 2);
      this.drawText(hintText, 0, 0, width, 'center');

      this.resetFontSettings();
    }

    updatePadding() {
      this.padding = hintPadding;
    }

    // 【新增】激活提示：重置不透明度和计时器
    activateHint() {
      this.visible = true;
      this.opacity = 255;
      this.contentsOpacity = 255;
      // 设定计时器：帧数
      this._timer = hintDuration;
    }

    // 【新增】每帧更新：处理倒计时和渐隐
    update() {
      super.update();

      // 只有当窗口可见且设定了自动消失时间(>0)时才运行倒计时
      if (this.visible && hintDuration > 0) {
        if (this._timer > 0) {
          this._timer--;
        } else {
          // 倒计时结束，开始渐隐
          this.opacity -= 15;
          this.contentsOpacity -= 15;

          // 完全透明后设为不可见，节省性能
          if (this.opacity <= 0) {
            this.visible = false;
          }
        }
      }
    }
  }

  // ------------------------------------------------------------------------
  // 扩展 Scene_Message (或 Scene_Map/Battle) 来创建提示窗口
  // ------------------------------------------------------------------------
  // 我们选择 Scene_Message 因为它是 Map 和 Battle 的父类，且负责管理 MessageWindow
  const _Scene_Message_createMessageWindow = Scene_Message.prototype.createMessageWindow;
  Scene_Message.prototype.createMessageWindow = function () {
    _Scene_Message_createMessageWindow.call(this);
    this.createHideHintWindow();
  };

  Scene_Message.prototype.createHideHintWindow = function () {
    const rect = Window_MsgHideHint.calculateRect();
    this._hideHintWindow = new Window_MsgHideHint(rect);
    this.addWindow(this._hideHintWindow);

    // 将提示窗口的引用传递给 MessageWindow，方便它控制显隐
    if (this._messageWindow) {
      this._messageWindow.setHideHintWindow(this._hideHintWindow);
    }
  };

  // ------------------------------------------------------------------------
  // 扩展 Window_Message 类
  // ------------------------------------------------------------------------

  // 初始化时增加状态标记
  const _Window_Message_initMembers = Window_Message.prototype.initMembers;
  Window_Message.prototype.initMembers = function () {
    _Window_Message_initMembers.call(this);
    this._isMessageHiddenByToggle = false;
    this._hideHintWindow = null; // 引用提示窗口
  };

  Window_Message.prototype.setHideHintWindow = function (win) {
    this._hideHintWindow = win;
  };

  // 核心：重写输入更新逻辑
  const _Window_Message_updateInput = Window_Message.prototype.updateInput;
  Window_Message.prototype.updateInput = function () {

    // 1. 检查总功能开关
    if (enableSwitchId > 0 && !$gameSwitches.value(enableSwitchId)) {
      if (this._isMessageHiddenByToggle) {
        this.toggleMessageVisibility();
      }
      return _Window_Message_updateInput.call(this);
    }

    // 2. 检测隐藏键 (空格)
    if (this.isHideTriggered() && (this._isMessageHiddenByToggle || (this.isOpen() && this.visible))) {
      this.toggleMessageVisibility();
      return true;
    }

    // 3. 如果隐藏中，阻断一切输入
    if (this._isMessageHiddenByToggle) {
      return true;
    }

    return _Window_Message_updateInput.call(this);
  };

  Window_Message.prototype.isHideTriggered = function () {
    return Input.isTriggered('msgHide') || TouchInput.isCancelled();
  };

  // 控制提示窗口的逻辑
  Window_Message.prototype.updateHintWindowVisibility = function (isHidden) {
    if (!this._hideHintWindow) return;
    if (isHidden) {
      // 检查开关：只有开关开启 (或设为0) 时才显示
      if (showHint) {
        // 调用新写的 activateHint 来显示窗口并重置倒计时
        this._hideHintWindow.activateHint();
      } else {
        this._hideHintWindow.visible = false;
      }
    } else {
      // 恢复正常对话时，强制隐藏
      this._hideHintWindow.visible = false;
    }
  };

  // 执行切换显隐的逻辑
  Window_Message.prototype.toggleMessageVisibility = function () {
    this._isMessageHiddenByToggle = !this._isMessageHiddenByToggle;
    const isHidden = this._isMessageHiddenByToggle;

    // 1. 控制对话框本身
    this.visible = !isHidden;

    // 2. 控制提示窗口 (核心新增)
    this.updateHintWindowVisibility(isHidden);

    // 3. 控制姓名框
    if (this._nameBoxWindow) {
      if (isHidden) {
        this._nameBoxWindow.visible = false;
      } else {
        if (this._nameBoxWindow.isOpen()) {
          this._nameBoxWindow.visible = true;
        }
      }
    }

    // 4. 控制选择框
    if ($gameMessage.isChoice()) {
      if (this._choiceListWindow) {
        this._choiceListWindow.visible = !isHidden;
      }
    }

    // 5. 执行自定义脚本
    try {
      if (isHidden) {
        if (onHideCode) eval(onHideCode);
      } else {
        if (onShowCode) eval(onShowCode);
      }
    } catch (e) {
      console.error("SimpleMessageHide 脚本错误:", e);
    }
  };

  const _Window_Message_update = Window_Message.prototype.update;
  Window_Message.prototype.update = function () {
    // 如果处于隐藏状态，持续检查提示窗口是否需要依据开关变化而刷新
    // (例如玩家在隐藏期间，通过并行事件关闭了提示窗口的开关，虽然这很少见)
    if (this._isMessageHiddenByToggle && this._hideHintWindow) {
      // 这里可以加逻辑实时刷新开关状态，但为了性能通常只在切换时判断即可。
      // 暂不加入实时监测开关变化，按需添加。
    }
    _Window_Message_update.call(this);
  };

})();
