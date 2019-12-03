"""
Worteigenschaften: 
- Länge zwischen 2 und 8 Zeichen
- keine Bindestriche
"""
import json

words = []

with open('wortliste.txt') as input_file:
    for line in input_file:
        if 3 < len(line) < 8 and '-' not in line:
            words.append(line.strip())

with open('words.json', 'w', encoding='utf-8') as json_file:
    json.dump(words, json_file, ensure_ascii=False, indent=4)
