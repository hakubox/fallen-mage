//=============================================================================
// ** RPG Maker MZ/MV - Hakubox_RegionPlugin.js
//=============================================================================

// #region 脚本注释
/*:
 * @plugindesc R地图块插件 (v1.0.0)
 * @version 1.0.0
 * @author hakubox
 * @email hakubox@outlook.com
 * @target MV
 * 
 *
 * @help
 * 
 * 本插件可以使用Region图层阻挡事件或者玩家进入某些区域
 * 注意：插件配置中定义的Region为全局生效，即在插件本身定义的region功能会
 * 适用于所有地图图层，如果你想在不同的地图定义不同的region阻挡功能，请参照
 * 下文的注释命令于各地图配置页面单独设置。
 *
 * 不是所有人都想让NPC能够随便溜达的！本插件可以让你你的NPC无法穿越某Region图层
 * 覆盖的区域。同样的，你也可以使用region图层设置总是允许玩家、NPC穿越的区域，
 * 从而忽略地形限制，如此就不必担心过多的具有跟随功能的NPC把你逼近死胡同、堵在大
 * 门口，而且能够使一些隐蔽通道、隐藏地区的设计更简单。
 * 
 * 新增功能：
 * 
 * 添加装备特殊效果，如果装备中有以下标签时可以免疫伤害、减速或视野蒙蔽效果。
 * 
 * <haku-region-damage-immunity>  ← 免疫伤害
 * <haku-region-mask-immunity>    ← 免疫视野蒙蔽
 * <haku-region-speed-immunity>   ← 减速蒙蔽蒙蔽（加速同样不受影响）
 * <haku-region-state-immunity>    ← 免疫状态
 * <haku-region-all-immunity>     ← 免疫所有效果
 * 
 * 
 * ■ [ 联系方式 ] ........................................................
 * 
 * 
 * 邮箱：hakubox＠outlook.com  （需要手动将＠替换为半角字符）
 * 
 * 
 * ■ [ License ] ........................................................
 * 
 * MIT license
 * 
 * 授予任何人使用、复制、修改和分发本插件的权利。
 * 软件是按“现状”提供的，不提供任何明示或暗示的担保，包括但不限于适销性、特定
 * 用途适用性和非侵权的担保。
 * 在任何情况下，版权所有者或许可方均不对因使用本软件或其他交易而引起或与之
 * 相关的任何索赔、损害或其他责任承担责任，无论是因合同、侵权或其他原因引起。
 * 
 * 
 * ■ [ 修订历史 ] ........................................................
 *  v1.0.0  2024/12/07  初版。
 * 
 * 
 * @param through
 * @text ————— 通行图块配置 —————
 * @default ————————————————————————
 *
 * @param playerRestrict
 * @parent through
 * @text 阻挡玩家的ID
 * @desc 定义哪个Region ID可以阻挡玩家,默认0,即所有RegionID均不阻挡,以下同理。
 * @type number[]
 * @min 0
 * @max 255
 * @default []
 *
 * @param eventRestrict
 * @parent through
 * @text 阻挡事件的ID
 * @desc 定义可以阻挡事件穿越或发生的Region ID,比如阻挡正在跟随玩家的NPC移动事件。
 * @type number[]
 * @min 0
 * @max 255
 * @default []
 *
 * @param allRestrict
 * @parent through
 * @text 阻挡一切的ID
 * @desc 定义可以同时阻挡玩家和事件的regionID
 * @type number[]
 * @min 0
 * @max 255
 * @default []
 *
 * @param playerAllow
 * @parent through
 * @text 放行玩家的ID
 * @desc 定义一个总是可以让玩家穿越的regionID,这个通常被用来做机关暗道使用。
 * @type number[]
 * @min 0
 * @max 255
 * @default []
 *
 * @param eventAllow
 * @parent through
 * @text 放行事件的ID
 * @desc 定义总是允许事件发生和穿过的regionID
 * @type number[]
 * @min 0
 * @max 255
 * @default []
 *
 * @param allAllow
 * @parent through
 * @text 放行一切的ID
 * @desc 定义总是允许玩家和事件穿过的regionID
 * @type number[]
 * @min 0
 * @max 255
 * @default []
 * 
 * @param allowThroughEvent
 * @parent through
 * @text Region放行时穿透事件
 * @desc 开启后，在“放行玩家的ID”或“放行一切的ID”区域内，玩家可以穿过原本阻挡的事件（NPC），默认为关闭。
 * @type switch
 * @default 0
 * 
 * @param strictExitCheck
 * @parent through
 * @text 严格离开检测
 * @desc 开启后，从“强制放行区域”走向“普通不通行区域”（如墙壁）时会被阻挡。关闭则可能因为当前格子可通行而走进墙里，默认为开启。
 * @type switch
 * @default 0
 *
 * @param alwaysAbove
 * @parent through
 * @text 上层显示区域ID (星号效果)
 * @desc 标记为该区域ID的图块将始终覆盖在行走图上方。设为 0 禁用。
 * @type number[]
 * @min 0
 * @max 255
 * @default []
 *
 * @param alwaysBelow
 * @parent through
 * @text 下层显示区域ID (普通地面)
 * @desc 标记为该区域ID的图块将始终显示在行走图下方。设为 0 禁用。
 * @type number[]
 * @min 0
 * @max 255
 * @default []
 * 
 * @param special
 * @text ————— 特殊图块配置 —————
 * @default ————————————————————————
 * 
 * @param specialList
 * @parent special
 * @text 特殊图块配置
 * @desc 定义特殊图块的配置
 * @type struct<SpecialRegion>[]
 * @default []
 * 
 *
 */
