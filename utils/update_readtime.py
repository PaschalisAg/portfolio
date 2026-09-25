import re
from pathlib import Path
from datetime import datetime
import readtime

# Set up paths relative to this script's location (assumed to be inside PORTFOLIO/utils/)
script_dir = Path(__file__).parent
blog_dir = script_dir.parent / 'blog'

def update_all_reading_times():
    # Make sure the blog directory exists
    if not blog_dir.exists():
        print(f"Error: Directory not found at {blog_dir}")
        return

    # Regex pattern to find the exact reading time span
    # Added 's?' to handle both 'minute' and 'minutes' in existing text
    pattern = re.compile(r'<span class="article-meta-pill">Reading time: \d+ minutes?</span>')
    json_ld_date_modified_pattern = re.compile(r'("dateModified"\s*:\s*")[0-9]{4}-[0-9]{2}-[0-9]{2}("\s*,?)')
    itemprop_date_modified_pattern = re.compile(r'(<meta\s+itemprop="dateModified"\s+content=")[0-9]{4}-[0-9]{2}-[0-9]{2}("\s*/?>)')

    # Loop through all .html files in the blog directory
    for file_path in blog_dir.glob('*.html'):
        try:
            # 1. Read the existing HTML content
            with open(file_path, 'r', encoding='utf-8') as file:
                html_content = file.read()

            # Use today's date as YYYY-MM-DD for dateModified.
            modified_date = datetime.now().strftime('%Y-%m-%d')

            # 2. Let readtime clean the HTML and calculate the minutes
            rt = readtime.of_html(html_content)
            
            # Ensure a minimum reading time of 1 minute
            minutes = max(1, rt.minutes)
            minute_text = "minute" if minutes == 1 else "minutes"

            # 3. Create the replacement string
            replacement = f'<span class="article-meta-pill">Reading time: {minutes} {minute_text}</span>'

            updated_html = html_content
            readtime_updated = False
            date_modified_updated = False

            # Update reading time span when present.
            if pattern.search(updated_html):
                updated_html = pattern.sub(replacement, updated_html)
                readtime_updated = True

            # Update JSON-LD dateModified when present.
            if json_ld_date_modified_pattern.search(updated_html):
                updated_html = json_ld_date_modified_pattern.sub(rf'\g<1>{modified_date}\g<2>', updated_html)
                date_modified_updated = True

            # Update schema meta itemprop dateModified when present.
            if itemprop_date_modified_pattern.search(updated_html):
                updated_html = itemprop_date_modified_pattern.sub(rf'\g<1>{modified_date}\g<2>', updated_html)
                date_modified_updated = True

            # 4. Write back only when content changed.
            if updated_html != html_content:
                with open(file_path, 'w', encoding='utf-8') as file:
                    file.write(updated_html)

                update_parts = []
                if readtime_updated:
                    update_parts.append(f"reading time {minutes} {minute_text}")
                if date_modified_updated:
                    update_parts.append(f"dateModified {modified_date}")
                print(f"Updated {file_path.name}: {', '.join(update_parts)}")
            else:
                print(f"Skipped {file_path.name}: No matching fields found or values already up to date.")

        except Exception as e:
            print(f"Error processing {file_path.name}: {e}")

if __name__ == "__main__":
    update_all_reading_times()