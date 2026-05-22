import os
import sys
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import jwt
from pydantic import BaseModel  

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import get_db
import models
from models import User, Product, VendorRequest

class VendorProfileUpdate(BaseModel):
    business_name: str | None = None
    business_type: str | None = None
    location: str | None = None
    mobile: str | None = None

class CreateProductRequest(BaseModel):
    supplier_id: str
    product_name: str
    quantity: int

router = APIRouter(prefix="/vendor", tags=["Vendor Operations"])

security = HTTPBearer()
SECRET_KEY = "my_ultra_secure_super_long_secret_key_32_bytes_long!"
ALGORITHM = "HS256"

def get_current_vendor(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        role = payload.get("role")
        
        if user_id is None or role is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Malformed token payload")
            
        clean_role = str(role).strip().lower()
        if clean_role != "vendor":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
            
        return {"user_id": str(user_id), "role": clean_role}
    except jwt.PyJWTError as e:
        print(f"--- JWT DECODE FAILURE TRACE: {str(e)} ---")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token signature")


@router.get("/metrics")
def get_vendor_metrics(db: Session = Depends(get_db), current_user: dict = Depends(get_current_vendor)):
    vendor_id = current_user["user_id"]
    total_available = db.query(Product).count()
    my_orders_count = db.query(VendorRequest.id).filter(VendorRequest.vendor_id == vendor_id, VendorRequest.status == "Accepted").count()
    pending_count = db.query(VendorRequest.id).filter(VendorRequest.vendor_id == vendor_id, VendorRequest.status == "Pending").count()
    return {
        "totalAvailableProducts": int(total_available), 
        "myOrders": int(my_orders_count), 
        "pendingRequests": int(pending_count)
    }

@router.get("/profile")
def get_vendor_profile(db: Session = Depends(get_db), current_user: dict = Depends(get_current_vendor)):
    user = db.query(User).filter(User.user_id == current_user["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    u_id = str(user.user_id) if user.user_id else "VEN001"
    mob = str(user.mobile) if user.mobile else ""
    b_name = str(user.business_name) if (user.business_name and str(user.business_name).strip() != "") else "New Vendor Enterprise"
    b_type = str(user.business_type) if (user.business_type and str(user.business_type).strip() != "") else "Retailer"
    loc = str(user.location) if (user.location and str(user.location).strip() != "") else "Not Provided"

    return {
        "user_id": u_id,
        "userId": u_id,
        "mobile": mob,
        "business_name": b_name,
        "businessName": b_name,
        "business_type": b_type,
        "businessType": b_type,
        "location": loc,
        "name": b_name
    }

@router.put("/profile")
def update_vendor_profile(payload: VendorProfileUpdate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_vendor)):
    user = db.query(User).filter(User.user_id == current_user["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.business_name = payload.business_name
    user.business_type = payload.business_type
    user.location = payload.location
    user.mobile = payload.mobile
    db.commit()
    return {"status": True, "message": "Profile updated successfully"}

@router.get("/browse-products")
def browse_all_products(db: Session = Depends(get_db), current_user: dict = Depends(get_current_vendor)):
    products = db.query(Product).all()
    product_list = []
    for p in products:
        if not p:
            continue
        raw_stock = getattr(p, 'stock', getattr(p, 'quantity', 0)) or 0
        raw_price = getattr(p, 'price', 0) or 0
        raw_image = str(p.image) if hasattr(p, 'image') and p.image else ""
        product_list.append({
            "id": int(p.id), 
            "name": str(p.name), 
            "category": str(getattr(p, 'category', 'General') or 'General'), 
            "stock": int(raw_stock), 
            "price": float(raw_price), 
            "image": raw_image,
            "supplier_id": str(p.supplier_id)
        })
    return product_list

@router.get("/orders")
def get_vendor_orders(db: Session = Depends(get_db), current_user: dict = Depends(get_current_vendor)):
    # Explicitly pulling specific columns to bypass missing created_at fields safely
    rows = db.query(
        VendorRequest.id,
        VendorRequest.supplier_id,
        VendorRequest.product_name,
        VendorRequest.quantity,
        VendorRequest.status,
        User.business_name
    ).join(User, VendorRequest.supplier_id == User.user_id).filter(
        VendorRequest.vendor_id == current_user["user_id"], 
        VendorRequest.status == "Accepted"
    ).all()
    
    response_list = []
    for r_id, s_id, p_name, qty, stat, b_name in rows:
        response_list.append({
            "id": int(r_id),
            "supplier_id": str(s_id),
            "supplier_name": str(b_name) if b_name else str(s_id),
            "product": str(p_name),
            "quantity": int(qty),
            "status": str(stat),
            "requested_date": None
        })
    return response_list

@router.get("/product-requests")
def get_vendor_product_requests(db: Session = Depends(get_db), current_user: dict = Depends(get_current_vendor)):
    # Explicitly pulling specific columns to bypass missing created_at fields safely
    rows = db.query(
        VendorRequest.id,
        VendorRequest.vendor_id,
        VendorRequest.vendor_name,
        VendorRequest.product_name,
        VendorRequest.quantity,
        VendorRequest.status,
        VendorRequest.supplier_id,
        User.business_name
    ).join(User, VendorRequest.supplier_id == User.user_id).filter(
        VendorRequest.vendor_id == current_user["user_id"]
    ).all()
    
    response_list = []
    for r_id, v_id, v_name, p_name, qty, stat, s_id, b_name in rows:
        response_list.append({
            "id": int(r_id),
            "vendor_id": str(v_id),
            "vendor_name": str(v_name),
            "product": str(p_name),
            "quantity": int(qty),
            "status": str(stat),
            "supplier_id": str(s_id),
            "supplier_name": str(b_name) if b_name else str(s_id),
            "requested_date": None
        })
    return response_list

@router.post("/product-requests")
def create_procurement_request(payload: CreateProductRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_vendor)):
    vendor_id = current_user["user_id"]
    user_profile = db.query(User).filter(User.user_id == vendor_id).first()
    vendor_name = user_profile.business_name if user_profile and user_profile.business_name else f"Vendor {vendor_id}"
    
    new_request = VendorRequest(
        vendor_id=vendor_id,
        vendor_name=vendor_name,
        product_name=payload.product_name,
        quantity=payload.quantity,
        status="Pending",
        supplier_id=payload.supplier_id
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return {"status": True, "message": "Procurement request logged successfully", "id": new_request.id}
