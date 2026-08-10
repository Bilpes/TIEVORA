#!/usr/bin/env python3
import markdown
from fpdf import FPDF
import pathlib

md_path = pathlib.Path("docs/TIEVORA_Understanding_Document.md")
pdf_path = pathlib.Path("docs/TIEVORA_Understanding_Document.pdf")

md_text = md_path.read_text(encoding="utf-8")

# Remove 4-byte emojis that DejaVu/fpdf cannot render (🔇, 🎯, etc.) — keep simple bullets •
import re as _re2
md_text = _re2.sub(r'[\U00010000-\U0010FFFF]', '', md_text)
md_text = md_text.replace('🔇', '[No Voice]').replace('🎯', '[Hunter]').replace('🔔', '[Bell]')
# Replace ellipsis and other courier-unfriendly chars (fpdf courier is latin-1 only)
md_text = md_text.replace('…', '...').replace('“', '"').replace('”', '"').replace('‘', "'").replace('’', "'")

# Preprocess: fpdf courier is latin-1 only — remove all backticks so no <code> tags (which use courier) are generated
# Also replace arrows and other unicode that courier can't handle
md_text = md_text.replace('`', '').replace('→', '->').replace('—', '-').replace('–', '-')
lines = md_text.split("\n")
cleaned = []
for line in lines:
    # keep table handling for safety
    if "|" in line and "`" in line:
        line = line.replace("`", "")
    cleaned.append(line)
md_text = "\n".join(cleaned)

# Convert markdown to HTML with tables and fenced code (no toc — avoids named destination error)
html = markdown.markdown(md_text, extensions=["tables", "fenced_code", "sane_lists"])
# Also strip 4-byte emojis from generated HTML (in case any survived) and fix ellipsis for courier
html = _re2.sub(r'[\U00010000-\U0010FFFF]', '', html)
html = html.replace('…', '...').replace('—', '-').replace('–', '-')
# Remove internal anchor links (href="#...") that fpdf can't resolve — keep text only, preserve external http links
html = _re2.sub(r'<a[^>]*href="#[^"]*"[^>]*>(.*?)</a>', r'\1', html, flags=_re2.DOTALL)
# fpdf html does NOT support nested tags inside <td>/<th> — strip them to plain text
import re
def _clean_cell(m):
    tag = m.group(1)  # td or th
    attrs = m.group(2) or ""
    inner = m.group(3)
    inner = re.sub(r'<[^>]+>', '', inner)
    inner = inner.strip()
    return f'<{tag}{attrs}>{inner}</{tag}>'
html = re.sub(r'<(td|th)\b([^>]*)>(.*?)</\1>', _clean_cell, html, flags=re.DOTALL)

# Wrap with styled HTML
styled_html = f"""
<style>
  @page {{ margin: 20mm 18mm 20mm 18mm; }}
  body {{ font-family: Helvetica, Arial, sans-serif; font-size: 11px; line-height: 1.55; color: #0a0f1e; }}
  h1 {{ color: #0a0f1e; background: #d4a843; padding: 10px 14px; border-radius: 6px; font-size: 22px; margin-top: 18px; margin-bottom: 8px; }}
  h2 {{ color: #162447; border-bottom: 2px solid #d4a843; padding-bottom: 6px; font-size: 16px; margin-top: 22px; }}
  h3 {{ color: #162447; font-size: 13px; margin-top: 16px; }}
  h4 {{ color: #1f2a44; font-size: 11px; margin-top: 12px; }}
  table {{ border-collapse: collapse; width: 100%; margin: 10px 0; font-size: 9.5px; }}
  th {{ background: #0a0f1e; color: white; padding: 6px 8px; text-align: left; }}
  td {{ border: 1px solid #d1d5db; padding: 6px 8px; vertical-align: top; }}
  tr:nth-child(even) td {{ background: #f8fafc; }}
  code {{ background: #0f1a33; color: #3dd5d6; padding: 1px 4px; border-radius: 3px; font-size: 9.5px; font-family: DejaVu; }}
  pre {{ background: #0a0f1e; color: #e2e8f0; padding: 10px; border-radius: 6px; overflow-x: auto; font-size: 8.5px; line-height: 1.4; font-family: DejaVu; }}
  pre code {{ background: transparent; color: inherit; padding: 0; font-family: DejaVu; }}
  blockquote {{ border-left: 3px solid #d4a843; margin: 10px 0; padding: 6px 12px; background: #fef9e7; font-style: italic; }}
  a {{ color: #7c5cfc; text-decoration: none; }}
  ul, ol {{ margin: 6px 0; padding-left: 20px; }}
  li {{ margin: 3px 0; }}
  hr {{ border: none; border-top: 1px solid #e2e8f0; margin: 16px 0; }}
</style>
<div style="text-align: center; padding: 18px 0 10px 0; border-bottom: 3px solid #d4a843; margin-bottom: 12px;">
  <div style="background: #0a0f1e; color: #d4a843; display: inline-block; padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: bold; letter-spacing: 1px;">TIEVORA — CEO COMMAND CENTER</div>
  <div style="color: #1f2a44; font-size: 10px; margin-top: 6px; letter-spacing: 1.5px;">UNDERSTANDING DOCUMENT FOR CEO & MANAGERS • 10 AUG 2026 • v1.0</div>
  <div style="color: #6b7280; font-size: 8.5px; margin-top: 4px;">13 Agents • 50+ Tietoevry Offices • Hunter Sales • RAG + Hybrid &lt;200 • Voice Briefing • Production Ready • https://github.com/Bilpes/TIEVORA</div>
</div>
{html}
<div style="text-align: center; margin-top: 24px; padding-top: 12px; border-top: 1px solid #e2e8f0; color: #6b7280; font-size: 8.5px;">
  TIEVORA © 2026 • Built for Tietoevry — Dummy fast, Live ready • Next.js 14 • Postgres+pgvector • Leaflet • Web Speech • Hybrid &lt;200
</div>
"""

class PDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font("DejaVu", "B", 7)
            self.set_text_color(120, 120, 120)
            self.cell(0, 6, "TIEVORA \u2014 CEO Command Center  \u2022  Understanding Document  \u2022  Confidential", align="C")
            self.ln(7)
            self.set_draw_color(212, 168, 67)
            self.line(10, 13, 200, 13)
    def footer(self):
        self.set_y(-15)
        self.set_font("DejaVu", "", 7)
        self.set_text_color(150, 150, 150)
        self.cell(0, 10, f"Page {self.page_no()}  |  TIEVORA v1.0  |  10 Aug 2026  |  github.com/Bilpes/TIEVORA", align="C")

pdf = PDF(format="A4")
pdf.set_auto_page_break(auto=True, margin=20)
# Unicode font for em-dash, bullets, etc.
pdf.add_font("DejaVu", "", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", uni=True)
pdf.add_font("DejaVu", "B", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", uni=True)
pdf.add_font("DejaVu", "I", "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf", uni=True)  # fallback italic
pdf.set_font("DejaVu", "", 11)
pdf.add_page()
# fpdf2 HTML rendering — force DejaVu via CSS
styled_html = styled_html.replace("font-family: Helvetica", "font-family: DejaVu")
pdf.write_html(styled_html)

pdf.output(str(pdf_path))
print(f"PDF generated: {pdf_path} ({pdf_path.stat().st_size} bytes, {pdf.pages_count} pages)")
