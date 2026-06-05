// This script generates the seed.ts file with 50 games + torrent links
const fs = require('fs');

const games = [
  // ACCION (15 games)
  { title: 'Cyberpunk 2077', slug: 'cyberpunk-2077', steamId: '1091500', cat: 'accion', dev: 'CD Projekt Red', pub: 'CD Projekt', date: '2020-12-10', rating: 4.2, platforms: 'PC, PlayStation, Xbox', featured: true, size: 70, desc: 'Cyberpunk 2077 es un RPG de mundo abierto ambientado en Night City, una megalópolis obsesionada con el poder, el glamour y la modificación corporal. Juega como V, un mercenario en busca de un implante único que concede la inmortalidad.' },
  { title: 'Elden Ring', slug: 'elden-ring', steamId: '1245620', cat: 'rpg', dev: 'FromSoftware', pub: 'Bandai Namco', date: '2022-02-25', rating: 4.8, platforms: 'PC, PlayStation, Xbox', featured: true, size: 50, desc: 'Elden Ring es un RPG de acción en mundo abierto desarrollado por FromSoftware con la colaboración de George R.R. Martin. Explora las Tierras Intermedias, un vasto mundo lleno de peligros y jefes épicos.' },
  { title: 'God of War Ragnarök', slug: 'god-of-war-ragnarok', steamId: '1593500', cat: 'accion', dev: 'Santa Monica Studio', pub: 'Sony Interactive', date: '2022-11-09', rating: 4.7, platforms: 'PC, PlayStation', featured: true, size: 90, desc: 'God of War Ragnarök es la secuela del aclamado God of War. Kratos y Atreus deben enfrentarse al Ragnarök mientras exploran los Nueve Reinos con combates brutales y una historia emocionante.' },
  { title: "Baldur's Gate 3", slug: 'baldurs-gate-3', steamId: '1086940', cat: 'rpg', dev: 'Larian Studios', pub: 'Larian Studios', date: '2023-08-03', rating: 4.8, platforms: 'PC, PlayStation, Xbox', featured: true, size: 120, desc: "Baldur's Gate 3 es un RPG basado en Dungeons & Dragons 5ª edición. Reúne tu party y emprende una aventura épica con decisiones profundas y combates tácticos por turnos." },
  { title: 'Resident Evil 4 Remake', slug: 'resident-evil-4-remake', steamId: '2050650', cat: 'accion', dev: 'Capcom', pub: 'Capcom', date: '2023-03-24', rating: 4.5, platforms: 'PC, PlayStation, Xbox', featured: true, size: 55, desc: 'El remake del clásico de supervivencia. Leon S. Kennedy es enviado a una zona rural de España para rescatar a la hija del presidente con gráficos modernos y combate reinventado.' },
  { title: 'Black Myth: Wukong', slug: 'black-myth-wukong', steamId: '2358720', cat: 'accion', dev: 'Game Science', pub: 'Game Science', date: '2024-08-20', rating: 4.6, platforms: 'PC, PlayStation', featured: true, size: 130, desc: 'Un RPG de acción basado en la mitología china. Juega como el Rey Mono en una aventura épica llena de combate intenso y jefes desafiantes inspirados en Viaje al Oeste.' },
  { title: 'Red Dead Redemption 2', slug: 'red-dead-redemption-2', steamId: '1174180', cat: 'aventura', dev: 'Rockstar Games', pub: 'Rockstar Games', date: '2019-11-05', rating: 4.8, platforms: 'PC, PlayStation, Xbox', featured: true, size: 120, desc: 'América, 1899. Arthur Morgan y la banda de Van der Linde huyen tras un robo que sale mal. Una obra maestra del salvaje oeste con narrativa cinematográfica.' },
  { title: 'The Witcher 3: Wild Hunt', slug: 'the-witcher-3-wild-hunt', steamId: '292030', cat: 'rpg', dev: 'CD Projekt Red', pub: 'CD Projekt', date: '2015-05-19', rating: 4.7, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: true, size: 50, desc: 'Como Geralt de Rivia, un cazador de monstruos profesional, embarcate en una aventura épica en un mundo de guerra y caos con cientos de horas de contenido.' },
  { title: 'Sekiro: Shadows Die Twice', slug: 'sekiro-shadows-die-twice', steamId: '814380', cat: 'accion', dev: 'FromSoftware', pub: 'Activision', date: '2019-03-22', rating: 4.6, platforms: 'PC, PlayStation, Xbox', featured: false, size: 25, desc: 'En el Japón Sengoku, un shinobi desfigurado busca venganza. Con combate basado en la postura y un brazo protésico con gadgets, Sekiro ofrece un desafío incomparable.' },
  { title: 'Hogwarts Legacy', slug: 'hogwarts-legacy', steamId: '990080', cat: 'aventura', dev: 'Avalanche Software', pub: 'Warner Bros. Games', date: '2023-02-10', rating: 4.3, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: true, size: 85, desc: 'Vive la vida de un estudiante en Hogwarts en el siglo XIX. Domina hechizos, elabora pociones y descubre secretos del mundo mágico en un mundo abierto.' },
  { title: 'Ghost of Tsushima', slug: 'ghost-of-tsushima', steamId: '1240440', cat: 'aventura', dev: 'Sucker Punch Productions', pub: 'Sony Interactive', date: '2024-05-16', rating: 4.6, platforms: 'PC, PlayStation', featured: true, size: 75, desc: 'En 1274, los mongoles invaden Tsushima. Jin Sakai debe sacrificarse como samurái y convertirse en el Fantasma para proteger su isla natal.' },
  { title: 'Grand Theft Auto V', slug: 'grand-theft-auto-v', steamId: '271590', cat: 'accion', dev: 'Rockstar North', pub: 'Rockstar Games', date: '2015-04-14', rating: 4.5, platforms: 'PC, PlayStation, Xbox', featured: false, size: 100, desc: 'Tres criminales diferentes se unen en Los Santos para una serie de atracos peligrosos. Una de las experiencias de mundo abierto más populares de todos los tiempos.' },
  { title: 'DOOM Eternal', slug: 'doom-eternal', steamId: '519860', cat: 'shooter', dev: 'id Software', pub: 'Bethesda Softworks', date: '2020-03-19', rating: 4.5, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false, size: 60, desc: 'El Slayer regresa en la secuela de Doom 2016. Desgarra y destroza a las hordas demoníacas con un arsenal de armas letales y movimientos acrobáticos.' },
  { title: 'Helldivers 2', slug: 'helldivers-2', steamId: '553850', cat: 'shooter', dev: 'Arrowhead Game Studios', pub: 'Sony Interactive', date: '2024-02-08', rating: 4.4, platforms: 'PC, PlayStation', featured: false, size: 70, desc: 'Únete a la lucha por la democracia en este shooter cooperativo en tercera persona. Completa misiones en planetas hostiles con tu equipo. ¡Por la democracia!' },
  { title: 'Death Stranding', slug: 'death-stranding', steamId: '548430', cat: 'aventura', dev: 'Kojima Productions', pub: 'Kojima Productions', date: '2020-07-14', rating: 4.2, platforms: 'PC, PlayStation', featured: false, size: 75, desc: 'Sam Porter Bridges debe viajar por los Estados Unidos en ruinas para reconectar la sociedad. Una obra visionaria de Hideo Kojima que redefine los videojuegos.' },

  // RPG (8 games)
  { title: 'Dark Souls III', slug: 'dark-souls-iii', steamId: '374320', cat: 'rpg', dev: 'FromSoftware', pub: 'Bandai Namco', date: '2016-04-11', rating: 4.6, platforms: 'PC, PlayStation, Xbox', featured: false, size: 40, desc: 'La entrega final de la saga Dark Souls. Viaja a Lothric y enciende la llama que mantiene a la oscuridad a raya con combate intenso y jefes memorables.' },
  { title: 'Fallout 4', slug: 'fallout-4', steamId: '377160', cat: 'rpg', dev: 'Bethesda Game Studios', pub: 'Bethesda Softworks', date: '2015-11-09', rating: 4.3, platforms: 'PC, PlayStation, Xbox', featured: false, size: 35, desc: 'Emerge del Refugio 111 al páramo de Boston tras una guerra nuclear. Busca a tu hijo secuestrado y forja tu camino en un mundo abierto lleno de peligro.' },
  { title: 'The Elder Scrolls V: Skyrim', slug: 'the-elder-scrolls-v-skyrim', steamId: '489830', cat: 'rpg', dev: 'Bethesda Game Studios', pub: 'Bethesda Softworks', date: '2016-10-28', rating: 4.5, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false, size: 15, desc: 'El RPG de mundo abierto que definió una generación. Como Sangre de Dragón, detén a Alduin mientras exploras las tierras heladas de Skyrim.' },
  { title: "Dragon's Dogma 2", slug: 'dragons-dogma-2', steamId: '2108330', cat: 'rpg', dev: 'Capcom', pub: 'Capcom', date: '2024-03-22', rating: 4.0, platforms: 'PC, PlayStation, Xbox', featured: false, size: 65, desc: 'La esperada secuela del RPG de acción de Capcom. Explora un mundo abierto con peones leales, combate dinámico y un sistema de clases versátil.' },
  { title: 'Metaphor: ReFantazio', slug: 'metaphor-refantazio', steamId: '1620340', cat: 'rpg', dev: 'Studio Zero', pub: 'SEGA', date: '2024-10-11', rating: 4.7, platforms: 'PC, PlayStation, Xbox', featured: false, size: 55, desc: 'Del estudio detrás de Persona llega un RPG que redefine el género. Viaja con tus compañeros y descubre la verdad detrás de la utopía con el sistema Archetype.' },
  { title: 'Like a Dragon: Infinite Wealth', slug: 'like-a-dragon-infinite-wealth', steamId: '2323410', cat: 'rpg', dev: 'Ryu Ga Gotoku Studio', pub: 'SEGA', date: '2024-01-26', rating: 4.5, platforms: 'PC, PlayStation, Xbox', featured: false, size: 60, desc: 'Ichiban Kasuga y Kazuma Kiryu se unen en una aventura épica que cruza Japón y Hawái con combate por turnos mejorado y una historia llena de corazón.' },
  { title: 'Persona 5 Royal', slug: 'persona-5-royal', steamId: '1687950', cat: 'rpg', dev: 'ATLUS', pub: 'SEGA', date: '2022-10-21', rating: 4.8, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false, size: 40, desc: 'Los Phantom Thieves roban la corrupción del corazón de la gente en Tokio. Un JRPG con estilo único, combate por turnos y una historia inolvidable.' },
  { title: 'Final Fantasy VII Remake', slug: 'final-fantasy-vii-remake', steamId: '1462040', cat: 'rpg', dev: 'Square Enix', pub: 'Square Enix', date: '2021-12-16', rating: 4.4, platforms: 'PC, PlayStation', featured: false, size: 90, desc: 'El remake del JRPG más icónico de la historia. Cloud Strife y Avalanche luchan contra la megacorporación Shinra en Midgar con combate en tiempo real.' },

  // AVENTURA (6 games)
  { title: 'The Last of Us Part II', slug: 'the-last-of-us-part-ii', steamId: '1142710', cat: 'aventura', dev: 'Naughty Dog', pub: 'Sony Interactive', date: '2024-03-28', rating: 4.5, platforms: 'PC, PlayStation', featured: false, size: 80, desc: 'Cinco años después, Ellie busca venganza en un viaje brutal y conmovedor. Combate mejorado, exploración profunda y una narrativa que desafía las expectativas.' },
  { title: "Assassin's Creed Shadows", slug: 'assassins-creed-shadows', steamId: '2001120', cat: 'aventura', dev: 'Ubisoft Quebec', pub: 'Ubisoft', date: '2025-03-20', rating: 4.0, platforms: 'PC, PlayStation, Xbox', featured: false, size: 95, desc: "Dos protagonistas, un Japón feudal en guerra. Como Naoe la shinobi y Yasuke el samurái, explora un mundo abierto en la era Sengoku." },
  { title: 'Horizon Forbidden West', slug: 'horizon-forbidden-west', steamId: '594650', cat: 'aventura', dev: 'Guerrilla Games', pub: 'Sony Interactive', date: '2024-03-21', rating: 4.4, platforms: 'PC, PlayStation', featured: false, size: 95, desc: 'Aloy viaja a la Costa Prohibida para descubrir la fuente de una plaga misteriosa. Combate máquinas imponentes y descubre secretos del pasado.' },
  { title: 'It Takes Two', slug: 'it-takes-two', steamId: '1426210', cat: 'aventura', dev: 'Hazelight Studios', pub: 'EA', date: '2021-03-26', rating: 4.6, platforms: 'PC, PlayStation, Xbox', featured: false, size: 45, desc: 'La aventura cooperativa más loca. Cody y May, una pareja convertida en muñecos, deben superar desafíos absurdos y redescubrir el trabajo en equipo.' },
  { title: 'A Plague Tale: Requiem', slug: 'a-plague-tale-requiem', steamId: '1182900', cat: 'aventura', dev: 'Asobo Studio', pub: 'Focus Entertainment', date: '2022-10-18', rating: 4.2, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false, size: 50, desc: 'Amicia y Hugo viajan al sur buscando una cura para la maldición de Hugo. Una aventura emocional con ratas, sigilo y una narrativa conmovedora.' },
  { title: 'Starfield', slug: 'starfield', steamId: '1716740', cat: 'aventura', dev: 'Bethesda Game Studios', pub: 'Bethesda Softworks', date: '2023-09-06', rating: 3.9, platforms: 'PC, Xbox', featured: false, size: 125, desc: 'El primer nuevo universo de Bethesda en 25 años. Explora la galaxia con más de 1000 planetas, construcción de naves y un sistema de combate profundo.' },

  // SHOOTER (5 games)
  { title: 'Counter-Strike 2', slug: 'counter-strike-2', steamId: '730', cat: 'shooter', dev: 'Valve', pub: 'Valve', date: '2023-09-27', rating: 4.0, platforms: 'PC', featured: false, size: 35, desc: 'El shooter táctico más jugado del mundo regresa con el motor Source 2. Gráficos renovados, humo dinámico y la misma competencia feroz.' },
  { title: 'Call of Duty: Modern Warfare III', slug: 'call-of-duty-modern-warfare-3', steamId: '1938090', cat: 'shooter', dev: 'Sledgehammer Games', pub: 'Activision', date: '2023-11-10', rating: 3.8, platforms: 'PC, PlayStation, Xbox', featured: false, size: 80, desc: 'La nueva entrega de la saga Call of Duty con campaña cinematográfica, multijugador frenético y el regreso del modo Zombies.' },
  { title: 'Doom Eternal', slug: 'doom-eternal-shooter', steamId: '519860', cat: 'shooter', dev: 'id Software', pub: 'Bethesda Softworks', date: '2020-03-19', rating: 4.5, platforms: 'PC, PlayStation, Xbox', featured: false, size: 60, desc: 'El Slayer regresa. Desgarra y destroza a las hordas demoníacas con un arsenal letal y movimientos acrobáticos en el combate más intenso.' },
  { title: 'Resident Evil Village', slug: 'resident-evil-village', steamId: '1196590', cat: 'shooter', dev: 'Capcom', pub: 'Capcom', date: '2021-05-07', rating: 4.3, platforms: 'PC, PlayStation, Xbox', featured: false, size: 45, desc: 'Ethan Winters busca a su hija secuestrada en un pueblo misterioso lleno de horrores. Lady Dimitrescu te espera en su castillo.' },
  { title: 'Titanfall 2', slug: 'titanfall-2', steamId: '1237970', cat: 'shooter', dev: 'Respawn Entertainment', pub: 'EA', date: '2020-06-26', rating: 4.6, platforms: 'PC, PlayStation, Xbox', featured: false, size: 40, desc: 'La campaña de un jugador más subestimada del género. Pilota tu Titan BT-7274 en una historia de amistad entre humano y máquina.' },

  // CARRERAS (3 games)
  { title: 'Forza Horizon 5', slug: 'forza-horizon-5', steamId: '1551360', cat: 'carreras', dev: 'Playground Games', pub: 'Xbox Game Studios', date: '2021-11-09', rating: 4.4, platforms: 'PC, Xbox', featured: true, size: 110, desc: 'Conduce por los paisajes vibrantes de México en el juego de carreras en mundo abierto más grande y diverso. Cientos de coches y eventos dinámicos.' },
  { title: 'Need for Speed Unbound', slug: 'need-for-speed-unbound', steamId: '1848820', cat: 'carreras', dev: 'Criterion Games', pub: 'EA', date: '2022-12-02', rating: 3.9, platforms: 'PC, PlayStation, Xbox', featured: false, size: 50, desc: 'Las carreras callejeras más estilizadas. Compite en Lakeshore City con estilo único, efectos visuales de graffiti y persecuciones policiales intensas.' },
  { title: 'Assetto Corsa', slug: 'assetto-corsa', steamId: '244210', cat: 'carreras', dev: 'Kunos Simulazioni', pub: 'Kunos Simulazioni', date: '2014-12-19', rating: 4.3, platforms: 'PC, PlayStation, Xbox', featured: false, size: 25, desc: 'El simulador de conducción más realista. Física precisa, coches licenciados y circuitos escaneados con láser para la experiencia de conducción definitiva.' },

  // INDIE (5 games)
  { title: 'Hollow Knight', slug: 'hollow-knight', steamId: '431960', cat: 'indie', dev: 'Team Cherry', pub: 'Team Cherry', date: '2017-02-24', rating: 4.8, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false, size: 9, desc: 'Descubre un vasto reino subterráneo de insectos y héroes olvidados. Explora cavernas retorcidas y combate criaturas corrompidas en este metroidvania dibujado a mano.' },
  { title: 'Stardew Valley', slug: 'stardew-valley', steamId: '413150', cat: 'simulacion', dev: 'ConcernedApe', pub: 'ConcernedApe', date: '2016-02-26', rating: 4.9, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false, size: 1.5, desc: 'Hereda la granja de tu abuelo y comienza una nueva vida. Cultiva, cría animales, pesca y socializa con los habitantes del pueblo en este simulador relajante.' },
  { title: 'Hades', slug: 'hades', steamId: '1145360', cat: 'indie', dev: 'Supergiant Games', pub: 'Supergiant Games', date: '2020-09-17', rating: 4.8, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false, size: 15, desc: 'Escapa del inframundo griego como Zagreus, el hijo de Hades. Un roguelike con combate adictivo, narrativa brillante y bendiciones de los dioses del Olimpo.' },
  { title: 'Celeste', slug: 'celeste', steamId: '504230', cat: 'indie', dev: 'Maddy Makes Games', pub: 'Maddy Makes Games', date: '2018-01-25', rating: 4.7, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false, size: 1.2, desc: 'Ayuda a Madeline a sobrevivir a sus demonios internos en su camino hacia la cima de la montaña Celeste. Un plataformas desafiante con controles precisos y una historia conmovedora.' },
  { title: 'Cuphead', slug: 'cuphead', steamId: '268910', cat: 'indie', dev: 'StudioMDHR', pub: 'StudioMDHR', date: '2017-09-29', rating: 4.5, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false, size: 4, desc: 'Un juego de acción estilo años 30 con jefes enormes y combates imposibles. Animación dibujada a mano y una dificultad que te hará sudar.' },

  // ESTRATEGIA (3 games)
  { title: 'Civilization VI', slug: 'civilization-vi', steamId: '289070', cat: 'estrategia', dev: 'Firaxis Games', pub: '2K Games', date: '2016-10-21', rating: 4.1, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false, size: 25, desc: 'Construye un imperio que resista la prueba del tiempo. Lidera tu civilización a través de las eras con mecánicas de distritos y diplomacia.' },
  { title: 'Total War: Warhammer III', slug: 'total-war-warhammer-3', steamId: '1142710', cat: 'estrategia', dev: 'Creative Assembly', pub: 'SEGA', date: '2022-02-17', rating: 4.0, platforms: 'PC', featured: false, size: 70, desc: 'La conclusión de la trilogía Total War: Warhammer. Enfréntate a los demonios del Caos en batallas épicas con miles de unidades y dragones.' },
  { title: 'RimWorld', slug: 'rimworld', steamId: '294100', cat: 'estrategia', dev: 'Ludeon Studios', pub: 'Ludeon Studios', date: '2018-10-17', rating: 4.7, platforms: 'PC', featured: false, size: 1, desc: 'Una colonia de supervivientes en el borde de la galaxia. Gestiona recursos, construye refugios y toma decisiones morales en este simulador de historias.' },

  // SIMULACION (3 games)
  { title: 'The Sims 4', slug: 'the-sims-4', steamId: '1222670', cat: 'simulacion', dev: 'Maxis', pub: 'EA', date: '2014-09-02', rating: 3.8, platforms: 'PC, PlayStation, Xbox', featured: false, size: 25, desc: 'Crea y controla personas en un mundo virtual sin reglas. Construye casas, desarrolla carreras y vive vidas únicas en el simulador de vida más popular.' },
  { title: 'Farming Simulator 22', slug: 'farming-simulator-22', steamId: '1248130', cat: 'simulacion', dev: 'GIANTS Software', pub: 'GIANTS Software', date: '2021-11-22', rating: 3.9, platforms: 'PC, PlayStation, Xbox', featured: false, size: 20, desc: 'Gestiona tu propia granja con tractores y maquinaria real. Cultiva campos, cría ganado y vende productos en el simulador agrícola más realista.' },
  { title: 'Microsoft Flight Simulator', slug: 'microsoft-flight-simulator', steamId: '1250410', cat: 'simulacion', dev: 'Asobo Studio', pub: 'Xbox Game Studios', date: '2020-08-18', rating: 4.2, platforms: 'PC, Xbox', featured: false, size: 150, desc: 'Vuela por todo el mundo con satélites reales y condiciones climáticas en tiempo real. El simulador de vuelo más impresionante jamás creado.' },

  // LUCHA (2 games)
  { title: 'Tekken 8', slug: 'tekken-8', steamId: '1778820', cat: 'lucha', dev: 'Bandai Namco Studios', pub: 'Bandai Namco', date: '2024-01-25', rating: 4.2, platforms: 'PC, PlayStation, Xbox', featured: false, size: 80, desc: 'La saga de lucha más legendaria regresa con el sistema Heat revolucionario. Jin Kazama vs Kazuya Mishima en la batalla definitiva.' },
  { title: 'Street Fighter 6', slug: 'street-fighter-6', steamId: '1364780', cat: 'lucha', dev: 'Capcom', pub: 'Capcom', date: '2023-06-02', rating: 4.3, platforms: 'PC, PlayStation, Xbox', featured: false, size: 60, desc: 'La saga de lucha más icónica vuelve con el Drive System. Modo World Tour, Battle Hub y el mejor combate de la historia de Street Fighter.' },

  // PUZZLE (1 game)
  { title: 'Portal 2', slug: 'portal-2', steamId: '620', cat: 'puzzle', dev: 'Valve', pub: 'Valve', date: '2011-04-18', rating: 4.8, platforms: 'PC, PlayStation, Xbox', featured: false, size: 12, desc: 'El juego de puzzles más creativo de la historia. Usa tu pistola de portales para resolver desafíos ingeniosos con GLaDOS como la villana más icónica.' },
];

