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
    /**
     * 创建游戏场景
     * Create a game scene
     */
    p.createGameScene = function () {
        var stageW = this.stage.stageWidth;
        var stageAW = this.stage.stageWidth * 5;
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
            originstagepointX = this.scrollRect.x;
            origintouchpointX = e.stageX;
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, scrolling, this);
        }
        function scrolling(e) {
            var rect = this.scrollRect;
            movedistance = origintouchpointX - e.stageX;
            rect.x = (origintouchpointX + movedistance);
            this.scrollRect = rect;
        }
        function scrollstop(e) {
            var rect = this.scrollRect;
            if ((movedistance >= (this.stage.stageWidth / 4)) && originstagepointX != stageAW) {
                rect.x = originstagepointX + stageW;
                this.scrollRect = rect;
                movedistance = 0;
            }
            if ((movedistance <= (-(this.stage.stageWidth / 4))) && originstagepointX != 0) {
                rect.x = originstagepointX - stageW;
                this.scrollRect = rect;
                movedistance = 0;
            }
            else {
                movedistance = 0;
                rect.x = originstagepointX;
                this.scrollRect = rect;
            }
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, scrolling, this);
        }
        //////////////////////////////////////////////////////////////////
        var p1 = new egret.DisplayObjectContainer();
        this.addChild(p1);
        p1.width = stageW;
        p1.height = stageH;
        var sky = this.createBitmapByName("41297261_p0_jpg");
        p1.addChild(sky);
        sky.width = stageW;
        sky.height = stageH;
        //添加背景
        var headportrait = this.createBitmapByName("51654332_p0_png");
        p1.addChild(headportrait);
        headportrait.x = -600;
        headportrait.y = 200;
        //添加头像
        var topMask = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.5);
        topMask.graphics.drawRect(0, 0, stageW, 172);
        topMask.graphics.endFill();
        topMask.y = 33;
        p1.addChild(topMask);
        //添加阴影
        var icon = this.createBitmapByName("egret_icon_png");
        p1.addChild(icon);
        icon.x = 26;
        icon.y = 33;
        //添加白鹭图标
        var line = new egret.Shape();
        line.graphics.lineStyle(2, 0xffffff);
        line.graphics.moveTo(0, 0);
        line.graphics.lineTo(0, 117);
        line.graphics.endFill();
        line.x = 172;
        line.y = 61;
        p1.addChild(line);
        //添加一条白色直线
        var shp = new egret.Shape();
        shp.x = 100;
        shp.y = 100;
        shp.graphics.lineStyle(10, 0x00ff00);
        shp.graphics.beginFill(0xff0000, 1);
        shp.graphics.drawCircle(250, 270, 115);
        shp.graphics.endFill();
        p1.addChild(shp);
        headportrait.mask = shp;
        //遮罩用的圆
        var colorLabel = new egret.TextField();
        colorLabel.x = stageW;
        colorLabel.textColor = 0xffffff;
        colorLabel.width = stageW - 250;
        colorLabel.fontFamily = "Microsoft YaHei";
        colorLabel.textAlign = "center";
        colorLabel.text = "崔天舒";
        colorLabel.size = 60;
        colorLabel.x = 160;
        colorLabel.y = stageH / 2 - 40;
        p1.addChild(colorLabel);
        var colorLabel2 = new egret.TextField();
        colorLabel2.x = stageW;
        colorLabel2.textColor = 0xffffff;
        colorLabel2.width = stageW - 250;
        colorLabel2.fontFamily = "Microsoft YaHei";
        colorLabel2.textAlign = "center";
        colorLabel2.text = "14081205";
        colorLabel2.size = 50;
        colorLabel2.x = 160;
        colorLabel2.y = stageH / 2 + 40;
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