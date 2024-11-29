import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { intervalToDuration } from 'date-fns';
import { ProfiledetailsService, WorkExperience1, User } from '../profiledetails.service';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { formatLabel } from '@swimlane/ngx-charts';

export class Employee {
  id: number = 0;
  fullname!: String;
  last_name!: String;
  email!: String;
  phone!: number;
  applying_for!: String
  time_submission!: Date;

  role!: String;

  image!: string; // Adding "?" makes the property optional

  firstName!: string;
  currentStep!: number
  completedSteps!: number
  houseNo!: String;
  userName!: String;
  password!: String;
  dateOfJoin!: String;
  phoneNumber!: number;
  first_name!: String;
  Last_name!: String;
  Email!: String;
  Phone!: Number;
  Applying_for!: String
  Time_submission!: Date;
  completed!: boolean;

  middleName!: string;
  lastName!: string;
  gender!: String;
  age!: string;
  profession!: string;

  dateOfBirth!: string;
  personalEmail!: string;
  mobile!: number;
  jobStatus!: String;
  skills!: String;
  currentAddressLine!: string;
  currentCity!: string;


  currentPincode!: number;
  currentState!: string;

  permanentAddressLine!: string;
  permanentCity!: string;
  permanentPincode!: number;
  permanentState!: string;


  workEmail: any;
  location: any;
  jobTitle: any;
  name: any;
  batchNo!: String;

  country!: String;
  pincode!: String;
  yourNameOnCertificate!: String;
  linkedInProfileUrl!: String;
  companyName?: string;
  designation?: string;
  yearsOfExperience?: string;
  companyAddress?: string;
  Fullname!: String;
  // id!:number;
  //   firstName!:string;
  //   lastName:string;
  message!: String;
  category!: String;
  dateTime!: String;
  course!: String;
  city!: string;
  pinCode!: string;
  state!: string;
  yearOfCompletion!: String;
  university!: string;
  branch!: string;
  cgpa!: String;
  userDescription!: string;
  userLanguage!: string;
  interests!: string;

}
// interface WorkExperience {
//   id?: number;
//   workCompanyName: string;
//   workStartDate: string;
//   workEndDate: string;
//   workDescription: string;
//   workRole: string;
//   currentlyWorking: boolean;
// }

@Component({
  selector: 'app-personal-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './personal-details.component.html',
  styleUrl: './personal-details.component.css'
})
export class PersonalDetailsComponent implements OnInit {
  currentTab: string = 'Personal-info';
  personalInfoForm: FormGroup;
  isEditingPersonalInfo: boolean = false;

  changePasswordForm: FormGroup;
  employee: Employee = new Employee();

  // ============ profile pic ====================


  user: any = {};
  isEditingUser: boolean = false;

  fileSelected: boolean = false;
  selectedFileName: string = '';
  profileImageUrl?: SafeUrl | string;
  profileImageFile: File | null = null;
  profileImageError: string | boolean = false;
  image?: any; // Adding "?" makes the property optional
  originalImage: any; // Store the original image URL
  employees?: User;

  personalInfoFormSubmitted: boolean = false;

  studid: any;
  batch: any;
  course: any;
  firstName: any;
  lastName: any;
  phoneNumber: any;


  error: any;
  resumeFile: File | null = null;
  // employee = { id: null }; // Initialize as per your data structure
  selectedResumeFileName: string = '';
  resumeFileSelected: boolean = false;
  s3Url!: String;
  id: number = 0; // Initialize with a default value

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  passwordsMatch = true;

  private candidateSubject = new BehaviorSubject<any>(null);
  public candidate$ = this.candidateSubject.asObservable();
  cadidateDetails: any;

  // ==================== education ======================

  currentTab1: string = 'Education';
  educations: FormGroup[] = [];
  educationOptions: string[] = ['SSC', 'Intermediate/Diploma', 'Graduation', 'Post Graduation'];
  personalDetailsId: number = 0;
  educationId: number | null = null;
  isSubmitted: boolean = false;
  isEditing: boolean = false;
  hasExistingData: boolean = false;
  currentUserId: number = Number(this.authService.getId());
  intermediateCardTitle: string = 'Intermediate';
  visibleForms: number = 1;

  // ======================== experience ========================

  currentTab2: string = 'Experience';
  // experiences: WorkExperience[] = [];
  // experienceForm: FormGroup;
  isEditing1: boolean = false;
  experience: WorkExperience1[] = [];
  visibleCardCount = 1;




  constructor(private formBuilder: FormBuilder, private profiledetailsservice: ProfiledetailsService, private router: Router, private http: HttpClient, private authService: AuthService, private sanitizer: DomSanitizer) {
    this.personalInfoForm = this.formBuilder.group({
      // firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32),nameValidator]],
      // lastName: ['', [Validators.required,Validators.maxLength(32),nameValidator]],
      yourNameOnCertificate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      country: ['India', Validators.required],
      // phoneNumber: ['', [Validators.required, Validators.minLength(10)]],

      phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],

      city: [''],
      // state: ['', Validators.required],

      state: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]],

