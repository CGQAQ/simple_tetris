// Author: CG, ALL RIGHTS RESERVERED
// share to anyone should indicate the source, and  of course my name!
// 作者： CG 保留所有权利
// 转载请注明出处！

console.warn(
    `
    // Author: CG, ALL RIGHTS RESERVERED
    // share to anyone should indicate the source, and of course my name!
    // 作者： CG 保留所有权利
    // 转载请注明出处！
    `
);

// Tetromino's orientation, four type totally
// 0 degree, 90 degree 180 degree and 270 degree
// 方块的方向 4种 0度 90度 180度 270度
const ORIENTATION = {
    D0: 0,
    D1: 1,
    D2: 2,
    D3: 3
}

// Z shape and S shape only have two of them
// Z型和S型只有四种方向中的两个
/**
 * Z:   D0      D1
 *      |       ---
 *    --          |
 *   |            ---
 * S:
 *   |             ---
 *    --           |
 *      |        ---
 */
const O_Z_S = {
    D0: ORIENTATION.D0,
    D1: ORIENTATION.D1
}

// J and L shape have four types
// J型和L型有四种
/**
 * J:   D0      D1      D2          D3
 *      |               |``         ````|
 *     _|     |____     |
 * 
 * L:
 *     |      |```      ``|         ___|
 *     |_                 |
 */
const O_J_L = {
    ...ORIENTATION
}

// O only have one orientation
// O型只有一种
/**
 * O:     D0
 *      _______
 *      |__|__|
 *      |__|__|
 */
const O_O   = {
    D0: ORIENTATION.D0
}

// W shape have four orientations as well
// W 形状也有四种
/**
 * W:       D0      D1      D2      D3
 *           |      |      ____       |
 *         __|__    ---     |      ---|
 *                  |                 |
 */
const O_W   = {
    ...ORIENTATION
}

// I have two
// I形状两种
/**
 *  I:      D0      D1
 *        ----      |
 *                  |
 */             
const O_I   = {
    ...O_Z_S
}

// 7 types of shape
// 7种形状
const SHAPE = {
    Z: 0,
    S: 1,
    J: 2,
    L: 3,
    O: 4,
    W: 5,
    I: 6
}

// Position class
// 位置 类
class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // shift x only, but instead change self, return a new one
    // 在x方向偏移  不改变只身 返回新位置类
    get_new_x(x) {
        return new Position(this.x + x, this.y);
    }

    // y only
    get_new_y(y) {
        return new Position(this.x, this.y + y);
    }

    // x y both
    get_new_xy(x, y) {
        return new Position(this.x + x, this.y + y);
    }

    // clone self
    // 复制自身
    clone() {
        return new Position(this.x, this.y);
    }
}

// Shape class handle movement, rotation and status
// 形状类，处理自身的状态和移动旋转
class Shape {
    /**
     * Receive these four instance or value,
     * game center and shape must give,
     * random if orientation not give
     * 接收这四个实例或值，前三个必须提供，
     * 如果没有提供orientation，就随机
     * @param {Game instance} game Game类的实例
     * @param {Position instance} center Position类的实例
     * @param {Shape instance} shape Shape类的实例
     * @param {Orientation Enum} orientation 方向enum， 为null或undefined则随机
     */
    constructor(game, center, shape, orientation){
        if (game === undefined || center === undefined || shape === undefined) throw "wrong argument";

        if (orientation === undefined || orientation === null) {
            if(shape === SHAPE.I) {
                orientation = game.random(O_I.D0, O_I.D1)
            }
            else if(shape === SHAPE.S || shape === SHAPE.Z) {
                orientation = game.random(O_Z_S.D0, O_Z_S.D1);
            }
            else if(shape === SHAPE.L || shape === SHAPE.J) {
                orientation = game.random(O_J_L.D0, O_J_L.D3);
            }
            else if(shape === SHAPE.W) {
                orientation = game.random(O_W.D0, O_W.D3);
            }
            else if(shape ===SHAPE.O) {
                orientation = O_O.D0;
            }
        }
        
        this.game = game;
        this.center             = center;
        this.shape              = shape;
        this.orientation        = orientation;

        // Tetrimino status
        // 方块的状态
        this.dead = false; 

        // will cause problem
        // 会产生问题
        // this.write();
    }

