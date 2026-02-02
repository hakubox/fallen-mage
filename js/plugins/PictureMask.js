/*:
 * @plugindesc Allows to use image masking on pictures
 * @version 1.1
 * @author AI
 * @target MZ MV
 *
 * @help
 *
 * This plugin allows to use a picture image as a graphic mask of another
 * picture.
 *
 * A mask is an image that determines the visibility of pixels for another image.
 * White pixels on the mask image makes visible the pixels on the affected image.
 *
 * Note: Technically, it's the alpha (transparency) of the mask image that
 * determines visibility, not its color. Any non-transparent pixel on the
 * mask will make the corresponding pixel of the target picture visible.
 * To achieve the "white makes visible" effect, use a mask image where the
 * shape is white and the background is transparent (e.g., a PNG file).
 *
 * === Plugin Commands (MZ) ===
 *
 * SETMASK
 *   - Sets a mask on a picture.
 *   - Example: Use the plugin command to set Picture #2 as a mask for Picture #1.
 *
 * REMOVEMASK
 *   - Removes the mask from a picture.
 *   - Example: Use the plugin command to remove any mask from Picture #1.
 *
 * === Plugin Commands (MV) ===
 *
 * SETMASK affected_picture_id mask_picture_id
 *   - Sets a mask on a picture.
 *   - Example: SETMASK 1 2
 *     (Uses Picture #2 as a mask for Picture #1)
 *
 * REMOVEMASK affected_picture_id
 *   - Removes the mask from a picture.
 *   - Example: REMOVEMASK 1
 *     (Removes any mask from Picture #1)
 *
 * @command SETMASK
 * @text Set Picture Mask
 * @desc Sets a picture to act as a mask for another picture.
 *
 * @arg affected_picture_id
 * @text Affected Picture ID
 * @type number
 * @min 1
 * @desc The ID of the picture to be masked.
 *
 * @arg mask_picture_id
 * @text Mask Picture ID
 * @type number
 * @min 1
 * @desc The ID of the picture that will be used as the mask.
 *
 * @command REMOVEMASK
 * @text Remove Picture Mask
 * @desc Removes the mask from a picture.
 *
 * @arg affected_picture_id
 * @text Affected Picture ID
 * @type number
 * @min 1
 * @desc The ID of the picture from which to remove the mask.
 */

/*:zh
 * @plugindesc 允许对图片使用图像遮罩。
 * @version 1.1
 * @author Your Name
 * @target MZ MV
 *
 * @help
 *
 * 本插件允许你使用一张图片作为另一张图片的图形遮罩。
 *
 * 遮罩是一张决定另一张图片像素可见性的图像。
 * 遮罩图像上的白色像素会使被影响图片的对应像素变得可见。
 *
 * 注意：从技术上讲，是遮罩图像的Alpha通道（透明度）决定了可见性，
 * 而非其颜色。遮罩上任何不透明的像素都会使目标图片对应的像素可见。
 * 为了达到“白色可见”的效果，请使用一个白色形状、背景透明的PNG图片作为遮罩。
 *
 * === 插件命令 (MZ) ===
 *
 * SETMASK
 *   - 为一张图片设置遮罩。
 *   - 示例: 使用插件命令，设置2号图片作为1号图片的遮罩。
 *
 * REMOVEMASK
 *   - 移除一张图片的遮罩。
 *   - 示例: 使用插件命令，移除1号图片上的所有遮罩。
 *
 * === 插件命令 (MV) ===
 *
 * SETMASK affected_picture_id mask_picture_id
 *   - 为一张图片设置遮罩。
 *   - 示例: SETMASK 1 2
 *     (使用2号图片作为1号图片的遮罩)
 *
 * REMOVEMASK affected_picture_id
 *   - 移除一张图片的遮罩。
 *   - 示例: REMOVEMASK 1
 *     (移除1号图片上的所有遮罩)
 *
 * @command SETMASK
 * @text 设置图片遮罩
 * @desc 将一张图片设置为另一张图片的遮罩。
 *
 * @arg affected_picture_id
 * @text 被影响的图片ID
 * @type number
 * @min 1
 * @desc 需要被应用遮罩的图片的ID。
 *
 * @arg mask_picture_id
 * @text 遮罩图片ID
 * @type number
 * @min 1
 * @desc 将用作遮罩的图片的ID。
 *
 * @command REMOVEMASK
 * @text 移除图片遮罩
 * @desc 从一张图片上移除遮罩。
 *
 * @arg affected_picture_id
 * @text 被影响的图片ID
 * @type number
 * @min 1
 * @desc 需要移除遮罩的图片的ID。
 */

