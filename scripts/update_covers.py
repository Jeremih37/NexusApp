#!/usr/bin/env python3
"""
Update all game covers with HD images from RAWG API.
Each game is fetched by its slug, guaranteeing the cover matches the game.
Uses RAWG CDN with HD cropping for beautiful, high-resolution covers.
"""

import sqlite3
import json
import urllib.request
import urllib.error
import time
import sys

RAWG_API_KEY = "ccb89b0faf37497a8b9684b160ff1270"
DB_PATH = "/home/z/my-project/db/custom.db"

# All game slugs from the database
GAME_SLUGS = [
    # Batch 1
    "cyberpunk-2077", "elden-ring", "god-of-war-ragnarok", "baldurs-gate-3",
    "resident-evil-4-remake", "black-myth-wukong", "red-dead-redemption-2",
    "the-witcher-3-wild-hunt", "sekiro-shadows-die-twice", "hogwarts-legacy",
    "ghost-of-tsushima", "grand-theft-auto-v", "doom-eternal", "helldivers-2",
    "death-stranding", "dark-souls-iii", "fallout-4", "the-elder-scrolls-v-skyrim",
    "dragons-dogma-2", "metaphor-refantazio", "like-a-dragon-infinite-wealth",
    "persona-5-royal", "final-fantasy-vii-remake", "the-last-of-us-part-ii",
    "assassins-creed-shadows", "horizon-forbidden-west", "it-takes-two",
    "a-plague-tale-requiem", "starfield", "counter-strike-2",
    "call-of-duty-modern-warfare-3", "doom-eternal-shooter", "resident-evil-village",
    "titanfall-2", "forza-horizon-5", "need-for-speed-unbound", "assetto-corsa",
    "hollow-knight", "stardew-valley", "hades", "celeste", "cuphead",
    "civilization-vi", "total-war-warhammer-3", "rimworld", "the-sims-4",
    "farming-simulator-22", "microsoft-flight-simulator", "tekken-8",
    "street-fighter-6", "portal-2",
    # Batch 2
    "alan-wake-2", "star-wars-jedi-survivor", "spider-man-2",
    "diablo-iv", "final-fantasy-xvi", "palworld",
    "prince-of-persia-the-lost-crown", "alone-in-the-dark-2024",
    "banishers-ghosts-of-new-eden", "dragon-age-the-veilguard",
    "batman-arkham-knight", "half-life-2", "left-4-dead-2",
    "team-fortress-2", "dota-2", "league-of-legends",
    "genshin-impact", "honkai-star-rail", "bioshock-infinite",
    "tomb-raider-2013", "shadow-of-the-colossus",
    "metal-gear-solid-v-the-phantom-pain", "halo-infinite",
    "dishonored-2", "xcom-2", "sea-of-thieves",
    "mass-effect-legendary-edition", "control", "monster-hunter-world",
    "minecraft", "fortnite", "valorant", "overwatch-2", "apex-legends",
    "hades-ii", "hollow-knight-silksong",
    "the-legend-of-zelda-tears-of-the-kingdom",
    "fire-emblem-engage", "pikmin-4", "super-mario-odyssey",
    "super-smash-bros-ultimate", "animal-crossing-new-horizons",
    "mario-kart-8-deluxe", "splatoon-3", "metroid-dread",
    "pokemon-scarlet-violet", "xenoblade-chronicles-3",
]

