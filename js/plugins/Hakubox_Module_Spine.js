//=============================================================================
// Hakubox_Module_Spine.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v2.0.0 强大的Spine基础插件，支持平滑过渡和高级配置。
 * @author Tsumio
 *
 * @help
 * Hakubox_Module_Spine.js (v2.0.0)
 *
 * 这个插件提供了在 RPG Maker MZ 中集成和控制 Spine 动画的强大功能。
 * [注：菲伦的立绘ID固定为：fern-tachie，不要修改]
 *
 * --- 功能概述 ---
 * 1. 高级配置：预设Spine的默认动画、皮肤、速度、初始可见性。
 * 2. 动态控制：通过插件指令进行显示、隐藏、移动、改变动画和皮肤。
 * 3. 平滑过渡：显示、隐藏、移动支持自定义时长的动画效果。
 * 4. 图层管理：支持在插件参数中预设背景和前景，并在指定场景自动加载。
 * 5. 场景管理：自动处理场景切换时的资源加载和卸载。
 *
 * --- 文件结构 ---
 * - Spine 文件 (.json, .atlas, .png) 放入 /spine/ 文件夹。
 * - 背景/前景图片文件可以放在 /img/ 目录下的任何位置 (如 /img/pictures/)。
 *
 * --- 使用示例 ---
 * 1. 在插件参数中配置一个Spine：
 *    - ID: my_raptor
 *    - Spine文件: raptor/raptor-pro
 *    - 默认动画: walk
 *    - 默认皮肤: (留空则为默认皮肤), 或者填 "red-skin,with-armor" (用逗号分隔多个皮肤)
 *    - 播放速度: 1.2 (1.2倍速)
 *    - 默认显示: false (初始为隐藏状态)
 *    - 场景列表: Scene_Map
 *
 * 2. 使用插件指令带动画地显示它：
 *    - 在事件中，使用插件指令 "显示Spine"。
 *    - Spine ID: my_raptor
 *    - 动画时长(帧): 60
 *    - 起始位置 X: 100
 *    - 起始位置 Y: 600
 *    - 执行后，raptor会在1秒(60帧)内，从(100, 600)移动并淡入到它配置的默认位置(比如400, 300)。
 *
 * 3. 使用插件指令带动画地隐藏它：
 *    - 使用插件指令 "隐藏Spine"。
 *    - Spine ID: my_raptor
 *    - 动画时长(帧): 60
 *    - 结束位置 X: 800
 *    - 结束位置 Y: 300
 *    - 执行后，raptor会在1秒内，移动到(800, 300)并同时淡出。
 *
 * @param spineList
 * @text Spine动画列表
 * @desc 配置在特定场景自动加载的Spine动画。
 * @type struct<SpineConfig>[]
 * @default []
 *
 * @param backgroundList
 * @text 背景列表
 * @desc 配置在特定场景自动加载的背景图片。
 * @type struct<LayerConfig>[]
 * @default []
 *
 * @param foregroundList
 * @text 前景列表
 * @desc 配置在特定场景自动加载的前景图片。
 * @type struct<LayerConfig>[]
 * @default []
 *
 * @param defaultVisibleSwitchId
 * @text 是否默认显示的开关
 * @desc 是否默认显示的开关
 * @type switch
 *
 * @param defaultClothId
 * @text 服装状态绑定的变量
 * @desc 服装状态绑定的变量
 * @type variable
 *
 * @param fernSpineId
 * @text 菲伦立绘的ID
 * @desc 菲伦立绘的ID
 * @type text
 * @default fern-tachie
 *
 * @command showSpine
 * @text 显示Spine
 * @desc 显示一个Spine，可带有移动和淡入动画。
 * @arg id
 * @text Spine ID
 * @type text
 * @default fern-tachie
 * @arg duration
 * @text 动画时长(帧)
 * @desc 过渡动画的持续时间，0表示立即显示。
 * @type number
 * @default 0
 * @arg startX
 * @text 起始位置 X
 * @desc 动画开始时的X坐标。留空则使用当前位置。
 * @type number
 * @min -9999
 * @arg startY
 * @text 起始位置 Y
 * @desc 动画开始时的Y坐标。留空则使用当前位置。
 * @type number
 * @min -9999
 *
 * @command hideSpine
 * @text 隐藏Spine
 * @desc 隐藏一个Spine，可带有移动和淡出动画。
 * @arg id
 * @text Spine ID
 * @type text
 * @default fern-tachie
 * @arg duration
 * @text 动画时长(帧)
 * @desc 过渡动画的持续时间，0表示立即隐藏。
 * @type number
 * @default 0
 * @arg endX
 * @text 结束位置 X
 * @desc 动画结束时的X坐标。留空则使用当前位置。
 * @type number
 * @min -9999
 * @default 0
 * @arg endY
 * @text 结束位置 Y
 * @desc 动画结束时的Y坐标。留空则使用当前位置。
 * @type number
 * @min -9999
 * @default 0
 *
 * @command moveSpine
 * @text 移动Spine
 * @desc 将Spine平滑移动到新位置。
 * @arg id
 * @text Spine ID
 * @desc Spine的唯一ID
 * @type text
 * @default fern-tachie
 * @arg x
 * @text 目标 X坐标
 * @type number
 * @arg y
 * @text 目标 Y坐标
 * @type number
 * @arg duration
 * @text 动画时长(帧)
 * @desc 移动动画的持续时间，0表示立即移动。
 * @type number
 * @default 60
 *
 * @command setSpineAnimation
 * @text 设置Spine动画
 * @desc 改变指定Spine的当前动画。
 * @arg id
 * @text Spine ID
 * @type text
 * @default fern-tachie
 * @arg animationName
 * @text 动画名
 * @type text
 * @arg loop
 *
 * @command setSpineSkin
 * @text 设置Spine皮肤
 * @desc 改变指定Spine的皮肤。
 * @arg id
 * @text Spine ID
 * @desc Spine的唯一ID
 * @default fern-tachie
 * @type text
 * @arg skinNames
 * @text 皮肤名(逗号分隔)
 * @desc Spine文件中定义的皮肤名，多个用逗号隔开。
 * @type text
 *
 * @command showBackground
 * @text 显示背景
 * @desc 动态显示一个背景图片，同时会覆盖上一个背景。
 * @arg imageFile
 * @text 图片文件
 * @type file
 * @dir img/
 * @arg x
 * @text X坐标
 * @type number
 * @default 0
 * @arg y
 * @text Y坐标
 * @type number
 * @default 0
 * @arg width
 * @text 宽度
 * @type number
 * @default 0
 * @arg height
 * @text 高度
 * @type number
 * @default 0
 *
 * @command hideBackground
 * @text 隐藏背景
 * @desc 隐藏当前显示的背景图片。
 *
 * @command showForeground
 * @text 显示前景
 * @desc 动态显示一个前景图片。
 * @arg imageFile
 * @text 图片文件
 * @type file
 * @dir img/
 * @arg x
 * @text X坐标
 * @type number
 * @default 0
 * @arg y
 * @text Y坐标
 * @type number
 * @default 0
 * @arg width
 * @text 宽度
 * @type number
 * @default 0
 * @arg height
 * @text 高度
 * @type number
 * @default 0
 *
 * @command hideForeground
 * @text 隐藏前景
 * @desc 隐藏当前显示的前景图片。
 * 
 * @command showTachie
 * @text 显示立绘，正常用开关即可
 * @desc 显示立绘面板。
 * 
 * @command hideTachie
 * @text 隐藏立绘，正常用开关即可
 * @desc 隐藏立绘面板。
 * 
 * 
 *
 * @command setFern_info
 * @text ———— 定制部分 ————
 * 
 * @command setFernAnime
 * @text 设置菲伦立绘的动画
 * @desc 设置菲伦立绘的动画
 * @arg anime
 * @text 动画
 * @desc 动画
 * @type select
 * @option 常规 - idle
 * @value idle,常规
 * @option 惊讶 - shock
 * @value shock,惊讶
 * 
 * @command setFernFace
 * @text 设置菲伦立绘的表情
 * @desc 设置菲伦立绘的表情
 * @arg face
 * @text 基础表情
 * @desc 基础表情
 * @type select
 * @option 鼓脸生气 - 1
 * @value 1,鼓脸生气
 * @option 道歉笑容 - 2
 * @value 2,道歉笑容
 * @option 闭眼生气 - 3
 * @value 3,闭眼生气
 * @option 瞪眼生气 - 4
 * @value 4,瞪眼生气
 * @option 天然呆 - 5
 * @value 5,天然呆
 * @option 不高兴 - 6
 * @value 6,不高兴
 * @option 咬牙生气 - 7
 * @value 7,咬牙生气
 * @option 普通表情 - 8
 * @value 8,普通表情
 * @option 慵懒 - 9
 * @value 9,慵懒
 * @option 吃惊 - 10
 * @value 10,吃惊
 * @option 闭眼叹气 - 11
 * @value 11,闭眼叹气
 * @option 微笑 - 12
 * @value 12,微笑
 * @option 高潮吐舌 - 13
 * @value 13,高潮吐舌
 * @option 高潮张嘴 - 14
 * @value 14,高潮张嘴
 * @option 狡黠微笑 - 15
 * @value 15,狡黠微笑
 * @option 哭泣 - 16
 * @value 16,哭泣
 * @option 惊讶难过 - 17
 * @value 17,惊讶难过
 * @option 惊讶难过2 - 18
 * @value 18,惊讶难过2
 * @option 生气张嘴 - 19
 * @value 19,生气张嘴
 * @option 生气抿嘴 - 20
 * @value 20,生气抿嘴
 * @option 自信 - 21
 * @value 21,自信
 * @option 微笑 - 22
 * @value 22,微笑
 * @option 张大嘴吃惊 - 23
 * @value 23,张大嘴吃惊
 * @option 略微吃惊 - 24
 * @value 24,略微吃惊
 * @option 洗脑等级1 - 25
 * @value 25,洗脑等级1
 * @option 洗脑等级2 - 26
 * @value 26,洗脑等级2
 * @option 洗脑等级3 - 27
 * @value 27,洗脑等级3
 * @default 8,普通表情
 * 
 * @arg faceEx
 * @text 附加表情
 * @desc 附加表情
 * @type select
 * @option 无表情
 * @value 
 * @option 脸微红 - a1
 * @value a1,脸微红
 * @option 脸潮红 - a2
 * @value a2,脸潮红
 * @option 腮红 - a3
 * @value a3,腮红
 * @option 脸黑 - a5
 * @value a5,脸黑
 * @default 
 * 
 * 
 * @command setFernCloth
 * @text 设置菲伦立绘的服装
 * @desc 设置菲伦立绘的服装，注：正常着装及怀孕状态不能触发立绘H
 * @arg cloth
 * @text 穿着
 * @desc 穿着
 * @type select
 * @option 常规 - coat
 * @value coat,常规
 * @option 仅内衣 - clothing
 * @value clothing,仅内衣
 * @option 裸体 - body
 * @value body,裸体
 * @option 孕肚装 - maternity
 * @value maternity,孕肚装
 * @option 孕肚（全裸） - fetation
 * @value fetation,孕肚（全裸）
 * 
 * 
 * @command setFernSex
 * @text 设置菲伦立绘涩涩（H）
 * @desc 设置菲伦立绘涩涩（H），注：正常着装及怀孕状态不能触发立绘H
 * @arg action
 * @text 动作
 * @desc 动作
 * @type select
 * @option 正常（非H） - normal
 * @value normal,正常（非H）
 * @option 揉胸揪乳头 - rub_l_breast
 * @value rub_l_breast,揉胸揪乳头
 * @option 吸乳 - suck_nip
 * @value suck_nip,吸乳
 * @option 揉双乳 - rub_breasts
 * @value rub_breasts,揉双乳
 * @default normal,正常（非H）
 * @arg color
 * @type select
 * @option 正常 - normal
 * @value normal,正常
 * @option 浅色 - light
 * @value light,浅色
 * @option 深色 - dark
 * @value dark,深色
 * @default normal,正常
 * 
 */

