import re
import os
import hashlib
import hmac
import jwt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

SECRET_KEY = os.getenv("SECRET_KEY", "mediscope-super-secure-secret-key-2026-akhila-meesa")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 24 hours

def hash_password(password: str) -> str:
    """Generate a secure salted hash for passwords."""
    salt = os.urandom(16).hex()
    pwd_hash = hashlib.sha256((salt + password).encode("utf-8")).hexdigest()
    return f"{salt}${pwd_hash}"

def verify_password(plain_password: str, stored_hash: str) -> bool:
    """Verify plain password against stored salt$hash."""
    try:
        salt, pwd_hash = stored_hash.split("$", 1)
        expected = hashlib.sha256((salt + plain_password).encode("utf-8")).hexdigest()
        return hmac.compare_digest(expected, pwd_hash)
    except Exception:
        return False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Encode JWT token with user payload."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    """Decode and validate a JWT access token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except Exception:
        return None

def validate_email_format(email: str) -> bool:
    """
    Strict email validation:
    Must contain valid username, @, and a valid domain with TLD (e.g. user@gmail.com, doctor@hospital.org).
    """
    pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    return bool(re.match(pattern, email.strip()))

def validate_password_complexity(password: str) -> Dict[str, Any]:
    """
    Live Interactive Password Complexity Checklist:
    1. Minimum 8 characters
    2. At least 1 uppercase letter (A-Z)
    3. At least 1 lowercase letter (a-z)
    4. At least 1 numeric digit (0-9)
    5. At least 1 special character (@, #, $, %, !, &, *, etc.)
    """
    checks = {
        "min_length": len(password) >= 8,
        "has_upper": bool(re.search(r"[A-Z]", password)),
        "has_lower": bool(re.search(r"[a-z]", password)),
        "has_digit": bool(re.search(r"[0-9]", password)),
        "has_special": bool(re.search(r"[@#$%!&*^()_+\-=\[\]{}|;:,.<>?/~`]", password))
    }
    is_valid = all(checks.values())
    return {
        "valid": is_valid,
        "checks": checks,
        "message": "Password meets all complexity requirements" if is_valid else "Password does not meet all required criteria"
    }
