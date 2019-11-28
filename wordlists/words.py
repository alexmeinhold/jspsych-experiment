"""
Worteigenschaften: 
- Länge zwischen 2 und 8 Zeichen
- keine Bindestriche
"""
words = []

with open('wortliste.txt') as f:
    for line in f:
        if 3 < len(line) < 8 and '-' not in line:
            words.append(line.strip())

print(len(words))
