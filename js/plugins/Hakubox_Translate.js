
//=============================================================================
// ** RPG Maker MZ - Hakubox_Translate.js
//=============================================================================
// #region 脚本注释
/*:
 * @plugindesc 白箱翻译插件（MZ版本）
 * @author Hakubox
 * 
 * @help
 * 翻译插件
 * 
 * 使用方法：
 * 1. 执行代码 TranslateUtils.initTranslateFile() 后自动生成翻译文件。
 * 2. 保存后，重新打开游戏，即可看到翻译后的文本。
 * 
 * 注意：
 * 1. 需要把当前插件放在插件列表第一位。
 * 2. 如果需要图片包含文字，则将图片放置到对应语言编码的文件夹中，例如 img/picutres/zh-CN/xxx.png
 * 3. 需要将多行对话文本手动合并，多行对话间使用\n分隔。
 * 
 * 
 *
 * @param languages
 * @text 翻译语言列表
 * @desc 当前游戏的翻译语言列表。
 * @type struct<Language>[]
 * @default ["{\"code\":\"zh-CN\",\"label\":\"中文\",\"miss\":\"Miss\",\"on\":\"ON\",\"off\":\"OFF\",\"option\":\"Language\"}","{\"code\":\"en-US\",\"label\":\"English\",\"miss\":\"Miss\",\"on\":\"ON\",\"off\":\"OFF\",\"option\":\"Language\"}","{\"code\":\"ja-JP\",\"label\":\"日本語\",\"miss\":\"Miss\",\"on\":\"オン\",\"off\":\"オフ\",\"option\":\"Language\"}"]
 * 
 * @param defaultLanguageIndex
 * @text 默认语言索引
 * @desc 默认语言索引。
 * @type number
 * @default 0
 * 
 * @param defaultDevLanguage
 * @text 游戏默认开发语言
 * @desc 游戏默认开发语言，只有中文、日语、韩语三种。
 * @type select
 * @option 中文
 * @value zh-CN
 * @option 日语
 * @value ja-JP
 * @option 韩语
 * @value ko-KR
 * @default zh-CN
 * 
 */
/*~struct~Language:
 * @param code
 * @text 语言代码
 * @desc ISO格式的语言代码，例如：zh-CN、en-US、ja-JP 等等
 * @type text
 * @default zh-CN
 *
 * @param label
 * @text 语言名称
 * @desc 语言名称。
 * @type text
 * @default 中文
 *
 * @param miss
 * @text Miss翻译
 * @desc Miss的翻译
 * @type text
 * @default Miss
 *
 * @param on
 * @text ON翻译
 * @desc 开启的翻译
 * @type text
 * @default ON
 *
 * @param off
 * @text OFF翻译
 * @desc 关闭的翻译
 * @type text
 * @default OFF
 *
 * @param option
 * @text 语言选项文本
 * @desc 语言选项文本
 * @type text
 * @default 语言
 *
 */
