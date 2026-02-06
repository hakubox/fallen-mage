//=============================================================================
//  Keke_FreeCamera - フリーカメラ
// バージョン: 1.5.2
//=============================================================================
// Copyright (c) 2022 ケケー
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @target MZ
 * @plugindesc 【v1.5.2】自由相机镜头系统 (汉化修正+立绘修复版)
 * @author KeKe
 * @url http://kekeelabo.com
 * 
 * @help
 * ============================================================================
 * ■ 自由相机系统 (Keke_FreeCamera) - 汉化修正版
 * ============================================================================
 * 这是一个功能强大的镜头控制插件。支持缩放、镜头平移、焦点跟随、滑动拖拽等功能。
 * 
 * 【特色功能】
 * 1. 灵活运镜：平滑的移动、缩放，支持跟随玩家、事件或指定坐标。
 * 2. 状态保持：切换地图、战斗或读档后，镜头状态不会丢失。
 * 3. 缩放保护：即“缩放排除”，可以让指定的角色（如Q版小人）在镜头拉远时
 *    保持原大小，不随地图一起变小。
 * 4. [新增] 立绘固定：专门修复第三方立绘插件（NPC/Spine）被错误缩放的问题。
 *
 * ----------------------------------------------------------------------------
 * ■ 基础用法指南
 * ----------------------------------------------------------------------------
 *
 * 【1. 插件指令：相机操作】
 *    这是最常用的功能。你可以设置：
 *    - 焦点目标：镜头看谁（玩家、事件、或具体坐标）。
 *    - 缩放倍率：镜头拉近(>1) 或 拉远(<1)。
 *    - 偏移量(X/Y)：镜头中心相对于目标的偏移。
 *    - 动画时间：运镜需要多少帧完成。
 *    
 *    * 提示：所有数值变化都支持“缓动效果”（见下文）。
 *
 * 【2. 插件指令：缩放排除 (防缩小)】
 *    当你把镜头拉远（Zoom < 1.0）查看全图时，角色也会变得很小看不清。
 *    使用此功能，可以让指定角色保持原始大小。
 *    - 设置为 2，代表镜头缩小时，该角色显示为原本的 2 倍大。
 *
 * 【3. 对话中的运镜控制 (文本代码)】
 *    你可以在对话窗口的文本中直接控制镜头：
 *    格式：\cm[目标, 时间, 缩放, 偏移X, 偏移Y]
 *    示例：\cm[1, 60, 2]  -> 1秒内，镜头拉近2倍，聚焦到1号事件。
 *    * "cm" 这个关键字可以在参数里修改。
 *    * 目标设为 0 代表本事件，-1 代表玩家。
 *
 * 【4. 鼠标/触摸滑动模式】
 *    类似手机地图的拖拽浏览功能。
 *    - 使用“启动滑动模式”指令开启。
 *    - 玩家可以按住鼠标左键或触摸屏幕拖动地图。
 *    - 记得在剧情开始前使用“结束滑动模式”关闭它，并使用“重置相机”归位。
 *
 * ----------------------------------------------------------------------------
 * ■ [高级] 动画缓动代码 (Motion Easing)
 * ----------------------------------------------------------------------------
 * 在设置“缩放倍率”或“偏移量”时，可以在数字后面加上以下代码，
 * 来实现特殊且平滑的运镜效果：
 *
 * [基础]
 *  (空) : 缓入缓出 (开始慢，中间快，结束慢)。最自然的效果。
 *  e    : 同上 (标准模式)。
 *  ei   : 缓入 (加速启动)。
 *  eo   : 缓出 (减速停止)。
 *
 * [特效]
 *  tn   : 往返 (Turn)。移动过去，再移回来。
 *  cg   : 蓄力 (Charge)。先向反方向退一点，然后猛冲过去。
 *         写法：100cg(0.5) 表示退回幅度的倍率。
 *  fk   : 惯性 (Hook)。冲过头一点，再弹回来。
 *  rd   : 绕圈 (Round)。画圆移动。
 *  bk   : 撤退 (Back)。单纯的移回来。
 *
 * [循环]
 *  _数字 : 重复次数。例如 "_2" 代表动作重复做2次。
 * 
 * ★ 举例：
 *  缩放倍率填：2tn   -> 镜头放大到2倍，然后马上缩回去。
 *  偏移X填：100fk -> 镜头向右快速移到100的位置，稍微冲过头一点再停下。
 *
 * ----------------------------------------------------------------------------
 * ■ 目标指定方法 (通用)
 * ----------------------------------------------------------------------------
 * 1. 按名字：直接输入事件的名字（如果名字重复，针对ID较小的那个）。
 *    - 玩家     => 输入 "玩家" 或 "player" (不区分大小写)
 *    - 本事件   => 输入 "event" 或 "self"
 *    - 队友     => 输入 "follower1" (第1个队友)
 *    - 载具     => 输入 "boat", "ship", "airship"
 *
 * 2. 按 ID (更准确)：
 *    1 ~ 999 : 对应ID的地图事件
 *    -1      : 玩家
 *    0       : 本事件 (执行指令的事件)
 *    -11     : 第1个跟随的队友 (-12是第2个，以此类推)
 *
 * ============================================================================
 * 
 * @param ---基础设置---
 *
 * @param 基本ズーム率
 * @text [全局] 基础缩放倍率
 * @desc 游戏的默认缩放比例。1 为标准大小。
 * @default 1
 *
 * @param ピクチャ画面固定
 * @text [全局] 修复图片层缩放
 * @desc 开启后，"显示图片"指令的图片将固定在屏幕上，不会随镜头缩放。(标准推荐: true)
 * @type boolean
 * @default true
 *
 * @param 場所移動でカメラ初期化
 * @text [全局] 换图时重置镜头
 * @desc 切换地图时，是否自动将镜头恢复默认状态。(标准推荐: true)
 * @type boolean
 * @default true
 *
 * @param カメラ制御文字
 * @text 文本控制指令
 * @desc 在对话框中使用的指令头。若设为 cm，则使用 \cm[...]
 * @default cm
 * 
 * @param ---高级配置---
 * 
 * @param FixedContainerList
 * @text [新增] 画面固定容器列表
 * @desc 【重要】在此处填写JS表达式。这些容器（如立绘）将忽略镜头缩放，强制固定在屏幕上。
 * @type string[]
 * @default ["this._tachieContainer", "SceneManager._scene._spineBaseContainer"]
 *
 *
 *
 * @command カメラ操作
 * @text 相机操作 (主要)
 * @desc 这一条指令可以完成绝大多数的运镜需求（缩放、移动、跟随）。
 *
 * @arg 開始時に適用
 * @text [自动] 场景开始时执行
 * @desc 开启后，进入地图时会自动执行此运镜，无需事件触发。
 * @type boolean
 * @default false
 *
 * @arg 注視キャラ-名前
 * @text 焦点目标 - 按名字
 * @desc 输入 "玩家"、"本事件" 或地图事件的具体名字。
 *
 * @arg 注視キャラ-ID
 * @text 焦点目标 - 按ID
 * @desc 优先于名字。-1:玩家, 0:本事件, 1~:对应事件ID。
 *
 * @arg 動作時間
 * @text 动画时间 (帧)
 * @desc 运镜完成所需时间。60帧 = 1秒。输入 0 则瞬间完成。
 * @default 60
 *
 * @arg ズーム倍率
 * @text 缩放倍率
 * @desc 目标缩放值。2=放大2倍(特写)，0.5=缩小一半(广角)。留空则保持当前。可加缓动代码(如 2tn)。
 *
 * @arg ずらしX
 * @text 画面偏移 X
 * @desc 镜头中心向右偏离目标的像素量。负数向左。
 *  
 * @arg ずらしY
 * @text 画面偏移 Y
 * @desc 镜头中心向下偏离目标的像素量。负数向上。
 *
 *
 *
 * @command ズーム除外
 * @text 缩放排除 (角色防缩小)
 * @desc 指定某些角色在镜头拉远时，保持原样或按特定比例显示。
 *
 * @arg 開始時に適用
 * @text [自动] 场景开始时执行
 * @desc 进入地图时自动应用此设置。
 * @type boolean
 * @default false
 *
 * @arg 対象キャラ-名前
 * @text 目标角色 - 按名字
 * @desc "玩家", "全部"(所有角色), 或事件名。用逗号分隔多个。
 *
 * @arg 対象キャラ-ID
 * @text 目标角色 - 按ID
 * @desc -1:玩家, -2:全部, 1~:事件ID。用波浪号指定范围 (如 1~5)。
 *
 * @arg 除外時拡大率
 * @text [可选] 修正后倍率
 * @desc 当镜头缩小时，强制将角色设为该倍率。留空则保持原大(1.0)。
 * @default 
 *
 * @arg 除外クリア
 * @text 清除所有排除
 * @desc 开启后，将清除之前设置的所有排除规则，所有角色恢复随镜头缩放。
 * @type boolean
 * @default false
 *
 *
 *
 * @command スワイプモード開始
 * @text 启动滑动拖拽模式
 * @desc 允许玩家用鼠标/触摸拖动地图画面。
 *
 * @arg タッチ時速度
 * @text 触摸灵敏度
 * @desc 手指滑动时的移动速度倍率。
 * @default 2
 *
 * @arg マウス時速度
 * @text 鼠标灵敏度
 * @desc 鼠标拖拽时的移动速度倍率。
 * @default 2
 *
 * @arg マウス時慣性時間
 * @text 惯性时间 (帧)
 * @desc 松开鼠标后，画面继续滑动的惯性时长。
 * @default 60
 *
 *
 *
 * @command スワイプモード終了
 * @text 结束滑动拖拽模式
 * @desc 禁止玩家拖动地图，恢复正常视角。
 *
 *
 *
 * @command カメラ位置戻す
 * @text 重置相机 (归位)
 * @desc 立即取消手动拖拽的偏移，将镜头中心瞬间拉回到焦点目标身上。
 */



