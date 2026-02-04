# Nutri App Backend

Backend service for Nutri App.  
Provides nutrition search, pantry management, caching, and failover.

---

## Features

- FatSecret API (primary nutrition source)
- Static JSON failover (foods.json)
- Redis or in-memory caching
- Pantry persistence (SQLAlchemy)
- JWT authentication
- Rate limiting
- Fully backend-driven nutrition logic

---

## Requirements

- Python 3.10+
- PostgreSQL or SQLite
- Redis (optional)

---

## Setup

```bash
cd be
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