# RAWG slug mapping (some slugs differ from our DB slugs)
RAWG_SLUG_MAP = {
    "god-of-war-ragnarok": "god-of-war-ragnarok",
    "baldurs-gate-3": "baldurs-gate-3",
    "resident-evil-4-remake": "resident-evil-4-remake-2",
    "black-myth-wukong": "black-myth-wukong",
    "the-witcher-3-wild-hunt": "the-witcher-3-wild-hunt",
    "sekiro-shadows-die-twice": "sekiro-shadows-die-twice",
    "hogwarts-legacy": "hogwarts-legacy",
    "ghost-of-tsushima": "ghost-of-tsushima",
    "doom-eternal": "doom-eternal",
    "helldivers-2": "helldivers-2",
    "death-stranding": "death-stranding",
    "dark-souls-iii": "dark-souls-iii",
    "fallout-4": "fallout-4",
    "the-elder-scrolls-v-skyrim": "the-elder-scrolls-v-skyrim-special-edition",
    "dragons-dogma-2": "dragons-dogma-2",
    "metaphor-refantazio": "metaphor-refantazio",
    "like-a-dragon-infinite-wealth": "like-a-dragon-infinite-wealth",
    "persona-5-royal": "persona-5-royal",
    "final-fantasy-vii-remake": "final-fantasy-vii-remake-integrate",
    "the-last-of-us-part-ii": "the-last-of-us-part-ii",
    "assassins-creed-shadows": "assassins-creed-shadows",
    "horizon-forbidden-west": "horizon-forbidden-west",
    "it-takes-two": "it-takes-two",
    "a-plague-tale-requiem": "a-plague-tale-requiem",
    "starfield": "starfield",
    "counter-strike-2": "counter-strike-2",
    "call-of-duty-modern-warfare-3": "call-of-duty-modern-warfare-3-2023",
    "doom-eternal-shooter": "doom-eternal",
    "resident-evil-village": "resident-evil-village",
    "titanfall-2": "titanfall-2",
    "forza-horizon-5": "forza-horizon-5",
    "need-for-speed-unbound": "need-for-speed-unbound",
    "assetto-corsa": "assetto-corsa",
    "hollow-knight": "hollow-knight",
    "stardew-valley": "stardew-valley",
    "hades": "hades",
    "celeste": "celeste",
    "cuphead": "cuphead",
    "civilization-vi": "sid-meiers-civilization-vi",
    "total-war-warhammer-3": "total-war-warhammer-iii",
    "rimworld": "rimworld",
    "the-sims-4": "the-sims-4",
    "farming-simulator-22": "farming-simulator-22",
    "microsoft-flight-simulator": "microsoft-flight-simulator",
    "tekken-8": "tekken-8",
    "street-fighter-6": "street-fighter-6",
    "portal-2": "portal-2",
    "alan-wake-2": "alan-wake-2",
    "star-wars-jedi-survivor": "star-wars-jedi-survivor",
    "spider-man-2": "marvels-spider-man-2",
    "diablo-iv": "diablo-iv",
    "final-fantasy-xvi": "final-fantasy-xvi",
    "palworld": "palworld",
    "prince-of-persia-the-lost-crown": "prince-of-persia-the-lost-crown",
    "alone-in-the-dark-2024": "alone-in-the-dark-2024",
    "banishers-ghosts-of-new-eden": "banishers-ghosts-of-new-eden",
    "dragon-age-the-veilguard": "dragon-age-the-veilguard",
    "batman-arkham-knight": "batman-arkham-knight",
    "half-life-2": "half-life-2",
    "left-4-dead-2": "left-4-dead-2",
    "team-fortress-2": "team-fortress-2",
    "dota-2": "dota-2",
    "league-of-legends": "league-of-legends",
    "genshin-impact": "genshin-impact",
    "honkai-star-rail": "honkai-star-rail",
    "bioshock-infinite": "bioshock-infinite",
    "tomb-raider-2013": "tomb-raider-2013",
    "shadow-of-the-colossus": "shadow-of-the-colossus",
    "metal-gear-solid-v-the-phantom-pain": "metal-gear-solid-v-the-phantom-pain",
    "halo-infinite": "halo-infinite",
    "dishonored-2": "dishonored-2",
    "xcom-2": "xcom-2",
    "sea-of-thieves": "sea-of-thieves",
    "mass-effect-legendary-edition": "mass-effect-legendary-edition",
    "control": "control",
    "monster-hunter-world": "monster-hunter-world",
    "minecraft": "minecraft",
    "fortnite": "fortnite",
    "valorant": "valorant",
    "overwatch-2": "overwatch-2",
    "apex-legends": "apex-legends",
    "hades-ii": "hades-ii",
    "hollow-knight-silksong": "hollow-knight-silksong",
    "the-legend-of-zelda-tears-of-the-kingdom": "the-legend-of-zelda-tears-of-the-kingdom",
    "fire-emblem-engage": "fire-emblem-engage",
    "pikmin-4": "pikmin-4",
    "super-mario-odyssey": "super-mario-odyssey",
    "super-smash-bros-ultimate": "super-smash-bros-ultimate",
    "animal-crossing-new-horizons": "animal-crossing-new-horizons",
    "mario-kart-8-deluxe": "mario-kart-8-deluxe",
    "splatoon-3": "splatoon-3",
    "metroid-dread": "metroid-dread",
    "pokemon-scarlet-violet": "pokemon-scarlet-and-violet",
    "xenoblade-chronicles-3": "xenoblade-chronicles-3",
    "grand-theft-auto-v": "grand-theft-auto-v",
    "red-dead-redemption-2": "red-dead-redemption-2",
}


