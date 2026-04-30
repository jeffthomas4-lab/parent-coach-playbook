"""
Build "The Practice Plan Template" lead magnet PDF.

Output: public/the-practice-plan-template.pdf

Four pages:
  1. Cover + how to use this
  2. The blank weekly practice plan template (4 sessions)
  3. A filled example for U10 baseball
  4. Drill ideas by age band
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    Frame, PageTemplate, BaseDocTemplate, KeepTogether,
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER

INK    = HexColor('#2D2520')
INK_SOFT = HexColor('#5F5448')
PAPER  = HexColor('#FAF6EE')
PAPER_WARM = HexColor('#F2EAD9')
RUST   = HexColor('#C5713D')
TURF   = HexColor('#8FA68C')
BONE   = HexColor('#DDD2BD')
TROPHY = HexColor('#D4AB6A')

FONT_DIR = "/tmp/pcp-fonts"
def register_fonts():
    pdfmetrics.registerFont(TTFont('Fraunces',          f"{FONT_DIR}/Fraunces-Regular.ttf"))
    pdfmetrics.registerFont(TTFont('Fraunces-Bold',     f"{FONT_DIR}/Fraunces-SemiBold.ttf"))
    pdfmetrics.registerFont(TTFont('Fraunces-Italic',   f"{FONT_DIR}/Fraunces-Italic.ttf"))
    pdfmetrics.registerFont(TTFont('Inter',             f"{FONT_DIR}/Inter-Regular.ttf"))
    pdfmetrics.registerFont(TTFont('Inter-Bold',        f"{FONT_DIR}/Inter-SemiBold.ttf"))
    pdfmetrics.registerFont(TTFont('Mono',              f"{FONT_DIR}/JetBrainsMono-Regular.ttf"))
    pdfmetrics.registerFont(TTFont('Mono-Medium',       f"{FONT_DIR}/JetBrainsMono-Medium.ttf"))
    from reportlab.pdfbase.pdfmetrics import registerFontFamily
    registerFontFamily('Fraunces', normal='Fraunces', bold='Fraunces-Bold',
                       italic='Fraunces-Italic', boldItalic='Fraunces-Italic')

register_fonts()

display_xl = ParagraphStyle('display_xl', fontName='Fraunces-Bold', fontSize=42,
    leading=44, textColor=INK, spaceAfter=14, alignment=TA_LEFT)
display_lg = ParagraphStyle('display_lg', fontName='Fraunces-Bold', fontSize=28,
    leading=32, textColor=INK, spaceAfter=12)
display_md = ParagraphStyle('display_md', fontName='Fraunces-Bold', fontSize=18,
    leading=22, textColor=INK, spaceAfter=10)
body = ParagraphStyle('body', fontName='Fraunces', fontSize=11, leading=17,
    textColor=INK_SOFT, spaceAfter=10)
body_lg = ParagraphStyle('body_lg', fontName='Fraunces', fontSize=12, leading=18,
    textColor=INK_SOFT, spaceAfter=10)
eyebrow = ParagraphStyle('eyebrow', fontName='Mono-Medium', fontSize=8,
    leading=12, textColor=RUST, spaceAfter=8)
mini = ParagraphStyle('mini', fontName='Fraunces', fontSize=10, leading=14,
    textColor=INK_SOFT, spaceAfter=4)
mini_label = ParagraphStyle('mini_label', fontName='Mono-Medium', fontSize=8,
    leading=10, textColor=INK, spaceAfter=2)
cover_eyebrow = ParagraphStyle('cover_eyebrow', fontName='Mono-Medium', fontSize=9,
    textColor=TROPHY, spaceAfter=18)
cover_title = ParagraphStyle('cover_title', fontName='Fraunces-Bold', fontSize=52,
    leading=54, textColor=PAPER, spaceAfter=20, alignment=TA_LEFT)
cover_dek = ParagraphStyle('cover_dek', fontName='Fraunces', fontSize=15,
    leading=22, textColor=PAPER_WARM, spaceAfter=10)
cover_meta = ParagraphStyle('cover_meta', fontName='Mono', fontSize=8,
    textColor=PAPER_WARM, alignment=TA_LEFT)

PAGE_W, PAGE_H = letter
MARGIN = 0.65 * inch


def cover_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(INK)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    canvas.setStrokeColor(BONE)
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN, 1.0 * inch, PAGE_W - MARGIN, 1.0 * inch)
    canvas.setFillColor(PAPER_WARM)
    canvas.setFont('Mono-Medium', 8)
    canvas.drawString(MARGIN, 0.75 * inch, 'PARENTCOACHPLAYBOOK.COM  /  WEEKLY READS')
    canvas.drawRightString(PAGE_W - MARGIN, 0.75 * inch, 'FREE  ·  4 PAGES  ·  v1')
    canvas.restoreState()


def interior_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    canvas.setStrokeColor(INK)
    canvas.setLineWidth(0.75)
    canvas.line(MARGIN, PAGE_H - 0.5 * inch, PAGE_W - MARGIN, PAGE_H - 0.5 * inch)
    canvas.setFillColor(INK)
    canvas.setFont('Mono-Medium', 7.5)
    canvas.drawString(MARGIN, PAGE_H - 0.7 * inch, 'THE PRACTICE PLAN TEMPLATE')
    canvas.drawRightString(PAGE_W - MARGIN, PAGE_H - 0.7 * inch, 'PARENTCOACHPLAYBOOK.COM')
    canvas.setStrokeColor(BONE)
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN, 0.7 * inch, PAGE_W - MARGIN, 0.7 * inch)
    canvas.setFillColor(INK_SOFT)
    canvas.setFont('Mono', 7)
    canvas.drawString(MARGIN, 0.5 * inch, 'THE PARENT-COACH PLAYBOOK')
    page_num = canvas.getPageNumber()
    canvas.drawRightString(PAGE_W - MARGIN, 0.5 * inch, f'PAGE {page_num} / 4')
    canvas.restoreState()


def practice_plan_block(date_label, focus_label):
    """One practice's worth of fillable structure as a Table."""
    rows = [
        [Paragraph(f'<b>Date / time</b>', mini_label), Paragraph(date_label, mini)],
        [Paragraph(f'<b>Focus of the day</b>', mini_label), Paragraph(focus_label, mini)],
        [Paragraph(f'<b>Drill list</b>', mini_label), Paragraph(
            '5 min: ____________________<br/>'
            '10 min: ___________________<br/>'
            '15 min: ___________________<br/>'
            '20 min: ___________________<br/>'
            '5 min: huddle &amp; snack',
            mini)],
        [Paragraph(f'<b>Job for parents</b>', mini_label), Paragraph(
            '___________________________________________',
            mini)],
    ]
    t = Table(rows, colWidths=[1.4 * inch, 5.4 * inch])
    t.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.5, BONE),
        ('INNERGRID', (0, 0), (-1, -1), 0.25, BONE),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('BACKGROUND', (0, 0), (0, -1), PAPER_WARM),
    ]))
    return t


