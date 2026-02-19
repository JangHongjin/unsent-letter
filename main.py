from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
import sqlite3

app = FastAPI(title="보내지 않은 편지 MVP")

# --- 데이터 모델 (Schema) ---

class SpaceCreate(BaseModel):
    nickname: str  # 나만 아는 별칭 (예: 노란 우산)
    color_theme: str = "#FFFFFF"
    secret_question: Optional[str] = None
    secret_answer: Optional[str] = None

class LetterCreate(BaseModel):
    content: str

# --- 가상 DB 설정 (SQLite) ---

def init_db():
    conn = sqlite3.connect("letters.db")
    cursor = conn.cursor()
    # 공간(Space) 테이블: 사람별 서랍
    cursor.execute('''CREATE TABLE IF NOT EXISTS spaces 
                      (id INTEGER PRIMARY KEY, nickname TEXT, color TEXT, question TEXT, answer TEXT)''')
    # 편지(Letter) 테이블: 서랍 속 기록
    cursor.execute('''CREATE TABLE IF NOT EXISTS letters 
                      (id INTEGER PRIMARY KEY, space_id INTEGER, content TEXT, created_at TEXT)''')
    conn.commit()
    conn.close()

init_db()

# --- API 엔드포인트 ---

@app.post("/spaces/")
def create_space(space: SpaceCreate):
    """새로운 사람과의 공간(서랍)을 생성합니다."""
    conn = sqlite3.connect("letters.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO spaces (nickname, color, question, answer) VALUES (?, ?, ?, ?)",
                   (space.nickname, space.color_theme, space.secret_question, space.secret_answer))
    space_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return {"message": f"'{space.nickname}'님과의 공간이 생성되었습니다.", "space_id": space_id}

@app.post("/spaces/{space_id}/letters/")
def write_letter(space_id: int, letter: LetterCreate):
    """특정 공간에 편지를 남깁니다."""
    conn = sqlite3.connect("letters.db")
    cursor = conn.cursor()
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute("INSERT INTO letters (space_id, content, created_at) VALUES (?, ?, ?)",
                   (space_id, letter.content, now))
    conn.commit()
    conn.close()
    return {"message": "마음을 담았습니다.", "time": now}

@app.get("/spaces/{space_id}/")
def get_space_content(space_id: int):
    """나의 기록들을 다시 읽어봅니다."""
    conn = sqlite3.connect("letters.db")
    cursor = conn.cursor()
    cursor.execute("SELECT content, created_at FROM letters WHERE space_id = ? ORDER BY created_at DESC", (space_id,))
    letters = cursor.fetchall()
    conn.close()
    return {"letters": [{"content": l[0], "date": l[1]} for l in letters]}