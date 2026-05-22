from datetime import datetime, timedelta, timezone
import jwt

# Inside your active token generation utility script file
SECRET_KEY = "my_ultra_secure_super_long_secret_key_32_bytes_long!"
ALGORITHM = "HS256"



def create_token(data: dict, expires_minutes: int = 60):
    payload = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes)
    payload.update({"exp": expire})

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
