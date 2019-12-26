export default class VHScroll {
    constructor() {
        this.content = null;
        this.touchId = 0;
        this.isTouchStart = false;

        this.startX = 0;
        this.startY = 0;

        this.endX = 0;
        this.endY = 0;

        this.minDistance = 50;
    
        this.scrollListener = {
            onStart: (x, y)=> {},
            onScroll: (sx, sy, ex, ey)=> {},
            onEnd: (xy, dir, x, y)=> {}
        };
    }

    setup(content) {
        this.content = content;
        this._listen();
        return this;
    }

    setMinDistance(minDistance) {
        this.minDistance = minDistance;
        return this;
    }

    listen(scrollListener) {
        this.scrollListener = scrollListener;
        return this;
    }
    
    _listen() {
        this.content.addEventListener('touchstart', this._start.bind(this), { passive: false });
        this.content.addEventListener('touchmove', this._move.bind(this), { passive: false });
        this.content.addEventListener('touchend', this._end.bind(this), { passive: false });
    }

    invalid() {
        this.isTouchStart = false;
    }

    _start(event) {
        if (this.isTouchStart || event['touches'].length !== 1) {
            // 防止多点触碰
            return;
        }
        this.isTouchStart = true;
        // event.preventDefault();

        this.touchId = event['touches'][0].identifier;

        this.startX = event['touches'][0].pageX;
        this.startY = event['touches'][0].pageY;

        this.endX = event['touches'][0].pageX;
        this.endY = event['touches'][0].pageY;

        this.scrollListener && 
        this.scrollListener.onStart && 
        this.scrollListener.onStart(this.startX, this.startY);
    }

    _move(event) {
        if (!this.isTouchStart) {
            return;
        }

        let nowTouchId = event['touches'][0].identifier;
        if (nowTouchId !== this.touchId) {
            return;
        }
        event.preventDefault();

        this.endX = event['touches'][0].pageX;
        this.endY = event['touches'][0].pageY;

        this.scrollListener && 
        this.scrollListener.onScroll && 
        this.scrollListener.onScroll(this.startX, this.startY, this.endX, this.endY);
    }

    _end(event) {
        if (!this.isTouchStart) {
            return;
        }
        this.isTouchStart = false;
        // event.preventDefault();

        let xy = 'x';
        let dis = this.endX - this.startX;
        // 垂直滑动
        if (Math.abs(this.endX - this.startX) < Math.abs(this.endY - this.startY)) {
            xy = 'y';
            dis = this.endY - this.startY;
        }

        if (Math.abs(dis) < this.minDistance) {
            return;
        }
        let dir = dis / Math.abs(dis);
        // 返回方向，-1是向左滑动/上滑动，1是向右滑动/下滑动
        this.scrollListener && 
        this.scrollListener.onEnd && 
        this.scrollListener.onEnd(xy, dir, this.endX, this.endY, dis);
    }
}