kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    clearColor: [0, 0, 0, 1]
})

let isJumping = true
let isBig = false

loadRoot("https://i.imgur.com/")

loadSprite('bloco', 'M6rwarW.png')
loadSprite('goomba', 'KPO3fR9.png')
loadSprite('surpresa', 'gesQ1KP.png')
loadSprite('unboxed', 'bdrLpi6.png')
loadSprite('moeda', 'wbKxhcd.png')
loadSprite('cogumelo', '0wMd92p.png')

loadSprite("mario", "OzrEnBy.png", {
    sliceX: 3.9,
    anims: {
        idle: {
            from: 0,
            to: 0,
        },
        move: {
            from: 1,
            to: 2,
        },

    },
});

loadSprite('tijolo', 'pogC9x5.png') // tijolo
loadSprite('tubo-top-left', 'ReTPiWY.png') // tubo esquerdo
loadSprite('tubo-top-right', 'hj2GK4n.png') // tubo direito
loadSprite('tubo-bottom-left', 'c1cYSbt.png') // tubo parte de baixo esquerdo
loadSprite('tubo-bottom-right', 'nqQ79eI.png') // tubo parte de baixo direito

loadSprite('blue-bloco', 'fVscIbn.png') // bloco azul
loadSprite('blue-tijolo', '3e5YRQd.png') // tijolo azul
loadSprite('blue-aco', 'gqVoI2b.png') // bloco de aço azul
loadSprite('blue-goomba', 'SvV4ueD.png')


