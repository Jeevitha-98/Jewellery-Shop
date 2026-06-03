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
from models import User, Product, VendorRequest, Notification

class VendorProfileUpdate(BaseModel):
    business_name: str | None = None
    business_type: str | None = None
    location: str | None = None
    mobile: str | None = None

class PasswordUpdateRequest(BaseModel):
    old_password: str
    new_password: str

class CreateOrderPayload(BaseModel):
    supplier_id: str
    product_name: str
    quantity: int
    notes: str | None = ""

class VendorRequestStatusUpdate(BaseModel):
    status: str

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
    try:
        vendor_id = current_user["user_id"]
        total_available = db.query(Product).count()
        my_orders_count = db.query(VendorRequest.id).filter(VendorRequest.vendor_id == vendor_id, VendorRequest.status == "Accepted").count()
        pending_count = db.query(VendorRequest.id).filter(VendorRequest.vendor_id == vendor_id, VendorRequest.status == "Pending").count()
        return {
            "totalAvailableProducts": int(total_available), 
            "myOrders": int(my_orders_count), 
            "pendingRequests": int(pending_count)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Metrics processing failure: {str(e)}")

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
    return {"status": True, "message": "your changes are saved successfully"}

@router.put("/profile/password")
def update_vendor_password(payload: PasswordUpdateRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_vendor)):
    user = db.query(User).filter(User.user_id == current_user["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User target profile not found")
    
    if user.password != payload.old_password:
        raise HTTPException(status_code=400, detail="Incorrect current password string.")
        
    user.password = payload.new_password
    db.commit()
    return {"status": True, "message": "your changes are saved successfully"}

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
    vendor_id = current_user["user_id"]
    query_results = db.query(
        VendorRequest,
        User.business_name
    ).outerjoin(User, VendorRequest.supplier_id == User.user_id)\
     .filter(VendorRequest.vendor_id == vendor_id).all()
    
    response_list = []
    for o, business_name in query_results:
        response_list.append({
            "id": o.id,
            "vendor_name": "My Business Portal",
            "supplier_name": business_name if business_name else f"Supplier {o.supplier_id}",
            "product_name": o.product_name,
            "quantity": o.quantity,
            "status": o.status,
            "requested_date": str(o.created_at) if o.created_at else "2026-06-02"
        })
    return {"status": "success", "data": response_list}

@router.post("/orders")
def create_vendor_order_request(payload: CreateOrderPayload, db: Session = Depends(get_db), current_user: dict = Depends(get_current_vendor)):
    vendor_id = current_user["user_id"]
    
    vendor_profile = db.query(User).filter(User.user_id == vendor_id).first()
    v_name = vendor_profile.business_name if vendor_profile else f"Vendor {vendor_id}"
    
    new_request = VendorRequest(
        vendor_id=vendor_id,
        vendor_name=v_name,
        product_name=payload.product_name,
        quantity=payload.quantity,
        status="Pending",
        supplier_id=payload.supplier_id,
        notes=payload.notes,
        created_at=datetime.now().strftime("%Y-%m-%d %H:%M")
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    
    supplier_alert = Notification(
        user_id=payload.supplier_id,
        message=f"New incoming component procurement request line submitted by {v_name}.",
        type="NEW_REQUEST"
    )
    db.add(supplier_alert)
    db.commit()
    return {"status": "success", "message": "Procurement requested line registered cleanly."}

# ✅ FIXED CRASH: Reconstructed the broken status method handler block completely
@router.put("/orders/{order_id}/status")
def update_vendor_order_cancellation(order_id: int, payload: VendorRequestStatusUpdate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_vendor)):
    vendor_id = current_user["user_id"]
    order = db.query(VendorRequest).filter(VendorRequest.id == order_id, VendorRequest.vendor_id == vendor_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Procurement order line not found.")
        
    if payload.status not in ["Rejected", "Cancelled"]:
        raise HTTPException(status_code=400, detail="Invalid operations status request mapping parameters.")
        
    order.status = payload.status
    db.commit()
    return {"status": "success", "message": f"Order status successfully marked as {payload.status}."}

# ✅ FIXED POST METHODS BLOCK: Maps HTTP POST requests cleanly from your frontend views
@router.post("/product-requests")
@router.post("/product_requests")
def create_vendor_product_request_form_post(payload: CreateOrderPayload, db: Session = Depends(get_db), current_user: dict = Depends(get_current_vendor)):
    try:
        vendor_id = current_user["user_id"]
        vendor_profile = db.query(User).filter(User.user_id == vendor_id).first()
        v_name = vendor_profile.business_name if vendor_profile else f"Vendor {vendor_id}"
        
        new_request = VendorRequest(
            vendor_id=vendor_id,
            vendor_name=v_name,
            product_name=payload.product_name,
            quantity=payload.quantity,
            status="Pending",
            supplier_id=payload.supplier_id,
            notes=payload.notes,
            created_at=datetime.now().strftime("%Y-%m-%d %H:%M")
        )
        db.add(new_request)
        db.commit()
        db.refresh(new_request)
        
        supplier_alert = Notification(
            user_id=payload.supplier_id,
            message=f"New incoming component procurement request line submitted by {v_name}.",
            type="NEW_REQUEST"
        )
        db.add(supplier_alert)
        db.commit()
        return {"status": "success", "message": "Fulfillment submission registered cleanly."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"POST Request Form validation crash: {str(e)}")

# ✅ FIXED GET ROUTING INTERCEPTORS: Satisfies the default Vendorcontext.jsx hook lookups
@router.get("/product-requests")
@router.get("/product_requests")
def get_vendor_product_requests_failsafe(db: Session = Depends(get_db), current_user: dict = Depends(get_current_vendor)):
    try:
        vendor_id = current_user["user_id"]
        query_results = db.query(VendorRequest, User.business_name).outerjoin(User, VendorRequest.supplier_id == User.user_id).filter(VendorRequest.vendor_id == vendor_id).all()
        response_list = []
        for o, business_name in query_results:
            response_list.append({
                "id": o.id,
                "product_name": getattr(o, 'product_name', 'Unknown Item'),
                "vendor_name": "My Business Portal",
                "supplier_name": business_name if business_name else f"Supplier Partner {o.supplier_id}",
                "quantity": getattr(o, 'quantity', 0),
                "status": getattr(o, 'status', 'Pending'),
                "created_at": str(o.created_at) if o.created_at else "2026-06-03"
            })
        return {"status": "success", "data": response_list}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failsafe context stream failure: {str(e)}")
