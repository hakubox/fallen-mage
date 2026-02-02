/*
 * --------------------------------------------------
 * MNKR_TMLogWindowMZ.js
 *   Ver.2.0.0 (Enhanced)
 * Copyright (c) 2020 Munokura
 * Re-structure & Enhanced by Request
 * --------------------------------------------------
 */

/*:
 * @target MZ
 * @plugindesc [Ver 2.0] 在地图场景上显示高级日志窗口（支持图片、换行、动画、自定义字体）。
 * @author tomoaky (改変 munokura, 进一步增强)
 * 
 * @help
 * ============================================================================
 * 功能介绍
 * ============================================================================
 * 这是一个增强版的地图日志窗口插件。
 * 
 * 【新增核心功能】
 * 1. 自定义字体：可加载项目 fonts 文件夹下的字体文件。
 * 2. 独立背景图：除了全屏历史记录外，地图上的浮窗也可以设置背景图。
 * 3. 自动换行：文本超过窗口宽度会自动折行。
 * 4. 插入图片：在日志中使用 \IMG[文件名] 插入图片。
 * 5. 行动画：每行文字进入和消失时支持渐变动画（淡入淡出、滑动）。
 * 6. 清空显示：指令清空屏幕上的文字，但不删除历史记录。
 * 
 * ============================================================================
 * 使用方法
 * ============================================================================
 * 
 * 【关于字体】
 * 1. 将字体文件（.ttf 或 .otf）放入游戏的 fonts/ 文件夹中。
 * 2. 在插件参数“自定义字体文件名”中填入文件名（例如：mplus-1m-regular.ttf）。
 * 
 * 【关于插入图片】
 * 1. 将图片放入 img/system/ 文件夹中。
 * 2. 在文本中使用控制字符：\IMG[文件名]
 *    例如：获得了 \IMG[IconSword] 铁剑！
 *    注意：图片高度会自动适应行高，建议使用图标大小的图片。
 * 
 * 【清理窗口】
 * 使用插件指令“清空当前显示”可以擦除屏幕上的日志，
 * 但按打开全屏日志历史（openLogScene）时依然可以看到之前的记录。
 * 
 * ============================================================================
 * 插件指令
 * ============================================================================
 * 
 * showLogWindow       - 显示日志窗口
 * hideLogWindow       - 隐藏日志窗口
 * addLog              - 添加文本（支持 \IMG[xxx] 和标准控制符）
 * clearWindowLog      - 清空当前屏幕显示的日志（保留历史） [新功能]
 * deleteLog           - 删除最旧的一条历史记录
 * startMirrorLogWindow - 开启自动转记（对话框内容自动进日志）
 * stopMirrorLogWindow  - 关闭自动转记
 * openLogScene        - 打开全屏日志历史场景
 * 
 * ============================================================================
 * 参数设置
 * ============================================================================
 * 
 * @param basicSettings
 * @text === 基础设置 ===
 * 
 * @param logWindowX
 * @parent basicSettings
 * @type number
 * @min -1000
 * @text 窗口 X 坐标
 * @default 0
 *
 * @param logWindowY
 * @parent basicSettings
 * @type number
 * @min -1000
 * @text 窗口 Y 坐标
 * @default 456
 *
 * @param logWindowWidth
 * @parent basicSettings
 * @type number
 * @text 窗口宽度
 * @default 480
 *
 * @param lines
 * @parent basicSettings
 * @type number
 * @text 可视最大行数
 * @desc 这是一个软限制，用于计算窗口高度。实际显示的行数取决于内容还在不在屏幕上。
 * @default 6
 *
 * @param lineHeight
 * @parent basicSettings
 * @type number
 * @text 单行高度
 * @default 30
 * 
 * @param fontSize
 * @parent basicSettings
 * @type number
 * @text 字体大小
 * @default 22
 * 
 * @param customFontFile
 * @parent basicSettings
 * @type string
 * @text 自定义字体文件名
 * @desc 位于 fonts/ 目录下的文件名（包含后缀，如 gamefont.ttf）。留空则使用系统默认。
 * @default 
 *
 * @param visualSettings
 * @text === 外观与图片 ===
 * 
 * @param windowSkinOpacity
 * @parent visualSettings
 * @type number
 * @max 255
 * @text 窗口边框透明度
 * @desc 0为完全隐藏系统窗口边框。
 * @default 0
 * 
 * @param bgImage
 * @parent visualSettings
 * @type file
 * @dir img/system/
 * @text 窗口背景图片
 * @desc 地图浮窗的背景图。不设置则无背景。
 * @default 
 * 
 * @param padding
 * @parent visualSettings
 * @type number
 * @text 内容内边距
 * @default 10
 *
 * @param animSettings
 * @text === 动画与渐变 ===
 * 
 * @param fadeInTime
 * @parent animSettings
 * @type number
 * @text 渐显时间(帧)
 * @desc 文字出现的淡入时间。
 * @default 20
 * 
 * @param stayTime
 * @parent animSettings
 * @type number
 * @text 停留时间(帧)
 * @desc 文字完全显示后停留多久开始消失。设为 0 则不自动按时间消失（直到被挤出或手动清理）。
 * @default 300
 * 
 * @param fadeOutTime
 * @parent animSettings
 * @type number
 * @text 渐隐时间(帧)
 * @desc 文字消失的淡出时间。
 * @default 30
 * 
 * @param slideDirection
 * @parent animSettings
 * @type select
 * @option 无
 * @value 0
 * @option 向左
 * @value 1
 * @option 向右
 * @value 2
 * @option 向上
 * @value 3
 * @option 向下
 * @value 4
 * @text 进入动画方向
 * @desc 文字出现时的滑动方向。
 * @default 3
 * 
 * @param slideRange
 * @parent animSettings
 * @type number
 * @text 进入滑动距离
 * @desc 配合方向使用，滑动的像素距离。
 * @default 20
 *
 * @param behaviorSettings
 * @text === 行为设置 ===
 *
 * @param messageBusyHide
 * @parent behaviorSettings
 * @type boolean
 * @text 对话时隐藏
 * @default true
 *
 * @param eventBusyHide
 * @parent behaviorSettings
 * @type boolean
 * @text 事件运行时隐藏
 * @default true
 *
 * @param startVisible
 * @parent behaviorSettings
 * @type boolean
 * @text 初始可见
 * @default true
 * 
 * @param maxLogs
 * @parent behaviorSettings
 * @type number
 * @text 历史记录最大容量
 * @default 50
 *
 *
 * @command showLogWindow
 * @text 显示日志窗口
 * @desc 显示日志窗口。
 * 
 * @command hideLogWindow
 * @text 隐藏日志窗口
 * @desc 隐藏日志窗口。
 *
 * @command addLog
 * @text 添加文本
 * @desc 添加一条文本到日志。支持 \IMG[filename] 插入 img/system 下的图片。
 * @arg text
 * @text 文本内容
 * @type multiline_string
 * 
 * @command clearWindowLog
 * @text 清空当前显示
 * @desc 清除地图窗口上当前显示的所有内容（不会删除历史记录）。
 *
 * @command deleteLog
 * @text 删除一条历史
 * @desc 删除最旧的一条文本。
 * 
 * @command startMirrorLogWindow
 * @text 启用转记模式
 * @desc 启用自动追踪并记录『显示文章』指令内容的模式。
 * 
 * @command stopMirrorLogWindow
 * @text 禁用转记模式
 * @desc 停止转记模式。
 * 
 * @command openLogScene
 * @text 打开日志查看场景
 * @desc 跳转到日志查看场景。
 * 
 * @command startAutoLogWindow
 * @text 启用奖励自动记录
 * @desc 启用自动奖励记录。
 * 
 * @command stopAutoLogWindow
 * @text 禁用奖励自动记录
 * @desc 禁用自动奖励记录。
 */