(() => {
    'use strict';

    // 获取插件名称，用于注册MZ插件命令
    const pluginName = "PictureMask";

    // --- MZ 插件命令注册 ---
    // 这个部分仅在 RPG Maker MZ 中生效
    if (PluginManager.registerCommand) {
        // 注册 SETMASK 命令
        PluginManager.registerCommand(pluginName, "SETMASK", args => {
            // 将参数从字符串转换为数字
            const affectedId = Number(args.affected_picture_id);
            const maskId = Number(args.mask_picture_id);
            
            // 获取被影响的图片对象
            const picture = $gameScreen.picture(affectedId);
            if (picture) {
                // 设置其遮罩ID
                picture.setMask(maskId);
            }
        });

        // 注册 REMOVEMASK 命令
        PluginManager.registerCommand(pluginName, "REMOVEMASK", args => {
            // 将参数从字符串转换为数字
            const affectedId = Number(args.affected_picture_id);
            
            // 获取被影响的图片对象
            const picture = $gameScreen.picture(affectedId);
            if (picture) {
                // 移除遮罩（通过将遮罩ID设置为0）
                picture.setMask(0);
            }
        });
    }

    // --- MV 插件命令支持 ---
    // 这个部分是为了兼容 RPG Maker MV
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        // 首先调用原始方法，确保其他插件的命令能正常工作
        _Game_Interpreter_pluginCommand.call(this, command, args);

        // 将命令转换为大写，方便比较，避免大小写问题
        const upperCaseCommand = command.toUpperCase();
        
        if (upperCaseCommand === 'SETMASK') {
            // 解析参数：args[0] 是被影响图片ID, args[1] 是遮罩图片ID
            const affectedId = Number(args[0]);
            const maskId = Number(args[1]);
            const picture = $gameScreen.picture(affectedId);
            if (picture) {
                picture.setMask(maskId);
            }
        }

        if (upperCaseCommand === 'REMOVEMASK') {
            // 解析参数：args[0] 是被影响图片ID
            const affectedId = Number(args[0]);
            const picture = $gameScreen.picture(affectedId);
            if (picture) {
                picture.setMask(0); // 移除遮罩
            }
        }
    };

    // --- 扩展游戏数据对象 ---

    // 扩展 Game_Picture 类以存储遮罩信息

    // 保存 Game_Picture 原始的 initialize 方法
    const _Game_Picture_initialize = Game_Picture.prototype.initialize;
    // 重写 initialize 方法
    Game_Picture.prototype.initialize = function() {
        // 调用原始的 initialize 方法
        _Game_Picture_initialize.call(this);
        // 初始化遮罩图片ID，0表示没有遮罩
        this._maskPictureId = 0;
    };

    // 为 Game_Picture 添加设置遮罩ID的方法
    Game_Picture.prototype.setMask = function(maskPictureId) {
        this._maskPictureId = maskPictureId;
    };

    // 为 Game_Picture 添加获取遮罩ID的方法
    Game_Picture.prototype.maskPictureId = function() {
        return this._maskPictureId;
    };

    // --- 扩展游戏精灵对象 ---

    // 扩展 Sprite_Picture 类以实现实际的遮罩渲染

    // 保存 Sprite_Picture 原始的 update 方法
    const _Sprite_Picture_update = Sprite_Picture.prototype.update;
    // 重写 update 方法
    Sprite_Picture.prototype.update = function() {
        // 调用原始的 update 方法
        _Sprite_Picture_update.call(this);
        // 在每帧更新时，都检查并更新遮罩状态
        this.updateMask();
    };
    
    // 为 Sprite_Picture 添加更新遮罩的方法
    Sprite_Picture.prototype.updateMask = function() {
        // 获取当前精灵对应的 Game_Picture 对象
        const picture = this.picture();
        if (picture && this.parent) {
            // 获取遮罩ID
            const maskId = picture.maskPictureId();
            if (maskId > 0) {
                // 如果存在遮罩ID，则寻找对应的遮罩精灵
                // this.parent 是图片所在的容器 (Spriteset_Base 的 _pictureContainer)
                // 我们在它的子元素中寻找与 maskId 匹配的 Sprite_Picture 实例
                // 图片ID是1开始的，数组索引是0开始的，所以需要减1
                const maskSprite = this.parent.children[maskId - 1];
                
                // 如果找到了遮罩精灵，就将其赋值给当前精灵的 mask 属性
                // 如果没找到（可能遮罩图片还没加载或ID无效），就将 mask 设为 null
                this.mask = maskSprite || null;

            } else {
                // 如果遮罩ID为0或无效，确保移除遮罩
                this.mask = null;
            }
        } else {
            // 如果精灵没有关联的 picture 对象，也确保移除遮罩
            this.mask = null;
        }
    };

})();
