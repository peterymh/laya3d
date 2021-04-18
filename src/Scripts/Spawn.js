/**
*
* @ author:空银子
* @ email:1184840945@qq.com
* @ data: 2020-02-03 20:00
*/
export default class Spawn extends Laya.Script {

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
            console.log("回收")         
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
            bar.name="A"    
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
           bar.name="C"    
       }   
       if(count>4)
       {
           this.setPlatform(platform);
       }
        
    }

}