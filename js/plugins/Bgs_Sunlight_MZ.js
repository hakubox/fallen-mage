/*:
 * @target MZ
 * @plugindesc [MZ] 阳光效果插件 (Godray) - 复刻版
 * @author BallgameStudios.com (Ported to MZ by AI)
 *
 * @help 这个插件添加了一个可配置的阳光效果，即“上帝之光”(Godrays)。
 * 这是 Bgs_Sunlight 的 RPG Maker MZ 移植版本。
 *
 * 您可以启用并通过插件命令禁用。阳光可能平行或发散。
 * 你可以设置太阳的位置、亮度等等。
 * 
 * 插件命令 (Plugin Commands)：
 * ----------------------------
 * MZ 提供了新的插件命令选择界面，但也兼容旧式的文本命令。
 * 
 * 旧式命令 (在事件指令"插件命令"中输入):
 * bgsSunlight on       打开阳光效果
 * bgsSunlight off      关闭阳光效果
 * 
 * 地图备注 (Map Notes)：
 * ---------------------
 * <bgsNoSunlight>     忽略此地图中的阳光效果 (推荐使用尖括号，旧版无括号也兼容)
 *
 * 参数说明：
 * ---------
 * Parallel (平行): true = 模拟远处太阳（使用角度），false = 模拟近处点光源（使用位置）。
 * Angle (角度): 光线的方向角度（仅当 Parallel 为 true 时有效）。
 * Position (位置): 光源在屏幕的 X 轴位置，0 为左，1 为右（仅当 Parallel 为 false 时有效）。
 * Brightness (亮度): 光线的强度。
 * Density (密度): 光线的密集程度（Shader 中的 lacunarity）。
 * 
 * @command SetSunlight
 * @text 设置阳光开关
 * @desc 打开或关闭阳光效果。
 *
 * @arg enabled
 * @text 状态
 * @type boolean
 * @on 开启 (ON)
 * @off 关闭 (OFF)
 * @default true
 * @desc 打开或关闭效果。
 * 
 * @param Parallel
 * @text 平行的 (Parallel)
 * @type boolean
 * @desc 如果为true，请使用 Angle 参数。如果为false，请使用 Position 参数。
 * @default false
 * 
 * @param Angle
 * @text 角度 (Angle)
 * @type number
 * @min -180
 * @max 180
 * @desc 介于-90和90之间的值（当Parallel=true时会产生影响）。
 * @default -45
 *
 * @param Position
 * @text 位置 (Position)
 * @type number
 * @decimals 2
 * @min -1.00
 * @max 2.00
 * @desc 0=左和1=右之间的值（当Parallel=false时影响）。
 * @default 0.2
 * 
 * @param Brightness
 * @text 亮度 (Brightness)
 * @type number
 * @decimals 2
 * @min 0
 * @max 5
 * @desc 控制光线的增益 (Gain)。通常在 0 到 1 之间。
 * @default 0.3
 * 
 * @param Density
 * @text 密度 (Density)
 * @type number
 * @decimals 1
 * @min 0
 * @max 50
 * @desc 更高的数值产生更多的光束细节 (Lacunarity)。
 * @default 2.5
 */

var Imported = Imported || {};
Imported.Bgs_Sunlight_MZ = 1.0;

var BGS = BGS || {};
BGS.Sunlight = BGS.Sunlight || {};

