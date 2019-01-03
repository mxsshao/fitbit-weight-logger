f = open('tumbler_kg.xml','w+')
for i in range(61):
    s = str(i)
    f.write('<use href="#tumbler-item"><text class="tumbler_item_kg_1">---</text></use>\n')
f.close()

f = open('tumbler_fat.xml','w+')
for i in range(5, 51):
    s = str(i)
    f.write('<use href="#tumbler-item"><text class="tumbler_item_fat_1">' + s + '</text></use>\n')
f.close()
