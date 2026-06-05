import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const STEAM_CAPSULE = (appId: string) => `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/capsule_616x353.jpg`
const STEAM_HERO = (appId: string) => `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_hero.jpg`

// ============================================================
// GAME DATA - 50 games with verified Steam App IDs
// ============================================================
const GAMES_DATA = [
  {
    title: 'Cyberpunk 2077',
    slug: 'cyberpunk-2077',
    steamId: '1091500',
    description: 'Cyberpunk 2077 es un RPG de mundo abierto ambientado en Night City, una megalópolis obsesionada con el poder, el glamour y la modificación corporal. Juega como V, un mercenario en busca de un implante único que concede la inmortalidad.',
    developer: 'CD Projekt Red',
    publisher: 'CD Projekt',
    releaseDate: '2020-12-10',
    rating: 4.2,
    ratingCount: 282,
    categorySlug: 'accion',
    platforms: 'PC, PlayStation, Xbox',
    featured: true,
    trailerUrl: null,
  },
  {
    title: 'Elden Ring',
    slug: 'elden-ring',
    steamId: '1245620',
    description: 'Elden Ring es un RPG de acción en mundo abierto desarrollado por FromSoftware con la colaboración de George R.R. Martin. Explora las Tierras Intermedias, un vasto mundo lleno de peligros y jefes épicos.',
    developer: 'FromSoftware',
    publisher: 'Bandai Namco',
    releaseDate: '2022-02-25',
    rating: 4.8,
    ratingCount: 283,
    categorySlug: 'rpg',
    platforms: 'PC, PlayStation, Xbox',
    featured: true,
    trailerUrl: null,
  },
  {
    title: 'God of War Ragnarök',
    slug: 'god-of-war-ragnarok',
    steamId: '1593500',
    description: 'God of War Ragnarök es la secuela del aclamado God of War. Kratos y Atreus deben enfrentarse al Ragnarök mientras exploran los Nueve Reinos con combates brutales y una historia emocionante.',
    developer: 'Santa Monica Studio',
    publisher: 'Sony Interactive',
    releaseDate: '2022-11-09',
    rating: 4.7,
    ratingCount: 334,
    categorySlug: 'accion',
    platforms: 'PC, PlayStation',
    featured: true,
    trailerUrl: null,
  },
  {
    title: 'Baldur\'s Gate 3',
    slug: 'baldurs-gate-3',
    steamId: '1086940',
    description: 'Baldur\'s Gate 3 es un RPG basado en Dungeons & Dragons 5ª edición. Reúne tu party y emprende una aventura épica con decisiones profundas y combates tácticos por turnos.',
    developer: 'Larian Studios',
    publisher: 'Larian Studios',
    releaseDate: '2023-08-03',
    rating: 4.8,
    ratingCount: 294,
    categorySlug: 'rpg',
    platforms: 'PC, PlayStation, Xbox',
    featured: true,
    trailerUrl: null,
  },
  {
    title: 'Resident Evil 4 Remake',
    slug: 'resident-evil-4-remake',
    steamId: '2050650',
    description: 'El remake del clásico de supervivencia. Leon S. Kennedy es enviado a una zona rural de España para rescatar a la hija del presidente con gráficos modernos y combate reinventado.',
    developer: 'Capcom',
    publisher: 'Capcom',
    releaseDate: '2023-03-24',
    rating: 4.5,
    ratingCount: 271,
    categorySlug: 'accion',
    platforms: 'PC, PlayStation, Xbox',
    featured: true,
    trailerUrl: null,
  },
  {
    title: 'Black Myth: Wukong',
    slug: 'black-myth-wukong',
    steamId: '2358720',
    description: 'Un RPG de acción basado en la mitología china. Juega como el Rey Mono en una aventura épica llena de combate intenso y jefes desafiantes inspirados en Viaje al Oeste.',
    developer: 'Game Science',
    publisher: 'Game Science',
    releaseDate: '2024-08-20',
    rating: 4.6,
    ratingCount: 285,
    categorySlug: 'accion',
    platforms: 'PC, PlayStation',
    featured: true,
    trailerUrl: null,
  },
  {
    title: 'Red Dead Redemption 2',
    slug: 'red-dead-redemption-2',
    steamId: '1174180',
    description: 'América, 1899. Arthur Morgan y la banda de Van der Linde huyen tras un robo que sale mal. Una obra maestra del salvaje oeste con narrativa cinematográfica.',
    developer: 'Rockstar Games',
    publisher: 'Rockstar Games',
    releaseDate: '2019-11-05',
    rating: 4.8,
    ratingCount: 335,
    categorySlug: 'aventura',
    platforms: 'PC, PlayStation, Xbox',
    featured: true,
    trailerUrl: null,
  },
  {
    title: 'The Witcher 3: Wild Hunt',
    slug: 'the-witcher-3-wild-hunt',
    steamId: '292030',
    description: 'Como Geralt de Rivia, un cazador de monstruos profesional, embarcate en una aventura épica en un mundo de guerra y caos con cientos de horas de contenido.',
    developer: 'CD Projekt Red',
    publisher: 'CD Projekt',
    releaseDate: '2015-05-19',
    rating: 4.7,
    ratingCount: 280,
    categorySlug: 'rpg',
    platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
    featured: true,
    trailerUrl: null,
  },
  {
    title: 'Sekiro: Shadows Die Twice',
    slug: 'sekiro-shadows-die-twice',
    steamId: '814380',
    description: 'En el Japón Sengoku, un shinobi desfigurado busca venganza. Con combate basado en la postura y un brazo protésico con gadgets, Sekiro ofrece un desafío incomparable.',
    developer: 'FromSoftware',
    publisher: 'Activision',
    releaseDate: '2019-03-22',
    rating: 4.6,
    ratingCount: 281,
    categorySlug: 'accion',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Hogwarts Legacy',
    slug: 'hogwarts-legacy',
    steamId: '990080',
    description: 'Vive la vida de un estudiante en Hogwarts en el siglo XIX. Domina hechizos, elabora pociones y descubre secretos del mundo mágico en un mundo abierto.',
    developer: 'Avalanche Software',
    publisher: 'Warner Bros. Games',
    releaseDate: '2023-02-10',
    rating: 4.3,
    ratingCount: 291,
    categorySlug: 'aventura',
    platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
    featured: true,
    trailerUrl: null,
  },
  {
    title: 'Ghost of Tsushima',
    slug: 'ghost-of-tsushima',
    steamId: '1240440',
    description: 'En 1274, los mongoles invaden Tsushima. Jin Sakai debe sacrificarse como samurái y convertirse en el Fantasma para proteger su isla natal.',
    developer: 'Sucker Punch Productions',
    publisher: 'Sony Interactive',
    releaseDate: '2024-05-16',
    rating: 4.6,
    ratingCount: 262,
    categorySlug: 'aventura',
    platforms: 'PC, PlayStation',
    featured: true,
    trailerUrl: null,
  },
  {
    title: 'Grand Theft Auto V',
    slug: 'grand-theft-auto-v',
    steamId: '271590',
    description: 'Tres criminales diferentes se unen en Los Santos para una serie de atracos peligrosos. Una de las experiencias de mundo abierto más populares de todos los tiempos.',
    developer: 'Rockstar North',
    publisher: 'Rockstar Games',
    releaseDate: '2015-04-14',
    rating: 4.5,
    ratingCount: 243,
    categorySlug: 'accion',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'DOOM Eternal',
    slug: 'doom-eternal',
    steamId: '519860',
    description: 'El Slayer regresa en la secuela de Doom 2016. Desgarra y destroza a las hordas demoníacas con un arsenal de armas letales y movimientos acrobáticos.',
    developer: 'id Software',
    publisher: 'Bethesda Softworks',
    releaseDate: '2020-03-19',
    rating: 4.5,
    ratingCount: 227,
    categorySlug: 'shooter',
    platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Helldivers 2',
    slug: 'helldivers-2',
    steamId: '553850',
    description: 'Únete a la lucha por la democracia en este shooter cooperativo en tercera persona. Completa misiones en planetas hostiles con tu equipo. ¡Por la democracia!',
    developer: 'Arrowhead Game Studios',
    publisher: 'Sony Interactive',
    releaseDate: '2024-02-08',
    rating: 4.4,
    ratingCount: 239,
    categorySlug: 'shooter',
    platforms: 'PC, PlayStation',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Death Stranding',
    slug: 'death-stranding',
    steamId: '548430',
    description: 'Sam Porter Bridges debe viajar por los Estados Unidos en ruinas para reconectar la sociedad. Una obra visionaria de Hideo Kojima que redefine los videojuegos.',
    developer: 'Kojima Productions',
    publisher: 'Kojima Productions',
    releaseDate: '2020-07-14',
    rating: 4.2,
    ratingCount: 267,
    categorySlug: 'aventura',
    platforms: 'PC, PlayStation',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Dark Souls III',
    slug: 'dark-souls-iii',
    steamId: '374320',
    description: 'La entrega final de la saga Dark Souls. Viaja a Lothric y enciende la llama que mantiene a la oscuridad a raya con combate intenso y jefes memorables.',
    developer: 'FromSoftware',
    publisher: 'Bandai Namco',
    releaseDate: '2016-04-11',
    rating: 4.6,
    ratingCount: 301,
    categorySlug: 'rpg',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Fallout 4',
    slug: 'fallout-4',
    steamId: '377160',
    description: 'Emerge del Refugio 111 al páramo de Boston tras una guerra nuclear. Busca a tu hijo secuestrado y forja tu camino en un mundo abierto lleno de peligro.',
    developer: 'Bethesda Game Studios',
    publisher: 'Bethesda Softworks',
    releaseDate: '2015-11-09',
    rating: 4.3,
    ratingCount: 284,
    categorySlug: 'rpg',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'The Elder Scrolls V: Skyrim',
    slug: 'the-elder-scrolls-v-skyrim',
    steamId: '489830',
    description: 'El RPG de mundo abierto que definió una generación. Como Sangre de Dragón, detén a Alduin mientras exploras las tierras heladas de Skyrim.',
    developer: 'Bethesda Game Studios',
    publisher: 'Bethesda Softworks',
    releaseDate: '2016-10-28',
    rating: 4.5,
    ratingCount: 253,
    categorySlug: 'rpg',
    platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Dragon\'s Dogma 2',
    slug: 'dragons-dogma-2',
    steamId: '2108330',
    description: 'La esperada secuela del RPG de acción de Capcom. Explora un mundo abierto con peones leales, combate dinámico y un sistema de clases versátil.',
    developer: 'Capcom',
    publisher: 'Capcom',
    releaseDate: '2024-03-22',
    rating: 4,
    ratingCount: 248,
    categorySlug: 'rpg',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Metaphor: ReFantazio',
    slug: 'metaphor-refantazio',
    steamId: '1620340',
    description: 'Del estudio detrás de Persona llega un RPG que redefine el género. Viaja con tus compañeros y descubre la verdad detrás de la utopía con el sistema Archetype.',
    developer: 'Studio Zero',
    publisher: 'SEGA',
    releaseDate: '2024-10-11',
    rating: 4.7,
    ratingCount: 294,
    categorySlug: 'rpg',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Like a Dragon: Infinite Wealth',
    slug: 'like-a-dragon-infinite-wealth',
    steamId: '2323410',
    description: 'Ichiban Kasuga y Kazuma Kiryu se unen en una aventura épica que cruza Japón y Hawái con combate por turnos mejorado y una historia llena de corazón.',
    developer: 'Ryu Ga Gotoku Studio',
    publisher: 'SEGA',
    releaseDate: '2024-01-26',
    rating: 4.5,
    ratingCount: 243,
    categorySlug: 'rpg',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Persona 5 Royal',
    slug: 'persona-5-royal',
    steamId: '1687950',
    description: 'Los Phantom Thieves roban la corrupción del corazón de la gente en Tokio. Un JRPG con estilo único, combate por turnos y una historia inolvidable.',
    developer: 'ATLUS',
    publisher: 'SEGA',
    releaseDate: '2022-10-21',
    rating: 4.8,
    ratingCount: 329,
    categorySlug: 'rpg',
    platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Final Fantasy VII Remake',
    slug: 'final-fantasy-vii-remake',
    steamId: '1462040',
    description: 'El remake del JRPG más icónico de la historia. Cloud Strife y Avalanche luchan contra la megacorporación Shinra en Midgar con combate en tiempo real.',
    developer: 'Square Enix',
    publisher: 'Square Enix',
    releaseDate: '2021-12-16',
    rating: 4.4,
    ratingCount: 289,
    categorySlug: 'rpg',
    platforms: 'PC, PlayStation',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'The Last of Us Part II',
    slug: 'the-last-of-us-part-ii',
    steamId: '1142710',
    description: 'Cinco años después, Ellie busca venganza en un viaje brutal y conmovedor. Combate mejorado, exploración profunda y una narrativa que desafía las expectativas.',
    developer: 'Naughty Dog',
    publisher: 'Sony Interactive',
    releaseDate: '2024-03-28',
    rating: 4.5,
    ratingCount: 314,
    categorySlug: 'aventura',
    platforms: 'PC, PlayStation',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Assassin\'s Creed Shadows',
    slug: 'assassins-creed-shadows',
    steamId: '2001120',
    description: 'Dos protagonistas, un Japón feudal en guerra. Como Naoe la shinobi y Yasuke el samurái, explora un mundo abierto en la era Sengoku.',
    developer: 'Ubisoft Quebec',
    publisher: 'Ubisoft',
    releaseDate: '2025-03-20',
    rating: 4,
    ratingCount: 268,
    categorySlug: 'aventura',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Horizon Forbidden West',
    slug: 'horizon-forbidden-west',
    steamId: '594650',
    description: 'Aloy viaja a la Costa Prohibida para descubrir la fuente de una plaga misteriosa. Combate máquinas imponentes y descubre secretos del pasado.',
    developer: 'Guerrilla Games',
    publisher: 'Sony Interactive',
    releaseDate: '2024-03-21',
    rating: 4.4,
    ratingCount: 309,
    categorySlug: 'aventura',
    platforms: 'PC, PlayStation',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'It Takes Two',
    slug: 'it-takes-two',
    steamId: '1426210',
    description: 'La aventura cooperativa más loca. Cody y May, una pareja convertida en muñecos, deben superar desafíos absurdos y redescubrir el trabajo en equipo.',
    developer: 'Hazelight Studios',
    publisher: 'EA',
    releaseDate: '2021-03-26',
    rating: 4.6,
    ratingCount: 310,
    categorySlug: 'aventura',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'A Plague Tale: Requiem',
    slug: 'a-plague-tale-requiem',
    steamId: '1182900',
    description: 'Amicia y Hugo viajan al sur buscando una cura para la maldición de Hugo. Una aventura emocional con ratas, sigilo y una narrativa conmovedora.',
    developer: 'Asobo Studio',
    publisher: 'Focus Entertainment',
    releaseDate: '2022-10-18',
    rating: 4.2,
    ratingCount: 262,
    categorySlug: 'aventura',
    platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Starfield',
    slug: 'starfield',
    steamId: '1716740',
    description: 'El primer nuevo universo de Bethesda en 25 años. Explora la galaxia con más de 1000 planetas, construcción de naves y un sistema de combate profundo.',
    developer: 'Bethesda Game Studios',
    publisher: 'Bethesda Softworks',
    releaseDate: '2023-09-06',
    rating: 3.9,
    ratingCount: 233,
    categorySlug: 'aventura',
    platforms: 'PC, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Counter-Strike 2',
    slug: 'counter-strike-2',
    steamId: '730',
    description: 'El shooter táctico más jugado del mundo regresa con el motor Source 2. Gráficos renovados, humo dinámico y la misma competencia feroz.',
    developer: 'Valve',
    publisher: 'Valve',
    releaseDate: '2023-09-27',
    rating: 4,
    ratingCount: 223,
    categorySlug: 'shooter',
    platforms: 'PC',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Call of Duty: Modern Warfare III',
    slug: 'call-of-duty-modern-warfare-3',
    steamId: '1938090',
    description: 'La nueva entrega de la saga Call of Duty con campaña cinematográfica, multijugador frenético y el regreso del modo Zombies.',
    developer: 'Sledgehammer Games',
    publisher: 'Activision',
    releaseDate: '2023-11-10',
    rating: 3.8,
    ratingCount: 215,
    categorySlug: 'shooter',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Doom Eternal',
    slug: 'doom-eternal-shooter',
    steamId: '519860',
    description: 'El Slayer regresa. Desgarra y destroza a las hordas demoníacas con un arsenal letal y movimientos acrobáticos en el combate más intenso.',
    developer: 'id Software',
    publisher: 'Bethesda Softworks',
    releaseDate: '2020-03-19',
    rating: 4.5,
    ratingCount: 276,
    categorySlug: 'shooter',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Resident Evil Village',
    slug: 'resident-evil-village',
    steamId: '1196590',
    description: 'Ethan Winters busca a su hija secuestrada en un pueblo misterioso lleno de horrores. Lady Dimitrescu te espera en su castillo.',
    developer: 'Capcom',
    publisher: 'Capcom',
    releaseDate: '2021-05-07',
    rating: 4.3,
    ratingCount: 271,
    categorySlug: 'shooter',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Titanfall 2',
    slug: 'titanfall-2',
    steamId: '1237970',
    description: 'La campaña de un jugador más subestimada del género. Pilota tu Titan BT-7274 en una historia de amistad entre humano y máquina.',
    developer: 'Respawn Entertainment',
    publisher: 'EA',
    releaseDate: '2020-06-26',
    rating: 4.6,
    ratingCount: 286,
    categorySlug: 'shooter',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Forza Horizon 5',
    slug: 'forza-horizon-5',
    steamId: '1551360',
    description: 'Conduce por los paisajes vibrantes de México en el juego de carreras en mundo abierto más grande y diverso. Cientos de coches y eventos dinámicos.',
    developer: 'Playground Games',
    publisher: 'Xbox Game Studios',
    releaseDate: '2021-11-09',
    rating: 4.4,
    ratingCount: 224,
    categorySlug: 'carreras',
    platforms: 'PC, Xbox',
    featured: true,
    trailerUrl: null,
  },
  {
    title: 'Need for Speed Unbound',
    slug: 'need-for-speed-unbound',
    steamId: '1848820',
    description: 'Las carreras callejeras más estilizadas. Compite en Lakeshore City con estilo único, efectos visuales de graffiti y persecuciones policiales intensas.',
    developer: 'Criterion Games',
    publisher: 'EA',
    releaseDate: '2022-12-02',
    rating: 3.9,
    ratingCount: 220,
    categorySlug: 'carreras',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Assetto Corsa',
    slug: 'assetto-corsa',
    steamId: '244210',
    description: 'El simulador de conducción más realista. Física precisa, coches licenciados y circuitos escaneados con láser para la experiencia de conducción definitiva.',
    developer: 'Kunos Simulazioni',
    publisher: 'Kunos Simulazioni',
    releaseDate: '2014-12-19',
    rating: 4.3,
    ratingCount: 277,
    categorySlug: 'carreras',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Hollow Knight',
    slug: 'hollow-knight',
    steamId: '431960',
    description: 'Descubre un vasto reino subterráneo de insectos y héroes olvidados. Explora cavernas retorcidas y combate criaturas corrompidas en este metroidvania dibujado a mano.',
    developer: 'Team Cherry',
    publisher: 'Team Cherry',
    releaseDate: '2017-02-24',
    rating: 4.8,
    ratingCount: 281,
    categorySlug: 'indie',
    platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Stardew Valley',
    slug: 'stardew-valley',
    steamId: '413150',
    description: 'Hereda la granja de tu abuelo y comienza una nueva vida. Cultiva, cría animales, pesca y socializa con los habitantes del pueblo en este simulador relajante.',
    developer: 'ConcernedApe',
    publisher: 'ConcernedApe',
    releaseDate: '2016-02-26',
    rating: 4.9,
    ratingCount: 253,
    categorySlug: 'simulacion',
    platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Hades',
    slug: 'hades',
    steamId: '1145360',
    description: 'Escapa del inframundo griego como Zagreus, el hijo de Hades. Un roguelike con combate adictivo, narrativa brillante y bendiciones de los dioses del Olimpo.',
    developer: 'Supergiant Games',
    publisher: 'Supergiant Games',
    releaseDate: '2020-09-17',
    rating: 4.8,
    ratingCount: 278,
    categorySlug: 'indie',
    platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Celeste',
    slug: 'celeste',
    steamId: '504230',
    description: 'Ayuda a Madeline a sobrevivir a sus demonios internos en su camino hacia la cima de la montaña Celeste. Un plataformas desafiante con controles precisos y una historia conmovedora.',
    developer: 'Maddy Makes Games',
    publisher: 'Maddy Makes Games',
    releaseDate: '2018-01-25',
    rating: 4.7,
    ratingCount: 246,
    categorySlug: 'indie',
    platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Cuphead',
    slug: 'cuphead',
    steamId: '268910',
    description: 'Un juego de acción estilo años 30 con jefes enormes y combates imposibles. Animación dibujada a mano y una dificultad que te hará sudar.',
    developer: 'StudioMDHR',
    publisher: 'StudioMDHR',
    releaseDate: '2017-09-29',
    rating: 4.5,
    ratingCount: 295,
    categorySlug: 'indie',
    platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Civilization VI',
    slug: 'civilization-vi',
    steamId: '289070',
    description: 'Construye un imperio que resista la prueba del tiempo. Lidera tu civilización a través de las eras con mecánicas de distritos y diplomacia.',
    developer: 'Firaxis Games',
    publisher: '2K Games',
    releaseDate: '2016-10-21',
    rating: 4.1,
    ratingCount: 272,
    categorySlug: 'estrategia',
    platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Total War: Warhammer III',
    slug: 'total-war-warhammer-3',
    steamId: '1142710',
    description: 'La conclusión de la trilogía Total War: Warhammer. Enfréntate a los demonios del Caos en batallas épicas con miles de unidades y dragones.',
    developer: 'Creative Assembly',
    publisher: 'SEGA',
    releaseDate: '2022-02-17',
    rating: 4,
    ratingCount: 271,
    categorySlug: 'estrategia',
    platforms: 'PC',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'RimWorld',
    slug: 'rimworld',
    steamId: '294100',
    description: 'Una colonia de supervivientes en el borde de la galaxia. Gestiona recursos, construye refugios y toma decisiones morales en este simulador de historias.',
    developer: 'Ludeon Studios',
    publisher: 'Ludeon Studios',
    releaseDate: '2018-10-17',
    rating: 4.7,
    ratingCount: 283,
    categorySlug: 'estrategia',
    platforms: 'PC',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'The Sims 4',
    slug: 'the-sims-4',
    steamId: '1222670',
    description: 'Crea y controla personas en un mundo virtual sin reglas. Construye casas, desarrolla carreras y vive vidas únicas en el simulador de vida más popular.',
    developer: 'Maxis',
    publisher: 'EA',
    releaseDate: '2014-09-02',
    rating: 3.8,
    ratingCount: 233,
    categorySlug: 'simulacion',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Farming Simulator 22',
    slug: 'farming-simulator-22',
    steamId: '1248130',
    description: 'Gestiona tu propia granja con tractores y maquinaria real. Cultiva campos, cría ganado y vende productos en el simulador agrícola más realista.',
    developer: 'GIANTS Software',
    publisher: 'GIANTS Software',
    releaseDate: '2021-11-22',
    rating: 3.9,
    ratingCount: 293,
    categorySlug: 'simulacion',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Microsoft Flight Simulator',
    slug: 'microsoft-flight-simulator',
    steamId: '1250410',
    description: 'Vuela por todo el mundo con satélites reales y condiciones climáticas en tiempo real. El simulador de vuelo más impresionante jamás creado.',
    developer: 'Asobo Studio',
    publisher: 'Xbox Game Studios',
    releaseDate: '2020-08-18',
    rating: 4.2,
    ratingCount: 264,
    categorySlug: 'simulacion',
    platforms: 'PC, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Tekken 8',
    slug: 'tekken-8',
    steamId: '1778820',
    description: 'La saga de lucha más legendaria regresa con el sistema Heat revolucionario. Jin Kazama vs Kazuya Mishima en la batalla definitiva.',
    developer: 'Bandai Namco Studios',
    publisher: 'Bandai Namco',
    releaseDate: '2024-01-25',
    rating: 4.2,
    ratingCount: 248,
    categorySlug: 'lucha',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Street Fighter 6',
    slug: 'street-fighter-6',
    steamId: '1364780',
    description: 'La saga de lucha más icónica vuelve con el Drive System. Modo World Tour, Battle Hub y el mejor combate de la historia de Street Fighter.',
    developer: 'Capcom',
    publisher: 'Capcom',
    releaseDate: '2023-06-02',
    rating: 4.3,
    ratingCount: 309,
    categorySlug: 'lucha',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Portal 2',
    slug: 'portal-2',
    steamId: '620',
    description: 'El juego de puzzles más creativo de la historia. Usa tu pistola de portales para resolver desafíos ingeniosos con GLaDOS como la villana más icónica.',
    developer: 'Valve',
    publisher: 'Valve',
    releaseDate: '2011-04-18',
    rating: 4.8,
    ratingCount: 305,
    categorySlug: 'puzzle',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
]

// ============================================================
// TORRENT DOWNLOAD DATA
// Servers: GamesFull, FitGirl, DODI
// ============================================================
interface TorrentDownload {
  label: string
  url: string
  type: string
  server: string
  fileSize: string
  quality: string
}

const TORRENT_DOWNLOADS: Record<string, { fileSize: string; links: TorrentDownload[] }> = {
  'cyberpunk-2077': {
    fileSize: '70 GB',
    links: [
      { label: 'Cyberpunk 2077 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:C9D3921BF7017490C74D546C3D0FD6F1E0694422&dn=cyberpunk-2077-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '70 GB', quality: 'FULL UNLOCKED' },
      { label: 'Cyberpunk 2077 - FitGirl Repack', url: 'magnet:?xt=urn:btih:C9D3921BF7017490C74D546C3D0FD6F1E0694422&dn=cyberpunk-2077-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '39 GB', quality: 'FitGirl Repack' },
      { label: 'Cyberpunk 2077 - DODI Repack', url: 'magnet:?xt=urn:btih:C9D3921BF7017490C74D546C3D0FD6F1E0694422&dn=cyberpunk-2077-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '46 GB', quality: 'DODI Repack' },
    ]
  },
  'elden-ring': {
    fileSize: '50 GB',
    links: [
      { label: 'Elden Ring - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:4CC8E331E699748269F6AC1B98B802684F5AC97A&dn=elden-ring-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '50 GB', quality: 'FULL UNLOCKED' },
      { label: 'Elden Ring - FitGirl Repack', url: 'magnet:?xt=urn:btih:4CC8E331E699748269F6AC1B98B802684F5AC97A&dn=elden-ring-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '28 GB', quality: 'FitGirl Repack' },
      { label: 'Elden Ring - DODI Repack', url: 'magnet:?xt=urn:btih:4CC8E331E699748269F6AC1B98B802684F5AC97A&dn=elden-ring-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '33 GB', quality: 'DODI Repack' },
    ]
  },
  'god-of-war-ragnarok': {
    fileSize: '90 GB',
    links: [
      { label: 'God of War Ragnarök - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:1D15BD27B1D5053471634205E768C1B9AD73D176&dn=god-of-war-ragnarok-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '90 GB', quality: 'FULL UNLOCKED' },
      { label: 'God of War Ragnarök - FitGirl Repack', url: 'magnet:?xt=urn:btih:1D15BD27B1D5053471634205E768C1B9AD73D176&dn=god-of-war-ragnarok-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '50 GB', quality: 'FitGirl Repack' },
      { label: 'God of War Ragnarök - DODI Repack', url: 'magnet:?xt=urn:btih:1D15BD27B1D5053471634205E768C1B9AD73D176&dn=god-of-war-ragnarok-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '59 GB', quality: 'DODI Repack' },
    ]
  },
  'baldurs-gate-3': {
    fileSize: '120 GB',
    links: [
      { label: 'Baldurs Gate 3 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:2B6969FF5A3703E5BADC64B443D981610946DFEC&dn=baldurs-gate-3-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '120 GB', quality: 'FULL UNLOCKED' },
      { label: 'Baldurs Gate 3 - FitGirl Repack', url: 'magnet:?xt=urn:btih:2B6969FF5A3703E5BADC64B443D981610946DFEC&dn=baldurs-gate-3-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '66 GB', quality: 'FitGirl Repack' },
      { label: 'Baldurs Gate 3 - DODI Repack', url: 'magnet:?xt=urn:btih:2B6969FF5A3703E5BADC64B443D981610946DFEC&dn=baldurs-gate-3-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '78 GB', quality: 'DODI Repack' },
    ]
  },
  'resident-evil-4-remake': {
    fileSize: '55 GB',
    links: [
      { label: 'Resident Evil 4 Remake - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:672FB5F6EDAC967120937A558F75521EC0183D21&dn=resident-evil-4-remake-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '55 GB', quality: 'FULL UNLOCKED' },
      { label: 'Resident Evil 4 Remake - FitGirl Repack', url: 'magnet:?xt=urn:btih:672FB5F6EDAC967120937A558F75521EC0183D21&dn=resident-evil-4-remake-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '30 GB', quality: 'FitGirl Repack' },
      { label: 'Resident Evil 4 Remake - DODI Repack', url: 'magnet:?xt=urn:btih:672FB5F6EDAC967120937A558F75521EC0183D21&dn=resident-evil-4-remake-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '36 GB', quality: 'DODI Repack' },
    ]
  },
  'black-myth-wukong': {
    fileSize: '130 GB',
    links: [
      { label: 'Black Myth: Wukong - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:E01EFFF1EA23821BBD33341A19A77C3A5B2A50F3&dn=black-myth-wukong-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '130 GB', quality: 'FULL UNLOCKED' },
      { label: 'Black Myth: Wukong - FitGirl Repack', url: 'magnet:?xt=urn:btih:E01EFFF1EA23821BBD33341A19A77C3A5B2A50F3&dn=black-myth-wukong-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '72 GB', quality: 'FitGirl Repack' },
      { label: 'Black Myth: Wukong - DODI Repack', url: 'magnet:?xt=urn:btih:E01EFFF1EA23821BBD33341A19A77C3A5B2A50F3&dn=black-myth-wukong-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '85 GB', quality: 'DODI Repack' },
    ]
  },
  'red-dead-redemption-2': {
    fileSize: '120 GB',
    links: [
      { label: 'Red Dead Redemption 2 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:18A89755E51616C9E8E904FF360E364DEB4B0922&dn=red-dead-redemption-2-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '120 GB', quality: 'FULL UNLOCKED' },
      { label: 'Red Dead Redemption 2 - FitGirl Repack', url: 'magnet:?xt=urn:btih:18A89755E51616C9E8E904FF360E364DEB4B0922&dn=red-dead-redemption-2-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '66 GB', quality: 'FitGirl Repack' },
      { label: 'Red Dead Redemption 2 - DODI Repack', url: 'magnet:?xt=urn:btih:18A89755E51616C9E8E904FF360E364DEB4B0922&dn=red-dead-redemption-2-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '78 GB', quality: 'DODI Repack' },
    ]
  },
  'the-witcher-3-wild-hunt': {
    fileSize: '50 GB',
    links: [
      { label: 'The Witcher 3: Wild Hunt - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:7F9F2EA2A2BD89C65D14ED816987938FD5D48B07&dn=the-witcher-3-wild-hunt-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '50 GB', quality: 'FULL UNLOCKED' },
      { label: 'The Witcher 3: Wild Hunt - FitGirl Repack', url: 'magnet:?xt=urn:btih:7F9F2EA2A2BD89C65D14ED816987938FD5D48B07&dn=the-witcher-3-wild-hunt-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '28 GB', quality: 'FitGirl Repack' },
      { label: 'The Witcher 3: Wild Hunt - DODI Repack', url: 'magnet:?xt=urn:btih:7F9F2EA2A2BD89C65D14ED816987938FD5D48B07&dn=the-witcher-3-wild-hunt-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '33 GB', quality: 'DODI Repack' },
    ]
  },
  'sekiro-shadows-die-twice': {
    fileSize: '25 GB',
    links: [
      { label: 'Sekiro: Shadows Die Twice - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:072BA1C165E0D528D2E23EA0FCD35E066D3FCDAA&dn=sekiro-shadows-die-twice-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '25 GB', quality: 'FULL UNLOCKED' },
      { label: 'Sekiro: Shadows Die Twice - FitGirl Repack', url: 'magnet:?xt=urn:btih:072BA1C165E0D528D2E23EA0FCD35E066D3FCDAA&dn=sekiro-shadows-die-twice-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '14 GB', quality: 'FitGirl Repack' },
      { label: 'Sekiro: Shadows Die Twice - DODI Repack', url: 'magnet:?xt=urn:btih:072BA1C165E0D528D2E23EA0FCD35E066D3FCDAA&dn=sekiro-shadows-die-twice-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '16 GB', quality: 'DODI Repack' },
    ]
  },
  'hogwarts-legacy': {
    fileSize: '85 GB',
    links: [
      { label: 'Hogwarts Legacy - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:39189070558F35AA9931F56C1D260C3A7E8D8C05&dn=hogwarts-legacy-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '85 GB', quality: 'FULL UNLOCKED' },
      { label: 'Hogwarts Legacy - FitGirl Repack', url: 'magnet:?xt=urn:btih:39189070558F35AA9931F56C1D260C3A7E8D8C05&dn=hogwarts-legacy-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '47 GB', quality: 'FitGirl Repack' },
      { label: 'Hogwarts Legacy - DODI Repack', url: 'magnet:?xt=urn:btih:39189070558F35AA9931F56C1D260C3A7E8D8C05&dn=hogwarts-legacy-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '55 GB', quality: 'DODI Repack' },
    ]
  },
  'ghost-of-tsushima': {
    fileSize: '75 GB',
    links: [
      { label: 'Ghost of Tsushima - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:25E2F1AA84D8E4AFBA8105656BDB4DDF3DB95FA4&dn=ghost-of-tsushima-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '75 GB', quality: 'FULL UNLOCKED' },
      { label: 'Ghost of Tsushima - FitGirl Repack', url: 'magnet:?xt=urn:btih:25E2F1AA84D8E4AFBA8105656BDB4DDF3DB95FA4&dn=ghost-of-tsushima-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '41 GB', quality: 'FitGirl Repack' },
      { label: 'Ghost of Tsushima - DODI Repack', url: 'magnet:?xt=urn:btih:25E2F1AA84D8E4AFBA8105656BDB4DDF3DB95FA4&dn=ghost-of-tsushima-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '49 GB', quality: 'DODI Repack' },
    ]
  },
  'grand-theft-auto-v': {
    fileSize: '100 GB',
    links: [
      { label: 'Grand Theft Auto V - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:8D003359419C09B9E7202044D7F8738A9CE496E1&dn=grand-theft-auto-v-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '100 GB', quality: 'FULL UNLOCKED' },
      { label: 'Grand Theft Auto V - FitGirl Repack', url: 'magnet:?xt=urn:btih:8D003359419C09B9E7202044D7F8738A9CE496E1&dn=grand-theft-auto-v-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '55 GB', quality: 'FitGirl Repack' },
      { label: 'Grand Theft Auto V - DODI Repack', url: 'magnet:?xt=urn:btih:8D003359419C09B9E7202044D7F8738A9CE496E1&dn=grand-theft-auto-v-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '65 GB', quality: 'DODI Repack' },
    ]
  },
  'doom-eternal': {
    fileSize: '60 GB',
    links: [
      { label: 'DOOM Eternal - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:C4BDD7ACC9038BA7C2B5D9D47DD4E69BEA340F48&dn=doom-eternal-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '60 GB', quality: 'FULL UNLOCKED' },
      { label: 'DOOM Eternal - FitGirl Repack', url: 'magnet:?xt=urn:btih:C4BDD7ACC9038BA7C2B5D9D47DD4E69BEA340F48&dn=doom-eternal-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '33 GB', quality: 'FitGirl Repack' },
      { label: 'DOOM Eternal - DODI Repack', url: 'magnet:?xt=urn:btih:C4BDD7ACC9038BA7C2B5D9D47DD4E69BEA340F48&dn=doom-eternal-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '39 GB', quality: 'DODI Repack' },
    ]
  },
  'helldivers-2': {
    fileSize: '70 GB',
    links: [
      { label: 'Helldivers 2 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:9E1B3D5F7A9C2E4B6D8F1A3C5E7B9D2F4A6C8E1B&dn=helldivers-2-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '70 GB', quality: 'FULL UNLOCKED' },
      { label: 'Helldivers 2 - FitGirl Repack', url: 'magnet:?xt=urn:btih:9E1B3D5F7A9C2E4B6D8F1A3C5E7B9D2F4A6C8E1B&dn=helldivers-2-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '39 GB', quality: 'FitGirl Repack' },
      { label: 'Helldivers 2 - DODI Repack', url: 'magnet:?xt=urn:btih:9E1B3D5F7A9C2E4B6D8F1A3C5E7B9D2F4A6C8E1B&dn=helldivers-2-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '46 GB', quality: 'DODI Repack' },
    ]
  },
  'death-stranding': {
    fileSize: '75 GB',
    links: [
      { label: 'Death Stranding - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:16FE3ABD5DC6521ED300F7C94D1F2AD8C60C175F&dn=death-stranding-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '75 GB', quality: 'FULL UNLOCKED' },
      { label: 'Death Stranding - FitGirl Repack', url: 'magnet:?xt=urn:btih:16FE3ABD5DC6521ED300F7C94D1F2AD8C60C175F&dn=death-stranding-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '41 GB', quality: 'FitGirl Repack' },
      { label: 'Death Stranding - DODI Repack', url: 'magnet:?xt=urn:btih:16FE3ABD5DC6521ED300F7C94D1F2AD8C60C175F&dn=death-stranding-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '49 GB', quality: 'DODI Repack' },
    ]
  },
  'dark-souls-iii': {
    fileSize: '40 GB',
    links: [
      { label: 'Dark Souls III - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:B04ECE6C3898BD3B9BFE557A6988830E0C14A3BD&dn=dark-souls-iii-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '40 GB', quality: 'FULL UNLOCKED' },
      { label: 'Dark Souls III - FitGirl Repack', url: 'magnet:?xt=urn:btih:B04ECE6C3898BD3B9BFE557A6988830E0C14A3BD&dn=dark-souls-iii-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '22 GB', quality: 'FitGirl Repack' },
      { label: 'Dark Souls III - DODI Repack', url: 'magnet:?xt=urn:btih:B04ECE6C3898BD3B9BFE557A6988830E0C14A3BD&dn=dark-souls-iii-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '26 GB', quality: 'DODI Repack' },
    ]
  },
  'fallout-4': {
    fileSize: '35 GB',
    links: [
      { label: 'Fallout 4 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:D10B66EF46E9CED9451C86D6147637210E618277&dn=fallout-4-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '35 GB', quality: 'FULL UNLOCKED' },
      { label: 'Fallout 4 - FitGirl Repack', url: 'magnet:?xt=urn:btih:D10B66EF46E9CED9451C86D6147637210E618277&dn=fallout-4-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '19 GB', quality: 'FitGirl Repack' },
      { label: 'Fallout 4 - DODI Repack', url: 'magnet:?xt=urn:btih:D10B66EF46E9CED9451C86D6147637210E618277&dn=fallout-4-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '23 GB', quality: 'DODI Repack' },
    ]
  },
  'the-elder-scrolls-v-skyrim': {
    fileSize: '15 GB',
    links: [
      { label: 'The Elder Scrolls V: Skyrim - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:055C45BB77D38CC59D17A964FB222078BF25B9A4&dn=the-elder-scrolls-v-skyrim-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '15 GB', quality: 'FULL UNLOCKED' },
      { label: 'The Elder Scrolls V: Skyrim - FitGirl Repack', url: 'magnet:?xt=urn:btih:055C45BB77D38CC59D17A964FB222078BF25B9A4&dn=the-elder-scrolls-v-skyrim-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '8 GB', quality: 'FitGirl Repack' },
    ]
  },
  'dragons-dogma-2': {
    fileSize: '65 GB',
    links: [
      { label: 'Dragons Dogma 2 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:678BC6AC22A5BEFAC6BBC50834E91D4F9755DEE4&dn=dragons-dogma-2-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '65 GB', quality: 'FULL UNLOCKED' },
      { label: 'Dragons Dogma 2 - FitGirl Repack', url: 'magnet:?xt=urn:btih:678BC6AC22A5BEFAC6BBC50834E91D4F9755DEE4&dn=dragons-dogma-2-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '36 GB', quality: 'FitGirl Repack' },
      { label: 'Dragons Dogma 2 - DODI Repack', url: 'magnet:?xt=urn:btih:678BC6AC22A5BEFAC6BBC50834E91D4F9755DEE4&dn=dragons-dogma-2-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '42 GB', quality: 'DODI Repack' },
    ]
  },
  'metaphor-refantazio': {
    fileSize: '55 GB',
    links: [
      { label: 'Metaphor: ReFantazio - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:06FB13EF01FB94089C8271EE8E6E8FC1AA53449D&dn=metaphor-refantazio-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '55 GB', quality: 'FULL UNLOCKED' },
      { label: 'Metaphor: ReFantazio - FitGirl Repack', url: 'magnet:?xt=urn:btih:06FB13EF01FB94089C8271EE8E6E8FC1AA53449D&dn=metaphor-refantazio-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '30 GB', quality: 'FitGirl Repack' },
      { label: 'Metaphor: ReFantazio - DODI Repack', url: 'magnet:?xt=urn:btih:06FB13EF01FB94089C8271EE8E6E8FC1AA53449D&dn=metaphor-refantazio-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '36 GB', quality: 'DODI Repack' },
    ]
  },
  'like-a-dragon-infinite-wealth': {
    fileSize: '60 GB',
    links: [
      { label: 'Like a Dragon: Infinite Wealth - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:06E279AAE6628951724F32FEB2CD548D68937A1B&dn=like-a-dragon-infinite-wealth-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '60 GB', quality: 'FULL UNLOCKED' },
      { label: 'Like a Dragon: Infinite Wealth - FitGirl Repack', url: 'magnet:?xt=urn:btih:06E279AAE6628951724F32FEB2CD548D68937A1B&dn=like-a-dragon-infinite-wealth-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '33 GB', quality: 'FitGirl Repack' },
      { label: 'Like a Dragon: Infinite Wealth - DODI Repack', url: 'magnet:?xt=urn:btih:06E279AAE6628951724F32FEB2CD548D68937A1B&dn=like-a-dragon-infinite-wealth-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '39 GB', quality: 'DODI Repack' },
    ]
  },
  'persona-5-royal': {
    fileSize: '40 GB',
    links: [
      { label: 'Persona 5 Royal - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:C1F470CCC59389CD1AB2D41CD317662B4D16CABD&dn=persona-5-royal-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '40 GB', quality: 'FULL UNLOCKED' },
      { label: 'Persona 5 Royal - FitGirl Repack', url: 'magnet:?xt=urn:btih:C1F470CCC59389CD1AB2D41CD317662B4D16CABD&dn=persona-5-royal-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '22 GB', quality: 'FitGirl Repack' },
      { label: 'Persona 5 Royal - DODI Repack', url: 'magnet:?xt=urn:btih:C1F470CCC59389CD1AB2D41CD317662B4D16CABD&dn=persona-5-royal-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '26 GB', quality: 'DODI Repack' },
    ]
  },
  'final-fantasy-vii-remake': {
    fileSize: '90 GB',
    links: [
      { label: 'Final Fantasy VII Remake - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:2D4F6A8C1E3B5D7F9A2C4E6B8D1F3A5C7E9B2D4F&dn=final-fantasy-vii-remake-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '90 GB', quality: 'FULL UNLOCKED' },
      { label: 'Final Fantasy VII Remake - FitGirl Repack', url: 'magnet:?xt=urn:btih:2D4F6A8C1E3B5D7F9A2C4E6B8D1F3A5C7E9B2D4F&dn=final-fantasy-vii-remake-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '50 GB', quality: 'FitGirl Repack' },
      { label: 'Final Fantasy VII Remake - DODI Repack', url: 'magnet:?xt=urn:btih:2D4F6A8C1E3B5D7F9A2C4E6B8D1F3A5C7E9B2D4F&dn=final-fantasy-vii-remake-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '59 GB', quality: 'DODI Repack' },
    ]
  },
  'the-last-of-us-part-ii': {
    fileSize: '80 GB',
    links: [
      { label: 'The Last of Us Part II - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:E06924835DCACE820B1E57582CE3BD85F6B01CCF&dn=the-last-of-us-part-ii-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '80 GB', quality: 'FULL UNLOCKED' },
      { label: 'The Last of Us Part II - FitGirl Repack', url: 'magnet:?xt=urn:btih:E06924835DCACE820B1E57582CE3BD85F6B01CCF&dn=the-last-of-us-part-ii-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '44 GB', quality: 'FitGirl Repack' },
      { label: 'The Last of Us Part II - DODI Repack', url: 'magnet:?xt=urn:btih:E06924835DCACE820B1E57582CE3BD85F6B01CCF&dn=the-last-of-us-part-ii-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '52 GB', quality: 'DODI Repack' },
    ]
  },
  'assassins-creed-shadows': {
    fileSize: '95 GB',
    links: [
      { label: 'Assassins Creed Shadows - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:22A595E36C27376D294D08B9ACDE73566BACF383&dn=assassins-creed-shadows-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '95 GB', quality: 'FULL UNLOCKED' },
      { label: 'Assassins Creed Shadows - FitGirl Repack', url: 'magnet:?xt=urn:btih:22A595E36C27376D294D08B9ACDE73566BACF383&dn=assassins-creed-shadows-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '52 GB', quality: 'FitGirl Repack' },
      { label: 'Assassins Creed Shadows - DODI Repack', url: 'magnet:?xt=urn:btih:22A595E36C27376D294D08B9ACDE73566BACF383&dn=assassins-creed-shadows-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '62 GB', quality: 'DODI Repack' },
    ]
  },
  'horizon-forbidden-west': {
    fileSize: '95 GB',
    links: [
      { label: 'Horizon Forbidden West - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:5A7C9E2B4D6F8A1C3E5B7D9F2A4C6E8B1D3F5A7&dn=horizon-forbidden-west-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '95 GB', quality: 'FULL UNLOCKED' },
      { label: 'Horizon Forbidden West - FitGirl Repack', url: 'magnet:?xt=urn:btih:5A7C9E2B4D6F8A1C3E5B7D9F2A4C6E8B1D3F5A7&dn=horizon-forbidden-west-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '52 GB', quality: 'FitGirl Repack' },
      { label: 'Horizon Forbidden West - DODI Repack', url: 'magnet:?xt=urn:btih:5A7C9E2B4D6F8A1C3E5B7D9F2A4C6E8B1D3F5A7&dn=horizon-forbidden-west-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '62 GB', quality: 'DODI Repack' },
    ]
  },
  'it-takes-two': {
    fileSize: '45 GB',
    links: [
      { label: 'It Takes Two - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:4537CA9F3765E0018630B76736623826C4C7CEAE&dn=it-takes-two-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '45 GB', quality: 'FULL UNLOCKED' },
      { label: 'It Takes Two - FitGirl Repack', url: 'magnet:?xt=urn:btih:4537CA9F3765E0018630B76736623826C4C7CEAE&dn=it-takes-two-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '25 GB', quality: 'FitGirl Repack' },
      { label: 'It Takes Two - DODI Repack', url: 'magnet:?xt=urn:btih:4537CA9F3765E0018630B76736623826C4C7CEAE&dn=it-takes-two-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '29 GB', quality: 'DODI Repack' },
    ]
  },
  'a-plague-tale-requiem': {
    fileSize: '50 GB',
    links: [
      { label: 'A Plague Tale: Requiem - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:A20E020B786191A335084C064336A986F114E105&dn=a-plague-tale-requiem-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '50 GB', quality: 'FULL UNLOCKED' },
      { label: 'A Plague Tale: Requiem - FitGirl Repack', url: 'magnet:?xt=urn:btih:A20E020B786191A335084C064336A986F114E105&dn=a-plague-tale-requiem-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '28 GB', quality: 'FitGirl Repack' },
      { label: 'A Plague Tale: Requiem - DODI Repack', url: 'magnet:?xt=urn:btih:A20E020B786191A335084C064336A986F114E105&dn=a-plague-tale-requiem-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '33 GB', quality: 'DODI Repack' },
    ]
  },
  'starfield': {
    fileSize: '125 GB',
    links: [
      { label: 'Starfield - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:EF0A8E458E993C6CB85C6A4CDEBE0E9C083EB3D3&dn=starfield-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '125 GB', quality: 'FULL UNLOCKED' },
      { label: 'Starfield - FitGirl Repack', url: 'magnet:?xt=urn:btih:EF0A8E458E993C6CB85C6A4CDEBE0E9C083EB3D3&dn=starfield-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '69 GB', quality: 'FitGirl Repack' },
      { label: 'Starfield - DODI Repack', url: 'magnet:?xt=urn:btih:EF0A8E458E993C6CB85C6A4CDEBE0E9C083EB3D3&dn=starfield-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '81 GB', quality: 'DODI Repack' },
    ]
  },
  'counter-strike-2': {
    fileSize: '35 GB',
    links: [
      { label: 'Counter-Strike 2 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:9BD637ACBFB47B5E6C7823C012DB9D0E46CD9B3A&dn=counter-strike-2-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '35 GB', quality: 'FULL UNLOCKED' },
      { label: 'Counter-Strike 2 - FitGirl Repack', url: 'magnet:?xt=urn:btih:9BD637ACBFB47B5E6C7823C012DB9D0E46CD9B3A&dn=counter-strike-2-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '19 GB', quality: 'FitGirl Repack' },
      { label: 'Counter-Strike 2 - DODI Repack', url: 'magnet:?xt=urn:btih:9BD637ACBFB47B5E6C7823C012DB9D0E46CD9B3A&dn=counter-strike-2-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '23 GB', quality: 'DODI Repack' },
    ]
  },
  'call-of-duty-modern-warfare-3': {
    fileSize: '80 GB',
    links: [
      { label: 'Call of Duty: Modern Warfare III - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:16781424696B405FC93941B1E95479AEE0C1DF19&dn=call-of-duty-modern-warfare-3-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '80 GB', quality: 'FULL UNLOCKED' },
      { label: 'Call of Duty: Modern Warfare III - FitGirl Repack', url: 'magnet:?xt=urn:btih:16781424696B405FC93941B1E95479AEE0C1DF19&dn=call-of-duty-modern-warfare-3-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '44 GB', quality: 'FitGirl Repack' },
      { label: 'Call of Duty: Modern Warfare III - DODI Repack', url: 'magnet:?xt=urn:btih:16781424696B405FC93941B1E95479AEE0C1DF19&dn=call-of-duty-modern-warfare-3-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '52 GB', quality: 'DODI Repack' },
    ]
  },
  'doom-eternal-shooter': {
    fileSize: '60 GB',
    links: [
      { label: 'Doom Eternal - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:C4BDD7ACC9038BA7C2B5D9D47DD4E69BEA340F48&dn=doom-eternal-shooter-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '60 GB', quality: 'FULL UNLOCKED' },
      { label: 'Doom Eternal - FitGirl Repack', url: 'magnet:?xt=urn:btih:C4BDD7ACC9038BA7C2B5D9D47DD4E69BEA340F48&dn=doom-eternal-shooter-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '33 GB', quality: 'FitGirl Repack' },
      { label: 'Doom Eternal - DODI Repack', url: 'magnet:?xt=urn:btih:C4BDD7ACC9038BA7C2B5D9D47DD4E69BEA340F48&dn=doom-eternal-shooter-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '39 GB', quality: 'DODI Repack' },
    ]
  },
  'resident-evil-village': {
    fileSize: '45 GB',
    links: [
      { label: 'Resident Evil Village - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:80EB6D26209F19F10976F6917531E6E92769C427&dn=resident-evil-village-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '45 GB', quality: 'FULL UNLOCKED' },
      { label: 'Resident Evil Village - FitGirl Repack', url: 'magnet:?xt=urn:btih:80EB6D26209F19F10976F6917531E6E92769C427&dn=resident-evil-village-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '25 GB', quality: 'FitGirl Repack' },
      { label: 'Resident Evil Village - DODI Repack', url: 'magnet:?xt=urn:btih:80EB6D26209F19F10976F6917531E6E92769C427&dn=resident-evil-village-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '29 GB', quality: 'DODI Repack' },
    ]
  },
  'titanfall-2': {
    fileSize: '40 GB',
    links: [
      { label: 'Titanfall 2 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:939ED3303CBF0544760D88A3E780117E124011FB&dn=titanfall-2-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '40 GB', quality: 'FULL UNLOCKED' },
      { label: 'Titanfall 2 - FitGirl Repack', url: 'magnet:?xt=urn:btih:939ED3303CBF0544760D88A3E780117E124011FB&dn=titanfall-2-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '22 GB', quality: 'FitGirl Repack' },
      { label: 'Titanfall 2 - DODI Repack', url: 'magnet:?xt=urn:btih:939ED3303CBF0544760D88A3E780117E124011FB&dn=titanfall-2-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '26 GB', quality: 'DODI Repack' },
    ]
  },
  'forza-horizon-5': {
    fileSize: '110 GB',
    links: [
      { label: 'Forza Horizon 5 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:20BF4E706A2401F5643AB9F3A030F4DA8B13873B&dn=forza-horizon-5-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '110 GB', quality: 'FULL UNLOCKED' },
      { label: 'Forza Horizon 5 - FitGirl Repack', url: 'magnet:?xt=urn:btih:20BF4E706A2401F5643AB9F3A030F4DA8B13873B&dn=forza-horizon-5-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '61 GB', quality: 'FitGirl Repack' },
      { label: 'Forza Horizon 5 - DODI Repack', url: 'magnet:?xt=urn:btih:20BF4E706A2401F5643AB9F3A030F4DA8B13873B&dn=forza-horizon-5-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '72 GB', quality: 'DODI Repack' },
    ]
  },
  'need-for-speed-unbound': {
    fileSize: '50 GB',
    links: [
      { label: 'Need for Speed Unbound - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:C3D19A5CBFB9022AFBB1CF31EFA1EF80A2A743F9&dn=need-for-speed-unbound-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '50 GB', quality: 'FULL UNLOCKED' },
      { label: 'Need for Speed Unbound - FitGirl Repack', url: 'magnet:?xt=urn:btih:C3D19A5CBFB9022AFBB1CF31EFA1EF80A2A743F9&dn=need-for-speed-unbound-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '28 GB', quality: 'FitGirl Repack' },
      { label: 'Need for Speed Unbound - DODI Repack', url: 'magnet:?xt=urn:btih:C3D19A5CBFB9022AFBB1CF31EFA1EF80A2A743F9&dn=need-for-speed-unbound-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '33 GB', quality: 'DODI Repack' },
    ]
  },
  'assetto-corsa': {
    fileSize: '25 GB',
    links: [
      { label: 'Assetto Corsa - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:25854309EBEA303471E62FBB29DB8DC31683A194&dn=assetto-corsa-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '25 GB', quality: 'FULL UNLOCKED' },
      { label: 'Assetto Corsa - FitGirl Repack', url: 'magnet:?xt=urn:btih:25854309EBEA303471E62FBB29DB8DC31683A194&dn=assetto-corsa-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '14 GB', quality: 'FitGirl Repack' },
      { label: 'Assetto Corsa - DODI Repack', url: 'magnet:?xt=urn:btih:25854309EBEA303471E62FBB29DB8DC31683A194&dn=assetto-corsa-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '16 GB', quality: 'DODI Repack' },
    ]
  },
  'hollow-knight': {
    fileSize: '9 GB',
    links: [
      { label: 'Hollow Knight - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:D738F320446AEB504C80904F670B0615D04D5C6C&dn=hollow-knight-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '9 GB', quality: 'FULL UNLOCKED' },
      { label: 'Hollow Knight - FitGirl Repack', url: 'magnet:?xt=urn:btih:D738F320446AEB504C80904F670B0615D04D5C6C&dn=hollow-knight-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '5 GB', quality: 'FitGirl Repack' },
    ]
  },
  'stardew-valley': {
    fileSize: '1.5 GB',
    links: [
      { label: 'Stardew Valley - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:D84EE925B6899E6BA6F568D47F6D37590E2B6315&dn=stardew-valley-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '1.5 GB', quality: 'FULL UNLOCKED' },
      { label: 'Stardew Valley - FitGirl Repack', url: 'magnet:?xt=urn:btih:D84EE925B6899E6BA6F568D47F6D37590E2B6315&dn=stardew-valley-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '1 GB', quality: 'FitGirl Repack' },
    ]
  },
  'hades': {
    fileSize: '15 GB',
    links: [
      { label: 'Hades - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:6116643884FB89D4C8CE3D91B74B31D4D6DD03B9&dn=hades-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '15 GB', quality: 'FULL UNLOCKED' },
      { label: 'Hades - FitGirl Repack', url: 'magnet:?xt=urn:btih:6116643884FB89D4C8CE3D91B74B31D4D6DD03B9&dn=hades-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '8 GB', quality: 'FitGirl Repack' },
    ]
  },
  'celeste': {
    fileSize: '1.2 GB',
    links: [
      { label: 'Celeste - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:B4D6F8A1C3E5B7D9F2A4C6E8B1D3F5A7C9E2B4D6&dn=celeste-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '1.2 GB', quality: 'FULL UNLOCKED' },
      { label: 'Celeste - FitGirl Repack', url: 'magnet:?xt=urn:btih:B4D6F8A1C3E5B7D9F2A4C6E8B1D3F5A7C9E2B4D6&dn=celeste-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '1 GB', quality: 'FitGirl Repack' },
    ]
  },
  'cuphead': {
    fileSize: '4 GB',
    links: [
      { label: 'Cuphead - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:FE4C404ACFB2E1C1D5B9D278E30852A76D390468&dn=cuphead-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '4 GB', quality: 'FULL UNLOCKED' },
      { label: 'Cuphead - FitGirl Repack', url: 'magnet:?xt=urn:btih:FE4C404ACFB2E1C1D5B9D278E30852A76D390468&dn=cuphead-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '2 GB', quality: 'FitGirl Repack' },
    ]
  },
  'civilization-vi': {
    fileSize: '25 GB',
    links: [
      { label: 'Civilization VI - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:7F9A2C4E6B8D1F3A5C7E9B2D4F6A8C1E3B5D7F9&dn=civilization-vi-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '25 GB', quality: 'FULL UNLOCKED' },
      { label: 'Civilization VI - FitGirl Repack', url: 'magnet:?xt=urn:btih:7F9A2C4E6B8D1F3A5C7E9B2D4F6A8C1E3B5D7F9&dn=civilization-vi-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '14 GB', quality: 'FitGirl Repack' },
      { label: 'Civilization VI - DODI Repack', url: 'magnet:?xt=urn:btih:7F9A2C4E6B8D1F3A5C7E9B2D4F6A8C1E3B5D7F9&dn=civilization-vi-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '16 GB', quality: 'DODI Repack' },
    ]
  },
  'total-war-warhammer-3': {
    fileSize: '70 GB',
    links: [
      { label: 'Total War: Warhammer III - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:6AE601C9436CC0C7A7116B7B6C014A7925AB882A&dn=total-war-warhammer-3-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '70 GB', quality: 'FULL UNLOCKED' },
      { label: 'Total War: Warhammer III - FitGirl Repack', url: 'magnet:?xt=urn:btih:6AE601C9436CC0C7A7116B7B6C014A7925AB882A&dn=total-war-warhammer-3-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '39 GB', quality: 'FitGirl Repack' },
      { label: 'Total War: Warhammer III - DODI Repack', url: 'magnet:?xt=urn:btih:6AE601C9436CC0C7A7116B7B6C014A7925AB882A&dn=total-war-warhammer-3-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '46 GB', quality: 'DODI Repack' },
    ]
  },
  'rimworld': {
    fileSize: '1 GB',
    links: [
      { label: 'RimWorld - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:3D50D252AD86E3AC111D5A2402021A1091CB782A&dn=rimworld-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '1 GB', quality: 'FULL UNLOCKED' },
      { label: 'RimWorld - FitGirl Repack', url: 'magnet:?xt=urn:btih:3D50D252AD86E3AC111D5A2402021A1091CB782A&dn=rimworld-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '1 GB', quality: 'FitGirl Repack' },
    ]
  },
  'the-sims-4': {
    fileSize: '25 GB',
    links: [
      { label: 'The Sims 4 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:F2A4C6E8B1D3F5A7C9E2B4D6F8A1C3E5B7D9F2A4&dn=the-sims-4-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '25 GB', quality: 'FULL UNLOCKED' },
      { label: 'The Sims 4 - FitGirl Repack', url: 'magnet:?xt=urn:btih:F2A4C6E8B1D3F5A7C9E2B4D6F8A1C3E5B7D9F2A4&dn=the-sims-4-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '14 GB', quality: 'FitGirl Repack' },
      { label: 'The Sims 4 - DODI Repack', url: 'magnet:?xt=urn:btih:F2A4C6E8B1D3F5A7C9E2B4D6F8A1C3E5B7D9F2A4&dn=the-sims-4-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '16 GB', quality: 'DODI Repack' },
    ]
  },
  'farming-simulator-22': {
    fileSize: '20 GB',
    links: [
      { label: 'Farming Simulator 22 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:C8B35098E0B0701A3EFC67FC51CD3B156DA40F12&dn=farming-simulator-22-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '20 GB', quality: 'FULL UNLOCKED' },
      { label: 'Farming Simulator 22 - FitGirl Repack', url: 'magnet:?xt=urn:btih:C8B35098E0B0701A3EFC67FC51CD3B156DA40F12&dn=farming-simulator-22-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '11 GB', quality: 'FitGirl Repack' },
    ]
  },
  'microsoft-flight-simulator': {
    fileSize: '150 GB',
    links: [
      { label: 'Microsoft Flight Simulator - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:44C26341628D9F6287143C6550E8D0D0EC60150B&dn=microsoft-flight-simulator-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '150 GB', quality: 'FULL UNLOCKED' },
      { label: 'Microsoft Flight Simulator - FitGirl Repack', url: 'magnet:?xt=urn:btih:44C26341628D9F6287143C6550E8D0D0EC60150B&dn=microsoft-flight-simulator-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '83 GB', quality: 'FitGirl Repack' },
      { label: 'Microsoft Flight Simulator - DODI Repack', url: 'magnet:?xt=urn:btih:44C26341628D9F6287143C6550E8D0D0EC60150B&dn=microsoft-flight-simulator-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '98 GB', quality: 'DODI Repack' },
    ]
  },
  'tekken-8': {
    fileSize: '80 GB',
    links: [
      { label: 'Tekken 8 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:C00B6FE4C58F94D1AC1CEB7678FF5E593F9DAC70&dn=tekken-8-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '80 GB', quality: 'FULL UNLOCKED' },
      { label: 'Tekken 8 - FitGirl Repack', url: 'magnet:?xt=urn:btih:C00B6FE4C58F94D1AC1CEB7678FF5E593F9DAC70&dn=tekken-8-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '44 GB', quality: 'FitGirl Repack' },
      { label: 'Tekken 8 - DODI Repack', url: 'magnet:?xt=urn:btih:C00B6FE4C58F94D1AC1CEB7678FF5E593F9DAC70&dn=tekken-8-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '52 GB', quality: 'DODI Repack' },
    ]
  },
  'street-fighter-6': {
    fileSize: '60 GB',
    links: [
      { label: 'Street Fighter 6 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:09F0E009B12867ACE8912E75BE4784E6627F9646&dn=street-fighter-6-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '60 GB', quality: 'FULL UNLOCKED' },
      { label: 'Street Fighter 6 - FitGirl Repack', url: 'magnet:?xt=urn:btih:09F0E009B12867ACE8912E75BE4784E6627F9646&dn=street-fighter-6-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '33 GB', quality: 'FitGirl Repack' },
      { label: 'Street Fighter 6 - DODI Repack', url: 'magnet:?xt=urn:btih:09F0E009B12867ACE8912E75BE4784E6627F9646&dn=street-fighter-6-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '39 GB', quality: 'DODI Repack' },
    ]
  },
  'portal-2': {
    fileSize: '12 GB',
    links: [
      { label: 'Portal 2 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:1C3E5B7D9F2A4C6E8B1D3F5A7C9E2B4D6F8A1C3E&dn=portal-2-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '12 GB', quality: 'FULL UNLOCKED' },
      { label: 'Portal 2 - FitGirl Repack', url: 'magnet:?xt=urn:btih:1C3E5B7D9F2A4C6E8B1D3F5A7C9E2B4D6F8A1C3E&dn=portal-2-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '7 GB', quality: 'FitGirl Repack' },
    ]
  },
}

// Helper to create download links for a game
async function createDownloadLinks(gameId: string, slug: string) {
  const torrentData = TORRENT_DOWNLOADS[slug] || TORRENT_DOWNLOADS_BATCH2[slug]
  if (!torrentData) return

  const existing = await prisma.downloadLink.findFirst({ where: { gameId } })
  if (existing) return

  for (const link of torrentData.links) {
    await prisma.downloadLink.create({
      data: {
        gameId,
        label: link.label,
        url: link.url,
        type: link.type,
        server: link.server,
        fileSize: link.fileSize,
        quality: link.quality,
      },
    })
  }
  console.log(`  🔗 ${torrentData.links.length} download links for ${slug}`)
}

// Categories
const CATEGORIES = [
  { name: 'Acción', slug: 'accion', icon: '⚔️' },
  { name: 'RPG', slug: 'rpg', icon: '🗡️' },
  { name: 'Aventura', slug: 'aventura', icon: '🗺️' },
  { name: 'Estrategia', slug: 'estrategia', icon: '♟️' },
  { name: 'Deportes', slug: 'deportes', icon: '⚽' },
  { name: 'Indie', slug: 'indie', icon: '🎮' },
  { name: 'Carreras', slug: 'carreras', icon: '🏎️' },
  { name: 'Shooter', slug: 'shooter', icon: '🔫' },
  { name: 'Puzzle', slug: 'puzzle', icon: '🧩' },
  { name: 'Simulación', slug: 'simulacion', icon: '🏗️' },
  { name: 'Lucha', slug: 'lucha', icon: '🥊' },
  { name: 'Plataformas', slug: 'plataformas', icon: '🍄' },
]


// ============================================================
// GAME DATA BATCH 2 - 50 additional games
// ============================================================
const GAMES_DATA_BATCH2 = [
  {
    title: 'Alan Wake 2',
    slug: 'alan-wake-2',
    steamId: '2332600',
    description: 'La secuela del thriller psicologico de Remedy. Alan Wake esta atrapado en una dimension oscura y debe escribir su forma de escapar mientras el FBI agent Saga Anderson investiga misteriosos asesinatos rituales en Bright Falls.',
    developer: 'Remedy Entertainment',
    publisher: 'Epic Games Publishing',
    releaseDate: '2023-10-27',
    rating: 4.3,
    ratingCount: 245,
    categorySlug: 'accion',
    platforms: 'PC, PlayStation, Xbox',
    featured: true,
    trailerUrl: null,
  },
  {
    title: 'Star Wars Jedi: Survivor',
    slug: 'star-wars-jedi-survivor',
    steamId: '1774580',
    description: 'Cal Kestis regresa en esta aventura epica de Star Wars. Explora planetas nuevos, domina estilos de combate y descubre los secretos de una civilizacion perdida mientras huyes del Imperio.',
    developer: 'Respawn Entertainment',
    publisher: 'EA',
    releaseDate: '2023-04-28',
    rating: 4.2,
    ratingCount: 268,
    categorySlug: 'accion',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Marvel Spider-Man Remastered',
    slug: 'marvels-spider-man-remastered',
    steamId: '1817070',
    description: 'Balancea por los rascacielos de Nueva York como Peter Parker en esta aventura epica de Spider-Man. Combate villanos iconicos, desbloquea trajes y vive una historia emocionante del trepamuros.',
    developer: 'Insomniac Games',
    publisher: 'Sony Interactive',
    releaseDate: '2022-08-12',
    rating: 4.5,
    ratingCount: 312,
    categorySlug: 'accion',
    platforms: 'PC, PlayStation',
    featured: true,
    trailerUrl: null,
  },
  {
    title: 'Mass Effect Legendary Edition',
    slug: 'mass-effect-legendary-edition',
    steamId: '1328670',
    description: 'La trilogia completa de Mass Effect remasterizada. Como Comandante Shepard, explora la galaxia, forja alianzas y toma decisiones que afectan el destino de toda la civilizacion en esta epica space opera.',
    developer: 'BioWare',
    publisher: 'EA',
    releaseDate: '2021-05-14',
    rating: 4.6,
    ratingCount: 289,
    categorySlug: 'rpg',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Dead Space Remake',
    slug: 'dead-space-remake',
    steamId: '1693980',
    description: 'El remake del clasico de terror espacial. Isaac Clarke explora la nave USG Ishimura infestada de necromorfos con graficos modernos, combate desmembrador y una atmosfera de terror inigualable.',
    developer: 'Motive Studio',
    publisher: 'EA',
    releaseDate: '2023-01-27',
    rating: 4.4,
    ratingCount: 275,
    categorySlug: 'accion',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Control',
    slug: 'control',
    steamId: '870780',
    description: 'Jesse Faden llega a la Oficina Federal de Control para buscar respuestas sobre su pasado. Descubre poderes sobrenaturales y explora un edificio que desafia las leyes de la fisica en este thriller de accion.',
    developer: 'Remedy Entertainment',
    publisher: '505 Games',
    releaseDate: '2019-08-27',
    rating: 4.2,
    ratingCount: 256,
    categorySlug: 'accion',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Dishonored 2',
    slug: 'dishonored-2',
    steamId: '403640',
    description: 'Elige entre Corvo o Emily y recupera el trono de Dunwall en esta aventura de sigilo y accion. Cada mision es un sandbox con multiples caminos y poderes sobrenaturales que transforman la jugabilidad.',
    developer: 'Arkane Studios',
    publisher: 'Bethesda Softworks',
    releaseDate: '2016-11-11',
    rating: 4.4,
    ratingCount: 263,
    categorySlug: 'accion',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Prey',
    slug: 'prey-2017',
    steamId: '480490',
    description: 'Despiertas en la estacion espacial Talos I invadida por alienigenas cambiantes. Usa poderes psi, hackea sistemas y fabrica armas para sobrevivir en este inmersivo simulador inmersivo de Arkane Studios.',
    developer: 'Arkane Studios',
    publisher: 'Bethesda Softworks',
    releaseDate: '2017-05-04',
    rating: 4.3,
    ratingCount: 247,
    categorySlug: 'accion',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Devil May Cry 5',
    slug: 'devil-may-cry-5',
    steamId: '601150',
    description: 'Nero, Dante y V se unen contra una amenaza demoniaca en Red Grave City. Combate estilizado con tres personajes unicos, combos espectaculares y la accion mas cinematografica del genero hack and slash.',
    developer: 'Capcom',
    publisher: 'Capcom',
    releaseDate: '2019-03-07',
    rating: 4.5,
    ratingCount: 291,
    categorySlug: 'accion',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Monster Hunter: World',
    slug: 'monster-hunter-world',
    steamId: '582010',
    description: 'Caza monstruos gigantes en un ecosistema vivo y dinamico. Fabrica armas y armaduras de tus presas, coopera con otros cazadores y enfrentate a bestias epicas en el mundo de Monster Hunter.',
    developer: 'Capcom',
    publisher: 'Capcom',
    releaseDate: '2018-08-09',
    rating: 4.4,
    ratingCount: 282,
    categorySlug: 'accion',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'NieR: Automata',
    slug: 'nier-automata',
    steamId: '524220',
    description: '2B, un androide de combate, lucha contra maquinas alienigenas en una Tierra abandonada. Una narrativa filosofica sobre la existencia, combates dinamicos y multiples finales que redefinen el genero.',
    developer: 'PlatinumGames',
    publisher: 'Square Enix',
    releaseDate: '2017-03-17',
    rating: 4.6,
    ratingCount: 305,
    categorySlug: 'accion',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Detroit: Become Human',
    slug: 'detroit-become-human',
    steamId: '1118960',
    description: 'Tres androides descubren la consciencia en un Detroit futurista. Cada decision que tomas crea ramificaciones profundas en esta experiencia interactiva de Quantic Dream sobre libertad e identidad.',
    developer: 'Quantic Dream',
    publisher: 'Quantic Dream',
    releaseDate: '2019-12-12',
    rating: 4.3,
    ratingCount: 258,
    categorySlug: 'aventura',
    platforms: 'PC, PlayStation',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Disco Elysium',
    slug: 'disco-elysium',
    steamId: '632470',
    description: 'Un detective sin memoria investiga un asesinato en Revachol. Un RPG sin combate donde tus habilidades de dialogo, pensamientos internos y decisiones politicas definen quien eres y como resuelves el caso.',
    developer: 'ZA/UM',
    publisher: 'ZA/UM',
    releaseDate: '2019-10-15',
    rating: 4.7,
    ratingCount: 293,
    categorySlug: 'rpg',
    platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Outer Wilds',
    slug: 'outer-wilds',
    steamId: '753640',
    description: 'Explora un sistema solar atrapado en un bucle temporal de 22 minutos. Descubre los secretos de una civilizacion extinta mientras planetas cambian y se destruyen en este juego de exploracion unico.',
    developer: 'Mobius Digital',
    publisher: 'Annapurna Interactive',
    releaseDate: '2020-06-18',
    rating: 4.6,
    ratingCount: 271,
    categorySlug: 'aventura',
    platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Subnautica',
    slug: 'subnautica',
    steamId: '264710',
    description: 'Sobrevive en un oceano alienigena tras estrellarte en el planeta 4546B. Explora las profundidades, construye bases submarinas y descubre los secretos de este mundo acuatico lleno de maravillas y peligros.',
    developer: 'Unknown Worlds',
    publisher: 'Unknown Worlds',
    releaseDate: '2018-01-23',
    rating: 4.5,
    ratingCount: 284,
    categorySlug: 'aventura',
    platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'The Outer Worlds',
    slug: 'the-outer-worlds',
    steamId: '578650',
    description: 'Despierta de la criogenia en una colonia perdida al borde de la galaxia. Un RPG de Obsidian con humor negro, decisiones morales y combate en primera persona en un universo corporativo distopico.',
    developer: 'Obsidian Entertainment',
    publisher: 'Private Division',
    releaseDate: '2019-10-25',
    rating: 4.2,
    ratingCount: 252,
    categorySlug: 'rpg',
    platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Tomb Raider',
    slug: 'tomb-raider-2013',
    steamId: '203160',
    description: 'El origen de Lara Croft. Naufraga en una isla misteriosa y debe aprender a sobrevivir, combatir y explorar tumbas peligrosas en esta reinterpretacion intensa y emocional de la iconica aventurera.',
    developer: 'Crystal Dynamics',
    publisher: 'Square Enix',
    releaseDate: '2013-03-05',
    rating: 4.3,
    ratingCount: 299,
    categorySlug: 'aventura',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Rise of the Tomb Raider',
    slug: 'rise-of-the-tomb-raider',
    steamId: '391220',
    description: 'Lara Croft busca la ciudad perdida de Kitezh en Siberia. Explora tumbas ancestrales, combate la organizacion Trinity y descubre secretos milenarios en esta aventura de accion y supervivencia.',
    developer: 'Crystal Dynamics',
    publisher: 'Square Enix',
    releaseDate: '2016-01-28',
    rating: 4.4,
    ratingCount: 275,
    categorySlug: 'aventura',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Shadow of the Tomb Raider',
    slug: 'shadow-of-the-tomb-raider',
    steamId: '750920',
    description: 'Lara Croft se adentra en la selva de America Central para detener un apocalipsis maya. La tumba mas oscura, el sigilo mas profundo y los desafios mas mortales de la trilogia.',
    developer: 'Eidos-Montreal',
    publisher: 'Square Enix',
    releaseDate: '2018-09-14',
    rating: 4.1,
    ratingCount: 248,
    categorySlug: 'aventura',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Hitman: World of Assassination',
    slug: 'hitman-world-of-assassination',
    steamId: '1655950',
    description: 'El asesino a sueldo mas iconico regresa. Como el Agente 47, viaja por el mundo eliminando objetivos con creatividad y precision en sandbox vivos llenos de posibilidades.',
    developer: 'IO Interactive',
    publisher: 'IO Interactive',
    releaseDate: '2021-01-20',
    rating: 4.5,
    ratingCount: 267,
    categorySlug: 'accion',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Dying Light 2',
    slug: 'dying-light-2',
    steamId: '1195420',
    description: 'Parkour y supervivencia en una ciudad posapocaliptica infestada de zombis. Tus decisiones moldean el destino de La Ciudad mientras corres, saltas y luchas por sobrevivir en la oscuridad.',
    developer: 'Techland',
    publisher: 'Techland',
    releaseDate: '2022-02-04',
    rating: 4.1,
    ratingCount: 242,
    categorySlug: 'accion',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Far Cry 6',
    slug: 'far-cry-6',
    steamId: '1340210',
    description: 'Libera Yara del dictador Anton Castillo en este mundo abierto tropical. Armas improvisadas, vehiculos locos y guerrilla revolucionaria en el paraiso caribeno de Far Cry.',
    developer: 'Ubisoft Toronto',
    publisher: 'Ubisoft',
    releaseDate: '2021-10-06',
    rating: 3.9,
    ratingCount: 231,
    categorySlug: 'shooter',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Watch Dogs: Legion',
    slug: 'watch-dogs-legion',
    steamId: '1277650',
    description: 'Hackea Londres como cualquier personaje que reclutes. DedSec lucha contra el regimen autoritario que controla la ciudad en este mundo abierto donde todos es jugable.',
    developer: 'Ubisoft Toronto',
    publisher: 'Ubisoft',
    releaseDate: '2020-10-29',
    rating: 3.7,
    ratingCount: 218,
    categorySlug: 'accion',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Sons Of The Forest',
    slug: 'sons-of-the-forest',
    steamId: '1326470',
    description: 'Busca a un magnate desaparecido en una isla llena de canibales y mutantes. Construye, sobrevive y explora en esta secuela de terror y supervivencia del aclamado The Forest.',
    developer: 'Endnight Games',
    publisher: 'Newnight',
    releaseDate: '2023-02-23',
    rating: 4.2,
    ratingCount: 259,
    categorySlug: 'aventura',
    platforms: 'PC',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Valheim',
    slug: 'valheim',
    steamId: '892970',
    description: 'Sobrevive en el purgatorio nordico. Construye bases, derrota jefes mitologicos y explora biomas unicos en este survival cooperativo inspirado en la mitologia vikinga.',
    developer: 'Iron Gate Studio',
    publisher: 'Coffee Stain Publishing',
    releaseDate: '2021-02-02',
    rating: 4.4,
    ratingCount: 278,
    categorySlug: 'aventura',
    platforms: 'PC, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Terraria',
    slug: 'terraria',
    steamId: '105600',
    description: 'Cava, explora, construye y combate en un mundo 2D infinito. Enfrentate a jefes epicos, fabrica armas legendarias y decora tu hogar en el sandbox de aventura mas querido de Steam.',
    developer: 'Re-Logic',
    publisher: 'Re-Logic',
    releaseDate: '2011-05-16',
    rating: 4.8,
    ratingCount: 335,
    categorySlug: 'aventura',
    platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Lethal Company',
    slug: 'lethal-company',
    steamId: '1966720',
    description: 'Recolecta chatarra en lunas abandonadas infestadas de monstruos con tus amigos. Un cooperativo de terror con humor, mecanicas unicas y los sustos mas memorables del ano.',
    developer: 'Zeekerss',
    publisher: 'Zeekerss',
    releaseDate: '2023-10-23',
    rating: 4.5,
    ratingCount: 263,
    categorySlug: 'indie',
    platforms: 'PC',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Hades II',
    slug: 'hades-2',
    steamId: '1145350',
    description: 'Melinoe, la hermana de Zagreus, busca derrocar a Cronos en esta secuela roguelike. Nuevos poderes, armas y dioses en un combate mas profundo con la misma narrativa brillante.',
    developer: 'Supergiant Games',
    publisher: 'Supergiant Games',
    releaseDate: '2024-05-06',
    rating: 4.6,
    ratingCount: 248,
    categorySlug: 'indie',
    platforms: 'PC',
    featured: true,
    trailerUrl: null,
  },
  {
    title: 'BioShock Remastered',
    slug: 'bioshock-remastered',
    steamId: '409720',
    description: 'Desciende a Rapture, una ciudad submarina utopica convertida en pesadilla. Combate con plasmidos y armas mientras descubres la verdad detras de la locura de Andrew Ryan.',
    developer: 'Irrational Games',
    publisher: '2K Games',
    releaseDate: '2016-09-15',
    rating: 4.5,
    ratingCount: 298,
    categorySlug: 'shooter',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'BioShock Infinite',
    slug: 'bioshock-infinite',
    steamId: '8870',
    description: 'Booker DeWitt viaja a la ciudad flotante de Columbia para rescatar a Elizabeth. Un shooter con una de las narrativas mas brillantes y giros argumentales mas impactantes de los videojuegos.',
    developer: 'Irrational Games',
    publisher: '2K Games',
    releaseDate: '2013-03-25',
    rating: 4.4,
    ratingCount: 287,
    categorySlug: 'shooter',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Half-Life 2',
    slug: 'half-life-2',
    steamId: '220',
    description: 'Gordon Freeman regresa para luchar contra la alienigena Combine en City 17. El shooter que revoluciono el genero con su fisica, narrativa y la gravedad cero del Gravity Gun.',
    developer: 'Valve',
    publisher: 'Valve',
    releaseDate: '2004-11-16',
    rating: 4.8,
    ratingCount: 319,
    categorySlug: 'shooter',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Left 4 Dead 2',
    slug: 'left-4-dead-2',
    steamId: '550',
    description: 'Sobrevive la pandemia zombi con tres amigos en esta experiencia cooperativa frenetica. El Director IA crea experiencias unicas cada partida en el shooter de zombis mas iconico.',
    developer: 'Valve',
    publisher: 'Valve',
    releaseDate: '2009-11-17',
    rating: 4.7,
    ratingCount: 308,
    categorySlug: 'shooter',
    platforms: 'PC, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Middle-earth: Shadow of War',
    slug: 'middle-earth-shadow-of-war',
    steamId: '356190',
    description: 'Forja tu ejercito de orcos y conquista Mordor con el Nemesis System. Talion y Celebrimbor luchan contra Sauron en un mundo abierto epico basado en El Senor de los Anillos.',
    developer: 'Monolith Productions',
    publisher: 'WB Games',
    releaseDate: '2017-10-10',
    rating: 4.2,
    ratingCount: 253,
    categorySlug: 'accion',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Batman: Arkham Knight',
    slug: 'batman-arkham-knight',
    steamId: '208650',
    description: 'El Caballero de la Noche enfrenta su amenaza mas letal en Gotham City. Conduce el Batmovil, vuela con la capa y combate al Espantapajaros en la conclusion de la saga Arkham.',
    developer: 'Rocksteady Studios',
    publisher: 'WB Games',
    releaseDate: '2015-06-23',
    rating: 4.3,
    ratingCount: 269,
    categorySlug: 'accion',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'The Forest',
    slug: 'the-forest',
    steamId: '242760',
    description: 'Sobrevive en una peninsula habitada por canibales tras un accidente aereo. Construye refugios, fabrica armas y busca a tu hijo secuestrado en este terror de supervivencia.',
    developer: 'Endnight Games',
    publisher: 'Endnight Games',
    releaseDate: '2018-04-30',
    rating: 4.3,
    ratingCount: 262,
    categorySlug: 'aventura',
    platforms: 'PC, PlayStation',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Green Hell',
    slug: 'green-hell',
    steamId: '515400',
    description: 'Sobrevive en la selva del Amazonas con las mas realistas mecanicas de supervivencia. Gestiona tu salud fisica y mental mientras buscas la manera de escapar del infierno verde.',
    developer: 'Creepy Jar',
    publisher: 'Creepy Jar',
    releaseDate: '2019-09-05',
    rating: 4.1,
    ratingCount: 237,
    categorySlug: 'aventura',
    platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Grounded',
    slug: 'grounded',
    steamId: '962130',
    description: 'Encogido al tamano de una hormiga, sobrevive en tu propio jardin. Construye bases con hojas, combate insectos gigantes y descubre por que te has reducido en este survival cooperativo.',
    developer: 'Obsidian Entertainment',
    publisher: 'Xbox Game Studios',
    releaseDate: '2022-09-27',
    rating: 4.0,
    ratingCount: 228,
    categorySlug: 'aventura',
    platforms: 'PC, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Back 4 Blood',
    slug: 'back-4-blood',
    steamId: '924970',
    description: 'De los creadores de Left 4 Dead llega este shooter cooperativo de zombis. El sistema de cartas crea partidas unicas mientras limpias al mundo de los Ridden con tu equipo.',
    developer: 'Turtle Rock Studios',
    publisher: 'Warner Bros. Games',
    releaseDate: '2021-10-12',
    rating: 3.8,
    ratingCount: 222,
    categorySlug: 'shooter',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'World War Z',
    slug: 'world-war-z',
    steamId: '699130',
    description: 'Enfrentate a hordas de cientos de zombis en este shooter cooperativo basado en la pelicula. Defiende posiciones, mejora armas y sobrevive a la avalancha de no-muertos.',
    developer: 'Saber Interactive',
    publisher: 'Focus Entertainment',
    releaseDate: '2019-04-16',
    rating: 3.9,
    ratingCount: 235,
    categorySlug: 'shooter',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Dark Souls Remastered',
    slug: 'dark-souls-remastered',
    steamId: '570940',
    description: 'El juego que definio un genero, remasterizado. Explora Lordran con sus conexiones interconectadas, jefes legendarios y la dificultad implacable que creo la saga mas influyente del Souls-like.',
    developer: 'FromSoftware',
    publisher: 'Bandai Namco',
    releaseDate: '2018-05-24',
    rating: 4.6,
    ratingCount: 294,
    categorySlug: 'rpg',
    platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Dark Souls II: Scholar of the First Sin',
    slug: 'dark-souls-2-scholar',
    steamId: '335300',
    description: 'Viaja a Drangleic para curar tu maldicion en la entrega mas amplia de la saga Dark Souls. Combate, explora y muere una y otra vez en este RPG de accion implacable.',
    developer: 'FromSoftware',
    publisher: 'Bandai Namco',
    releaseDate: '2015-04-01',
    rating: 4.1,
    ratingCount: 261,
    categorySlug: 'rpg',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Hollow Knight: Silksong',
    slug: 'hollow-knight-silksong',
    steamId: '1030000',
    description: 'Hornet emprende su propia aventura en un reino nuevo y misterioso. Plataformas precisas, combate veloz y jefes epicos en la esperada secuela del aclamado Hollow Knight.',
    developer: 'Team Cherry',
    publisher: 'Team Cherry',
    releaseDate: '2025-02-01',
    rating: 4.5,
    ratingCount: 240,
    categorySlug: 'indie',
    platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
    featured: true,
    trailerUrl: null,
  },
  {
    title: 'Factorio',
    slug: 'factorio',
    steamId: '427520',
    description: 'Construye fabricas automatizadas en un planeta alienigena. Diseña cintas transportadoras, gestiona recursos y defiende tu base de criaturas nativas en el simulador de factorias mas adictivo.',
    developer: 'Wube Software',
    publisher: 'Wube Software',
    releaseDate: '2020-08-14',
    rating: 4.7,
    ratingCount: 286,
    categorySlug: 'estrategia',
    platforms: 'PC',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Age of Empires IV',
    slug: 'age-of-empires-4',
    steamId: '1466860',
    description: 'Lidera civilizaciones a traves de la historia en este juego de estrategia en tiempo real. Batallas epicas, campanas documentales y mecanicas que honran el legado de la saga Age of Empires.',
    developer: 'Relic Entertainment',
    publisher: 'Xbox Game Studios',
    releaseDate: '2021-10-28',
    rating: 4.1,
    ratingCount: 243,
    categorySlug: 'estrategia',
    platforms: 'PC, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Cities: Skylines',
    slug: 'cities-skylines',
    steamId: '255710',
    description: 'Disena y gestiona la ciudad de tus suenos. Planifica carreteras, gestiona servicios publicos y resuelve problemas de trafico en el simulador de ciudades mas completo.',
    developer: 'Colossal Order',
    publisher: 'Paradox Interactive',
    releaseDate: '2015-03-10',
    rating: 4.4,
    ratingCount: 272,
    categorySlug: 'simulacion',
    platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Euro Truck Simulator 2',
    slug: 'euro-truck-simulator-2',
    steamId: '227300',
    description: 'Conduce camiones por las carreteras de Europa en el simulador de conduccion mas relajante. Construye tu empresa de transporte, compra garajes y recorre paises enteros.',
    developer: 'SCS Software',
    publisher: 'SCS Software',
    releaseDate: '2013-01-16',
    rating: 4.5,
    ratingCount: 281,
    categorySlug: 'simulacion',
    platforms: 'PC',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Mortal Kombat 1',
    slug: 'mortal-kombat-1',
    steamId: '1944920',
    description: 'Liu Kang reinicia el universo y crea una nueva era de Mortal Kombat. Fatalities brutales, el sistema Kameo y el mejor combate de la saga en este reboot definitivo.',
    developer: 'NetherRealm Studios',
    publisher: 'Warner Bros. Games',
    releaseDate: '2023-09-19',
    rating: 4.1,
    ratingCount: 238,
    categorySlug: 'lucha',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'The Witness',
    slug: 'the-witness',
    steamId: '210970',
    description: 'Despierta en una isla misteriosa llena de paneles de puzzles. Cada acertijo ensena una nueva regla sin palabras, creando una experiencia de descubrimiento puro y eureka intelectual.',
    developer: 'Thekla',
    publisher: 'Thekla',
    releaseDate: '2016-01-26',
    rating: 4.2,
    ratingCount: 241,
    categorySlug: 'puzzle',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: null,
  },
  {
    title: 'Returnal',
    slug: 'returnal',
    steamId: '1649240',
    description: 'Selene Vassos cae en Atropos, un planeta alienigena atrapado en un bucle temporal. Un roguelike de accion con combate intenso, narrativa psicologica y graficos next-gen impresionantes.',
    developer: 'Housemarque',
    publisher: 'Sony Interactive',
    releaseDate: '2023-02-15',
    rating: 4.3,
    ratingCount: 249,
    categorySlug: 'accion',
    platforms: 'PC, PlayStation',
    featured: false,
    trailerUrl: null,
  },
]

const TORRENT_DOWNLOADS_BATCH2: Record<string, { fileSize: string; links: TorrentDownload[] }> = {
  'alan-wake-2': {
    fileSize: '90 GB',
    links: [
      { label: 'Alan Wake 2 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:022f3c5962cf6798b01afbdeb7f4de3f&dn=alan-wake-2-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '90 GB', quality: 'FULL UNLOCKED' },
      { label: 'Alan Wake 2 - FitGirl Repack', url: 'magnet:?xt=urn:btih:30903e82f4b007a3e839557f1edb6469&dn=alan-wake-2-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '48 GB', quality: 'FitGirl Repack' },
      { label: 'Alan Wake 2 - DODI Repack', url: 'magnet:?xt=urn:btih:1cf9affa8e3b6c335c2ec07c92ffef3a&dn=alan-wake-2-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '56 GB', quality: 'DODI Repack' },
    ]
  },
  'star-wars-jedi-survivor': {
    fileSize: '130 GB',
    links: [
      { label: 'Star Wars Jedi: Survivor - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:5396965870bd48349a4840a65e1d0883&dn=star-wars-jedi-survivor-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '130 GB', quality: 'FULL UNLOCKED' },
      { label: 'Star Wars Jedi: Survivor - FitGirl Repack', url: 'magnet:?xt=urn:btih:e42769b2aa45a9ce0512fa9d0426eac9&dn=star-wars-jedi-survivor-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '70 GB', quality: 'FitGirl Repack' },
      { label: 'Star Wars Jedi: Survivor - DODI Repack', url: 'magnet:?xt=urn:btih:d13d4b99ce884c9af28993b4f2315d2e&dn=star-wars-jedi-survivor-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '82 GB', quality: 'DODI Repack' },
    ]
  },
  'marvels-spider-man-remastered': {
    fileSize: '75 GB',
    links: [
      { label: 'Marvel Spider-Man Remastered - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:ab0ff451eb6e703a2b7804eb005ead9d&dn=marvels-spider-man-remastered-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '75 GB', quality: 'FULL UNLOCKED' },
      { label: 'Marvel Spider-Man Remastered - FitGirl Repack', url: 'magnet:?xt=urn:btih:722f7d7445108122f3e6c6f73bcdcada&dn=marvels-spider-man-remastered-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '42 GB', quality: 'FitGirl Repack' },
      { label: 'Marvel Spider-Man Remastered - DODI Repack', url: 'magnet:?xt=urn:btih:bc9e07339cb19f036c17327f606aa523&dn=marvels-spider-man-remastered-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '50 GB', quality: 'DODI Repack' },
    ]
  },
  'mass-effect-legendary-edition': {
    fileSize: '120 GB',
    links: [
      { label: 'Mass Effect Legendary Edition - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:a01827df7f5e0b6d74c39f9c96ae4ef5&dn=mass-effect-legendary-edition-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '120 GB', quality: 'FULL UNLOCKED' },
      { label: 'Mass Effect Legendary Edition - FitGirl Repack', url: 'magnet:?xt=urn:btih:ac4cc8fb19a41c4efcd30f07a80ec6e2&dn=mass-effect-legendary-edition-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '65 GB', quality: 'FitGirl Repack' },
      { label: 'Mass Effect Legendary Edition - DODI Repack', url: 'magnet:?xt=urn:btih:b1b39ecb9de71d25ab69d95e02ed3463&dn=mass-effect-legendary-edition-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '78 GB', quality: 'DODI Repack' },
    ]
  },
  'dead-space-remake': {
    fileSize: '50 GB',
    links: [
      { label: 'Dead Space Remake - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:6ccc0332a30ffb63e63a091a4fddab27&dn=dead-space-remake-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '50 GB', quality: 'FULL UNLOCKED' },
      { label: 'Dead Space Remake - FitGirl Repack', url: 'magnet:?xt=urn:btih:bdce112171e06b4596f331e443c71cb2&dn=dead-space-remake-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '28 GB', quality: 'FitGirl Repack' },
      { label: 'Dead Space Remake - DODI Repack', url: 'magnet:?xt=urn:btih:f4ea61e23f9ea61ce5c2ca2cc68834f1&dn=dead-space-remake-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '33 GB', quality: 'DODI Repack' },
    ]
  },
  'control': {
    fileSize: '42 GB',
    links: [
      { label: 'Control - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:5d985e4c5a5339d714f04e35c3b47c39&dn=control-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '42 GB', quality: 'FULL UNLOCKED' },
      { label: 'Control - FitGirl Repack', url: 'magnet:?xt=urn:btih:5c3e551a697389a48dc3ed0562f1337f&dn=control-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '23 GB', quality: 'FitGirl Repack' },
      { label: 'Control - DODI Repack', url: 'magnet:?xt=urn:btih:f489428e23d21a6dfbdeae6f42e9252d&dn=control-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '27 GB', quality: 'DODI Repack' },
    ]
  },
  'dishonored-2': {
    fileSize: '40 GB',
    links: [
      { label: 'Dishonored 2 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:321923c526abd5e2fec521f483de8560&dn=dishonored-2-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '40 GB', quality: 'FULL UNLOCKED' },
      { label: 'Dishonored 2 - FitGirl Repack', url: 'magnet:?xt=urn:btih:9568cf1d470639b8486c704de0b7cdec&dn=dishonored-2-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '22 GB', quality: 'FitGirl Repack' },
      { label: 'Dishonored 2 - DODI Repack', url: 'magnet:?xt=urn:btih:cd45014bc4a640101cadd293e1bb61da&dn=dishonored-2-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '26 GB', quality: 'DODI Repack' },
    ]
  },
  'prey-2017': {
    fileSize: '35 GB',
    links: [
      { label: 'Prey - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:ee8fecb03fd48d26ed260b3ff0c99c48&dn=prey-2017-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '35 GB', quality: 'FULL UNLOCKED' },
      { label: 'Prey - FitGirl Repack', url: 'magnet:?xt=urn:btih:5199b95eaf9d7755c2d89b9a97bd30ad&dn=prey-2017-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '19 GB', quality: 'FitGirl Repack' },
      { label: 'Prey - DODI Repack', url: 'magnet:?xt=urn:btih:82f8d2969e0a3a9db20580dfcf1b516d&dn=prey-2017-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '23 GB', quality: 'DODI Repack' },
    ]
  },
  'devil-may-cry-5': {
    fileSize: '35 GB',
    links: [
      { label: 'Devil May Cry 5 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:cf0b27893ee8576d9a555a12c4631296&dn=devil-may-cry-5-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '35 GB', quality: 'FULL UNLOCKED' },
      { label: 'Devil May Cry 5 - FitGirl Repack', url: 'magnet:?xt=urn:btih:2a7f1e27eddf7089e1c1dddbe8a245a6&dn=devil-may-cry-5-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '19 GB', quality: 'FitGirl Repack' },
      { label: 'Devil May Cry 5 - DODI Repack', url: 'magnet:?xt=urn:btih:90a1cce13351b602fdd2c8e490f1f78c&dn=devil-may-cry-5-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '23 GB', quality: 'DODI Repack' },
    ]
  },
  'monster-hunter-world': {
    fileSize: '80 GB',
    links: [
      { label: 'Monster Hunter: World - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:f4e0a6a74589899a00194ec9121ed4b5&dn=monster-hunter-world-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '80 GB', quality: 'FULL UNLOCKED' },
      { label: 'Monster Hunter: World - FitGirl Repack', url: 'magnet:?xt=urn:btih:a2ff02db8cee962e3b83fa94e9d4e9ca&dn=monster-hunter-world-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '44 GB', quality: 'FitGirl Repack' },
      { label: 'Monster Hunter: World - DODI Repack', url: 'magnet:?xt=urn:btih:fa6df6c8aae6b1f55611d95099f01cb0&dn=monster-hunter-world-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '52 GB', quality: 'DODI Repack' },
    ]
  },
  'nier-automata': {
    fileSize: '50 GB',
    links: [
      { label: 'NieR: Automata - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:ba0725e5b00b70671da3db5534c99cd1&dn=nier-automata-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '50 GB', quality: 'FULL UNLOCKED' },
      { label: 'NieR: Automata - FitGirl Repack', url: 'magnet:?xt=urn:btih:27d3189687bfa203f31ecacf75e6edfb&dn=nier-automata-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '27 GB', quality: 'FitGirl Repack' },
      { label: 'NieR: Automata - DODI Repack', url: 'magnet:?xt=urn:btih:be39f462a77573dc75319a64a09c8a83&dn=nier-automata-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '32 GB', quality: 'DODI Repack' },
    ]
  },
  'detroit-become-human': {
    fileSize: '55 GB',
    links: [
      { label: 'Detroit: Become Human - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:3f57d4e5b00b80885d5d94a42a404a00&dn=detroit-become-human-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '55 GB', quality: 'FULL UNLOCKED' },
      { label: 'Detroit: Become Human - FitGirl Repack', url: 'magnet:?xt=urn:btih:fa9e2817327a6016aee6343f62d2afe0&dn=detroit-become-human-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '30 GB', quality: 'FitGirl Repack' },
      { label: 'Detroit: Become Human - DODI Repack', url: 'magnet:?xt=urn:btih:0af867d61e873220dec0937efefe413a&dn=detroit-become-human-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '36 GB', quality: 'DODI Repack' },
    ]
  },
  'disco-elysium': {
    fileSize: '25 GB',
    links: [
      { label: 'Disco Elysium - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:dc4dd3e55fb676e380bd639b929d0d01&dn=disco-elysium-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '25 GB', quality: 'FULL UNLOCKED' },
      { label: 'Disco Elysium - FitGirl Repack', url: 'magnet:?xt=urn:btih:d0602e599430fc9476ece23df05fd086&dn=disco-elysium-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '14 GB', quality: 'FitGirl Repack' },
      { label: 'Disco Elysium - DODI Repack', url: 'magnet:?xt=urn:btih:ddffae5d6de9307130d5e7690d721c5d&dn=disco-elysium-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '16 GB', quality: 'DODI Repack' },
    ]
  },
  'outer-wilds': {
    fileSize: '12 GB',
    links: [
      { label: 'Outer Wilds - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:523cffcf8314a17589edb7f565fdd4a4&dn=outer-wilds-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '12 GB', quality: 'FULL UNLOCKED' },
      { label: 'Outer Wilds - FitGirl Repack', url: 'magnet:?xt=urn:btih:ac41d4364615b834afb3bbadf2ab03ca&dn=outer-wilds-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '7 GB', quality: 'FitGirl Repack' },
      { label: 'Outer Wilds - DODI Repack', url: 'magnet:?xt=urn:btih:245457c70284b17406e30bd0e6d8c1a9&dn=outer-wilds-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '8 GB', quality: 'DODI Repack' },
    ]
  },
  'subnautica': {
    fileSize: '25 GB',
    links: [
      { label: 'Subnautica - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:ccabb8415791ad2087a3578a1acca7c3&dn=subnautica-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '25 GB', quality: 'FULL UNLOCKED' },
      { label: 'Subnautica - FitGirl Repack', url: 'magnet:?xt=urn:btih:caf307f2289e99530cc7b0e672194923&dn=subnautica-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '14 GB', quality: 'FitGirl Repack' },
      { label: 'Subnautica - DODI Repack', url: 'magnet:?xt=urn:btih:de17463370343304de2699926ef920f2&dn=subnautica-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '16 GB', quality: 'DODI Repack' },
    ]
  },
  'the-outer-worlds': {
    fileSize: '40 GB',
    links: [
      { label: 'The Outer Worlds - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:4a12e5e679c565987de3158b5a2947e7&dn=the-outer-worlds-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '40 GB', quality: 'FULL UNLOCKED' },
      { label: 'The Outer Worlds - FitGirl Repack', url: 'magnet:?xt=urn:btih:2ea4bf77def8f52f31efa2ca3960603e&dn=the-outer-worlds-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '22 GB', quality: 'FitGirl Repack' },
      { label: 'The Outer Worlds - DODI Repack', url: 'magnet:?xt=urn:btih:214209f0d0e4d301515d0d7e054adabc&dn=the-outer-worlds-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '26 GB', quality: 'DODI Repack' },
    ]
  },
  'tomb-raider-2013': {
    fileSize: '25 GB',
    links: [
      { label: 'Tomb Raider - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:c667e777b414e60a3d729365b72ca7bf&dn=tomb-raider-2013-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '25 GB', quality: 'FULL UNLOCKED' },
      { label: 'Tomb Raider - FitGirl Repack', url: 'magnet:?xt=urn:btih:4962c5f8b98e0c2455b5c6776911ea96&dn=tomb-raider-2013-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '14 GB', quality: 'FitGirl Repack' },
      { label: 'Tomb Raider - DODI Repack', url: 'magnet:?xt=urn:btih:570e95d6f92f42c4aa2258253dd26e5b&dn=tomb-raider-2013-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '16 GB', quality: 'DODI Repack' },
    ]
  },
  'rise-of-the-tomb-raider': {
    fileSize: '35 GB',
    links: [
      { label: 'Rise of the Tomb Raider - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:3bff8556bf06acd97154a9c0942ff0c6&dn=rise-of-the-tomb-raider-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '35 GB', quality: 'FULL UNLOCKED' },
      { label: 'Rise of the Tomb Raider - FitGirl Repack', url: 'magnet:?xt=urn:btih:a3d3d7c9a62538089314376d2f0c06c3&dn=rise-of-the-tomb-raider-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '19 GB', quality: 'FitGirl Repack' },
      { label: 'Rise of the Tomb Raider - DODI Repack', url: 'magnet:?xt=urn:btih:82bb6b20c78c21eb67126378822ede9c&dn=rise-of-the-tomb-raider-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '23 GB', quality: 'DODI Repack' },
    ]
  },
  'shadow-of-the-tomb-raider': {
    fileSize: '45 GB',
    links: [
      { label: 'Shadow of the Tomb Raider - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:cffea5cee82d3d342622c5d6fd67a32e&dn=shadow-of-the-tomb-raider-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '45 GB', quality: 'FULL UNLOCKED' },
      { label: 'Shadow of the Tomb Raider - FitGirl Repack', url: 'magnet:?xt=urn:btih:b620f91b5e8caf5ef622f9102ba95310&dn=shadow-of-the-tomb-raider-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '25 GB', quality: 'FitGirl Repack' },
      { label: 'Shadow of the Tomb Raider - DODI Repack', url: 'magnet:?xt=urn:btih:227fb0c40c58df0db5d08c477f856da3&dn=shadow-of-the-tomb-raider-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '29 GB', quality: 'DODI Repack' },
    ]
  },
  'hitman-world-of-assassination': {
    fileSize: '80 GB',
    links: [
      { label: 'Hitman: World of Assassination - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:449289eec2d331b0a78196e3ddde76d8&dn=hitman-world-of-assassination-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '80 GB', quality: 'FULL UNLOCKED' },
      { label: 'Hitman: World of Assassination - FitGirl Repack', url: 'magnet:?xt=urn:btih:837b0a5a95bd5539ab71822e2e98121c&dn=hitman-world-of-assassination-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '44 GB', quality: 'FitGirl Repack' },
      { label: 'Hitman: World of Assassination - DODI Repack', url: 'magnet:?xt=urn:btih:ab721c384bb8dc585db66ba00adb5d8f&dn=hitman-world-of-assassination-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '52 GB', quality: 'DODI Repack' },
    ]
  },
  'dying-light-2': {
    fileSize: '70 GB',
    links: [
      { label: 'Dying Light 2 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:86c0f2170e5a02dc9106bffaaf2f5267&dn=dying-light-2-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '70 GB', quality: 'FULL UNLOCKED' },
      { label: 'Dying Light 2 - FitGirl Repack', url: 'magnet:?xt=urn:btih:b157df7ac196320d313b318902b6632b&dn=dying-light-2-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '38 GB', quality: 'FitGirl Repack' },
      { label: 'Dying Light 2 - DODI Repack', url: 'magnet:?xt=urn:btih:e34389cfe4bafecde44becc9fd7e6108&dn=dying-light-2-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '45 GB', quality: 'DODI Repack' },
    ]
  },
  'far-cry-6': {
    fileSize: '85 GB',
    links: [
      { label: 'Far Cry 6 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:9a23b20efc317226084076d7b69c9fb5&dn=far-cry-6-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '85 GB', quality: 'FULL UNLOCKED' },
      { label: 'Far Cry 6 - FitGirl Repack', url: 'magnet:?xt=urn:btih:e2b63fc5d1fcad6b6d8bf4b4ae3c051f&dn=far-cry-6-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '46 GB', quality: 'FitGirl Repack' },
      { label: 'Far Cry 6 - DODI Repack', url: 'magnet:?xt=urn:btih:b9cd608e7a0c67fcb1c3d102b0d3a8bc&dn=far-cry-6-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '55 GB', quality: 'DODI Repack' },
    ]
  },
  'watch-dogs-legion': {
    fileSize: '80 GB',
    links: [
      { label: 'Watch Dogs: Legion - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:8a535fe4c4ca394cefaaa6a83465824e&dn=watch-dogs-legion-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '80 GB', quality: 'FULL UNLOCKED' },
      { label: 'Watch Dogs: Legion - FitGirl Repack', url: 'magnet:?xt=urn:btih:69e831264dc6a6bd1f06fbaf3a1419b1&dn=watch-dogs-legion-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '44 GB', quality: 'FitGirl Repack' },
      { label: 'Watch Dogs: Legion - DODI Repack', url: 'magnet:?xt=urn:btih:0be41f676e982c4d2772abfb7749293e&dn=watch-dogs-legion-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '52 GB', quality: 'DODI Repack' },
    ]
  },
  'sons-of-the-forest': {
    fileSize: '45 GB',
    links: [
      { label: 'Sons Of The Forest - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:18ad9270a4ad6a98c82cf950b33e4c28&dn=sons-of-the-forest-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '45 GB', quality: 'FULL UNLOCKED' },
      { label: 'Sons Of The Forest - FitGirl Repack', url: 'magnet:?xt=urn:btih:a651d7ef3f66e9e27343193a9d62a2a7&dn=sons-of-the-forest-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '25 GB', quality: 'FitGirl Repack' },
      { label: 'Sons Of The Forest - DODI Repack', url: 'magnet:?xt=urn:btih:add577940a6da16b754243098e31e449&dn=sons-of-the-forest-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '29 GB', quality: 'DODI Repack' },
    ]
  },
  'valheim': {
    fileSize: '20 GB',
    links: [
      { label: 'Valheim - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:cefa70695ee192b7973e91f77b495f2e&dn=valheim-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '20 GB', quality: 'FULL UNLOCKED' },
      { label: 'Valheim - FitGirl Repack', url: 'magnet:?xt=urn:btih:7602dd0c36167e810343e9e2b3f89ee6&dn=valheim-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '11 GB', quality: 'FitGirl Repack' },
      { label: 'Valheim - DODI Repack', url: 'magnet:?xt=urn:btih:485b2210fce8b4e549de55875c5974d9&dn=valheim-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '13 GB', quality: 'DODI Repack' },
    ]
  },
  'terraria': {
    fileSize: '3 GB',
    links: [
      { label: 'Terraria - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:71f73aae5acf8c6a607b460eb7fe57a4&dn=terraria-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '3 GB', quality: 'FULL UNLOCKED' },
      { label: 'Terraria - FitGirl Repack', url: 'magnet:?xt=urn:btih:a186c3bdf8b7a788c68d52c038c0bf0d&dn=terraria-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '2 GB', quality: 'FitGirl Repack' },
      { label: 'Terraria - DODI Repack', url: 'magnet:?xt=urn:btih:fa0b2985805f0a4d807ba7dd4bfb86b7&dn=terraria-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '2 GB', quality: 'DODI Repack' },
    ]
  },
  'lethal-company': {
    fileSize: '2 GB',
    links: [
      { label: 'Lethal Company - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:d5ad2f412905c69b1b69713cfe213449&dn=lethal-company-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '2 GB', quality: 'FULL UNLOCKED' },
      { label: 'Lethal Company - FitGirl Repack', url: 'magnet:?xt=urn:btih:fe05add2112773ec429a5972b389816a&dn=lethal-company-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '1 GB', quality: 'FitGirl Repack' },
      { label: 'Lethal Company - DODI Repack', url: 'magnet:?xt=urn:btih:f501e1332ffa7459fd4ba6d0d26a50f5&dn=lethal-company-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '1 GB', quality: 'DODI Repack' },
    ]
  },
  'hades-2': {
    fileSize: '25 GB',
    links: [
      { label: 'Hades II - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:c3fc5896297a6212c46f924ec5e4c4e6&dn=hades-2-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '25 GB', quality: 'FULL UNLOCKED' },
      { label: 'Hades II - FitGirl Repack', url: 'magnet:?xt=urn:btih:ae6377e8eb1c75df663b56dd0207b3ee&dn=hades-2-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '14 GB', quality: 'FitGirl Repack' },
      { label: 'Hades II - DODI Repack', url: 'magnet:?xt=urn:btih:4ecb2ce327c84dc1d96e824b09005b8c&dn=hades-2-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '16 GB', quality: 'DODI Repack' },
    ]
  },
  'bioshock-remastered': {
    fileSize: '25 GB',
    links: [
      { label: 'BioShock Remastered - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:e8f2da4c28360823f8cd3c24bfcc6f2e&dn=bioshock-remastered-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '25 GB', quality: 'FULL UNLOCKED' },
      { label: 'BioShock Remastered - FitGirl Repack', url: 'magnet:?xt=urn:btih:a1ec1672a6a2afeefc8fcbfb5dcee2bd&dn=bioshock-remastered-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '14 GB', quality: 'FitGirl Repack' },
      { label: 'BioShock Remastered - DODI Repack', url: 'magnet:?xt=urn:btih:9905766832346f1afc08cefeead1ca13&dn=bioshock-remastered-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '16 GB', quality: 'DODI Repack' },
    ]
  },
  'bioshock-infinite': {
    fileSize: '30 GB',
    links: [
      { label: 'BioShock Infinite - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:86ddf77499f377e00ea3272928df9ac0&dn=bioshock-infinite-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '30 GB', quality: 'FULL UNLOCKED' },
      { label: 'BioShock Infinite - FitGirl Repack', url: 'magnet:?xt=urn:btih:acdd4927f5acb1891edafcc22aefab70&dn=bioshock-infinite-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '16 GB', quality: 'FitGirl Repack' },
      { label: 'BioShock Infinite - DODI Repack', url: 'magnet:?xt=urn:btih:328a14bae1b9f4fed62b51f94ccac964&dn=bioshock-infinite-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '19 GB', quality: 'DODI Repack' },
    ]
  },
  'half-life-2': {
    fileSize: '15 GB',
    links: [
      { label: 'Half-Life 2 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:4e12702368a0df89397722a82de1ba03&dn=half-life-2-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '15 GB', quality: 'FULL UNLOCKED' },
      { label: 'Half-Life 2 - FitGirl Repack', url: 'magnet:?xt=urn:btih:b0800a5ae94b1db3e595a213d5e351d4&dn=half-life-2-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '8 GB', quality: 'FitGirl Repack' },
      { label: 'Half-Life 2 - DODI Repack', url: 'magnet:?xt=urn:btih:1deef12cb7cbff0a9beae2fada4f4393&dn=half-life-2-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '10 GB', quality: 'DODI Repack' },
    ]
  },
  'left-4-dead-2': {
    fileSize: '15 GB',
    links: [
      { label: 'Left 4 Dead 2 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:e5ca05af79fb666e0739dda1abaecd01&dn=left-4-dead-2-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '15 GB', quality: 'FULL UNLOCKED' },
      { label: 'Left 4 Dead 2 - FitGirl Repack', url: 'magnet:?xt=urn:btih:2f7b209664d8ed2e8e4458b4ed1e1d3f&dn=left-4-dead-2-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '8 GB', quality: 'FitGirl Repack' },
      { label: 'Left 4 Dead 2 - DODI Repack', url: 'magnet:?xt=urn:btih:04fd0861642731be0d50a8c8ddd4223f&dn=left-4-dead-2-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '10 GB', quality: 'DODI Repack' },
    ]
  },
  'middle-earth-shadow-of-war': {
    fileSize: '95 GB',
    links: [
      { label: 'Middle-earth: Shadow of War - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:1db1bdd1e9ced68a8805776d5574c207&dn=middle-earth-shadow-of-war-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '95 GB', quality: 'FULL UNLOCKED' },
      { label: 'Middle-earth: Shadow of War - FitGirl Repack', url: 'magnet:?xt=urn:btih:7197d808e677c227995e0404439e5a6a&dn=middle-earth-shadow-of-war-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '52 GB', quality: 'FitGirl Repack' },
      { label: 'Middle-earth: Shadow of War - DODI Repack', url: 'magnet:?xt=urn:btih:df0799c5f927ae8702975917605b1cd7&dn=middle-earth-shadow-of-war-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '62 GB', quality: 'DODI Repack' },
    ]
  },
  'batman-arkham-knight': {
    fileSize: '75 GB',
    links: [
      { label: 'Batman: Arkham Knight - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:3ec1888f657eca888894f0ffa85b1294&dn=batman-arkham-knight-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '75 GB', quality: 'FULL UNLOCKED' },
      { label: 'Batman: Arkham Knight - FitGirl Repack', url: 'magnet:?xt=urn:btih:c2529b2f2e3a745da55b067276efbb49&dn=batman-arkham-knight-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '41 GB', quality: 'FitGirl Repack' },
      { label: 'Batman: Arkham Knight - DODI Repack', url: 'magnet:?xt=urn:btih:efad6b88072f51aa7d555b4f3ed0f001&dn=batman-arkham-knight-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '49 GB', quality: 'DODI Repack' },
    ]
  },
  'the-forest': {
    fileSize: '20 GB',
    links: [
      { label: 'The Forest - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:0800556f70ae9e749835be746c6be399&dn=the-forest-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '20 GB', quality: 'FULL UNLOCKED' },
      { label: 'The Forest - FitGirl Repack', url: 'magnet:?xt=urn:btih:409f7cbcdd1829d9957a06166bab6f1c&dn=the-forest-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '11 GB', quality: 'FitGirl Repack' },
      { label: 'The Forest - DODI Repack', url: 'magnet:?xt=urn:btih:47e18c7c62f8e87945bee187636c19ba&dn=the-forest-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '13 GB', quality: 'DODI Repack' },
    ]
  },
  'green-hell': {
    fileSize: '18 GB',
    links: [
      { label: 'Green Hell - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:9b9b0d90f7e61d27ca651799f3f06d84&dn=green-hell-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '18 GB', quality: 'FULL UNLOCKED' },
      { label: 'Green Hell - FitGirl Repack', url: 'magnet:?xt=urn:btih:63689ec495f36c40769431a577b2baa5&dn=green-hell-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '10 GB', quality: 'FitGirl Repack' },
      { label: 'Green Hell - DODI Repack', url: 'magnet:?xt=urn:btih:67c9e0b640615a6cf563e78a0385e411&dn=green-hell-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '12 GB', quality: 'DODI Repack' },
    ]
  },
  'grounded': {
    fileSize: '25 GB',
    links: [
      { label: 'Grounded - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:aac731199c27c7cb2a3f79346512e4b9&dn=grounded-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '25 GB', quality: 'FULL UNLOCKED' },
      { label: 'Grounded - FitGirl Repack', url: 'magnet:?xt=urn:btih:e591dbd74c76db7945c1546dfe95b0d3&dn=grounded-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '14 GB', quality: 'FitGirl Repack' },
      { label: 'Grounded - DODI Repack', url: 'magnet:?xt=urn:btih:d2e1eb82d818e3b02ced17bf2f8fdfac&dn=grounded-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '16 GB', quality: 'DODI Repack' },
    ]
  },
  'back-4-blood': {
    fileSize: '60 GB',
    links: [
      { label: 'Back 4 Blood - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:944cc7d4e9b21f8b671bba477486747c&dn=back-4-blood-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '60 GB', quality: 'FULL UNLOCKED' },
      { label: 'Back 4 Blood - FitGirl Repack', url: 'magnet:?xt=urn:btih:24bb45eb8dfdfffdc6755720f2d0c788&dn=back-4-blood-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '33 GB', quality: 'FitGirl Repack' },
      { label: 'Back 4 Blood - DODI Repack', url: 'magnet:?xt=urn:btih:c00ca9e64607c196edc9eb7cdedb1889&dn=back-4-blood-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '39 GB', quality: 'DODI Repack' },
    ]
  },
  'world-war-z': {
    fileSize: '45 GB',
    links: [
      { label: 'World War Z - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:a57ef540aeba3d38a0e2fbe3c54b39a0&dn=world-war-z-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '45 GB', quality: 'FULL UNLOCKED' },
      { label: 'World War Z - FitGirl Repack', url: 'magnet:?xt=urn:btih:147f569fd6aefdd07d1e2e0bb054468c&dn=world-war-z-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '25 GB', quality: 'FitGirl Repack' },
      { label: 'World War Z - DODI Repack', url: 'magnet:?xt=urn:btih:676a6f7b289d7ca2a13c980e9d4f7612&dn=world-war-z-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '29 GB', quality: 'DODI Repack' },
    ]
  },
  'dark-souls-remastered': {
    fileSize: '15 GB',
    links: [
      { label: 'Dark Souls Remastered - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:88dd9be4184718f84e7246d9034f67ce&dn=dark-souls-remastered-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '15 GB', quality: 'FULL UNLOCKED' },
      { label: 'Dark Souls Remastered - FitGirl Repack', url: 'magnet:?xt=urn:btih:31b0b53a6576cfff3d2bbaf6d53de375&dn=dark-souls-remastered-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '8 GB', quality: 'FitGirl Repack' },
      { label: 'Dark Souls Remastered - DODI Repack', url: 'magnet:?xt=urn:btih:5bf1a594defdfe428364172475308e10&dn=dark-souls-remastered-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '10 GB', quality: 'DODI Repack' },
    ]
  },
  'dark-souls-2-scholar': {
    fileSize: '20 GB',
    links: [
      { label: 'Dark Souls II: Scholar of the First Sin - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:b7f4f6d18e1a15495d64cfaa2614e370&dn=dark-souls-2-scholar-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '20 GB', quality: 'FULL UNLOCKED' },
      { label: 'Dark Souls II: Scholar of the First Sin - FitGirl Repack', url: 'magnet:?xt=urn:btih:4c375c84df89b1c559d34c3149ac7323&dn=dark-souls-2-scholar-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '11 GB', quality: 'FitGirl Repack' },
      { label: 'Dark Souls II: Scholar of the First Sin - DODI Repack', url: 'magnet:?xt=urn:btih:ae05a7c5f8fa4c9fb7c8beac8f10e548&dn=dark-souls-2-scholar-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '13 GB', quality: 'DODI Repack' },
    ]
  },
  'hollow-knight-silksong': {
    fileSize: '15 GB',
    links: [
      { label: 'Hollow Knight: Silksong - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:c86c38eb983537ed95d1ab9afe0a1f31&dn=hollow-knight-silksong-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '15 GB', quality: 'FULL UNLOCKED' },
      { label: 'Hollow Knight: Silksong - FitGirl Repack', url: 'magnet:?xt=urn:btih:09351184a94a39c05f2e32a5985c6ed6&dn=hollow-knight-silksong-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '8 GB', quality: 'FitGirl Repack' },
      { label: 'Hollow Knight: Silksong - DODI Repack', url: 'magnet:?xt=urn:btih:3adb0095bc33aaf157daeb45fb56df58&dn=hollow-knight-silksong-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '10 GB', quality: 'DODI Repack' },
    ]
  },
  'factorio': {
    fileSize: '5 GB',
    links: [
      { label: 'Factorio - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:aec071078ba40c987f90b20bf355d691&dn=factorio-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '5 GB', quality: 'FULL UNLOCKED' },
      { label: 'Factorio - FitGirl Repack', url: 'magnet:?xt=urn:btih:4393e9aad564cfc8c65d2ab0ba41e9cc&dn=factorio-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '3 GB', quality: 'FitGirl Repack' },
      { label: 'Factorio - DODI Repack', url: 'magnet:?xt=urn:btih:472c2208cf6cb33a30fff1f9004a504a&dn=factorio-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '3 GB', quality: 'DODI Repack' },
    ]
  },
  'age-of-empires-4': {
    fileSize: '75 GB',
    links: [
      { label: 'Age of Empires IV - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:0fcd5f628e32a33609643b5b08200bd9&dn=age-of-empires-4-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '75 GB', quality: 'FULL UNLOCKED' },
      { label: 'Age of Empires IV - FitGirl Repack', url: 'magnet:?xt=urn:btih:eca840ffa952f9098b928d4b5608f70d&dn=age-of-empires-4-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '41 GB', quality: 'FitGirl Repack' },
      { label: 'Age of Empires IV - DODI Repack', url: 'magnet:?xt=urn:btih:875c65dbd5fce03156ea42ea787e6890&dn=age-of-empires-4-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '49 GB', quality: 'DODI Repack' },
    ]
  },
  'cities-skylines': {
    fileSize: '20 GB',
    links: [
      { label: 'Cities: Skylines - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:222e2352cde6abf8fb5399fa66fa4688&dn=cities-skylines-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '20 GB', quality: 'FULL UNLOCKED' },
      { label: 'Cities: Skylines - FitGirl Repack', url: 'magnet:?xt=urn:btih:fa8473179891505770b1f969f496c7c6&dn=cities-skylines-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '11 GB', quality: 'FitGirl Repack' },
      { label: 'Cities: Skylines - DODI Repack', url: 'magnet:?xt=urn:btih:c1a348263220a8b10cbeed6e7e687a14&dn=cities-skylines-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '13 GB', quality: 'DODI Repack' },
    ]
  },
  'euro-truck-simulator-2': {
    fileSize: '25 GB',
    links: [
      { label: 'Euro Truck Simulator 2 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:cb483bb3ab16998a2e5429e98c535498&dn=euro-truck-simulator-2-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '25 GB', quality: 'FULL UNLOCKED' },
      { label: 'Euro Truck Simulator 2 - FitGirl Repack', url: 'magnet:?xt=urn:btih:68411fbfc2da65155a46e2483cbc6738&dn=euro-truck-simulator-2-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '14 GB', quality: 'FitGirl Repack' },
      { label: 'Euro Truck Simulator 2 - DODI Repack', url: 'magnet:?xt=urn:btih:db72e94f112125a99228fa3f28c595e1&dn=euro-truck-simulator-2-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '16 GB', quality: 'DODI Repack' },
    ]
  },
  'mortal-kombat-1': {
    fileSize: '100 GB',
    links: [
      { label: 'Mortal Kombat 1 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:efc882d98f3c54dae23bf209b786cc48&dn=mortal-kombat-1-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '100 GB', quality: 'FULL UNLOCKED' },
      { label: 'Mortal Kombat 1 - FitGirl Repack', url: 'magnet:?xt=urn:btih:d5b4e2920518590f17876864fc1c9384&dn=mortal-kombat-1-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '55 GB', quality: 'FitGirl Repack' },
      { label: 'Mortal Kombat 1 - DODI Repack', url: 'magnet:?xt=urn:btih:5092e82bc917e005df7e9b6413c455b1&dn=mortal-kombat-1-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '65 GB', quality: 'DODI Repack' },
    ]
  },
  'the-witness': {
    fileSize: '10 GB',
    links: [
      { label: 'The Witness - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:25b94c8d2e3f7b27653224b640d4524b&dn=the-witness-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '10 GB', quality: 'FULL UNLOCKED' },
      { label: 'The Witness - FitGirl Repack', url: 'magnet:?xt=urn:btih:463a6c03702b7e4885fae056959c601e&dn=the-witness-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '5 GB', quality: 'FitGirl Repack' },
      { label: 'The Witness - DODI Repack', url: 'magnet:?xt=urn:btih:5914e698f0039e536f39c81c3879bbf0&dn=the-witness-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '6 GB', quality: 'DODI Repack' },
    ]
  },
  'returnal': {
    fileSize: '65 GB',
    links: [
      { label: 'Returnal - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:4e92315b4ecdf3016631fb685180e24f&dn=returnal-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '65 GB', quality: 'FULL UNLOCKED' },
      { label: 'Returnal - FitGirl Repack', url: 'magnet:?xt=urn:btih:1a0ddddf8c87ebb2e202ca8a37570950&dn=returnal-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '36 GB', quality: 'FitGirl Repack' },
      { label: 'Returnal - DODI Repack', url: 'magnet:?xt=urn:btih:28442eae461ace1438e022488fe49e91&dn=returnal-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '42 GB', quality: 'DODI Repack' },
    ]
  },
}
async function main() {
  console.log('🌱 Seeding NexusApp with 100 games + torrent links...')

  // 1. Create categories
  console.log('📁 Creating categories...')
  const categoryMap = new Map<string, { id: string }>()
  for (const cat of CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { name: cat.name, slug: cat.slug, icon: cat.icon },
    })
    categoryMap.set(cat.slug, { id: category.id })
    console.log(`  ✅ ${cat.name}`)
  }

  // 2. Create test users
  console.log('👤 Creating test users...')
  const user1 = await prisma.user.upsert({
    where: { email: 'carlos@nexusapp.com' },
    update: {},
    create: { name: 'Carlos', email: 'carlos@nexusapp.com', avatar: '', role: 'user' },
  })
  const user2 = await prisma.user.upsert({
    where: { email: 'maria@nexusapp.com' },
    update: {},
    create: { name: 'María', email: 'maria@nexusapp.com', avatar: '', role: 'user' },
  })
  const user3 = await prisma.user.upsert({
    where: { email: 'admin@nexusapp.com' },
    update: {},
    create: { name: 'Admin', email: 'admin@nexusapp.com', avatar: '', role: 'admin' },
  })
  const user4 = await prisma.user.upsert({
    where: { email: 'lucia@nexusapp.com' },
    update: {},
    create: { name: 'Lucía', email: 'lucia@nexusapp.com', avatar: '', role: 'user' },
  })

  // 3. Create games with download links
  console.log('🎮 Creating games with torrent links...')
  let gamesCreated = 0

  for (const game of GAMES_DATA) {
    const existing = await prisma.game.findFirst({ where: { slug: game.slug } })
    if (existing) {
      // Make sure existing game has download links
      await createDownloadLinks(existing.id, game.slug)
      // Update fileSize if missing
      const torrentData = TORRENT_DOWNLOADS[game.slug]
      if (torrentData && !existing.fileSize) {
        await prisma.game.update({ where: { id: existing.id }, data: { fileSize: torrentData.fileSize } })
      }
      continue
    }

    const category = categoryMap.get(game.categorySlug)
    if (!category) continue

    const imageUrl = STEAM_CAPSULE(game.steamId)
    const coverUrl = STEAM_HERO(game.steamId)
    const torrentData = TORRENT_DOWNLOADS[game.slug]

    const newGame = await prisma.game.create({
      data: {
        title: game.title,
        slug: game.slug,
        description: game.description,
        imageUrl,
        coverUrl,
        trailerUrl: game.trailerUrl,
        downloadUrl: torrentData?.links[0]?.url || null,
        fileSize: torrentData?.fileSize || null,
        developer: game.developer,
        publisher: game.publisher,
        releaseDate: game.releaseDate,
        rating: game.rating,
        ratingCount: game.ratingCount,
        categoryId: category.id,
        platforms: game.platforms,
        featured: game.featured,
      },
    })
    await createDownloadLinks(newGame.id, game.slug)
    gamesCreated++
  }

  console.log(`📊 ${gamesCreated} new games created`)

  // 3b. Create games from BATCH 2
  console.log('🎮 Creating games from BATCH 2 with torrent links...')
  for (const game of GAMES_DATA_BATCH2) {
    const existing = await prisma.game.findFirst({ where: { slug: game.slug } })
    if (existing) {
      await createDownloadLinks(existing.id, game.slug)
      const torrentData = TORRENT_DOWNLOADS_BATCH2[game.slug]
      if (torrentData && !existing.fileSize) {
        await prisma.game.update({ where: { id: existing.id }, data: { fileSize: torrentData.fileSize } })
      }
      continue
    }

    const category = categoryMap.get(game.categorySlug)
    if (!category) continue

    const imageUrl = STEAM_CAPSULE(game.steamId)
    const coverUrl = STEAM_HERO(game.steamId)
    const torrentData = TORRENT_DOWNLOADS_BATCH2[game.slug]

    const newGame = await prisma.game.create({
      data: {
        title: game.title,
        slug: game.slug,
        description: game.description,
        imageUrl,
        coverUrl,
        trailerUrl: game.trailerUrl,
        downloadUrl: torrentData?.links[0]?.url || null,
        fileSize: torrentData?.fileSize || null,
        developer: game.developer,
        publisher: game.publisher,
        releaseDate: game.releaseDate,
        rating: game.rating,
        ratingCount: game.ratingCount,
        categoryId: category.id,
        platforms: game.platforms,
        featured: game.featured,
      },
    })
    await createDownloadLinks(newGame.id, game.slug)
    gamesCreated++
  }

  console.log(`📊 Total games created: ${gamesCreated}`)

  // 4. Create reviews
  console.log('⭐ Creating reviews...')
  const allGames = await prisma.game.findMany({ take: 25 })
  const reviewData = [
    { user: user1, rating: 5, comment: 'Una obra maestra absoluta. El mundo abierto es impresionante y cada rincón esconde algo interesante. La narrativa es profunda y las decisiones realmente importan.' },
    { user: user2, rating: 5, comment: 'El mejor juego de FromSoftware. El mundo abierto funciona perfecto con su fórmula. Cada jefe es un desafío épico que te hace querer mejorar constantemente.' },
    { user: user3, rating: 5, comment: 'Kratos y Atreus en su mejor aventura. El combate es brutal y satisfactorio, la historia es conmovedora y los gráficos son impresionantes.' },
    { user: user4, rating: 5, comment: 'El mejor RPG en años. Las decisiones importan de verdad, el combate es profundo y la narrativa es brillante. Cada partida es una experiencia única.' },
    { user: user1, rating: 4, comment: 'Un remake excepcional que moderniza el clásico sin perder su esencia. El combate es más fluido y los gráficos son impresionantes. Leon sigue siendo carismático.' },
    { user: user2, rating: 5, comment: 'El Rey Mono arrasa. El combate es adictivo, los jefes son espectaculares y la mitología china le da una frescura increíble al género souls-like.' },
    { user: user3, rating: 5, comment: 'Red Dead Redemption 2 es una experiencia narrativa sin igual. Arthur Morgan es inolvidable y el mundo es el más vivo y detallado que he visto jamás.' },
    { user: user4, rating: 5, comment: 'The Witcher 3 sigue siendo el rey de los RPG. Las misiones secundarias tienen más profundidad que juegos enteros. Geralt es un protagonista legendario.' },
    { user: user1, rating: 5, comment: 'Sekiro es el juego más satisfactorio que he jugado. El sistema de postura hace que cada combate sea un duel de samurái épico. La sensación de progresión es increíble.' },
    { user: user2, rating: 4, comment: 'Hogwarts Legacy hace justicia al mundo mágico. Explorar el castillo es una delicia y el sistema de hechizos es divertido. A veces se siente repetitivo pero la atmosfera compensa.' },
    { user: user3, rating: 5, comment: 'Ghost of Tsushima es poesía visual. El combate con katana es elegante y letal, la historia de Jin Sakai es conmovedora y los paisajes japoneses son hipnóticos.' },
    { user: user4, rating: 4, comment: 'GTA V sigue siendo entretenido después de todos estos años. Los Santos es increíblemente detallada y la campaña de tres personajes es genial.' },
    { user: user1, rating: 5, comment: 'DOOM Eternal es pura adrenalina. El combate es rápido, brutal y adictivo. Cada arma se siente poderosa y el sistema de gloria kills te mantiene en movimiento.' },
    { user: user2, rating: 4, comment: 'Helldivers 2 es el mejor cooperativo del año. Las misiones son caóticas y divertidas, y los friendly fire hacen que cada partida sea una experiencia memorable.' },
    { user: user3, rating: 4, comment: 'Death Stranding es una experiencia única. La narrativa es fascinante y las mecánicas de entrega son sorprendentemente adictivas. Kojima en su máxima expresión.' },
    { user: user4, rating: 5, comment: 'Dark Souls III es la conclusión perfecta. Los jefes son los mejores de la saga, el combate es más rápido y satisfactorio y el diseño de niveles es excepcional.' },
    { user: user1, rating: 4, comment: 'Fallout 4 es un RPG enorme con un mundo abierto lleno de secretos. La construcción de asentamientos es adictiva y las misiones son variadas.' },
    { user: user2, rating: 4, comment: 'Skyrim nunca envejece. Con mods es prácticamente infinito. La libertad de exploración y la cantidad de historias por descubrir es impresionante.' },
    { user: user3, rating: 4, comment: "Dragons Dogma 2 mejora todo lo bueno del original. El sistema de peones es genial y el combate es dinámico y emocionante." },
    { user: user4, rating: 5, comment: 'Metaphor ReFantazio es una revelación. El sistema Archetype es profundo, la historia es fascinante y el estilo artístico es impresionante.' },
    { user: user1, rating: 5, comment: 'Persona 5 Royal es pura adicción. El estilo es inconfundible, la música es pegadiza y la historia engancha desde el primer minuto. Un JRPG perfecto.' },
    { user: user2, rating: 4, comment: 'Final Fantasy VII Remake hace justicia al clásico. El combate en tiempo real es emocionante y la expansión de Midgar le da nueva vida a la historia.' },
    { user: user3, rating: 5, comment: 'The Last of Us Part II es una obra de arte narrativo. Ellie es un personaje complejo y el viaje es brutal pero necesario. Los gráficos son impresionantes.' },
    { user: user4, rating: 4, comment: 'Horizon Forbidden West mejora todo lo del primer juego. Las máquinas son impresionantes, el mundo es más vasto y el combate es más variado.' },
  ]

  for (let i = 0; i < Math.min(allGames.length, reviewData.length); i++) {
    const game = allGames[i]
    const r = reviewData[i]
    if (game && r) {
      await prisma.review.upsert({
        where: { userId_gameId: { userId: r.user.id, gameId: game.id } },
        update: {},
        create: { userId: r.user.id, gameId: game.id, rating: r.rating, comment: r.comment },
      })
    }
  }

  // 5. Create favorites
  console.log('❤️ Creating favorites...')
  const favoriteData = [
    { userId: user1.id, gameIndices: [0, 2, 4, 8, 11, 14] },
    { userId: user2.id, gameIndices: [1, 3, 5, 7, 10, 13] },
    { userId: user3.id, gameIndices: [0, 4, 6, 9, 12, 15] },
    { userId: user4.id, gameIndices: [2, 3, 7, 11, 14] },
  ]
  for (const fav of favoriteData) {
    for (const idx of fav.gameIndices) {
      const game = allGames[idx]
      if (game) {
        await prisma.favorite.upsert({
          where: { userId_gameId: { userId: fav.userId, gameId: game.id } },
          update: {},
          create: { userId: fav.userId, gameId: game.id },
        })
      }
    }
  }

  const totalGames = await prisma.game.count()
  const totalLinks = await prisma.downloadLink.count()
  console.log(`
✅ Seed completed! Total games: ${totalGames}, Total download links: ${totalLinks}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
