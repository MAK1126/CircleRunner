import Player from "./Player.js";
import MainScene from "./MainScene.js";

export default class CharacterMng extends Phaser.GameObjects.GameObject {
    constructor(data){
        let { scene} = data;
        super(scene);
        this.scene.add.existing(this);

        this.mainScene = scene; // MainScene.js의 인스턴스를 저장합니다.
        this.isSoundPlaying = this.scene.isSoundPlaying;
    }
    init(message){
        if(message == 100)
        {
            this.isSoundPlaying= false;
        }
        else
        {
            this.isSoundPlaying= true;
        }
    }
    static preload(scene)
    {
        Player.preload(scene);
        this.scene = scene;

        // front chick
        scene.load.atlas(
            "front",
            "assets/images/front.png",
            "assets/images/front_atlas.json"
        );
        scene.load.animation('front_anim', 'assets/images/front_anim.json');

        // back chick
        scene.load.atlas(
            "back",
            "assets/images/back.png",
            "assets/images/back_atlas.json"
        );
        scene.load.animation('back_anim', 'assets/images/back_anim.json');

        //left chick
        scene.load.atlas(
            "left",
            "assets/images/left.png",
            "assets/images/left_atlas.json"
        );
        scene.load.animation('left_anim', 'assets/images/left_anim.json');

        //게임오버
        scene.load.atlas(
            "gameover",
            "assets/images/gameover.png",
            "assets/images/gameover_atlas.json"
        );
        scene.load.animation('gameover_anim', 'assets/images/gameover_anim.json');

    }
    update()
    {
        this.player.update();
    }
    async Gameover(){

        //게임오버 이미지와 애니
        this.gameover = this.scene.add.sprite(360, 880, "gameover").setDepth(4);
        this.gameover.anims.play("gameover_idle", true).setDepth(4);

        // 게임오버 음악 재생 
        if(this.isSoundPlaying)
        {
            this.gameOver = this.mainScene.sound.add("gameOver");
            this.gameOver.play();
        }

        // 데이터 날짜형식으로 정의해줌
        let data = {
            date: new Date()
        }
        // 한국 표준시 (KST) 기준으로 변환
        let koreanTime = new Date(data.date.getTime() + (9 * 60 * 60 * 1000));
        let formattedDateTime = koreanTime.toISOString().slice(0, 19).replace('T', ' ');

        // UPDATE
        try {
            const formData = new FormData();
            formData.append('pk', LOG_GAMEDATA_PK);
            formData.append('column', 'GAMEDATA_END_DT');
            formData.append('value', formattedDateTime);

            const response = await fetch('../06-circle-runner/DBphp/update-column.php', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error:', error);
        }

        // 클릭 이벤트 잠금 설정
        this.scene.input.enabled = false;

        // 1.8초 후에 다른 씬으로 전환하기 위해 타이머 설정
        this.scene.time.delayedCall(2000, this.GameoverChangeScene, [], this);

    }
    async GameoverChangeScene(){
        // 사운드
        if (this.scene.isSoundPlaying) {
            this.scene.sound.stopAll();
        }
        // 점수 데이터 넘기기
        let data = {
            score : this.scene.score,
        }
        // UPDATE
        try {
            const formData = new FormData();
            formData.append('pk', LOG_GAMEDATA_PK);
            formData.append('column', 'GAMEDATA_POINT');
            formData.append('value', data.score);

            const response = await fetch('../06-circle-runner/DBphp/update-column.php', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error:', error);
        }

        // 씬 전환
        this.scene.scene.start("ranking", data);

    }
    // -----------------------벽 충돌-----------------------------------------------------
    CollisionBox(){
        // 충돌 체크
        this.scene.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
            if ((bodyA.label === 'playerCollider' && bodyB.label === 'CollisionBox') ||
                (bodyA.label === 'CollisionBox' && bodyB.label === 'playerCollider')) {
                this.player.speed = 0; //멈추게 속도 0
                this.Gameover();
            }
        });
    }
    //------------------------점수 라인 충돌--------------------------------------------
    ScoreCollision(){
        // 충돌 체크
        this.scene.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
            if ((bodyA.label === 'playerCollider' && bodyB.label === 'ScoreCollision') ||
                (bodyA.label === 'ScoreCollision' && bodyB.label === 'playerCollider')) {
                // 충돌 시 점수 증가
                this.scene.score += 1;  
                // 점수를 UI에 표시
                this.scene.scoreText.setText(`${this.scene.score}`);

                // 게임오버 음악 재생 
                if(this.isSoundPlaying)
                {
                    this.score = this.mainScene.sound.add("score");
                    this.score.play();
                }
            }
        });
    }

    createPlayer()
    {
        this.player = new Player({
            scene: this.scene,
            x: 360,
            y: 1110,
            texture: "left",
            frame: "left01",
        });
    }

    
    Init()
    {
        this.createPlayer();
        this.CollisionBox();
        this.ScoreCollision();

        // 클릭 횟수를 저장할 변수
        let clickCapeount = 0;

        this.player.anims.play("left_idle", true); //애니메이션 재생

        // 클릭 이벤트 리스너 설정
        this.scene.input.on("pointerdown", () => {
            clickCapeount = (clickCapeount + 1) % 4; // 0, 1, 2, 3을 순환하도록 설정
            this.player.speed += 0.5; // 속도 0.5씩 오르게
            this.player.playturn  = clickCapeount
            this.player.rotateClockwise();

        });
    }

    
}