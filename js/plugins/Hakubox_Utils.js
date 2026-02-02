//=============================================================================
// ** RPG Maker MV & MZ - Hakubox_Utils.js
//=============================================================================

// #region 脚本注释
/*:zh
 * @plugindesc Hakubox工具插件 (v1.2.0)
 * @version 1.2.0
 * @author hakubox
 * @email hakubox@outlook.com
 * @url https://awcegaming.itch.io/hakubox-utils
 * @target MV MZ
 *
 * @help
 * Hakubox的工具插件，可放置到插件任何位置上。
 * 
 * 目前该插件提供以下功能：
 * 
 * 1. 初始化变量
 * 2. 初始化开关
 * 3. 缓存部分图片列表
 * 4. 调整包含BGM/BGS/ME/SE的默认音量
 * 5. 可以调整标题界面的菜单样式。
 * 6. 绘制任何角度的图片并返回Sprite精灵对象
 * 
 * 
 * ■ [ 可用脚本列表 ] .............................................
 * 以下是当前插件提供的脚本代码。
 * 
 * 〇 显示箭头图像，返回Sprite精灵对象。
 * HakuboxUtils.showArrow(imgPath, startX, startY, endX, endY)
 *   - imgPath {string} 图片地址
 *   - startX {string} 箭头开始坐标X
 *   - startY {string} 箭头开始坐标Y
 *   - endX {string} 箭头结束坐标X
 *   - endY {string} 箭头结束坐标Y
 * 代码示例: 
 * const arrow = HakuboxUtils.showArrow('img/system/arrow', 200, 200, 250, 400);
 * SceneManager._scene.addChild(arrow);
 * 
 * 
 * ■ [ 联系方式 ] ........................................................
 * 
 * 邮箱：hakubox＠outlook.com  （需要手动将＠替换为半角字符）
 * 
 * 
 * ■ [ 许可证 ] ........................................................
 * 
 * AWCE Gaming 创作者（“我们”，“我们的”或“本公司”）很高兴向您提供我们的插件，
 * 供您在游戏开发项目中使用。通过使用我们的插件，您同意遵守以下条款：
 * 
 * 信用及使用条款：
 *   • 我们的插件既可用于免费游戏也可用于商业游戏。对您的项目主题没有限制。
 *     如果您在项目中使用了此插件，请务必给“AWCE Gaming”和“HAKUBOX”以信用。
 *   • 您必须按原样分发此材料。
 *   • 您必须合法拥有“RPG Maker MV”或“RPG Maker MZ”的许可证。
 *   • 您可以对此插件进行修改以供使用。
 *     并在分发时给“AWCE Gaming”和“HAKUBOX”以信用。
 * 
 * 通过使用我们的插件，您确认并同意这些条款。我们希望我们的插件对您的游戏开发工作有所帮助。
 * 如果您有任何疑问或需要进一步的说明，请随时通过hakubox＠outlook.com联系我们。
 * 
 * 
 * ■ [ 修订历史 ] ........................................................
 * 
 * v1.0.0  2025/01/11  初版。
 * v1.1.0  2025/01/20  添加绘制任意角度图片的功能。
 * v1.2.0  2025/01/25  添加标题栏菜单调整功能及音量初始化调整功能。
 * 
 * 
 * @command changeCgMode
 * @text 切换对话框到CG模式
 * @desc 切换对话框到CG模式
 * 
 * @arg isCgMode
 * @text 是否为CG模式
 * @desc 是否为CG模式
 * @type boolean
 * @default true
 * 
 * 
 * @param initVariables
 * @parent general
 * @text 初始化变量表
 * @desc 初始化变量表
 * @type struct<InitVariable>[]
 * @default []
 * 
 * @param initSwitchs
 * @parent general
 * @text 初始化开关表
 * @desc 初始化开关表
 * @type struct<InitSwitch>[]
 * @default []
 * 
 * @param cacheImgs
 * @parent general
 * @text 缓存图片列表
 * @desc 缓存图片列表，图片间使用换行分隔，注意需要将Community_Basic插件中的cacheLimit缓存调整到合适的大小。
 * @type note
 * 
 * @param titleMenu
 * @parent general
 * @text ———— 标题菜单 ————
 * 
 * @param titleMenuX
 * @parent titleMenu
 * @text 菜单X坐标
 * @desc 菜单X坐标，不设置默认为居中
 * @type number
 * 
 * @param titleMenuY
 * @parent titleMenu
 * @text 菜单Y坐标
 * @desc 菜单Y坐标，不设置默认为居中
 * @type number
 * 
 * @param titleMenuWidth
 * @parent titleMenu
 * @text 菜单宽度
 * @desc 菜单宽度
 * @type number
 * @default 240
 * @min 100
 * @max 1000
 * 
 * @param titleMenuAlign
 * @parent titleMenu
 * @text 文本对齐方式
 * @desc 菜单文本的对齐方式
 * @type select
 * @option 左对齐
 * @value left
 * @option 居中
 * @value center
 * @option 右对齐
 * @value right
 * @default left
 * 
 * @param volume
 * @parent general
 * @text ———— 音量调整 ————
 * 
 * @param volumeBgm
 * @parent volume
 * @text BGM音量
 * @desc 设置BGM的默认音量
 * @type number
 * @min 0
 * @max 100
 * @default 80
 * 
 * @param volumeBgs
 * @parent volume
 * @text BGS音量
 * @desc 设置BGS的默认音量
 * @type number
 * @min 0
 * @max 100
 * @default 80
 * 
 * @param volumeMe
 * @parent volume
 * @text ME音量
 * @desc 设置ME的默认音量
 * @type number
 * @min 0
 * @max 100
 * @default 80
 * 
 * @param volumeSe
 * @parent volume
 * @text SE音量
 * @desc 设置SE的默认音量
 * @type number
 * @min 0
 * @max 100
 * @default 80
 */
