import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

const STEAM_CAPSULE = (appId: string) => `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/capsule_616x353.jpg`
const STEAM_HERO = (appId: string) => `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_hero.jpg`

function magnetUri(slug: string, server: string): string {
  const hash = Buffer.from(slug + '-' + server).toString('hex').padEnd(40, '0').slice(0, 40)
  return `magnet:?xt=urn:btih:${hash}&dn=${encodeURIComponent(slug + '-' + server)}&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.bittor.pw:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce`
}

const EXTRA_GAMES = [
  { title: 'The Last of Us Part II', slug: 'the-last-of-us-part-ii', steamId: '1142710', cat: 'aventura', dev: 'Naughty Dog', pub: 'Sony Interactive', date: '2024-03-28', rating: 4.5, platforms: 'PC, PlayStation', featured: false, size: 80, desc: 'Cinco años después, Ellie busca venganza en un viaje brutal y conmovedor con combate mejorado y una narrativa que desafía las expectativas.' },
  { title: 'Persona 5 Royal', slug: 'persona-5-royal', steamId: '1687950', cat: 'rpg', dev: 'ATLUS', pub: 'SEGA', date: '2022-10-21', rating: 4.8, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false, size: 40, desc: 'Los Phantom Thieves roban la corrupción del corazón de la gente en Tokio. Un JRPG con estilo único y combate por turnos.' },
  { title: 'Final Fantasy VII Remake', slug: 'final-fantasy-vii-remake', steamId: '1462040', cat: 'rpg', dev: 'Square Enix', pub: 'Square Enix', date: '2021-12-16', rating: 4.4, platforms: 'PC, PlayStation', featured: false, size: 90, desc: 'El remake del JRPG más icónico. Cloud Strife y Avalanche luchan contra Shinra en Midgar con combate en tiempo real.' },
  { title: 'A Plague Tale: Requiem', slug: 'a-plague-tale-requiem', steamId: '1182900', cat: 'aventura', dev: 'Asobo Studio', pub: 'Focus Entertainment', date: '2022-10-18', rating: 4.2, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false, size: 50, desc: 'Amicia y Hugo viajan al sur buscando una cura. Una aventura emocional con ratas, sigilo y narrativa conmovedora.' },
  { title: 'Call of Duty: Modern Warfare III', slug: 'call-of-duty-modern-warfare-3', steamId: '1938090', cat: 'shooter', dev: 'Sledgehammer Games', pub: 'Activision', date: '2023-11-10', rating: 3.8, platforms: 'PC, PlayStation, Xbox', featured: false, size: 80, desc: 'La nueva entrega de Call of Duty con campaña cinematográfica, multijugador frenético y el regreso del modo Zombies.' },
  { title: 'Resident Evil Village', slug: 'resident-evil-village', steamId: '1196590', cat: 'shooter', dev: 'Capcom', pub: 'Capcom', date: '2021-05-07', rating: 4.3, platforms: 'PC, PlayStation, Xbox', featured: false, size: 45, desc: 'Ethan Winters busca a su hija en un pueblo misterioso lleno de horrores. Lady Dimitrescu te espera en su castillo.' },
  { title: 'Titanfall 2', slug: 'titanfall-2', steamId: '1237970', cat: 'shooter', dev: 'Respawn Entertainment', pub: 'EA', date: '2020-06-26', rating: 4.6, platforms: 'PC, PlayStation, Xbox', featured: false, size: 40, desc: 'La campaña más subestimada del género. Pilota tu Titan BT-7274 en una historia de amistad entre humano y máquina.' },
  { title: 'Need for Speed Unbound', slug: 'need-for-speed-unbound', steamId: '1848820', cat: 'carreras', dev: 'Criterion Games', pub: 'EA', date: '2022-12-02', rating: 3.9, platforms: 'PC, PlayStation, Xbox', featured: false, size: 50, desc: 'Las carreras callejeras más estilizadas en Lakeshore City con efectos de graffiti y persecuciones policiales.' },
  { title: 'Assetto Corsa', slug: 'assetto-corsa', steamId: '244210', cat: 'carreras', dev: 'Kunos Simulazioni', pub: 'Kunos Simulazioni', date: '2014-12-19', rating: 4.3, platforms: 'PC, PlayStation, Xbox', featured: false, size: 25, desc: 'El simulador de conducción más realista con física precisa, coches licenciados y circuitos escaneados con láser.' },
  { title: 'Hades', slug: 'hades', steamId: '1145360', cat: 'indie', dev: 'Supergiant Games', pub: 'Supergiant Games', date: '2020-09-17', rating: 4.8, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false, size: 15, desc: 'Escapa del inframundo griego como Zagreus. Un roguelike con combate adictivo y bendiciones de los dioses del Olimpo.' },
  { title: 'Cuphead', slug: 'cuphead', steamId: '268910', cat: 'indie', dev: 'StudioMDHR', pub: 'StudioMDHR', date: '2017-09-29', rating: 4.5, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false, size: 4, desc: 'Un juego de acción estilo años 30 con jefes enormes y animación dibujada a mano. La dificultad te hará sudar.' },
  { title: 'RimWorld', slug: 'rimworld', steamId: '294100', cat: 'estrategia', dev: 'Ludeon Studios', pub: 'Ludeon Studios', date: '2018-10-17', rating: 4.7, platforms: 'PC', featured: false, size: 1, desc: 'Una colonia de supervivientes en el borde de la galaxia. Gestiona recursos y toma decisiones morales en este simulador.' },
  { title: 'The Sims 4', slug: 'the-sims-4', steamId: '1222670', cat: 'simulacion', dev: 'Maxis', pub: 'EA', date: '2014-09-02', rating: 3.8, platforms: 'PC, PlayStation, Xbox', featured: false, size: 25, desc: 'Crea y controla personas en un mundo virtual. Construye casas, desarrolla carreras y vive vidas únicas.' },
  { title: 'Farming Simulator 22', slug: 'farming-simulator-22', steamId: '1248130', cat: 'simulacion', dev: 'GIANTS Software', pub: 'GIANTS Software', date: '2021-11-22', rating: 3.9, platforms: 'PC, PlayStation, Xbox', featured: false, size: 20, desc: 'Gestiona tu granja con tractores reales. Cultiva campos, cría ganado y vende productos en el simulador más realista.' },
  { title: 'Microsoft Flight Simulator', slug: 'microsoft-flight-simulator', steamId: '1250410', cat: 'simulacion', dev: 'Asobo Studio', pub: 'Xbox Game Studios', date: '2020-08-18', rating: 4.2, platforms: 'PC, Xbox', featured: false, size: 150, desc: 'Vuela por todo el mundo con satélites reales y clima en tiempo real. El simulador de vuelo más impresionante.' },
  { title: 'Street Fighter 6', slug: 'street-fighter-6', steamId: '1364780', cat: 'lucha', dev: 'Capcom', pub: 'Capcom', date: '2023-06-02', rating: 4.3, platforms: 'PC, PlayStation, Xbox', featured: false, size: 60, desc: 'La saga de lucha más icónica vuelve con el Drive System. World Tour, Battle Hub y el mejor combate de Street Fighter.' },
  { title: 'Zelda: Tears of the Kingdom', slug: 'the-legend-of-zelda-tears-of-the-kingdom', steamId: '0', cat: 'aventura', dev: 'Nintendo EPD', pub: 'Nintendo', date: '2023-05-12', rating: 4.9, platforms: 'Nintendo Switch', featured: true, size: 18, desc: 'La secuela de Breath of the Wild. Explora islas flotantes y un Hyrule transformado con nuevas habilidades como Ultramano.' },
  { title: 'Super Mario Odyssey', slug: 'super-mario-odyssey', steamId: '0', cat: 'plataformas', dev: 'Nintendo EPD', pub: 'Nintendo', date: '2017-10-27', rating: 4.8, platforms: 'Nintendo Switch', featured: false, size: 6, desc: 'Viaja por el mundo con Mario y Cappy en esta aventura 3D. Posee enemigos y objetos con Cappy.' },
  { title: 'Mario Kart 8 Deluxe', slug: 'mario-kart-8-deluxe', steamId: '0', cat: 'carreras', dev: 'Nintendo EPD', pub: 'Nintendo', date: '2017-04-28', rating: 4.6, platforms: 'Nintendo Switch', featured: false, size: 7, desc: 'El juego de carreras más divertido. Compite con Mario y sus amigos en pistas locas con objetos caóticos.' },
  { title: 'Super Smash Bros Ultimate', slug: 'super-smash-bros-ultimate', steamId: '0', cat: 'lucha', dev: 'Bandai Namco Studios', pub: 'Nintendo', date: '2018-12-07', rating: 4.7, platforms: 'Nintendo Switch', featured: false, size: 22, desc: 'El juego de lucha definitivo con el roster más grande. Multijugador para hasta 8 jugadores simultáneos.' },
  { title: 'Animal Crossing: New Horizons', slug: 'animal-crossing-new-horizons', steamId: '0', cat: 'simulacion', dev: 'Nintendo EPD', pub: 'Nintendo', date: '2020-03-20', rating: 4.5, platforms: 'Nintendo Switch', featured: false, size: 7, desc: 'Crea tu isla paradisíaca. Decora, construye, pesca y socializa con adorables vecinos en tiempo real.' },
  { title: 'Metroid Dread', slug: 'metroid-dread', steamId: '0', cat: 'accion', dev: 'MercurySteam', pub: 'Nintendo', date: '2021-10-08', rating: 4.4, platforms: 'Nintendo Switch', featured: false, size: 4, desc: 'Samus Aran se enfrenta a los E.M.M.I. en el planeta ZDR. Explora, descubre habilidades y huye de los letales robots.' },
  { title: 'Pokemon Scarlet & Violet', slug: 'pokemon-scarlet-violet', steamId: '0', cat: 'rpg', dev: 'Game Freak', pub: 'Nintendo', date: '2022-11-18', rating: 3.9, platforms: 'Nintendo Switch', featured: false, size: 12, desc: 'Explora la región de Paldea en la primera aventura de mundo abierto de Pokemon. Captura, entrena y combate.' },
  { title: 'God of War (2018)', slug: 'god-of-war-2018', steamId: '1593500', cat: 'accion', dev: 'Santa Monica Studio', pub: 'Sony Interactive', date: '2022-01-14', rating: 4.7, platforms: 'PC, PlayStation', featured: true, size: 70, desc: 'Kratos vive en Midgard con su hijo Atreus. Tras la muerte de su esposa, emprende un viaje para esparcir sus cenizas.' },
  { title: 'Spider-Man Remastered', slug: 'spider-man-remastered', steamId: '1817070', cat: 'accion', dev: 'Insomniac Games', pub: 'Sony Interactive', date: '2022-08-12', rating: 4.5, platforms: 'PC, PlayStation', featured: true, size: 75, desc: 'Balancea por Nueva York como Spider-Man. Combate criminales y vive la historia de Peter Parker.' },
  { title: 'Dead Space Remake', slug: 'dead-space-remake', steamId: '1693980', cat: 'shooter', dev: 'Motive Studio', pub: 'EA', date: '2023-01-27', rating: 4.4, platforms: 'PC, PlayStation, Xbox', featured: false, size: 50, desc: 'El remake del clásico de horror espacial. Isaac Clarke explora la USG Ishimura infestada de necromorfos.' },
  { title: 'Lies of P', slug: 'lies-of-p', steamId: '1623330', cat: 'accion', dev: 'Neowiz Games', pub: 'Neowiz', date: '2023-09-19', rating: 4.2, platforms: 'PC, PlayStation, Xbox', featured: false, size: 40, desc: 'Un souls-like inspirado en Pinocho. Explora la ciudad de Krat, combate con armas mecánicas y descubre la verdad.' },
  { title: 'Remnant 2', slug: 'remnant-2', steamId: '1282100', cat: 'shooter', dev: 'Gunfire Games', pub: 'Gearbox Publishing', date: '2023-07-25', rating: 4.1, platforms: 'PC, PlayStation, Xbox', featured: false, size: 65, desc: 'Un shooter cooperativo con elementos souls-like. Explora mundos generados proceduralmente y combate jefes épicos.' },
  { title: 'Cyberpunk 2077: Phantom Liberty', slug: 'cyberpunk-2077-phantom-liberty', steamId: '1091500', cat: 'accion', dev: 'CD Projekt Red', pub: 'CD Projekt', date: '2023-09-26', rating: 4.5, platforms: 'PC, PlayStation, Xbox', featured: true, size: 85, desc: 'La expansión masiva de Cyberpunk 2077. V debe rescatar al presidente en Dogtown, un distrito cerrado lleno de peligro.' },
  { title: 'The Legend of Zelda: Breath of the Wild', slug: 'the-legend-of-zelda-breath-of-the-wild', steamId: '0', cat: 'aventura', dev: 'Nintendo EPD', pub: 'Nintendo', date: '2017-03-03', rating: 4.9, platforms: 'Nintendo Switch', featured: true, size: 15, desc: 'Explora el reino de Hyrule como Link en esta aventura revolucionaria de mundo abierto que redefine el género.' },
  { title: 'Mass Effect Legendary Edition', slug: 'mass-effect-legendary-edition', steamId: '1328670', cat: 'rpg', dev: 'BioWare', pub: 'EA', date: '2021-05-14', rating: 4.5, platforms: 'PC, PlayStation, Xbox', featured: false, size: 120, desc: 'La trilogía completa remasterizada. Comandante Shepard salva la galaxia en esta épica saga de RPG espacial.' },
  { title: 'Dying Light 2', slug: 'dying-light-2', steamId: '534380', cat: 'accion', dev: 'Techland', pub: 'Techland', date: '2022-02-04', rating: 3.9, platforms: 'PC, PlayStation, Xbox', featured: false, size: 55, desc: 'Parkour y zombies en una ciudad post-apocalíptica. Tus decisiones dan forma al mundo y la historia.' },
  { title: 'Devil May Cry 5', slug: 'devil-may-cry-5', steamId: '601150', cat: 'accion', dev: 'Capcom', pub: 'Capcom', date: '2019-03-08', rating: 4.5, platforms: 'PC, PlayStation, Xbox', featured: false, size: 35, desc: 'Nero, Dante y V se enfrentan a demonios en la entrega más estilizada de la saga de acción hack and slash.' },
  { title: 'BioShock Infinite', slug: 'bioshock-infinite', steamId: '8870', cat: 'shooter', dev: 'Irrational Games', pub: '2K Games', date: '2013-03-26', rating: 4.4, platforms: 'PC, PlayStation, Xbox', featured: false, size: 20, desc: 'Booker DeWitt viaja a la ciudad flotante de Columbia para rescatar a Elizabeth. Un shooter con narrativa brillante.' },
  { title: 'Subnautica', slug: 'subnautica', steamId: '264710', cat: 'aventura', dev: 'Unknown Worlds', pub: 'Unknown Worlds', date: '2018-01-23', rating: 4.5, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false, size: 15, desc: 'Sobrevive en un océano alienígena. Construye bases, explora las profundidades y descubre los secretos del planeta.' },
  { title: 'Valheim', slug: 'valheim', steamId: '892970', cat: 'indie', dev: 'Iron Gate', pub: 'Coffee Stain Publishing', date: '2021-02-02', rating: 4.3, platforms: 'PC, Xbox', featured: false, size: 5, desc: 'Un juego de supervivencia vikingo en un mundo procedural. Construye, explora y lucha contra criaturas mitológicas.' },
  { title: 'Lethal Company', slug: 'lethal-company', steamId: '1966720', cat: 'indie', dev: 'Zeekerss', pub: 'Zeekerss', date: '2023-10-24', rating: 4.4, platforms: 'PC', featured: false, size: 1, desc: 'Un horror cooperativo donde exploras lunas abandonadas recolectando chatarra. Cuidado con las criaturas.' },
  { title: 'Palworld', slug: 'palworld', steamId: '1623730', cat: 'aventura', dev: 'Pocketpair', pub: 'Pocketpair', date: '2024-01-19', rating: 3.8, platforms: 'PC, Xbox', featured: false, size: 40, desc: 'Captura Pals, construye bases y sobrevive en un mundo abierto. Pokemon con armas y supervivencia.' },
  { title: 'Dave the Diver', slug: 'dave-the-diver', steamId: '1868140', cat: 'indie', dev: 'Mintrocket', pub: 'Mintrocket', date: '2023-06-28', rating: 4.6, platforms: 'PC, Nintendo Switch', featured: false, size: 3, desc: 'Bucea de día para capturar peces, gestiona un restaurante de noche. Un indie adictivo que combina dos géneros.' },
  { title: 'Vampire Survivors', slug: 'vampire-survivors', steamId: '1794680', cat: 'indie', dev: 'poncle', pub: 'poncle', date: '2022-10-20', rating: 4.6, platforms: 'PC, Xbox, Nintendo Switch', featured: false, size: 1, desc: 'Sobrevive hordas de monstruos en este roguelike adictivo. Evoluciona armas y descubre combinaciones devastadoras.' },
  { title: 'Cyberpunk 2077: Phantom Liberty', slug: 'cyberpunk-2077-phantom-liberty', steamId: '1091500', cat: 'accion', dev: 'CD Projekt Red', pub: 'CD Projekt', date: '2023-09-26', rating: 4.5, platforms: 'PC, PlayStation, Xbox', featured: true, size: 85, desc: 'La expansión masiva de Cyberpunk 2077. V debe rescatar al presidente en Dogtown, un distrito cerrado lleno de peligro.' },
]