/*~struct~SpineConfig:
 * @param id
 * @text 自定义ID
 * @desc 用于在插件指令中识别此Spine的唯一ID。
 * @type text
 *
 * @param spineFile
 * @text Spine文件 (.json)
 * @desc Spine的json文件名，路径相对于 /spines/。
 * @type text
 *
 * @param x
 * @text 默认位置 X
 * @type number
 * @default 0
 *
 * @param y
 * @text 默认位置 Y
 * @type number
 * @default 0
 *
 * @param scaleX
 * @text 缩放 X
 * @type number
 * @decimals 2
 * @default 1.00
 *
 * @param scaleY
 * @text 缩放 Y
 * @type number
 * @decimals 2
 * @default 1.00
 * 
 * @param animationSpeed
 * @text 播放速度
 * @desc 动画的播放速度，1代表正常速度。
 * @type number
 * @decimals 2
 * @default 1.00
 * 
 * @param initiallyVisible
 * @text 默认显示
 * @desc 加载后是否立即显示。
 * @type boolean
 * @default true
 *
 * @param scenes
 * @text 限定的显示场景列表
 * @desc 在这些场景中，此Spine会自动加载。
 * @type text[]
 * @default ["Scene_Map"]
 */

/*~struct~LayerConfig:
 * @param id
 * @text 自定义ID
 * @desc 用于识别此图层的唯一ID。
 * @type text
 * 
 * @param imageFile
 * @text 图片文件
 * @type file
 * @dir img/
 * 
 * @param x
 * @text X坐标
 * @type number
 * @default 0
 * 
 * @param y
 * @text Y坐标
 * @type number
 * @default 0
 * 
 * @param width
 * @text 宽度
 * @desc 0 表示使用图片原始宽度。
 * @type number
 * @default 0
 * 
 * @param height
 * @text 高度
 * @desc 0 表示使用图片原始高度。
 * @type number
 * @default 0
 * 
 * @param scenes
 * @text 限定的显示场景列表
 * @desc 在这些场景中，此图层会自动显示。
 * @type text[]
 * @default ["Scene_Map"]
 * 
 * @param maps
 * @text 限定的显示地图ID列表
 * @desc 在这些地图ID中，此图层会自动显示。如果为空则不限制（但仍受Scenes限制）。
 * @type number[]
 * @default []
 */

