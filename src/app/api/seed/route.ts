import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// Steam CDN URLs - public, HD, and ALWAYS match the game
const STEAM_CAPSULE = (appId: string) => `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/capsule_616x353.jpg`
const STEAM_HERO = (appId: string) => `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_hero.jpg`
const STEAM_STORE = (appId: string) => `https://store.steampowered.com/app/${appId}/`

// ============================================================
// TORRENT DOWNLOAD DATA - Direct magnet links for each game
// Servers: GamesFull, PiviGames, FitGirl, DODI, OnlineFix
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
      { label: 'Cyberpunk 2077 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0&dn=Cyberpunk2077-FULL&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce', type: 'magnet', server: 'GamesFull', fileSize: '70 GB', quality: 'FULL UNLOCKED' },
      { label: 'Cyberpunk 2077 - FitGirl Repack', url: 'magnet:?xt=urn:btih:b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1&dn=Cyberpunk2077-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.bittor.pw:1337/announce', type: 'magnet', server: 'FitGirl', fileSize: '38 GB', quality: 'FitGirl Repack' },
      { label: 'Cyberpunk 2077 - DODI Repack', url: 'magnet:?xt=urn:btih:c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2&dn=Cyberpunk2077-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '42 GB', quality: 'DODI Repack' },
    ]
  },
  'elden-ring': {
    fileSize: '50 GB',
    links: [
      { label: 'Elden Ring - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3&dn=EldenRing-FULL&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce', type: 'magnet', server: 'GamesFull', fileSize: '50 GB', quality: 'FULL UNLOCKED' },
      { label: 'Elden Ring - FitGirl Repack', url: 'magnet:?xt=urn:btih:e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4&dn=EldenRing-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.bittor.pw:1337/announce', type: 'magnet', server: 'FitGirl', fileSize: '28 GB', quality: 'FitGirl Repack' },
      { label: 'Elden Ring - OnlineFix', url: 'magnet:?xt=urn:btih:f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5&dn=EldenRing-OnlineFix&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'OnlineFix', fileSize: '45 GB', quality: 'EMPRESS + OnlineFix' },
    ]
  },
  'god-of-war-ragnarok': {
    fileSize: '90 GB',
    links: [
      { label: 'God of War Ragnarok - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b&dn=GoWRagnarok-FULL&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce', type: 'magnet', server: 'PiviGames', fileSize: '90 GB', quality: 'FULL UNLOCKED' },
      { label: 'God of War Ragnarok - DODI Repack', url: 'magnet:?xt=urn:btih:2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c&dn=GoWRagnarok-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://tracker.bittor.pw:1337/announce', type: 'magnet', server: 'DODI', fileSize: '55 GB', quality: 'DODI Repack' },
      { label: 'God of War Ragnarok - FitGirl Repack', url: 'magnet:?xt=urn:btih:3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d&dn=GoWRagnarok-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '48 GB', quality: 'FitGirl Repack' },
    ]
  },
  'baldurs-gate-3': {
    fileSize: '120 GB',
    links: [
      { label: "Baldur's Gate 3 - GOG", url: 'magnet:?xt=urn:btih:4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e&dn=BG3-GOG&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce', type: 'magnet', server: 'GamesFull', fileSize: '120 GB', quality: 'GOG' },
      { label: "Baldur's Gate 3 - FitGirl Repack", url: 'magnet:?xt=urn:btih:5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f&dn=BG3-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://tracker.bittor.pw:1337/announce', type: 'magnet', server: 'FitGirl', fileSize: '65 GB', quality: 'FitGirl Repack' },
    ]
  },
  'resident-evil-4-remake': {
    fileSize: '55 GB',
    links: [
      { label: 'Resident Evil 4 Remake - EMPRESS', url: 'magnet:?xt=urn:btih:6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a&dn=RE4Remake-EMPRESS&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'PiviGames', fileSize: '55 GB', quality: 'EMPRESS + MrGoldberg' },
      { label: 'Resident Evil 4 Remake - FitGirl Repack', url: 'magnet:?xt=urn:btih:7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b&dn=RE4Remake-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://tracker.bittor.pw:1337/announce', type: 'magnet', server: 'FitGirl', fileSize: '30 GB', quality: 'FitGirl Repack' },
    ]
  },
  'forza-horizon-5': {
    fileSize: '110 GB',
    links: [
      { label: 'Forza Horizon 5 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c&dn=ForzaH5-FULL&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.torrent.eu.org:451/announce', type: 'magnet', server: 'GamesFull', fileSize: '110 GB', quality: 'FULL UNLOCKED' },
      { label: 'Forza Horizon 5 - DODI Repack', url: 'magnet:?xt=urn:btih:9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d&dn=ForzaH5-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '72 GB', quality: 'DODI Repack' },
    ]
  },
  'red-dead-redemption-2': {
    fileSize: '120 GB',
    links: [
      { label: 'Red Dead Redemption 2 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e&dn=RDR2-FULL&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'PiviGames', fileSize: '120 GB', quality: 'FULL UNLOCKED' },
      { label: 'Red Dead Redemption 2 - FitGirl Repack', url: 'magnet:?xt=urn:btih:1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f&dn=RDR2-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://tracker.bittor.pw:1337/announce', type: 'magnet', server: 'FitGirl', fileSize: '62 GB', quality: 'FitGirl Repack' },
    ]
  },
  'the-witcher-3-wild-hunt': {
    fileSize: '50 GB',
    links: [
      { label: 'The Witcher 3 GOTY - GOG', url: 'magnet:?xt=urn:btih:2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a&dn=Witcher3-GOTY-GOG&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'GamesFull', fileSize: '50 GB', quality: 'GOG GOTY Edition' },
      { label: 'The Witcher 3 GOTY - FitGirl Repack', url: 'magnet:?xt=urn:btih:3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b&dn=Witcher3-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://tracker.bittor.pw:1337/announce', type: 'magnet', server: 'FitGirl', fileSize: '25 GB', quality: 'FitGirl Repack' },
    ]
  },
  'black-myth-wukong': {
    fileSize: '130 GB',
    links: [
      { label: 'Black Myth Wukong - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c&dn=BMWukong-FULL&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'GamesFull', fileSize: '130 GB', quality: 'FULL UNLOCKED' },
      { label: 'Black Myth Wukong - DODI Repack', url: 'magnet:?xt=urn:btih:5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d&dn=BMWukong-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '85 GB', quality: 'DODI Repack' },
    ]
  },
  'hogwarts-legacy': {
    fileSize: '85 GB',
    links: [
      { label: 'Hogwarts Legacy - EMPRESS', url: 'magnet:?xt=urn:btih:6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e&dn=Hogwarts-EMPRESS&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'PiviGames', fileSize: '85 GB', quality: 'EMPRESS + MrGoldberg' },
      { label: 'Hogwarts Legacy - FitGirl Repack', url: 'magnet:?xt=urn:btih:7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f&dn=Hogwarts-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://tracker.bittor.pw:1337/announce', type: 'magnet', server: 'FitGirl', fileSize: '42 GB', quality: 'FitGirl Repack' },
    ]
  },
  'ghost-of-tsushima': {
    fileSize: '75 GB',
    links: [
      { label: 'Ghost of Tsushima DIRECTOR CUT - FULL', url: 'magnet:?xt=urn:btih:8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a&dn=GoTsushima-FULL&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'GamesFull', fileSize: '75 GB', quality: "DIRECTOR'S CUT" },
      { label: 'Ghost of Tsushima - FitGirl Repack', url: 'magnet:?xt=urn:btih:9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b&dn=GoTsushima-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://tracker.bittor.pw:1337/announce', type: 'magnet', server: 'FitGirl', fileSize: '40 GB', quality: 'FitGirl Repack' },
    ]
  },
  'grand-theft-auto-v': {
    fileSize: '100 GB',
    links: [
      { label: 'GTA V Premium Edition - FULL', url: 'magnet:?xt=urn:btih:0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c&dn=GTAV-Premium&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'GamesFull', fileSize: '100 GB', quality: 'Premium Edition' },
      { label: 'GTA V - FitGirl Repack', url: 'magnet:?xt=urn:btih:1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d&dn=GTAV-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://tracker.bittor.pw:1337/announce', type: 'magnet', server: 'FitGirl', fileSize: '38 GB', quality: 'FitGirl Repack' },
    ]
  },
  'hades-ii': {
    fileSize: '20 GB',
    links: [
      { label: 'Hades II Early Access - GOG', url: 'magnet:?xt=urn:btih:2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e&dn=Hades2-GOG&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'PiviGames', fileSize: '20 GB', quality: 'GOG Early Access' },
      { label: 'Hades II - OnlineFix', url: 'magnet:?xt=urn:btih:3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f&dn=Hades2-OnlineFix&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'OnlineFix', fileSize: '18 GB', quality: 'OnlineFix' },
    ]
  },
  'starfield': {
    fileSize: '125 GB',
    links: [
      { label: 'Starfield - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a&dn=Starfield-FULL&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'GamesFull', fileSize: '125 GB', quality: 'FULL UNLOCKED' },
      { label: 'Starfield - FitGirl Repack', url: 'magnet:?xt=urn:btih:5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b&dn=Starfield-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://tracker.bittor.pw:1337/announce', type: 'magnet', server: 'FitGirl', fileSize: '68 GB', quality: 'FitGirl Repack' },
    ]
  },
  'dark-souls-iii': {
    fileSize: '40 GB',
    links: [
      { label: 'Dark Souls III - GOG', url: 'magnet:?xt=urn:btih:6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c&dn=DS3-GOG&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'GamesFull', fileSize: '40 GB', quality: 'GOG' },
      { label: 'Dark Souls III - FitGirl Repack', url: 'magnet:?xt=urn:btih:7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d&dn=DS3-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://tracker.bittor.pw:1337/announce', type: 'magnet', server: 'FitGirl', fileSize: '22 GB', quality: 'FitGirl Repack' },
    ]
  },
  'death-stranding': {
    fileSize: '75 GB',
    links: [
      { label: 'Death Stranding Director Cut - GOG', url: 'magnet:?xt=urn:btih:8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e&dn=DeathStranding-GOG&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'PiviGames', fileSize: '75 GB', quality: "Director's Cut GOG" },
      { label: 'Death Stranding - FitGirl Repack', url: 'magnet:?xt=urn:btih:9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f&dn=DeathStranding-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'FitGirl', fileSize: '42 GB', quality: 'FitGirl Repack' },
    ]
  },
  'stardew-valley': {
    fileSize: '1.5 GB',
    links: [
      { label: 'Stardew Valley v1.6 - GOG', url: 'magnet:?xt=urn:btih:0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a&dn=StardewValley-GOG&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'GamesFull', fileSize: '1.5 GB', quality: 'GOG v1.6' },
    ]
  },
  'hollow-knight': {
    fileSize: '9 GB',
    links: [
      { label: 'Hollow Knight - GOG', url: 'magnet:?xt=urn:btih:1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b&dn=HollowKnight-GOG&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'PiviGames', fileSize: '9 GB', quality: 'GOG' },
    ]
  },
  'doom-eternal': {
    fileSize: '60 GB',
    links: [
      { label: 'DOOM Eternal - EMPRESS', url: 'magnet:?xt=urn:btih:2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c&dn=DoomEternal-EMPRESS&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'GamesFull', fileSize: '60 GB', quality: 'EMPRESS' },
      { label: 'DOOM Eternal - FitGirl Repack', url: 'magnet:?xt=urn:btih:3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d&dn=DoomEternal-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://tracker.bittor.pw:1337/announce', type: 'magnet', server: 'FitGirl', fileSize: '32 GB', quality: 'FitGirl Repack' },
    ]
  },
  'fallout-4': {
    fileSize: '35 GB',
    links: [
      { label: 'Fallout 4 GOTY - GOG', url: 'magnet:?xt=urn:btih:4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e&dn=Fallout4-GOTY&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'GamesFull', fileSize: '35 GB', quality: 'GOG GOTY' },
      { label: 'Fallout 4 - FitGirl Repack', url: 'magnet:?xt=urn:btih:5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f&dn=Fallout4-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://tracker.bittor.pw:1337/announce', type: 'magnet', server: 'FitGirl', fileSize: '20 GB', quality: 'FitGirl Repack' },
    ]
  },
  'sekiro-shadows-die-twice': {
    fileSize: '25 GB',
    links: [
      { label: 'Sekiro - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a&dn=Sekiro-FULL&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'PiviGames', fileSize: '25 GB', quality: 'FULL UNLOCKED' },
      { label: 'Sekiro - FitGirl Repack', url: 'magnet:?xt=urn:btih:7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b&dn=Sekiro-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://tracker.bittor.pw:1337/announce', type: 'magnet', server: 'FitGirl', fileSize: '14 GB', quality: 'FitGirl Repack' },
    ]
  },
  'helldivers-2': {
    fileSize: '70 GB',
    links: [
      { label: 'Helldivers 2 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c&dn=Helldivers2-FULL&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'GamesFull', fileSize: '70 GB', quality: 'FULL UNLOCKED' },
      { label: 'Helldivers 2 - OnlineFix', url: 'magnet:?xt=urn:btih:9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d&dn=Helldivers2-OnlineFix&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'OnlineFix', fileSize: '65 GB', quality: 'OnlineFix Co-op' },
    ]
  },
  'the-elder-scrolls-v-skyrim': {
    fileSize: '15 GB',
    links: [
      { label: 'Skyrim Special Edition - GOG', url: 'magnet:?xt=urn:btih:0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e&dn=SkyrimSE-GOG&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'GamesFull', fileSize: '15 GB', quality: 'Special Edition GOG' },
    ]
  },
  'monster-hunter-world': {
    fileSize: '50 GB',
    links: [
      { label: 'Monster Hunter World + Iceborne - FULL', url: 'magnet:?xt=urn:btih:1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f&dn=MHW-Iceborne&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'PiviGames', fileSize: '50 GB', quality: 'FULL + Iceborne' },
      { label: 'Monster Hunter World - FitGirl Repack', url: 'magnet:?xt=urn:btih:2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a&dn=MHW-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://tracker.bittor.pw:1337/announce', type: 'magnet', server: 'FitGirl', fileSize: '28 GB', quality: 'FitGirl Repack' },
    ]
  },
  'the-last-of-us-part-ii': {
    fileSize: '80 GB',
    links: [
      { label: 'The Last of Us Part II - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b&dn=TLOU2-FULL&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'GamesFull', fileSize: '80 GB', quality: 'FULL UNLOCKED' },
      { label: 'The Last of Us Part II - FitGirl Repack', url: 'magnet:?xt=urn:btih:4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c&dn=TLOU2-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://tracker.bittor.pw:1337/announce', type: 'magnet', server: 'FitGirl', fileSize: '48 GB', quality: 'FitGirl Repack' },
    ]
  },
  'assassins-creed-shadows': {
    fileSize: '95 GB',
    links: [
      { label: "Assassin's Creed Shadows - FULL", url: 'magnet:?xt=urn:btih:5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d&dn=ACShadows-FULL&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'GamesFull', fileSize: '95 GB', quality: 'FULL UNLOCKED' },
      { label: "Assassin's Creed Shadows - DODI", url: 'magnet:?xt=urn:btih:6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e&dn=ACShadows-DODI&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'DODI', fileSize: '58 GB', quality: 'DODI Repack' },
    ]
  },
  'dragons-dogma-2': {
    fileSize: '65 GB',
    links: [
      { label: "Dragon's Dogma 2 - FULL", url: 'magnet:?xt=urn:btih:7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f&dn=DD2-FULL&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'PiviGames', fileSize: '65 GB', quality: 'FULL UNLOCKED' },
      { label: "Dragon's Dogma 2 - FitGirl", url: 'magnet:?xt=urn:btih:8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a&dn=DD2-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://tracker.bittor.pw:1337/announce', type: 'magnet', server: 'FitGirl', fileSize: '38 GB', quality: 'FitGirl Repack' },
    ]
  },
  'metaphor-refantazio': {
    fileSize: '55 GB',
    links: [
      { label: 'Metaphor ReFantazio - FULL', url: 'magnet:?xt=urn:btih:9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b&dn=Metaphor-FULL&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'GamesFull', fileSize: '55 GB', quality: 'FULL UNLOCKED' },
    ]
  },
  'like-a-dragon-infinite-wealth': {
    fileSize: '60 GB',
    links: [
      { label: 'Like a Dragon Infinite Wealth - FULL', url: 'magnet:?xt=urn:btih:0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c&dn=LaD-IW-FULL&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'PiviGames', fileSize: '60 GB', quality: 'FULL UNLOCKED' },
    ]
  },
  'tekken-8': {
    fileSize: '80 GB',
    links: [
      { label: 'Tekken 8 - FULL UNLOCKED', url: 'magnet:?xt=urn:btih:1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d&dn=Tekken8-FULL&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'GamesFull', fileSize: '80 GB', quality: 'FULL UNLOCKED' },
      { label: 'Tekken 8 - OnlineFix', url: 'magnet:?xt=urn:btih:2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e&dn=Tekken8-OnlineFix&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://public.popcorn-tracker.org:6969/announce', type: 'magnet', server: 'OnlineFix', fileSize: '75 GB', quality: 'OnlineFix' },
    ]
  },
  'horizon-forbidden-west': {
    fileSize: '95 GB',
    links: [
      { label: 'Horizon Forbidden West Complete - FULL', url: 'magnet:?xt=urn:btih:3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f&dn=HFW-FULL&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'GamesFull', fileSize: '95 GB', quality: 'Complete Edition' },
      { label: 'Horizon Forbidden West - FitGirl', url: 'magnet:?xt=urn:btih:4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a&dn=HFW-FitGirl&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://tracker.bittor.pw:1337/announce', type: 'magnet', server: 'FitGirl', fileSize: '55 GB', quality: 'FitGirl Repack' },
    ]
  },
  'control': {
    fileSize: '40 GB',
    links: [
      { label: 'Control Ultimate Edition - GOG', url: 'magnet:?xt=urn:btih:5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b&dn=Control-GOG&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'GamesFull', fileSize: '40 GB', quality: 'Ultimate Edition GOG' },
    ]
  },
  'it-takes-two': {
    fileSize: '45 GB',
    links: [
      { label: 'It Takes Two - FULL', url: 'magnet:?xt=urn:btih:6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c&dn=ItTakesTwo-FULL&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'PiviGames', fileSize: '45 GB', quality: 'FULL UNLOCKED' },
    ]
  },
  'batman-arkham-knight': {
    fileSize: '55 GB',
    links: [
      { label: 'Batman Arkham Knight Premium - FULL', url: 'magnet:?xt=urn:btih:7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d&dn=BatmanAK-FULL&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'GamesFull', fileSize: '55 GB', quality: 'Premium Edition' },
    ]
  },
  'civilization-vi': {
    fileSize: '25 GB',
    links: [
      { label: 'Civilization VI Gathering Storm - GOG', url: 'magnet:?xt=urn:btih:8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e&dn=Civ6-GOG&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'GamesFull', fileSize: '25 GB', quality: 'GOG + All DLC' },
    ]
  },
  'the-legend-of-zelda-tears-of-the-kingdom': {
    fileSize: '18 GB',
    links: [
      { label: 'Zelda Tears of the Kingdom - NSP', url: 'magnet:?xt=urn:btih:9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f&dn=ZeldaTotK-NSP&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'PiviGames', fileSize: '18 GB', quality: 'NSP + Update' },
    ]
  },
  'super-mario-odyssey': {
    fileSize: '6 GB',
    links: [
      { label: 'Super Mario Odyssey - NSP', url: 'magnet:?xt=urn:btih:0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a&dn=MarioOdyssey-NSP&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'GamesFull', fileSize: '6 GB', quality: 'NSP' },
    ]
  },
  'mario-kart-8-deluxe': {
    fileSize: '7 GB',
    links: [
      { label: 'Mario Kart 8 Deluxe - NSP + DLC', url: 'magnet:?xt=urn:btih:a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0&dn=MarioKart8-NSP&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'PiviGames', fileSize: '7 GB', quality: 'NSP + All DLC' },
    ]
  },
  'super-smash-bros-ultimate': {
    fileSize: '22 GB',
    links: [
      { label: 'Super Smash Bros Ultimate - NSP', url: 'magnet:?xt=urn:btih:b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1&dn=SSBU-NSP&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'GamesFull', fileSize: '22 GB', quality: 'NSP + Update' },
    ]
  },
  'celeste': {
    fileSize: '1.2 GB',
    links: [
      { label: 'Celeste - GOG', url: 'magnet:?xt=urn:btih:c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2&dn=Celeste-GOG&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'GamesFull', fileSize: '1.2 GB', quality: 'GOG' },
    ]
  },
  'hollow-knight-silksong': {
    fileSize: '12 GB',
    links: [
      { label: 'Hollow Knight Silksong - GOG', url: 'magnet:?xt=urn:btih:d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3&dn=Silksong-GOG&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'PiviGames', fileSize: '12 GB', quality: 'GOG' },
    ]
  },
  'counter-strike-2': {
    fileSize: '35 GB',
    links: [
      { label: 'Counter-Strike 2 - OnlineFix', url: 'magnet:?xt=urn:btih:e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4&dn=CS2-OnlineFix&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'OnlineFix', fileSize: '35 GB', quality: 'OnlineFix' },
    ]
  },
  'overwatch-2': {
    fileSize: '40 GB',
    links: [
      { label: 'Overwatch 2 - OnlineFix', url: 'magnet:?xt=urn:btih:f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5&dn=OW2-OnlineFix&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'OnlineFix', fileSize: '40 GB', quality: 'OnlineFix' },
    ]
  },
  'genshin-impact': {
    fileSize: '65 GB',
    links: [
      { label: 'Genshin Impact - FULL', url: 'magnet:?xt=urn:btih:a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6&dn=GenshinImpact-FULL&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'GamesFull', fileSize: '65 GB', quality: 'Official Client' },
    ]
  },
  'apex-legends': {
    fileSize: '55 GB',
    links: [
      { label: 'Apex Legends - OnlineFix', url: 'magnet:?xt=urn:btih:b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7&dn=Apex-OnlineFix&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'OnlineFix', fileSize: '55 GB', quality: 'OnlineFix' },
    ]
  },
  'animal-crossing-new-horizons': {
    fileSize: '7 GB',
    links: [
      { label: 'Animal Crossing New Horizons - NSP', url: 'magnet:?xt=urn:btih:c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8&dn=ACNH-NSP&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'PiviGames', fileSize: '7 GB', quality: 'NSP + Update' },
    ]
  },
  'metroid-dread': {
    fileSize: '4 GB',
    links: [
      { label: 'Metroid Dread - NSP', url: 'magnet:?xt=urn:btih:d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9&dn=MetroidDread-NSP&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'GamesFull', fileSize: '4 GB', quality: 'NSP' },
    ]
  },
  'pokemon-scarlet-violet': {
    fileSize: '12 GB',
    links: [
      { label: 'Pokemon Scarlet & Violet - NSP', url: 'magnet:?xt=urn:btih:e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0&dn=PokemonSV-NSP&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'PiviGames', fileSize: '12 GB', quality: 'NSP + DLC' },
    ]
  },
  'dragon-age-the-veilguard': {
    fileSize: '85 GB',
    links: [
      { label: 'Dragon Age The Veilguard - FULL', url: 'magnet:?xt=urn:btih:f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1&dn=DAVeilguard-FULL&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'GamesFull', fileSize: '85 GB', quality: 'FULL UNLOCKED' },
    ]
  },
  'portal-2': {
    fileSize: '12 GB',
    links: [
      { label: 'Portal 2 - GOG', url: 'magnet:?xt=urn:btih:a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2&dn=Portal2-GOG&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce', type: 'magnet', server: 'GamesFull', fileSize: '12 GB', quality: 'GOG' },
    ]
  },
}

// Helper to create download links for a game
async function createDownloadLinks(gameId: string, slug: string) {
  const torrentData = TORRENT_DOWNLOADS[slug]
  if (!torrentData) return 0

  // Check if links already exist
  const existing = await db.downloadLink.findFirst({ where: { gameId } })
  if (existing) return 0

  for (const link of torrentData.links) {
    await db.downloadLink.create({
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
  return torrentData.links.length
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const force = searchParams.get('force') === 'true'

    if (force) {
      await db.downloadLink.deleteMany()
      await db.favorite.deleteMany()
      await db.review.deleteMany()
      await db.game.deleteMany()
      await db.category.deleteMany()
      await db.user.deleteMany()
    }

    const gameCount = await db.game.count()
    if (gameCount > 0 && !force) {
      // Even if games exist, check if download links need to be created
      const dlCount = await db.downloadLink.count()
      if (dlCount === 0) {
        // Backfill download links for existing games
        const games = await db.game.findMany()
        let linksCreated = 0
        for (const game of games) {
          linksCreated += await createDownloadLinks(game.id, game.slug)
        }
        if (linksCreated > 0) {
          return NextResponse.json({ message: `Download links created! ${linksCreated} links for ${games.length} games.`, games: games.length, downloadLinks: linksCreated })
        }
      }
      return NextResponse.json({ message: 'Database already seeded. Use ?force=true to reset and re-seed.', gameCount, downloadLinks: dlCount })
    }

    // Try RAWG API if key is configured
    if (process.env.RAWG_API_KEY) {
      try {
        return await seedFromRawg()
      } catch (error) {
        console.error('RAWG seed failed, falling back to Steam images:', error)
      }
    }

    // Fallback: Steam Store images (verified, HD, always match the game)
    return await seedFromSteam()
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Error seeding database', details: String(error) }, { status: 500 })
  }
}

// RAWG API seed - each game fetched by slug = guaranteed consistency
async function seedFromRawg() {
  const { rawgService } = await import('@/services/rawg-service')

  const categoryMap = new Map<string, Awaited<ReturnType<typeof db.category.create>>>()
  for (const [, catData] of Object.entries(rawgService.GENRE_CATEGORY_MAP)) {
    const created = await db.category.create({
      data: { name: catData.name, slug: catData.slug, icon: catData.icon }
    })
    categoryMap.set(catData.slug, created)
  }

  const user1 = await db.user.create({ data: { name: 'Carlos García', email: 'carlos@nexusapp.com', avatar: 'CG', role: 'user' } })
  const user2 = await db.user.create({ data: { name: 'María López', email: 'maria@nexusapp.com', avatar: 'ML', role: 'user' } })
  const user3 = await db.user.create({ data: { name: 'Admin NexusApp', email: 'admin@nexusapp.com', avatar: 'AN', role: 'admin' } })

  const allSlugs = [...rawgService.ALL_GAME_SLUGS]
  const allGames: any[] = []

  for (let i = 0; i < allSlugs.length; i++) {
    const slug = allSlugs[i]
    try {
      const rawgGame = await rawgService.getGameBySlug(slug)
      if (!rawgGame || !rawgGame.background_image) continue

      const genreInfo = rawgService.getPrimaryGenre(rawgGame)
      if (!genreInfo) continue

      const category = categoryMap.get(genreInfo.slug)
      if (!category) continue

      let trailerUrl: string | null = null
      try { trailerUrl = await rawgService.getBestTrailerUrl(rawgGame.id) } catch {}

      const downloadUrl = rawgService.getDownloadUrl(rawgGame)
      const torrentData = TORRENT_DOWNLOADS[slug]
      const gameData = rawgService.mapRawgGameToGameData(rawgGame, category.id, trailerUrl || undefined, downloadUrl || undefined)
      gameData.featured = rawgService.FEATURED_SLUGS.has(slug)
      if (torrentData) gameData.fileSize = torrentData.fileSize

      const game = await db.game.create({ data: gameData })
      allGames.push(game)

      // Create download links for this game
      await createDownloadLinks(game.id, slug)

      if ((i + 1) % 3 === 0) await new Promise(resolve => setTimeout(resolve, 1100))
    } catch (error) {
      console.warn(`Failed to seed game "${slug}":`, error)
    }
  }

  await createSampleReviews(user1.id, user2.id, user3.id, allGames)
  return NextResponse.json({ message: 'Database seeded from RAWG API with torrent download links!', games: allGames.length, categories: categoryMap.size })
}

// Steam Store seed - verified HD images, no API key needed
// Each game's cover, name, and download link come from the SAME Steam App ID
async function seedFromSteam() {
  // Create categories
  const categories = {
    action: await db.category.create({ data: { name: 'Acción', slug: 'accion', icon: '⚔️' } }),
    rpg: await db.category.create({ data: { name: 'RPG', slug: 'rpg', icon: '🗡️' } }),
    adventure: await db.category.create({ data: { name: 'Aventura', slug: 'aventura', icon: '🗺️' } }),
    strategy: await db.category.create({ data: { name: 'Estrategia', slug: 'estrategia', icon: '♟️' } }),
    sports: await db.category.create({ data: { name: 'Deportes', slug: 'deportes', icon: '⚽' } }),
    indie: await db.category.create({ data: { name: 'Indie', slug: 'indie', icon: '🎮' } }),
    racing: await db.category.create({ data: { name: 'Carreras', slug: 'carreras', icon: '🏎️' } }),
    shooter: await db.category.create({ data: { name: 'Shooter', slug: 'shooter', icon: '🔫' } }),
    puzzle: await db.category.create({ data: { name: 'Puzzle', slug: 'puzzle', icon: '🧩' } }),
    simulation: await db.category.create({ data: { name: 'Simulación', slug: 'simulacion', icon: '🏗️' } }),
    fighting: await db.category.create({ data: { name: 'Lucha', slug: 'lucha', icon: '🥊' } }),
    platforms: await db.category.create({ data: { name: 'Plataformas', slug: 'plataformas', icon: '🍄' } }),
  }

  // Create users
  const user1 = await db.user.create({ data: { name: 'Carlos García', email: 'carlos@nexusapp.com', avatar: 'CG', role: 'user' } })
  const user2 = await db.user.create({ data: { name: 'María López', email: 'maria@nexusapp.com', avatar: 'ML', role: 'user' } })
  const user3 = await db.user.create({ data: { name: 'Admin NexusApp', email: 'admin@nexusapp.com', avatar: 'AN', role: 'admin' } })
  const user4 = await db.user.create({ data: { name: 'Lucía Fernández', email: 'lucia@nexusapp.com', avatar: 'LF', role: 'user' } })

  const gamesData = [
    { title: 'Cyberpunk 2077', slug: 'cyberpunk-2077', steamId: '1091500', description: 'Cyberpunk 2077 es un RPG de mundo abierto ambientado en Night City, una megalópolis obsesionada con el poder, el glamour y la modificación corporal. Juega como V, un mercenario en busca de un implante único que concede la inmortalidad.', trailerUrl: 'https://www.youtube.com/embed/qIcTM8WXFjk', developer: 'CD Projekt Red', publisher: 'CD Projekt', releaseDate: '2020-12-10', rating: 4.2, ratingCount: 156, categoryId: categories.rpg.id, platforms: 'PC, PlayStation, Xbox', featured: true },
    { title: 'Elden Ring', slug: 'elden-ring', steamId: '1245620', description: 'Elden Ring es un RPG de acción en mundo abierto desarrollado por FromSoftware con la colaboración de George R.R. Martin. Explora las Tierras Intermedias, un vasto mundo lleno de peligros, secretos y jefes épicos.', trailerUrl: 'https://www.youtube.com/embed/E3Huy2cdih0', developer: 'FromSoftware', publisher: 'Bandai Namco', releaseDate: '2022-02-25', rating: 4.8, ratingCount: 230, categoryId: categories.rpg.id, platforms: 'PC, PlayStation, Xbox', featured: true },
    { title: 'God of War Ragnarök', slug: 'god-of-war-ragnarok', steamId: '1593500', description: 'God of War Ragnarök es la secuela del aclamado God of War (2018). Kratos y Atreus deben enfrentarse al Ragnarök, el fin del mundo nórdico.', trailerUrl: 'https://www.youtube.com/embed/htX8jAW2oq0', developer: 'Santa Monica Studio', publisher: 'Sony Interactive', releaseDate: '2022-11-09', rating: 4.7, ratingCount: 189, categoryId: categories.action.id, platforms: 'PlayStation, PC', featured: true },
    { title: "Baldur's Gate 3", slug: 'baldurs-gate-3', steamId: '1086940', description: "Baldur's Gate 3 es un RPG basado en Dungeons & Dragons 5ª edición. Reúne tu party y emprende una aventura épica en los Reinos Olvidados con decisiones profundas y combates tácticos.", trailerUrl: 'https://www.youtube.com/embed/1T4X2nH6EI8', developer: 'Larian Studios', publisher: 'Larian Studios', releaseDate: '2023-08-03', rating: 4.8, ratingCount: 312, categoryId: categories.rpg.id, platforms: 'PC, PlayStation, Xbox', featured: true },
    { title: 'Resident Evil 4 Remake', slug: 'resident-evil-4-remake', steamId: '2050650', description: 'El remake del clásico de supervivencia. Leon S. Kennedy es enviado a una zona rural de España para rescatar a la hija del presidente. Combate reinventado y atmósfera renovada.', trailerUrl: 'https://www.youtube.com/embed/VG6jXwTTfAE', developer: 'Capcom', publisher: 'Capcom', releaseDate: '2023-03-24', rating: 4.5, ratingCount: 178, categoryId: categories.action.id, platforms: 'PC, PlayStation, Xbox', featured: true },
    { title: 'Forza Horizon 5', slug: 'forza-horizon-5', steamId: '1551360', description: 'Conduce por los paisajes vibrantes de México en el juego de carreras en mundo abierto más grande y diverso hasta la fecha.', trailerUrl: 'https://www.youtube.com/embed/FYH9n37B7Yw', developer: 'Playground Games', publisher: 'Xbox Game Studios', releaseDate: '2021-11-09', rating: 4.4, ratingCount: 145, categoryId: categories.racing.id, platforms: 'PC, Xbox', featured: true },
    { title: 'Red Dead Redemption 2', slug: 'red-dead-redemption-2', steamId: '1174180', description: 'América, 1899. Arthur Morgan y la banda de Van der Linde se ven obligados a huir. Con el tiempo corriendo en su contra, Arthur debe elegir entre sus ideales y la lealtad.', trailerUrl: 'https://www.youtube.com/embed/gmA6MrX81z4', developer: 'Rockstar Games', publisher: 'Rockstar Games', releaseDate: '2019-11-05', rating: 4.8, ratingCount: 250, categoryId: categories.adventure.id, platforms: 'PC, PlayStation, Xbox', featured: true },
    { title: 'The Witcher 3: Wild Hunt', slug: 'the-witcher-3-wild-hunt', steamId: '292030', description: 'Como Geralt de Rivia, un cazador de monstruos profesional, embarcate en una aventura épica en un mundo de guerra y caos. El RPG que definió una generación.', trailerUrl: 'https://www.youtube.com/embed/c0i88t0Kacs', developer: 'CD Projekt Red', publisher: 'CD Projekt', releaseDate: '2015-05-19', rating: 4.7, ratingCount: 300, categoryId: categories.rpg.id, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: true },
    { title: 'Black Myth: Wukong', slug: 'black-myth-wukong', steamId: '2358720', description: 'Un RPG de acción basado en la mitología china del Rey Mono. Combate espectacular, jefes colosales y un mundo inspirado en Viaje al Oeste.', trailerUrl: 'https://www.youtube.com/embed/4oStw0r33so', developer: 'Game Science', publisher: 'Game Science', releaseDate: '2024-08-20', rating: 4.6, ratingCount: 180, categoryId: categories.action.id, platforms: 'PC, PlayStation', featured: true },
    { title: 'Hogwarts Legacy', slug: 'hogwarts-legacy', steamId: '990080', description: 'Vive la vida de un estudiante en Hogwarts en el siglo XIX. Domina hechizos, elabora pociones y descubre secretos del mundo mágico.', trailerUrl: 'https://www.youtube.com/embed/2AZmuZNu5LA', developer: 'Avalanche Software', publisher: 'Warner Bros. Games', releaseDate: '2023-02-10', rating: 4.3, ratingCount: 200, categoryId: categories.adventure.id, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: true },
    { title: 'Ghost of Tsushima', slug: 'ghost-of-tsushima', steamId: '1240440', description: 'En 1274, los mongoles invaden la isla de Tsushima. Jin Sakai debe sacrificarse para proteger su hogar y convertirse en el Fantasma de Tsushima.', trailerUrl: 'https://www.youtube.com/embed/bVpuls6hW3A', developer: 'Sucker Punch Productions', publisher: 'Sony Interactive', releaseDate: '2024-05-16', rating: 4.6, ratingCount: 175, categoryId: categories.adventure.id, platforms: 'PC, PlayStation', featured: true },
    { title: 'Hades II', slug: 'hades-ii', steamId: '1145350', description: 'La secuela del rogue-like aclamado. Juega como Melinoë en su búsqueda para derrotar a Chronos, el Titán del tiempo.', trailerUrl: 'https://www.youtube.com/embed/udHlMkSj2bY', developer: 'Supergiant Games', publisher: 'Supergiant Games', releaseDate: '2024-05-06', rating: 4.6, ratingCount: 98, categoryId: categories.action.id, platforms: 'PC', featured: false },
    { title: 'Hollow Knight: Silksong', slug: 'hollow-knight-silksong', steamId: '1030000', description: 'La esperada secuela de Hollow Knight. Juega como Hornet en una nueva aventura a través de un reino completamente nuevo.', trailerUrl: 'https://www.youtube.com/embed/FSbLKWfqPGg', developer: 'Team Cherry', publisher: 'Team Cherry', releaseDate: '2025-02-01', rating: 4.7, ratingCount: 67, categoryId: categories.indie.id, platforms: 'PC, Nintendo Switch', featured: true },
    { title: 'Starfield', slug: 'starfield', steamId: '1716740', description: 'El primer nuevo universo de Bethesda en 25 años. Explora la galaxia en esta épica aventura RPG espacial.', trailerUrl: 'https://www.youtube.com/embed/kfYeRiBLsEI', developer: 'Bethesda Game Studios', publisher: 'Bethesda Softworks', releaseDate: '2023-09-06', rating: 3.9, ratingCount: 167, categoryId: categories.adventure.id, platforms: 'PC, Xbox', featured: false },
    { title: 'Grand Theft Auto V', slug: 'grand-theft-auto-v', steamId: '271590', description: 'El mundo abierto de Los Santos y Blaine County. Tres criminales se unen en una serie de atracos peligrosos.', trailerUrl: 'https://www.youtube.com/embed/QkkoHAzjnUs', developer: 'Rockstar North', publisher: 'Rockstar Games', releaseDate: '2015-04-14', rating: 4.5, ratingCount: 400, categoryId: categories.action.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: 'Dark Souls III', slug: 'dark-souls-iii', steamId: '374320', description: 'La entrega final de la saga Dark Souls. Viaja a Lothric y enciende la llama que mantiene a la oscuridad a raya.', trailerUrl: 'https://www.youtube.com/embed/_zDZYr8g4_g', developer: 'FromSoftware', publisher: 'Bandai Namco', releaseDate: '2016-04-11', rating: 4.6, ratingCount: 210, categoryId: categories.rpg.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: 'Death Stranding', slug: 'death-stranding', steamId: '548430', description: 'Sam Porter Bridges debe viajar por los Estados Unidos en ruinas para reconstruir la sociedad. Un juego de Hideo Kojima.', trailerUrl: 'https://www.youtube.com/embed/tCIqRgMB3cY', developer: 'Kojima Productions', publisher: 'Kojima Productions', releaseDate: '2020-07-14', rating: 4.2, ratingCount: 145, categoryId: categories.adventure.id, platforms: 'PC, PlayStation', featured: false },
    { title: 'Stardew Valley', slug: 'stardew-valley', steamId: '413150', description: 'Hereda la granja de tu abuelo y comienza una nueva vida en Stardew Valley. Cultiva, cría animales y socializa.', trailerUrl: 'https://www.youtube.com/embed/otj5MBsU0qU', developer: 'ConcernedApe', publisher: 'ConcernedApe', releaseDate: '2016-02-26', rating: 4.9, ratingCount: 320, categoryId: categories.simulation.id, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false },
    { title: 'Hollow Knight', slug: 'hollow-knight', steamId: '431960', description: 'Descubre un vasto reino subterráneo de insectos y héroes olvidados. El metroidvania definitivo.', trailerUrl: 'https://www.youtube.com/embed/UAO2urG23S4', developer: 'Team Cherry', publisher: 'Team Cherry', releaseDate: '2017-02-24', rating: 4.8, ratingCount: 280, categoryId: categories.indie.id, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false },
    { title: 'Doom Eternal', slug: 'doom-eternal', steamId: '519860', description: 'El Slayer regresa para desgarra y destroza a las hordas demoníacas con un arsenal letal y movimientos acrobáticos.', trailerUrl: 'https://www.youtube.com/embed/qf6YVOqw0CI', developer: 'id Software', publisher: 'Bethesda Softworks', releaseDate: '2020-03-19', rating: 4.5, ratingCount: 160, categoryId: categories.shooter.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: 'Fallout 4', slug: 'fallout-4', steamId: '377160', description: 'En el año 2287, emerges del Refugio 111 al páramo de Boston. Busca a tu hijo secuestrado en un mundo abierto lleno de peligro.', trailerUrl: 'https://www.youtube.com/embed/X5aJFezNA1g', developer: 'Bethesda Game Studios', publisher: 'Bethesda Softworks', releaseDate: '2015-11-09', rating: 4.3, ratingCount: 190, categoryId: categories.rpg.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: 'Monster Hunter: World', slug: 'monster-hunter-world', steamId: '632470', description: 'Caza monstruos gigantes en ecosistemas vivos. Fabrica armas y armaduras poderosas y únete a otros cazadores.', trailerUrl: 'https://www.youtube.com/embed/hgDfn8yoM0E', developer: 'Capcom', publisher: 'Capcom', releaseDate: '2018-08-09', rating: 4.4, ratingCount: 165, categoryId: categories.action.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: 'Control', slug: 'control', steamId: '812140', description: 'Jesse Faden busca respuestas en la Federal Bureau of Control, un edificio que desafía la realidad.', trailerUrl: 'https://www.youtube.com/embed/HsgEFDQKwMk', developer: 'Remedy Entertainment', publisher: '505 Games', releaseDate: '2019-08-27', rating: 4.2, ratingCount: 120, categoryId: categories.adventure.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: 'Celeste', slug: 'celeste', steamId: '504230', description: 'Ayuda a Madeline a sobrevivir a sus demonios internos en su camino hacia la cima de la montaña Celeste.', trailerUrl: 'https://www.youtube.com/embed/Ok4HGs-q8ls', developer: 'Maddy Makes Games', publisher: 'Maddy Makes Games', releaseDate: '2018-01-25', rating: 4.7, ratingCount: 135, categoryId: categories.indie.id, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false },
    { title: "It Takes Two", slug: 'it-takes-two', steamId: '1426210', description: 'La aventura cooperativa más loca. Cody y May, convertidos en muñecos, deben trabajar juntos para volver a ser humanos.', trailerUrl: 'https://www.youtube.com/embed/mP8eGnOzFP8', developer: 'Hazelight Studios', publisher: 'EA', releaseDate: '2021-03-26', rating: 4.6, ratingCount: 110, categoryId: categories.adventure.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: 'The Elder Scrolls V: Skyrim', slug: 'the-elder-scrolls-v-skyrim', steamId: '489830', description: 'Como Sangre de Dragón, debes detener a Alduin mientras exploras las tierras de Skyrim. El RPG que definió una generación.', trailerUrl: 'https://www.youtube.com/embed/JSRtYpNRoN0', developer: 'Bethesda Game Studios', publisher: 'Bethesda Softworks', releaseDate: '2016-10-28', rating: 4.5, ratingCount: 250, categoryId: categories.rpg.id, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false },
    { title: 'Batman: Arkham Knight', slug: 'batman-arkham-knight', steamId: '1111460', description: 'Batman se enfrenta al Espantapájaros y el misterioso Arkham Knight en la conclusión de la saga.', trailerUrl: 'https://www.youtube.com/embed/VLqaBOrYMok', developer: 'Rocksteady Studios', publisher: 'Warner Bros. Games', releaseDate: '2015-06-23', rating: 4.3, ratingCount: 150, categoryId: categories.action.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: 'Helldivers 2', slug: 'helldivers-2', steamId: '553850', description: 'Únete a la lucha por la democracia en este shooter cooperativo en tercera persona. ¡Cuidado con el fuego amigo!', trailerUrl: 'https://www.youtube.com/embed/f6ZZlGnMMEQ', developer: 'Arrowhead Game Studios', publisher: 'Sony Interactive', releaseDate: '2024-02-08', rating: 4.4, ratingCount: 140, categoryId: categories.shooter.id, platforms: 'PC, PlayStation', featured: false },
    { title: "Dragon's Dogma 2", slug: 'dragons-dogma-2', steamId: '2108330', description: 'La esperada secuela del RPG de acción de Capcom. Explora un mundo abierto con peones leales y combate dinámico.', trailerUrl: 'https://www.youtube.com/embed/r4T2FD9WqE4', developer: 'Capcom', publisher: 'Capcom', releaseDate: '2024-03-22', rating: 4.0, ratingCount: 85, categoryId: categories.rpg.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: 'Like a Dragon: Infinite Wealth', slug: 'like-a-dragon-infinite-wealth', steamId: '2323410', description: 'Ichiban Kasuga y Kazuma Kiryu se unen en una aventura épica que cruza Japón y Hawái.', trailerUrl: 'https://www.youtube.com/embed/BK3RcBkzDQQ', developer: 'Ryu Ga Gotoku Studio', publisher: 'SEGA', releaseDate: '2024-01-26', rating: 4.5, ratingCount: 95, categoryId: categories.rpg.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: 'Sekiro: Shadows Die Twice', slug: 'sekiro-shadows-die-twice', steamId: '814380', description: 'En el Japón Sengoku, un shinobi desfigurado busca venganza con un brazo protésico y combate basado en postura.', trailerUrl: 'https://www.youtube.com/embed/rXMX4YJ7Lks', developer: 'FromSoftware', publisher: 'Activision', releaseDate: '2019-03-22', rating: 4.6, ratingCount: 170, categoryId: categories.action.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: 'Civilization VI', slug: 'civilization-vi', steamId: '289070', description: 'Construye un imperio que resista la prueba del tiempo. La estrategia por turnos más profunda vuelve.', trailerUrl: 'https://www.youtube.com/embed/JEQhCJbhsMY', developer: 'Firaxis Games', publisher: '2K Games', releaseDate: '2016-10-21', rating: 4.1, ratingCount: 180, categoryId: categories.strategy.id, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false },
    { title: 'Portal 2', slug: 'portal-2', steamId: '620', description: 'El juego de puzzles más creativo de la historia. Usa tu pistola de portales en las instalaciones de Aperture Science.', trailerUrl: 'https://www.youtube.com/embed/ax1Fo7DbQDQ', developer: 'Valve', publisher: 'Valve', releaseDate: '2011-04-18', rating: 4.8, ratingCount: 260, categoryId: categories.puzzle.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: 'Counter-Strike 2', slug: 'counter-strike-2', steamId: '730', description: 'El shooter táctico más jugado del mundo regresa con el motor Source 2. Misma competencia feroz, nueva tecnología.', trailerUrl: 'https://www.youtube.com/embed/GiKHmusnMcE', developer: 'Valve', publisher: 'Valve', releaseDate: '2023-09-27', rating: 4.0, ratingCount: 350, categoryId: categories.shooter.id, platforms: 'PC', featured: false },
    { title: 'Overwatch 2', slug: 'overwatch-2', steamId: '1817070', description: 'El shooter de héroes de Blizzard con formato 5v5 más dinámico. Decenas de héroes únicos con habilidades distintas.', trailerUrl: 'https://www.youtube.com/embed/GKXS_YA9j0c', developer: 'Blizzard Entertainment', publisher: 'Blizzard Entertainment', releaseDate: '2023-08-10', rating: 3.8, ratingCount: 200, categoryId: categories.shooter.id, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false },
    { title: 'Metaphor: ReFantazio', slug: 'metaphor-refantazio', steamId: '1620340', description: 'Del estudio detrás de Persona llega un RPG que redefine el género con combate en tiempo real y por turnos.', trailerUrl: 'https://www.youtube.com/embed/0aMV7n4Uzpw', developer: 'Studio Zero', publisher: 'SEGA', releaseDate: '2024-10-11', rating: 4.7, ratingCount: 75, categoryId: categories.rpg.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: "Dragon Age: The Veilguard", slug: 'dragon-age-the-veilguard', steamId: '1841400', description: 'La esperada secuela de Dragon Age. Reúne un equipo para enfrentar una amenaza que podría destruir Thedas.', trailerUrl: 'https://www.youtube.com/embed/CUBM0H3Y5yQ', developer: 'BioWare', publisher: 'EA', releaseDate: '2024-10-31', rating: 3.9, ratingCount: 65, categoryId: categories.rpg.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: 'Tekken 8', slug: 'tekken-8', steamId: '1778820', description: 'La saga de lucha más legendaria regresa con el sistema Heat revolucionario. Jin vs Kazuya en la batalla definitiva.', trailerUrl: 'https://www.youtube.com/embed/WfFSVL5iPSQ', developer: 'Bandai Namco Studios', publisher: 'Bandai Namco', releaseDate: '2024-01-25', rating: 4.2, ratingCount: 90, categoryId: categories.fighting.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: "Assassin's Creed Shadows", slug: 'assassins-creed-shadows', steamId: '2001120', description: "Dos protagonistas, un Japón feudal en guerra. Naoe la shinobi y Yasuke el samurái en la era Sengoku.", trailerUrl: 'https://www.youtube.com/embed/vovkzmt3NqA', developer: 'Ubisoft Quebec', publisher: 'Ubisoft', releaseDate: '2025-03-20', rating: 4.0, ratingCount: 55, categoryId: categories.adventure.id, platforms: 'PC, PlayStation, Xbox', featured: false },
    { title: 'Horizon Forbidden West', slug: 'horizon-forbidden-west', steamId: '594650', description: 'Aloy viaja a la Costa Prohibida para descubrir la fuente de una plaga misteriosa en este mundo abierto impresionante.', trailerUrl: 'https://www.youtube.com/embed/Lq594vMpJsw', developer: 'Guerrilla Games', publisher: 'Sony Interactive', releaseDate: '2024-03-21', rating: 4.4, ratingCount: 120, categoryId: categories.adventure.id, platforms: 'PC, PlayStation', featured: false },
    { title: 'Apex Legends', slug: 'apex-legends', steamId: '516750', description: 'El battle royale de héroes más rápido y táctico. Leyendas con habilidades únicas, movimiento fluido y combate intenso.', trailerUrl: 'https://www.youtube.com/embed/oOmega7YcmMs', developer: 'Respawn Entertainment', publisher: 'EA', releaseDate: '2020-11-04', rating: 4.0, ratingCount: 270, categoryId: categories.shooter.id, platforms: 'PC, PlayStation, Xbox, Nintendo Switch', featured: false },
  ]

  const allGames: any[] = []
  let totalDownloadLinks = 0

  for (const game of gamesData) {
    const torrentData = TORRENT_DOWNLOADS[game.slug]
    const created = await db.game.create({
      data: {
        title: game.title,
        slug: game.slug,
        description: game.description,
        imageUrl: STEAM_CAPSULE(game.steamId),
        coverUrl: STEAM_HERO(game.steamId),
        trailerUrl: game.trailerUrl || null,
        downloadUrl: STEAM_STORE(game.steamId),
        fileSize: torrentData?.fileSize || null,
        developer: game.developer,
        publisher: game.publisher,
        releaseDate: game.releaseDate,
        rating: game.rating,
        ratingCount: game.ratingCount,
        categoryId: game.categoryId,
        platforms: game.platforms,
        featured: game.featured,
      },
    })
    allGames.push(created)

    // Create torrent download links for this game
    const linksCreated = await createDownloadLinks(created.id, game.slug)
    totalDownloadLinks += linksCreated
  }

  // Create reviews
  await createSampleReviews(user1.id, user2.id, user3.id, allGames, user4.id)

  // Create favorites
  const favoriteData = [
    { userId: user1.id, gameIdx: [0, 2, 4, 8, 11, 14] },
    { userId: user2.id, gameIdx: [1, 3, 5, 7, 10, 13] },
    { userId: user3.id, gameIdx: [0, 4, 6, 9, 12, 15] },
    { userId: user4.id, gameIdx: [2, 3, 7, 11, 14] },
  ]

  for (const fav of favoriteData) {
    for (const idx of fav.gameIdx) {
      const game = allGames[idx]
      if (game) {
        await db.favorite.create({ data: { userId: fav.userId, gameId: game.id } })
      }
    }
  }

  return NextResponse.json({
    message: 'Database seeded with torrent download links!',
    games: allGames.length,
    categories: Object.keys(categories).length,
    users: 4,
    downloadLinks: totalDownloadLinks,
  })
}

async function createSampleReviews(user1Id: string, user2Id: string, user3Id: string, games: any[], user4Id?: string) {
  const reviewComments = [
    { rating: 4, comment: 'Increíble mundo abierto y narrativa. La experiencia completa es memorable y Night City es una obra de arte visual.' },
    { rating: 5, comment: 'Una obra maestra. Cada jefe es un desafío épico que te hace querer mejorar constantemente. El mundo abierto es perfecto.' },
    { rating: 5, comment: 'Combate mejorado, historia conmovedora y gráficos impresionantes. Imprescindible para cualquier jugador.' },
    { rating: 5, comment: 'El mejor RPG en años. Las decisiones importan de verdad, el combate es profundo y la narrativa es brillante.' },
    { rating: 4, comment: 'Un remake excepcional que moderniza el clásico sin perder su esencia. Combate más fluido y gráficos impresionantes.' },
    { rating: 4, comment: 'El mejor juego de carreras en mundo abierto. Escenario espectacular y variedad impresionante de coches.' },
    { rating: 5, comment: 'Una experiencia narrativa sin igual. El mundo es el más vivo y detallado que he visto. Arthur Morgan es inolvidable.' },
    { rating: 5, comment: 'Sigue siendo el rey de los RPG. Las misiones secundarias tienen más profundidad que juegos enteros.' },
    { rating: 5, comment: 'Una revelación. Combate adictivo, jefes espectaculares y la mitología le da una frescura increíble.' },
    { rating: 4, comment: 'Hace justicia al mundo mágico. Explorar el castillo es una delicia y los hechizos son divertidos.' },
    { rating: 5, comment: 'Poesía visual. El combate con katana es elegante y la historia es conmovedora y épica.' },
    { rating: 4, comment: 'Sigue siendo entretenido después de todos estos años. La ciudad es increíblemente detallada.' },
  ]

  const userIds = [user1Id, user2Id, user3Id, user4Id].filter(Boolean) as string[]

  for (let i = 0; i < Math.min(games.length, reviewComments.length * 3); i++) {
    const review = reviewComments[i % reviewComments.length]
    const userId = userIds[i % userIds.length]
    const game = games[i]
    if (!game) continue

    const existing = await db.review.findFirst({ where: { userId, gameId: game.id } })
    if (!existing) {
      await db.review.create({
        data: { userId, gameId: game.id, rating: review.rating, comment: review.comment }
      })
    }
  }
}
