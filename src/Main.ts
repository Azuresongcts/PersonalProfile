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

class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView:LoadingUI;

    public constructor() {

        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event:egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event:RES.ResourceEvent):void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event:RES.ResourceEvent):void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }


///////////////////////////////////////////////////////

    private textfield:egret.TextField;
    private speed:number = 0.05;
    private timeOnEnterFrame = 0;

    private onEnterFrame(e:egret.Event){
            var now = egret.getTimer();
            var time = this.timeOnEnterFrame;
            var pass = now - time;
            this.alpha-=0.04;
            this.timeOnEnterFrame = egret.getTimer();
             if(this.alpha<=0)
                this.alpha=1;
        }
     private onEnterFrame2(e:egret.Event){
            var now = egret.getTimer();
            var time = this.timeOnEnterFrame;
            var pass = now - time;
            this.alpha-=0.01;
            this.timeOnEnterFrame = egret.getTimer();
             if(this.alpha<=-0.4)
                this.alpha=0.5;
        }
      private onEnterFrameplus(e:egret.Event){
            var now = egret.getTimer();
            var time = this.timeOnEnterFrame;
            var pass = now - time;
            do{
                this.alpha+=0.01;}while(this.alpha<-1);
            this.timeOnEnterFrame = egret.getTimer();
        }
    
        //渐变函数


    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene():void {  
        var stageW:number = this.stage.stageWidth;
        var stageAW:number=this.stage.stageWidth*2;
        var stageH:number = this.stage.stageHeight;

        this.scrollRect = new egret.Rectangle(0, 0,stageAW,stageH);
        this.cacheAsBitmap = true;
        this.touchEnabled = true;
        var origintouchpointX:number = 0;
        var originstagepointX:number = 0;
        var movedistance:number = 0;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,scrollmove, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END,scrollstop, this);

        function scrollmove(e:egret.TouchEvent):void{
            if((this.scrollRect.x%stageW)!=0){
                this.scrollRect.x=originstagepointX;
            }
            origintouchpointX=e.stageX;
            originstagepointX=this.scrollRect.x;

            this.addEventListener(egret.TouchEvent.TOUCH_MOVE,scrolling,this);
        }

        function scrolling(e:egret.TouchEvent):void{
            var rect: egret.Rectangle=this.scrollRect;
            movedistance=origintouchpointX-e.stageX;
            rect.x=(originstagepointX+movedistance);
            this.scrollRect=rect;
        }

        function scrollstop(e:egret.TouchEvent):void{
            var rect:egret.Rectangle=this.scrollRect;
            if((movedistance>=(this.stage.stageWidth/4)) && originstagepointX!=stageAW){
                rect.x = originstagepointX + stageW;
                this.scrollRect = rect;
                movedistance = 0;
            }else if((movedistance<=(-(this.stage.stageWidth/4))) &&originstagepointX!=0) {
                rect.x = originstagepointX - stageW;
                this.scrollRect = rect;    
                movedistance = 0;
            }else{
                movedistance = 0;
                rect.x = originstagepointX;
                this.scrollRect = rect;
            }
             this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE,scrolling,this);
        }

        