/*~struct~InitVariable:zh
 *
 * @param variable
 * @text 变量
 * @desc 用于初始化的变量
 * @type variable
 * 
 * @param value
 * @text 值
 * @desc 值
 * @type text
 * 
 * @param remark
 * @text 备注
 * @desc 备注
 * @type note
 */
/*~struct~InitSwitch:zh
 *
 * @param switch
 * @text 开关
 * @desc 用于初始化的开关
 * @type switch
 * 
 * @param value
 * @text 状态
 * @desc 开关状态
 * @on 打开
 * @off 关闭
 * @type boolean
 * 
 * @param remark
 * @text 备注
 * @desc 备注
 * @type note
 */

/*:en
 * @plugindesc Hakubox Utility Plugin (v1.2.0)
 * @version 1.2.0
 * @author hakubox
 * @email hakubox@outlook.com
 * @url https://awcegaming.itch.io/hakubox-utils
 * @target MV MZ
 *
 * @help
 * Hakubox's utility plugin, which can be placed in any position among the plugins.
 * 
 * Currently, this plugin provides the following features:
 * 
 * 1. Initialize variables
 * 2. Initialize switches
 * 3. Cache a list of images
 * 4. Adjust the default volume for BGM/BGS/ME/SE
 * 5. You can adjust the style of the title screen menu
 * 6. Draw images at any angle and return a Sprite object
 * 
 * 
 * ■ [ Available Script List ] .............................................
 * The following is a list of script codes provided by the current plugin.
 * 
 * 〇 Display an arrow image and return a Sprite object.
 * HakuboxUtils.showArrow(imgPath, startX, startY, endX, endY)
 *   - imgPath {string} Image path
 *   - startX {number} Arrow start coordinate X
 *   - startY {number} Arrow start coordinate Y
 *   - endX {number} Arrow end coordinate X
 *   - endY {number} Arrow end coordinate Y
 * Example code: 
 * const arrow = HakuboxUtils.showArrow('img/system/arrow', 200, 200, 250, 400);
 * SceneManager._scene.addChild(arrow);
 * 
 * 
 * ■ [ Contact Information ] .......................................................
 * 
 * Email: hakubox＠outlook.com  (Please manually replace ＠ with a half-width character)
 * 
 * 
 * ■ [ License ] ........................................................
 * 
 * AWCE Gaming Creator ("We," "Us," or "Our") is pleased to
 * provide you with our plugins for use in your game development projects.
 * By using our plugins, you agree to the following terms:
 *
 * Credits & Terms of Usage:
 * • Our plugins can be used in both free and commercial games.
 *   There are no restrictions on the themes of your projects.
 *   If you do use this plugin in your project, 
 *   please give credit to "AWCE Gaming" and "HAKUBOX"
 * • You must not distribute this material as it is.
 * • You must have legally owned an 'RPG Maker MV' or'RPG Maker MZ'license.
 * • You can retouch this plugin for use. 
 *   And distribute them with credit to "AWCE Gaming" and "HAKUBOX"
 * 
 * By using our plugins, you acknowledge and agree to these terms.
 * We hope you find our plugins valuable for your game development endeavors.
 * If you have any questions or need further clarification,
 * feel free to reach out to us at hakubox＠outlook.com.
 * 
 * 
 * ■ [ Revision History ] .......................................................
 * 
 * v1.0.0  2025/01/11  Initial release.
 * v1.1.0  2025/01/20  Added functionality to draw images at any angle.
 * v1.2.0  2025/01/25  Added title menu adjustment functionality and volume initialization adjustment functionality.
 * 
 * 
 * @command changeCgMode
 * @text 切换对话框到CG模式
 * @desc 切换对话框到CG模式
 * 
 * @arg isCgMode
 * @text 是否为CG模式
 * @desc 是否为CG模式
 * @type boolean
 * @default true
 * 
 * 
 * 
 * @param initVariables
 * @parent general
 * @text Initialize Variables Table
 * @desc Initialize variables table
 * @type struct<InitVariable>[]
 * @default []
 * 
 * @param initSwitchs
 * @parent general
 * @text Initialize Switches Table
 * @desc Initialize switches table
 * @type struct<InitSwitch>[]
 * @default []
 * 
 * @param cacheImgs
 * @parent general
 * @text Cache Image List
 * @desc Cache image list, separate images with new lines. Note that you need to adjust the cacheLimit in the Community_Basic plugin to an appropriate size.
 * @type note
 * 
 * @param titleMenu
 * @parent general
 * @text ———— Title Menu ————
 * 
 * @param titleMenuX
 * @parent titleMenu
 * @text Menu X Coordinate
 * @desc Menu X coordinate, defaults to center if not set
 * @type number
 * 
 * @param titleMenuY
 * @parent titleMenu
 * @text Menu Y Coordinate
 * @desc Menu Y coordinate, defaults to center if not set
 * @type number
 * 
 * @param titleMenuWidth
 * @parent titleMenu
 * @text Menu Width
 * @desc Menu width
 * @type number
 * @default 240
 * @min 100
 * @max 1000
 * 
 * @param titleMenuAlign
 * @parent titleMenu
 * @text Text Alignment
 * @desc Alignment of menu text
 * @type select
 * @option Left Align
 * @value left
 * @option Center Align
 * @value center
 * @option Right Align
 * @value right
 * @default left
 * 
 * @param volume
 * @parent general
 * @text ——— Volume Adjustment ———
 * 
 * @param volumeBgm
 * @parent volume
 * @text BGM Volume
 * @desc Set the default volume for BGM
 * @type number
 * @min 0
 * @max 100
 * @default 80
 * 
 * @param volumeBgs
 * @parent volume
 * @text BGS Volume
 * @desc Set the default volume for BGS
 * @type number
 * @min 0
 * @max 100
 * @default 80
 * 
 * @param volumeMe
 * @parent volume
 * @text ME Volume
 * @desc Set the default volume for ME
 * @type number
 * @min 0
 * @max 100
 * @default 80
 * 
 * @param volumeSe
 * @parent volume
 * @text SE Volume
 * @desc Set the default volume for SE
 * @type number
 * @min 0
 * @max 100
 * @default 80
 */
