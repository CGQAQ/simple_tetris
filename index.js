// game part

const ORIENTATION = {
    D0: 0,
    D1: 1,
    D2: 2,
    D3: 3
}

const O_Z_S = {
    D0: ORIENTATION.D0,
    D1: ORIENTATION.D1
}

const O_J_L = {
    ...ORIENTATION
}

const O_O   = {
    D0: ORIENTATION.D0
}

const O_W   = {
    ...ORIENTATION
}

const O_I   = {
    ...O_Z_S
}

const SHAPE = {
    Z: 0,
    S: 1,
    J: 2,
    L: 3,
    O: 4,
    W: 5,
    I: 6
}

class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get_new_x(x) {
        return new Position(this.x + x, this.y);
    }

    get_new_y(y) {
        return new Position(this.x, this.y + y);
    }

    get_new_xy(x, y) {
        return new Position(this.x + x, this.y + y);
    }

    clone() {
        return new Position(this.x, this.y);
    }
}

class Shape {
    constructor(game, center, shape, orientation){
        if (game === undefined || center === undefined || shape === undefined) throw "wrong argument";
        if (orientation === undefined || orientation === null) {
            if(shape === SHAPE.I) {
                orientation = Math.floor(Math.random() * O_I.D1);
            }
            else if(shape === SHAPE.S || shape === SHAPE.Z) {
                orientation = Math.floor(Math.random() * O_Z_S.D1);
            }
            else if(shape === SHAPE.L || shape === SHAPE.J) {
                orientation = Math.floor(Math.random() * O_J_L.D3);
            }
            else if(shape === SHAPE.W) {
                orientation = Math.floor(Math.random() * O_W.D3);
            }
            else if(shape ===SHAPE.O) {
                orientation = O_O.D0;
            }
        }
        this.game = game;
        this.center             = center;
        this.shape              = shape;
        this.orientation        = orientation;

        this.dead = false;

        // this.write();
    }

