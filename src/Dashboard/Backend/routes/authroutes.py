from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import User
from schemas import RegisterSchema, LoginSchema
from utils.jwt_handler import create_token


router = APIRouter()


# =========================
# USER ID GENERATOR
# =========================
def generate_user_id(role: str, db: Session):
    prefix = "SUP" if role == "supplier" else "VEN"

    last_user = (
        db.query(User)
        .filter(User.role == role)
        .order_by(User.id.desc())
        .first()
    )

    last_number = 0

    if last_user and last_user.user_id:
        numeric_part = last_user.user_id[-3:]
        if numeric_part.isdigit():
            last_number = int(numeric_part)

    new_number = last_number + 1
    return f"{prefix}{new_number:03d}"


# =========================
# REGISTER
# =========================
@router.post("/register")
def register(user: RegisterSchema, db: Session = Depends(get_db)):

    existing = db.query(User).filter(User.mobile == user.mobile).first()

    if existing:
        return {
            "status": False,
            "message": "Mobile already registered"
        }

    user_id = generate_user_id(user.role, db)

    new_user = User(
        mobile=user.mobile,
        location=user.location,
        business_name=user.business_name,
        business_type=user.business_type,
        role=user.role,
        user_id=user_id,
        password=user_id
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "status": True,
        "message": "User registered successfully",
        "user_id": user_id
    }


# =========================
# LOGIN
# =========================
@router.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.mobile == data.mobile).first()

    if not user:
        return {
            "status": False,
            "message": "User not found"
        }

    if user.password != data.password:
        return {
            "status": False,
            "message": "Invalid password"
        }

    token = create_token({
        "user_id": user.user_id,
        "role": user.role,
        "mobile": user.mobile
    })

    return {
        "status": True,
        "message": "Login success",
        "token": token,
        "role": user.role,
        "user_id": user.user_id
    }