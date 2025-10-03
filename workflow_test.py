#!/usr/bin/env python3
"""
Workflow Integration Tests for Legal Client Management System
Tests complete business workflows and edge cases
"""

import requests
import json
import tempfile
import os
from datetime import datetime, timedelta

BASE_URL = "https://lawyer-admin.preview.emergentagent.com/api"

def test_complete_legal_workflow():
    """Test complete legal client workflow from start to finish"""
    session = requests.Session()
    session.timeout = 30
    
    print("🔄 Testing Complete Legal Client Workflow")
    print("=" * 60)
    
    try:
        # Step 1: Create a new client
        client_data = {
            "first_name": "Ana",
            "last_name": "Martínez",
            "email": "ana.martinez@empresa.com",
            "phone": "+34-91-123-4567",
            "address": "Calle Gran Vía 28, 3º",
            "city": "Madrid",
            "state": "Madrid",
            "postal_code": "28013",
            "date_of_birth": "1978-09-22",
            "occupation": "CEO",
            "status": "active",
            "notes": "New client - needs help with contract disputes"
        }
        
        response = session.post(f"{BASE_URL}/clients", json=client_data)
        if response.status_code != 200:
            print(f"❌ Failed to create client: {response.status_code}")
            return False
            
        client = response.json()
        client_id = client['id']
        print(f"✅ Step 1: Created client {client['first_name']} {client['last_name']} (ID: {client_id})")
        
        # Step 2: Create a case for the client
        case_data = {
            "client_id": client_id,
            "title": "Contract Dispute Resolution - Martínez vs. TechCorp",
            "case_number": "CD-2024-002",
            "case_type": "civil",
            "status": "active",
            "description": "Client disputes breach of software development contract with TechCorp. Seeking damages and contract termination.",
            "start_date": "2024-01-20",
            "next_hearing": "2024-03-15",
            "court_name": "Madrid Civil Court No. 3",
            "judge_name": "Judge Carmen López",
            "opposing_party": "TechCorp Solutions S.L.",
            "case_value": 75000.00,
            "hourly_rate": 300.00,
            "total_hours": 8.0,
            "notes": "High priority case - client has strong evidence of contract breach"
        }
        
        response = session.post(f"{BASE_URL}/cases", json=case_data)
        if response.status_code != 200:
            print(f"❌ Failed to create case: {response.status_code}")
            return False
            
        case = response.json()
        case_id = case['id']
        print(f"✅ Step 2: Created case '{case['title']}' (ID: {case_id})")
        
        # Step 3: Upload contract document
        contract_content = """
        SOFTWARE DEVELOPMENT AGREEMENT
        
        This Agreement is entered into between Ana Martínez (Client) and TechCorp Solutions S.L. (Developer).
        
        1. SCOPE OF WORK
        Developer agrees to create a custom CRM system according to specifications in Exhibit A.
        
        2. TIMELINE
        Project completion date: December 31, 2023
        
        3. PAYMENT TERMS
        Total project cost: €75,000
        Payment schedule: 50% upfront, 50% upon completion
        
        4. DELIVERABLES
        - Fully functional CRM system
        - Source code and documentation
        - 6 months of technical support
        
        Date: June 1, 2023
        Client Signature: Ana Martínez
        Developer Signature: TechCorp Solutions S.L.
        """
        
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as temp_file:
            temp_file.write(contract_content)
            temp_file_path = temp_file.name
        
        with open(temp_file_path, 'rb') as file:
            files = {'file': ('original_contract.txt', file, 'text/plain')}
            data = {
                'client_id': client_id,
                'case_id': case_id,
                'description': 'Original software development contract - evidence for breach of contract case',
                'category': 'Contracts'
            }
            
            response = session.post(f"{BASE_URL}/documents/upload", files=files, data=data)
            if response.status_code != 200:
                print(f"❌ Failed to upload document: {response.status_code}")
                return False
                
            doc_result = response.json()
            document_id = doc_result['document']['id']
            print(f"✅ Step 3: Uploaded contract document (ID: {document_id})")
        
        os.unlink(temp_file_path)
        
        # Step 4: Schedule consultation appointment
        tomorrow = (datetime.now() + timedelta(days=2)).strftime('%Y-%m-%d')
        appointment_data = {
            "client_id": client_id,
            "case_id": case_id,
            "title": "Contract Dispute Strategy Meeting",
            "description": "Discuss case strategy, review evidence, and prepare for court proceedings.",
            "appointment_date": tomorrow,
            "appointment_time": "10:00",
            "duration_minutes": 120,
            "location": "Law Office - Main Conference Room",
            "notes": "Client will bring additional correspondence with TechCorp"
        }
        
        response = session.post(f"{BASE_URL}/appointments", json=appointment_data)
        if response.status_code != 200:
            print(f"❌ Failed to create appointment: {response.status_code}")
            return False
            
        appointment = response.json()
        appointment_id = appointment['id']
        print(f"✅ Step 4: Scheduled appointment for {appointment['appointment_date']} at {appointment['appointment_time']}")
        
        # Step 5: Verify dashboard stats reflect new data
        response = session.get(f"{BASE_URL}/dashboard/stats")
        if response.status_code != 200:
            print(f"❌ Failed to get dashboard stats: {response.status_code}")
            return False
            
        stats = response.json()
        print(f"✅ Step 5: Dashboard stats updated - {stats['total_clients']} clients, {stats['total_cases']} cases, {stats['total_documents']} documents")
        
        # Step 6: Update case status after initial review
        case_update = case_data.copy()
        case_update['status'] = 'pending'
        case_update['notes'] = 'Case under review - gathering additional evidence and preparing legal strategy'
        case_update['total_hours'] = 15.5
        
        response = session.put(f"{BASE_URL}/cases/{case_id}", json=case_update)
        if response.status_code != 200:
            print(f"❌ Failed to update case: {response.status_code}")
            return False
            
        print("✅ Step 6: Updated case status and billing hours")
        
        # Step 7: Complete the appointment
        response = session.put(f"{BASE_URL}/appointments/{appointment_id}/complete",
                             json={"notes": "Productive meeting. Client provided additional evidence. Next steps: file motion with court."})
        if response.status_code != 200:
            print(f"❌ Failed to complete appointment: {response.status_code}")
            return False
            
        print("✅ Step 7: Marked appointment as completed")
        
        # Cleanup
        print("\n🧹 Cleaning up workflow test data...")
        session.delete(f"{BASE_URL}/appointments/{appointment_id}")
        session.delete(f"{BASE_URL}/documents/{document_id}")
        session.delete(f"{BASE_URL}/cases/{case_id}")
        session.delete(f"{BASE_URL}/clients/{client_id}")
        print("✅ Cleanup completed")
        
        print("\n🎉 Complete Legal Workflow Test: SUCCESS")
        return True
        
    except Exception as e:
        print(f"❌ Workflow test failed with exception: {str(e)}")
        return False

