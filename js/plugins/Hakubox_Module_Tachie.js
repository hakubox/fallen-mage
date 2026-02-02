//=============================================================================
// ** RPG Maker MZ - Hakubox_Module_Tachie.js
//=============================================================================

// #region 脚本注释
/*:
 * @plugindesc 定制模块 - 立绘操作插件 (v1.0.0)
 * @version 1.0.0
 * @author hakubox
 * @email hakubox@outlook.com
 * @target MZ
 * 
 * @help
 * 立绘处理相关插件。
 * 包含表情、基础位置、气泡效果、特殊效果等操作。
 * 
 * 
 * @command action_move
 * @text 立绘动作 - 移动
 * @desc 立绘动作 - 往某个坐标移动，逻辑等同渐隐或渐显
 * 
 * @arg actor
 * @text 角色
 * @type text
 * @default fern-tachie
 * 
 * @arg duration
 * @text 帧数
 * @type number
 * @default 10
 * 
 * @arg rx
 * @text X坐标
 * @type number
 * @min -10000
 * @max 10000
 * @default 20
 * 
 * @arg ry
 * @text Y坐标
 * @type number
 * @min -10000
 * @max 10000
 * @default 0
 * 
 * @arg isWait
 * @text 是否等待
 * @desc 是否等待
 * @type boolean
 * @on 等待
 * @off 不等待
 * @default true
 * 
 * 
 * @command action_fadeOut
 * @text 立绘动作 - 渐隐
 * @desc 立绘动作 - 从某个方向渐隐
 * 
 * @arg actor
 * @text 角色
 * @type text
 * @default fern-tachie
 * 
 * @arg duration
 * @text 帧数
 * @type number
 * @default 10
 * 
 * @arg rx
 * @text X坐标
 * @type number
 * @min -10000
 * @max 10000
 * @default 20
 * 
 * @arg ry
 * @text Y坐标
 * @type number
 * @min -10000
 * @max 10000
 * @default 0
 * 
 * @arg isWait
 * @text 是否等待
 * @desc 是否等待
 * @type boolean
 * @on 等待
 * @off 不等待
 * @default true
 * 
 * 
 * @command action_slideIn
 * @text 立绘动作 - 移入屏幕
 * @desc 立绘动作 - 从某个方向移入屏幕
 * 
 * @arg actor
 * @text 角色
 * @type text
 * @default fern-tachie
 * 
 * @arg duration
 * @text 帧数
 * @type number
 * @default 10
 * 
 * @arg dir
 * @text X坐标
 * @type select
 * @option 左
 * @value left
 * @option 右
 * @value right
 * @option 上
 * @value top
 * @option 下
 * @value bottom
 * 
 * @arg isWait
 * @text 是否等待
 * @desc 是否等待
 * @type boolean
 * @on 等待
 * @off 不等待
 * @default true
 * 
 * 
 * @command action_slideOut
 * @text 立绘动作 - 移出屏幕
 * @desc 立绘动作 - 从某个方向移出屏幕
 * 
 * @arg actor
 * @text 角色
 * @type text
 * @default fern-tachie
 * 
 * @arg duration
 * @text 帧数
 * @type number
 * @default 10
 * 
 * @arg dir
 * @text X坐标
 * @type select
 * @option 左
 * @value left
 * @option 右
 * @value right
 * @option 上
 * @value top
 * @option 下
 * @value bottom
 * 
 * @arg isWait
 * @text 是否等待
 * @desc 是否等待
 * @type boolean
 * @on 等待
 * @off 不等待
 * @default true
 * 
 * 
 * 
 * 
 * 
 * @command showBalloon
 * @text 显示气泡 - 通用
 * 
 * @arg actor
 * @text 角色
 * @type text
 * @default fern-tachie
 * 
 * @arg balloonName
 * @text 气泡名称
 * @desc 气泡名称
 * @type select
 * @option 兴奋（左
 * @value e01_L,兴奋（左
 * @option 兴奋（右
 * @value e01_R,兴奋（右
 * @option 惊讶1
 * @value e02,惊讶1
 * @option 惊讶2
 * @value e03,惊讶2
 * @option 新主意
 * @value e04,新主意
 * @option 晕眩
 * @value e05,晕眩
 * @option 疑问1
 * @value e06,疑问1
 * @option 疑问2
 * @value e07,疑问2
 * @option 喜欢
 * @value e08,喜欢
 * @option 鲜花
 * @value e09,鲜花
 * @option 混乱1
 * @value e10,混乱1
 * @option 生气
 * @value e11,生气
 * @option 流汗
 * @value e12,流汗
 * @option 慌张（左
 * @value e13_L,慌张（左
 * @option 慌张（右
 * @value e13_R,慌张（右
 * @option 轻微生气（左
 * @value e14_L,轻微生气（左
 * @option 轻微生气（右
 * @value e14_R,轻微生气（右
 * @option 心碎
 * @value e15,心碎
 * @option 音符
 * @value e16,音符
 * @option 冒泡
 * @value e17,冒泡
 * @option 麻了（左
 * @value e18_L,麻了（左
 * @option 麻了（右
 * @value e18_R,麻了（右
 * @option 兴高采烈（左
 * @value e19_L,兴高采烈（左
 * @option 兴高采烈（右
 * @value e19_R,兴高采烈（右
 * @option 糟心
 * @value e20,糟心
 * @option 睡觉
 * @value e21,睡觉
 * @option 混乱
 * @value e22,混乱
 * @option 思考
 * @value e23,思考
 * @option 星星
 * @value e24,星星
 * @option 爆炸
 * @value e25,爆炸
 * @option 生气惊讶（左
 * @value e26_L,生气惊讶（左
 * @option 生气惊讶（右
 * @value e26_R,生气惊讶（右
 * 
 * @arg loc
 * @text 气泡位置
 * @desc 气泡位置
 * @type select
 * @option 左边
 * @value left
 * @option 右边
 * @value right
 * @default left
 * 
 * 
 * @command action_shake
 * @text 立绘动作 - 震动
 * @desc 立绘动作 - 立绘震动
 * 
 * @arg actor
 * @text 角色
 * @type text
 * @default fern-tachie
 * 
 * @arg duration
 * @text 帧数
 * @type number
 * @default 30
 * 
 * @arg loop
 * @text 循环次数
 * @desc 循环次数，注意需要是双数
 * @type number
 * @default 1
 * 
 * @arg power
 * @text 强度
 * @desc 震动强度，默认为10
 * @type number
 * @max 100
 * @default 10
 * 
 * @arg frequency
 * @text 频率
 * @desc 震动频率，默认为2
 * @type number
 * @max 100
 * @default 2
 * 
 * @arg dir
 * @text 方向
 * @desc 震动方向，默认为水平
 * @type select
 * @option horizontal - 水平
 * @value horizontal
 * @option vertical - 竖直
 * @value vertical
 * @default horizontal
 * 
 * @arg isWait
 * @text 是否等待
 * @desc 是否等待
 * @type boolean
 * @on 等待
 * @off 不等待
 * @default true
 * 
 * 
 * @command action_rumble
 * @text 立绘动作 - 随机震动
 * @desc 立绘动作 - 立绘随机震动
 * 
 * @arg actor
 * @text 角色
 * @type text
 * @default fern-tachie
 * 
 * @arg duration
 * @text 帧数
 * @type number
 * @default 50
 * 
 * @arg loop
 * @text 循环次数
 * @desc 循环次数，注意需要是双数
 * @type number
 * @default 1
 * 
 * @arg power
 * @text 强度
 * @desc 震动强度，默认为12
 * @type number
 * @max 100
 * @default 12
 * 
 * @arg frequency
 * @text 频率
 * @desc 震动频率，默认为1，同时强烈建议保持1不变
 * @type number
 * @max 100
 * @default 1
 * 
 * @arg isWait
 * @text 是否等待
 * @desc 是否等待
 * @type boolean
 * @on 等待
 * @off 不等待
 * @default true
 * 
 * 
 * @command action_nod
 * @text 立绘动作 - 点头
 * @desc 立绘动作 - 点头动作
 * 
 * @arg actor
 * @text 角色
 * @type text
 * @default fern-tachie
 * 
 * @arg loop
 * @text 循环次数
 * @type number
 * @default 1
 * 
 * @arg duration
 * @text 帧数
 * @type number
 * @default 30
 * 
 * @arg power
 * @text 强度
 * @desc 震动强度（像素），默认为60
 * @type number
 * @max 1000
 * @default 60
 * 
 * @arg isWait
 * @text 是否等待
 * @desc 是否等待
 * @type boolean
 * @on 等待
 * @off 不等待
 * @default true
 * 
 * 
 * @command action_jump
 * @text 立绘动作 - 跳跃
 * @desc 立绘动作 - 跳跃动作
 * 
 * @arg actor
 * @text 角色
 * @type text
 * @default fern-tachie
 * 
 * @arg loop
 * @text 循环次数
 * @type number
 * @default 1
 * 
 * @arg duration
 * @text 帧数
 * @type number
 * @default 30
 * 
 * @arg power
 * @text 强度
 * @desc 震动强度（像素），默认为40
 * @type number
 * @max 100
 * @default 40
 * 
 * @arg isWait
 * @text 是否等待
 * @desc 是否等待
 * @type boolean
 * @on 等待
 * @off 不等待
 * @default true
 * 
 * 
 * @command action_breath
 * @text 立绘动作 - 呼吸
 * @desc 立绘动作 - 呼吸动作
 * 
 * @arg actor
 * @text 角色
 * @type text
 * @default fern-tachie
 * 
 * @arg loop
 * @text 循环次数
 * @type number
 * @default 1
 * 
 * @arg duration
 * @text 帧数
 * @type number
 * @default 30
 * 
 * @arg power
 * @text 强度
 * @desc 震动强度（像素），默认为1
 * @type number
 * @max 10
 * @default 1
 * 
 * @arg isWait
 * @text 是否等待
 * @desc 是否等待
 * @type boolean
 * @on 等待
 * @off 不等待
 * @default true
 * 
 * 
 * @command picture_action_shake
 * @text 图片动作 - 震动
 * @desc 图片动作 - 图片震动
 * 
 * @arg pictureNumber
 * @text 图片序号
 * @desc 图片序号
 * @type number
 * @min 1
 * @max 100
 * 
 * @arg duration
 * @text 帧数
 * @type number
 * @default 30
 * 
 * @arg loop
 * @text 循环次数
 * @desc 循环次数，注意需要是双数
 * @type number
 * @default 1
 * 
 * @arg power
 * @text 强度
 * @desc 震动强度，默认为10
 * @type number
 * @max 100
 * @default 10
 * 
 * @arg frequency
 * @text 频率
 * @desc 震动频率，默认为2
 * @type number
 * @max 100
 * @default 2
 * 
 * @arg dir
 * @text 方向
 * @desc 震动方向，默认为水平
 * @type select
 * @option horizontal - 水平
 * @value horizontal
 * @option vertical - 竖直
 * @value vertical
 * @default horizontal
 * 
 * @arg isWait
 * @text 是否等待
 * @desc 是否等待
 * @type boolean
 * @on 等待
 * @off 不等待
 * @default true
 * 
 * 
 * @command picture_action_fadeOut
 * @text 图片动作 - 渐隐
 * @desc 图片动作 - 从某个方向渐隐
 * 
 * @arg pictureNumber
 * @text 图片序号
 * @desc 图片序号
 * @type number
 * @min 1
 * @max 100
 * 
 * @arg duration
 * @text 帧数
 * @type number
 * @default 10
 * 
 * @arg rx
 * @text X坐标
 * @type number
 * @min -10000
 * @max 10000
 * @default 20
 * 
 * @arg ry
 * @text Y坐标
 * @type number
 * @min -10000
 * @max 10000
 * @default 0
 * 
 * @arg isWait
 * @text 是否等待
 * @desc 是否等待
 * @type boolean
 * @on 等待
 * @off 不等待
 * @default true
 * 
 */
