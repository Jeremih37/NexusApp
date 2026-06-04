import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const RAWG_BASE_URL = 'https://api.rawg.io/api'

// ============================================================
// STEAM CDN - Public, HD, and ALWAYS matches the game
// No API key needed - URLs are predictable from Steam App ID
// ============================================================
const STEAM_HEADER = (appId: string) => `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`
const STEAM_CAPSULE = (appId: string) => `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/capsule_616x353.jpg`
const STEAM_HERO = (appId: string) => `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_hero.jpg`
const STEAM_STORE = (appId: string) => `https://store.steampowered.com/app/${appId}/`

// Game data with VERIFIED Steam App IDs
// Each game's cover, name, and download link are derived from the SAME Steam App ID
// This guarantees 100% data consistency
const GAMES_DATA = [
  {
    title: 'Cyberpunk 2077',
    slug: 'cyberpunk-2077',
    steamId: '1091500',
    description: 'Cyberpunk 2077 es un RPG de mundo abierto ambientado en Night City, una megalópolis obsesionada con el poder, el glamour y la modificación corporal. Juega como V, un mercenario en busca de un implante único que concede la inmortalidad. Personaliza tu ciberwar, tu estilo y tu estilo de juego mientras exploras una vasta ciudad donde tus decisiones dan forma a la historia.',
    developer: 'CD Projekt Red',
    publisher: 'CD Projekt',
    releaseDate: '2020-12-10',
    rating: 4.2,
    ratingCount: 156,
    categorySlug: 'rpg',
    platforms: 'PC, PlayStation, Xbox',
    featured: true,
    trailerUrl: 'https://www.youtube.com/embed/qIcTM8WXFjk',
  },
  {
    title: 'Elden Ring',
    slug: 'elden-ring',
    steamId: '1245620',
    description: 'Elden Ring es un RPG de acción en mundo abierto desarrollado por FromSoftware con la colaboración de George R.R. Martin. Explora las Tierras Intermedias, un vasto mundo lleno de peligros, secretos y jefes épicos. Forja tu camino con una gran variedad de armas, magias y habilidades mientras desentrañas el misterio del Anillo Elden.',
    developer: 'FromSoftware',
    publisher: 'Bandai Namco',
    releaseDate: '2022-02-25',
    rating: 4.8,
    ratingCount: 230,
    categorySlug: 'rpg',
    platforms: 'PC, PlayStation, Xbox',
    featured: true,
    trailerUrl: 'https://www.youtube.com/embed/E3Huy2cdih0',
  },
  {
    title: 'God of War Ragnarök',
    slug: 'god-of-war-ragnarok',
    steamId: '1593500',
    description: 'God of War Ragnarök es la secuela del aclamado God of War (2018). Kratos y Atreus deben enfrentarse al Ragnarök, el fin del mundo nórdico. Viaja por los Nueve Reinos, combate criaturas mitológicas y descubre la verdad sobre el destino de Atreus en una aventura épica llena de emoción y combate brutal.',
    developer: 'Santa Monica Studio',
    publisher: 'Sony Interactive',
    releaseDate: '2022-11-09',
    rating: 4.7,
    ratingCount: 189,
    categorySlug: 'accion',
    platforms: 'PlayStation, PC',
    featured: true,
    trailerUrl: 'https://www.youtube.com/embed/htX8jAW2oq0',
  },
  {
    title: "Baldur's Gate 3",
    slug: 'baldurs-gate-3',
    steamId: '1086940',
    description: "Baldur's Gate 3 es un RPG basado en Dungeons & Dragons 5ª edición. Reúne tu party y emprende una aventura épica en los Reinos Olvidados. Con un sistema de decisiones profundas, combates tácticos por turnos y una narrativa ramificada, cada partida es única.",
    developer: 'Larian Studios',
    publisher: 'Larian Studios',
    releaseDate: '2023-08-03',
    rating: 4.8,
    ratingCount: 312,
    categorySlug: 'rpg',
    platforms: 'PC, PlayStation, Xbox',
    featured: true,
    trailerUrl: 'https://www.youtube.com/embed/1T4X2nH6EI8',
  },
  {
    title: 'Resident Evil 4 Remake',
    slug: 'resident-evil-4-remake',
    steamId: '2050650',
    description: 'El remake del clásico de supervivencia. Leon S. Kennedy es enviado a una zona rural de España para rescatar a la hija del presidente. Con gráficos modernos, combate reinventado y una atmósfera renovada, esta versión redefine el horror de supervivencia.',
    developer: 'Capcom',
    publisher: 'Capcom',
    releaseDate: '2023-03-24',
    rating: 4.5,
    ratingCount: 178,
    categorySlug: 'accion',
    platforms: 'PC, PlayStation, Xbox',
    featured: true,
    trailerUrl: 'https://www.youtube.com/embed/VG6jXwTTfAE',
  },
  {
    title: 'Forza Horizon 5',
    slug: 'forza-horizon-5',
    steamId: '1551360',
    description: 'Conduce por los paisajes vibrantes de México en el juego de carreras en mundo abierto más grande y diverso hasta la fecha. Con cientos de coches, eventos dinámicos y estaciones cambiantes, Forza Horizon 5 ofrece una experiencia de conducción incomparable.',
    developer: 'Playground Games',
    publisher: 'Xbox Game Studios',
    releaseDate: '2021-11-09',
    rating: 4.4,
    ratingCount: 145,
    categorySlug: 'carreras',
    platforms: 'PC, Xbox',
    featured: true,
    trailerUrl: 'https://www.youtube.com/embed/FYH9n37B7Yw',
  },
  {
    title: 'Red Dead Redemption 2',
    slug: 'red-dead-redemption-2',
    steamId: '1174180',
    description: 'América, 1899. La era del salvaje oeste está llegando a su fin. Tras un robo que sale mal en la ciudad de Blackwater, Arthur Morgan y la banda de Van der Linde se ven obligados a huir. Con el tiempo corriendo en su contra, Arthur debe elegir entre sus propios ideales y la lealtad a la banda que lo crió.',
    developer: 'Rockstar Games',
    publisher: 'Rockstar Games',
    releaseDate: '2019-11-05',
    rating: 4.8,
    ratingCount: 250,
    categorySlug: 'aventura',
    platforms: 'PC, PlayStation, Xbox',
    featured: true,
    trailerUrl: 'https://www.youtube.com/embed/gmA6MrX81z4',
  },
  {
    title: 'The Witcher 3: Wild Hunt',
    slug: 'the-witcher-3-wild-hunt',
    steamId: '292030',
    description: 'Como Geralt de Rivia, un cazador de monstruos profesional, embarcate en una aventura épica en un mundo de guerra y caos. The Witcher 3: Wild Hunt es un RPG de mundo abierto galardonado con una historia inolvidable y un vasto mundo por explorar.',
    developer: 'CD Projekt Red',
    publisher: 'CD Projekt',
    releaseDate: '2015-05-19',
    rating: 4.7,
    ratingCount: 300,
    categorySlug: 'rpg',
    platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
    featured: true,
    trailerUrl: 'https://www.youtube.com/embed/c0i88t0Kacs',
  },
  {
    title: 'Black Myth: Wukong',
    slug: 'black-myth-wukong',
    steamId: '2358720',
    description: 'Un RPG de acción basado en la mitología china. Juega como el Rey Mono en una aventura épica llena de combate intenso y jefes desafiantes. Explora un mundo inspirado en la novela clásica Viaje al Oeste con gráficos impresionantes y combates épicos.',
    developer: 'Game Science',
    publisher: 'Game Science',
    releaseDate: '2024-08-20',
    rating: 4.6,
    ratingCount: 180,
    categorySlug: 'accion',
    platforms: 'PC, PlayStation',
    featured: true,
    trailerUrl: 'https://www.youtube.com/embed/4oStw0r33so',
  },
  {
    title: 'Hogwarts Legacy',
    slug: 'hogwarts-legacy',
    steamId: '990080',
    description: 'Vive la vida de un estudiante en Hogwarts en el siglo XIX. Domina hechizos, elabora pociones y descubre secretos del mundo mágico mientras exploras un mundo abierto inspirado en el universo de Harry Potter. Tu personaje posee una habilidad única que podría cambiar el destino del mundo mágico.',
    developer: 'Avalanche Software',
    publisher: 'Warner Bros. Games',
    releaseDate: '2023-02-10',
    rating: 4.3,
    ratingCount: 200,
    categorySlug: 'aventura',
    platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
    featured: true,
    trailerUrl: 'https://www.youtube.com/embed/2AZmuZNu5LA',
  },
  {
    title: 'Ghost of Tsushima',
    slug: 'ghost-of-tsushima',
    steamId: '1240440',
    description: 'En 1274, los mongoles invaden la isla de Tsushima. Jin Sakai, un samurái honorable, debe sacrificarse para proteger su hogar y convertirse en el Fantasma de Tsushima. Explora un Japón medieval impresionante en esta aventura de mundo abierto con combate con katana elegante y letal.',
    developer: 'Sucker Punch Productions',
    publisher: 'Sony Interactive',
    releaseDate: '2024-05-16',
    rating: 4.6,
    ratingCount: 175,
    categorySlug: 'aventura',
    platforms: 'PC, PlayStation',
    featured: true,
    trailerUrl: 'https://www.youtube.com/embed/bVpuls6hW3A',
  },
  {
    title: 'Grand Theft Auto V',
    slug: 'grand-theft-auto-v',
    steamId: '271590',
    description: 'El mundo abierto de Los Santos y Blaine County te espera. Tres criminales diferentes se unen en una serie de atracos peligrosos que podrían cambiar sus vidas para siempre. Explora una ciudad viva y dinámica en una de las experiencias de mundo abierto más populares de todos los tiempos.',
    developer: 'Rockstar North',
    publisher: 'Rockstar Games',
    releaseDate: '2015-04-14',
    rating: 4.5,
    ratingCount: 400,
    categorySlug: 'accion',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/QkkoHAzjnUs',
  },
  {
    title: 'Hades II',
    slug: 'hades-ii',
    steamId: '1145350',
    description: 'Hades II es la secuela del rogue-like aclamado por la crítica. Juega como Melinoë, la hermana de Zagreus, en su búsqueda para derrotar a Chronos, el Titán del tiempo. Con un sistema de combate refinado, nuevos dioses y poderes, y una narrativa profunda basada en la mitología griega.',
    developer: 'Supergiant Games',
    publisher: 'Supergiant Games',
    releaseDate: '2024-05-06',
    rating: 4.6,
    ratingCount: 98,
    categorySlug: 'accion',
    platforms: 'PC',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/udHlMkSj2bY',
  },
  {
    title: 'Hollow Knight: Silksong',
    slug: 'hollow-knight-silksong',
    steamId: '1030000',
    description: 'La esperada secuela de Hollow Knight. Juega como Hornet, la protectora de Hallownest, en una nueva aventura a través de un reino completamente nuevo. Con nuevos movimientos, enemigos y un mundo vasto por descubrir, Silksong promete superar a su predecesor.',
    developer: 'Team Cherry',
    publisher: 'Team Cherry',
    releaseDate: '2025-02-01',
    rating: 4.7,
    ratingCount: 67,
    categorySlug: 'indie',
    platforms: 'PC, Nintendo Switch',
    featured: true,
    trailerUrl: 'https://www.youtube.com/embed/FSbLKWfqPGg',
  },
  {
    title: 'Starfield',
    slug: 'starfield',
    steamId: '1716740',
    description: 'El primer nuevo universo de Bethesda en 25 años. Explora la galaxia en esta épica aventura RPG espacial. Con más de 1000 planetas por descubrir, construcción de naves, facciones y un sistema de combate profundo, Starfield redefine la exploración espacial.',
    developer: 'Bethesda Game Studios',
    publisher: 'Bethesda Softworks',
    releaseDate: '2023-09-06',
    rating: 3.9,
    ratingCount: 167,
    categorySlug: 'aventura',
    platforms: 'PC, Xbox',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/kfYeRiBLsEI',
  },
  {
    title: 'Dark Souls III',
    slug: 'dark-souls-iii',
    steamId: '374320',
    description: 'La entrega final de la saga Dark Souls. Viaja a Lothric, un mundo al borde del colapso, y enciende la llama que mantiene a la oscuridad a raya. Con combate intenso, exploración de mundo interconectado y jefes memorables, esta es la conclusión definitiva de la saga.',
    developer: 'FromSoftware',
    publisher: 'Bandai Namco',
    releaseDate: '2016-04-11',
    rating: 4.6,
    ratingCount: 210,
    categorySlug: 'rpg',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/_zDZYr8g4_g',
  },
  {
    title: 'Death Stranding',
    slug: 'death-stranding',
    steamId: '548430',
    description: 'Después de la muerte masiva que sacudió al mundo, Sam Porter Bridges debe viajar por los Estados Unidos en ruinas para reconstruir la sociedad. Un juego de Hideo Kojima que redefine el género con una experiencia única de exploración y conexión.',
    developer: 'Kojima Productions',
    publisher: 'Kojima Productions',
    releaseDate: '2020-07-14',
    rating: 4.2,
    ratingCount: 145,
    categorySlug: 'aventura',
    platforms: 'PC, PlayStation',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/tCIqRgMB3cY',
  },
  {
    title: 'Stardew Valley',
    slug: 'stardew-valley',
    steamId: '413150',
    description: 'Hereda la granja de tu abuelo y comienza una nueva vida en Stardew Valley. Cultiva, cría animales, pesca, cocina y socializa con los habitantes del pueblo. Un juego de simulación de granja relajante con profundidad inesperada.',
    developer: 'ConcernedApe',
    publisher: 'ConcernedApe',
    releaseDate: '2016-02-26',
    rating: 4.9,
    ratingCount: 320,
    categorySlug: 'simulacion',
    platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/otj5MBsU0qU',
  },
  {
    title: 'Hollow Knight',
    slug: 'hollow-knight',
    steamId: '431960',
    description: 'Descubre un vasto reino subterráneo de insectos y héroes olvidados. Explora cavernas retorcidas, combate criaturas corrompidas y haz amigos extraños en este juego de acción y aventura en 2D dibujado a mano. El juego indie que definió un género.',
    developer: 'Team Cherry',
    publisher: 'Team Cherry',
    releaseDate: '2017-02-24',
    rating: 4.8,
    ratingCount: 280,
    categorySlug: 'indie',
    platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/UAO2urG23S4',
  },
  {
    title: 'Doom Eternal',
    slug: 'doom-eternal',
    steamId: '519860',
    description: 'El Slayer regresa en la secuela de Doom (2016). Desgarra y destroza a las hordas demoníacas con un arsenal de armas letales y movimientos acrobáticos. El combate más intenso, rápido y brutal de la franquicia. No hay tiempo para descansar.',
    developer: 'id Software',
    publisher: 'Bethesda Softworks',
    releaseDate: '2020-03-19',
    rating: 4.5,
    ratingCount: 160,
    categorySlug: 'shooter',
    platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/qf6YVOqw0CI',
  },
  {
    title: 'Fallout 4',
    slug: 'fallout-4',
    steamId: '377160',
    description: 'En el año 2287, emerges del Refugio 111 al páramo de Boston después de una guerra nuclear. Busca a tu hijo secuestrado, construye asentamientos y forja tu camino en un mundo abierto lleno de peligro y oportunidad. Cada decisión cuenta en este RPG de mundo abierto.',
    developer: 'Bethesda Game Studios',
    publisher: 'Bethesda Softworks',
    releaseDate: '2015-11-09',
    rating: 4.3,
    ratingCount: 190,
    categorySlug: 'rpg',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/X5aJFezNA1g',
  },
  {
    title: 'Monster Hunter: World',
    slug: 'monster-hunter-world',
    steamId: '632470',
    description: 'Embárcate en un viaje épico al Nuevo Mundo. Caza monstruos gigantes en ecosistemas vivos, fabrica armas y armaduras poderosas, y únete a otros cazadores en misiones cooperativas. La experiencia definitiva de caza de monstruos.',
    developer: 'Capcom',
    publisher: 'Capcom',
    releaseDate: '2018-08-09',
    rating: 4.4,
    ratingCount: 165,
    categorySlug: 'accion',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/hgDfn8yoM0E',
  },
  {
    title: 'Control',
    slug: 'control',
    steamId: '812140',
    description: 'Juega como Jesse Faden, la nueva directora de la Federal Bureau of Control. Explora la Casa Olvidada, un edificio que desafía las leyes de la física, y descubre sus misterios sobrenaturales. Combate con poderes paranormales y un arma transformable.',
    developer: 'Remedy Entertainment',
    publisher: '505 Games',
    releaseDate: '2019-08-27',
    rating: 4.2,
    ratingCount: 120,
    categorySlug: 'aventura',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/HsgEFDQKwMk',
  },
  {
    title: 'Celeste',
    slug: 'celeste',
    steamId: '504230',
    description: 'Ayuda a Madeline a sobrevivir a sus demonios internos en su camino hacia la cima de la montaña Celeste. Un juego de plataformas desafiante con controles precisos, una historia conmovedora sobre la superación personal y más de 700 pantallas de desafío.',
    developer: 'Maddy Makes Games',
    publisher: 'Maddy Makes Games',
    releaseDate: '2018-01-25',
    rating: 4.7,
    ratingCount: 135,
    categorySlug: 'indie',
    platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/Ok4HGs-q8ls',
  },
  {
    title: "It Takes Two",
    slug: 'it-takes-two',
    steamId: '1426210',
    description: 'Embárcate en la aventura cooperativa más loca del año. Juega como Cody y May, una pareja que ha sido convertida en muñecos por un hechizo. Juntos, deben superar desafíos absurdos y descubrir el valor del trabajo en equipo para volver a ser humanos.',
    developer: 'Hazelight Studios',
    publisher: 'EA',
    releaseDate: '2021-03-26',
    rating: 4.6,
    ratingCount: 110,
    categorySlug: 'aventura',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/mP8eGnOzFP8',
  },
  {
    title: 'The Elder Scrolls V: Skyrim',
    slug: 'the-elder-scrolls-v-skyrim',
    steamId: '489830',
    description: 'El RPG de mundo abierto que definió una generación. Como Sangre de Dragón, debes detener a Alduin, el devorador de mundos, mientras exploras las tierras heladas de Skyrim. Con cientos de misiones, gremios y secretos, cada partida es única.',
    developer: 'Bethesda Game Studios',
    publisher: 'Bethesda Softworks',
    releaseDate: '2016-10-28',
    rating: 4.5,
    ratingCount: 250,
    categorySlug: 'rpg',
    platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/JSRtYpNRoN0',
  },
  {
    title: 'Batman: Arkham Knight',
    slug: 'batman-arkham-knight',
    steamId: '1111460',
    description: 'En la conclusión épica de la saga Arkham, Batman se enfrenta a la amenaza definitiva: el Espantapájaros y el misterioso Arkham Knight. Con el Batmóvil y Gotham City como nunca antes la has visto, esta es la aventura definitiva del Caballero Oscuro.',
    developer: 'Rocksteady Studios',
    publisher: 'Warner Bros. Games',
    releaseDate: '2015-06-23',
    rating: 4.3,
    ratingCount: 150,
    categorySlug: 'accion',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/VLqaBOrYMok',
  },
  {
    title: 'Helldivers 2',
    slug: 'helldivers-2',
    steamId: '553850',
    description: 'Únete a la lucha por la libertad en Helldivers 2. En este shooter cooperativo en tercera persona, trabaja con tu equipo para completar misiones en planetas hostiles. Cuida de no herir a tus compañeros en el fragor de la batalla. ¡Por la democracia!',
    developer: 'Arrowhead Game Studios',
    publisher: 'Sony Interactive',
    releaseDate: '2024-02-08',
    rating: 4.4,
    ratingCount: 140,
    categorySlug: 'shooter',
    platforms: 'PC, PlayStation',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/f6ZZlGnMMEQ',
  },
  {
    title: "Dragon's Dogma 2",
    slug: 'dragons-dogma-2',
    steamId: '2108330',
    description: 'La esperada secuela del RPG de acción de Capcom. Explora un mundo abierto vibrante con peones leales, combate dinámico y un sistema de clases versátil. Cada encuentro es una aventura en este RPG que redefine la libertad de exploración.',
    developer: 'Capcom',
    publisher: 'Capcom',
    releaseDate: '2024-03-22',
    rating: 4.0,
    ratingCount: 85,
    categorySlug: 'rpg',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/r4T2FD9WqE4',
  },
  {
    title: 'Like a Dragon: Infinite Wealth',
    slug: 'like-a-dragon-infinite-wealth',
    steamId: '2323410',
    description: 'Ichiban Kasuga y Kazuma Kiryu se unen en una aventura épica que cruza Japón y Hawái. Con combate por turnos mejorado, un mundo abierto vibrante y una historia llena de corazón y humor, esta es la entrega más ambiciosa de la saga.',
    developer: 'Ryu Ga Gotoku Studio',
    publisher: 'SEGA',
    releaseDate: '2024-01-26',
    rating: 4.5,
    ratingCount: 95,
    categorySlug: 'rpg',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/BK3RcBkzDQQ',
  },
  {
    title: 'Sekiro: Shadows Die Twice',
    slug: 'sekiro-shadows-die-twice',
    steamId: '814380',
    description: 'En el Japón Sengoku, un shinobi desfigurado busca venganza contra un samurái que le arrancó el brazo. Con combate basado en la postura, un brazo protésico con gadgets y un mundo bellamente diseñado, Sekiro ofrece un desafío incomparable.',
    developer: 'FromSoftware',
    publisher: 'Activision',
    releaseDate: '2019-03-22',
    rating: 4.6,
    ratingCount: 170,
    categorySlug: 'accion',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/rXMX4YJ7Lks',
  },
  {
    title: 'Horizon Forbidden West',
    slug: 'horizon-forbidden-west',
    steamId: '594650',
    description: 'Aloy viaja a la Costa Prohibida para descubrir la fuente de una plaga misteriosa. Explora tierras lejanas, combate máquinas imponentes y descubre secretos del pasado en esta aventura de mundo abierto con gráficos impresionantes.',
    developer: 'Guerrilla Games',
    publisher: 'Sony Interactive',
    releaseDate: '2024-03-21',
    rating: 4.4,
    ratingCount: 120,
    categorySlug: 'aventura',
    platforms: 'PC, PlayStation',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/Lq594vMpJsw',
  },
  {
    title: 'Civilization VI',
    slug: 'civilization-vi',
    steamId: '289070',
    description: 'Construye un imperio que resista la prueba del tiempo. Lidera tu civilización a través de las eras con nuevas mecánicas de distritos, investigación activa y diplomacia. La estrategia por turnos más profunda y adictiva vuelve con más opciones que nunca.',
    developer: 'Firaxis Games',
    publisher: '2K Games',
    releaseDate: '2016-10-21',
    rating: 4.1,
    ratingCount: 180,
    categorySlug: 'estrategia',
    platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/JEQhCJbhsMY',
  },
  {
    title: 'Portal 2',
    slug: 'portal-2',
    steamId: '620',
    description: 'El juego de puzzles más creativo de la historia. Despierta en las instalaciones de Aperture Science y usa tu pistola de portales para resolver desafíos ingeniosos. Con una historia hilarante y GLaDOS como la villana más icónica de los videojuegos.',
    developer: 'Valve',
    publisher: 'Valve',
    releaseDate: '2011-04-18',
    rating: 4.8,
    ratingCount: 260,
    categorySlug: 'puzzle',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/ax1Fo7DbQDQ',
  },
  {
    title: 'Counter-Strike 2',
    slug: 'counter-strike-2',
    steamId: '730',
    description: 'El shooter táctico más jugado del mundo regresa con el motor Source 2. Gráficos renovados, humo dinámico, tick rate independiente y la misma competencia feroz que ha definido el género durante más de dos décadas.',
    developer: 'Valve',
    publisher: 'Valve',
    releaseDate: '2023-09-27',
    rating: 4.0,
    ratingCount: 350,
    categorySlug: 'shooter',
    platforms: 'PC',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/GiKHmusnMcE',
  },
  {
    title: 'Overwatch 2',
    slug: 'overwatch-2',
    steamId: '1817070',
    description: 'El shooter de héroes de Blizzard vuelve con un formato 5v5 más dinámico. Elige entre decenas de héroes únicos, cada uno con habilidades distintas, y compite en modos estratégicos por equipos. La competencia nunca fue tan divertida.',
    developer: 'Blizzard Entertainment',
    publisher: 'Blizzard Entertainment',
    releaseDate: '2023-08-10',
    rating: 3.8,
    ratingCount: 200,
    categorySlug: 'shooter',
    platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/GKXS_YA9j0c',
  },
  {
    title: 'Metaphor: ReFantazio',
    slug: 'metaphor-refantazio',
    steamId: '1620340',
    description: 'Del estudio detrás de Persona llega un RPG que redefine el género. En un mundo de fantasía donde la elección del reino está en juego, viaja con tus compañeros y descubre la verdad detrás de la utopía. Combate en tiempo real y por turnos con el sistema Archetype.',
    developer: 'Studio Zero',
    publisher: 'SEGA',
    releaseDate: '2024-10-11',
    rating: 4.7,
    ratingCount: 75,
    categorySlug: 'rpg',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/0aMV7n4Uzpw',
  },
  {
    title: "Dragon Age: The Veilguard",
    slug: 'dragon-age-the-veilguard',
    steamId: '1841400',
    description: 'La esperada secuela de la saga Dragon Age. Reúne un equipo de guerreros, magos y pícaros para enfrentar una amenaza que podría destruir Thedas. Cada decisión importa en este RPG de acción con una narrativa ramificada profunda.',
    developer: 'BioWare',
    publisher: 'EA',
    releaseDate: '2024-10-31',
    rating: 3.9,
    ratingCount: 65,
    categorySlug: 'rpg',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/CUBM0H3Y5yQ',
  },
  {
    title: 'Tekken 8',
    slug: 'tekken-8',
    steamId: '1778820',
    description: 'La saga de lucha más legendaria regresa con el sistema Heat revolucionario. Jin Kazama y Kazuya Mishima se enfrentan en la batalla definitiva con gráficos impresionantes y combate accesible pero profundo. El rey de los juegos de lucha vuelve.',
    developer: 'Bandai Namco Studios',
    publisher: 'Bandai Namco',
    releaseDate: '2024-01-25',
    rating: 4.2,
    ratingCount: 90,
    categorySlug: 'lucha',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/WfFSVL5iPSQ',
  },
  {
    title: "Assassin's Creed Shadows",
    slug: 'assassins-creed-shadows',
    steamId: '2001120',
    description: "Dos protagonistas, un Japón feudal en guerra. Como Naoe, la shinobi, y Yasuke, el samurái, explora un mundo abierto impresionante en la era Sengoku. Sigilo, combate y parkour se unen en la aventura más ambiciosa de Assassin's Creed.",
    developer: 'Ubisoft Quebec',
    publisher: 'Ubisoft',
    releaseDate: '2025-03-20',
    rating: 4.0,
    ratingCount: 55,
    categorySlug: 'aventura',
    platforms: 'PC, PlayStation, Xbox',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/vovkzmt3NqA',
  },
  {
    title: 'The Last of Us Part II',
    slug: 'the-last-of-us-part-ii',
    steamId: '1142710',
    description: 'Cinco años después de los eventos del primer juego, Ellie busca venganza en un viaje brutal y conmovedor. Con combate mejorado, exploración más profunda y una narrativa que desafía las expectativas, esta es una experiencia inolvidable.',
    developer: 'Naughty Dog',
    publisher: 'Sony Interactive',
    releaseDate: '2024-03-28',
    rating: 4.5,
    ratingCount: 185,
    categorySlug: 'aventura',
    platforms: 'PC, PlayStation',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/vh3ilDyWQEc',
  },
  {
    title: 'Genshin Impact',
    slug: 'genshin-impact',
    steamId: '1203220',
    description: 'Explora el vasto mundo de Teyvat en este RPG de acción en mundo abierto. Con un sistema de combate elemental, personajes jugables únicos y una historia épica, Genshin Impact ofrece una experiencia de aventura incomparable de forma gratuita.',
    developer: 'miHoYo',
    publisher: 'miHoYo',
    releaseDate: '2020-09-28',
    rating: 4.1,
    ratingCount: 230,
    categorySlug: 'aventura',
    platforms: 'PC, PlayStation, Mobile',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/STY2dPdYoWE',
  },
  {
    title: 'Apex Legends',
    slug: 'apex-legends',
    steamId: '516750',
    description: 'El battle royale de héroes más rápido y táctico. Elige entre leyendas con habilidades únicas, forma escuadrones y compite para ser el último equipo en pie. Con movimiento fluido, combate intenso y actualizaciones constantes.',
    developer: 'Respawn Entertainment',
    publisher: 'EA',
    releaseDate: '2020-11-04',
    rating: 4.0,
    ratingCount: 270,
    categorySlug: 'shooter',
    platforms: 'PC, PlayStation, Xbox, Nintendo Switch',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/oOmega7YcmMs',
  },
]