export async function GET(request: NextRequest) {
  try {
    let created = 0
    let linksCreated = 0

    for (const game of EXTRA_GAMES) {
      const existing = await db.game.findFirst({ where: { slug: game.slug } })
      if (existing) {
        const existingLink = await db.downloadLink.findFirst({ where: { gameId: existing.id } })
        if (!existingLink) {
          const servers = [
            { name: 'GamesFull', label: 'FULL UNLOCKED', sizeFactor: 1.0, quality: 'FULL UNLOCKED' },
            { name: 'FitGirl', label: 'FitGirl Repack', sizeFactor: 0.55, quality: 'FitGirl Repack' },
          ]
          if (game.size > 20) {
            servers.push({ name: 'DODI', label: 'DODI Repack', sizeFactor: 0.65, quality: 'DODI Repack' })
          }
          for (const s of servers) {
            await db.downloadLink.create({
              data: {
                gameId: existing.id,
                label: `${game.title} - ${s.label}`,
                url: magnetUri(game.slug, s.name),
                type: 'magnet',
                server: s.name,
                fileSize: `${Math.round(game.size * s.sizeFactor)} GB`,
                quality: s.quality,
              },
            })
            linksCreated++
          }
          if (!existing.fileSize) {
            await db.game.update({ where: { id: existing.id }, data: { fileSize: `${game.size} GB` } })
          }
        }
        continue
      }

      const category = await db.category.findFirst({ where: { slug: game.cat } })
      if (!category) continue

      const imageUrl = game.steamId !== '0' ? STEAM_CAPSULE(game.steamId) : `https://placehold.co/616x353/1a1a1a/666666?text=${encodeURIComponent(game.title)}`
      const coverUrl = game.steamId !== '0' ? STEAM_HERO(game.steamId) : `https://placehold.co/1920x1080/1a1a1a/444444?text=${encodeURIComponent(game.title)}`

      const newGame = await db.game.create({
        data: {
          title: game.title,
          slug: game.slug,
          description: game.desc,
          imageUrl,
          coverUrl,
          downloadUrl: magnetUri(game.slug, 'GamesFull'),
          fileSize: `${game.size} GB`,
          developer: game.dev,
          publisher: game.pub,
          releaseDate: game.date,
          rating: game.rating,
          ratingCount: Math.floor(game.rating * 50 + Math.random() * 100),
          categoryId: category.id,
          platforms: game.platforms,
          featured: game.featured,
        },
      })

      const servers = [
        { name: 'GamesFull', label: 'FULL UNLOCKED', sizeFactor: 1.0, quality: 'FULL UNLOCKED' },
        { name: 'FitGirl', label: 'FitGirl Repack', sizeFactor: 0.55, quality: 'FitGirl Repack' },
      ]
      if (game.size > 20) {
        servers.push({ name: 'DODI', label: 'DODI Repack', sizeFactor: 0.65, quality: 'DODI Repack' })
      }
      for (const s of servers) {
        await db.downloadLink.create({
          data: {
            gameId: newGame.id,
            label: `${game.title} - ${s.label}`,
            url: magnetUri(game.slug, s.name),
            type: 'magnet',
            server: s.name,
            fileSize: `${Math.round(game.size * s.sizeFactor)} GB`,
            quality: s.quality,
          },
        })
        linksCreated++
      }

      created++
    }

    const totalGames = await db.game.count()
    const totalLinks = await db.downloadLink.count()

    return NextResponse.json({
      message: `${created} new games added, ${linksCreated} download links created`,
      totalGames,
      totalLinks,
    })
  } catch (error) {
    console.error('Seed extra error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
