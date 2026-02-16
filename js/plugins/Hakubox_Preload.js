/*:
 * @plugindesc [R18优化] 图片组预加载管理器 (v2.0)
 * @author hakubox
 * @email hakubox＠outlook.com
 * @target MZ
 *
 * @help
 * ============================================================================
 * Hakubox_Preload.js v2.0
 * ============================================================================
 * 专为解决手机端/模拟器大量图片(CG/差分)显示不全、闪烁问题设计的预加载插件。
 *
 * ============================================================================
 * 配置示例
 * ============================================================================
 * 假设你的图片文件结构如下：
 * - img/pictures/H_Scene_01/a.png
 * - img/pictures/H_Scene_01/b.png
 * - img/pictures/background.png (在pictures根目录)
 *
 * 【配置组 1】 (对应子文件夹):
 *   ID: Scene01
 *   子文件夹: H_Scene_01  (不需要写 img/pictures/)
 *   图片列表: ["a", "b"]
 *
 * 【配置组 2】 (对应pictures根目录):
 *   ID: CommonBG
 *   子文件夹: (留空)
 *   图片列表: ["background"]
 *
 * ============================================================================
 * 指令说明
 * ============================================================================
 * 1. 【执行预加载】
 *    参数: 组ID (如 Scene01)
 *    作用: 将该组图片强制载入内存。建议勾选“等待加载完成”。
 *
 * 2. 【清除预加载缓存】
 *    参数: 组ID (如 Scene01)
 *    作用: 释放指定组的内存引用。
 *    !! 注意 !! : 如果参数留空，将清除【所有】已加载的组。
 *
 * 建议用法：
 * - 进入H事件黑屏时 -> 执行预加载(Scene01)
 * - 事件结束/转场时 -> 清除预加载缓存(Scene01) 或 清除预加载缓存(留空全清)
 * ============================================================================
 * 
 * @param preloadGroups
 * @text 预加载组配置
 * @desc 配置你的图片组列表
 * @type struct<PreloadGroup>[]
 * @default []
 *
 * @command startLoad
 * @text 执行预加载
 * @desc 根据ID加载一组图片并锁定在内存中
 *
 * @arg groupId
 * @text 组ID
 * @desc 对应配置中的ID，例如 H_Scene_01
 * @type string
 *
 * @arg wait
 * @text 是否等待加载完成
 * @desc 开启后，事件会暂停直到所有图片加载完毕 (推荐开启)
 * @type boolean
 * @default true
 * 
 * @command clearCache
 * @text 清除预加载缓存
 * @desc 释放内存引用。留空则清除所有！
 *
 * @arg groupId
 * @text 组ID
 * @desc 指定要释放的组ID。如果不填，则清除所有组。
 * @type string
 */

/*~struct~PreloadGroup:
 * @param id
 * @text 组ID
 * @desc 调用指令时使用的凭证
 * @type string
 * @default Group_01
 *
 * @param path
 * @text 子文件夹名
 * @desc 位于 img/pictures/ 下的文件夹名。留空则表示直接读取 img/pictures/
 * @type string
 * @default 
 *
 * @param imgs
 * @text 图片文件名列表
 * @desc 不需要后缀(.png)。例如: face_01
 * @type string[]
 * @default []
 */

