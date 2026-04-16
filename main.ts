// Setup

info.setLife(5)
info.setScore(0)
scene.setBackgroundImage(assets.image`world`)

// Spawn player

let player = sprites.create(assets.image`player`, SpriteKind.Player)

player.setPosition(
    scene.screenWidth() / 2,
    scene.screenHeight() / 8 * 7,
)

// Spawn enemies

class EnemyType {
    image: Image
    damage: number
    
    constructor(
        image: Image,
        damage: number
    ) {
        this.image = image
        this.damage = damage
    }
}

const normal_enemy = new EnemyType(assets.image`enemy`, 1)
const boss_enemy = new EnemyType(assets.image`boss`, 5)

class Enemy {
    x: number
    y: number
    enemy_type: EnemyType

    constructor(
        x: number,
        y: number,
        enemy_type: EnemyType
    ) {
        this.x = x
        this.y = y
        this.enemy_type = enemy_type
    }

    spawn() {
        let enemy_sprite = sprites.create(this.enemy_type.image, SpriteKind.Enemy)

        enemy_sprite.setPosition(this.x, this.y)

        sprites.setDataNumber(enemy_sprite, "damage", this.enemy_type.damage)
    }
}

function spawn_enemies(enemies: Enemy[]) {
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i]

        enemy.spawn()
    }
}

function cross_formation(x: number, y: number): Enemy[] {
    // Boss is at x, y
    let formation: Enemy[] = [
        new Enemy(x     , y     , boss_enemy),
        new Enemy(x + 24, y + 24, normal_enemy),
        new Enemy(x + 24, y - 24, normal_enemy),
        new Enemy(x - 24, y + 24, normal_enemy),
        new Enemy(x - 24, y - 24, normal_enemy),
    ]

    return formation
}

let formation = cross_formation(scene.screenWidth() / 2, 0)

spawn_enemies(formation)

// Enemy logic

function enemy_step() {
    let enemies = sprites.allOfKind(SpriteKind.Enemy)

    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i]

        enemy.y += 1
    }
}

game.onUpdateInterval(500, enemy_step)

sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Player, (
    enemy_sprite,
    player_sprite
) => {
    let damage = sprites.readDataNumber(enemy_sprite, "damage")
    
    enemy_sprite.destroy()
    
    info.changeLifeBy(-damage)
})

sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Projectile, (
    enemy_sprite,
    projectile
) => {
    let points = sprites.readDataNumber(enemy_sprite, "damage") * 100

    projectile.destroy()

    enemy_sprite.destroy()

    info.changeScoreBy(points)
})

// Player logic

controller.moveSprite(player, 100, 0)

player.setStayInScreen(true)

controller.A.onEvent(ControllerButtonEvent.Pressed, () => {
    let attack = sprites.createProjectileFromSprite(assets.image`attack`, player, 0, -100)
})