import Loading from "./Loading.js";
import MainScene from "./MainScene.js";
import Ranking from "./Ranking.js"
import LoadingBar from "./LoadingBar.js";


const config = {
    width: 720,
    height: 1280,
    type: Phaser.AUTO,
    parent: 'CircleRunner',
    scene: [
        LoadingBar,
        Loading,
        MainScene,
        Ranking
    ],
    scale: {
        mode:Phaser.Scale.FIT,//자동맞춤
                autoCenter:Phaser.Scale.CENTER_BOTH,//가로세로 모두맞춤
                width:720,//비율설정용 폭
                height:1280,//비율설정용 높이
    },
    physics: {
        default: 'matter',
        matter: {
            debug: true,
            gravity: {y: 0},
        }
    },
    plugins: {
        scene: [
            {
                plugin: PhaserMatterCollisionPlugin,
                key: 'matterCollision',
                mapping: 'matterCollision'
            }
        ]
    }
}

new Phaser.Game(config);
