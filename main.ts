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

function spawn_enemy_block(width: number, height: number) {

}