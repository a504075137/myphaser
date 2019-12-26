import Phaser, { Game, Loader } from 'phaser';
import Vue from 'vue';

let cursors;
class HwPip {
    constructor() {
        this.game = null;
        this.scene = {
            update: this.update.bind(this),
            create: this.initial.bind(this),
        };
        this.config = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            transparent: true,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 300 },
                    debug: false
                }
            },
        };
        // this.fishGroup = new FishGroup();
        this.imgList = [];
        this.wh = {};
        this.scaleNum = 1;
        this.fishList = [];
        this.currentIndex = 0;
        this.offset = {};
        this.platforms = {};
        this.eventList = {};
        this.flag = false;
        this.moving = false;
    }
    async load(loadCb = () => { }) {
        const that = this;
        const configObj = that.scene;
        return new Promise(resolve => {
            this.game.scene.add('pipScene',
                Object.assign({
                    preload: function () {
                        that.scene = this;
                        this.load.on('complete', () => {
                            resolve();
                        });
                        this.load.on('load', () => {
                            loadCb('load');
                        });
                        const _load = (list) => {
                            for (let i = 0; i < list.length; ++i) {
                                const item = list[i];
                                if (item.type === 'spritesheet') {
                                    this.load.spritesheet(item.key, item.url, item.sheetConfig);
                                } else if (item.type === 'group') {
                                    _load(item.children);
                                } else {
                                    this.load.image(item.key, item.url);
                                }
                            }
                        };
                        _load(that.imgList);
                        // this.load.image('fish1', require('@pip/fish1.png'));
                    }
                }, configObj), true);
        });

        // this.load.image('sky', '@imgs/sky.png');
        // this.load.image('ground', '@imgs/platform.png');
        // this.load.image('star', '@imgs/star.png');
        // this.load.image('bomb', '@imgs/bomb.png');
        // this.load.spritesheet('dude', '@imgs/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    init(imgList = []) {
        this.imgList = imgList;
        return this;
    }
    create(config) {
        this.wh = config;
        this.scaleNum = window.innerWidth / 750 * 2;
        this.game = new Game(Object.assign(this.config, config));
        return this;
    }
    initial() {
        this.width = this.game.renderer.width;
        this.height = this.game.renderer.height;
        this.scaleNum = window.innerWidth / 750 * 2;
        this.addBox();
        this.fishGroup = new Fish();
        this.fishGroup.init.call(this);

    }
    addBox() {
        this.platforms = this.scene.physics.add.staticGroup();
        const h = this.wh.height - 68;
        const w = this.wh.width / 4;
        this.addEachBox(89, h, 'yrz');
        this.addEachBox(w + 89, h, 'www');
        this.addEachBox(w * 2 + 89, h, '淳爷');
        this.addEachBox(w * 3 + 89, h, 'lsf');
        // this.platforms.create(w + 89, h, 'box').refreshBody();
        // this.platforms.create(w * 2 + 89, h, 'box').refreshBody();
        // this.platforms.create(w * 3 + 89, h, 'box').refreshBody();
        this.platforms.children.entries.map((item, index) => {
            item.boxid = index;
            return item;
        });
    }
    addEachBox(x, h, type) {
        const box = this.platforms.create(x, h, 'box').refreshBody();
        // console.log(111, box.setCircle);
        // box.setCircle(x / 2);
        const font = this.scene.add.text(x, h, type, { font: '24px', fill: '#754b44', align: 'left' });
        font.setX(x - font.displayWidth / 2);
    }
    update() {
        // if (cursors && cursors.left.isDown) {
        //     console.log("下");
        // }
        // var pointer = this.scene.input.activePointer;
        // if (pointer.isDown) {
        //     console.log(12121);
        //     // ...
        // }
    }
    touchStart(pointer, dragX, dragY) {
        if (this.moving) {
            return;
        }
        const index = arguments[0];
        this.currentIndex = index;
        this.moving = true;
    }
    touchMoving(pointer, dragX, dragY) {
        if (!this.moving) {
            return;
        }
        const fish = this.fishList[this.currentIndex];
        if (!fish) {
            return;
        }
        fish.setX(dragX);
        fish.setY(dragY);
        fish.setScale(0.1);
        // console.log('moving', x, this.fish1.displayWidth);
    }
    touchEnd(e) {
        const fish = this.fishList[this.currentIndex];
        fish && fish.setScale(0.3);
        this.moving = false;
        this.flag = false;
        // console.log('touchend', e);
    }
    judyge(fish, box) {
        if (this.flag) {
            return;
        }
        console.log(11111);
        this.flag = true;
        this.moving = false;
        this.boxid = box.boxid;
        if (this.boxid === fish.fishId) {
            this.fishList.splice(fish.fishId, 1);
            if (this.eventList['judge'] && this.fishList.length === 0) {
                this.eventList['judge'](1);
            }
            fish.disableBody(true, true);
        } else {
            if (!fish) {
                return;
            }
            fish.setX(100);
            fish.setY(100);
            if (this.eventList['judge']) {
                this.eventList['judge'](2);
            }
        }
        // box.disableBody(true, true);
    }
    listen(key, callback) {
        this.eventList[key] = callback;
    }
}
class Fish {
    constructor() {

    }
    init() {
        for (let i = 0; i < 2; i++) {
            this.fishList[i] = this.scene.physics.add.sprite(300, 300, `fish${i}`).setScale(0.3);
            console.log(12121, this.scene.physics.world, this.fishList[i]);
            this.fishList[i].fishId = i;
            // this.scene.physics.world.setChildIndex(this.fishList[i], 3);
            const fish = this.fishList[i];
            this.scene.physics.world.enable(fish);
            fish.setInteractive({ draggable: true });
            fish.setCollideWorldBounds(true);
            this.scene.physics.add.overlap(fish, this.platforms, this.judyge, null, this);
            fish.on("dragstart", function () { this.touchStart(i, ...arguments); }, this);
            fish.on("drag", this.touchMoving, this);
            fish.on("dragend", this.touchEnd, this);
            fish.body.allowGravity = false;
        }
    }

}



export default HwPip;