    /**
     * return the postion data list
     *      [top, left, right, bottom]
     * 1st alway highest
     * 2nd always left-est
     * 3rd always right-est
     * 4th always lowest
     * 返回4包含四个Position类的数组
     * 第一个永远是最上面的方块
     * 第二个永远是最左面的方块
     * 第三个永远是最右面的方块
     * 第四个永远是最下面的方块
     * 
     * e.g.
     *              |  1st
     *      2nd  - -    3rd
     *           | 4th
     *      return [1st, 2nd, 3rd, 4th]
     */
    get data(){
        switch(this.shape){
            case SHAPE.I:
                if(this.orientation === O_I.D0) {           // D0 ---- 2nd is center
                    return [
                        this.center.clone(),
                        this.center.get_new_x(-1),
                        this.center.get_new_x(2),
                        this.center.get_new_x(1),
                    ]
                }
                else if(this.orientation === O_I.D1) {     // D1  |    2nd is center
                    return [
                        this.center.get_new_y(-1),
                        this.center.clone(),
                        this.center.get_new_y(1),
                        this.center.get_new_y(2),
                    ]
                }
                break;
            case SHAPE.J:
                if(this.orientation === O_J_L.D0) {           // .| center is 2nd in long stick
                    return [
                        this.center.get_new_y(-1),
                        this.center.get_new_xy(-1, 1),
                        this.center.clone(),
                        this.center.get_new_y(1),
                    ]
                }
                else if(this.orientation === O_J_L.D1) {      // |___
                    return [
                        this.center.get_new_xy(-1, -1),
                        this.center.get_new_x(-1),
                        this.center.get_new_x(1),
                        this.center.clone(),
                    ]
                }
                else if(this.orientation === O_J_L.D2) {      // |`
                    return [
                        this.center.get_new_y(-1),
                        this.center.clone(),
                        this.center.get_new_xy(1, -1),
                        this.center.get_new_y(1),
                    ]
                }
                else if(this.orientation === O_J_L.D3) {      // ```|
                    return [
                        this.center.clone(),
                        this.center.get_new_x(-1),
                        this.center.get_new_x(1),
                        this.center.get_new_xy(1, 1),
                    ]
                }
                break;
            case SHAPE.L:
                if(this.orientation === O_J_L.D0) {           // L  center is 2nd in the long stick
                    return [
                        this.center.get_new_y(-1),
                        this.center.clone(),
                        this.center.get_new_xy(1, 1),
                        this.center.get_new_y(1),
                    ]
                }
                else  if(this.orientation === O_J_L.D1) {     // |```
                    return [
                        this.center.clone(),
                        this.center.get_new_x(-1),
                        this.center.get_new_x(1),
                        this.center.get_new_xy(-1, 1),
                    ]
                }
                else  if(this.orientation === O_J_L.D2) {     // 7
                    return [
                        this.center.get_new_y(-1),
                        this.center.get_new_xy(-1, -1),
                        this.center.clone(),
                        this.center.get_new_y(1),
                    ]
                }
                else  if(this.orientation === O_J_L.D3) {     // ___|
                    return [
                        this.center.get_new_xy(1, -1),
                        this.center.get_new_x(-1),
                        this.center.clone(),
                        this.center.get_new_x(1),
                    ]
                }
                break;
            case SHAPE.O:
                if(this.orientation === O_O.D0) {           // O center is left-up conor
                    return [
                        this.center.clone(),
                        this.center.get_new_y(1),
                        this.center.get_new_x(1),
                        this.center.get_new_xy(1, 1),
                    ]
                }
                break;
            case SHAPE.S:
                if(this.orientation === O_Z_S.D0) {         // `-.    center is 1st of 2 in the middle
                    return [
                        this.center.get_new_y(-1),
                        this.center.clone(),
                        this.center.get_new_x(1),
                        this.center.get_new_xy(1, 1),
                    ]
                }
                else if(this.orientation === O_Z_S.D1) {    // _|` 
                    return [
                        this.center.clone(),
                        this.center.get_new_xy(-1, 1),
                        this.center.get_new_x(1),
                        this.center.get_new_y(1),
                    ]
                }
                break;
            case SHAPE.Z:
                if(this.orientation === O_Z_S.D0) {         // . -`    center is 1st of 2 in the middle
                    return [
                        this.center.get_new_xy(1, 1),    
                        this.center.clone(),                       
                        this.center.get_new_x(1),
                        this.center.get_new_y(1),
                    ]
                }
                else if(this.orientation === O_Z_S.D1) {    // `|_
                    return [
                        this.center.clone(),
                        this.center.get_new_x(-1),
                        this.center.get_new_xy(1, 1),
                        this.center.get_new_y(1),
                    ]
                }
                break;
            case SHAPE.W:
                    if(this.orientation === O_W.D0) {           // _|_  center is 2nd in the long stick
                        return [
                            this.center.get_new_y(-1),
                            this.center.get_new_x(-1),
                            this.center.get_new_x(1),
                            this.center.clone(),
                        ]
                    }
                    else  if(this.orientation === O_W.D1) {     // |-
                        return [
                            this.center.get_new_y(-1),
                            this.center.clone(),
                            this.center.get_new_x(1),
                            this.center.get_new_y(1),
                        ]
                    }
                    else  if(this.orientation === O_W.D2) {     // `|`
                        return [
                            this.center.clone(),
                            this.center.get_new_x(-1),
                            this.center.get_new_x(1),
                            this.center.get_new_y(1),
                        ]
                    }
                    else  if(this.orientation === O_W.D3) {     // -|
                        return [
                            this.center.get_new_y(-1),
                            this.center.get_new_x(-1),
                            this.center.clone(),
                            this.center.get_new_y(1),
                        ]
                    }
                break;
        }
        return null;
    }

