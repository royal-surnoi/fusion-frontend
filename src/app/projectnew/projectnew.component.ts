import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
 
interface ProjectData {
  id: number;
  name: string;
  description: string;
  dueDate: Date;
  maxTeamSize: number;
}
 

@Component({
  selector: 'app-projectnew',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './projectnew.component.html',
  styleUrl: './projectnew.component.css'
})
export class ProjectnewComponent  implements OnInit {

  @Input() projectData?: ProjectData;

  @Output() dataUpdate = new EventEmitter<any>();
 
  projectForm!: FormGroup;

  submitted = false;

  documentFile: File | null = null;

  documentFileName: string = '';
 
  constructor(private formBuilder: FormBuilder) {}
 
  ngOnInit() {

    this.projectForm = this.formBuilder.group({

      projectUrl: ['', [Validators.required, Validators.pattern('http://github.com/.*')]],

      description: ['', [Validators.required, Validators.minLength(100)]],

      teamMembers: this.formBuilder.array([this.createMember()])

    });

  }
 
  get teamMembers() {

    return this.projectForm.get('teamMembers') as FormArray;

  }
 
  createMember(): FormGroup {

    return this.formBuilder.group({

      name: ['', Validators.required],

      role: ['', Validators.required]

    });

  }
 
  addTeamMember() {
    if (this.teamMembers.length < (this.projectData?.maxTeamSize ?? Infinity)) {
      this.teamMembers.push(this.createMember());
    }
  }
 
  removeTeamMember(index: number) {

    this.teamMembers.removeAt(index);

  }
 
  onFileChange(event: any) {

    const file = event.target.files[0];

    if (file) {

      this.documentFile = file;

      this.documentFileName = file.name;

    }

  }
 
  removeFile() {

    this.documentFile = null;

    this.documentFileName = '';

  }
 
  onSubmit() {

    this.submitted = true;
 
    if (this.projectForm.invalid) {

      return;

    }
 
    const formData = new FormData();

    formData.append('projectUrl', this.projectForm?.get('projectUrl')?.value ?? '');
    formData.append('description', this.projectForm?.get('description')?.value ?? '');
    formData.append('teamMembers', JSON.stringify(this.projectForm?.get('teamMembers')?.value ?? []));

    if (this.documentFile) {

      formData.append('document', this.documentFile, this.documentFile.name);

    }
 
    this.dataUpdate.emit(formData);

  }
 
  get remainingTime(): string {

    const now = new Date();

    const dueDate = new Date(this.projectData!.dueDate);

    const timeDiff = dueDate.getTime() - now.getTime();

    if (timeDiff <= 0) {

      return 'Project is past due';

    }
 
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return `${days} days and ${hours} hours remaining`;

  }

}
 
