import os
import sys
import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import get_db
import models
from models import User, Product, VendorRequest

router = APIRouter(prefix="/admin", tags=["Admin Operations"])

security = HTTPBearer()

SECRET_KEY = "my_ultra_secure_super_long_secret_key_32_bytes_long!"
ALGORITHM = "HS256"

class AdminOrderStatusUpdate(BaseModel):
    status: str

# Added missing Pydantic schemas required to accept profile parameters from the request payload
class ProfileUpdateRequest(BaseModel):
    business_name: str
    mobile: str
    location: str | None = None
    business_type: str | None = None

class PasswordUpdateRequest(BaseModel):
    old_password: str
    new_password: str

def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        role = payload.get("role")
        
        if user_id is None or role is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Malformed token payload")
            
        clean_role = str(role).strip().lower()
        if clean_role != "admin":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
            
        return {"user_id": str(user_id), "role": clean_role}
    except jwt.PyJWTError as e:
        print(f"--- JWT DECODE FAILURE TRACE: {str(e)} ---")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token signature")

@router.get("/profile")
def get_admin_profile(db: Session = Depends(get_db), current_user: dict = Depends(get_current_admin)):
    user = db.query(User).filter(User.user_id == current_user["user_id"]).first()
    if not user:
         return {
            "user_id": current_user["user_id"],
            "userId": current_user["user_id"],
            "mobile": "",
            "business_name": "Master Administrator",
            "businessName": "Master Administrator",
            "name": "Master Administrator",
            "uid": current_user["user_id"],
            "location": "",
            "business_type": ""
        }
        
    u_id = str(user.user_id) if user.user_id else "ADM001"
    mob = str(user.mobile) if user.mobile else ""
    b_name = str(user.business_name) if (user.business_name and str(user.business_name).strip() != "") else "System Admin"
    loc = str(getattr(user, 'location', '')) if getattr(user, 'location', None) else ""
    b_type = str(getattr(user, 'business_type', '')) if getattr(user, 'business_type', None) else ""

    return {
        "user_id": u_id,
        "userId": u_id,
        "uid": u_id,
        "mobile": mob,
        "business_name": b_name,
        "businessName": b_name,
        "name": b_name,
        "location": loc,
        "business_type": b_type
    }

# FIXED: Appended profile update target route to resolve frontend 404 connection drops
@router.put("/profile/update")
def update_admin_profile_data(
    payload: ProfileUpdateRequest, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(get_current_admin)
):
    user = db.query(User).filter(User.user_id == current_user["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User target profile entity row index not found.")
        
    user.business_name = payload.business_name
    user.mobile = payload.mobile
    
    if hasattr(user, 'location'):
        user.location = payload.location
    if hasattr(user, 'business_type'):
        user.business_type = payload.business_type
        
    db.commit()
    return {"status": True, "message": "Profile properties synced to MySQL ledger records successfully."}

# FIXED: Appended profile password change target route to resolve frontend connection drops
@router.put("/profile/password")
def update_admin_password_credentials(
    payload: PasswordUpdateRequest, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(get_current_admin)
):
    user = db.query(User).filter(User.user_id == current_user["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User target profile entity row index not found.")
    
    if user.password != payload.old_password:
        raise HTTPException(status_code=400, detail="Verification failed: Incorrect current password.")
        
    user.password = payload.new_password
    db.commit()
    return {"status": True, "message": "Security key updated inside database successfully."}

@router.get("/metrics")
def get_admin_dashboard_metrics(db: Session = Depends(get_db), current_user: dict = Depends(get_current_admin)):
    total_suppliers = db.query(User).filter(User.role.ilike("supplier")).count()
    total_vendors = db.query(User).filter(User.role.ilike("vendor")).count()
    total_products = db.query(Product).count()
    total_pending_requests = db.query(VendorRequest).filter(VendorRequest.status == "Pending").count()
    
    return {
        "totalSuppliers": int(total_suppliers),
        "totalVendors": int(total_vendors),
        "totalProducts": int(total_products),
        "pendingRequests": int(total_pending_requests)
    }

@router.get("/suppliers")
def get_all_suppliers(db: Session = Depends(get_db), current_user: dict = Depends(get_current_admin)):
    suppliers = db.query(User).filter(User.role.ilike("supplier")).all()
    return [{
        "id": s.id,
        "user_id": str(s.user_id),
        "business_name": str(getattr(s, 'business_name', '') or 'Unnamed Supplier'),
        "business_type": str(getattr(s, 'business_type', '') or 'N/A'),
        "location": str(getattr(s, 'location', '') or 'Not Provided'),
        "mobile": str(s.mobile)
    } for s in suppliers]

@router.get("/vendors")
def get_all_vendors(db: Session = Depends(get_db), current_user: dict = Depends(get_current_admin)):
    vendors = db.query(User).filter(User.role.ilike("vendor")).all()
    return [{
        "id": v.id,
        "user_id": str(v.user_id),
        "business_name": str(getattr(v, 'business_name', '') or 'Unnamed Vendor'),
        "business_type": str(getattr(v, 'business_type', '') or 'N/A'),
        "location": str(getattr(v, 'location', '') or 'Not Provided'),
        "mobile": str(v.mobile)
    } for v in vendors]

@router.get("/products")
def get_all_system_products(db: Session = Depends(get_db), current_user: dict = Depends(get_current_admin)):
    products = db.query(Product).all()
    return [{
        "id": int(p.id),
        "name": str(p.name),
        "category": str(getattr(p, 'category', 'General') or 'General'),
        "stock": int(getattr(p, 'stock', getattr(p, 'quantity', 0)) or 0),
        "price": float(getattr(p, 'price', 0) or 0),
        "supplier_id": str(p.supplier_id),
        "image": str(getattr(p, 'image', '')) if p.image else ""
    } for p in products]

@router.get("/orders")
def get_all_vendor_orders(db: Session = Depends(get_db), current_user: dict = Depends(get_current_admin)):
    requests = db.query(VendorRequest).all()
    order_list = []
    for r in requests:
        supplier = db.query(User).filter(User.user_id == r.supplier_id).first()
        s_name = supplier.business_name if supplier else "Unknown Supplier"
        
        v_id = getattr(r, 'user_id', getattr(r, 'vendor_id', None))
        vendor = db.query(User).filter(User.user_id == v_id).first() if v_id else None
        v_name = vendor.business_name if vendor else f"Vendor ({v_id})"
        
        p_name = "Unknown Product"
        if hasattr(r, 'product_name') and r.product_name:
            p_name = str(r.product_name)
        elif hasattr(r, 'name') and r.name:
            p_name = str(r.name)
        elif hasattr(r, 'product') and r.product:
            p_name = str(r.product)

        order_list.append({
            "id": int(r.id),
            "vendorName": str(v_name),
            "supplierName": str(s_name),
            "product": p_name,
            "quantity": int(getattr(r, 'quantity', getattr(r, 'stock', 0)) or 0),
            "status": str(r.status).capitalize() if r.status else "Pending",
            "requestedDate": str(getattr(r, 'requested_date', getattr(r, 'date', 'Just Now')))
        })
    return order_list

@router.put("/orders/{order_id}/status")
def admin_update_order_status(
    order_id: int, 
    payload: AdminOrderStatusUpdate, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(get_current_admin)
):
    order_request = db.query(VendorRequest).filter(VendorRequest.id == order_id).first()
    if not order_request:
        raise HTTPException(status_code=404, detail="Order request record not found")
        
    order_request.status = payload.status.capitalize()
    db.commit()
    return {"status": True, "message": "Order transaction status adjusted successfully"}
