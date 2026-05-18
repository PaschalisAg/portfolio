import re
from pathlib import Path
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

    # Loop through all .html files in the blog directory
    for file_path in blog_dir.glob('*.html'):
        try:
            # 1. Read the existing HTML content
            with open(file_path, 'r', encoding='utf-8') as file:
                html_content = file.read()

            # 2. Let readtime clean the HTML and calculate the minutes
            rt = readtime.of_html(html_content)
            
            # Ensure a minimum reading time of 1 minute
            minutes = max(1, rt.minutes)
            minute_text = "minute" if minutes == 1 else "minutes"

            # 3. Create the replacement string
            replacement = f'<span class="article-meta-pill">Reading time: {minutes} {minute_text}</span>'
            
            # Check if the file actually contains the target span before writing
            if pattern.search(html_content):
                updated_html = pattern.sub(replacement, html_content)

                # 4. Write the updated HTML back to the file
                with open(file_path, 'w', encoding='utf-8') as file:
                    file.write(updated_html)

                print(f"Updated {file_path.name}: {minutes} {minute_text}")
            else:
                print(f"Skipped {file_path.name}: Reading time span not found.")

        except Exception as e:
            print(f"Error processing {file_path.name}: {e}")

if __name__ == "__main__":
    update_all_reading_times()