(function (_) {
    'use strict';

    // -------------------------------------------------------------------------
    // Shader Code (Embedded GodrayFilter from pixi-filters)
    // -------------------------------------------------------------------------
    
    const vertexShader = `
    attribute vec2 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat3 projectionMatrix;

    varying vec2 vTextureCoord;

    void main(void)
    {
        gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
        vTextureCoord = aTextureCoord;
    }
    `;

    const fragmentShader = `
    precision mediump float;

    varying vec2 vTextureCoord;
    uniform sampler2D uSampler;
    
    // MZ/PIXI v5 changes: filterArea is usually handled via inputSize/outputFrame logic
    // But for this ported shader, we pass specific uniforms.
    uniform vec4 inputSize; 
    uniform vec4 outputFrame;

    uniform vec2 light;
    uniform bool parallel;
    uniform float aspect;

    uniform float gain;
    uniform float lacunarity;
    uniform float time;

    // Perlin Noise Functions
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    vec3 fade(vec3 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }

    float pnoise(vec3 P, vec3 rep) {
        vec3 Pi0 = mod(floor(P), rep);
        vec3 Pi1 = mod(Pi0 + vec3(1.0), rep);
        Pi0 = mod289(Pi0);
        Pi1 = mod289(Pi1);
        vec3 Pf0 = fract(P);
        vec3 Pf1 = Pf0 - vec3(1.0);
        vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
        vec4 iy = vec4(Pi0.yy, Pi1.yy);
        vec4 iz0 = Pi0.zzzz;
        vec4 iz1 = Pi1.zzzz;
        vec4 ixy = permute(permute(ix) + iy);
        vec4 ixy0 = permute(ixy + iz0);
        vec4 ixy1 = permute(ixy + iz1);
        vec4 gx0 = ixy0 * (1.0 / 7.0);
        vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
        gx0 = fract(gx0);
        vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
        vec4 sz0 = step(gz0, vec4(0.0));
        gx0 -= sz0 * (step(0.0, gx0) - 0.5);
        gy0 -= sz0 * (step(0.0, gy0) - 0.5);
        vec4 gx1 = ixy1 * (1.0 / 7.0);
        vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
        gx1 = fract(gx1);
        vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
        vec4 sz1 = step(gz1, vec4(0.0));
        gx1 -= sz1 * (step(0.0, gx1) - 0.5);
        gy1 -= sz1 * (step(0.0, gy1) - 0.5);
        vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
        vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
        vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
        vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
        vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
        vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
        vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
        vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);
        vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
        g000 *= norm0.x;
        g010 *= norm0.y;
        g100 *= norm0.z;
        g110 *= norm0.w;
        vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
        g001 *= norm1.x;
        g011 *= norm1.y;
        g101 *= norm1.z;
        g111 *= norm1.w;
        float n000 = dot(g000, Pf0);
        float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
        float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
        float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
        float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
        float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
        float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
        float n111 = dot(g111, Pf1);
        vec3 fade_xyz = fade(Pf0);
        vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
        vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
        float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
        return 2.2 * n_xyz;
    }

    float turb(vec3 P, vec3 rep, float lacunarity, float gain) {
        float sum = 0.0;
        float sc = 1.0;
        float totalgain = 1.0;
        for (float i = 0.0; i < 6.0; i++) {
            sum += totalgain * pnoise(P * sc, rep);
            sc *= lacunarity;
            totalgain *= gain;
        }
        return abs(sum);
    }

    void main(void) {
        gl_FragColor = texture2D(uSampler, vTextureCoord);
        
        // MZ Coordinate normalization
        vec2 coord = vTextureCoord * inputSize.xy / outputFrame.zw;

        float d;

        if (parallel) {
            float _cos = light.x;
            float _sin = light.y;
            d = (_cos * coord.x) + (_sin * coord.y * aspect);
        } else {
            float dx = coord.x - light.x / outputFrame.z;
            float dy = (coord.y - light.y / outputFrame.w) * aspect;
            float dis = sqrt(dx * dx + dy * dy) + 0.00001;
            d = dy / dis;
        }

        vec3 dir = vec3(d, d, 0.0);

        float noise = turb(dir + vec3(time, 0.0, 62.1 + time) * 0.05, vec3(480.0, 320.0, 480.0), lacunarity, gain);
        noise = mix(noise, 0.0, 0.3);
        
        // Fade vertically based on normalized Y
        vec4 mist = vec4(noise, noise, noise, 1.0) * (1.0 - coord.y);
        mist.a = 1.0;
        gl_FragColor += mist;
    }
    `;

    /**
     * BgsGodrayFilter class specific for MZ (PIXI v5+)
     */
    class BgsGodrayFilter extends PIXI.Filter {
        constructor(options) {
            super(vertexShader, fragmentShader);
            
            this.uniforms.light = new Float32Array(2);
            this.uniforms.parallel = false;
            this.uniforms.aspect = 1.0;
            this.uniforms.gain = 0.5;
            this.uniforms.lacunarity = 2.0;
            this.uniforms.time = 0.0;

            // Internal state
            this._angleLight = new PIXI.Point();
            this._angle = 0;
            
            // Apply options
            const opts = Object.assign({
                angle: 30,
                gain: 0.5,
                lacunarity: 2.5,
                time: 0,
                parallel: true,
                center: [0, 0]
            }, options);

            this.angle = opts.angle;
            this.gain = opts.gain;
            this.lacunarity = opts.lacunarity;
            this.parallel = opts.parallel;
            this.center = opts.center; // For position
            this.time = opts.time;
        }

        apply(filterManager, input, output, clear) {
            const width = input.filterFrame.width;
            const height = input.filterFrame.height;

            this.uniforms.light = this.parallel ? this._angleLight : this.center;
            this.uniforms.parallel = this.parallel;
            this.uniforms.aspect = height / width;
            
            // time is updated externally
            this.uniforms.time = this.time;

            filterManager.applyFilter(this, input, output, clear);
        }

        // Getters and Setters
        get angle() { return this._angle; }
        set angle(value) {
            this._angle = value;
            const rads = value * (Math.PI / 180.0);
            this._angleLight.x = Math.cos(rads);
            this._angleLight.y = Math.sin(rads);
        }

        get gain() { return this.uniforms.gain; }
        set gain(value) { this.uniforms.gain = value; }

        get lacunarity() { return this.uniforms.lacunarity; }
        set lacunarity(value) { this.uniforms.lacunarity = value; }
        
        get parallel() { return this.uniforms.parallel; }
        set parallel(value) { this.uniforms.parallel = value; }

        // Note: 'center' here refers to the light source center [x, y] in screen coords
        get center() { return this._center || [0, 0]; }
        set center(value) { this._center = value; }
    }

    // -------------------------------------------------------------------------
    // Plugin Logic
    // -------------------------------------------------------------------------

    function toNumber(str, def) {
        return isNaN(str) ? def : +(str || def);
    }

    var sunlightEnabled = false;
    var godrayFilter = null; 

    // Process parameters
    _.params = PluginManager.parameters('Bgs_Sunlight_MZ');    
    _.Parallel = String(_.params['Parallel'] || "false") === "true";
    _.Angle = toNumber(_.params['Angle'], -45);
    _.Position = toNumber(_.params['Position'], 0.2);
    _.Brightness = toNumber(_.params['Brightness'], 0.3);
    _.Density = toNumber(_.params['Density'], 30); // Note: Original was 30, but pixi filter default implies ~2.5. We stick to user param.
    // However, the shader variable 'lacunarity' behaves exponentially usually. 
    // In original plugin user input 30 mapped to lacunarity. 
    // Let's trust the user value passes directly like original logic.

    // --- MZ Plugin Command Support ---
    PluginManager.registerCommand("Bgs_Sunlight_MZ", "SetSunlight", args => {
        const enable = args.enabled === "true";
        setSunlightState(enable);
    });

    // --- MV Style Plugin Command Support (Backward Compatibility) ---
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        if (_Game_Interpreter_pluginCommand) {
            _Game_Interpreter_pluginCommand.call(this, command, args);
        }
        if (command === 'bgsSunlight') {
            switch (args[0]) {
                case 'on':
                    setSunlightState(true);
                    break;
                case 'off':
                    setSunlightState(false);
                    break;
            }
        }        
    };

    function setSunlightState(enabled) {
        if (enabled) {
            sunlightEnabled = true;
            if (SceneManager._scene instanceof Scene_Map) {
                checkMapNoteAndApply();
            }
        } else {
            sunlightEnabled = false;
            // Immediate effect
            if (godrayFilter) godrayFilter.enabled = false;
        }
    }

    function checkMapNoteAndApply() {
        if (!$dataMap || !godrayFilter) return;
        const mapnote = $dataMap.note.toLowerCase();
        // Check for both old style "bgsnosunlight" and standard MZ tag "<bgsnosunlight>"
        const noSun = mapnote.includes("bgsnosunlight");
        godrayFilter.enabled = sunlightEnabled && !noSun;
    }

    // --- Scene_Map Integration ---

    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        _Scene_Map_start.apply(this, arguments);
        
        // Re-create filter if needed or first time
        if (!godrayFilter || godrayFilter.destroyed) {            
            godrayFilter = new BgsGodrayFilter({
                angle: _.Angle,
                parallel: _.Parallel,
                gain: _.Brightness,
                lacunarity: _.Density,
                // The center calculation remains similar to original logic
                // Center is pixel coordinate.
                center: [(Graphics.width + 100) * _.Position - 50, -50] 
            });            
        }
        
        this._godrayFilter = godrayFilter;
        
        // Apply filter to Spriteset (the map rendering container)
        // In MZ, filters are better applied to spriteset usually than scene children[0]
        if (this._spriteset) {
             // We append only our filter to avoid overwriting existing ones
             const currentFilters = this._spriteset.filters || [];
             this._spriteset.filters = currentFilters.concat([godrayFilter]);
        }

        checkMapNoteAndApply();
    }

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.apply(this, arguments);
        if (godrayFilter && godrayFilter.enabled) {
            godrayFilter.time += 0.005;
        }
    }
             
})(BGS.Sunlight);