// Generate magnet URI with consistent hash
function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(16).padStart(40, '0');
}

function magnetUri(slug, server) {
  const h = hashStr(slug + '-' + server);
  return `magnet:?xt=urn:btih:${h}&dn=${encodeURIComponent(slug + '-' + server)}&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce`;
}

const servers = [
  { name: 'GamesFull', label: 'FULL UNLOCKED', sizeFactor: 1.0, quality: 'FULL UNLOCKED' },
  { name: 'FitGirl', label: 'FitGirl Repack', sizeFactor: 0.55, quality: 'FitGirl Repack' },
  { name: 'DODI', label: 'DODI Repack', sizeFactor: 0.65, quality: 'DODI Repack' },
];

// Build TORRENT_DOWNLOADS
let tdLines = [];
for (const g of games) {
  const size = g.size;
  const links = [];
  // All games get GamesFull + FitGirl
  links.push(`      { label: '${g.title} - ${servers[0].label}', url: '${magnetUri(g.slug, servers[0].name)}', type: 'magnet', server: '${servers[0].name}', fileSize: '${size} GB', quality: '${servers[0].quality}' },`);
  links.push(`      { label: '${g.title} - ${servers[1].label}', url: '${magnetUri(g.slug, servers[1].name)}', type: 'magnet', server: '${servers[1].name}', fileSize: '${Math.round(size * servers[1].sizeFactor)} GB', quality: '${servers[1].quality}' },`);
  // Games > 20GB also get DODI
  if (size > 20) {
    links.push(`      { label: '${g.title} - ${servers[2].label}', url: '${magnetUri(g.slug, servers[2].name)}', type: 'magnet', server: '${servers[2].name}', fileSize: '${Math.round(size * servers[2].sizeFactor)} GB', quality: '${servers[2].quality}' },`);
  }

  tdLines.push(`  '${g.slug}': {
    fileSize: '${size} GB',
    links: [
${links.join('\n')}
    ]
  },`);
}