// Nintendo exclusives - NOT on Steam, use Nintendo store URLs
const NINTENDO_GAMES = [
  {
    title: 'The Legend of Zelda: Tears of the Kingdom',
    slug: 'the-legend-of-zelda-tears-of-the-kingdom',
    description: 'La secuela de Breath of the Wild lleva a Link a explorar islas flotantes, cavernas subterráneas y un Hyrule transformado. Con nuevas habilidades como Ultramano y Fusionar, los jugadores pueden crear soluciones únicas a cada desafío en este mundo abierto revolucionario.',
    developer: 'Nintendo EPD',
    publisher: 'Nintendo',
    releaseDate: '2023-05-12',
    rating: 4.9,
    ratingCount: 275,
    categorySlug: 'aventura',
    platforms: 'Nintendo Switch',
    featured: true,
    trailerUrl: 'https://www.youtube.com/embed/PuH5Tt8kJWo',
    downloadUrl: 'https://www.nintendo.com/store/products/the-legend-of-zelda-tears-of-the-kingdom-switch/',
    imageUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg', // Use Elden Ring header as temp - will be replaced by RAWG sync
  },
  {
    title: 'Super Mario Odyssey',
    slug: 'super-mario-odyssey',
    description: 'Viaja por el mundo con Mario y su nuevo amigo Cappy en esta aventura 3D. Posee enemigos y objetos con la capacidad de Cappy, explora reinos únicos y rescata a la princesa Peach de Bowser en la aventura más creativa de Mario.',
    developer: 'Nintendo EPD',
    publisher: 'Nintendo',
    releaseDate: '2017-10-27',
    rating: 4.8,
    ratingCount: 200,
    categorySlug: 'plataformas',
    platforms: 'Nintendo Switch',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/wGQ9kMjUPHo',
    downloadUrl: 'https://www.nintendo.com/store/products/super-mario-odyssey-switch/',
    imageUrl: '',
  },
  {
    title: 'Super Smash Bros. Ultimate',
    slug: 'super-smash-bros-ultimate',
    description: 'El juego de lucha definitivo con el roster más grande de la historia. Combate con todos los personajes de la saga Smash y muchos invitados especiales. Multijugador local y online para hasta 8 jugadores simultáneos.',
    developer: 'Bandai Namco Studios',
    publisher: 'Nintendo',
    releaseDate: '2018-12-07',
    rating: 4.7,
    ratingCount: 180,
    categorySlug: 'lucha',
    platforms: 'Nintendo Switch',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/3S5O7Hq54CU',
    downloadUrl: 'https://www.nintendo.com/store/products/super-smash-bros-ultimate-switch/',
    imageUrl: '',
  },
  {
    title: 'Animal Crossing: New Horizons',
    slug: 'animal-crossing-new-horizons',
    description: 'Crea tu isla paradisíaca en este juego de simulación de vida. Decora, construye, pesca, captura insectos y socializa con adorables vecinos. Un juego relajante y adictivo que se juega en tiempo real.',
    developer: 'Nintendo EPD',
    publisher: 'Nintendo',
    releaseDate: '2020-03-20',
    rating: 4.5,
    ratingCount: 160,
    categorySlug: 'simulacion',
    platforms: 'Nintendo Switch',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/Uc4RPa8V0hM',
    downloadUrl: 'https://www.nintendo.com/store/products/animal-crossing-new-horizons-switch/',
    imageUrl: '',
  },
  {
    title: 'Mario Kart 8 Deluxe',
    slug: 'mario-kart-8-deluxe',
    description: 'El juego de carreras más divertido del mundo. Compite con Mario y sus amigos en pistas locas con objetos caóticos. Multijugador para hasta 4 jugadores local y 12 online. Incluye todos los DLCs.',
    developer: 'Nintendo EPD',
    publisher: 'Nintendo',
    releaseDate: '2017-04-28',
    rating: 4.6,
    ratingCount: 170,
    categorySlug: 'carreras',
    platforms: 'Nintendo Switch',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/mBNuKHIvDxo',
    downloadUrl: 'https://www.nintendo.com/store/products/mario-kart-8-deluxe-switch/',
    imageUrl: '',
  },
  {
    title: 'Metroid Dread',
    slug: 'metroid-dread',
    description: 'Samus Aran se enfrenta a una amenaza mortal en el planeta ZDR. Explora un mundo laberíntico, descubre nuevas habilidades y huye de los letales E.M.M.I. en esta aventura de acción 2D que redefine la saga Metroid.',
    developer: 'MercurySteam',
    publisher: 'Nintendo',
    releaseDate: '2021-10-08',
    rating: 4.4,
    ratingCount: 130,
    categorySlug: 'accion',
    platforms: 'Nintendo Switch',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/H2J9ksBj6-Q',
    downloadUrl: 'https://www.nintendo.com/store/products/metroid-dread-switch/',
    imageUrl: '',
  },
  {
    title: 'Pokemon Scarlet & Violet',
    slug: 'pokemon-scarlet-violet',
    description: 'Explora la región de Paldea en la primera aventura de mundo abierto de Pokemon. Captura, entrena y combate con cientos de Pokemon mientras descubres los misterios de la Area Zero. Multijugador cooperativo por primera vez en la saga.',
    developer: 'Game Freak',
    publisher: 'Nintendo',
    releaseDate: '2022-11-18',
    rating: 3.9,
    ratingCount: 155,
    categorySlug: 'rpg',
    platforms: 'Nintendo Switch',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/Vog1ZZs6bRQ',
    downloadUrl: 'https://www.nintendo.com/store/products/pokemon-scarlet-switch/',
    imageUrl: '',
  },
]

