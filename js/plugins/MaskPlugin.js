/*:
 * @plugindesc Allows to use image masking on pictures
 * @version 1.0
 * @target MV MZ
 *
 * @help
 *
 * This plugin allows to use a picture image as a graphic mask of another
 * picture.
 *
 * A mask is an image that determines the visibility of pixels for another image.
 * White pixels on the mask image makes visible the pixels on the affected image.
 *
 * Commands
 *
 * SETMASK affected_picture_id    mask_picture_id
 * REMOVEMASK affected_picture_id
 *
 */

(function () {

	var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function (command, args) {
		_Game_Interpreter_pluginCommand.call(this, command, args);

		if (command === 'SETMASK') {
			id_1 = Number(args[0]) - 1;
			id_2 = Number(args[1]) - 1;
			SceneManager._scene._spriteset._pictureContainer.children[id_1].mask = SceneManager._scene._spriteset._pictureContainer.children[id_2];
		}

		if (command === 'REMOVEMASK') {
			id_1 = Number(args[0]) - 1;
			SceneManager._scene._spriteset._pictureContainer.children[id_1].mask = false;
		}
	}

})();