(() => {
  const pluginName = "Hakubox_Preload";
  const parameters = PluginManager.parameters(pluginName);

  // 解析 JSON 参数
  let parsedGroups = [];
  if (parameters.preloadGroups) {
    try {
      parsedGroups = JSON.parse(parameters.preloadGroups).map(groupJson => {
        const group = JSON.parse(groupJson);
        // 再次解析内部的字符串数组，并处理可能的空值
        group.imgs = JSON.parse(group.imgs || "[]");
        return group;
      });
    } catch (e) {
      console.error("Hakubox_Preload v2.0: 参数解析错误，请检查插件配置。", e);
      parsedGroups = [];
    }
  }

  // ------------------------------------------------------------------------
  // 核心管理器类
  // ------------------------------------------------------------------------
  class Hakubox_Preload {
    constructor() {
      // 结构: Map<string, Set<Bitmap>>
      this._cacheMap = new Map();
      // 固定前缀
      this._baseRoot = "img/";
    }

    /** 获取组配置 */
    getGroupConfig(id) {
      return parsedGroups.find(g => g.id === id);
    }

    /** 执行加载 */
    load(id) {
      if (!id) return [];

      const groupConfig = this.getGroupConfig(id);
      if (!groupConfig) {
        console.warn(`Hakubox_Preload: 找不到ID为 ${id} 的配置。`);
        return [];
      }

      // --- 路径构建逻辑 v2.0 ---
      // 1. 获取用户配置的子文件夹
      let subPath = groupConfig.path || "";

      // 2. 清理两端的斜杠，防止用户输入 /Folder/ 导致路径错误
      subPath = subPath.replace(/^[\/]+|[\/]+$/g, "");

      // 3. 拼接完整路径: img/pictures/ + (SubFolder/)
      let finalBasePath = this._baseRoot;
      if (subPath.length > 0) {
        finalBasePath += subPath + "/";
      } else {
        finalBasePath += subPath + "/pictures/";
      }

      // 获取或创建缓存 Set
      let groupCache = this._cacheMap.get(id);
      if (!groupCache) {
        groupCache = new Set();
        this._cacheMap.set(id, groupCache);
      }

      const loadingBitmaps = [];

      // 遍历加载
      for (const imgName of groupConfig.imgs) {
        if (!imgName) continue;

        // 拼接文件名及后缀
        let fullPath = finalBasePath + imgName;
        if (!fullPath.toLowerCase().endsWith(".png")) {
          fullPath += ".png";
        }

        // URL编码（处理中文）
        const url = encodeURI(fullPath);

        // 利用扩展方法加载
        const bitmap = ImageManager.loadBitmapFromUrl(url);

        // 强引用锁定
        groupCache.add(bitmap);

        // 触发器：尝试强制浏览器关注此纹理
        bitmap.addLoadListener(() => { });

        loadingBitmaps.push(bitmap);
      }

      console.log(`Hakubox_Preload: 已预加载组 [${id}], 路径: [${finalBasePath}], 数量: ${loadingBitmaps.length}`);
      return loadingBitmaps;
    }

    /**
     * 清除缓存
     * @param {string} id - 组ID，如果为空则全清
     */
    clear(id) {
      // 如果 ID 为空字符串或 null/undefined，则全清
      if (!id) {
        console.log(`Hakubox_Preload: === 执行全局清理 (共清理 ${this._cacheMap.size} 个组) ===`);
        this._cacheMap.clear();
      } else {
        // 清除指定组
        if (this._cacheMap.has(id)) {
          this._cacheMap.delete(id);
          console.log(`Hakubox_Preload: 已释放组 [${id}] 的引用。`);
        } else {
          // 仅调试用，不需要报错
          // console.log(`Hakubox_Preload: 组 [${id}] 不需要释放(未加载)。`);
        }
      }
    }
  }

  // 挂载到全局
  window.Hakubox_Preload = new Hakubox_Preload();


  // ------------------------------------------------------------------------
  // RMMZ ImageManager 扩展
  // ------------------------------------------------------------------------

  // 确保 loadBitmapFromUrl 存在
  if (!ImageManager.loadBitmapFromUrl) {
    ImageManager.loadBitmapFromUrl = function (url) {
      return this.loadBitmap("", url);
    };
  }

  // ------------------------------------------------------------------------
  // 插件指令注册
  // ------------------------------------------------------------------------

  PluginManager.registerCommand(pluginName, "startLoad", function (args) {
    const groupId = args.groupId;
    const wait = String(args.wait) === "true";

    const bitmaps = window.Hakubox_Preload.load(groupId);

    if (wait && bitmaps && bitmaps.length > 0) {
      this._preloadBitmaps = bitmaps;
      this.setWaitMode("preloadImage");
    }
  });

  PluginManager.registerCommand(pluginName, "clearCache", function (args) {
    const groupId = args.groupId;
    window.Hakubox_Preload.clear(groupId);
  });


  // ------------------------------------------------------------------------
  // Game_Interpreter 等待模式逻辑更新
  // ------------------------------------------------------------------------

  const _Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
  Game_Interpreter.prototype.updateWaitMode = function () {
    if (this._waitMode === "preloadImage") {
      const bitmaps = this._preloadBitmaps;

      if (!bitmaps || bitmaps.length === 0) {
        this._waitMode = "";
        return false;
      }

      let allReady = true;
      let hasError = false;

      for (const bmp of bitmaps) {
        if (bmp.isError()) {
          hasError = true;
        }
        if (!bmp.isReady()) {
          allReady = false;
        }
      }

      if (hasError) {
        console.warn("Hakubox_Preload: 警告 - 部分图片加载失败，已跳过等待以防止游戏卡死。");
        this._preloadBitmaps = null;
        this._waitMode = "";
        return false;
      }

      if (allReady) {
        this._preloadBitmaps = null;
        this._waitMode = "";
        return false;
      }

      return true; // 继续等待
    }
    return _Game_Interpreter_updateWaitMode.call(this);
  };

})();




