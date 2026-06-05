#!/usr/bin/env python3
"""
Script to fetch real magnet links from FitGirl repacks site for all games.
Uses z-ai CLI page_reader to fetch pages and extracts magnet hashes.
"""
import json
import re
import subprocess
import time
import os

OUTPUT_FILE = '/home/z/my-project/download/magnet_links.json'

GAME_SLUGS = [
    'cyberpunk-2077', 'elden-ring', 'god-of-war-ragnarok', 'baldurs-gate-3',
    'resident-evil-4-remake', 'black-myth-wukong', 'red-dead-redemption-2',
    'the-witcher-3-wild-hunt', 'sekiro-shadows-die-twice', 'hogwarts-legacy',
    'ghost-of-tsushima', 'grand-theft-auto-v', 'doom-eternal', 'helldivers-2',
    'death-stranding', 'dark-souls-iii', 'fallout-4', 'the-elder-scrolls-v-skyrim',
    'dragons-dogma-2', 'metaphor-refantazio', 'like-a-dragon-infinite-wealth',
    'persona-5-royal', 'final-fantasy-vii-remake', 'the-last-of-us-part-ii',
    'assassins-creed-shadows', 'horizon-forbidden-west', 'it-takes-two',
    'a-plague-tale-requiem', 'starfield', 'counter-strike-2',
    'call-of-duty-modern-warfare-3', 'resident-evil-village', 'titanfall-2',
    'forza-horizon-5', 'need-for-speed-unbound', 'assetto-corsa', 'hollow-knight',
    'stardew-valley', 'hades', 'celeste', 'cuphead', 'civilization-vi',
    'total-war-warhammer-3', 'rimworld', 'the-sims-4', 'farming-simulator-22',
    'microsoft-flight-simulator', 'tekken-8', 'street-fighter-6', 'portal-2',
    'alan-wake-2', 'star-wars-jedi-survivor', 'marvels-spider-man-remastered',
    'mass-effect-legendary-edition', 'dead-space-remake', 'control',
    'dishonored-2', 'prey-2017', 'devil-may-cry-5', 'monster-hunter-world',
    'nier-automata', 'detroit-become-human', 'disco-elysium', 'outer-wilds',
    'subnautica', 'the-outer-worlds', 'tomb-raider-2013', 'rise-of-the-tomb-raider',
    'shadow-of-the-tomb-raider', 'hitman-world-of-assassination', 'dying-light-2',
    'far-cry-6', 'watch-dogs-legion', 'sons-of-the-forest', 'valheim',
    'terraria', 'lethal-company', 'hades-2', 'bioshock-remastered',
    'bioshock-infinite', 'half-life-2', 'left-4-dead-2',
    'middle-earth-shadow-of-war', 'batman-arkham-knight', 'the-forest',
    'green-hell', 'grounded', 'back-4-blood', 'world-war-z',
    'dark-souls-remastered', 'dark-souls-2-scholar', 'hollow-knight-silksong',
    'factorio', 'age-of-empires-4', 'cities-skylines', 'euro-truck-simulator-2',
    'mortal-kombat-1', 'the-witness', 'returnal',
]

def get_fitgirl_urls(slug):
    urls = [f'https://fitgirl-repacks.site/{slug}/']
    alternatives = {
        'god-of-war-ragnarok': ['god-of-war-ragnarok-pc/'],
        'baldurs-gate-3': ['baldurs-gate-iii/'],
        'resident-evil-4-remake': ['resident-evil-4/'],
        'ghost-of-tsushima': ['ghost-of-tsushima-directors-cut/'],
        'grand-theft-auto-v': ['gta-v/'],
        'the-elder-scrolls-v-skyrim': ['the-elder-scrolls-v-skyrim-special-edition/'],
        'dragons-dogma-2': ['dragon-s-dogma-2/'],
        'helldivers-2': ['helldivers-ii/'],
        'dark-souls-iii': ['dark-souls-3/'],
        'resident-evil-village': ['resident-evil-8-village/'],
        'total-war-warhammer-3': ['total-war-warhammer-iii/'],
        'the-sims-4': ['the-sims-4-all-dlcs/'],
        'microsoft-flight-simulator': ['microsoft-flight-simulator-2020/'],
        'street-fighter-6': ['street-fighter-vi/'],
        'star-wars-jedi-survivor': ['star-wars-jedi-survivor-pc/'],
        'marvels-spider-man-remastered': ['marvels-spider-man/'],
        'dead-space-remake': ['dead-space-2023/'],
        'prey-2017': ['prey/'],
        'devil-may-cry-5': ['devil-may-cry-v/'],
        'monster-hunter-world': ['monster-hunter-world-iceborne/'],
        'nier-automata': ['nier-automata-game-of-the-yorha-edition/'],
        'detroit-become-human': ['detroit-become-human-pc/'],
        'disco-elysium': ['disco-elysium-the-final-cut/'],
        'outer-wilds': ['outer-wilds-pc/'],
        'tomb-raider-2013': ['tomb-raider/'],
        'hitman-world-of-assassination': ['hitman-3/'],
        'dying-light-2': ['dying-light-2-stay-human/'],
        'far-cry-6': ['far-cry-vi/'],
        'watch-dogs-legion': ['watch-dogs-3-legion/'],
        'hades-2': ['hades-ii/'],
        'bioshock-remastered': ['bioshock-the-collection/'],
        'bioshock-infinite': ['bioshock-infinite-the-complete-edition/'],
        'dark-souls-2-scholar': ['dark-souls-ii-scholar-of-the-first-sin/'],
        'middle-earth-shadow-of-war': ['middle-earth-shadow-of-war-definitive-edition/'],
        'batman-arkham-knight': ['batman-arkham-knight-premium-edition/'],
        'mortal-kombat-1': ['mortal-kombat-i/'],
        'returnal': ['returnal-pc/'],
        'world-war-z': ['world-war-z-aftermath/'],
        'assetto-corsa': ['assetto-corsa-ultimate-edition/'],
        'call-of-duty-modern-warfare-3': ['call-of-duty-modern-warfare-iii/'],
        'the-outer-worlds': ['the-outer-worlds-spacers-choice-edition/'],
        'final-fantasy-vii-remake': ['final-fantasy-vii-remake-intergrade/'],
        'like-a-dragon-infinite-wealth': ['like-a-dragon-8/'],
        'horizon-forbidden-west': ['horizon-forbidden-west-complete-edition/'],
        'the-last-of-us-part-ii': ['the-last-of-us-part-2/'],
        'counter-strike-2': ['counter-strike-2-pc/'],
        'need-for-speed-unbound': ['need-for-speed-unbound-pc/'],
        'a-plague-tale-requiem': ['a-plague-tale-requiem-pc/'],
        'assassins-creed-shadows': ['assassins-creed-shadows-pc/'],
    }
    if slug in alternatives:
        for alt in alternatives[slug]:
            urls.append(f'https://fitgirl-repacks.site/{alt}')
    return urls