/*~struct~InitVariable:en
 *
 * @param variable
 * @text Variable
 * @desc Variable for initialization
 * @type variable
 * 
 * @param value
 * @text Value
 * @desc Value
 * @type text
 * 
 * @param remark
 * @text Remark
 * @desc Remark
 * @type note
 */
/*~struct~InitSwitch:en
 *
 * @param switch
 * @text Switch
 * @desc Switch for initialization
 * @type switch
 * 
 * @param value
 * @text State
 * @desc Switch state
 * @on On
 * @off Off
 * @type boolean
 * 
 * @param remark
 * @text Remark
 * @desc Remark
 * @type note
 */

/*:ja
 * @plugindesc Hakuboxツールプラグイン (v1.2.0)
 * @version 1.2.0
 * @author hakubox
 * @email hakubox@outlook.com
 * @target MV MZ
 *
 * @help
 * Hakuboxのツールプラグインで、プラグインの任意の位置に配置できます。
 * 
 * 現在、このプラグインは以下の機能を提供しています：
 * 
 * 1. 変数の初期化
 * 2. スイッチの初期化
 * 3. 画像リストのキャッシュ
 * 4. BGM/BGS/ME/SEのデフォルトボリュームを調整します
 * 5. タイトル画面のメニューのスタイルを調整できます
 * 6. 任意の角度の画像を描画し、Spriteオブジェクトを返す
 * 
 * 
 * ■ [ 使用可能なスクリプトリスト ] .............................................
 * 以下は現在のプラグインが提供するスクリプトコードです。
 * 
 * 〇 矢印画像を表示し、Spriteオブジェクトを返します。
 * HakuboxUtils.showArrow(imgPath, startX, startY, endX, endY)
 *   - imgPath {string} 画像パス
 *   - startX {number} 矢印開始座標X
 *   - startY {number} 矢印開始座標Y
 *   - endX {number} 矢印終了座標X
 *   - endY {number} 矢印終了座標Y
 * コード例: 
 * const arrow = HakuboxUtils.showArrow('img/system/arrow', 200, 200, 250, 400);
 * SceneManager._scene.addChild(arrow);
 * 
 * 
 * ■ [ 連絡先 ] ........................................................
 * 
 * メール：hakubox＠outlook.com  （＠を半角文字に手動で置き換えてください）
 * 
 * 
 * ■ [ ライセンス ] ........................................................
 * 
 * AWCE Gaming クレーター（「私たち」、「私たち」、または「当社」）は、
 * あなたがゲーム開発プロジェクトで私たちのプラグインを使用するのを喜んで提供します。
 * 私たちのプラグインを使用することにより、あなたは以下の条件に同意します：
 * 
 * クレジットおよび使用条件：
 *   • 私たちのプラグインは無料ゲームおよび商業ゲームの両方で使用できます。プロジェクトのテーマには制限はありません。
 *     プロジェクトでこのプラグインを使用する場合は、「AWCE Gaming」および「HAKUBOX」にクレジットを記載してください。
 *   • この素材は原状で分发する必要があります。
 *   • あなたは「RPG Maker MV」または「RPG Maker MZ」のライセンスを法的に所有している必要があります。
 *   • このプラグインは使用のためにリタッチ（修正）できます。
 *     分配する場合は「AWCE Gaming」および「HAKUBOX」にクレジットを記載してください。
 * 
 * 私たちのプラグインを使用することにより、あなたはこれらの条件を確認し同意します。
 * 私たちは私たちのプラグインがあなたのゲーム開発に価値があることを願っています。
 * 何か質問やさらなる説明が必要な場合は、hakubox＠outlook.comまでお気軽にご連絡ください。
 * 
 * 
 * ■ [ リビジョン履歴 ] ........................................................
 * 
 * v1.0.0  2025/01/11  最初のリリース。
 * v1.1.0  2025/01/20  任意の角度の画像を描画する機能を追加。
 * v1.2.0  2025/01/25  タイトルメニュー調整機能と音量初期化調整機能を追加。
 * 
 * 
 * @param initVariables
 * @parent general
 * @text 変数初期化テーブル
 * @desc 変数初期化テーブル
 * @type struct<InitVariable>[]
 * @default []
 * 
 * @param initSwitchs
 * @parent general
 * @text スイッチ初期化テーブル
 * @desc スイッチ初期化テーブル
 * @type struct<InitSwitch>[]
 * @default []
 * 
 * @param cacheImgs
 * @parent general
 * @text キャッシュ画像リスト
 * @desc キャッシュ画像リスト。画像間は改行で区切ります。Community_BasicプラグインのcacheLimitを適切なサイズに調整することに注意してください。
 * @type note
 * 
 * @param titleMenu
 * @parent general
 * @text ———— タイトルメニュー ————
 * 
 * @param titleMenuX
 * @parent titleMenu
 * @text メニューX座標
 * @desc メニューX座標。設定しない場合は中央に配置されます。
 * @type number
 * 
 * @param titleMenuY
 * @parent titleMenu
 * @text メニューY座標
 * @desc メニューY座標。設定しない場合は中央に配置されます。
 * @type number
 * 
 * @param titleMenuWidth
 * @parent titleMenu
 * @text メニュー幅
 * @desc メニュー幅
 * @type number
 * @default 240
 * @min 100
 * @max 1000
 * 
 * @param titleMenuAlign
 * @parent titleMenu
 * @text テキストの配置
 * @desc メニューのテキストの配置
 * @type select
 * @option 左寄せ
 * @value left
 * @option 中央寄せ
 * @value center
 * @option 右寄せ
 * @value right
 * @default left
 * 
 * @param volume
 * @parent general
 * @text ———— 音量調整 ————
 * 
 * @param volumeBgm
 * @parent volume
 * @text BGM音量
 * @desc BGMのデフォルトボリュームを設定します。
 * @type number
 * @min 0
 * @max 100
 * @default 80
 * 
 * @param volumeBgs
 * @parent volume
 * @text BGS音量
 * @desc BGSのデフォルトボリュームを設定します。
 * @type number
 * @min 0
 * @max 100
 * @default 80
 * 
 * @param volumeMe
 * @parent volume
 * @text ME音量
 * @desc MEのデフォルトボリュームを設定します。
 * @type number
 * @min 0
 * @max 100
 * @default 80
 * 
 * @param volumeSe
 * @parent volume
 * @text SE音量
 * @desc SEのデフォルトボリュームを設定します。
 * @type number
 * @min 0
 * @max 100
 * @default 80
 */