    /**
     * return left-est square postion
     * 返回最左面方块的位置类
     */
    get left () {
        return this.data[1];
    }

     /**
     * return right-est square postion
     * 返回最右面方块的位置类
     */
    get right() {
        return this.data[2];
    }

     /**
     * return topp-est square postion
     * 返回最上面方块的位置类
     */
    get top() {
        return this.data[0];
    }

    /**
     * return low-est square postion
     * 返回最下面方块的位置类
     */
    get bottom() {
        return this.data[3];
    }

    /**
     * clear all four squares of this shape from game data
     * 把这个形状的4个方块从游戏数据中清除
     */
    clear() {
        this.data.forEach((d) => this.game.set(d.x, d.y, false));
    }

    /**
     * write all four squares of this shape into game data(display in the web page)
     * 把这个形状的4个方块写入游戏数据中（显示出来）
     */
    write() {
        this.data.forEach((d) => this.game.set(d.x, d.y, true));
    }

    /**
     * Receive a shape that after moved of rotated
     * 接受一个变过的shape实例
     * @param {Shape instance} peek shape after try
     * 
     * @returns {Boolean}
     *      true change(s) is ok to do          可以这么改
     *      false change(s) is not allow to do  不可以这么改
     */
    can_do_that(peek) {
        if(peek === null) return false;
        if( this.game.get(peek.top.x, peek.top.y)       !== 1 && this.game.get(peek.top.x, peek.top.y)          !== null &&
            this.game.get(peek.bottom.x, peek.bottom.y) !== 1 && this.game.get(peek.bottom.x, peek.bottom.y)    !== null &&
            this.game.get(peek.left.x, peek.left.y)     !== 1 && this.game.get(peek.left.x, peek.left.y)        !== null &&
            this.game.get(peek.right.x, peek.right.y)   !== 1 && this.game.get(peek.right.x, peek.right.y)      !== null
         ){
            return true;
         }
         return false;
    }

    /**
     *  literally move left (one unit)
     *  就是字面上的往左移动（一个单位）
     */
    moveLeft () {
        if(this.dead) return false;
        if(this.left.x <= 1) return false;
        this.clear();
        const peek = this.clone();
        peek.center = peek.center.get_new_x(-1);
        if( this.can_do_that(peek) ){
            this.center = this.center.get_new_x(-1);
            this.write();
            return true;
        }
        return false;
    }

