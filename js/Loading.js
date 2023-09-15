

export default class Loading extends Phaser.Scene{
    constructor(){
        super("loading");

        // 전역 변수로 사용할 사운드 객체들
        this.bgmSound = null;
        this.turnSound = null;
        this.scoreSound = null;
        this.gameoverSound = null;

        this.isSoundPlaying = false;

    }
    preload(){

        // 배경 이미지 추가
        this.load.image("splash", "assets/images/splash.png");
        this.add.image(360, 640, 'splash').setDepth(0);

        this.graphics = this.add.graphics();
		this.newGraphics = this.add.graphics(); // updateBar 함수에서 설정함.
		var progressBar = new Phaser.Geom.Rectangle(150, 900, 450, 18); // 바 위치와 크기

		this.graphics.fillStyle(0x404040, 1);
		this.graphics.fillRectShape(progressBar);


// -------------------------- ↓↓ Loading Scene preload  -------------------------------

        //이미지
        this.load.image("background","assets/images/loading-bg.png");
        this.load.image("button", "assets/images/play-btt.png");
        this.load.image("soundon", "assets/images/s-on.png");
        this.load.image("soundoff", "assets/images/s-off.png");
        this.load.image("help", "assets/images/help.png");
        //도움말 이미지
        this.load.image("xbutton", "assets/images/x-btt.png");
        this.load.image("control", "assets/images/control.png");
        //사운드
        this.load.audio("bgm", 'assets/sounds/bgm.wav');


// -------------------------- ↓↓ Main Scene preload   -----------------------------------

        //이미지
        this.load.image("mainbg", "assets/images/main-bg.png");
        //폰트
        this.load.bitmapFont('myFont', 'font/myfont.ttf');
        //사운드
        this.load.audio("turn", 'assets/sounds/turn.wav');
        this.load.audio("score", 'assets/sounds/score.wav');
        this.load.audio("gameOver", 'assets/sounds/over.wav');

        
// -------------------------- ↓↓ Ranking Scene preload   -----------------------------------

        //이미지
        this.load.image("ranking", "assets/images/Rank.png");
        this.load.image("xbutton", "assets/images/x-btt.png");

        
// ------------------------ 로딩 진행률 추적하고 프로그레스 바 업데이트 ----------------------------
        for(var i =0;i<200;i++) {
            this.load.image('barGG'+i, 'assets/images/bar_gg.png');
        }
        this.load.on('progress', this.updateBar, {newGraphics:this.newGraphics, barPercent:this.barPercent});

    }

// ----------------------------  프로그레스 바 업데이트  --------------------------
    updateBar(percentage) 
    {
        this.barPercent = percentage;
        
        this.newGraphics.clear();
        this.newGraphics.fillStyle(0xffffff, 1);
        this.newGraphics.fillRectShape(new Phaser.Geom.Rectangle(153, 903, percentage*445, 12));
    }

    create(){
        const bg = this.add.sprite(360,640,'background');
        const btt = this.add.sprite(530,1120,'button');
        const s1 = this.add.sprite(670,50,'soundon');
        const help = this.add.sprite(585,50,'help');

        // 도움말 이미지가 보이는지 여부를 나타내는 변수
        this.isHelpVisible = false; 
        let con, xb, s2; // 도움말 이미지와 버튼


        // 전역 변수에 사운드 객체들 할당
        this.bgmSound = this.sound.add("bgm", { loop: true });
     

        // 배경음악 재생 
        this.bgmSound.play();
        // 볼륨 값 설정 (0.0 ~ 1.0 사이의 값)
        this.bgmSound.setVolume(0.5); // 50% 볼륨으로 설정
        
// ---------------------------------------- play button 클릭 이벤트 ----------------------------------------
        btt.setInteractive({ useHandCursor: true }); // 버튼에 인터랙션 추가
        btt.on("pointerdown", async () => {
            
            // 데이터 날짜형식으로 정의해줌
            let data = {
                date: new Date()
            }
            // 한국 표준시 (KST) 기준으로 변환
            let koreanTime = new Date(data.date.getTime() + (9 * 60 * 60 * 1000));
            let formattedDateTime = koreanTime.toISOString().slice(0, 19).replace('T', ' ');

            // update.php -- 시작 시간 ↓↓
            try {
                const formData = new FormData();
                formData.append('pk', LOG_GAMEDATA_PK);
                formData.append('column', 'GAMEDATA_START_DT');
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
            // 씬 전환
            this.scene.transition({
                target: "mainScene",
                duration: 500,
                data: this.isSoundPlaying ? 100 : 200,
            });
        });

        //sound 클릭 이벤트
        s1.setInteractive({ useHandCursor: true });
        s1.on("pointerup", () => {
            if(!this.isHelpVisible){
                //누르면 꺼지고 다시 누르면 켜지고
                if(this.isSoundPlaying){
                    this.bgmSound.play();
                    this.add.sprite(670,50,'soundon');
                }else{
                    this.sound.stopAll(); // 전체 사운드 정지
                    s2 = this.add.sprite(670,50,'soundoff');
                
                }
                // 사운드 상태 변경
                this.isSoundPlaying = !this.isSoundPlaying;
            }
        });

        //help 클릭 이벤트
        help.setInteractive({ useHandCursor: true });
        help.on("pointerdown", () => {

        if(!this.isHelpVisible){
            // 버튼 클릭 가능 여부를 업데이트
            this.isHelpVisible = !this.isHelpVisible;

            if (this.isHelpVisible) {
                con = this.add.sprite(360, 640, 'control');
                xb = this.add.sprite(610, 70, 'xbutton');
                
                // 도움말 이미지가 보일 때 기존 버튼들을 비활성화
                s1.setInteractive(false);
                help.setInteractive(false);
            } 
        }else {
            // 도움말 이미지가 숨겨질 때 기존 버튼들을 다시 활성화
            s1.setInteractive(true);
            help.setInteractive(true);
            
            // 이미지 비활성화
            con.setVisible(false);
            xb.setVisible(false);

            // 버튼 클릭 가능 여부를 업데이트
            this.isHelpVisible = !this.isHelpVisible;
        }
        });
    }

    update(){}

}