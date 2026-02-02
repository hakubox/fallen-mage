/*:
 * @target MV MZ
 * @plugindesc v2.0 选项详细说明窗口插件 (MV/MZ通用版) - 支持自动换行、动态修改、双引擎兼容。
 * @author 
 *
 * @param Switch ID
 * @text 启用开关 ID
 * @desc 当此开关打开时，才会显示说明窗口。设为 0 则默认开启。插件指令修改状态时会自动更新此开关。
 * @default 0
 * @type switch
 *
 * @param Default Font Size
 * @text 默认字体大小
 * @desc 说明文字的大小。MV标准为28，MZ标准为26。
 * @default 22
 * @type number
 *
 * @param Default Text Color
 * @text 默认文字颜色
 * @desc 使用系统色板的索引（0-31）。例如 0 是白色，6 是黄色。
 * @default 0
 * @type number
 * @min 0
 * @max 31
 *
 * @param Window Padding
 * @text 窗口内边距
 * @desc 说明窗口的内边距。
 * @default 18
 * @type number
 *
 * @param Line Spacing
 * @text 行间距
 * @desc 每一行文字之间的额外垂直间距。
 * @default 4
 * @type number
 * 
 * @param Window Opacity
 * @text 窗口背景透明度
 * @desc 0为全透明，255为不透明。
 * @default 192
 * @type number
 * @min 0
 * @max 255
 * 
 * @param Min Width
 * @text 最小说明窗口宽度
 * @desc 设定说明窗口的固定宽度。
 * @default 400
 * @type number
 * 
 * @param Max Width
 * @text 最大说明窗口宽度
 * @desc 设定说明窗口的固定宽度。
 * @default 800
 * @type number
 *
 * @command GetChoiceDescState
 * @text 修改显示状态
 * @desc 开启或关闭说明窗口（如果绑定了开关ID，开关也会被更新）。
 *
 * @arg visible
 * @text 是否显示
 * @type boolean
 * @default true
 * @desc true显示，false隐藏。
 *
 * @command SetDynamicDesc
 * @text 动态修改说明
 * @desc 临时修改某个选项的说明文本。需要在【显示选项】指令之前执行。
 *
 * @arg index
 * @text 选项索引
 * @type number
 * @min 1
 * @desc 第几个选项（从1开始）。
 * @default 1
 *
 * @arg text
 * @text 说明文本
 * @type note
 * @desc 新的说明内容。
 * 
 * @help
 * ============================================================================
 * 功能介绍 (v2.0)
 * ============================================================================
 * 1. 自动吸附：说明窗口自动出现在选项窗口的左侧或右侧。
 * 2. 自动换行：文本过长时自动折行，不需要手动输入 \n。
 * 3. 混合语法：支持 MV/MZ 所有的控制字符 (\C, \V, \I, \{ 等)。
 * 4. 动态高度：根据内容自动调整窗口高度。
 * 5. 双向兼容：一套代码同时支持 MV 和 MZ。
 *
 * ============================================================================
 * 基础使用方法
 * ============================================================================
 * 在“显示选项”的输入框中，使用以下格式：
 * 
 *   选项名称<说明文本>
 * 
 * 示例：
 *   1. 攻击<对敌人造成物理伤害。>
 *   2. 技能<消耗\C[2]MP\C[0]使用魔法。\I[64]>
 *   3. 长文本<这段话很长很长，插件会自动帮你换行的，不用担心超出。>
 * 
 * ============================================================================
 * 插件指令 (MV & MZ 通用)
 * ============================================================================
 * 
 * 1. 修改显示状态 (Toggle Visibility)
 *    MV: 插件指令 -> ChoiceDesc SetVisible true (或 false)
 *    MZ: 插件指令 -> 选择 [修改显示状态], 设置参数。
 *    说明：这等同于操作参数里绑定的“启用开关ID”。
 *
 * 2. 动态修改说明 (Dynamic Description)
 *    场景：你想根据变量不同，让同一个选项显示不同的说明。
 *    操作：在【显示选项】之前调用此指令。
 *    
 *    MV: 插件指令 -> ChoiceDesc SetDesc 1 这是新的说明文本
 *        (参数释义: SetDesc [选项索引1-n] [文本])
 *    MZ: 插件指令 -> 选择 [动态修改说明], 设置索引和文本。
 *    
 *    注意：动态修改只对紧接着的下一次选项有效，选项关闭后会自动重置。
 *
 * ============================================================================
 * 脚本调用 (高级用户)
 * ============================================================================
 * $gameSystem.setChoiceDescVisible(true/false);
 * $gameMessage.setChoiceDescOverride(index, text); // index从0开始
 */

