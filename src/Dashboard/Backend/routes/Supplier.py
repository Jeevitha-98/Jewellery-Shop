import os
import sys
import shutil
import jwt
from fastapi import APIRouter, Depends, HTTPException, status, File, Form, UploadFile
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel  

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import get_db
import models
from models import User, Product, VendorRequest

class SupplierProfileUpdate(BaseModel):
    business_name: str | None = None
    business_type: str | None = None
    location: str | None = None
    mobile: str | None = None

class PasswordUpdateRequest(BaseModel):
    old_password: str
    new_password: str

class VendorRequestStatusUpdate(BaseModel):
    status: str

router = APIRouter(prefix="/supplier", tags=["Supplier Operations"])

security = HTTPBearer()

SECRET_KEY = "my_ultra_secure_super_long_secret_key_32_bytes_long!"
ALGORITHM = "HS256"

def get_current_supplier(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        role = payload.get("role")
        
        if user_id is None or role is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Malformed token payload")
            
        clean_role = str(role).strip().lower()
        if clean_role != "supplier":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
            
        return {"user_id": str(user_id), "role": clean_role}
    except jwt.PyJWTError as e:
        print(f"--- JWT DECODE FAILURE TRACE: {str(e)} ---")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token signature")

@router.get("/metrics")
def get_supplier_metrics(db: Session = Depends(get_db), current_user: dict = Depends(get_current_supplier)):
    try:
        supplier_id = current_user["user_id"]
        total_products = db.query(Product).filter(Product.supplier_id == supplier_id).count()
        products = db.query(Product).filter(Product.supplier_id == supplier_id).all()
        overall_stock = sum([int(getattr(p, 'stock', getattr(p, 'quantity', 0)) or 0) for p in products])
        pending_requests = db.query(VendorRequest).filter(VendorRequest.supplier_id == supplier_id, VendorRequest.status == "Pending").count()
        return {"totalProducts": int(total_products), "overallStock": int(overall_stock), "pendingRequests": int(pending_requests)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Metrics processing failure: {str(e)}")

@router.get("/profile")
def get_supplier_profile(db: Session = Depends(get_db), current_user: dict = Depends(get_current_supplier)):
    user = db.query(User).filter(User.user_id == current_user["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    u_id = str(user.user_id) if user.user_id else "SUP001"
    mob = str(user.mobile) if user.mobile else ""
    b_name = str(getattr(user, 'business_name', '')) if getattr(user, 'business_name', None) else "New Supplier Enterprise"
    b_type = str(getattr(user, 'business_type', '')) if getattr(user, 'business_type', None) else "Wholesale Distributor"
    loc = str(getattr(user, 'location', '')) if getattr(user, 'location', None) else "Not Provided"

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
def update_supplier_profile(payload: SupplierProfileUpdate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_supplier)):
    user = db.query(User).filter(User.user_id == current_user["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if hasattr(user, 'business_name') and payload.business_name: user.business_name = payload.business_name
    if hasattr(user, 'business_type') and payload.business_type: user.business_type = payload.business_type
    if hasattr(user, 'location') and payload.location: user.location = payload.location
    if hasattr(user, 'mobile') and payload.mobile: user.mobile = payload.mobile
    
    db.commit()
    return {"status": True, "message": "Profile updated successfully"}

@router.put("/profile/password")
def update_supplier_password(payload: PasswordUpdateRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_supplier)):
    user = db.query(User).filter(User.user_id == current_user["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.password != payload.old_password:
        raise HTTPException(status_code=400, detail="Incorrect current password")
        
    user.password = payload.new_password
    db.commit()
    return {"status": True, "message": "Password updated successfully"}

@router.get("/stock")
def get_stock_list(db: Session = Depends(get_db), current_user: dict = Depends(get_current_supplier)):
    try:
        products = db.query(Product).filter(Product.supplier_id == current_user["user_id"]).all()
        stock_list = []
        for p in products:
            if not p: continue
            raw_stock = getattr(p, 'stock', getattr(p, 'quantity', 0)) or 0
            raw_price = getattr(p, 'price', 0) or 0
            raw_image = str(p.image) if hasattr(p, 'image') and p.image else ""
            stock_list.append({
                "id": int(p.id),
                "name": str(p.name),
                "category": str(getattr(p, 'category', 'General') or 'General'),
                "stock": int(raw_stock),
                "price": float(raw_price),
                "image": raw_image
            })
        return stock_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Stock processing failure: {str(e)}")

@router.post("/products")
async def add_product(
    name: str = Form(...),
    category: str = Form("General"),
    price: float = Form(...),
    stock: int = Form(...),
    quantity: int = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_supplier)
):
    try:
        supplier_id = str(current_user["user_id"])
        UPLOAD_DIR = "uploads/products"
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        image_url = ""
        calculated_quantity = quantity if quantity is not None else stock
        clean_name = name.strip()

        db_product = db.query(Product).filter(Product.name.ilike(clean_name), Product.supplier_id == supplier_id).first()

        if image and image.filename:
            file_location = os.path.join(UPLOAD_DIR, image.filename)
            with open(file_location, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
            image_url = f"http://localhost:8085/uploads/products/{image.filename}"
        elif db_product and hasattr(db_product, 'image') and db_product.image:
            image_url = str(db_product.image)

        if db_product:
            db_product.category = category.strip()
            db_product.price = price
            if hasattr(db_product, 'stock'): db_product.stock += stock
            if hasattr(db_product, 'quantity'): db_product.quantity += calculated_quantity
            db_product.image = image_url
            db.commit()
            return {"id": int(db_product.id), "name": str(db_product.name), "status": "updated"}
        else:
            new_product = Product(name=clean_name, category=category.strip(), price=price, supplier_id=supplier_id, image=image_url)
            if hasattr(new_product, 'stock'): new_product.stock = stock
            if hasattr(new_product, 'quantity'): new_product.quantity = calculated_quantity
            db.add(new_product)
            db.commit()
            return {"id": int(new_product.id), "name": str(new_product.name), "status": "created"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Product creation failure: {str(e)}")

@router.get("/vendor-requests")
def get_vendor_requests(db: Session = Depends(get_db), current_user: dict = Depends(get_current_supplier)):
    try:
        requests = db.query(VendorRequest).filter(VendorRequest.supplier_id == current_user["user_id"]).all()
        response_list = []
        for r in requests:
            if not r: continue
            v_id = str(getattr(r, 'vendor_id', getattr(r, 'user_id', 'Unknown ID')))
            vendor_user = db.query(User).filter(User.user_id == v_id).first()
            v_name = getattr(vendor_user, 'business_name', f"Vendor ({v_id})") if vendor_user else f"Vendor ({v_id})"
            p_name = str(getattr(r, 'product_name', getattr(r, 'product', 'General Item')))
            
            response_list.append({
                "id": int(r.id),
                "vendorId": v_id,
                "vendorName": str(v_name),
                "productName": p_name,
                "quantity": int(getattr(r, 'quantity', 0)),
                "notes": str(getattr(r, 'notes', '')) if getattr(r, 'notes', None) else "",
                "status": str(r.status) if r.status else "Pending"
            })
        return response_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Requests processing failure: {str(e)}")

@router.put("/vendor-requests/{request_id}/status")
def update_request_status(request_id: int, payload: VendorRequestStatusUpdate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_supplier)):
    request_record = db.query(VendorRequest).filter(VendorRequest.id == request_id).first()

    if not request_record:
        raise HTTPException(status_code=404, detail="Request not found")

    request_record.status = payload.status.strip()
    db.commit()

    return {"status": True, "message": "Status updated successfully"}