scene("game", ({
    level,
    score,
    big
}) => {
    layer(["bg", "obj", "ui"], "obj")

    const maps = [
        [
            '~                                   ~',
            '~                                   ~',
            '~                                   ~',
            '~                                   ~',
            '~                                   ~',
            '~                                   ~',
            '~     %   =*=%=                     ~',
            '~                                   ~',
            '~                           -+      ~',
            '~                   ^   ^   ()      ~',
            '=====================================',
        ],
        [
            '/                                   /',
            '/                                   /',
            '/                                   /',
            '/                                   /',
            '/                                   /',
            '/                                   /',
            '/    @@@@@@                         /',
            '/                     x x           /',
            '/                   x x x x    -+   /',
            '/          z   z  x x x x x x  ()   /',
            '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
        ],
        [
            '                                     ',
            '                             !       ',
            '                            %%%%%%   ',
            '                     !               ',
            '             %%    %%%%%             ',
            '      %%%                            ',
            '    %                                  ',
            '                                   ',
            '=     !    !   =  ^  ^    !    !     ',
            '===========================    =====/',
            '                          =    =    /',
            '                                    /',
            '        !                           /',
            '      %*%                           /',
            ' -+           %                     /',
            ' ()!         !    ^                 /',
            '%%%%%%%%%%%%%%%%%%   ===============/',
            '                                     ',
            '                                     ',
            '                                     ',
        ],
        [
            '=                                   =',
            '=                                   =',
            '=                                   =',
            '=                                   =',
            '=                                   =',
            '=    ======          =              =',
            '=                 =  =  =           =',
            '=              =  =  =  =  =   -+   =',
            '=              =  =  =  =  =   ()   =',
            '=====================================',
        ],

    ]

    const levelCfg = {
        width: 20,
        height: 20,
        '=': [sprite('bloco'), solid()],
        '$': [sprite('moeda'), 'moeda'],
        '%': [sprite('surpresa'), solid(), 'moeda-surpresa'],
        '*': [sprite('surpresa'), solid(), 'cogumelo-surpresa'],
        '}': [sprite('unboxed'), solid()],
        '^': [sprite('goomba'), 'dangerous'],
        '#': [sprite('cogumelo'), 'cogumelo', body()],

        '~': [sprite('tijolo'), solid()],
        '(': [sprite('tubo-bottom-left'), solid(), scale(0.5)],
        ')': [sprite('tubo-bottom-right'), solid(), scale(0.5)],
        '-': [sprite('tubo-top-left'), solid(), 'tubo', scale(0.5)],
        '+': [sprite('tubo-top-right'), solid(), 'tubo', scale(0.5)],
        '!': [sprite('blue-bloco'), solid(), scale(0.5)],
        '/': [sprite('blue-tijolo'), solid(), scale(0.5)],
        'z': [sprite('blue-goomba'), body(), 'dangerous', scale(0.5)],
        'x': [sprite('blue-aco'), solid(), scale(0.5)],
    }

    const gameLevel = addLevel(maps[level], levelCfg)

    const scoreLabel = add([
        text('Moedas: ' + score, 10),
        pos(20, 5),
        layer('ui'),
        {
            value: score
        }
    ])

    add([text('Level: ' + parseInt(level + 1), 10), pos(20, 30)])

    function big() {
        return {
            isBig() {
                return isBig
            },
            smallify() {
                this.scale = vec2(1)
                isBig = false
            },
            biggify() {
                this.scale = vec2(1.5)
                isBig = true
            }
        }
    }

    const player = add([

        sprite("mario", {
            animSpeed: 0.1,
            frame: 0
        }),
        solid(),
        body(),
        pos(60, 0),
        big(),
        origin('bot'),
        {
            speed: 120
        }
    ])

    if (isBig) {
        player.biggify()
    }

    keyDown('left', () => {
        player.flipX(true)
        player.move(-120, 0)
    })

    keyDown('right', () => {
        player.flipX(false)
        player.move(120, 0)
    })

    keyPress('space', () => {
        if (player.grounded()) {
            player.jump(390)
            isJumping = true
        }
    })

    //animar mario
    keyPress('left', () => {
        player.flipX(true)
        player.play('move')
    })

    keyPress('right', () => {
        player.flipX(false)
        player.play('move')
    })

    //////////////////////

    // animar parado //
    keyRelease('left', () => {
        player.play('idle')
    })

    keyRelease('right', () => {
        player.play('idle')
    })
    ///////////////////////////

    action('dangerous', (obj) => {
        obj.move(-20, 0)
    })

    action('cogumelo', (obj) => {
        obj.move(20, 0)
    })

    player.action(() => {
        if (player.grounded()) {
            isJumping = false
        }
    })

    player.on('headbutt', (obj) => {
        if (obj.is('moeda-surpresa')) {
            gameLevel.spawn('$', obj.gridPos.sub(0, 1))
            destroy(obj)
            gameLevel.spawn('}', obj.gridPos.sub(0, 0))
        }

        if (obj.is('cogumelo-surpresa')) {
            gameLevel.spawn('#', obj.gridPos.sub(0, 1))
            destroy(obj)
            gameLevel.spawn('}', obj.gridPos.sub(0, 0))
        }

    })

    player.collides('cogumelo', (obj) => {
        destroy(obj)
        player.biggify()
    })

    player.collides('dangerous', (obj) => {
        if (isJumping) {
            destroy(obj)
        } else {
            if (isBig) {
                player.smallify()
            } else {
                go("lose", ({
                    score: scoreLabel.value
                }))
            }
        }
    })

    player.collides('moeda', (obj) => {
        destroy(obj)
        scoreLabel.value++
        scoreLabel.text = 'Moedas: ' + scoreLabel.value
    })

    player.collides('tubo', () => {
        keyPress('down', () => {
            go("game", {
                level: (level + 1) % maps.length,
                score: scoreLabel.value,
                big: isBig
            })
        })
    })
})

scene("lose", ({
    score
}) => {
    add([text('Game Over - Pontos: ' + score, 18), origin('center'), pos(width() / 2, height() / 2)])
    keyPress('space', () => {
        go("game", {
            level: 0,
            score: 0,
            big: isBig
        })
    })
})

go("game", ({
    level: 0,
    score: 0,
    big: isBig
}))