    /**
     * literally move right(one unit)
     * 就是字面上的往右移动（一个单位）
     */
    moveRight () {
        if(this.dead) return false;
        if(this.right.x >= 10) return false;
        this.clear();
        const peek = this.clone();
        peek.center = peek.center.get_new_x(1);
        if( this.can_do_that(peek) ){
            this.center = this.center.get_new_x(1);
            this.write();
            return true;
        }
        return false;
    }

    clone() {
        return new Shape(this.game, this.center.clone(), this.shape, this.orientation);
    }

    /**
     * literally move down(one unit)
     * 就是字面上的往下移动（一个单位）
     */
    moveDown () {
        if(this.dead) return false;
        this.clear();
        const peek = this.clone();
        peek.center = peek.center.get_new_y(1);
        if( this.can_do_that(peek) ){
            this.center = this.center.get_new_y(1); 
            this.write();
            return true;
        }
        else{
            this.dead = true;
            this.write();
            return false;
        }
    }

    /**
     * literally drop:  move all the way down(several unit)
     * 就是字面上的往下移动（多个单位），到不能移动为止
     */
    drop() {
        if(this.dead) return false;
        this.clear();
        const peek = this.clone();
        while(peek.moveDown());
        this.center = peek.center;
        this.write();
        this.dead = true;
    }

    /**
     * rotate sneak peek
     * 返回旋转之后的数据，不改变自身
     * @returns {Shape} sneak peek data
     */
    changeOrientationPeek() {
        switch( this.shape ){
            case SHAPE.I:
                if( this.orientation === O_I.D0 ) {
                    return new Shape(this.game, this.center, this.shape, O_I.D1);
                }
                else if( this.orientation === O_I.D1 ) {
                    return new Shape(this.game, this.center, this.shape, O_I.D0);
                }
                break;
            case SHAPE.S:
            case SHAPE.Z:
                if( this.orientation === O_Z_S.D0 ) {
                    return new Shape(this.game, this.center, this.shape, O_Z_S.D1);
                }
                else if( this.orientation === O_Z_S.D1 ) {
                    return new Shape(this.game, this.center, this.shape, O_Z_S.D0);
                }
                break;
            case SHAPE.J:
            case SHAPE.L:
                if( this.orientation < O_J_L.D3 ) {
                    return new Shape(this.game, this.center, this.shape, this.orientation + 1);
                }
                else if( this.orientation === O_J_L.D3) {
                    return new Shape(this.game, this.center, this.shape, O_J_L.D0);
                }
                break;
            case SHAPE.O:
                return this;
            case SHAPE.W:
                if( this.orientation < O_W.D3 ) {
                    return new Shape(this.game, this.center, this.shape, this.orientation + 1);
                }
                else if( this.orientation === O_J_L.D3) {
                    return new Shape(this.game, this.center, this.shape, O_W.D0);
                }
                break;
        }


        return null;
    }

    /**
     * actual rotation
     * 旋转
     */
    changeOrientation() {
        this.clear();
        const peek = this.changeOrientationPeek();
        
        if( this.can_do_that( peek ) ) {
            this.orientation = peek.orientation;
            this.write();
            return true;
        }
        this.write();
        return false;
    }
}

// Game class
class Game {
    constructor() {
        // game main data
        // 10 * 20 cells with 200bits(25 * 8)
        //      1 have
        //      0 have not
        // 游戏主要数据（绘制信息）
        // 10 * 20 个格子 用 200比特 （25个8bit uint）来代表
        // 其中一bit是一个格子的状态
        //      1 是有方块
        //      0 是空白的
        this.data = new Uint8Array(25);
        // current shape instance
        //当前的shape
        this.cur  = null;
        // least time gap between two input
        // 两次输入最小间隔
        this.threshold = 200;
        // timeout index
        this.thresholdTimeout = null;

        // a bunch of input handle
        // 一堆输入操作
        window.addEventListener("keydown", event => {
            if(this.cur !== null && this.cur !== undefined && this.thresholdTimeout === null) {
                if (event.code === 'ArrowDown') {
                    this.cur.drop();
                }
                else if(event.code === 'ArrowUp') {
                    this.cur.changeOrientation();
                }
                else if(event.code === 'ArrowLeft') {
                    this.cur.moveLeft();
                }
                else if(event.code === 'ArrowRight') {
                    this.cur.moveRight();
                }
                this.thresholdTimeout = setTimeout(() => {
                    this.thresholdTimeout = null
                }, this.threshold);
            }
          });
    }

