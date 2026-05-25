import re

def refactor_css(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Refactor Text Gradients
    # Find all instances of standard text gradient properties.
    gradient_pattern = re.compile(
        r'\s*background:\s*var\(--gradient-brand\);\s*-webkit-background-clip:\s*text;\s*-webkit-text-fill-color:\s*transparent;\s*background-clip:\s*text;',
        re.MULTILINE
    )

    # Replace them with a reference or base class application if we can,
    # or just remove them and we'll manually prepend `.text-gradient` in a custom utility.
    # It's cleaner to just replace the verbose block with a single custom variable or mixin-like util if it was PostCSS.
    # As it's Vanilla CSS, let's just create a shared block and strip the duplicates.

    # Find the selectors that have this pattern.
    selectors = []
    
    # We will iterate through blocks
    blocks = re.split(r'}', content)
    new_blocks = []
    
    gradient_selectors = []
    glass_selectors = []

    for block in blocks:
        if not block.strip():
            new_blocks.append(block)
            continue
            
        parts = block.split('{')
        if len(parts) == 2:
            selector, body = parts
            
            # Check Gradient
            if '-webkit-background-clip: text;' in body and 'var(--gradient-brand)' in body:
                gradient_selectors.append(selector.strip())
                body = re.sub(
                    r'\s*background:\s*var\(--gradient-[^;]+\);\s*-webkit-background-clip:\s*text;\s*-webkit-text-fill-color:\s*transparent;\s*background-clip:\s*text;',
                    '',
                    body
                )
                
            # Check Glassmorphism
            if 'backdrop-filter: blur' in body and 'var(--bg-glass)' in body:
                glass_selectors.append(selector.strip())
                # Just remove the explicit duplicates (we'll keep some padding/radius though)
                body = re.sub(r'\s*background:\s*var\(--bg-glass\);', '', body)
                body = re.sub(r'\s*backdrop-filter:\s*blur\([^)]+\);', '', body)
                body = re.sub(r'\s*-webkit-backdrop-filter:\s*blur\([^)]+\);', '', body)
                # Keep the border though as it pairs with it or remove it?
                # body = re.sub(r'\s*border:\s*1px\s*solid\s*var\(--border-color\);', '', body)
            
            # Strip -webkit-backdrop-filter globally for best practices toolings
            body = re.sub(r'\s*-webkit-backdrop-filter:[^;]+;', '', body)
                
            new_blocks.append(selector + '{' + body)
        else:
            new_blocks.append(block)

    modified = '}'.join(new_blocks)

    # Inject the consolidated classes right after utility section or at the top
    consolidated = ""
    if gradient_selectors:
        clean_grad = [s.replace('\n', '').strip() for s in gradient_selectors if s]
        consolidated += ",\n".join(clean_grad) + " {\n  background: var(--gradient-brand);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  background-clip: text;\n}\n\n"

    if glass_selectors:
        clean_glass = [s.replace('\n', '').strip() for s in glass_selectors if s]
        consolidated += ",\n".join(clean_glass) + " {\n  background: var(--bg-glass);\n  backdrop-filter: blur(16px);\n  border: 1px solid var(--border-color);\n}\n\n"

    # Insert after standard util rules
    if "/* UTILITY */" in modified:
        modified = modified.replace("/* UTILITY */", "/* UTILITY */\n" + consolidated)
    else:
        modified = "/* CONSOLIDATED UTILS */\n" + consolidated + modified

    # Fix Performance: box-shadow animations.
    # Change `box-shadow` in @keyframes badgePulse to just transform/opacity. Currently it's box-shadow pulsing.
    # Actually wait, rewriting animations via regex might break things. Let's just do the ones we can safely.

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(modified)

    print("Refactoring complete.")
    print("Consolidated Gradients for:", len(gradient_selectors), "elements")
    print("Consolidated Glass for:", len(glass_selectors), "elements")


refactor_css(r'D:\source_code\GRC-Conclave\css\style.css')