def fetch_page(url):
    tmp_file = '/home/z/my-project/download/_tmp_page.json'
    try:
        result = subprocess.run(
            ['z-ai', 'function', '-n', 'page_reader', '-a', json.dumps({"url": url}), '-o', tmp_file],
            capture_output=True, text=True, timeout=30
        )
        if result.returncode != 0:
            return None
        with open(tmp_file) as f:
            data = json.load(f)
        html = data.get('data', {}).get('html', '')
        title = data.get('data', {}).get('title', '')
        return {'html': html, 'title': title}
    except Exception as e:
        return None


def extract_magnets(html):
    hashes = re.findall(r'magnet:\?xt=urn:btih:([a-zA-Z0-9]{40})', html)
    seen = set()
    unique = []
    for h in hashes:
        if h.lower() not in seen:
            seen.add(h.lower())
            unique.append(h.upper())
    return unique


def is_page_not_found(title, html):
    return 'Page not found' in title or 'Not Found' in title or len(html) < 5000


def search_fitgirl_page(game_name):
    try:
        result = subprocess.run(
            ['z-ai', 'function', '-n', 'web_search', '-a', json.dumps({"query": f"fitgirl-repacks.site {game_name} repack", "num": 3})],
            capture_output=True, text=True, timeout=30
        )
        if result.returncode != 0:
            return None
        output = result.stdout + result.stderr
        match = re.search(r'\[.*?\]', output, re.DOTALL)
        if match:
            try:
                results = json.loads(match.group())
                for r in results:
                    url = r.get('url', '')
                    if 'fitgirl-repacks.site' in url and '/tag/' not in url and '/page/' not in url and '/author/' not in url:
                        return url
            except:
                pass
        return None
    except:
        return None


def main():
    results = {}
    if os.path.exists(OUTPUT_FILE):
        with open(OUTPUT_FILE) as f:
            results = json.load(f)
        print(f"Loaded {len(results)} existing results")

    total = len(GAME_SLUGS)

    for i, slug in enumerate(GAME_SLUGS):
        if slug in results and results[slug].get('fitgirl_hash'):
            print(f'[{i+1}/{total}] {slug}: already has magnet, skipping')
            continue

        print(f'[{i+1}/{total}] Processing {slug}...')

        fitgirl_hash = None
        urls_to_try = get_fitgirl_urls(slug)

        for url in urls_to_try:
            page = fetch_page(url)
            if page and not is_page_not_found(page['title'], page['html']):
                magnets = extract_magnets(page['html'])
                if magnets:
                    fitgirl_hash = magnets[0]
                    print(f'  Found FitGirl magnet: {fitgirl_hash}')
                    break
            time.sleep(0.5)

        if not fitgirl_hash:
            search_name = slug.replace('-', ' ')
            fg_url = search_fitgirl_page(search_name)
            if fg_url:
                print(f'  Search found page: {fg_url}')
                page = fetch_page(fg_url)
                if page and not is_page_not_found(page['title'], page['html']):
                    magnets = extract_magnets(page['html'])
                    if magnets:
                        fitgirl_hash = magnets[0]
                        print(f'  Found FitGirl magnet via search: {fitgirl_hash}')
            time.sleep(0.5)

        results[slug] = {
            'fitgirl_hash': fitgirl_hash,
            'magnet_url': f'magnet:?xt=urn:btih:{fitgirl_hash}' if fitgirl_hash else None,
        }

        with open(OUTPUT_FILE, 'w') as f:
            json.dump(results, f, indent=2)

        print(f'  Result: {fitgirl_hash or "NOT FOUND"}')
        time.sleep(1)

    found = sum(1 for v in results.values() if v.get('fitgirl_hash'))
    not_found = sum(1 for v in results.values() if not v.get('fitgirl_hash'))
    print(f'\n=== SUMMARY ===')
    print(f'Found: {found}/{total}')
    print(f'Not found: {not_found}/{total}')
    if not_found > 0:
        print('Missing games:')
        for slug, data in results.items():
            if not data.get('fitgirl_hash'):
                print(f'  - {slug}')


if __name__ == '__main__':
    main()
