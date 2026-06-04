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
      { label: 'Cyberpunk 2077 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:000000000000000000000000000000002f5e96ed&dn=cyberpunk-2077-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '70 GB', quality: 'FULL UNLOCKED' },
      { label: 'Cyberpunk 2077 - FitGirl Repack', url: 'magnet:?xt=urn:btih:00000000000000000000000000000000249170d0&dn=cyberpunk-2077-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '39 GB', quality: 'FitGirl Repack' },
      { label: 'Cyberpunk 2077 - DODI Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000002f9f0bd3&dn=cyberpunk-2077-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '46 GB', quality: 'DODI Repack' },
    ]
  },
  'elden-ring': {
    fileSize: '50 GB',
    links: [
      { label: 'Elden Ring - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:00000000000000000000000000000000411e4fe6&dn=elden-ring-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '50 GB', quality: 'FULL UNLOCKED' },
      { label: 'Elden Ring - FitGirl Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000004ead1409&dn=elden-ring-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '28 GB', quality: 'FitGirl Repack' },
      { label: 'Elden Ring - DODI Repack', url: 'magnet:?xt=urn:btih:00000000000000000000000000000000144bdb3a&dn=elden-ring-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '33 GB', quality: 'DODI Repack' },
    ]
  },
  'god-of-war-ragnarok': {
    fileSize: '90 GB',
    links: [
      { label: 'God of War Ragnarök - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:00000000000000000000000000000000669714b0&dn=god-of-war-ragnarok-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '90 GB', quality: 'FULL UNLOCKED' },
      { label: 'God of War Ragnarök - FitGirl Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000007c448353&dn=god-of-war-ragnarok-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '50 GB', quality: 'FitGirl Repack' },
      { label: 'God of War Ragnarök - DODI Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000000a563fd0&dn=god-of-war-ragnarok-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '59 GB', quality: 'DODI Repack' },
    ]
  },
  'baldurs-gate-3': {
    fileSize: '120 GB',
    links: [
      { label: 'Baldurs Gate 3 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000018a425a2&dn=baldurs-gate-3-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '120 GB', quality: 'FULL UNLOCKED' },
      { label: 'Baldurs Gate 3 - FitGirl Repack', url: 'magnet:?xt=urn:btih:00000000000000000000000000000000613adc81&dn=baldurs-gate-3-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '66 GB', quality: 'FitGirl Repack' },
      { label: 'Baldurs Gate 3 - DODI Repack', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000036efa5c2&dn=baldurs-gate-3-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '78 GB', quality: 'DODI Repack' },
    ]
  },
  'resident-evil-4-remake': {
    fileSize: '55 GB',
    links: [
      { label: 'Resident Evil 4 Remake - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000049a16c79&dn=resident-evil-4-remake-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '55 GB', quality: 'FULL UNLOCKED' },
      { label: 'Resident Evil 4 Remake - FitGirl Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000000cbbcbea&dn=resident-evil-4-remake-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '30 GB', quality: 'FitGirl Repack' },
      { label: 'Resident Evil 4 Remake - DODI Repack', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000034d9e907&dn=resident-evil-4-remake-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '36 GB', quality: 'DODI Repack' },
    ]
  },
  'black-myth-wukong': {
    fileSize: '130 GB',
    links: [
      { label: 'Black Myth: Wukong - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:000000000000000000000000000000006732eac3&dn=black-myth-wukong-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '130 GB', quality: 'FULL UNLOCKED' },
      { label: 'Black Myth: Wukong - FitGirl Repack', url: 'magnet:?xt=urn:btih:00000000000000000000000000000000580b3dda&dn=black-myth-wukong-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '72 GB', quality: 'FitGirl Repack' },
      { label: 'Black Myth: Wukong - DODI Repack', url: 'magnet:?xt=urn:btih:00000000000000000000000000000000240f2a3d&dn=black-myth-wukong-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '85 GB', quality: 'DODI Repack' },
    ]
  },
  'red-dead-redemption-2': {
    fileSize: '120 GB',
    links: [
      { label: 'Red Dead Redemption 2 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000037f5cb60&dn=red-dead-redemption-2-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '120 GB', quality: 'FULL UNLOCKED' },
      { label: 'Red Dead Redemption 2 - FitGirl Repack', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000025bed9fd&dn=red-dead-redemption-2-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '66 GB', quality: 'FitGirl Repack' },
      { label: 'Red Dead Redemption 2 - DODI Repack', url: 'magnet:?xt=urn:btih:00000000000000000000000000000000173f9b80&dn=red-dead-redemption-2-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '78 GB', quality: 'DODI Repack' },
    ]
  },
  'the-witcher-3-wild-hunt': {
    fileSize: '50 GB',
    links: [
      { label: 'The Witcher 3: Wild Hunt - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:000000000000000000000000000000003bcfc7d6&dn=the-witcher-3-wild-hunt-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '50 GB', quality: 'FULL UNLOCKED' },
      { label: 'The Witcher 3: Wild Hunt - FitGirl Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000000dc43807&dn=the-witcher-3-wild-hunt-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '28 GB', quality: 'FitGirl Repack' },
      { label: 'The Witcher 3: Wild Hunt - DODI Repack', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000025ab2d4a&dn=the-witcher-3-wild-hunt-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '33 GB', quality: 'DODI Repack' },
    ]
  },
  'sekiro-shadows-die-twice': {
    fileSize: '25 GB',
    links: [
      { label: 'Sekiro: Shadows Die Twice - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000068f79abc&dn=sekiro-shadows-die-twice-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '25 GB', quality: 'FULL UNLOCKED' },
      { label: 'Sekiro: Shadows Die Twice - FitGirl Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000001ce71c5f&dn=sekiro-shadows-die-twice-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '14 GB', quality: 'FitGirl Repack' },
      { label: 'Sekiro: Shadows Die Twice - DODI Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000006938a2a4&dn=sekiro-shadows-die-twice-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '16 GB', quality: 'DODI Repack' },
    ]
  },
  'hogwarts-legacy': {
    fileSize: '85 GB',
    links: [
      { label: 'Hogwarts Legacy - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:000000000000000000000000000000003121ea4e&dn=hogwarts-legacy-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '85 GB', quality: 'FULL UNLOCKED' },
      { label: 'Hogwarts Legacy - FitGirl Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000003fdbd78f&dn=hogwarts-legacy-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '47 GB', quality: 'FitGirl Repack' },
      { label: 'Hogwarts Legacy - DODI Repack', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000054bb5fd2&dn=hogwarts-legacy-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '55 GB', quality: 'DODI Repack' },
    ]
  },
  'ghost-of-tsushima': {
    fileSize: '75 GB',
    links: [
      { label: 'Ghost of Tsushima - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:00000000000000000000000000000000311beced&dn=ghost-of-tsushima-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '75 GB', quality: 'FULL UNLOCKED' },
      { label: 'Ghost of Tsushima - FitGirl Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000000c8c418a&dn=ghost-of-tsushima-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '41 GB', quality: 'FitGirl Repack' },
      { label: 'Ghost of Tsushima - DODI Repack', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000008ba0fed&dn=ghost-of-tsushima-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '49 GB', quality: 'DODI Repack' },
    ]
  },
  'grand-theft-auto-v': {
    fileSize: '100 GB',
    links: [
      { label: 'Grand Theft Auto V - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:00000000000000000000000000000000056325f6&dn=grand-theft-auto-v-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '100 GB', quality: 'FULL UNLOCKED' },
      { label: 'Grand Theft Auto V - FitGirl Repack', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000050afd1e7&dn=grand-theft-auto-v-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '55 GB', quality: 'FitGirl Repack' },
      { label: 'Grand Theft Auto V - DODI Repack', url: 'magnet:?xt=urn:btih:00000000000000000000000000000000654284d6&dn=grand-theft-auto-v-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '65 GB', quality: 'DODI Repack' },
    ]
  },
  'doom-eternal': {
    fileSize: '60 GB',
    links: [
      { label: 'DOOM Eternal - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:000000000000000000000000000000007e81dfdc&dn=doom-eternal-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '60 GB', quality: 'FULL UNLOCKED' },
      { label: 'DOOM Eternal - FitGirl Repack', url: 'magnet:?xt=urn:btih:00000000000000000000000000000000409fdbc7&dn=doom-eternal-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '33 GB', quality: 'FitGirl Repack' },
      { label: 'DOOM Eternal - DODI Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000004fbe5c3c&dn=doom-eternal-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '39 GB', quality: 'DODI Repack' },
    ]
  },
  'helldivers-2': {
    fileSize: '70 GB',
    links: [
      { label: 'Helldivers 2 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000033db205a&dn=helldivers-2-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '70 GB', quality: 'FULL UNLOCKED' },
      { label: 'Helldivers 2 - FitGirl Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000000a6b6c37&dn=helldivers-2-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '39 GB', quality: 'FitGirl Repack' },
      { label: 'Helldivers 2 - DODI Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000005fda737a&dn=helldivers-2-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '46 GB', quality: 'DODI Repack' },
    ]
  },
  'death-stranding': {
    fileSize: '75 GB',
    links: [
      { label: 'Death Stranding - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000056115f86&dn=death-stranding-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '75 GB', quality: 'FULL UNLOCKED' },
      { label: 'Death Stranding - FitGirl Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000006ec0799d&dn=death-stranding-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '41 GB', quality: 'FitGirl Repack' },
      { label: 'Death Stranding - DODI Repack', url: 'magnet:?xt=urn:btih:00000000000000000000000000000000633781da&dn=death-stranding-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '49 GB', quality: 'DODI Repack' },
    ]
  },
  'dark-souls-iii': {
    fileSize: '40 GB',
    links: [
      { label: 'Dark Souls III - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000025b233b8&dn=dark-souls-iii-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '40 GB', quality: 'FULL UNLOCKED' },
      { label: 'Dark Souls III - FitGirl Repack', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000067d43ba5&dn=dark-souls-iii-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '22 GB', quality: 'FitGirl Repack' },
      { label: 'Dark Souls III - DODI Repack', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000028495c28&dn=dark-souls-iii-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '26 GB', quality: 'DODI Repack' },
    ]
  },
  'fallout-4': {
    fileSize: '35 GB',
    links: [
      { label: 'Fallout 4 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:000000000000000000000000000000001ff6f19d&dn=fallout-4-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '35 GB', quality: 'FULL UNLOCKED' },
      { label: 'Fallout 4 - FitGirl Repack', url: 'magnet:?xt=urn:btih:00000000000000000000000000000000493f4dc6&dn=fallout-4-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '19 GB', quality: 'FitGirl Repack' },
      { label: 'Fallout 4 - DODI Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000002999429d&dn=fallout-4-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '23 GB', quality: 'DODI Repack' },
    ]
  },
  'the-elder-scrolls-v-skyrim': {
    fileSize: '15 GB',
    links: [
      { label: 'The Elder Scrolls V: Skyrim - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:000000000000000000000000000000006d6614cb&dn=the-elder-scrolls-v-skyrim-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '15 GB', quality: 'FULL UNLOCKED' },
      { label: 'The Elder Scrolls V: Skyrim - FitGirl Repack', url: 'magnet:?xt=urn:btih:00000000000000000000000000000000777ace2e&dn=the-elder-scrolls-v-skyrim-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '8 GB', quality: 'FitGirl Repack' },
    ]
  },
  'dragons-dogma-2': {
    fileSize: '65 GB',
    links: [
      { label: 'Dragons Dogma 2 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:000000000000000000000000000000001e1b8eab&dn=dragons-dogma-2-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '65 GB', quality: 'FULL UNLOCKED' },
      { label: 'Dragons Dogma 2 - FitGirl Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000006be53ac8&dn=dragons-dogma-2-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '36 GB', quality: 'FitGirl Repack' },
      { label: 'Dragons Dogma 2 - DODI Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000003524506b&dn=dragons-dogma-2-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '42 GB', quality: 'DODI Repack' },
    ]
  },
  'metaphor-refantazio': {
    fileSize: '55 GB',
    links: [
      { label: 'Metaphor: ReFantazio - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000031b3cb63&dn=metaphor-refantazio-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '55 GB', quality: 'FULL UNLOCKED' },
      { label: 'Metaphor: ReFantazio - FitGirl Repack', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000064aaba80&dn=metaphor-refantazio-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '30 GB', quality: 'FitGirl Repack' },
      { label: 'Metaphor: ReFantazio - DODI Repack', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000021b1a023&dn=metaphor-refantazio-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '36 GB', quality: 'DODI Repack' },
    ]
  },
  'like-a-dragon-infinite-wealth': {
    fileSize: '60 GB',
    links: [
      { label: 'Like a Dragon: Infinite Wealth - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000060dcdc0f&dn=like-a-dragon-infinite-wealth-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '60 GB', quality: 'FULL UNLOCKED' },
      { label: 'Like a Dragon: Infinite Wealth - FitGirl Repack', url: 'magnet:?xt=urn:btih:00000000000000000000000000000000223d698e&dn=like-a-dragon-infinite-wealth-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '33 GB', quality: 'FitGirl Repack' },
      { label: 'Like a Dragon: Infinite Wealth - DODI Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000002f91668f&dn=like-a-dragon-infinite-wealth-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '39 GB', quality: 'DODI Repack' },
    ]
  },
  'persona-5-royal': {
    fileSize: '40 GB',
    links: [
      { label: 'Persona 5 Royal - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:00000000000000000000000000000000649327ef&dn=persona-5-royal-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '40 GB', quality: 'FULL UNLOCKED' },
      { label: 'Persona 5 Royal - FitGirl Repack', url: 'magnet:?xt=urn:btih:00000000000000000000000000000000285a5a52&dn=persona-5-royal-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '22 GB', quality: 'FitGirl Repack' },
      { label: 'Persona 5 Royal - DODI Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000001d306191&dn=persona-5-royal-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '26 GB', quality: 'DODI Repack' },
    ]
  },
  'final-fantasy-vii-remake': {
    fileSize: '90 GB',
    links: [
      { label: 'Final Fantasy VII Remake - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:00000000000000000000000000000000187ec147&dn=final-fantasy-vii-remake-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '90 GB', quality: 'FULL UNLOCKED' },
      { label: 'Final Fantasy VII Remake - FitGirl Repack', url: 'magnet:?xt=urn:btih:00000000000000000000000000000000208c69aa&dn=final-fantasy-vii-remake-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '50 GB', quality: 'FitGirl Repack' },
      { label: 'Final Fantasy VII Remake - DODI Repack', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000041905139&dn=final-fantasy-vii-remake-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '59 GB', quality: 'DODI Repack' },
    ]
  },
  'the-last-of-us-part-ii': {
    fileSize: '80 GB',
    links: [
      { label: 'The Last of Us Part II - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:00000000000000000000000000000000395ac197&dn=the-last-of-us-part-ii-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '80 GB', quality: 'FULL UNLOCKED' },
      { label: 'The Last of Us Part II - FitGirl Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000005df3c206&dn=the-last-of-us-part-ii-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '44 GB', quality: 'FitGirl Repack' },
      { label: 'The Last of Us Part II - DODI Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000001c56a117&dn=the-last-of-us-part-ii-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '52 GB', quality: 'DODI Repack' },
    ]
  },
  'assassins-creed-shadows': {
    fileSize: '95 GB',
    links: [
      { label: 'Assassins Creed Shadows - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:00000000000000000000000000000000408db541&dn=assassins-creed-shadows-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '95 GB', quality: 'FULL UNLOCKED' },
      { label: 'Assassins Creed Shadows - FitGirl Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000005ddc1424&dn=assassins-creed-shadows-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '52 GB', quality: 'FitGirl Repack' },
      { label: 'Assassins Creed Shadows - DODI Repack', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000063a348ff&dn=assassins-creed-shadows-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '62 GB', quality: 'DODI Repack' },
    ]
  },
  'horizon-forbidden-west': {
    fileSize: '95 GB',
    links: [
      { label: 'Horizon Forbidden West - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:00000000000000000000000000000000137b7588&dn=horizon-forbidden-west-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '95 GB', quality: 'FULL UNLOCKED' },
      { label: 'Horizon Forbidden West - FitGirl Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000003bfb3a2b&dn=horizon-forbidden-west-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '52 GB', quality: 'FitGirl Repack' },
      { label: 'Horizon Forbidden West - DODI Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000003c6dc7a8&dn=horizon-forbidden-west-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '62 GB', quality: 'DODI Repack' },
    ]
  },
  'it-takes-two': {
    fileSize: '45 GB',
    links: [
      { label: 'It Takes Two - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000017a73854&dn=it-takes-two-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '45 GB', quality: 'FULL UNLOCKED' },
      { label: 'It Takes Two - FitGirl Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000004d913ff7&dn=it-takes-two-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '25 GB', quality: 'FitGirl Repack' },
      { label: 'It Takes Two - DODI Repack', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000004f2e60c&dn=it-takes-two-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '29 GB', quality: 'DODI Repack' },
    ]
  },
  'a-plague-tale-requiem': {
    fileSize: '50 GB',
    links: [
      { label: 'A Plague Tale: Requiem - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:000000000000000000000000000000001864443b&dn=a-plague-tale-requiem-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '50 GB', quality: 'FULL UNLOCKED' },
      { label: 'A Plague Tale: Requiem - FitGirl Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000003e1e199e&dn=a-plague-tale-requiem-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '28 GB', quality: 'FitGirl Repack' },
      { label: 'A Plague Tale: Requiem - DODI Repack', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000007a63a3b&dn=a-plague-tale-requiem-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '33 GB', quality: 'DODI Repack' },
    ]
  },
  'starfield': {
    fileSize: '125 GB',
    links: [
      { label: 'Starfield - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:00000000000000000000000000000000115fff2b&dn=starfield-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '125 GB', quality: 'FULL UNLOCKED' },
      { label: 'Starfield - FitGirl Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000006e8bcb48&dn=starfield-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '69 GB', quality: 'FitGirl Repack' },
      { label: 'Starfield - DODI Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000001e4d10eb&dn=starfield-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '81 GB', quality: 'DODI Repack' },
    ]
  },
  'counter-strike-2': {
    fileSize: '35 GB',
    links: [
      { label: 'Counter-Strike 2 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:000000000000000000000000000000000dc3a2cb&dn=counter-strike-2-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '35 GB', quality: 'FULL UNLOCKED' },
      { label: 'Counter-Strike 2 - FitGirl Repack', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000018c3d6e8&dn=counter-strike-2-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '19 GB', quality: 'FitGirl Repack' },
      { label: 'Counter-Strike 2 - DODI Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000003ec0788b&dn=counter-strike-2-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '23 GB', quality: 'DODI Repack' },
    ]
  },
  'call-of-duty-modern-warfare-3': {
    fileSize: '80 GB',
    links: [
      { label: 'Call of Duty: Modern Warfare III - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:000000000000000000000000000000002f6500ff&dn=call-of-duty-modern-warfare-3-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '80 GB', quality: 'FULL UNLOCKED' },
      { label: 'Call of Duty: Modern Warfare III - FitGirl Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000003b10c89e&dn=call-of-duty-modern-warfare-3-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '44 GB', quality: 'FitGirl Repack' },
      { label: 'Call of Duty: Modern Warfare III - DODI Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000005c40e17f&dn=call-of-duty-modern-warfare-3-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '52 GB', quality: 'DODI Repack' },
    ]
  },
  'doom-eternal-shooter': {
    fileSize: '60 GB',
    links: [
      { label: 'Doom Eternal - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:000000000000000000000000000000002b1c1c5b&dn=doom-eternal-shooter-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '60 GB', quality: 'FULL UNLOCKED' },
      { label: 'Doom Eternal - FitGirl Repack', url: 'magnet:?xt=urn:btih:00000000000000000000000000000000620d7478&dn=doom-eternal-shooter-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '33 GB', quality: 'FitGirl Repack' },
      { label: 'Doom Eternal - DODI Repack', url: 'magnet:?xt=urn:btih:00000000000000000000000000000000553aac1b&dn=doom-eternal-shooter-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '39 GB', quality: 'DODI Repack' },
    ]
  },
  'resident-evil-village': {
    fileSize: '45 GB',
    links: [
      { label: 'Resident Evil Village - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000003d19e13&dn=resident-evil-village-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '45 GB', quality: 'FULL UNLOCKED' },
      { label: 'Resident Evil Village - FitGirl Repack', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000017280430&dn=resident-evil-village-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '25 GB', quality: 'FitGirl Repack' },
      { label: 'Resident Evil Village - DODI Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000002cdc60d3&dn=resident-evil-village-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '29 GB', quality: 'DODI Repack' },
    ]
  },
  'titanfall-2': {
    fileSize: '40 GB',
    links: [
      { label: 'Titanfall 2 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:000000000000000000000000000000000acc8151&dn=titanfall-2-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '40 GB', quality: 'FULL UNLOCKED' },
      { label: 'Titanfall 2 - FitGirl Repack', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000039815bcc&dn=titanfall-2-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '22 GB', quality: 'FitGirl Repack' },
      { label: 'Titanfall 2 - DODI Repack', url: 'magnet:?xt=urn:btih:00000000000000000000000000000000013932ef&dn=titanfall-2-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '26 GB', quality: 'DODI Repack' },
    ]
  },
  'forza-horizon-5': {
    fileSize: '110 GB',
    links: [
      { label: 'Forza Horizon 5 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000023426b97&dn=forza-horizon-5-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '110 GB', quality: 'FULL UNLOCKED' },
      { label: 'Forza Horizon 5 - FitGirl Repack', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000055d667fa&dn=forza-horizon-5-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '61 GB', quality: 'FitGirl Repack' },
      { label: 'Forza Horizon 5 - DODI Repack', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000061e08b17&dn=forza-horizon-5-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '72 GB', quality: 'DODI Repack' },
    ]
  },
  'need-for-speed-unbound': {
    fileSize: '50 GB',
    links: [
      { label: 'Need for Speed Unbound - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000005c90a39&dn=need-for-speed-unbound-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '50 GB', quality: 'FULL UNLOCKED' },
      { label: 'Need for Speed Unbound - FitGirl Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000001158471c&dn=need-for-speed-unbound-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '28 GB', quality: 'FitGirl Repack' },
      { label: 'Need for Speed Unbound - DODI Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000004574b907&dn=need-for-speed-unbound-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '33 GB', quality: 'DODI Repack' },
    ]
  },
  'assetto-corsa': {
    fileSize: '25 GB',
    links: [
      { label: 'Assetto Corsa - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:000000000000000000000000000000001c1947cb&dn=assetto-corsa-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '25 GB', quality: 'FULL UNLOCKED' },
      { label: 'Assetto Corsa - FitGirl Repack', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000070a13ed2&dn=assetto-corsa-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '14 GB', quality: 'FitGirl Repack' },
      { label: 'Assetto Corsa - DODI Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000002254c835&dn=assetto-corsa-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '16 GB', quality: 'DODI Repack' },
    ]
  },
  'hollow-knight': {
    fileSize: '9 GB',
    links: [
      { label: 'Hollow Knight - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000008bbe552&dn=hollow-knight-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '9 GB', quality: 'FULL UNLOCKED' },
      { label: 'Hollow Knight - FitGirl Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000004d491475&dn=hollow-knight-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '5 GB', quality: 'FitGirl Repack' },
    ]
  },
  'stardew-valley': {
    fileSize: '1.5 GB',
    links: [
      { label: 'Stardew Valley - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:000000000000000000000000000000006e7b51f5&dn=stardew-valley-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '1.5 GB', quality: 'FULL UNLOCKED' },
      { label: 'Stardew Valley - FitGirl Repack', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000033ceb228&dn=stardew-valley-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '1 GB', quality: 'FitGirl Repack' },
    ]
  },
  'hades': {
    fileSize: '15 GB',
    links: [
      { label: 'Hades - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:000000000000000000000000000000002dc5d784&dn=hades-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '15 GB', quality: 'FULL UNLOCKED' },
      { label: 'Hades - FitGirl Repack', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000067d214d9&dn=hades-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '8 GB', quality: 'FitGirl Repack' },
    ]
  },
  'celeste': {
    fileSize: '1.2 GB',
    links: [
      { label: 'Celeste - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000039f0a6ec&dn=celeste-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '1.2 GB', quality: 'FULL UNLOCKED' },
      { label: 'Celeste - FitGirl Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000000af56f49&dn=celeste-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '1 GB', quality: 'FitGirl Repack' },
    ]
  },
  'cuphead': {
    fileSize: '4 GB',
    links: [
      { label: 'Cuphead - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:000000000000000000000000000000002dd736e1&dn=cuphead-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '4 GB', quality: 'FULL UNLOCKED' },
      { label: 'Cuphead - FitGirl Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000001fb9787e&dn=cuphead-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '2 GB', quality: 'FitGirl Repack' },
    ]
  },
  'civilization-vi': {
    fileSize: '25 GB',
    links: [
      { label: 'Civilization VI - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:000000000000000000000000000000000f962c8e&dn=civilization-vi-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '25 GB', quality: 'FULL UNLOCKED' },
      { label: 'Civilization VI - FitGirl Repack', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000018bc054f&dn=civilization-vi-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '14 GB', quality: 'FitGirl Repack' },
      { label: 'Civilization VI - DODI Repack', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000031494a6e&dn=civilization-vi-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '16 GB', quality: 'DODI Repack' },
    ]
  },
  'total-war-warhammer-3': {
    fileSize: '70 GB',
    links: [
      { label: 'Total War: Warhammer III - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:000000000000000000000000000000003a11a657&dn=total-war-warhammer-3-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '70 GB', quality: 'FULL UNLOCKED' },
      { label: 'Total War: Warhammer III - FitGirl Repack', url: 'magnet:?xt=urn:btih:00000000000000000000000000000000574aad46&dn=total-war-warhammer-3-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '39 GB', quality: 'FitGirl Repack' },
      { label: 'Total War: Warhammer III - DODI Repack', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000027e68229&dn=total-war-warhammer-3-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '46 GB', quality: 'DODI Repack' },
    ]
  },
  'rimworld': {
    fileSize: '1 GB',
    links: [
      { label: 'RimWorld - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:000000000000000000000000000000005e6bf781&dn=rimworld-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '1 GB', quality: 'FULL UNLOCKED' },
      { label: 'RimWorld - FitGirl Repack', url: 'magnet:?xt=urn:btih:00000000000000000000000000000000691a199c&dn=rimworld-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '1 GB', quality: 'FitGirl Repack' },
    ]
  },
  'the-sims-4': {
    fileSize: '25 GB',
    links: [
      { label: 'The Sims 4 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:00000000000000000000000000000000047e017e&dn=the-sims-4-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '25 GB', quality: 'FULL UNLOCKED' },
      { label: 'The Sims 4 - FitGirl Repack', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000068fc4ba1&dn=the-sims-4-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '14 GB', quality: 'FitGirl Repack' },
      { label: 'The Sims 4 - DODI Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000007566755e&dn=the-sims-4-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '16 GB', quality: 'DODI Repack' },
    ]
  },
  'farming-simulator-22': {
    fileSize: '20 GB',
    links: [
      { label: 'Farming Simulator 22 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:000000000000000000000000000000002cd83bad&dn=farming-simulator-22-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '20 GB', quality: 'FULL UNLOCKED' },
      { label: 'Farming Simulator 22 - FitGirl Repack', url: 'magnet:?xt=urn:btih:00000000000000000000000000000000048d404a&dn=farming-simulator-22-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '11 GB', quality: 'FitGirl Repack' },
    ]
  },
  'microsoft-flight-simulator': {
    fileSize: '150 GB',
    links: [
      { label: 'Microsoft Flight Simulator - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000028c43657&dn=microsoft-flight-simulator-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '150 GB', quality: 'FULL UNLOCKED' },
      { label: 'Microsoft Flight Simulator - FitGirl Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000003d341d46&dn=microsoft-flight-simulator-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '83 GB', quality: 'FitGirl Repack' },
      { label: 'Microsoft Flight Simulator - DODI Repack', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000057d9f229&dn=microsoft-flight-simulator-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '98 GB', quality: 'DODI Repack' },
    ]
  },
  'tekken-8': {
    fileSize: '80 GB',
    links: [
      { label: 'Tekken 8 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:000000000000000000000000000000001a18c7d8&dn=tekken-8-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '80 GB', quality: 'FULL UNLOCKED' },
      { label: 'Tekken 8 - FitGirl Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000006768e07b&dn=tekken-8-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '44 GB', quality: 'FitGirl Repack' },
      { label: 'Tekken 8 - DODI Repack', url: 'magnet:?xt=urn:btih:0000000000000000000000000000000043214bf8&dn=tekken-8-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '52 GB', quality: 'DODI Repack' },
    ]
  },
  'street-fighter-6': {
    fileSize: '60 GB',
    links: [
      { label: 'Street Fighter 6 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:000000000000000000000000000000002c9819e1&dn=street-fighter-6-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '60 GB', quality: 'FULL UNLOCKED' },
      { label: 'Street Fighter 6 - FitGirl Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000007b88df3c&dn=street-fighter-6-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '33 GB', quality: 'FitGirl Repack' },
      { label: 'Street Fighter 6 - DODI Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000001b6b7fa1&dn=street-fighter-6-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '39 GB', quality: 'DODI Repack' },
    ]
  },
  'portal-2': {
    fileSize: '12 GB',
    links: [
      { label: 'Portal 2 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:000000000000000000000000000000006c1cc514&dn=portal-2-GamesFull&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'GamesFull', fileSize: '12 GB', quality: 'FULL UNLOCKED' },
      { label: 'Portal 2 - FitGirl Repack', url: 'magnet:?xt=urn:btih:000000000000000000000000000000006262f771&dn=portal-2-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '7 GB', quality: 'FitGirl Repack' },
    ]
  },
}

// Helper to create download links for a game
async function createDownloadLinks(gameId: string, slug: string) {
  const torrentData = TORRENT_DOWNLOADS[slug]
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

async function main() {
  console.log('🌱 Seeding NexusApp with 50 games + torrent links...')

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
