//=============================================================================
// ** RPG Maker MZ - Hakubox_Scene_Game.js
//=============================================================================

// #region 脚本注释
/*:
 * @plugindesc 定制场景 - Game场景 (v1.0.0)
 * @version 1.0.0
 * @author hakubox
 * @email hakubox@outlook.com
 * @target MZ
 * 
 * @help
 * 【与傲娇妹妹的治愈日常】定制插件。
 * 
 * 
 * @param moveCenter
 * @text —— 移动画面中心 ——
 * @default ——————————————
 * 
 * @param centerSwitch
 * @parent moveCenter
 * @text 移动中心的开关
 * @desc 移动中心的开关
 * @type switch
 * 
 * @param centerX
 * @parent moveCenter
 * @text X坐标
 * @desc 将画面中心点向X方向偏移指定的图块数。默认：0
 * @default 0
 * @type number
 * @min -50
 * @max 50
 * 
 * @param centerY
 * @parent moveCenter
 * @text Y坐标
 * @desc 将画面中心点向Y方向偏移指定的图块数。默认：0
 * @default 0
 * @type number
 * @min -50
 * @max 50
 * 
 * 
 * @command clearScene
 * @text 解锁事件
 * @desc 解锁事件
 * @arg sceneId
 * @desc 解锁事件ID
 * @desc 解锁事件ID
 * @type text
 * 
 * 
 * @command clearAllScene
 * @text 解锁所有事件
 * @desc 解锁所有事件
 * 
 */
