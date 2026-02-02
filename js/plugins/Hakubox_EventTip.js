//=============================================================================
// ** RPG Maker MV - Hakubox_EventTip.js
//=============================================================================

// #region 脚本注释
/*:
 * @plugindesc NPC动作插件 (v1.0.0)
 * @version 1.0.0
 * @author hakubox
 * @email hakubox226@gmail.com
 * @base Hakubox_ActorAttaSystem
 * @orderAfter Hakubox_ActorAttaSystem
 * @target MV
 *
 * @help
 * 一个NPC动作插件，可以对NPC执行某些特定动作
 * 
 * 
 *
 * ■ [ 从脚本中使用插件命令 ] .............................................
 * 插件命令的功能也可以从脚本中使用。
 * MV版本不支持插件命令本身，因此如果您想在插件命令中使用该功能，需要
 * 使用此脚本，以下是可调用的脚本列表，同时脚本命令与MZ插件指令完全相同。
 * 
 * 
 * ■ [ 联系方式 ] ........................................................
 * 
 * 微信：hakubox
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
 *  v1.0.0  2025/06/15  初版。
 * 
 * 
 * @param showTooltip
 * @text 显示提示开关
 * @desc 是否显示文本提示的开关
 * @type switch
 * 
 * @param nameShowRange
 * @parent npcname
 * @text 显示名称距离
 * @desc 显示NPC名称的距离，默认6格
 * @type number
 * @default 5
 *
 * 
 */
