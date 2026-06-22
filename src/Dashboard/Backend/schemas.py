from pydantic import BaseModel


class RegisterSchema(BaseModel):
    mobile: str
    location: str
    business_name: str
    business_type: str
    role: str


class LoginSchema(BaseModel):
    mobile: str
    password: str