    // get game data in specific position
    // 获取指定位置上的数据
    get(x, y) {
        if (x > 0 && x <= 10 && y > 0 && y <= 20) {
            const [x_, y_] = [y-1, x-1]
            return (this.data[Math.floor((x_ * 10 + y_) / 8)] >> (7 - ((x_ * 10 + y_) % 8))) & 1;
        } 
        else return null;
    }

    // set game data in specific position
    // 设置指定位置上的数据
    set(x, y, doesHave) {
        if (x > 0 && x <= 10 && y > 0 && y <= 20) {
            const [x_, y_] = [y-1, x-1];
            const d = doesHave ? 1 : 0;
            this.data[Math.floor((x_ * 10 + y_) / 8)] ^= (-d ^ this.data[Math.floor((x_ * 10 + y_) / 8)]) & (1 << (7 - ((x_ * 10 + y_) % 8)));
            return true;
        }
        else return false;
    }

    
    /**
     * generate a number in [a, b] closed interval
     * 生成随机数 [a, b] 闭区间
     * @param {*} a smallest, greater than -10000
     * @param {*} b  biggest, less than 10000
     */
    random(a, b) {
        return (Math.floor(Math.random() * 10000) % (b - a + 1)) + a;
    }

    // reset game data
    // 重置游戏数据
    reset() {
        this.data = new Uint8Array(25);
    }

    // eliminate 10 in a row
    // 满行消除
    eliminate() {
        let elines = [];
        for(let y = 1; y <= 20; y++) {
            let counter = 0;
            let flag = false;
            for (let cur of this.cur.data) {
                if(cur.y === y && !this.cur.dead)
                    flag = true;
            }
            if(flag && !this.cur.dead) continue;
            for(let x = 1; x <= 10; x++) {
                if(this.get(x, y) === 1) {
                    counter ++;
                }
            }
            if(counter === 10) {
                elines.push(y);
            }
        }
        for (let eline of elines) {
            for (let y = eline; y > 1; y--){
                if(eline > 1) {
                    for(let x = 1; x <= 10; x++) {
                        let flag = false;
                        for (let cur of this.cur.data) {
                            if(cur.x===x && (cur.y === y || cur.y + 1 === y))
                                flag = true;
                        }
                        if(flag) break;
                        // console.log(x, y, this.get(x, y - 1), this.cur.data)
                        this.set(x, y, false);
                        this.set(x, y, this.get(x, y - 1));
                    }
                }
                else {
                    this.set(x, y, false);
                }
            }
        }
    }
    
    // game logic flow
    // 游戏流程
    run() {
        if(this.cur === null || this.cur.dead){
            // a dead shape with toppest square y <= 1
            // 一个”死了“的形状的y <= 1
            if(this.cur !== null && this.cur.top.y <= 1) {
                alert("Game over!")
                this.reset();
            }
            // random shape type
            // 随机形状
            let shape = this.random(SHAPE.Z, SHAPE.I);
            this.cur = new Shape(this, new Position(5, 1), shape, null);
            // display this new-born shape
            this.cur.write();
        }

        // move down and score check
        this.cur.moveDown();
        this.eliminate();
        setTimeout(() => {
            this.run();
        }, 1000);
    }
}


const div = document.getElementById("div");
const game = new Game();

(function draw(game) {
    const data = game.data;
    if ( data === null ) return;
    let str = "";
    for (let item of data) {
        str += item.toString(2).padStart(8, 0); // a Byte to 8bits binary string
    }
    str = str.match(/.{1,10}/g).join("<br>");   // chunk to 10bits every line
    str = str.replace(/1/g, "■");               // beautify
    str = str.replace(/0/g, "□");               // beautify
    // div.innerHTML = "";
    div.innerHTML = str;                        // write to html

    setTimeout(() => {
        draw(game);
    }, 200);
})(game);
game.run();
