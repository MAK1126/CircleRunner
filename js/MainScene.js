import CharacterMng from "./CharacterMng.js";
import CollisionBox from "./CollisionBox.js";
import ScoreCollision from "./ScoreCollision.js";

export default class MainScene extends Phaser.Scene{

    constructor(){
        super({ key: 'mainScene' });

        this.isSoundPlaying;
        this.bgmSound;
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
    preload(){
        CharacterMng.preload(this);
    }

    create(){
        // 전역 변수에 사운드 객체들 할당
        this.load.audio("turn", 'assets/sounds/turn.wav');
        this.load.audio("score", 'assets/sounds/score.wav');
        this.load.audio("gameOver", 'assets/sounds/over.wav');

        this.bg = this.add.sprite(360,640,'mainbg').setDepth(-2); // 메인 배경

        //폰트스타일
        const fontStyle = {
            font: '60px myfont',
            fill: 'green',
            align: 'center',
            stroke: 'green', // 두껍게 효과를 주기 위해 stroke 속성 추가
            strokeThickness: 2.5,
        };

        //점수
        this.score = 0; 
        this.scoreText = this.add.text(20, 5, '0',fontStyle);


        this.characterMng = new CharacterMng(  
        {
            scene: this
        });
        this.characterMng.Init(); // 플레이어 생성과 충돌함수 들어있음


        // 화면 클릭하면 pointerdownF 함수 호출
        this.input.on('pointerdown', this.pointerdownF, this);

        // 충돌 박스 생성
        this.InitCollisionBox();
        
    }
    InnerCreateBox(){ // 안쪽 충돌 박스
        this.CollisionBox = new CollisionBox(  
            {
                scene: this,
                x:  364,
                y : 803,
                width : 340,
                height: 490,
            });
    }
    CreateBoxUP(){
        this.CollisionBox = new CollisionBox(  
            {
                scene: this,
                x:  360,
                y : 400,
                width : 630,
                height: 30,
            });
    }
    CreateBoxDOWN(){
        this.CollisionBox = new CollisionBox(  
            {
                scene: this,
                x:  360,
                y : 1200,
                width : 630,
                height: 30,
            });
    }
    CreateBoxLEFT(){
        this.CollisionBox = new CollisionBox(  
            {
                scene: this,
                x:  40,
                y : 800,
                width : 30,
                height: 770,
            });
    }
    CreateBoxRIGHT(){
        this.CollisionBox = new CollisionBox(  
            {
                scene: this,
                x:  680,
                y : 800,
                width : 30,
                height: 770,
            });
    }
    // 점수 충돌박스
    CreateScoreLine(){
        this.ScoreCollision = new ScoreCollision(
            {
                scene: this,
                x:  470,
                y : 1115,
                width : 1,
                height: 120,
            });
    }
    InitCollisionBox(){
        this.InnerCreateBox();
        this.CreateBoxUP();
        this.CreateBoxDOWN();
        this.CreateBoxLEFT();
        this.CreateBoxRIGHT();
        this.CreateScoreLine();
    }


    // 화면 클릭하면 호출되는 pointerdownF 함수
    pointerdownF() {
        // 사운드가 켜져 있는 경우에만 개구리 클릭 음악을 재생합니다.
        if (this.isSoundPlaying) {
            this.turn = this.sound.add("turn");
            this.turn.play();
        }
    }

    update(){
        this.characterMng.update();
    }

}