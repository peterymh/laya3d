import Score from "./Score";

/**
*
* @ author:空银子
* @ email:1184840945@qq.com
* @ data: 2020-02-03 19:28
*/
export default class CC extends Laya.Script3D {

    constructor() {
        super();
        /** @prop {name:name, tips:"提示文本", type:Node, default:null}*/
        this.xx=null;
        this.playerCC=null;
        this.hit=0;
        this.wudi=false;
        this.Sound_index = 1;
      
       
      
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
            if(this.Sound_index == 9){
              this.Sound_index = 1;
            }
           Laya.SoundManager.playSound("res/Sound/" + this.Sound_index + ".mp3",1);
           this.Sound_index++;
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