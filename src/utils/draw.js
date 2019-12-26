import axios from 'axios';

const drawImgCache = {};

class Draw {
    constructor(w, h) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = w;
        this.canvas.height = h;
        this.ctx = this.canvas.getContext('2d');
    }

    init(w, h) {
        this.ctx.clearRect(0, 0, this.canvas.w, this.canvas.h);
        this.canvas.width = w;
        this.canvas.height = h;
    }

    clear(x, y, w, h, options) {
        const _options = Object.assign({
            rotate: 0,
            fillColor: null
        }, options);
        if (_options.rotate) {
            this.ctx.save();
            const rotate = _options.rotate * Math.PI / 180;
            this.ctx.translate(x, y);
            this.ctx.rotate(rotate);
            this.ctx.clearRect(0, 0, w, h);
            if (_options.fillColor) {
                this.ctx.fillStyle = _options.fillColor;
                this.ctx.fillRect(0, 0, w, h);
            }
            this.ctx.translate(-x, -y);
            this.ctx.restore();
        } else {
            this.ctx.clearRect(x, y, w, h);
            if (_options.fillColor) {
                this.ctx.fillStyle = _options.fillColor;
                this.ctx.fillRect(x, y, w, h);
            }
        }
    }

    fillBg(color) {
        this.ctx.save();
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fill();
        this.ctx.restore();
    }

    getImg(source) {
        return new Promise((resolve, reject)=> {
            let img = new Image();
            img.onload = ()=> resolve(img);
            img.onerror = ()=> reject('getImg err');
            this.getImgUrl(source)
                .then(url=> {
                    if(url.indexOf('http') >= 0) {
                        img.crossOrigin = '';
                    }
                    img.src = url;
                })
                .catch(err=> reject(err));
        });
    }

    getImgUrl(source) {
        return new Promise((resolve, reject)=> {
            if (source.indexOf('data:image/') >= 0) {
                resolve(source);
            } else if(drawImgCache[source]) {
                console.log('从缓存获取图片');
                resolve(drawImgCache[source]);
            } else {
                axios.get(source, {responseType: 'blob'})
                    .then(data=> {
                        let reader = new FileReader();
                        reader.onload = (e)=> {
                            drawImgCache[source] = e.currentTarget.result;
                            resolve(e.currentTarget.result);
                        };
                        reader.onerror = (e)=> reject(e);
                        reader.readAsDataURL(data.data);
                    })
                    .catch(err=> reject(err));
            }
        });
    }

    drawImg(source, x = 0, y = 0, w = -1, h = -1, options) {
        return new Promise((resolve, reject)=> {
            const _options = Object.assign({
                isCircle: false,
                rotate: 0
            }, options);
            this.getImg(source)
                .then(img=> {
                    if (w === -1) {
                        w = img.width;
                    }
                    if (h === -1) {
                        h = img.height;
                    }
                    if (_options.isCircle) {
                        this.ctx.save();
                        this.ctx.beginPath();
                        this.ctx.arc(x + w / 2, y + w / 2, w / 2, 0, 2 * Math.PI, false);
                        this.ctx.clip();
                        this.ctx.drawImage(img, x, y, w, w);
                        this.ctx.closePath();
                        this.ctx.restore();
                    } else {
                        if (_options.rotate) {
                            this.ctx.save();
                            const rotate = _options.rotate * Math.PI / 180;
                            this.ctx.translate(x, y);
                            this.ctx.rotate(rotate);
                            this.ctx.drawImage(img, 0, 0, w, h);
                            this.ctx.translate(-x, -y);
                            this.ctx.restore();
                        } else {
                            this.ctx.drawImage(img, x, y, w, h);
                        }
                    }
                    resolve(this);
                })
                .catch(e=> {
                    console.log(e);
                    resolve(this);
                });
        });
    }

    drawCircle(x, y, r, color) {
        return new Promise((resolve, reject)=> {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(x + r, y + r, r, 0, 2 * Math.PI, false);
            this.ctx.fillStyle = color;
            this.ctx.fill();
            this.ctx.closePath();
            this.ctx.restore();
            resolve(this);
        });
    }

    drawText(text, x, y, options) {
        return new Promise((resolve, reject)=> {
            const _options = Object.assign({
                fontWeight: 'bold',
                fontSize: '28px',
                fontFamily: 'Arial',
                color: '#000000',
                center: false,
                rotate: 0
            }, options);
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.font = `${_options.fontWeight} ${_options.fontSize} ${_options.fontFamily}`;
            this.ctx.fillStyle = _options.color;
            this.ctx.textBaseline = 'top';
            let dText = `${text}`;
            let textWidth = this.ctx.measureText(dText).width;
            if (_options.maxWidth && textWidth > _options.maxWidth) {
                const ellipsis = '...';
                const eWidth = this.ctx.measureText(ellipsis).width;
                while(eWidth <= _options.maxWidth) {
                    dText = dText.slice(0, -1);
                    if (this.ctx.measureText(dText).width + eWidth <= _options.maxWidth) {
                        break;
                    }
                }
                textWidth = this.ctx.measureText(dText).width + eWidth;
                dText += ellipsis;
            }
            if (_options.center) {
                x -= textWidth / 2;
            }
            if (_options.rotate) {
                this.ctx.save();
                const rotate = _options.rotate * Math.PI / 180;
                if (options.center) {
                    y += -1 * Math.sin(rotate) * textWidth / 2;
                }
                this.ctx.translate(x, y);
                this.ctx.rotate(rotate);
                this.ctx.fillText(dText, 0, 0);
                this.ctx.translate(-x, -y);
                this.ctx.restore();
            } else {
                this.ctx.fillText(dText, x, y);
            }
            this.ctx.closePath();
            this.ctx.restore();
            resolve(this);
        });
    }

    export() {
        return this.canvas.toDataURL('image/png');
    }
}

export default Draw;