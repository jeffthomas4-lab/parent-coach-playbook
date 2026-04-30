"""
Build "The Drive Home Playbook" — the lead magnet PDF.

Run:
    python scripts/build-playbook-pdf.py

Output:
    public/the-drive-home-playbook.pdf

Wire it into Kit's automation as the file delivered to new subscribers.
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

# ---- Brand tokens (warm editorial palette) ----
INK    = HexColor('#2D2520')   # warm dark brown
INK_SOFT = HexColor('#5F5448') # walnut for body
PAPER  = HexColor('#FAF6EE')   # cream
PAPER_WARM = HexColor('#F2EAD9')
RUST   = HexColor('#C5713D')   # terracotta
TURF   = HexColor('#8FA68C')   # sage
BONE   = HexColor('#DDD2BD')   # linen
TROPHY = HexColor('#D4AB6A')   # honey

# ---- Fonts ----
FONT_DIR = "/tmp/pcp-fonts"  # change if running locally with system fonts
def register_fonts():
    pdfmetrics.registerFont(TTFont('Fraunces',          f"{FONT_DIR}/Fraunces-Regular.ttf"))
    pdfmetrics.registerFont(TTFont('Fraunces-Bold',     f"{FONT_DIR}/Fraunces-SemiBold.ttf"))
    pdfmetrics.registerFont(TTFont('Fraunces-Italic',   f"{FONT_DIR}/Fraunces-Italic.ttf"))
    pdfmetrics.registerFont(TTFont('Inter',             f"{FONT_DIR}/Inter-Regular.ttf"))
    pdfmetrics.registerFont(TTFont('Inter-Bold',        f"{FONT_DIR}/Inter-SemiBold.ttf"))
    pdfmetrics.registerFont(TTFont('Mono',              f"{FONT_DIR}/JetBrainsMono-Regular.ttf"))
    pdfmetrics.registerFont(TTFont('Mono-Medium',       f"{FONT_DIR}/JetBrainsMono-Medium.ttf"))
    # Register font family for <i> and <b> markup support
    from reportlab.pdfbase.pdfmetrics import registerFontFamily
    registerFontFamily('Fraunces', normal='Fraunces', bold='Fraunces-Bold',
                       italic='Fraunces-Italic', boldItalic='Fraunces-Italic')

register_fonts()

# ---- Styles ----
display_xl = ParagraphStyle('display_xl', fontName='Fraunces-Bold', fontSize=44,
    leading=46, textColor=INK, spaceAfter=14, alignment=TA_LEFT)
display_lg = ParagraphStyle('display_lg', fontName='Fraunces-Bold', fontSize=32,
    leading=36, textColor=INK, spaceAfter=12)
display_md = ParagraphStyle('display_md', fontName='Fraunces-Bold', fontSize=24,
    leading=28, textColor=INK, spaceAfter=10)
display_sm = ParagraphStyle('display_sm', fontName='Fraunces-Bold', fontSize=18,
    leading=22, textColor=INK, spaceAfter=8)

dek = ParagraphStyle('dek', fontName='Fraunces', fontSize=14, leading=20,
    textColor=INK_SOFT, spaceAfter=14)

body = ParagraphStyle('body', fontName='Fraunces', fontSize=11, leading=17,
    textColor=INK_SOFT, spaceAfter=10)

body_lg = ParagraphStyle('body_lg', fontName='Fraunces', fontSize=12, leading=18,
    textColor=INK_SOFT, spaceAfter=10)

eyebrow = ParagraphStyle('eyebrow', fontName='Mono-Medium', fontSize=8,
    leading=12, textColor=RUST, spaceAfter=8)

eyebrow_white = ParagraphStyle('eyebrow_white', fontName='Mono-Medium', fontSize=8,
    leading=12, textColor=TROPHY, spaceAfter=8)

label = ParagraphStyle('label', fontName='Mono-Medium', fontSize=8,
    leading=12, textColor=INK_SOFT, spaceAfter=4)

mono_label_rust = ParagraphStyle('mono_label_rust', fontName='Mono-Medium', fontSize=9,
    leading=12, textColor=RUST, spaceAfter=2)

quote = ParagraphStyle('quote', fontName='Fraunces-Italic', fontSize=16,
    leading=22, textColor=INK, spaceAfter=14, alignment=TA_LEFT)

footer = ParagraphStyle('footer', fontName='Mono', fontSize=7,
    textColor=INK_SOFT, alignment=TA_LEFT)

# Cover styles (white text on ink background)
cover_eyebrow = ParagraphStyle('cover_eyebrow', fontName='Mono-Medium', fontSize=9,
    textColor=TROPHY, spaceAfter=18)
cover_title = ParagraphStyle('cover_title', fontName='Fraunces-Bold', fontSize=58,
    leading=60, textColor=PAPER, spaceAfter=20, alignment=TA_LEFT)
cover_dek = ParagraphStyle('cover_dek', fontName='Fraunces', fontSize=16,
    leading=22, textColor=PAPER_WARM, spaceAfter=10)
cover_meta = ParagraphStyle('cover_meta', fontName='Mono', fontSize=8,
    textColor=PAPER_WARM, alignment=TA_LEFT)


# ---- Page templates ----
PAGE_W, PAGE_H = letter  # 612 x 792
MARGIN = 0.75 * inch


def cover_page(canvas, doc):
    """Full-bleed dark cover with steering wheel mark."""
    canvas.saveState()
    # Fill the whole page with ink
    canvas.setFillColor(INK)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    # Steering wheel mark in upper right
    cx, cy, r = PAGE_W - 1.4 * inch, PAGE_H - 1.4 * inch, 0.55 * inch
    # Optional dashed road ring
    canvas.setStrokeColor(RUST)
    canvas.setLineWidth(0.7)
    canvas.setDash(2, 3)
    canvas.circle(cx, cy, r + 0.18 * inch, stroke=1, fill=0)
    canvas.setDash()  # reset
    # Wheel disc
    canvas.setFillColor(PAPER)
    canvas.circle(cx, cy, r, stroke=0, fill=1)
    # Inner rim
    canvas.setStrokeColor(INK)
    canvas.setLineWidth(1.5)
    canvas.circle(cx, cy, r - 0.06 * inch, stroke=1, fill=0)
    # Three spokes (top, left, right)
    canvas.setLineWidth(2)
    canvas.line(cx, cy + 0.08 * inch, cx, cy + r - 0.08 * inch)
    canvas.line(cx - 0.08 * inch, cy, cx - r + 0.08 * inch, cy)
    canvas.line(cx + 0.08 * inch, cy, cx + r - 0.08 * inch, cy)
    # Hub
    canvas.setFillColor(INK)
    canvas.circle(cx, cy, 0.06 * inch, stroke=0, fill=1)

    # Footer rule and imprint
    canvas.setStrokeColor(BONE)
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN, 1.0 * inch, PAGE_W - MARGIN, 1.0 * inch)
    canvas.setFillColor(PAPER_WARM)
    canvas.setFont('Mono-Medium', 8)
    canvas.drawString(MARGIN, 0.75 * inch, 'PARENTCOACHPLAYBOOK.COM  /  WEEKLY READS')
    canvas.drawRightString(PAGE_W - MARGIN, 0.75 * inch, 'FREE  ·  12 PAGES  ·  v1')
    canvas.restoreState()


def interior_page(canvas, doc):
    """Standard editorial page background."""
    canvas.saveState()
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    # Top rule + running header
    canvas.setStrokeColor(INK)
    canvas.setLineWidth(0.75)
    canvas.line(MARGIN, PAGE_H - 0.5 * inch, PAGE_W - MARGIN, PAGE_H - 0.5 * inch)
    canvas.setFillColor(INK)
    canvas.setFont('Mono-Medium', 7.5)
    canvas.drawString(MARGIN, PAGE_H - 0.7 * inch, 'THE DRIVE HOME PLAYBOOK')
    canvas.drawRightString(PAGE_W - MARGIN, PAGE_H - 0.7 * inch, 'PARENTCOACHPLAYBOOK.COM')
    # Bottom rule + page number
    canvas.setStrokeColor(BONE)
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN, 0.7 * inch, PAGE_W - MARGIN, 0.7 * inch)
    canvas.setFillColor(INK_SOFT)
    canvas.setFont('Mono', 7)
    canvas.drawString(MARGIN, 0.5 * inch, 'THE PARENT-COACH PLAYBOOK')
    page_num = canvas.getPageNumber()
    canvas.drawRightString(PAGE_W - MARGIN, 0.5 * inch, f'PAGE {page_num} / 12')
    canvas.restoreState()


def script_card(sport, age, opening_line, why):
    """A boxed script entry: SPORT/AGE label, italic opening line in rust, why-it-works note."""
    inner = []
    inner.append(Paragraph(f"{sport.upper()}  /  {age}", mono_label_rust))
    inner.append(Spacer(1, 4))
    inner.append(Paragraph(f'<i>"{opening_line}"</i>', ParagraphStyle(
        'script_line', fontName='Fraunces-Italic', fontSize=15, leading=20,
        textColor=INK, spaceAfter=8)))
    inner.append(Paragraph(why, ParagraphStyle(
        'why', fontName='Fraunces', fontSize=10.5, leading=15,
        textColor=INK_SOFT, spaceAfter=0)))
    t = Table([[inner]], colWidths=[6.5 * inch])
    t.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.5, BONE),
        ('BACKGROUND', (0, 0), (-1, -1), PAPER_WARM),
        ('LEFTPADDING', (0, 0), (-1, -1), 16),
        ('RIGHTPADDING', (0, 0), (-1, -1), 16),
        ('TOPPADDING', (0, 0), (-1, -1), 14),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 14),
    ]))
    return KeepTogether([t, Spacer(1, 12)])


# ---- Story ----
def build_story():
    s = []

    # Page 1: Cover (rendered by cover_page; we just need a placeholder flowable to fire the template)
    s.append(Spacer(1, 1.6 * inch))
    s.append(Paragraph('THE PARENT-COACH PLAYBOOK', cover_eyebrow))
    # NOTE: cover renders on top of dark background — we'll position via the template
    s.append(Paragraph('The Drive Home <i>Playbook</i>.', cover_title))
    s.append(Spacer(1, 0.15 * inch))
    s.append(Paragraph('The exact words to say in the first 90 seconds after a youth game. By sport. By age.', cover_dek))
    s.append(Spacer(1, 0.4 * inch))
    s.append(Paragraph('A FREE FIELD GUIDE  /  v1', cover_meta))
    s.append(PageBreak())

    # Page 2: Intro / The 90-second rule
    s.append(Paragraph('01 / THE RULE', eyebrow))
    s.append(Paragraph('What you say in the <i>first 90 seconds</i>.', display_lg))
    s.append(Spacer(1, 6))
    s.append(Paragraph(
        "The first 90 seconds after a youth game decide what the next week feels like in your house. "
        "Coaches know this. Most parents do not, because the window closes before they have finished gathering the cooler and the sweatshirt.",
        body_lg))
    s.append(Paragraph(
        "Watch any 9-year-old after a loss. Their face tells you what they need. Quiet. Water. A car that smells like home. They do not need a recap of the second inning.",
        body_lg))
    s.append(Paragraph(
        "But the recap is what most parents lead with. They mean well. They want to teach. The kid hears blame.",
        body_lg))
    s.append(Spacer(1, 6))
    s.append(Paragraph('What the window actually does', display_md))
    s.append(Paragraph(
        "In those first 90 seconds, your kid is asking one quiet question: <i>is this still a place I want to be?</i> Not the team. The car. The relationship. You.",
        body_lg))
    s.append(Paragraph(
        "The answer they get from your face and your first sentence sets the temperature for every conversation about the sport for the next seven days. "
        "If the answer is no, they spend the week bracing for Saturday instead of looking forward to it.",
        body_lg))
    s.append(PageBreak())

    # Page 3: How to use this guide
    s.append(Paragraph('02 / HOW TO USE THIS', eyebrow))
    s.append(Paragraph('Eight openings. <i>One pocket card.</i>', display_lg))
    s.append(Paragraph(
        "The next eight pages give you a scripted opening line for the first 90 seconds after a game, by sport. "
        "Each one is calibrated for kids roughly age 8 to 12. They work earlier and later, with adjustments.",
        body_lg))
    s.append(Paragraph(
        "Pick the line that fits the sport your kid plays. Memorize it. Say it word for word the first three or four times so the muscle memory builds. "
        "After that, the pattern becomes yours.",
        body_lg))
    s.append(Spacer(1, 6))
    s.append(Paragraph(
        '<i>"Specificity beats praise. Presence beats evaluation."</i>',
        ParagraphStyle('cq', fontName='Fraunces-Italic', fontSize=18, leading=24,
                       textColor=INK, spaceBefore=10, spaceAfter=14, alignment=TA_LEFT)))
    s.append(Paragraph('The pattern under the lines', display_md))
    s.append(Paragraph(
        "Every script does three things in three sentences or less. Name a specific moment they had agency in. "
        "Skip the score. Hand them the next thing to look forward to. "
        "Notice what is not in there. Evaluation. Praise. Comparison. Strategy. Save those for later. Most of them, save forever.",
        body_lg))
    s.append(PageBreak())

    # Pages 4-7: Sport scripts (2 sports per page)
    sports_data = [
        ("Baseball", "8–10",
         "Glad you got to bat in the fourth.",
         "You are picking a moment they had agency in (an at-bat) instead of a moment that decided the score. Works whether they got a hit or struck out."),
        ("Softball", "8–10",
         "Nice read on the ball off the bat in the third.",
         "Defense gets noticed less than offense. Notice it. The phrase 'read on the ball' praises the cognitive part of fielding, not the result."),
        ("Soccer", "any",
         "I liked the way you tracked back on the second goal.",
         "Tracking back is unrewarded by the scoreboard. Saying you saw it tells them you understand the game beyond who scored."),
        ("Basketball", "8–10",
         "Saw you call out the screen on defense.",
         "Communication is the highest-leverage habit at this age and the one parents almost never notice. Reward it."),
        ("Football", "11–12",
         "You got off the ball fast on the third snap.",
         "First-step quickness is something they can control on every play. Praise effort that is repeatable, not outcomes that are not."),
        ("Hockey", "8–10",
         "Good shift change in the second period.",
         "Shift discipline is a learned habit. Most parents only watch for goals. This signals you are paying attention to the boring craft."),
        ("Lacrosse", "11–12",
         "I liked your stick position on ground balls.",
         "A specific technical detail you can only see if you were actually watching. Cuts through the noise of the score."),
        ("Volleyball", "11–12",
         "You called for the second ball every time.",
         "Verbal communication is the sport's hardest skill at the youth level. Naming it tells them you noticed something invisible to most parents."),
    ]

    s.append(Paragraph('03 / THE EIGHT OPENINGS', eyebrow))
    s.append(Paragraph('Say one of these. <i>Then stop talking.</i>', display_lg))
    s.append(Spacer(1, 8))
    for sport, age, line, why in sports_data[:4]:
        s.append(script_card(sport, age, line, why))
    s.append(PageBreak())

    s.append(Paragraph('03 / THE EIGHT OPENINGS  (CONTINUED)', eyebrow))
    s.append(Paragraph('Four more. <i>Same physics.</i>', display_lg))
    s.append(Spacer(1, 8))
    for sport, age, line, why in sports_data[4:]:
        s.append(script_card(sport, age, line, why))
    s.append(PageBreak())

    # The not-sports page
    s.append(Paragraph('04 / NOT JUST SPORTS', eyebrow))
    s.append(Paragraph('The same rule fits the <i>concert hall</i>.', display_lg))
    s.append(Paragraph(
        "If your kid is in theater, band, choir, dance, or any youth activity that has a drive there and a drive home, "
        "the framework still works. Pick the moment they had agency in. Skip the result. Reflect that you saw them.",
        body_lg))
    s.append(Spacer(1, 8))
    s.append(script_card("Theater", "Opening night",
        "I watched your face the whole second song.",
        "Performance is a vulnerability. Reflect that you saw them, not just the show. Avoid talking about the missed line they are already replaying."))
    s.append(script_card("Choir / Band", "Concert",
        "You looked at the conductor on the entrance to the second piece.",
        "Performance discipline is a real skill. Naming a specific technical moment beats general praise about how the whole thing sounded."))
    s.append(script_card("Dance", "Recital",
        "The third combination looked like you owned it.",
        "Lifts a moment of confidence rather than evaluating choreography you can't credibly judge."))
    s.append(PageBreak())

    # Page 9: Three things never to say
    s.append(Paragraph('05 / THREE THINGS NOT TO SAY', eyebrow))
    s.append(Paragraph('What to <i>never</i> lead with.', display_lg))

    dont_blocks = [
        ("Don't ask about the score first.",
         "They lived the score. They do not need it confirmed. If you ask, you signal that the score is the part of the day that mattered. It is not the part of the day that mattered."),
        ("Don't ask why the coach made a decision.",
         "You weren't on the bench. They were. The question forces them to defend a person they need to keep trusting for the next three months. Ask the coach later, not the kid right now."),
        ("Don't compare them to a sibling, a teammate, or to yourself at that age.",
         "None of those three people are in the car. The comparison turns the conversation into a courtroom. Your kid will spend the next week trying to be those other three people instead of being themselves."),
    ]
    for i, (rule, why) in enumerate(dont_blocks, start=1):
        s.append(Paragraph(f'NO. {i:02d}', ParagraphStyle(
            f'no_{i}', fontName='Mono-Medium', fontSize=9,
            textColor=RUST, spaceAfter=2)))
        s.append(Paragraph(rule, ParagraphStyle(
            f'rule_{i}', fontName='Fraunces-Bold', fontSize=18, leading=22,
            textColor=INK, spaceAfter=6)))
        s.append(Paragraph(why, body_lg))
        s.append(Spacer(1, 6))
    s.append(PageBreak())

    # Page 10: The longer arc
    s.append(Paragraph('06 / THE LONGER ARC', eyebrow))
    s.append(Paragraph('The teaching <i>happens later</i>.', display_lg))
    s.append(Paragraph(
        "The 90-second rule is not about being soft. It is about being useful. The teaching happens later, in shorter doses, when the kid is ready to ask. "
        "Saturday night is for bonding. Sunday morning is for breakdown.",
        body_lg))
    s.append(Paragraph(
        "By Sunday afternoon, if you handled the 90 seconds well, the kid will bring it up themselves. They will say something like, "
        "<i>I think I should have moved on the line drive sooner.</i> That sentence is what good coaching at home looks like. It is theirs, not yours.",
        body_lg))
    s.append(Paragraph(
        "You earned that sentence by saying almost nothing two hours after the game.",
        body_lg))
    s.append(Spacer(1, 12))
    s.append(Paragraph('What this is really about', display_md))
    s.append(Paragraph(
        "The drive home is not really about sports. It is about whether your kid believes that home is a safe place to fail. "
        "If the answer is yes, they take risks. They try the harder thing. They stay in the activity longer than they would have.",
        body_lg))
    s.append(Paragraph(
        "If the answer is no, they quit. Sometimes loudly. Usually quietly, by going through the motions until the season ends.",
        body_lg))
    s.append(PageBreak())

    # Page 11: Pocket card (printable)
    s.append(Paragraph('07 / THE POCKET CARD', eyebrow))
    s.append(Paragraph('Cut along the line. <i>Glove box.</i>', display_lg))
    s.append(Paragraph(
        "Print this page. Cut along the dashed line. Keep one half in the glove box, give the other half to your co-parent. "
        "Read it before every game for the first month. After that, the pattern is yours.",
        body))
    s.append(Spacer(1, 18))

    # Pocket card layout
    card_data = [[
        Paragraph('THE 90-SECOND CARD', ParagraphStyle('cc1', fontName='Mono-Medium',
            fontSize=8, textColor=RUST, spaceAfter=8)),
    ], [
        Paragraph('Three rules <i>for the car.</i>', ParagraphStyle('cc2',
            fontName='Fraunces-Bold', fontSize=20, leading=24, textColor=INK,
            spaceAfter=10)),
    ], [
        Paragraph('<b>1.</b> Lead with one specific moment they had agency in. Not the score. Not the result.',
            ParagraphStyle('cc3', fontName='Fraunces', fontSize=11, leading=15,
                textColor=INK_SOFT, spaceAfter=6)),
    ], [
        Paragraph('<b>2.</b> Then stop talking. Quiet for a full mile.',
            ParagraphStyle('cc4', fontName='Fraunces', fontSize=11, leading=15,
                textColor=INK_SOFT, spaceAfter=6)),
    ], [
        Paragraph('<b>3.</b> Mention what is next that has nothing to do with the sport. Pizza. Homework. The dog.',
            ParagraphStyle('cc5', fontName='Fraunces', fontSize=11, leading=15,
                textColor=INK_SOFT, spaceAfter=10)),
    ], [
        Paragraph('NEVER: ask the score first  /  question the coach  /  compare to sibling',
            ParagraphStyle('cc6', fontName='Mono-Medium', fontSize=8,
                textColor=RUST, spaceAfter=4)),
    ], [
        Paragraph('PARENTCOACHPLAYBOOK.COM  /  THREE DRIVES. ONE RELATIONSHIP.',
            ParagraphStyle('cc7', fontName='Mono', fontSize=7,
                textColor=INK_SOFT, spaceAfter=0)),
    ]]
    card = Table(card_data, colWidths=[6.5 * inch])
    card.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 1.5, INK),
        ('BACKGROUND', (0, 0), (-1, -1), PAPER_WARM),
        ('LEFTPADDING', (0, 0), (-1, -1), 24),
        ('RIGHTPADDING', (0, 0), (-1, -1), 24),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (0, 0), 22),
        ('BOTTOMPADDING', (-1, -1), (-1, -1), 22),
    ]))
    s.append(card)
    s.append(Spacer(1, 14))
    s.append(Paragraph(
        '✂  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
        ParagraphStyle('scissors', fontName='Mono', fontSize=8,
            textColor=BONE, alignment=TA_CENTER, spaceAfter=14)))
    s.append(PageBreak())

    # Page 12: Closing
    s.append(Paragraph('08 / KEEP READING', eyebrow))
    s.append(Paragraph('The work doesn\'t end <i>at the curb</i>.', display_lg))
    s.append(Paragraph(
        "If this guide helped, the publication has more. The Parent-Coach Playbook is a weekly editorial brand "
        "for parents who coach their own kid. Three drives. One relationship.",
        body_lg))
    s.append(Paragraph(
        "Subscribe to the newsletter and you'll get the next issue, plus the back catalog as it grows. "
        "Cornerstone essays carry the founder's byline. Field reporting is filed under PCP Editors. No fluff. No paid placements. No emojis.",
        body_lg))
    s.append(Spacer(1, 12))
    s.append(Paragraph('PARENTCOACHPLAYBOOK.COM', ParagraphStyle('cta_url',
        fontName='Mono-Medium', fontSize=14, textColor=INK, spaceAfter=4)))
    s.append(Paragraph('Subscribe / read the archive / get the next playbook',
        ParagraphStyle('cta_sub', fontName='Mono', fontSize=8, textColor=INK_SOFT,
            spaceAfter=24)))

    # Imprint block
    imprint = Table([
        [Paragraph('THE PARENT-COACH PLAYBOOK', ParagraphStyle('im1',
            fontName='Mono-Medium', fontSize=8, textColor=INK))],
        [Paragraph('A small site for parents who coach, drive, snack-pack, and supervise the group chat. ' +
                   'Edited by Jeff Thomas. Written by Maren Bell, Dan Kowalski, and Jeff. ' +
                   'Maren and Dan are composite voices. Read about them at parentcoachplaybook.com/contributors. ' +
                   '© 2026. All rights reserved.',
            ParagraphStyle('im2', fontName='Inter', fontSize=8, leading=12,
                textColor=INK_SOFT))],
    ], colWidths=[6.5 * inch])
    imprint.setStyle(TableStyle([
        ('LINEABOVE', (0, 0), (-1, 0), 0.75, INK),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ]))
    s.append(imprint)

    return s


# ---- Build with two-page-template flow (cover dark, rest light) ----
class PCPDoc(BaseDocTemplate):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        cover_frame = Frame(MARGIN, MARGIN, PAGE_W - 2 * MARGIN, PAGE_H - 2 * MARGIN,
                           leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
                           id='cover')
        body_frame = Frame(MARGIN, MARGIN + 0.3 * inch,
                          PAGE_W - 2 * MARGIN, PAGE_H - 2 * MARGIN - 0.6 * inch,
                          leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
                          id='body')
        self.addPageTemplates([
            PageTemplate(id='Cover', frames=[cover_frame], onPage=cover_page),
            PageTemplate(id='Interior', frames=[body_frame], onPage=interior_page),
        ])

    def afterFlowable(self, flowable):
        # Switch to interior pages after the cover's page break
        if hasattr(flowable, 'isPageBreak') and self.page == 1:
            self._handle_nextPageTemplate('Interior')


def main():
    out_path = "/sessions/happy-tender-gates/mnt/Claude Cowork/OUTPUTS/parent-coach-playbook/public/the-drive-home-playbook.pdf"
    doc = PCPDoc(out_path, pagesize=letter,
                 leftMargin=MARGIN, rightMargin=MARGIN,
                 topMargin=MARGIN, bottomMargin=MARGIN,
                 title='The Drive Home Playbook',
                 author='PCP Editors',
                 subject='A free field guide for parents who coach their own kid',
                 creator='The Parent-Coach Playbook',
                 keywords='youth sports, parent-coach, drive home, parenting')
    doc.build(build_story())
    print(f"wrote: {out_path}")
    print(f"size: {os.path.getsize(out_path)} bytes")


if __name__ == '__main__':
    main()
