/**
*
* @ author:空银子
* @ email:1184840945@qq.com
* @ data: 2020-02-03 16:41
*/
export default class Rotate extends Laya.Script {

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
            })
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