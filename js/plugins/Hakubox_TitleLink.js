//=============================================================================
// ** RPG Maker MZ - Hakubox_TitleLink.js
//=============================================================================

// #region 脚本注释
/*:
 * @plugindesc 标题链接插件 (v1.0.0)
 * @version 1.0.0
 * @author hakubox
 * @email hakubox@outlook.com
 * @target MV MZ
 * 
 * @help
 * 标题链接相关插件。
 *
 * 
 * @param links
 * @text 标题链接
 * @type struct<Link>[]
 * 
 */
/*~struct~Link:
 *
 * @param name
 * @text 名称
 * @type string
 * @desc 链接的名称。
 * @default 
 *
 * @param x
 * @text X坐标
 * @type number
 * @min -1000
 * 
 * @param y
 * @text Y坐标
 * @type number
 * @min -1000
 *
 * @param url
 * @text 链接
 * @type text
 * @desc 链接的地址。
 *
 * @param image
 * @text 图片
 * @desc 链接的图片。
 * @type file
 * @dir img/system/
 *
 * @param hoverImage
 * @text 高亮图片
 * @desc 高亮链接的图片。
 * @type file
 * @dir img/system/
 * 
 */
(() => {

  /** 插件名称 */
  const PluginName = document.currentScript ? decodeURIComponent(document.currentScript.src.match(/^.*\/(.+)\.js$/)[1]) : "Hakubox_TitleLink";

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
    links: [],
  };
  // #endregion

  // #region 插件参数

  const params = PluginParamsParser.parse(PluginManager.parameters(PluginName), typeDefine);

  const Scene_Title_create = Scene_Title.prototype.create;
  Scene_Title.prototype.create = function () {
    Scene_Title_create.call(this);
    this.drawTitleLinks();
  };

  let _isMouseOver = false;
  let _item = undefined;

  // --- 新的 helper 函数 ---
  function openUrl(url) {
    if (!url) return;

    // 1. 针对 RPG Maker MZ 的 PC 测试 / NW.js 环境
    if (Utils.isNwjs()) {
      require('nw.gui').Shell.openExternal(url);
    }
    // 2. 针对打包后的 Android/iOS APP (Cordova/PhoneGap 环境)
    else if (typeof cordova !== 'undefined' && cordova.InAppBrowser) {
      // 核心修改：使用 '_system' 参数强制调用系统默认浏览器
      cordova.InAppBrowser.open(url, '_system');
    }
    // 3. 针对某些没有 InAppBrowser 插件但有 cordova 的环境 (通用备选)
    else if (typeof cordova !== 'undefined' && navigator.app) {
      navigator.app.loadUrl(url, { openExternal: true });
    }
    // 4. 针对普通 Web 浏览器 / 手机浏览器玩网页版
    else {
      // 尝试使用 window.open
      const win = window.open(url, '_blank');
      // 如果被拦截，尝试修改 location (不推荐，会覆盖游戏，但在某些手机浏览器是唯一办法)
      if (!win) {
        window.location.href = url;
      }
    }
  }

  // --- 核心修复：挂载到 Scene_Title 的 update 循环中 ---
  const Scene_Title_update = Scene_Title.prototype.update;
  Scene_Title.prototype.update = function () {
    Scene_Title_update.call(this);

    // 每一帧都检测是否有点触发生
    this.updateLinkTouch();
  };

  Scene_Title.prototype.updateLinkTouch = function () {
    // 如果没有链接数据，直接跳过
    if (!this.links || this.links.length === 0) return;

    // 获取当前触摸/鼠标坐标 (TouchInput 自动统一了 PC 和 移动端)
    const x = TouchInput.x;
    const y = TouchInput.y;

    // 检查是否刚刚被点击/触摸 (Triggered = 按下并释放的那一刻)
    const isTriggered = TouchInput.isTriggered();

    // 遍历所有链接
    let isHoveringAny = false;

    for (let i = 0; i < this.links.length; i++) {
      const item = this.links[i];
      if (!item.sprite) continue;

      // 简单的矩形碰撞检测
      // 注意：这里使用 sprite 的实际显示范围
      const minX = item.sprite.x;
      const maxX = item.sprite.x + item.sprite.width;
      const minY = item.sprite.y;
      const maxY = item.sprite.y + item.sprite.height;

      if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
        isHoveringAny = true;

        // 1. 处理高亮 (Hover) - 仅限非移动端或持续按压
        if (!item.isHover) {
          if (!Utils.isMobileDevice()) SoundManager.playCursor(); // 移动端通常不需要悬停音效
          item.isHover = true;
          if (item.hoverImageStr && item.sprite.bitmap) {
            // 简单切换图片的方法
            const newBitmap = ImageManager.loadSystem(item.hoverImageStr);
            // 确保图片加载后再切换，避免闪烁
            newBitmap.addLoadListener(() => {
              item.sprite.bitmap = newBitmap;
            });
          }
        }

        // 2. 处理点击 (Click/Touch)
        if (isTriggered) {
          SoundManager.playOk(); // 播放确认音效
          openUrl(item.url);
        }

      } else {
        // 没有悬停/触摸该链接，恢复原样
        if (item.isHover) {
          item.isHover = false;
          if (item.imageStr && item.sprite.bitmap) {
            item.sprite.bitmap = ImageManager.loadSystem(item.imageStr);
          }
        }
      }
    }
  };

  // const Scene_Title_update = Scene_Title.prototype.update;
  // Scene_Title.prototype.update = function () {
  //   Scene_Title_update.call(this);

  //   for (let i = 0; i < this.links.length; i++) {
  //     const item = this.links[i];
  //     if (!item.sprite) continue;

  //     if (
  //       TouchInput.x >= item.x && TouchInput.x <= item.x + item.sprite.width &&
  //       TouchInput.y >= item.y && TouchInput.y <= item.y + item.sprite.height
  //     ) {
  //       console.log('成功');
  //       if (TouchInput.isTriggered()) {
  //         window.open(item.url, '_blank');
  //       } else {
  //         // if (item.sprite.bitmap.src !== item.hoverImageStr) {
  //           item.sprite.bitmap = ImageManager.loadSystem(item.hoverImageStr);
  //         // }
  //       }
  //     } else {
  //       // if (item.sprite.bitmap.src !== item.imageStr) {
  //         item.sprite.bitmap = ImageManager.loadSystem(item.imageStr);
  //       // }
  //     }
  //   }
  // };

  Scene_Title.prototype.drawTitleLinks = function () {
    this.links = params.links.map(i => ({
      name: i.name,
      url: i.url,
      imageStr: i.image,
      hoverImageStr: i.hoverImage,
      x: i.x,
      y: i.y,
    }));

    this.links.forEach(item => {
      const _bitmap = ImageManager.loadSystem(item.imageStr);
      const _sprite = new Sprite(_bitmap);
      _sprite.x = item.x;
      _sprite.y = item.y;
      item.sprite = _sprite;
      this.addChild(_sprite);
    });
  }

})();