/*~struct~SpecialRegion:
 *
 * @param regionId
 * @text 地图块ID
 * @desc 定义特殊图块的ID
 * @type number
 * @min 0
 * @max 255
 * @default 0
 * 
 * @param desc
 * @text 说明
 * @desc 说明
 * @type note
 * 
 * 
 * @param move
 * @text ————— 移速配置 —————
 * @default ————————————————————————
 *
 * @param moveSpeed
 * @parent move
 * @text 移动速度
 * @desc 移动速度，标准移动速度为4.0
 * @type text
 * 
 * 
 * @param hurt
 * @text ————— 扣血配置 —————
 * @default ————————————————————————
 *
 * @param hurtHP
 * @parent hurt
 * @text 自定义扣血量
 * @desc 自定义扣血量，指每到新的一格上的扣血血量，可以为数值或最大血量百分比，例如写5%
 * @type text
 *
 * @param canDie
 * @parent hurt
 * @text 是否死亡
 * @desc 自定义扣血后是否会死亡
 * @type boolean
 * @on 死亡
 * @off 避免死亡
 * @default true
 * 
 * 
 * @param blink
 * @text ————— 闪烁配置 —————
 * @default ————————————————————————
 * 
 * @param isBlink
 * @parent blink
 * @text 是否闪烁
 * @desc 界面是否闪烁
 * @type boolean
 * @on 闪烁
 * @off 不闪烁
 * @default false
 * 
 * @param blinkColor
 * @parent blink
 * @text 闪烁颜色
 * @desc 闪烁颜色，默认为"255,255,255,170"，分别代表"红、绿、蓝、强度"，每个值最大都为255
 * @type text
 * @default 255,255,255,170
 * 
 * @param blinkDuration
 * @parent blink
 * @text 闪烁时长
 * @desc 闪烁时长（帧数）
 * @type number
 * @default 10
 * 
 * 
 * @param shake
 * @text ————— 震动配置 —————
 * @default ————————————————————————
 * 
 * @param isShake
 * @parent shake
 * @text 是否震动
 * @desc 界面是否震动
 * @type boolean
 * @on 震动
 * @off 不震动
 * @default false
 * 
 * @param shakePower
 * @parent shake
 * @text 震动强度
 * @desc 震动强度
 * @type number
 * @default 5
 * 
 * @param shakeSpeed
 * @parent shake
 * @text 震动速度
 * @desc 震动速度，默认为5
 * @type number
 * @default 5
 * 
 * @param shakeDuration
 * @parent shake
 * @text 震动时长
 * @desc 震动时长（帧数）
 * @type number
 * @default 10
 * 
 * 
 * @param mask
 * @text ————— 蒙层配置 —————
 * @default ————————————————————————
 *
 * @param maskImg
 * @parent mask
 * @text 地图蒙层图片
 * @desc 地图蒙层图片
 * @type file
 * @dir img/pictures/
 *
 * @param maskOpacity
 * @parent mask
 * @text 蒙层基础透明度
 * @desc 蒙层基础透明度（80~255）
 * @type number
 * @default 255
 * @min 80
 *
 * @param maskEffect
 * @parent mask
 * @text 蒙层效果
 * @desc 蒙层效果
 * @type select
 * @option 无效果
 * @value no
 * @option 呼吸效果
 * @value breath
 * @default no
 * 
 * @param fadeFrameCount
 * @parent mask
 * @text 淡入淡出帧数
 * @desc 蒙层淡入淡出帧数
 * @type number
 * @default 15
 * 
 * 
 * @param state
 * @text ————— 状态配置 —————
 * @default ————————————————————————
 *
 * @param addState
 * @parent state
 * @text 附加状态
 * @desc 附加状态
 * @type state
 * 
 * 
 * @param sound
 * @text ————— 音效配置 —————
 * @default ————————————————————————
 *
 * @param triggerSound
 * @parent sound
 * @text 触发音效
 * @desc 触发音效
 * @type file
 * @dir audio/se/
 *
 */
