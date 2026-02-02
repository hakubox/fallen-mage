/** 插件参数格式化器 */
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
window.PluginParamsParser = PluginParamsParser;

/**
 * 动画曲线函数
 */
window.MotionEasing = Object.freeze({
  Linear: Object.freeze({
    None: function (amount) {
      return amount;
    },
    In: function (amount) {
      return amount;
    },
    Out: function (amount) {
      return amount;
    },
    InOut: function (amount) {
      return amount;
    },
  }),
  Quadratic: Object.freeze({
    In: function (amount) {
      return amount * amount;
    },
    Out: function (amount) {
      return amount * (2 - amount);
    },
    InOut: function (amount) {
      if ((amount *= 2) < 1) {
        return 0.5 * amount * amount;
      }
      return -0.5 * (--amount * (amount - 2) - 1);
    },
  }),
  Cubic: Object.freeze({
    In: function (amount) {
      return amount * amount * amount;
    },
    Out: function (amount) {
      return --amount * amount * amount + 1;
    },
    InOut: function (amount) {
      if ((amount *= 2) < 1) {
        return 0.5 * amount * amount * amount;
      }
      return 0.5 * ((amount -= 2) * amount * amount + 2);
    },
  }),
  Quartic: Object.freeze({
    In: function (amount) {
      return amount * amount * amount * amount;
    },
    Out: function (amount) {
      return 1 - --amount * amount * amount * amount;
    },
    InOut: function (amount) {
      if ((amount *= 2) < 1) {
        return 0.5 * amount * amount * amount * amount;
      }
      return -0.5 * ((amount -= 2) * amount * amount * amount - 2);
    },
  }),
  Quintic: Object.freeze({
    In: function (amount) {
      return amount * amount * amount * amount * amount;
    },
    Out: function (amount) {
      return --amount * amount * amount * amount * amount + 1;
    },
    InOut: function (amount) {
      if ((amount *= 2) < 1) {
        return 0.5 * amount * amount * amount * amount * amount;
      }
      return 0.5 * ((amount -= 2) * amount * amount * amount * amount + 2);
    },
  }),
  Sinusoidal: Object.freeze({
    In: function (amount) {
      return 1 - Math.sin(((1.0 - amount) * Math.PI) / 2);
    },
    Out: function (amount) {
      return Math.sin((amount * Math.PI) / 2);
    },
    InOut: function (amount) {
      return 0.5 * (1 - Math.sin(Math.PI * (0.5 - amount)));
    },
  }),
  Exponential: Object.freeze({
    In: function (amount) {
      return amount === 0 ? 0 : Math.pow(1024, amount - 1);
    },
    Out: function (amount) {
      return amount === 1 ? 1 : 1 - Math.pow(2, -10 * amount);
    },
    InOut: function (amount) {
      if (amount === 0) {
        return 0;
      }
      if (amount === 1) {
        return 1;
      }
      if ((amount *= 2) < 1) {
        return 0.5 * Math.pow(1024, amount - 1);
      }
      return 0.5 * (-Math.pow(2, -10 * (amount - 1)) + 2);
    },
  }),
  Circular: Object.freeze({
    In: function (amount) {
      return 1 - Math.sqrt(1 - amount * amount);
    },
    Out: function (amount) {
      return Math.sqrt(1 - --amount * amount);
    },
    InOut: function (amount) {
      if ((amount *= 2) < 1) {
        return -0.5 * (Math.sqrt(1 - amount * amount) - 1);
      }
      return 0.5 * (Math.sqrt(1 - (amount -= 2) * amount) + 1);
    },
  }),
  Elastic: Object.freeze({
    In: function (amount) {
      if (amount === 0) {
        return 0;
      }
      if (amount === 1) {
        return 1;
      }
      return -Math.pow(2, 10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI);
    },
    Out: function (amount) {
      if (amount === 0) {
        return 0;
      }
      if (amount === 1) {
        return 1;
      }
      return Math.pow(2, -10 * amount) * Math.sin((amount - 0.1) * 5 * Math.PI) + 1;
    },
    InOut: function (amount) {
      if (amount === 0) {
        return 0;
      }
      if (amount === 1) {
        return 1;
      }
      amount *= 2;
      if (amount < 1) {
        return -0.5 * Math.pow(2, 10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI);
      }
      return 0.5 * Math.pow(2, -10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI) + 1;
    },
  }),
  Back: Object.freeze({
    In: function (amount) {
      var s = 1.70158;
      return amount === 1 ? 1 : amount * amount * ((s + 1) * amount - s);
    },
    Out: function (amount) {
      var s = 1.70158;
      return amount === 0 ? 0 : --amount * amount * ((s + 1) * amount + s) + 1;
    },
    InOut: function (amount) {
      var s = 1.70158 * 1.525;
      if ((amount *= 2) < 1) {
        return 0.5 * (amount * amount * ((s + 1) * amount - s));
      }
      return 0.5 * ((amount -= 2) * amount * ((s + 1) * amount + s) + 2);
    },
  }),
  Bounce: Object.freeze({
    In: function (amount) {
      return 1 - Easing.Bounce.Out(1 - amount);
    },
    Out: function (amount) {
      if (amount < 1 / 2.75) {
        return 7.5625 * amount * amount;
      }
      else if (amount < 2 / 2.75) {
        return 7.5625 * (amount -= 1.5 / 2.75) * amount + 0.75;
      }
      else if (amount < 2.5 / 2.75) {
        return 7.5625 * (amount -= 2.25 / 2.75) * amount + 0.9375;
      }
      else {
        return 7.5625 * (amount -= 2.625 / 2.75) * amount + 0.984375;
      }
    },
    InOut: function (amount) {
      if (amount < 0.5) {
        return Easing.Bounce.In(amount * 2) * 0.5;
      }
      return Easing.Bounce.Out(amount * 2 - 1) * 0.5 + 0.5;
    },
  }),
  generatePow: function (power) {
    if (power === void 0) { power = 4; }
    power = power < Number.EPSILON ? Number.EPSILON : power;
    power = power > 10000 ? 10000 : power;
    return {
      In: function (amount) {
        return Math.pow(amount, power);
      },
      Out: function (amount) {
        return 1 - Math.pow((1 - amount), power);
      },
      InOut: function (amount) {
        if (amount < 0.5) {
          return Math.pow((amount * 2), power) / 2;
        }
        return (1 - Math.pow((2 - amount * 2), power)) / 2 + 0.5;
      },
    };
  },

  /**
   * 获取需要的动画曲线函数
   * @param {'Linear'|'Quadratic'|'Cubic'|'Quartic'|'Quintic'|'Sinusoidal'|'Exponential'} easingName 曲线类型名称
   * @param {'None'|'In'|'Out'|'InOut'} type 时间曲线出入方式
   */
  getEasing(easingName = 'Linear', type = 'None') {
    if (!easingName || easingName.length < 1) {
      throw new Error('easingName is error');
    }
    const easingType = easingName.substring(0, 1).toUpperCase() + easingName.substring(1).toLowerCase();
    return MotionEasing[easingType][type];
  }
});

Bitmap.prototype._startLoading = function () {
  this._image = new Image();
  this._image.onload = this._onLoad.bind(this);
  this._image.onerror = this._onError.bind(this);
  this._destroyCanvas();
  this._loadingState = "loading";
  if (Utils.hasEncryptedImages()) {
    this._startDecrypting();
  } else {
    this._image.src = this._url;
    // 修复浏览器刷新图片无法加载的问题
    // if (this._image.width > 0) {
    //     this._image.onload = null;
    //     this._onLoad();
    // }
  }
};