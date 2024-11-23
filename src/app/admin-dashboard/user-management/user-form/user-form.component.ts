//user-form/user-form.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dialog, DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { User } from '../user.types';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent {
  userForm!: FormGroup;
  isEdit!: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<User>,
    @Inject(DIALOG_DATA) public data: User | null
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.isEdit = !!this.data;
    this.userForm = this.fb.group({
      nom: [this.data?.nom || '', Validators.required],
      prenom: [this.data?.prenom || '', Validators.required],
      email: [this.data?.email || '', [Validators.required, Validators.email]],
      statut: [this.data?.statut || 'User', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      if (this.isEdit && this.data) {
        userData.id = this.data.id;
      }
      this.dialogRef.close(userData);
    }
  }
}