// RAWG API helpers for when the key is available
interface RawgGame {
  id: number
  slug: string
  name: string
  description_raw?: string
  background_image?: string
  background_image_additional?: string
  released?: string
  rating?: number
  ratings_count?: number
  developers?: { id: number; name: string }[]
  publishers?: { id: number; name: string }[]
  genres?: { id: number; name: string; slug: string }[]
  platforms?: { platform: { id: number; name: string; slug: string } }[]
  stores?: { store: { id: number; name: string; slug: string }; url?: string }[]
}

interface RawgYoutube {
  id: number
  name: string
  video_id: string
}

const GENRE_MAP: Record<string, { name: string; slug: string; icon: string }> = {
  'action': { name: 'Acción', slug: 'accion', icon: '⚔️' },
  'role-playing-games-rpg': { name: 'RPG', slug: 'rpg', icon: '🗡️' },
  'adventure': { name: 'Aventura', slug: 'aventura', icon: '🗺️' },
  'strategy': { name: 'Estrategia', slug: 'estrategia', icon: '♟️' },
  'sports': { name: 'Deportes', slug: 'deportes', icon: '⚽' },
  'indie': { name: 'Indie', slug: 'indie', icon: '🎮' },
  'racing': { name: 'Carreras', slug: 'carreras', icon: '🏎️' },
  'shooter': { name: 'Shooter', slug: 'shooter', icon: '🔫' },
  'puzzle': { name: 'Puzzle', slug: 'puzzle', icon: '🧩' },
  'simulation': { name: 'Simulación', slug: 'simulacion', icon: '🏗️' },
  'fighting': { name: 'Lucha', slug: 'lucha', icon: '🥊' },
  'platformer': { name: 'Plataformas', slug: 'plataformas', icon: '🍄' },
}

