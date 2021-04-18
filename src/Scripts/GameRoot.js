import Rotate from "./Rotate";
import CC from "./CC";
import Spawn from "./Spawn";
import CameraFollow from "./CameraFollow";

/**
*
* @ author:空银子
* @ email:1184840945@qq.com
* @ data: 2020-02-03 16:24
*/
export default class GameEntry extends Laya.Script {

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
            })
           

          
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
            Laya.Node
          
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