//////////////////////////////////////////////////////////////////

        var p1 = new egret.DisplayObjectContainer();
        this.addChild(p1);
        p1.width = stageW;
        p1.height = stageH;
 

        var sky:egret.Bitmap = this.createBitmapByName("whitebackground_jpg");
        p1.addChild(sky);
        sky.width = stageW;
        sky.height = stageH;
        //添加背景

        var headportrait= this.createBitmapByName("51654332_p0_png");
        headportrait.x = -625;
        headportrait.y = 200;
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

        var backcircle:egret.Shape = new egret.Shape();
        backcircle.x = 100;
        backcircle.y = 100;
        backcircle.graphics.beginFill( 0x7093DB, 1);
        backcircle.graphics.drawCircle(225,270, 138 );
        backcircle.graphics.endFill();
        backcircle.alpha=0.1;
        this.addEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame2,backcircle);
        this.timeOnEnterFrame = egret.getTimer();
        p1.addChild( backcircle );

        var backcircle2:egret.Shape = new egret.Shape();
        backcircle2.x = 100;
        backcircle2.y = 100;
        backcircle2.graphics.beginFill( 0x7093DB, 1);
        backcircle2.graphics.drawCircle(225,270, 170);
        backcircle2.graphics.endFill();
        backcircle2.alpha=0.3;
        this.addEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame2,backcircle2);
        this.timeOnEnterFrame = egret.getTimer();
        p1.addChild( backcircle2 );


        var backcircle3:egret.Shape = new egret.Shape();
        backcircle3.x = 100;
        backcircle3.y = 100;
        backcircle3.graphics.beginFill( 0x7093DB, 1);
        backcircle3.graphics.drawCircle(225,270, 200);
        backcircle3.graphics.endFill();
        backcircle3.alpha=0.5;
        this.addEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame2,backcircle3);
        this.timeOnEnterFrame = egret.getTimer();
        p1.addChild( backcircle3 );


        var shp:egret.Shape = new egret.Shape();
        shp.x = 100;
        shp.y = 100;
        shp.graphics.lineStyle( 10, 0x00ff00 );
        shp.graphics.beginFill( 0xff0000, 1);
        shp.graphics.drawCircle(225,270, 115 );
        shp.graphics.endFill();
        p1.addChild( shp );
        p1.addChild(headportrait);
        headportrait.mask=shp;
        //遮罩用的圆

        var shp2:egret.Shape = new egret.Shape();
        shp2.graphics.lineStyle(4,0xADEAEA);
        shp2.graphics.moveTo( stageW/2+230,stageH/2-170  ); 
        shp2.graphics.lineTo( stageW/2+230, stageH/2-230 );
        shp2.graphics.lineTo( stageW/2+281, stageH/2-200 );
        shp2.graphics.lineTo( stageW/2+230,stageH/2-170  );
        shp2.graphics.beginFill(0xADEAEA, 1);
        shp2.graphics.endFill();
        p1.addChild(shp2);
        this.addEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame,shp2);
        this.timeOnEnterFrame = egret.getTimer();

        var shp3:egret.Shape = new egret.Shape();
        shp3.graphics.lineStyle(4,0xADEAEA);
        shp3.graphics.moveTo( stageW/2+250,stageH/2-170  ); 
        shp3.graphics.lineTo( stageW/2+250, stageH/2-230 );
        shp3.graphics.lineTo( stageW/2+301, stageH/2-200 );
        shp3.graphics.lineTo( stageW/2+250,stageH/2-170  );
        shp3.graphics.beginFill(0xADEAEA, 1);
        shp3.alpha=0.8;
        shp3.graphics.endFill();
        p1.addChild(shp3);
        
        this.addEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame,shp3);
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
        colorLabel.textColor = 0x000000;
        colorLabel.width = stageW-300;
        colorLabel.fontFamily = "Microsoft JhengHei"
        colorLabel.textAlign = "center";
        colorLabel.text = "崔天舒";
        colorLabel.size =55;
        colorLabel.x = 160;
        colorLabel.y = stageH/2+40;
        p1.addChild(colorLabel);5

        var colorLabel2 = new egret.TextField();
        colorLabel2.x = stageW;
        colorLabel2.textColor = 0x000000;
        colorLabel2.width = stageW-300;
        colorLabel2.fontFamily = "Microsoft JhengHei"
        colorLabel2.textAlign = "center";
        colorLabel2.text = "14081205";
        colorLabel2.size =50;
        colorLabel2.x = 160;
        colorLabel2.y = stageH/2+130;
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
        
        var sky:egret.Bitmap = this.createBitmapByName("whitebackground_jpg");
        p2.addChild(sky);
        sky.width =stageW;
        sky.height = stageH;

        var p2line = new egret.Shape();
        p2line.graphics.lineStyle(6,0x000000);
        p2line.graphics.moveTo(0,0);
        p2line.graphics.lineTo(400,0);
        p2line.graphics.endFill();
        p2line.x = 120;
        p2line.y = 220;
        p2.addChild(p2line);



////////////////////////////////////////////////////
        var p3 = new egret.DisplayObjectContainer();
        this.addChild(p3);
        p3.x = stageW*2;
        p3.width = stageW;
        p3.height = stageH;

        var sky:egret.Bitmap = this.createBitmapByName("41297261_p0_jpg");
        p3.addChild(sky);
        sky.width =1600;
        sky.height = stageH;
        //添加背景

        var p3colorLabel = new egret.TextField();
        p3colorLabel.x = stageW;
        p3colorLabel.textColor = 0x545454;
        p3colorLabel.width = 400;
        p3colorLabel.fontFamily = "Microsoft JhengHei"
        p3colorLabel.textAlign = "center";
        p3colorLabel.text =  "Thank you for watching";
        p3colorLabel.strokeColor = 0x8C7853;
        p3colorLabel.stroke = 2;
        p3colorLabel.size =55;
        p3colorLabel.x = 30;
        p3colorLabel.y = 140;
        p3colorLabel.alpha=0;
        p3.addChild(p3colorLabel);5
        this.addEventListener(egret.Event.ENTER_FRAME,this.onEnterFrameplus,p3colorLabel);
        this.timeOnEnterFrame = egret.getTimer();



        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json.
        RES.getResAsync("description_json", this.startAnimation, this)
    }









    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name:string):egret.Bitmap {
        var result = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result:Array<any>):void {
        var self:any = this;

        var parser = new egret.HtmlTextParser();
        var textflowArr:Array<Array<egret.ITextElement>> = [];
        for (var i:number = 0; i < result.length; i++) {
            textflowArr.push(parser.parser(result[i]));
        }

        var textfield = self.textfield;
        var count = -1;
        var change:Function = function () {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            var lineArr = textflowArr[count];

            self.changeDescription(textfield, lineArr);

            var tw = egret.Tween.get(textfield);
            tw.to({"alpha": 1}, 200);
            tw.wait(2000);
            tw.to({"alpha": 0}, 200);
            tw.call(change, self);
        };

        change();
    }

    /**
     * 切换描述内容
     * Switch to described content
     */
    private changeDescription(textfield:egret.TextField, textFlow:Array<egret.ITextElement>):void {
        textfield.textFlow = textFlow;
    }
}

       /*private onloadmusic(event:RES.ResourceEvent):void  {
        var twiloader:egret.URLLoader = new egret.URLLoader();
        twiloader.dataFormat = egret.URLLoaderDataFormat.SOUND;
        twiloader.load(new egret.URLRequest("resource/twilight.mp3"));}*///加载音频文件
