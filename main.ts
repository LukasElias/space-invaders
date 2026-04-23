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
    health: number

    constructor(
        image: Image,
        damage: number,
        health: number
    ) {
        this.image = image
        this.damage = damage
        this.health = health
    }
}

const normal_enemy = new EnemyType(assets.image`enemy`, 1, 1)
const boss_enemy = new EnemyType(assets.image`boss`, 5, 10)

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

        let health_bar = statusbars.create(10, 2, StatusBarKind.EnemyHealth)
        
        health_bar.attachToSprite(enemy_sprite)

        health_bar.max = this.enemy_type.health
        health_bar.value = this.enemy_type.health

        health_bar.setFlag(SpriteFlag.Invisible, true)

        enemy_sprite.vy = 4
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

function enemy_suicide(enemy_sprite: Sprite) {
    let damage = sprites.readDataNumber(enemy_sprite, "damage")

    enemy_sprite.destroy()

    info.changeLifeBy(-damage)
}

sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Player, (enemy_sprite, player_sprite) => {
    enemy_suicide(enemy_sprite)
})

sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Projectile, (
    enemy_sprite,
    projectile
) => {
    let damage = 1;

    projectile.destroy()

    let status_bar = statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, enemy_sprite)

    status_bar.value -= damage

    status_bar.setFlag(SpriteFlag.Invisible, false)
})

statusbars.onZero(StatusBarKind.EnemyHealth, (status_bar) => {
    let enemy_sprite = status_bar.spriteAttachedTo()

    info.changeScoreBy(sprites.readDataNumber(enemy_sprite, "damage") * 100)

    enemy_sprite.destroy()
    status_bar.destroy()
})

// Player logic

controller.moveSprite(player, 100, 0)

player.setStayInScreen(true)

controller.A.onEvent(ControllerButtonEvent.Pressed, () => {
    let attack = sprites.createProjectileFromSprite(assets.image`attack`, player, 0, -100)
})

// Game Loop

game.onUpdate(() => {
    let enemies = sprites.allOfKind(SpriteKind.Enemy)

    if (enemies.length === 0) {
        let formation = cross_formation(Math.randomRange(40, scene.screenWidth() - 40), 0)
        spawn_enemies(formation)
    }

    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i]

        if (enemy.y > scene.screenHeight()) {
            enemy_suicide(enemy)
        }
    }
})