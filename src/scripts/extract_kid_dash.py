import re

with open(r'C:\Users\1990j\fellowzvault\Anne - LCA School\kid_dashboard_design.txt') as f:
    content = f.read()

# Find the TypeScript/TSX code block
pattern = r'```tsx\n(.*?)```'
match = re.search(pattern, content, re.DOTALL)
if match:
    code = match.group(1).strip()
    with open(r'C:\Users\1990j\coverschool\src\components\KidsDashboard.tsx', 'w') as f:
        f.write(code)
    print(f"Written kid dashboard: {len(code)} chars")
else:
    # Try ```tsx or just the first code block
    pattern2 = r'```\w*\n(.*?)```'
    match2 = re.search(pattern2, content, re.DOTALL)
    if match2:
        code = match2.group(1).strip()
        with open(r'C:\Users\1990j\coverschool\src\components\KidsDashboard.tsx', 'w') as f:
            f.write(code)
        print(f"Written (alt): {len(code)} chars")
    else:
        print("No code block found")
        print("First 200 chars:", content[:200])
