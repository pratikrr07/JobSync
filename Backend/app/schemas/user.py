from pydantic import BaseModel, field_validator

def truncate_password_bytes(password: str) -> str:
    """Truncate password to 72 bytes (bcrypt limit) using UTF-8 encoding"""
    password_bytes = password.encode('utf-8')[:72]
    return password_bytes.decode('utf-8', errors='ignore')

class UserCreate(BaseModel):
    email: str
    password: str
    
    @field_validator('password', mode='before')
    @classmethod
    def validate_password(cls, v):
        """Truncate password to 72 bytes (bcrypt limit)"""
        if isinstance(v, str):
            result = truncate_password_bytes(v)
            print(f"[Schema Validator] Original: {len(v)} chars, {len(v.encode('utf-8'))} bytes")
            print(f"[Schema Validator] Truncated: {len(result)} chars, {len(result.encode('utf-8'))} bytes")
            return result
        return v

class UserLogin(BaseModel):
    email: str
    password: str
    
    @field_validator('password', mode='before')
    @classmethod
    def validate_password(cls, v):
        """Truncate password to 72 bytes (bcrypt limit)"""
        if isinstance(v, str):
            result = truncate_password_bytes(v)
            print(f"[Schema Validator] Original: {len(v)} chars, {len(v.encode('utf-8'))} bytes")
            print(f"[Schema Validator] Truncated: {len(result)} chars, {len(result.encode('utf-8'))} bytes")
            return result
        return v

class UserResponse(BaseModel):
    id: str
    email: str
