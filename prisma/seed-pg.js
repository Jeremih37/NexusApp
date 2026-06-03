const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.favorite.deleteMany();
  await prisma.review.deleteMany();
  await prisma.game.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  console.log('Cleared all data');

  console.log('Creating categories...');
  const action = await prisma.category.create({ data: { name: 'Acción', slug: 'accion', icon: '⚔️' } });
  const rpg = await prisma.category.create({ data: { name: 'RPG', slug: 'rpg', icon: '🗡️' } });
  const adventure = await prisma.category.create({ data: { name: 'Aventura', slug: 'aventura', icon: '🗺️' } });
  const strategy = await prisma.category.create({ data: { name: 'Estrategia', slug: 'estrategia', icon: '♟️' } });
  const sports = await prisma.category.create({ data: { name: 'Deportes', slug: 'deportes', icon: '⚽' } });
  const horror = await prisma.category.create({ data: { name: 'Terror', slug: 'terror', icon: '👻' } });
  const indie = await prisma.category.create({ data: { name: 'Indie', slug: 'indie', icon: '🎮' } });
  const racing = await prisma.category.create({ data: { name: 'Carreras', slug: 'carreras', icon: '🏎️' } });

  const u1 = await prisma.user.create({ data: { name: 'Carlos García', email: 'carlos@nexusapp.com', avatar: 'CG' } });
  const u2 = await prisma.user.create({ data: { name: 'María López', email: 'maria@nexusapp.com', avatar: 'ML' } });
  const u3 = await prisma.user.create({ data: { name: 'Admin NexusApp', email: 'admin@nexusapp.com', avatar: 'AN', role: 'admin' } });
  const u4 = await prisma.user.create({ data: { name: 'Lucía Fernández', email: 'lucia@nexusapp.com', avatar: 'LF' } });

  const games = [
    { title: 'Cyberpunk 2077', slug: 'cyberpunk-2077', description: 'RPG de mundo abierto en Night City, una megalópolis obsesionada con el poder y la modificación corporal.', imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r0h.jpg', trailerUrl: 'https://www.youtube.com/embed/qIcTM8WXFjk', downloadUrl: 'https://www.gog.com/en/game/cyberpunk_2077', developer: 'CD Projekt Red', publisher: 'CD Projekt', releaseDate: '2020-12-10', rating: 4.2, ratingCount: 156, categoryId: rpg.id, platforms: 'PC, PlayStation, Xbox', featured: true },
    { title: 'Elden Ring', slug: 'elden-ring', description: 'RPG de acción en mundo abierto de FromSoftware con George R.R. Martin. Tierras Intermedias llenas de peligros y jefes épicos.', imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg', trailerUrl: 'https://www.youtube.com/embed/E3Huy2cdih0', downloadUrl: 'https://store.steampowered.com/app/1245620/ELDEN_RING/', developer: 'FromSoftware', publisher: 'Bandai Namco', releaseDate: '2022-02-25', rating: 4.8, ratingCount: 230, categoryId: rpg.id, platforms: 'PC, PlayStation, Xbox', featured: true },
    { title: 'God of War Ragnarök', slug: 'god-of-war-ragnarok', description: 'Secuela de God of War (2018). Kratos y Atreus enfrentan el Ragnarök, el fin del mundo nórdico.', imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5s5v.jpg', trailerUrl: 'https://www.youtube.com/embed/htX8jAW2oq0', downloadUrl: 'https://www.playstation.com/en-us/games/god-of-war-ragnarok/', developer: 'Santa Monica Studio', publisher: 'Sony Interactive', releaseDate: '2022-11-09', rating: 4.7, ratingCount: 189, categoryId: action.id, platforms: 'PlayStation, PC', featured: true },
    { title: 'Zelda Tears of the Kingdom', slug: 'zelda-totk', description: 'Secuela de Breath of the Wild. Explora islas flotantes, cavernas y un Hyrule transformado con nuevas mecánicas.', imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6cl1.jpg', trailerUrl: 'https://www.youtube.com/embed/PuH5Tt8kJWo', downloadUrl: 'https://www.nintendo.com/store/products/the-legend-of-zelda-tears-of-the-kingdom-switch/', developer: 'Nintendo EPD', publisher: 'Nintendo', releaseDate: '2023-05-12', rating: 4.9, ratingCount: 275, categoryId: adventure.id, platforms: 'Nintendo Switch', featured: true },
    { title: 'Hades II', slug: 'hades-2', description: 'Secuela del rogue-like aclamado. Juega como Melinoë para derrotar a Chronos, el Titán del tiempo.', imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co670x.jpg', trailerUrl: 'https://www.youtube.com/embed/udHlMkSj2bY', downloadUrl: 'https://store.steampowered.com/app/1145350/Hades_II/', developer: 'Supergiant Games', publisher: 'Supergiant Games', releaseDate: '2024-05-06', rating: 4.6, ratingCount: 98, categoryId: action.id, platforms: 'PC', featured: false },
    { title: 'Baldurs Gate 3', slug: 'baldurs-gate-3', description: 'RPG basado en D&D 5ta edición. Decisiones profundas y combates tácticos por turnos en los Reinos Olvidados.', imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co670h.jpg', trailerUrl: 'https://www.youtube.com/embed/1T4X2nH6EI8', downloadUrl: 'https://store.steampowered.com/app/1086940/Baldurs_Gate_3/', developer: 'Larian Studios', publisher: 'Larian Studios', releaseDate: '2023-08-03', rating: 4.8, ratingCount: 312, categoryId: rpg.id, platforms: 'PC, PlayStation, Xbox', featured: true },
    { title: 'Resident Evil 4 Remake', slug: 'resident-evil-4-remake', description: 'Remake del clásico survival horror. Leon S. Kennedy en zona rural de España para rescatar a la hija del presidente.', imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6bo6.jpg', trailerUrl: 'https://www.youtube.com/embed/VG6jXwTTfAE', downloadUrl: 'https://store.steampowered.com/app/2050650/Resident_Evil_4/', developer: 'Capcom', publisher: 'Capcom', releaseDate: '2023-03-24', rating: 4.5, ratingCount: 178, categoryId: horror.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: 'Forza Horizon 5', slug: 'forza-horizon-5', description: 'Carreras en mundo abierto por los paisajes de México. Cientos de coches y eventos dinámicos.', imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5w3v.jpg', trailerUrl: 'https://www.youtube.com/embed/FYH9n37B7Yw', downloadUrl: 'https://www.xbox.com/en-US/games/store/forza-horizon-5/9n7knz5s4spx', developer: 'Playground Games', publisher: 'Xbox Game Studios', releaseDate: '2021-11-09', rating: 4.4, ratingCount: 145, categoryId: racing.id, platforms: 'PC, Xbox', featured: false },
    { title: 'Hollow Knight Silksong', slug: 'hollow-knight-silksong', description: 'Secuela de Hollow Knight. Juega como Hornet en una aventura a través de un reino completamente nuevo.', imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2tba.jpg', trailerUrl: 'https://www.youtube.com/embed/FSbLKWfqPGg', downloadUrl: 'https://store.steampowered.com/app/1030000/Hollow_Knight_Silksong/', developer: 'Team Cherry', publisher: 'Team Cherry', releaseDate: '2025-02-01', rating: 4.7, ratingCount: 67, categoryId: indie.id, platforms: 'PC, Nintendo Switch', featured: true },
    { title: 'Civilization VII', slug: 'civilization-vii', description: 'Estrategia por turnos con nuevas mecánicas de edad y sistema diplomático renovado.', imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6yxj.jpg', trailerUrl: 'https://www.youtube.com/embed/GbSfHqDh3TM', downloadUrl: 'https://store.steampowered.com/app/1295660/Sid_Meiers_Civilization_VII/', developer: 'Firaxis Games', publisher: '2K Games', releaseDate: '2025-02-11', rating: 4.1, ratingCount: 52, categoryId: strategy.id, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false },
    { title: 'FIFA 25', slug: 'fifa-25', description: 'EA Sports FC 25 con HyperMotionV y FC IQ. La experiencia futbolística más realista.', imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6seq.jpg', trailerUrl: 'https://www.youtube.com/embed/awLGv0MkzjQ', downloadUrl: 'https://www.ea.com/games/ea-sports-fc/fc-25', developer: 'EA Canada', publisher: 'EA Sports', releaseDate: '2024-09-27', rating: 3.8, ratingCount: 94, categoryId: sports.id, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false },
    { title: 'Starfield', slug: 'starfield', description: 'RPG espacial de Bethesda con más de 1000 planetas. Construcción de naves y exploración galáctica.', imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6gsx.jpg', trailerUrl: 'https://www.youtube.com/embed/kfYeRiBLsEI', downloadUrl: 'https://store.steampowered.com/app/1716740/Starfield/', developer: 'Bethesda Game Studios', publisher: 'Bethesda Softworks', releaseDate: '2023-09-06', rating: 3.9, ratingCount: 167, categoryId: adventure.id, platforms: 'PC, Xbox', featured: false },
  ];
  const allGames = [];
  for (const g of games) { allGames.push(await prisma.game.create({ data: g })); }

  const reviews = [
    { userId: u1.id, gameId: allGames[0].id, rating: 4, comment: 'Increíble mundo abierto y narrativa. La experiencia completa es memorable.' },
    { userId: u2.id, gameId: allGames[1].id, rating: 5, comment: 'Una obra maestra de FromSoftware. Cada jefe es un desafío épico.' },
    { userId: u3.id, gameId: allGames[2].id, rating: 5, comment: 'Kratos y Atreus en su mejor aventura. Gráficos impresionantes.' },
    { userId: u4.id, gameId: allGames[3].id, rating: 5, comment: 'Nintendo lo volvió a hacer. Las mecánicas de construcción son geniales.' },
    { userId: u1.id, gameId: allGames[5].id, rating: 5, comment: 'El mejor RPG en años. Decisiones que importan y narrativa brillante.' },
    { userId: u2.id, gameId: allGames[6].id, rating: 4, comment: 'Remake excepcional que moderniza el clásico sin perder su esencia.' },
    { userId: u3.id, gameId: allGames[4].id, rating: 5, comment: 'Supergiant vuelve a demostrar su maestría. Combate más profundo.' },
    { userId: u4.id, gameId: allGames[8].id, rating: 5, comment: 'La espera valió la pena. Hornet es increíble y el mundo es hermoso.' },
    { userId: u1.id, gameId: allGames[7].id, rating: 4, comment: 'El mejor juego de carreras. México es espectacular.' },
    { userId: u2.id, gameId: allGames[11].id, rating: 3, comment: 'Ambicioso pero con altibajos. Misiones repetitivas.' },
    { userId: u3.id, gameId: allGames[9].id, rating: 4, comment: 'Ideas frescas para la saga. Las eras añaden dinamismo.' },
    { userId: u4.id, gameId: allGames[10].id, rating: 4, comment: 'Mejoras técnicas notables. HyperMotionV es impresionante.' },
  ];
  for (const r of reviews) { await prisma.review.create({ data: r }); }

  const favMap = [[u1.id, [1,3,5,8]], [u2.id, [0,2,4,6]], [u3.id, [1,5,3,7]], [u4.id, [3,8,4,9]]];
  for (const [uid, idxs] of favMap) {
    for (const idx of idxs) {
      if (allGames[idx]) await prisma.favorite.create({ data: { userId: uid, gameId: allGames[idx].id } });
    }
  }

  console.log('SEED COMPLETE! 12 games, 8 categories, 4 users, 12 reviews, favorites');
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