// #endregion
(() => {
  /** 插件名称 */
  const PluginName = document.currentScript ? decodeURIComponent(document.currentScript.src.match(/^.*\/(.+)\.js$/)[1]) : "Hakubox_SysCore";

  const typeDefine = {};

  // #region 插件参数

  const params = PluginParamsParser.parse(PluginManager.parameters(PluginName), typeDefine);

  // #endregion


  // #region 移动中心点

  Game_Player.prototype.centerX = function () {
    const x = +params.centerX;
    if ($gameSwitches.value(params.centerSwitch)) {
      return ($gameMap.screenTileX() - 1) / 2 + x;
    } else {
      return ($gameMap.screenTileX() - 1) / 2;
    }
  };

  Game_Player.prototype.centerY = function () {
    const y = +params.centerY;
    if ($gameSwitches.value(params.centerSwitch)) {
      return ($gameMap.screenTileY() - 1) / 2 + y;
    } else {
      return ($gameMap.screenTileY() - 1) / 2;
    }
  };

  // #endregion



  // #region 调整对话框换行策略

  Window_Message.prototype.flushTextState = function(textState, char) {
    const text = textState.buffer;
    const rtl = textState.rtl;
    const height = textState.height;
    const x = rtl ? textState.x - width : textState.x;
    const y = textState.y;

    if (char) {
      const width = this.textWidth(char);
      if (textState.drawing) {
        this.contents.drawText(char, x, y, width, height);
      }
      textState.x += rtl ? -width : width;
      if ((textState.x + width + this.padding * 2 >= textState.startX + textState.width) && textState.width && !(this instanceof Window_NameBox)) {
        textState.x = textState.startX;
        textState.y += this.calcTextHeight(textState);
      }
      textState.buffer = this.createTextBuffer(rtl);
      
      if (this instanceof Window_NameBox) {
        const _width = this.textWidth(textState.text);
        if (textState.width < _width) {
          textState.outputWidth = _width;
        }
      }
    } else {
      const width = this.textWidth(text);
      if (textState.drawing) {
        this.contents.drawText(text, x, y, width, height);
      }
      textState.x += rtl ? -width : width;
      textState.buffer = this.createTextBuffer(rtl);
      const outputWidth = Math.abs(textState.x - textState.startX);
      if (textState.outputWidth < outputWidth) {
        textState.outputWidth = outputWidth;
      }
      textState.outputHeight = y - textState.startY + height;
    }
  };
  Window_Message.prototype.processCharacter = function(textState) {
    const c = textState.text[textState.index++];
    if (c.charCodeAt(0) < 0x20) {
      this.flushTextState(textState);
      this.processControlCharacter(textState, c);
    } else {
      this.flushTextState(textState, c);
    }
  };
  Window_Message.prototype.createTextState = function(text, x, y, width) {
    if (!width) width = this.width;
    const rtl = Utils.containsArabic(text);
    const textState = {};
    textState.text = this.convertEscapeCharacters(text);
    textState.index = 0;
    textState.x = rtl ? x + width : x;
    textState.y = y;
    textState.width = width;
    textState.height = this.calcTextHeight(textState);
    textState.startX = textState.x;
    textState.startY = textState.y;
    textState.rtl = rtl;
    textState.buffer = this.createTextBuffer(rtl);
    textState.drawing = true;
    textState.outputWidth = 0;
    textState.outputHeight = 0;
    return textState;
  };
  Window_Message.prototype.drawTextEx = function(text, x, y, width, config) {
    this.resetFontSettings(config);
    const textState = this.createTextState(text, x, y, width);
    this.processAllText(textState);
    return textState.outputWidth;
  };

  // #region Sprite增加文本输出
  Sprite.prototype.lineHeight = function() {
    return 36;
  };
  Sprite.prototype.resetTextColor = function() {
    this.bitmap.textColor = ColorManager.normalColor();
    this.bitmap.outlineColor = ColorManager.outlineColor();
  };
  Sprite.prototype.maxFontSizeInLine = function(line) {
    let maxFontSize = this.bitmap.fontSize;
    const regExp = /\x1b({|}|FS)(\[(\d+)])?/gi;
    for (;;) {
        const array = regExp.exec(line);
        if (!array) {
            break;
        }
        const code = String(array[1]).toUpperCase();
        if (code === "{") {
            this.makeFontBigger();
        } else if (code === "}") {
            this.makeFontSmaller();
        } else if (code === "FS") {
            this.bitmap.fontSize = parseInt(array[3]);
        }
        if (this.bitmap.fontSize > maxFontSize) {
            maxFontSize = this.bitmap.fontSize;
        }
    }
    return maxFontSize;
  };
  Sprite.prototype.createTextBuffer = function(rtl) {
    // U+202B: RIGHT-TO-LEFT EMBEDDING
    return rtl ? "\u202B" : "";
  };
  Sprite.prototype.resetFontSettings = function() {
    this.bitmap.fontFace = $gameSystem.mainFontFace();
    this.bitmap.fontSize = $gameSystem.mainFontSize();
    this.resetTextColor();
  };
  Sprite.prototype.textWidth = function(text) {
    return this.bitmap.measureTextWidth(text);
  };
  Sprite.prototype.obtainEscapeCode = function(textState) {
    const regExp = /^[$.|^!><{}\\]|^[A-Z]+/i;
    const arr = regExp.exec(textState.text.slice(textState.index));
    if (arr) {
        textState.index += arr[0].length;
        return arr[0].toUpperCase();
    } else {
        return "";
    }
  };
  Sprite.prototype.processNewLine = function(textState) {
    textState.x = textState.startX;
    textState.y += textState.height;
    textState.height = this.calcTextHeight(textState);
  };
  Sprite.prototype.calcTextHeight = function(textState) {
    const lineSpacing = this.lineHeight() - $gameSystem.mainFontSize();
    const lastFontSize = this.bitmap.fontSize;
    const lines = textState.text.slice(textState.index).split("\n");
    const textHeight = this.maxFontSizeInLine(lines[0]) + lineSpacing;
    this.bitmap.fontSize = lastFontSize;
    return textHeight;
  };
  Sprite.prototype.makeFontBigger = function() {
    if (this.bitmap.fontSize <= 96) {
      this.bitmap.fontSize += 12;
    }
  };

  Sprite.prototype.makeFontSmaller = function() {
    if (this.bitmap.fontSize >= 24) {
      this.bitmap.fontSize -= 12;
    }
  };
  Sprite.prototype.processEscapeCharacter = function(code, textState) {
    switch (code) {
      case "C":
        this.processColorChange(this.obtainEscapeParam(textState));
        break;
      case "I":
        this.processDrawIcon(this.obtainEscapeParam(textState), textState);
        break;
      case "PX":
        textState.x = this.obtainEscapeParam(textState);
        break;
      case "PY":
        textState.y = this.obtainEscapeParam(textState);
        break;
      case "FS":
        this.bitmap.fontSize = this.obtainEscapeParam(textState);
        break;
      case "{":
        this.makeFontBigger();
        break;
      case "}":
        this.makeFontSmaller();
        break;
    }
  };
  Sprite.prototype.processControlCharacter = function(textState, c) {
    if (c === "\n") {
      this.processNewLine(textState);
    }
    if (c === "\x1b") {
      const code = this.obtainEscapeCode(textState);
      this.processEscapeCharacter(code, textState);
    }
  };
  Sprite.prototype.actorName = function(n) {
    const actor = n >= 1 ? $gameActors.actor(n) : null;
    return actor ? actor.name() : "";
  };
  Sprite.prototype.convertEscapeCharacters = function(text) {
    /* eslint no-control-regex: 0 */
    text = text.replace(/\\/g, "\x1b");
    text = text.replace(/\x1b\x1b/g, "\\");
    while (text.match(/\x1bV\[(\d+)\]/gi)) {
      text = text.replace(/\x1bV\[(\d+)\]/gi, (_, p1) =>
        $gameVariables.value(parseInt(p1))
      );
    }
    text = text.replace(/\x1bN\[(\d+)\]/gi, (_, p1) =>
      this.actorName(parseInt(p1))
    );
    text = text.replace(/\x1bP\[(\d+)\]/gi, (_, p1) =>
      this.partyMemberName(parseInt(p1))
    );
    text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
    return text;
  };
  Sprite.prototype.createTextState = function(text, x, y, width) {
    const rtl = Utils.containsArabic(text);
    const textState = {};
    textState.text = this.convertEscapeCharacters(text);
    textState.index = 0;
    textState.x = rtl ? x + width : x;
    textState.y = y;
    textState.width = width;
    textState.height = this.calcTextHeight(textState);
    textState.startX = textState.x;
    textState.startY = textState.y;
    textState.rtl = rtl;
    textState.buffer = this.createTextBuffer(rtl);
    textState.drawing = true;
    textState.outputWidth = 0;
    textState.outputHeight = 0;
    return textState;
  };
  Sprite.prototype.flushTextState = function(textState, char) {
    const text = textState.buffer;
    const rtl = textState.rtl;
    const height = textState.height;
    const x = rtl ? textState.x - width : textState.x;
    const y = textState.y;

    if (char) {
      const width = this.textWidth(char);
      if (textState.drawing) {
        this.bitmap.drawText(char, x, y, width, height);
      }
      textState.x += rtl ? -width : width;
      if (textState.x >= textState.startX + textState.width) {
        textState.x = textState.startX;
        textState.y += this.calcTextHeight(textState);
      }
      textState.buffer = this.createTextBuffer(rtl);
    } else {
      const width = this.textWidth(text);
      if (textState.drawing) {
        this.bitmap.drawText(text, x, y, width, height);
      }
      textState.x += rtl ? -width : width;
      textState.buffer = this.createTextBuffer(rtl);
      const outputWidth = Math.abs(textState.x - textState.startX);
      if (textState.outputWidth < outputWidth) {
        textState.outputWidth = outputWidth;
      }
      textState.outputHeight = y - textState.startY + height;
    }
  };
  Sprite.prototype.processCharacter = function(textState) {
    const c = textState.text[textState.index++];
    if (c.charCodeAt(0) < 0x20) {
      this.flushTextState(textState);
      this.processControlCharacter(textState, c);
    } else {
      this.flushTextState(textState, c);
    }
  };
  Sprite.prototype.processAllText = function(textState) {
    while (textState.index < textState.text.length) {
      this.processCharacter(textState);
    }
    this.flushTextState(textState);
    return textState.outputWidth;
  };
  
  /**
   * 输入换行的文本
   * @param {string} text 文本内容
   * @param {number} x X坐标
   * @param {number} y Y坐标
   * @param {number} width 宽度
   */
  Sprite.prototype.drawTextEx = function(text, x, y, width) {
    // this.resetFontSettings();
    const textState = this.createTextState(text, x, y, width);
    this.processAllText(textState);
    return textState;
  };

  // #endregion


  // #region 保存额外的信息
  
  DataManager._extraInfo = undefined;

  DataManager.loadExtraInfo = function() {
    return new Promise(resolve => {
      // TranslateUtils.loadLocalTranslateFile(() => {
        resolve();
      // });
    });
  };

  DataManager.loadLanguageInfo = function() {
    StorageManager.loadObject("extra").then(extraInfo => {
      this._extraInfo = extraInfo || DataManager.makeExtraInfo();
      return 0;
    }).catch(() => {
      this._extraInfo = DataManager.makeExtraInfo();
    });
  };

  DataManager.isLanguageInfoLoaded = function() {
    return true;
    // return Object.keys(TranslateUtils.keys || {}).length > 1;
  };
  

  DataManager.saveExtraInfo = function() {
    StorageManager.saveObject("extra", this._extraInfo);
  };

  DataManager.isExtraInfoLoaded = function() {
    return !!this._extraInfo;
  };

  DataManager.makeExtraInfo = function() {
    const info = {};
    info.clearSceneList = [];
    info.clearCourseList = [];
    // 是否解锁全部关卡
    info.isClearAll = false;
    return info;
  };

  // 解锁全部场景
  DataManager.isClearAllScene = function() {
    return this._extraInfo.isClearAll === true;
  };
  DataManager.clearAllScene = function() {
    this._extraInfo.isClearAll = true;
    DataManager.saveExtraInfo();
  };
  // 解锁某个场景
  DataManager.clearScene = function(sceneId) {
    if (!this._extraInfo.clearSceneList) this._extraInfo.clearSceneList = [];
    if (!this._extraInfo.clearSceneList.includes(sceneId)) {
      this._extraInfo.clearSceneList.push(sceneId);
    }
    DataManager.saveExtraInfo();
  };
  // 判断某个场景是否解锁
  DataManager.isClearScene = function(sceneId) {
    return this._extraInfo.isClearAll || this._extraInfo.clearSceneList.includes(sceneId);
  };
  // 判断是否通过教程
  DataManager.isClearCourse = function(courseId) {
    if (!this._extraInfo.clearCourseList) this._extraInfo.clearCourseList = [];
    return this._extraInfo.clearCourseList.includes(courseId);
  };
  // 解锁某个教程
  DataManager.clearCourse = function(courseId) {
    if (!this._extraInfo.clearCourseList) this._extraInfo.clearCourseList = [];
    if (!this._extraInfo.clearCourseList.includes(courseId)) {
      this._extraInfo.clearCourseList.push(courseId);
    }
    DataManager.saveExtraInfo();
  };
  // 删除某个教程（反向解锁）
  DataManager.removeCourse = function(courseId) {
    if (!this._extraInfo.clearCourseList) this._extraInfo.clearCourseList = [];
    const _index = this._extraInfo.clearCourseList.indexOf(courseId);
    if (_index >= 0) {
      this._extraInfo.clearCourseList.splice(_index, 1);
    }
    DataManager.saveExtraInfo();
  };

  Scene_Boot.prototype.updateDocumentTitle = function() {
    // document.title = TranslateUtils.getText($dataSystem.gameTitle) + ' v' + gameVersion;
  };

  DataManager.onXhrLoad = function(xhr, name, src, url) {
    if (xhr.status < 400) {
      window[name] = JSON.parse(xhr.responseText);
      this.onLoad(window[name]);
      if (name === "$dataSystem") {
        $dataSystem.gameTitle = "";
      }
    } else {
      this.onXhrError(name, src, url);
    }
  };

  Scene_Boot.prototype.loadPlayerData = function() {
    DataManager.loadLanguageInfo();
    DataManager.loadGlobalInfo();
    DataManager.loadExtraInfo();
    ConfigManager.load();
  };

  Scene_Boot.prototype.isPlayerDataLoaded = function() {
    return DataManager.isGlobalInfoLoaded() && DataManager.isLanguageInfoLoaded() && DataManager.isExtraInfoLoaded() && ConfigManager.isLoaded();
  };

  // #endregion


  // #region 修改姓名框宽度

  Window_NameBox.prototype.updatePadding = function() {
    this.padding = 12;
  };
  Window_NameBox.prototype.lineHeight = function() {
    return 50;
  };

  Window_NameBox.prototype.windowWidth = function() {
    if (this._name) {
      const textWidth = this.textSizeEx(this._name).width;
      const padding = this.padding + this.itemPadding();
      let width = Math.ceil(textWidth) + padding * 4;
      return Math.min(width, Graphics.boxWidth);
    } else {
      return 0;
    }
  };

  Window_NameBox.prototype.baseTextRect = function() {
    const rect = new Rectangle(0, 0, this.innerWidth, this.innerHeight);
    rect.pad(-this.itemPadding() - this.padding - this.itemPadding(), 0);
    return rect;
  };

  // #endregion

  
  // #region 存储数据相关

  window.__TEMP_GAME_DATA = {

  };

  const _DataManager_createGameObjects = DataManager.createGameObjects;
  DataManager.createGameObjects = function () {
    _DataManager_createGameObjects.call(this);
    window.$gameData = cloneLoop(window.__TEMP_GAME_DATA);
  };
  const _DataManager_makeSaveContents = DataManager.makeSaveContents;
  DataManager.makeSaveContents = function () {
    const contents = _DataManager_makeSaveContents.call(this);
    contents.$gameData = window.$gameData || {};
    return contents;
  };
  const _DataManager_extractSaveContents = DataManager.extractSaveContents;
  DataManager.extractSaveContents = function (contents) {
    _DataManager_extractSaveContents.call(this, contents);
    if (!contents.$gameData) window.$gameData = {};
    else window.$gameData = contents.$gameData || {};
  };

  // #endregion


  // #region 添加延时功能

  const moduleTicker = {
    _tickers: [],
    on(callback) {
      for (let i = 0; i < this._tickers.length; i++) {
        if (this._tickers[i] === undefined) {
          this._tickers[i] = callback;
          return;
        }
      }
      this._tickers.push(callback);
    },
    off(callback) {
      const _index = this._tickers.indexOf(callback);
      if (_index >= 0) {
        this._tickers.splice(_index, 1);
      }
    },
    update() {
      for (let i = 0; i < this._tickers.length; i++) {
        if (this._tickers[i]) this._tickers[i]();
      }
    },
  };
  window.moduleTicker = moduleTicker;
  
  Scene_Base.prototype.isFastForward = function() {
    return (
      $gameMap.isEventRunning() &&
      !SceneManager.isSceneChanging() &&
      (Input.isLongPressed("ok") || TouchInput.isLongPressed() || $gameData.isSkip)
    );
  }
  
  const Scene_Base_update = Scene_Base.prototype.update;
  Scene_Base.prototype.update = function() {
    Scene_Base_update.call(this);
    // 调用模块更新
    window.moduleTicker.update();
    if (this.isFastForward()) {
      window.moduleTicker.update();
    }
  };

  /**
   * 使用延时功能
   * @param {() => void} callback 回调函数
   * @param {number} delay 等待帧数
   * @param {(progress: number) => void} update 更新函数
   * @param {{ easingType: string, inout: string }} info 动画信息
   */
  window.useTimeout = function(callback, delay, update, info = { easingType: 'Linear', inout: 'None' }) {
    const _timer = {
      frameIndex: 0,
      frameCount: delay,
      stop() {
        this.frameIndex = 0;
        moduleTicker.off(_timerUpdate);
      }
    };

    const _timerUpdate = () => {
      _timer.frameIndex++;

      if (update) {
        const progress = MotionEasing.getEasing(info.easingType, info.inout)(_timer.frameIndex / _timer.frameCount);
        update(progress, _timer.frameIndex);
      }

      if (_timer.frameIndex >= _timer.frameCount) {
        _timer.frameIndex = 0;
        moduleTicker.off(_timerUpdate);
        callback();
      }
    };

    moduleTicker.on(_timerUpdate);
    return _timer;
  };

  // #endregion


  Scene_Map.prototype.createWindowLayer = function() {
    this._windowLayer = new WindowLayer();
    this._windowLayer.x = 0;
    this._windowLayer.y = (Graphics.height - Graphics.boxHeight) / 2;
    this.addChild(this._windowLayer);
  };

  // Scene_Message.prototype.messageWindowRect = function() {
  //   const ww = Graphics.boxWidth;
  //   const wh = this.calcWindowHeight(4, false) + 8;
  //   const wx = 0; // (Graphics.boxWidth - ww) / 2;
  //   const wy = 0;
  //   return new Rectangle(wx, wy, ww, wh);
  // };

  // Window_Message.prototype.updatePlacement = function() {
  //   const goldWindow = this._goldWindow;
  //   this._positionType = $gameMessage.positionType();
  //   this.x = 0;
  //   this.y = (this._positionType * (Graphics.boxHeight - this.height)) / 2;
  //   if (goldWindow) {
  //     goldWindow.y = this.y > 0 ? 0 : Graphics.boxHeight - goldWindow.height;
  //   }
  // };
  
  if (Utils.RPGMAKER_NAME === "MZ") {
    PluginManager.registerCommand(PluginName, 'clearScene', function(args) {
      if (!DataManager.isClearScene(args.sceneId)) {
        DataManager.clearScene(args.sceneId);
      }
    });
    PluginManager.registerCommand(PluginName, 'clearAllScene', function(args) {
      DataManager.clearAllScene();
    });
  }

})();