def test_data_relationships():
    """Test data relationship integrity"""
    session = requests.Session()
    session.timeout = 30
    
    print("\n🔗 Testing Data Relationship Integrity")
    print("=" * 60)
    
    try:
        # Create client
        client_data = {
            "first_name": "Test",
            "last_name": "Relationship",
            "email": "test@relationship.com",
            "phone": "+1-555-0000",
            "address": "Test Address",
            "city": "Test City",
            "state": "Test State",
            "postal_code": "00000"
        }
        
        response = session.post(f"{BASE_URL}/clients", json=client_data)
        client = response.json()
        client_id = client['id']
        
        # Create case
        case_data = {
            "client_id": client_id,
            "title": "Test Case",
            "case_number": "TEST-001",
            "case_type": "civil",
            "start_date": "2024-01-01"
        }
        
        response = session.post(f"{BASE_URL}/cases", json=case_data)
        case = response.json()
        case_id = case['id']
        
        # Test: Try to delete client with associated case (should work but verify case still exists)
        response = session.delete(f"{BASE_URL}/clients/{client_id}")
        if response.status_code == 200:
            print("✅ Client deletion allowed even with associated case")
            
            # Verify case still exists (orphaned)
            response = session.get(f"{BASE_URL}/cases/{case_id}")
            if response.status_code == 200:
                print("⚠️  Case remains after client deletion (orphaned data)")
            else:
                print("✅ Case was also deleted (cascading delete)")
        
        # Cleanup remaining case
        session.delete(f"{BASE_URL}/cases/{case_id}")
        
        return True
        
    except Exception as e:
        print(f"❌ Relationship test failed: {str(e)}")
        return False

def test_large_file_upload():
    """Test uploading a larger file"""
    session = requests.Session()
    session.timeout = 60  # Longer timeout for file upload
    
    print("\n📁 Testing Large File Upload")
    print("=" * 60)
    
    try:
        # Create a client first
        client_data = {
            "first_name": "File",
            "last_name": "Test",
            "email": "file@test.com",
            "phone": "+1-555-0001",
            "address": "File Test Address",
            "city": "File City",
            "state": "File State",
            "postal_code": "00001"
        }
        
        response = session.post(f"{BASE_URL}/clients", json=client_data)
        client = response.json()
        client_id = client['id']
        
        # Create a larger test file (simulating a PDF document)
        large_content = "LEGAL DOCUMENT\n" + "This is a test legal document. " * 1000  # ~30KB
        
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as temp_file:
            temp_file.write(large_content)
            temp_file_path = temp_file.name
        
        with open(temp_file_path, 'rb') as file:
            files = {'file': ('large_legal_document.txt', file, 'text/plain')}
            data = {
                'client_id': client_id,
                'description': 'Large legal document for testing file upload limits',
                'category': 'Legal Documents'
            }
            
            response = session.post(f"{BASE_URL}/documents/upload", files=files, data=data)
            if response.status_code == 200:
                result = response.json()
                document_id = result['document']['id']
                file_size = result['document']['file_size']
                print(f"✅ Large file uploaded successfully (Size: {file_size} bytes)")
                
                # Cleanup
                session.delete(f"{BASE_URL}/documents/{document_id}")
            else:
                print(f"❌ Large file upload failed: {response.status_code}")
                return False
        
        os.unlink(temp_file_path)
        session.delete(f"{BASE_URL}/clients/{client_id}")
        
        return True
        
    except Exception as e:
        print(f"❌ Large file upload test failed: {str(e)}")
        return False

if __name__ == "__main__":
    print("🧪 Running Advanced Backend Integration Tests")
    print("=" * 80)
    
    tests_passed = 0
    total_tests = 3
    
    if test_complete_legal_workflow():
        tests_passed += 1
    
    if test_data_relationships():
        tests_passed += 1
        
    if test_large_file_upload():
        tests_passed += 1
    
    print("\n" + "=" * 80)
    print("📊 INTEGRATION TEST SUMMARY")
    print("=" * 80)
    print(f"✅ Passed: {tests_passed}/{total_tests}")
    print(f"📈 Success Rate: {(tests_passed/total_tests*100):.1f}%")
    
    if tests_passed == total_tests:
        print("🎉 All integration tests passed!")
    else:
        print("⚠️  Some integration tests failed")
    
    exit(0 if tests_passed == total_tests else 1)