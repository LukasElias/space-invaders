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

class Enemy {
    x: number
    y: number
    image: Image
    damage: number
    
    constructor(
        x: number,
        y: number,
        image: Image,
        damage: number
    ) {
        this.x = x
        this.y = y
        this.image = image
        this.damage = damage
    }

    spawn() {
        let enemy_sprite = sprites.create(this.image, SpriteKind.Enemy)

        enemy_sprite.setPosition(this.x, this.y)
        
        sprites.setDataNumber(enemy_sprite, "damage", this.damage)
    }
}

let enemy = new Enemy(50, 50, assets.image`enemy`, 1)

enemy.spawn()