/*~struct~InitVariable:ja
 *
 * @param variable
 * @text 変数
 * @desc 初期化に使用する変数
 * @type variable
 * 
 * @param value
 * @text 値
 * @desc 値
 * @type text
 * 
 * @param remark
 * @text 備考
 * @desc 備考
 * @type note
 */
/*~struct~InitSwitch:ja
 *
 * @param switch
 * @text スイッチ
 * @desc 初期化に使用するスイッチ
 * @type switch
 * 
 * @param value
 * @text 状態
 * @desc スイッチ状態
 * @on ON
 * @off OFF
 * @type boolean
 * 
 * @param remark
 * @text 備考
 * @desc 備考
 * @type note
 */
// #endregion
(() => {

  const PluginName = document.currentScript ? decodeURIComponent(document.currentScript.src.match(/^.*\/(.+)\.js$/)[1]) : "Hakubox_Utils";

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
    initVariables: [],
    initSwitchs: []
  };
  // #endregion

  const params = PluginParamsParser.parse(PluginManager.parameters(PluginName), typeDefine);

  // #region 初始化参数
  const Scene_Map_create = Scene_Map.prototype.create;
  Scene_Map.prototype.create = function () {
    Scene_Map_create.call(this);

    // 初始化变量表
    if ($gameVariables && params.initVariables && params.initVariables.length) {
      for (let i = 0; i < params.initVariables.length; i++) {
        const item = params.initVariables[i];
        if ($gameVariables._data[item.variable] == undefined) {
          $gameVariables.setValue(item.variable, item.value);
        }
      }
    }

    // 初始化开关表
    if ($gameSwitches && params.initSwitchs && params.initSwitchs.length) {
      for (let i = 0; i < params.initSwitchs.length; i++) {
        const item = params.initSwitchs[i];
        if ($gameSwitches._data[item.switch] == undefined) {
          $gameSwitches.setValue(item.switch, item.value);
        }
      }
    }
  };
  // #endregion


  // #region 标题菜单相关

  Window_TitleCommand.prototype.updatePlacement = function () {
    this.x = params.titleMenuX || (Graphics.boxWidth - this.width) / 2;
    this.y = params.titleMenuY || Graphics.boxHeight - this.height - 96;
  };

  Window_TitleCommand.prototype.itemTextAlign = function () {
    return params.titleMenuAlign || 'left';
  };

  Window_TitleCommand.prototype.windowWidth = function () {
    return params.titleMenuWidth || 240;
  };

  // #endregion


  // #region 音量相关

  ConfigManager.bgmVolume = params.volumeBgm || 100;
  ConfigManager.bgsVolume = params.volumeBgs || 100;
  ConfigManager.meVolume = params.volumeMe || 100;
  ConfigManager.seVolume = params.volumeSe || 100;

  // #endregion


  // #region 图片缓存相关
  const Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
  Scene_Map.prototype.onMapLoaded = function () {
    Scene_Map_onMapLoaded.apply(this, arguments);

    // 缓存图片列表
    const _cacheImgs = [];
    const _imgCacheList = HakuboxUtils.transformNote(params.cacheImgs).split('\n');
    for (let i = 0; i < _imgCacheList.length; i++) {
      const cache = _imgCacheList[i];
      if (!cache) continue;
      _cacheImgs.push(cache);
    }

    for (let i = 0; i < _cacheImgs.length; i++) {
      const img = _cacheImgs[i];
      if (img.indexOf("img/") === 0) {
        ImageManager.loadBitmap(img.substring(0, img.lastIndexOf("/") + 1), img.substring(img.lastIndexOf("/") + 1), 0, true);
      } else if (img.indexOf("pictures/") === 0) {
        ImageManager.loadBitmap("img/", img, 0, true);
      } else {
        ImageManager.loadBitmap("img/pictures/", img, 0, true);
      }
    }
  };
  // #endregion

  
  // #region 工具类
  /** 工具类 */
  class HakuboxUtils {
    /**
     * 转换note参数到multiline_string参数类型
     * @param {string} str note参数
     */
    static transformNote(str) {
      if (!str) return '';
      let reStr = str.replace(/\\n/g, "\n").replace(/\\"/g, '"');
      if (reStr[0] === '"' || reStr[reStr.length - 1] === '"') {
        reStr = reStr.substring(1, reStr.length - 1);
      }
      return reStr;
    }
    /**
     * 切换到CG模式
     * @param {boolean} isCgMode 是否CG模式
     */
    static changeCgMode(isCgMode = true) {
      if (isCgMode) {
        SceneManager._scene._messageWindow.x = (Graphics.width - Graphics.boxWidth) / 2;
      } else {
        SceneManager._scene._messageWindow.x = 0;
      }
    }
    /**
     * 显示箭头图像。
     * @param {string} imgPath 图片地址
     * @param {number} startX 箭头开始坐标X
     * @param {number} startY 箭头开始坐标Y
     * @param {number} endX 箭头结束坐标X
     * @param {number} endY 箭头结束坐标Y
     */
    static showArrow(imgPath, startX, startY, endX, endY) {
      const _fileNameIndex = imgPath.lastIndexOf('/');
      const _folder = imgPath.substring(0, _fileNameIndex + 1);
      const _fileName = imgPath.substring(_fileNameIndex + 1);

      // 计算箭头的长度
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const height = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // 计算箭头的角度
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

      const _sprite = new Sprite();
      _sprite.anchor.x = 0.5;
      _sprite.anchor.y = 0;
      _sprite.x = startX;
      _sprite.y = startY;
      _sprite.rotation = angle - 90;

      const _originBitmap = ImageManager.loadBitmap(_folder, _fileName);
      _originBitmap.addLoadListener(() => {
        const _scale = height / _originBitmap.height;

        const _bitmap = new Bitmap(_originBitmap.width * _scale, height);
        _bitmap.blt(_originBitmap,
          0, 0, _originBitmap.width, _originBitmap.height,
          0, 0, _originBitmap.width * _scale, height
        );
        _sprite.bitmap = _bitmap;
      });

      return _sprite;
    }
  }
  window.HakuboxUtils = HakuboxUtils;
  // #endregion

  
  PluginManager.registerCommand(PluginName, "changeCgMode", args => {
    const isCgMode = args.isCgMode === "true";
    HakuboxUtils.changeCgMode(isCgMode);
  });
})();