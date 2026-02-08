/*:
 * @target MZ
 * @plugindesc 图片淡入淡出效果
 * @author B
 * 
 * @help
 * ============================================================================
 * 使用方法：
 * 
 * 插件命令：
 *   PictureFadeInOut [图片ID] [文件路径] [x坐标] [y坐标] 
 *                     [淡入时间] [停留时间] [淡出时间] [可选项]
 * 
 * 参数说明：
 *   图片ID: 1-100的数字，用于标识图片
 *   文件路径: 图片文件路径（如 "img/pictures/背景"）
 *   x坐标: 图片的X坐标（屏幕位置）
 *   y坐标: 图片的Y坐标（屏幕位置）
 *   淡入时间: 淡入效果持续时间（帧数）
 *   停留时间: 完全显示状态的持续时间（帧数）
 *   淡出时间: 淡出效果持续时间（帧数）
 * 
 * ============================================================================
 * @command showPic
 * 
 * @text 显示图片
 * @arg id
 * @type number
 * @arg imageFile
 * 
 * @text 图片文件
 * @type file
 * @dir img/
 * @arg x
 * @type number
 * @arg y
 * @type number
 * @arg fadein
 * @type number
 * @default 60
 * @arg wait
 * @type number
 * @default 0
 * @arg fadeout
 * @type number
 * @default 60
 * @arg zoomX
 * @type number
 * @default 100
 * @arg zoomY
 * @type number
 * @default 100
 * 
 */