    /**
     * return the postion data list
     *      [top, left, right, bottom]
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
                        this.center.get_new_x(-1),
                        this.center.clone(),
                        this.center.get_new_xy(1, -1),
                        this.center.get_new_x(1),
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
                        this.center.get_new_xy(-1, 1),
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
                        this.center.get_new_x(-1),
                        this.center.get_new_xy(-1, 1),
                        this.center.clone(),
                        this.center.get_new_x(1),
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

    get left () {
        return this.data[1];
    }
    get right() {
        return this.data[2];
    }
    get top() {
        return this.data[0];
    }
    get bottom() {
        return this.data[3];
    }

    clear() {
        this.data.forEach((d) => this.game.set(d.x, d.y, false));
    }

    write() {
        this.data.forEach((d) => this.game.set(d.x, d.y, true));
    }

    moveLeft () {
        if( game.get(this.left.x - 1, this.left.y) !== 1        &&
            game.get(this.left.x - 1, this.left.y) !== null
        ){
            this.clear();
            this.center = this.center.get_new_x(-1);
            this.write();
            return true;
        }
        return false;
    }

    moveRight () {
        if( game.get(this.right.x + 1, this.right.y) !== 1      &&
            game.get(this.right.x + 1, this.right.y) !== null
        ){
            this.clear();
            this.center = this.center.get_new_x(1);
            this.write();
            return true;
        }
        return false;
    }

    moveDownPeek() {
        return new Shape(this.game, this.center.get_new_y(1), this.shape, this.orientation);
    }

    moveDown () {
        this.clear();
        const peek = this.moveDownPeek();
        if( this.game.get(peek.top.x, peek.top.y)       !== 1 && this.game.get(peek.top.x, peek.top.y)          !== null &&
            this.game.get(peek.bottom.x, peek.bottom.y) !== 1 && this.game.get(peek.bottom.x, peek.bottom.y)    !== null &&
            this.game.get(peek.left.x, peek.left.y)     !== 1 && this.game.get(peek.left.x, peek.left.y)        !== null &&
            this.game.get(peek.right.x, peek.right.y)   !== 1 && this.game.get(peek.right.x, peek.right.y)      !== null
         ){
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

    drop() {
        this.clear();
        const peek = this.moveDownPeek();
        while(peek.moveDown());
        this.center = peek.center;
        this.write();
    }

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

    changeOrientation() {
        // if( this.shape === SHAPE.I ) {
        //     if( this.orientation === O_I.D0 ) { // D0 ---- 2nd is center
        //         if( game.get(this.center.x, this.bottom.y + 2) !== 1 &&
        //             game.get(this.center.y, this.right.x + 2) !== null) 
        //         {
        //             this.orientation = O_I.D1;
        //             return true;
        //         }
        //         else {
        //             return false;
        //         }
        //     }
        //     else {                              // D1 | 
        //         if( game.get(this.center.y, this.right.x + 2) !== 1 && 
        //             game.get(this.center.y, this.right.x + 2) !== null) 
        //         {
        //             this.orientation = O_I.D0;
        //             return true;
        //         }
        //         else {
        //             return false;
        //         }
        //     }
        // }
        // if ( this.shape === SHAPE.J || this.shape === SHAPE.L) {
        //     if( this.orientation === O_J_L.D0 ) {   // J || L
        //         if ( this.shape === SHAPE.J ) {
        //             if( game.get(this.center.x))
        //         }
        //     }
        // }
        // dumbass code above

        this.clear();

        const s = this.changeOrientationPeek();
        if(s === null) return false;

        const   left    = game.get(s.left.x, s.left.y), 
                right   = game.get(s.right.x, s.right.y),
                bottom  = game.get(s.bottom.x, s.bottom.y),
                top     = game.get(s.top.x, s.top.x)

        if( left    !== 1   && left    !== null &&
            right   !== 1   && right   !== null &&
            top     !== 1   && top     !== null &&
            bottom  !== 1   && bottom  !== null 
        ) {
            this.orientation = s.orientation;
            this.write();
            return true;
        }
        this.write();
        return false;
    }
}


class Game {
    constructor() {
        // game main data
        // 10 * 20 cells with 200bits(25 * 8)
        //      1 have
        //      0 have not
        this.data = new Uint8Array(25);
        this.cur  = null;

        window.addEventListener("keydown", event => {
            if(this.cur !== null && this.cur !== undefined) {
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
            }
          });
    }

    get(x, y) {
        if (x > 0 && x <= 10 && y > 0 && y <= 20) {
            const [x_, y_] = [y-1, x-1]
            return (this.data[Math.floor((x_ * 10 + y_) / 8)] >> (7 - ((x_ * 10 + y_) % 8))) & 1;
        } 
        else return null;
    }

    set(x, y, doesHave) {
        if (x > 0 && x <= 10 && y > 0 && y <= 20) {
            const [x_, y_] = [y-1, x-1];
            const d = doesHave ? 1 : 0;
            this.data[Math.floor((x_ * 10 + y_) / 8)] ^= (-d ^ this.data[Math.floor((x_ * 10 + y_) / 8)]) & (1 << (7 - ((x_ * 10 + y_) % 8)));
            return true;
        }
        else return false;
    }

    reset() {
        this.data = new Uint8Array(25);
    }
    
    run() {
        if(this.cur === null || this.cur.dead){
            if(this.cur !== null && this.cur.top.y <= 1) {
                this.reset();
            }
            let shape = Math.floor(Math.random() * SHAPE.I);
            this.cur = new Shape(this, new Position(5, 1), shape, null);
            this.cur.write();
        }

        this.cur.moveDown();
        
        setTimeout(() => {
            this.run();
        }, 700);
    }
}


const div = document.getElementById("div");
const game = new Game();

(function draw(d) {
    let str = "";
    for (let item of d) {
        str += item.toString(2).padStart(8, 0);
    }
    str = str.match(/.{1,10}/g).join("<br>");
    str = str.replace(/1/g, "■");
    str = str.replace(/0/g, "□");
    div.innerHTML = "";
    div.innerHTML = str;

    setTimeout(() => {
        draw(d);
    }, 500);
})(game.data);
game.run();
