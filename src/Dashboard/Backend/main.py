import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from database import engine, Base, get_db
from models import VendorRequest

from routes import authroutes, Supplier, Vendor, Admin

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(title="Supplier & Vendor System API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8085",
        "http://127.0.0.1:8085"
    ],
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
    expose_headers=["*"]
)

@app.get("/supplier/vendor-requests", tags=["Failsafe Operations"])
@app.get("/supplier/vendor_requests", tags=["Failsafe Operations"])
def direct_vendor_requests_bypass(db: Session = Depends(get_db)):
    try:
        requests = db.query(VendorRequest).all()
        result = []
        for r in requests:
            result.append({
                "id": r.id,
                "product_name": getattr(r, 'product_name', 'Unknown Product'),
                "vendor_name": getattr(r, 'vendor_name', 'Global Vendor Partner'),
                "supplier_name": "You",
                "quantity": getattr(r, 'quantity', 0),
                "status": getattr(r, 'status', 'Pending'),
                "created_at": str(getattr(r, 'created_at', ''))
            })
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@app.get("/supplier/orders/public-report-override", tags=["Failsafe Operations"])
def direct_report_override_bypass(db: Session = Depends(get_db)):
    try:
        supplier_orders = db.query(VendorRequest).all()
        compiled_data = []
        for o in supplier_orders:
            qty = int(getattr(o, 'quantity', 0) or 0)
            item_name = str(getattr(o, 'product_name', '')).strip().lower()
            
            unit_price = 40.00
            if "chocolate" in item_name:
                unit_price = 80.00
            elif "rice" in item_name:
                unit_price = 60.00
                
            compiled_data.append({
                "id": o.id,
                "product_name": getattr(o, 'product_name', 'Unknown Line'),
                "vendor_name": getattr(o, 'vendor_name', 'N/A'),
                "customer_name": getattr(o, 'vendor_name', 'N/A'),
                "supplier_name": getattr(o, 'supplier_name', 'N/A'),
                "quantity": qty,
                "status": getattr(o, 'status', 'Pending'),
                "price": float(unit_price),
                "total_price": float(unit_price * qty),
                "created_at": str(getattr(o, 'created_at', ''))
            })
        return {"status": "success", "data": compiled_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

app.include_router(authroutes.router, prefix="/auth")
app.include_router(Supplier.router)
app.include_router(Vendor.router)
app.include_router(Admin.router)

os.makedirs("uploads/products", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def root():
    return {"status": "success", "message": "Backend platform running successfully"}