def filled_practice_plan_block():
    rows = [
        [Paragraph('<b>Date / time</b>', mini_label),
         Paragraph('Tuesday, April 16  ·  5:30–6:30 PM  ·  Field 3', mini)],
        [Paragraph('<b>Focus of the day</b>', mini_label),
         Paragraph('Cutoff throws and live BP rotation.', mini)],
        [Paragraph('<b>Drill list</b>', mini_label),
         Paragraph(
            '5 min: stretching + dynamic warmup<br/>'
            '10 min: throwing program (partners, 30 ft)<br/>'
            '15 min: cutoff drill at second base (Coach Dan leads)<br/>'
            '20 min: live BP rotation (3 hitters, 4 fielders, rotate every 4 swings)<br/>'
            '5 min: huddle, snack, reminders for Saturday',
            mini)],
        [Paragraph('<b>Job for parents</b>', mini_label),
         Paragraph(
            'If you can stay, parents on the third-base line for help during BP rotation are great. Two hands on a wiffle bat each.',
            mini)],
    ]
    t = Table(rows, colWidths=[1.4 * inch, 5.4 * inch])
    t.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.5, BONE),
        ('INNERGRID', (0, 0), (-1, -1), 0.25, BONE),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('BACKGROUND', (0, 0), (0, -1), PAPER_WARM),
    ]))
    return t