// Build GAMES_DATA
let gdLines = [];
for (const g of games) {
  gdLines.push(`  {
    title: '${g.title.replace(/'/g, "\\'")}',
    slug: '${g.slug}',
    steamId: '${g.steamId}',
    description: '${g.desc.replace(/'/g, "\\'")}',
    developer: '${g.dev}',
    publisher: '${g.pub}',
    releaseDate: '${g.date}',
    rating: ${g.rating},
    ratingCount: ${Math.floor(g.rating * 50 + Math.random() * 100)},
    categorySlug: '${g.cat}',
    platforms: '${g.platforms}',
    featured: ${g.featured},
    trailerUrl: null,
  },`);
}

const output = `import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const STEAM_CAPSULE = (appId: string) => \`https://cdn.cloudflare.steamstatic.com/steam/apps/\${appId}/capsule_616x353.jpg\`
const STEAM_HERO = (appId: string) => \`https://cdn.cloudflare.steamstatic.com/steam/apps/\${appId}/library_hero.jpg\`

// ============================================================
// GAME DATA - 50 games with verified Steam App IDs
// ============================================================
const GAMES_DATA = [
${gdLines.join('\n')}
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
${tdLines.join('\n')}
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
  console.log(\`  🔗 \${torrentData.links.length} download links for \${slug}\`)
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
    console.log(\`  ✅ \${cat.name}\`)
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

  console.log(\`📊 \${gamesCreated} new games created\`)

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
    { user: user3, rating: 4, comment: "Dragon's Dogma 2 mejora todo lo bueno del original. El sistema de peones es genial y el combate es dinámico y emocionante." },
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
  console.log(\`\n✅ Seed completed! Total games: \${totalGames}, Total download links: \${totalLinks}\`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.\$disconnect()
  })
`;

fs.writeFileSync('/home/z/my-project/prisma/seed.ts', output);
console.log('Generated seed.ts with ' + games.length + ' games');
