from fastapi import FastAPI, APIRouter, HTTPException, Form, File, UploadFile
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import shutil
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create uploads directory
uploads_dir = ROOT_DIR / 'uploads'
uploads_dir.mkdir(exist_ok=True)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory=str(uploads_dir)), name="uploads")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Enums
class CaseStatus(str, Enum):
    ACTIVE = "active"
    PENDING = "pending"
    CLOSED = "closed"
    ON_HOLD = "on_hold"

class CaseType(str, Enum):
    CIVIL = "civil"
    CRIMINAL = "criminal"
    FAMILY = "family"
    CORPORATE = "corporate"
    REAL_ESTATE = "real_estate"
    IMMIGRATION = "immigration"
    OTHER = "other"

class ClientStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    POTENTIAL = "potential"

# Models
class Client(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    # Datos básicos
    first_name: str
    last_name: str
    email: str
    phone: str
    address: str
    city: str
    state: str
    postal_code: str
    # Información adicional
    date_of_birth: Optional[str] = None
    occupation: Optional[str] = None
    emergency_contact: Optional[str] = None
    emergency_phone: Optional[str] = None
    # Estado y metadatos
    status: ClientStatus = ClientStatus.ACTIVE
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ClientCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str
    address: str
    city: str
    state: str
    postal_code: str
    date_of_birth: Optional[str] = None
    occupation: Optional[str] = None
    emergency_contact: Optional[str] = None
    emergency_phone: Optional[str] = None
    status: ClientStatus = ClientStatus.ACTIVE
    notes: Optional[str] = None

class Case(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    title: str
    case_number: str
    case_type: CaseType
    status: CaseStatus = CaseStatus.ACTIVE
    description: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    next_hearing: Optional[str] = None
    court_name: Optional[str] = None
    judge_name: Optional[str] = None
    opposing_party: Optional[str] = None
    case_value: Optional[float] = None
    hourly_rate: Optional[float] = None
    total_hours: Optional[float] = None
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CaseCreate(BaseModel):
    client_id: str
    title: str
    case_number: str
    case_type: CaseType
    status: CaseStatus = CaseStatus.ACTIVE
    description: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    next_hearing: Optional[str] = None
    court_name: Optional[str] = None
    judge_name: Optional[str] = None
    opposing_party: Optional[str] = None
    case_value: Optional[float] = None
    hourly_rate: Optional[float] = None
    total_hours: Optional[float] = None
    notes: Optional[str] = None

class Document(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    case_id: Optional[str] = None
    filename: str
    original_filename: str
    file_path: str
    file_size: int
    content_type: str
    description: Optional[str] = None
    category: Optional[str] = None
    uploaded_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Appointment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    case_id: Optional[str] = None
    title: str
    description: Optional[str] = None
    appointment_date: str
    appointment_time: str
    duration_minutes: int = 60
    location: Optional[str] = None
    is_completed: bool = False
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AppointmentCreate(BaseModel):
    client_id: str
    case_id: Optional[str] = None
    title: str
    description: Optional[str] = None
    appointment_date: str
    appointment_time: str
    duration_minutes: int = 60
    location: Optional[str] = None
    notes: Optional[str] = None

class DashboardStats(BaseModel):
    total_clients: int
    active_clients: int
    total_cases: int
    active_cases: int
    pending_cases: int
    closed_cases: int
    upcoming_appointments: int
    total_documents: int

class CaseUpdate(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    case_id: str
    client_id: str
    title: str
    description: str
    update_type: str  # "progress", "hearing", "document", "status_change", "general"
    is_visible_to_client: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_by: str = "lawyer"  # "lawyer" or "system"

class CaseUpdateCreate(BaseModel):
    case_id: str
    title: str
    description: str
    update_type: str = "general"
    is_visible_to_client: bool = True

class ClientLogin(BaseModel):
    email: str
    phone: str  # Using phone as simple password

class ClientDashboard(BaseModel):
    client_info: Client
    active_cases: List[Case]
    recent_updates: List[CaseUpdate]
    upcoming_appointments: List[Appointment]
    total_documents: int

# Helper functions
def prepare_for_mongo(data):
    """Prepare data for MongoDB storage"""
    if isinstance(data, dict):
        # Convert datetime objects to strings
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = value.isoformat()
    return data

# API Routes

# Dashboard Stats
@api_router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats():
    """Get dashboard statistics"""
    try:
        # Count clients by status
        total_clients = await db.clients.count_documents({})
        active_clients = await db.clients.count_documents({"status": "active"})
        
        # Count cases by status
        total_cases = await db.cases.count_documents({})
        active_cases = await db.cases.count_documents({"status": "active"})
        pending_cases = await db.cases.count_documents({"status": "pending"})
        closed_cases = await db.cases.count_documents({"status": "closed"})
        
        # Count upcoming appointments (today and future)
        today = datetime.now(timezone.utc).date().isoformat()
        upcoming_appointments = await db.appointments.count_documents({
            "appointment_date": {"$gte": today},
            "is_completed": False
        })
        
        # Count total documents
        total_documents = await db.documents.count_documents({})
        
        return DashboardStats(
            total_clients=total_clients,
            active_clients=active_clients,
            total_cases=total_cases,
            active_cases=active_cases,
            pending_cases=pending_cases,
            closed_cases=closed_cases,
            upcoming_appointments=upcoming_appointments,
            total_documents=total_documents
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Client CRUD
@api_router.post("/clients", response_model=Client)
async def create_client(client: ClientCreate):
    """Create a new client"""
    try:
        client_dict = client.dict()
        client_obj = Client(**client_dict)
        client_data = prepare_for_mongo(client_obj.dict())
        await db.clients.insert_one(client_data)
        return client_obj
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/clients", response_model=List[Client])
async def get_clients(status: Optional[str] = None, search: Optional[str] = None):
    """Get all clients with optional filtering"""
    try:
        filter_query = {}
        
        if status:
            filter_query["status"] = status
            
        if search:
            filter_query["$or"] = [
                {"first_name": {"$regex": search, "$options": "i"}},
                {"last_name": {"$regex": search, "$options": "i"}},
                {"email": {"$regex": search, "$options": "i"}},
                {"phone": {"$regex": search, "$options": "i"}}
            ]
        
        clients = await db.clients.find(filter_query).sort("created_at", -1).to_list(1000)
        return [Client(**client) for client in clients]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/clients/{client_id}", response_model=Client)
async def get_client(client_id: str):
    """Get a specific client"""
    try:
        client = await db.clients.find_one({"id": client_id})
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")
        return Client(**client)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/clients/{client_id}", response_model=Client)
async def update_client(client_id: str, client_update: ClientCreate):
    """Update a client"""
    try:
        client_dict = client_update.dict()
        client_dict["updated_at"] = datetime.now(timezone.utc)
        client_data = prepare_for_mongo(client_dict)
        
        result = await db.clients.update_one(
            {"id": client_id},
            {"$set": client_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Client not found")
            
        updated_client = await db.clients.find_one({"id": client_id})
        return Client(**updated_client)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/clients/{client_id}")
async def delete_client(client_id: str):
    """Delete a client"""
    try:
        result = await db.clients.delete_one({"id": client_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Client not found")
        return {"message": "Client deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Case CRUD
@api_router.post("/cases", response_model=Case)
async def create_case(case: CaseCreate):
    """Create a new case"""
    try:
        # Verify client exists
        client = await db.clients.find_one({"id": case.client_id})
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")
            
        case_dict = case.dict()
        case_obj = Case(**case_dict)
        case_data = prepare_for_mongo(case_obj.dict())
        await db.cases.insert_one(case_data)
        return case_obj
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/cases", response_model=List[Case])
async def get_cases(client_id: Optional[str] = None, status: Optional[str] = None):
    """Get all cases with optional filtering"""
    try:
        filter_query = {}
        
        if client_id:
            filter_query["client_id"] = client_id
            
        if status:
            filter_query["status"] = status
        
        cases = await db.cases.find(filter_query).sort("created_at", -1).to_list(1000)
        return [Case(**case) for case in cases]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/cases/{case_id}", response_model=Case)
async def get_case(case_id: str):
    """Get a specific case"""
    try:
        case = await db.cases.find_one({"id": case_id})
        if not case:
            raise HTTPException(status_code=404, detail="Case not found")
        return Case(**case)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/cases/{case_id}", response_model=Case)
async def update_case(case_id: str, case_update: CaseCreate):
    """Update a case"""
    try:
        case_dict = case_update.dict()
        case_dict["updated_at"] = datetime.now(timezone.utc)
        case_data = prepare_for_mongo(case_dict)
        
        result = await db.cases.update_one(
            {"id": case_id},
            {"$set": case_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Case not found")
            
        updated_case = await db.cases.find_one({"id": case_id})
        return Case(**updated_case)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/cases/{case_id}")
async def delete_case(case_id: str):
    """Delete a case"""
    try:
        result = await db.cases.delete_one({"id": case_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Case not found")
        return {"message": "Case deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Document Management
@api_router.post("/documents/upload")
async def upload_document(
    client_id: str = Form(...),
    case_id: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    file: UploadFile = File(...)
):
    """Upload a document for a client/case"""
    try:
        # Verify client exists
        client = await db.clients.find_one({"id": client_id})
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")
        
        # Create unique filename
        file_extension = file.filename.split('.')[-1] if '.' in file.filename else ''
        unique_filename = f"{uuid.uuid4()}.{file_extension}" if file_extension else str(uuid.uuid4())
        file_path = uploads_dir / unique_filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Create document record
        document = Document(
            client_id=client_id,
            case_id=case_id,
            filename=unique_filename,
            original_filename=file.filename,
            file_path=str(file_path),
            file_size=file_path.stat().st_size,
            content_type=file.content_type,
            description=description,
            category=category
        )
        
        document_data = prepare_for_mongo(document.dict())
        await db.documents.insert_one(document_data)
        
        return {
            "message": "Document uploaded successfully",
            "document": document,
            "file_url": f"/uploads/{unique_filename}"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/documents", response_model=List[Document])
async def get_documents(client_id: Optional[str] = None, case_id: Optional[str] = None):
    """Get documents with optional filtering"""
    try:
        filter_query = {}
        
        if client_id:
            filter_query["client_id"] = client_id
            
        if case_id:
            filter_query["case_id"] = case_id
        
        documents = await db.documents.find(filter_query).sort("uploaded_at", -1).to_list(1000)
        return [Document(**doc) for doc in documents]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/documents/{document_id}")
async def delete_document(document_id: str):
    """Delete a document"""
    try:
        document = await db.documents.find_one({"id": document_id})
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Delete file from disk
        file_path = Path(document["file_path"])
        if file_path.exists():
            file_path.unlink()
        
        # Delete from database
        await db.documents.delete_one({"id": document_id})
        
        return {"message": "Document deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Appointments CRUD
@api_router.post("/appointments", response_model=Appointment)
async def create_appointment(appointment: AppointmentCreate):
    """Create a new appointment"""
    try:
        # Verify client exists
        client = await db.clients.find_one({"id": appointment.client_id})
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")
            
        appointment_dict = appointment.dict()
        appointment_obj = Appointment(**appointment_dict)
        appointment_data = prepare_for_mongo(appointment_obj.dict())
        await db.appointments.insert_one(appointment_data)
        return appointment_obj
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/appointments", response_model=List[Appointment])
async def get_appointments(client_id: Optional[str] = None, upcoming: Optional[bool] = None):
    """Get appointments with optional filtering"""
    try:
        filter_query = {}
        
        if client_id:
            filter_query["client_id"] = client_id
            
        if upcoming:
            today = datetime.now(timezone.utc).date().isoformat()
            filter_query["appointment_date"] = {"$gte": today}
            filter_query["is_completed"] = False
        
        appointments = await db.appointments.find(filter_query).sort("appointment_date", 1).to_list(1000)
        return [Appointment(**appointment) for appointment in appointments]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/appointments/{appointment_id}", response_model=Appointment)
async def update_appointment(appointment_id: str, appointment_update: AppointmentCreate):
    """Update an appointment"""
    try:
        appointment_dict = appointment_update.dict()
        
        result = await db.appointments.update_one(
            {"id": appointment_id},
            {"$set": appointment_dict}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Appointment not found")
            
        updated_appointment = await db.appointments.find_one({"id": appointment_id})
        return Appointment(**updated_appointment)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/appointments/{appointment_id}/complete")
async def complete_appointment(appointment_id: str, notes: Optional[str] = None):
    """Mark appointment as completed"""
    try:
        update_data = {"is_completed": True}
        if notes:
            update_data["notes"] = notes
            
        result = await db.appointments.update_one(
            {"id": appointment_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Appointment not found")
            
        return {"message": "Appointment marked as completed"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/appointments/{appointment_id}")
async def delete_appointment(appointment_id: str):
    """Delete an appointment"""
    try:
        result = await db.appointments.delete_one({"id": appointment_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Appointment not found")
        return {"message": "Appointment deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