def build_story():
    s = []

    # Page 1: Cover
    s.append(Spacer(1, 1.4 * inch))
    s.append(Paragraph('THE PARENT-COACH PLAYBOOK', cover_eyebrow))
    s.append(Paragraph('The Practice Plan <i>Template</i>.', cover_title))
    s.append(Spacer(1, 0.15 * inch))
    s.append(Paragraph('A printable practice plan parents can read. Blank template plus a filled example.', cover_dek))
    s.append(Spacer(1, 0.4 * inch))
    s.append(Paragraph('A FREE FIELD GUIDE  /  v1', cover_meta))
    s.append(PageBreak())

    # Page 2: How to use + blank template
    s.append(Paragraph('01 / HOW TO USE THIS', eyebrow))
    s.append(Paragraph('Don\'t wing it. <i>Don\'t hide it.</i>', display_lg))
    s.append(Paragraph(
        "The single highest-leverage thing a youth coach can do is share a written practice plan with the parents. "
        "Open the template. Fill in the four lines for each session. Share view-only with the parent email list 24 hours before practice.",
        body))
    s.append(Paragraph(
        "It takes about 10 minutes a week to do well. The parents who can see the plan stop guessing.",
        body))
    s.append(Spacer(1, 8))
    s.append(Paragraph('A blank week (print and use)', display_md))
    s.append(practice_plan_block('______________________________________', '______________________________________'))
    s.append(Spacer(1, 6))
    s.append(practice_plan_block('______________________________________', '______________________________________'))
    s.append(PageBreak())

    # Page 3: A filled example
    s.append(Paragraph('02 / A FILLED EXAMPLE', eyebrow))
    s.append(Paragraph('U10 baseball, <i>week 4 of the season</i>.', display_lg))
    s.append(Paragraph(
        "What a real practice plan looks like. Two practices that week, both 60 minutes, both written out the night before.",
        body))
    s.append(Spacer(1, 8))
    s.append(filled_practice_plan_block())
    s.append(Spacer(1, 8))
    s.append(Paragraph(
        "Notice what's not in there. A long philosophical preamble. A list of life lessons. A reference to character development. The plan is what we are doing for 60 minutes. The character development happens in the drills, not in the bullet points.",
        body))
    s.append(Spacer(1, 4))
    s.append(Paragraph(
        "<i>One sentence on the focus. Five lines on the drills. One line on the parent ask. Done.</i>",
        ParagraphStyle('quote', fontName='Fraunces-Italic', fontSize=13, leading=18, textColor=INK,
                       spaceAfter=10)))
    s.append(PageBreak())

    # Page 4: Drill ideas by age + closing
    s.append(Paragraph('03 / DRILL IDEAS BY AGE', eyebrow))
    s.append(Paragraph('Where to <i>start each band</i>.', display_lg))
    s.append(Paragraph(
        "A starter list of drills by age. Steal what fits, ignore what doesn't.",
        body))
    s.append(Spacer(1, 6))

    drill_data = [
        ['AGE', 'WARMUP', 'SKILL', 'GAME ELEMENT'],
        ['5–7', 'Animal walks (3 min)', 'Throwing partners (5 min)', 'Run the bases drill (relay style)'],
        ['8–10', 'Dynamic stretching', 'Throwing program', 'Live BP rotation (3 hitters)'],
        ['11–12', 'Dynamic + agility ladder', 'Cutoff and relay drill', 'Situational scrimmage (1 inning)'],
        ['13+', 'Full warmup, longer arc', 'Position-specific work', 'Live game scenarios (2 innings)'],
    ]
    drill_table = Table(drill_data, colWidths=[0.7 * inch, 1.7 * inch, 1.9 * inch, 2.5 * inch])
    drill_table.setStyle(TableStyle([
        ('FONT', (0, 0), (-1, 0), 'Mono-Medium', 8),
        ('FONT', (0, 1), (-1, -1), 'Fraunces', 10),
        ('TEXTCOLOR', (0, 0), (-1, 0), RUST),
        ('TEXTCOLOR', (0, 1), (-1, -1), INK),
        ('BACKGROUND', (0, 0), (-1, 0), PAPER_WARM),
        ('BACKGROUND', (0, 1), (-1, -1), PAPER),
        ('LINEBELOW', (0, 0), (-1, 0), 0.5, INK),
        ('LINEBELOW', (0, 1), (-1, -1), 0.25, BONE),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    s.append(drill_table)
    s.append(Spacer(1, 14))

    s.append(Paragraph('04 / KEEP READING', eyebrow))
    s.append(Paragraph('More tools, every week.', display_md))
    s.append(Paragraph(
        "Subscribe to the Parent-Coach Playbook newsletter and we'll send you new templates and short reads as we publish them. "
        "Maren writes most posts. Dan writes the coaching-your-own-kid stuff. Jeff writes the longer cornerstone pieces.",
        body))
    s.append(Spacer(1, 6))
    s.append(Paragraph('PARENTCOACHPLAYBOOK.COM', ParagraphStyle('cta_url',
        fontName='Mono-Medium', fontSize=12, textColor=INK, spaceAfter=4)))
    s.append(Paragraph('Subscribe / read the archive / get the next playbook',
        ParagraphStyle('cta_sub', fontName='Mono', fontSize=8, textColor=INK_SOFT,
            spaceAfter=18)))

    imprint = Table([
        [Paragraph('THE PARENT-COACH PLAYBOOK', ParagraphStyle('im1',
            fontName='Mono-Medium', fontSize=8, textColor=INK))],
        [Paragraph('A small site for parents who coach, drive, snack-pack, and supervise the group chat. ' +
                   'Edited by Jeff Thomas. Written by Maren Bell, Dan Kowalski, and Jeff. ' +
                   'Maren and Dan are composite voices. Read about them at parentcoachplaybook.com/contributors. ' +
                   '© 2026. All rights reserved.',
            ParagraphStyle('im2', fontName='Inter', fontSize=8, leading=12,
                textColor=INK_SOFT))],
    ], colWidths=[6.8 * inch])
    imprint.setStyle(TableStyle([
        ('LINEABOVE', (0, 0), (-1, 0), 0.75, INK),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ]))
    s.append(imprint)

    return s


class PCPDoc(BaseDocTemplate):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        cover_frame = Frame(MARGIN, MARGIN, PAGE_W - 2 * MARGIN, PAGE_H - 2 * MARGIN, id='cover',
                           leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
        body_frame = Frame(MARGIN, MARGIN + 0.3 * inch, PAGE_W - 2 * MARGIN, PAGE_H - 2 * MARGIN - 0.6 * inch,
                          leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0, id='body')
        self.addPageTemplates([
            PageTemplate(id='Cover', frames=[cover_frame], onPage=cover_page),
            PageTemplate(id='Interior', frames=[body_frame], onPage=interior_page),
        ])

    def afterFlowable(self, flowable):
        if hasattr(flowable, 'isPageBreak') and self.page == 1:
            self._handle_nextPageTemplate('Interior')


def main():
    out_path = "/sessions/happy-tender-gates/mnt/Claude Cowork/OUTPUTS/parent-coach-playbook/public/the-practice-plan-template.pdf"
    doc = PCPDoc(out_path, pagesize=letter,
                 leftMargin=MARGIN, rightMargin=MARGIN,
                 topMargin=MARGIN, bottomMargin=MARGIN,
                 title='The Practice Plan Template',
                 author='PCP Editors',
                 subject='A free practice plan template for youth coaches',
                 creator='The Parent-Coach Playbook',
                 keywords='youth sports, practice plan, coach, template')
    doc.build(build_story())
    print(f"wrote: {out_path}")
    print(f"size: {os.path.getsize(out_path)} bytes")


if __name__ == '__main__':
    main()
