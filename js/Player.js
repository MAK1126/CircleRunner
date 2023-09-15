
export default class Player extends Phaser.Physics.Matter.Sprite {

    constructor(data){
        let { scene, x, y, texture, frame } = data;
        super(scene.matter.world, x, y, texture, frame);
        this.scene.add.existing(this);

        // 충돌 설정
        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        var playerCollider = Bodies.rectangle(this.x, this.y, 40, 40, {
            isSensor: true, 
            label: "playerCollider",
            isStatic: true,
        });
        
        // 디버그 랜더러 비활성화
        playerCollider.render.visible = false;
        this.scene.matter.world.drawDebug = false;

        const compoundBody = Body.create({
            parts: [playerCollider],
            frictionAir: 0.35
        });
        this.setExistingBody(compoundBody);
        this.setFixedRotation(true); //충돌해도 안돌아가게

        this.mainScene = scene;

        this.isSoundPlaying = false;

        // 속도 
        this.speed = 5;

        // 0일때 왼쪽, 1일때 위쪽, 2일때 오른쪽, 3일때 아래
        this.playturn = 0;

    }
    static preload(scene){}

    create(){}

    update()
    {
        this.rotateVelocity(this.playturn);
    }

    rotateClockwise() {
        const animations = ["left_idle", "back_idle", "left_idle", "front_idle"];
        const animationKey = animations[this.playturn];
        // 애니메이션 플레이
        this.anims.play(animationKey, true);

        // 이미지 뒤집기 처리
        if (this.playturn === 2) {
            this.setFlipX(true); // 이미지를 뒤집어서 오른쪽으로 보이도록 설정
        } else {
            this.setFlipX(false); // 이미지를 원래대로 보이도록 설정
        }

    }

    rotateVelocity(clickCapeount)
    { 

        if (clickCapeount === 0) {

            this.setVelocity(-this.speed, 0);
         } // 왼쪽으로 이동
        else if (clickCapeount === 1) {
            this.setVelocity(0, -this.speed); // 위로 이동
        } else if (clickCapeount === 2) {
            this.setVelocity(this.speed, 0); // 오른쪽으로 이동
        } else if (clickCapeount === 3) {
            this.setVelocity(0, this.speed); // 아래로 이동
        } 
    }

    
    

}