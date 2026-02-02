//=============================================================================
// ** RPG Maker MZ - Hakubox_QuickEventSkip.js
//=============================================================================

var
Hakubox                = Hakubox                || {};
Hakubox.QuickEventSkip = Hakubox.QuickEventSkip || { VERSION: [1, 0, 0] };

/*:
 * @plugindesc 加速功能 v1.0.0
 * @url http://dragonrefuge.net
 * @target MZ
 * @author hakubox
 * @help
 * 这是一个供玩家在游玩中加速的插件，按住确认按钮或鼠标左键不放即可生效。
 * 注：加速代码是从DevToolsManage中搬运，两边加速功能同时打开可能会带来问题。
 * 
 * 要分配一个键盘按键，请使用唯一的字符串名称。可以参考以下按键名称：
 *  9: "tab", // tab
 *  13: "ok", // enter
 *  16: "shift", // shift
 *  17: "control", // control
 *  18: "control", // alt
 *  27: "escape", // escape
 *  32: "ok", // space
 *  33: "pageup", // pageup
 *  34: "pagedown", // pagedown
 *  37: "left", // left arrow
 *  38: "up", // up arrow
 *  39: "right", // right arrow
 *  40: "down", // down arrow
 *  45: "escape", // insert
 *  81: "pageup", // Q
 *  87: "pagedown", // W
 *  88: "escape", // X
 *  90: "ok", // Z
 *  96: "escape", // numpad 0
 *  98: "down", // numpad 2
 *  100: "left", // numpad 4
 *  102: "right", // numpad 6
 *  104: "up", // numpad 8
 *  120: "debug" // F9
 *
 * @param enabled
 * @text 是否启用加速
 * @type boolean
 * @on 启用加速
 * @off 禁用加速
 * @default true
 *
 * @param skipKey
 * @text 跳过的按键
 * @type string
 * @desc 跳过按键的字符串标识符
 * @default control
 *
 * @param factor
 * @text 加速因子
 * @desc 加速是在事件处理中按下确认按钮时激活的。（默认5）
 * @type number
 * @default 5
 * @min 1
 * @max 16
 *
 */

(($) => {
  //-----------------------------------------------------------------------------
  // * Plugin Definitions
  //-----------------------------------------------------------------------------   

  "use strict";
  const pluginName = "Hakubox_QuickEventSkip";
  const params = PluginManager.parameters(pluginName);
  const parameters = Object.assign({}, params);

  parameters.enabled = (parameters.enabled === 'true');
  parameters.factor = Number(parameters.factor);
  parameters.skipKey = parameters.skipKey || "control";
  

  //-----------------------------------------------------------------------------
  // SceneManager
  //
  // 事件速度相关

  const _SceneManager_determineRepeatNumber = SceneManager.determineRepeatNumber;
  SceneManager.determineRepeatNumber = function(deltaTime) {
    const result = _SceneManager_determineRepeatNumber.apply(this, arguments);
    if (this._scene && this._scene.isAnyWindowActive()) {
      return result;
    }
    
    // Input.isLongPressed("ok") || TouchInput.isLongPressed()
    if (parameters.enabled && Input.isLongPressed(parameters.skipKey)) {
      return result * parameters.factor;
    } else {
      return result;
    }
  };


//--------CHANGED CORE:

const Original_isTriggered = Window_Message.prototype.isTriggered;
Window_Message.prototype.isTriggered = function() {
  if (
    TouchInput.isLongPressed() ||
    Input.isLongPressed("ok") ||
    parameters.enabled && (
      Input.isPressed(parameters.skipKey) || TouchInput.isLongPressed(parameters.skipKey)
    )
  ) {
    this._pauseSkip = false;
    return true;
  }

  return Original_isTriggered.call(this);
};

Scene_Base.prototype.isAnyWindowActive = function() {
  if (this._windowLayer) {
    return this._windowLayer.children.some(win => {
      return win instanceof Window_Selectable && win.active;
    });
  } else {
    return false;
  }
};

})(Hakubox.QuickEventSkip);