(() => {
    //- プラグイン名
    const pluginName = document.currentScript.src.match(/^.*\/(.*).js$/)[1];



    //==================================================
    //--  パラメータ受け取り
    //==================================================

    const parameters = PluginManager.parameters(pluginName);

    const keke_zoomScaleBase = Number(parameters["基本ズーム率"]);
    const keke_pictureScreenFix = eval(parameters["ピクチャ画面固定"]);
    const keke_initCameraInLocate = eval(parameters["場所移動でカメラ初期化"]);
    const keke_controlCharCamera = parameters["カメラ制御文字"] ? parameters["カメラ制御文字"].toUpperCase() : "";

    const keke_fixedContainerList = JSON.parse(parameters["FixedContainerList"] || '[]');



    //==================================================
    //--  プラグインコマンド
    //==================================================

    //- カメラ操作
    PluginManager.registerCommand(pluginName, "カメラ操作", args => {
        const self = getPlcmEvent();
        // 注視対象を取得
        const names = convertVariable(args["注視キャラ-名前"]);
        const ids = convertVariable(args["注視キャラ-ID"]);
        let chara = [...getCharasByName(names, self), ...getCharasById(ids, self)][0];
        if (!chara && (args["注視マップX"] || args["注視マップY"])) {
            chara = { _realX: args["注視地点X"] || 0, _realY: args["注視地点Y"] || 0 }
        }
        // ズームの呼び出し
        $gameTemp.callZoomKe(chara, args["動作時間"], args["ズーム倍率"], args["ずらしX"], args["ずらしY"], plcmPreter);
    });


    //- ズーム除外
    PluginManager.registerCommand(pluginName, "ズーム除外", args => {
        if (eval(args["クリア"])) {
            getAllCharacter.forEach(chara => {
                if (!chara) { return; }
                chara._zoomNoKe = null;
                chara._zoomNoScaleKe = null;
            });
        }
        const self = getPlcmEvent();
        // 除外対象を取得
        const names = convertVariable(args["対象キャラ-名前"]);
        const ids = convertVariable(args["対象キャラ-ID"]);
        const charas = [...getCharasByName(names, self), ...getCharasById(ids, self)];
        // ズーム除外を設定
        charas.forEach(chara => {
            if (!chara) { return; }
            chara._zoomNoKe = args["除外時拡大率"] ? calcMulti(chara._zoomNoKe || 1, args["除外時拡大率"])[0].val : chara._zoomNoKe || 1;
        });
    });


    //- スワイプモード開始
    PluginManager.registerCommand(pluginName, "スワイプモード開始", args => {
        // スワイプモードの開始
        startSwipeMode(args);
    });


    //- スワイプモード終了
    PluginManager.registerCommand(pluginName, "スワイプモード終了", args => {
        // スワイプモードの終了
        endSwipeMode();
    });


    //- カメラ位置戻す
    PluginManager.registerCommand(pluginName, "カメラ位置戻す", args => {
        // カメラの位置戻し
        cameraPosBack();
    });



    //==================================================
    //--  共通開始
    //==================================================

    //- スプライトセット・マップ開始(コア追加)
    const _Spriteset_Map_initialize = Spriteset_Map.prototype.initialize;
    Spriteset_Map.prototype.initialize = function () {
        // カメラのロード
        loadCamera();
        _Spriteset_Map_initialize.call(this);
    };


    //- シーンマップ・スタート(コア追加)
    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        _Scene_Map_start.apply(this);
        // カメラの再開
        restartCamera();
    };


    //- ゲームマップ・セットアップ(コア追加)
    const _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function (mapId) {
        // カメラの初期化
        initCamera();
        _Game_Map_setup.apply(this, arguments);
    };


    //- スプライトキャラクター(コア追加)
    let charaSpritePlcm = null;
    const _Sprite_Character_initialize = Sprite_Character.prototype.initialize;
    Sprite_Character.prototype.initialize = function (character) {
        _Sprite_Character_initialize.call(this, character);
        // 開始時プラグインコマンドの実行
        if (character._eventId && !character._pcStartedKeFrcm && character._pageIndex >= 0) {
            charaSpritePlcm = this;
            runPluginCmdStarting(character.list(), [/ズーム除外/, /カメラ操作/], "開始時に適用");
            charaSpritePlcm = null;
            character._pcStartedKeFrcm = true;
        }
    };



    //==================================================
    //--  共通更新
    //==================================================

    //- スプライトキャラクター更新(コア追加)
    const _Sprite_Character_update = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function () {
        _Sprite_Character_update.apply(this);
        // ズーム除外の更新
        updateZoomNo(this);
    };


    //- スプライトセット・マップ
    const _Spriteset_Map_update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function () {
        _Spriteset_Map_update.call(this);
        // [新增] 更新画面固定容器 (立绘修复)
        updateFixedContainersKe(this);
        // スワイプモードの更新
        updateSwipeMode()
    };

    // [新增] 核心修复函数：反向缩放容器
    function updateFixedContainersKe(spriteset) {
        if (!keke_fixedContainerList || !keke_fixedContainerList.length) return;

        const gs = $gameScreen;
        const scale = gs.zoomScale(); // 当前镜头缩放倍率
        // 遍历参数中配置的所有表达式
        keke_fixedContainerList.forEach(code => {
            try {
                // 在 spriteset 的上下文中执行表达式 (这样可以用 this 访问 spriteset 内部变量)
                const container = function () { return eval(code); }.call(spriteset);

                if (container && container.transform) {
                    if (scale === 1.0) {
                        // 镜头未缩放时，强制归零，防止漂移
                        container.scale.x = 1.0;
                        container.scale.y = 1.0;
                        container.x = 0;
                        container.y = 0;
                    } else {
                        // 1. 反向缩放 (地图变大，立绘就变小)
                        const rate = 1.0 / scale;
                        container.scale.x = rate;
                        container.scale.y = rate;

                        // 2. 反向位移 (抵消地图的偏移)
                        // 公式：(目标位置0 - 镜头中心) * (缩放比率 - 1)
                        container.x = (0 - gs.zoomX()) * (rate - 1);
                        container.y = (0 - gs.zoomY()) * (rate - 1);
                    }
                }
            } catch (e) {
                // 防止填错表达式导致游戏报错崩溃，静默失败即可
            }
        });
    }

    //==================================================
    //--  ズームの実行
    //==================================================

    let noZoomSave = false;
    let doScaleLoop = false;
    let doXLoop = false;
    let doYLoop = false;

    //- カメラの初期化
    function initCamera() {
        if (keke_initCameraInLocate) { $gameMap._zoomInitedKe = false; }
        // 注視の初期化
        initFocus();
        if ($gameMap._zoomInitedKe) { return; }
        // カメラパラムのセット
        setCameraParam($gamePlayer, keke_zoomScaleBase.toString(), "0", "0");
        // ズームの起動
        runZoom();
        $gameMap._zoomInitedKe = true;
    };


    //- 注視の初期化
    function initFocus() {
        const p = getCameraParam();
        if (!p) { return; }
        p.chara = $gamePlayer;
        p.preChara = null;
    };


    //- ズームの呼び出し(公開)
    Game_Temp.prototype.callZoomKe = function (chara, duration, scale, offsetX, offsetY, preter) {
        // ズームの終了
        finishZoom();
        // カメラパラムのセット
        setCameraParam(chara, scale, offsetX, offsetY, duration, preter);
        // ズームの起動
        runZoom();
    };


    //- ズームの終了
    function finishZoom() {
        const p = getCameraParam();
        if (!p || !p.duration) { return; }
        const gs = $gameScreen;
        p.duration = 0;
        p.scaleDuration = 0;
        p.xDuration = 0;
        p.yDuration = 0;
        gs._zoomScale = p.scaleEasing.match(/tn|rd|bk/i) ? p.scaleStart : p.scaleTarget;
        p.x = p.xEasing.match(/tn|rd|bk/i) ? (p.xStart != null ? p.xStart : p.xTarget) : p.xTarget;
        p.y = p.yEasing.match(/tn|rd|bk/i) ? (p.yStart != null ? p.yStart : p.yTarget) : p.yTarget;
        p.allNum = 0;
        // カメラ変更の更新
        updateCameraChange(true);
    };


    //- カメラパラムのセット
    function setCameraParam(chara, scale, x, y, duration, preter) {
        const gs = $gameScreen;
        if (!gs._zoomParamKe) { gs._zoomParamKe = {}; }
        const p = gs._zoomParamKe;
        // 注視キャラ
        const preChara = p.chara || $gamePlayer;
        p.chara = chara || preChara;
        p.preChara = !isSameChara(preChara, p.chara) ? preChara : null;
        p.transX = null;
        p.transY = null;
        // 時間
        duration = duration || "0";
        let match = duration.match(/_(\-?\d+)/);
        p.allNum = match ? Number(match[1]) : 1;
        p.allNum = p.allNum <= 0 ? -1 : p.allNum;
        p.timeMax = makeTime(duration);
        p.duration = p.timeMax;
        // 動作中ウェイト
        if (duration.match(/w/i) && p.timeMax > 0) { preter.wait(p.timeMax); }
        // 拡大率
        const bs = keke_zoomScaleBase;
        const preScale = gs.zoomScale() || 1;
        let r = scale ? calcMulti(p.scale || bs, scale)[0] : { val: p.scale || bs };
        scale = r.val;
        p.scaleEasing = r.easing || "E";
        p.scaleEasingRate = r.easingRate || 1;
        p.scaleNum = r.num || 1;
        p.scaleTimeMax = p.duration / (p.scaleNum <= 0 ? 1 : p.scaleNum);
        p.scaleDuration = p.scaleTimeMax;
        p.scale = duration ? preScale : scale || p.scale || bs;
        p.scaleTarget = scale || preScale || bs;
        p.scaleStart = preScale != p.scaleTarget ? preScale : null;
        // ずらしX
        p.x = !p.x ? 0 : p.x;
        const preX = p.x || 0;
        r = x ? calcMulti(preX, x, null, [])[0] : { val: preX };
        p.xEasing = r.easing || "E";
        p.xEasingRate = r.easingRate || 1;
        p.xNum = r.num || 1;
        p.xTimeMax = p.duration / (p.xNum <= 0 ? 1 : p.xNum);
        p.xDuration = p.xTimeMax;
        p.xTarget = r.val;
        p.xStart = preX != p.xTarget ? preX : null;
        // ずらしY
        p.y = !p.y ? 0 : p.y;
        const preY = p.y || 0;
        r = y ? calcMulti(preY, y, null, [])[0] : { val: preY };
        p.yEasing = r.easing || "E";
        p.yEasingRate = r.easingRate || 1;
        p.yNum = r.num || 1;
        p.yTimeMax = p.duration / (p.yNum <= 0 ? 1 : p.yNum)
        p.yDuration = p.yTimeMax;
        p.yTarget = r.val;
        p.yStart = preY != p.yTarget ? preY : null;
        // スワイプ
        p.swipedX = 0;
        p.swipedY = 0;
    };


    //- カメラパラムの取得
    function getCameraParam() {
        return $gameScreen._zoomParamKe;
    };


    //- ズームの起動
    function runZoom() {
        const p = getCameraParam();
        if (!p) { return; }
        // 少しずつズーム
        if (p.duration) {
            $gameScreen.startZoom(0, 0, p.scaleTarget, p.duration);
            // 即ズーム
        } else {
            $gameScreen.setZoom(0, 0, p.scaleTarget);
            setCameraOffset(p.xTarget, p.yTarget);
            // カメラ変更の更新
            updateCameraChange(true);
        }
    };


    //- カメラずらしのセット
    function setCameraOffset(x, y) {
        const p = getCameraParam();
        p.x = x;
        p.y = y;
    };


    //- ズームのセット(コア追加)
    const _Game_Screen_setZoom = Game_Screen.prototype.setZoom;
    Game_Screen.prototype.setZoom = function (x, y, scale) {
        _Game_Screen_setZoom.apply(this, arguments);
        // カメラ変更の更新
        updateCameraChange(true);
    };


    //- ズームの更新(コア追加)
    const _Game_Screen_updateZoom = Game_Screen.prototype.updateZoom;
    Game_Screen.prototype.updateZoom = function () {
        if (!this._zoomDuration) { return; }
        // ズームスケールの更新
        const did = updateZoomScale(this);
        // 通常の更新
        if (!did) { _Game_Screen_updateZoom.apply(this); }
        // カメラ変更の更新
        updateCameraChange();
    };


    //- カメラ変更の更新
    function updateCameraChange(force) {
        const p = getCameraParam();
        if (!force && (!p || !p.duration)) { return; }
        if (p.duration) { p.duration -= 1; }
        // ズームパラムの更新
        updateZoomParam(p);
        // 注視の更新
        updateFocus(p);
        // カメラずらしの更新
        updateCameraOffset(p);
        // マップの拡大
        scaleMap(p);
        // 遠景の拡大
        if (!$gameScreen._noZoomSaveKe) { scaleParallax(p); }
        // ループの処理
        processLoop(p);
    };


    //- ループの処理
    function processLoop(p) {
        const gs = $gameScreen;
        // 全体
        if (p.duration <= 0) {
            if (p.allNum > 0) { p.allNum--; }
            if (p.allNum) {
                $gameScreen._zoomDuration = p.timeMax;
                p.duration = p.timeMax;
            }
        }
        // 拡大率
        if (doScaleLoop) {
            p.scaleDuration = p.scaleTimeMax;
            gs._zoomScale = p.scaleStart;
            p.scale = p.scaleStart;
            doScaleLoop = false;
        }
        // Xずらし
        if (doXLoop) {
            p.xDuration = p.xTimeMax;
            p.x = p.xStart;
            doXLoop = false;
        }
        // Yずらし
        if (doYLoop) {
            p.yDuration = p.yTimeMax;
            p.y = p.yStart;
            doYLoop = false;
        }
    };


    //- ズームパラムの更新
    function updateZoomParam(p) {
        const saveNo = $gameScreen._noZoomSaveKe || SceneManager._scene.constructor.name != "Scene_Map";
        if (!saveNo) { p.scale = $gameScreen.zoomScale(); }
    };


    //- ズームスケールの更新
    function updateZoomScale(gs) {
        const p = getCameraParam();
        // スケールイージングの更新
        if (p && p.scaleStart != null && p.scaleEasing) {
            updateScaleEasing(gs, p);
            return true;
        }
        return false;
    };


    //- スケールイージングの更新
    function updateScaleEasing(gs, p) {
        if (gs._zoomDuration <= 0 || !p.scaleTimeMax) { return; }
        gs._zoomDuration--;
        p.scaleDuration--;
        gs._zoomScale = applyEasing(gs._zoomScale, p.scaleStart, gs._zoomScaleTarget, p.scaleDuration, p.scaleTimeMax, p.scaleEasing, p.scaleEasingRate);
        gs._zoomScale = Math.max(gs._zoomScale, 0.1);
        // 終了
        if (!p.scaleDuration) {
            gs._zoomScale = p.scaleEasing.match(/tn|rd|bk/i) ? p.scaleStart : p.scaleTarget;
            if (p.scaleNum > 0) { p.scaleNum--; }
            // 繰り返し処理
            if (p.scaleNum || (p.allNum - 1) != 0) {
                doScaleLoop = true;
            }
        }
    };


    //- 注視の更新
    function updateFocus(p) {
        // カメラずらし量
        const gm = $gameMap;
        const offsetX = p.x / gm.tileWidth();
        const offsetY = p.y / gm.tileHeight();
        // 移行注視
        if (p.preChara && p.timeMax) {
            transfarFocus(p, offsetX, offsetY);
            // 注視
        } else {
            const gm = $gameMap;
            p.chara.center(p.chara._realX + offsetX, p.chara._realY + offsetY);
        }
    };


    //- 移行注視
    function transfarFocus(p, offsetX, offsetY) {
        const cx = $gamePlayer.centerX();
        const cy = $gamePlayer.centerY();
        const newX = p.chara._realX - cx;
        const preX = p.preChara._realX - cx;
        const volX = preX - newX;
        p.transX = newX + (Math.sin(Math.PI * (p.duration / p.timeMax + 1.5)) * volX + volX) / 2;
        const newY = p.chara._realY - cy;
        const preY = p.preChara._realY - cy;
        const volY = preY - newY;
        p.transY = newY + (Math.sin(Math.PI * (p.duration / p.timeMax + 1.5)) * volY + volY) / 2;
        const gm = $gameMap;
        $gameMap.setDisplayPos(p.transX + offsetX, p.transY + offsetY);
    };


    //- カメラずらしの更新
    function updateCameraOffset(p) {
        if (!p || !p.timeMax) { return; }
        const gs = $gameScreen;
        // Xずらし
        if (p.xStart != null) {
            p.xDuration--;
            if (p.xEasing) {
                p.x = applyEasing(p.x, p.xStart, p.xTarget, p.xDuration, p.xTimeMax, p.xEasing, p.xEasingRate);
            } else {
                p.x = p.xStart + (p.xStart - p.x) * p.duration / p.timeMax;
            }
            // 終了
            if (!p.xDuration) {
                p.x = p.xEasing.match(/tn|rd|bk/i) ? (p.xStart != null ? p.xStart : p.xTarget) : p.xTarget;
                if (p.xNum > 0) { p.xNum--; }
                // 繰り返し処理
                if (p.xNum || (p.allNum - 1) != 0) {
                    doXLoop = true;
                }
            }
        }
        // Yずらし
        if (p.yStart != null) {
            p.yDuration--;
            if (p.yEasing) {
                p.y = applyEasing(p.y, p.yStart, p.yTarget, p.yDuration, p.yTimeMax, p.yEasing, p.yEasingRate);
            } else {
                p.y = p.yStart + (p.yStart - p.y) * p.duration / p.timeMax;
            }
            // 終了
            if (!p.yDuration) {
                p.y = p.yEasing.match(/tn|rd|bk/i) ? (p.yStart != null ? p.yStart : p.yTarget) : p.yTarget;
                if (p.yNum) { p.yNum--; }
                // 繰り返し処理
                if (p.yNum || (p.allNum - 1) != 0) {
                    doYLoop = true;
                }
            }
        }
    };



    //==================================================
    //--  各グラフィックのズーム対応
    //==================================================

    //- マップの拡大
    function scaleMap(p) {
        const spriteset = SceneManager._scene._spriteset;
        if (!spriteset || !spriteset._tilemap.parent) { return; }
        const scale = $gameScreen.zoomScale();
        spriteset._tilemap.width = Math.ceil((Graphics.width / scale) * 1) + spriteset._tilemap._margin * 2;
        spriteset._tilemap.height = Math.floor((Graphics.height / scale) * 1) + spriteset._tilemap._margin * 2;
        spriteset._tilemap.refresh();
    };


    //- 遠景の拡大
    function scaleParallax(p) {
        const spriteset = SceneManager._scene._spriteset;
        if (!spriteset || !spriteset._parallax) { return; }
        const scale = $gameScreen.zoomScale();
        spriteset._parallax.move(0, 0, Graphics.width / scale * 2, Graphics.height / scale * 2);
    };


    // Xずらし最大値
    function xOffsetMax(p) {
        return Math.max(Math.abs(p.xTarget || 0), Math.abs(p.x || 0), Math.abs(p.xStart || 0))
    };


    // Yずらし最大値
    function yOffsetMax(p) {
        return Math.max(Math.abs(p.yTarget || 0), Math.abs(p.y || 0), Math.abs(p.yStart || 0))
    };


    //- 画面タイル数のズーム対応(コア追加)
    const _Game_Map_screenTileX = Game_Map.prototype.screenTileX;
    Game_Map.prototype.screenTileX = function () {
        if ($gameScreen.zoomScale() != 1) {
            return Graphics.width / (this.tileWidth() * $gameScreen.zoomScale());
        }
        return _Game_Map_screenTileX.apply(this);
    };

    const _Game_Map_screenTileY = Game_Map.prototype.screenTileY;
    Game_Map.prototype.screenTileY = function () {
        if ($gameScreen.zoomScale() != 1) {
            return Graphics.height / (this.tileHeight() * $gameScreen.zoomScale());
        }
        return _Game_Map_screenTileY.apply(this);
    };


    //- 画面座標→マップ座標のズーム対応(コア追加)
    /*const _Game_Map_canvasToMapX = Game_Map.prototype.canvasToMapX;
    Game_Map.prototype.canvasToMapX = function (x) {
        if ($gameScreen.zoomScale() != 1) {
            const tileWidth = this.tileWidth() * $gameScreen.zoomScale();
            const originX = this._displayX * tileWidth;
            const mapX = Math.floor((originX + x) / tileWidth);
            console.log(this.roundX(mapX));
            return this.roundX(mapX);
        }
        return _Game_Map_canvasToMapX.apply(this, arguments);
    };
    
    const _Game_Map_canvasToMapY = Game_Map.prototype.canvasToMapY;
    Game_Map.prototype.canvasToMapY = function (y) {
        if ($gameScreen.zoomScale() != 1) {
            const tileHeight = this.tileHeight() * $gameScreen.zoomScale();
            const originY = this._displayY * tileHeight;
            const mapY = Math.floor((originY + y) / tileHeight);
            return this.roundY(mapY);
        }
        return _Game_Map_canvasToMapY.apply(this, arguments);
    };*/


    //- ゲームキャラクターのセンター化関数を追加
    Game_Character.prototype.centerX = function () {
        return ($gameMap.screenTileX() - 1) / 2.0;
    };

    Game_Character.prototype.centerY = function () {
        return ($gameMap.screenTileY() - 1) / 2.0;
    };

    Game_Character.prototype.center = function (x, y) {
        return $gameMap.setDisplayPos(x - this.centerX(), y - this.centerY());
    };


    //- 天候の拡大(コア再定義)
    Weather.prototype._rebornSprite = function (sprite) {
        const zoomScale = $gameScreen.zoomScale();
        sprite.ax = Math.randomInt(Graphics.width / zoomScale + 100) - 100 + this.origin.x;
        sprite.ay = Math.randomInt(Graphics.height / zoomScale + 200) - 200 + this.origin.y;
        sprite.opacity = 160 + Math.randomInt(60);
    };


    //- ピクチャの画面固定(コア追加)
    const _Sprite_Picture_updatePosition = Sprite_Picture.prototype.updatePosition;
    Sprite_Picture.prototype.updatePosition = function () {
        _Sprite_Picture_updatePosition.apply(this);
        // ズーム画面固定値の取得
        const zoomOffset = getZoomScreenFix(this);
        this.x += zoomOffset.x;
        this.y += zoomOffset.y;
    };

    const _Sprite_Picture_updateScale = Sprite_Picture.prototype.updateScale;
    Sprite_Picture.prototype.updateScale = function () {
        _Sprite_Picture_updateScale.apply(this);
        if (!keke_pictureScreenFix) { return; }
        const scale = $gameScreen.zoomScale();
        this.scale.x /= scale;
        this.scale.y /= scale;
    };


    //- ズーム画面固定値の取得
    function getZoomScreenFix(sprite) {
        const gs = $gameScreen;
        const p = gs._zoomParamKe;
        const rate = 1 / gs.zoomScale();
        const offsetX = (sprite.x - gs.zoomX()) * (rate - 1);
        const offsetY = (sprite.y - gs.zoomY()) * (rate - 1);
        return { x: offsetX, y: offsetY };
    };


    //- タイマーの画面固定(コア追加)
    const _Sprite_Timer_updatePosition = Sprite_Timer.prototype.updatePosition;
    Sprite_Timer.prototype.updatePosition = function () {
        _Sprite_Timer_updatePosition.apply(this);
        const scale = $gameScreen.zoomScale();
        this.x /= scale;
        this.y /= scale;
        this.scale.x = 1 / scale;
        this.scale.y = 1 / scale;
    };


    //- エンカウントエフェクト(コア再定義)
    Scene_Map.prototype.updateEncounterEffect = function () {
        if (this._encounterEffectDuration > 0) {
            if (this._encounterEffectDuration == this.encounterEffectSpeed()) { $gameScreen._noZoomSaveKe = true; }
            this._encounterEffectDuration--;
            const speed = this.encounterEffectSpeed();
            const n = speed - this._encounterEffectDuration;
            const p = n / speed;
            const q = ((p - 1) * 20 * p + 5) * p + 1;
            const pr = getCameraParam();
            const zoomX = pr ? pr.x : $gamePlayer.screenX();
            const zoomY = pr ? pr.y : $gamePlayer.screenY() - 24;
            const zoomScale = pr ? pr.scale : 1;
            if (n === 2) {
                $gameScreen.setZoom(zoomX, zoomY, zoomScale);
                this.snapForBattleBackground();
                this.startFlashForEncounter(speed / 2);
            }
            $gameScreen.setZoom(zoomX, zoomY, q * zoomScale);
            if (n === Math.floor(speed / 6)) {
                this.startFlashForEncounter(speed / 2);
            }
            if (n === Math.floor(speed / 2)) {
                BattleManager.playBattleBgm();
                this.startFadeOut(this.fadeSpeed());
            }
            if (!this._encounterEffectDuration) {
                $gameScreen._noZoomSaveKe = false;
            }
        }
    };



    //==================================================
    //--  カメラの維持
    //==================================================

    //- カメラのロード
    function loadCamera() {
        p = getCameraParam();
        if (!p) { return; }
        $gameScreen.setZoom(0, 0, p.scale);
        setCameraOffset(p.x, p.y);
        if (p.chara) { p.chara = searchSameChara(p.chara); }
        if (p.preChara) { p.preChara = searchSameChara(p.preChara); }
    };


    //- カメラの再開
    function restartCamera() {
        p = getCameraParam();
        if (!p) { return; }
        if (p.duration) {
            const gs = $gameScreen;
            gs._zoomScaleTarget = p.scaleTarget;
            gs._zoomDuration = p.duration;
        }
        // カメラ変更の更新
        updateCameraChange(true);
    };



    //==================================================
    //--  カメラ注視
    //==================================================

    //- プレイヤーの注視(コア追加)
    const _Game_Player_updateScroll = Game_Player.prototype.updateScroll;
    Game_Player.prototype.updateScroll = function (lastScrolledX, lastScrolledY) {
        const p = getCameraParam();
        if (p && !isSameChara(p.chara, this)) { return; };
        _Game_Player_updateScroll.apply(this, arguments);
        // スクロールの相殺
        reduceScroll(this);
    };


    //- スクロールの相殺
    function reduceScroll(chara) {
        const volX = (chara._realX - chara._preXFrcmKe) * $gameMap.tileWidth();
        if (p.x > 0 && volX > 0) {
            p.x = Math.max(0, p.x - volX);
        } else if (p.x < 0 && volX < 0) {
            p.x = Math.min(0, p.x - volX);
        }
        const volY = (chara._realY - chara._preYFrcmKe) * $gameMap.tileHeight();
        if (p.y > 0 && volY > 0) {
            p.y = Math.max(0, p.y - volY);
        } else if (p.y < 0 && volY < 0) {
            p.y = Math.min(0, p.y - volY);
        }
        chara._preXFrcmKe = chara._realX;
        chara._preYFrcmKe = chara._realY;
    };


    //- イベントの注視(コア追加)
    const _Game_Event_update = Game_Event.prototype.update;
    Game_Event.prototype.update = function () {
        const lastScrolledX = this.scrolledX();
        const lastScrolledY = this.scrolledY();
        _Game_Event_update.apply(this);
        $gamePlayer.updateScroll.call(this, lastScrolledX, lastScrolledY);
    };


    //- フォロワーの注視(コア追加)
    const _Game_Follower_update = Game_Follower.prototype.update;
    Game_Follower.prototype.update = function () {
        const lastScrolledX = this.scrolledX();
        const lastScrolledY = this.scrolledY();
        _Game_Follower_update.apply(this);
        $gamePlayer.updateScroll.call(this, lastScrolledX, lastScrolledY);
    };


    //- 乗り物の注視(コア追加)
    const _Game_Vehicle_update = Game_Vehicle.prototype.update;
    Game_Vehicle.prototype.update = function () {
        const lastScrolledX = this.scrolledX();
        const lastScrolledY = this.scrolledY();
        _Game_Vehicle_update.apply(this);
        $gamePlayer.updateScroll.call(this, lastScrolledX, lastScrolledY);
    };


    //- マップのスクロールに対応(コア追加)
    const _Game_Map_updateScroll = Game_Map.prototype.updateScroll;
    Game_Map.prototype.updateScroll = function () {
        const lastX = this._displayX;
        const lastY = this._displayY;
        _Game_Map_updateScroll.apply(this);
        if (this.isScrolling()) {
            const p = getCameraParam();
            if (this._displayX != lastX) { p.x += (this._displayX - lastX) * $gameMap.tileWidth(); }
            if (this._displayY != lastY) { p.y += (this._displayY - lastY) * $gameMap.tileHeight(); }
        }
    };



    //==================================================
    //--  ズーム除外
    //==================================================

    //- ズーム除外の更新
    function updateZoomNo(sprite) {
        const chara = sprite._character;
        if (!chara || !chara._zoomNoKe) { return; }
        if (sprite._zoomNoScale) {
            sprite.scale.x /= sprite._zoomNoScale;
            sprite.scale.y /= sprite._zoomNoScale;
            sprite._zoomNoScale = null;
        }
        // スケール補正の取得
        const zoomScale = $gameScreen.zoomScale();
        if (zoomScale >= 1) { return; }
        sprite._zoomNoScale = zoomScale < 1 ? Math.max(1, 1 / zoomScale * chara._zoomNoKe) : Math.min(1, 1 / zoomScale * chara._zoomNoKe);
        // 補正
        sprite.scale.x *= sprite._zoomNoScale;
        sprite.scale.y *= sprite._zoomNoScale;
    };



    //==================================================
    //-  制御文字でのカメラ操作
    //==================================================

    msgPreter = null;


    //-  制御文字にカメラ操作を追加(コア追加)
    const _Window_Message_convertEscapeCharacters = Window_Message.prototype.convertEscapeCharacters;
    Window_Message.prototype.convertEscapeCharacters = function (text) {
        text = _Window_Message_convertEscapeCharacters.apply(this, arguments);
        const regExp = /\n*[\x1b\\](\w+)\[([^\]]*)\]\n*/gi
        let dels = [];
        while (true) {
            const match = regExp.exec(text);
            if (!match || !match[1]) { break; }
            if (match[1].toUpperCase() == keke_controlCharCamera) {
                // カメラ操作
                callZoomByControlChar(match[2]);
                dels.push(match[0]);
            }
        }
        if (dels.length) { dels.forEach(del => text = text.replace(del, "")); }
        return text;
    };


    //- 制御文字でのカメラ呼び出し
    function callZoomByControlChar(param) {
        const args = param.replace(/\s/g, "").split(",");
        const chara = callTarget(args[0])[0];
        $gameTemp.callZoomKe(chara, args[1], args[2], args[3], args[4], msgPreter);
    };


    //- ターゲットの呼び出し
    function callTarget(tageStr, event, emptyNull) {
        const nul = emptyNull ? [null] : [event];
        // 変数の置換
        tageStr = convertVariable(tageStr);
        if (!tageStr) { return nul; }
        // IDでのキャラリスト取得
        if (tageStr.match(/^-?\d+\.?\d*(?!\w)/)) {
            const targets = getCharasById(tageStr, event);
            return targets.length ? targets : nul;
            // 名前でのキャラリスト取得
        } else {
            const targets = getCharasByName(tageStr, event);
            return targets.length ? targets : nul;
        }
    };


    //- メッセージ時にプリターを保存(コア追加)
    const _Game_Interpreter_command101 = Game_Interpreter.prototype.command101;
    Game_Interpreter.prototype.command101 = function (params) {
        msgPreter = this;
        return _Game_Interpreter_command101.apply(this, arguments);
    };



    //==================================================
    //--  スワイプモード
    //==================================================

    //- スワイプモードの開始
    function startSwipeMode(args) {
        const p = getCameraParam();
        p.swipeMode = true;
        p.touchSwipeSpeed = Number(args["タッチ時速度"]) || 2;
        p.mouseSwipeSpeed = Number(args["マウス時速度"]) || 2;
        p.inertiaTimeMax = Number(args["マウス時慣性時間"]) || 60;
    };


    //- スワイプモードの終了
    function endSwipeMode(args) {
        const p = getCameraParam();
        p.swipeMode = false;
    };


    //- カメラの位置戻し
    function cameraPosBack() {
        const p = getCameraParam();
        if (!p) { return; }
        p.x = 0;
        p.y = 0;
        // 注視の更新
        updateFocus(p);
    };


    //- スワイプモードの更新
    function updateSwipeMode() {
        const p = getCameraParam();
        if (!p) { return; }
        if (!p.swipeMode) { return; }
        // スワイプ量を取得
        let swiped = false;
        // タッチスワイプの更新
        swiped = updateTouchSwipe(p);
        // マウススワイプの更新
        swiped = swiped || updateMouseSwipe(p);
        // タッチかマウススワイプしたら慣性を停止
        if (swiped) {
            p.inertiaDuration = 0;
        }
        // スワイプ慣性の更新
        swiped = swiped || updateSwipeInertia(p);
        // 注視の更新
        if (swiped) {
            updateFocus(p);
        }
    };


    //- タッチスワイプの更新
    function updateTouchSwipe() {
        let swiped = false;
        if (TouchInput.wheelX) {
            const wheelX = TouchInput.wheelX;
            p.x += wheelX * p.touchSwipeSpeed;
            swiped = true;
        }
        if (TouchInput.wheelY) {
            const wheelY = TouchInput.wheelY;
            p.y += wheelY * p.touchSwipeSpeed;
            swiped = true;
        }
        return swiped;
    };


    //- マウススワイプの更新
    function updateMouseSwipe(p) {
        if (!TouchInput._mousePressed) {
            // スワイプ慣性の開始
            if (p.mouseSwipeSpeedX || p.mouseSwipeSpeedY) {
                startSwipeInertia(p);
            }
            // 初期化
            p.mouseSwipeSpeedX = 0;
            p.mouseSwipeSpeedY = 0
            p.preTouchX = null;
            p.preTouchY = null;
            return;
        }
        let swiped = false;
        if (p.preTouchX != null) {
            p.mouseSwipeSpeedX = TouchInput._x - p.preTouchX;
            p.x -= p.mouseSwipeSpeedX * p.mouseSwipeSpeed;
            swiped = true;
        }
        if (p.preTouchY != null) {
            p.mouseSwipeSpeedY = TouchInput._y - p.preTouchY;
            p.y -= p.mouseSwipeSpeedY * p.mouseSwipeSpeed;
            swiped = true;
        }
        p.preTouchX = TouchInput._x;
        p.preTouchY = TouchInput._y;
        return swiped;
    };


    //- スワイプ慣性の開始
    function startSwipeInertia(p) {
        if (p.mouseSwipeSpeedX || p.mouseSwipeSpeedY) {
            p.swipeInertiaXMax = p.mouseSwipeSpeedX;
            p.swipeInertiaX = p.swipeInertiaXMax;
            p.swipeInertiaYMax = p.mouseSwipeSpeedY;
            p.swipeInertiaY = p.swipeInertiaYMax;
            p.inertiaDuration = p.inertiaTimeMax;
        }
    };


    //- スワイプ慣性の更新
    function updateSwipeInertia(p) {
        if (!p.inertiaDuration) { return; }
        p.inertiaDuration--;
        let swiped = false;
        if (p.swipeInertiaXMax) {
            p.swipeInertiaX = applyEasing(p.swipeInertiaX, p.swipeInertiaXMax, 0, p.inertiaDuration, p.inertiaTimeMax, "e");
            p.x -= p.swipeInertiaX;
            swiped = true;
        }
        if (p.swipeInertiaYMax) {
            p.swipeInertiaY = applyEasing(p.swipeInertiaY, p.swipeInertiaYMax, 0, p.inertiaDuration, p.inertiaTimeMax, "e");
            p.y -= p.swipeInertiaY;
            swiped = true;
        }
        return swiped;
    };


    //- スワイプモード中か
    function isSwipeMode() {
        const p = getCameraParam();
        return p && p.swipeMode;
    }


    //- スワイプモード中は標準のタッチ無効
    const _Game_Player_triggerTouchAction = Game_Player.prototype.triggerTouchAction;
    Game_Player.prototype.triggerTouchAction = function () {
        if (isSwipeMode()) { return false; }
        return _Game_Player_triggerTouchAction.apply(this);
    };

    const _Scene_Map_processMapTouch = Scene_Map.prototype.processMapTouch;
    Scene_Map.prototype.processMapTouch = function () {
        if (isSwipeMode()) { return; }
        _Scene_Map_processMapTouch.apply(this);
    };



    //==================================================
    //--  計算基本 /ベーシック
    //==================================================

    //- マルチ演算
    function calcMulti(cur, tage, ori, cmds = []) {
        if (tage == null) { return [{}]; }
        const datas = [cur, tage.toString(), ori, cmds];
        cur = cur || 0;
        let tageStr = tage.toString();
        let tageLine = tageStr.split(",");
        tageLine = tageLine.map(v => v.replace(/\s/g, ""));
        let sols = [];
        tageLine.forEach((tages, i) => {
            const match = tages.match(/^(r*m*s*\/|)([\+\*\/\%←→↑↓]*)(\-*\d+\.*\d*)~*(\-*\d*\.*\d*)([\+\*\/\%←→↑↓]*)(tn|cg|fk|cf|rd|bk|ei|eo|er|e|)(\(?\-*\d*\.*\d*\)?)(&*b*j*d*c*t*o*)(\_*\-?\d*\.*\d*)$/i);
            if (!match) {
                sols.push({ val: tages, header: "", easing: "", easingRate: 1, extra: "", num: 0, datas: datas });
                return;
            }
            let val = 0;
            let rvs = 1;
            let header = "";
            let easing = "";
            let easingRate = 1;
            let extra = "";
            let num = 1;
            let rand = null;
            if (match[1]) {
                header = match[1].replace(/\//g, "").toUpperCase();
                if (header.match(/r/i)) { rvs = -1; }
            }
            if (match[6]) {
                easing = match[6].toUpperCase();
            }
            if (match[7]) {
                const mt = match[7].match(/\-*\d+\.*\d*/);
                easingRate = mt ? Number(mt[0]) : 1;
            }
            if (match[8]) {
                extra = match[8].replace(/&/g, "").toUpperCase();
            }
            if (match[9]) {
                num = Number(match[9].replace(/\_/g, ""));
            }
            let calc = 0;
            if (match[4]) {
                const calcs = [Number(match[3]), Number(match[4])];
                calcs.sort((a, b) => a - b);
                calc = calcs[0] + Math.random() * (calcs[1] - calcs[0]);
            } else {
                calc = Number(match[3]);
            }
            const symbol = (match[2] || "") + (match[5] || "");
            if (symbol.includes("+")) {
                val = Number(cur) + calc * rvs;
            } else if (symbol.includes("*")) {
                val = Number(cur) * calc * rvs;
            } else if (symbol.includes("/")) {
                val = Number(cur) / calc * rvs;
            } else if (symbol.includes("%")) {
                val = Number(cur) % calc * rvs;
            } else if (symbol.includes("←")) {
                val = Number(cur) - calc * rvs;
            } else if (symbol.includes("→")) {
                val = Number(cur) + calc * rvs;
            } else if (symbol.includes("↑")) {
                val = Number(cur) - calc * rvs;
            } else if (symbol.includes("↓")) {
                val = Number(cur) + calc * rvs;
            } else {
                val = calc * rvs;
                if (ori) {
                    if (ori.toString().includes("*")) {
                        val *= Number(ori.replace(/\*/g, ""));
                    } else {
                        val += ori;
                    }
                }
            }
            cmds.forEach(cmd => {
                if (cmd.includes("+")) {
                    val += Number(cmd.replace(/\+/g, ""));
                } else if (cmd.includes("*")) {
                    val *= Number(cmd.replace(/\*/g, ""));
                } else if (cmd.includes("/")) {
                    val /= Number(cmd.replace(/\//g, ""));
                } else if (cmd.includes("%")) {
                    val %= Number(cmd.replace(/\%/g, ""));
                } else {
                    val = Number(cmd);
                }
            });
            sols.push({ val: val, header: header, easing: easing, easingRate: easingRate, extra: extra, num: num, datas: datas });
        });
        return sols;
    };


    //- 小数点を丸める
    function roundDecimal(val, rate) {
        const newVal = Math.floor(val * rate) / rate
        return newVal;
    };


    //- イージングの適用
    function applyEasing(current, start, target, duration, timeMax, easing, easingRate = 1) {
        // イージングの処理
        if (easing.match(/ei|eo|e/i)) {
            return processEasing(current, target, duration + 1, timeMax, easing, easingRate);
        }
        // カービング
        if (easing.match(/tn|cg|fk|cf|rd|bk/i)) {
            return processCurving(current, start, target, duration + 1, timeMax, easing, easingRate);
        }
    };


    //- イージングの処理
    function processEasing(current, target, duration, timeMax, easing, easingRate = 1) {
        const lt = calcEasing((timeMax - duration) / timeMax, easing, easingRate);
        const t = calcEasing((timeMax - duration + 1) / timeMax, easing, easingRate);
        const start = (current - target * lt) / (1 - lt);
        return start + (target - start) * t;
    };


    //- イージングの計算
    function calcEasing(t, easing, easingRate = 1) {
        const exponent = 2 * easingRate;
        switch (easing.toUpperCase()) {
            case "EI":
                return easeIn(t, exponent);
            case "EO":
                return easeOut(t, exponent);
            case "E":
                return easeInOut(t, exponent);
            default:
                return t;
        }
    };


    //- 各イージング処理
    function easeIn(t, exponent) {
        return Math.pow(t, exponent) || 0.001;
    };

    function easeOut(t, exponent) {
        ;
        return 1 - (Math.pow(1 - t, exponent) || 0.001);
    };

    function easeInOut(t, exponent) {
        if (t < 0.5) {
            return easeIn(t * 2, exponent) / 2;
        } else {
            return easeOut(t * 2 - 1, exponent) / 2 + 0.5;
        }
    };


    //- カービングの処理
    function processCurving(current, start, target, duration, timeMax, easing, easingRate = 1) {
        // 0 の時の処理
        if (duration <= 0) { return easing.match(/tn|rd|bk/i) ? start : target; }
        let result = 0;
        // ターン
        if (easing.toUpperCase() == "TN") {
            result = processTurn(current, start, target, duration, timeMax, easingRate);
            // チャージ
        } else if (easing.toUpperCase() == "CG") {
            result = processCharge(current, start, target, duration, timeMax, easingRate);
            // フック
        } else if (easing.toUpperCase() == "FK") {
            result = processFook(current, start, target, duration, timeMax, easingRate);
            // チャージフック
        } else if (easing.toUpperCase() == "CF") {
            result = processChargeFook(current, start, target, duration, timeMax, easingRate);
            // ラウンド
        } else if (easing.toUpperCase() == "RD") {
            result = processRound(current, start, target, duration, timeMax, easingRate);
            // バック
        } else if (easing.toUpperCase() == "BK") {
            result = processBack(current, start, target, duration, timeMax, easingRate);
        }
        return result;
    };


    //- ターンの処理
    function processTurn(current, start, target, duration, timeMax, easingRate) {
        let result = 0;
        const d1 = Math.round(timeMax / 2);
        const d2 = timeMax - d1;
        if (duration > d2) {
            result = processEasing(current, target, duration - d2, d1, "e", easingRate);
        } else {
            result = processEasing(current, start, duration, d2, "e", easingRate);
        }
        return result;
    };


    //- チャージの処理
    function processCharge(current, start, target, duration, timeMax, easingRate) {
        let result = 0;
        const d1 = Math.round(timeMax / 3);
        const d2 = timeMax - d1;
        if (duration > d2) {
            result = processEasing(current, start + (start - target) * easingRate, duration - d2, d1, "e");
        } else {
            result = processEasing(current, target, duration, d2, "e");
        }
        return result;
    };


    //- フックの処理
    function processFook(current, start, target, duration, timeMax, easingRate) {
        let result = 0;
        const d1 = Math.round(timeMax * 2 / 3);
        const d2 = timeMax - d1;
        if (duration > d2) {
            result = processEasing(current, target + (target - start) * easingRate, duration - d2, d1, "e");
        } else {
            result = processEasing(current, target, duration, d2, "e");
        }
        return result;
    };


    //- チャージフックの処理
    function processChargeFook(current, start, target, duration, timeMax, easingRate) {
        let result = 0;
        const d1 = Math.round(timeMax / 4);
        const d3 = Math.round(timeMax / 4);
        const d2 = timeMax - d1 - d3;
        if (duration > (d2 + d3)) {
            result = processEasing(current, start + (start - target) * easingRate, duration - d2 - d3, d1, "e");
        } else if (duration > d3) {
            result = processEasing(current, target + (target - start) * easingRate, duration - d3, d2, "e");
        } else {
            result = processEasing(current, target, duration, d3, "e");
        }
        return result;
    };


    //- ラウンドの処理
    function processRound(current, start, target, duration, timeMax, easingRate) {
        let result = 0;
        const d1 = Math.round(timeMax / 4);
        const d2 = Math.round(timeMax / 2);
        const d3 = timeMax - d1 - d2;
        if (duration > (d2 + d3)) {
            result = processEasing(current, target, duration - d2 - d3, d1, "eo");
        } else if (duration > d3) {
            result = processEasing(current, start + (start - target) * easingRate, duration - d3, d2, "e");
        } else {
            result = processEasing(current, start, duration, d3, "ei");
        }
        return result;
    };


    //- バックの処理
    function processBack(current, start, target, duration, timeMax, easingRate) {
        let result = 0;
        const d1 = 1;
        const d2 = timeMax - d1;
        if (duration > d2) {
            result = processEasing(current, target, duration - d2, d1, "e", easingRate);
        } else {
            result = processEasing(current, start, duration, d2, "e", easingRate);
        }
        return result;
    };



    //==================================================
    //---  位置基本 /ベーシック
    //==================================================

    //- マス座標を画面座標へ-X
    function massToScreenX(x) {
        var tw = $gameMap.tileWidth();
        var scrolledX = $gameMap.adjustX(x)
        return Math.round(scrolledX * tw + tw / 2);
    };


    // マス座標を画面座標へ-Y
    function massToScreenY(y) {
        var th = $gameMap.tileHeight();
        var scrolledY = $gameMap.adjustY(y)
        return Math.round(scrolledY * th + th / 2);
    };


    //- ピクセルXへ
    function toPixelX(v) {
        return v * $gameMap.tileWidth();
    };


    //- ピクセルYへ
    function toPixelY(v) {
        return v * $gameMap.tileHeight();
    };


    //- タイルXへ
    function toTileX(v) {
        return v / $gameMap.tileWidth();
    };


    //- タイルYへ
    function toTileY(v) {
        return v / $gameMap.tileHeight();
    };



    //==================================================
    //--  文字列基本 /ベーシック
    //==================================================

    // 文字列の数字リスト化
    function strToNumList(str) {
        const list = [];
        str = str.replace(/\[/g, "");
        str = str.replace(/\]/g, "");
        const strs = str.split(",");
        let s2 = null;
        for (let s of strs) {
            if (s.includes("~")) {
                s2 = s.split("~");
                s2 = s2.map(s => Number(s));
                if (s2[1] >= s2[0]) {
                    for (let i = s2[0]; i <= s2[1]; i++) { list.push(i); }
                } else {
                    for (let i = s2[1]; i <= s2[0]; i++) { list.push(i); }
                }
            } else {
                list.push(Number(s));
            }
        };
        return list;
    };


    //- 変数の置換
    function convertVariable(str) {
        if (!str) { return str; }
        const regExp = /[\x1b\\]v\[(\d+)\]/gi;
        while (true) {
            const match = regExp.exec(str);
            if (!match) { break; }
            const val = $gameVariables.value(Number(match[1]));
            str = str.replace(match[0], val);
        }
        return str;
    };



    //==================================================
    //--  計算基本 /ベーシック
    //==================================================

    //- 時間の作成
    function makeTime(time) {
        time = time.toString();
        return Math.round(Number(time.match(/(\d+\.?\d*)/)[0]) * (time.match(/s/i) ? 60 : 1));
    };



    //==================================================
    //--  イベント基本 /ベーシック
    //==================================================

    //- インタープリターのイベント取得
    function getPreterEvent(preter) {
        let result = null;
        // イベントIDが同じイベントを取得
        $gameMap.events().forEach(event => {
            if (event._eventId == preter._eventId) {
                result = event;
            }
        });
        return result;
    };



    //==================================================
    //--  プラグインコマンド基本 /ベーシック
    //==================================================

    let plcmPreter = null;


    //- プラグインコマンド呼び出しプリターを保存(コア追加)
    const _PluginManager_callCommand = PluginManager.callCommand;
    PluginManager.callCommand = function (self, pluginName, commandName, args) {
        plcmPreter = self;
        _PluginManager_callCommand.call(this, self, pluginName, commandName, args);
        plcmPreter = null;
    };


    //- プラグインコマンド呼び出しイベントを取得
    function getPlcmEvent() {
        if (!plcmPreter) { return; }
        const preter = plcmPreter;
        return preter.character(preter.eventId());
    };


    //- 名前でのキャラリスト取得
    function getCharasByName(names, self) {
        if (!names) { return []; }
        const nameList = names.replace(/\s/g, "").split(",");
        let charas = [];
        let match = null;
        for (const name of nameList) {
            // イベントを取得
            $gameMap.events().forEach(event => {
                const note = event.event().name + " " + event.event().note;
                if (note.includes(name)) { charas.push(event); }
            });
            // セルフを取得
            if (name.match(/^(セルフ|自分|自身|self)$/)) {
                self = self || getPlcmEvent() || (charaSpritePlcm ? charaSpritePlcm._character : null) || $gamePlayer;
                if (self) { charas.push(self); }
            }
            // プレイヤーを取得
            if (name.match(/^(プレイヤー|操作キャラ|player)$/)) {
                charas = [...charas, $gamePlayer];
            }
            // フォロワーを取得
            match = name.match(/^(フォロワー|フォロアー|隊列|隊列キャラ|follower)(\d*)$/)
            if (match) {
                const id = match[2] ? Number(match[2]) - 1 : 0;
                charas = id ? [...charas, $gamePlayer._followers._data[id]] : [...charas, ...$gamePlayer._followers._data];
            }
            // パーティを取得
            if (name.match(/^(パーティ|味方|味方全員|味方全体|party)$/)) {
                charas = [...charas, $gamePlayer, ...$gamePlayer._followers._data];
            }
            // 乗り物を取得
            match = name.match(/^(乗り物|乗物|乗機|vehicle)(\d*)$/);
            if (match) {
                const id = match[2] ? Number(match[2]) - 1 : 0;
                charas = id ? [...charas, $gameMap._vehicles[id]] : [...charas, ...$gameMap._vehicles];
            }
            // 全て取得
            if (name.match(/^(全て|すべて|全部|全体|all)$/)) {
                charas = [...$gameMap.events(), $gamePlayer, ...$gamePlayer._followers._data, ...$gameMap._vehicles];
            }
            // 選択なし
            if (name.match(/^(なし|無し|none)$/)) {
            }
        }
        charas = charas.filter(chara => chara);
        return charas;
    };


    //- IDでのキャラリスト取得
    function getCharasById(ids, self) {
        if (!ids) { return []; }
        const idList = !ids ? [] : strToNumList(ids.toString());
        let charas = [];
        for (const id of idList) {
            // イベントを取得
            if (id > 0) { charas.push($gameMap.event(id)); }
            // セルフを取得
            if (id == 0) {
                self = self || getPlcmEvent() || (charaSpritePlcm ? charaSpritePlcm._character : null) || $gamePlayer;
                if (self && !idList.includes(self._eventId)) { charas.push(self); }
            }
            // プレイヤーを取得
            if (id == -1) { charas = [...charas, $gamePlayer]; }
            // フォロワーを取得
            if (id <= -10 && id >= -99) {
                charas = id == -10 ? [...charas, ...$gamePlayer._followers._data] : [...charas, $gamePlayer._followers._data[Math.abs(id) - 11]];
            }
            // 乗り物を取得
            if (id <= -100) {
                charas = id == -100 ? [...charas, ...$gameMap._vehicles] : [...charas, $gameMap._vehicles[Math.abs(id) - 101]];
            }
            // 全て取得
            if (id == -2) {
                charas = [...$gameMap.events(), $gamePlayer, ...$gamePlayer._followers._data, ...$gameMap._vehicles];
            }
        }
        charas = charas.filter(chara => chara);
        return charas;
    };


    //- 全てのキャラを取得
    function getAllCharacter() {
        return [...$gameMap.events(), $gamePlayer, ...$gamePlayer._followers._data, ...$gameMap._vehicles];
    };


    //- 同じキャラか
    function isSameChara(a, b) {
        if (!a) { return !b; }
        if (!b) { return !a; }
        if (a._eventId) {
            if (!b._eventId) { return false; }
            return a._eventId == b._eventId;
        }
        if (a._followers && b._followers) { return true; }
        if (a._memberIndex && a._memberIndex == b._memberIndex) { return true; }
        if (a._type && a._type == b._type) { return true; }
        return false;
    };


    //- 同じキャラを検索
    function searchSameChara(chara) {
        let same = null;
        for (let c of getAllCharacter()) {
            if (isSameChara(c, chara)) {
                same = c;
                break;
            }
        }
        return same;
    };



    //==================================================
    //--  開始時プラグインコマンド /ベーシック
    //==================================================

    //- 開始時プラグインコマンドの実行
    function runPluginCmdStarting(list, regs = [], condition = "") {
        if (!list || !list.length) { return; }
        // 開始時用インタープリターを作成
        const startingIp = new Game_InterpreterStartingKeAcms();
        startingIp.setup(list, regs, condition);
        while (1) {
            if (!startingIp.executeCommand()) { break; }
        }
    };


    //- 対象のプラグインコマンドか
    function isCanPluginCmd(cmd, regs = [], condition = "") {
        if (cmd.code != 357) { return false; }
        let result = false;
        const params = cmd.parameters;
        const args = params[3];
        let condiOk = condition ? false : true;
        if (eval(args[condition])) { condiOk = true; }
        const regsOk = params[1] ? regs.filter(reg => params[1].match(reg)).length : false;
        if (regsOk && condiOk) { result = true; }
        return result;
    };


    //- 開始時用インタープリター
    function Game_InterpreterStartingKeAcms() {
        this.initialize(...arguments);
    }

    Game_InterpreterStartingKeAcms.prototype = Object.create(Game_Interpreter.prototype);
    Game_InterpreterStartingKeAcms.prototype.constructor = Game_InterpreterStartingKeAcms;


    //- セットアップ
    Game_InterpreterStartingKeAcms.prototype.setup = function (list, regs, condition) {
        Game_Interpreter.prototype.setup.call(this, list);
        this._regsKe = regs;
        this._conditionKe = condition;
    };


    //- コマンド実行
    Game_InterpreterStartingKeAcms.prototype.executeCommand = function () {
        const cmd = this.currentCommand();
        if (cmd) {
            this._indent = cmd.indent;
            // 対象のプラグインコマンドのみ実行
            if (this.canExecute(cmd)) {
                const methodName = "command" + cmd.code;
                if (typeof this[methodName] === "function") {
                    if (!this[methodName](cmd.parameters)) {
                        return false;
                    }
                }
            }
            this._index++;
        } else {
            return false;
        }
        return true;
    };


    //- コマンド実行するか
    Game_InterpreterStartingKeAcms.prototype.canExecute = function (cmd) {
        result = false;
        if (cmd.code == 111) { result = true; } // 条件判断【如果】
        if (cmd.code == 411) { result = true; } // 应该是else判断【否则】
        if (cmd.code == 117) { result = true; }
        if (cmd.code == 357) {
            result = isCanPluginCmd(cmd, this._regsKe, this._conditionKe);
        }
        return result;
    };


    //- 開始時コモンイベントのセットアップ
    Game_InterpreterStartingKeAcms.prototype.setupChild = function (list, eventId) {
        if (!this._childInterpreter) { this._childInterpreter = new Game_InterpreterStartingKeAcms(this._depth + 1); }
        this._childInterpreter.setup(list, this._regsKe, this._conditionKe);
        while (1) {
            if (!this._childInterpreter.executeCommand()) { break; }
        }
    };

})();