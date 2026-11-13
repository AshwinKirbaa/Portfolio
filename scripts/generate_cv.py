from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, Table, TableStyle,
    KeepTogether, PageBreak
)

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "ashwin-kirbaa-cv.pdf"
DEPLOY = ROOT / "dist" / "assets" / "ashwin-kirbaa-cv.pdf"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

INK = colors.HexColor("#171514")
RED = colors.HexColor("#E9412D")
MUTED = colors.HexColor("#66615D")
PAPER = colors.HexColor("#F4F0E8")
LINE = colors.HexColor("#C7BFB5")

styles = getSampleStyleSheet()
name_style = ParagraphStyle("Name", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=27, leading=29, textColor=INK, spaceAfter=3)
role_style = ParagraphStyle("Role", parent=styles["Normal"], fontName="Helvetica", fontSize=11, leading=14, textColor=RED, spaceAfter=5)
contact_style = ParagraphStyle("Contact", parent=styles["Normal"], fontName="Helvetica", fontSize=8.4, leading=12, textColor=MUTED)
section_style = ParagraphStyle("Section", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=10, leading=12, textColor=RED, spaceBefore=10, spaceAfter=6, uppercase=True)
heading_style = ParagraphStyle("Heading", parent=styles["Heading3"], fontName="Helvetica-Bold", fontSize=10.5, leading=13, textColor=INK, spaceAfter=2)
meta_style = ParagraphStyle("Meta", parent=styles["Normal"], fontName="Helvetica", fontSize=8.4, leading=11, textColor=MUTED, spaceAfter=3)
body_style = ParagraphStyle("Body", parent=styles["Normal"], fontName="Helvetica", fontSize=8.8, leading=12.4, textColor=INK, spaceAfter=4)
bullet_style = ParagraphStyle("Bullet", parent=body_style, leftIndent=10, firstLineIndent=-7, bulletIndent=0, spaceAfter=2)
small_style = ParagraphStyle("Small", parent=body_style, fontSize=8.1, leading=11.4)


def draw_page(canvas, doc):
    canvas.saveState()
    width, height = A4
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, width, height, fill=1, stroke=0)
    canvas.setFillColor(RED)
    canvas.rect(0, height - 6 * mm, width, 6 * mm, fill=1, stroke=0)
    canvas.setStrokeColor(LINE)
    canvas.line(18 * mm, 14 * mm, width - 18 * mm, 14 * mm)
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 7.5)
    canvas.drawString(18 * mm, 9.5 * mm, "ASHWIN KIRBAA B. - AI & SOFTWARE DEVELOPER")
    canvas.drawRightString(width - 18 * mm, 9.5 * mm, f"PAGE {doc.page}")
    canvas.restoreState()


doc = BaseDocTemplate(
    str(OUTPUT), pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm,
    topMargin=15 * mm, bottomMargin=19 * mm, title="Ashwin Kirbaa B. - CV",
    author="Ashwin Kirbaa B."
)
frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="body")
doc.addPageTemplates(PageTemplate(id="cv", frames=[frame], onPage=draw_page))

story = []
story.append(Paragraph("ASHWIN KIRBAA B.", name_style))
story.append(Paragraph("AI & SOFTWARE DEVELOPER / COMPUTER SCIENCE ENGINEERING STUDENT", role_style))
story.append(Paragraph("Coimbatore, Tamil Nadu, India &nbsp;&nbsp;|&nbsp;&nbsp; ashwinkirbaa17@gmail.com &nbsp;&nbsp;|&nbsp;&nbsp; github.com/AshwinKirbaa &nbsp;&nbsp;|&nbsp;&nbsp; linkedin.com/in/ashwin-kirbaa17", contact_style))
story.append(Spacer(1, 7))

story.append(Paragraph("PROFILE", section_style))
story.append(Paragraph("Computer Science Engineering student building practical AI, computer-vision, full-stack, and infrastructure systems. I work from problem framing through model or API integration, interface development, testing, and deployment, with a focus on useful end-to-end products.", body_style))

story.append(Paragraph("EDUCATION", section_style))
story.append(Paragraph("B.E. COMPUTER SCIENCE AND ENGINEERING", heading_style))
story.append(Paragraph("Sri Shakthi Institute of Engineering and Technology, Coimbatore | 2025 - 2029", meta_style))
story.append(Paragraph("Coursework and independent practice across software engineering, artificial intelligence, backend systems, databases, computer vision, and infrastructure.", body_style))

