
export default class Ranking extends Phaser.Scene {
    constructor() {
        super("ranking");
    }
    init(data)
    {
        this.score = data.score;
    }
    async create() {
        const rank = this.add.sprite(360,640,'ranking');
        const xb = this.add.sprite(610, 80, 'xbutton');

        //폰트스타일
        const fontStyle = {
            font: '60px myfont',
            fill: 'black',
            align: 'center', 
            stroke: 'black', // 두껍게 효과를 주기 위해 stroke 속성 추가
            strokeThickness: 2.5,
        };

        // 마지막 점수를 표시할 텍스트 생성
        this.scene.scoreText = this.add.text(360, 1100, `${this.score}`,fontStyle );
        this.scene.scoreText.setOrigin(0.5, 0.5);

        //rank쿼리 연결하기
        try {
            const response = await fetch('../06-circle-runner/DBphp/get-rank.php', 
            {                           
                method: 'GET',
                headers: {
                    'Content-Type' : 'application/json'
                },
            })
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data); // 응답 데이터 출력
                
            // 동적으로 생성된 텍스트 추가하기
            const yPositions = [332, 465, 592, 720, 848];
            for (let i = 0; i < 5; i++) {
                const rankText = this.add.text(360, yPositions[i], data[i], fontStyle).setOrigin(0.5, 0.5);
                // data[i]는 서버에서 받은 상위 5개의 점수값
            }

        } catch (error) {
            console.error('Error:', error);
        }
        
        //button 클릭 이벤트
        xb.setInteractive({ useHandCursor: true }); // 버튼에 인터랙션 추가
        xb.on("pointerdown", () => {
            // 브라우저 창 닫기
            close_game();
        });
    }
}