// #endregion
(() => {
  /** 插件名称 */
  const PluginName = document.currentScript ? decodeURIComponent(document.currentScript.src.match(/^.*\/(.+)\.js$/)[1]) : "Hakubox_Module_Tachie";
  
  const typeDefine = {
  };
  
  const params = PluginParamsParser.parse(PluginManager.parameters(PluginName), typeDefine);
  
  // #region 命令列表

  /** 命令列表 */
  const Commands = {
    /** 设定当前焦点角色 */
    active: {
      exec(element, action, config) {
        if (typeof config.name === 'string') {
          skitModule.active(config.name);
        } else if (Array.isArray(config.name)) {
          skitModule.active.apply(skitModule, config.name);
        }
      },
      /**
       * 
       * @param {*} element 行动节点
       * @param {*} action 动作
       * @param {*} progress 百分比进度
       * @param {*} config 配置项
       */
      update(element, action, progress, config) {
      }
    },
    /** 切换状态 */
    state: {
      exec(element, action, config) {
        if (config.duration <= 1) {
          skitModule.changeElementState(element.name, config.state);
          action.isComplete = true;
        } else {
          const _elementIndex = skitInfo.children.findIndex(child => child && child.name === element.name);
          if (_elementIndex < 0) throw new Error(`Element ${element.name} not found`);

          const _oldElement = skitInfo.children[_elementIndex];
          const _newElement = skitModule.getElement(element.name, config.state || _oldElement.state, true);
          _newElement.isTemp = true;
          _newElement.container.x = _oldElement.container.x;
          _newElement.container.y = _oldElement.container.y;
          _newElement.container._isGray = _oldElement.container._isGray;
          _newElement.onComplete(() => {
            _newElement.container.canRemove = true;
            element.newElement = _newElement;
            skitInfo.container.addChildAt(element.newElement.container, _elementIndex);
          });
        }
      },
      /**
       * 
       * @param {*} element 行动节点
       * @param {*} action 动作
       * @param {*} progress 百分比进度
       * @param {*} config 配置项
       */
      update(element, action, progress, config) {
        if (!element || action.isComplete) return;
        element.container.alpha = 1 - progress;
        element.newElement.container.alpha = Math.min(progress * 2, 1);

        if (progress >= 1) {

          const _elementIndex = skitInfo.children.findIndex(child => child && child.name === element.name && !child.isTemp);
          if (_elementIndex >= 0) {
            skitInfo.children.splice(_elementIndex, 1, element.newElement);

            const _containerIndex = skitInfo.container.children.findIndex(child => child && child === element.container && !child.canRemove);
            if (_containerIndex >= 0) {
              skitInfo.container.removeChildAt(_containerIndex);
            }

            const _newElement = skitInfo.children.find(child => child && child.name === element.name);
            if (_newElement) {
              delete _newElement.isTemp;
            }
          }
        }
      }
    },
    /** 呼吸动画 */
    breath: {
      exec(element, action, config) {
        element.scale.x = 1;
        element.scale.y = 1;
        action.scaleX = element.scale.x;
        action.scaleY = element.scale.y;
      },
      update(element, action, progress, config) {
        // 计算当前的偏移量
        const _power = config.power || 1;

        // 使用余弦波计算缩放偏移量
        const scaleOffset = (Math.cos(2 * Math.PI * progress)) * _power / 80;
        
        element.scale.x = action.scaleX + scaleOffset / 1.2;
        element.scale.y = action.scaleY + scaleOffset;


        
        // const easeInOutSine = (breath) => config.breathSpeed * Math.cos(Math.PI * breath); // 缓动函数

        // const breathEffectX = 0.005 * easeInOutSine(Graphics.frameCount / 180) / (element.scale.x * element.scale.x);
        // const breathEffectY = 0.005 * easeInOutSine(Graphics.frameCount / 60) / (element.scale.y * element.scale.y);

        // element.scale.x = 1 + breathEffectX; // 应用呼吸效果
        // element.scale.y = 1 + breathEffectY;
      }
    },
    /**
     * 镜像
     */
    mirror: {
      exec(element, action, config) {
        action.prevScaleX = element.container.scale.x || 0;
        action.prevScaleY = element.container.scale.y || 0;
      },
      update(element, action, progress, config) {
        const _startX = action.prevScaleX;
        const _startY = action.prevScaleY;

        let _endX = _startX == -1 ? 1 : -1;
        let _endY = _startY == -1 ? 1 : -1;

        switch (config.dir) {
          case 'x':
            element.container.scale.x = _startX + (_endX - _startX) * progress;
            break;
          case 'y':
            element.container.scale.y = _startY + (_endY - _startY) * progress;
            break;
          case 'xy':
            element.container.scale.x = _startX + (_endX - _startX) * progress;
            element.container.scale.y = _startY + (_endY - _startY) * progress;
            break;
        }

        if (progress >= 1) {
          element.container._isMirror = _endX == -1;
        }
      }
    },
    /**
     * 跳跃
     */
    jump: {
      exec(element, action, config) {
        action.prevX = element.x;
        action.prevY = element.y;
      },
      /**
       * 
       * @param {*} element 行动节点
       * @param {*} action 动作
       * @param {*} progress 百分比进度
       * @param {*} config 配置项
       */
      update(element, action, progress, config) {
        const _power = config.power || 60;

        const curve = -4 * _power * progress * (progress - 1); // 简单的抛物线方程

        element.y = action.prevY - curve;
      }
    },
    /**
     * 变换
     */
    transform: {
      exec(element, action, config) {
        const firstNode = element.container.children[0];
        if (config.scale !== undefined) {
          action.scaleX = firstNode.scale.x || 1;
          action.scaleY = firstNode.scale.y || 1;
        }
        if (config.rotate !== undefined) {
          action.rotate = firstNode.rotation || 0;
        }
        if (config.x !== undefined) {
          action.x = firstNode.x;
        }
        if (config.y !== undefined) {
          action.y = firstNode.y;
        }
      },
      /**
       * 
       * @param {*} element 行动节点
       * @param {*} action 动作
       * @param {*} progress 百分比进度
       * @param {*} config 配置项
       */
      update(element, action, progress, config) {

        let x;
        let y;
        let scaleX;
        let scaleY;
        let rotation;

        if (action.x !== undefined) {
          const _startX = action.x;
          const _endX = config.x;
          x = _startX + (_endX - _startX) * progress;
        }
        if (action.y !== undefined) {
          const _startY = action.y;
          const _endY = config.y;
          y = _startY + (_endY - _startY) * progress;
        }

        if (action.scaleX !== undefined) {
          const _startScaleX = action.scaleX;
          const _startScaleY = action.scaleY;
          const _endScaleX = config.scale;
          const _endScaleY = config.scale;

          scaleX = _startScaleX + (_endScaleX - _startScaleX) * progress;
          scaleY = _startScaleY + (_endScaleY - _startScaleY) * progress;
        }

        if (action.rotate !== undefined) {
          rotation = action.rotate + (config.rotate - action.rotate) * progress;
        }

        element.container.setTransform(
          x !== undefined ? x : element.container.x, y !== undefined ? y : element.container.y,
          scaleX, scaleY,
          rotation * (Math.PI / 180),
          0, 0,
          element.container.pivot.x, element.container.pivot.y
        );

      }
    },
    /**
     * 点头/下降
     */
    nod: {
      exec(element, action, config) {
        action.prevX = element.x;
        action.prevY = element.y;
      },
      /**
       * 
       * @param {*} element 行动节点
       * @param {*} action 动作
       * @param {*} progress 百分比进度
       * @param {*} config 配置项
       */
      update(element, action, progress, config) {
        const _power = config.power || 40;

        const curve = _power * progress * (progress - 1); // 简单的抛物线方程

        element.y = action.prevY - curve;
      }
    },
    /** 变换色调 */
    hue: {
      exec(element, action, config) {
        action.endR = 0;
        action.endG = 0;
        action.endB = 0;
      },
      /**
       * 
       * @param {*} element 行动节点
       * @param {*} action 动作
       * @param {*} progress 百分比进度
       * @param {*} config 配置项
       */
      update(element, action, progress, config) {
        let _endR = 0;
        let _endG = 0;
        let _endB = 0;

        if (config.r) {
          const _sr = config.r / config.duration * 2;
          if (config.bounce && progress > 0.5) {
            _endR = -_sr;
          } else {
            _endR = _sr;
          }
          if (action.endR + _endR < 0) _endR = action.endR;
          else if (action.endR + _endR > 255) _endR = 255 - action.endR;
          action.endR += _endR;
        }
        if (config.g) {
          const _sg = config.g / config.duration * 2;
          if (config.bounce && progress > 0.5) {
            _endG = -_sg;
          } else {
            _endG = _sg;
          }
          if (action.endG + _endG < 0) _endG = action.endG;
          else if (action.endG + _endG > 255) _endG = 255 - action.endG;
          action.endG += _endG;
        }
        if (config.b) {
          const _sb = config.b / config.duration * 2;
          if (config.bounce && progress > 0.5) {
            _endB = -_sb;
          } else {
            _endB = _sb;
          }
          if (action.endB + _endB < 0) _endB = action.endB;
          else if (action.endB + _endB > 255) _endB = 255 - action.endB;
          action.endB += _endB;
        }

        for (let i = 0; i < element.container.children.length; i++) {
          const child = element.container.children[i];
          if (child.constructor === Sprite) {
            let index = child.filters.findIndex(filter => filter instanceof PIXI.filters.ColorMatrixFilter);
            if (index >= 0) {
              child.filters[index].adjustTone.call(child.filters[index], _endR, _endG, _endB);
              child._refresh();
            }
          } else if (child.constructor === PIXI.Container) {
            for (let o = 0; o < child.children.length; o++) {
              const leafChild = child.children[o];
              let index = leafChild.filters.findIndex(filter => filter instanceof PIXI.filters.ColorMatrixFilter);
              if (index >= 0) {
                leafChild.filters[index].adjustTone.call(leafChild.filters[index], _endR, _endG, _endB);
                leafChild._refresh();
              }
            }
          }
        }
      }
    },
    /**
     * 震动
     */
    shake: {
      exec(element, action, config) {
        action.prevX = element._x === undefined ? element.x : element._x;
        action.prevY = element._y === undefined ? element.y : element._y;
      },
      update(element, action, progress, config) {
        const phase = progress < 0.5 ? 'strong' : 'fade';
        const _direction = config.dir || 'horizontal';
        const _frequency = config.frequency || 10;
        const _power = config.power || 8;

        // 计算当前的偏移量
        const sinFactor = Math.sin(progress * Math.PI * 2 * _frequency);
        let _offset;

        if (phase === 'strong') {
          // 猛烈摇动阶段
          const strongPower = _power * (1 - Math.pow(1 - progress, 2));
          _offset = sinFactor * strongPower;
        } else {
          // 减弱摇动阶段
          const fadePower = _power * (1 - (progress - 0.5) * 2);
          _offset = sinFactor * fadePower;
        }

        if (_direction === 'horizontal') {
          if (element._x !== undefined) element._x = action.prevX + _offset;
          else element.x = action.prevX + _offset;
        } else {
          if (element._x !== undefined) element._y = action.prevY + _offset;
          else element.y = action.prevY + _offset;
        }
      }
    },
    /**
     * 从高处掉落并反弹多次
     * @param {number} height - 掉落的初始高度
     * @param {number} count - 反弹的次数 (不包括初始掉落)
     * @param {number} power - 反弹力道/能量保留率 (0到1之间, 建议0.4-0.7)
     */
    dropBounce: {
      exec(element, action, config) {
        // 记录元素的最终静止位置（地面位置）
        action.groundY = element._y;
        // 获取配置参数，并设置默认值
        const _height = config.height || 100;
        // 动画开始时，将元素直接置于最高点
        element._y = action.groundY - _height;
      },
      update(element, action, progress, config) {
        const _height = config.height || 100;
        const _count = config.count || 3;
        const _power = config.power || 0.6;

        // 总共有 1次掉落 + count次反弹，所以总段数是 count + 1
        const totalSegments = _count + 1;
        // 计算每一段动画所占的时间比例
        const segmentDuration = 1.0 / totalSegments;

        // 确定当前 progress 处于第几段动画
        // Math.min 是为了防止 progress === 1.0 时，index 超出范围
        const currentIndex = Math.min(Math.floor(progress / segmentDuration), _count);

        // 计算当前这段动画的内部进度 (0.0 to 1.0)
        const progressInSegment = (progress - (currentIndex * segmentDuration)) / segmentDuration;

        let offset;

        if (currentIndex === 0) {
          // === 阶段0: 初始掉落 ===
          // 这是一个从1到0的二次方缓动（ease-in-quad），模拟重力加速
          const currentHeight = _height;
          offset = currentHeight * Math.pow(1 - progressInSegment, 2);
        } else {
          // === 阶段 1...count: 反弹 ===
          // 计算当前这次反弹的理论峰值高度
          // 第一次反弹高度是 height * power, 第二次是 height * power^2 ...
          // 所以第 N 次反弹 (currentIndex = N) 的高度是 height * power^N
          const currentHeight = _height * Math.pow(_power, currentIndex);
          
          // 使用一个 4x(1-x) 的抛物线公式来模拟一次完整的弹跳
          // 当 progressInSegment 从 0 -> 0.5 -> 1
          // 抛物线的值会从 0 -> 1 -> 0
          const parabola = 4 * progressInSegment * (1 - progressInSegment);
          offset = currentHeight * parabola;
        }

        // 更新元素的 Y 坐标
        // action.groundY 是地面位置，offset 是当前高于地面的距离
        if (element._y !== undefined) element._y = action.groundY - offset;
        else element.y = action.groundY - offset;
      }
    },
    /**
     * 随机方向震动
     */
    rumble: {
      exec(element, action, config) {
        action.originX = element.x;
        action.originY = element.y;
        
        // 震动间隔的起点和目标点
        action.rumbleStartX = 0;
        action.rumbleStartY = 0;
        action.rumbleTargetX = 0;
        action.rumbleTargetY = 0;
        
        // 上一个间隔开始的时间
        action.lastIntervalProgress = 0;

        // 辅助函数：线性插值 (Lerp)
        action.lerp = (start, end, t) => {
          return start * (1 - t) + end * t;
        }

        // 辅助函数：平滑曲线，让过渡更自然
        action.easeInOutQuad = (x) => {
          return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
        }
      },
      update(element, action, progress, config) {
        
        // 1. 获取配置参数
        const _power = config.power || 12;
        const _duration = config.duration || 50; // 总帧数，默认60帧
        // 每隔多少帧更新一次震动目标，默认1帧
        const _interval = config.frequency || 1;
        const _minPowerFactor = 0.7;

        // 2. 计算出每个小间隔占总进度的比例
        const intervalAsProgress = _interval / _duration;

        // 3. 检查是否进入了下一个新的震动间隔
        if (progress >= action.lastIntervalProgress + intervalAsProgress) {
            // 将上一个目标点设为新的起点
            action.rumbleStartX = action.rumbleTargetX;
            action.rumbleStartY = action.rumbleTargetY;

            // a. 计算当前衰减后的总强度
            const currentPower = _power * (1 - progress);
    
            // b. 生成一个随机方向 (0 to 2π 弧度)
            const angle = Math.random() * 2 * Math.PI;
    
            // c. 生成一个随机强度系数，范围在 [minPowerFactor, 1.0] 之间
            const randomStrength = Math.random() * (1 - _minPowerFactor) + _minPowerFactor;
    
            // d. 结合方向和强度，计算出新的目标偏移量
            action.rumbleTargetX = Math.cos(angle) * randomStrength * currentPower;
            action.rumbleTargetY = Math.sin(angle) * randomStrength * currentPower;
    
            action.lastIntervalProgress += intervalAsProgress;
        }

        // 4. 计算当前在“小间隔”内的进度 (0 to 1)
        const progressWithinInterval = (progress - action.lastIntervalProgress) / intervalAsProgress;
        
        // 5. 使用平滑曲线美化小间隔内的过渡，让运动不死板
        const smoothedIntervalProgress = action.easeInOutQuad(progressWithinInterval);

        // 6. 使用线性插值，计算出当前帧从起点到目标点的平滑位置
        const offsetX = action.lerp(action.rumbleStartX, action.rumbleTargetX, smoothedIntervalProgress);
        const offsetY = action.lerp(action.rumbleStartY, action.rumbleTargetY, smoothedIntervalProgress);

        // 7. 应用最终计算出的偏移量到元素的原始位置上
        if (element._y !== undefined) {
          element._x = action.originX + offsetX;
          element._y = action.originY + offsetY;
        } else {
          element.x = action.originX + offsetX;
          element.y = action.originY + offsetY;
        }

        // 8. 动画结束时，强制将元素归位，消除任何浮点数误差
        if (progress === 1) {
          if (element._y !== undefined) {
            element._x = action.originX;
            element._y = action.originY;
          } else {
            element.x = action.originX;
            element.y = action.originY;
          }
        }
      }
    },
    /** 震动屏幕 */
    shakeScreen: {
      exec(element, action, config) {
        $gameScreen.startShake(
          config.power,
          config.speed,
          config.duration
        );
      },
      update(element, action, progress, config) {
      }
    },
    /** 播放背景音乐 */
    bgm: {
      exec(element, action, config) {
        AudioManager.playBgm({
          name: config.name,
          volume: config.volume || 100,
          pitch: 100,
          pan: 0,
        });
        AudioManager.fadeInBgm(10);
      },
      update(element, action, progress, config) {
        if (progress >= 1) {
          AudioManager.fadeOutBgm(10);
          AudioManager.stopBgm();
        }
      }
    },
    /** 播放声音 */
    sound: {
      exec(element, action, config) {
        AudioManager.playSe({
          name: config.name,
          volume: config.volume || ConfigManager.seVolume,
          pitch: 100,
          pan: 0,
        });
      },
      update(element, action, progress, config) {
        if (progress >= 1) {
          AudioManager.stopSe();
        }
      }
    },
    move: {
      exec(element, action, config) {
        if (config.rx) {
          action.prevX = element.x;
          action.nextX = element.x + config.rx;
        }
        if (config.ry) {
          action.prevY = element.y;
          action.nextY = element.y + config.ry;
        }
      },
      update(element, action, progress, config) {
        if (config.rx) {
          element.x = action.prevX + (action.nextX - action.prevX) * progress;
        }
        if (config.ry) {
          element.y = action.prevY + (action.nextY - action.prevY) * progress;
        }

        if (progress >= 1) {
          if (config.rx) element.x = action.nextX;
          if (config.ry) element.y = action.nextY;
        }
      }
    },
    /**
     * 渐显
     */
    fadeIn: {
      exec(element, action, config) {
        if (config.rx) {
          action.prevX = element.x - config.rx;
          action.nextX = element.x;
        }
        if (config.ry) {
          action.prevY = element.y - config.ry;
          action.nextY = element.y;
        }
      },
      update(element, action, progress, config) {
        // if (!element || !element.parent) return;
        element.alpha = progress;

        if (config.rx) {
          element.x = action.prevX + (action.nextX - action.prevX) * progress;
        }
        if (config.ry) {
          element.y = action.prevY + (action.nextY - action.prevY) * progress;
        }

        if (progress >= 1) {
          element.alpha = 1;
          if (config.rx) element.x = action.nextX;
          if (config.ry) element.y = action.nextY;
        }
      }
    },
    /**
     * 渐隐
     * @param { {  } } config 
     */
    fadeOut: {
      exec(element, action, config) {
        if (element instanceof Game_Picture) {
          if (config.rx) {
            action.prevX = element._x;
            action.nextX = element._x + config.rx;
          }
          if (config.ry) {
            action.prevY = element._y;
            action.nextY = element._y + config.ry;
          }
        } else {
          if (config.rx) {
            action.prevX = element.x;
            action.nextX = element.x + config.rx;
          }
          if (config.ry) {
            action.prevY = element.y;
            action.nextY = element.y + config.ry;
          }
        }
      },
      update(element, action, progress, config) {
        if (element instanceof Game_Picture) {
          element._opacity = Math.floor(255 * (1 - progress));

          if (config.rx) {
            element._x = action.prevX + (action.nextX - action.prevX) * progress;
          }
          if (config.ry) {
            element._y = action.prevY + (action.nextY - action.prevY) * progress;
          }

          if (progress >= 1) {
            if (element.alpha !== undefined) {
              element.alpha = 0;
            } else {
              element._opacity = 0;
            }
            if (config.rx) element._x = action.nextX;
            if (config.ry) element._y = action.nextY;
            $gameScreen.erasePicture(config.pictureId);
          }
        } else {
          element.alpha = 1 - progress;

          if (config.rx) {
            element.x = action.prevX + (action.nextX - action.prevX) * progress;
          }
          if (config.ry) {
            element.y = action.prevY + (action.nextY - action.prevY) * progress;
          }

          if (progress >= 1) {
            if (element.alpha !== undefined) {
              element.alpha = 0;
            } else {
              element._opacity = 0;
            }
            if (config.rx) element.x = action.nextX;
            if (config.ry) element.y = action.nextY;
          }
        }
      }
    },
    /**
     * 淡入淡出，后续回到原位
     * @param { {  } } config 
     */
    fade: {
      exec(element, action, config) {
        if (config.x) {
          action.prevX = element.container.x;
          action.nextX = element.container.x + config.x;
        }
        if (config.y) {
          action.prevY = element.container.y;
          action.nextY = element.container.y + config.y;
        }
        element.canFadeIn = element.container.alpha < 0.5 ? true : false;
      },
      update(element, action, progress, config) {
        let _progress = progress / (1 - config.loopDelay / 100);
        let phase = _progress < 0.5 ? 'in' : 'out';

        if (phase === 'in') {
          if (element.canFadeIn) {
            element.container.alpha = _progress * 2;
          } else {
            element.container.alpha = 1 - _progress * 2;
          }
        } else if (phase === 'out') {
          if (element.canFadeIn) {
            element.container.alpha = 2 - _progress * 2;
          } else {
            element.container.alpha = 1 - _progress * 2;
          }
        }

        if (config.x) {
          element.container.x = action.prevY + (action.nextX - action.prevY) * _progress;
        }
        if (config.y) {
          element.container.y = action.prevY + (action.nextY - action.prevY) * _progress;
        }

        if (progress >= 1) {
          if (config.x) element.container.x = action.prevX;
          if (config.y) element.container.y = action.prevY;
        }
      }
    },
    /**
     * 从一侧进入
     * @param { { dir: 'top'|'left'|'right'|'bottom', loc: string } } config 
     */
    slideIn: {
      exec(element, action, config) {
        let _startLoc = 0;
        let _endLoc = 0;
        const _tachieConfig = locConfigList.find(child => child.configTag === config.loc);

        if (!config.dir) throw new Error('Direction is required');
        if (!config.loc) throw new Error('Location Config is required');

        if (config.dir === 'left') {
          _startLoc = -element.container.width * element.container.anchorX * element.container.scale.x;
          if (config.x) {
            _endLoc = config.x;
          } else if (_tachieConfig) {
            _endLoc = _tachieConfig.tachieLocX;
          }
        } else if (config.dir === 'right') {
          _startLoc = (Graphics.width + element.container.width * element.container.anchorX) * element.container.scale.x;
          if (config.x) {
            _endLoc = config.x;
          } else if (_tachieConfig) {
            _endLoc = _tachieConfig.tachieLocX;
          }
        } else if (config.dir === 'top') {
          _startLoc = -element.container.height * element.container.anchorY * element.container.scale.y;
          if (config.y) {
            _endLoc = config.y;
          } else if (_tachieConfig) {
            _endLoc = _tachieConfig.tachieLocY;
          }
        } else if (config.dir === 'bottom') {
          _startLoc = (Graphics.height + element.container.height * element.container.anchorY) * element.container.scale.y;
          if (config.y) {
            _endLoc = config.y;
          } else if (_tachieConfig) {
            _endLoc = _tachieConfig.tachieLocY;
          }
        }

        action.startLoc = _startLoc;
        action.endLoc = _endLoc;
      },
      update(element, action, progress, config) {
        let _startLoc = action.startLoc;
        let _endLoc = action.endLoc;

        if (config.dir === 'left') {
          element.container.x = _startLoc + (_endLoc - _startLoc) * progress;
        } else if (config.dir === 'right') {
          element.container.x = _startLoc + (_endLoc - _startLoc) * progress;
        } else if (config.dir === 'top') {
          element.container.y = _startLoc + (_endLoc - _startLoc) * progress;
        } else if (config.dir === 'bottom') {
          element.container.y = _startLoc + (_endLoc - _startLoc) * progress;
        }
      }
    },
    slideOut: {
      exec(element, action, config) {
        action.prevX = element.container.x;
        action.prevY = element.container.y;
      },
      update(element, action, progress, config) {
        let _startLoc = 0;
        let _endLoc = 0;

        if (config.dir === 'left') {
          _startLoc = action.prevX;
          _endLoc = -element.container.width * element.container.anchorX * element.container.scale.x;
          element.container.x = _startLoc + (_endLoc - _startLoc) * progress;
        } else if (config.dir === 'right') {
          _startLoc = action.prevX;
          _endLoc = (Graphics.width + element.container.width * element.container.anchorX) * element.container.scale.x;
          element.container.x = _startLoc + (_endLoc - _startLoc) * progress;
        } else if (config.dir === 'top') {
          _startLoc = action.prevY;
          _endLoc = -element.container.height * element.container.anchorY * element.container.scale.y;
          element.container.y = _startLoc + (_endLoc - _startLoc) * progress;
        } else if (config.dir === 'bottom') {
          _startLoc = action.prevY;
          _endLoc = (Graphics.height + element.container.height * element.container.anchorY) * element.container.scale.y;
          element.container.y = _startLoc + (_endLoc - _startLoc) * progress;
        }
      }
    },
    /** 缓存 */
    cache: {
      exec(element, action, config) {
        if (config.images && config.images.length) {
          action.imageIndex = 0;
          action.imageCount = config.images.length;
          for (let i = 0; i < config.images.length; i++) {
            const img = config.images[i];
            let _imgInstance;
            if (img.indexOf("img/") === 0) {
              _imgInstance = ImageManager.loadBitmap(img.substring(0, img.lastIndexOf("/") + 1), img.substring(img.lastIndexOf("/") + 1), 0, true);
            } else if (img.indexOf("pictures/") === 0) {
              _imgInstance = ImageManager.loadBitmap("img/", img, 0, true);
            } else {
              _imgInstance = ImageManager.loadBitmap("img/pictures/", img, 0, true);
            }
            if (_imgInstance.isReady()) {
              action.imageIndex++;
            } else {
              _imgInstance.addLoadListener(() => {
                action.imageIndex++;
              });
            }
          }
        }
      },
      update(element, action, progress, config, timeline) {
        if (action.imageIndex >= action.imageCount) {
          timeline.frameIndex = 0;
        }
      }
    },
    /** 修改开关 */
    switch: {
      exec(element, action, config) {
        if (!config.id) throw new Error('Switch ID is required');
        if (isNaN(config.value)) {
          $gameSwitches.setValue(config.id, +config.value);
        } else {
          $gameSwitches.setValue(config.id, config.value);
        }
      },
      update(element, action, progress, config) {
      }
    },
    /** 修改变量 */
    variable: {
      exec(element, action, config) {
        if (!config.id) throw new Error('Variable ID is required');
        if (isNaN(config.value)) {
          $gameVariables.setValue(config.id, +config.value);
        } else {
          $gameVariables.setValue(config.id, config.value);
        }
      },
      update(element, action, progress, config) {
      }
    },
    /** 添加日志/信息（左上角显示的内容） */
    log: {
      exec(element, action, config) {
        if (!SceneManager._scene._logWindow) {
          throw new Error('Log Window not found');
        }
        const _win = SceneManager._scene._logWindow;
        _win.addText(config.content);
        if (_win._lines.length >= _win.maxLines()) {
          _win._lines.pop();
        }
        _win.refresh();
      },
      update(element, action, progress, config) { }
    },
    /** 延时 */
    wait: {
      exec(element, action, config) { },
      update(element, action, progress, config) { }
    },
    /** 结束 */
    clear: {
      exec(element, action, config) {
        skitModule.clear();
      },
      update(element, action, progress, config) { }
    },
    /** 组合动作 */
    group: {
      exec(element, action, config) {
      },
      update(element, action, progress, config) {

        const _actions = action.actions;

        for (let i = _actions.length - 1; i >= 0; i--) {
          const _action = _actions[i];

          if (!_action.isStart) {
            Commands.exec(_action.action, _action, skitInfo.groupInfo[element.name].timeline, _action.config);
            _action.isStart = true;
          }
          if (_action.isStart) {
            _action.frameIndex -= 1;
            const _progress = (_action.duration - _action.frameIndex) / _action.duration;
            Commands.update(_action.action, _action, skitInfo.groupInfo[element.name].timeline, _progress, _action.config);
          }

          if (_action.frameIndex <= 0) {
            if (_action.loop === true) {
              _action.isStart = false;
              _action.frameIndex = _action.duration;
            } else if (!isNaN(_action.loop) && _action.loop > 1) {
              _action.isStart = false;
              _action.frameIndex = _action.duration;
              _action.loop--;
            } else {
              _actions.splice(i, 1);

              if (_actions.length) {
                _action.frameIndex = _action.duration;
              }
            }
          }
        }

        if (progress >= 1) return;
      }
    },
    /** 更新图层 */
    update(actionName, action, timeline, progress, config) {
      const _childrenIndex = skitInfo.children.findIndex(child => child && child.name === timeline.elementName);
      Commands[actionName].update(skitInfo.children[_childrenIndex], action, progress, config, timeline);
    },
    /** 执行 */
    exec(actionName, action, timeline, config) {
      if (Commands[actionName]) {
        if (timeline.elementName === 'main') {
          Commands[actionName].exec(undefined, action, config);
        } else {
          const _childrenIndex = skitInfo.children.findIndex(child => child && child.name === timeline.elementName);
          if (_childrenIndex < 0) throw new Error(`Element ${timeline.elementName} not found`);

          Commands[actionName].exec(skitInfo.children[_childrenIndex], action, config);
        }
      } else {
        throw new Error(`Command ${actionName} not found`);
      }
    }
  };

  // #endregion

  /**
   * 立绘处理模块
   */
  const tachieModule = {
    /**
     * 开始动作
     * @param {string} action 动作名称
     * @param {string} actor 执行动作的角色
     * @param {object} config 动作配置
     * @param {Function} callback 动作回调函数
     * @param {Game_Interpreter} interpreter 事件执行器
     */
    startAction(action, actor, config = {}, callback, interpreter) {
      let _actorElement;
      let _loop = config.loop === undefined ? 1 : config.loop;
      let _easingType = config.easingType || 'Linear';
      let _inout = config.inout || 'None';
      let _action = {};
      if (actor === 'fern-tachie') {
        _actorElement = Utils_Spine.getSpineById(actor);
      } else if (!isNaN(actor)) {
        _actorElement = $gameScreen._pictures[actor];
        config.pictureId = actor;
      } else if ((actor instanceof Sprite) || (actor instanceof PIXI.Container)) {
        _actorElement = actor;
      }

      if (!_actorElement) {
        console.error('Actor not found', actor);
        return;
      }
      
      const _fn = () => {
        if (_loop === 0) {
          if (callback) callback();
          return;
        }
        _loop--;
        
        if (interpreter && config.isWait === true) {
          interpreter.wait(config.duration);
        }

        Commands[action].exec(_actorElement, _action, config);
        useTimeout(() => {
          Commands[action].update(_actorElement, _action, 1, config);
          _fn();
        }, config.duration, (progress, frameIndex) => {
          if (!_actorElement || !(_actorElement instanceof Game_Picture) && !_actorElement.transform) {
            return;
          }
          
          const _progress = MotionEasing.getEasing(_easingType, _inout)(progress);
          Commands[action].update(_actorElement, _action, _progress, config);
        });
      }

      _fn();
    },
    /**
     * 隐藏立绘
     */
    hideTachie(actor, config) {
      const scene = SceneManager._scene;
      const spineName = actor + "Tachie";
      if (scene.tachieMap[spineName]) {
        let _spine = scene.tachieMap[spineName];
        if (_spine) {
          _spine.alpha = 0;
          const _index = $gameData.tempSceneInfo.spineList.indexOf(spineName);
          $gameData.tempSceneInfo.spineList.splice(_index);
        }
      }
    },
    /**
     * 显示气泡 - 通用
     * @param {string} balloonName 气泡名称
     * @param {string} actor 角色名称
     * @param {'left'|'right'} [loc='left'] 气泡方位
     */
    showBalloon(balloonName, actor, loc = 'left') {
      const scene = SceneManager._scene;
      const spineName = actor + "Tachie";
      const _spine = scene.tachieMap[spineName];
      let _left = 0;
      let _top = 0;

      if (_spine && spineName === _spine.tachieInfo.spineName) {
        const spine = _spine;

        if (actor === 'kana') {
          _top = 80;
        } else if (actor === 'chinatsu') {
          _top = 100;
        } else if (actor === 'yuki') {
          _top = 70;
        }
  
        if (spine.tachieInfo.location === 'left') {
          _left = 200;
        } else if (spine.tachieInfo.location === 'center') {
          _left = 460;
        } else if (spine.tachieInfo.location === 'right') {
          _left = 650;
        }
        
        if (loc === 'right') {
          _left += 200;
        }

        Utils_Balloon.showByLoc(balloonName, { left: _left, top: _top, parent: SceneManager._scene, loopCount: 1, speed: 3 });
      }
    },
  };

  /** 立绘工具类 */
  class Utils_Tachie {
    /**
     * 开始动作
     * @param {string} action 动作名称
     * @param {string} actor 执行动作的角色
     * @param {object} config 动作配置
     * @param {Function} callback 动作回调函数
     * @param {Game_Interpreter} interpreter 事件执行器
     */
    static startAction(action, actor, config, callback, interpreter) {
      tachieModule.startAction(action, actor, config, callback, interpreter);
    }
    /**
     * 隐藏立绘
     */
    static hideTachie(actor, config) {
      tachieModule.hideTachie(actor, config, this);
    }
    /**
     * 显示气泡 - 通用
     */
    static showBalloon(balloonName, actor, loc = 'left') {
      tachieModule.showBalloon(balloonName, actor, loc);
    }
  }
  window.Utils_Tachie = Utils_Tachie;


  if (Utils.RPGMAKER_NAME === "MZ") {
    // 显示气泡 - 通用
    PluginManager.registerCommand(PluginName, 'showBalloon', function(args) {
      tachieModule.showBalloon.call(this, args.balloonName.split(',')[0], args.actor, args.loc);
    });

    
    // 立绘动作 - 渐显
    PluginManager.registerCommand(PluginName, 'action_fadeIn', function(args) {
      const _info = $gameData.tempSceneInfo;
      const _spineName = args.actor + 'Tachie';
      if (_info.spineInfos[_spineName]) {
        _info.spineInfos[_spineName].alpha = 1;
      }
      if (!_info.spineList.includes(_spineName)) _info.spineList.push(_spineName);

      tachieModule.startAction.call(this, 'fadeIn', args.actor, {
        duration: Number(args.duration),
        rx: Number(args.rx),
        ry: Number(args.ry),
        easingType: args.easingType,
        inout: args.inout,
        isWait: args.isWait === 'true'
      }, undefined, this);
    });
    
    // 立绘动作 - 移动
    PluginManager.registerCommand(PluginName, 'action_move', function(args) {
      tachieModule.startAction.call(this, 'move', args.actor, {
        duration: Number(args.duration),
        rx: Number(args.rx),
        ry: Number(args.ry),
        easingType: args.easingType,
        inout: args.inout,
        isWait: args.isWait === 'true'
      }, undefined, this);
    });
    // 立绘动作 - 渐隐
    PluginManager.registerCommand(PluginName, 'action_fadeOut', function(args) {
      const _info = $gameData.tempSceneInfo;
      const _spineName = args.actor + 'Tachie';
      if (_info.spineInfos[_spineName]) {
        _info.spineInfos[_spineName].alpha = 0;
        // const _index = _info.spineList.findIndex(i => i ===_spineName);
        // if (_index >= 0) _info.spineList.splice(_index, 1);
      }

      tachieModule.startAction.call(this, 'fadeOut', args.actor, {
        duration: Number(args.duration),
        rx: Number(args.rx),
        ry: Number(args.ry),
        easingType: args.easingType,
        inout: args.inout,
        isWait: args.isWait === 'true'
      }, undefined, this);
    });
    // 立绘动作 - 移入屏幕
    PluginManager.registerCommand(PluginName, 'action_slideIn', function(args) {
      const _info = $gameData.tempSceneInfo;
      const _spineName = args.actor + 'Tachie';
      if (_info.spineInfos[_spineName]) {
        _info.spineInfos[_spineName].alpha = 0;
        // const _index = _info.spineList.findIndex(i => i ===_spineName);
        // if (_index >= 0) _info.spineList.splice(_index, 1);
      }

      tachieModule.startAction.call(this, 'slideIn', args.actor, {
        duration: Number(args.duration),
        dir: args.dir,
        easingType: args.easingType,
        inout: args.inout,
        isWait: args.isWait === 'true'
      }, undefined, this);
    });
    // 立绘动作 - 移出屏幕
    PluginManager.registerCommand(PluginName, 'action_slideOut', function(args) {
      const _info = $gameData.tempSceneInfo;
      const _spineName = args.actor + 'Tachie';
      if (_info.spineInfos[_spineName]) {
        _info.spineInfos[_spineName].alpha = 0;
        // const _index = _info.spineList.findIndex(i => i ===_spineName);
        // if (_index >= 0) _info.spineList.splice(_index, 1);
      }

      tachieModule.startAction.call(this, 'slideOut', args.actor, {
        duration: Number(args.duration),
        dir: args.dir,
        easingType: args.easingType,
        inout: args.inout,
        isWait: args.isWait === 'true'
      }, undefined, this);
    });

    
    // 立绘动作 - 立绘震动
    PluginManager.registerCommand(PluginName, 'action_shake', function(args) {
      tachieModule.startAction.call(this, 'shake', args.actor, {
        duration: Number(args.duration),
        loop: Number(args.loop),
        power: Number(args.power),
        frequency: Number(args.frequency),
        dir: args.dir,
        easingType: args.easingType,
        inout: args.inout,
        isWait: args.isWait === 'true'
      }, undefined, this);
    });
    // 立绘动作 - 立绘随机震动
    PluginManager.registerCommand(PluginName, 'action_rumble', function(args) {
      tachieModule.startAction.call(this, 'rumble', args.actor, {
        duration: Number(args.duration),
        loop: Number(args.loop),
        power: Number(args.power),
        frequency: Number(args.frequency),
        easingType: args.easingType,
        inout: args.inout,
        isWait: args.isWait === 'true'
      }, undefined, this);
    });
    // 立绘动作 - 点头
    PluginManager.registerCommand(PluginName, 'action_nod', function(args) {
      tachieModule.startAction.call(this, 'nod', args.actor, {
        duration: Number(args.duration),
        loop: Number(args.loop),
        power: Number(args.power),
        easingType: args.easingType,
        inout: args.inout,
        isWait: args.isWait === 'true'
      }, undefined, this);
    });
    // 立绘动作 - 跳跃
    PluginManager.registerCommand(PluginName, 'action_jump', function(args) {
      tachieModule.startAction.call(this, 'jump', args.actor, {
        duration: Number(args.duration),
        loop: Number(args.loop),
        power: Number(args.power),
        easingType: args.easingType,
        inout: args.inout,
        isWait: args.isWait === 'true'
      }, undefined, this);
    });
    // 立绘动作 - 呼吸效果
    PluginManager.registerCommand(PluginName, 'action_breath', function(args) {
      tachieModule.startAction.call(this, 'breath', args.actor, {
        duration: Number(args.duration),
        loop: Number(args.loop),
        power: Number(args.power),
        easingType: args.easingType,
        inout: args.inout,
        isWait: args.isWait === 'true'
      }, undefined, this);
    });
    
    // 图片动作 - 渐隐
    PluginManager.registerCommand(PluginName, 'picture_action_fadeOut', function(args) {
      tachieModule.startAction.call(this, 'fadeOut', args.pictureNumber, {
        duration: Number(args.duration),
        rx: Number(args.rx),
        ry: Number(args.ry),
        easingType: args.easingType,
        inout: args.inout,
        isWait: args.isWait === 'true'
      }, undefined, this);
    });
    // 图片动作 - 震动
    PluginManager.registerCommand(PluginName, 'picture_action_shake', function(args) {
      tachieModule.startAction.call(this, 'shake', args.pictureNumber, {
        duration: Number(args.duration),
        loop: Number(args.loop),
        power: Number(args.power),
        frequency: Number(args.frequency),
        dir: args.dir,
        easingType: args.easingType,
        inout: args.inout,
        isWait: args.isWait === 'true'
      }, undefined, this);
    });
    
    
  }
})();