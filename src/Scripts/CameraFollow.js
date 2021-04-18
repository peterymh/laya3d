/**
*
* @ author:空银子
* @ email:1184840945@qq.com
* @ data: 2020-02-04 09:25
*/
export default class CameraFollow extends Laya.Script {

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