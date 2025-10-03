#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Legal Client Management System
Tests all CRUD operations, file uploads, and dashboard statistics
"""

import requests
import json
import os
import tempfile
from datetime import datetime, timedelta
import uuid

# Configuration
BASE_URL = "https://lawyer-admin.preview.emergentagent.com/api"
TIMEOUT = 30

class LegalBackendTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = requests.Session()
        self.session.timeout = TIMEOUT
        self.test_results = []
        self.created_resources = {
            'clients': [],
            'cases': [],
            'documents': [],
            'appointments': []
        }
        
    def log_result(self, test_name, success, message, details=None):
        """Log test result"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'details': details or {}
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def test_dashboard_stats(self):
        """Test dashboard statistics API"""
        try:
            response = self.session.get(f"{self.base_url}/dashboard/stats")
            
            if response.status_code == 200:
                data = response.json()
                required_fields = [
                    'total_clients', 'active_clients', 'total_cases', 
                    'active_cases', 'pending_cases', 'closed_cases',
                    'upcoming_appointments', 'total_documents'
                ]
                
                missing_fields = [field for field in required_fields if field not in data]
                if missing_fields:
                    self.log_result("Dashboard Stats API", False, 
                                  f"Missing required fields: {missing_fields}", data)
                else:
                    # Verify all values are integers
                    invalid_types = [field for field in required_fields 
                                   if not isinstance(data[field], int)]
                    if invalid_types:
                        self.log_result("Dashboard Stats API", False,
                                      f"Non-integer values for: {invalid_types}", data)
                    else:
                        self.log_result("Dashboard Stats API", True, 
                                      "All required fields present with correct types", data)
            else:
                self.log_result("Dashboard Stats API", False, 
                              f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("Dashboard Stats API", False, f"Exception: {str(e)}")
    
    def test_client_crud(self):
        """Test complete Client CRUD operations"""
        # Test data for a legal client
        client_data = {
            "first_name": "María",
            "last_name": "González",
            "email": "maria.gonzalez@email.com",
            "phone": "+1-555-0123",
            "address": "123 Main Street, Apt 4B",
            "city": "Madrid",
            "state": "Madrid",
            "postal_code": "28001",
            "date_of_birth": "1985-03-15",
            "occupation": "Business Owner",
            "emergency_contact": "Carlos González",
            "emergency_phone": "+1-555-0124",
            "status": "active",
            "notes": "Referred by existing client. Needs assistance with business incorporation."
        }
        
        # Test CREATE client
        try:
            response = self.session.post(f"{self.base_url}/clients", json=client_data)
            
            if response.status_code == 200:
                client = response.json()
                client_id = client.get('id')
                
                if client_id:
                    self.created_resources['clients'].append(client_id)
                    self.log_result("Create Client", True, f"Client created with ID: {client_id}")
                    
                    # Test GET specific client
                    get_response = self.session.get(f"{self.base_url}/clients/{client_id}")
                    if get_response.status_code == 200:
                        retrieved_client = get_response.json()
                        if retrieved_client['email'] == client_data['email']:
                            self.log_result("Get Specific Client", True, "Client retrieved successfully")
                        else:
                            self.log_result("Get Specific Client", False, "Retrieved client data mismatch")
                    else:
                        self.log_result("Get Specific Client", False, 
                                      f"HTTP {get_response.status_code}: {get_response.text}")
                    
                    # Test UPDATE client
                    update_data = client_data.copy()
                    update_data['notes'] = "Updated: Case progressing well. Next meeting scheduled."
                    update_response = self.session.put(f"{self.base_url}/clients/{client_id}", json=update_data)
                    
                    if update_response.status_code == 200:
                        updated_client = update_response.json()
                        if updated_client['notes'] == update_data['notes']:
                            self.log_result("Update Client", True, "Client updated successfully")
                        else:
                            self.log_result("Update Client", False, "Update not reflected in response")
                    else:
                        self.log_result("Update Client", False, 
                                      f"HTTP {update_response.status_code}: {update_response.text}")
                        
                else:
                    self.log_result("Create Client", False, "No ID returned in response", client)
            else:
                self.log_result("Create Client", False, 
                              f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("Create Client", False, f"Exception: {str(e)}")
        
        # Test GET all clients
        try:
            response = self.session.get(f"{self.base_url}/clients")
            if response.status_code == 200:
                clients = response.json()
                if isinstance(clients, list):
                    self.log_result("Get All Clients", True, f"Retrieved {len(clients)} clients")
                else:
                    self.log_result("Get All Clients", False, "Response is not a list")
            else:
                self.log_result("Get All Clients", False, 
                              f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Get All Clients", False, f"Exception: {str(e)}")
        
        # Test client search
        try:
            response = self.session.get(f"{self.base_url}/clients?search=María")
            if response.status_code == 200:
                clients = response.json()
                if isinstance(clients, list):
                    self.log_result("Search Clients", True, f"Search returned {len(clients)} results")
                else:
                    self.log_result("Search Clients", False, "Search response is not a list")
            else:
                self.log_result("Search Clients", False, 
                              f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Search Clients", False, f"Exception: {str(e)}")
    
    def test_case_crud(self):
        """Test complete Case CRUD operations"""
        if not self.created_resources['clients']:
            self.log_result("Case CRUD", False, "No clients available for case testing")
            return
            
        client_id = self.created_resources['clients'][0]
        
        # Test data for a legal case
        case_data = {
            "client_id": client_id,
            "title": "Business Incorporation - González Consulting LLC",
            "case_number": "BIZ-2024-001",
            "case_type": "corporate",
            "status": "active",
            "description": "Complete business incorporation including LLC formation, operating agreement, and tax registration.",
            "start_date": "2024-01-15",
            "next_hearing": "2024-02-15",
            "court_name": "Madrid Commercial Court",
            "judge_name": "Judge Patricia Ruiz",
            "case_value": 15000.00,
            "hourly_rate": 250.00,
            "total_hours": 12.5,
            "notes": "Client requires expedited processing due to pending contracts."
        }
        
        # Test CREATE case
        try:
            response = self.session.post(f"{self.base_url}/cases", json=case_data)
            
            if response.status_code == 200:
                case = response.json()
                case_id = case.get('id')
                
                if case_id:
                    self.created_resources['cases'].append(case_id)
                    self.log_result("Create Case", True, f"Case created with ID: {case_id}")
                    
                    # Test GET specific case
                    get_response = self.session.get(f"{self.base_url}/cases/{case_id}")
                    if get_response.status_code == 200:
                        retrieved_case = get_response.json()
                        if retrieved_case['case_number'] == case_data['case_number']:
                            self.log_result("Get Specific Case", True, "Case retrieved successfully")
                        else:
                            self.log_result("Get Specific Case", False, "Retrieved case data mismatch")
                    else:
                        self.log_result("Get Specific Case", False, 
                                      f"HTTP {get_response.status_code}: {get_response.text}")
                    
                    # Test UPDATE case
                    update_data = case_data.copy()
                    update_data['status'] = 'pending'
                    update_data['notes'] = "Updated: Awaiting court approval for incorporation documents."
                    update_response = self.session.put(f"{self.base_url}/cases/{case_id}", json=update_data)
                    
                    if update_response.status_code == 200:
                        updated_case = update_response.json()
                        if updated_case['status'] == 'pending':
                            self.log_result("Update Case", True, "Case updated successfully")
                        else:
                            self.log_result("Update Case", False, "Update not reflected in response")
                    else:
                        self.log_result("Update Case", False, 
                                      f"HTTP {update_response.status_code}: {update_response.text}")
                        
                else:
                    self.log_result("Create Case", False, "No ID returned in response", case)
            else:
                self.log_result("Create Case", False, 
                              f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("Create Case", False, f"Exception: {str(e)}")
        
        # Test GET all cases
        try:
            response = self.session.get(f"{self.base_url}/cases")
            if response.status_code == 200:
                cases = response.json()
                if isinstance(cases, list):
                    self.log_result("Get All Cases", True, f"Retrieved {len(cases)} cases")
                else:
                    self.log_result("Get All Cases", False, "Response is not a list")
            else:
                self.log_result("Get All Cases", False, 
                              f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Get All Cases", False, f"Exception: {str(e)}")
        
        # Test cases by client filter
        try:
            response = self.session.get(f"{self.base_url}/cases?client_id={client_id}")
            if response.status_code == 200:
                cases = response.json()
                if isinstance(cases, list):
                    self.log_result("Filter Cases by Client", True, f"Retrieved {len(cases)} cases for client")
                else:
                    self.log_result("Filter Cases by Client", False, "Response is not a list")
            else:
                self.log_result("Filter Cases by Client", False, 
                              f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Filter Cases by Client", False, f"Exception: {str(e)}")
    
    def test_document_upload(self):
        """Test document upload and management"""
        if not self.created_resources['clients']:
            self.log_result("Document Upload", False, "No clients available for document testing")
            return
            
        client_id = self.created_resources['clients'][0]
        case_id = self.created_resources['cases'][0] if self.created_resources['cases'] else None
        
        # Create a test document
        test_content = """
        BUSINESS INCORPORATION AGREEMENT
        
        This document outlines the terms and conditions for the incorporation of González Consulting LLC.
        
        1. Business Name: González Consulting LLC
        2. Business Type: Limited Liability Company
        3. State of Incorporation: Madrid
        4. Registered Agent: María González
        5. Business Purpose: Management consulting services
        
        Date: January 15, 2024
        Signature: _____________________
        """
        
        try:
            # Create temporary file
            with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as temp_file:
                temp_file.write(test_content)
                temp_file_path = temp_file.name
            
            # Test document upload
            with open(temp_file_path, 'rb') as file:
                files = {'file': ('incorporation_agreement.txt', file, 'text/plain')}
                data = {
                    'client_id': client_id,
                    'description': 'Business incorporation agreement and terms',
                    'category': 'Legal Documents'
                }
                
                if case_id:
                    data['case_id'] = case_id
                
                response = self.session.post(f"{self.base_url}/documents/upload", 
                                           files=files, data=data)
                
                if response.status_code == 200:
                    result = response.json()
                    document = result.get('document', {})
                    document_id = document.get('id')
                    
                    if document_id:
                        self.created_resources['documents'].append(document_id)
                        self.log_result("Upload Document", True, 
                                      f"Document uploaded with ID: {document_id}")
                        
                        # Verify file details
                        if (document.get('original_filename') == 'incorporation_agreement.txt' and
                            document.get('client_id') == client_id):
                            self.log_result("Document Metadata", True, "Document metadata correct")
                        else:
                            self.log_result("Document Metadata", False, "Document metadata incorrect")
                    else:
                        self.log_result("Upload Document", False, "No document ID returned", result)
                else:
                    self.log_result("Upload Document", False, 
                                  f"HTTP {response.status_code}: {response.text}")
            
            # Clean up temp file
            os.unlink(temp_file_path)
            
        except Exception as e:
            self.log_result("Upload Document", False, f"Exception: {str(e)}")
        
        # Test GET all documents
        try:
            response = self.session.get(f"{self.base_url}/documents")
            if response.status_code == 200:
                documents = response.json()
                if isinstance(documents, list):
                    self.log_result("Get All Documents", True, f"Retrieved {len(documents)} documents")
                else:
                    self.log_result("Get All Documents", False, "Response is not a list")
            else:
                self.log_result("Get All Documents", False, 
                              f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Get All Documents", False, f"Exception: {str(e)}")
        
        # Test documents by client filter
        try:
            response = self.session.get(f"{self.base_url}/documents?client_id={client_id}")
            if response.status_code == 200:
                documents = response.json()
                if isinstance(documents, list):
                    self.log_result("Filter Documents by Client", True, 
                                  f"Retrieved {len(documents)} documents for client")
                else:
                    self.log_result("Filter Documents by Client", False, "Response is not a list")
            else:
                self.log_result("Filter Documents by Client", False, 
                              f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Filter Documents by Client", False, f"Exception: {str(e)}")
    
    def test_appointment_crud(self):
        """Test complete Appointment CRUD operations"""
        if not self.created_resources['clients']:
            self.log_result("Appointment CRUD", False, "No clients available for appointment testing")
            return
            
        client_id = self.created_resources['clients'][0]
        case_id = self.created_resources['cases'][0] if self.created_resources['cases'] else None
        
        # Test data for a legal appointment
        tomorrow = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
        appointment_data = {
            "client_id": client_id,
            "case_id": case_id,
            "title": "Business Incorporation Consultation",
            "description": "Review incorporation documents and discuss next steps for LLC formation.",
            "appointment_date": tomorrow,
            "appointment_time": "14:30",
            "duration_minutes": 90,
            "location": "Law Office - Conference Room A",
            "notes": "Client will bring business plan and financial projections."
        }
        
        # Test CREATE appointment
        try:
            response = self.session.post(f"{self.base_url}/appointments", json=appointment_data)
            
            if response.status_code == 200:
                appointment = response.json()
                appointment_id = appointment.get('id')
                
                if appointment_id:
                    self.created_resources['appointments'].append(appointment_id)
                    self.log_result("Create Appointment", True, f"Appointment created with ID: {appointment_id}")
                    
                    # Test UPDATE appointment
                    update_data = appointment_data.copy()
                    update_data['duration_minutes'] = 120
                    update_data['notes'] = "Extended meeting - client has additional questions about tax implications."
                    update_response = self.session.put(f"{self.base_url}/appointments/{appointment_id}", 
                                                     json=update_data)
                    
                    if update_response.status_code == 200:
                        updated_appointment = update_response.json()
                        if updated_appointment['duration_minutes'] == 120:
                            self.log_result("Update Appointment", True, "Appointment updated successfully")
                        else:
                            self.log_result("Update Appointment", False, "Update not reflected in response")
                    else:
                        self.log_result("Update Appointment", False, 
                                      f"HTTP {update_response.status_code}: {update_response.text}")
                    
                    # Test COMPLETE appointment
                    complete_response = self.session.put(f"{self.base_url}/appointments/{appointment_id}/complete",
                                                       json={"notes": "Meeting completed successfully. Client satisfied with progress."})
                    
                    if complete_response.status_code == 200:
                        self.log_result("Complete Appointment", True, "Appointment marked as completed")
                    else:
                        self.log_result("Complete Appointment", False, 
                                      f"HTTP {complete_response.status_code}: {complete_response.text}")
                        
                else:
                    self.log_result("Create Appointment", False, "No ID returned in response", appointment)
            else:
                self.log_result("Create Appointment", False, 
                              f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("Create Appointment", False, f"Exception: {str(e)}")
        
        # Test GET all appointments
        try:
            response = self.session.get(f"{self.base_url}/appointments")
            if response.status_code == 200:
                appointments = response.json()
                if isinstance(appointments, list):
                    self.log_result("Get All Appointments", True, f"Retrieved {len(appointments)} appointments")
                else:
                    self.log_result("Get All Appointments", False, "Response is not a list")
            else:
                self.log_result("Get All Appointments", False, 
                              f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Get All Appointments", False, f"Exception: {str(e)}")
        
        # Test upcoming appointments filter
        try:
            response = self.session.get(f"{self.base_url}/appointments?upcoming=true")
            if response.status_code == 200:
                appointments = response.json()
                if isinstance(appointments, list):
                    self.log_result("Get Upcoming Appointments", True, 
                                  f"Retrieved {len(appointments)} upcoming appointments")
                else:
                    self.log_result("Get Upcoming Appointments", False, "Response is not a list")
            else:
                self.log_result("Get Upcoming Appointments", False, 
                              f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Get Upcoming Appointments", False, f"Exception: {str(e)}")
    
    def test_error_handling(self):
        """Test error handling for invalid requests"""
        # Test invalid client ID
        try:
            response = self.session.get(f"{self.base_url}/clients/invalid-id")
            if response.status_code == 404:
                self.log_result("Error Handling - Invalid Client ID", True, "Correctly returned 404")
            else:
                self.log_result("Error Handling - Invalid Client ID", False, 
                              f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_result("Error Handling - Invalid Client ID", False, f"Exception: {str(e)}")
        
        # Test case creation with invalid client ID
        try:
            invalid_case_data = {
                "client_id": "invalid-client-id",
                "title": "Test Case",
                "case_number": "TEST-001",
                "case_type": "civil",
                "start_date": "2024-01-01"
            }
            response = self.session.post(f"{self.base_url}/cases", json=invalid_case_data)
            if response.status_code == 404:
                self.log_result("Error Handling - Invalid Client for Case", True, "Correctly returned 404")
            else:
                self.log_result("Error Handling - Invalid Client for Case", False, 
                              f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_result("Error Handling - Invalid Client for Case", False, f"Exception: {str(e)}")
    
    def cleanup_resources(self):
        """Clean up created test resources"""
        print("\n🧹 Cleaning up test resources...")
        
        # Delete appointments
        for appointment_id in self.created_resources['appointments']:
            try:
                response = self.session.delete(f"{self.base_url}/appointments/{appointment_id}")
                if response.status_code == 200:
                    print(f"✅ Deleted appointment: {appointment_id}")
                else:
                    print(f"❌ Failed to delete appointment {appointment_id}: {response.status_code}")
            except Exception as e:
                print(f"❌ Error deleting appointment {appointment_id}: {str(e)}")
        
        # Delete documents
        for document_id in self.created_resources['documents']:
            try:
                response = self.session.delete(f"{self.base_url}/documents/{document_id}")
                if response.status_code == 200:
                    print(f"✅ Deleted document: {document_id}")
                else:
                    print(f"❌ Failed to delete document {document_id}: {response.status_code}")
            except Exception as e:
                print(f"❌ Error deleting document {document_id}: {str(e)}")
        
        # Delete cases
        for case_id in self.created_resources['cases']:
            try:
                response = self.session.delete(f"{self.base_url}/cases/{case_id}")
                if response.status_code == 200:
                    print(f"✅ Deleted case: {case_id}")
                else:
                    print(f"❌ Failed to delete case {case_id}: {response.status_code}")
            except Exception as e:
                print(f"❌ Error deleting case {case_id}: {str(e)}")
        
        # Delete clients
        for client_id in self.created_resources['clients']:
            try:
                response = self.session.delete(f"{self.base_url}/clients/{client_id}")
                if response.status_code == 200:
                    print(f"✅ Deleted client: {client_id}")
                else:
                    print(f"❌ Failed to delete client {client_id}: {response.status_code}")
            except Exception as e:
                print(f"❌ Error deleting client {client_id}: {str(e)}")
    
    def run_all_tests(self):
        """Run all backend API tests"""
        print("🚀 Starting Legal Client Management System Backend API Tests")
        print(f"📍 Base URL: {self.base_url}")
        print("=" * 80)
        
        # Run tests in logical order
        self.test_dashboard_stats()
        self.test_client_crud()
        self.test_case_crud()
        self.test_document_upload()
        self.test_appointment_crud()
        self.test_error_handling()
        
        # Print summary
        print("\n" + "=" * 80)
        print("📊 TEST SUMMARY")
        print("=" * 80)
        
        passed = sum(1 for result in self.test_results if result['success'])
        failed = len(self.test_results) - passed
        
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"📈 Success Rate: {(passed/len(self.test_results)*100):.1f}%")
        
        if failed > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"   • {result['test']}: {result['message']}")
        
        # Cleanup
        self.cleanup_resources()
        
        return passed, failed

if __name__ == "__main__":
    tester = LegalBackendTester()
    passed, failed = tester.run_all_tests()
    
    # Exit with appropriate code
    exit(0 if failed == 0 else 1)