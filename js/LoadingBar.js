export default class LoadingBar extends Phaser.Scene{

    constructor ()
    {
        super('loadingbar');
    }

    preload ()
    {
        this.load.image('splash', 'assets/images/splash.png');
    }

    create ()
    {
        const bg = this.add.sprite(360, 640, 'splash').setDepth(-1);

        // 씬전환
        this.scene.transition({
            target: "loading",
            duration: 500,
            data: this.isSoundPlaying ? 100 : 200,
        });
       
    }
}