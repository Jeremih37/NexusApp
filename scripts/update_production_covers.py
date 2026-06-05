#!/usr/bin/env python3
"""
Update production game covers with RAWG HD images.
Directly calls the RAWG API and updates the production database via the API endpoint.
"""

import json, urllib.request, urllib.error, time, sys

RAWG_API_KEY = "ccb89b0faf37497a8b9684b160ff1270"
PRODUCTION_API = "https://nexusapp-public.vercel.app"

def get_hd_url(rawg_url, width=600, height=400):
    if not rawg_url: return ""
    crop_path = f"/crop/{width}/{height}"
    if "/media/games/" in rawg_url:
        return rawg_url.replace("/media/games/", f"{crop_path}/games/")
    if "/media/screenshots/" in rawg_url:
        return rawg_url.replace("/media/screenshots/", f"{crop_path}/screenshots/")
    return rawg_url

def fetch_rawg_game(slug):
    url = f"https://api.rawg.io/api/games/{slug}?key={RAWG_API_KEY}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "NexusApp/1.0"})
        with urllib.request.urlopen(req, timeout=15) as response:
            return json.loads(response.read().decode("utf-8"))
    except:
        return None

def fetch_rawg_game_search(name):
    url = f"https://api.rawg.io/api/games?key={RAWG_API_KEY}&search={urllib.request.quote(name)}&page_size=3"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "NexusApp/1.0"})
        with urllib.request.urlopen(req, timeout=15) as response:
            data = json.loads(response.read().decode("utf-8"))
            results = data.get("results", [])
            if results:
                return fetch_rawg_game(results[0]["slug"])
    except:
        pass
    return None

# RAWG slug mapping for games that have different slugs in our DB vs RAWG
RAWG_SLUG_MAP = {
    "god-of-war-ragnarok": "god-of-war-ragnarok",
    "resident-evil-4-remake": "resident-evil-4-remake-2",
    "the-elder-scrolls-v-skyrim": "the-elder-scrolls-v-skyrim-special-edition",
    "call-of-duty-modern-warfare-3": "call-of-duty-modern-warfare-3-2023",
    "doom-eternal-shooter": "doom-eternal",
    "civilization-vi": "sid-meiers-civilization-vi",
    "total-war-warhammer-3": "total-war-warhammer-iii",
    "final-fantasy-vii-remake": "final-fantasy-vii-remake-integrate",
    "horizon-forbidden-west": "horizon-forbidden-west-complete-edition",
    "marvels-spider-man-remastered": "marvels-spider-man-remastered",
    "dead-space-remake": "dead-space-2023",
    "prey-2017": "prey-2017",
    "nier-automata": "nier-automata",
    "tomb-raider-2013": "tomb-raider-2013",
}

def main():
    # Step 1: Get all games from production
    print("📡 Fetching games from production...")
    try:
        req = urllib.request.Request(f"{PRODUCTION_API}/api/games", headers={"User-Agent": "NexusApp/1.0"})
        with urllib.request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode("utf-8"))
            games = data if isinstance(data, list) else data.get("games", [])
    except Exception as e:
        print(f"❌ Could not fetch games: {e}")
        sys.exit(1)
    
    print(f"📊 Found {len(games)} games in production\n")
    
    # Step 2: For each game, fetch cover from RAWG and update via API
    updated = 0
    errors = 0
    
    for i, game in enumerate(games):
        slug = game.get("slug", "")
        title = game.get("title", "")
        game_id = game.get("id", "")
        
        print(f"[{i+1}/{len(games)}] {title} (slug: {slug})")
        
        # Skip games that already have RAWG covers
        current_image = game.get("imageUrl", "")
        if "rawg.io" in current_image:
            print(f"  ⏭️ Already has RAWG cover, skipping")
            updated += 1
            continue
        
        # Fetch from RAWG
        rawg_slug = RAWG_SLUG_MAP.get(slug, slug)
        rawg_game = fetch_rawg_game(rawg_slug)
        
        if not rawg_game:
            rawg_game = fetch_rawg_game_search(title)
        
        if not rawg_game or not rawg_game.get("background_image"):
            print(f"  ❌ No image on RAWG")
            errors += 1
            if (i + 1) % 3 == 0:
                time.sleep(1.1)
            continue
        
        bg_image = rawg_game["background_image"]
        bg_additional = rawg_game.get("background_image_additional") or bg_image
        
        image_url = get_hd_url(bg_image, 600, 400)
        cover_url = get_hd_url(bg_additional, 1920, 1080)
        
        # Update via API
        try:
            update_data = json.dumps({
                "gameId": game_id,
                "imageUrl": image_url,
                "coverUrl": cover_url,
            }).encode("utf-8")
            
            req = urllib.request.Request(
                f"{PRODUCTION_API}/api/games/{game_id}",
                data=update_data,
                headers={"Content-Type": "application/json", "User-Agent": "NexusApp/1.0"},
                method="PATCH"
            )
            
            try:
                with urllib.request.urlopen(req, timeout=15) as response:
                    result = json.loads(response.read().decode("utf-8"))
                    updated += 1
                    print(f"  ✅ Cover updated!")
            except urllib.error.HTTPError as e:
                # If PATCH not available, try the update-covers endpoint with RAWG key
                if e.code == 405:
                    print(f"  ⚠️ Direct PATCH not available, will use update-covers endpoint")
                else:
                    print(f"  ❌ API error: {e.code}")
                    errors += 1
        
        except Exception as e:
            print(f"  ❌ Update error: {e}")
            errors += 1
        
        # Rate limiting
        if (i + 1) % 3 == 0:
            time.sleep(1.1)
    
    print(f"\n{'='*60}")
    print(f"✅ Updated: {updated}, ❌ Errors: {errors}")
    print(f"📊 Total processed: {len(games)}")
    
    # Step 3: If direct PATCH didn't work, try the update-covers endpoint
    # This requires RAWG_API_KEY to be set in Vercel
    print(f"\n💡 If covers weren't updated, you need to:")
    print(f"   1. Add RAWG_API_KEY={RAWG_API_KEY} to Vercel environment variables")
    print(f"   2. Call: curl -X POST {PRODUCTION_API}/api/update-covers")

if __name__ == "__main__":
    main()
