//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.speed = 0.05;
        this.timeOnEnterFrame = 0;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=Main,p=c.prototype;
    p.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    p.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    p.onEnterFrame = function (e) {
        var now = egret.getTimer();
        var time = this.timeOnEnterFrame;
        var pass = now - time;
        this.alpha -= 0.04;
        this.timeOnEnterFrame = egret.getTimer();
        if (this.alpha <= 0)
            this.alpha = 1;
    };
    p.onEnterFrame2 = function (e) {
        var now = egret.getTimer();
        var time = this.timeOnEnterFrame;
        var pass = now - time;
        this.alpha -= 0.01;
        this.timeOnEnterFrame = egret.getTimer();
        if (this.alpha <= -0.4)
            this.alpha = 0.5;
    };
    p.onEnterFrameplus = function (e) {
        var now = egret.getTimer();
        var time = this.timeOnEnterFrame;
        var pass = now - time;
        do {
            this.alpha += 0.01;
        } while (this.alpha < -1);
        this.timeOnEnterFrame = egret.getTimer();
    };
    //渐变函数
    /**
     * 创建游戏场景
     * Create a game scene
     */
    p.createGameScene = function () {
        var stageW = this.stage.stageWidth;
        var stageAW = this.stage.stageWidth * 2;
        var stageH = this.stage.stageHeight;
        this.scrollRect = new egret.Rectangle(0, 0, stageAW, stageH);
        this.cacheAsBitmap = true;
        this.touchEnabled = true;
        var origintouchpointX = 0;
        var originstagepointX = 0;
        var movedistance = 0;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, scrollmove, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, scrollstop, this);
        function scrollmove(e) {
            if ((this.scrollRect.x % stageW) != 0) {
                this.scrollRect.x = originstagepointX;
            }
            origintouchpointX = e.stageX;
            originstagepointX = this.scrollRect.x;
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, onScroll, this);
        }
        function onScroll(e) {
            var rect = this.scrollRect;
            movedistance = origintouchpointX - e.stageX;
            rect.x = (originstagepointX + movedistance);
            this.scrollRect = rect;
        }
        function scrollstop(e) {
            var rect = this.scrollRect;
            if ((movedistance >= (this.stage.stageWidth / 4)) && originstagepointX != stageAW) {
                rect.x = originstagepointX + stageW;
                this.scrollRect = rect;
                movedistance = 0;
            }
            else if ((movedistance <= (-(this.stage.stageWidth / 4))) && originstagepointX != 0) {
                rect.x = originstagepointX - stageW;
                this.scrollRect = rect;
                movedistance = 0;
            }
            else {
                movedistance = 0;
                rect.x = originstagepointX;
                this.scrollRect = rect;
            }
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, onScroll, this);
        }
        /*function lineScroll(e: egret.TouchEvent): void {
             var rect: egret.Rectangle = this.scrollRect;
             switch (e.currentTarget) {
                 case btnRight:
                 rect.x -= 150;
                 break;
                 }
             this.scrollRect = rect;
            }
            */
        //////////////////////////////////////////////////////////////////
        var p1 = new egret.DisplayObjectContainer();
        this.addChild(p1);
        p1.width = stageW;
        p1.height = stageH;
        var sky = this.createBitmapByName("6f4f566600619cb717cecb07_jpg");
        p1.addChild(sky);
        sky.width = stageW * 2;
        sky.height = stageH;
        sky.x = -250;
        //添加背景
        var headportrait = this.createBitmapByName("51654332_p0_png");
        headportrait.x = -525;
        headportrait.y = 100;
        //添加头像
        /*var topMask = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.5);
        topMask.graphics.drawRect(0, 0, stageW, 172);
        topMask.graphics.endFill();
        topMask.y = 33;
        p1.addChild(topMask);
        */
        //添加阴影
        /*
        var icon:egret.Bitmap = this.createBitmapByName("egret_icon_png");
        p1.addChild(icon);
        icon.x = 26;
        icon.y = 33;
        */
        //添加白鹭图标
        /*
        var line = new egret.Shape();
        line.graphics.lineStyle(2,0xffffff);
        line.graphics.moveTo(0,0);
        line.graphics.lineTo(0,117);
        line.graphics.endFill();
        line.x = 172;
        line.y = 61;
        p1.addChild(line);
        */
        //添加一条白色直线
        var backcircle = new egret.Shape();
        backcircle.x = 100;
        backcircle.y = 100;
        backcircle.graphics.beginFill(0x7093DB, 1);
        backcircle.graphics.drawCircle(325, 170, 138);
        backcircle.graphics.endFill();
        backcircle.alpha = 0.1;
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame2, backcircle);
        this.timeOnEnterFrame = egret.getTimer();
        p1.addChild(backcircle);
        var backcircle2 = new egret.Shape();
        backcircle2.x = 100;
        backcircle2.y = 100;
        backcircle2.graphics.beginFill(0x7093DB, 1);
        backcircle2.graphics.drawCircle(325, 170, 170);
        backcircle2.graphics.endFill();
        backcircle2.alpha = 0.3;
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame2, backcircle2);
        this.timeOnEnterFrame = egret.getTimer();
        p1.addChild(backcircle2);
        var backcircle3 = new egret.Shape();
        backcircle3.x = 100;
        backcircle3.y = 100;
        backcircle3.graphics.beginFill(0x7093DB, 1);
        backcircle3.graphics.drawCircle(325, 170, 200);
        backcircle3.graphics.endFill();
        backcircle3.alpha = 0.5;
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame2, backcircle3);
        this.timeOnEnterFrame = egret.getTimer();
        p1.addChild(backcircle3);
        var shp = new egret.Shape();
        shp.x = 100;
        shp.y = 100;
        shp.graphics.lineStyle(10, 0x00ff00);
        shp.graphics.beginFill(0xff0000, 1);
        shp.graphics.drawCircle(325, 170, 115);
        shp.graphics.endFill();
        p1.addChild(shp);
        p1.addChild(headportrait);
        headportrait.mask = shp;
        //遮罩用的圆
        var shp2 = new egret.Shape();
        shp2.graphics.lineStyle(4, 0xffffff);
        shp2.graphics.moveTo(stageW / 2 + 230, 1100);
        shp2.graphics.lineTo(stageW / 2 + 230, 1040);
        shp2.graphics.lineTo(stageW / 2 + 281, 1070);
        shp2.graphics.lineTo(stageW / 2 + 230, 1100);
        shp2.graphics.endFill();
        p1.addChild(shp2);
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, shp2);
        this.timeOnEnterFrame = egret.getTimer();
        var shp3 = new egret.Shape();
        shp3.graphics.lineStyle(4, 0xffffff);
        shp3.graphics.moveTo(stageW / 2 + 250, 1100);
        shp3.graphics.lineTo(stageW / 2 + 250, 1040);
        shp3.graphics.lineTo(stageW / 2 + 301, 1070);
        shp3.graphics.lineTo(stageW / 2 + 250, 1100);
        shp3.alpha = 0.8;
        shp3.graphics.endFill();
        p1.addChild(shp3);
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, shp3);
        this.timeOnEnterFrame = egret.getTimer();
        /*var line = new egret.Shape();
        line.graphics.lineStyle(6,0x000000);
        line.graphics.moveTo(0,0);
        line.graphics.lineTo(400,0);
        line.graphics.endFill();
        line.x = 120;
        line.y = stageH/2-50;
        p1.addChild(line);

        var line2 = new egret.Shape();
        line2.graphics.lineStyle(6,0x000000);
        line2.graphics.moveTo(0,0);
        line2.graphics.lineTo(400,0);
        line2.graphics.endFill();
        line2.x = 120;
        line2.y = 220;
        p1.addChild(line2);*/
        //添加横线
        var colorLabel = new egret.TextField();
        colorLabel.x = stageW;
        colorLabel.textColor = 0xffffff;
        colorLabel.width = stageW - 300;
        colorLabel.fontFamily = "Microsoft JhengHei";
        colorLabel.textAlign = "center";
        colorLabel.text = "崔天舒";
        colorLabel.size = 55;
        colorLabel.x = 20;
        colorLabel.y = 900;
        p1.addChild(colorLabel);
        5;
        var colorLabel2 = new egret.TextField();
        colorLabel2.x = stageW;
        colorLabel2.textColor = 0xffffff;
        colorLabel2.width = stageW - 300;
        colorLabel2.fontFamily = "Microsoft JhengHei";
        colorLabel2.textAlign = "center";
        colorLabel2.text = "14081205";
        colorLabel2.size = 50;
        colorLabel2.x = 20;
        colorLabel2.y = 1000;
        p1.addChild(colorLabel2);
        var textfield = new egret.TextField();
        this.addChild(textfield);
        textfield.alpha = 0;
        textfield.width = stageW - 172;
        textfield.textAlign = egret.HorizontalAlign.CENTER;
        textfield.size = 24;
        textfield.textColor = 0xffffff;
        textfield.x = 172;
        textfield.y = 135;
        this.textfield = textfield;
        ////////////////////////////////////////////////////
        var p2 = new egret.DisplayObjectContainer();
        p2.x = stageW;
        p2.width = stageW;
        p2.height = stageH;
        this.addChild(p2);
        var sky2 = this.createBitmapByName("6f4f566600619cb717cecb08_jpg");
        sky2.width = stageW;
        sky2.height = stageH;
        p2.addChild(sky2);
        var p2rectangle = new egret.Shape();
        p2rectangle.graphics.lineStyle(4, 0xffffff);
        p2rectangle.graphics.moveTo(stageW / 2 + 230, 1100);
        p2rectangle.graphics.lineTo(stageW / 2 + 230, 1040);
        p2rectangle.graphics.lineTo(stageW / 2 + 281, 1070);
        p2rectangle.graphics.lineTo(stageW / 2 + 230, 1100);
        p2rectangle.graphics.endFill();
        p2.addChild(p2rectangle);
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, p2rectangle);
        this.timeOnEnterFrame = egret.getTimer();
        var p2rectangle2 = new egret.Shape();
        p2rectangle2.graphics.lineStyle(4, 0xffffff);
        p2rectangle2.graphics.moveTo(stageW / 2 + 250, 1100);
        p2rectangle2.graphics.lineTo(stageW / 2 + 250, 1040);
        p2rectangle2.graphics.lineTo(stageW / 2 + 301, 1070);
        p2rectangle2.graphics.lineTo(stageW / 2 + 250, 1100);
        p2rectangle2.alpha = 0.8;
        p2rectangle2.graphics.endFill();
        p2.addChild(p2rectangle2);
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, p2rectangle2);
        this.timeOnEnterFrame = egret.getTimer();
        var p2rectangle3 = new egret.Shape();
        p2rectangle3.graphics.lineStyle(4, 0xffffff);
        p2rectangle3.graphics.moveTo(70, 1100);
        p2rectangle3.graphics.lineTo(70, 1040);
        p2rectangle3.graphics.lineTo(21, 1070);
        p2rectangle3.graphics.lineTo(70, 1100);
        p2rectangle3.alpha = 0.8;
        p2rectangle3.graphics.endFill();
        p2.addChild(p2rectangle3);
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, p2rectangle3);
        this.timeOnEnterFrame = egret.getTimer();
        var p2rectangle4 = new egret.Shape();
        p2rectangle4.graphics.lineStyle(4, 0xffffff);
        p2rectangle4.graphics.moveTo(90, 1100);
        p2rectangle4.graphics.lineTo(90, 1040);
        p2rectangle4.graphics.lineTo(41, 1070);
        p2rectangle4.graphics.lineTo(90, 1100);
        p2rectangle4.alpha = 0.8;
        p2rectangle4.graphics.endFill();
        p2.addChild(p2rectangle4);
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, p2rectangle4);
        this.timeOnEnterFrame = egret.getTimer();
        /*
        var btnRight: egret.Shape = new egret.Shape();
        btnRight.graphics.beginFill(0x01cccc);
        btnRight.graphics.drawRect(0,0,50,50);
        btnRight.graphics.endFill();
        btnRight.x = 150;
        btnRight.y = 100;
        p2.addChild(btnRight);
        btnRight.touchEnabled = true;
        //动画按钮

        var p2line = new egret.Shape();
        p2line.graphics.lineStyle(8,0x000000);
        p2line.graphics.moveTo(0,0);
        p2line.graphics.lineTo(400,0);
        p2line.graphics.endFill();
        p2line.scrollRect = new egret.Rectangle(0, 0, 600, 50);
        p2line.x = 80;
        p2line.y = 80;
        btnRight.addEventListener(egret.TouchEvent.TOUCH_TAP, lineScroll, p2line);
        p2.addChild(p2line);
        //标题直线
        */
        var p2colorLabel = new egret.TextField();
        p2colorLabel.x = stageW;
        p2colorLabel.textColor = 0xffffff;
        p2colorLabel.width = 60;
        p2colorLabel.fontFamily = "SimHei";
        p2colorLabel.textAlign = "center";
        p2colorLabel.text = "个人简介";
        p2colorLabel.size = 60;
        p2colorLabel.x = 550;
        p2colorLabel.y = 20;
        p2.addChild(p2colorLabel);
        //标题文字
        var p2colorLabel2 = new egret.TextField();
        p2colorLabel2.x = stageW;
        p2colorLabel2.textColor = 0x000000;
        p2colorLabel2.width = 250;
        p2colorLabel2.fontFamily = "Microsoft YaHei";
        p2colorLabel2.textAlign = "left";
        p2colorLabel2.text = "姓名：崔天舒";
        p2colorLabel2.size = 35;
        p2colorLabel2.x = 30;
        p2colorLabel2.y = 30;
        p2.addChild(p2colorLabel2);
        var p2colorLabel3 = new egret.TextField();
        p2colorLabel3.x = stageW;
        p2colorLabel3.textColor = 0x000000;
        p2colorLabel3.width = 250;
        p2colorLabel3.fontFamily = "Microsoft YaHei";
        p2colorLabel3.textAlign = "left";
        p2colorLabel3.text = "性别：男";
        p2colorLabel3.size = 35;
        p2colorLabel3.x = p2colorLabel2.x;
        p2colorLabel3.y = p2colorLabel2.y + 80;
        p2.addChild(p2colorLabel3);
        var p2colorLabel4 = new egret.TextField();
        p2colorLabel4.x = stageW;
        p2colorLabel4.textColor = 0x000000;
        p2colorLabel4.width = 250;
        p2colorLabel4.fontFamily = "Microsoft YaHei";
        p2colorLabel4.textAlign = "left";
        p2colorLabel4.text = "年龄：20";
        p2colorLabel4.size = 35;
        p2colorLabel4.x = p2colorLabel2.x;
        p2colorLabel4.y = p2colorLabel3.y + 80;
        p2.addChild(p2colorLabel4);
        var p2colorLabel5 = new egret.TextField();
        p2colorLabel5.x = stageW;
        p2colorLabel5.textColor = 0x000000;
        p2colorLabel5.width = 350;
        p2colorLabel5.fontFamily = "Microsoft YaHei";
        p2colorLabel5.textAlign = "left";
        p2colorLabel5.text = "专业：数字媒体";
        p2colorLabel5.size = 35;
        p2colorLabel5.x = p2colorLabel2.x;
        p2colorLabel5.y = p2colorLabel4.y + 80;
        p2.addChild(p2colorLabel5);
        var p2colorLabel6 = new egret.TextField();
        p2colorLabel6.x = stageW;
        p2colorLabel6.textColor = 0x000000;
        p2colorLabel6.width = 300;
        p2colorLabel6.fontFamily = "Microsoft YaHei";
        p2colorLabel6.textAlign = "left";
        p2colorLabel6.text = "学号：14081205";
        p2colorLabel6.size = 35;
        p2colorLabel6.x = p2colorLabel2.x;
        p2colorLabel6.y = p2colorLabel5.y + 80;
        p2.addChild(p2colorLabel6);
        var p2colorLabel7 = new egret.TextField();
        p2colorLabel7.x = stageW;
        p2colorLabel7.textColor = 0xffffff;
        p2colorLabel7.width = 300;
        p2colorLabel7.fontFamily = "Microsoft YaHei";
        p2colorLabel7.textAlign = "right";
        p2colorLabel7.text = "爱好";
        p2colorLabel7.size = 35;
        p2colorLabel7.x = stageW - 350;
        p2colorLabel7.y = stageH - 400;
        p2.addChild(p2colorLabel7);
        var p2colorLabel8 = new egret.TextField();
        p2colorLabel8.x = stageW;
        p2colorLabel8.textColor = 0xffffff;
        p2colorLabel8.width = 300;
        p2colorLabel8.fontFamily = "Microsoft YaHei";
        p2colorLabel8.textAlign = "right";
        p2colorLabel8.text = "口琴、纸模";
        p2colorLabel8.size = 35;
        p2colorLabel8.x = p2colorLabel7.x;
        p2colorLabel8.y = p2colorLabel7.y + 40;
        p2.addChild(p2colorLabel8);
        var p2colorLabel9 = new egret.TextField();
        p2colorLabel9.x = stageW;
        p2colorLabel9.textColor = 0xffffff;
        p2colorLabel9.width = 300;
        p2colorLabel9.fontFamily = "Microsoft YaHei";
        p2colorLabel9.textAlign = "right";
        p2colorLabel9.text = "视频剪辑";
        p2colorLabel9.size = 35;
        p2colorLabel9.x = p2colorLabel7.x;
        p2colorLabel9.y = p2colorLabel8.y + 40;
        p2.addChild(p2colorLabel9);
        var p2colorLabel10 = new egret.TextField();
        p2colorLabel10.x = stageW;
        p2colorLabel10.textColor = 0xffffff;
        p2colorLabel10.width = 300;
        p2colorLabel10.fontFamily = "Microsoft YaHei";
        p2colorLabel10.textAlign = "right";
        p2colorLabel10.text = "暴雪全家桶";
        p2colorLabel10.size = 35;
        p2colorLabel10.x = p2colorLabel7.x;
        p2colorLabel10.y = p2colorLabel9.y + 40;
        p2.addChild(p2colorLabel10);
        var p2colorLabel11 = new egret.TextField();
        p2colorLabel11.x = stageW;
        p2colorLabel11.textColor = 0xffffff;
        p2colorLabel11.width = 300;
        p2colorLabel11.fontFamily = "Microsoft YaHei";
        p2colorLabel11.textAlign = "right";
        p2colorLabel11.text = "Steam";
        p2colorLabel11.size = 35;
        p2colorLabel11.x = p2colorLabel7.x;
        p2colorLabel11.y = p2colorLabel10.y + 40;
        p2.addChild(p2colorLabel11);
        ////////////////////////////////////////////////////
        var p3 = new egret.DisplayObjectContainer();
        this.addChild(p3);
        p3.x = stageW * 2;
        p3.width = stageW;
        p3.height = stageH;
        var sky = this.createBitmapByName("41297261_p0_jpg");
        p3.addChild(sky);
        sky.width = 1600;
        sky.height = stageH;
        //添加背景
        var p3colorLabel = new egret.TextField();
        p3colorLabel.x = stageW;
        p3colorLabel.textColor = 0x545454;
        p3colorLabel.width = 400;
        p3colorLabel.fontFamily = "Microsoft JhengHei";
        p3colorLabel.textAlign = "center";
        p3colorLabel.text = "Thank you for watching";
        p3colorLabel.strokeColor = 0x8C7853;
        p3colorLabel.stroke = 2;
        p3colorLabel.size = 55;
        p3colorLabel.x = 30;
        p3colorLabel.y = 140;
        p3colorLabel.alpha = 0;
        p3.addChild(p3colorLabel);
        5;
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrameplus, p3colorLabel);
        this.timeOnEnterFrame = egret.getTimer();
        var p3rectangle1 = new egret.Shape();
        p3rectangle1.graphics.lineStyle(4, 0xffffff);
        p3rectangle1.graphics.moveTo(70, 1100);
        p3rectangle1.graphics.lineTo(70, 1040);
        p3rectangle1.graphics.lineTo(21, 1070);
        p3rectangle1.graphics.lineTo(70, 1100);
        p3rectangle1.alpha = 0.8;
        p3rectangle1.graphics.endFill();
        p3.addChild(p3rectangle1);
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, p3rectangle1);
        this.timeOnEnterFrame = egret.getTimer();
        var p3rectangle2 = new egret.Shape();
        p3rectangle2.graphics.lineStyle(4, 0xffffff);
        p3rectangle2.graphics.moveTo(90, 1100);
        p3rectangle2.graphics.lineTo(90, 1040);
        p3rectangle2.graphics.lineTo(41, 1070);
        p3rectangle2.graphics.lineTo(90, 1100);
        p3rectangle2.alpha = 0.8;
        p3rectangle2.graphics.endFill();
        p3.addChild(p3rectangle2);
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, p3rectangle2);
        this.timeOnEnterFrame = egret.getTimer();
        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json.
        RES.getResAsync("description_json", this.startAnimation, this);
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    p.startAnimation = function (result) {
        var self = this;
        var parser = new egret.HtmlTextParser();
        var textflowArr = [];
        for (var i = 0; i < result.length; i++) {
            textflowArr.push(parser.parser(result[i]));
        }
        var textfield = self.textfield;
        var count = -1;
        var change = function () {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            var lineArr = textflowArr[count];
            self.changeDescription(textfield, lineArr);
            var tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, self);
        };
        change();
    };
    /**
     * 切换描述内容
     * Switch to described content
     */
    p.changeDescription = function (textfield, textFlow) {
        textfield.textFlow = textFlow;
    };
    return Main;
}(egret.DisplayObjectContainer));
egret.registerClass(Main,'Main');
/*private onloadmusic(event:RES.ResourceEvent):void  {
 var twiloader:egret.URLLoader = new egret.URLLoader();
 twiloader.dataFormat = egret.URLLoaderDataFormat.SOUND;
 twiloader.load(new egret.URLRequest("resource/twilight.mp3"));}*/ //加载音频文件
//# sourceMappingURL=Main.js.map