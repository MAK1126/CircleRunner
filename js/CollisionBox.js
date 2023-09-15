export default class CollisionBox extends Phaser.Physics.Matter.Sprite {

    constructor(data){
        let { scene, x, y, width, height } = data;
        super(scene.matter.world, x, y );
        this.scene.add.existing(this);

        // 충돌 박스 생성
        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        var CollisionBox = Bodies.rectangle(this.x, this.y, width, height, {
            isSensor: true, 
            label: "CollisionBox",
            isStatic: true,
        });

        const compoundBody = Body.create({
            parts: [CollisionBox],
            frictionAir: 0.35
        });
        this.setExistingBody(compoundBody);
        this.setFixedRotation(true); //충돌해도 안돌아가게

    }

}