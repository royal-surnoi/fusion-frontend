 
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { MockTestService } from '../mock-test.service';
import { CommonModule, formatDate } from '@angular/common'; // Import CommonModule
import { MockTestService } from '../mocktest.service';
 
 
export interface Slot {
  slotId: number;
  slotName: string;
  slotTime: string; // Should be in ISO date-time format
  endTime: string;  // Should be in ISO date-time format
  booked: boolean;
 
  mockTestInterview: {
    id: number;
    // Add other properties of MockTestInterview if needed
  };
}
 
export interface BookingRequest {
  slotId: number;
  userId: number;
}
 
export interface BookedMockTestInterview {
  id: number;
  slot: {
    id: number;
    slotName: string;
    slotTime: string; // Change to Date if needed
    endTime: string;  // Change to Date if needed
    booked: boolean;
    mockTestInterview: {
      id: number;
    };
  };
  user: {
    id: number;
    name: string;
    // Add other properties of User if needed
  };
  bookingTime: string; // Change to Date if needed
}
 
@Component({
  selector: 'app-slotdetails',
  standalone: true,
  imports: [CommonModule], // Add CommonModule here
  templateUrl: './slotdetails.component.html',
  styleUrls: ['./slotdetails.component.css'] // Note the correction from styleUrl to styleUrls
})
export class SlotdetailsComponent implements OnInit {
 
  slotDetails: Slot[] = []; // Initialize as an empty array
  userId: any;
 
  bookedSlots: BookedMockTestInterview[] = []; // Array to hold booked slots
 
  isModalOpen = false;
  modalTitle = '';
  modalMessage = '';
  selectedSlot: Slot | null = null;
 
 
  constructor(
    private route: ActivatedRoute,
    private mockTestService: MockTestService
  ) {}
 
  openBookingModal(slot: Slot): void {
    console.log(slot,this.userId)
    this.selectedSlot = slot;
    this.modalTitle = 'Confirm Booking';
    this.modalMessage = `Do you want to book this slot?
Date: ${this.formatDateTime(slot.slotTime)}
Time: ${this.formatDateTime(slot.slotTime, 'hh:mm a')} - ${this.formatDateTime(slot.endTime, 'hh:mm a')}`;
    this.isModalOpen = true;
  }
 
  onModalConfirm(): void {
    if (this.selectedSlot) {
      this.confirmBooking(this.selectedSlot.slotId, this.userId);
    }
    this.isModalOpen = false;
  }
 
  onModalCancel(): void {
    this.isModalOpen = false;
  }
 
 ngOnInit(): void {
 // Load available slots based on mockTestInterviewId
 this.route.queryParams.subscribe(params => {
  const mockTestInterviewId = params['mockTestInterviewId'];
  if (mockTestInterviewId) {
    this.loadAvailableSlots(Number(mockTestInterviewId));
  }
});
 
// Retrieve userId from localStorage
this.userId = Number(localStorage.getItem('id'));
console.log('User ID:', this.userId);  // Debugging
}
 
 
  loadAvailableSlots(mockId: number): void {
    this.mockTestService.getAvailableSlots(mockId).subscribe(
      (slots: any[]) => {
        this.slotDetails = slots.map(slot => ({
          ...slot,
          slotTime: this.parseApiDate(slot.slotTime),
          endTime: this.parseApiDate(slot.endTime) // If endTime is also an array
        }));
        console.log('Slot details loaded:', this.slotDetails);
      },
      (error) => {
        console.error('Error loading slot details:', error);
      }
    );
  }
 