(function () {
  'use strict';

  const pluginName = 'Hakubox_Select_Desc';
  const parameters = PluginManager.parameters(pluginName);

  // 参数获取
  const pSwitchId = Number(parameters['Switch ID'] || 0);
  const pFontSize = Number(parameters['Default Font Size'] || 22);
  const pDefColor = Number(parameters['Default Text Color'] || 0);
  const pWinPadding = Number(parameters['Window Padding'] || 18);
  const pLineSpacing = Number(parameters['Line Spacing'] || 4);
  const pOpacity = Number(parameters['Window Opacity'] || 192);
  const pMinWidth = Number(parameters['Min Width'] || 400);
  const pMaxWidth = Number(parameters['Max Width'] || 800);

  const isMZ = Utils.RPGMAKER_NAME === "MZ";

  // ==============================================================================
  // 核心数据处理
  // ==============================================================================

  // 分离名称和描述
  function extractChoiceData(text, index) {
    let name = text;
    let desc = "";

    // 1. 优先检查是否有动态覆盖 (Override)
    if ($gameMessage._choiceDescOverrides && $gameMessage._choiceDescOverrides[index]) {
      desc = $gameMessage._choiceDescOverrides[index];
      // 如果原来的文本里也有<>, 需要把名字提取出来
      const match = text.match(/(.*)<(.*)>/);
      if (match) name = match[1];
    } else {
      // 2. 正常解析
      const match = text.match(/(.*)<(.*)>/);
      if (match) {
        name = match[1];
        desc = match[2];
      }
    }
    return { name: name, desc: desc };
  }

  // 扩展 Game_Message 以支持动态覆盖
  const _Game_Message_clear = Game_Message.prototype.clear;
  Game_Message.prototype.clear = function () {
    _Game_Message_clear.call(this);
    this._choiceDescOverrides = {};
  };

  Game_Message.prototype.setChoiceDescOverride = function (index, text) {
    if (!this._choiceDescOverrides) this._choiceDescOverrides = {};
    this._choiceDescOverrides[index] = text;
  };

  // 扩展 Game_System 以支持快速开关
  Game_System.prototype.setChoiceDescVisible = function (visible) {
    if (pSwitchId > 0) {
      $gameSwitches.setValue(pSwitchId, visible);
    }
    this._choiceDescForceVisible = visible;
  };

  Game_System.prototype.isChoiceDescVisible = function () {
    if (this._choiceDescForceVisible !== undefined) {
      return this._choiceDescForceVisible;
    }
    if (pSwitchId > 0) {
      return $gameSwitches.value(pSwitchId);
    }
    return true;
  };

  // ==============================================================================
  // 插件指令处理
  // ==============================================================================

  if (isMZ) {
    PluginManager.registerCommand(pluginName, "GetChoiceDescState", args => {
      const visible = args.visible === 'true';
      $gameSystem.setChoiceDescVisible(visible);
    });

    PluginManager.registerCommand(pluginName, "SetDynamicDesc", args => {
      const index = Number(args.index) - 1; // 转换为0-base
      const text = String(args.text);
      $gameMessage.setChoiceDescOverride(index, text);
    });
  } else {
    // MV Plugin Command
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
      _Game_Interpreter_pluginCommand.call(this, command, args);
      if (command === 'ChoiceDesc') {
        const action = args[0].toLowerCase();
        if (action === 'setvisible') {
          const visible = (args[1] === 'true');
          $gameSystem.setChoiceDescVisible(visible);
        } else if (action === 'setdesc') {
          const index = Number(args[1]) - 1;
          // MV会将空格断开，需要重新拼接后续参数
          const text = args.slice(2).join(' ');
          $gameMessage.setChoiceDescOverride(index, text);
        }
      }
    };
  }

  // ==============================================================================
  // Window_ChoiceDesc
  // 说明窗口类 (MV/MZ 混合写法)
  // ==============================================================================

  function Window_ChoiceDesc() {
    this.initialize(...arguments);
  }

  // 继承 Window_Base (根据引擎不同)
  Window_ChoiceDesc.prototype = Object.create(Window_Base.prototype);
  Window_ChoiceDesc.prototype.constructor = Window_ChoiceDesc;

  Window_ChoiceDesc.prototype.initialize = function (rectOrX, y, w, h) {
    if (isMZ) {
      // MZ: 传入的是 Rect
      Window_Base.prototype.initialize.call(this, rectOrX);
    } else {
      // MV: 传入的是 x, y, width, height
      Window_Base.prototype.initialize.call(this, rectOrX, y, w, h);
    }
    this.openness = 0;
    this._text = "";
    this.x = -1000;

    // 兼容透明度属性
    if (this.backOpacity !== undefined) {
      this.backOpacity = pOpacity;
    } else {
      this._backSprite.opacity = pOpacity; // MV fallback
    }
  };

  // 统一样式 API
  if (isMZ) {
    Window_ChoiceDesc.prototype.updatePadding = function () {
      this.padding = pWinPadding;
    };
  } else {
    Window_ChoiceDesc.prototype.standardPadding = function () {
      return pWinPadding;
    };
    Window_ChoiceDesc.prototype.standardFontSize = function () {
      return pFontSize;
    };
  }

  Window_ChoiceDesc.prototype.resetFontSettings = function () {
    Window_Base.prototype.resetFontSettings.call(this);
    if (isMZ) {
      this.contents.fontSize = pFontSize;
    }
    // 设置默认颜色
    if (isMZ) {
      this.changeTextColor(ColorManager.textColor(pDefColor));
    } else {
      this.changeTextColor(this.textColor(pDefColor));
    }
  };

  // --- 自动换行算法 (核心功能) ---
  Window_ChoiceDesc.prototype.processAutoWordWrap = function (text) {
    if (!text) return "";

    // 这里只是为了测量，创建一个足够大的容器，避免 measureTextWidth 报错
    // 直接引用 this.contents 也可以

    const maxWidth = this.innerWidth ? this.innerWidth : (this.width - this.padding * 2);
    let resultText = "";
    let currentLineWidth = 0;
    // 这里不再需要繁琐的 chunk split，因为 \n 已经是真实换行符
    // 但为了支持 \C[x] 等不占宽度的字符，还是需要正则切分
    const chunks = text.match(/\\x1b\[.*?\]|\\x1b.|\\.|[^\x1b\\]/g);

    if (!chunks) return text;
    for (let i = 0; i < chunks.length; i++) {
      const char = chunks[i];
      // 已经是换行符，重置当前行宽
      if (char === '\n') {
        resultText += '\n';
        currentLineWidth = 0;
        continue;
      }
      let charWidth = 0;
      const isControl = /^[\x1b\\]/.test(char);

      if (isControl) {
        if (char.toUpperCase().indexOf('I[') >= 0) {
          charWidth = Window_Base._iconWidth + 4;
        }
      } else {
        // 优化：使用 contents 进行测量更准
        charWidth = this.textWidth(char);
      }
      if (currentLineWidth + charWidth > maxWidth) {
        resultText += '\n';
        currentLineWidth = 0;
      }
      resultText += char;
      currentLineWidth += charWidth;
    }

    return resultText;
  };

  // --- 核心显示逻辑 ---
  Window_ChoiceDesc.prototype.setText = function (rawText) {
    // 0. 检查开关
    if (!$gameSystem.isChoiceDescVisible()) {
      this.close();
      return;
    }

    // 核心修正：处理 \n 和 \\n 为真实换行符
    let text = rawText ? rawText.replace(/\\n/g, '\n') : "";
    if (this._text === text && this.isOpen()) return;
    this._text = text;
    if (!text) {
      this.close();
      return;
    }
    // --- 1. 计算宽度逻辑 (自适应) ---

    // 获取锚点窗口信息
    const choiceWin = this._anchorWindow;
    let finalWidth = 100; // 默认最小宽度

    if (choiceWin) {
      // 计算屏幕最大限制 (Max Width 参数建议设为 600 或 800)
      // 如果选项在左侧，说明在右侧，可用空间 = 屏幕宽 - 选项右边界
      // 如果选项在右侧，说明在左侧，可用空间 = 选项x
      const isLeft = choiceWin.x < Graphics.boxWidth / 2;
      const screenSpace = isLeft
        ? Graphics.boxWidth - (choiceWin.x + choiceWin.width) - 20
        : choiceWin.x - 20;
      // 限制：不能超过参数设定的最大值，也不能超过屏幕剩余空间
      const limitWidth = Math.min(Math.max(pMinWidth, screenSpace), pMaxWidth);
      // 测量文本自然宽度 (不换行的情况下)
      // 先重置字体以确保测量准确
      if (this.contents) this.contents.clear();
      this.resetFontSettings();

      // 计算自然宽度：取所有行中最宽的一行
      const lines = text.split('\n');
      let maxLineWidth = 0;
      for (const line of lines) {
        // measureTextWidth不计算控制字符宽度，这可能导致略微误差，但在自适应场景可接受
        // 如果需要极其精确，可以使用 drawTextEx 的逻辑测算，但性能开销大
        // 这里我们给一个 buffer (+40 padding)
        const w = this.textWidth(line) + (this.padding * 2) + 20;
        if (w > maxLineWidth) maxLineWidth = w;
      }
      // 最终宽度 = 自然宽度 与 限制宽度 取小
      finalWidth = Math.min(maxLineWidth, limitWidth);
      // 保证一个最小值
      finalWidth = Math.max(finalWidth, 120);
    }
    // 应用宽度
    if (this.width !== finalWidth) {
      this.width = finalWidth;
    }

    // 必须重建 Contents，否则宽度变大后文字会被裁剪
    this.createContents();
    // --- 2. 处理自动换行 ---
    // 此时 width 已经定好，可以基于这个 width 进行换行计算
    const wrappedText = this.processAutoWordWrap(text);
    // --- 3. 计算高度 ---
    // const _text = wrappedText.text ? wrappedText.text : wrappedText;
    let textHeight = 0;

    if (isMZ) {
      textHeight = this.textSizeEx(wrappedText).height;
      console.log('高度', textHeight);
    } else {
      // MV 只能模拟
      // drawTextEx 返回的是最后一行的 y + lineheight
      // 为了不画出来，我们只做数学计算，或者画在一个无用的位置
      // 这里为了准确性，最简单的方法是利用 standard method 但不显示
      // 但 MV 的 drawTextEx 很难只测不画。
      // 简单的行数计算法：
      const lines = text.split('\n');
      console.log('高度', lines.length * (this.lineHeight() + pLineSpacing));
    }

    const newHeight = textHeight + (this.padding * 2) + pLineSpacing * 2;
    if (this.height !== newHeight) {
      this.height = newHeight;
      this.createContents(); // 高度变了也要重建
    }
    // --- 4. 最终定位 (防止错位) ---
    if (choiceWin) {
      // Y 对齐
      this.y = choiceWin.y;

      let bottomLimit = Graphics.boxHeight;
      const msgWin = SceneManager._scene._messageWindow;

      // 如果对话框存在，且不是完全关闭状态，且在屏幕下方 (y > 0)
      if (msgWin && msgWin.visible && msgWin.openness > 0) {
        // 如果对话框在屏幕下半部分，我们把它当作底部界限
        if (msgWin.y > Graphics.boxHeight / 3) {
          bottomLimit = msgWin.y;
        }
      }

      // [新增] 避让计算
      // 如果 当前Y + 高度 > 底部界限，说明盖住了
      if (this.y + this.height > bottomLimit) {
        // 向上移动，让底部贴着界限
        this.y = bottomLimit - this.height;
      }

      // X 对齐
      const choiceRight = choiceWin.x + choiceWin.width;
      if (choiceWin.x < Graphics.boxWidth / 2) {
        // 选项在左，说明在右
        this.x = choiceRight + 12;
      } else {
        // 选项在右，说明在左 (基于当前的新 Width)
        this.x = choiceWin.x - this.width - 12;
      }
      // 屏幕边界修正
      if (this.x < 0) this.x = 0;
      if (this.x + this.width > Graphics.boxWidth) this.x = Graphics.boxWidth - this.width;
      if (this.y + this.height > Graphics.boxHeight) this.y = Graphics.boxHeight - this.height;
    }
    // --- 5. 绘制 ---
    this.contents.clear();
    this.resetFontSettings();
    this.drawTextEx(wrappedText, 0, 0);
    this.open();
  };

  // 兼容 MV MZ 的高度计算
  // Window_ChoiceDesc.prototype.calcTextHeight = function(text) {
  //   const _text = text.text ? text.text : text;
  //   if (isMZ) {
  //     return this.textSizeEx(_text).height;
  //   } else {
  //     // MV 只能模拟
  //     // drawTextEx 返回的是最后一行的 y + lineheight
  //     // 为了不画出来，我们只做数学计算，或者画在一个无用的位置
  //     // 这里为了准确性，最简单的方法是利用 standard method 但不显示
  //     // 但 MV 的 drawTextEx 很难只测不画。
  //     // 简单的行数计算法：
  //     const lines = _text.split('\n');
  //     return lines.length * (this.lineHeight() + pLineSpacing); // 使用配置的行间距
  //   }
  // };

  // MV重写 drawTextEx 增加行间距支持 (如果需要)
  // 但为了兼容性，我们通过 lineHeight() 的调用来控制，或者简单接受默认
  // 这里我们保持默认，上面计算高度时手动加了 buffer

  Window_ChoiceDesc.prototype.updatePosition = function (choiceWindow) {
    this._anchorWindow = choiceWindow;
  };


  // ==============================================================================
  // 注入场景 (Scene_Map & Scene_Battle)
  // ==============================================================================

  const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
  Scene_Map.prototype.createAllWindows = function () {
    _Scene_Map_createAllWindows.call(this);
    this.createChoiceDescWindow();
  };

  Scene_Map.prototype.createChoiceDescWindow = function () {
    // 创建矩形 (MZ用)
    const rect = isMZ ? new Rectangle(0, 0, pMinWidth, 100) : null;

    if (isMZ) {
      this._choiceDescWindow = new Window_ChoiceDesc(rect);
    } else {
      this._choiceDescWindow = new Window_ChoiceDesc(0, 0, pMinWidth, 100);
    }

    this.addWindow(this._choiceDescWindow);

    // 绑定到 Choice Window
    // MZ 中 messageWindow._choiceListWindow, MV 中 messageWindow._choiceWindow
    const choiceWin = isMZ ? this._messageWindow._choiceListWindow : this._messageWindow._choiceWindow;
    if (choiceWin) {
      choiceWin.setDescWindow(this._choiceDescWindow);
    }
  };

  const _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
  Scene_Battle.prototype.createAllWindows = function () {
    _Scene_Battle_createAllWindows.call(this);
    this.createChoiceDescWindow();
  };

  Scene_Battle.prototype.createChoiceDescWindow = function () {
    const rect = isMZ ? new Rectangle(0, 0, pMinWidth, 100) : null;
    if (isMZ) {
      this._choiceDescWindow = new Window_ChoiceDesc(rect);
    } else {
      this._choiceDescWindow = new Window_ChoiceDesc(0, 0, pMinWidth, 100);
    }
    this.addWindow(this._choiceDescWindow);

    const choiceWin = isMZ ? this._messageWindow._choiceListWindow : this._messageWindow._choiceWindow;
    if (choiceWin) {
      choiceWin.setDescWindow(this._choiceDescWindow);
    }
  };

  // ==============================================================================
  // 修改 Window_ChoiceList
  // ==============================================================================

  Window_ChoiceList.prototype.setDescWindow = function (win) {
    this._descWindow = win;
  };

  const _Window_ChoiceList_start = Window_ChoiceList.prototype.start;
  Window_ChoiceList.prototype.start = function () {
    _Window_ChoiceList_start.call(this);
    if (this._descWindow) {
      this._descWindow.updatePosition(this);
      this.updateDescText();
    }
  };

  const _Window_ChoiceList_select = Window_ChoiceList.prototype.select;
  Window_ChoiceList.prototype.select = function (index) {
    _Window_ChoiceList_select.call(this, index);
    this.updateDescText();
  };

  const _Window_ChoiceList_close = Window_ChoiceList.prototype.close;
  Window_ChoiceList.prototype.close = function () {
    _Window_ChoiceList_close.call(this);
    if (this._descWindow) {
      this._descWindow.close();
      // 选项关闭时，清理掉一次性的 override 数据
      if ($gameMessage._choiceDescOverrides) {
        // $gameMessage._choiceDescOverrides = {}; // 考虑到连续对话，最好在 Game_Message.clear 中清空，或者这里清空
        // 这里不清空，依赖 clear
      }
    }
  };

  Window_ChoiceList.prototype.updateDescText = function () {
    if (!this._descWindow) return;

    const index = this.index();
    if (index < 0) {
      this._descWindow.setText("");
      return;
    }

    // 获取原始文本
    // MZ 使用 this._messageWindow 中的数据或直接 commandName(index)
    let nameText = "";

    // 兼容获取命令名称
    // Command Window 数据源
    if (this._list && this._list[index]) {
      nameText = this._list[index].name;
    }

    const data = extractChoiceData(nameText, index);

    this._descWindow.updatePosition(this);
    this._descWindow.setText(data.desc);
  };

  const _Window_ChoiceList_drawItem = Window_ChoiceList.prototype.drawItem;
  Window_ChoiceList.prototype.drawItem = function (index) {
    // 临时隐藏说明文本，只画名字
    if (this._list && this._list[index]) {
      const originalName = this._list[index].name;
      const data = extractChoiceData(originalName, index);

      this._list[index].name = data.name;
      _Window_ChoiceList_drawItem.call(this, index);
      this._list[index].name = originalName;
    } else {
      _Window_ChoiceList_drawItem.call(this, index);
    }
  };

  // 修复选项窗口宽度的计算（不包含说明文本的宽度）
  // MV 方法
  if (!isMZ) {
    const _Window_ChoiceList_textWidthEx = Window_ChoiceList.prototype.textWidthEx;
    Window_ChoiceList.prototype.textWidthEx = function (text) {
      const data = extractChoiceData(text, -1); // index -1 表示不查 override，只看 text
      return _Window_ChoiceList_textWidthEx.call(this, data.name);
    };
  } else {
    // MZ 方法
    const _Window_ChoiceList_textSizeEx = Window_ChoiceList.prototype.textSizeEx;
    Window_ChoiceList.prototype.textSizeEx = function (text) {
      const data = extractChoiceData(text, -1);
      return _Window_ChoiceList_textSizeEx.call(this, data.name);
    };
  }

})();
