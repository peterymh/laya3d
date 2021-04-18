(function () {
    'use strict';

    /**
    *
    * @ author:空银子
    * @ email:1184840945@qq.com
    * @ data: 2020-02-03 16:41
    */
    class Rotate extends Laya.Script {

        constructor() {
            super();
            /** @prop {name:name, tips:"提示文本", type:Node, default:null}*/
            this.xx=null;
            this.x=null;
            this.first=true;
            this.isGameover=false;
        }
        init(scene)
        {
            this.scene=scene;
        }
        onAwake() {
           
            if (Laya.Browser.onPC)
            {
                Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.mouseDown);
                Laya.stage.on(Laya.Event.MOUSE_UP,this,function()
                {
                    Laya.stage.off(Laya.Event.MOUSE_MOVE,this,this.mouseMove);
                });
                Laya.stage.on(Laya.Event.MOUSE_OUT,this,function()
                {
                    Laya.stage.off(Laya.Event.MOUSE_MOVE,this,this.mouseMove);
                });
            }

            Laya.stage.on("Gameover",this,function(){this.isGameover=true;});

            Laya.stage.on("resetGame",this,function(){this.isGameover=false;});
            


        }
        mouseDown()
        {
            
            this.x=Laya.stage.mouseX;
            Laya.stage.on(Laya.Event.MOUSE_MOVE,this,this.mouseMove);
           
        }
        mouseMove()
        {
           var deltaX=Laya.stage.mouseX-this.x;
           this.x=Laya.stage.mouseX;
           if(this.isGameover==false)
           {
              this.owner.transform.rotate(new Laya.Vector3(0,deltaX/5,0),true,false);
           }
         
        }
        onUpdate()
        {
            if(Laya.Browser.onMobile==false ||this.isGameover==true)return;
            if(this.scene.input.touchCount==1 )
            {
               var touch= this.scene.input.getTouch(0);
               if(this.first==true)
               {
                   this.first=false;
                   this.x=touch.position.x;
               }else
               {
                  var deltaX=touch.position.x-this.x;
                  this.x=touch.position.x;
                  this.owner.transform.rotate(new Laya.Vector3(0,deltaX/5,0),true,false);
               }

            }else
            {
                this.x=0;
                this.first=true;
            }
          
        }
    }

    /**
    *
    * @ author:空银子
    * @ email:1184840945@qq.com
    * @ data: 2020-02-04 15:32
    */
    class Score extends Laya.Script {

        constructor() {
            super();
            /** @prop {name:Hit, tips:"提示", type:Node, default:null}*/
             /** @prop {name:scoreText, tips:"提示", type:Node, default:null}*/
              /** @prop {name:gameoverPanel, tips:"提示", type:Node, default:null}*/
            this.xx=null;
            this.scoreText=null;
            this.scoreNum=0;
            this.prefab=null;
            this.instance=null;
            this.scoreNum=0;
           
        }
        static getInstance()
        {
            onAwake();
            return this.instance==null?this.instance=new Score():this.instance;
        }
        onAwake() {
            this.gameoverPanel.visible=false;
            Laya.loader.load("prefab/Hit.json",Laya.Handler.create(this,function(prefab)
            {
               this.prefab=prefab;
            }),null,Laya.Loader.PREFAB);
            Laya.stage.on("Hit",this,this.showHit);
            Laya.stage.on("addScore",this,this.addScore);
            Laya.stage.on("gameover",this,function(){
                this.gameoverPanel.visible=true;
                this.gameoverPanel.getChildByName("Score").text=this.scoreNum;
                this.gameoverPanel.getChildByName("BT").on(Laya.Event.CLICK,this,function()
                {
                  Laya.stage.event("Reset");
                   
                });
            });

            Laya.stage.on("resetGame",this,function()
            {
                this.scoreNum=0;
                this.gameoverPanel.visible=false;
                this.scoreText.text=this.scoreNum;

            });
        }
        addScore(score)
        {
           this.scoreNum+=score;
           this.scoreText.text=this.scoreNum;
        }
        showHit(hit)
        {
           var temp=Laya.Pool.getItemByCreateFun("Hit",this.creatFun,this);
           Laya.stage.addChild(temp);
           temp.text="+"+hit;
           temp.pos(192,860.5);
           Laya.Tween.to(temp,{y:860.5-100},300,Laya.Ease.backIn,Laya.Handler.create
            (
                this,function()
                {
                    temp.removeSelf();
                    Laya.Pool.recover("Hit",temp);
                }
            ),100);
          
        }
        creatFun()
        {
           var temp =this.prefab.create();
           return temp;
        }
    }

    /**
    *
    * @ author:空银子
    * @ email:1184840945@qq.com
    * @ data: 2020-02-03 19:28
    */
    class CC extends Laya.Script3D {

        constructor() {
            super();
            /** @prop {name:name, tips:"提示文本", type:Node, default:null}*/
            this.xx=null;
            this.playerCC=null;
            this.hit=0;
            this.wudi=false;
          
           
          
        }

        onAwake() {
          this.life=true;
          this.posY=this.owner.transform.localPositionY;
          this.physicsSimulation=this.owner.parent.physicsSimulation;
          this.ray=new Laya.Ray(new Laya.Vector3(),new Laya.Vector3(0,-1,0));
          this.hitResult=new Laya.HitResult();
        
          this.playerCC=this.owner.addComponent(Laya.CharacterController);
          var col=new Laya.SphereColliderShape(0.5);
          this.playerCC.colliderShape=col;
          this.playerCC.jumpSpeed=10;
          Laya.timer.frameLoop(1,this,this.Update);

          this.length=0.12;
          
          Laya.stage.on("resetGame",this,function()
          {
            
            this.hit=0;
            this.wudi=false;
            this.life=true;
            console.log(this.pos);
            this.owner.transform.localPositionY=this.posY;
            this.owner.transform.localScaleY=0.215;


          });

        

        }
        Update()
        {
          if(this.life==false)return;
          this.ray.origin=this.owner.transform.position;
          if(this.wudi)
          {
             this.length=1.5;
          }else
          {
             this.length=0.11;
          }
          if(this.physicsSimulation.rayCast(this.ray,this.hitResult,this.length)) 
          {
            if(this.wudi&&this.hitResult.collider.owner.name!="C")
            {
              var platform=this.hitResult.collider.owner.parent;
              for (var i=0;i<8;i++)
              {
               
                var bar= platform.getChildAt(i);
                bar.meshRenderer.material.albedoColor=new Laya.Vector4(0,0,1,0);   
                if(bar.name=="B")
                {
                  bar.name="A";
                }               
              }
            }
            if(this.physicsSimulation.rayCast(this.ray,this.hitResult,0.11))
            {
              if(this.hitResult.collider.owner.name=="A")
              {
                console.log(this.hitResult.collider.owner.name);
               this.wudi =false;
               this.hit=0;
                this.playerCC.jump();
               Laya.SoundManager.playSound("res/Sound/jumpSound.mp3",1);
               Laya.stage.event("prtical",this.owner.transform.localPosition);
               var a=this.hitResult.collider.owner;
               
               Laya.stage.event("AAA",this.hitResult);
     
     
              }else if(this.hitResult.collider.owner.name=="B")
              {
                 this.life=false;
                 this.owner.transform.localScaleY=0.11;
                 Laya.stage.event("Gameover");
                 Laya.stage.event("gameover");
                 return ;
                
              }else
              {  
                  Laya.stage.event("CameraMove",this.hitResult.collider.owner.parent.transform.localPositionY);    
                  Laya.SoundManager.playSound("res/Sound/DestSound.mp3",1);
                  //删除旧台子 +  生成新得台子  +  移动柱子
                  this.hitResult.collider.owner.parent.removeSelf();
                  Laya.Pool.recover("platform",this.hitResult.collider.owner.parent);
                  Laya.stage.event("spawn",true);
                  Laya.stage.event("moveCylinder");
                 
                  this.hit++;
                  console.log(this.hit);
                  if(this.hit>=2)
                  {
                    this.wudi=true;
                  }
                Laya.stage.event("Hit",this.hit);
                Laya.stage.event("addScore",this.hit);
                // Score.getInstance().showHit(this.hit);
              } 
            }
             
          }

        
        }


        // onCollisionEnter(col)
        // {
        //   this.hit=0;
        //   Laya.SoundManager.playSound("res/Sound/jumpSound.mp3",1);
        // //Laya.SoundManager.soundMuted=true;

        //    if(this.wudi==true)
        //    { 
        //     this.wudi=false;
        //     //TODO改变颜色
         
        //    }
        //    if(col.other.owner.name=="B" &&this.wudi==false)
        //    {
        //      //death
        //      Laya.stage.event("gameover");
        //    }else
        //    {       
        //     this.playerCC.jump();
        //     Laya.stage.event("prtical",this.owner.transform.localPosition);
        //    }
          
           
        // }
        // onTriggerExit(other)
        // {
        //    Laya.SoundManager.playSound("res/Sound/DestSound.mp3",1);
        //    //删除旧台子 +  生成新得台子  +  移动柱子
        //    other.owner.parent.removeSelf();
        //    Laya.stage.event("spawn");
        //    Laya.stage.event("moveCylinder");
        //    Laya.stage.event("CameraMove",other.owner.parent.transform.localPositionY);    
        //    this.hit++;
        //    console.log(this.hit);
        //    if(this.hit>=2)
        //    {
        //      this.wudi=true;
        //    }
        //  Laya.stage.event("Hit",this.hit);
        //  Laya.stage.event("addScore",this.hit);
        //  // Score.getInstance().showHit(this.hit);
        // }

    }

    /**
    *
    * @ author:空银子
    * @ email:1184840945@qq.com
    * @ data: 2020-02-03 20:00
    */
    class Spawn extends Laya.Script {

        constructor() {
            super();
            /** @prop {name:name, tips:"提示文本", type:Node, default:null}*/
            this.xx=null;
            this.prefab=null;
            this.parent=null;
            this.y=-3;
            this.count=0;
            
        }
        init(prefab,parent)
        {
            
            this.prefab=prefab;
            this.parent=parent;
            for(var i=0;i<5;i++)
            {
                this.spawn();
            }
            Laya.stage.on("spawn",this,this.spawn);
        }

        onAwake() {
            this.platforms=[];
            Laya.stage.on("removePlatform",this,function(platform)
            {
                
            });
            Laya.stage.on("resetGame",this,function()
            {
                this.platforms.forEach(element => {
                    if(element.displayedInStage)
                    {
                        element.removeSelf(); 
                        Laya.Pool.recover("platform",element);
                    }
                                   
                });
                this.count=0;
                for(var i=0;i<5;i++)
                {
                    this.spawn(false);
                }           
            });
        }
        spawn(b)
        {
            var temp= Laya.Pool.getItemByCreateFun("platform",this.creatFun,this);
            temp.transform.localPosition =new Laya.Vector3(0,-1.85*this.count+this.y,0);
            this.count++;
            this.setPlatform(temp,b);
            this.parent.addChild(temp);
            this.platforms.push(temp);
        }
        creatFun()
        {
           return Laya.Sprite3D.instantiate(this.prefab,this.parent,true);
           
        }
        setPlatform(platform,b)
        {
           
          var haveBlank=false;
          var count=0;
           //执行多次 
          for (var i=0;i<8;i++)
          {
            var a=Math.round(Math.random()*8);
            var bar= platform.getChildAt(i);
            for(var j=0;j<bar.numChildren;j++)
            {
                Laya.Pool.recover("AAAPool",bar.getChildAt(j)); 
                console.log("回收");         
            }       
            bar.removeChildren(0,bar.numChildren);
            if(a==1)
            {
               //空格
               haveBlank=true;
               count++;      
               bar.getComponent(Laya.PhysicsCollider).isTrigger=true;
               bar.meshRenderer.enable=false;
               bar.name="C";                
               
            }else if(a==2 &&b)
            {
                //障碍物         
                count++;          
                bar.getComponent(Laya.PhysicsCollider).isTrigger=false;
                bar.meshRenderer.enable=true;
                bar.meshRenderer.material.albedoColor=new Laya.Vector4(1,0.5,0.25,0);          
                bar.name="B";
                bar.removeChildren(0,bar.numChildren);            

            }else
            {          
                bar.getComponent(Laya.PhysicsCollider).isTrigger=false;
                bar.meshRenderer.enable=true;
                bar.meshRenderer.material.albedoColor=new Laya.Vector4(0.2,0.2,0.2,0); 
                bar.name="A";    
                bar.removeChildren(0,bar.numChildren);
               
            }   
          }
           
           if(haveBlank==false)
           {
               // 随机一格 设置成空格
              // var a=Math.round(Math.random()*8);
               var bar= platform.getChildAt(0);
               bar.getComponent(Laya.PhysicsCollider).isTrigger=true;
               bar.meshRenderer.enable=false; 
               count++;   
               bar.name="C";    
           }   
           if(count>4)
           {
               this.setPlatform(platform);
           }
            
        }

    }

    /**
    *
    * @ author:空银子
    * @ email:1184840945@qq.com
    * @ data: 2020-02-04 09:25
    */
    class CameraFollow extends Laya.Script {

        constructor() {
            super();
            /** @prop {name:name, tips:"提示文本", type:Node, default:null}*/
            this.xx=null;
        }

        onAwake() {
            Laya.stage.on("CameraMove",this,this.cameraFollow);
            Laya.stage.on("resetGame",this,function()
            {
                this.owner.transform.localPositionY=2.2;
            });
        }
        cameraFollow(posY)
        {
         
            Laya.Tween.to(this.owner.transform,{localPositionY:posY+3.3},300);
        }
    }

    /**
    *
    * @ author:空银子
    * @ email:1184840945@qq.com
    * @ data: 2020-02-03 16:24
    */
    class GameEntry extends Laya.Script {

        constructor() {
            super();
            /** @prop {name:name, tips:"提示文本", type:Node, default:null}*/
            this.xx=null;
           
          
           
        }

        onAwake() {
            Laya.Scene3D.load("res/Scene/LayaScene_My/Conventional/My.ls",Laya.Handler.create(this,this.loadFinished));
            this.spots=[];
            
            
        }
        loadFinished(scene)
        {
            this.scene=scene;
            this.scene.zOrder=-1;
            Laya.stage.addChild(scene);
            
            scene.getChildByName("Papa").addComponent(Rotate).init(scene);

          
            var trail= scene.getChildByName("Trail");
            var player=scene.getChildByName("Player");
            player.addComponent(CC);
            player.addChild(trail);
            trail.transform.localPosition=new Laya.Vector3();

            var prtical=scene.getChildByName("Prticle");
            this.prticalPrefab=Laya.Sprite3D.instantiate(prtical);
            prtical.active=false;       
            Laya.stage.on("prtical",this,function(pos) {
               var p=  Laya.Pool.getItemByCreateFun("prticalPool",function()
                {
                    var temp=Laya.Sprite3D.instantiate(this.prticalPrefab);          
                    return temp;
                   
                },this);
                this.scene.addChild(p);
                p.transform.localPosition=pos;
              
                Laya.timer.once(1500,this,function()
                {
                    p.removeSelf();
                    Laya.Pool.recover("prticalPool",p);
                });
               

              
            });

            scene.getChildByName("Main Camera").addComponent(CameraFollow);
            

            var circle= scene.getChildByName("Papa").getChildByName("Circle");
            var circle1= scene.getChildByName("Papa").getChildByName("Cylinder");
            this.Cylinder=circle1;
           

            var parent=scene.getChildByName("Papa");
            var prefab= Laya.Sprite3D.instantiate(circle);
            this.owner.addComponent(Spawn).init(prefab,parent);
            Laya.stage.on("moveCylinder",this,function() {
               // Laya.Tween.to(this.owner.transform,{localPositionY:posY+3.87},300);
                Laya.Tween.to(circle1.transform,{localPositionY:circle1.transform.localPositionY-2},300);
                
            }) ;
            circle.active=false;

           
            Laya.stage.on("resetGame",this,function()
            {          
                circle1.transform.localPositionY=0;         
            });
            
            Laya.stage.on("Reset",this,this.resetGame);

            this.currentBar=null;
            this.spots.push(scene.getChildByName("AAA").getChildAt(0));
            this.spots.push(scene.getChildByName("AAA").getChildAt(1));
            this.spots.push(scene.getChildByName("AAA").getChildAt(2));
            this.spots.push(scene.getChildByName("AAA").getChildAt(3));
            this.spots.push(scene.getChildByName("AAA").getChildAt(0));
            this.spots.push(scene.getChildByName("AAA").getChildAt(1));
            this.spots.push(scene.getChildByName("AAA").getChildAt(2));
            this.spots.push(scene.getChildByName("AAA").getChildAt(3));
            this.spots.push(scene.getChildByName("AAA").getChildAt(0));
            this.spots.push(scene.getChildByName("AAA").getChildAt(1));
            this.spots.push(scene.getChildByName("AAA").getChildAt(2));
            this.spots.push(scene.getChildByName("AAA").getChildAt(3));
            this.spots.push(scene.getChildByName("AAA").getChildAt(0));
            this.spots.push(scene.getChildByName("AAA").getChildAt(1));
            this.spots.push(scene.getChildByName("AAA").getChildAt(2));
            this.spots.push(scene.getChildByName("AAA").getChildAt(3));
            this.spots.push(scene.getChildByName("AAA").getChildAt(0));
            this.spots.push(scene.getChildByName("AAA").getChildAt(1));
            this.spots.push(scene.getChildByName("AAA").getChildAt(2));
            this.spots.push(scene.getChildByName("AAA").getChildAt(3));
            this.spots.push(scene.getChildByName("AAA").getChildAt(0));
            this.spots.push(scene.getChildByName("AAA").getChildAt(1));
            this.spots.push(scene.getChildByName("AAA").getChildAt(2));
            this.spots.push(scene.getChildByName("AAA").getChildAt(3));
            


            //this.AAA=Laya.Sprite3D.instantiate(aaa);
            Laya.stage.on("AAA",this,function(hitResult)
            {
              
               var temp= Laya.Pool.getItemByCreateFun("AAAPool",function()
                {
                    console.log(99999);
                    return Laya.Sprite3D.instantiate(this.spots.pop());
                  
                },this);
              
                this.currentBar=hitResult.collider.owner;
                this.currentBar.addChild(temp);
                temp.transform.position=hitResult.point;//+new Laya.Vector3(0,0.005,0);
                temp.transform.localRotationX=0;
                temp.transform.localRotationY=0;
                temp.transform.localRotationZ=0;
                temp.transform.localRotationW=0;
                temp.transform.localScale=new Laya.Vector3(0.2,0.2,0.2);
                temp.transform.localPositionZ-=0.01;
                Laya.Node;
              
            });

          
        }
        resetGame()
        {
           Laya.stage.event("resetGame");
           // 重置角色位置与状态      0

           // 重置柱子位置           0            
           // 重置柱子旋转状态           0
           // 重置摄像机位置           0
           // 重置分数                 0
           // 重置平台  1清除已有平台  2生成新得一组平台  
             
        }
        loadf(scene)
        {   
            // this.scene=scene;
            // this.scene.zOrder=-1;
            Laya.stage.addChild(scene);
           
        }
        
    }

    /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

    class GameConfig {
        static init() {
            //注册Script或者Runtime引用
            let reg = Laya.ClassUtils.regClass;
    		reg("Scripts/GameRoot.js",GameEntry);
    		reg("Scripts/Score.js",Score);
        }
    }
    GameConfig.width = 1080;
    GameConfig.height = 1920;
    GameConfig.scaleMode ="showall";
    GameConfig.screenMode = "horizontal";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "myScene.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;

    GameConfig.init();

    class Main {
    	constructor() {
    		//根据IDE设置初始化引擎		
    		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
    		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
    		Laya["Physics"] && Laya["Physics"].enable();
    		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
    		Laya.stage.scaleMode = GameConfig.scaleMode;
    		Laya.stage.screenMode = GameConfig.screenMode;
    		Laya.stage.alignV = GameConfig.alignV;
    		Laya.stage.alignH = GameConfig.alignH;
    		//兼容微信不支持加载scene后缀场景
    		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

    		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
    		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
    		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
    		if (GameConfig.stat) Laya.Stat.show();
    		Laya.alertGlobalError = true;

    		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
    		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    	}

    	onVersionLoaded() {
    		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
    		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
    	}

    	onConfigLoaded() {
    		//加载IDE指定的场景
    		GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
    	}
    }
    //激活启动类
    new Main();

}());