(() => {
    'use strict';

    // 2. 专门用于重置/初始化 Map 的辅助函数
    Game_Screen.prototype.clearFadeEffects = function () {
        this._fadeEffects = new Map();
    };
    // 3. 这里的关键：当从存档加载数据时，系统会直接覆盖 Game_Screen 对象
    // 我们需要拦截 Scene_Load 的加载成功时刻，或者利用 onPlayerLoaded 之类的钩子
    // 最稳妥的方法是重写 Game_Screen 的 update，如果没有 Map 则重新创建
    const _Game_Screen_update = Game_Screen.prototype.update;
    Game_Screen.prototype.update = function () {
        _Game_Screen_update.call(this);
        // 如果读档后 _fadeEffects 丢失或变成了普通对象（非Map），则重置
        // 注意：读档后，之前的淡入淡出计时器状态通常无法通过简单的 JSON 保存
        // 这里采用"读档后清空特效队列"的策略，防止报错
        if (!this._fadeEffects || !(this._fadeEffects instanceof Map)) {
            this.clearFadeEffects();
        }
    };

    // 淡入淡出效果类
    class PictureFadeEffect {
        constructor(pictureId, filename, x, y, fadeIn, wait, fadeOut, zoomX, zoomY) {
            this._pictureId = pictureId;
            this._filename = filename.replace("pictures", "");
            this._x = x;
            this._y = y;
            this._fadeInTime = fadeIn;
            this._waitTime = wait;
            this._fadeOutTime = fadeOut;
            this._zoomX = zoomX;
            this._zoomY = zoomY;

            this._timer = 0;
            this._phase = 'fadein'; // fadein, wait, fadeout, done
            this._started = false;
        }

        start() {
            if (this._started) return;
            // 显示图片（初始透明度为0）
            $gameScreen.showPicture(
                this._pictureId,
                this._filename,
                0,
                this._x,
                this._y,
                this._zoomX,
                this._zoomY,
                0, // 初始透明度为0
                0
            );

            /* 如果有额外的不透明度设置
            if (this._options.opacity !== undefined) {
                $gameScreen.picture(this._pictureId)._opacity = this._options.opacity;
            }*/

            this._started = true;
        }

        update() {
            if (!this._started) this.start();

            this._timer++;

            switch (this._phase) {
                case 'fadein':
                    this.updateFadeIn();
                    break;
                case 'wait':
                    this.updateWait();
                    break;
                case 'fadeout':
                    this.updateFadeOut();
                    break;
                case 'done':
                    return true;
            }

            return false;
        }

        updateFadeIn() {
            if (this._fadeInTime <= 0) {
                this._phase = 'wait';
                return;
            }

            const progress = this._timer / this._fadeInTime;
            const opacity = Math.min(progress * 255, 255);

            $gameScreen.picture(this._pictureId)._opacity = opacity;

            if (this._timer >= this._fadeInTime) {
                this._timer = 0;
                this._phase = 'wait';
                // 确保完全显示
                $gameScreen.picture(this._pictureId)._opacity = 255;
            }
        }

        updateWait() {
            if (this._timer >= this._waitTime) {
                this._timer = 0;
                this._phase = 'fadeout';
            }
        }

        updateFadeOut() {
            if (this._fadeOutTime <= 0) {
                this._phase = 'done';
                $gameScreen.erasePicture(this._pictureId);
                return;
            }

            const progress = this._timer / this._fadeOutTime;
            const opacity = Math.max((1 - progress) * 255, 0);

            $gameScreen.picture(this._pictureId)._opacity = opacity;

            if (this._timer >= this._fadeOutTime) {
                this._phase = 'done';
                $gameScreen.erasePicture(this._pictureId);
            }
        }
    }

    // 解析插件命令
    PluginManager.registerCommand("PictureFadeInOut", "showPic", function (args) {
        const pictureId = args.id

        // 创建并开始效果
        const effect = new PictureFadeEffect(
            args.id, args.imageFile, args.x, args.y, args.fadein, args.wait, args.fadeout, args.zoomX, args.zoomY
        );

        // 如果已有相同ID的效果，先移除
        if ($gameScreen._fadeEffects.has(pictureId)) {
            $gameScreen.erasePicture(pictureId);
        }

        $gameScreen._fadeEffects.set(pictureId, effect);
        effect.start();
    });

    //脚本型
    Game_Screen.prototype.showPictureFadeInOut = function (file, id, x, y, zoom = 0) {
        const pictureId = id

        // 创建并开始效果
        const effect = new PictureFadeEffect(
            id, file, x, y, 60, 0, 60, zoom || 30, zoom || 40
        );

        // 如果已有相同ID的效果，先移除
        if ($gameScreen._fadeEffects.has(pictureId)) {
            $gameScreen.erasePicture(pictureId);
        }

        $gameScreen._fadeEffects.set(pictureId, effect);
        effect.start();
    }

    // -------------------------------------------------------------------------
    // 修复后的代码块
    // -------------------------------------------------------------------------

    // 1. 初始化与清理逻辑（使用别名 alias 方式，兼容性更好）
    const _Game_Screen_clear = Game_Screen.prototype.clear;
    Game_Screen.prototype.clear = function() {
        _Game_Screen_clear.call(this);
        this.clearFadeEffects();
    };

    Game_Screen.prototype.clearFadeEffects = function() {
        this._fadeEffects = new Map();
    };

    // 2. 场景更新逻辑（重写相关部分）
    const _Scene_Base_update = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function() {
        _Scene_Base_update.call(this);
        this.updatePictureFadeEffects();
    };
    
    // 【关键修复】更新所有淡入淡出效果
    Scene_Base.prototype.updatePictureFadeEffects = function() {
        // 安全检查 1：如果 $gameScreen 都不存在（极罕见情况），直接返回
        if (!$gameScreen) return;

        // 安全检查 2：读档后，_fadeEffects 可能会变成 undefined 或 普通Object
        // 如果它不是 Map，说明是刚读档或是坏数据，直接重置为空 Map，防止崩坏
        if (!$gameScreen._fadeEffects || !($gameScreen._fadeEffects instanceof Map)) {
            $gameScreen._fadeEffects = new Map();
            return; // 本帧跳过遍历
        }

        // 此时已确保是 Map，可以安全遍历
        for (const [id, effect] of $gameScreen._fadeEffects) {
            // 安全检查 3：确保 effect 实例存在且拥有 update 方法
            // 读档后的 effect 只是普通 json 对象，没有 update 方法，也会报错
            // 所以如果发现没方法，就认定为无效效果并删除
            if (effect && typeof effect.update === 'function') {
                if (effect.update()) {
                    $gameScreen._fadeEffects.delete(id);
                    $gameScreen.erasePicture(id);
                }
            } else {
                // 如果是从存档读出来的死数据，直接清理掉，避免后续报错
                $gameScreen._fadeEffects.delete(id);
            }
        }
    };

    // 3. 清理图片时的逻辑
    const PFIO_Game_Screen_clearPictures =  Game_Screen.prototype.clearPictures;
    Game_Screen.prototype.clearPictures = function() {
        PFIO_Game_Screen_clearPictures.call(this);
        // 这里必须检查是否存在再 clear，否则 initialize 阶段可能会报错
        if (this._fadeEffects && (this._fadeEffects instanceof Map)) {
            this._fadeEffects.clear();
        } else {
            this._fadeEffects = new Map();
        }
    };


})();