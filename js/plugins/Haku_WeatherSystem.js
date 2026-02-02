/*:
 * @target MZ
 * @plugindesc [v3.6 Final Fix] 究极Shader天气 - 修复黑色背景问题版
 * @author J_Developer & AI_Refined & BGS
 *
 * @param General Settings
 * @text === 基础设置 ===
 *
 * @param Variable ID
 * @text 控制变量 ID
 * @parent General Settings
 * @desc 0:关闭, 1:阳光(BGS版), 2:云雾, 3:迷雾, 5:侵蚀
 * @type variable
 * @default 10
 *
 * @param Fade Time
 * @text 过渡时间 (帧)
 * @parent General Settings
 * @desc 切换天气时的淡入淡出时间。
 * @type number
 * @default 60
 *
 * @param Sunlight Settings
 * @text === 1. 阳光 (God Rays) ===
 * 
 * @param Sun Parallel
 * @text 光线类型
 * @parent Sunlight Settings
 * @type boolean
 * @on 平行光 (推荐户外)
 * @off 点光源 (聚光灯)
 * @default true
 * 
 * @param Sun Angle
 * @text 照射角度 (-90 ~ 90)
 * @parent Sunlight Settings
 * @desc 仅在“平行光”模式下有效。-30 是左上倾斜。
 * @type number
 * @min -90
 * @max 90
 * @default -45
 *
 * @param Sun Position
 * @text 光源横向位置 (0.0 ~ 1.0)
 * @parent Sunlight Settings
 * @desc 仅在“点光源”模式下有效。0=左屏幕边缘，1=右屏幕边缘。
 * @type number
 * @decimals 2
 * @default 0.2
 *
 * @param Sun Speed
 * @text 光线波动速度
 * @parent Sunlight Settings
 * @desc 推荐 1.0
 * @type number
 * @decimals 2
 * @default 1.00
 *
 * @param Sun Density
 * @text 光束密度 (Lacunarity)
 * @parent Sunlight Settings
 * @desc 对应原插件的 Density。推荐 2.5。
 * @type number
 * @decimals 2
 * @default 2.50
 *
 * @param Sun Brightness
 * @text 亮度/增益 (Gain)
 * @parent Sunlight Settings
 * @desc 对应原插件的 Brightness。推荐 0.5。
 * @type number
 * @decimals 2
 * @default 0.50
 *
 * @param Fog Settings
 * @text === 2. 云雾 (自定义色) ===
 * 
 * @param Fog Speed X
 * @text 水平流速 (X)
 * @parent Fog Settings
 * @desc 推荐 0.05
 * @type number
 * @decimals 3
 * @min -10.00
 * @default 0.050
 *
 * @param Fog Speed Y
 * @text 上升流速 (Y)
 * @parent Fog Settings
 * @desc 推荐 -0.02
 * @type number
 * @decimals 3
 * @min -10.00
 * @default -0.020
 *
 * @param Fog Density
 * @text 云雾浓度
 * @parent Fog Settings
 * @desc 推荐 1.3
 * @type number
 * @decimals 2
 * @default 1.30
 *
 * @param Fog Color R
 * @text 颜色 Red (0-255)
 * @parent Fog Settings
 * @type number
 * @min 0
 * @max 255
 * @default 220
 *
 * @param Fog Color G
 * @text 颜色 Green (0-255)
 * @parent Fog Settings
 * @type number
 * @min 0
 * @max 255
 * @default 230
 *
 * @param Fog Color B
 * @text 颜色 Blue (0-255)
 * @parent Fog Settings
 * @type number
 * @min 0
 * @max 255
 * @default 255
 *
 * @param Mist Settings
 * @text === 3. 迷雾 (厚重) ===
 *
 * @param Mist Flow Speed
 * @text 翻滚速度
 * @parent Mist Settings
 * @desc 默认 0.3
 * @type number
 * @decimals 2
 * @default 0.30
 *
 * @param Mist Contrast
 * @text 对比度/边缘
 * @parent Mist Settings
 * @desc 默认 1.2
 * @type number
 * @decimals 2
 * @default 1.20
 *
 * @param Corruption Settings
 * @text === 5. 侵蚀 (Sanity Loss) ===
 *
 * @param Corrupt Shake
 * @text 震颤/扭曲幅度
 * @parent Corruption Settings
 * @desc 推荐 2.0
 * @type number
 * @decimals 2
 * @default 2.00
 *
 * @param Corrupt Glitch
 * @text 色差强度
 * @parent Corruption Settings
 * @desc 推荐 1.0
 * @type number
 * @decimals 2
 * @default 1.00
 *
 * @help
 * [v3.6 Fix]
 * 修复了 BGS 移植出现的黑色背景问题。
 * 原理：移除了对原纹理的采样，仅输出计算出的光线 Alpha 通道。
 *
 * 变量 ID 对应：
 * 1 = 阳光 (BGS God Rays 移植版)
 * 2 = 云雾
 * 3 = 迷雾
 * 5 = 侵蚀
 * 0 = 关闭
 */