(() => {
  'use strict';

  const PLUGIN_NAME = 'Hakubox_Module_Spine';

  //=============================================================================
  // ** Parameter Parser
  //=============================================================================
  const parseList = (param) => JSON.parse(param || '[]').map(item => JSON.parse(item));

  const parameters = PluginManager.parameters(PLUGIN_NAME);
  const spineConfigs = parseList(parameters.spineList).map(config => ({
    id: config.id,
    spineFile: config.spineFile,
    x: Number(config.x || 0),
    y: Number(config.y || 0),
    scaleX: Number(config.scaleX || 1.0),
    scaleY: Number(config.scaleY || 1.0),
    // defaultAnimation: config.defaultAnimation || '',
    // defaultSkins: config.defaultSkins ? config.defaultSkins.split(',').map(s => s.trim()) : [],
    animationSpeed: Number(config.animationSpeed || 1.0),
    initiallyVisible: config.initiallyVisible === 'true',
    scenes: JSON.parse(config.scenes || '[]'),
    maps: JSON.parse(config.maps || '[]').map(Number) // 解析地图ID数组
  }));

  const backgroundConfigs = parseList(parameters.backgroundList);
  const foregroundConfigs = parseList(parameters.foregroundList);

  /** 是否默认显示绑定的开关 */
  const defaultVisibleSwitchId = parameters.defaultVisibleSwitchId;
  /** 服装状态绑定的变量 */
  const defaultClothId = parameters.defaultClothId;
  /** 菲伦立绘Spine的ID */
  const fernSpineId = parameters.fernSpineId || 'fern-tachie';

  const spineConfigMap = new Map(spineConfigs.map(config => [config.id, config]));

  // 全局存储当前场景的对象
  const activeSpines = new Map();
  const activeLayers = { background: null, foreground: null };


  //=============================================================================
  // ** SpineManager (Resource Loader)
  //=============================================================================
  class SpineManager {
    static _cache = {};
    static _loaders = {};
    static load(spineName) {
      const url = `spine/${spineName}.json`;
      if (this._cache[url]) return Promise.resolve(new PIXI.spine.Spine(this._cache[url].spineData));
      if (this._loaders[url]) return this._loaders[url];
      this._loaders[url] = new Promise((resolve, reject) => {
        const loader = new PIXI.Loader();
        loader.add(url, url);
        loader.load((_, resources) => {
          if (resources[url] && resources[url].spineData) {
            this._cache[url] = resources[url];
            delete this._loaders[url];
            resolve(new PIXI.spine.Spine(resources[url].spineData));
          } else {
            delete this._loaders[url];
            reject(new Error(`Spine resource failed to load: ${url}`));
          }
        });
        loader.onError.add((error) => {
          delete this._loaders[url];
          reject(error);
        });
      });
      return this._loaders[url];
    }
  }
  window.SpineManager = SpineManager;

  //=============================================================================
  // ** SpineTweenManager (For smooth transitions)
  // ** 简易的补间动画管理器
  //=============================================================================
  class SpineTweenManager {
    constructor() {
      this._tweens = [];
    }

    // 缓动函数 (二次方缓入缓出)
    easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    /**
     * 添加一个新的补间动画
     * @param {object} target - 动画目标对象 (e.g., Spine instance)
     * @param {object} to - 目标属性 {x: 100, y: 100, alpha: 1}
     * @param {number} duration - 持续时间 (帧)
     * @param {function} onComplete - 完成时的回调
     */
    add(target, to, duration, onComplete = null) {
      const tween = {
        target,
        to,
        duration,
        onComplete,
        from: {},
        _progress: 0
      };
      // 记录初始属性
      for (const key in to) {
        tween.from[key] = target[key];
      }
      this._tweens.push(tween);
    }

    update() {
      if (this._tweens.length === 0) return;
      // 从后向前遍历，方便安全删除
      for (let i = this._tweens.length - 1; i >= 0; i--) {
        const tween = this._tweens[i];
        tween._progress++;
        const t = Math.min(tween._progress / tween.duration, 1);
        const easedT = this.easeInOutQuad(t);

        // 更新属性
        for (const key in tween.to) {
          const start = tween.from[key];
          const end = tween.to[key];
          tween.target[key] = start + (end - start) * easedT;
        }

        if (t >= 1) {
          if (tween.onComplete) {
            tween.onComplete();
          }
          this._tweens.splice(i, 1);
        }
      }
    }
  }

  //=============================================================================
  // ** Scene_Base
  // ** 扩展基础场景，添加容器和生命周期管理
  //=============================================================================

  const _Scene_Base_create = Scene_Base.prototype.create;
  Scene_Base.prototype.create = function () {
    _Scene_Base_create.call(this);
    this.createSpineLayerContainers();
    this._spineTweenManager = new SpineTweenManager();
  };

  Scene_Base.prototype.createSpineLayerContainers = function () {
    this._spineBaseContainer = new PIXI.Container();

    this._spineBaseContainer.visible = false;
    this.addChild(this._spineBaseContainer);

    this._spineBackgroundContainer = new PIXI.Container();
    this._spineContainer = new PIXI.Container();
    this._spineContainer._brightnessFilter = new PIXI.filters.ColorMatrixFilter();
    // 将滤镜应用到容器
    this._spineContainer.filters = [this._spineContainer._brightnessFilter];
    // 记录当前亮度 (1.0 = 正常, 0.0 = 全黑)
    this._spineContainer._currentVal = 1.0;
    this._spineForegroundContainer = new PIXI.Container();
    this._spineBaseContainer.addChild(
      this._spineBackgroundContainer, 
      this._spineContainer, 
      this._spineForegroundContainer
    );
  };

  const _Scene_Base_update = Scene_Base.prototype.update;
  Scene_Base.prototype.update = function () {
    _Scene_Base_update.call(this);
    
    // 原有的补间动画逻辑
    if (this._spineTweenManager) {
      this._spineTweenManager.update();
    }
    
    // 原有的可见性开关逻辑
    if (this._spineBaseContainer) {
      if (this._spineBaseContainer.visible !== $gameSwitches.value(defaultVisibleSwitchId)) {
        this._spineBaseContainer.visible = $gameSwitches.value(defaultVisibleSwitchId);
      }
      
      // ———————————————— 新增：极简版变暗逻辑 ————————————————
      // 选择你要变色的容器：
      // this._spineContainer     = 只有立绘变黑（推荐）
      // this._spineBaseContainer = 连背景图层一起变黑
      const targetContainer = this._spineContainer; 
      if (targetContainer && $gameSystem) {
        // B. 设定目标亮度
        // 逻辑：如果是菲伦说话，变暗(比如0.4)；否则恢复正常(1.0)
        const isCurrent = ($gameSystem._tachieVisible && (!$gameSystem._currentSpeaker || $gameSystem._currentSpeaker === '菲伦'));
        const targetVal = isCurrent || !Hakubox_NPCTachie.hasCurrentSpeakerTachie() ? 1.0 : 0.4; 

        // C. 平滑过渡 (每帧逼近目标值)
        const speed = 0.2; // 变化速度 (0.01~1.0)，越大越快
        const diff = targetVal - targetContainer._currentVal;
        // 只有当有明显差异时才计算，节省性能
        // 只有当有明显差异时才计算，节省性能
        if (Math.abs(diff) > 0.005) {
          targetContainer._currentVal += diff * speed;
          // 应用亮度 (brightness方法: 1为原色，0为黑，>1为爆亮)
          targetContainer._brightnessFilter.brightness(targetContainer._currentVal, false);
        }
      }
      // ————————————————————————————————————————————————————
    }
  };

  const _Scene_Map_start = Scene_Map.prototype.start;
  Scene_Map.prototype.start = function () {
    _Scene_Map_start.call(this);
    setTimeout(() => {
      this.loadSceneElements();
    }, 100);
  };

  /**
   * @description 加载当前场景配置的所有元素 (Spine, BG, FG)
   */
  Scene_Map.prototype.loadSceneElements = function () {
    this.clearAllSceneElements();
    const sceneName = SceneManager._scene.constructor.name;
    const currentMapId = $gameMap.mapId(); // 获取当前地图ID

    // Load Spines (Spine逻辑保持不变)
    spineConfigs.forEach(config => {
      if (config.scenes.includes(sceneName)) {
        this.createAndAddSpine(config);
      }
    });

    // ———— 修改开始：BG 背景逻辑 ————
    // 1. 查找当前地图是否有匹配的配置
    let matchedBgConfig = null;
    backgroundConfigs.some(config => {
      if (config.scenes.includes(sceneName)) {
        // 如果maps为空或者包含当前mapId，则匹配成功
        if (!config.maps || config.maps.length === 0 || config.maps.includes(currentMapId)) {
          matchedBgConfig = config;
          return true; // 找到即停止，优先取列表上方的配置
        }
      }
      return false;
    });

    // 2. 判断是否需要更新显示
    if ($gameData.haku_bg_info) {
        // 该逻辑处理：如果在旧地图没显示（visible=false），到新地图也不显示。
        // 如果在旧地图显示了（visible=true），到新地图自动切换背景。
        if ($gameData.haku_bg_info.visible) {
            // 如果找到了新的配置，且跟当前保存的图片不一致（或单纯为了刷新位置），应用它
            if (matchedBgConfig) {
                 $gameData.haku_bg_info = {
                     imageFile: matchedBgConfig.imageFile,
                     x: Number(matchedBgConfig.x || 0),
                     y: Number(matchedBgConfig.y || 0),
                     width: Number(matchedBgConfig.width || 0),
                     height: Number(matchedBgConfig.height || 0),
                     visible: true
                 };
            }
            // 无论是沿用旧背景还是切换了新背景，只要 visible 是 true，就执行加载
            this.createAndAddLayerImage(this._spineBackgroundContainer, $gameData.haku_bg_info);
        }
    } else {
        // 如果从未手动操作过（$gameData.haku_bg_info 为空），完全走配置
        // 这种情况通常是第一次进入游戏，或者还没用过背景功能
        if (matchedBgConfig) {
            $gameData.haku_bg_info = {
                imageFile: matchedBgConfig.imageFile,
                x: Number(matchedBgConfig.x || 0),
                y: Number(matchedBgConfig.y || 0),
                width: Number(matchedBgConfig.width || 0),
                height: Number(matchedBgConfig.height || 0),
                visible: true 
            };
            this.createAndAddLayerImage(this._spineBackgroundContainer, $gameData.haku_bg_info);
        }
    }

    // ———— 修改开始：FG 前景逻辑 (逻辑同背景) ————
    let matchedFgConfig = null;
    foregroundConfigs.some(config => {
        if (config.scenes.includes(sceneName)) {
            if (!config.maps || config.maps.length === 0 || config.maps.includes(currentMapId)) {
                matchedFgConfig = config;
                return true;
            }
        }
        return false;
    });

    if ($gameData.haku_fg_info) {
        if ($gameData.haku_fg_info.visible) {
             if (matchedFgConfig) {
                 $gameData.haku_fg_info = {
                     imageFile: matchedFgConfig.imageFile,
                     x: Number(matchedFgConfig.x || 0),
                     y: Number(matchedFgConfig.y || 0),
                     width: Number(matchedFgConfig.width || 0),
                     height: Number(matchedFgConfig.height || 0),
                     visible: true
                 };
             }
            this.createAndAddLayerImage(this._spineForegroundContainer, $gameData.haku_fg_info);
        }
    } else {
        if (matchedFgConfig) {
            $gameData.haku_fg_info = {
                imageFile: matchedFgConfig.imageFile,
                x: Number(matchedFgConfig.x || 0),
                y: Number(matchedFgConfig.y || 0),
                width: Number(matchedFgConfig.width || 0),
                height: Number(matchedFgConfig.height || 0),
                visible: true
            };
            this.createAndAddLayerImage(this._spineForegroundContainer, $gameData.haku_fg_info);
        }
    }
  };

  /**
   * @description 创建并添加一个Spine实例
   * @param {object} config - Spine的配置对象
   */
  Scene_Base.prototype.createAndAddSpine = function (config) {
    SpineManager.load(config.spineFile)
      .then(spine => {
        if (SceneManager._scene !== this) return; // 场景已切换，放弃添加

        spine.x = config.x;
        spine.y = config.y;
        spine.scale.set(config.scaleX, config.scaleY);
        spine.visible = config.initiallyVisible;
        spine.state.timeScale = config.animationSpeed;

        // # Apply default skins
        // if (config.defaultSkins.length > 0) {
        //   const newSkin = new window.PIXI.spine.core.Skin('combined-skin');
        //   config.defaultSkins.forEach(skinName => {
        //     const skin = spine.skeleton.data.findSkin(skinName);
        //     if (skin) {
        //       newSkin.addSkin(skin);
        //     } else {
        //       console.warn(`Skin "${skinName}" not found for spine "${config.id}".`);
        //     }
        //   });
        //   spine.skeleton.setSkin(newSkin);
        //   spine.skeleton.setSlotsToSetupPose();

        // }

        // # Set default animation
        // const animName = config.defaultAnimation || (spine.spineData.animations.length > 0 ? spine.spineData.animations[0].name : null);
        // if (animName) {
        //   spine.state.setAnimation(0, animName, true);
        //   $gameData.fernAnime = animName;
        // }

        this._spineContainer.addChild(spine);
        activeSpines.set(config.id, spine);

        Utils_Spine.updateFernSkin();
        Utils_Spine.updateFernAnime();
      })
      .catch(error => console.error(`Error loading spine: ${config.spineFile}`, error));
  };

  /**
   * @description 创建并添加图层图片 (BG/FG)
   */
  Scene_Base.prototype.createAndAddLayerImage = function (container, config) {
    const bitmap = ImageManager.loadBitmap("img/", config.imageFile);
    const sprite = new Sprite(bitmap);
    sprite.x = Number(config.x) || 0;
    sprite.y = Number(config.y) || 0;
    if (bitmap.isReady()) {
      sprite.width = Number(config.width) || bitmap.width;
      sprite.height = Number(config.height) || bitmap.height;
    } else {
      bitmap.addLoadListener(() => {
        sprite.width = Number(config.width) || bitmap.width;
        sprite.height = Number(config.height) || bitmap.height;
      });
    }
    container.addChild(sprite);

    // Store reference for potential dynamic control (if needed later)
    if (container === this._spineBackgroundContainer) activeLayers.background = sprite;
    if (container === this._spineForegroundContainer) activeLayers.foreground = sprite;
  };


  /**
   * @description 清理所有由插件管理的元素
   */
  Scene_Base.prototype.clearAllSceneElements = function () {
    activeSpines.forEach(spine => spine.destroy());
    activeSpines.clear();
    this._spineBackgroundContainer?.removeChildren();
    this._spineForegroundContainer?.removeChildren();
    activeLayers.background = null;
    activeLayers.foreground = null;
  };

  const _Scene_Base_terminate = Scene_Base.prototype.terminate;
  Scene_Base.prototype.terminate = function () {
    _Scene_Base_terminate.call(this);
    this.clearAllSceneElements();
  };

  //=============================================================================
  // ** Scene_Map
  // ** 修正地图场景中Spine容器的层级
  //=============================================================================
  const _Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
  Scene_Map.prototype.createDisplayObjects = function () {
    _Scene_Map_createDisplayObjects.call(this);
    // 将Spine容器的层级移到 _spriteset (地图和角色层) 之上
    if (this._spineBaseContainer) {
      SceneManager._scene._spriteset.addChild(this._spineBaseContainer);
    }
  };

  // #region Spine工具类

  /** Spine工具类 */
  class Utils_Spine {
    /** 根据Id获取Spine动画对象 */
    static getSpineById(id) {
      const spine = activeSpines.get(id);
      if (!spine) console.warn(`Spine with ID "${id}" not found.`);
      return spine;
    }
    /** 菲伦立绘Spine动画 */
    static get fernAnime() {
      return $gameData.fernAnime || 'idle';
    }
    static set fernAnime(value) {
      $gameData.fernAnime = value;
    }
    /** 菲伦立绘表情Skin */
    static get faceFaceSkin() {
      return $gameData.faceFaceSkin || 'face/22';
    }
    static set faceFaceSkin(value) {
      $gameData.faceFaceSkin = value;
    }
    /** 菲伦立绘服装Skin */
    static get fernClothSkin() {
      return $gameData.fernClothSkin || 'clothes/coat';
    }
    static set fernClothSkin(value) {
      $gameData.fernClothSkin = value;
    }
    /** 菲伦立绘服装Key */
    static get fernClothKey() {
      return $gameData.fernClothKey || 'coat';
    }
    static set fernClothKey(value) {
      $gameData.fernClothKey = value;
    }
    /** 菲伦立绘是否正在涩涩状态 */
    static get fernInSex() {
      return $gameData.fernInSex || false;
    }
    static set fernInSex(value) {
      $gameData.fernInSex = value;
    }
    /** 菲伦立绘的H行为Key */
    static get fernSexKey() {
      return $gameData.fernSexKey || 'normal';
    }
    static set fernSexKey(value) {
      $gameData.fernSexKey = value;
    }
    /** 菲伦立绘的H行为对手肤色 */
    static get fernSexColor() {
      return $gameData.fernSexColor || 'normal';
    }
    static set fernSexColor(value) {
      $gameData.fernSexColor = value;
    }
    /** 菲伦立绘的H行为Skin */
    static get fernSexSkin() {
      return $gameData.fernSexSkin || '';
    }
    static set fernSexSkin(value) {
      $gameData.fernSexSkin = value;
    }
    /** 获取菲伦所有皮肤 */
    static getFernAllSkins() {
      return {
        face: Utils_Spine.faceFaceSkin,
        cloth: Utils_Spine.fernClothSkin,
        sex: Utils_Spine.fernSexSkin
      }
    }
    /** 获取菲伦所有皮肤的字符串 */
    static getFernAllSkinsStr() {
      const _allSkins = Object.values(Utils_Spine.getFernAllSkins()).filter(i => i).join(',');
      return _allSkins;
    }
    /** 设置Spine动画 */
    static setSpineAnimation(spineId, animationName, loop) {
      const id = spineId;
      const spine = Utils_Spine.getSpineById(id);
      if (!spine || !spine.state) {
        return;
      }

      let _loop = loop;

      if (_loop === undefined) {
        if (['idle', 'idle1', 'sex1', 'sex2'].includes(animationName)) {
          _loop = true;
        } else {
          _loop = false;
        }
      }

      // 设置请求的动画，并获取对该动画轨道的引用 (trackEntry)
      const trackEntry = spine.state.setAnimation(0, animationName, _loop);
      // 关键改动：如果动画是非循环的，则添加一个一次性的完成监听器
      if (!_loop) {
        const config = spineConfigMap.get(id);
        
        // 确保该Spine配置了有效的默认动画以供返回
        if (config && config.defaultAnimation) {
          // 'complete' 事件会在非循环动画播放完毕后触发
          trackEntry.listener = {
            complete: () => {
              // 动画播放完毕后，自动设置回默认的循环动画
              if (['body', 'clothing', 'coat'].includes(Utils_Spine.fernClothKey)) {
                spine.state.setAnimation(0, 'idle', true);
              } else if (['maternity', 'fetation'.includes(Utils_Spine.fernClothKey)]) {
                spine.state.setAnimation(0, 'idle1', true);
              }
            }
          };
        }
      }
    }
    /** 设置Spine皮肤 */
    static setSkin(spineId, skinNames) {
      const spine = Utils_Spine.getSpineById(spineId);
      if (!spine || !spine.skeleton) return;

      try {
        const _skinNames = skinNames ? skinNames.split(',').map(s => s.trim()) : [];
        if (_skinNames.length === 0) {
          spine.skeleton.setSkin(null); // 移除所有皮肤
        } else if (_skinNames.length === 1) {
          spine.skeleton.setSkinByName(_skinNames[0]); // 单个皮肤直接设置
        } else {
          // 多个皮肤，混合
          const combinedSkin = new PIXI.spine.core.Skin('combined-skin');
          _skinNames.forEach(skinName => {
            const skin = spine.skeleton.data.findSkin(skinName);
            if (skin) {
              combinedSkin.addSkin(skin);
            } else {
              console.warn(`Skin "${skinName}" not found for spine "${spineId}".`);
            }
          });
          spine.skeleton.setSkin(combinedSkin);
        }
        spine.skeleton.setSlotsToSetupPose();
      } catch (e) {
        console.error(`Failed to set skin(s) "${skinNames}" for spine "${spineId}".`, e);
      }
    }
    /** 更新菲伦立绘的皮肤 */
    static updateFernSkin() {
      const _allSkins = Utils_Spine.getFernAllSkinsStr();
      Utils_Spine.setSkin(fernSpineId, _allSkins);
    }
    /** 设置菲伦的动画 */
    static setFernAnime(anime) {
      if (!anime) throw new Error(`Anime "${anime}" not found.`);

      const _anime = anime.split(',')[0];

      Utils_Spine.setSpineAnimation(fernSpineId, _anime);
    }
    /** 更新菲伦立绘的动画 */
    static updateFernAnime() {
      Utils_Spine.setSpineAnimation(fernSpineId, Utils_Spine.fernAnime);
    }
    /** 设置菲伦的表情 */
    static setFernFace(face, faceEx = '') {
      if (!face) throw new Error(`Face "${face}" not found.`);

      const _face = face.split(',')[0];
      const _faceEx = faceEx ? faceEx.split(',')[0] : '';
      $gameData.fern_tachie_face = _face;
      $gameData.fern_tachie_faceEx = _faceEx;

      let _skins = [`face/${_face}`];
      if (faceEx) _skins.push(`face/${_faceEx}`);

      Utils_Spine.faceFaceSkin = _skins.join(',');
      
      const _allSkins = Utils_Spine.getFernAllSkinsStr();
      Utils_Spine.setSkin(fernSpineId, _allSkins);
    }
    /** 设置菲伦的服装 */
    static setFernCloth(cloth) {
      if (!cloth) throw new Error(`Cloth "${cloth}" not found.`);

      $gameData.fern_tachie_cloth = cloth;

      let _skins = '';

      switch (cloth) {
        case 'coat':
          Utils_Spine.fernClothKey2 = 'coat';
          _skins = 'clothes/coat';
          break;
        case 'clothing':
          Utils_Spine.fernClothKey2 = 'clothing';
          _skins = 'clothes/clothing';
          break;
        case 'body':
          Utils_Spine.fernClothKey2 = 'body';
          _skins = 'clothes/body';
          break;
        case 'maternity':
          _skins = 'clothes/body,clothes/body1,clothes/clothing1';
          break;
        case 'fetation':
          _skins = 'clothes/body,clothes/body1';
          break;
        default:
          break;
      }

      // 特殊处理怀孕时的动画
      if (cloth === 'maternity' || cloth === 'fetation') {
        if (Utils_Spine.fernAnime != 'idle1') {
          Utils_Spine.fernAnime = 'idle1';
          Utils_Spine.setFernAnime(Utils_Spine.fernAnime);
        }
      } else if (!Utils_Spine.fernInSex) {
        if (Utils_Spine.fernAnime != 'idle') {
          Utils_Spine.fernAnime = 'idle';
          Utils_Spine.setFernAnime(Utils_Spine.fernAnime);
        }
      }
      
      Utils_Spine.fernClothKey = cloth;
      Utils_Spine.fernClothSkin = _skins;

      const _allSkins = Utils_Spine.getFernAllSkinsStr();
      Utils_Spine.setSkin(fernSpineId, _allSkins);
    }
    /** 设置菲伦立绘涩涩 */
    static setFernSex(action, color = 'normal') {
      if (!action) throw new Error(`Action "${action}" not found.`);

      $gameData.fern_tachie_sex = action;
      $gameData.fern_tachie_sex_color = color;
      
      let _skins = '';
      let _colorIndex = ['normal', 'light', 'dark'].indexOf(color);

      if (Utils_Spine.fernClothKey === 'clothing') {
        switch (action) {
          case 'normal': // 正常（非H）
            _skins = '';
            break;
          case 'rub_l_breast': // 揉左胸
            _skins = `sex/hl${_colorIndex || ''},sex/hr${_colorIndex || ''},sex/pinch`;
            break;
          case 'suck_nip': // 吸乳
            _skins = `sex/absorb,sex/t${_colorIndex + 1}`;
            break;
          case 'rub_breasts': // 揉双乳
            _skins = `sex/rub,sex/hl${_colorIndex || ''},sex/hr1${3 - _colorIndex}`;
            break;
          default:
            break;
        }
      } else if (Utils_Spine.fernClothKey === 'body') {
        switch (action) {
          case 'normal': // 正常（非H）
            _skins = '';
            break;
          case 'rub_l_breast': // 揉左胸
            _skins = `sex/hl${_colorIndex || ''},sex/hr${_colorIndex || ''},sex/pinch1`;
            break;
          case 'suck_nip': // 吸乳
            _skins = `sex/absorbe1,sex/t${_colorIndex + 1}`;
            break;
          case 'rub_breasts': // 揉双乳
            _skins = `sex/rub1,sex/hl${_colorIndex || ''},sex/hr1${3 - _colorIndex}`;
            break;
          default:
            break;
        }
      } else {
        throw new Error(`Cannot set sex on cloth "${Utils_Spine.fernClothKey}".`);
      }

      Utils_Spine.fernSexKey = action;
      Utils_Spine.fernSexColor = color;
      Utils_Spine.fernSexSkin = _skins;

      if (_skins === '') {
        Utils_Spine.fernAnime = 'idle';
        Utils_Spine.setFernAnime(Utils_Spine.fernAnime);
      } else if (Utils_Spine.fernAnime !== 'sex1') {
        Utils_Spine.fernAnime = 'sex1';
        _skins += ','
        Utils_Spine.setFernAnime(Utils_Spine.fernAnime);
      }

      const _allSkins = Utils_Spine.getFernAllSkinsStr();
      Utils_Spine.setSkin(fernSpineId, _allSkins);
    }
    // 辅助函数：仅用于在指令当前场景立即显示图片
    static showLayerImage(container, args) {
      if (!container) return;
      container.removeChildren();
      const bitmap = ImageManager.loadBitmap("img/", args.imageFile);
      const sprite = new Sprite(bitmap);
      sprite.x = Number(args.x);
      sprite.y = Number(args.y);
      // 等待图片加载以设置宽高
      const w = Number(args.width);
      const h = Number(args.height);
      if (bitmap.isReady()) {
        sprite.width = w || bitmap.width;
        sprite.height = h || bitmap.height;
      } else {
        bitmap.addLoadListener(() => {
          sprite.width = w || bitmap.width;
          sprite.height = h || bitmap.height;
        });
      }
      container.addChild(sprite);
    }
    /** 显示背景 */
    static showBackground(args = {}) {
      // 1. 保存状态到 $gameData
      if (!$gameData.haku_bg_info) $gameData.haku_bg_info = {};
      $gameData.haku_bg_info = {
        imageFile: args.imageFile || $gameData.haku_bg_info.imageFile,
        x: Number(args.x) || Number($gameData.haku_bg_info.x) || 0,
        y: Number(args.y) || Number($gameData.haku_bg_info.y) || 0,
        width: Number(args.width) || Number($gameData.haku_bg_info.width) || 0,
        height: Number(args.height) || Number($gameData.haku_bg_info.height) || 0,
        visible: true
      };
      // 2. 在当前场景执行显示
      const scene = SceneManager._scene;
      if (scene && scene._spineBackgroundContainer) {
        Utils_Spine.showLayerImage(scene._spineBackgroundContainer, $gameData.haku_bg_info);
      }
    }
    /** 隐藏背景 */
    static hideBackground() {
      // 1. 保存状态为隐藏
      // 我们保留旧位置数据或直接覆盖为空均可，重要的是 visible: false
      if ($gameData.haku_bg_info) {
        $gameData.haku_bg_info.visible = false;
      } else {
        $gameData.haku_bg_info = { visible: false };
      }
      // 2. 清除当前显示
      const scene = SceneManager._scene;
      if (scene && scene._spineBackgroundContainer) {
        scene._spineBackgroundContainer.removeChildren();
      }
    }
    /** 显示前景 */
    static showForeground(args = {}) {
      // 1. 保存状态到 $gameData
      if (!$gameData.haku_fg_info) $gameData.haku_fg_info = {};
      $gameData.haku_fg_info = {
        imageFile: args.imageFile || $gameData.haku_fg_info.imageFile,
        x: Number(args.x) || Number($gameData.haku_fg_info.x) || 0,
        y: Number(args.y) || Number($gameData.haku_fg_info.y) || 0,
        width: Number(args.width) || Number($gameData.haku_fg_info.width) || 0,
        height: Number(args.height) || Number($gameData.haku_fg_info.height) || 0,
        visible: true
      };
      // 2. 执行显示
      const scene = SceneManager._scene;
      if (scene && scene._spineForegroundContainer) {
        Utils_Spine.showLayerImage(scene._spineForegroundContainer, $gameData.haku_fg_info);
      }
    }
    /** 隐藏前景 */
    static hideForeground() {
      // 1. 保存状态为隐藏
      if ($gameData.haku_fg_info) {
        $gameData.haku_fg_info.visible = false;
      } else {
        $gameData.haku_fg_info = { visible: false };
      }
      // 2. 清除当前显示
      const scene = SceneManager._scene;
      if (scene && scene._spineForegroundContainer) {
        scene._spineForegroundContainer.removeChildren();
      }
    }
  }
  window.Utils_Spine = Utils_Spine;

  // #endregion


  //=============================================================================
  // ** Plugin Commands
  //=============================================================================


  const argToNum = (arg) => (arg !== undefined && arg !== "" ? Number(arg) : undefined);

  PluginManager.registerCommand(PLUGIN_NAME, "showSpine", function (args) {
    const id = args.id;
    let spine = Utils_Spine.getSpineById(id);

    if (!spine) {
      const config = spineConfigMap.get(id);
      if (config && SceneManager._scene) {
        // 动态创建时，直接添加并立即返回spine对象（虽然内部是异步加载）
        // 这种情况下动画可能不会完美衔接，但能保证指令不报错
        SceneManager._scene.createAndAddSpine(config);
        spine = Utils_Spine.getSpineById(id); // 再次尝试获取
      }
    }
    if (!spine) return;
    $gameSwitches.setValue(defaultVisibleSwitchId, true);

    const duration = argToNum(args.duration) || 0;
    const config = spineConfigMap.get(id);
    const targetX = config ? config.x : spine.x;
    const targetY = config ? config.y : spine.y;

    spine.visible = true;

    if (duration > 0) {
      const startX = argToNum(args.startX);
      const startY = argToNum(args.startY);
      if (startX !== undefined) spine.x = startX;
      if (startY !== undefined) spine.y = startY;
      spine.alpha = 0;
      SceneManager._scene._spineTweenManager.add(spine, { x: targetX, y: targetY, alpha: 1 }, duration);
    } else {
      spine.x = targetX;
      spine.y = targetY;
      spine.alpha = 1;
    }
  });

  PluginManager.registerCommand(PLUGIN_NAME, "hideSpine", function (args) {
    const spine = Utils_Spine.getSpineById(args.id);
    if (!spine) return;
    $gameSwitches.setValue(defaultVisibleSwitchId, false);

    const duration = argToNum(args.duration) || 0;
    const endX = argToNum(args.endX) ?? spine.x;
    const endY = argToNum(args.endY) ?? spine.y;

    if (duration > 0) {
      SceneManager._scene._spineTweenManager.add(spine, { x: endX, y: endY, alpha: 0 }, duration, () => {
        spine.visible = false;
      });
    } else {
      spine.visible = false;
    }
  });

  PluginManager.registerCommand(PLUGIN_NAME, "moveSpine", function (args) {
    const spine = Utils_Spine.getSpineById(args.id);
    if (!spine) return;

    const x = Number(args.x);
    const y = Number(args.y);
    const duration = argToNum(args.duration) || 0;

    if (duration > 0) {
      SceneManager._scene._spineTweenManager.add(spine, { x, y }, duration);
    } else {
      spine.x = x;
      spine.y = y;
    }
  });

  PluginManager.registerCommand(PLUGIN_NAME, "setSpineAnimation", args => {
    Utils_Spine.setSpineAnimation(args.id, args.animationName);
  });

  PluginManager.registerCommand(PLUGIN_NAME, "setSpineSkin", args => {
    Utils_Spine.setSkin(args.id, args.skinNames);
  });

  PluginManager.registerCommand(PLUGIN_NAME, "setFernAnime", args => {
    Utils_Spine.setFernAnime(args.anime);
  });
  PluginManager.registerCommand(PLUGIN_NAME, "setFernFace", args => {
    Utils_Spine.setFernFace(
      args.face ? args.face.split(',')[0] : '',
      args.faceEx ? args.faceEx.split(',')[0] : '',
    );
  });
  PluginManager.registerCommand(PLUGIN_NAME, "setFernCloth", args => {
    Utils_Spine.setFernCloth(args.cloth ? args.cloth.split(',')[0] : '');
  });
  PluginManager.registerCommand(PLUGIN_NAME, "setFernSex", args => {
    Utils_Spine.setFernSex(
      args.action ? args.action.split(',')[0] : '',
      args.color ? args.color.split(',')[0] : 'normal',
    );
  });



  PluginManager.registerCommand(PLUGIN_NAME, "showTachie", args => {
    $gameSwitches.setValue(defaultVisibleSwitchId, true);
    // const scene = SceneManager._scene;
    // if (scene && scene._spineBaseContainer) {
    //   scene._spineBaseContainer.visible = true;
    // }
  });
  PluginManager.registerCommand(PLUGIN_NAME, "hideTachie", args => {
    $gameSwitches.setValue(defaultVisibleSwitchId, false);
    // const scene = SceneManager._scene;
    // if (scene && scene._spineBaseContainer) {
    //   scene._spineBaseContainer.visible = false;
    // }
  });

  PluginManager.registerCommand(PLUGIN_NAME, "showBackground", args => {
    Utils_Spine.showBackground(args);
  });

  PluginManager.registerCommand(PLUGIN_NAME, "hideBackground", () => {
    Utils_Spine.hideBackground();
  });

  PluginManager.registerCommand(PLUGIN_NAME, "showForeground", (args = {}) => {
    Utils_Spine.showForeground(args);
  });

  PluginManager.registerCommand(PLUGIN_NAME, "hideForeground", () => {
    Utils_Spine.hideForeground();
  });

})();