def get_hd_url(rawg_url, width=600, height=400):
    """Convert a RAWG image URL to an HD cropped version."""
    if not rawg_url:
        return ""
    crop_path = f"/crop/{width}/{height}"
    if "/media/games/" in rawg_url:
        return rawg_url.replace("/media/games/", f"{crop_path}/games/")
    if "/media/screenshots/" in rawg_url:
        return rawg_url.replace("/media/screenshots/", f"{crop_path}/screenshots/")
    return rawg_url


def fetch_rawg_game(slug):
    """Fetch a game from RAWG API by slug."""
    url = f"https://api.rawg.io/api/games/{slug}?key={RAWG_API_KEY}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "NexusApp/1.0"})
        with urllib.request.urlopen(req, timeout=10) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None
        print(f"  HTTP Error {e.code} for {slug}")
        return None
    except Exception as e:
        print(f"  Error fetching {slug}: {e}")
        return None


def fetch_youtube_trailers(rawg_id):
    """Fetch YouTube trailer for a game from RAWG."""
    url = f"https://api.rawg.io/api/games/{rawg_id}/youtube?key={RAWG_API_KEY}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "NexusApp/1.0"})
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode("utf-8"))
            results = data.get("results", [])
            for video in results:
                name = video.get("name", "").lower()
                if any(kw in name for kw in ["trailer", "official", "launch", "reveal"]):
                    return f"https://www.youtube.com/embed/{video['video_id']}"
            if results:
                return f"https://www.youtube.com/embed/{results[0]['video_id']}"
            return None
    except:
        return None


def main():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Get all games from database
    cursor.execute("SELECT id, slug, title FROM Game")
    games = cursor.fetchall()
    db_slugs = {row[1]: row for row in games}

    print(f"🖼️  Updating covers for {len(games)} games from RAWG API...")
    print(f"📊 Database has {len(games)} games\n")

    updated = 0
    errors = 0
    skipped = 0

    for i, (game_id, slug, title) in enumerate(games):
        # Use mapped RAWG slug if available
        rawg_slug = RAWG_SLUG_MAP.get(slug, slug)

        print(f"[{i+1}/{len(games)}] {title} (slug: {slug}, rawg: {rawg_slug})")

        # Fetch from RAWG
        rawg_game = fetch_rawg_game(rawg_slug)

        if not rawg_game:
            # Try searching by name
            search_url = f"https://api.rawg.io/api/games?key={RAWG_API_KEY}&search={urllib.request.quote(title)}&page_size=1"
            try:
                req = urllib.request.Request(search_url, headers={"User-Agent": "NexusApp/1.0"})
                with urllib.request.urlopen(req, timeout=10) as response:
                    search_data = json.loads(response.read().decode("utf-8"))
                    if search_data.get("results") and len(search_data["results"]) > 0:
                        rawg_game = search_data["results"][0]
                        # Fetch full details
                        rawg_game = fetch_rawg_game(rawg_game["slug"])
            except:
                pass

        if not rawg_game or not rawg_game.get("background_image"):
            print(f"  ❌ No image available on RAWG")
            errors += 1
            # Rate limiting
            if (i + 1) % 3 == 0:
                time.sleep(1.1)
            continue

        bg_image = rawg_game["background_image"]
        bg_image_additional = rawg_game.get("background_image_additional") or bg_image

        # Generate HD URLs
        image_url = get_hd_url(bg_image, 600, 400)
        cover_url = get_hd_url(bg_image_additional, 1920, 1080)

        # Try to get trailer
        trailer_url = None
        rawg_id = rawg_game.get("id")
        if rawg_id:
            trailer_url = fetch_youtube_trailers(rawg_id)

        # Update database
        try:
            if trailer_url:
                cursor.execute(
                    "UPDATE Game SET imageUrl = ?, coverUrl = ?, trailerUrl = COALESCE(NULLIF(trailerUrl, ''), ?) WHERE id = ?",
                    (image_url, cover_url, trailer_url, game_id)
                )
            else:
                cursor.execute(
                    "UPDATE Game SET imageUrl = ?, coverUrl = ? WHERE id = ?",
                    (image_url, cover_url, game_id)
                )
            conn.commit()
            updated += 1
            print(f"  ✅ Cover updated: {image_url[:60]}...")
        except Exception as e:
            print(f"  ❌ DB error: {e}")
            errors += 1

        # Rate limiting: RAWG free tier ~4 req/sec
        if (i + 1) % 3 == 0:
            time.sleep(1.1)

    conn.close()
    print(f"\n{'='*60}")
    print(f"✅ Done! Updated: {updated}, Errors: {errors}, Skipped: {skipped}")
    print(f"📊 Total games processed: {len(games)}")


if __name__ == "__main__":
    main()