  parseApiDate(dateArray: number[]): string {
    if (!Array.isArray(dateArray) || dateArray.length < 5) {
      console.error('Invalid date array:', dateArray);
      return 'Invalid Date';
    }
    const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);
    return date.toISOString();
  }
 
 
  bookSlot(slot: Slot): void {
    const confirmMessage = `Do you want to book this slot?
Date: ${this.formatDateTime(slot.slotTime)}
Time: ${this.formatDateTime(slot.slotTime, 'hh:mm a')} - ${this.formatDateTime(slot.endTime, 'hh:mm a')}`;
 
    if (confirm(confirmMessage)) {
      this.confirmBooking(slot.slotId, this.userId);
    }
  }
 
  private confirmBooking(slotId: number, userId: number): void {
    if (!slotId || !userId) {
      console.error('Invalid slot ID or user ID');
      return;
    }
 
    this.mockTestService.bookSlot(slotId, userId).subscribe(
      response => {
        console.log('Slot booked successfully:', response);
        alert("Booked Successfully");
 
        // Remove the booked slot from the slotDetails array
        this.slotDetails = this.slotDetails.filter(slot => slot.slotId !== slotId);
 
        // Optionally reload the available slots
        this.loadAvailableSlots(this.slotDetails[0]?.mockTestInterview?.id);
      },
      error => {
        console.error('Error booking slot:', error);
        alert("Already Booked. Try booking another slot");
      }
    );
  }
 
 
 
  formatDateTime(dateTime: string | number[], format: string = 'dd/MM/yyyy, hh:mm:ss a'): string {
    let date: Date;
 
    if (Array.isArray(dateTime)) {
      date = new Date(dateTime[0], dateTime[1] - 1, dateTime[2], dateTime[3], dateTime[4]);
    } else if (typeof dateTime === 'string') {
      date = new Date(dateTime);
    } else {
      console.error('Unsupported date format:', dateTime);
      return 'Invalid Date';
    }
 
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateTime);
      return 'Invalid Date';
    }
 
    return formatDate(date, format, 'en-US');
  }
 
  getSlotDisplayString(slot: Slot): string {
    const startTime = this.formatDateTime(slot.slotTime);
    const endTime = this.formatDateTime(slot.endTime);
    return `${slot.slotName} - ${startTime} to ${endTime}`;
  }
 
 
 
 
  loadBookedSlots(userId: number): void {
    this.mockTestService.getBookedSlotsByUserId(userId).subscribe(
      (slots: BookedMockTestInterview[]) => {
        this.bookedSlots = slots;
        console.log('Booked slots loaded:', this.bookedSlots);
      },
      (error) => {
        console.error('Error loading booked slots:', error);
        this.bookedSlots = [];
      }
    );
  }
 
 
  formatBookedDateTime(dateTime: string, format: string = 'dd/MM/yyyy, hh:mm:ss a'): string {
    if (!dateTime) return 'N/A';
   
    let date: Date;
    if (dateTime.includes('-')) {
      // Handle the "2024-08-17 18:41-22:42" format
      const [datePart, timePart] = dateTime.split(' ');
      const [startTime] = timePart.split('-');
      date = new Date(`${datePart}T${startTime}`);
    } else {
      date = new Date(dateTime);
    }
 
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateTime);
      return 'Invalid Date';
    }
 
    return formatDate(date, format, 'en-US');
  }
 
  getBookedSlotDisplayString(slot: BookedMockTestInterview['slot']): string {
    const startTime = this.formatBookedDateTime(slot.slotTime);
    const endTime = this.formatBookedDateTime(slot.endTime);
    return `${slot.slotName} - ${startTime} to ${endTime}`;
  }
 
  getBookingTimeString(bookingTime: string): string {
    return this.formatBookedDateTime(bookingTime);
  }
 
  getSlotTimeRange(slotName: string): string {
    const [datePart, timePart] = slotName.split(' ');
    const [startTime, endTime] = timePart.split('-');
    return `${this.formatBookedDateTime(`${datePart} ${startTime}`, 'dd/MM/yyyy, hh:mm a')} - ${this.formatBookedDateTime(`${datePart} ${endTime}`, 'hh:mm a')}`;
  }
 
 
 
 
 
 
 
 
 
 
 
 
}
 
 
 
 