(() => {
  /** 插件名称 */
  const PluginName = document.currentScript ? decodeURIComponent(document.currentScript.src.match(/^.*\/(.+)\.js$/)[1]) : "Hakubox_EventTip";

  const typeDefine = {
  };

  // #region 插件参数

  const params = PluginParamsParser.parse(PluginManager.parameters(PluginName), typeDefine);

  /** NPC名称显示类 */
  const NPCNameInfo = {
    /** 显示名称的NPC的Map @type {Map<string, string>} */
    mapInfos: [],
    /** 最大浮动高度 */
    maxFloatHeight: 10,
    /** 显示名称和互动 */
    visible: true,
    /** 刷新 */
    refresh() {
      this.mapInfos = [];
    },
    /** 显示名称 */
    showName(eventId, npcId, eventName) {
      const _npc = Object.assign({},
        npcConfig.npcInfos[npcId],
        npcConfig.npc[$gameMap._mapId][$dataMap.events[eventId].name]
      );
      let _text = '';
      if (npcId) {
        if (!_npc) {
          throw new Error(`未找到NPC信息：${npcId}`);
        } else {
          _text = _npc.name;
        }
      } else {
        _text = eventName;
      }

      if (!this.mapInfos[eventId]) {
        const _container = new PIXI.Container();
        const _nameSprite = new Sprite(new Bitmap(240, 30));
        const _actionThumbnailSprite = new Sprite(new Bitmap(240, 40));
        _actionThumbnailSprite.y = 30;
        _container.addChild(_nameSprite);
        _container.addChild(_actionThumbnailSprite);
        const { x, y } = this.getEventLoc(eventId);
        
        _actionThumbnailSprite.bitmap.fillRect(10, 0, 0, 36, 'rgba(0,0,0,0.5)');

        this.mapInfos[eventId] = {
          eventId: eventId,
          npcId: npcId,
          npcName: _text,
          frameIndex: 0,
          maxFrameCount: 10,
          visible: true,
          container: _container,
          isStart: true,
          nameSprite: _nameSprite,
          maxWidth: _nameSprite.bitmap.measureTextWidth(_text),
          maxY: y * 48 - this.maxFloatHeight - 10,
          hasTool: false
        };

        _container.x = this.x(x);
        _container.y = this.y(y) - this.maxFloatHeight;
        _nameSprite.x = -(this.mapInfos[eventId].maxWidth - 48) / 2;
        _nameSprite.bitmap.fontSize = 14;
        _container.alpha = 0;
        _nameSprite.bitmap.drawText(_text, 0, 0, this.mapInfos[eventId].maxWidth, 30, 'center');

        _actionThumbnailSprite.x = 0 * 36 / 2 + 16;


        if (SceneManager._scene instanceof Scene_Map) {
          SceneManager._scene._spriteset.addChild(_container);
        } else {
          SceneManager._scene.addChild(_container);
        }
      } else if (!this.mapInfos[eventId].isStart) {
        this.mapInfos[eventId].visible = true;
        this.mapInfos[eventId].isStart = true;
        this.mapInfos[eventId].frameIndex = 0;
      }
    },
    x(x) {
      return (x + $gameMap.adjustX(null)) * $gameMap.tileWidth();
    },
    y(y) {
      return (y + $gameMap.adjustY(null)) * $gameMap.tileHeight();
    },
    /** 隐藏名称 */
    hideName(eventId) {
      if (this.mapInfos[eventId] && !this.mapInfos[eventId].isStart) {
        this.mapInfos[eventId].visible = false;
        this.mapInfos[eventId].isStart = true;
        this.mapInfos[eventId].frameIndex = 0;
      }
    },
    /** 获取事件的位置 */
    getEventLoc(eventId) {
      const _event = $gameMap.events().find(i => i._eventId == eventId);
      if (_event) {
        return {
          x: _event._realX,
          y: _event._realY
        };
      } else {
        return {
          x: 0,
          y: 0
        };
      }
    },
    update() {
      for (let i = 0; i < this.mapInfos.length; i++) {
        const item = this.mapInfos[i];
        if (item) {
          if (NPCNameInfo.visible === false) {
            item.container.alpha = 0;
          } else if (NPCNameInfo.visible === true) {
            item.container.alpha = 1;
          }

          const { x, y } = this.getEventLoc(item.eventId);
          item.container.x = this.x(x);
          item.nameSprite.x = -(item.maxWidth - 48) / 2;
          if (item.hasTool) {
            item.maxY = this.y(y) - this.maxFloatHeight - 10 - 22;
            item.container.y = item.maxY - this.maxFloatHeight - 22;
          } else {
            item.maxY = this.y(y) - this.maxFloatHeight - 10;
            item.container.y = item.maxY - this.maxFloatHeight;
          }

          if (item.isStart) {
            if (item.frameIndex < item.maxFrameCount) {
              item.frameIndex++;
              const _progress = item.frameIndex / item.maxFrameCount;
              if (item.visible) {
                item.container.alpha = _progress;
                if (item.hasTool) {
                  item.container.y = item.maxY - this.maxFloatHeight * _progress - 22;
                } else {
                  item.container.y = item.maxY - this.maxFloatHeight * _progress;
                }
              } else {
                item.container.alpha = 1 - _progress;
                if (item.hasTool) {
                  item.container.y = item.maxY - this.maxFloatHeight * (1 - _progress) - 22;
                } else {
                  item.container.y = item.maxY - this.maxFloatHeight * (1 - _progress);
                }
              }
            } else {
              if (item.visible) {
                item.isStart = false;
              } else {
                if (item.container.parent) {
                  item.container.parent.removeChild(item.container);
                }
                this.mapInfos[i] = undefined;
              }
            }
          }

          if (
            item.container.parent && item.container.parent !== SceneManager._scene &&
            SceneManager._scene.constructor.name === 'Scene_Map'
          ) {
            SceneManager._scene.addChild(item.container);
          }
        }
      }

    },
    /** 获取范围内的NPC */
    getRangeNPC(distance) {
      let _x = $gamePlayer._realX;
      let _y = $gamePlayer._realY;

      const _events = $gameMap.events();
      const _npcList = [];

      for (let i = 0; i < _events.length; i++) {
        const _event = _events[i];
        const _eventData = $dataMap.events[_event._eventId];

        const _eventName = _eventData.meta['event-name'];
        const _inRange = Math.abs(_event._realX - _x) + Math.abs(_event._realY - _y) <= distance;
        if (_eventName) {
          _npcList.push({
            event: _event,
            eventId: _event._eventId,
            eventName: _eventName,
            inRange: _inRange,
          });
        }
      }

      return _npcList;
    },
  };

  const Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
  Scene_Map.prototype.onMapLoaded = function () {
    Scene_Map_onMapLoaded.call(this);
  }

  let mapFrameIndex = 0;
  const maxMapFrameCound = 3;

  const Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function () {

    if (params.showTooltip && $gameSwitches.value(params.showTooltip) === true) {
      mapFrameIndex++;
      if (mapFrameIndex >= maxMapFrameCound) {
        mapFrameIndex = 0;
        const _npcList = NPCNameInfo.getRangeNPC(+params.nameShowRange);

        const _prevEventIds = NPCNameInfo.mapInfos.filter(i => i).map(i => i.eventId);
        const _nowEventIds = _npcList.filter(i => i.inRange).map(i => i.eventId);
        _nowEventIds.forEach(item => {
          if (!_prevEventIds.includes(item)) {
            const _npcItem = _npcList.find(i => i && i.eventId == item);
            const _mapInfo = npcConfig.npc[$gameMap._mapId];
            if (_mapInfo && _mapInfo[$dataMap.events[_npcItem.eventId].name]) {
              NPCNameInfo.showName(_npcItem.eventId, _npcItem.npcId, _npcItem.eventName);
            }
          }
        });
        _prevEventIds.forEach(item => {
          if (!_nowEventIds.includes(item)) {
            const _npcItem = _npcList.find(i => i && i.eventId == item);
            if (_npcItem) {
              NPCNameInfo.hideName(_npcItem.eventId);
            }
          }
        });
      }

      NPCNameInfo.update();
    }

    Scene_Map_update.call(this);
  }
})();