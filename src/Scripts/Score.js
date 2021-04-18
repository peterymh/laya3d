/**
*
* @ author:空银子
* @ email:1184840945@qq.com
* @ data: 2020-02-04 15:32
*/
export default class Score extends Laya.Script {

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
               
            })
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
        console.log("Hit")
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
        ),100)
      
    }
    creatFun()
    {
       var temp =this.prefab.create();
       return temp;
    }
}