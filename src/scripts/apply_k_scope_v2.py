import json, re

# Read Claude's K scope output
with open(r'C:\Users\1990j\claude_k_scope_v2.json') as f:
    d = json.load(f)
raw = d['choices'][0]['message']['content']

# Extract TypeScript code block
code_match = re.search(r'```typescript\n(.*?)```', raw, re.DOTALL)
if code_match:
    new_k = code_match.group(1).strip()
else:
    new_k = raw.strip()

# Ensure it starts with export const K:
if not new_k.startswith('export const K:'):
    k_start = new_k.find('export const K:')
    if k_start >= 0:
        new_k = new_k[k_start:]

print(f"New K block: {len(new_k)} chars")

# Read curriculum.ts
with open(r'C:\Users\1990j\coverschool\src\lib\curriculum.ts') as f:
    content = f.read()

# Find boundaries
k_header = "// ====================== KINDERGARTEN ======================"
g1_header = "// ====================== 1ST GRADE ======================"

k_start = content.find(k_header)
g1_start = content.find(g1_header)

if k_start >= 0 and g1_start > k_start:
    old_k = content[k_start:g1_start]
    content = content[:k_start] + new_k + "\n\n" + content[g1_start:]
    
    with open(r'C:\Users\1990j\coverschool\src\lib\curriculum.ts', 'w') as f:
        f.write(content)
    
    # Verify
    short = len(re.findall(r"type: 'short'", content))
    activity = len(re.findall(r"type: 'activity'", content))
    k_ids = len(re.findall(r"id: 'K-", content))
    print(f"Applied! Short: {short}, Activity: {activity}, K IDs: {k_ids}")
else:
    print("Could not find boundaries!")
    print(f"K header at {k_start}, G1 at {g1_start}")
