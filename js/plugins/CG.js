

Game_Screen.prototype.showCGSimplified = function (pictureId, name) {
    const realPictureId = this.realPictureId(pictureId);
    const picture = new Game_Picture();
    picture.show(name, 0, 0, 0, 67, 67, 255, 0);
    this._pictures[realPictureId] = picture;
};

// Game_Screen.prototype.showFrag = function (key) {
//     const fragment = this.fragments.get(key)
//     fragment.forEach(cg => {
//         let picture = new Game_Picture();
//         picture.show(cg.name, 0, 0, 0, 67, 67, 255, 0);
//         this._pictures[cg.id] = picture;
//     })
// };

// Game_Screen.prototype.initFragmentsSet = function () {
//     this.fragments = new Map()
// }

// Game_Screen.prototype.createFragment = function (key) {
//     this.fragments.set(key, [])
// }

// Game_Screen.prototype.addFragment = function (key, id, name) {
//     if (this.fragments) {
//         const fragment = this.fragments.get(key)
//         fragment.push({
//             id: id,
//             name: name,
//         })
//     }
// }

(function(){
    Object.defineProperties(Game_System.prototype, {
        AuraCGCount: {
            get: function () {
                return ['Aura/center_body_2', 'Aura/center_body_1', 'Aura/center_body_3', 'Aura/center_body_1']
            },
            configurable: true
        }
    })

    Game_System.prototype.setTempFunc=function(func){
        this.handler=func
    }

    Game_System.prototype.callTempFunc=function(){
        this.handler()
    }

    Game_System.prototype.clearTempFunc=function(){
        this.handler=null
    }
})()