var Imported = Imported || {};
Imported.TMLogWindow = true;

(() => {
  "use strict";

  const pluginName = document.currentScript.src.split("/").pop().replace(/\.js$/, "");
  const parameters = PluginManager.parameters(pluginName);

  // --- Params Loading ---
  const logWindowX = +(parameters['logWindowX'] || 0);
  const logWindowY = +(parameters['logWindowY'] || 456);
  const logWindowWidth = +(parameters['logWindowWidth'] || 480);
  const logWindowLines = +(parameters['lines'] || 6);
  const logWindowLineHeight = +(parameters['lineHeight'] || 30);
  const logWindowPadding = +(parameters['padding'] || 10);
  const logWindowFontSize = +(parameters['fontSize'] || 22);
  const customFontFile = parameters['customFontFile'] || "";

  // Visuals
  const windowSkinOpacity = +(parameters['windowSkinOpacity'] || 0);
  const bgImageFile = parameters['bgImage'] || "";

  // Behaviors
  const logWindowStartVisible = parameters['startVisible'] === 'true';
  const logWindowMessageBusyHide = parameters['messageBusyHide'] === 'true';
  const logWindowEventBusyHide = parameters['eventBusyHide'] === 'true';
  const logWindowMaxLogs = +(parameters['maxLogs'] || 50);

  // Animation
  const animFadeInTime = +(parameters['fadeInTime'] || 20);
  const animStayTime = +(parameters['stayTime'] || 300);
  const animFadeOutTime = +(parameters['fadeOutTime'] || 30);
  const animSlideDir = +(parameters['slideDirection'] || 3); // 0:None, 1:Left, 2:Right, 3:Up, 4:Down
  const animSlideRange = +(parameters['slideRange'] || 20);

  // --- Font Loading ---
  if (customFontFile) {
    FontManager.load('CustomLogFont', customFontFile);
  }

  //-----------------------------------------------------------------------------
  // Game_System
  //
  const _Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function () {
    _Game_System_initialize.call(this);
    this._visibleLogWindow = logWindowStartVisible;
    this._mirrorLogWindow = false;
    this._autoLogWindow = true;
    this._actionLog = [];
    this._mapLogVersion = 0; // Increment when log added
    this._mapLogClearStamp = 0; // Timestamp of last clear
  };

  Game_System.prototype.isVisibleLogWindow = function () { return this._visibleLogWindow; };
  Game_System.prototype.isMirrorLogWindow = function () { return this._mirrorLogWindow; };
  Game_System.prototype.isAutoLogWindow = function () { return this._autoLogWindow; };
  Game_System.prototype.setVisibleLogWindow = function (visible) { this._visibleLogWindow = visible; };
  Game_System.prototype.setMirrorMode = function (flag) { this._mirrorLogWindow = flag; };
  Game_System.prototype.setAutoMode = function (flag) { this._autoLogWindow = flag; };

  Game_System.prototype.addLog = function (text) {
    this._actionLog.push({
      text: text,
      id: Date.now() + Math.random(), // Unique ID
      timestamp: Date.now()
    });
    if (this._actionLog.length > logWindowMaxLogs) {
      this._actionLog.shift();
    }
    this._mapLogVersion++;
  };

  Game_System.prototype.clearMapLogDisplay = function () {
    this._mapLogClearStamp = Date.now();
  };

  Game_System.prototype.deleteLog = function () {
    if (this._actionLog.length > 0) {
      this._actionLog.shift();
    }
  };

  Game_System.prototype.actionLog = function () {
    return this._actionLog;
  };

  //-----------------------------------------------------------------------------
  // Sprite_LogLine (重构版)
  //-----------------------------------------------------------------------------
  function Sprite_LogLine() {
    this.initialize(...arguments);
  }

  Sprite_LogLine.prototype = Object.create(Sprite.prototype);
  Sprite_LogLine.prototype.constructor = Sprite_LogLine;

  Sprite_LogLine.prototype.initialize = function (bitmap) {
    Sprite.prototype.initialize.call(this, bitmap);
    this.opacity = 0;
    this._phase = 0; // 0: Enter, 1: Stable, 2: Dying
    this._timer = 0;

    // 初始位置设置（用于进入动画）
    this._enterOffsetY = 0;
    if (animSlideDir === 3) this._enterOffsetY = animSlideRange; // 向上滑入（初始偏下）
    if (animSlideDir === 4) this._enterOffsetY = -animSlideRange; // 向下滑入（初始偏上）

    // 初始应用偏移
    this.y += this._enterOffsetY;
  };

  // 外部调用此方法宣告死亡
  Sprite_LogLine.prototype.kill = function () {
    if (this._phase !== 2) {
      this._phase = 2;
      this._timer = 0;
    }
  };

  Sprite_LogLine.prototype.isDead = function () {
    // Phase 2 且完全透明才算真死，可以从内存移除了
    return this._phase === 2 && this.opacity <= 0;
  };

  Sprite_LogLine.prototype.isStable = function () {
    return this._phase === 1;
  };

  Sprite_LogLine.prototype.update = function () {
    Sprite.prototype.update.call(this);
    this._timer++;

    // Phase 0: 出现动画 (Fade In + Slide)
    if (this._phase === 0) {
      const rate = Math.min(this._timer / animFadeInTime, 1.0);
      this.opacity = rate * 255;

      // 简单的标志位切换
      if (this._timer >= animFadeInTime) {
        this._phase = 1;
        this._timer = 0;
      }
    }
    // Phase 1: 稳定期
    // (注意：现在 Sprite 不自己计时消失，全靠 Window 调用 kill() 来结束这一阶段)

    // Phase 2: 死亡动画 (Fade Out + 微微上浮)
    if (this._phase === 2) {
      const rate = Math.min(this._timer / animFadeOutTime, 1.0);
      this.opacity = 255 * (1 - rate);
      this.y -= 0.5; // 死亡时微微上飘一点点，增加灵动感
    }
  };

  //-----------------------------------------------------------------------------
  // Window_MapLog (重构版逻辑)
  //-----------------------------------------------------------------------------
  function Window_MapLog() {
    this.initialize(...arguments);
  }

  Window_MapLog.prototype = Object.create(Window_Base.prototype);
  Window_MapLog.prototype.constructor = Window_MapLog;

  Window_MapLog.prototype.initialize = function () {
    // 根据行数计算高度
    const rect = new Rectangle(logWindowX, logWindowY, logWindowWidth, this.calcWindowHeight());
    Window_Base.prototype.initialize.call(this, rect);

    this.opacity = windowSkinOpacity;

    this._lastLogVersion = 0;
    this._lineSprites = [];      // 所有的 Sprite对象
    this._processedLogIds = new Set();
    this._topStayTimer = animStayTime; // 只有最顶部的消息才消耗这个时间

    this.createBackground();
    this.createContents();
  };

  Window_MapLog.prototype.calcWindowHeight = function () {
    // 软限制：用于计算窗口背景高度。实际内容可以溢出这个高度然后被切掉。
    return logWindowLineHeight * logWindowLines + logWindowPadding * 2;
  };

  Window_MapLog.prototype.standardPadding = function () {
    return logWindowPadding;
  };

  Window_MapLog.prototype.createBackground = function () {
    if (bgImageFile) {
      this._bgSprite = new Sprite();
      this._bgSprite.bitmap = ImageManager.loadSystem(bgImageFile);
      this.addChildToBack(this._bgSprite);
    }
  };

  Window_MapLog.prototype.resetFontSettings = function () {
    Window_Base.prototype.resetFontSettings.call(this);
    if (customFontFile) {
      this.contents.fontFace = 'CustomLogFont,' + this.contents.fontFace;
    }
    this.contents.fontSize = logWindowFontSize;
  };

  Window_MapLog.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    this.updateVisibility();
    this.updateLogData();
    this.updateQueueLogic(); // 新增：队列管理逻辑
    this.updateSprites();    // 新增：视觉位置更新逻辑
  };

  Window_MapLog.prototype.updateVisibility = function () {
    let visible = $gameSystem.isVisibleLogWindow();
    if (visible) {
      if ((logWindowEventBusyHide && $gameMap.isEventRunning()) ||
        (logWindowMessageBusyHide && $gameMessage.isBusy())) {
        this.visible = false;
      } else {
        this.visible = true;
      }
    } else {
      this.visible = false;
    }
  };

  Window_MapLog.prototype.updateLogData = function () {
    const actionLog = $gameSystem.actionLog();
    const sysVersion = $gameSystem._mapLogVersion;
    const clearStamp = $gameSystem._mapLogClearStamp;

    if (sysVersion > this._lastLogVersion) {
      for (const logItem of actionLog) {
        if (!this._processedLogIds.has(logItem.id)) {
          if (logItem.timestamp > clearStamp) {
            this.addLogSprite(logItem.text);
          }
          this._processedLogIds.add(logItem.id);
        }
      }
      this._lastLogVersion = sysVersion;
    }

    // 处理清屏指令
    if (this._lastClearStamp !== clearStamp) {
      this._lineSprites.forEach(s => s.kill()); // 全部杀死
      this._lastClearStamp = clearStamp;
    }
  };

  Window_MapLog.prototype.addLogSprite = function (text) {
    const visibleWidth = this.innerWidth;
    const processedTextLines = this.processWordWrap(text, visibleWidth);

    processedTextLines.forEach((lineText) => {
      const height = logWindowLineHeight;
      const bitmap = new Bitmap(visibleWidth, height);

      bitmap.fontFace = this.contents.fontFace;
      bitmap.fontSize = logWindowFontSize;

      this.drawTextExOnBitmap(lineText, bitmap);

      const sprite = new Sprite_LogLine(bitmap);
      // 初始 Y 设置为当前队列末尾的理论位置，避免从 (0,0) 飞过来
      // 计算当前由多少个非死亡 Sprite
      const activeCount = this._lineSprites.filter(s => s._phase !== 2).length;
      sprite.y = activeCount * logWindowLineHeight;

      this.addInnerChild(sprite);
      this._lineSprites.push(sprite);
    });
  };

  //-----------------------------------------------------------------------------
  // 核心逻辑：队列管理 (解决停留时间 和 溢出顶替 问题)
  //-----------------------------------------------------------------------------
  Window_MapLog.prototype.updateQueueLogic = function () {
    // 筛选出所有“活着”的消息 (Phase 0 或 1)
    const activeSprites = this._lineSprites.filter(s => s._phase !== 2);

    if (activeSprites.length === 0) return;

    // 1. 溢出检查 (解决问题 2)
    // 如果当前存活行数超过了最大行数，强制杀死最顶端的，不等待计时器
    // 这样可以腾出位置让最底部的显示出来
    const maxLines = logWindowLines;
    if (activeSprites.length > maxLines) {
      // 计算由于溢出需要杀死的数量，通常是 1，但如果瞬间添加多条可能是 N
      const overflowCount = activeSprites.length - maxLines;
      for (let i = 0; i < overflowCount; i++) {
        activeSprites[i].kill();
      }
      // 既然因为溢出强制杀死了，重置计时器，让新的顶端保持一会儿
      this._topStayTimer = animStayTime;
      return;
    }

    // 2. 计时器检查 (解决问题 1)
    // 只有在没有溢出的情况下，才走正常的停留消失流程
    // 且仅当停留时间 > 0
    if (animStayTime > 0) {
      const topSprite = activeSprites[0]; // 获取最顶端的活消息

      // 只有当最顶端消息已经完全显示（进入稳定期）才开始倒计时
      if (topSprite.isStable()) {
        this._topStayTimer--;
        if (this._topStayTimer <= 0) {
          topSprite.kill(); // 时间到，杀死它
          this._topStayTimer = animStayTime; // 计时器重置，准备给下一条
        }
      }
    }
  };

  //-----------------------------------------------------------------------------
  // 这个函数负责：把“活着”的消息整齐排列，平滑移动填补空缺
  //-----------------------------------------------------------------------------
  Window_MapLog.prototype.updateSprites = function () {
    // 1. 清理死透的 Sprite
    for (let i = this._lineSprites.length - 1; i >= 0; i--) {
      const sprite = this._lineSprites[i];
      sprite.update();
      if (sprite.isDead()) {
        this.removeChild(sprite);
        this._lineSprites.splice(i, 1);
      }
    }

    // 2. 视觉排列
    const lineHeight = logWindowLineHeight;
    let currentY = 0;

    for (let i = 0; i < this._lineSprites.length; i++) {
      const sprite = this._lineSprites[i];

      // 如果这个 Sprite 已经进入濒死阶段(Phase 2)，它就不再参与“排队”
      // 它的目标 Y 不再重要，或者让它淡出在原地，不做处理。
      // 我们只计算“活着”的 Sprite 的目标位置。
      if (sprite._phase === 2) {
        // let dying sprites float or check logic above
        continue;
      }

      // 计算该 Sprite 的目标 Y 轴位置
      const targetY = currentY;

      // === 动态移动逻辑 ===
      if (sprite._phase === 0) {
        // 正在进入中：
        // 基础位置是 targetY，加上它的进入偏移
        let slideOffset = 0;
        if (animSlideDir === 3) slideOffset = sprite._enterOffsetY * (1 - sprite.opacity / 255);
        if (animSlideDir === 4) slideOffset = sprite._enterOffsetY * (1 - sprite.opacity / 255);

        sprite.y = targetY + slideOffset;
      } else {
        // 稳定期（Phase 1）：
        // 如果上方有空缺（因为 kill() 把上方的人变为 Phase 2 了，上方的人不占位了），
        // currentY 变小了，该 Sprite 平滑移动去 targetY
        const speed = 0.2; // 移动速度
        if (Math.abs(sprite.y - targetY) > 0.5) {
          sprite.y += (targetY - sprite.y) * speed;
        } else {
          sprite.y = targetY;
        }
      }

      // 只有活着的消息才占据高度
      currentY += lineHeight;
    }
  };

  // --- 后续保持 ProcessWordWrap 等辅助函数不变 ---
  Window_MapLog.prototype.processWordWrap = function (text, maxWidth) {
    // 简易换行逻辑
    const words = text.split("");
    let lines = [];
    let currentLine = "";

    for (let i = 0; i < words.length; i++) {
      let char = words[i];
      let testLine = currentLine + char;
      if (char === '\n') {
        lines.push(currentLine);
        currentLine = "";
        continue;
      }
      if (this.textWidth(testLine) > maxWidth) {
        lines.push(currentLine);
        currentLine = char;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  // 兼容绘制函数
  Window_MapLog.prototype.drawTextExOnBitmap = function (text, bitmap) {
    const originalContents = this.contents;
    this.contents = bitmap;
    this.drawTextEx(text, 0, 0);
    this.contents = originalContents;
  };

  const _Window_Base_processEscapeCharacter = Window_Base.prototype.processEscapeCharacter;
  Window_MapLog.prototype.processEscapeCharacter = function (code, textState) {
    if (code === 'IMG') { return; }
    _Window_Base_processEscapeCharacter.call(this, code, textState);
  };

  Window_MapLog.prototype.processAllText = function (textState) {
    while (textState.index < textState.text.length) {
      if (this.isCustomImageEscape(textState)) {
        this.processCustomImage(textState);
      } else {
        this.processCharacter(textState);
      }
    }
    this.flushTextState(textState);
  };

  Window_MapLog.prototype.isCustomImageEscape = function (textState) {
    const text = textState.text;
    const index = textState.index;
    if (text.substring(index, index + 5) === "\x1bIMG[") return true;
    return false;
  };

  Window_MapLog.prototype.processCustomImage = function (textState) {
    textState.index += 5;
    let endIndex = textState.text.indexOf(']', textState.index);
    if (endIndex === -1) return;

    const filename = textState.text.substring(textState.index, endIndex);
    textState.index = endIndex + 1;

    const bitmap = ImageManager.loadSystem(filename);
    if (bitmap.isReady()) {
      const h = textState.height || logWindowLineHeight;
      const w = (bitmap.width * h) / bitmap.height;
      this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, textState.x, textState.y + (textState.height - h) / 2, w, h);
      textState.x += w;
    } else {
      bitmap.addLoadListener(() => {
        const h = textState.height || logWindowLineHeight;
        const w = (bitmap.width * h) / bitmap.height;
        this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, textState.x - w, textState.y + (textState.height - h) / 2, w, h);
      });
      textState.x += logWindowLineHeight;
    }
  };




  //-----------------------------------------------------------------------------
  // Plugin Commands & Helpers
  //-----------------------------------------------------------------------------

  PluginManager.registerCommand(pluginName, "showLogWindow", () => $gameSystem.setVisibleLogWindow(true));
  PluginManager.registerCommand(pluginName, "hideLogWindow", () => $gameSystem.setVisibleLogWindow(false));
  PluginManager.registerCommand(pluginName, "addLog", args => $gameSystem.addLog(args.text));
  PluginManager.registerCommand(pluginName, "clearWindowLog", () => $gameSystem.clearMapLogDisplay());
  PluginManager.registerCommand(pluginName, "deleteLog", () => $gameSystem.deleteLog());
  PluginManager.registerCommand(pluginName, "startMirrorLogWindow", () => $gameSystem.setMirrorMode(true));
  PluginManager.registerCommand(pluginName, "stopMirrorLogWindow", () => $gameSystem.setMirrorMode(false));
  PluginManager.registerCommand(pluginName, "startAutoLogWindow", () => $gameSystem.setAutoMode(true));
  PluginManager.registerCommand(pluginName, "stopAutoLogWindow", () => $gameSystem.setAutoMode(false));
  PluginManager.registerCommand(pluginName, "openLogScene", () => SceneManager.push(Scene_Log));

  // Game Message Mirror
  const _Game_Message_add = Game_Message.prototype.add;
  Game_Message.prototype.add = function (text) {
    _Game_Message_add.call(this, text);
    if ($gameSystem.isMirrorLogWindow()) {
      $gameSystem.addLog(text);
    }
  };

  //-----------------------------------------------------------------------------
  // Hook Scene_Map
  //-----------------------------------------------------------------------------
  const _Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
  Scene_Map.prototype.createDisplayObjects = function () {
    _Scene_Map_createDisplayObjects.call(this);
    this.createMapLogWindow();
  };

  Scene_Map.prototype.createMapLogWindow = function () {
    this._mapLogWindow = new Window_MapLog();
    this.addChild(this._mapLogWindow);
  };

  //-----------------------------------------------------------------------------
  // Scene_Log (Simple History Viewer) - Reused mostly, but improved Font/Wrap
  //-----------------------------------------------------------------------------
  function Scene_Log() { this.initialize(...arguments); }
  Scene_Log.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_Log.prototype.constructor = Scene_Log;

  Scene_Log.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this._logWindow = new Window_MenuLog(new Rectangle(0, 0, Graphics.boxWidth, Graphics.boxHeight));
    this._logWindow.setHandler('ok', this.popScene.bind(this));
    this._logWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._logWindow);
  };

  function Window_MenuLog() { this.initialize(...arguments); }
  Window_MenuLog.prototype = Object.create(Window_Selectable.prototype);
  Window_MenuLog.prototype.constructor = Window_MenuLog;

  Window_MenuLog.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._data = $gameSystem.actionLog();
    this.refresh();
    this.select(this._data.length - 1);
    this.activate();
  };

  Window_MenuLog.prototype.resetFontSettings = function () {
    Window_Base.prototype.resetFontSettings.call(this);
    if (customFontFile) this.contents.fontFace = 'CustomLogFont,' + this.contents.fontFace;
  };

  Window_MenuLog.prototype.maxItems = function () { return this._data ? this._data.length : 1; };
  Window_MenuLog.prototype.drawItem = function (index) {
    const item = this._data[index];
    if (item) {
      const rect = this.itemRectWithPadding(index);
      // Re-use the map window's text parser logic if we want standard consistency, 
      // but standard drawTextEx is enough here if we don't need fancy animations in history.
      // Note: Scene_Log doesn't support the custom \IMG tag unless we patch Window_Base generally
      // or duplicate the logic. For simplicity, plain text is drawn here.
      this.drawTextEx(item.text, rect.x, rect.y);
    }
  };
  // Patch history window to allow \IMG
  Window_MenuLog.prototype.processEscapeCharacter = Window_MapLog.prototype.processEscapeCharacter;
  Window_MenuLog.prototype.processAllText = Window_MapLog.prototype.processAllText;
  Window_MenuLog.prototype.isCustomImageEscape = Window_MapLog.prototype.isCustomImageEscape;
  Window_MenuLog.prototype.processCustomImage = Window_MapLog.prototype.processCustomImage;

})();