story.append(Paragraph("SELECTED PROJECTS", section_style))
projects = [
    ("SafeBox AI", "AI security platform | Python, Docker, AI security", "Evidence-driven testing for adversarial AI behavior, policy adherence, sensitive-data exposure, and sandbox isolation."),
    ("TwinEval AI", "Semantic evaluation | Sentence Transformers, cosine similarity, full-stack", "AI-assisted answer evaluation that compares semantic meaning beyond keyword matches. Published as a paper in IJRTI, Volume 11, Issue 10 (2026), Paper ID IJRTI2610875."),
    ("AI Security Camera", "Computer vision | Python, OpenCV, InsightFace", "Real-time visitor identification using face detection, facial embeddings, recognition workflows, and live camera input."),
    ("Gesture Control", "Human-computer interaction | Python, OpenCV, MediaPipe", "Touchless computer controls built from hand-landmark tracking, gesture interpretation, and configurable actions."),
    ("Dexget", "Independent software project", "A software build taken through implementation, testing, and delivery, with source available on GitHub."),
]
for name, meta, description in projects:
    story.append(KeepTogether([Paragraph(name.upper(), heading_style), Paragraph(meta, meta_style), Paragraph(description, body_style)]))

story.append(PageBreak())
story.append(Paragraph("TECHNICAL TOOLKIT", section_style))
toolkit = [
    [Paragraph("LANGUAGES", heading_style), Paragraph("Java, Python, JavaScript", body_style)],
    [Paragraph("WEB + BACKEND", heading_style), Paragraph("HTML, CSS, React, Vite, Node.js, Express, FastAPI, Vercel Functions", body_style)],
    [Paragraph("DATA + AI", heading_style), Paragraph("PostgreSQL, MySQL, Scikit-learn, Sentence Transformers, NLP", body_style)],
    [Paragraph("VISION", heading_style), Paragraph("OpenCV, MediaPipe, InsightFace", body_style)],
    [Paragraph("INFRASTRUCTURE", heading_style), Paragraph("Docker, Docker Compose, Ubuntu Server, Portainer, Tailscale, Vercel", body_style)],
]
tool_table = Table(toolkit, colWidths=[43 * mm, 125 * mm])
tool_table.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LINEBELOW", (0, 0), (-1, -2), 0.35, LINE),
    ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ("RIGHTPADDING", (0, 0), (-1, -1), 4),
    ("TOPPADDING", (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
]))
story.append(tool_table)

story.append(Paragraph("SELECTED ACHIEVEMENTS", section_style))
achievements = [
    "Hack in Hills 2026 - SafeBox AI advanced to the Top 500 from more than 10,000 teams.",
    "HackerRank Orchestrate - ranked #1,134 in an agentic AI challenge with 35,000+ registrations.",
    "IBM BOB 2.0 Hackathon - completed and submitted an agentic AI solution.",
    "HackDay 1.0 - collaborated under an eight-hour deadline to deliver a functional prototype.",
]
for item in achievements:
    story.append(Paragraph(item, bullet_style, bulletText="-"))

story.append(Paragraph("PUBLICATION", section_style))
story.append(Paragraph("SMART EVALUATION OF HANDWRITTEN ANSWER SCRIPTS", heading_style))
story.append(Paragraph("International Journal for Research Trends and Innovation (IJRTI), Volume 11, Issue 10, October 2026 | Paper ID: IJRTI2610875", meta_style))
story.append(Paragraph("Research associated with TwinEval AI, exploring semantic representations and similarity-based evaluation for written answers.", body_style))

story.append(Paragraph("PRACTICAL SYSTEMS EXPERIENCE", section_style))
story.append(Paragraph("LINUX HOME LAB", heading_style))
story.append(Paragraph("Maintain a Linux-based learning environment using Ubuntu Server, Docker Compose, Portainer, and Tailscale to practice deployment, service operations, container management, and private networking.", body_style))

story.append(Paragraph("WORKING STYLE", section_style))
story.append(Paragraph("Define the real problem, make the core loop work, test edge cases, then package and deploy the useful result. Comfortable moving between model experimentation, APIs, interfaces, databases, and infrastructure.", body_style))

story.append(Spacer(1, 8))
cta = Table([[Paragraph("OPEN TO INTERNSHIPS, COLLABORATIONS, AND AMBITIOUS BUILDS", ParagraphStyle("CTA", parent=heading_style, textColor=colors.white, alignment=TA_LEFT))]], colWidths=[168 * mm])
cta.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), RED), ("LEFTPADDING", (0, 0), (-1, -1), 10), ("RIGHTPADDING", (0, 0), (-1, -1), 10), ("TOPPADDING", (0, 0), (-1, -1), 9), ("BOTTOMPADDING", (0, 0), (-1, -1), 9)]))
story.append(cta)

doc.build(story)
DEPLOY.write_bytes(OUTPUT.read_bytes())
print(OUTPUT)
