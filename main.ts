// Setup

info.setLife(5)
scene.setBackgroundImage(assets.image`world`)

// Spawn player

let player = sprites.create(assets.image`player`, SpriteKind.Player)

player.setPosition(
    scene.screenWidth() / 2,
    scene.screenHeight() / 8 * 7,
)

// Spawn enemies

const ENEMY_SIZE = 16;

class EnemyGroup {
    x: number
    y: number
    width: number
    height: number

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }

    spawn_enemies() {
        for (let enemy_x = 0; enemy_x < this.width; enemy_x++) {
            let pos_x = this.x + enemy_x * ENEMY_SIZE

            for (let enemy_y = 0; enemy_y < this.height; enemy_y++) {
                let pos_y = this.y + enemy_y * ENEMY_SIZE

                let enemy = sprites.create(assets.image`enemy`, SpriteKind.Enemy)

                enemy.setPosition(pos_x, pos_y)
            }
        }
    }
}

let enemy_group = new EnemyGroup(0, 40, 10, 4)

enemy_group.spawn_enemies()