(() => {

  /** 插件名称 */
  const Hakubox_PluginName = document.currentScript ? decodeURIComponent(document.currentScript.src.match(/^.*\/(.+)\.js$/)[1]) : "Hakubox_RegionPlugin";

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
          else return aryParam.map((strParam) => this.parse(JSON.parse(strParam), type[0]), loopCount);
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
  // #endregion

  const typeDefine = {
    playerRestrict: ["number"],
    eventRestrict: ["number"],
    allRestrict: ["number"],
    playerAllow: ["number"],
    eventAllow: ["number"],
    allAllow: ["number"],
    alwaysAbove: ["number"],
    alwaysBelow: ["number"],
    specialList: []
  };

  const params = PluginParamsParser.parse(PluginManager.parameters(Hakubox_PluginName), typeDefine);

  /** 阻挡玩家的地图块 */
  const RRPlayerRestrict = params.playerRestrict;
  /** 阻挡事件的地图块 */
  const RREventRestrict = params.eventRestrict;
  /** 同时阻挡玩家和事件的地图块 */
  const RRAllRestrict = params.allRestrict;
  /** 总是可以让玩家穿越的地图块 */
  const RRPlayerAllow = params.playerAllow;
  /** 总是可以让事件穿越的地图块 */
  const RREventAllow = params.eventAllow;
  /** 总是可以让玩家和事件穿越的地图块 */
  const RRAllAllow = params.allAllow;
  /** 放在行走图上方的地图块 */
  const RRAlwaysAbove = params.alwaysAbove;
  /** 放在行走图下方的地图块 */
  const RRAlwaysBelow = params.alwaysBelow;
  
  /** Region放行时是否允许穿透事件 */
  const RRAllowThroughEvent = params.allowThroughEvent;
  const getRRAllowThroughEvent = () => {
    if (!$gameSwitches) return false;
    if (!RRAllowThroughEvent) return false;
    return $gameSwitches.value(RRAllowThroughEvent);
  }
  /** 是否开启严格离开检测 */
  const RRStrictExitCheck = params.strictExitCheck;
  const getRRStrictExitCheck = () => {
    if (!$gameSwitches) return true;
    if (!RRStrictExitCheck) return true;
    return $gameSwitches.value(RRStrictExitCheck);
  }

  /** 特殊地块列表 */
  const specialRegionList = params.specialList;



  const _Tilemap_addSpot = Tilemap.prototype._addSpot;
  Tilemap.prototype._addSpot = function (startX, startY, x, y) {
    // 计算当前格子在地图上的真实坐标
    // startX/Y 是视口起始点，x/y 是相对于视口的偏移
    this._hack_currentMapX = startX + x;
    this._hack_currentMapY = startY + y;

    // 调用原函数，原函数内部会调用 _isHigherTile
    _Tilemap_addSpot.call(this, startX, startY, x, y);

    // 清理变量（可选，为了整洁）
    this._hack_currentMapX = undefined;
    this._hack_currentMapY = undefined;
  };

  // -------------------------------------------------------------------------
  // 2. Hook _isHigherTile
  // 这是 MZ 判断图块应该放在“上层图层”还是“下层图层”的逻辑
  // -------------------------------------------------------------------------
  const _Tilemap_isHigherTile = Tilemap.prototype._isHigherTile;
  Tilemap.prototype._isHigherTile = function (tileId) {
    // 1. 获取图块原本的层级属性 (根据数据库里的星号设置)
    const isHigh = _Tilemap_isHigherTile.call(this, tileId);
    // 2. 检查是否有 Region ID 覆盖
    // 确保我们拿到了坐标，并且 _readMapData 函数存在
    if (this._hack_currentMapX !== undefined && this._readMapData) {

      // _readMapData(x, y, z) 中：z=5 对应 Region ID 层
      const rId = this._readMapData(this._hack_currentMapX, this._hack_currentMapY, 5);

      if (rId > 0) {
        // 强制设为上层 (星号效果)
        if (RRAlwaysAbove.includes(rId)) {
          return true;
        }
        // 强制设为下层 (取消星号效果)
        if (RRAlwaysBelow.includes(rId)) {
          return false;
        }
      }
    }

    // 3. 如果没有命中区域规则，返回原始设定
    return isHigh;
  };


  // #region CharacterBase

  // #region CharacterBase

  /* 
   * 修复核心逻辑：
   * 1. 优先检查 Region 强制阻挡。
   * 2. 检查 Region 强制放行（增加穿透事件开关判断）。
   * 3. 严格离开检测：从 R图块 走出时，检查目标图块是否可行。
   */
  const _Game_CharacterBase_canPass = Game_CharacterBase.prototype.canPass;
  Game_CharacterBase.prototype.canPass = function (x, y, d) {
    const x2 = $gameMap.roundXWithDirection(x, d);
    const y2 = $gameMap.roundYWithDirection(y, d);
    // 1. 【最高优先级】强制阻挡
    // 检查目标点 (x2, y2) 是否被 Region 禁止
    if (this.isRegionForbid(x2, y2) || this.isRegionForbid(x, y)) {
      // 注意：通常我们只关心目标点是否被禁，但如果当前点被禁(比如被事件强制传送进去)，也应该很难移动（也就是所谓的不让出）
      // 这里主要维持原逻辑，重点检查 x2, y2
       if (this.isRegionForbid(x2, y2)) return false;
    }

    // 2. 【次高优先级】强制放行 Region 判断
    // 检查目标点 (x2, y2) 是否被 Region 允许
    const isTargetRegionAllow = this.isRegionAllow(x2, y2);
    
    if (isTargetRegionAllow) {
      // 需求1：穿透事件开关 (allowThroughEvent)
      // 如果不允许穿透事件，且不是穿透模式，且目标点有碰撞，则禁止通行
      if (!getRRAllowThroughEvent() && !this.isThrough() && this.isCollidedWithCharacters(x2, y2)) {
        return false;
      }
      return true;
    }
    
    // 3. 【需求2：严格离开检测】
    // 只有当“开启了严格开关”且“目标不是强制放行区”时执行
    if (getRRStrictExitCheck()) {
      if (!this.isNativelyEnterable(x2, y2, d)) {
        return false;
      }
    }

    // 4. 【原生逻辑】
    // 调用原版逻辑处理普通地形、载具等
    // 原版逻辑：return this.isMapPassable(x, y, d) && !this.isCollidedWithCharacters(x2, y2);
    return _Game_CharacterBase_canPass.call(this, x, y, d);
  };

  /**
   * 判断目标格子是否“原生”允许进入（忽略本插件的 Region 影响）
   * @param {number} x - 目标 X
   * @param {number} y - 目标 Y
   * @param {number} d - 移动方向 (2,4,6,8)
   */
  Game_CharacterBase.prototype.isNativelyEnterable = function(x, y, d) {
    if (!$gameMap.isValid(x, y)) return false;
    
    // 所谓“进入(Enter)”，在 RPG Maker 底层等同于“该格子允许从反方向(leaving)通行”。
    // 例如：我想向下(2)走进墙里，就要问墙：你允许上方(8)通行吗？
    // this.reverseDir(d) 是引擎自带方法，比写 10-d 更直观。
    // $gameMap.isPassable 读取的是最原始的图块数据(O/X/方向控制)。
    return $gameMap.isPassable(x, y, this.reverseDir(d));
  };

  /*
   * 必须保留 isMapPassable 的修改，
   * 确保通行度检查受到 Region 的影响。
   */
  const _Game_CharacterBase_isMapPassable = Game_CharacterBase.prototype.isMapPassable;
  Game_CharacterBase.prototype.isMapPassable = function (x, y, d) {
    // 这里的 x, y 是检测的目标坐标（在 canPass 内部调用时通常传 x,y 是当前坐标，但 isMapPassable 定义上是检测某坐标的可行性）
    
    // 1. 如果目标被 Region 禁止，视为墙壁
    if (this.isRegionForbid(x, y)) return false;
    
    // 2. 如果目标被 Region 允许，视为通路
    if (this.isRegionAllow(x, y)) return true;
    
    // 3. 否则读取原生图块设置 (O/X)
    return _Game_CharacterBase_isMapPassable.call(this, x, y, d);
  };
  // --- 辅助判断函数 ---
  
  // 新增：检查原始地图数据的通行度（忽略 Region 插件的影响）
  // 用于“严格离开检测”功能，防止从 R 图块随意走到墙里
  Game_CharacterBase.prototype.isOriginalMapPassable = function(x, y, d) {
      // 这里调用 core 脚本中 Game_Map.prototype.isPassable 的类似逻辑
      // 也就是直接查图块 flag，不经过 this.isRegionAllow 的干扰
      return $gameMap.isPassable(x, y, d);
  };
  Game_CharacterBase.prototype.isRegionForbid = function (x, y) {
    if (this.isThrough()) return false; // 穿透模式无视阻挡
    const regionId = $gameMap.regionId(x, y);
    if (regionId === 0) return false;
    if (RRAllRestrict.includes(regionId)) return true;
    if (this.isPlayer) {
      return RRPlayerRestrict.includes(regionId);
    } else { 
      return RREventRestrict.includes(regionId);
    }
  };
  Game_CharacterBase.prototype.isRegionAllow = function (x, y) {
    const regionId = $gameMap.regionId(x, y);
    if (regionId === 0) return false;
    if (RRAllAllow.includes(regionId)) return true;
    if (this.isPlayer) {
      return RRPlayerAllow.includes(regionId);
    } else { 
      // 对于事件，暂时保持原样，如果有特殊需求可以扩展
      return RREventAllow.includes(regionId);
    }
  };
  // 标志位
  Game_CharacterBase.prototype.isPlayer = false;
  Game_Event.prototype.isEvent = true;
  Game_Player.prototype.isPlayer = true;

  // #endregion

  Game_CharacterBase.prototype.isEventRegionForbid = function (x, y, d) {
    if (this.isPlayer) return false;
    if (this.isThrough()) return false;
    let regionId = this.getRegionId(x, y, d);
    if (regionId === 0) return false;
    // if ($gameMap.restrictEventRegions().contains(regionId)) return true;
    if (RRAllRestrict.includes(regionId)) return true;
    return RREventRestrict.includes(regionId);
  };

  Game_CharacterBase.prototype.isPlayerRegionForbid = function (x, y, d) {
    if (this.isEvent) return false;
    if (this.isThrough()) return false;
    let regionId = this.getRegionId(x, y, d);
    if (regionId === 0) return false;
    // if ($gameMap.restrictPlayerRegions().contains(regionId)) return true;
    if (RRAllRestrict.includes(regionId)) return true;
    return RRPlayerRestrict.includes(regionId);
  };

  Game_CharacterBase.prototype.isEventRegionAllow = function (x, y, d) {
    if (this.isPlayer) return false;
    let regionId = this.getRegionId(x, y, d);
    if (regionId === 0) return false;
    // if ($gameMap.allowEventRegions().contains(regionId)) return true;
    if (RRAllAllow.includes(regionId)) return true;
    return RREventAllow.includes(regionId);
  };

  Game_CharacterBase.prototype.isPlayerRegionAllow = function (x, y, d) {
    if (this.isEvent) return false;
    let regionId = this.getRegionId(x, y, d);
    if (regionId === 0) return false;
    // if ($gameMap.allowPlayerRegions().contains(regionId)) return true;
    if (RRAllAllow.includes(regionId)) return true;
    return RRPlayerAllow.includes(regionId);
  };

  Game_CharacterBase.prototype.getRegionId = function (x, y, d) {
    switch (d) {
      case 1:
        return $gameMap.regionId(x - 1, y + 1);
      case 2:
        return $gameMap.regionId(x + 0, y + 1);
      case 3:
        return $gameMap.regionId(x + 1, y + 1);
      case 4:
        return $gameMap.regionId(x - 1, y + 0);
      case 5:
        return $gameMap.regionId(x + 0, y + 0);
      case 6:
        return $gameMap.regionId(x + 1, y + 0);
      case 7:
        return $gameMap.regionId(x - 1, y - 1);
      case 8:
        return $gameMap.regionId(x + 0, y - 1);
      case 9:
        return $gameMap.regionId(x + 1, y - 1);
    }
    return 0;
  };

  Game_CharacterBase.prototype.isEvent = false;

  Game_CharacterBase.prototype.isPlayer = false;

  Game_Event.prototype.isEvent = true;

  Game_Player.prototype.isPlayer = true;

  /** 特殊信息 */
  const specialInfo = {
    /** 当前的R图块ID */
    currentRegionId: 0,
    /** 之前的R图块ID */
    prevRegionId: 0,
    /** 之前的移动速度 */
    prevMoveSpeed: 4.0,

    /** 蒙层精灵 */
    maskSprite: undefined,
    /** 蒙层基础透明度 */
    maskOpacity: 255,
    /** 蒙层效果 */
    maskEffect: 'no',
    /** 开始蒙层动画 */
    isStartMask: false,
    /** 蒙层动画当前帧 */
    maskFrameIndex: 0,
    /** 是否显示完成 */
    isShowComplete: false,
    /** 是否可以开始隐藏 */
    isCanHide: false,
  };

  /** 蒙层效果 */
  const maskEffects = {
    /** 淡入/显示效果 */
    show: {
      frameCount: params.fadeFrameCount || 15,
      update(progress) {
        specialInfo.maskSprite.opacity = progress * specialInfo.maskOpacity;
      }
    },
    /** 淡出/隐藏效果 */
    hide: {
      frameCount: params.fadeFrameCount || 15,
      update(progress) {
        specialInfo.maskSprite.opacity = (1 - progress) * specialInfo.maskOpacity;
      }
    },
    no: {
      frameCount: 1,
      update() { }
    },
    /** 呼吸效果 */
    breath: {
      frameCount: 120,
      update(progress) {
        if (progress >= 0.5) {
          specialInfo.maskSprite.opacity = specialInfo.maskOpacity - 80 * (1 - progress);
        } else {
          specialInfo.maskSprite.opacity = specialInfo.maskOpacity - 80 * (progress);
        }
      }
    }
  };

  const Scene_Map_start = Scene_Map.prototype.start;
  Scene_Map.prototype.start = function () {
    Scene_Map_start.call(this);

    if (specialInfo.isStartMask && specialInfo.maskSprite) {
      SceneManager._scene.addChild(specialInfo.maskSprite);
    }
  }

  const Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function () {
    Scene_Map_update.call(this);

    if (specialInfo.isStartMask && !specialInfo.isShowComplete && !specialInfo.isCanHide) {
      const _effect = maskEffects['show'];

      _effect.update(specialInfo.maskFrameIndex / _effect.frameCount);
      specialInfo.maskFrameIndex++;

      if (specialInfo.maskFrameIndex >= _effect.frameCount) {
        specialInfo.isShowComplete = true;
        specialInfo.maskFrameIndex = 0;
      }

    } else if (specialInfo.isStartMask && specialInfo.isShowComplete && specialInfo.isCanHide) {
      const _effect = maskEffects['hide'];

      _effect.update(specialInfo.maskFrameIndex / _effect.frameCount);
      specialInfo.maskFrameIndex++;

      if (specialInfo.maskFrameIndex >= _effect.frameCount) {
        specialInfo.maskFrameIndex = 0;
        specialInfo.isShowComplete = false;
        specialInfo.isStartMask = false;
        specialInfo.isCanHide = false;
        SceneManager._scene.removeChild(specialInfo.maskSprite);
      }

    } else if (specialInfo.isStartMask && specialInfo.isShowComplete) {
      const _effect = maskEffects[specialInfo.maskEffect];

      _effect.update(specialInfo.maskFrameIndex / _effect.frameCount);
      specialInfo.maskFrameIndex++;

      if (specialInfo.maskFrameIndex >= _effect.frameCount) {
        specialInfo.maskFrameIndex = 0;
      }

    }
  }

  const Game_Player_moveStraight = Game_Player.prototype.moveStraight;
  Game_Player.prototype.moveStraight = function (d) {
    let _canMove = true;
    if (!this.canPass(this.x, this.y, d)) {
      _canMove = false;
    }

    Game_Player_moveStraight.call(this, d);

    if (!_canMove) return;

    if (!specialRegionList || specialRegionList.length === 0) return;

    // 获取身上所有装备的相关效果
    const _equipments = $gameActors.actor(1).equips().filter(i => i);
    const _allImmunity = {};
    for (let i = 0; i < _equipments.length; i++) {
      const _equip = _equipments[i];
      if (_equip.meta['haku-region-damage-immunity']) _allImmunity.damage = true;
      if (_equip.meta['haku-region-mask-immunity']) _allImmunity.mask = true;
      if (_equip.meta['haku-region-speed-immunity']) _allImmunity.speed = true;
      if (_equip.meta['haku-region-state-immunity']) _allImmunity.state = true;
      if (_equip.meta['haku-region-all-immunity']) _allImmunity.all = true;
    }

    if (_allImmunity.all) return;

    const _regionInfo = specialRegionList.find(i => i.regionId == $gameMap.regionId(this._x, this._y));

    if (!_regionInfo && specialInfo.prevRegionId) {
      // 离开图块
      specialInfo.currentRegionId = 0;
      specialInfo.prevRegionId = 0;

      if (!_allImmunity.speed) {
        $gamePlayer.setMoveSpeed(specialInfo.prevMoveSpeed);
        specialInfo.prevMoveSpeed = $gamePlayer.moveSpeed();
      }

      if (specialInfo.isStartMask && SceneManager._scene instanceof Scene_Map) {
        if (specialInfo.isStartMask) {
          specialInfo.maskFrameIndex = 0;
          specialInfo.isShowComplete = true;
          specialInfo.isCanHide = true;
        }
      }
    } else if (_regionInfo) {
      specialInfo.prevRegionId = _regionInfo.regionId;
      // 如果之前没有任何图块
      if (specialInfo.currentRegionId === 0) {
        specialInfo.prevMoveSpeed = $gamePlayer.moveSpeed();
      }

      specialInfo.currentRegionId = _regionInfo.regionId;

      // 移速影响
      if (_regionInfo.moveSpeed && !_allImmunity.speed) {
        $gamePlayer.setMoveSpeed(_regionInfo.moveSpeed);
      }

      // 血量影响
      if (_regionInfo.hurtHP && !_allImmunity.damage) {
        $gamePlayer.setMoveFrequency(_regionInfo.hurtHP);

        $gameParty._actors.forEach(i => {
          const _actor = $gameActors.actor(i)
          if (typeof _regionInfo.hurtHP === 'string' && _regionInfo.hurtHP.endsWith('%')) {
            _actor.gainHp(Math.floor(-_actor.mhp * parseInt(_regionInfo.hurtHP.replace('%', '')) / 100));
          } else {
            _actor.gainHp(Math.floor(-_regionInfo.hurtHP));
          }

          if (_actor.hp <= 0) {
            if (!_regionInfo.canDie) {
              if (_actor._hp === 0) {
                _actor.gainHp(1);
              }
            } else {
              _actor.addState(1);
            }
          } else {

          }
        });
      }

      // 画面闪烁
      if (_regionInfo.isBlink && _regionInfo.blinkColor) {
        $gameScreen.startFlash(_regionInfo.blinkColor.split(','), _regionInfo.blinkDuration || 10);
      }

      // 画面震动
      if (_regionInfo.isShake) {
        $gameScreen.startShake(_regionInfo.shakePower || 5, _regionInfo.shakeSpeed || 5, _regionInfo.shakeDuration || 10);
      }

      // 添加蒙层
      if (_regionInfo.maskImg && SceneManager._scene instanceof Scene_Map && !_allImmunity.mask) {
        if (!specialInfo.isStartMask) {
          const _maskImg = ImageManager.loadPicture(_regionInfo.maskImg);
          _maskImg.addLoadListener(() => {
            const _bgImg = new Bitmap(Graphics.width, Graphics.height);
            _bgImg.blt(_maskImg, 0, 0, _maskImg.width, _maskImg.height, 0, 0, _bgImg.width, _bgImg.height);
            specialInfo.maskSprite = new Sprite(_bgImg);
            specialInfo.maskSprite.opacity = 0;
            SceneManager._scene.addChild(specialInfo.maskSprite);
            specialInfo.maskOpacity = _regionInfo.maskOpacity || 255;
            specialInfo.maskEffect = _regionInfo.maskEffect || 'no';
            specialInfo.isCanHide = false;
            specialInfo.isShowComplete = false;
            specialInfo.maskFrameIndex = 0;
            specialInfo.isStartMask = true;
          });
        }
      }

      // 添加状态
      if (_regionInfo.addState && !_allImmunity.state) {
        $gameParty._actors.forEach(i => {
          const _actor = $gameActors.actor(i);
          _actor.addState(_regionInfo.addState);
        });
      }

      // 播放音效
      if (_regionInfo.triggerSound) {
        AudioManager.playSe({
          name: _regionInfo.triggerSound,
          volume: ConfigManager.seVolume,
          pitch: 100,
          pan: 0
        });
      }
    }
  }

  // #endregion

})();