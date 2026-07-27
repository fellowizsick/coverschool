import json

with open(r'C:\Users\1990j\claude_k_rewrite.json') as f:
    d = json.load(f)
raw = d['choices'][0]['message']['content']

start = raw.find('```typescript')
end = raw.find('```', start + 12)
new_k = raw[start+12:end].strip()

print(f"New K block: {len(new_k)} chars")

with open(r'C:\Users\1990j\coverschool\src\lib\curriculum.ts') as f:
    content = f.read()

old_start = content.find("// ====================== KINDERGARTEN ======================")
old_end = content.find("// ====================== 1ST GRADE ======================")

if old_start == -1 or old_end == -1:
    print("ERROR: Could not find block boundaries!")
else:
    new_content = content[:old_start] + new_k + "\n\n" + content[old_end:]
    
    with open(r'C:\Users\1990j\coverschool\src\lib\curriculum.ts', 'w') as f:
        f.write(new_content)
    
    print(f"New file size: {len(new_content)} chars")
    s = new_content.count("type: 'short'")
    a = new_content.count("type: 'activity'")
    print(f"Short type: {s}")
    print(f"Activity type: {a}")
    m1 = new_content.count('K-M-W1-')
    m2 = new_content.count('K-M-W2-')
    m3 = new_content.count('K-M-W3-')
    print(f"Math W1: {m1}, W2: {m2}, W3: {m3}")
    
    # Check for any 'open' answers
    o = new_content.count("answer: 'open'")
    print(f"Open answers: {o}")
