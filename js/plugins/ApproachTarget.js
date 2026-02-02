Game_Event.prototype.approachTarget = function (targetX, targetY, wait,direction=8) {
    const moveRoute = {
        list: [],
        repeat: false,
        skippable: false,
        wait: wait
    }
    const indexX = Math.abs(this._x - targetX)
    const codeX = this._x - targetX < 0 ? 3 : 2
    const indexY = Math.abs(this._y - targetY)
    const codeY = this._y - targetY < 0 ? 1 : 4
    moveRoute.list.push({
        code: 37,
        indent: null
    })
    for (let i = 0; i < indexX; i++) {
        moveRoute.list.push({
            code: codeX,
            indent: null
        })
    }
    for (let i = 0; i < indexY; i++) {
        moveRoute.list.push({
            code: codeY,
            indent: null
        })
    }

    switch (direction) {
        case 8: {
            moveRoute.list.push({
                code: 19,
                indent: null
            })
            break
        }
        case 4: {
            moveRoute.list.push({
                code: 17,
                indent: null
            })
            break
        }
        case 2: {
            moveRoute.list.push({
                code: 16,
                indent: null
            })
            break
        }
        case 6: {
            moveRoute.list.push({
                code: 18,
                indent: null
            })
            break
        }
    }
    moveRoute.list.push({
        code: 38,
        indent: null
    })
    moveRoute.list.push({
        code: 0,
        indent: null
    })
    this.forceMoveRoute(moveRoute)
}