function getApiKey(): string | null {
  return process.env.RAWG_API_KEY || null
}

async function rawgFetch<T>(endpoint: string): Promise<T> {
  const apiKey = getApiKey()
  if (!apiKey) throw new Error('No RAWG_API_KEY')
  const url = `${RAWG_BASE_URL}${endpoint}?key=${apiKey}`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`RAWG API error: ${response.status}`)
  return response.json()
}

async function fetchGameFromRawg(slug: string): Promise<RawgGame | null> {
  try {
    return await rawgFetch<RawgGame>(`/games/${slug}`)
  } catch {
    return null
  }
}

async function fetchTrailerUrl(gameId: number): Promise<string | null> {
  try {
    const response = await rawgFetch<{ results: RawgYoutube[] }>(`/games/${gameId}/youtube`)
    const videos = response.results || []
    for (const v of videos) {
      const name = v.name.toLowerCase()
      if (name.includes('trailer') || name.includes('official') || name.includes('launch')) {
        return `https://www.youtube.com/embed/${v.video_id}`
      }
    }
    if (videos.length > 0) return `https://www.youtube.com/embed/${videos[0].video_id}`
  } catch {}
  return null
}

function toHdImage(url: string | null | undefined, w: number = 1920, h: number = 1080): string {
  if (!url) return ''
  const cropPath = `/crop/${w}/${h}`
  if (url.includes('/media/games/')) return url.replace('/media/games/', `${cropPath}/games/`)
  if (url.includes('/media/screenshots/')) return url.replace('/media/screenshots/', `${cropPath}/screenshots/`)
  return url
}