(() => {
  /** 插件名称 */
  const PluginName = document.currentScript ? decodeURIComponent(document.currentScript.src.match(/^.*\/(.+)\.js$/)[1]) : "Hakubox_Translate";
  
  // #region 插件参数解释器
  class PluginParamsParser {
    constructor(predictEnable = true) {
      this._predictEnable = predictEnable;
    }
    static parse(params, typeData, predictEnable = true) {
      return new PluginParamsParser(predictEnable).parse(params, typeData);
    }
    parse(params, typeData, loopCount = 0) {
      if (++loopCount > 255)
        throw new Error("endless loop error");
      const result = {};
      for (const name in typeData) {
        if (params[name] === "" || params[name] === undefined) {
          result[name] = null;
        }
        else {
          result[name] = this.convertParam(params[name], typeData[name], loopCount);
        }
      }
      if (!this._predictEnable)
        return result;
      if (typeof params === "object" && !(params instanceof Array)) {
        for (const name in params) {
          if (result[name])
            continue;
          const param = params[name];
          const type = this.predict(param);
          result[name] = this.convertParam(param, type, loopCount);
        }
      }
      return result;
    }
    convertParam(param, type, loopCount) {
      if (typeof type === "string") {
        let str = param;
        if (str[0] == '"' && str[str.length - 1] == '"') {
          str = str.substring(1, str.length - 1).replace(/\\n/g, '\n').replace(/\\"/g, '"')
        }
        return this.cast(str, type);
      }
      else if (typeof type === "object" && type instanceof Array) {
        const aryParam = JSON.parse(param);
        if (type[0] === "string") {
          return aryParam.map((strParam) => this.cast(strParam, type[0]));
        } else if (type[0] === "number") {
          return aryParam.map((strParam) => this.cast(strParam, type[0]));
        } else {
          if (!aryParam.length) return [];
          else {
            if (typeof aryParam === "string") {
              return JSON.parse(aryParam);
            } else {
              return aryParam.map((strParam) => this.parse(JSON.parse(strParam), type[0]), loopCount);
            }
          }
        }
      }
      else if (typeof type === "object") {
        return this.parse(JSON.parse(param), type, loopCount);
      }
      else {
        throw new Error(`${type} is not string or object`);
      }
    }
    cast(param, type) {
      switch (type) {
        case "any":
          if (!this._predictEnable)
            throw new Error("Predict mode is disable");
          return this.cast(param, this.predict(param));
        case "string":
          return param;
        case "number":
          if (param.match(/^\-?\d+\.\d+$/))
            return parseFloat(param);
          return parseInt(param);
        case "boolean":
          return param === "true";
        default:
          throw new Error(`Unknow type: ${type}`);
      }
    }
    predict(param) {
      if (param.match(/^\-?\d+$/) || param.match(/^\-?\d+\.\d+$/)) {
        return "number";
      }
      else if (param === "true" || param === "false") {
        return "boolean";
      }
      else {
        return "string";
      }
    }
  }
  const typeDefine = {
    languages: [],
  };
  // #endregion
  
  const params = PluginParamsParser.parse(PluginManager.parameters(PluginName), typeDefine);
  
  if (!params.languages || params.languages.length < 1) {
    throw new Error("No language defined");
  }

  const Scene_Title_create = Scene_Title.prototype.create;
  Scene_Title.prototype.create = function() {
    Scene_Title_create.call(this);

    document.title = translateModule.getText($dataSystem.gameTitle) + ' v' + $dataSystem.gameVersion;
  }

  const translateModule = {
    /** 是否初始化 */
    isInit: false,
    /** 当前语言 */
    language: params.languages[0].code,
    /** 语言判断正则 */
    checkRegExp: ({
      'zh-CN': '[\u4e00-\u9fa5]',
      'ja-JP': '[\u3040-\u309f\u30a0-\u30ff\u31f0-\u31ff\u32d0-\u32fe\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]',
      'ko-KR': '[\u3130-\u318f\uac00-\ud7af\u1100-\u11ff\u3130-\u318f\uac00-\ud7a3\uac00-\ud7af]'
    })[params.defaultDevLanguage],
    /** 当前语言的索引 */
    languageIndex: params.defaultLanguageIndex,
    /** 默认语言索引 */
    defaultLanguageIndex: params.defaultLanguageIndex,
    /** 所有语言的配置 */
    allLanguageConfig: params.languages,
    /** 所有语言 */
    allLanguage: params.languages.map(item => item.code),
    /** 固定换行文本 */
    fixedNextTxt: ']},{"code":401,"indent":0,"parameters":[',
    /** 翻译文本 */
    keys: {},
    /** 修改语言 */
    setLanguage(languageIndex) {
      if (this.languageIndex == languageIndex) return;
      this.languageIndex = languageIndex;
      this.language = this.allLanguage[languageIndex];
      ConfigManager.languageCode = this.language;
      this.loadLocalTranslateFile(() => {
        document.title = translateModule.getText($dataSystem.gameTitle) + ' v' + $dataSystem.gameVersion;
      });
    },
    /** 获取所有文本 */
    getAllKeyByData(content) {
      
      // const regex = new RegExp(`"\\\\*?([^"*\\\\\\//<>]*?${this.checkRegExp}[^"*\\\\\\//<>]*?)\\\\*?"`, 'g');
      const regex = new RegExp(`"(\\\\*?n<.*?>)*?([^"*\\\\\\//<>]*?${this.checkRegExp}[^"*\\\\\\//<>]*?)\\\\*?"`, 'g');
      let _match;
      let _prevTxts = [];
      let _isComplete = false;
      while (_match = regex.exec(content)) {
        const value = _match[2];
        const _nextTxt = content.substr(_match.index + _match[0].length, this.fixedNextTxt.length + 2);
        _prevTxts.push(value);
        if (_nextTxt.indexOf(this.fixedNextTxt) >= 0) {
          _isComplete = false;
        } else {
          _isComplete = true;
        }
        
        const _value = _prevTxts.join('\\n');
        if (_isComplete && !this.keys[_value]) {
          this.keys[_value] = _value;
          _prevTxts = [];
        }
      }
    },
    /** 创建翻译文件 */
    createTranslateFile(suffix) {
      const fs = require('fs');
      const path = require('path');
      const dirPath = path.join(process.cwd(), './data');

      for (let i = 0; i < this.allLanguage.length; i++) {
        const _item = this.allLanguage[i];
        const _keys = {};
        if (i == this.defaultLanguageIndex) {
          for (const key in this.keys) {
            _keys[key] = this.keys[key];
          }
        } else {
          for (const key in this.keys) {
            _keys[key] = '[翻]' + this.keys[key];
          }
        }
        const _file = path.join(dirPath, `Hakubox-Translate${suffix}-${_item}.json`);
        if (fs.existsSync(_file)) {
          fs.unlinkSync(_file);
        }
        fs.writeFileSync(_file, JSON.stringify(_keys, null, 2));
      }
      alert('翻译文件生成完毕！');
    },
    /** 获取所有文件 */
    async getAllFiles() {
      const fs = require('fs');
      const path = require('path');

      const dirPath = path.join(process.cwd(), './data');
      try {
        this.keys = {};
        let readIndex = 0;
        // 读取目录内容
        const files = await fs.readdirSync(dirPath);
        const _files = files.filter(i => !i.startsWith('Hakubox-Translate-'));
        const fileCount = _files.length;
        
        const _pluginsText = JSON.stringify($plugins.filter(i => i.status));
        this.getAllKeyByData(_pluginsText);

        let _isCover = true;
        if (fs.existsSync(path.join(dirPath, `Hakubox-Translate-${this.language}.json`))) {
          _isCover = confirm('目前已存在翻译文件，是否直接覆盖？');
        }

        if (_isCover) {
          for (const fileName of _files) {
            const filePath = path.join(dirPath, fileName);

            fs.readFile(filePath, { encoding: 'utf-8' }, (err, content) => {
              // console.log(`File: ${filePath}`);
              this.getAllKeyByData(content);
              readIndex++;

              if (readIndex >= fileCount) {
                this.createTranslateFile('');
              }
            });
          }
        }
      } catch (err) {
        console.error(`Error reading directory ${dirPath}:`, err);
      }

    },
    /** 获取基础文件 */
    async getBasicFiles() {
      const fs = require('fs');
      const path = require('path');

      const dirPath = path.join(process.cwd(), './data');
      try {
        this.keys = {};
        let readIndex = 0;
        // 读取目录内容
        const files = await fs.readdirSync(dirPath);
        const _files = files.filter(i => [
          'Actors.json', 'Classes.json', 'Items.json', 'Weapons.json', 'Troops.json', 'Enemies.json', 
          'States.json', 'Tilesets.json', 'System.json', 'Armors.json', 'Skills.json'
        ].includes(i));
        const fileCount = _files.length;
        
        // const _pluginsText = JSON.stringify($plugins.filter(i => i.status));
        // this.getAllKeyByData(_pluginsText);

        let _isCover = true;
        if (fs.existsSync(path.join(dirPath, `Hakubox-Translate-Basic-${this.language}.json`))) {
          _isCover = confirm('目前已存在翻译文件，是否直接覆盖？');
        }

        if (_isCover) {
          for (const fileName of _files) {
            const filePath = path.join(dirPath, fileName);

            fs.readFile(filePath, { encoding: 'utf-8' }, (err, content) => {
              // console.log(`File: ${filePath}`);
              this.getAllKeyByData(content);
              readIndex++;

              if (readIndex >= fileCount) {
                this.createTranslateFile('-Basic');
              }
            });
          }
        }
      } catch (err) {
        console.error(`Error reading directory ${dirPath}:`, err);
      }

    },
    /** 加载本地翻译文件 */
    loadLocalTranslateFile(callback) {
      const url = `./data/Hakubox-Translate-${this.language}.json`; // 替换为你的远程 JSON 文件 URL

      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            if (translateModule.language) {
              try {
                const jsonData = JSON.parse(xhr.responseText);
                translateModule.keys = jsonData;
                callback && callback();
              } catch (error) {
                alert(`解析 ./data/Hakubox-Translate-${translateModule.language}.json 翻译文件时出错`);
                console.error('解析 JSON 时出错:', error);
              }
            }

            // 获取系统语言
            useWait((cb) => {
              if (ConfigManager.isLoaded()) {
                cb();
                const _language = navigator.language;
                if (_language && !ConfigManager.languageCode) {
                  const _languageIndex = translateModule.allLanguage.indexOf(_language);
                  if (_languageIndex >= 0) {
                    translateModule.setLanguage(_languageIndex);
                  } else {
                    const _codePrefix = _language.indexOf('-') < 0 ? _language : _language.substring(0, _language.indexOf('-') + 1);
                    const _index = translateModule.allLanguage.findIndex(i => i.startsWith(_codePrefix));
                    if (_index >= 0) {
                      translateModule.setLanguage(_index);
                    } else {
                      translateModule.setLanguage(1);
                    }
                  }
                } else if (!_language && !ConfigManager.languageCode) {
                  translateModule.setLanguage(1);
                }
              }
            })
          }
        }
      };
      xhr.onerror = (error) => {
        alert(`未找到 ./data/Hakubox-Translate-${this.language}.json 翻译文件`);
        console.error('解析 JSON 时出错:', error);
      }

      xhr.send();
    },
    /**
     * 获取翻译文本
     * @param {string} text 翻译内容
     * @param {string[]} args 格式化参数
     */
    getText(text, args) {
      if (!text) return text;
      if (args && typeof args === 'string') args = [args];
      // 常规
      if (translateModule.keys[text]) {
        return this.replaceParam(translateModule.keys[text], args);
      }
      // 对话框名称
      if (text) {
        let _prefix = '';
        const _text = (text + '').replace(new RegExp("\x1bc\[[0-9]+\]", "g"), (match) => {
          _prefix = match;
          return '';
        });
        if (translateModule.keys[_text]) {
          return this.replaceParam(_prefix + translateModule.keys[_text].replace(/\\n/g, '\n'), args);
        }
      }
      return this.replaceParam(text, args);
    },
    replaceParam(text, args) {
      if (!text || typeof text !== "string") return text + '';
      
      if (text.match(/\$\d+/)) {
        let _index = -1;
        return text.replace(/\$(\d+)/g, (match, p1) => {
          _index++;
          return (!args || args[_index] === undefined) ? match : args[_index];
        });
      } else {
        return text;
      }
    },
    /** 获取路径 */
    getPath(path) {
      const regex = new RegExp(this.allLanguage.join('|'), 'g');
      return path.replace(regex, this.language);
    },
    /** 获取打开的文本 */
    getOn() {
      return this.allLanguageConfig[this.languageIndex].on;
    },
    /** 获取关闭的文本 */
    getOff() {
      return this.allLanguageConfig[this.languageIndex].off;
    },
    /** 获取选项左侧标签文本 */
    getOption() {
      return this.allLanguageConfig[this.languageIndex].option;
    },
    /** 获取选项右侧内容文本 */
    getLabel() {
      return this.allLanguageConfig[this.languageIndex].label;
    },
    /** 下一个语言索引 */
    getNextIndex() {
      const languageIndex = (this.languageIndex + 1) % this.allLanguage.length;
      this.setLanguage(languageIndex);
      return this.languageIndex;
    },
    /** 上一个语言索引 */
    getPrevIndex() {
      const languageIndex = (this.languageIndex + this.allLanguage.length - 1) % this.allLanguage.length;
      this.setLanguage(languageIndex);
      return this.languageIndex;
    }
  }

  // #region 系统修改
  
  translateModule.loadLocalTranslateFile();

  // 直接输出文本翻译
  const Bitmap_drawText = Bitmap.prototype.drawText;
  Bitmap.prototype.drawText = function (text, x, y, maxWidth, lineHeight, align) {
    const _text = translateModule.getText(text);
    Bitmap_drawText.call(this, _text, x, y, maxWidth, lineHeight, align);
  }

  const Window_Base_processCharacter = Window_Base.prototype.processCharacter;
  Window_Base.prototype.processCharacter = function(textState) {
    const _text = translateModule.getText(textState.text);
    textState.text = _text;
    Window_Base_processCharacter.call(this, textState);
  }

  const Sprite_processCharacter = Sprite.prototype.processCharacter;
  Sprite.prototype.processCharacter = function(textState) {
    const _text = translateModule.getText(textState.text);
    textState.text = _text;
    Sprite_processCharacter.call(this, textState);
  }

  // 默认对话文本翻译
  Game_Message.prototype.allText = function() {
    return translateModule.getText((this._texts || []).join('\n'));
  };
  
  // 替换图片
  const ImageManager_loadNormalBitmap = ImageManager.loadNormalBitmap;
  ImageManager.loadNormalBitmap = function(path, hue) {
    const _path = translateModule.getPath(path);
    return ImageManager_loadNormalBitmap.call(this, _path, hue);
  }

  const ImageManager_loadBitmapFromUrl = ImageManager.loadBitmapFromUrl;
  ImageManager.loadBitmapFromUrl = function(path) {
    const _path = translateModule.getPath(path);
    return ImageManager_loadBitmapFromUrl.call(this, _path);
  };

  const Game_Message_setChoices = Game_Message.prototype.setChoices;
  Game_Message.prototype.setChoices = function(choices, defaultType, cancelType) {
    choices = choices.map(choice => translateModule.getText(choice));
    Game_Message_setChoices.call(this, choices, defaultType, cancelType);
  };

  // #endregion

  // #region 配置功能

  Window_Options.prototype.booleanStatusText = function(value) {
    return value ? translateModule.getOn() : translateModule.getOff();
  };

  const Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
  Window_Options.prototype.addGeneralOptions = function() {
    this.addCommand(translateModule.getText(translateModule.getOption()), "languageIndex");
    Window_Options_addGeneralOptions.call(this);
  };

  const Window_Options_statusText = Window_Options.prototype.statusText;
  Window_Options.prototype.statusText = function(index) {
    const symbol = this.commandSymbol(index);
      const value = this.getConfigValue(symbol);
    if (symbol === "languageIndex") {
      return translateModule.getLabel(value);
    } else {
      return Window_Options_statusText.apply(this, arguments);
    }
  };

  const Window_Options_processOk = Window_Options.prototype.processOk;
  Window_Options.prototype.processOk = function() {
    const index = this.index();
    const symbol = this.commandSymbol(index);
    if (symbol === "languageIndex") {
      this.changeValue(symbol, translateModule.getNextIndex());
      this.refreshLanguage();
    } else {
      Window_Options_processOk.apply(this);
    }
  };

  const Window_Options_cursorRight = Window_Options.prototype.cursorRight;
  Window_Options.prototype.cursorRight = function() {
    const index = this.index();
    const symbol = this.commandSymbol(index);
    if (symbol === "languageIndex") {
      this.changeValue(symbol, translateModule.getNextIndex());
      this.refreshLanguage();
    } else {
      Window_Options_cursorRight.apply(this);
    }
  };

  const Window_Options_cursorLeft = Window_Options.prototype.cursorLeft;
  Window_Options.prototype.cursorLeft = function() {
    const index = this.index();
    const symbol = this.commandSymbol(index);
    if (symbol === "languageIndex") {
      this.changeValue(symbol, translateModule.getPrevIndex());
      this.refreshLanguage();
    } else {
      Window_Options_cursorLeft.apply(this);
    }
  };

  // New function.
  Window_Options.prototype.refreshLanguage = function() {
    translateModule.loadLocalTranslateFile(() => {
      document.title = translateModule.getText($dataSystem.gameTitle) + ' v' + $dataSystem.gameVersion;
      const _scene = SceneManager._scene;
      if (_scene._optionsWindow) {
        _scene._optionsWindow.refresh();
      }
      if (_scene._categoryWindow) {
        _scene._categoryWindow.refresh();
      }
      if (_scene._helpWindow) {
        _scene._helpWindow.refresh();
      }
    });
  };

  Window_ChoiceList.prototype.maxChoiceWidth = function() {
    let maxWidth = 96;
    const choices = $gameMessage.choices();
    for (const choice of choices) {
      const _text = TranslateUtils.getText(choice);
      // this.contents.fontSize = 35;
      const textWidth = this.textWidth(_text);
      const choiceWidth = Math.ceil(textWidth) + this.itemPadding() * 2;
      if (maxWidth < choiceWidth) {
        maxWidth = choiceWidth;
      }
    }
    return maxWidth + 4;
  };

  String.prototype.format = function() {
    var args = arguments;
    return TranslateUtils.getText(this).replace(/%([0-9]+)/g, function(s, n) {
      return TranslateUtils.getText(args[Number(n) - 1]);
    });
  };

  Window_BattleLog.prototype.drawLineText = function(index) {
    const rect = this.lineRect(index);
    this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);

    if (typeof this._lines[index] === 'string') {
      this.drawTextEx(this._lines[index], rect.x, rect.y, rect.width);
    } else if (Array.isArray(this._lines[index])) {
      for (let i = 0; i < this._lines[index].length; i++) {
        this._lines[index][i] = TranslateUtils.getText(this._lines[index][i]);
      }

      const _re = this._lines[index];
      _re[0] = _re[0].replace(/%(\d+)/g, (a, b) => {
          return '$' + b;
      });
      this.drawTextEx(TranslateUtils.getText(_re[0], _re.slice(1)), rect.x, rect.y, rect.width);
    }
  };

  // 延时
  setTimeout(() => {
    Window_SavefileList.prototype.drawFileId = function(id, x, y) {
      this.drawText(translateModule.getText(TextManager.file) + ' ' + id, x, y, 120);
    };
  }, 100);

  // #endregion

  ConfigManager.languageIndex = 0;
  ConfigManager.languageCode = '';

  const ConfigManager_makeData = ConfigManager.makeData;
  ConfigManager.makeData = function() {
    const config = ConfigManager_makeData.call(this);
    config.languageIndex = this.languageIndex;
    translateModule.setLanguage(this.languageIndex);
    return config;
  };

  const ConfigManager_applyData = ConfigManager.applyData;
  ConfigManager.applyData = function(config) {
    ConfigManager_applyData.call(this, config);
    this.languageIndex = config.languageIndex || 0;
    this.languageCode = config.languageCode || '';
    translateModule.setLanguage(this.languageIndex);
  };

  /** 翻译工具类 */
  class TranslateUtils {
    static get currentLanguage() {
      return translateModule.language;
    }
    static getPath(path) {
      return translateModule.getPath(path);
    }
    static getText(text, args = []) {
      return translateModule.getText(text, args);
    }
    /** 初始化翻译文件 */
    static initTranslateFile() {
      translateModule.getAllFiles();
    }
    /** 初始化翻译文件 */
    static initBasicTranslateFile() {
      translateModule.getBasicFiles();
    }
    /** 设置语言 */
    static setLanguageIndex(languageIndex = 0) {
      translateModule.setLanguage(languageIndex);
    }
    /** 设置语言 */
    static setLanguage(languageCode) {
      const _index = translateModule.allLanguage.findIndex(i => i === languageCode);
      if (_index < 0) {
        throw new Error(`未找到 ${languageCode} 语言配置`);
      } else {
        ConfigManager.languageIndex = _index;
        translateModule.setLanguage(_index);
      }
    }
  }
  window.TranslateUtils = TranslateUtils;


  if (!window.useWait) {
    /**
     * 等待函数
     * @param {(cb: Function) => void} callback 回调函数
     * @param {number} [delay=100] 等待毫秒数
     */
    window.useWait = function(callback, delay = 100) {
      let _isComplete = false;
      let _currentIndex = 0;
      let _maxCount = 100;
      const _timer = () => {
        _currentIndex++;
        callback(() => {
          _isComplete = true;
        });

        if (!_isComplete && _currentIndex < _maxCount) {
          setTimeout(() => {
            _timer();
          }, delay);
        }
      };

      _timer();
    }
  }

})();