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

  document.addEventListener('mousemove', (e) => {
    if (!SceneManager._scene instanceof Scene_Title || !SceneManager._scene || !SceneManager._scene.links) return;

    const _links = SceneManager._scene.links;    
    for (let i = 0; i < _links.length; i++) {
      const item = _links[i];
      if (!item.sprite) continue;

      if (
        e.x >= item.x && e.x <= item.x + item.sprite.width &&
        e.y >= item.y && e.y <= item.y + item.sprite.height
      ) {
        if (!SceneManager._scene.links[i].isHover) {
          SoundManager.playCursor();
        }

        _isMouseOver = true;
        SceneManager._scene.links[i].isHover = true;
        _item = item;
        if (item.sprite.bitmap.src !== item.hoverImageStr) {
          item.sprite.bitmap = ImageManager.loadSystem(item.hoverImageStr);
        }
        break;
      } else {
        _isMouseOver = false;
        SceneManager._scene.links[i].isHover = false;
        _item = undefined;
        if (item.sprite.bitmap.src !== item.imageStr) {
          item.sprite.bitmap = ImageManager.loadSystem(item.imageStr);
        }
      }
    }
  });

  document.addEventListener('mousedown', (e) => {
    if (_isMouseOver && _item) {
      if (nw && nw.Shell) {
        nw.Shell.openExternal(_item.url);
      } else {
        window.open(_item.url, '_blank');
      }
    }
  });

  document.addEventListener('mouseup', (e) => {
    _isMouseOver = false;
    _item = undefined;
  });

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