      pinCode: ['', Validators.required],
      linkedInProfileUrl: [''],
      dateOfBirth: ['', Validators.required],
      age: [{ value: '', disabled: true }],
      resume: [null]
    });



    this.changePasswordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordsMatchValidator });

    // ====================== education ==================
    this.addCard();
    // ======================== experience =====================

  }
  passwordsMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { 'passwordsMismatch': true };
    }
    return null;
  }

  populateForms() {
    this.personalInfoForm.patchValue({
      // firstName: this.employee.firstName,
      // lastName: this.employee.lastName,
      // yourNameOnCertificate: this.employee.yourNameOnCertificate,
      email: this.employee.email,
      country: this.employee.country,
      phoneNumber: this.employee.phoneNumber,
      city: this.employee.city,
      state: this.employee.state,
      pinCode: this.employee.pinCode,
      // linkedInProfileUrl: this.employee.linkedInProfileUrl,
      dateOfBirth: this.employee.dateOfBirth,
      age: this.employee.age,
      gender: this.employee.gender,
      userDescription: this.employee.userDescription,
      userLanguage: this.employee.userLanguage,
      skills: this.employee.skills,
      profession: this.employee.skills,
      interests: this.employee.interests

    });


  }

  // =============== profile pic =================


  onProfileImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;
    if (file) {
      this.profileImageFile = file;
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(e.target?.result as string);
        this.showImagePreview();
      };
      reader.readAsDataURL(file);
      this.profileImageError = false;
    } else {
      this.profileImageError = 'No file selected';
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('profile-image-input') as HTMLInputElement;
    fileInput.click();
  }

  showImagePreview(): void {
    if (confirm("Do you want to upload this image?")) {
      if (this.profileImageFile) {
        this.uploadOrUpdateProfileImage(this.profileImageFile);
      } else {
        console.error('No file selected');
      }
    } else {
      this.revertImage();
    }
  }
  revertImage(): void {
    this.profileImageUrl = this.originalImage;
    this.profileImageFile = null;
  }
  uploadOrUpdateProfileImage(file: File): void {
    if (this.originalImage) {
      this.updateUserProfileImage(file);
    } else {
      this.uploadUserProfileImage(file);
    }
  }

  uploadUserProfileImage(file: File): void {
    this.profiledetailsservice.uploadUserImage(this.currentUserId, file).subscribe(
      response => {
        console.log('Profile picture uploaded successfully', response);
        this.updateProfileImage(response);
      },
      error => {
        console.error('Error uploading profile picture', error);
        this.profileImageError = 'Failed to upload image';
      }
    );
  }



  updateUserProfileImage(file: File): void {
    const formData = new FormData();
    formData.append('imageFile', file);
    this.profiledetailsservice.updateUserProfileImage(this.currentUserId, formData).subscribe(
      response => {
        console.log('Profile picture updated successfully', response);
        this.updateProfileImage(response.profileImageUrl);
      },
      error => {
        console.error('Error updating profile picture', error);
        this.profileImageError = 'Failed to update image';
      }
    );
  }
  updateProfileImage(imageUrl: string): void {
    this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    this.originalImage = this.profileImageUrl;
    localStorage.setItem('profileImageUrl', imageUrl);
  }

  loadUserProfileImage(): void {
    this.profiledetailsservice.getUserDetails(this.currentUserId).subscribe(
      (user: User) => {
        this.employees = user;
        if (user.userImage) {
          this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(user.userImage);
          this.originalImage = this.profileImageUrl;
        }
      },
      error => {
        console.error('Error fetching user details', error);
      }
    );
  }
  fetchProfileDetails(): void {
    const userId = localStorage.getItem('id');
    if (userId) {
      this.profiledetailsservice.getUserDetails(this.currentUserId).subscribe({
        next: (data) => {
          this.user = data;

          if (data.userImage) {
            const sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${data.userImage}`);
            this.image = sanitizedUrl;
          }
        },
        error: (error) => {
          console.error('Error fetching profile details:', error);
        }
      });
    } else {
      console.error('User ID not found in local storage');
    }
  }


  uploadProfilePicture(): void {
    this.triggerFileInput();
  }


  // ================================================================================
  ngOnInit() {
    const userId = localStorage.getItem('id');
    console.log('Retrieved userId:', userId); // Debug line
    if (userId) {
      this.savePersonalInfo(userId);
    } else {
      console.error('User ID not found in localStorage.');
      // Optionally redirect to login or show an error message
      // this.router.navigate(['/login']); // If using Angular Router
    }

    // this.savePersonalInfo();

    this.personalInfoForm = this.formBuilder.group({
      // firstName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(32), this.nameValidator]],
      // lastName: ['', [Validators.required, Validators.maxLength(32), this.nameValidator]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      permanentCountry: ['', Validators.required],
      permanentState: ['', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]],
      permanentCity: ['', Validators.required],
      permanentAddress: ['', Validators.required],
      permanentZipcode: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      age: [{ value: '', disabled: true }],
      gender: ['', Validators.required],
      profession: ['', Validators.required],
      skills: ['', Validators.required],
      userLanguage: ['', Validators.required],
      userDescription: ['', Validators.required],
      interests: ['', Validators.required]

    });

    this.personalInfoForm.get('dateOfBirth')?.valueChanges.subscribe(() => {
      this.calculateAge();
    });

    this.fetchCandidateDetails();
    this.getEmployeeById(this.id)
    this.getcandidateDetailsByID();

    // ============================= education ========================

    // this.addEducationForm();
    this.getPersonalDetails();
    this.getEducationDetails();
    this.initializeEducationForms();

    // =============================== profile pic =========================
    // this.loadUserProfileImage();
    this.fetchProfileDetails();

    this.getPersonalDetailsId();

    // -------------- experience ------------------
    this.fetchAllExperienceDetails();


  }

  savePersonalInfo22() { }
  fetchCandidateDetails(): void {
    this.studid = window.localStorage.getItem('id');
    if (this.studid) {
      this.profiledetailsservice.getbyid(this.studid).subscribe(
        (data: any) => {
          console.log('Candidate details fetched successfully:', data);
          this.firstName = data.firstName;
          this.lastName = data.lastName;
          this.id = data.id; // Set the id dynamically here
          this.phoneNumber = data.phoneNumber;
          this.image = this.createImageSrc(data.image);

          // Update the BehaviorSubject
          this.candidateSubject.next({
            firstName: this.firstName,
            lastName: this.lastName,
            id: this.id,
            phoneNumber: this.phoneNumber,
            image: this.image,
          });

          // Once you have the id, you can fetch other details if needed
          this.getEmployeeById(this.id);
        },
        (error: any) => {
          console.error('Failed to fetch candidate details:', error);
        }
      );
    } else {
      console.error('No Candidate ID found. Cannot fetch candidate details.');
    }
  }
  getcandidateDetailsByID() {
    this.studid = window.localStorage.getItem('id');
    this.http.get(`${environment.apiBaseUrl}/user/find/${this.studid}`).subscribe((res) => {
      this.cadidateDetails = res;
      console.log(this.cadidateDetails.email, "email")
    })
  }
  private createImageSrc(imageData: string): string {
    return 'data:image/png;base64,' + imageData;
  }
  nameValidator(control: FormControl): { [key: string]: boolean } | null {
    // Example validation logic for names
    if (control.value && /[^a-zA-Z\s]/.test(control.value)) {
      return { 'nameValidator': true };
    }
    return null;
  }

  calculateAge() {
    const dobValue = this.personalInfoForm.get('dateOfBirth')?.value;
    if (dobValue) {
      const today = new Date();
      const birthDate = new Date(dobValue);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      this.personalInfoForm.get('age')?.setValue(age);
    }
  }


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      this.fileSelected = true;
      this.personalInfoForm.patchValue({ resume: file });
    } else {
      this.clearFile();
    }
  }

  clearFile() {
    this.fileSelected = false;
    this.selectedFileName = '';
    this.personalInfoForm.patchValue({ resume: null });
  }
  changeProfileImage(): void {
    this.uploadProfilePicture();
  }


  onResumeSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.resumeFile = input.files[0];
      this.selectedResumeFileName = this.resumeFile.name;
      this.resumeFileSelected = true;
    }
  }

  clearResumeFile(): void {
    this.resumeFile = null;
    this.selectedResumeFileName = '';
    this.resumeFileSelected = false;
  }

  // Method to handle form submission
  savePersonalInfo(userId: string): void {
    if (this.personalInfoForm.valid) {
      this.profiledetailsservice.savePersonalInfo(userId, this.personalInfoForm.value).subscribe(
        response => {
          console.log('Personal details saved successfully:', response);
        },
        error => {
          console.error('Error saving personal details:', error);
        }
      );
    } else {
      this.personalInfoForm.markAllAsTouched();
    }
  }

  buildFormData(): FormData {
    const formData = new FormData();

    if (this.profileImageFile) {
      formData.append('imageFile', this.profileImageFile);
    }
    if (this.resumeFile) {
      formData.append('resumeFile', this.resumeFile);
    }

    formData.append('firstName', this.personalInfoForm.get('firstName')?.value);
    formData.append('lastName', this.personalInfoForm.get('lastName')?.value);
    formData.append('phoneNumber', this.personalInfoForm.get('phoneNumber')?.value);
    formData.append('email', this.personalInfoForm.get('email')?.value);
    formData.append('city', this.personalInfoForm.get('city')?.value);
    formData.append('pinCode', this.personalInfoForm.get('pinCode')?.value);
    formData.append('state', this.personalInfoForm.get('state')?.value);
    formData.append('dateOfBirth', this.personalInfoForm.get('dateOfBirth')?.value);
    formData.append('yourNameOnCertificate', this.personalInfoForm.get('yourNameOnCertificate')?.value);
    formData.append('linkedInProfileUrl', this.personalInfoForm.get('linkedInProfileUrl')?.value);

    return formData;
  }

  handleError(error: any): void {
    console.error('Error changing password:', error);
    if (error.error && error.error.message) {
      alert('Error changing password: ' + error.error.message);
    } else {
      alert('Current password is incorrect');
    }
  }

  getEmployeeById(id: number) {
    this.profiledetailsservice.getEmployeeById(id).subscribe(
      (employee: Employee) => {
        this.employee = employee;
        this.populateForms();
      },
      error => {
        console.error('Error fetching employee details', error);
        // Handle the error appropriately (e.g., show an error message, redirect to an error page)
      }
    );
  }
  isFieldInvalid(field: string): boolean {
    const control = this.personalInfoForm.get(field);
    return control ? !control.valid && control.touched : false;
  }

  prevTab() {
    const tabs = ['Personal-info', 'Education', 'Experience'];
    const currentIndex = tabs.indexOf(this.currentTab);
    this.currentTab = tabs[Math.max(currentIndex - 1, 0)];
  }

  nextTab() {
    if (this.currentTab === 'Personal-info' && !this.personalInfoFormSubmitted) {
      alert('Please submit the personal information first.');
    } else {
      const tabs = ['Personal-info', 'Education', 'Experience'];
      const currentIndex = tabs.indexOf(this.currentTab);
      this.currentTab = tabs[Math.min(currentIndex + 1, tabs.length - 1)];
    }
  }

  studentholder() {
    this.router.navigate(['/feed']);

  }
  // ------------- get user name and email -------------------------


  saveChanges(): void {
    if (this.currentUserId) {
      this.profiledetailsservice.updateUserName(this.currentUserId, this.user.name).subscribe({
        next: (response) => {
          this.isEditingUser = false;
          console.log("successfully saved the name")
          console.log(response); // This will log "User name updated successfully"

        },
        error: (error: HttpErrorResponse) => {
          console.error('Error updating user name:', error);
          console.error('Status:', error.status);
          console.error('Message:', error.message);
          console.error('Error:', error.error);
          // Handle the error appropriately, e.g., show an error message to the user
        }
      });
    } else {
      console.error('Current user ID is not available');
    }
  }


  cancelEditUser(): void {
    this.isEditingUser = false;
  }
  enableEditUser(): void {
    this.isEditingUser = true;
  }

  // ===================== get personl info ====================
  getPersonalDetailsId() {
    this.profiledetailsservice.getPersonalDetailsById(this.currentUserId).subscribe(
      (data) => {
        if (data) {
          this.personalDetailsId = data.id;
          this.populateForm(data);
          this.personalInfoForm.disable();
        } else {
          this.personalInfoForm.enable();
        }
      },
      (error) => {
        console.error('Error fetching personal details:', error);
        this.personalInfoForm.enable();
      }
    );
  }

  populateForm(data: any) {
    console.log('Populating form with data:', data);
    this.personalInfoForm.patchValue({
      // firstName: data.firstName,
      // lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      permanentCountry: data.permanentCountry || 'India',
      permanentState: data.permanentState,
      permanentCity: data.permanentCity,
      permanentAddress: data.permanentAddress,
      permanentZipcode: data.permanentZipcode,
      dateOfBirth: data.dateOfBirth,
      age: data.age,
      gender: data.gender,
      userDescription: data.userDescription,
      userLanguage: data.userLanguage,
      skills: data.skills,
      profession: data.profession,
      interests: data.interests
    });
  }
  enableEditingPersonalInfo() {

    this.isEditing = true;
    this.personalInfoForm.enable();

  }
  cancelEditingPersonalInfo() {

    this.isEditing = false;
    this.personalInfoForm.disable();
    this.getPersonalDetailsId();
  }
  onSubmit() {
    if (this.personalInfoForm.valid && !this.personalDetailsId) {
      this.createPersonalDetails();
    }
  }


  createPersonalDetails() {
    const personalDetails = this.personalInfoForm.value;
    this.profiledetailsservice.createPersonalDetails(this.currentUserId, personalDetails).subscribe(
      (response) => {
        console.log('Personal details created successfully:', response);
        this.personalDetailsId = response.id;
        this.personalInfoForm.disable();
        this.personalInfoForm.markAsPristine();
        this.personalInfoForm.markAsUntouched();
      },
      (error) => {
        console.error('Error creating personal details:', error);
      }
    );
  }

  updateDetails() {
    if (this.personalInfoForm.valid && this.personalDetailsId) {
      const personalDetails = this.personalInfoForm.value;
      this.profiledetailsservice.updatePersonalDetails(this.personalDetailsId, personalDetails).subscribe(
        (response) => {
          console.log('Personal details updated successfully:', response);
          this.isEditing = false;
          this.personalInfoForm.disable();
        },
        (error) => {
          console.error('Error updating personal details:', error);
        }
      );
    }
  }


  // ========================= education =====================

  addCard(): void {
    if (this.educations.length < 4) {
      // this.addEducationForm();
    }
  }

  toggleEdit(educationForm: FormGroup) {
    if (educationForm.get('isSaved')?.value) {
      educationForm.enable();
      educationForm.patchValue({ isSaved: false });
    }
  }

  getPersonalDetails() {
    console.log('Fetching personal details');
    this.profiledetailsservice.getPersonalDetailsById(this.currentUserId).subscribe(
      (response) => {
        console.log('Personal details response:', response);
        if (response && response.id) {
          this.personalDetailsId = response.id;
          console.log('Personal details ID set:', this.personalDetailsId);
          this.getEducationDetails();
          this.fetchAllExperienceDetails();
        } else {
          console.log('No personal details found, initializing empty education forms');
          this.initializeEducationForms();
        }
      },
      (error) => {
        console.error('Error fetching personal details:', error);
        this.initializeEducationForms();
      }
    );
  }

  getEducationDetails() {
    console.log('Fetching education details');
    if (this.currentUserId) {
      this.profiledetailsservice.getEducationDetails(this.currentUserId).subscribe(
        (educationDetails) => {
          console.log('Education details response:', educationDetails);
          if (educationDetails && educationDetails.length > 0 && educationDetails[0].id) {
            this.educationId = educationDetails[0].id;
            console.log('Education ID set:', this.educationId);
            this.populateEducationForms(educationDetails[0]);
            this.disableAllForms();
          } else {
            console.log('No education details found, initializing empty forms');
            this.initializeEducationForms();
          }
        },
        (error) => {
          console.error('Error fetching education details:', error);
          this.initializeEducationForms();
        }
      );
    } else {
      console.log('No personal details ID, initializing empty education forms');
      this.initializeEducationForms();
    }
  }


  initializeEducationForms() {
    console.log('Initializing empty education forms');
    this.educations = this.educationOptions.map(level => this.createEducationForm(level));
    this.educationId = null;
    this.isEditing = false;
    console.log('Education forms initialized, educationId:', this.educationId, 'isEditing:', this.isEditing);
  }

  showAddButton(index: number): boolean {
    const currentForm = this.educations[index];
    return currentForm.enabled &&
      currentForm.get('status')?.value === 'completed' &&
      index === this.visibleForms - 1 &&
      index < this.educations.length - 1;
  }


  addNextCard(index: number) {
    if (index < this.educations.length - 1) {
      this.visibleForms++;
      this.enableVisibleForms();
    }
  }
  enableVisibleForms() {
    this.educations.forEach((form, index) => {
      if (index < this.visibleForms) {
        form.enable();
      } else {
        form.disable();
      }
    });
  }

  populateEducationForms(educationDetails: any) {
    console.log('Populating education forms with:', educationDetails);
    this.educations = this.educationOptions.map(level => {
      const form = this.createEducationForm(level);
      const data = this.mapBackendToFrontend(educationDetails, level);
      form.patchValue(data);
      return form;
    });
  }


  createEducationForm(level: string): FormGroup {
    return this.formBuilder.group({
      level: [level, Validators.required],
      status: ['', Validators.required],
      institute: ['', Validators.required],
      specialization: [''],
      pursuingClass: ['', Validators.required],
      educationBoard: ['', Validators.required],
      percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      yearOfJoining: ['', Validators.required],
      intermediateDiploma: ['', Validators.required],
      yearOfPassout: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
    });
  }

  shouldShowForm(index: number): boolean {
    // if (index === 0) return true;
    // const previousForm = this.educations[index - 1];
    // return previousForm.get('status')?.value === 'completed';
    return index < this.visibleForms;
  }

  showPursuingClass(form: FormGroup): boolean {
    return form.get('level')?.value === 'SSC' && form.get('status')?.value === 'pursuing';
  }

  showExpectedPassout(form: FormGroup): boolean {
    return form.get('status')?.value === 'pursuing';
  }


  showYearOfPassout(form: FormGroup): boolean {
    return form.get('status')?.value !== 'pursuing';
  }


  onStatusChange(index: number) {
    const currentForm = this.educations[index];
    const status = currentForm.get('status')?.value;

    if (status === 'pursuing') {
      currentForm.get('pursuingClass')?.setValidators([Validators.required]);
      currentForm.get('yearOfPassout')?.clearValidators();
    } else {
      currentForm.get('pursuingClass')?.clearValidators();
      currentForm.get('yearOfPassout')?.setValidators([Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]);
    }

    currentForm.get('pursuingClass')?.updateValueAndValidity();
    currentForm.get('yearOfPassout')?.updateValueAndValidity();

    // Reset and hide next forms if status is changed to 'pursuing'
    if (status === 'pursuing' && index < this.educations.length - 1) {
      for (let i = index + 1; i < this.educations.length; i++) {
        this.educations[i].reset({
          level: this.educationOptions[i],
          status: ''
        });
      }
    }
  }

  updateAllEducations() {
    if (this.educationId) {
      const educationData = this.mapFrontendToBackend();
      this.profiledetailsservice.updateEducation(this.educationId, educationData).subscribe(
        response => {
          console.log('Education details updated successfully:', response);
          this.isEditing = false;
          this.disableAllForms();
        },
        error => {
          console.error('Error updating education details:', error);
        }
      );
    }
  }


  saveDetails(educationForm: FormGroup) {
    if (educationForm.valid) {
      const payload = this.preparePayload(educationForm);
      educationForm.patchValue({ isSaved: true });
      educationForm.disable();
    }
  }

  preparePayload(educationForm: FormGroup) {
    const payload: any = {};
    const level = educationForm.get('level')?.value;

    const fieldMappings: { [key: string]: { [key: string]: string } } = {
      'SSC': {
        status: 'schoolStatus',
        institute: 'schoolName',
        educationBoard: 'schoolEducationBoard',
        pursuingClass: 'pursuingClass',
        percentage: 'schoolPercentage',
        yearOfJoining: 'schoolYearOfJoining',
        yearOfPassout: 'schoolYearOfPassout',
        intermediateDiploma: 'intermediatedimploma'

      },
      'Intermediate': {
        status: 'intermediateStatus',
        institute: 'intermediateCollegeName',
        educationBoard: 'intermediateEducationBoard',
        specialization: 'intermediateCollegeSpecialization',
        percentage: 'intermediateCollegePercentage',
        yearOfJoining: 'intermediateYearOfJoining',
        yearOfPassout: 'intermediateYearOfPassout'
      },
      'Graduation': {
        status: 'graduationStatus',
        institute: 'graduationCollegeName',
        specialization: 'graduationCollegeSpecialization',
        percentage: 'graduationCollegePercentage',
        yearOfJoining: 'graduationYearOfJoining',
        yearOfPassout: 'graduationYearOfPassout'
      },
      'Post Graduation': {
        status: 'postGraduateStatus',
        institute: 'postGraduateCollegeName',
        specialization: 'postGraduateCollegeSpecialization',
        percentage: 'postGraduateCollegePercentage',
        yearOfJoining: 'postGraduateYearOfJoining',
        yearOfPassout: 'postGraduateYearOfPassout'
      }
    };

    if (level && fieldMappings[level]) {
      Object.keys(fieldMappings[level]).forEach(key => {
        const backendKey = fieldMappings[level][key];
        const formValue = educationForm.get(key)?.value;
        if (formValue !== undefined && formValue !== null) {
          payload[backendKey] = formValue;
        }
      });
    }

    const currentId = educationForm.get('id')?.value;
    if (currentId) {
      payload['id'] = currentId;
    }

    console.log('Prepared payload:', payload); // Debugging

    return payload;
  }

  isOptionSelected(option: string): boolean {
    return this.educationOptions.includes(option);
  }

  isDetailsFilled(educationForm: FormGroup): boolean {
    return educationForm.valid;
  }

  submitAllEducations() {
    console.log('Submitting all educations');
    const educationData = this.mapFrontendToBackend();
    console.log('Education data to submit:', educationData);
    this.profiledetailsservice.createEducation(this.currentUserId!, educationData).subscribe(
      response => {
        console.log('Education details created successfully:', response);
        this.educationId = response.id;
        this.disableAllForms();
      },
      error => {
        console.error('Error creating education details:', error);
      }
    );

  }

  enableEditing() {
    this.isEditing = true;
    this.educations.forEach(form => form.enable());
  }

  cancelEditing() {
    this.isEditing = false;
    this.getEducationDetails();
  }

  disableAllForms() {
    console.log('Disabling all forms');
    this.educations.forEach(form => form.disable());
  }
  areAllFormsValid(): boolean {
    const isValid = this.educations.every(form => form.valid);
    console.log('Are all forms valid:', isValid);
    return isValid;
  }


  mapFrontendToBackend(): any {
    const backendData: any = { id: this.educationId };
    this.educations.forEach(form => {
      const formValue = form.getRawValue();
      switch (formValue.level) {
        case 'SSC':
          backendData.schoolStatus = formValue.status;
          backendData.schoolName = formValue.institute;
          backendData.schoolPercentage = formValue.percentage;
          backendData.schoolYearOfJoining = formValue.yearOfJoining;
          backendData.schoolYearOfPassout = formValue.yearOfPassout;
          backendData.schoolEducationBoard = formValue.educationBoard;
          backendData.pursuingClass = formValue.pursuingClass;
          backendData.intermediateDiploma = formValue.intermediateDiploma;
          break;
        case 'Intermediate':
          backendData.intermediateStatus = formValue.status;
          backendData.intermediateCollegeName = formValue.institute;
          backendData.intermediateEducationBoard = formValue.educationBoard;
          backendData.intermediateCollegeSpecialization = formValue.specialization;
          backendData.intermediateCollegePercentage = formValue.percentage;
          backendData.intermediateYearOfJoining = formValue.yearOfJoining;
          backendData.intermediateYearOfPassout = formValue.yearOfPassout;
          break;
        case 'Graduation':
          backendData.graduationStatus = formValue.status;
          backendData.graduationCollegeName = formValue.institute;
          backendData.graduationCollegeSpecialization = formValue.specialization;
          backendData.graduationCollegePercentage = formValue.percentage;
          backendData.graduationYearOfJoining = formValue.yearOfJoining;
          backendData.graduationYearOfPassout = formValue.yearOfPassout;
          break;
        case 'Post Graduation':
          backendData.postGraduateStatus = formValue.status;
          backendData.postGraduateCollegeName = formValue.institute;
          backendData.postGraduateCollegeSpecialization = formValue.specialization;
          backendData.postGraduateCollegePercentage = formValue.percentage;
          backendData.postGraduateYearOfJoining = formValue.yearOfJoining;
          backendData.postGraduateYearOfPassout = formValue.yearOfPassout;
          break;
      }
    });
    return backendData;
  }

  mapBackendToFrontend(backendData: any, level: string): any {
    const frontendData: any = {};
    switch (level) {
      case 'SSC':
        frontendData.status = backendData.schoolStatus;
        frontendData.institute = backendData.schoolName;
        frontendData.percentage = backendData.schoolPercentage;
        frontendData.yearOfJoining = backendData.schoolYearOfJoining;
        frontendData.yearOfPassout = backendData.schoolYearOfPassout;
        frontendData.pursuingClass = backendData.pursuingClass;
        frontendData.educationBoard = backendData.schoolEducationBoard;
        frontendData.intermediateDiploma = backendData.intermediateDiploma;

        break;
      case 'Intermediate':
        frontendData.status = backendData.intermediateStatus;
        frontendData.institute = backendData.intermediateCollegeName;
        frontendData.specialization = backendData.intermediateCollegeSpecialization;
        frontendData.educationBoard = backendData.intermediateEducationBoard;
        frontendData.percentage = backendData.intermediateCollegePercentage;
        frontendData.yearOfJoining = backendData.intermediateYearOfJoining;
        frontendData.yearOfPassout = backendData.intermediateYearOfPassout;
        break;
      case 'Graduation':
        frontendData.status = backendData.graduationStatus;
        frontendData.institute = backendData.graduationCollegeName;
        frontendData.specialization = backendData.graduationCollegeSpecialization;
        frontendData.percentage = backendData.graduationCollegePercentage;
        frontendData.yearOfJoining = backendData.graduationYearOfJoining;
        frontendData.yearOfPassout = backendData.graduationYearOfPassout;
        break;
      case 'Post Graduation':
        frontendData.status = backendData.postGraduateStatus;
        frontendData.institute = backendData.postGraduateCollegeName;
        frontendData.specialization = backendData.postGraduateCollegeSpecialization;
        frontendData.percentage = backendData.postGraduateCollegePercentage;
        frontendData.yearOfJoining = backendData.postGraduateYearOfJoining;
        frontendData.yearOfPassout = backendData.postGraduateYearOfPassout;
        break;
    }
    return frontendData;
  }

  // =============================== experience ==============================

  initializeExperience() {
    this.addExperienceCard();
  }

  experienceStates: Map<number, { isEditing: boolean }> = new Map();

  toggleEndDate(index: number) {
    const experience = this.experience[index];
    if (experience && experience.currentlyWorking) {
      experience.workEndDate = null;
    }
    console.log('Toggled end date for experience:', experience);
  }

  addExperienceCard() {
    if (this.experience.length < 3) {
      const newExperience: WorkExperience1 = {
        id: 0,
        workCompanyName: '',
        workRole: '',
        workStartDate: '',
        workEndDate: null,
        workDescription: '',
        currentlyWorking: false
      };
      this.experience.push(newExperience);
      this.experienceStates.set(this.experience.length - 1, { isEditing: true });
      this.visibleCardCount = this.experience.length;
    }
  }
  saveDetails2(index: number) {
    const experience = this.experience[index];
    console.log('Saving experience details:', experience);
    if (this.personalDetailsId && experience) {
      if (experience.id === 0) {
        this.profiledetailsservice.createWorkExperience(this.currentUserId, experience).subscribe(
          (createdExperience) => {
            console.log('Experience saved successfully:', createdExperience);
            this.experience[index] = createdExperience;
            this.experienceStates.set(index, { isEditing: false });
          },
          (error) => {
            console.error('Error saving experience:', error);
          }
        );
      } else {
        this.profiledetailsservice.updateWorkExperience(experience.id, experience).subscribe(
          (updatedExperience) => {
            console.log('Experience updated successfully:', updatedExperience);
            this.experience[index] = updatedExperience;
            this.experienceStates.set(index, { isEditing: false });
          },
          (error) => {
            console.error('Error updating experience:', error);
          }
        );
      }
    } else {
      console.error('No personal details ID found or experience is null. Unable to save experience.');
    }
  }

  fetchAllExperienceDetails() {
    console.log('Fetching all experience details...');
    this.profiledetailsservice.getAllWorkExperiences(this.currentUserId).subscribe(
      (experiences) => {
        console.log('Received experiences:', experiences);
        experiences.forEach((exp, index) => {
          if (index < 3) {
            this.experience[index] = exp;
            this.experienceStates.set(index, { isEditing: false });
          }
        });
      },
      (error) => {
        console.error('Error fetching work experiences:', error);
      }
    );
  }


  fetchExperienceDetails(id: number, index: number) {
    this.profiledetailsservice.getWorkExperience(id, this.currentUserId).subscribe(
      (experienceDetails) => {
        this.experience[index] = experienceDetails;
        this.experienceStates.set(index, { isEditing: false });
      },
      (error) => console.error('Error fetching experience details:', error)
    );
  }

  isDetailsFilledExperience(index: number): boolean {
    const experience = this.experience[index];
    if (!experience) return false;
    const isFilled = !!(experience.workCompanyName && experience.workRole && experience.workDescription && experience.workStartDate);
    console.log('Experience details filled:', isFilled, experience);
    return isFilled;
  }

  toggleEditExperience(index: number) {
    const currentState = this.experienceStates.get(index) || { isEditing: false };
    this.experienceStates.set(index, { isEditing: !currentState.isEditing });
  }
  toggleCanceleditExperience(index: number) {
    this.experienceStates.set(index, { isEditing: false });
    console.log('Cancelled edit for experience', index);
    this.fetchExperienceDetails(this.experience[index].id, index);
  }
  isGraduationCompleted(): boolean {
    const graduationForm = this.educations.find(form => form.get('level')?.value === 'Graduation');
    return graduationForm?.get('status')?.value === 'completed';
  }

  setExperienceTab() {
    if (this.isGraduationCompleted()) {
      this.currentTab = 'Experience';
    }
  }
  isCurrentlyWorkingAvailable(index: number): boolean {
    return !this.experience.some((exp, i) => i !== index && exp.currentlyWorking);
  }
  // ============================ chnage password ===============================


  savePassword(email: string): void {
    if (this.changePasswordForm.valid) {
      const newPassword = this.changePasswordForm.get('newPassword')?.value;
      const confirmPassword = this.changePasswordForm.get('confirmPassword')?.value;

      if (newPassword === confirmPassword) {
        const currentPassword = this.changePasswordForm.get('currentPassword')?.value;

        this.http.put(
          `${environment.apiBaseUrl}/user/update-password`,
          null,
          {
            params: {
              email: email,
              currentPassword: currentPassword,
              newPassword: newPassword
            },
            responseType: 'text'
          }
        ).subscribe(
          (response: string) => {
            if (response.includes('Password updated successfully')) {
              console.log('Password changed successfully');
              alert('Password changed successfully');
            } else {
              console.error('Unexpected response:', response);
              alert('Unexpected response while changing password');
            }
          },
          (error: HttpErrorResponse) => {
            console.error('Error changing password:', error);
            if (error.error && typeof error.error === 'string') {
              if (error.error.includes('current password is not matching')) {
                alert('Your current password is incorrect.');
              } else {
                alert(error.error);
              }
            } else {
              alert('An error occurred while changing the password. Please try again.');
            }
          }
        );
      } else {
        console.error('New password and confirm password do not match');
        alert('New password and confirm password do not match');
      }
    } else {
      this.changePasswordForm.markAllAsTouched();
    }
  }

  checkPasswords(): void {
    const newPassword = this.changePasswordForm.get('newPassword')?.value;
    const confirmPassword = this.changePasswordForm.get('confirmPassword')?.value;
    this.passwordsMatch = newPassword === confirmPassword;
  }
  toggleShowCurrentPassword(): void {
    this.showCurrentPassword = !this.showCurrentPassword;
  }
  toggleShowNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }
  toggleShowConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }


}