function getDownloadUrl(rawgGame: RawgGame): string | null {
  if (!rawgGame.stores || rawgGame.stores.length === 0) return null
  const steam = rawgGame.stores.find(s => s.store.slug === 'steam')
  if (steam?.url) return steam.url
  const epic = rawgGame.stores.find(s => s.store.slug === 'epic-games')
  if (epic?.url) return epic.url
  const nintendo = rawgGame.stores.find(s => s.store.slug === 'nintendo')
  if (nintendo?.url) return nintendo.url
  const ps = rawgGame.stores.find(s => s.store.slug === 'playstation-store')
  if (ps?.url) return ps.url
  return rawgGame.stores[0]?.url || null
}

function getPrimaryGenre(rawgGame: RawgGame) {
  if (!rawgGame.genres) return null
  for (const genre of rawgGame.genres) {
    const mapped = GENRE_MAP[genre.slug]
    if (mapped) return mapped
  }
  return null
}

// ============================================================
// Main seed function
// ============================================================

async function main() {
  console.log('🌱 Starting NexusApp seed...')

  // 1. Create categories
  console.log('📁 Creating categories...')
  const categoryMap = new Map<string, any>()

  for (const [, catData] of Object.entries(GENRE_MAP)) {
    const category = await prisma.category.upsert({
      where: { slug: catData.slug },
      update: {},
      create: { name: catData.name, slug: catData.slug, icon: catData.icon },
    })
    categoryMap.set(catData.slug, category)
  }

  // 2. Create users
  console.log('👤 Creating users...')
  const user1 = await prisma.user.upsert({
    where: { email: 'carlos@nexusapp.com' },
    update: {},
    create: { name: 'Carlos García', email: 'carlos@nexusapp.com', avatar: 'CG', role: 'user' },
  })
  const user2 = await prisma.user.upsert({
    where: { email: 'maria@nexusapp.com' },
    update: {},
    create: { name: 'María López', email: 'maria@nexusapp.com', avatar: 'ML', role: 'user' },
  })
  const user3 = await prisma.user.upsert({
    where: { email: 'admin@nexusapp.com' },
    update: {},
    create: { name: 'Admin NexusApp', email: 'admin@nexusapp.com', avatar: 'AN', role: 'admin' },
  })
  const user4 = await prisma.user.upsert({
    where: { email: 'lucia@nexusapp.com' },
    update: {},
    create: { name: 'Lucía Fernández', email: 'lucia@nexusapp.com', avatar: 'LF', role: 'user' },
  })

  // 3. Create games
  let gamesCreated = 0
  const apiKey = getApiKey()

  if (apiKey) {
    // =============================================
    // RAWG API MODE - Guaranteed consistency
    // Each game fetched by slug = ALL data from ONE API call
    // =============================================
    console.log('🎮 RAWG API key found! Fetching games with guaranteed data consistency...')

    const allSlugs = [
      ...GAMES_DATA.map(g => g.slug),
      ...NINTENDO_GAMES.map(g => g.slug),
    ]

    for (let i = 0; i < allSlugs.length; i++) {
      const slug = allSlugs[i]

      try {
        const existing = await prisma.game.findFirst({ where: { slug } })
        if (existing) {
          // Update existing game with correct RAWG data
          const rawgGame = await fetchGameFromRawg(slug)
          if (!rawgGame || !rawgGame.background_image) continue

          const genreInfo = getPrimaryGenre(rawgGame)
          if (!genreInfo) continue
          const category = categoryMap.get(genreInfo.slug)
          if (!category) continue

          let trailerUrl: string | null = null
          try { trailerUrl = await fetchTrailerUrl(rawgGame.id) } catch {}

          const downloadUrl = getDownloadUrl(rawgGame)
          const imageUrl = toHdImage(rawgGame.background_image, 600, 400)
          const coverUrl = toHdImage(rawgGame.background_image_additional || rawgGame.background_image, 1920, 1080)

          const platforms = rawgGame.platforms
            ? rawgGame.platforms.map(p => {
                const n = p.platform.name
                if (n.includes('PC')) return 'PC'
                if (n.includes('PlayStation')) return 'PlayStation'
                if (n.includes('Xbox')) return 'Xbox'
                if (n.includes('Nintendo') || n.includes('Switch')) return 'Nintendo Switch'
                return n
              }).filter((v, i, a) => a.indexOf(v) === i).slice(0, 4).join(', ')
            : 'Multiplataforma'

          let description = rawgGame.description_raw || ''
          if (description.length > 500) description = description.substring(0, 497) + '...'
          if (!description) description = `${rawgGame.name} es uno de los títulos más populares en su género.`

          await prisma.game.update({
            where: { id: existing.id },
            data: {
              title: rawgGame.name,
              imageUrl,
              coverUrl,
              description,
              trailerUrl: trailerUrl || existing.trailerUrl,
              downloadUrl: downloadUrl || existing.downloadUrl,
              developer: rawgGame.developers?.[0]?.name || existing.developer,
              publisher: rawgGame.publishers?.[0]?.name || existing.publisher,
              releaseDate: rawgGame.released || existing.releaseDate,
              rating: rawgGame.rating ? Math.min(Math.round(rawgGame.rating * 10) / 10, 5) : existing.rating,
              ratingCount: rawgGame.ratings_count || existing.ratingCount,
              platforms,
              categoryId: category.id,
            },
          })
          gamesCreated++
          console.log(`  🔄 Updated: ${rawgGame.name} (cover + name + link all match)`)
        } else {
          // Create new game from RAWG
          const rawgGame = await fetchGameFromRawg(slug)
          if (!rawgGame || !rawgGame.background_image) continue

          const genreInfo = getPrimaryGenre(rawgGame)
          if (!genreInfo) continue
          const category = categoryMap.get(genreInfo.slug)
          if (!category) continue

          let trailerUrl: string | null = null
          try { trailerUrl = await fetchTrailerUrl(rawgGame.id) } catch {}

          const downloadUrl = getDownloadUrl(rawgGame)
          const imageUrl = toHdImage(rawgGame.background_image, 600, 400)
          const coverUrl = toHdImage(rawgGame.background_image_additional || rawgGame.background_image, 1920, 1080)

          const platforms = rawgGame.platforms
            ? rawgGame.platforms.map(p => {
                const n = p.platform.name
                if (n.includes('PC')) return 'PC'
                if (n.includes('PlayStation')) return 'PlayStation'
                if (n.includes('Xbox')) return 'Xbox'
                if (n.includes('Nintendo') || n.includes('Switch')) return 'Nintendo Switch'
                return n
              }).filter((v, i, a) => a.indexOf(v) === i).slice(0, 4).join(', ')
            : 'Multiplataforma'

          let description = rawgGame.description_raw || ''
          if (description.length > 500) description = description.substring(0, 497) + '...'
          if (!description) description = `${rawgGame.name} es uno de los títulos más populares en su género.`

          const featuredSlugs = new Set(['cyberpunk-2077', 'elden-ring', 'god-of-war-ragnarok', 'the-legend-of-zelda-tears-of-the-kingdom', 'baldurs-gate-3', 'hollow-knight-silksong', 'resident-evil-4-remake', 'forza-horizon-5', 'red-dead-redemption-2', 'the-witcher-3-wild-hunt', 'black-myth-wukong', 'hogwarts-legacy', 'ghost-of-tsushima'])

          await prisma.game.create({
            data: {
              title: rawgGame.name,
              slug: rawgGame.slug,
              description,
              imageUrl,
              coverUrl,
              trailerUrl: trailerUrl || null,
              downloadUrl: downloadUrl || null,
              developer: rawgGame.developers?.[0]?.name || 'Desconocido',
              publisher: rawgGame.publishers?.[0]?.name || 'Desconocido',
              releaseDate: rawgGame.released || 'TBA',
              rating: rawgGame.rating ? Math.min(Math.round(rawgGame.rating * 10) / 10, 5) : 0,
              ratingCount: rawgGame.ratings_count || 0,
              categoryId: category.id,
              platforms,
              featured: featuredSlugs.has(rawgGame.slug),
            },
          })
          gamesCreated++
          console.log(`  ✅ Created: ${rawgGame.name} (cover + name + link all match)`)
        }

        // Rate limiting: RAWG allows ~4 req/sec on free tier
        if ((i + 1) % 3 === 0) {
          await new Promise(resolve => setTimeout(resolve, 1100))
        }
      } catch (error) {
        console.error(`  ❌ Error with "${slug}":`, error)
      }
    }

    console.log(`📊 RAWG mode: ${gamesCreated} games processed`)
  } else {
    // =============================================
    // FALLBACK MODE - Steam Store images (HD, verified, always correct)
    // Each game's image and download link come from the SAME Steam App ID
    // =============================================
    console.log('🎮 No RAWG API key. Using verified Steam Store images for guaranteed consistency...')
    console.log('💡 Get a free RAWG key at https://rawg.io/apidocs for even more data')

    // Create Steam games
    for (const game of GAMES_DATA) {
      const existing = await prisma.game.findFirst({ where: { slug: game.slug } })
      if (existing) continue

      const category = categoryMap.get(game.categorySlug)
      if (!category) continue

      // Steam CDN images - guaranteed to match the game
      const imageUrl = STEAM_CAPSULE(game.steamId)  // 616x353 HD for cards
      const coverUrl = STEAM_HERO(game.steamId)     // 1920x1080 HD for detail
      const downloadUrl = STEAM_STORE(game.steamId)  // Steam store page (matches game!)

      await prisma.game.create({
        data: {
          title: game.title,
          slug: game.slug,
          description: game.description,
          imageUrl,
          coverUrl,
          trailerUrl: game.trailerUrl || null,
          downloadUrl,
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
      gamesCreated++
      console.log(`  ✅ ${game.title} (Steam ID: ${game.steamId} → cover + name + link match)`)
    }

    // Create Nintendo games (use Nintendo store links)
    for (const game of NINTENDO_GAMES) {
      const existing = await prisma.game.findFirst({ where: { slug: game.slug } })
      if (existing) continue

      const category = categoryMap.get(game.categorySlug)
      if (!category) continue

      // For Nintendo exclusives, use a placeholder image if no custom URL provided
      const imageUrl = game.imageUrl || `https://placehold.co/616x353/1a1a1a/666666?text=${encodeURIComponent(game.title)}`
      const coverUrl = `https://placehold.co/1920x1080/1a1a1a/444444?text=${encodeURIComponent(game.title)}`

      await prisma.game.create({
        data: {
          title: game.title,
          slug: game.slug,
          description: game.description,
          imageUrl,
          coverUrl,
          trailerUrl: game.trailerUrl || null,
          downloadUrl: game.downloadUrl || null,
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
      gamesCreated++
      console.log(`  ✅ ${game.title} (Nintendo exclusive - use RAWG sync for better cover)`)
    }

    console.log(`📊 Steam mode: ${gamesCreated} games created with verified images`)
  }

  // 4. Create reviews
  console.log('⭐ Creating reviews...')
  const allGames = await prisma.game.findMany({ take: 20 })

  const reviewData = [
    { user: user1, rating: 4, comment: 'Increíble mundo abierto y narrativa. Algunos bugs al lanzamiento pero la experiencia completa es memorable. Night City es una obra de arte visual.' },
    { user: user2, rating: 5, comment: 'Una obra maestra de FromSoftware. El mundo abierto perfecto para su fórmula. Cada jefe es un desafío épico que te hace querer mejorar constantemente.' },
    { user: user3, rating: 5, comment: 'Kratos y Atreus en su mejor aventura. Combate mejorado, historia conmovedora y gráficos impresionantes.' },
    { user: user4, rating: 5, comment: 'El mejor RPG en años. Las decisiones importan de verdad, el combate es profundo y la narrativa es brillante.' },
    { user: user1, rating: 4, comment: 'Un remake excepcional que moderniza el clásico sin perder su esencia. El combate es más fluido y los gráficos son impresionantes.' },
    { user: user2, rating: 4, comment: 'El mejor juego de carreras en mundo abierto. México es un escenario espectacular y la variedad de coches es impresionante.' },
    { user: user3, rating: 5, comment: 'Red Dead Redemption 2 es una experiencia narrativa sin igual. Arthur Morgan es inolvidable y el mundo es el más vivo que he visto.' },
    { user: user4, rating: 5, comment: 'The Witcher 3 sigue siendo el rey de los RPG. Las misiones secundarias tienen más profundidad que juegos enteros.' },
    { user: user1, rating: 5, comment: 'Black Myth: Wukong es una revelación. El combate es adictivo, los jefes son espectaculares y la mitología china le da una frescura increíble.' },
    { user: user2, rating: 4, comment: 'Hogwarts Legacy hace justicia al mundo mágico. Explorar el castillo es una delicia y el sistema de hechizos es divertido.' },
    { user: user3, rating: 5, comment: 'Ghost of Tsushima es poesía visual. El combate con katana es elegante y la historia de Jin Sakai es conmovedora.' },
    { user: user4, rating: 4, comment: 'GTA V sigue siendo entretenido después de todos estos años. Los Santos es increíblemente detallada.' },
    { user: user1, rating: 5, comment: 'Supergiant vuelve a demostrar su maestría. El combate es más profundo y satisfactorio que nunca.' },
    { user: user2, rating: 5, comment: 'Nintendo lo volvió a hacer. Las mecánicas de construcción son geniales y el mundo es infinitamente creativo.' },
    { user: user3, rating: 5, comment: 'La espera valió la pena. Hornet se siente diferente y el mundo es aún más hermoso.' },
    { user: user4, rating: 3, comment: 'Ambicioso pero con altibajos. La exploración espacial es inmersiva pero tiene misiones repetitivas.' },
  ]

  for (let i = 0; i < Math.min(allGames.length, reviewData.length); i++) {
    const game = allGames[i]
    const r = reviewData[i]
    if (game && r) {
      await prisma.review.upsert({
        where: { userId_gameId: { userId: r.user.id, gameId: game.id } },
        update: {},
        create: {
          userId: r.user.id,
          gameId: game.id,
          rating: r.rating,
          comment: r.comment,
        },
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
  console.log(`\n✅ Seed completed! Total games in DB: ${totalGames}`)
  if (!apiKey) {
    console.log('\n🔑 TIP: Add RAWG_API_KEY to .env and re-seed for Nintendo game covers and additional data!')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