(() => {
    const pluginName = "HAKU_WeatherSystem";
    const parameters = PluginManager.parameters(pluginName);

    const config = {
        varId: Number(parameters['Variable ID'] || 10),
        fadeTime: Number(parameters['Fade Time'] || 60),
        sun: {
            parallel: parameters['Sun Parallel'] === 'true',
            angle: Number(parameters['Sun Angle'] || -45),
            position: Number(parameters['Sun Position'] || 0.2),
            speed: Number(parameters['Sun Speed'] || 1.0),
            density: Number(parameters['Sun Density'] || 2.5),
            brightness: Number(parameters['Sun Brightness'] || 0.5)
        },
        fog: {
            speedX: Number(parameters['Fog Speed X'] || 0.05),
            speedY: Number(parameters['Fog Speed Y'] || -0.02),
            density: Number(parameters['Fog Density'] || 1.3),
            color: [
                Number(parameters['Fog Color R'] || 220) / 255.0,
                Number(parameters['Fog Color G'] || 230) / 255.0,
                Number(parameters['Fog Color B'] || 255) / 255.0
            ]
        },
        mist: {
            speed: Number(parameters['Mist Flow Speed'] || 0.3),
            contrast: Number(parameters['Mist Contrast'] || 1.2)
        },
        corrupt: {
            shake: Number(parameters['Corrupt Shake'] || 2.0),
            glitch: Number(parameters['Corrupt Glitch'] || 1.0)
        }
    };

    // ==========================================================================
    // 1. 阳光 (God Rays - BGS Ported - Fixed for Overlay)
    // ==========================================================================
    const SHADER_PERLIN_NOISE = `
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
            g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
            vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
            g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;
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
    `;

    const SHADER_GODRAYS = `
        varying vec2 vTextureCoord;
        uniform vec4 filterArea;
        uniform vec2 dimensions;

        uniform vec2 light;
        uniform bool parallel;
        uniform float aspect;

        uniform float gain;       
        uniform float lacunarity; 
        uniform float time;
        uniform float uAlpha;     // Fade System Alpha

        ${SHADER_PERLIN_NOISE}

        void main(void) {
            vec2 coord = vTextureCoord * filterArea.xy / dimensions.xy;

            float d;

            if (parallel) {
                float _cos = light.x;
                float _sin = light.y;
                d = (_cos * coord.x) + (_sin * coord.y * aspect);
            } else {
                float dx = coord.x - light.x / dimensions.x;
                float dy = (coord.y - light.y / dimensions.y) * aspect;
                float dis = sqrt(dx * dx + dy * dy) + 0.00001;
                d = dy / dis;
            }

            vec3 dir = vec3(d, d, 0.0);

            float noise = turb(dir + vec3(time, 0.0, 62.1 + time) * 0.05, vec3(480.0, 320.0, 480.0), lacunarity, gain);
            noise = mix(noise, 0.0, 0.3);
            
            // 【重要修复】
            // BGS原版是 texture2D + noise。
            // 我们这里只保留 noise 部分，让 blending mode (ADD) 去处理叠加。
            // 同时应用垂直淡出: (1.0 - coord.y)
            float intensity = noise * (1.0 - coord.y);
            
            // 最终颜色：纯白 * 强度 * 总体淡入淡出Alpha
            // 在 PIXI.BLEND_MODES.ADD 模式下，color * alpha 将会叠加出亮光
            vec3 color = vec3(1.0, 1.0, 1.0);
            
            // 输出：Premultiplied Alpha 风格的 ADD 混合
            float finalAlpha = intensity * uAlpha;
            
            gl_FragColor = vec4(color * finalAlpha, finalAlpha);
        }
    `;

    // ==========================================================================
    // 2. 云雾 (Fog)
    // ==========================================================================
    const SHADER_FOG = `
        varying vec2 vTextureCoord;
        uniform float uTime;
        uniform float uAlpha;
        
        uniform vec2 uSpeedVec;
        uniform float uDensity;
        uniform vec3 uColorRGB;

        float hash(vec2 p) {
            float h = dot(p, vec2(12.9898, 78.233));
            return fract(sin(h) * 43758.5453);
        }

        float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p); 
            vec2 u = f * f * (3.0 - 2.0 * f);
            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));
            return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
        }

        float fbm(vec2 p) {
            float total = 0.0;
            float amp = 0.5;
            total += noise(p) * amp; p *= 2.02; amp *= 0.5;
            total += noise(p) * amp; p *= 2.03; amp *= 0.5;
            total += noise(p) * amp; p *= 2.01; amp *= 0.5;
            total += noise(p) * amp; p *= 2.04; amp *= 0.5;
            return total;
        }

        void main(void) {
            vec2 uv = vTextureCoord;
            
            vec2 move1 = uSpeedVec * uTime;
            float cloud1 = fbm(uv * 3.0 + move1);
            
            vec2 move2 = uSpeedVec * uTime * 1.5 + vec2(2.0, 3.0);
            float cloud2 = fbm(uv * 6.0 - move2); 
            
            float cover = (cloud1 + cloud2) * 0.5;
            float t = 0.8 - (uDensity * 0.3);
            if (t < 0.0) t = 0.0;
            
            float alphaMask = smoothstep(t, 1.0, cover);
            alphaMask *= uDensity;
            
            gl_FragColor = vec4(uColorRGB, alphaMask * uAlpha);
        }
    `;

    // ==========================================================================
    // 3. 迷雾 (Mist)
    // ==========================================================================
    const SHADER_MIST = `
        varying vec2 vTextureCoord;
        uniform float uTime;
        uniform float uAlpha;
        uniform float uSpeed;
        uniform float uContrast;

        float random_m (in vec2 _st) { return fract(sin(dot(_st.xy, vec2(12.9898,78.233)))*43758.5453123); }
        float noise_m (in vec2 _st) {
            vec2 i = floor(_st); vec2 f = fract(_st); f = f*f*(3.0-2.0*f);
            return mix(mix(random_m(i), random_m(i + vec2(1.0, 0.0)), f.x), mix(random_m(i + vec2(0.0, 1.0)), random_m(i + vec2(1.0, 1.0)), f.x), f.y);
        }
        float fbm_m ( in vec2 _st) {
            float v = 0.0; float a = 0.5; vec2 shift = vec2(100.0);
            v += a * noise_m(_st); _st = _st * 2.0 + shift; a *= 0.5;
            v += a * noise_m(_st); _st = _st * 2.0 + shift; a *= 0.5;
            v += a * noise_m(_st); _st = _st * 2.0 + shift; a *= 0.5;
            v += a * noise_m(_st); _st = _st * 2.0 + shift; a *= 0.5;
            return v;
        }

        void main() {
            vec2 uv = vTextureCoord;
            float t = uTime * uSpeed;
            vec2 q = vec2(0.);
            q.x = fbm_m( uv + 0.00*t);
            q.y = fbm_m( uv + vec2(1.0));
            vec2 r = vec2(0.);
            r.x = fbm_m( uv + 1.0*q + vec2(1.7,9.2)+ 0.15*t );
            r.y = fbm_m( uv + 1.0*q + vec2(8.3,2.8)+ 0.126*t);
            float f = fbm_m(uv + r);
            float val = (f * f * f + 0.6 * f * f + 0.5 * f) * f;
            val = smoothstep(0.2, 0.9, val * uContrast);
            vec3 color = mix(vec3(0.1, 0.11, 0.12), vec3(0.4, 0.45, 0.5), clamp((f*f)*4.0,0.0,1.0));
            gl_FragColor = vec4(color, val * uAlpha);
        }
    `;

    // ==========================================================================
    // 5. 侵蚀 (Corruption) - No Blend Mode (Direct Overlay)
    // ==========================================================================
    const SHADER_CORRUPTION = `
        varying vec2 vTextureCoord;
        uniform float uTime;
        uniform float uAlpha;
        uniform float uShake;
        uniform float uGlitch;
        
        float rand_c(vec2 co){ return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453); }

        void main(void) {
            vec2 uv = vTextureCoord;
            float xWave = sin(uv.y * 5.0 + uTime * 3.0) * 0.02 * uShake;
            float yShake = cos(uv.x * 20.0 + uTime * 15.0) * 0.005 * uShake;
            if (rand_c(vec2(uTime, uTime)) > 0.95) { xWave += 0.05 * uShake; }
            
            float dist = length(uv - 0.5);
            float vignette = smoothstep(0.2, 0.8, dist);
            
            // This shader creates "static noise" and corruption overlay
            vec3 baseColor = vec3(0.1, 0.0, 0.05);
            float grain = rand_c(uv * uTime) * 0.3;
            float rVal = smoothstep(0.4, 0.5, abs(xWave) * 10.0); 
            float bVal = smoothstep(0.4, 0.5, abs(yShake) * 20.0);
            
            vec3 finalColor = baseColor + vec3(rVal, 0.0, bVal) * 0.5;
            finalColor += grain;
            
            float alphaMap = (vignette * 0.8) + (rVal + bVal) * 0.5;
            alphaMap = clamp(alphaMap, 0.0, 0.8);
            
            gl_FragColor = vec4(finalColor, alphaMap * uAlpha);
        }
    `;

    // ==========================================================================
    // System Core
    // ==========================================================================

    class WeatherFilter extends PIXI.Filter {
        constructor(fragmentSrc, extraUniforms = {}) {
            const uniforms = {
                uTime: 0.0,
                uAlpha: 0.0,
                ...extraUniforms
            };
            // Godray initialization needs
            if (uniforms.time !== undefined) {
               uniforms.dimensions = new Float32Array([Graphics.width, Graphics.height]);
               uniforms.aspect = Graphics.height / Graphics.width;
               uniforms.filterArea = new Float32Array([Graphics.width, Graphics.height, 0, 0]);
            }
            super(null, fragmentSrc, uniforms);
        }

        update(delta) {
            this.uniforms.uTime += 0.01 * delta; // General Speed
            
            if (this.uniforms.time !== undefined) {
                this.uniforms.time += 0.005 * config.sun.speed * delta; // BGS specific speed
            }
        }

        setAlpha(val) {
            this.uniforms.uAlpha = val;
        }
    }

    class J_WeatherLayer extends PIXI.Container {
        constructor() {
            super();
            this._width = Graphics.width;
            this._height = Graphics.height;
            // Create a transparent sprite container instead of White
            this._sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
            this._sprite.width = this._width;
            this._sprite.height = this._height;
            this.addChild(this._sprite);

            this._currentWeatherId = 0;
            this._targetWeatherId = 0;
            this._currentFilter = null;
            this._currentAlpha = 0.0;
            this._isFadingOut = false;
        }

        update() {
            const targetId = $gameVariables.value(config.varId);

            if (this._targetWeatherId !== targetId) {
                this._targetWeatherId = targetId;
                this._isFadingOut = true;
            }

            if (this._isFadingOut) {
                if (this._currentAlpha > 0) {
                    this._currentAlpha -= 1 / config.fadeTime;
                    if (this._currentAlpha < 0) this._currentAlpha = 0;
                } else {
                    this._isFadingOut = false;
                    this._currentWeatherId = this._targetWeatherId;
                    this.swapShader(this._currentWeatherId);
                }
            } else if (this._currentWeatherId !== 0) {
                if (this._currentAlpha < 1.0) {
                    this._currentAlpha += 1 / config.fadeTime;
                    if (this._currentAlpha > 1.0) this._currentAlpha = 1.0;
                }
            }

            if (this._currentFilter) {
                this._currentFilter.update(1.0);
                this._currentFilter.setAlpha(this._currentAlpha);
                this.visible = this._currentAlpha > 0;
            } else {
                this.visible = false;
            }
        }

        swapShader(id) {
            let shaderSrc = null;
            let uniforms = {};
            let blendMode = PIXI.BLEND_MODES.NORMAL;

            switch (id) {
                case 1: 
                    // SUNLIGHT (BGS Fixed)
                    shaderSrc = SHADER_GODRAYS;
                    
                    let lightParam;
                    if (config.sun.parallel) {
                        const rad = config.sun.angle * (Math.PI / 180);
                        lightParam = new PIXI.Point(Math.cos(rad), Math.sin(rad));
                    } else {
                        // For point light in this shader math, we need screen space coords ratio roughly
                        lightParam = new PIXI.Point(Graphics.width * config.sun.position, 0);
                    }

                    uniforms = {
                        light: lightParam,
                        parallel: config.sun.parallel,
                        gain: config.sun.brightness,
                        lacunarity: config.sun.density,
                        time: 0.0, 
                        uAlpha: 0.0
                    };
                    // Use ADD to overlay light on top of map without black bg
                    blendMode = PIXI.BLEND_MODES.ADD;
                    break;
                case 2: 
                    shaderSrc = SHADER_FOG;
                    uniforms = {
                        uSpeedVec: new PIXI.Point(config.fog.speedX, config.fog.speedY), 
                        uDensity: config.fog.density,
                        uColorRGB: config.fog.color
                    };
                    blendMode = PIXI.BLEND_MODES.NORMAL; 
                    break;
                case 3: 
                    shaderSrc = SHADER_MIST;
                    uniforms = {
                        uSpeed: config.mist.speed,
                        uContrast: config.mist.contrast
                    };
                    blendMode = PIXI.BLEND_MODES.NORMAL;
                    break;
                case 5:
                    shaderSrc = SHADER_CORRUPTION;
                    uniforms = {
                        uShake: config.corrupt.shake,
                        uGlitch: config.corrupt.glitch
                    };
                    blendMode = PIXI.BLEND_MODES.NORMAL;
                    break;
                default:
                    shaderSrc = null;
                    break;
            }

            this._sprite.blendMode = blendMode;

            if (shaderSrc) {
                this._currentFilter = new WeatherFilter(shaderSrc, uniforms);
                if(uniforms.time !== undefined) {
                     this._currentFilter.uniforms.dimensions[0] = Graphics.width;
                     this._currentFilter.uniforms.dimensions[1] = Graphics.height;
                }
                this.filters = [this._currentFilter];
                this.visible = true;
            } else {
                this._currentFilter = null;
                this.filters = [];
                this.visible = false;
            }
        }
    }

    const _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
    Spriteset_Map.prototype.createLowerLayer = function () {
        _Spriteset_Map_createLowerLayer.call(this);
        this.createJWeatherLayer();
    };

    Spriteset_Map.prototype.createJWeatherLayer = function () {
        this._jWeatherLayer = new J_WeatherLayer();
        this._tilemap.addChild(this._jWeatherLayer);
    };

    const _Spriteset_Map_update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function () {
        _Spriteset_Map_update.call(this);
        if (this._jWeatherLayer) {
            this._jWeatherLayer.update();
        }
    };

})();
